/* eslint-disable no-return-await */
/* eslint-disable no-console */
const Redis = require("redis");

const runQueries = async () => {
  const redisClient = Redis.createClient({
    url: "redis://:@localhost:6379"
  });
  // redisClient.on("error", err => console.log("Redis Client Error", err));

  await redisClient.connect();
  console.log(redisClient.isReady, redisClient.isOpen);
  await redisClient.set("key", "abc");
  const value = await redisClient.get("key");
  console.log(value);
  console.log(redisClient.options.name);
  const res = await redisClient.sendCommand(["SET", "myKey", "myValue"]);
  console.log(res);
  console.log(await redisClient.sendCommand(["GET", "myKey"]));
  console.log(await redisClient.get("myKey"));
};

(async () => {
  try {
    await runQueries();
  } catch (err) {
    console.log("ERROR");
    console.log(err);
  }
})();
