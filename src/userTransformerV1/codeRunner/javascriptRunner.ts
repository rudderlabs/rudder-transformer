/* eslint-disable max-classes-per-file */
import fetch from 'node-fetch';
import { isNil, isObject } from 'lodash';
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

  constructor(
    readonly engine: IsolatedVMEngine,
    readonly options: { testMode?: boolean },
  ) {
    if (options.testMode) {
      this.engine.registerGlobalFunctions([
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

  async run(fnName: string, args: any[], options?: { timeout?: number; promise?: boolean }) {
    const result = await this.engine.runModuleFunction('main', fnName, args, options);
    return { result, logs: this.logs };
  }
}

export class JavascriptRunner {
  engine: IsolatedVMEngine;

  constructor(
    readonly options: TransformationCodeRunnerOptions,
    readonly metadata: Record<string, any> = {},
  ) {
    this.engine = new IsolatedVMEngine();
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
              /* empty */
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
          if (isNil(this.options.credentials) || !isObject(this.options.credentials)) {
            logger.error(
              `Error fetching credentials map for transformationID: ${this.metadata.transformationId} and workspaceId: ${this.metadata.workspaceId}`,
            );
            stats.increment('credential_error_total', trTags);
            return undefined;
          }
          if (key === null || key === undefined) {
            throw new TypeError('Key should be valid and defined');
          }
          return this.options.credentials[key];
        },
      },
      {
        name: 'log',
        fn: () => {},
      },
    ]);
  }

  private async registerDependencies() {
    const dependencies = this.options?.dependencies;
    if (dependencies?.length) {
      await Promise.all(
        dependencies.map((dependency) =>
          this.engine.registerModule(dependency.importName, dependency.code),
        ),
      );
    }
  }

  async init() {
    await this.registerGlobalFunctions();
    await this.registerDependencies();
    await this.engine.registerModule('main', this.options.code, {
      allowImports: true,
    });
  }

  async dispose() {
    await this.engine.dispose();
  }

  private createExecutionContext() {
    return new ExecutionContext(this.engine, { testMode: this.options.testMode });
  }

  async run(fnName: string, args: any[], options?: { timeout?: number; promise?: boolean }) {
    const ctx = this.createExecutionContext();
    const result = await ctx.run(fnName, args, options);
    return result;
  }
}
