const redis = require('redis');
const log = require('../logger');

const host = process.env.REDIS_HOST || 'localhost';
const port = process.env.REDIS_PORT || 6379;
const password = process.env.REDIS_PASSWORD || '';

const createAndGetRedisClient = () => {
  const client = redis.createClient({
    socket: {
      host,
      port,
    },
    password,
  });
  client.on('error', (err) => {
    log.info(`Err+1 happened while Creating Redis Client  ${err}`);
  })
  return client;

}
const DBConnector = {
  redisInstance: createAndGetRedisClient(),
  async getRedisInstance() {
    if (DBConnector.redisInstance && !DBConnector.redisInstance?.isOpen) {
      await DBConnector.redisInstance
        .connect()
        .catch((err) => {
          log.info(`err happened while connecting to redis ${err}`);
        });
    }
    return DBConnector.redisInstance;
  },
};
process.on('exit', async () => {
  await DBConnector.redisInstance.quit().then((res) => {
    log.info(`Redis Instance Terminated Gracefully ${res}`);
  });
});
module.exports = { DBConnector };
