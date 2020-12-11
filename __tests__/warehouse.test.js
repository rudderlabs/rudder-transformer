const _ = require("lodash");

const { input, output } = require(`./data/warehouse/events.js`);
const { names } = require(`./data/warehouse/names.js`);
const { rudderProperties } = require(`./data/warehouse/props.js`);
const reservedANSIKeywordsMap = require("../warehouse/config/ReservedKeywords.json");
const { fullEventColumnTypeByProvider } = require("../warehouse/index.js");

const version = "v0";
const integrations = ["rs", "bq", "postgres", "clickhouse", "snowflake"];
const transformers = integrations.map(integration =>
  require(`../${version}/destinations/${integration}/transform`)
);
const eventTypes = ["track", "identify", "page", "screen", "group", "alias"];
// get key of user set properties in the event
// eg. for identify call, user sets the custom properties inside traits
const propsKeyMap = {
  track: "properties",
  page: "properties",
  screen: "properties",

  identify: "traits",
  group: "traits",
  alias: "traits"
};

const integrationCasedString = (integration, str) => {
  if (integration === "snowflake") {
    return str.toUpperCase();
  }
  return str;
};

describe("event types", () => {
  describe("track", () => {
    it("should generate two events for every track call", () => {
      const i = input("track");
      transformers.forEach((transformer, index) => {
        const received = transformer.process(i);
        expect(received).toMatchObject(output("track", integrations[index]));
      });
    });
  });

  describe("identify", () => {
    it("should generate two events for every identify call", () => {
      const i = input("identify");
      // also verfies priority order between traits and context.traits
      transformers.forEach((transformer, index) => {
        const received = transformer.process(i);
        expect(received).toMatchObject(output("identify", integrations[index]));
      });
    });
  });

  describe("page", () => {
    it("should generate one event for every page call", () => {
      const i = input("page");
      transformers.forEach((transformer, index) => {
        const received = transformer.process(i);
        expect(received).toMatchObject(output("page", integrations[index]));
      });
    });
  });

  describe("screen", () => {
    it("should generate one event for every screen call", () => {
      const i = input("screen");
      transformers.forEach((transformer, index) => {
        const received = transformer.process(i);
        expect(received).toMatchObject(output("screen", integrations[index]));
      });
    });
  });

  describe("alias", () => {
    it("should generate one event for every alias call", () => {
      const i = input("alias");
      transformers.forEach((transformer, index) => {
        const received = transformer.process(i);
        expect(received).toMatchObject(output("alias", integrations[index]));
      });
    });
  });
});

describe("column & table names", () => {
  it("should handle special character, spacing, snake case etc.", () => {
    let i = input("track");

    i.message.properties = Object.assign(
      i.message.properties,
      names.input.properties
    );

    transformers.forEach((transformer, index) => {
      const received = transformer.process(i);

      const provider =
        integrations[index] === "snowflake" ? "snowflake" : "default";

      expect(received[1].metadata.columns).toMatchObject(
        names.output.columns[provider]
      );
      expect(received[1].data).toMatchObject(names.output.data[provider]);

      for (let tableName in names.input.properties) {
        i.message.event = tableName;
        let out = transformer.process(i);
        expect(out[1].metadata.table).toEqual(
          names.output.namesMap[provider][tableName]
        );
      }
    });
  });
});

// tests case where properties set by user match the columns set by rudder(id, recevied etc)
// https://docs.rudderstack.com/data-warehouse-integrations/warehouse-schemas#standard-rudderstack-properties
describe("conflict between rudder set props and user set props", () => {
  it("should override user set props with rudder prop", () => {
    eventTypes.forEach(evType => {
      const i = input(evType);

      const propsKey = propsKeyMap[evType];
      const rudderProps = _.compact(
        rudderProperties.default.concat(rudderProperties[evType])
      );

      rudderProps.forEach(prop => {
        // _.set creates inner object if not present
        _.set(i.message, `${propsKey}.${prop}`, "test prop");
      });

      transformers.forEach((transformer, index) => {
        const received = transformer.process(i);
        rudderProps.forEach(prop => {
          if (received[0].data[prop] === "test prop") {
          }
          expect(received[0].data[prop]).not.toBe("test prop");
        });
      });
    });
  });

  it("should set data type of rudder prop and not user set prop", () => {
    eventTypes.forEach(evType => {
      let i = input(evType);

      const propsKey = propsKeyMap[evType];
      transformers.forEach((transformer, index) => {
        let sampleRudderPropKey = "id";
        if (integrations[index] === "snowflake") {
          sampleRudderPropKey = "ID";
        }

        _.set(i.message, `${propsKey}.${sampleRudderPropKey}`, true);
        const received = transformer.process(i);
        expect(received[0].metadata.columns[sampleRudderPropKey]).not.toBe(
          "bool"
        );
        expect(received[0].metadata.columns[sampleRudderPropKey]).toBe(
          "string"
        );
      });
    });
  });
});

