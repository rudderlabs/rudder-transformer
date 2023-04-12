const fs = require("fs");
const path = require("path");
const version = "v0";
const { RedisDB } = require('../../src/util/redisConnector');
jest.mock('ioredis', () => require('../__mocks__/redis'));
const sourcesList = ['shopify']
const destList = [];
process.env.USE_REDIS_DB = 'true';
describe(`Source Tests`, () => {
  sourcesList.forEach((source) => {
    const testDataFile = fs.readFileSync(
      path.resolve(__dirname, `./data/redis/${source}_source.json`)
    );
    const data = JSON.parse(testDataFile);
    const transformer = require(`../../src/${version}/sources/${source}/transform`);

    data.forEach((dataPoint, index) => {
      it(`${index}. ${source} - ${dataPoint.description}`, async () => {
        try {
          const output = await transformer.process(dataPoint.input);
          expect(output).toEqual(dataPoint.output);
        } catch (error) {
          expect(error.message).toEqual(dataPoint.output.error);
        }
      });
    });
  })
});

describe(`Redis Class Get Tests`, () => {
  const testDataFile = fs.readFileSync(
    path.resolve(__dirname, `./data/redis/redisConnector.json`)
  );
  const data = JSON.parse(testDataFile);
  data.forEach((dataPoint, index) => {
    it(`${index}. Redis Get- ${dataPoint.description}`, async () => {
      try {
        const output = await RedisDB.getVal(dataPoint.input.value, false);
        expect(output).toEqual(dataPoint.output);
      } catch (error) {
        expect(error.message).toEqual(dataPoint.output.error);
      }
    });
  });
});

describe(`Redis Class Set Fail Test`, () => {
  it(`Redis Set Fail Case Test`, async () => {
    try {
      await RedisDB.setVal("error", "test", false);
    } catch (error) {
      expect(error.message).toEqual("Error setting value in Redis due Error: Connection is Closed");
    }
  });
});
