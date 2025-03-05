// bench.js
import ivm from 'isolated-vm';
import { performance } from 'perf_hooks';

// This is the same transformation code used in index.js.
// It registers a global `transform` function that takes an object,
// adds an "id" attribute with a random UUID, and returns the object.
const transformationCode = `
  global.transform = function(input) {
    function generateUUID() {
      return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
        const r = Math.random() * 16 | 0;
        const v = (c === 'x') ? r : (r & 0x3 | 0x8);
        return v.toString(16);
      });
    }
    input.id = generateUUID();
    return input;
  };
`;

async function setup() {
  // Create an isolate with an 8 MB memory limit
  const isolate = new ivm.Isolate({ memoryLimit: 8 });
  const context = isolate.createContextSync();
  const jail = context.global;
  // Make the global object available in the isolate (derefInto() helps produce a plain object)
  await jail.set("global", jail.derefInto());
  // Compile and run the transformation code so that `transform` is registered
  const script = isolate.compileScriptSync(transformationCode);
  script.runSync(context);
  // Retrieve the 'transform' function as a reference
  const transformFn = context.global.getSync("transform", { reference: true });
  return { isolate, transformFn };
}

async function benchmark(iterations) {
  const { isolate, transformFn } = await setup();
  const input = { name: "john" };

  let transformedOutput;
  // Warm-up phase (and capturing transformation result)
  for (let i = 0; i < 100; i++) {
    const externalInput = new ivm.ExternalCopy(input).copyInto();
    transformedOutput = transformFn.applySync(undefined, [externalInput], { result: { copy: true } });
  }
  
  console.log("Transformed sample:", JSON.stringify(transformedOutput, null, 2));

  // Benchmark loop
  const start = performance.now();
  for (let i = 0; i < iterations; i++) {
    const externalInput = new ivm.ExternalCopy(input).copyInto();
    // Capture transformation result on each iteration if needed:
    transformedOutput = transformFn.applySync(undefined, [externalInput], { result: { copy: true } });
  }
  const end = performance.now();
  const totalTime = end - start;
  console.log(`Total time for ${iterations} iterations: ${totalTime.toFixed(2)} ms`);
  console.log(`Average time per transformation: ${(totalTime / iterations).toFixed(4)} ms`);

  // Clean up
  isolate.dispose();
}

// Change the number of iterations as needed.
benchmark(10000).catch(console.error);