describe("handle reserved words", () => {
  const OLD_ENV = process.env;
  beforeEach(() => {
    process.env = { ...OLD_ENV };
    process.env.WH_MAX_COLUMNS_IN_EVENT = 500;
    jest.resetModules();
  });
  afterAll(() => {
    process.env = OLD_ENV; // restore old env
  });
  it("prepend underscore", () => {
    // re-import transformer modules so that new env values are used
    const transformers = integrations.map(integration =>
      require(`../${version}/destinations/${integration}/transform`)
    );
    eventTypes.forEach(evType => {
      let i = input(evType);

      const propsKey = propsKeyMap[evType];
      transformers.forEach((transformer, index) => {
        const reserverdKeywordsMap =
          reservedANSIKeywordsMap[integrations[index].toUpperCase()];

        i.message[propsKey] = Object.assign(
          i.message[propsKey] || {},
          reserverdKeywordsMap
        );

        const received = transformer.process(i);

        const out =
          evType === "track" || evType === "identify"
            ? received[1]
            : received[0];

        Object.keys(reserverdKeywordsMap).forEach(k => {
          expect(out.metadata.columns).not.toHaveProperty(k.toLowerCase());
          expect(out.metadata.columns).not.toHaveProperty(k.toUpperCase());
          snakeCasedKey = _.snakeCase(k).toUpperCase();
          if (k === snakeCasedKey) {
            k = `_${k}`;
          } else {
            k = snakeCasedKey;
          }
          if (integrations[index] === "snowflake") {
            expect(out.metadata.columns).toHaveProperty(k);
          } else {
            expect(out.metadata.columns).toHaveProperty(k.toLowerCase());
          }
        });
      });
    });
  });
});

describe("null/empty values", () => {
  it("should skip setting null/empty value fields", () => {
    eventTypes.forEach(evType => {
      let i = input(evType);

      const propsKey = propsKeyMap[evType];
      const emptyValsMap = {
        empty_val_1: "",
        empty_val_2: [],
        empty_val_3: null,
        empty_val_4: undefined
      };
      const emptyValKeys = Object.keys(emptyValsMap).concat(
        Object.keys(emptyValsMap).map(k => k.toUpperCase())
      );

      i.message[propsKey] = Object.assign(
        i.message[propsKey] || {},
        emptyValsMap
      );

      transformers.forEach((transformer, index) => {
        const received = transformer.process(i);
        emptyValKeys.forEach(k => {
          expect(received[0].metadata.columns).not.toHaveProperty(k);
          expect(received[0].data).not.toHaveProperty(k);
          if (received[1]) {
            expect(received[1].metadata.columns).not.toHaveProperty(k);
            expect(received[1].data).not.toHaveProperty(k);
          }
        });
      });
    });
  });
});

describe("invalid context", () => {
  it("should skip setting context fields if context is not an object", () => {
    eventTypes.forEach(evType => {
      let i = input(evType);
      i.message.context = "{{invalid object}}";

      transformers.forEach((transformer, index) => {
        const received = transformer.process(i);
        let columns = Object.keys(received[0].metadata.columns);
        if (received[1]) {
          columns = columns.concat(Object.keys(received[1].metadata.columns));
        }
        columns.forEach(c => {
          expect(c).not.toMatch(/^context_\d/g);
        });
        let data = Object.keys(received[0].data);
        if (received[1]) {
          data = data.concat(Object.keys(received[1].data));
        }
        data.forEach(d => {
          expect(d).not.toMatch(/^context_\d/g);
        });
      });
    });
  });
});

