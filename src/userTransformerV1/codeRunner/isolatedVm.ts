import ivm from 'isolated-vm';

interface GlobalFunction {
  name: string;
  fn: (...args: any[]) => any;
  isAsync?: boolean;
}
export class IsolatedVMEngine {
  language = 'javascript';

  private isolate!: ivm.Isolate;

  private context!: ivm.Context;

  private jail!: ivm.Reference<Record<string, any>>;

  private modules: Map<string, ivm.Module> = new Map();

  constructor(private memoryLimit = 128) {
    this.isolate = new ivm.Isolate({ memoryLimit: this.memoryLimit });
  }

  private async resolveModule(specifier: string): Promise<ivm.Module> {
    const module = this.modules.get(specifier);
    if (module) {
      return module;
    }
    throw new Error(`Module '${specifier}' not found.`);
  }

  private async getContext() {
    if (!this.context) {
      this.context = await this.isolate.createContext();
    }
    if (!this.jail) {
      this.jail = this.context.global;
      await this.jail.set('global', this.jail.derefInto());
    }
    return { context: this.context, jail: this.jail };
  }

  /**
   * Register global functions.
   * If the function is an AsyncFunction, it will be bridged asynchronously.
   * Otherwise, it will be registered as a synchronous blocking function.
   */
  async registerGlobalFunctions(globalFns: GlobalFunction[]) {
    const asyncFunctions: string[] = [];
    const { jail } = await this.getContext();
    for (const { name, fn, isAsync } of globalFns) {
      const isAsyncFn = isAsync ?? fn.constructor.name === 'AsyncFunction';
      if (isAsyncFn) {
        asyncFunctions.push(name);
        // For async functions, we wrap them in a Reference and expose as `_name`
        // so the bootstrap script can bridge them.

        // NOTE: We use a manual callback-based bridge. See previous comments.
        // eslint-disable-next-line @typescript-eslint/no-unused-vars, no-await-in-loop
        await jail.set(
          `_${name}`,
          new ivm.Reference((resolve: any, reject: any, ...args: any[]) => {
            // Fire-and-forget async wrapper. We return undefined to IVM immediately.
            (async () => {
              try {
                const result = await fn(...args);
                resolve.applyIgnored(undefined, [new ivm.ExternalCopy(result).copyInto()]);
              } catch (error: any) {
                const errorInfo =
                  error instanceof Error ? error.stack || error.message : String(error);
                reject.applyIgnored(undefined, [new ivm.ExternalCopy(errorInfo).copyInto()]);
              }
            })();
            return undefined;
          }),
        );
      } else {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars, no-await-in-loop
        await jail.set(`${name}`, fn);
      }
    }
    // Expose temporarily the ivm object to the jail so the bootstrap script can access it
    // 3. Generate bootstrap script
    if (asyncFunctions.length > 0) {
      await jail.set('_ivm', ivm);
      const asyncSetups = asyncFunctions
        .map(
          (name) => `
          const ${name} = _${name};
          delete _${name};
          global.${name} = createAsyncBridge(${name});
        `,
        )
        .join('\n');
      const bootstrapCode = `
      (function() {
        const ivm = _ivm;
        delete _ivm;

        function createAsyncBridge(hostRef) {
          return function(...args) {
            return new Promise((resolve, reject) => {
              // Copy arguments to host
              const bridgeArgs = [
                new ivm.Reference(resolve),
                new ivm.Reference(reject),
                ...args.map(arg => new ivm.ExternalCopy(arg).copyInto())
              ];
              hostRef.applyIgnored(undefined, bridgeArgs);
            });
          };
        }
        ${asyncSetups}
      })();
      
    `;
      await this.runScript(bootstrapCode);
    }
  }

  async registerModule(
    name: string,
    code: string,
    options?: { allowImports?: boolean },
  ): Promise<void> {
    this.modules.get(name)?.release();
    const { context } = await this.getContext();
    const module = await this.isolate.compileModule(code, { filename: name });
    await module.instantiate(context, (specifier) => {
      try {
        if (!options?.allowImports) {
          throw new Error(`Module '${specifier}' not found.`);
        }
        return this.resolveModule(specifier);
      } catch (e) {
        this.context.release();
        throw e;
      }
    });
    try {
      await module.evaluate({ release: true });
      this.modules.set(name, module);
    } catch (e: any) {
      throw new Error(`Evaluation failed for module ${name}: ${e.message}`);
    }
  }

  async runModuleFunction(
    moduleName: string,
    functionName: string,
    args: any[],
    options?: { timeout?: number; promise?: boolean },
  ): Promise<any> {
    const module = await this.resolveModule(moduleName);
    module.evaluate({ release: true });
    const fnRef = await module.namespace.get(functionName, { reference: true });

    if (fnRef.typeof !== 'function') {
      throw new Error(`Export '${functionName}' in module '${moduleName}' is not a function`);
    }

    return fnRef.apply(
      undefined,
      args.map((arg) => new ivm.ExternalCopy(arg).copyInto({ transferIn: true })),
      {
        timeout: options?.timeout ?? 4000,
        result: { copy: true, promise: options?.promise ?? false },
      },
    );
  }

  async runScript(code: string): Promise<any> {
    const { context } = await this.getContext();
    const script = await this.isolate.compileScript(code);
    return script.run(context, { release: true });
  }

  async listExportsFromModule(name: string): Promise<string[]> {
    const { context } = await this.getContext();
    const module = await this.resolveModule(name);
    // Return export names as plain strings (transferable)
    const names = await context.evalClosure(
      'return Object.getOwnPropertyNames($0);',
      [module.namespace.derefInto()],
      {
        result: { copy: true },
      },
    );
    return names;
  }

  async dispose() {
    // Destroys isolate instance and invalidates all references obtained from it.
    this.isolate?.dispose();
  }
}
