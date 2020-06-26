/* eslint-disable import/no-dynamic-require */
/* eslint-disable global-require */
const Router = require("koa-router");
const _ = require("lodash");
const { lstatSync, readdirSync } = require("fs");
const logger = require("./logger");

const versions = ["v0"];

const transformerMode = process.env.TRANSFORMER_MODE;

const startDestTransformer =
  transformerMode === "destination" || !transformerMode;
const startSourceTransformer = transformerMode === "source" || !transformerMode;

const router = new Router();

const isDirectory = source => {
  return lstatSync(source).isDirectory();
};

const getIntegrations = type =>
  readdirSync(type).filter(destName => isDirectory(`${type}/${destName}`));

const getDestHandler = (version, dest) => {
  return require(`./${version}/destinations/${dest}/transform`);
};

const getSourceHandler = (version, source) => {
  return require(`./${version}/sources/${source}/transform`);
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

async function handleDest(ctx, destHandler) {
  const events = ctx.request.body;
  const reqParams = ctx.request.query;
  logger.debug(`[DT] Input events: ${JSON.stringify(events)}`);
  const respList = [];
  await Promise.all(
    events.map(async event => {
      try {
        const parsedEvent = event;
        parsedEvent.request = { query: reqParams };
        let respEvents = await destHandler.process(parsedEvent);
        if (!Array.isArray(respEvents)) {
          respEvents = [respEvents];
        }
        respList.push(
          ...respEvents.map(ev => {
            let { userId } = ev;
            if (ev.statusCode !== 400 && userId) {
              userId = `${userId}`;
            }
            return { output: { ...ev, userId }, metadata: event.metadata };
          })
        );
      } catch (error) {
        logger.error(error);

        respList.push({
          output: {
            statusCode: 400,
            error: error.message || "Error occurred while processing payload."
          },
          metadata: event.metadata
        });
      }
    })
  );
  logger.debug(`[DT] Output events: ${JSON.stringify(respList)}`);
  ctx.body = respList;
  ctx.set('apiVersion', '1')
}

if (startDestTransformer) {
  versions.forEach(version => {
    const destinations = getIntegrations(`${version}/destinations`);
    destinations.forEach(destination => {
      const destHandler = getDestHandler(version, destination);
      // eg. v0/destinations/ga
      router.post(`/${version}/destinations/${destination}`, async ctx => {
        await handleDest(ctx, destHandler);
      });
      // eg. v0/ga. will be deprecated in favor of v0/destinations/ga format
      router.post(`/${version}/${destination}`, async ctx => {
        await handleDest(ctx, destHandler);
      });
    });
  });

  if (functionsEnabled()) {
    router.post("/customTransform", async ctx => {
      const events = ctx.request.body;
      const { processSessions } = ctx.query;
      logger.debug(`[CT] Input events: ${JSON.stringify(events)}`);
      let groupedEvents;
      if (processSessions) {
        groupedEvents = _.groupBy(
          events,
          event => `${event.destination.ID}_${event.message.anonymousId}`
        );
      } else {
        groupedEvents = _.groupBy(events, event => event.destination.ID);
      }

      const transformedEvents = [];
      await Promise.all(
        Object.entries(groupedEvents).map(async ([dest, destEvents]) => {
          logger.debug(`dest: ${dest}`);
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
              logger.error(error);
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
            transformedEvents.push(
              ...destTransformedEvents.map(ev => {
                return { output: ev, metadata: destEvents[0].metadata };
              })
            );
          } else {
            transformedEvents.push(
              ...destEvents.map(ev => {
                return { output: ev, metadata: destEvents[0].metadata };
              })
            );
          }
        })
      );
      logger.debug(`[CT] Output events: ${JSON.stringify(transformedEvents)}`);
      ctx.body = transformedEvents;
    });
  }
}

async function handleSource(ctx, sourceHandler) {
  const events = ctx.request.body;
  logger.debug(`[ST] Input source events: ${JSON.stringify(events)}`);
  const respList = [];
  await Promise.all(
    events.map(async event => {
      try {
        let respEvents = await sourceHandler.process(event);
        if (!Array.isArray(respEvents)) {
          respEvents = [respEvents];
        }
        respList.push(
          ...respEvents.map(ev => {
            return { output: ev };
          })
        );
      } catch (error) {
        logger.error(error);
        respList.push({
          statusCode: 400,
          error: error.message || "Error occurred while processing payload."
        });
      }
    })
  );
  logger.debug(`[ST] Output source events: ${JSON.stringify(respList)}`);
  ctx.body = respList;
}

if (startSourceTransformer) {
  versions.forEach(version => {
    const sources = getIntegrations(`${version}/sources`);
    sources.forEach(source => {
      const sourceHandler = getSourceHandler(version, source);
      // eg. v0/sources/customerio
      router.post(`/${version}/sources/${source}`, async ctx => {
        await handleSource(ctx, sourceHandler);
      });
    });
  });
}

router.get("/version", ctx => {
  ctx.body = process.env.npm_package_version || "Version Info not found";
});

router.get("/health", ctx => {
  ctx.body = "OK";
});

module.exports = router;
