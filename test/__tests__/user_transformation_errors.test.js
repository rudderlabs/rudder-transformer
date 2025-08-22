const { when } = require("jest-when");

jest.mock("node-fetch");
const fetch = require("node-fetch", () => jest.fn());

const {
  userTransformHandler
} = require("../../src/util/customTransformer");
const ivmCacheManager = require("../../src/util/ivmCache/manager");

const events = [
  {
    message: {
      messageId: "msg1",
      event: "event-1"
    }
  },
  {
    message: {
      messageId: "msg2",
      event: "event-2"
    }
  }
]

const workspaceId = "workspaceId";
const versionId = "versionId";

const contructTrRevCode = (code) => {
  return {
    codeVersion: "1",
    language: "javascript",
    testName: "jsTest",
    code,
    workspaceId,
    versionId,
  };
};

describe("JS Transformation Error Tests", () => {
  describe("Transformations with transformEvent function", () => {
    it("semantic error in base transformation - shows up under transformedEvents", async () => {
      const code = "export function transformEvent(event, metadata) {\n return events; \n}";
      const trRevCode = contructTrRevCode(code);

      const result = await userTransformHandler(
        events,
        versionId,
        [],
        trRevCode,
        true,
      );
      
      expect(result.transformedEvents.length).toBe(2);
      result.transformedEvents.forEach(ev => { expect(ev.error).toEqual(
        "ReferenceError: events is not defined\n    at transformEvent (base transformation:2:2)"
      ) });
    });

    it("manually thrown error in base transformation - shows up under transformedEvents", async () => {
      const code = "export function transformEvent(event, metadata) {\n throw new Error('Manual Error'); return event; \n}";
      const trRevCode = contructTrRevCode(code);

      const result = await userTransformHandler(
        events,
        versionId,
        [],
        trRevCode,
        true,
      );
      
      expect(result.transformedEvents.length).toBe(2);
      result.transformedEvents.forEach(ev => { expect(ev.error).toEqual(
        "Error: Manual Error\n    at transformEvent (base transformation:2:8)"
      ) });
    });

    it("semantic error in user library - shows up under transformedEvents", async () => {
      const libVid = "l1";
      const code = "import {add} from 'jsLib1';\nexport function transformEvent(event, metadata) {\n event['result'] = add(1, 2); return event; \n}";
      const trRevCode = contructTrRevCode(code);

      const transformerUrl = `https://api.rudderlabs.com/transformationLibrary/getByVersionId?versionId=${libVid}`;
      when(fetch)
        .calledWith(transformerUrl)
        .mockResolvedValueOnce({
          status: 200,
          json: jest.fn().mockResolvedValueOnce({
            name: "js Lib1",
            handleName: "jsLib1",
            importName: "jsLib1",
            code: `
              export function add(x, y) {
                return x + z2;
              }
            `,
            language: "javascript",
          })
      });

      const result = await userTransformHandler(
        events,
        versionId,
        [libVid],
        trRevCode,
        true,
      );
      
      expect(result.transformedEvents.length).toBe(2);
      result.transformedEvents.forEach(ev => { expect(ev.error).toEqual(
        "ReferenceError: z2 is not defined\n    at add (library jsLib1:3:28)\n    at transformEvent (base transformation:3:20)"
      ) });
    });

    it("manually thrown error in user library - shows up under transformedEvents", async () => {
      const libVid = "l2";
      const code = "import {add} from 'jsLib2';\nexport function transformEvent(event, metadata) {\n event['result'] = add(1, 2); return event; \n}";
      const trRevCode = contructTrRevCode(code);

      const transformerUrl = `https://api.rudderlabs.com/transformationLibrary/getByVersionId?versionId=${libVid}`;
      when(fetch)
        .calledWith(transformerUrl)
        .mockResolvedValue({
          status: 200,
          json: jest.fn().mockResolvedValue({
            name: "js Lib2",
            handleName: "jsLib2",
            importName: "jsLib2",
            code: `
              export function add(x, y) {
                throw new Error('Manual Error');
                return x + y;
              }
            `,
            language: "javascript",
          })
      });

      const result = await userTransformHandler(
        events,
        versionId,
        [libVid],
        trRevCode,
        true,
      );
      
      expect(result.transformedEvents.length).toBe(2);
      result.transformedEvents.forEach(ev => { expect(ev.error).toEqual(
        "Error: Manual Error\n    at add (library jsLib2:3:23)\n    at transformEvent (base transformation:3:20)"
      ) });
    });
  });

  describe("Transformations with transformBatch function", () => {
    it("semantic error in base transformation - shows up under transformedEvents", async () => {
      const code = "export function transformBatch(events, metadata) {\n return events.map(e => { e['id'] = x; return e; }); \n}";
      const trRevCode = contructTrRevCode(code);

      const result = await userTransformHandler(
        events,
        versionId,
        [],
        trRevCode,
        true,
      );
      
      expect(result.transformedEvents.length).toBe(1);
      result.transformedEvents.forEach(ev => { expect(ev.error).toEqual(
        `ReferenceError: x is not defined
    at base transformation:2:37
    at Array.map (<anonymous>)
    at transformBatch (base transformation:2:16)`
      ) });
    });

    it("manually thrown error in base transformation - shows up under transformedEvents", async () => {
      const code = "export function transformBatch(events, metadata) {\n throw new Error('Manual Error'); return events; \n}";
      const trRevCode = contructTrRevCode(code);

      const result = await userTransformHandler(
        events,
        versionId,
        [],
        trRevCode,
        true,
      );

      expect(result.transformedEvents.length).toBe(1);    
      result.transformedEvents.forEach(ev => { expect(ev.error).toEqual(
        "Error: Manual Error\n    at transformBatch (base transformation:2:8)"
      ) });
    });

    it("semantic error in user library - shows up under transformedEvents", async () => {
      const libVid = "l3";
      const code = "import {add} from 'jsLib1';\nexport function transformBatch(events, metadata) {\n events[0] = add(1, 5); return events; \n}";
      const trRevCode = contructTrRevCode(code);

      const transformerUrl = `https://api.rudderlabs.com/transformationLibrary/getByVersionId?versionId=${libVid}`;
      when(fetch)
        .calledWith(transformerUrl)
        .mockResolvedValueOnce({
          status: 200,
          json: jest.fn().mockResolvedValueOnce({
            name: "js Lib1",
            handleName: "jsLib1",
            importName: "jsLib1",
            code: `
              export function add(x, y) {
                return x + y + z;
              }
            `,
            language: "javascript",
          })
      });

      const result = await userTransformHandler(
        events,
        versionId,
        [libVid],
        trRevCode,
        true,
      );
      
      expect(result.transformedEvents.length).toBe(1);
      result.transformedEvents.forEach(ev => { expect(ev.error).toEqual(
        "ReferenceError: z is not defined\n    at add (library jsLib1:3:32)\n    at transformBatch (base transformation:3:14)"
      ) });
    });

    it("manually thrown error in user library - shows up under transformedEvents", async () => {
      const libVid = "l4";
      const code = "import {add} from 'jsLib2';\nexport function transformBatch(events, metadata) {\n add(1, 2); return events; \n}";
      const trRevCode = {...contructTrRevCode(code), name: "test-transformation"} ;

      const transformerUrl = `https://api.rudderlabs.com/transformationLibrary/getByVersionId?versionId=${libVid}`;
      when(fetch)
        .calledWith(transformerUrl)
        .mockResolvedValue({
          status: 200,
          json: jest.fn().mockResolvedValue({
            name: "js Lib2",
            handleName: "jsLib2",
            importName: "jsLib2",
            code: `
              export function add(x, y) {
                throw new Error('Manual Error 2');
                return x + y;
              }
            `,
            language: "javascript",
          })
      });

      const result = await userTransformHandler(
        events,
        versionId,
        [libVid],
        trRevCode,
        true,
      );
      
      expect(result.transformedEvents.length).toBe(1);
      result.transformedEvents.forEach(ev => { expect(ev.error).toEqual(
        "Error: Manual Error 2\n    at add (library jsLib2:3:23)\n    at transformBatch (test-transformation:3:2)"
      ) });
    });
  });
});

