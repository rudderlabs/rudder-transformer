const Redis = require('ioredis');

/**
 * Redis connector for the Rudder Transformer Custom
 * Used for rate limiting and caching
 */
class RedisConnector {
  constructor() {
    this.client = null;
    this.initialized = false;
  }

  /**
   * Initialize the Redis client
   */
  init() {
    if (this.initialized) return;

    this.host = process.env.REDIS_HOST || 'localhost';
    this.port = parseInt(process.env.REDIS_PORT, 10) || 6379;
    this.password = process.env.REDIS_PASSWORD;
    this.username = process.env.REDIS_USERNAME;
    this.maxRetries = parseInt(process.env.REDIS_MAX_RETRIES, 10) || 5;
    this.timeAfterRetry = parseInt(process.env.REDIS_TIME_AFTER_RETRY_IN_MS, 10) || 500;
    
    this.client = new Redis({
      host: this.host,
      port: this.port,
      password: this.password,
      username: this.username,
      enableReadyCheck: true,
      retryStrategy: (times) => {
        if (times <= this.maxRetries) {
          return (1 + times) * this.timeAfterRetry; // reconnect after
        }
        console.error(`Redis is down at ${this.host}:${this.port}`);
        return false; // stop retrying
      },
      tls: {},
    });
    
    this.client.on('ready', () => {
      console.log(`Connected to redis at ${this.host}:${this.port}`);
    });
    
    this.client.on('error', (err) => {
      console.error(`Redis error: ${err}`);
    });
    
    this.initialized = true;
  }

  /**
   * Check if Redis is connected and connect if not
   */
  async checkAndConnectConnection() {
    if (!this.initialized) {
      this.init();
    }
    
    if (!this.client || this.client.status === 'end') {
      this.init();
    }
    
    if (this.client.status !== 'ready') {
      try {
        await this.client.connect();
      } catch (error) {
        return new Promise((resolve) => {
          this.client.on('ready', () => {
            resolve();
          });
        });
      }
    }
    
    return Promise.resolve();
  }

  /**
   * Get a value from Redis
   * @param {string} key - The key to get
   * @returns {Promise<string>} - The value
   */
  async get(key) {
    try {
      await this.checkAndConnectConnection();
      return this.client.get(key);
    } catch (error) {
      console.error(`Error getting value from Redis: ${error}`);
      throw error;
    }
  }

  /**
   * Set a value in Redis
   * @param {string} key - The key to set
   * @param {string} value - The value to set
   * @param {number} expiryTimeInSec - The expiry time in seconds
   */
  async set(key, value, expiryTimeInSec = process.env.REDIS_EXPIRY_TIME_IN_SEC || 3600) {
    try {
      await this.checkAndConnectConnection();
      await this.client.set(key, value, 'EX', expiryTimeInSec);
    } catch (error) {
      console.error(`Error setting value in Redis: ${error}`);
      throw error;
    }
  }

  /**
   * Increment a value in Redis
   * @param {string} key - The key to increment
   * @returns {Promise<number>} - The new value
   */
  async incr(key) {
    try {
      await this.checkAndConnectConnection();
      return this.client.incr(key);
    } catch (error) {
      console.error(`Error incrementing value in Redis: ${error}`);
      throw error;
    }
  }

  /**
   * Disconnect from Redis
   */
  disconnect() {
    if (this.client) {
      console.log(`Disconnecting from redis at ${this.host}:${this.port}`);
      this.client.disconnect();
      this.initialized = false;
    }
  }
}

// Create a singleton instance
const redisConnector = new RedisConnector();

module.exports = redisConnector;