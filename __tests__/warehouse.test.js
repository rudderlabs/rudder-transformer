const _ = require("lodash");

const { input, output } = require(`./data/warehouse/events.js`);
const { names } = require(`./data/warehouse/names.js`);
const { rudderProperties } = require(`./data/warehouse/props.js`);
const reservedANSIKeywordsMap = require("../warehouse/config/ReservedKeywords.json");

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

describe("event types", () => {
  describe("track", () => {
    it("should generate two events for every track call", () => {
      transformers.forEach((transformer, index) => {
        const received = transformer.process(input("track"));
        expect(received).toMatchObject(output("track", integrations[index]));
      });
    });
  });

  describe("identify", () => {
    it("should generate two events for every identify call", () => {
      // also verfies priority order between traits and context.traits
      transformers.forEach((transformer, index) => {
        const received = transformer.process(input("identify"));
        expect(received).toMatchObject(output("identify", integrations[index]));
      });
    });
  });

  describe("page", () => {
    it("should generate one event for every page call", () => {
      transformers.forEach((transformer, index) => {
        const received = transformer.process(input("page"));
        expect(received).toMatchObject(output("page", integrations[index]));
      });
    });
  });

  describe("screen", () => {
    it("should generate one event for every screen call", () => {
      transformers.forEach((transformer, index) => {
        const received = transformer.process(input("screen"));
        expect(received).toMatchObject(output("screen", integrations[index]));
      });
    });
  });

  describe("alias", () => {
    it("should generate one event for every alias call", () => {
      transformers.forEach((transformer, index) => {
        const received = transformer.process(input("alias"));
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
      let i = input(evType);

      const propsKey = propsKeyMap[evType];
      rudderProps = _.compact(
        rudderProperties.default.concat(rudderProperties[evType])
      );

      rudderProps.forEach(prop => {
        // _.set creates inner object if not present
        _.set(i.message, `${propsKey}.${prop}`, "test prop");
      });

      transformers.forEach(transformer => {
        const received = transformer.process(i);
        rudderProps.forEach(prop => {
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
        // TODO: snowflake specific
        expect(received[0].metadata.columns[sampleRudderPropKey]).not.toBe(
          "bool"
        );
        expect(received[0].metadata.columns[sampleRudderPropKey]).toBe(
          "string"
        );
      });
    });
  });

  describe("handle reserved words", () => {
    it("prepend underscore", () => {
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
});
