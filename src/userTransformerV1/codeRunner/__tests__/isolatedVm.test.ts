import { IsolatedVMEngine } from '../isolatedVm';

describe('IsolatedVMEngine', () => {
  let engine: IsolatedVMEngine;

  beforeEach(() => {
    engine = new IsolatedVMEngine();
  });

  afterEach(async () => {
    await engine.dispose();
  });

  describe('Global Functions', () => {
    it('should register and call a synchronous global function', async () => {
      const mockFn = jest.fn((msg: string) => `Hello ${msg}`);
      await engine.registerGlobalFunctions([{ name: 'greet', fn: mockFn }]);

      const result = await engine.runScript('greet("World")');
      expect(result).toBe('Hello World');
      expect(mockFn).toHaveBeenCalledWith('World');
    });

    it('should register and call an asynchronous global function', async () => {
      const mockAsyncFn = jest.fn(async (x: number) => {
        return new Promise((resolve) => setTimeout(() => resolve(x * 2), 10));
      });

      await engine.registerGlobalFunctions([{ name: 'double', fn: mockAsyncFn, isAsync: true }]);

      const code = `
        export async function run(val) {
          return await double(val);
        }
      `;
      await engine.registerModule('asyncTest', code, { evaluate: true });
      const result = await engine.runModuleFunction('asyncTest', 'run', [21], { promise: true });

      expect(result).toBe(42);
      expect(mockAsyncFn).toHaveBeenCalledWith(21);
    });

    it('should handle errors in async global functions', async () => {
      const errorFn = () => Promise.reject(new Error('Async Boom'));
      await engine.registerGlobalFunctions([{ name: 'boom', fn: errorFn, isAsync: true }]);

      const code = `
        export async function run() {
          await boom();
        }
      `;
      await engine.registerModule('boomTest', code, { evaluate: true });
      // Expect the rejection reason to contain the error message
      await expect(
        engine.runModuleFunction('boomTest', 'run', [], { promise: true }),
      ).rejects.toThrow(/Async Boom/);
    });
  });

  describe('Modules', () => {
    it('should register and run a module function', async () => {
      const code = `
        export function add(a, b) { return a+b }
      `;
      await engine.registerModule('math', code, { evaluate: true });
      const result = await engine.runModuleFunction('math', 'add', [5, 3]);
      expect(result).toBe(8);
    });

    it('should handle module throwing error', async () => {
      const code = `
        export function fail() { throw new Error("Module Error"); }
      `;
      await engine.registerModule('faulty', code, { evaluate: true });
      await expect(engine.runModuleFunction('faulty', 'fail', [])).rejects.toThrow('Module Error');
    });

    it('should list exports from a module', async () => {
      const code = `
        export function one() {}
        export const two = 2;
      `;
      await engine.registerModule('exportsTest', code, { evaluate: true });
      const exports = await engine.listExportsFromModule('exportsTest');
      expect(exports.sort()).toEqual(['one', 'two'].sort());
    });
  });

  describe('Dependencies and State', () => {
    it('should reset context and clear modules', async () => {
      const code = `export function test() { return 1; }`;
      await engine.registerModule('temp', code, { evaluate: true });

      expect(await engine.runModuleFunction('temp', 'test', [])).toBe(1);

      engine.resetContext();

      // After reset, calling the old module should fail or need re-registration
      // `registerModule` would throw if we try to access a module handled by the old context/isolate state
      // specifically `runModuleFunction` tries `resolveModule` which checks the Map.
      // `resetContext` clears the map.ivm
      await expect(engine.runModuleFunction('temp', 'test', [])).rejects.toThrow(
        "Module 'temp' not found",
      );
    });
  });

  describe('Timeout Handling', () => {
    it('should throw timeout error when execution exceeds limit', async () => {
      const code = `
        export function infiniteLoop() {
           while(true) {}
        }
      `;
      await engine.registerModule('timeoutTest', code, { evaluate: true });
      // Use short timeout to verify exception
      await expect(
        engine.runModuleFunction('timeoutTest', 'infiniteLoop', [], { timeout: 100 }),
      ).rejects.toThrow(/timed out/i);
    });

    it('should throw timeout error for async functions exceeding limit', async () => {
      const slowFn = () => new Promise((resolve) => setTimeout(resolve, 200));

      await engine.registerGlobalFunctions([{ name: 'slow', fn: slowFn, isAsync: true }]);

      const code = `
        export async function runSlow() {
          await slow();
        }
      `;
      await engine.registerModule('asyncTimeoutTest', code, { evaluate: true });

      await expect(
        engine.runModuleFunction('asyncTimeoutTest', 'runSlow', [], { timeout: 50, promise: true }),
      ).rejects.toThrow(/timed out/i);
    });
  });
});
