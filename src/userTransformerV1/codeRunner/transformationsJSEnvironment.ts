/* eslint-disable max-classes-per-file */
import fetch from 'node-fetch';
import { IsolatedVMEngine } from './isolatedVm';
import { fetchWithDnsWrapper, extractStackTraceUptoLastSubstringMatch } from '../../util/utils';
import logger from '../../logger';
import stats from '../../util/stats';

interface Credential {
  key: string;
  value: string;
  isSecret: boolean;
}

interface Dependency {
  importName: string;
  code: string;
}

interface TransformationCodeRunnerOptions {
  code: string;
  credentials?: Credential[];
  dependencies?: Dependency[];
  testMode?: boolean;
}

class ExecutionContext {
  logs: string[] = [];

  private async registerContextFunctions() {
    if (this.options.testMode) {
      await this.engine.registerGlobalFunctions([
        {
          name: 'log',
          fn: (...args: any[]) => {
            let logString = 'Log:';
            args.forEach((arg) => {
              logString = logString.concat(
                ` ${typeof arg === 'object' ? JSON.stringify(arg) : arg}`,
              );
            });
            this.logs.push(logString);
          },
        },
      ]);
    }
  }

  constructor(
    readonly engine: IsolatedVMEngine,
    readonly options: { testMode?: boolean },
  ) {}

  async run<RT>(fnName: string, args: any[], options?: { timeout?: number; promise?: boolean }) {
    await this.registerContextFunctions();
    const result = await this.engine.runModuleFunction<RT>('main', fnName, args, options);
    return { result, logs: this.logs };
  }
}

export class TransformationsJSEnvironment {
  private engine: IsolatedVMEngine;

  private initialized: boolean = false;

  private credentialsMap!: Map<string, any>;

  private dependencies!: Dependency[];

  private testMode?: boolean;

  private mainCode: string;

  constructor(
    options: TransformationCodeRunnerOptions,
    readonly metadata: Record<string, any> = {},
  ) {
    this.engine = new IsolatedVMEngine();
    this.setCredentialsMap(options.credentials || []);
    this.setDependencies(options.dependencies || []);
    this.testMode = options.testMode;
    this.mainCode = options.code;
  }

  setCredentialsMap(credentials: Credential[]) {
    this.credentialsMap = new Map(credentials?.map((cred) => [cred.key, cred.value]) || []);
  }

  setDependencies(dependencies: Dependency[]) {
    this.dependencies = dependencies || [];
  }

