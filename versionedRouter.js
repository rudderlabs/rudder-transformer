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

const getHandler = versionedDestination => {
  return require(`./${versionedDestination}/transform`);
};

versions.forEach(version => {
  const versionDestinations = getDirectories(version);
  versionDestinations.forEach(versionedDestination => {
    const handler = getHandler(versionedDestination);
    router.post(`/${versionedDestination}`, async (ctx, next) => {
      ctx.body = await handler.process(ctx.request.body);
    });
  });
});

module.exports = router;