describe("context ip", () => {
  it("should set context_ip to context.ip if present", () => {
    eventTypes.forEach(evType => {
      let i = input(evType);
      i.message.context.ip = "new_ip";

      transformers.forEach((transformer, index) => {
        const received = transformer.process(i);
        expect(
          received[0].metadata.columns[
            integrationCasedString(integrations[index], "context_ip")
          ]
        ).toBe("string");
        expect(
          received[0].data[
            integrationCasedString(integrations[index], "context_ip")
          ]
        ).toEqual("new_ip");

        if (received[1]) {
          expect(
            received[1].metadata.columns[
              integrationCasedString(integrations[index], "context_ip")
            ]
          ).toBe("string");
          expect(
            received[1].data[
              integrationCasedString(integrations[index], "context_ip")
            ]
          ).toEqual("new_ip");
        }
      });
    });
  });

  it("should set context_ip to request_ip if context.ip not present", () => {
    eventTypes.forEach(evType => {
      let i = input(evType);
      delete i.message.context.ip;
      i.message.request_ip = "requested_ip";

      transformers.forEach((transformer, index) => {
        const received = transformer.process(i);
        expect(
          received[0].metadata.columns[
            integrationCasedString(integrations[index], "context_ip")
          ]
        ).toBe("string");
        expect(
          received[0].data[
            integrationCasedString(integrations[index], "context_ip")
          ]
        ).toEqual("requested_ip");
        if (received[1]) {
          expect(
            received[1].metadata.columns[
              integrationCasedString(integrations[index], "context_ip")
            ]
          ).toBe("string");
          expect(
            received[1].data[
              integrationCasedString(integrations[index], "context_ip")
            ]
          ).toEqual("requested_ip");
        }
      });
    });
  });
});

describe("remove rudder property if rudder property is null", () => {
  it("should remove context_ip set by user in properties if missing in event", () => {
    eventTypes.forEach(evType => {
      let i = input(evType);
      delete i.message.context.ip;
      delete i.message.request_ip;
      const propsKey = propsKeyMap[evType];
      _.set(i.message, `${propsKey}.context_ip`, "test prop");

      transformers.forEach((transformer, index) => {
        const received = transformer.process(i);
        expect(received[0].metadata.columns).not.toHaveProperty(
          integrationCasedString(integrations[index], "context_ip")
        );
        expect(received[0].data).not.toHaveProperty(
          integrationCasedString(integrations[index], "context_ip")
        );
      });
    });
  });
});

describe("store full rudder event", () => {
  it("should store if configured in dest settings", () => {
    eventTypes.forEach(evType => {
      let i = input(evType);
      _.set(i.destination, `Config.storeFullEvent`, true);

      transformers.forEach((transformer, index) => {
        const received = transformer.process(i);
        const columnName = integrationCasedString(
          integrations[index],
          "rudder_event"
        );

        expect(received[0].metadata.columns).toHaveProperty(columnName);
        expect(received[0].metadata.columns[columnName]).toEqual(
          fullEventColumnTypeByProvider[integrations[index]]
        );
        expect(received[0].data[columnName]).toEqual(JSON.stringify(i.message));

        if (received[1]) {
          expect(received[1].metadata.columns).not.toHaveProperty(columnName);
          expect(received[1].data).not.toHaveProperty(columnName);
        }
      });
    });
  });
});

describe("rudder reserved columns", () => {
  it("should not accept rudder reserved column names from user in properties, traits etc", () => {
    eventTypes.forEach(evType => {
      let i = input(evType);

      const delProps = [
        "message.channel",
        "message.timestamp",
        "message.originalTimestamp"
      ];
      const setProps = [
        "message.properties.channel",
        "message.traits.channel",
        "message.properties.timestamp",
        "message.traits.timestamp",
        "message.properties.originalTimestamp",
        "message.traits.originalTimestamp"
      ];

      const checkProps = ["channel", "timestamp", "original_timestamp"];

      delProps.forEach(prop => _.unset(i, prop));
      setProps.forEach(prop => _.set(i, prop, "random value"));

      transformers.forEach((transformer, index) => {
        const received = transformer.process(i);
        checkProps.forEach(k => {
          k = integrationCasedString(integrations[index], k);
          expect(received[0].metadata.columns).not.toHaveProperty(k);
          expect(received[0].data).not.toHaveProperty(k);
          if (received[1]) {
            expect(received[1].metadata.columns).not.toHaveProperty(k);
            expect(received[1].data).not.toHaveProperty(k);
          }
        });
      });
    });
  });
});
