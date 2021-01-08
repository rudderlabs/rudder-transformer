/* eslint-disable import/no-dynamic-require */
/* eslint-disable global-require */
const Router = require("koa-router");
const _ = require("lodash");
const { lstatSync, readdirSync } = require("fs");
const logger = require("./logger");
const stats = require("./util/stats");

const versions = ["v0"];
const API_VERSION = "1";

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

async function handleDest(ctx, version, destination) {
  const destHandler = getDestHandler(version, destination);
  const events = ctx.request.body;
  const reqParams = ctx.request.query;
  logger.debug(`[DT] Input events: ${JSON.stringify(events)}`);
  stats.increment("dest_transform_input_events", events.length, {
    destination,
    version
  });
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
            return {
              output: { ...ev, userId },
              metadata: event.metadata,
              statusCode: 200
            };
          })
        );
      } catch (error) {
        logger.error(error);

        respList.push({
          metadata: event.metadata,
          statusCode: 400,
          error: error.message || "Error occurred while processing payload."
        });
        stats.increment("dest_transform_errors", 1, { destination, version });
      }
    })
  );
  logger.debug(`[DT] Output events: ${JSON.stringify(respList)}`);
  stats.increment("dest_transform_output_events", respList.length, {
    destination,
    version
  });
  ctx.body = respList;
  ctx.set("apiVersion", API_VERSION);
}

async function routerHandleDest(ctx) {
  const { destType, input } = ctx.request.body;
  const routerDestHandler = getDestHandler("v0", destType);
  if (!routerDestHandler || !routerDestHandler.processRouterDest) {
    ctx.status = 404;
    ctx.body = `${destType} doesn't support router transform`;
    return;
  }
  const respEvents = [];
  const allDestEvents = _.groupBy(input, event => event.destination.ID);
  await Promise.all(
    Object.entries(allDestEvents).map(async ([destID, desInput]) => {
      const listOutput = await routerDestHandler.processRouterDest(desInput);
      respEvents.push(...listOutput);
    })
  );
  ctx.body = { output: respEvents };
}

if (startDestTransformer) {
  versions.forEach(version => {
    const destinations = getIntegrations(`${version}/destinations`);
    destinations.forEach(destination => {
      // eg. v0/destinations/ga
      router.post(`/${version}/destinations/${destination}`, async ctx => {
        const startTime = new Date();
        await handleDest(ctx, version, destination);
        stats.timing("dest_transform_request_latency", startTime, {
          destination,
          version
        });
        stats.increment("dest_transform_requests", 1, { destination, version });
      });
      // eg. v0/ga. will be deprecated in favor of v0/destinations/ga format
      router.post(`/${version}/${destination}`, async ctx => {
        const startTime = new Date();
        await handleDest(ctx, version, destination);
        stats.timing("dest_transform_request_latency", startTime, {
          destination,
          version
        });
        stats.increment("dest_transform_requests", 1, { destination, version });
      });
      router.post("/routerTransform", async ctx => {
        await routerHandleDest(ctx);
      });
    });
  });

  if (functionsEnabled()) {
    router.post("/customTransform", async ctx => {
      const startTime = new Date();
      const events = ctx.request.body;
      const { processSessions } = ctx.query;
      logger.debug(`[CT] Input events: ${JSON.stringify(events)}`);
      stats.counter("user_transform_input_events", events.length, {
        processSessions
      });
      let groupedEvents;
      if (processSessions) {
        groupedEvents = _.groupBy(events, event => {
          // to have the backward-compatibility and being extra careful. We need to remove this (message.anonymousId) in next release.
          const rudderId = event.metadata.rudderId || event.message.anonymousId;
          return `${event.destination.ID}_${rudderId}`;
        });
      } else {
        groupedEvents = _.groupBy(events, event => event.destination.ID);
      }
      stats.counter(
        "user_transform_function_group_size",
        Object.entries(groupedEvents).length,
        { processSessions }
      );

      const transformedEvents = [];
      let librariesVersionIDs = [];
      if (events[0].libraries) {
        librariesVersionIDs = events[0].libraries.map(
          library => library.VersionID
        );
      }
      await Promise.all(
        Object.entries(groupedEvents).map(async ([dest, destEvents]) => {
          logger.debug(`dest: ${dest}`);
          const transformationVersionId =
            destEvents[0] &&
            destEvents[0].destination &&
            destEvents[0].destination.Transformations &&
            destEvents[0].destination.Transformations[0] &&
            destEvents[0].destination.Transformations[0].VersionID;
          const messageIds = destEvents.map(
            ev => ev.metadata && ev.metadata.messageId
          );
          const commonMetadata = {
            sourceId: destEvents[0].metadata && destEvents[0].metadata.sourceId,
            destinationId:
              destEvents[0].metadata && destEvents[0].metadata.destinationId,
            destinationType:
              destEvents[0].metadata && destEvents[0].metadata.destinationType,
            messageIds
          };

          const userFuncStartTime = new Date();
          if (transformationVersionId) {
            let destTransformedEvents;
            try {
              stats.counter(
                "user_transform_function_input_events",
                destEvents.length,
                {
                  transformationVersionId,
                  processSessions
                }
              );
              destTransformedEvents = await userTransformHandler()(
                destEvents,
                transformationVersionId,
                librariesVersionIDs
              );
              transformedEvents.push(
                ...destTransformedEvents.map(ev => {
                  return {
                    output: ev.transformedEvent,
                    metadata: ev.metadata === {} ? commonMetadata : ev.metadata,
                    statusCode: 200
                  };
                })
              );
            } catch (error) {
              logger.error(error);
              transformedEvents.push({
                statusCode: 400,
                error: error.toString(),
                metadata: commonMetadata
              });
              stats.counter("user_transform_errors", destEvents.length, {
                transformationVersionId,
                processSessions
              });
            } finally {
              stats.timing(
                "user_transform_function_latency",
                userFuncStartTime,
                { transformationVersionId, processSessions }
              );
            }
          } else {
            const errorMessage = "Transformation VersionID not found";
            logger.error(`[CT] ${errorMessage}`);
            transformedEvents.push({
              statusCode: 400,
              error: errorMessage,
              metadata: commonMetadata
            });
            stats.counter("user_transform_errors", destEvents.length, {
              transformationVersionId,
              processSessions
            });
          }
        })
      );
      logger.debug(`[CT] Output events: ${JSON.stringify(transformedEvents)}`);
      ctx.body = transformedEvents;
      ctx.set("apiVersion", API_VERSION);
      stats.timing("user_transform_request_latency", startTime, {
        processSessions
      });
      stats.increment("user_transform_requests", 1, { processSessions });
      stats.counter("user_transform_output_events", transformedEvents.length, {
        processSessions
      });
    });
  }
}