  private async registerGlobalFunctions() {
    const trTags = { identifier: 'V1', ...this.metadata };
    await this.engine.registerGlobalFunctions([
      {
        name: 'fetch',
        fn: async (...args: any[]) => {
          const fetchStartTime = new Date();
          const fetchTags = { ...trTags } as Record<string, any>;
          try {
            const res = await fetchWithDnsWrapper(trTags, ...args);
            const data = await res.json();
            fetchTags.isSuccess = 'true';
            return data;
          } catch (error) {
            logger.debug('Error fetching data', error);
            fetchTags.isSuccess = 'false';
            return 'ERROR';
          } finally {
            stats.timing('fetch_call_duration', fetchStartTime, fetchTags);
          }
        },
        isAsync: true,
      },
      {
        name: 'fetchV2',
        fn: async (...args: any[]) => {
          const fetchStartTime = new Date();
          const fetchTags = { ...trTags } as Record<string, any>;
          try {
            const res = await fetchWithDnsWrapper(fetchTags, ...args);
            const headersContent: Record<string, string> = {};
            res.headers.forEach((value: string, header: string) => {
              headersContent[header] = value;
            });

            let body = await res.text();
            try {
              body = JSON.parse(body);
            } catch (e) {
              /* fail silently */
            }

            const data = {
              url: res.url,
              status: res.status,
              headers: headersContent,
              body,
            };
            fetchTags.isSuccess = 'true';
            return data;
          } catch (error) {
            const err = JSON.parse(JSON.stringify(error, Object.getOwnPropertyNames(error)));
            logger.debug('Error fetching data in fetchV2', err);
            fetchTags.isSuccess = 'false';
            throw err;
          } finally {
            stats.timing('fetchV2_call_duration', fetchStartTime, fetchTags);
          }
        },
        isAsync: true,
      },
      {
        name: 'geolocation',
        fn: async (...args: any[]) => {
          const geoStartTime = new Date();
          const geoTags = { ...trTags } as Record<string, any>;
          try {
            if (args.length === 0) {
              throw new Error('ip address is required');
            }
            if (!process.env.GEOLOCATION_URL)
              throw new Error('geolocation is not available right now');
            const res = await fetch(`${process.env.GEOLOCATION_URL}/geoip/${args[0]}`, {
              timeout: parseInt(process.env.GEOLOCATION_TIMEOUT_IN_MS || '1000', 10),
            } as any);
            if (res.status !== 200) {
              throw new Error(
                `request to fetch geolocation failed with status code: ${res.status}`,
              );
            }
            const geoData = await res.json();
            geoTags.isSuccess = 'true';
            return geoData;
          } catch (error) {
            const err = JSON.parse(JSON.stringify(error, Object.getOwnPropertyNames(error)));
            geoTags.isSuccess = 'false';
            throw err;
          } finally {
            stats.timing('geo_call_duration', geoStartTime, geoTags);
          }
        },
        isAsync: true,
      },
      {
        name: 'extractStackTrace',
        fn(trace: string, stringLiterals: string[]) {
          return extractStackTraceUptoLastSubstringMatch(trace, stringLiterals);
        },
      },
      {
        name: 'getCredential',
        fn: (key: string) => {
          if (key === null || key === undefined) {
            throw new TypeError('Key should be valid and defined');
          }
          return this.credentialsMap.get(key);
        },
      },
      {
        name: 'log',
        fn: () => {},
      },
    ]);
  }

  private async registerDependencies() {
    const dependencies = this?.dependencies;
    if (dependencies?.length) {
      await Promise.all(
        dependencies.map((dependency) =>
          this.engine.registerModule(dependency.importName, dependency.code),
        ),
      );
    }
  }

  private async initializeEnvironment() {
    try {
      if (this.initialized) {
        return;
      }
      await this.registerGlobalFunctions();
      await this.registerDependencies();
      await this.engine.registerModule('main', this.mainCode, {
        allowImports: true,
        evaluate: true,
      });
      this.initialized = true;
    } catch (e) {
      this.engine.resetContext();
      throw e;
    }
  }

  private createExecutionContext() {
    return new ExecutionContext(this.engine, { testMode: this.testMode });
  }

  async run<RT, ARG extends unknown[] = unknown[]>(
    fnName: string,
    args: ARG,
    options?: { timeout?: number; promise?: boolean; args?: { transferIn?: boolean } },
  ): Promise<{ result: RT; logs: string[] }> {
    if (!this.initialized) {
      await this.initializeEnvironment();
    }

    if (this.testMode) {
      const executionContext = this.createExecutionContext();
      const result = await executionContext.run<RT>(fnName, args, options);
      return result;
    }

    const result = await this.engine.runModuleFunction<RT>('main', fnName, args, options);
    return { result, logs: [] };
  }

  async listExportedFunctions(): Promise<string[]> {
    await this.initializeEnvironment();
    return this.engine.listExportsFromModule('main');
  }

  async dispose() {
    await this.engine.dispose();
  }

  /*
   * Reset the environment by clearing the context and re-registering
   * credentials and dependencies if provided
   */
  resetEnvironment(input?: { credentials?: Credential[]; dependencies?: Dependency[] }) {
    this.initialized = false;
    this.engine.resetContext();
    if (input?.credentials) {
      this.setCredentialsMap(input.credentials);
    }
    if (input?.dependencies) {
      this.setDependencies(input.dependencies);
    }
  }
}
