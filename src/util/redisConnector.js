const Redis = require('ioredis');
const { RedisError } = require('../v0/util/errorTypes');
const log = require('../logger');

class RedisDB {
  constructor() {
    this.connectingFirstTime = true;
    this.host = process.env.REDIS_HOST || 'localhost';
    this.port = parseInt(process.env.REDIS_PORT, 10) || 6379;
    this.password = process.env.REDIS_PASSWORD || 'abc';
    this.maxRetries = parseInt(process.env.REDIS_MAX_RETRIES || 30, 10);
    this.timeAfterRetry = parseInt(process.env.REDIS_TIME_AFTER_RETRY_IN_MS || 10, 10);
    this.client = new Redis({
      host: this.host,
      port: this.port,
      password: this.password,
      enableReadyCheck: true,
      retryStrategy: (times) => {
        if (times <= this.maxRetries) {
          return (10 + times * this.timeAfterRetry);
        }
        this.isRedisUp = false;
        log.error(`Redis is down at ${this.host}:${this.port}`);
        return false; // stop retrying
      }
    });
    // this.client.on('error', (err) => {
    //   log.error(`Error occurred on while connecting with redis ${err}`);
    // });
    this.client.on('ready', (res) => {
      this.connectingFirstTime = false;
      log.info(`Connected to redis at ${this.host}:${this.port}`);
    });
  }

  /**
   * Used to get value from redis depending on the key and the expected value type
   * @param {*} key key for which value needs to be extracted
   * @param {*} isJsonExpected false if fetched value can not be json
   * @param {*} specificInternalKey this is to retrieve [key][specificInternalKey]
   * @returns value which can be json or string or number 
   * 
   * Ex:  
   * if specificInternalKey is given
   * 'key': {'internalKey': 'value1', internalKey2: value2}
   * 1. getVal('key', 'internalKey') => value1
   */
  async getVal(key, specificInternalKey = null, isJsonExpected = true) {
    try {
      if ((this.client?.status !== 'ready')) {
        if (!this.connectingFirstTime) {
          await this.client.connect() // not waiting for connecting and throwing error connection is closed
        }
        // eslint-disable-next-line no-promise-executor-return
        await new Promise((resolve) => setTimeout(resolve, 1000)); // waiting for connection to be established for max 10ms
      }
      if (isJsonExpected) {
        let value;
        if (specificInternalKey) {
          await this.hget(key, specificInternalKey);
          return value[specificInternalKey];
        }
        value = await this.hgetall(key);
        return value;
      }
      const value = await this.client.get(key);
      return value;
    } catch (e) {
      throw new RedisError(`Error getting value from Redis: ${e}`);
    }
  }

  /**
   * Used to set value in redis depending on the key and the value type
   * @param {*} key key for which value needs to be stored
   * @param {*} value value to be stored in redis
   * @param {*} isValJson set to false if value is not a json object
   */
  async setVal(key, value, isValJson = true) {
    try {
      if ((this.client?.status !== 'ready')) {
        if (!this.connectingFirstTime) {
          await this.client.connect() // not waiting for connecting and throwing error connection is closed
        }
        // eslint-disable-next-line no-promise-executor-return
        await new Promise((resolve) => setTimeout(resolve, 1000)); // waiting for connection to be established for max 10ms
      }
      if (isValJson) {
        Object.keys(value).forEach(async (internalKey) => {
          await this.hmset(key, internalKey, value[internalKey]);
        });

      } else {
        await this.client.set(key, value);
      }
    } catch (e) {
      throw new RedisError(`Error setting value in Redis due ${e}`);
    }
  }
};

const dbInstance = new RedisDB();

process.on('exit', async () => {
  log.info('Process exit event received');
  await dbInstance.client.disconnect();
  log.info('Redis client disconnected');
});

module.exports = { dbInstance };
