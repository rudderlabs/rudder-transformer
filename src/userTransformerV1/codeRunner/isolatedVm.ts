import ivm from 'isolated-vm';

/**
 * Wraps a promise with a timeout. If the promise does not resolve within the specified
 * timeout, it rejects with a timeout error.
 *
 * @param p The promise to wrap.
 * @param timeoutMs The timeout in milliseconds.
 * @param onTimeout Optional callback to execute when the timeout occurs.
 * @returns The result of the promise `p`.
 */
async function withHostTimeout<T>(
  p: Promise<T>,
  timeoutMs: number,
  onTimeout?: () => void,
): Promise<T> {
  let timer: NodeJS.Timeout | undefined;

  const timeoutPromise = new Promise<never>((_, reject) => {
    timer = setTimeout(() => {
      try {
        onTimeout?.();
      } catch {
        // ignore
      }
      reject(new Error(`Execution timed out after ${timeoutMs}ms`));
    }, timeoutMs);
  });

  try {
    return await Promise.race([p, timeoutPromise]);
  } finally {
    if (timer) clearTimeout(timer);
  }
}

interface GlobalFunction {
  name: string;
  fn: (...args: any[]) => any;
  isAsync?: boolean;
}
/**
 * Engine for running JavaScript code safely using `isolated-vm`.
 * Manages the isolate, context, module caching, and function execution.
 */
export class IsolatedVMEngine {
  private isolate: ivm.Isolate;

  private context?: ivm.Context;

  private jail?: ivm.Reference;

  private modules: Map<string, ivm.Module> = new Map();

  private fnCache: Map<string, ivm.Reference> = new Map();

  constructor(private memoryLimit = 128) {
    this.isolate = new ivm.Isolate({ memoryLimit: this.memoryLimit });
  }

  /**
   * Resolves a module from the internal cache.
   *
   * @param specifier The name/specifier of the module to resolve.
   * @returns The resolved `ivm.Module`.
   * @throws Error if the module is not found.
   */
  private resolveModule(specifier: string): ivm.Module {
    const module = this.modules.get(specifier);
    if (module) {
      return module;
    }
    throw new Error(`Module '${specifier}' not found.`);
  }

  /**
   * Gets the current context, creating it if it doesn't exist.
   * Also ensures the global 'jail' is set up properly.
   *
   * @returns An object containing the context and the global reference (jail).
   */
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
   * Registers global functions into the isolate's context.
   *
   * Handles both synchronous and asynchronous functions.
   * - Async functions are bridged using a temporary host reference and a wrapper function
   *   inside the isolate to handle the promise bridging correctly.
   * - Synchronous functions are registered directly as callbacks.
   *
   * @param globalFns An array of `GlobalFunction` objects to register.
   */
  async registerGlobalFunctions(globalFns: GlobalFunction[]) {
    const { jail } = await this.getContext();

    const asyncFnNames: string[] = [];

    // 1) Register bridges
    await Promise.all(
      globalFns.map(async ({ name, fn, isAsync }) => {
        const isAsyncFn = isAsync ?? fn.constructor.name === 'AsyncFunction';

        if (isAsyncFn) {
          asyncFnNames.push(name);

          // Store a host reference temporarily on global, then bootstrap will wrap it
          await jail.set(
            `__host_${name}`,
            new ivm.Reference(async (...args: any[]) => {
              // eslint-disable-next-line no-useless-catch
              try {
                // eslint-disable-next-line @typescript-eslint/return-await
                return await (fn as (...args: any[]) => Promise<any>)(...args);
                // eslint-disable-next-line sonarjs/no-useless-catch
              } catch (err) {
                throw err;
              }
            }),
            { copy: true },
          );
        } else {
          // Use Callback for sync functions
          await jail.set(name, new ivm.Callback((...args: any[]) => fn(...args)), { copy: true });
        }
      }),
    );

    // 2) Bootstrap wrappers for async functions inside the isolate
    if (asyncFnNames.length > 0) {
      const wrappers = asyncFnNames
        .map(
          (name) => `
          {
            const hostRef = global.__host_${name};
            delete global.__host_${name};

            if (!hostRef || typeof hostRef.apply !== 'function') {
              throw new Error('Async host bridge for "${name}" not available');
            }

            global.${name} = function(...args) {
              return hostRef.apply(
                undefined,
                args,
                {
                  arguments: { copy: true },
                  result: { promise: true, copy: true }
                }
              );
            };
          }
        `,
        )
        .join('\n');

      const bootstrapCode = `
      (function () {
        ${wrappers}
      })();
    `;

      await this.runScript(bootstrapCode);
    }
  }

