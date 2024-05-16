// Assume add.wasm file exists that contains a single function adding 2 provided arguments
import fs from 'node:fs';

const wasmBuffer = fs.readFileSync('./samples/sample1.wasm');
const wasmModule = await WebAssembly.instantiate(wasmBuffer, {
    imports: {
        print(arg) {
          console.log(arg);
        },
    },
    env: {
        abortStackOverflow: () => { throw new Error('overflow'); },
        table: new WebAssembly.Table({ initial: 0, element: 'anyfunc' }),
        __table_base: 0,
        memory: new WebAssembly.Memory({ initial: 256 }),
        __memory_base: 1024,
        STACKTOP: 0,
        STACK_MAX: 0,
    }
});

console.log(wasmModule.instance)