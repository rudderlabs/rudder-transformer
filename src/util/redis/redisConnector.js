const Redis = require('ioredis');
const { isDefinedAndNotNull } = require('../../v0/util');
const { RedisError } = require('../../v0/util/errorTypes');
const log = require('../../logger');
const stats = require('../stats');

const timeoutPromise = () =>
  new Promise((_, reject) => {
    setTimeout(() => reject(new Error('Timeout while connecting to redis')), 1200);
  });
const RedisDB = {
  init() {
    if (process.env.USE_REDIS_DB && process.env.USE_REDIS_DB !== 'false') {
      this.host = process.env.REDIS_HOST || 'localhost';
      this.port = parseInt(process.env.REDIS_PORT, 10) || 6379;
      this.password = process.env.REDIS_PASSWORD;
      this.userName = process.env.REDIS_USERNAME;
      this.maxRetries = parseInt(process.env.REDIS_MAX_RETRIES, 10) || 5;
      this.timeAfterRetry = parseInt(process.env.REDIS_TIME_AFTER_RETRY_IN_MS, 10) || 500;
      this.client = new Redis({
        host: this.host,
        port: this.port,
        password: this.password,
        username: this.userName,
        enableReadyCheck: true,
        retryStrategy: (times) => {
          if (times <= this.maxRetries) {
            return (1 + times) * this.timeAfterRetry; // reconnect after
          }
          stats.increment('redis_error', {
            operation: 'redis_down',
          });
          log.error(`Redis is down at ${this.host}:${this.port}`);
          return false; // stop retrying
        },
        tls: {}
      });
      this.client.on('ready', () => {
        log.info(`Connected to redis at ${this.host}:${this.port}`);
      });
    }
  },

  async checkRedisConnectionReadyState() {
    try {
      await this.client.connect();
    } catch (error) {
      return new Promise((resolve) => {
        this.client.on('ready', () => {
          resolve();
        });
      });
    }
    return Promise.resolve();
  },

  /**
   * Checks connection with redis and if not connected, tries to connect and throws error if connection request fails
   */
  async checkAndConnectConnection() {
    if (!this.client || this.client.status === 'end') {
      this.init();
    }
    if (this.client.status !== 'ready') {
      await Promise.race([this.checkRedisConnectionReadyState(), timeoutPromise()]);
    }
  },
  /**
   * Used to get value from redis depending on the key and the expected value type
   * @param {*} hashKey parent key
   * @param {*} isObjExpected false if fetched value can not be json
   * @param {*} key  key for which value needs to be extracted, required if isObjExpected is true
   * @returns value which can be json or string or number
   * storage of data in case isObjExpected is true
   * hashKey:{
   * key1: {internalKey1:val1},
   * key2: {internalKey2:val2},
   * }
   */
  async getVal(hashKey, key, isObjExpected = true) {
    try {
      await this.checkAndConnectConnection(); // check if redis is connected and if not, connect
      let redisVal;
      if (isObjExpected === true) {
        redisVal = await this.client.hget(hashKey, key);
        if (isDefinedAndNotNull(redisVal)) {
          try {
            return JSON.parse(redisVal);
          } catch (e) {
            // do nothing
            return redisVal;
          }
        }
        return redisVal;
      }
      return this.client.get(hashKey);
    } catch (e) {
      stats.increment('redis_error', {
        operation: 'get',
      });
      log.error(`Error getting value from Redis: ${e}`);
      throw new RedisError(`Error getting value from Redis: ${e}`);
    }
  },
  /**
   * Used to set value in redis depending on the key and the value type
   * @param {*} key key for which value needs to be stored
   * @param {*} value to be stored in redis send it in array format [field1, value1, field2, value2]
   *                  if Value is an object
   * @param {*} expiryTimeInSec expiry time of data in redis by default 1 hr
   * @param {*} isValJson set to false if value is not a json object
   *
   */
  async setVal(key, value, expiryTimeInSec = 60 * 60) {
    try {
      await this.checkAndConnectConnection(); // check if redis is connected and if not, connect
      if (typeof value === 'object') {
        const valueToStore = value.map((element) => {
          if (typeof element === 'object') {
            return JSON.stringify(element);
          }
          return element;
        });
        await this.client
          .multi()
          .hmset(key, ...valueToStore)
          .expire(key, expiryTimeInSec)
          .exec();
      } else {
        await this.client.multi().set(key, value).expire(key, expiryTimeInSec).exec();
      }
    } catch (e) {
      stats.increment('redis_error', {
        operation: 'set',
      });
      log.error(`Error setting value in Redis due ${e}`);
      throw new RedisError(`Error setting value in Redis due ${e}`);
    }
  },
  async disconnect() {
    if (process.env.USE_REDIS_DB && process.env.USE_REDIS_DB !== 'false') {
      log.info(`Disconnecting from redis at ${this.host}:${this.port}`);
      this.client.disconnect();
    }
  },
};

module.exports = { RedisDB };
