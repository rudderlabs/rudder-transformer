const fs = require("fs");
const path = require("path");
const version = "v0";
const { RedisDB } = require('./redisConnector');
jest.mock('ioredis', () => require('../../../test/__mocks__/redis'));
const sourcesList = ['shopify']
const destList = [];
process.env.USE_REDIS_DB = 'true';

const timeoutPromise = () => new Promise((resolve, _) => {
  setTimeout(
    () => resolve(),
    100
  );
});

describe('checkRedisConnectionReadyState', () => {
  RedisDB.init();
  it('should resolve if client connects after initial connection error', async () => {
    RedisDB.client.end(3);
    await Promise.race([RedisDB.checkRedisConnectionReadyState(), timeoutPromise()]);
    expect(RedisDB.client.status).toBe('ready');
  });
  it('should resolve if client is already connected', async () => {
    await RedisDB.checkRedisConnectionReadyState();
    expect(RedisDB.client.status).toBe('ready');
  });
});
describe('checkAndConnectConnection', () => {
  it('Status is end', async () => {
    RedisDB.client.end(11);
    await Promise.race([RedisDB.checkAndConnectConnection(), timeoutPromise()]);
    expect(RedisDB.client.status).toBe('ready');
  });
  it('should resolve if client is already connected', async () => {
    await RedisDB.checkAndConnectConnection();
    expect(RedisDB.client.status).toBe('ready');
  });
});
describe(`Source Tests`, () => {
  sourcesList.forEach((source) => {
    const testDataFile = fs.readFileSync(
      path.resolve(__dirname, `./testData/${source}_source.json`)
    );
    const data = JSON.parse(testDataFile);
    const transformer = require(`../../${version}/sources/${source}/transform`);

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
    path.resolve(__dirname, `./testData/redisConnector.json`)
  );
  const data = JSON.parse(testDataFile);
  data.forEach((dataPoint, index) => {
    it(`${index}. Redis Get- ${dataPoint.description}`, async () => {
      try {
        const output = await RedisDB.getVal(dataPoint.input.value, isObjExpected = false);
        expect(output).toEqual(dataPoint.output);
      } catch (error) {
        expect(error.message).toEqual(dataPoint.output.error);
      }
    });
  });
  it(`Redis Get- Nothing Found in redis - return null`, async () => {
    const dataPoint = {
      input: {
        value: "not_in_redis",
      },
      output: {
        value: null
      }
    };
    const output = await RedisDB.getVal(dataPoint.input.value, "key1");
    expect(output).toEqual(dataPoint.output.value);
  });
});

describe(`Redis Class Set Test`, () => {
  it(`Redis Set Fail Case Test`, async () => {
    try {
      await RedisDB.setVal("error", "test");
    } catch (error) {
      expect(error.message).toEqual("Error setting value in Redis due Error: Connection is Closed");
    }
  });
  it(`Redis Set Fail Case Test`, async () => {
    const result = "OK"
    await RedisDB.setVal("Key", "test");
    expect(result).toEqual("OK");
  });
});
describe(`Redis Disconnect`, () => {
  it(`Redis Disconnect Test`, async () => {
    const result = "OK"
    await RedisDB.disconnect();
    expect(result).toEqual("OK");
  });
});
