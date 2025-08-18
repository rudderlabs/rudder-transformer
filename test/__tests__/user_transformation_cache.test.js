const { when } = require("jest-when");
jest.mock("node-fetch");
const fetch = require("node-fetch", () => jest.fn());
const ivmCacheManager = require("../../src/util/ivmCache/manager");
const ISOLATE_VM_MEMORY = parseInt(process.env.ISOLATE_VM_MEMORY || '128', 10);
const ivm = require('isolated-vm');


const axios = require("axios");
jest.mock("axios", () => ({
  ...jest.requireActual("axios"),
  get: jest.fn(),
  post: jest.fn(),
  delete: jest.fn(),
}));


describe("User transformation Cache", () => {

    const cacheKey = "test";
    const username = "test-user";
    const password = "test-password";
    const cacheMode = "isolate";
    const workspaceId = "test-workspace";
    const transformationId = "test-transformation";
    const libraryVersionIds = ["test-library-version-1", "test-library-version-2"];

    beforeEach(() => {
        jest.resetAllMocks();
      });
      afterAll(() => {});

      it(`should initialize cache manager`, async () => {
        process.env.IVM_CACHE_STRATEGY = cacheMode;
        expect(ivmCacheManager.isCachingEnabled()).toBe(true);
        expect(ivmCacheManager.getCurrentStrategy()).toBe(cacheMode);
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
        const bootstrap = await isolate.compileScript(
            'new ' +
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
        );
        await bootstrap.run(context);
        ivmCacheManager.set(cacheKey, {
            isolate: isolate,
            context: context,
            jail: jail,
            bootstrap: bootstrap,
            ivm: ivm,
        });
        const result = await ivmCacheManager.get(cacheKey, {
            credentials: {
                user: username,
                password: password
            }
        })
        expect(result).toBeDefined();
      })
      

})