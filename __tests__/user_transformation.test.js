const { when } = require("jest-when");
jest.mock("node-fetch");
const fetch = require("node-fetch", () => jest.fn());
const { Response } = jest.requireActual("node-fetch");
const lodashCore = require("lodash/core");
const _ = require("lodash");
const unsupportedFuncNames = [
  "_",
  "extend",
  "each",
  "first",
  "join",
  "reverse",
  "split"
];
const { userTransformHandler } = require("../util/customTransformer");
const integration = "user_transformation";
const name = "User Transformations";

const util = require("util");
const fs = require("fs");
const path = require("path");

const randomID = () =>
  Math.random()
    .toString(36)
    .substring(2, 15);

const possibleEnvs = ["true", "false", "no_value", "some_random_value"];
possibleEnvs.forEach(envValue => {
  describe("User transformation", () => {
    const OLD_ENV = process.env;
    beforeEach(() => {
      jest.resetAllMocks();
      process.env = { ...OLD_ENV };
      if (envValue !== "no_value") {
        process.env.ON_DEMAND_ISOLATE_VM = envValue;
      }
    });
    afterAll(() => {
      process.env = OLD_ENV; // restore old env
    });
    it(`Simple ${name} Test`, async () => {
      const versionId = randomID();

      const inputData = require(`./data/${integration}_input.json`);
      const expectedData = require(`./data/${integration}_output.json`);

      const respBody = {
        codeVersion: "0",
        name: name,
        code: `
        function transform(events) {
            const filteredEvents = events.map(event => {
              return event;
            });
              return filteredEvents;
            }
            `
      };
      fetch.mockResolvedValue({
        json: jest.fn().mockResolvedValue(respBody)
      });

      const output = await userTransformHandler(inputData, versionId, []);
      expect(fetch).toHaveBeenCalledWith(
        `https://api.rudderlabs.com/transformation/getByVersionId?versionId=${versionId}`
      );

      expect(output).toEqual(expectedData);
    });

    it(`Simple async ${name} Test for V0 transformation`, async () => {
      const versionId = randomID();
      const inputData = require(`./data/${integration}_input.json`);
      const expectedData = require(`./data/${integration}_async_output.json`);

      const respBody = {
        codeVersion: "0",
        name: name,
        code: `
        async function foo() {
          return 'resolved';
        }
        async function transform(events) {
            const pr = await foo();
            const filteredEvents = events.map(event => {
              event.promise = pr;
              return event;
            });
              return filteredEvents;
            }
            `
      };
      fetch.mockResolvedValue({
        json: jest.fn().mockResolvedValue(respBody)
      });

      const output = await userTransformHandler(inputData, versionId, []);
      expect(fetch).toHaveBeenCalledWith(
        `https://api.rudderlabs.com/transformation/getByVersionId?versionId=${versionId}`
      );

      expect(output).toEqual(expectedData);
    });

    it(`Simple ${name} async test for V1 transformation - transformBatch`, async () => {
      const versionId = randomID();
      const libraryVersionId = randomID();
      const inputData = require(`./data/${integration}_input.json`);
      const expectedData = require(`./data/${integration}_async_output.json`);

      const respBody = {
        code: `
        import url from 'url';
        async function foo() {
          return 'resolved';
        }
        export async function transformBatch(events, metadata) {
            const pr = await foo();
            const modifiedEvents = events.map(event => {
              if(event.properties && event.properties.url){
                const x = new url.URLSearchParams(event.properties.url).get("client");
              }
              event.promise = pr;
              return event;
            });
              return modifiedEvents;
            }
            `,
        name: "url",
        codeVersion: "1"
      };
      respBody["versionId"] = versionId;
      const transformerUrl = `https://api.rudderlabs.com/transformation/getByVersionId?versionId=${versionId}`;
      when(fetch)
        .calledWith(transformerUrl)
        .mockResolvedValue({
          json: jest.fn().mockResolvedValue(respBody)
        });

      const urlCode = `${fs.readFileSync(
        "./util/url-search-params.min.js",
        "utf8"
      )};
      export default self;
      `;

      const libraryUrl = `https://api.rudderlabs.com/transformationLibrary/getByVersionId?versionId=${libraryVersionId}`;
      when(fetch)
        .calledWith(libraryUrl)
        .mockResolvedValue({
          json: jest.fn().mockResolvedValue({ code: urlCode, name: "url" })
        });

      const output = await userTransformHandler(inputData, versionId, [
        libraryVersionId
      ]);

      expect(fetch).toHaveBeenCalledWith(
        `https://api.rudderlabs.com/transformation/getByVersionId?versionId=${versionId}`
      );

      expect(output).toEqual(expectedData);
    });

    it(`Simple ${name} async test for V1 transformation - transformBatch returning an array containing error`, async () => {
      const versionId = randomID();
      const libraryVersionId = randomID();
      const inputData = require(`./data/${integration}_input.json`);
      const expectedData = require(`./data/${integration}_async_output.json`);

      const respBody = {
        code: `
        import url from 'url';
        async function foo() {
          return 'resolved';
        }
        export async function transformBatch(events, metadata) {
            const pr = await foo();
            const modifiedEvents = events.map((event, index) => {
              if (index === 0) return null;
              if(event.properties && event.properties.url){
                const x = new url.URLSearchParams(event.properties.url).get("client");
              }
              event.promise = pr;
              return event;
            });
              return modifiedEvents;
            }
            `,
        name: "url",
        codeVersion: "1"
      };
      respBody["versionId"] = versionId;
      const transformerUrl = `https://api.rudderlabs.com/transformation/getByVersionId?versionId=${versionId}`;
      when(fetch)
        .calledWith(transformerUrl)
        .mockResolvedValue({
          json: jest.fn().mockResolvedValue(respBody)
        });

      const urlCode = `${fs.readFileSync(
        "./util/url-search-params.min.js",
        "utf8"
      )};
      export default self;
      `;

      const libraryUrl = `https://api.rudderlabs.com/transformationLibrary/getByVersionId?versionId=${libraryVersionId}`;
      when(fetch)
        .calledWith(libraryUrl)
        .mockResolvedValue({
          json: jest.fn().mockResolvedValue({ code: urlCode, name: "url" })
        });

      const output = await userTransformHandler(inputData, versionId, [
        libraryVersionId
      ]);

      expect(fetch).toHaveBeenCalledWith(
        `https://api.rudderlabs.com/transformation/getByVersionId?versionId=${versionId}`
      );

      const x = _.cloneDeep(expectedData)
      x[0] = {
        error:
          "returned event in events array from transformBatch(events) is not an object",
        metadata: {}
      };

      expect(output).toEqual(x);
    });

    it(`Simple ${name} async test for V1 transformation - transformEvent`, async () => {
      const versionId = randomID();
      const libraryVersionId = randomID();
      const inputData = require(`./data/${integration}_input.json`);
      const expectedData = require(`./data/${integration}_async_output.json`);

      const respBody = {
        code: `
        import url from 'url';
        async function foo() {
          return 'resolved';
        }
        export async function transformEvent(event, metadata) {
            const pr = await foo();
            if(event.properties && event.properties.url){
              const x = new url.URLSearchParams(event.properties.url).get("client");
            }
            event.promise = pr;
            return event;
          }
          `,
        name: "url",
        codeVersion: "1"
      };
      respBody["versionId"] = versionId;
      const transformerUrl = `https://api.rudderlabs.com/transformation/getByVersionId?versionId=${versionId}`;
      when(fetch)
        .calledWith(transformerUrl)
        .mockResolvedValue({
          json: jest.fn().mockResolvedValue(respBody)
        });

      const urlCode = `${fs.readFileSync(
        "./util/url-search-params.min.js",
        "utf8"
      )};
      export default self;
      `;

      const libraryUrl = `https://api.rudderlabs.com/transformationLibrary/getByVersionId?versionId=${libraryVersionId}`;
      when(fetch)
        .calledWith(libraryUrl)
        .mockResolvedValue({
          json: jest.fn().mockResolvedValue({ code: urlCode, name: "url" })
        });

      const output = await userTransformHandler(inputData, versionId, [
        libraryVersionId
      ]);

      expect(fetch).toHaveBeenCalledWith(
        `https://api.rudderlabs.com/transformation/getByVersionId?versionId=${versionId}`
      );

      expect(output).toEqual(expectedData);
    });

    it(`Simple ${name} async test for V1 transformation - transformEvent returning array of events`, async () => {
      const versionId = randomID();
      const libraryVersionId = randomID();
      const inputData = require(`./data/${integration}_input.json`);
      const expectedData = require(`./data/${integration}_async_output.json`);

      const respBody = {
        code: `
        import url from 'url';
        async function foo() {
          return 'resolved';
        }
        export async function transformEvent(event, metadata) {
            const pr = await foo();
            if(event.properties && event.properties.url){
              const x = new url.URLSearchParams(event.properties.url).get("client");
            }
            event.promise = pr;
            return [event, {duplicate: true, ...event}];
          }
          `,
        name: "url",
        codeVersion: "1"
      };
      respBody["versionId"] = versionId;
      const transformerUrl = `https://api.rudderlabs.com/transformation/getByVersionId?versionId=${versionId}`;
      when(fetch)
        .calledWith(transformerUrl)
        .mockResolvedValue({
          json: jest.fn().mockResolvedValue(respBody)
        });

      const urlCode = `${fs.readFileSync(
        "./util/url-search-params.min.js",
        "utf8"
      )};
      export default self;
      `;

      const libraryUrl = `https://api.rudderlabs.com/transformationLibrary/getByVersionId?versionId=${libraryVersionId}`;
      when(fetch)
        .calledWith(libraryUrl)
        .mockResolvedValue({
          json: jest.fn().mockResolvedValue({ code: urlCode, name: "url" })
        });

      const output = await userTransformHandler(inputData, versionId, [
        libraryVersionId
      ]);

      expect(fetch).toHaveBeenCalledWith(
        `https://api.rudderlabs.com/transformation/getByVersionId?versionId=${versionId}`
      );

      const matchData = [];
      expectedData.forEach(e => {
        matchData.push(e);
        const clonedData = _.cloneDeep(e);
        clonedData.transformedEvent.duplicate = true;
        matchData.push(clonedData);
      });

      expect(output).toEqual(matchData);
    });

    it(`Simple ${name} async test for V1 transformation - transformEvent returning non array/objects`, async () => {
      const versionId = randomID();
      const libraryVersionId = randomID();
      const inputData = require(`./data/${integration}_input.json`);
      // const expectedData = require(`./data/${integration}_async_output.json`);

      const respBody = {
        code: `
        import url from 'url';
        async function foo() {
          return 'resolved';
        }
        export async function transformEvent(event, metadata) {
            const pr = await foo();
            if(event.properties && event.properties.url){
              const x = new url.URLSearchParams(event.properties.url).get("client");
            }
            event.promise = pr;
            return [event, 1];
          }
          `,
        name: "url",
        codeVersion: "1"
      };
      respBody["versionId"] = versionId;
      const transformerUrl = `https://api.rudderlabs.com/transformation/getByVersionId?versionId=${versionId}`;
      when(fetch)
        .calledWith(transformerUrl)
        .mockResolvedValue({
          json: jest.fn().mockResolvedValue(respBody)
        });

      const urlCode = `${fs.readFileSync(
        "./util/url-search-params.min.js",
        "utf8"
      )};
      export default self;
      `;

      const libraryUrl = `https://api.rudderlabs.com/transformationLibrary/getByVersionId?versionId=${libraryVersionId}`;
      when(fetch)
        .calledWith(libraryUrl)
        .mockResolvedValue({
          json: jest.fn().mockResolvedValue({ code: urlCode, name: "url" })
        });

      const output = await userTransformHandler(inputData, versionId, [
        libraryVersionId
      ]);

      expect(fetch).toHaveBeenCalledWith(
        `https://api.rudderlabs.com/transformation/getByVersionId?versionId=${versionId}`
      );

      const matchData = [];
      inputData.forEach(e => {
        matchData.push({
          error:
            "returned event in events array from transformEvent(event) is not an object",
          metadata: {}
        });
      });

      expect(output).toEqual(matchData);
    });

    it(`Simple ${name} async test for V1 transformation - transformEvent - event ordering`, async () => {
      const versionId = randomID();
      const libraryVersionId = randomID();
      const inputData = require(`./data/${integration}_input_large.json`);
      const expectedData = require(`./data/${integration}_async_output_large.json`);

      const respBody = {
        code: `
        import url from 'url';
        async function foo() {
          return 'resolved';
        }
        export async function transformEvent(event, metadata) {
            const pr = await foo();
            if(event.properties && event.properties.url){
              const x = new url.URLSearchParams(event.properties.url).get("client");
            }
            event.promise = pr;
            return event;
          }
          `,
        name: "url",
        codeVersion: "1"
      };
      respBody["versionId"] = versionId;
      const transformerUrl = `https://api.rudderlabs.com/transformation/getByVersionId?versionId=${versionId}`;
      when(fetch)
        .calledWith(transformerUrl)
        .mockResolvedValue({
          json: jest.fn().mockResolvedValue(respBody)
        });

      const urlCode = `${fs.readFileSync(
        "./util/url-search-params.min.js",
        "utf8"
      )};
      export default self;
      `;

      const libraryUrl = `https://api.rudderlabs.com/transformationLibrary/getByVersionId?versionId=${libraryVersionId}`;
      when(fetch)
        .calledWith(libraryUrl)
        .mockResolvedValue({
          json: jest.fn().mockResolvedValue({ code: urlCode, name: "url" })
        });

      const output = await userTransformHandler(inputData, versionId, [
        libraryVersionId
      ]);

      expect(fetch).toHaveBeenCalledWith(
        `https://api.rudderlabs.com/transformation/getByVersionId?versionId=${versionId}`
      );

      expect(output).toEqual(expectedData);
    });

    it(`Simple ${name} async test for V1 transformation - transformEvent with some failures for some events`, async () => {
      const versionId = randomID();
      const libraryVersionId = randomID();
      const inputData = require(`./data/${integration}_input.json`);
      const expectedData = require(`./data/${integration}_async_output_with_errors.json`);

      const respBody = {
        code: `
        import url from 'url';
        async function rejectNonIdentifies(eventType) {
          if(eventType === 'identify') {
            return 'resolved';
          }
          throw new Error("Non-identify found")
        }
        export async function transformEvent(event, metadata) {
            const pr = await rejectNonIdentifies(event.type);
            if(event.properties && event.properties.url){
              const x = new url.URLSearchParams(event.properties.url).get("client");
            }
            event.promise = pr;
            return event;
          }
          `,
        name: "url",
        codeVersion: "1"
      };
      respBody["versionId"] = versionId;
      const transformerUrl = `https://api.rudderlabs.com/transformation/getByVersionId?versionId=${versionId}`;
      when(fetch)
        .calledWith(transformerUrl)
        .mockResolvedValue({
          json: jest.fn().mockResolvedValue(respBody)
        });

      const urlCode = `${fs.readFileSync(
        "./util/url-search-params.min.js",
        "utf8"
      )};
      export default self;
      `;

      const libraryUrl = `https://api.rudderlabs.com/transformationLibrary/getByVersionId?versionId=${libraryVersionId}`;
      when(fetch)
        .calledWith(libraryUrl)
        .mockResolvedValue({
          json: jest.fn().mockResolvedValue({ code: urlCode, name: "url" })
        });

      const output = await userTransformHandler(inputData, versionId, [
        libraryVersionId
      ]);

      expect(fetch).toHaveBeenCalledWith(
        `https://api.rudderlabs.com/transformation/getByVersionId?versionId=${versionId}`
      );

      expect(output).toEqual(expectedData);
    });

    it(`Filtering ${name} Test`, async () => {
      const versionId = randomID();
      const inputData = require(`./data/${integration}_filter_input.json`);
      const expectedData = require(`./data/${integration}_filter_output.json`);

      const respBody = {
        codeVersion: "0",
        name: name,
        code: `function transform(events) {
                          let filteredEvents = events.filter(event => {
                            const eventType = event.type;
                            return eventType && eventType.match(/track/g);
                          });

                          filteredEvents = filteredEvents.map(event => {
                            const eventMetadata = metadata(event);
                            event.sourceId = eventMetadata.sourceId;
                            return event;
                          })
                          return filteredEvents;
                        }
                        `
      };
      fetch.mockResolvedValue({
        json: jest.fn().mockResolvedValue(respBody)
      });
      const output = await userTransformHandler(inputData, versionId, []);
      expect(fetch).toHaveBeenCalledWith(
        `https://api.rudderlabs.com/transformation/getByVersionId?versionId=${versionId}`
      );

      expect(output).toEqual(expectedData);
    });

    it(`Simple ${name} Test for lodash functions`, async () => {
      const versionId = randomID();
      const libraryVersionId = randomID();
      const inputData = require(`./data/${integration}_input.json`);
      const expectedData = require(`./data/${integration}_lodash_output.json`);

      const respBody = {
        codeVersion: "1",
        name: "lodash",
        code: `
        import * as lodash from 'lodash';
        export function transformBatch(events, metadata) {
            const modifiedEvents = events.map(event => {
              event.max = lodash.max([2,3,5,6,7,8]);
              event.min = lodash.min([-2,3,5,6,7,8]);
              return event;
            });
              return modifiedEvents;
            }
            `
      };

      respBody["versionId"] = versionId;
      const transformerUrl = `https://api.rudderlabs.com/transformation/getByVersionId?versionId=${versionId}`;
      when(fetch)
        .calledWith(transformerUrl)
        .mockResolvedValue({
          json: jest.fn().mockResolvedValue(respBody)
        });

      const lodashCode = `
        ${fs.readFileSync("./util/lodash-es-core.js", "utf8")};
        ;
        // Not exporting the unsupported functions
        export {${Object.keys(lodashCore).filter(
          funcName => !unsupportedFuncNames.includes(funcName)
        )}};
      `;

      const addCode = `export default function add(a, b) { return a + b; };"This is awesome!";`;
      const libraryUrl = `https://api.rudderlabs.com/transformationLibrary/getByVersionId?versionId=${libraryVersionId}`;
      when(fetch)
        .calledWith(libraryUrl)
        .mockResolvedValue({
          json: jest
            .fn()
            .mockResolvedValue({ code: lodashCode, name: "lodash" })
        });
      const output = await userTransformHandler(inputData, versionId, [
        libraryVersionId
      ]);
      expect(fetch).toHaveBeenCalledWith(
        `https://api.rudderlabs.com/transformation/getByVersionId?versionId=${versionId}`
      );

      expect(output).toEqual(expectedData);
    });

    it(`Simple ${name} Test for URLSearchParams library`, async () => {
      const versionId = randomID();
      const libraryVersionId = randomID();
      const inputData = require(`./data/${integration}_input.json`);
      const expectedData = require(`./data/${integration}_url_search_params_output.json`);

      const respBody = {
        code: `
        import url from 'url';
        export function transformBatch(events) {
            const modifiedEvents = events.map(event => {
              if(event.properties && event.properties.url){
                event.properties.client = new url.URLSearchParams(event.properties.url).get("client");
              }
              return event;
            });
              return modifiedEvents;
            }
            `,
        name: "url",
        codeVersion: "1"
      };
      respBody["versionId"] = versionId;
      const transformerUrl = `https://api.rudderlabs.com/transformation/getByVersionId?versionId=${versionId}`;
      when(fetch)
        .calledWith(transformerUrl)
        .mockResolvedValue({
          json: jest.fn().mockResolvedValue(respBody)
        });

      const urlCode = `${fs.readFileSync(
        "./util/url-search-params.min.js",
        "utf8"
      )};
      export default self;
      `;

      const libraryUrl = `https://api.rudderlabs.com/transformationLibrary/getByVersionId?versionId=${libraryVersionId}`;
      when(fetch)
        .calledWith(libraryUrl)
        .mockResolvedValue({
          json: jest.fn().mockResolvedValue({ code: urlCode, name: "url" })
        });

      const output = await userTransformHandler(inputData, versionId, [
        libraryVersionId
      ]);

      expect(fetch).toHaveBeenCalledWith(
        `https://api.rudderlabs.com/transformation/getByVersionId?versionId=${versionId}`
      );

      expect(output).toEqual(expectedData);
    });

    // Running timeout tests only for one possible env value to reduce time taken for tests
    if (envValue === "true") {
      describe("Timeout tests", () => {
        beforeEach(() => {});
        it(`Test for timeout for v0 transformation`, async () => {
          const versionId = randomID();
          const inputData = require(`./data/${integration}_input.json`);
          const respBody = {
            codeVersion: "0",
            name: name,
            code: `
            function transform(events) {
                while(true){

                }
                const modifiedEvents = events.map(event => {
                  if(event.properties && event.properties.url){
                    event.properties.client = new url.URLSearchParams(event.properties.url).get("client");
                  }
                  return event;
                });
                  return modifiedEvents;
                }
                `
          };
          fetch.mockResolvedValue({
            json: jest.fn().mockResolvedValue(respBody)
          });

          await expect(async () => {
            await userTransformHandler(inputData, versionId, []);
          }).rejects.toThrow("Timed out");

          expect(fetch).toHaveBeenCalledWith(
            `https://api.rudderlabs.com/transformation/getByVersionId?versionId=${versionId}`
          );
        });
        it(`Test for timeout for v1 transformEvent`, async () => {
          const versionId = randomID();
          const inputData = require(`./data/${integration}_input.json`);
          const respBody = {
            codeVersion: "1",
            name: name,
            code: `
            export function transformEvent(event) {
                while(true){

                }
                return event;
                }
                `
          };
          respBody["versionId"] = versionId;
          fetch.mockResolvedValue({
            json: jest.fn().mockResolvedValue(respBody)
          });

          await expect(async () => {
            await userTransformHandler([inputData[0]], versionId, []);
          }).rejects.toThrow();

          expect(fetch).toHaveBeenCalledWith(
            `https://api.rudderlabs.com/transformation/getByVersionId?versionId=${versionId}`
          );
        });
        it(`Test for timeout for v1 transformBatch`, async () => {
          const versionId = randomID();
          const inputData = require(`./data/${integration}_input.json`);
          const respBody = {
            codeVersion: "1",
            name: name,
            code: `

            export function transformBatch(events) {
                while(true){

                }
                return events;
                }
                `
          };
          respBody["versionId"] = versionId;
          fetch.mockResolvedValue({
            json: jest.fn().mockResolvedValue(respBody)
          });

          await expect(async () => {
            await userTransformHandler(inputData, versionId, []);
          }).rejects.toThrow();

          expect(fetch).toHaveBeenCalledWith(
            `https://api.rudderlabs.com/transformation/getByVersionId?versionId=${versionId}`
          );
        });
      });
    }
  });
});