describe("JS Transformation Error Tests when using ivm cache", () => {
  beforeEach(() => {
    jest.resetAllMocks();
    process.env.USE_IVM_CACHE = 'true';
    process.env.IVM_CACHE_STRATEGY = 'isolate';
    ivmCacheManager.initializeStrategy();
  });
  afterEach(() => {
    expect(ivmCacheManager.getStats().hits).toEqual(1);
    expect(ivmCacheManager.getStats().misses).toEqual(1);
    expect(ivmCacheManager.getStats().sets).toEqual(1);
    if (ivmCacheManager && ivmCacheManager.clear) {
      ivmCacheManager.clear().catch(() => {}); // Clear cache but don't fail tests
    }
  });

  describe("Transformations with transformEvent function with cache", () => {
    it("semantic error in base transformation - shows up under transformedEvents", async () => {
      const code = "export function transformEvent(event, metadata) {\n return events; \n}";
      const trRevCode = contructTrRevCode(code);

      const transformerUrl = `https://api.rudderlabs.com/transformation/getByVersionId?versionId=${versionId}`;
      when(fetch)
        .calledWith(transformerUrl)
        .mockResolvedValueOnce({
          status: 200,
          json: jest.fn().mockResolvedValueOnce(trRevCode)
      });

      const result = await userTransformHandler(
        events,
        versionId,
        [],
      );
      
      expect(result.length).toBe(2);
      result.forEach(ev => { expect(ev.error).toEqual(
        "ReferenceError: events is not defined\n    at transformEvent (base transformation:2:2)"
      ) });

      const resultCached = await userTransformHandler(
        events,
        versionId,
        [],
      );
      
      expect(resultCached.length).toBe(2);
      resultCached.forEach(ev => { expect(ev.error).toEqual(
        "ReferenceError: events is not defined\n    at transformEvent (base transformation:2:2)"
      ) });
    });

    it("manually thrown error in base transformation - shows up under transformedEvents", async () => {
      const code = "export function transformEvent(event, metadata) {\n throw new Error('Manual Error'); return event; \n}";
      const versionIdManualError = 'versionIdManualError'
      const trRevCode = contructTrRevCode(code);
      trRevCode.versionId = versionIdManualError;
      const transformerUrl = `https://api.rudderlabs.com/transformation/getByVersionId?versionId=${versionIdManualError}`;
      when(fetch)
        .calledWith(transformerUrl)
        .mockResolvedValueOnce({
          status: 200,
          json: jest.fn().mockResolvedValueOnce(trRevCode)
      });


      const result = await userTransformHandler(
        events,
        versionIdManualError,
        [],
      );
      expect(result.length).toBe(2);
      result.forEach(ev => { expect(ev.error).toEqual(
        "Error: Manual Error\n    at transformEvent (base transformation:2:8)"
      ) });

      const resultCached = await userTransformHandler(
        events,
        versionIdManualError,
        [],
      );
      expect(resultCached.length).toBe(2);
      resultCached.forEach(ev => { expect(ev.error).toEqual(
        "Error: Manual Error\n    at transformEvent (base transformation:2:8)"
      ) });
    });

    it("semantic error in user library - shows up under transformedEvents", async () => {
      const libVid = "l1";
      const versionIdWithLibVid = 'versionIdWithLibVid'
      const code = "import {add} from 'jsLib1';\nexport function transformEvent(event, metadata) {\n event['result'] = add(1, 2); return event; \n}";
      const trRevCode = contructTrRevCode(code);
      trRevCode.versionId = versionIdWithLibVid;

      const transformerUrlCode = `https://api.rudderlabs.com/transformation/getByVersionId?versionId=${versionIdWithLibVid}`;
      when(fetch)
        .calledWith(transformerUrlCode)
        .mockResolvedValueOnce({
          status: 200,
          json: jest.fn().mockResolvedValueOnce(trRevCode)
      });


      const transformerUrl = `https://api.rudderlabs.com/transformationLibrary/getByVersionId?versionId=${libVid}`;
      when(fetch)
        .calledWith(transformerUrl)
        .mockResolvedValueOnce({
          status: 200,
          json: jest.fn().mockResolvedValueOnce({
            name: "js Lib1",
            handleName: "jsLib1",
            importName: "jsLib1",
            code: `
              export function add(x, y) {
                return x + z2;
              }
            `,
            language: "javascript",
          })
      });

      const result = await userTransformHandler(
        events,
        versionIdWithLibVid,
        [libVid],
      );
      
      expect(result.length).toBe(2);
      result.forEach(ev => { expect(ev.error).toEqual(
        "ReferenceError: z2 is not defined\n    at add (library jsLib1:3:28)\n    at transformEvent (base transformation:3:20)"
      ) });

      const resultCached = await userTransformHandler(
        events,
        versionIdWithLibVid,
        [libVid],
      );
      expect(resultCached.length).toBe(2);
      resultCached.forEach(ev => { expect(ev.error).toEqual(
        "ReferenceError: z2 is not defined\n    at add (library jsLib1:3:28)\n    at transformEvent (base transformation:3:20)"
      ) });
    });

    it("manually thrown error in user library - shows up under transformedEvents", async () => {
      const libVid = "l2";
      const versionIdWithLibVid2 = 'versionIdWithLibVid2'
      const code = "import {add} from 'jsLib2';\nexport function transformEvent(event, metadata) {\n event['result'] = add(1, 2); return event; \n}";
      const trRevCode = contructTrRevCode(code);
      trRevCode.versionId = versionIdWithLibVid2;

      const transformerUrlCode = `https://api.rudderlabs.com/transformation/getByVersionId?versionId=${versionIdWithLibVid2}`;
      when(fetch)
        .calledWith(transformerUrlCode)
        .mockResolvedValueOnce({
          status: 200,
          json: jest.fn().mockResolvedValueOnce(trRevCode)
      });


      const transformerUrl = `https://api.rudderlabs.com/transformationLibrary/getByVersionId?versionId=${libVid}`;
      when(fetch)
        .calledWith(transformerUrl)
        .mockResolvedValue({
          status: 200,
          json: jest.fn().mockResolvedValue({
            name: "js Lib2",
            handleName: "jsLib2",
            importName: "jsLib2",
            code: `
              export function add(x, y) {
                throw new Error('Manual Error');
                return x + y;
              }
            `,
            language: "javascript",
          })
      });

      const result = await userTransformHandler(
        events,
        versionIdWithLibVid2,
        [libVid],
      );
      
      expect(result.length).toBe(2);
      result.forEach(ev => { expect(ev.error).toEqual(
        "Error: Manual Error\n    at add (library jsLib2:3:23)\n    at transformEvent (base transformation:3:20)"
      ) });

      const resultCached = await userTransformHandler(
        events,
        versionIdWithLibVid2,
        [libVid],
      );
      expect(resultCached.length).toBe(2);
      resultCached.forEach(ev => { expect(ev.error).toEqual(
        "Error: Manual Error\n    at add (library jsLib2:3:23)\n    at transformEvent (base transformation:3:20)"
      ) });
    });
  });

  describe("Transformations with transformBatch function", () => {
    it("semantic error in base transformation - shows up under transformedEvents", async () => {
      const versionIdSemanticError = 'versionIdSemanticError'
      const code = "export function transformBatch(events, metadata) {\n return events.map(e => { e['id'] = x; return e; }); \n}";
      const trRevCode = contructTrRevCode(code);
      trRevCode.versionId = versionIdSemanticError;


      const transformerUrlCode = `https://api.rudderlabs.com/transformation/getByVersionId?versionId=${versionIdSemanticError}`;
      when(fetch)
        .calledWith(transformerUrlCode)
        .mockResolvedValueOnce({
          status: 200,
          json: jest.fn().mockResolvedValueOnce(trRevCode)
      });


        const result = await userTransformHandler(
          events,
          versionIdSemanticError,
          [],
        );
        
        expect(result.length).toBe(1);
        result.forEach(ev => { expect(ev.error).toEqual(
          `ReferenceError: x is not defined\n    at base transformation:2:37\n    at Array.map (<anonymous>)\n    at transformBatch (base transformation:2:16)`
        ) });

        const resultCached = await userTransformHandler(
          events,
          versionIdSemanticError,
          [],
        );
        
        expect(resultCached.length).toBe(1);
        resultCached.forEach(ev => { expect(ev.error).toEqual(
          `ReferenceError: x is not defined\n    at base transformation:2:37\n    at Array.map (<anonymous>)\n    at transformBatch (base transformation:2:16)`
        ) });
    });

    it("manually thrown error in base transformation - shows up under transformedEvents", async () => {
      const versionIdSemanticError2 = 'versionIdSemanticError2'
      const code = "export function transformBatch(events, metadata) {\n throw new Error('Manual Error'); return events; \n}";
      const trRevCode = contructTrRevCode(code);
      trRevCode.versionId = versionIdSemanticError2;

      const transformerUrlCode = `https://api.rudderlabs.com/transformation/getByVersionId?versionId=${versionIdSemanticError2}`;
      when(fetch)
        .calledWith(transformerUrlCode)
        .mockResolvedValueOnce({
          status: 200,
          json: jest.fn().mockResolvedValueOnce(trRevCode)
      });


      const result = await userTransformHandler(
        events,
        versionIdSemanticError2,
        [],
      );

      expect(result.length).toBe(1);    
      result.forEach(ev => { expect(ev.error).toEqual(
        "Error: Manual Error\n    at transformBatch (base transformation:2:8)"
      ) });

      const resultCached = await userTransformHandler(
        events,
        versionIdSemanticError2,
        [],
      );
      expect(resultCached.length).toBe(1);
      resultCached.forEach(ev => { expect(ev.error).toEqual(
        "Error: Manual Error\n    at transformBatch (base transformation:2:8)"
      ) });
    });

    it("semantic error in user library - shows up under transformedEvents", async () => {
      const libVid = "l3";
      const versionIdWithLibVid3 = 'versionIdWithLibVid3'
      const code = "import {add} from 'jsLib1';\nexport function transformBatch(events, metadata) {\n events[0] = add(1, 5); return events; \n}";
      const trRevCode = contructTrRevCode(code);
      trRevCode.versionId = versionIdWithLibVid3;

      const transformerUrlCode = `https://api.rudderlabs.com/transformation/getByVersionId?versionId=${versionIdWithLibVid3}`;
      when(fetch)
        .calledWith(transformerUrlCode)
        .mockResolvedValueOnce({
          status: 200,
          json: jest.fn().mockResolvedValueOnce(trRevCode)
      });

      const transformerUrl = `https://api.rudderlabs.com/transformationLibrary/getByVersionId?versionId=${libVid}`;
      when(fetch)
        .calledWith(transformerUrl)
        .mockResolvedValueOnce({
          status: 200,
          json: jest.fn().mockResolvedValueOnce({
            name: "js Lib1",
            handleName: "jsLib1",
            importName: "jsLib1",
            code: `
              export function add(x, y) {
                return x + y + z;
              }
            `,
            language: "javascript",
          })
      });

      const result = await userTransformHandler(
        events,
        versionIdWithLibVid3,
        [libVid],
      );
      
      expect(result.length).toBe(1);
      result.forEach(ev => { expect(ev.error).toEqual(
        "ReferenceError: z is not defined\n    at add (library jsLib1:3:32)\n    at transformBatch (base transformation:3:14)"
      ) });

      const resultCached = await userTransformHandler(
        events,
        versionIdWithLibVid3,
        [libVid],
      );
      expect(resultCached.length).toBe(1);
      resultCached.forEach(ev => { expect(ev.error).toEqual(
        "ReferenceError: z is not defined\n    at add (library jsLib1:3:32)\n    at transformBatch (base transformation:3:14)"
      ) });
    });

    it("manually thrown error in user library - shows up under transformedEvents", async () => {
      const libVid = "l4";
      const versionIdWithLibVid4 = 'versionIdWithLibVid4'
      const code = "import {add} from 'jsLib2';\nexport function transformBatch(events, metadata) {\n add(1, 2); return events; \n}";
      const trRevCode = {...contructTrRevCode(code), name: "test-transformation"} ;
      trRevCode.versionId = versionIdWithLibVid4;

      const transformerUrlCode = `https://api.rudderlabs.com/transformation/getByVersionId?versionId=${versionIdWithLibVid4}`;
      when(fetch)
        .calledWith(transformerUrlCode)
        .mockResolvedValueOnce({
          status: 200,
          json: jest.fn().mockResolvedValueOnce(trRevCode)
      });

      const transformerUrl = `https://api.rudderlabs.com/transformationLibrary/getByVersionId?versionId=${libVid}`;
      when(fetch)
        .calledWith(transformerUrl)
        .mockResolvedValue({
          status: 200,
          json: jest.fn().mockResolvedValue({
            name: "js Lib2",
            handleName: "jsLib2",
            importName: "jsLib2",
            code: `
              export function add(x, y) {
                throw new Error('Manual Error 2');
                return x + y;
              }
            `,
            language: "javascript",
          })
      });

      const result = await userTransformHandler(
        events,
        versionIdWithLibVid4,
        [libVid],
      );
      
      expect(result.length).toBe(1);
      result.forEach(ev => { expect(ev.error).toEqual(
        "Error: Manual Error 2\n    at add (library jsLib2:3:23)\n    at transformBatch (test-transformation:3:2)"
      ) });

      const resultCached = await userTransformHandler(
        events,
        versionIdWithLibVid4,
        [libVid],
      );
      expect(resultCached.length).toBe(1);
      resultCached.forEach(ev => { expect(ev.error).toEqual(
        "Error: Manual Error 2\n    at add (library jsLib2:3:23)\n    at transformBatch (test-transformation:3:2)"
      ) });
    });
  });
});
