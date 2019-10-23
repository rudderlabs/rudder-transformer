const Router = require("koa-router");

const { lstatSync, readdirSync } = require("fs");
const { join } = require("path");

const versions = ["v0"];

const router = new Router();

const isDirectory = source => lstatSync(source).isDirectory();

const getDirectories = source =>
  readdirSync(source)
    .map(name => join(source, name))
    .filter(isDirectory);

const getDestHandler = versionedDestination => {
  return require(`./${versionedDestination}/transform`);
};

let areFunctionsEnabled = -1;
const functionsEnabled = () => {
  if (areFunctionsEnabled === -1) {
    areFunctionsEnabled = process.env.ENABLE_FUNCTIONS === "false" ? 0 : 1;
  }
  return areFunctionsEnabled === 1;
};

const userTransformHandler = () => {
  if (functionsEnabled()) {
    return require("./util/customTransformer").userTransformHandler;
  }
  throw new Error("Functions are not enabled");
};

versions.forEach(version => {
  const versionDestinations = getDirectories(version);
  versionDestinations.forEach(versionedDestination => {
    const destHandler = getDestHandler(versionedDestination);
    router.post(`/${versionedDestination}`, async (ctx, next) => {
      let events = ctx.request.body;

      if (functionsEnabled()) {
        try {
          events = await userTransformHandler()(events);
        } catch (error) {
          const respList = [];
          events.forEach(event => {
            respList.push({ statusCode: 400, error: error.message });
          });
          ctx.body = respList;
          return;
        }
      }

      // No errors should be returned in Destination Handler
      ctx.body = await destHandler.process(events);
    });
  });
});

module.exports = router;
