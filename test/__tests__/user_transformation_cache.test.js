const ivmCacheManager = require("../../src/util/ivmCache/manager");
const ISOLATE_VM_MEMORY = parseInt(process.env.ISOLATE_VM_MEMORY || '128', 10);
const ivm = require('isolated-vm');

const userTransformTimeout = parseInt(process.env.USER_TRANSFORM_TIMEOUT || '600000', 10);
const ivmExecutionTimeout = parseInt(process.env.IVM_EXECUTION_TIMEOUT || '4000', 10);

const bootstrapCode = 'new ' +
              `
                function() {
                // Grab a reference to the ivm module and delete it from global scope. Now this closure is the
                // only place in the context with a reference to the module. The 'ivm' module is very powerful
                // so you should not put it in the hands of untrusted code.
                let ivm = _ivm;
                delete _ivm;
                return new ivm.Reference(function forwardMainPromise(
                    fnRef,
                    resolve,
                    reject,
                    events
                    ){
                    const derefMainFunc = fnRef.deref();
                    Promise.resolve(derefMainFunc(events))
                    .then(value => {
                        resolve.applyIgnored(undefined, [
                        new ivm.ExternalCopy(value).copyInto()
                        ]);
                    })
                    .catch(error => {
                        reject.applyIgnored(undefined, [
                        new ivm.ExternalCopy(error.message).copyInto()
                        ]);
                    });
                    });
                }
`

const wrapperCode = `
        export async function transformWrapper(transformationPayload) {
          let events = transformationPayload.events
          let transformType = transformationPayload.transformationType
          let outputEvents = []
          const eventMessages = events.map(event => event.message);
    
          const isObject = (o) => Object.prototype.toString.call(o) === '[object Object]';
          switch(transformType) {
            case "transformEvent":
              await Promise.all(eventMessages.map(async ev => {
                const currMsgId = ev.messageId;
                try{
                  let transformedOutput = await transformEvent(ev);
                  // if func returns null/undefined drop event
                  if (transformedOutput === null || transformedOutput === undefined) return;
                  if (Array.isArray(transformedOutput)) {
                    const producedEvents = [];
                    const encounteredError = !transformedOutput.every(e => {
                      if (isObject(e)) {
                        producedEvents.push({transformedEvent: e});
                        return true;
                      } else {
                        outputEvents.push({error: "returned event in events array from transformEvent(event) is not an object"});
                        return false;
                      }
                    })
                    if (!encounteredError) {
                      outputEvents.push(...producedEvents);
                    }
                    return;
                  }
                  if (!isObject(transformedOutput)) {
                    return outputEvents.push({error: "returned event from transformEvent(event) is not an object"});
                  }
                  outputEvents.push({transformedEvent: transformedOutput});
                  return;
                } catch (error) {
                  // Handling the errors in versionedRouter.js
                  return outputEvents.push({error: error.message});
                }
              }));
              break;
          }
          return outputEvents
        }
`
jest.mock("axios", () => ({
  ...jest.requireActual("axios"),
  get: jest.fn(),
  post: jest.fn(),
  delete: jest.fn(),
}));


async function transform(isolatevm, events) {
    const transformationPayload = {};
    transformationPayload.events = events;
    transformationPayload.transformationType = isolatevm.fName;
    const sharedTransformationPayload = new ivm.ExternalCopy(transformationPayload).copyInto({
      transferIn: true,
    });
    
    const executionPromise = new Promise((resolve, reject) => {
      isolatevm.bootstrapScriptResult.apply(
        undefined,
        [
          isolatevm.fnRef,
          new ivm.Reference(resolve),
          new ivm.Reference(reject),
          sharedTransformationPayload,
        ],
        { timeout: ivmExecutionTimeout },
      ).then(() => {
       
      }).catch((error) => {
        reject(error.message);
      });
    });
  
    let setTimeoutHandle;
    const timeoutPromise = new Promise((_, reject) => {
      setTimeoutHandle = setTimeout(() => {
        reject(new Error('Timed out'));
      }, userTransformTimeout);
    });
    return Promise.race([executionPromise, timeoutPromise])
      .catch((e) => {
        throw new Error(e);
      })
      .finally(() => clearTimeout(setTimeoutHandle));
  }