  /**
   * Compiles and registers a module in the isolate.
   * Invalidates any cached function references for this module.
   *
   * @param name The name of the module.
   * @param code The source code of the module.
   * @param options Options for registration.
   * @param options.allowImports Whether the module is allowed to import other modules.
   * @param options.evaluate Whether to evaluate the module immediately after instantiation.
   */
  async registerModule(
    name: string,
    code: string,
    options?: { allowImports?: boolean; evaluate?: boolean },
  ): Promise<void> {
    this.modules.get(name)?.release();
    this.modules.delete(name);

    // Invalidate function cache for this module
    for (const key of this.fnCache.keys()) {
      if (key.startsWith(`${name}:`)) {
        this.fnCache.get(key)?.release();
        this.fnCache.delete(key);
      }
    }
    const { context } = await this.getContext();
    const module = await this.isolate.compileModule(code, { filename: name });
    await module.instantiate(context, (specifier) => {
      if (!options?.allowImports) {
        throw new Error(`Module '${specifier}' not found.`);
      }
      return this.resolveModule(specifier);
    });
    try {
      if (options?.evaluate) {
        await module.evaluate({ timeout: 1000 });
      }
      this.modules.set(name, module);
    } catch (e: any) {
      module.release();
      throw new Error(`Evaluation failed for module ${name}: ${e.message}`);
    }
  }

  /**
   * Runs a specific function exported by a registered module.
   * Caches the function reference for future calls to improve performance.
   *
   * @param moduleName The name of the module containing the function.
   * @param functionName The name of the function to run.
   * @param args The arguments to pass to the function.
   * @param options Execution options.
   * @param options.timeout Execution timeout in milliseconds.
   * @param options.promise Whether to treat the result as a promise (async execution).
   * @param options.args.transferIn Whether to transfer arguments (e.g., ArrayBuffers) into the isolate instead of copying.
   * @returns The result of the function execution.
   */
  async runModuleFunction<RT, AT extends unknown[] = unknown[]>(
    moduleName: string,
    functionName: string,
    args: AT,
    options?: {
      timeout?: number;
      promise?: boolean;
      args?: {
        /* NOTE: transferIn moves (detaches) the underlying buffer instead of copying it.
        Only useful for large ArrayBuffer / TypedArray payloads where the source buffer
        is no longer needed. Never use for normal objects or event data.
        For arrays of objects, transferIn has NO effect unless the array contains
        TypedArrays / ArrayBuffers inside
        */
        transferIn?: boolean;
      };
    },
  ): Promise<RT> {
    const key = `${moduleName}:${functionName}`;
    let fnRef = this.fnCache.get(key);

    if (!fnRef) {
      const module = this.resolveModule(moduleName);
      fnRef = await module.namespace.get(functionName, { reference: true });

      if (fnRef.typeof !== 'function') {
        fnRef.release();
        throw new Error(`Export '${functionName}' in module '${moduleName}' is not a function`);
      }
      this.fnCache.set(key, fnRef);
    }

    const isAsync = options?.promise || fnRef.typeof === 'AsyncFunction' || false;

    const fnArgs = options?.args?.transferIn
      ? args.map((arg) =>
          new ivm.ExternalCopy(arg).copyInto({ transferIn: options?.args?.transferIn || false }),
        )
      : args;

    const applyPromise = fnRef.apply(undefined, fnArgs, {
      timeout: options?.timeout ?? 4000,
      arguments: { copy: !options?.args?.transferIn || undefined },
      result: { copy: true, promise: isAsync },
    }) as Promise<RT>;
    if (isAsync) {
      return withHostTimeout(applyPromise, options?.timeout ?? 60000);
    }
    return applyPromise;
  }

  /**
   * Compiles and runs a script in the isolate's context.
   *
   * @param code The script code to run.
   * @param options.timeout Timeout in milliseconds.
   * @returns The result of the script execution.
   */
  async runScript(code: string, options?: { timeout?: number }): Promise<unknown> {
    const { context } = await this.getContext();
    const script = await this.isolate.compileScript(code);
    return script.run(context, { release: true, timeout: options?.timeout ?? 4000 });
  }

  /**
   * Lists the names of all exports from a registered module.
   *
   * @param name The name of the module.
   * @returns An array of exported names.
   */
  async listExportsFromModule(name: string): Promise<string[]> {
    const { context } = await this.getContext();
    const module = this.resolveModule(name);
    // Return export names as plain strings (transferable)
    const names = await context.evalClosure(
      'return Object.getOwnPropertyNames($0.deref());',
      [module.namespace],

      {
        result: { copy: true },
      },
    );
    return names;
  }

  /**
   * Disposes the isolate, freeing up all associated resources.
   * Safe to call multiple times.
   */
  async dispose() {
    // Destroys isolate instance and invalidates all references obtained from it.
    this.isolate?.dispose();
  }

  /**
   * Gets heap statistics for the isolate.
   *
   * @returns Heap statistics object.
   */
  getHeapStatistics(): Promise<ivm.HeapStatistics> {
    return this.isolate.getHeapStatistics();
  }

  /**
   * Resets the context by releasing all modules, function caches,
   * the global jail, and the context itself.
   * The isolate instance remains active.
   */
  resetContext() {
    this.modules.forEach((module) => {
      try {
        module.release();
      } catch {
        // ignore
      }
    });
    this.modules.clear();

    this.fnCache.forEach((ref) => {
      try {
        ref.release();
      } catch {
        // ignore
      }
    });
    this.fnCache.clear();

    if (this.jail) {
      try {
        this.jail.release();
      } catch {
        // ignore
      }
      this.jail = undefined;
    }

    if (this.context) {
      try {
        this.context.release();
      } catch {
        // ignore
      }
      this.context = undefined;
    }
  }
}