async function handleSource(ctx, version, source) {
  const sourceHandler = getSourceHandler(version, source);
  const events = ctx.request.body;
  logger.debug(`[ST] Input source events: ${JSON.stringify(events)}`);
  stats.increment("source_transform_input_events", events.length, {
    source,
    version
  });
  const respList = [];
  await Promise.all(
    events.map(async event => {
      try {
        const respEvents = await sourceHandler.process(event);
        if (Array.isArray(respEvents)) {
          respList.push({ output: { batch: respEvents } });
        } else {
          respList.push({ output: { batch: [respEvents] } });
        }
      } catch (error) {
        logger.error(error);
        respList.push({
          statusCode: 400,
          error: error.message || "Error occurred while processing payload."
        });
        stats.counter("source_transform_errors", events.length, {
          source,
          version
        });
      }
    })
  );
  logger.debug(`[ST] Output source events: ${JSON.stringify(respList)}`);
  stats.increment("source_transform_output_events", respList.length, {
    source,
    version
  });
  ctx.body = respList;
  ctx.set("apiVersion", API_VERSION);
}

if (startSourceTransformer) {
  versions.forEach(version => {
    const sources = getIntegrations(`${version}/sources`);
    sources.forEach(source => {
      // eg. v0/sources/customerio
      router.post(`/${version}/sources/${source}`, async ctx => {
        const startTime = new Date();
        await handleSource(ctx, version, source);
        stats.timing("source_transform_request_latency", startTime, {
          source,
          version
        });
        stats.increment("source_transform_requests", 1, { source, version });
      });
    });
  });
}

router.get("/version", ctx => {
  ctx.body = process.env.npm_package_version || "Version Info not found";
});

router.get("/transformerBuildVersion", ctx => {
  ctx.body = process.env.transformer_build_version || "Version Info not found";
});

router.get("/health", ctx => {
  ctx.body = "OK";
});

router.post("/batch", ctx => {
  const { destType, input } = ctx.request.body;
  const destHandler = getDestHandler("v0", destType);
  if (!destHandler || !destHandler.batch) {
    ctx.status = 404;
    ctx.body = `${destType} doesn't support batching`;
    return;
  }
  const allDestEvents = _.groupBy(input, event => event.destination.ID);

  const response = { batchedRequests: [], errors: [] };
  Object.entries(allDestEvents).map(async ([destID, destEvents]) => {
    // TODO: check await needed?
    try {
      const destBatchedRequests = destHandler.batch(destEvents);
      response.batchedRequests.push(...destBatchedRequests);
    } catch (error) {
      response.errors.push(
        error.message || "Error occurred while processing payload."
      );
    }
  });
  if (response.errors.length > 0) {
    ctx.status = 500;
    ctx.body = response.errors;
    return;
  }
  ctx.body = response.batchedRequests;
});

module.exports = router;
