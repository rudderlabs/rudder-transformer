const mockResolver = jest.fn();
jest.mock("dns", () => {
  return {
    promises: {
      Resolver: function() {
        return {
          resolve4: mockResolver,
        };
      }
    }
  };
});

const {
  userTransformHandler,
} = require("../../src/util/customTransformer");

const integration = "user_transformation";
const name = "User Transformations";
const versionId = "testVersionId";

describe("User transformation fetch tests", () => {
  beforeEach(() => {
    jest.resetAllMocks();
    process.env.DNS_RESOLVE_FETCH_HOST = 'true';
  });
  afterAll(() => {});

  it(`Simple v0 ${name} Test`, async () => {
    const inputData = require(`./data/${integration}_input.json`);
    const expectedData = require(`./data/${integration}_output.json`);

    const trRevCode = {
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

    const output = await userTransformHandler(inputData, versionId, [], trRevCode, true);
    expect(output).toEqual({
      logs: [],
      transformedEvents: expectedData.map(ev => (ev.transformedEvent))
    });
  });

  it(`Simple async ${name} fetch fail Test for V0 transformation with localhost ip`, async () => {
    const inputData = require(`./data/${integration}_input.json`);

    const trRevCode = {
      codeVersion: "0",
      name,
      code: `
      async function transform(events) {
        await Promise.all(events.map(async (event) => {
          event.errMsg = await fetch('http://127.0.0.1/dummyUrl');
        }));
        return events;
      }
      `
    };
    const errMsg = "ERROR";

    const output = await userTransformHandler(inputData, versionId, [], trRevCode, true);
    
    expect(mockResolver).toHaveBeenCalledTimes(0);
    output.transformedEvents.forEach(ev => {
      expect(ev.errMsg).toEqual(errMsg);
    });
  });

  it(`Simple async ${name} fetch fail Test for V0 transformation with dns resolve`, async () => {
    const inputData = require(`./data/${integration}_input.json`);
    const trRevCode = {
      codeVersion: "0",
      name,
      code: `
      async function transform(events) {
        await Promise.all(events.map(async (event) => {
          event.errMsg = await fetch('https://abc.xyz.com/dummyUrl');
        }));
        return events;
      }
      `
    };
    const errMsg = "ERROR";

    mockResolver.mockResolvedValue([ '127.0.0.1' ]);
    const output = await userTransformHandler(inputData, versionId, [], trRevCode, true);
    
    expect(mockResolver).toHaveBeenCalledTimes(inputData.length);
    expect(mockResolver).toHaveBeenCalledWith('abc.xyz.com');
    output.transformedEvents.forEach(ev => {
      expect(ev.errMsg).toEqual(errMsg);
    });
  });

  it(`Simple async ${name} fetchV2 fail Test for V0 transformation with localhost url`, async () => {
    const inputData = require(`./data/${integration}_input.json`);
    const trRevCode = {
      codeVersion: "0",
      name,
      code: `
      async function transform(events) {
        await Promise.all(events.map(async (event) => {
          try {
            const res = await fetchV2('http://localhost:1000/dummyUrl');
            event.res = res.body;
          } catch (err) {
            event.errMsg = err.message;
          }
        }));
        return events;
      }
      `
    };
    const errMsg = "invalid url, localhost requests are not allowed";
    
    const output = await userTransformHandler(inputData, versionId, [], trRevCode, true);
    
    expect(mockResolver).toHaveBeenCalledTimes(0);
    output.transformedEvents.forEach(ev => {
      expect(ev.errMsg).toEqual(errMsg);
    });
  });

  it(`Simple async ${name} fetchV2 fail Test for V0 transformation with dns resolve error`, async () => {
    const inputData = require(`./data/${integration}_input.json`);
    const trRevCode = {
      codeVersion: "0",
      name,
      code: `
      async function transform(events) {
        await Promise.all(events.map(async (event) => {
          try {
            const res = await fetchV2('https://abc.xyz.com/dummyUrl');
            event.res = res.body;
          } catch (err) {
            event.errMsg = err.message;
          }
        }));
        return events;
      }
      `
    };
    const errMsg = "request to https://abc.xyz.com/dummyUrl failed, reason: Invalid IP address: unable to resolve IP address for abc.xyz.com";
    
    mockResolver.mockRejectedValue('invalid host');
    const output = await userTransformHandler(inputData, versionId, [], trRevCode, true);
    
    expect(mockResolver).toHaveBeenCalledTimes(inputData.length);
    expect(mockResolver).toHaveBeenCalledWith('abc.xyz.com');
    output.transformedEvents.forEach(ev => {
      expect(ev.errMsg).toEqual(errMsg);
    });
  });

  it(`Simple async ${name} fetchV2 fail Test for V0 transformation with invalid protocol`, async () => {
    const inputData = require(`./data/${integration}_input.json`);
    const trRevCode = {
      codeVersion: "0",
      name,
      code: `
      async function transform(events) {
        await Promise.all(events.map(async (event) => {
          try {
            const res = await fetchV2('tcp://abc.xyz.com/dummyUrl');
            event.res = res.body;
          } catch (err) {
            event.errMsg = err.message;
          }
        }));
        return events;
      }
      `
    };
    const errMsg = "invalid protocol, only http and https are supported";
    
    const output = await userTransformHandler(inputData, versionId, [], trRevCode, true);
    
    output.transformedEvents.forEach(ev => {
      expect(ev.errMsg).toEqual(errMsg);
    });
  });

  it(`Simple v1 ${name} Test`, async () => {
    const inputData = require(`./data/${integration}_input.json`);
    const expectedData = require(`./data/${integration}_output.json`);

    const trRevCode = {
      codeVersion: "1",
      name,
      code: `
        export function transformEvent(event, metadata) {
          return event;
        }
      `,
      versionId,
    };

    const output = await userTransformHandler(inputData, versionId, [], trRevCode, true);
    expect(output).toEqual({
      logs: [],
      transformedEvents: expectedData.map(ev => (ev.transformedEvent))
    });
  });

  it(`Simple async ${name} fetch fail Test for V1 transformation with localhost url`, async () => {
    const inputData = require(`./data/${integration}_input.json`);
    const trRevCode = {
      codeVersion: "1",
      name,
      versionId,
      code: `
        export async function transformEvent(event) {
          event.errMsg = await fetch('http://localhost:1000/dummyUrl');
          return event;
        }
      `
    };
    const errMsg = "ERROR";

    const output = await userTransformHandler(inputData, versionId, [], trRevCode, true);
    
    expect(mockResolver).toHaveBeenCalledTimes(0);
    output.transformedEvents.forEach(ev => {
      expect(ev.errMsg).toEqual(errMsg);
    });
  });

  it(`Simple async ${name} fetch fail Test for V1 transformation with dns resolve error`, async () => {
    const inputData = require(`./data/${integration}_input.json`);
    const trRevCode = {
      codeVersion: "1",
      name,
      versionId,
      code: `
        export async function transformEvent(event) {
          event.errMsg = await fetch('https://abc.xyz.com/dummyUrl');
          return event;
      }
      `
    };
    const errMsg = "ERROR";

    mockResolver.mockRejectedValue('invalid host');
    const output = await userTransformHandler(inputData, versionId, [], trRevCode, true);
    
    expect(mockResolver).toHaveBeenCalledTimes(inputData.length);
    expect(mockResolver).toHaveBeenCalledWith('abc.xyz.com');
    output.transformedEvents.forEach(ev => {
      expect(ev.errMsg).toEqual(errMsg);
    });
  });

  it(`Simple async ${name} fetchV2 fail Test for V1 transformation with localhost ip`, async () => {
    const inputData = require(`./data/${integration}_input.json`);
    const trRevCode = {
      codeVersion: "1",
      name,
      versionId,
      code: `
        export async function transformEvent(event) {
          try {
            const res = await fetchV2('http://127.0.0.1:9000/dummyUrl');
            event.res = res.body;
          } catch (err) {
            event.errMsg = err.message;
          }
          return event;
        }
      `
    };
    const errMsg = "invalid url, localhost requests are not allowed";
    
    const output = await userTransformHandler(inputData, versionId, [], trRevCode, true);
    
    expect(mockResolver).toHaveBeenCalledTimes(0);
    output.transformedEvents.forEach(ev => {
      expect(ev.errMsg).toEqual(errMsg);
    });
  });

  it(`Simple async ${name} fetchV2 fail Test for V1 transformation with dns resolve`, async () => {
    const inputData = require(`./data/${integration}_input.json`);
    const trRevCode = {
      codeVersion: "1",
      name,
      versionId,
      code: `
        export async function transformEvent(event) {
          try {
            const res = await fetchV2('https://abc.xyz.com/dummyUrl');
            event.res = res.body;
          } catch (err) {
            event.errMsg = err.message;
          }
          return event;
        }
      `
    };
    const errMsg = "request to https://abc.xyz.com/dummyUrl failed, reason: Invalid IP address: cannot use 127.0.0.1 as IP address";
    
    mockResolver.mockResolvedValue(['3.122.122.122', '127.0.0.1']);
    const output = await userTransformHandler(inputData, versionId, [], trRevCode, true);
    
    expect(mockResolver).toHaveBeenCalledTimes(inputData.length);
    expect(mockResolver).toHaveBeenCalledWith('abc.xyz.com');
    output.transformedEvents.forEach(ev => {
      expect(ev.errMsg).toEqual(errMsg);
    });
  });

  it(`Simple async ${name} fetchV2 fail Test for V1 transformation with no arguments`, async () => {
    const inputData = require(`./data/${integration}_input.json`);
    const trRevCode = {
      codeVersion: "1",
      name,
      versionId,
      code: `
        export async function transformEvent(event) {
          try {
            const res = await fetchV2();
            event.res = res.body;
          } catch (err) {
            event.errMsg = err.message;
          }
          return event;
        }
      `
    };
    const errMsg = "fetch url is required";
    
    const output = await userTransformHandler(inputData, versionId, [], trRevCode, true);
    
    output.transformedEvents.forEach(ev => {
      expect(ev.errMsg).toEqual(errMsg);
    });
  });
});
