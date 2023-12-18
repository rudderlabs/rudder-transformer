/*
Key aspects covered:
  1. Flattening a sample event
      - data types: int, float, string
      - array data type is considered as string
      - blank, null types are omitted
      - rudder reserved keywords are omitted
      - warehouse reserved columns are escaped i.e. prefixed by _
  2. Coud source event
      - same as above for nested property under level 3
      - Above level 3 are stringified and considered as string type
  3. Introducing jsonLegacyPathKeys for BQ, PG, RS, SF
      - data types: int, float, string, json
      - number, string, array, objects fit under json data type, value is json stringified
      - in BQ, json type is just a string data type
      - have more priority than cloud source under level 3 i.e. 4th level jsonKey is already being captured as string
      - blank, null types are omitted
      - rudder reserved keywords are omitted
      - other than track events are omitted
      - warehouse reserved columns are escaped i.e. prefixed by _
  4. Postgres column length limit 63 characters
*/

const {
  setDataFromInputAndComputeColumnTypes
} = require("../../src/warehouse/index.js");
const { getVersionedUtils } = require("../../src/warehouse/util.js");
const {
  fInput,
  fOutput
} = require("./data/warehouse/flatten_event_properties.js");

const version = "v0";
const whSchemaVersion = "v1";
const integrations = ["postgres", "rs", "bq"];
const transformers = integrations.map(integration =>
  require(`../../src/${version}/destinations/${integration}/transform`)
);
const eventType = "track";
const utils = getVersionedUtils(whSchemaVersion);