describe("User transformation Cache", () => {

    const cacheKey = "test";
    const username = "test-user";
    const password = "test-password";
    const cacheMode = "isolate";
    const workspaceId = "test-workspace";
    const transformationId = "test-transformation";
    const inputData = require(`./data/user_transformation_cache_input.json`);
    const expectedData = require(`./data/user_transformation_cache_output.json`);
    const code = `      export async function transformEvent(event, metadata) {
                const eventType = event.type;
                if(eventType === 'non-standard') throw new Error('non-standard event');
                if(eventType && !eventType.match(/track/g)) return;
                return event;
              }
            `
    const transformationName = "test-transformation";
    const SUPPORTED_FUNC_NAMES = ['transformEvent', 'transformBatch'];

    beforeEach(() => {
        jest.resetAllMocks();
      });
      afterAll(() => {});

      it(`should initialize cache manager`, async () => {
        process.env.IVM_CACHE_STRATEGY = cacheMode;
        ivmCacheManager.initializeStrategy();
        const result = await ivmCacheManager.get(cacheKey, {
            credentials: {
                user: username,
                password: password
            }
        })
        expect(result).toBe(null);
      })

      it(`should set cache user transformation`, async () => {
        const isolate = new ivm.Isolate({ memoryLimit: ISOLATE_VM_MEMORY });
        const context = await isolate.createContext();
        const jail = context.global;
        await jail.set('global', jail.derefInto());
        await jail.set('_ivm', ivm);
        const bootstrap = await isolate.compileScript(bootstrapCode);
        const bootstrapScriptResult = await bootstrap.run(context);
        const codeWithWrapper = code + wrapperCode;
        const compiledModules = {}; 
        const customScriptModule = await isolate.compileModule(`${codeWithWrapper}`, {
            filename: transformationName,
        });
        await customScriptModule.instantiate(context, async (spec) => {
            if (compiledModules[spec]) {
                return compiledModules[spec].module;
            }
            throw new Error(`import from ${spec} failed. Module not found.`);
        });
        await customScriptModule.evaluate();


        const supportedFuncs = {};

        await Promise.all(
          SUPPORTED_FUNC_NAMES.map(async (sName) => {
            const funcRef = await customScriptModule.namespace.get(sName, {
              reference: true,
            });
            if (funcRef && funcRef.typeof === 'function') {
              supportedFuncs[sName] = funcRef;
            }
          }),
        );
      
        const availableFuncNames = Object.keys(supportedFuncs);
        if (availableFuncNames.length !== 1) {
          throw new Error(
            `Expected one of ${SUPPORTED_FUNC_NAMES}. Found ${Object.values(availableFuncNames)}`,
          );
        }
      
        const fnRef = await customScriptModule.namespace.get('transformWrapper', {
          reference: true,
        });
        const fName = availableFuncNames[0];

        ivmCacheManager.set(cacheKey, {
            isolate: isolate,
            context: context,
            jail: jail,
            bootstrap: bootstrap,
            bootstrapScriptResult: bootstrapScriptResult,
            customScriptModule: customScriptModule,
            ivm: ivm,
            fnRef: fnRef,
            fName: fName,
            transformationId: transformationId,
            workspaceId: workspaceId,
            moduleSource: {
              codeWithWrapper: codeWithWrapper,
              transformationName: transformationName,
              librariesMap: {}, 
            },
        });

      })

      it(`should get cache user transformation and transform events`, async () => {
        const result = await ivmCacheManager.get(cacheKey, {
            credentials: {
                user: username,
                password: password
            }
        })
        expect(result).toBeDefined();
        const output = await transform(result, inputData);
        expect(output).toEqual(expectedData);
      })

      it(`should get cached user transformation again and transform events`, async () => {
        const result = await ivmCacheManager.get(cacheKey, {
            credentials: {
                user: username,
                password: password
            }
        })
        expect(result).toBeDefined();
        const output = await transform(result, inputData);
        expect(output).toEqual(expectedData);
      })

      it(`should delete cache user transformation`, async () => {
        await ivmCacheManager.delete(cacheKey);
        const result = await ivmCacheManager.get(cacheKey, {
            credentials: {
                user: username,
                password: password
            }
        })
        expect(result).toBe(null);
      })

      it(`should clear cache user transformation`, async () => {
        await ivmCacheManager.clear();
        const result = await ivmCacheManager.get(cacheKey, {
            credentials: {
                user: username,
                password: password
            }
        })
        expect(result).toBe(null);
      })
})