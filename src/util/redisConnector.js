const Redis = require('ioredis');
const { RedisError } = require('../v0/util/errorTypes');
const log = require('../logger');
const stats = require('./stats');

const timeoutPromise = new Promise((resolve, reject) => {
  setTimeout(
    () => resolve(),
    50
  );
});

const RedisDB = {
  init() {
    if (process.env.USE_REDIS_DB !== 'false') {
      this.host = process.env.REDIS_HOST || 'localhost';
      this.port = parseInt(process.env.REDIS_PORT, 10) || 6379;
      this.password = process.env.REDIS_PASSWORD;
      this.maxRetries = parseInt(process.env.REDIS_MAX_RETRIES || 30, 10);
      this.timeAfterRetry = parseInt(process.env.REDIS_TIME_AFTER_RETRY_IN_MS || 10, 10);
      this.client = new Redis({
        host: this.host,
        port: this.port,
        password: this.password,
        enableReadyCheck: true,
        retryStrategy: (times) => {
          if (times <= this.maxRetries) {
            return 10 + times * this.timeAfterRetry;
          }
          log.error(`Redis is down at ${this.host}:${this.port}`);
          return false; // stop retrying
        },
      });
      this.client.on('ready', () => {
        stats.increment('redis_ready', {
          timestamp: Date.now(),
        });
        log.info(`Connected to redis at ${this.host}:${this.port}`);
      });
    }
  },
  /**
   * Checks connection with redis and if not connected, tries to connect and throws error if connection request fails
   */
  async checkAndConnectConnection() {
    if (!this.client) {
      this.init();
    }
    else if (this.client.status !== 'ready') {
      await Promise.race([this.client.connect(), timeoutPromise])
    }
  },
  /**
   * Used to get value from redis depending on the key and the expected value type
   * @param {*} key key for which value needs to be extracted
   * @param {*} isJsonExpected false if fetched value can not be json
   * @returns value which can be json or string or number
   *
   */
  async getVal(key, isJsonExpected = true) {
    try {
      await this.checkAndConnectConnection(); // check if redis is connected and if not, connect
      const value = await this.client.get(key);
      if (value) {
        const bytes = Buffer.byteLength(value, "utf-8");
        stats.gauge('redis_get_val_size', bytes, {
          timestamp: Date.now()
        });
      }
      return isJsonExpected ? JSON.parse(value) : value;
    } catch (e) {
      throw new RedisError(`Error getting value from Redis: ${e}`);
    }
  },
  /**
   * Used to set value in redis depending on the key and the value type
   * @param {*} key key for which value needs to be stored
   * @param {*} value value to be stored in redis
   * @param {*} isValJson set to false if value is not a json object
   */

  async setVal(key, value, isValJson = true) {
    const dataExpiry = 60*60; // 1 hour
    try {
      await this.checkAndConnectConnection(); // check if redis is connected and if not, connect
      const valueToStore = isValJson ? JSON.stringify(value) : value;
      const bytes = Buffer.byteLength(valueToStore, "utf-8");
      await this.client.setex(key,dataExpiry, valueToStore);
      stats.gauge('redis_set_val_size', bytes, {
        timestamp: Date.now()
      });
    } catch (e) {
      throw new RedisError(`Error setting value in Redis due ${e}`);
    }
  },
  async disconnect() {
    if (process.env.USE_REDIS_DB !== 'false') {
      stats.increment('redis_graceful_shutdown', {
        timestamp: Date.now(),
      });
      this.client.quit();
    }
  }
};

module.exports = { RedisDB };
