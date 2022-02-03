/* eslint-disable import/no-dynamic-require */
/* eslint-disable global-require */
const Router = require("koa-router");
const _ = require("lodash");
const fs = require("fs");
const logger = require("./logger");
const stats = require("./util/stats");
const {
  isNonFuncObject,
  getMetadata,
  generateErrorObject
} = require("./v0/util");
const { processDynamicConfig } = require("./util/dynamicConfig");
const { DestHandlerMap } = require("./constants/destinationCanonicalNames");
const { userTransformHandler } = require("./routerUtils");
const { TRANSFORMER_METRIC } = require("./v0/util/constant");
const networkHandlerFactory = require("./adapters/networkHandlerFactory");

require("dotenv").config();
const eventValidator = require("./util/eventValidation");

const versions = ["v0"];
const API_VERSION = "2";

const transformerMode = process.env.TRANSFORMER_MODE;

const startDestTransformer =
  transformerMode === "destination" || !transformerMode;
const startSourceTransformer = transformerMode === "source" || !transformerMode;
const transformerProxy = process.env.TRANSFORMER_PROXY || true;

const router = new Router();

const isDirectory = source => {
  return fs.lstatSync(source).isDirectory();
};

const getIntegrations = type =>
  fs.readdirSync(type).filter(destName => isDirectory(`${type}/${destName}`));

const getDestHandler = (version, dest) => {
  if (DestHandlerMap.hasOwnProperty(dest)) {
    return require(`./${version}/destinations/${DestHandlerMap[dest]}/transform`);
  }
  return require(`./${version}/destinations/${dest}/transform`);
};

const getDestFileUploadHandler = (version, dest) => {
  return require(`./${version}/destinations/${dest}/fileUpload`);
};

const getPollStatusHandler = (version, dest) => {
  return require(`./${version}/destinations/${dest}/poll`);
};

