const Router = require("koa-router");
const _ = require("lodash");

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
      const events = ctx.request.body;
      const respList = [];
      await events.forEach(async event => {
        try {
          let respEvents = await destHandler.process(event);
          if (!Array.isArray(respEvents)) {
            respEvents = [respEvents];
          }
          respList.push(
            ...respEvents.map(ev => {
              return { output: ev, metadata: event.metadata };
            })
          );
        } catch (error) {
          respList.push({
            statusCode: 400,
            error: error.message || "Error occurred while processing payload.",
            metadata: event.metadata
          });
        }
      });
      ctx.body = respList;
    });
  });
});

if (functionsEnabled()) {
  router.post("/customTransform", async (ctx, next) => {
    const events = ctx.request.body;
    const groupedEvents = _.groupBy(
      events,
      event => `${event.destination.ID}_${event.message.anonymousId}`
    );
    const transformedEvents = [];
    await Promise.all(
      Object.entries(groupedEvents).map(async ([dest, destEvents]) => {
        const transformationVersionId =
          destEvents[0] &&
          destEvents[0].destination &&
          destEvents[0].destination.Transformations &&
          destEvents[0].destination.Transformations[0] &&
          destEvents[0].destination.Transformations[0].VersionID;
        if (transformationVersionId) {
          let destTransformedEvents;
          try {
            destTransformedEvents = await userTransformHandler()(
              destEvents,
              transformationVersionId
            );
          } catch (error) {
            destTransformedEvents = [
              // add metadata from first event since all events will have same session_id
              // and session_id along with dest_id, dest_type are used to handle failures in case of custom transformations
              {
                statusCode: 400,
                error: error.message,
                metadata: destEvents[0].metadata
              }
            ];
          }
          transformedEvents.push(...destTransformedEvents);
        } else {
          transformedEvents.push(...destEvents);
        }
      })
    );
    ctx.body = transformedEvents;
  });
}

router.get("/version", (ctx, next) => {
  ctx.body = process.env.npm_package_version || "Version Info not found";
});

router.get("/health", (ctx, next) => {
  ctx.body = "OK";
});

module.exports = router;
