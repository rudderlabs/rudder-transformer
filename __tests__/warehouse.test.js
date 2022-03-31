const _ = require("lodash");

const util = require("util");

const { input, output } = require(`./data/warehouse/events.js`);
const { opInput, opOutput } = require(`./data/warehouse/integration_options_events.js`);
const { names } = require(`./data/warehouse/names.js`);
const {
  largeNoOfColumnsevent
} = require(`./data/warehouse/event_columns_length`);
const { rudderProperties } = require(`./data/warehouse/props.js`);
const reservedANSIKeywordsMap = require("../warehouse/config/ReservedKeywords.json");
const { fullEventColumnTypeByProvider } = require("../warehouse/index.js");

const version = "v0";
const integrations = [
  "rs",
  "bq",
  "postgres",
  "clickhouse",
  "snowflake",
  "mssql",
  "azure_synapse",
  "s3_datalake"
];
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
    it("should take name from properties if top-level name is missing", () => {
      let i = input("page");
      i.message.properties.name = i.message.name;
      delete i.message.name;
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
    it("should take name from properties if top-level name is missing", () => {
      let i = input("screen");
      i.message.properties.name = i.message.name;
      delete i.message.name;
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
  it("should trim column names in postgres", () => {
    let i = input("track");
    names.input.properties[
      "a1a2a3a4a5b1b2b3b4b5c1c2c3c4c5d1d2d3d4d5e1e2e3e4e5f1f2f3f4f5g1g2g3g4g5"
    ] = "70 letter identifier";
    names.input.properties[
      "xa1a2a3a4a5b1b2b3b4b5c1c2c3c4c5d1d2d3d4d5e1e2e3e4e5f1f2f3f4f5g1g2g3g4g5a1a2a3a4a5b1b2b3b4b5c1c2c3c4c5d1d2d3d4d5e1e2e3e4e5f1f2f3f4f5g1g2g3g4g5a1a2a3a4a5b1b2b3b4b5c1c2c3c4c5d1d2d3d4d5e1e2e3e4e5f1f2f3f4f5g1g2g3g4g5a1a2a3a4a5b1b2b3b4b5c1c2c3c4c5d1d2d3d4d5e1e2e3e4e5f1f2f3f4f5g1g2g3g4g5a1a2a3a4a5b1b2b3b4b5c1c2c3c4c5d1d2d3d4d5e1e2e3e4e5f1f2f3f4f5g1g2g3g4g5a1a2a3a4a5b1b2b3b4b5c1c2c3c4c5d1d2d3d4d5e1e2e3e4e5f1f2f3f4f5g1g2g3g4g5a1a2a3a4a5b1b2b3b4b5c1c2c3c4c5d1d2d3d4d5e1e2e3e4e5f1f2f3f4f5g1g2g3g4g5abcdefghi"
    ] = "500 letter identifier";
    i.message.properties = Object.assign(
      i.message.properties,
      names.input.properties
    );
    i.message.event =
      "a1a2a3a4a5b1b2b3b4b5c1c2c3c4c5d1d2d3d4d5e1e2e3e4e5f1f2f3f4f5g1g2g3g4g5";

    transformers.forEach((transformer, index) => {
      const received = transformer.process(i);
      if (integrations[index] === "postgres") {
        expect(received[1].metadata).toHaveProperty(
          "table",
          "a_1_a_2_a_3_a_4_a_5_b_1_b_2_b_3_b_4_b_5_c_1_c_2_c_3_c_4_c_5_d_1"
        );
        expect(received[1].metadata.columns).toHaveProperty(
          "a_1_a_2_a_3_a_4_a_5_b_1_b_2_b_3_b_4_b_5_c_1_c_2_c_3_c_4_c_5_d_1",
          "string"
        );
        expect(received[1].data).toHaveProperty(
          "a_1_a_2_a_3_a_4_a_5_b_1_b_2_b_3_b_4_b_5_c_1_c_2_c_3_c_4_c_5_d_1",
          "70 letter identifier"
        );
        expect(received[1].metadata.columns).toHaveProperty(
          "xa_1_a_2_a_3_a_4_a_5_b_1_b_2_b_3_b_4_b_5_c_1_c_2_c_3_c_4_c_5_d_",
          "string"
        );
        expect(received[1].data).toHaveProperty(
          "xa_1_a_2_a_3_a_4_a_5_b_1_b_2_b_3_b_4_b_5_c_1_c_2_c_3_c_4_c_5_d_",
          "500 letter identifier"
        );
        //KEY should be trimmed to 63
        return;
      }
      if (integrations[index] === "snowflake") {
        expect(received[1].metadata).toHaveProperty(
          "table",
          "A_1_A_2_A_3_A_4_A_5_B_1_B_2_B_3_B_4_B_5_C_1_C_2_C_3_C_4_C_5_D_1_D_2_D_3_D_4_D_5_E_1_E_2_E_3_E_4_E_5_F_1_F_2_F_3_F_4_F_5_G_1_G_2"
        );
        expect(received[1].metadata.columns).toHaveProperty(
          "A_1_A_2_A_3_A_4_A_5_B_1_B_2_B_3_B_4_B_5_C_1_C_2_C_3_C_4_C_5_D_1_D_2_D_3_D_4_D_5_E_1_E_2_E_3_E_4_E_5_F_1_F_2_F_3_F_4_F_5_G_1_G_2",
          "string"
        );
        expect(received[1].data).toHaveProperty(
          "A_1_A_2_A_3_A_4_A_5_B_1_B_2_B_3_B_4_B_5_C_1_C_2_C_3_C_4_C_5_D_1_D_2_D_3_D_4_D_5_E_1_E_2_E_3_E_4_E_5_F_1_F_2_F_3_F_4_F_5_G_1_G_2",
          "70 letter identifier"
        );
        expect(received[1].metadata.columns).toHaveProperty(
          "XA_1_A_2_A_3_A_4_A_5_B_1_B_2_B_3_B_4_B_5_C_1_C_2_C_3_C_4_C_5_D_1_D_2_D_3_D_4_D_5_E_1_E_2_E_3_E_4_E_5_F_1_F_2_F_3_F_4_F_5_G_1_G_",
          "string"
        );
        expect(received[1].data).toHaveProperty(
          "XA_1_A_2_A_3_A_4_A_5_B_1_B_2_B_3_B_4_B_5_C_1_C_2_C_3_C_4_C_5_D_1_D_2_D_3_D_4_D_5_E_1_E_2_E_3_E_4_E_5_F_1_F_2_F_3_F_4_F_5_G_1_G_",
          "500 letter identifier"
        );
        return;
      }
      if (integrations[index] === "s3_datalake") {
        expect(received[1].metadata).toHaveProperty(
          "table",
          "a_1_a_2_a_3_a_4_a_5_b_1_b_2_b_3_b_4_b_5_c_1_c_2_c_3_c_4_c_5_d_1_d_2_d_3_d_4_d_5_e_1_e_2_e_3_e_4_e_5_f_1_f_2_f_3_f_4_f_5_g_1_g_2_g_3_g_4_g_5"
        );
        expect(received[1].metadata.columns).toHaveProperty(
          "a_1_a_2_a_3_a_4_a_5_b_1_b_2_b_3_b_4_b_5_c_1_c_2_c_3_c_4_c_5_d_1_d_2_d_3_d_4_d_5_e_1_e_2_e_3_e_4_e_5_f_1_f_2_f_3_f_4_f_5_g_1_g_2_g_3_g_4_g_5",
          "string"
        );
        expect(received[1].data).toHaveProperty(
          "a_1_a_2_a_3_a_4_a_5_b_1_b_2_b_3_b_4_b_5_c_1_c_2_c_3_c_4_c_5_d_1_d_2_d_3_d_4_d_5_e_1_e_2_e_3_e_4_e_5_f_1_f_2_f_3_f_4_f_5_g_1_g_2_g_3_g_4_g_5",
          "70 letter identifier"
        );
        expect(received[1].metadata.columns).toHaveProperty(
          "xa_1_a_2_a_3_a_4_a_5_b_1_b_2_b_3_b_4_b_5_c_1_c_2_c_3_c_4_c_5_d_1_d_2_d_3_d_4_d_5_e_1_e_2_e_3_e_4_e_5_f_1_f_2_f_3_f_4_f_5_g_1_g_2_g_3_g_4_g_5_a_1_a_2_a_3_a_4_a_5_b_1_b_2_b_3_b_4_b_5_c_1_c_2_c_3_c_4_c_5_d_1_d_2_d_3_d_4_d_5_e_1_e_2_e_3_e_4_e_5_f_1_f_2_f_3_f_4_f_5_g_1_g_2_g_3_g_4_g_5_a_1_a_2_a_3_a_4_a_5_b_1_b_2_b_3_b_4_b_5_c_1_c_2_c_3_c_4_c_5_d_1_d_2_d_3_d_4_d_5_e_1_e_2_e_3_e_4_e_5_f_1_f_2_f_3_f_4_f_5_g_1_g_2_g_3_g_4_g_5_a_1_a_2_a_3_a_4_a_5_b_1_b_2_b_3_b_4_b_5_c_1_c_2_c_3_c_4_c_5_d_1_d_2_d_3_d_4_d_5_e_1_e_2_e_3_e_4_e_5_f_1_f_2_f_3_f_4_f_5_g_1_g_2_g_3_g_4_g_5_a_1_a_2_a_3_a_4_a_5_b_1_b_2_b_3_b_4_b_5_c_1_c_2_c_3_c_4_c_5_d_1_d_2_d_3_d_4_d_5_e_1_e_2_e_3_e_4_e_5_f_1_f_2_f_3_f_4_f_5_g_1_g_2_g_3_g_4_g_5_a_1_a_2_a_3_a_4_a_5_b_1_b_2_b_3_b_4_b_5_c_1_c_2_c_3_c_4_c_5_d_1_d_2_d_3_d_4_d_5_e_1_e_2_e_3_e_4_e_5_f_1_f_2_f_3_f_4_f_5_g_1_g_2_g_3_g_4_g_5_a_1_a_2_a_3_a_4_a_5_b_1_b_2_b_3_b_4_b_5_c_1_c_2_c_3_c_4_c_5_d_1_d_2_d_3_d_4_d_5_e_1_e_2_e_3_e_4_e_5_f_1_f_2_f_3_f_4_f_5_g_1_g_2_g_3_g_4_g_5_abcdefghi",
          "string"
        );
        expect(received[1].data).toHaveProperty(
          "xa_1_a_2_a_3_a_4_a_5_b_1_b_2_b_3_b_4_b_5_c_1_c_2_c_3_c_4_c_5_d_1_d_2_d_3_d_4_d_5_e_1_e_2_e_3_e_4_e_5_f_1_f_2_f_3_f_4_f_5_g_1_g_2_g_3_g_4_g_5_a_1_a_2_a_3_a_4_a_5_b_1_b_2_b_3_b_4_b_5_c_1_c_2_c_3_c_4_c_5_d_1_d_2_d_3_d_4_d_5_e_1_e_2_e_3_e_4_e_5_f_1_f_2_f_3_f_4_f_5_g_1_g_2_g_3_g_4_g_5_a_1_a_2_a_3_a_4_a_5_b_1_b_2_b_3_b_4_b_5_c_1_c_2_c_3_c_4_c_5_d_1_d_2_d_3_d_4_d_5_e_1_e_2_e_3_e_4_e_5_f_1_f_2_f_3_f_4_f_5_g_1_g_2_g_3_g_4_g_5_a_1_a_2_a_3_a_4_a_5_b_1_b_2_b_3_b_4_b_5_c_1_c_2_c_3_c_4_c_5_d_1_d_2_d_3_d_4_d_5_e_1_e_2_e_3_e_4_e_5_f_1_f_2_f_3_f_4_f_5_g_1_g_2_g_3_g_4_g_5_a_1_a_2_a_3_a_4_a_5_b_1_b_2_b_3_b_4_b_5_c_1_c_2_c_3_c_4_c_5_d_1_d_2_d_3_d_4_d_5_e_1_e_2_e_3_e_4_e_5_f_1_f_2_f_3_f_4_f_5_g_1_g_2_g_3_g_4_g_5_a_1_a_2_a_3_a_4_a_5_b_1_b_2_b_3_b_4_b_5_c_1_c_2_c_3_c_4_c_5_d_1_d_2_d_3_d_4_d_5_e_1_e_2_e_3_e_4_e_5_f_1_f_2_f_3_f_4_f_5_g_1_g_2_g_3_g_4_g_5_a_1_a_2_a_3_a_4_a_5_b_1_b_2_b_3_b_4_b_5_c_1_c_2_c_3_c_4_c_5_d_1_d_2_d_3_d_4_d_5_e_1_e_2_e_3_e_4_e_5_f_1_f_2_f_3_f_4_f_5_g_1_g_2_g_3_g_4_g_5_abcdefghi",
          "500 letter identifier"
        );
        return;
      }
      expect(received[1].metadata).toHaveProperty(
        "table",
        "a_1_a_2_a_3_a_4_a_5_b_1_b_2_b_3_b_4_b_5_c_1_c_2_c_3_c_4_c_5_d_1_d_2_d_3_d_4_d_5_e_1_e_2_e_3_e_4_e_5_f_1_f_2_f_3_f_4_f_5_g_1_g_2"
      );
      expect(received[1].metadata.columns).toHaveProperty(
        "a_1_a_2_a_3_a_4_a_5_b_1_b_2_b_3_b_4_b_5_c_1_c_2_c_3_c_4_c_5_d_1_d_2_d_3_d_4_d_5_e_1_e_2_e_3_e_4_e_5_f_1_f_2_f_3_f_4_f_5_g_1_g_2",
        "string"
      );
      expect(received[1].data).toHaveProperty(
        "a_1_a_2_a_3_a_4_a_5_b_1_b_2_b_3_b_4_b_5_c_1_c_2_c_3_c_4_c_5_d_1_d_2_d_3_d_4_d_5_e_1_e_2_e_3_e_4_e_5_f_1_f_2_f_3_f_4_f_5_g_1_g_2",
        "70 letter identifier"
      );
      expect(received[1].metadata.columns).toHaveProperty(
        "xa_1_a_2_a_3_a_4_a_5_b_1_b_2_b_3_b_4_b_5_c_1_c_2_c_3_c_4_c_5_d_1_d_2_d_3_d_4_d_5_e_1_e_2_e_3_e_4_e_5_f_1_f_2_f_3_f_4_f_5_g_1_g_",
        "string"
      );
      expect(received[1].data).toHaveProperty(
        "xa_1_a_2_a_3_a_4_a_5_b_1_b_2_b_3_b_4_b_5_c_1_c_2_c_3_c_4_c_5_d_1_d_2_d_3_d_4_d_5_e_1_e_2_e_3_e_4_e_5_f_1_f_2_f_3_f_4_f_5_g_1_g_",
        "500 letter identifier"
      );
      //KEY should be trimmed to 127
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
    process.env.WH_MAX_COLUMNS_IN_EVENT = 600;
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
describe("remove any property if event is object ", () => {
  it("should remove any property if event is object", () => {
    eventTypes.forEach(evType => {
      let i = input(evType);
      i.message.channel = {};
      i.message.event = {};
      transformers.forEach((transformer, index) => {
        const received = transformer.process(i);
        expect(received[0].metadata.columns).not.toHaveProperty(
          integrationCasedString(integrations[index], "channel")
        );
        expect(received[0].data).not.toHaveProperty(
          integrationCasedString(integrations[index], "channel")
        );
      });
      transformers.forEach((transformer, index) => {
        const received = transformer.process(i);
        expect(received[0].metadata.columns).not.toHaveProperty(
          integrationCasedString(integrations[index], "event_text")
        );
        expect(received[0].data).not.toHaveProperty(
          integrationCasedString(integrations[index], "event_text")
        );
      });
      i.message.channel = { channel: "android" };
      transformers.forEach((transformer, index) => {
        const received = transformer.process(i);
        expect(received[0].metadata.columns).not.toHaveProperty(
          integrationCasedString(integrations[index], "channel")
        );
        expect(received[0].data).not.toHaveProperty(
          integrationCasedString(integrations[index], "channel")
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

describe("id column datatype for users table", () => {
  it("should set id column datatype for users as one received and not always string", () => {
    let i = input("identify");
    i.message.userId = 100; //integer

    transformers.forEach((transformer, index) => {
      const received = transformer.process(i);
      expect(
        received[0].metadata.columns[
          integrationCasedString(integrations[index], "user_id")
        ]
      ).toEqual("int");
      expect(
        received[1].metadata.columns[
          integrationCasedString(integrations[index], "id")
        ]
      ).toEqual("int");
    });

    i = input("identify");
    i.message.userId = 1.1; //float

    transformers.forEach((transformer, index) => {
      const received = transformer.process(i);
      expect(
        received[0].metadata.columns[
          integrationCasedString(integrations[index], "user_id")
        ]
      ).toEqual("float");
      expect(
        received[1].metadata.columns[
          integrationCasedString(integrations[index], "id")
        ]
      ).toEqual("float");
    });
  });
});

describe("handle leading underscores in properties", () => {
  it("should not remove leading underscores in properties", () => {
    let i = input("track");
    i.message.properties = {
      _timestamp: "1",
      __timestamp: "2",
      __timestamp_new: "3"
    };

    transformers.forEach((transformer, index) => {
      const received = transformer.process(i);
      expect(received[1].metadata.columns).toHaveProperty(
        integrationCasedString(integrations[index], "_timestamp")
      );
      expect(received[1].metadata.columns).toHaveProperty(
        integrationCasedString(integrations[index], "__timestamp")
      );
      expect(received[1].metadata.columns).toHaveProperty(
        integrationCasedString(integrations[index], "__timestamp_new")
      );
      expect(received[1].data).toHaveProperty(
        integrationCasedString(integrations[index], "_timestamp")
      );
      expect(received[1].data).toHaveProperty(
        integrationCasedString(integrations[index], "__timestamp")
      );
      expect(received[1].data).toHaveProperty(
        integrationCasedString(integrations[index], "__timestamp_new")
      );
    });
  });
});

describe("handle recordId from cloud sources", () => {
  it("should not set id based on recordId if sourceCategory is missing", () => {
    let i = input("track");
    i.message.recordId = 42;
    if (i.metadata) delete i.metadata.sourceCategory;
    transformers.forEach((transformer, index) => {
      const received = transformer.process(i);
      expect(received[0].metadata.columns).not.toHaveProperty(
        integrationCasedString(integrations[index], "record_id")
      );
      expect(received[0].data).not.toHaveProperty(
        integrationCasedString(integrations[index], "record_id")
      );
      expect(
        received[0].data[integrationCasedString(integrations[index], "id")]
      ).toEqual(i.message.messageId);
      expect(received[1].metadata.columns).not.toHaveProperty(
        integrationCasedString(integrations[index], "record_id")
      );
      expect(received[1].data).not.toHaveProperty(
        integrationCasedString(integrations[index], "record_id")
      );
      expect(
        received[1].data[integrationCasedString(integrations[index], "id")]
      ).toEqual(i.message.messageId);
    });
  });

  it("should not set id based on recordId if source version is missing", () => {
    let i = input("track");
    i.message.recordId = 42;
    i.metadata = { sourceCategory: "cloud" };
    if (i.message.context.sources) delete i.message.context.sources.version;
    transformers.forEach((transformer, index) => {
      const received = transformer.process(i);
      expect(received[0].metadata.columns).not.toHaveProperty(
        integrationCasedString(integrations[index], "record_id")
      );
      expect(received[0].data).not.toHaveProperty(
        integrationCasedString(integrations[index], "record_id")
      );
      expect(
        received[0].data[integrationCasedString(integrations[index], "id")]
      ).toEqual(i.message.messageId);
      expect(received[1].metadata.columns).not.toHaveProperty(
        integrationCasedString(integrations[index], "record_id")
      );
      expect(received[1].data).not.toHaveProperty(
        integrationCasedString(integrations[index], "record_id")
      );
      expect(
        received[1].data[integrationCasedString(integrations[index], "id")]
      ).toEqual(i.message.messageId);
    });
  });

  it("should not set id based on recordId if event type is not track", () => {
    let i = input("page");
    i.message.recordId = 42;
    i.metadata = { sourceCategory: "cloud" };
    if (i.message.context.sources) delete i.message.context.sources.version;
    transformers.forEach((transformer, index) => {
      const received = transformer.process(i);
      expect(received[0].metadata.columns).not.toHaveProperty(
        integrationCasedString(integrations[index], "record_id")
      );
      expect(received[0].data).not.toHaveProperty(
        integrationCasedString(integrations[index], "record_id")
      );
      expect(
        received[0].data[integrationCasedString(integrations[index], "id")]
      ).toEqual(i.message.messageId);
      expect(
        received[0].metadata.columns[
          integrationCasedString(integrations[index], "id")
        ]
      ).toEqual("string");
    });
  });

  it("should set id based on recordId when sourceCategory is cloud and has source version", () => {
    let i = input("track");
    i.message.recordId = 42;
    i.message.properties.recordId = "anotherRecordId";
    i.metadata = { sourceCategory: "cloud" };
    i.message.context.sources = { version: 1.12 };
    transformers.forEach((transformer, index) => {
      const received = transformer.process(i);
      expect(
        received[0].metadata.columns[
          integrationCasedString(integrations[index], "record_id")
        ]
      ).toEqual("string");
      expect(
        received[0].data[
          integrationCasedString(integrations[index], "record_id")
        ]
      ).toBe("42");

      expect(
        received[1].metadata.columns[
          integrationCasedString(integrations[index], "id")
        ]
      ).toEqual("int");
      expect(
        received[1].data[integrationCasedString(integrations[index], "id")]
      ).toBe(42);
      expect(received[1].metadata.columns).not.toHaveProperty(
        integrationCasedString(integrations[index], "record_id")
      );
      expect(received[1].data).not.toHaveProperty(
        integrationCasedString(integrations[index], "record_id")
      );
    });
  });

  it("should set id based on recordId when sourceCategory is singer-protocol and has source version", () => {
    let i = input("track");
    i.message.recordId = 42;
    i.message.properties.recordId = "anotherRecordId";
    i.metadata = { sourceCategory: "singer-protocol" };
    i.message.context.sources = { version: 1.12 };
    transformers.forEach((transformer, index) => {
      const received = transformer.process(i);
      expect(
        received[0].metadata.columns[
          integrationCasedString(integrations[index], "record_id")
        ]
      ).toEqual("string");
      expect(
        received[0].data[
          integrationCasedString(integrations[index], "record_id")
        ]
      ).toBe("42");

      expect(
        received[1].metadata.columns[
          integrationCasedString(integrations[index], "id")
        ]
      ).toEqual("int");
      expect(
        received[1].data[integrationCasedString(integrations[index], "id")]
      ).toBe(42);
      expect(received[1].metadata.columns).not.toHaveProperty(
        integrationCasedString(integrations[index], "record_id")
      );
      expect(received[1].data).not.toHaveProperty(
        integrationCasedString(integrations[index], "record_id")
      );
    });
  });

  it("should throw error when sourceCategory is cloud and has source version and recordId is missing", () => {
    let i = input("track");
    i.message.properties.recordId = "anotherRecordId";
    i.metadata = { sourceCategory: "cloud" };
    i.message.context.sources = { version: 1.12 };
    transformers.forEach((transformer, index) => {
      expect(() => transformer.process(i)).toThrow(
        "recordId cannot be empty for cloud sources events"
      );
    });
  });
});

describe("handle level three nested events from sources", () => {
  it("should stringify event properties whose level ge 3 for cloud sources", () => {
    const i = input("track");
    i.metadata = { sourceCategory: "cloud" };
    i.message.properties = Object.assign(i.message.properties, {
      n0: {
        prop0: "prop level 0",
        n1: {
          prop1: "prop level 1",
          n2: {
            prop2: "prop level 2",
            n3: {
              prop3: "prop level 3",
              n4: { prop4: "prop level 4" }
            }
          }
        }
      }
    });
    transformers.forEach((transformer, index) => {
      const received = transformer.process(i);
      expect(received[1].metadata.columns).not.toHaveProperty(
        integrationCasedString(integrations[index], "n_0_n_1_n_2_n_3_prop_3")
      );
      expect(received[1].data).not.toHaveProperty(
        integrationCasedString(integrations[index], "n_0_n_1_n_2_n_3_prop_3")
      );
    });
  });

  it("should not stringify event properties whose level ge 3 for non cloud sources", () => {
    const i = input("track");
    i.message.properties = Object.assign(i.message.properties, {
      n0: {
        prop0: "prop level 0",
        n1: {
          prop1: "prop level 1",
          n2: {
            prop2: "prop level 2",
            n3: {
              prop3: "prop level 3",
              n4: { prop4: "prop level 4" }
            }
          }
        }
      }
    });
    transformers.forEach((transformer, index) => {
      const received = transformer.process(i);
      expect(received[1].metadata.columns).toHaveProperty(
        integrationCasedString(integrations[index], "n_0_n_1_n_2_n_3_prop_3")
      );
      expect(received[1].data).toHaveProperty(
        integrationCasedString(integrations[index], "n_0_n_1_n_2_n_3_prop_3")
      );
    });
  });
});

describe("Handle no of columns in an event", () => {
  it("should throw an error if no of columns are more than 200", () => {
    const i = input("track");
    transformers
      .filter((transformer, index) => integrations[index] !== "s3_datalake")
      .forEach((transformer, index) => {
        i.message.properties = largeNoOfColumnsevent;
        expect(() => transformer.process(i)).toThrow(
          "transfomer: Too many columns outputted from the event"
        );
      });
  });

  it("should not throw an error if no of columns are more than 200 and the event is from rudder-sources", () => {
    const i = input("track");
    transformers.forEach((transformer, index) => {
      i.message.channel = "sources";
      i.message.properties = largeNoOfColumnsevent;
      expect(() => transformer.process(i)).not.toThrow();
    });
  });
});

describe("Add auto generated messageId for events missing it", () => {
  it("should remove context_ip set by user in properties if missing in event", () => {
    eventTypes.forEach(evType => {
      let i = input(evType);
      delete i.message.messageId;

      transformers.forEach((transformer, index) => {
        const received = transformer.process(i);
        expect(received[0].metadata.columns).toHaveProperty(
          integrationCasedString(integrations[index], "id")
        );
        expect(received[0].data).toHaveProperty(
          integrationCasedString(integrations[index], "id")
        );
        expect(
          received[0].data[integrationCasedString(integrations[index], "id")]
        ).toMatch(/auto-.*/);
      });
    });
  });
});

describe("Add receivedAt for events missing it", () => {
  it("should remove context_ip set by user in properties if missing in event", () => {
    eventTypes.forEach(evType => {
      let i = input(evType);
      delete i.message.receivedAt;
      delete i.message.received_at;

      transformers.forEach((transformer, index) => {
        const received = transformer.process(i);
        expect(received[0].metadata.columns).toHaveProperty(
          integrationCasedString(integrations[index], "received_at")
        );
        expect(received[0].data).toHaveProperty(
          integrationCasedString(integrations[index], "received_at")
        );
      });
    });
  });
});

describe("Integration options", () => {
  describe("track", () => {
    it("should generate two events for every track call", () => {
      const i = opInput("track");
      transformers.forEach((transformer, index) => {
        const received = transformer.process(i);
        expect(received).toMatchObject(opOutput("track", integrations[index]));
      });
    });
  });
});
