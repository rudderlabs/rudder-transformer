const { when } = require('jest-when')
jest.mock("node-fetch");
const fetch = require("node-fetch", () => jest.fn());
const { Response } = jest.requireActual("node-fetch");
const lodashCore = require("lodash/core");
const unsupportedFuncNames = [
  "_",
  "extend",
  "each",
  "first",
  "join",
  "reverse",
  "split"
];

const integration = "user_transformation";
const name = "User Transformations";

const fs = require("fs");
const path = require("path");

const randomID = () =>
  Math.random()
    .toString(36)
    .substring(2, 15);

const possibleEnvs = ["true", "false", "no_value", "some_random_value"];
possibleEnvs.forEach( envValue => {
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
      const { userTransformHandler } = require("../util/customTransformer");
      const inputData = require(`./data/${integration}_input.json`);
      const expectedData = require(`./data/${integration}_output.json`);
  
      const respBody = {
        codeVersion: '0',
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
  
    it(`Filtering ${name} Test`, async () => {
      const versionId = randomID();
      const { userTransformHandler } = require("../util/customTransformer");
      const inputData = require(`./data/${integration}_filter_input.json`);
      const expectedData = require(`./data/${integration}_filter_output.json`);
  
      const respBody = {
        codeVersion: '0',
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
      const { userTransformHandler } = require("../util/customTransformer");
      const inputData = require(`./data/${integration}_input.json`);
      const expectedData = require(`./data/${integration}_lodash_output.json`);
  
      const respBody = {
        codeVersion:'1',
        name:'lodash',
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
  
      respBody["versionId"] = versionId
      const transformerUrl = `https://api.rudderlabs.com/transformation/getByVersionId?versionId=${versionId}`
      when(fetch).calledWith(transformerUrl).mockResolvedValue({
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
      const libraryUrl = `https://api.rudderlabs.com/transformationLibrary/getByVersionId?versionId=${libraryVersionId}`
      when(fetch).calledWith(libraryUrl).mockResolvedValue({
        json: jest.fn().mockResolvedValue({"code":lodashCode,"name":"lodash"})
      });
      const output = await userTransformHandler(inputData, versionId, [libraryVersionId]);
      expect(fetch).toHaveBeenCalledWith(
        `https://api.rudderlabs.com/transformation/getByVersionId?versionId=${versionId}`
      );
  
      expect(output).toEqual(expectedData);
    });
  
    it(`Simple ${name} Test for URLSearchParams library`, async () => {
      const versionId = randomID();
      const libraryVersionId = randomID();
      const { userTransformHandler } = require("../util/customTransformer");
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
        name:"url",
        codeVersion: '1'
      };
      respBody["versionId"] = versionId
      const transformerUrl = `https://api.rudderlabs.com/transformation/getByVersionId?versionId=${versionId}`
      when(fetch).calledWith(transformerUrl).mockResolvedValue({
        json: jest.fn().mockResolvedValue(respBody)
      });
  
      const urlCode = `${fs.readFileSync("./util/url-search-params.min.js", "utf8")};
      export default self;
      `;
  
      const libraryUrl = `https://api.rudderlabs.com/transformationLibrary/getByVersionId?versionId=${libraryVersionId}`
      when(fetch).calledWith(libraryUrl).mockResolvedValue({
        json: jest.fn().mockResolvedValue({"code":urlCode,"name":"url"})
      });
  
      const output = await userTransformHandler(inputData, versionId, [libraryVersionId]);
  
      expect(fetch).toHaveBeenCalledWith(
        `https://api.rudderlabs.com/transformation/getByVersionId?versionId=${versionId}`
      );
  
      expect(output).toEqual(expectedData);
    });
  
    it(`Test for timeout for v0 transformation`, async () => {
      const versionId = randomID();
      const { userTransformHandler } = require("../util/customTransformer");
      const inputData = require(`./data/${integration}_input.json`);
      const respBody = {
        codeVersion: '0',
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
      const { userTransformHandler } = require("../util/customTransformer");
      const inputData = require(`./data/${integration}_input.json`);
      const respBody = {
        codeVersion: '1',
        name: name,
        code: `
        export function transformEvent(event) {
            while(true){
  
            }
            return event;
            }
            `
      };
      respBody["versionId"] = versionId
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
      const { userTransformHandler } = require("../util/customTransformer");
      const inputData = require(`./data/${integration}_input.json`);
      const respBody = {
        codeVersion: '1',
        name: name,
        code: `
  
        export function transformBatch(events) {
            while(true){
  
            }
            return events;
            }
            `
      };
      respBody["versionId"] = versionId
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

});