describe("Flatten event properties", () => {
  transformers.forEach((transformer, index) => {
    describe(`Flatten events for WH ${integrations[index]}`, () => {
      const options = {
        provider: integrations[index],
        getDataTypeOverride: transformer.getDataTypeOverride
      };
      const i = fInput("sample_event");
      const j = fInput("nested_event");

      it("Should flatten all properties of simple event", () => {
        const output = {};
        const columnTypes = {};
        setDataFromInputAndComputeColumnTypes(
          utils,
          eventType,
          output,
          i,
          columnTypes,
          options
        );
        const expected = fOutput("sample_event", integrations[index]);
        expect(output).toEqual(expected.output);
        expect(columnTypes).toEqual(expected.columnTypes);
      });

      it("Should stringify properties of simple event if source is cloud and level > 3", () => {
        options.sourceCategory = "cloud";
        const output = {};
        const columnTypes = {};
        setDataFromInputAndComputeColumnTypes(
          utils,
          eventType,
          output,
          i,
          columnTypes,
          options
        );
        delete options.sourceCategory;
        const expected = fOutput("cloud_event", integrations[index]);
        expect(output).toEqual(expected.output);
        expect(columnTypes).toEqual(expected.columnTypes);
      });

      it("Should stringify properties of sample event if jsonLegacyPathKeys are present", () => {
        options.jsonLegacyPathKeys = {
          arrayProp: 0,
          objectProp_firstLevelMap_secondLevelMap: 2
        };
        const output = {};
        const columnTypes = {};
        setDataFromInputAndComputeColumnTypes(
          utils,
          eventType,
          output,
          i,
          columnTypes,
          options
        );
        delete options.jsonLegacyPathKeys;
        const expected = fOutput("json_key_event", integrations[index]);
        expect(output).toEqual(expected.output);
        expect(columnTypes).toEqual(expected.columnTypes);
      });

      it("Should stringify properties of sample event and jsonLegacyPathKeys has more priority than cloud source at level 3", () => {
        options.jsonLegacyPathKeys = {
          objectProp_firstLevelMap_secondLevelMap_thirdLevelMap: 3
        };
        options.sourceCategory = "cloud";
        const output = {};
        const columnTypes = {};
        setDataFromInputAndComputeColumnTypes(
          utils,
          eventType,
          output,
          i,
          columnTypes,
          options
        );
        delete options.jsonLegacyPathKeys;
        delete options.sourceCategory;
        const expected = fOutput("json_key_cloud_event", integrations[index]);
        expect(output).toEqual(expected.output);
        expect(columnTypes).toEqual(expected.columnTypes);
      });

      it("Should stringify properties of nested event and jsonLegacyPathKeys is not applied for cloud source at level > 3", () => {
        options.jsonLegacyPathKeys = {
          objectProp_firstLevelMap_secondLevelMap_thirdLevelMap_fourthLevelMap: 4,
          arrayProp: 0
        };
        options.sourceCategory = "cloud";
        const output = {};
        const columnTypes = {};
        setDataFromInputAndComputeColumnTypes(
          utils,
          eventType,
          output,
          j,
          columnTypes,
          options
        );
        delete options.jsonLegacyPathKeys;
        delete options.sourceCategory;
        const expected = fOutput("cloud_json_key_event", integrations[index]);
        expect(output).toEqual(expected.output);
        expect(columnTypes).toEqual(expected.columnTypes);
      });

      it("Should flatten all properties of sample event and jsonLegacyPathKeys is not applicable other than track events", () => {
        options.jsonLegacyPathKeys = { arrayProp: 0 };
        const output = {};
        const columnTypes = {};
        setDataFromInputAndComputeColumnTypes(
          utils,
          "identify",
          output,
          i,
          columnTypes,
          options
        );
        delete options.jsonLegacyPathKeys;
        // Will be same as flattening all properties
        const expected = fOutput("sample_event", integrations[index]);
        expect(output).toEqual(expected.output);
        expect(columnTypes).toEqual(expected.columnTypes);
      });

      it("Should flatten all properties of sample event and declared jsonLegacyPathKeys get stringified primitive values", () => {
        i.dateProp = "2022-01-01T00:00:00.000Z";
        i.objectProp.firstLevelDateProp = "2022-01-01T01:01:01.111Z";
        i.objectProp.firstLevelMap.secondLevelDateProp =
          "2022-01-01T02:02:02.222Z";
        options.jsonLegacyPathKeys = {
          nullProp: 0,
          blankProp: 0,
          floatProp: 0,
          stringProp: 0,
          dateProp: 0,
          objectProp_firstLevelInt: 1,
          objectProp_firstLevelBool: 1,
          objectProp_firstLevelMap_secondLevelBlankProp: 2,
          objectProp_firstLevelMap_secondLevelDateProp: 2,
          objectProp_firstLevelMap_secondLevelMap_thirdLevelString: 3
        };
        const output = {};
        const columnTypes = {};
        setDataFromInputAndComputeColumnTypes(
          utils,
          eventType,
          output,
          i,
          columnTypes,
          options
        );
        delete options.jsonLegacyPathKeys;
        delete i.dateProp;
        delete i.objectProp.firstLevelDateProp;
        delete i.objectProp.firstLevelMap.secondLevelDateProp;
        const expected = fOutput("primitive_json_event", integrations[index]);
        expect(output).toEqual(expected.output);
        expect(columnTypes).toEqual(expected.columnTypes);
      });

      it("Should ignore rudder reserved columns even though they are set as jsonLegacyPathKeys", () => {
        // setting two reserved columns as map
        i.anonymous_id = "ignored column";
        i.timestamp = "ignored column";
        // setting reserved colum paths as json keys
        options.jsonLegacyPathKeys = { anonymous_id: 0, timestamp: 0 };
        const output = {};
        const columnTypes = {};
        setDataFromInputAndComputeColumnTypes(
          utils,
          eventType,
          output,
          i,
          columnTypes,
          options
        );
        delete options.jsonLegacyPathKeys;
        // Will be same as flattening all properties with reserved columns being ignored
        const expected = fOutput("sample_event", integrations[index]);
        expect(output).toEqual(expected.output);
        expect(columnTypes).toEqual(expected.columnTypes);
      });

      it("Should apply escaping on WH reserved columns even though they are set as jsonLegacyPathKeys", () => {
        // setting two reserved columns as map
        i.between = "escaped column";
        i.as = "escaped column";
        // setting reserved colum paths as json keys
        options.jsonLegacyPathKeys = { between: 0, as: 0 };
        const output = {};
        const columnTypes = {};
        setDataFromInputAndComputeColumnTypes(
          utils,
          eventType,
          output,
          i,
          columnTypes,
          options
        );
        delete options.jsonLegacyPathKeys;
        // Escaping is applied as usual for json keys too
        const expected = fOutput("escape_event", integrations[index]);
        expect(output).toEqual(expected.output);
        expect(columnTypes).toEqual(expected.columnTypes);
      });
    });
  });
});
