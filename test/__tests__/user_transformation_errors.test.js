const { when } = require("jest-when");

jest.mock("node-fetch");
const fetch = require("node-fetch", () => jest.fn());

const {
  userTransformHandler
} = require("../../src/util/customTransformer");

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
      
      console.log('XTE: ', result.transformedEvents)
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
        "Error: Manual Error 2\n    at add (library jsLib2:3:23)\n    at transformBatch (base transformation:3:2)"
      ) });
    });
  });
});
