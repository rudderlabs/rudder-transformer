const { when } = require("jest-when");
jest.mock("node-fetch");
const fetch = require("node-fetch", () => jest.fn());

const axios = require("axios");
jest.mock("axios", () => ({
  ...jest.requireActual("axios"),
  get: jest.fn(),
  post: jest.fn(),
  delete: jest.fn(),
}));

const { generateFunctionName } = require('../../src/util/customTransformer-faas.js');
const { Response, Headers } = jest.requireActual("node-fetch");
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
const integration = "user_transformation";
const name = "User Transformations";

const util = require("util");
const fs = require("fs");
const crypto = require('crypto');
const path = require("path");
const {
  userTransformHandler,
  setupUserTransformHandler
} = require("../../src/util/customTransformer");
const { parserForImport } = require("../../src/util/parser");
const { RetryRequestError, RespStatusError } = require("../../src/util/utils");
const { buildOpenfaasFn, setFunctionInCache, invalidateFnCache } = require("../../src/util/openfaas/index");

const OPENFAAS_GATEWAY_URL = "http://localhost:8080";
const defaultBasicAuth = {
  "username": "",
  "password": ""
};

const randomID = () =>
  Math.random()
    .toString(36)
    .substring(2, 15);

const headers = {
  "Content-Type": "application/json",
  Accept: "*/*"
};
const responseInit = url => {
  return {
    status: 200,
    headers,
    url
  };
};

const pyTrRevCode = (versionId, imports=[]) => {
  return {
    codeVersion: "1",
    language: "pythonfaas",
    testName: "pytest",
    code: `
      def transformEvent(event, metadata):
        return event
    `,
    workspaceId: "workspaceId",
    versionId,
    imports
  };
};

const pyLibCode = (name, versionId) => {
  return {
    code: `
      def add(a, b):
        return a + b
    `,
    language: "pythonfaas",
    name,
    handleName: _.camelCase(name),
    workspaceId: "workspaceId",
    versionId
  }
}

const pyfaasFuncName = (workspaceId, versionId, libraryVersionIds=[], hashSecret="") => {
  let ids = [workspaceId, versionId].concat(libraryVersionIds.sort());
  ids = ids.concat(["default", "default"]);
  if (hashSecret !== "") {
    ids = ids.concat([hashSecret]);
  }

  const hash = crypto.createHash('md5').update(`${ids}`).digest('hex');

  return `fn-${workspaceId}-${hash}`
    .substring(0, 63)
    .toLowerCase();
};

const getfetchResponse = (resp, url) =>
  new Response(
    typeof resp === "object" ? JSON.stringify(resp) : resp,
    responseInit(url)
  );

let importNameLibraryVersionIdsMap;

describe("User transformation utils", () => {

  it("generates the openfaas-fn name correctly", () => {
    const fnName = generateFunctionName(
      {workspaceId: 'workspaceId', transformationId: 'transformationId'},
      [],
      false,
      'hash-secret');
    expect(fnName).toEqual('fn-workspaceid-91d66b4cea6f0ed16cd41258d138d0a8');
  });

});

