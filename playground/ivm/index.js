import ivm from 'isolated-vm';

// This code registers the constant transformation function in the isolate's global context.
const transformationCode = `global.transform = function(input) {
    function generateUUID() {
        // Simple UUID v4 generator implementation
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
            const r = Math.random() * 16 | 0;
            const v = c === 'x' ? r : (r & 0x3 | 0x8);
            return v.toString(16);
        });
    }
    // Add an "id" attribute with a random UUID to the input.
    input.id = generateUUID();
    return input;
};`;

// Create an isolate with an 8MB memory limit.
const isolate = new ivm.Isolate({ memoryLimit: 8 });
const context = isolate.createContextSync();
const jail = context.global;

// Make the global object available in the isolate.
jail.setSync('global', jail.derefInto());

// Compile and run the transformation code to register "transform" in the global scope.
const script = isolate.compileScriptSync(transformationCode);
script.runSync(context);

// Retrieve the "transform" function from the isolate as a reference.
const transformFn = context.global.getSync('transform', { reference: true });

// Prepare the user-supplied JSON input.
const userInput = { name: "john" };
const externalInput = new ivm.ExternalCopy(userInput).copyInto();

// Call the transformation function inside the isolate.
// The result is automatically transferred back to the main context.
const transformedOutput = transformFn.applySync(
    undefined, 
    [externalInput], 
    { result: { copy: true } }
);

// Log the transformed output.
// E.g., it might output: { name: 'john', id: '8660eb1a-d351-46ba-b59a-876ea428721b' }
console.log(transformedOutput);