const getJobStatusHandler = (version, dest) => {
  return require(`./${version}/destinations/${dest}/fetchJobStatus`);
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

async function handleDest(ctx, version, destination) {
  const destHandler = getDestHandler(version, destination);
  const events = ctx.request.body;
  const reqParams = ctx.request.query;
  logger.debug(`[DT] Input events: ${JSON.stringify(events)}`);

  const metaTags =
    events && events.length && events[0].metadata
      ? getMetadata(events[0].metadata)
      : {};
  stats.increment("dest_transform_input_events", events.length, {
    destination,
    version,
    ...metaTags
  });
  const respList = [];
  await Promise.all(
    events.map(async event => {
      try {
        let parsedEvent = event;
        parsedEvent.request = { query: reqParams };
        parsedEvent = processDynamicConfig(parsedEvent);
        let respEvents = await destHandler.process(parsedEvent);
        if (respEvents) {
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
        }
      } catch (error) {
        logger.error(error);
        const errObj = generateErrorObject(
          error,
          destination,
          TRANSFORMER_METRIC.TRANSFORMER_STAGE.TRANSFORM
        );
        respList.push({
          metadata: event.metadata,
          statusCode: 400,
          error: error.message || "Error occurred while processing payload.",
          statTags: errObj.statTags
        });
      }
    })
  );
  logger.debug(`[DT] Output events: ${JSON.stringify(respList)}`);
  stats.increment("dest_transform_output_events", respList.length, {
    destination,
    version,
    ...metaTags
  });
  ctx.body = respList;
  return ctx.body;
}

async function handleValidation(ctx) {
  const requestStartTime = new Date();
  const events = ctx.request.body;
  const requestSize = ctx.request.get("content-length");
  const reqParams = ctx.request.query;
  const respList = [];
  const metaTags = events[0].metadata ? getMetadata(events[0].metadata) : {};
  for (let i = 0; i < events.length; i++) {
    const event = events[i];
    const eventStartTime = new Date();
    try {
      const parsedEvent = event;
      parsedEvent.request = { query: reqParams };
      const hv = await eventValidator.handleValidation(parsedEvent);
      if (hv.dropEvent) {
        const errMessage = `Error occurred while validating because : ${hv.violationType}`;
        respList.push({
          output: event.message,
          metadata: event.metadata,
          statusCode: 400,
          validationErrors: hv.validationErrors,
          errors: errMessage
        });
        stats.counter("hv_violation_type", 1, {
          violationType: hv.violationType,
          ...metaTags
        });
      } else {
        respList.push({
          output: event.message,
          metadata: event.metadata,
          statusCode: 200,
          validationErrors: hv.validationErrors
        });
        stats.counter("hv_errors", 1, {
          ...metaTags
        });
      }
    } catch (error) {
      const errMessage = `Error occurred while validating : ${error}`;
      logger.error(errMessage);
      respList.push({
        output: event.message,
        metadata: event.metadata,
        statusCode: 200,
        validationErrors: [],
        error: errMessage
      });
      stats.counter("hv_errors", 1, {
        ...metaTags
      });
    } finally {
      stats.timing("hv_event_latency", eventStartTime, {
        ...metaTags
      });
    }
  }
  ctx.body = respList;
  ctx.set("apiVersion", API_VERSION);

  stats.counter("hv_events_count", events.length, {
    ...metaTags
  });
  stats.counter("hv_request_size", requestSize, {
    ...metaTags
  });
  stats.timing("hv_request_latency", requestStartTime, {
    ...metaTags
  });
}

async function routerHandleDest(ctx) {
  const { destType, input } = ctx.request.body;
  const routerDestHandler = getDestHandler("v0", destType);
  if (!routerDestHandler || !routerDestHandler.processRouterDest) {
    ctx.status = 404;
    ctx.body = `${destType} doesn't support router transform`;
    return null;
  }
  const respEvents = [];
  const allDestEvents = _.groupBy(input, event => event.destination.ID);
  await Promise.all(
    Object.entries(allDestEvents).map(async ([destID, desInput]) => {
      desInput = processDynamicConfig(desInput, "router");
      const listOutput = await routerDestHandler.processRouterDest(desInput);
      respEvents.push(...listOutput);
    })
  );
  ctx.body = { output: respEvents };
  return ctx.body;
}

if (startDestTransformer) {
  versions.forEach(version => {
    const destinations = getIntegrations(`${version}/destinations`);
    destinations.forEach(destination => {
      // eg. v0/destinations/ga
      router.post(`/${version}/destinations/${destination}`, async ctx => {
        const startTime = new Date();
        await handleDest(ctx, version, destination);
        ctx.set("apiVersion", API_VERSION);
        // Assuming that events are from one single source

        const metaTags =
          ctx.request.body &&
          ctx.request.body.length &&
          ctx.request.body[0].metadata
            ? getMetadata(ctx.request.body[0].metadata)
            : {};
        stats.timing("dest_transform_request_latency", startTime, {
          destination,
          version,
          ...metaTags
        });
        stats.increment("dest_transform_requests", 1, {
          destination,
          version,
          ...metaTags
        });
      });
      // eg. v0/ga. will be deprecated in favor of v0/destinations/ga format
      router.post(`/${version}/${destination}`, async ctx => {
        const startTime = new Date();
        await handleDest(ctx, version, destination);
        ctx.set("apiVersion", API_VERSION);
        // Assuming that events are from one single source

        const metaTags =
          ctx.request.body &&
          ctx.request.body.length &&
          ctx.request.body[0].metadata
            ? getMetadata(ctx.request.body[0].metadata)
            : {};
        stats.timing("dest_transform_request_latency", startTime, {
          destination,
          ...metaTags
        });
        stats.increment("dest_transform_requests", 1, {
          destination,
          version,
          ...metaTags
        });
      });
      router.post("/routerTransform", async ctx => {
        ctx.set("apiVersion", API_VERSION);
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
          return `${event.destination.ID}_${event.metadata.sourceId}_${rudderId}`;
        });
      } else {
        groupedEvents = _.groupBy(
          events,
          event => `${event.metadata.destinationId}_${event.metadata.sourceId}`
        );
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

          const metaTags =
            destEvents.length && destEvents[0].metadata
              ? getMetadata(destEvents[0].metadata)
              : {};
          const userFuncStartTime = new Date();
          if (transformationVersionId) {
            let destTransformedEvents;
            try {
              stats.counter(
                "user_transform_function_input_events",
                destEvents.length,
                {
                  processSessions,
                  ...metaTags
                }
              );
              destTransformedEvents = await userTransformHandler()(
                destEvents,
                transformationVersionId,
                librariesVersionIDs
              );
              transformedEvents.push(
                ...destTransformedEvents.map(ev => {
                  if (ev.error) {
                    return {
                      statusCode: 400,
                      error: ev.error,
                      metadata: _.isEmpty(ev.metadata)
                        ? commonMetadata
                        : ev.metadata
                    };
                  }
                  if (!isNonFuncObject(ev.transformedEvent)) {
                    return {
                      statusCode: 400,
                      error: `returned event in events from user transformation is not an object. transformationVersionId:${transformationVersionId} and returned event: ${JSON.stringify(
                        ev.transformedEvent
                      )}`,
                      metadata: _.isEmpty(ev.metadata)
                        ? commonMetadata
                        : ev.metadata
                    };
                  }
                  return {
                    output: ev.transformedEvent,
                    metadata: _.isEmpty(ev.metadata)
                      ? commonMetadata
                      : ev.metadata,
                    statusCode: 200
                  };
                })
              );
            } catch (error) {
              logger.error(error);
              const errorString = error.toString();
              destTransformedEvents = destEvents.map(e => {
                return {
                  statusCode: 400,
                  metadata: e.metadata,
                  error: errorString
                };
              });
              transformedEvents.push(...destTransformedEvents);
              stats.counter("user_transform_errors", destEvents.length, {
                transformationVersionId,
                processSessions,
                ...metaTags
              });
            } finally {
              stats.timing(
                "user_transform_function_latency",
                userFuncStartTime,
                { transformationVersionId, processSessions, ...metaTags }
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
              processSessions,
              ...metaTags
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

async function handleProxyRequest(destination, ctx) {
  const destinationRequest = ctx.request.body;
  const destNetworkHandler = networkHandlerFactory.getNetworkHandler(
    destination
  );
  let response;
  try {
    const startTime = new Date();
    const rawProxyResponse = await destNetworkHandler.proxy(destinationRequest);
    stats.timing("transformer_proxy_time", startTime, {
      destination
    });
    const processedProxyResponse = destNetworkHandler.processAxiosResponse(
      rawProxyResponse
    );
    response = destNetworkHandler.responseHandler(
      processedProxyResponse,
      destination
    );
  } catch (err) {
    response = generateErrorObject(
      err,
      destination,
      TRANSFORMER_METRIC.TRANSFORMER_STAGE.RESPONSE_TRANSFORM
    );
    response = { ...response };
    if (!err.responseTransformFailure) {
      response.message = `[Error occurred while processing response for destination ${destination}]: ${err.message}`;
    }
  }
  ctx.body = { output: response };
  ctx.status = response.status;
  return ctx.body;
}

if (transformerProxy) {
  versions.forEach(version => {
    const destinations = getIntegrations(`${version}/destinations`);
    destinations.forEach(destination => {
      router.post(
        `/${version}/destinations/${destination}/proxy`,
        async ctx => {
          const startTime = new Date();
          ctx.set("apiVersion", API_VERSION);
          await handleProxyRequest(destination, ctx);
          stats.timing("transformer_total_proxy_latency", startTime, {
            destination,
            version
          });
        }
      );
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

router.get("/features", ctx => {
  const obj = JSON.parse(fs.readFileSync("features.json", "utf8"));
  ctx.body = JSON.stringify(obj);
});

const batchHandler = ctx => {
  const { destType, input } = ctx.request.body;
  const destHandler = getDestHandler("v0", destType);
  if (!destHandler || !destHandler.batch) {
    ctx.status = 404;
    ctx.body = `${destType} doesn't support batching`;
    return null;
  }
  const allDestEvents = _.groupBy(input, event => event.destination.ID);

  const response = { batchedRequests: [], errors: [] };
  Object.entries(allDestEvents).map(async ([destID, destEvents]) => {
    // TODO: check await needed?
    try {
      destEvents = processDynamicConfig(destEvents, "batch");
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
    return null;
  }
  ctx.body = response.batchedRequests;
  return ctx.body;
};
router.post("/batch", ctx => {
  ctx.set("apiVersion", API_VERSION);
  batchHandler(ctx);
});

const fileUpload = async ctx => {
  const { destType } = ctx.request.body;
  const destFileUploadHandler = getDestFileUploadHandler(
    "v0",
    destType.toLowerCase()
  );

  if (!destFileUploadHandler || !destFileUploadHandler.processFileData) {
    ctx.status = 404;
    ctx.body = `${destType} doesn't support bulk upload`;
    return null;
  }
  let response;
  try {
    response = await destFileUploadHandler.processFileData(ctx.request.body);
  } catch (error) {
    response = {
      statusCode: error.response ? error.response.status : 400,
      error: error.message || "Error occurred while processing payload.",
      metadata: error.response ? error.response.metadata : null
    };
  }
  ctx.body = response;
  return ctx.body;
};

const pollStatus = async ctx => {
  const { destType } = ctx.request.body;
  const destFileUploadHandler = getPollStatusHandler(
    "v0",
    destType.toLowerCase()
  );
  let response;
  if (!destFileUploadHandler || !destFileUploadHandler.processPolling) {
    ctx.status = 404;
    ctx.body = `${destType} doesn't support bulk upload`;
    return null;
  }
  try {
    response = await destFileUploadHandler.processPolling(ctx.request.body);
  } catch (error) {
    response = {
      statusCode: error.response ? error.response.status : 400,
      error: error.message || "Error occurred while processing payload."
    };
  }
  ctx.body = response;
  return ctx.body;
};

const getJobStatus = async (ctx, type) => {
  const { destType } = ctx.request.body;
  const destFileUploadHandler = getJobStatusHandler(
    "v0",
    destType.toLowerCase()
  );

  if (!destFileUploadHandler || !destFileUploadHandler.processJobStatus) {
    ctx.status = 404;
    ctx.body = `${destType} doesn't support bulk upload`;
    return null;
  }
  let response;
  try {
    response = await destFileUploadHandler.processJobStatus(
      ctx.request.body,
      type
    );
  } catch (error) {
    response = {
      statusCode: error.response ? error.response.status : 400,
      error: error.message || "Error occurred while processing payload."
    };
  }
  ctx.body = response;
  return ctx.body;
};

router.post("/fileUpload", async ctx => {
  await fileUpload(ctx);
});

router.post("/pollStatus", async ctx => {
  await pollStatus(ctx);
});

router.post("/getFailedJobs", async ctx => {
  await getJobStatus(ctx, "fail");
});

router.post("/getWarningJobs", async ctx => {
  await getJobStatus(ctx, "warn");
});
// eg. v0/validate. will validate events as per respective tracking plans
router.post(`/v0/validate`, async ctx => {
  await handleValidation(ctx);
});
module.exports = {
  router,
  handleDest,
  routerHandleDest,
  batchHandler,
  handleProxyRequest
};