describe("User transformation", () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });
  afterAll(() => {});

  it(`Simple ${name} Test`, async () => {
    const versionId = randomID();

    const inputData = require(`./data/${integration}_input.json`);
    const expectedData = require(`./data/${integration}_output.json`);

    const respBody = {
      codeVersion: "0",
      name,
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
      status: 200,
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
      name,
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
      status: 200,
      json: jest.fn().mockResolvedValue(respBody)
    });

    const output = await userTransformHandler(inputData, versionId, []);
    expect(fetch).toHaveBeenCalledWith(
      `https://api.rudderlabs.com/transformation/getByVersionId?versionId=${versionId}`
    );

    expect(output).toEqual(expectedData);
  });

  it(`Simple async ${name} FetchV2 Test for V0 transformation`, async () => {
    const versionId = randomID();
    const inputData = require(`./data/${integration}_input.json`);

    const respBody = {
      codeVersion: "0",
      name,
      code: `
      async function transform(events) {
        const filteredEvents = [];
        await Promise.all(events.map(async (event) => {
          try {
            const res = await fetchV2('https://api.rudderlabs.com/dummyUrl');
            filteredEvents.push(res);
          } catch (err) {
            filteredEvents.push(err);
          }
        }));
          return filteredEvents;
      }
      `
    };
    const transformerUrl = `https://api.rudderlabs.com/transformation/getByVersionId?versionId=${versionId}`;
    when(fetch)
      .calledWith(transformerUrl)
      .mockResolvedValue({
        status: 200,
        json: jest.fn().mockResolvedValue(respBody)
      });

    const dummyUrl = `https://api.rudderlabs.com/dummyUrl`;
    const jsonResponse = { type: "json" };
    const textResponse = "200 OK";
    when(fetch)
      .calledWith(dummyUrl)
      .mockResolvedValueOnce(getfetchResponse(jsonResponse, dummyUrl))
      .mockResolvedValueOnce(getfetchResponse(textResponse, dummyUrl))
      .mockRejectedValue(new Error("Timed Out"));

    const output = await userTransformHandler(inputData, versionId, []);
    expect(fetch).toHaveBeenCalledWith(transformerUrl);
    expect(fetch).toHaveBeenCalledWith(dummyUrl);

    expect(output[0].transformedEvent.body).toEqual(jsonResponse);
    expect(output[1].transformedEvent.body).toEqual(textResponse);
    expect(output[2].transformedEvent.message).toEqual("Timed Out");
  });

  it(`Simple ${name} async fetchV2 test for V1 transformation - transformEvent`, async () => {
    const versionId = randomID();
    const inputData = require(`./data/${integration}_input.json`);

    const respBody = {
      code: `
      export async function transformEvent(event, metadata) {
          try{
            const res = await fetchV2('https://api.rudderlabs.com/dummyUrl');
            return res;
          } catch (err) {
            return err;
          }
        }
          `,
      name: "url",
      codeVersion: "1"
    };
    respBody.versionId = versionId;
    const transformerUrl = `https://api.rudderlabs.com/transformation/getByVersionId?versionId=${versionId}`;
    when(fetch)
      .calledWith(transformerUrl)
      .mockResolvedValue({
        status: 200,
        json: jest.fn().mockResolvedValue(respBody)
      });

    const dummyUrl = `https://api.rudderlabs.com/dummyUrl`;
    const jsonResponse = { type: "json" };
    const textResponse = "200 OK";
    when(fetch)
      .calledWith(dummyUrl)
      .mockResolvedValueOnce(getfetchResponse(jsonResponse, dummyUrl))
      .mockResolvedValueOnce(getfetchResponse(textResponse, dummyUrl))
      .mockRejectedValue(new Error("Timed Out"));

    const output = await userTransformHandler(inputData, versionId, []);
    expect(fetch).toHaveBeenCalledWith(transformerUrl);
    expect(fetch).toHaveBeenCalledWith(dummyUrl);

    expect(output[0].transformedEvent.body).toEqual(jsonResponse);
    expect(output[1].transformedEvent.body).toEqual(textResponse);
    expect(output[2].transformedEvent.message).toEqual("Timed Out");
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
    respBody.versionId = versionId;
    const transformerUrl = `https://api.rudderlabs.com/transformation/getByVersionId?versionId=${versionId}`;
    when(fetch)
      .calledWith(transformerUrl)
      .mockResolvedValue({
        status: 200,
        json: jest.fn().mockResolvedValue(respBody)
      });

    const urlCode = `${fs.readFileSync(
      path.resolve(__dirname, "../../src/util/url-search-params.min.js"),
      "utf8"
    )};
    export default self;
    `;

    const libraryUrl = `https://api.rudderlabs.com/transformationLibrary/getByVersionId?versionId=${libraryVersionId}`;
    when(fetch)
      .calledWith(libraryUrl)
      .mockResolvedValue({
        status: 200,
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
    respBody.versionId = versionId;
    const transformerUrl = `https://api.rudderlabs.com/transformation/getByVersionId?versionId=${versionId}`;
    when(fetch)
      .calledWith(transformerUrl)
      .mockResolvedValue({
        status: 200,
        json: jest.fn().mockResolvedValue(respBody)
      });

    const urlCode = `${fs.readFileSync(
      path.resolve(__dirname, "../../src/util/url-search-params.min.js"),
      "utf8"
    )};
    export default self;
    `;

    const libraryUrl = `https://api.rudderlabs.com/transformationLibrary/getByVersionId?versionId=${libraryVersionId}`;
    when(fetch)
      .calledWith(libraryUrl)
      .mockResolvedValue({
        status: 200,
        json: jest.fn().mockResolvedValue({ code: urlCode, name: "url" })
      });

    const output = await userTransformHandler(inputData, versionId, [
      libraryVersionId
    ]);

    expect(fetch).toHaveBeenCalledWith(
      `https://api.rudderlabs.com/transformation/getByVersionId?versionId=${versionId}`
    );

    const x = _.cloneDeep(expectedData);
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
    respBody.versionId = versionId;
    const transformerUrl = `https://api.rudderlabs.com/transformation/getByVersionId?versionId=${versionId}`;
    when(fetch)
      .calledWith(transformerUrl)
      .mockResolvedValue({
        status: 200,
        json: jest.fn().mockResolvedValue(respBody)
      });

    const urlCode = `${fs.readFileSync(
      path.resolve(__dirname, "../../src/util/url-search-params.min.js"),
      "utf8"
    )};
    export default self;
    `;

    const libraryUrl = `https://api.rudderlabs.com/transformationLibrary/getByVersionId?versionId=${libraryVersionId}`;
    when(fetch)
      .calledWith(libraryUrl)
      .mockResolvedValue({
        status: 200,
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
    respBody.versionId = versionId;
    const transformerUrl = `https://api.rudderlabs.com/transformation/getByVersionId?versionId=${versionId}`;
    when(fetch)
      .calledWith(transformerUrl)
      .mockResolvedValue({
        status: 200,
        json: jest.fn().mockResolvedValue(respBody)
      });

    const urlCode = `${fs.readFileSync(
      path.resolve(__dirname, "../../src/util/url-search-params.min.js"),
      "utf8"
    )};
    export default self;
    `;

    const libraryUrl = `https://api.rudderlabs.com/transformationLibrary/getByVersionId?versionId=${libraryVersionId}`;
    when(fetch)
      .calledWith(libraryUrl)
      .mockResolvedValue({
        status: 200,
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
    respBody.versionId = versionId;
    const transformerUrl = `https://api.rudderlabs.com/transformation/getByVersionId?versionId=${versionId}`;
    when(fetch)
      .calledWith(transformerUrl)
      .mockResolvedValue({
        status: 200,
        json: jest.fn().mockResolvedValue(respBody)
      });

    const urlCode = `${fs.readFileSync(
      path.resolve(__dirname, "../../src/util/url-search-params.min.js"),
      "utf8"
    )};
    export default self;
    `;

    const libraryUrl = `https://api.rudderlabs.com/transformationLibrary/getByVersionId?versionId=${libraryVersionId}`;
    when(fetch)
      .calledWith(libraryUrl)
      .mockResolvedValue({
        status: 200,
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
    respBody.versionId = versionId;
    const transformerUrl = `https://api.rudderlabs.com/transformation/getByVersionId?versionId=${versionId}`;
    when(fetch)
      .calledWith(transformerUrl)
      .mockResolvedValue({
        status: 200,
        json: jest.fn().mockResolvedValue(respBody)
      });

    const urlCode = `${fs.readFileSync(
      path.resolve(__dirname, "../../src/util/url-search-params.min.js"),
      "utf8"
    )};
    export default self;
    `;

    const libraryUrl = `https://api.rudderlabs.com/transformationLibrary/getByVersionId?versionId=${libraryVersionId}`;
    when(fetch)
      .calledWith(libraryUrl)
      .mockResolvedValue({
        status: 200,
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
    respBody.versionId = versionId;
    const transformerUrl = `https://api.rudderlabs.com/transformation/getByVersionId?versionId=${versionId}`;
    when(fetch)
      .calledWith(transformerUrl)
      .mockResolvedValue({
        status: 200,
        json: jest.fn().mockResolvedValue(respBody)
      });

    const urlCode = `${fs.readFileSync(
      path.resolve(__dirname, "../../src/util/url-search-params.min.js"),
      "utf8"
    )};
    export default self;
    `;

    const libraryUrl = `https://api.rudderlabs.com/transformationLibrary/getByVersionId?versionId=${libraryVersionId}`;
    when(fetch)
      .calledWith(libraryUrl)
      .mockResolvedValue({
        status: 200,
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
      name,
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
      status: 200,
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

    respBody.versionId = versionId;
    const transformerUrl = `https://api.rudderlabs.com/transformation/getByVersionId?versionId=${versionId}`;
    when(fetch)
      .calledWith(transformerUrl)
      .mockResolvedValue({
        status: 200,
        json: jest.fn().mockResolvedValue(respBody)
      });

    const lodashCode = `
      ${fs.readFileSync(
        path.resolve(__dirname, "../../src/util/lodash-es-core.js"),
        "utf8"
      )};
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
        status: 200,
        json: jest.fn().mockResolvedValue({ code: lodashCode, name: "lodash" })
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
    respBody.versionId = versionId;
    const transformerUrl = `https://api.rudderlabs.com/transformation/getByVersionId?versionId=${versionId}`;
    when(fetch)
      .calledWith(transformerUrl)
      .mockResolvedValue({
        status: 200,
        json: jest.fn().mockResolvedValue(respBody)
      });
    const urlCode = `${fs.readFileSync(
      path.resolve(__dirname, "../../src/util/url-search-params.min.js"),
      "utf8"
    )};
    export default self;
    `;

    const libraryUrl = `https://api.rudderlabs.com/transformationLibrary/getByVersionId?versionId=${libraryVersionId}`;
    when(fetch)
      .calledWith(libraryUrl)
      .mockResolvedValue({
        status: 200,
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

  it(`Simple ${name} Test for library parser`, async () => {
    const outputImport = {
      "@angular2/core": ["Component"],
      "module-name1": ["defaultMember"],
      "module-name2": [],
      "module-name3": ["member"],
      "module-name4": ["member"],
      "module-name5": ["member1", "member2"],
      "module-name6": ["member1", "member2", "member3"],
      "module-name7": ["defaultMember", "member", "member"]
    };

    const code = `
      import { Component } from '@angular2/core';
      import defaultMember from \n"module-name1"; 
      import   *    as name from "module-name2  ";
      import   {  member }   from "  module-name3"; 
      import { member as alias } \nfrom "module-name4"; 
      import { \n   member1 , \n    member2 \n} from "module-name5"; 
      import { member1 , member2 as alias2 , member3 as alias3 } from "module-name6"; 
      import defaultMember, { member, member } from "module-name7";
    `;
    const output = await parserForImport(code);

    expect(output).toEqual(outputImport);
  });

  it(`Simple ${name} Test for invalid library import error`, async () => {
    const versionId = randomID();
    const libraryVersionId = randomID();
    const inputData = require(`./data/${integration}_input.json`);

    const respBody = {
      code: `
      import { add } from 'addLib';
      import { sub } from 'somelib';
      export async function transformEvent(event, metadata) {
          event.add = add(1, 2);
          event.sub = sub(1, 2);
          return event;
        }
        `,
      name: "import from non existing library",
      codeVersion: "1"
    };
    respBody.versionId = versionId;
    const transformerUrl = `https://api.rudderlabs.com/transformation/getByVersionId?versionId=${versionId}`;
    when(fetch)
      .calledWith(transformerUrl)
      .mockResolvedValue({
        status: 200,
        json: jest.fn().mockResolvedValue(respBody)
      });

    const addLibCode = `
    export function add(a, b) {
      return a + b;
    }
    `;

    const libraryUrl = `https://api.rudderlabs.com/transformationLibrary/getByVersionId?versionId=${libraryVersionId}`;
    when(fetch)
      .calledWith(libraryUrl)
      .mockResolvedValue({
        status: 200,
        json: jest.fn().mockResolvedValue({ code: addLibCode, name: "addLib" })
      });

    await expect(async () => {
      await userTransformHandler(inputData, versionId, [libraryVersionId]);
    }).rejects.toThrow("import from somelib failed. Module not found.");
  });

  it(`Simple ${name} async test for V1 transformation code`, async () => {
    const libraryVersionId = randomID();
    const inputData = require(`./data/${integration}_input.json`);
    const expectedData = require(`./data/${integration}_code_test_output.json`);

    const trRevCode = {
      code: `
        import url from 'url';
        async function foo() {
          return 'resolved';
        }
        export async function transformEvent(event, metadata) {
            const pr = await foo();
            log('Transformation test');
            if(event.properties && event.properties.url){
              const x = new url.URLSearchParams(event.properties.url).get("client");
            }
            event.promise = pr;
            return event;
          }
      `,
      codeVersion: "1",
      versionId: "testVersionId"
    };

    const urlCode = `${fs.readFileSync(
      path.resolve(__dirname, "../../src/util/url-search-params.min.js"),
      "utf8"
    )};
    export default self;
    `;

    const libraryUrl = `https://api.rudderlabs.com/transformationLibrary/getByVersionId?versionId=${libraryVersionId}`;
    when(fetch)
      .calledWith(libraryUrl)
      .mockResolvedValue({
        status: 200,
        json: jest.fn().mockResolvedValue({ code: urlCode, name: "url" })
      });

    const output = await userTransformHandler(
      inputData,
      trRevCode.versionId,
      [libraryVersionId],
      trRevCode,
      true
    );

    expect(fetch).toHaveBeenCalledWith(libraryUrl);

    expect(output).toEqual(expectedData);
  });

  it(`Simple async ${name} Test for V0 transformation code`, async () => {
    const inputData = require(`./data/${integration}_input.json`);
    const expectedData = require(`./data/${integration}_code_test_output.json`);

    const trRevCode = {
      codeVersion: "0",
      code: `
        async function foo() {
          return 'resolved';
        }
        async function transform(events) {
          const pr = await foo();
          const filteredEvents = events.map(event => {
            log('Transformation test');
            event.promise = pr;
            return event;
          });
          return filteredEvents;
        }
      `,
      versionId: "testVersionId"
    };

    const output = await userTransformHandler(
      inputData,
      trRevCode.versionId,
      [],
      trRevCode,
      true
    );
    expect(output).toEqual(expectedData);
  });

  describe("UserTransformation With Credentials for code version 1", () => {
    it(`successfully executes transformation with credential lookup with valid key`, async () => {
      const versionId = randomID();

      const inputData = require(`./data/${integration}_input_credentials.json`);

      const respBody = {
        versionId: versionId,
        codeVersion: "1",
        name,
        code: `
          export function transformEvent(event, metadata) {
              event.credentialValue = getCredential('key1');
              return event;
            }
            `
      };
      fetch.mockResolvedValue({
        status: 200,
        json: jest.fn().mockResolvedValue(respBody)
      });

      const output = await userTransformHandler(inputData, versionId, []);
      expect(fetch).toHaveBeenCalledWith(
        `https://api.rudderlabs.com/transformation/getByVersionId?versionId=${versionId}`
      );
      expect(output[0].transformedEvent.credentialValue).toEqual("value1");
    });

    it(`throws TypeError if the key provided for credential lookup is null or undefined`, async () => {
      const versionId = randomID();

      const inputData = require(`./data/${integration}_input_credentials.json`);

      const respBody = {
        versionId: versionId,
        codeVersion: "1",
        name,
        code: `
          export function transformEvent(event, metadata) {
              event.credentialValue = getCredential();
              return event;
            }
            `
      };
      fetch.mockResolvedValue({
        status: 200,
        json: jest.fn().mockResolvedValue(respBody)
      });

      const output = await userTransformHandler(inputData, versionId, []);
      
      expect(fetch).toHaveBeenCalledWith(
        `https://api.rudderlabs.com/transformation/getByVersionId?versionId=${versionId}`
      );
      expect(output[0].error).toMatch(/Key should be valid and defined/);
    });

    it(`allows user to pass multiple arguments to functions and performs lookup with first key passed`, async () => {
      const versionId = randomID();

      const inputData = require(`./data/${integration}_input_credentials.json`);

      const respBody = {
        versionId: versionId,
        codeVersion: "1",
        name,
        code: `
          export function transformEvent(event, metadata) {
              event.credentialValue = getCredential('key1', 'key2');
              return event;
            }
            `
      };
      fetch.mockResolvedValue({
        status: 200,
        json: jest.fn().mockResolvedValue(respBody)
      });

      const output = await userTransformHandler(inputData, versionId, []);
      
      expect(fetch).toHaveBeenCalledWith(
        `https://api.rudderlabs.com/transformation/getByVersionId?versionId=${versionId}`
      );
      expect(output[0].transformedEvent.credentialValue).toEqual("value1");
    });

    it(`allows user to pass valid key of any type and performs lookup accordingly`, async () => {
      const versionId = randomID();

      const inputData = require(`./data/${integration}_input_credentials.json`);

      const respBody = {
        versionId: versionId,
        codeVersion: "1",
        name,
        code: `
          export function transformEvent(event, metadata) {
              event.credentialValueForNumkey = getCredential(1);
              event.credentialValueForBoolkey = getCredential(true);
              event.credentialValueForArraykey = getCredential([]);
              event.credentialValueForObjkey = getCredential({});
              return event;
            }
            `
      };
      fetch.mockResolvedValue({
        status: 200,
        json: jest.fn().mockResolvedValue(respBody)
      });

      const output = await userTransformHandler(inputData, versionId, []);
      
      expect(fetch).toHaveBeenCalledWith(
        `https://api.rudderlabs.com/transformation/getByVersionId?versionId=${versionId}`
      );
      expect(output[0].transformedEvent.credentialValueForNumkey).toBeUndefined();
      expect(output[0].transformedEvent.credentialValueForBoolkey).toBeUndefined();
      expect(output[0].transformedEvent.credentialValueForArraykey).toBeUndefined();
      expect(output[0].transformedEvent.credentialValueForObjkey).toBeUndefined();
    });

    it(`returns undefined when the key doesn't match any credential lookup`, async () => {
      const versionId = randomID();

      const inputData = require(`./data/${integration}_input_credentials.json`);

      const respBody = {
        versionId: versionId,
        codeVersion: "1",
        name,
        code: `
          export function transformEvent(event, metadata) {
              event.credentialValue = getCredential('key3');
              return event;
            }
            `
      };
      fetch.mockResolvedValue({
        status: 200,
        json: jest.fn().mockResolvedValue(respBody)
      });

      const output = await userTransformHandler(inputData, versionId, []);
      
      expect(fetch).toHaveBeenCalledWith(
        `https://api.rudderlabs.com/transformation/getByVersionId?versionId=${versionId}`
      );
      expect(output[0].transformedEvent.credentialValue).toBeUndefined();
    });

    it(`returns undefined when the credentials are not passed in the request`, async () => {
      const versionId = randomID();

      const inputData = require(`./data/${integration}_input.json`);

      const respBody = {
        versionId: versionId,
        codeVersion: "1",
        name,
        code: `
          export function transformEvent(event, metadata) {
              event.credentialValue = getCredential('key1');
              return event;
            }
            `
      };
      fetch.mockResolvedValue({
        status: 200,
        json: jest.fn().mockResolvedValue(respBody)
      });

      const output = await userTransformHandler(inputData, versionId, []);
      
      expect(fetch).toHaveBeenCalledWith(
        `https://api.rudderlabs.com/transformation/getByVersionId?versionId=${versionId}`
      );
      expect(output[0].transformedEvent.credentialValue).toBeUndefined();
    });

    describe('Batch UserTransformation with Credentials', () => {
      it(`successfully executes transformation with credential lookup with valid key`, async () => {
        const versionId = randomID();

        const inputData = require(`./data/${integration}_input_credentials.json`);

        const respBody = {
          versionId: versionId,
          codeVersion: "1",
          name,
          code: `
            export function transformBatch(events, metadata) {
              events.forEach((event) => {
                event.credentialValue1 = getCredential("key1");
                event.credentialValue2 = getCredential("key3");
              });
              return events;
            }
            `
        };
        fetch.mockResolvedValue({
          status: 200,
          json: jest.fn().mockResolvedValue(respBody)
        });

        const output = await userTransformHandler(inputData, versionId, []);
        expect(fetch).toHaveBeenCalledWith(
          `https://api.rudderlabs.com/transformation/getByVersionId?versionId=${versionId}`
        );
        expect(output[0].transformedEvent.credentialValue1).toEqual("value1");
        expect(output[0].transformedEvent.credentialValue2).toBeUndefined();
      });

      it(`throws TypeError if the key provided for credential lookup is null or undefined`, async () => {
        const versionId = randomID();

        const inputData = require(`./data/${integration}_input_credentials.json`);

        const respBody = {
          versionId: versionId,
          codeVersion: "1",
          name,
          code: `
            export function transformBatch(events, metadata) {
              events.forEach((event) => {
                event.credentialValue = getCredential();
              });
              return events;
            }
            `
        };
        fetch.mockResolvedValue({
          status: 200,
          json: jest.fn().mockResolvedValue(respBody)
        });

        const output = await userTransformHandler(inputData, versionId, []);
        expect(fetch).toHaveBeenCalledWith(
          `https://api.rudderlabs.com/transformation/getByVersionId?versionId=${versionId}`
        );
        expect(output[0].error).toMatch(/Key should be valid and defined/);
      });

    });

    it(`throws error when credentials function is used with code version 0`, async () => {
      const versionId = randomID();

      const inputData = require(`./data/${integration}_input_credentials.json`);

      const respBody = {
        versionId: versionId,
        codeVersion: "0",
        name,
        code: `
          function transform(events) {
            events.forEach((event) => {
              event.credentialValue = getCredential('key1');
            });
            return events;
          }
          `
      };
      fetch.mockResolvedValue({
        status: 200,
        json: jest.fn().mockResolvedValue(respBody)
      });  
      try {
        await userTransformHandler(inputData, versionId, []);
      } catch (e) {
        expect(e).toEqual('getCredential is not defined');
      }
    });
  });
});

// Running timeout tests
describe("Timeout tests", () => {
  beforeEach(() => {});
  it(`Test for timeout for v0 transformation`, async () => {
    const versionId = randomID();
    const inputData = require(`./data/${integration}_input.json`);
    const respBody = {
      codeVersion: "0",
      name,
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
      status: 200,
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
      name,
      code: `
      export function transformEvent(event) {
          while(true){

          }
          return event;
          }
          `
    };
    respBody.versionId = versionId;
    fetch.mockResolvedValue({
      status: 200,
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
      name,
      code: `

      export function transformBatch(events) {
          while(true){

          }
          return events;
          }
          `
    };
    respBody.versionId = versionId;
    fetch.mockResolvedValue({
      status: 200,
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

describe("Rudder library tests", () => {
  beforeEach(() => {});
  it(`Simple ${name} async test for V1 transformation - with rudder library urlParser `, async () => {
    const versionId = randomID();
    const rudderLibraryImportName = '@rs/urlParser/v1';
    const [name, version] = rudderLibraryImportName.split('/').slice(-2);
    const inputData = require(`./data/${integration}_input_large.json`);
    const expectedData = require(`./data/${integration}_async_output_large.json`);

    const respBody = {
      code: `
      import url from '@rs/urlParser/v1';
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
      name: "urlParser",
      codeVersion: "1"
    };
    respBody.versionId = versionId;
    const transformerUrl = `https://api.rudderlabs.com/transformation/getByVersionId?versionId=${versionId}`;
    when(fetch)
      .calledWith(transformerUrl)
      .mockResolvedValue({
        status: 200,
        json: jest.fn().mockResolvedValue(respBody)
      });

    const urlCode = `${fs.readFileSync(
      path.resolve(__dirname, "../../src/util/url-search-params.min.js"),
      "utf8"
    )};
    export default self;
    `;

    const rudderLibraryUrl = `https://api.rudderlabs.com/rudderstackTransformationLibraries/${name}?version=${version}`;
    when(fetch)
      .calledWith(rudderLibraryUrl)
      .mockResolvedValue({
        status: 200,
        json: jest.fn().mockResolvedValue({ code: urlCode, name: "urlParser", importName: rudderLibraryImportName })
      });

    const output = await userTransformHandler(inputData, versionId, []);

    expect(fetch).toHaveBeenCalledWith(
      `https://api.rudderlabs.com/transformation/getByVersionId?versionId=${versionId}`
    );

    expect(output).toEqual(expectedData);
  });
});

// tests for geolocation function
describe("Geolocation function", () => {
  const OLD_ENV = process.env;
  beforeEach(() => {
    jest.resetModules();
    process.env = { ...OLD_ENV };
    process.env.GEOLOCATION_URL = "https://dummyUrl.com";
  });
  afterAll(() => {
    process.env = OLD_ENV; // restore old env
  });

  const respBodyV1 = {
    code: `
      export async function transformEvent(event, metadata) {
        try {
          event.context.geo = await geolocation(event.request_ip);
        } catch (err) {
          event.context.geoerror = err.message;
        }
        return event;
      }`,
    name: "geotest",
    codeVersion: "1"
  };
  const geoResp = {
    country: "US",
    region: "CA",
    city: "San Francisco",
  };

  it("Should throw error if GEOLOCATION_URL is not set", async () => {
    process.env.GEOLOCATION_URL = undefined;
    const versionId = randomID();
    const inputData = require(`./data/${integration}_input.json`);
    const transformerUrl = `https://api.rudderlabs.com/transformation/getByVersionId?versionId=${versionId}`;
    when(fetch)
      .calledWith(transformerUrl)
      .mockResolvedValue({
        status: 200,
        json: jest.fn().mockResolvedValue({ ...respBodyV1, versionId })
      });

    const output = await userTransformHandler(inputData, versionId, []);
    expect(output[0].transformedEvent.context.geoerror).toBe("geolocation is not available right now");
  });

  it("Should throw error when geo request fails with invalid arg", async () => {
    const versionId = randomID();
    const inputData = require(`./data/${integration}_input.json`);
    inputData.forEach((input) => { input.message.request_ip = "invalid"; });
    const transformerUrl = `https://api.rudderlabs.com/transformation/getByVersionId?versionId=${versionId}`;
    when(fetch)
      .calledWith(transformerUrl)
      .mockResolvedValue({
        status: 200,
        json: jest.fn().mockResolvedValue({ ...respBodyV1, versionId })
      });
    when(fetch)
      .calledWith("https://dummyUrl.com/geoip/invalid", { timeout: 1000 })
      .mockResolvedValue({ status: 400 });

    const output = await userTransformHandler(inputData, versionId, []);
    expect(output[0].transformedEvent.context.geoerror).toBe("request to fetch geolocation failed with status code: 400");
  });

  it("Should enrich context when geo request succeedes", async () => {
    const versionId = randomID();
    const inputData = require(`./data/${integration}_input.json`);
    inputData.forEach((input) => { input.message.request_ip = "1.1.1.1"; });

    const transformerUrl = `https://api.rudderlabs.com/transformation/getByVersionId?versionId=${versionId}`;
    when(fetch)
      .calledWith(transformerUrl)
      .mockResolvedValue({
        status: 200,
        json: jest.fn().mockResolvedValue({ ...respBodyV1, versionId })
      });
    when(fetch)
      .calledWith("https://dummyUrl.com/geoip/1.1.1.1", { timeout: 1000 })
      .mockResolvedValue({
        status: 200,
        json: jest.fn().mockResolvedValue(geoResp)
      });

    const output = await userTransformHandler(inputData, versionId, []);
    expect(output[0].transformedEvent.context.geo).toEqual(geoResp);
  });

  it("Should enrich context when geo request succeedes - V0 transformation", async () => {
    const versionId = randomID();
    const inputData = require(`./data/${integration}_input.json`);
    inputData.forEach((input) => { input.message.request_ip = "1.1.1.1"; });

    const respBody = {
      code: `
        async function transform(events, metadata) {
          await Promise.all(events.map(async (event) => {
            try {
              event.context.geo = await geolocation(event.request_ip);
            } catch (err) {
              event.context.geoerror = err.message;
            }
          }));
          return events;
        }`,
      name: "geotest",
      codeVersion: "0"
    };

    const transformerUrl = `https://api.rudderlabs.com/transformation/getByVersionId?versionId=${versionId}`;
    when(fetch)
      .calledWith(transformerUrl)
      .mockResolvedValue({
        status: 200,
        json: jest.fn().mockResolvedValue({ ...respBody, versionId })
      });
    when(fetch)
      .calledWith("https://dummyUrl.com/geoip/1.1.1.1", { timeout: 1000 })
      .mockResolvedValue({
        status: 200,
        json: jest.fn().mockResolvedValue(geoResp)
      });

    const output = await userTransformHandler(inputData, versionId, []);
    expect(output[0].transformedEvent.context.geo).toEqual(geoResp);
  });
});

// Running tests for python transformations with openfaas mocks
describe("Python transformations", () => {
  beforeEach(() => {
    invalidateFnCache();
    jest.resetAllMocks();
  });
  afterAll(() => {});

  it("Setting up function - creates faas function", async () => {
    const trRevCode = pyTrRevCode("123");
    const funcName = pyfaasFuncName(trRevCode.workspaceId, trRevCode.versionId);

    const expectedData = { success: true, publishedVersion: funcName };

    axios.post.mockResolvedValue({});
    axios.get.mockResolvedValue({});

    const output = await setupUserTransformHandler([], trRevCode);
    expect(output).toEqual(expectedData);
    expect(axios.post).toHaveBeenCalledTimes(1);
    expect(axios.post).toHaveBeenCalledWith(
      `${OPENFAAS_GATEWAY_URL}/system/functions`,
      expect.objectContaining({ name: funcName, service: funcName }),
      { auth: defaultBasicAuth },
    );
    expect(axios.get).toHaveBeenCalledTimes(1);
    expect(axios.get).toHaveBeenCalledWith(
      `${OPENFAAS_GATEWAY_URL}/function/${funcName}`,
      {"headers": {"X-REQUEST-TYPE": "HEALTH-CHECK"}},
      { auth: defaultBasicAuth },
    );
  });

  it("Setting up function - returns cached function if exists", async () => {
    const trRevCode = pyTrRevCode("123");
    const funcName = pyfaasFuncName(trRevCode.workspaceId, trRevCode.versionId);

    const expectedData = { success: true, publishedVersion: funcName };

    setFunctionInCache(funcName);
    const output = await setupUserTransformHandler([], trRevCode);
    expect(output).toEqual(expectedData);
    expect(axios.post).toHaveBeenCalledTimes(0);
    expect(axios.get).toHaveBeenCalledTimes(0);
  });

  it("Setting up function - retry request on faas function deployement exists", async () => {
    const trRevCode = pyTrRevCode(randomID());

    axios.post.mockRejectedValue({
      response: { status: 500, data: 'unable create Deployment: deployments.apps "fn-ast" already exists' }
    });

    await expect(async () => {
      await setupUserTransformHandler([], trRevCode);
    }).rejects.toThrow(RetryRequestError);

    // function gets cached on already exists error
    const funcName = pyfaasFuncName(trRevCode.workspaceId, trRevCode.versionId);
    const expectedData = { success: true, publishedVersion: funcName };

    const output = await setupUserTransformHandler([], trRevCode);
    expect(output).toEqual(expectedData);
  });

  it("Setting up function - retry request on faas function service exists", async () => {
    const trRevCode = pyTrRevCode(randomID());

    axios.post.mockRejectedValue({
      response: { status: 400, data: 'failed create Service: services "fn-function" already exists' }
    });

    await expect(async () => {
      await setupUserTransformHandler([], trRevCode);
    }).rejects.toThrow(RetryRequestError);

    // function gets cached on already exists error
    const funcName = pyfaasFuncName(trRevCode.workspaceId, trRevCode.versionId);
    const expectedData = { success: true, publishedVersion: funcName };

    const output = await setupUserTransformHandler([], trRevCode);
    expect(output).toEqual(expectedData);
  });

  it("Setting up function - bad request", async () => {
    const trRevCode = pyTrRevCode(randomID());

    axios.post.mockRejectedValue({
      response: { status: 400, data: "invalid request" }
    });

    await expect(async () => {
      await setupUserTransformHandler([], trRevCode);
    }).rejects.toThrow(RespStatusError);
  });

  it("Setting up function - bad request", async () => {
    const trRevCode = pyTrRevCode(randomID());

    axios.post.mockRejectedValue({
      request: { message: "connection refused" }
    });

    await expect(async () => {
      await setupUserTransformHandler([], trRevCode);
    }).rejects.toThrow(RetryRequestError);
  });

  it("Test simple transformation - create, invoke & delete faas function", async () => {
    const trRevCode = pyTrRevCode(randomID());
    const inputData = require(`./data/${integration}_input.json`);
    const respData = require(`./data/${integration}_output.json`);
    const outputData = require(`./data/${integration}_pycode_test_output.json`);

    axios.get.mockResolvedValue({}); // get function
    axios.post
      .mockResolvedValueOnce({}) // create function
      .mockResolvedValueOnce({
        data: { transformedEvents: respData, logs: [] } // invoke function
      });
    axios.delete.mockResolvedValue({}); // delete function

    const output = await userTransformHandler(
      inputData,
      trRevCode.versionId,
      [],
      trRevCode,
      true
    );
    expect(output).toEqual(outputData);

    expect(axios.post).toHaveBeenCalledTimes(2);
    expect(axios.get).toHaveBeenCalledTimes(2);
    expect(axios.delete).toHaveBeenCalledTimes(1);
  });

  it("Test transformation with user library imports - create, invoke & delete faas function", async () => {
    importNameLibraryVersionIdsMap = {
      mathlib: randomID(),
      constants: randomID(),
      strlib: randomID()
    }
    const trRevCode = pyTrRevCode(randomID(), Object.keys(importNameLibraryVersionIdsMap));
    const inputData = require(`./data/${integration}_input.json`);
    const respData = require(`./data/${integration}_output.json`);
    const outputData = require(`./data/${integration}_pycode_test_output.json`);

    for(const pyImport of Object.keys(importNameLibraryVersionIdsMap)) {
      const versionId = importNameLibraryVersionIdsMap[pyImport];
      const respBody = pyLibCode(pyImport, versionId);
      const libUrl = `https://api.rudderlabs.com/transformationLibrary/getByVersionId?versionId=${versionId}`;
      when(fetch)
        .calledWith(libUrl)
        .mockResolvedValue({
          status: 200,
          json: jest.fn().mockResolvedValue(respBody)
        });
    }

    axios.get.mockResolvedValue({}); // get function
    axios.post
      .mockResolvedValueOnce({}) // create function
      .mockResolvedValueOnce({
        data: { transformedEvents: respData, logs: [] } // invoke function
      });
    axios.delete.mockResolvedValue({}); // delete function

    const output = await userTransformHandler(
      inputData,
      trRevCode.versionId,
      Object.values(importNameLibraryVersionIdsMap),
      trRevCode,
      true
    );
    expect(output).toEqual(outputData);
    
    expect(fetch).toHaveBeenCalledTimes(3);
    expect(axios.post).toHaveBeenCalledTimes(2);
    expect(axios.get).toHaveBeenCalledTimes(2);
    expect(axios.delete).toHaveBeenCalledTimes(1);
  });

  it("Test transformation with cached user library imports - create, invoke & delete faas function", async () => {
    const trRevCode = pyTrRevCode(randomID(), Object.keys(importNameLibraryVersionIdsMap));
    const inputData = require(`./data/${integration}_input.json`);
    const respData = require(`./data/${integration}_output.json`);
    const outputData = require(`./data/${integration}_pycode_test_output.json`);

    for(const pyImport of Object.keys(importNameLibraryVersionIdsMap)) {
      const versionId = importNameLibraryVersionIdsMap[pyImport];
      const respBody = pyLibCode(pyImport, versionId);
      const libUrl = `https://api.rudderlabs.com/transformationLibrary/getByVersionId?versionId=${versionId}`;
      when(fetch)
        .calledWith(libUrl)
        .mockResolvedValue({
          status: 200,
          json: jest.fn().mockResolvedValue(respBody)
        });
    }

    axios.get.mockResolvedValue({}); // get function
    axios.post
      .mockResolvedValueOnce({}) // create function
      .mockResolvedValueOnce({
        data: { transformedEvents: respData, logs: [] } // invoke function
      });
    axios.delete.mockResolvedValue({}); // delete function

    const output = await userTransformHandler(
      inputData,
      trRevCode.versionId,
      Object.values(importNameLibraryVersionIdsMap),
      trRevCode,
      true
    );
    expect(output).toEqual(outputData);
    
    expect(fetch).toHaveBeenCalledTimes(0);
    expect(axios.post).toHaveBeenCalledTimes(2);
    expect(axios.get).toHaveBeenCalledTimes(2);
    expect(axios.delete).toHaveBeenCalledTimes(1);
  });

  it("Simple transformation run with function in cache - invokes faas function", async () => {
    const inputData = require(`./data/${integration}_input.json`);
    const outputData = require(`./data/${integration}_output.json`);

    const versionId = randomID();
    const respBody = pyTrRevCode(versionId);
    const funcName = pyfaasFuncName(respBody.workspaceId, versionId);

    setFunctionInCache(funcName);

    const transformerUrl = `https://api.rudderlabs.com/transformation/getByVersionId?versionId=${versionId}`;
    when(fetch)
      .calledWith(transformerUrl)
      .mockResolvedValue({
        status: 200,
        json: jest.fn().mockResolvedValue(respBody)
      });

    axios.post.mockResolvedValue({ data: { transformedEvents: outputData } });

    const output = await userTransformHandler(inputData, versionId, []);
    expect(output).toEqual(outputData);


    expect(axios.post).toHaveBeenCalledWith(
      `${OPENFAAS_GATEWAY_URL}/function/${funcName}`,
      inputData,
      { auth: defaultBasicAuth },
    );
  });


  describe("Simple transformation run with clean cache - function not found", () => {

    it('eventually sets up the function on 404 from update and then invokes it', async () => {
      const inputData = require(`./data/${integration}_input.json`);

      const versionId = randomID();
      const respBody = pyTrRevCode(versionId);
      const funcName = pyfaasFuncName(respBody.workspaceId, respBody.versionId);

      const transformerUrl = `https://api.rudderlabs.com/transformation/getByVersionId?versionId=${versionId}`;
      when(fetch)
        .calledWith(transformerUrl)
        .mockResolvedValue({
          status: 200,
          json: jest.fn().mockResolvedValue(respBody)
        });


      axios.post
        .mockRejectedValueOnce({
          response: { status: 404, data: `error finding function ${funcName}` } // invoke function not found
        })
        .mockResolvedValueOnce({}); // create function
      axios.get.mockResolvedValue({}); // awaitFunctionReadiness()

      await expect(async () => {
        await userTransformHandler(inputData, versionId, []);
      }).rejects.toThrow(RetryRequestError);

      expect(axios.post).toHaveBeenCalledTimes(2);
      expect(axios.post).toHaveBeenCalledWith(
        `${OPENFAAS_GATEWAY_URL}/function/${funcName}`,
        inputData,
        { auth: defaultBasicAuth },
      );
      expect(axios.post).toHaveBeenCalledWith(
        `${OPENFAAS_GATEWAY_URL}/system/functions`,
        expect.objectContaining({ name: funcName, service: funcName }),
        { auth: defaultBasicAuth },
      );

      expect(axios.get).toHaveBeenCalledTimes(1);
      expect(axios.get).toHaveBeenCalledWith(
        `${OPENFAAS_GATEWAY_URL}/function/${funcName}`,
        {"headers": {"X-REQUEST-TYPE": "HEALTH-CHECK"}},
        { auth: defaultBasicAuth },
      );
    });

  });


  it("Simple transformation run - error requests", async () => {
    const inputData = require(`./data/${integration}_input.json`);

    const versionId = randomID();
    const respBody = pyTrRevCode(versionId);
    const funcName = pyfaasFuncName(respBody.workspaceId, respBody.versionId);

    const transformerUrl = `https://api.rudderlabs.com/transformation/getByVersionId?versionId=${versionId}`;
    when(fetch)
      .calledWith(transformerUrl)
      .mockResolvedValue({
        status: 200,
        json: jest.fn().mockResolvedValue(respBody)
      });

    setFunctionInCache(funcName);

    axios.post
      .mockRejectedValueOnce({
        response: { status: 429, data: `Rate limit exceeded` } // invoke function with rate limit
      })
      .mockRejectedValueOnce({
        response: { status: 500, data: `Internal server error` } // invoke function with internal server error
      })
      .mockRejectedValueOnce({
        response: { status: 503, data: `Service not reachable` } // invoke function with internal server error
      })
      .mockRejectedValueOnce({
        response: { status: 504, data: `Timed out` } // invoke function with exec timeout
      });

    // request limit exceeded will be retried
    await expect(async () => {
      await userTransformHandler(inputData, versionId, []);
    }).rejects.toThrow(RetryRequestError);

    // server error will be retried
    await expect(async () => {
      await userTransformHandler(inputData, versionId, []);
    }).rejects.toThrow(RetryRequestError);

    // service not reachable will be retried
    await expect(async () => {
      await userTransformHandler(inputData, versionId, []);
    }).rejects.toThrow(RetryRequestError);

    // execution timeout will not be retried
    await expect(async () => {
      await userTransformHandler(inputData, versionId, []);
    }).rejects.toThrow(RespStatusError);

  });

});
