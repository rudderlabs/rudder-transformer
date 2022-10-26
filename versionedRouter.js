/* eslint-disable import/no-dynamic-require */
/* eslint-disable global-require */
const Router = require("koa-router");
const _ = require("lodash");
const fs = require("fs");
const path = require("path");
const { ConfigFactory, Executor } = require("rudder-transformer-cdk");
const set = require("set-value");
const logger = require("./logger");
const stats = require("./util/stats");
const { SUPPORTED_VERSIONS, API_VERSION } = require("./routes/utils/constants");
const { client: errNotificationClient } = require("./util/errorNotifier");

const {
  isNonFuncObject,
  getMetadata,
  generateErrorObject,
  CustomError,
  isHttpStatusSuccess,
  getErrorRespEvents,
  isCdkDestination,
  getErrorStatusCode
} = require("./v0/util");
const { processDynamicConfig } = require("./util/dynamicConfig");
const { DestHandlerMap } = require("./constants/destinationCanonicalNames");
const { userTransformHandler } = require("./routerUtils");
const { TRANSFORMER_METRIC } = require("./v0/util/constant");
const networkHandlerFactory = require("./adapters/networkHandlerFactory");
const profilingRouter = require("./routes/profiling");
const destProxyRoutes = require("./routes/destinationProxy");

require("dotenv").config();
const eventValidator = require("./util/eventValidation");
const { prometheusRegistry } = require("./middleware");
const { compileUserLibrary } = require("./util/ivmFactory");
const { getIntegrations } = require("./routes/utils");
const { setupUserTransformHandler } = require("./util/customTransformer");
const { CommonUtils } = require("./util/common");
const { RespStatusError, RetryRequestError } = require("./util/utils");
const { getWorkflowEngine } = require("./cdk/v2/handler");
const {
  getErrorInfo,
  isCdkV2Destination,
  getCdkV2TestThreshold
} = require("./cdk/v2/utils");

const CDK_DEST_PATH = "cdk";
const basePath = path.resolve(__dirname, `./${CDK_DEST_PATH}`);
ConfigFactory.init({ basePath, loggingMode: "production" });

const transformerMode = process.env.TRANSFORMER_MODE;

const startDestTransformer =
  transformerMode === "destination" || !transformerMode;
const startSourceTransformer = transformerMode === "source" || !transformerMode;
const transformerProxy = process.env.TRANSFORMER_PROXY || true;
const proxyTestModeEnabled =
  process.env.TRANSFORMER_PROXY_TEST_ENABLED?.toLowerCase() === "true" || false;
const transformerTestModeEnabled = process.env.TRANSFORMER_TEST_MODE
  ? process.env.TRANSFORMER_TEST_MODE.toLowerCase() === "true"
  : false;

const router = new Router();

// Router for assistance in profiling
router.use(profilingRouter);

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

const getDeletionUserHandler = (version, dest) => {
  return require(`./${version}/destinations/${dest}/deleteUsers`);
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

// eslint-disable-next-line no-unused-vars
function getCommonMetadata(ctx) {
  // TODO: Parse information such as
  // cluster, namespace, etc information
  // from the request
  return {
    namespace: "Unknown",
    cluster: "Unknown"
  };
}

async function handleCdkV2(destType, parsedEvent, flowType) {
  try {
    const workflowEngine = await getWorkflowEngine(destType, flowType);

    const result = await workflowEngine.execute(parsedEvent);
    // TODO: Handle remaining output scenarios
    return result.output;
  } catch (error) {
    throw getErrorInfo(error, isCdkV2Destination(parsedEvent));
  }
}

async function getCdkV2Result(destName, event, flowType) {
  const cdkResult = {};
  try {
    cdkResult.output = JSON.parse(
      JSON.stringify(await handleCdkV2(destName, event, flowType))
    );
  } catch (error) {
    cdkResult.error = {
      message: error.message,
      statusCode: getErrorStatusCode(error)
    };
  }
  return cdkResult;
}

function removeSensitiveData(result) {
  const newResult = {};
  Object.keys(result).forEach(key => {
    if (
      key.includes("metadata") ||
      key.includes("error") ||
      key.includes("statusCode")
    ) {
      newResult[key] = result[key];
    } else {
      newResult[key] = "***";
    }
  });
  return newResult;
}

async function compareWithCdkV2(destType, input, flowType, v0Result) {
  try {
    const envThreshold = parseFloat(process.env.CDK_LIVE_TEST || "0", 10);
    let destThreshold = getCdkV2TestThreshold(input);
    if (flowType === TRANSFORMER_METRIC.ERROR_AT.RT) {
      destThreshold = getCdkV2TestThreshold(input[0]);
    }
    const liveTestThreshold = envThreshold * destThreshold;
    if (
      Number.isNaN(liveTestThreshold) ||
      !liveTestThreshold ||
      liveTestThreshold < Math.random()
    ) {
      return;
    }
    const cdkResult = await getCdkV2Result(destType, input, flowType);
    const objectDiff = CommonUtils.objectDiff(v0Result, cdkResult);
    if (Object.keys(objectDiff).length > 0) {
      stats.counter("cdk_live_compare_test_failed", 1, { destType, flowType });
      logger.error(
        `[LIVE_COMPARE_TEST] failed for destType=${destType}, flowType=${flowType}, diff=${JSON.stringify(
          objectDiff
        )}`
      );
      logger.error(
        `[LIVE_COMPARE_TEST] failed for destType=${destType}, flowType=${flowType}, v0Result=${JSON.stringify(
          v0Result
        )}, cdkResult=${JSON.stringify(cdkResult)}`
      );
      return;
    }
    stats.counter("cdk_live_compare_test_success", 1, { destType, flowType });
  } catch (error) {
    stats.counter("cdk_live_compare_test_errored", 1, { destType, flowType });
    logger.error(
      `[LIVE_COMPARE_TEST] errored for destType=${destType}, flowType=${flowType}`,
      error
    );
  }
}

async function handleV0Destination(destHandler, destType, input, flowType) {
  const result = {};
  try {
    result.output = await destHandler(input);
    return result.output;
  } catch (error) {
    result.error = {
      message: error.message,
      statusCode: getErrorStatusCode(error)
    };
    throw error;
  } finally {
    if (process.env.NODE_ENV === "test") {
      await compareWithCdkV2(destType, input, flowType, result);
    } else {
      compareWithCdkV2(destType, input, flowType, result);
    }
  }
}

async function handleDest(ctx, version, destination) {
  const getReqMetadata = event => {
    try {
      return {
        destType: destination,
        destinationId: event?.destination?.ID,
        destName: event?.destination?.Name,
        metadata: event?.metadata
      };
    } catch (error) {
      // Do nothing
    }
    return {};
  };

  const events = ctx.request.body;
  if (!Array.isArray(events) || events.length === 0) {
    throw new CustomError("Event is missing or in inappropriate format", 400);
  }
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
  const executeStartTime = new Date();
  let destHandler = null;
  const respList = await Promise.all(
    events.map(async event => {
      try {
        let parsedEvent = event;
        parsedEvent.request = { query: reqParams };
        parsedEvent = processDynamicConfig(parsedEvent);
        let respEvents;
        if (isCdkV2Destination(parsedEvent)) {
          respEvents = await handleCdkV2(
            destination,
            parsedEvent,
            TRANSFORMER_METRIC.ERROR_AT.PROC
          );
        } else if (isCdkDestination(parsedEvent)) {
          const tfConfig = await ConfigFactory.getConfig(destination);
          respEvents = await Executor.execute(parsedEvent, tfConfig);
        } else {
          if (destHandler === null) {
            destHandler = getDestHandler(version, destination);
          }
          respEvents = await handleV0Destination(
            destHandler.process,
            destination,
            parsedEvent,
            TRANSFORMER_METRIC.ERROR_AT.PROC
          );
        }
        if (respEvents) {
          if (!Array.isArray(respEvents)) {
            respEvents = [respEvents];
          }
          return respEvents.map(ev => {
            let { userId } = ev;
            // Set the user ID to an empty string for
            // all the falsy values (including 0 and false)
            // Otherwise, server panics while un-marshalling the response
            // while expecting only strings.
            if (!userId) {
              userId = "";
            }

            if (ev.statusCode !== 400 && userId) {
              userId = `${userId}`;
            }

            return {
              output: { ...ev, userId },
              metadata: event.metadata,
              statusCode: 200
            };
          });
        }
      } catch (error) {
        logger.error(error);
        const errObj = generateErrorObject(
          error,
          destination,
          TRANSFORMER_METRIC.TRANSFORMER_STAGE.TRANSFORM
        );
        const resp = {
          metadata: event.metadata,
          statusCode: errObj.status,
          error:
            errObj.message || "Error occurred while processing the payload.",
          statTags: {
            errorAt: TRANSFORMER_METRIC.ERROR_AT.PROC,
            ...errObj.statTags
          }
        };

        let errCtx = "Destination Transformation";
        if (isCdkV2Destination(event)) {
          errCtx = `CDK V2 - ${errCtx}`;
        } else if (isCdkDestination(event)) {
          errCtx = `CDK - ${errCtx}`;
        }

        errNotificationClient.notify(error, errCtx, {
          ...resp,
          ...getCommonMetadata(ctx),
          ...getReqMetadata(event)
        });
        return resp;
      }
    })
  );
  stats.timing("cdk_events_latency", executeStartTime, {
    destination,
    ...metaTags
  });
  logger.debug(`[DT] Output events: ${JSON.stringify(respList)}`);
  stats.increment("dest_transform_output_events", respList.length, {
    destination,
    version,
    ...metaTags
  });
  ctx.body = respList.flat();
  return ctx.body;
}

async function handleValidation(ctx) {
  const requestStartTime = new Date();
  const events = ctx.request.body;
  const requestSize = ctx.request.get("content-length");
  const reqParams = ctx.request.query;
  const respList = [];
  const metaTags = events[0].metadata ? getMetadata(events[0].metadata) : {};
  let ctxStatusCode = 200;
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
        stats.counter("hv_propagated_events", 1, {
          ...metaTags
        });
      }
    } catch (error) {
      const errMessage = `Error occurred while validating : ${error}`;
      logger.error(errMessage);
      let status = 200;
      if (error instanceof RetryRequestError) {
        ctxStatusCode = error.statusCode;
      }
      if (error instanceof RespStatusError) {
        status = error.statusCode;
      }
      respList.push({
        output: event.message,
        metadata: event.metadata,
        statusCode: status,
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
  ctx.status = ctxStatusCode;
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
    Object.values(allDestEvents).map(async destInput => {
      const newDestInput = processDynamicConfig(destInput, "router");
      let listOutput;
      if (isCdkV2Destination(newDestInput[0])) {
        listOutput = await handleCdkV2(
          destType,
          newDestInput,
          TRANSFORMER_METRIC.ERROR_AT.RT
        );
      } else {
        listOutput = await handleV0Destination(
          routerDestHandler.processRouterDest,
          destType,
          newDestInput,
          TRANSFORMER_METRIC.ERROR_AT.RT
        );
      }
      respEvents.push(...listOutput);
    })
  );
  respEvents
    .filter(
      resp =>
        "error" in resp &&
        _.isObject(resp.statTags) &&
        !_.isEmpty(resp.statTags)
    )
    .forEach(resp => {
      set(resp, "statTags.errorAt", TRANSFORMER_METRIC.ERROR_AT.RT);
    });
  ctx.body = { output: respEvents };
  return ctx.body;
}

if (startDestTransformer) {
  SUPPORTED_VERSIONS.forEach(version => {
    const destinations = getIntegrations(`${version}/destinations`);
    destinations.push(...getIntegrations(CDK_DEST_PATH));
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

      let ctxStatusCode = 200;
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
              let status = 400;
              const errorString = error.toString();
              if (error instanceof RetryRequestError) {
                ctxStatusCode = error.statusCode;
              }
              if (error instanceof RespStatusError) {
                status = error.statusCode;
              }
              destTransformedEvents = destEvents.map(e => {
                return {
                  statusCode: status,
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
      ctx.status = ctxStatusCode;
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

if (transformerTestModeEnabled) {
  router.post("/transformation/test", async ctx => {
    try {
      const { events, trRevCode, libraryVersionIDs = [] } = ctx.request.body;
      if (!trRevCode || !trRevCode.code || !trRevCode.codeVersion) {
        throw new Error(
          "Invalid Request. Missing parameters in transformation code block"
        );
      }
      if (!events || events.length === 0) {
        throw new Error("Invalid request. Missing events");
      }

      logger.debug(`[CT] Test Input Events: ${JSON.stringify(events)}`);
      trRevCode.versionId = "testVersionId";
      const res = await userTransformHandler()(
        events,
        trRevCode.versionId,
        libraryVersionIDs,
        trRevCode,
        true
      );
      logger.debug(
        `[CT] Test Output Events: ${JSON.stringify(res.transformedEvents)}`
      );
      ctx.body = res;
    } catch (error) {
      ctx.status = 400;
      ctx.body = { error: error.message };
    }
  });

  router.post("/transformationLibrary/test", async ctx => {
    try {
      const { code } = ctx.request.body;
      if (!code) {
        throw new Error("Invalid request. Missing code");
      }

      const res = await compileUserLibrary(code);
      ctx.body = res;
    } catch (error) {
      ctx.body = { error: error.message };
      ctx.status = 400;
    }
  });
  /* *params
   * code: transfromation code
   * language
   * name
   * testWithPublish: publish version or not
   */
  router.post("/transformation/sethandle", async ctx => {
    try {
      const { trRevCode, libraryVersionIDs = [] } = ctx.request.body;
      const { code, language, testName, testWithPublish = false } =
        trRevCode || {};
      if (!code || !language || !testName) {
        throw new Error(
          "Invalid Request. Missing parameters in transformation code block"
        );
      }

      logger.debug(
        `[CT] Setting up a transformation ${testName} with publish: ${testWithPublish}`
      );
      if (!trRevCode.versionId) {
        trRevCode.versionId = "testVersionId";
      }
      const res = await setupUserTransformHandler(
        trRevCode,
        libraryVersionIDs,
        testWithPublish
      );
      logger.debug(`[CT] Finished setting up transformation: ${testName}`);
      ctx.body = res;
    } catch (error) {
      ctx.status = 400;
      ctx.body = { error: error.message };
    }
  });
}

async function handleSource(ctx, version, source) {
  const getReqMetadata = () => {
    try {
      return { srcType: source };
    } catch (error) {
      // Do nothing
    }
    return {};
  };

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

        // We send response back to the source
        // through outputToSource. This is not sent to gateway
        if (
          Object.prototype.hasOwnProperty.call(respEvents, "outputToSource")
        ) {
          respList.push(respEvents);
          return;
        }

        if (Array.isArray(respEvents)) {
          respList.push({ output: { batch: respEvents } });
        } else {
          respList.push({ output: { batch: [respEvents] } });
        }
      } catch (error) {
        logger.error(error);
        const resp = {
          statusCode: 400,
          error: error.message || "Error occurred while processing payload."
        };
        respList.push(resp);
        stats.counter("source_transform_errors", events.length, {
          source,
          version
        });
        errNotificationClient.notify(error, "Source Transformation", {
          ...resp,
          ...getCommonMetadata(ctx),
          ...getReqMetadata()
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
  SUPPORTED_VERSIONS.forEach(version => {
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
  const getReqMetadata = () => {
    try {
      return { destType: destination };
    } catch (error) {
      // Do nothing
    }
    return {};
  };

  const destinationRequest = ctx.request.body;
  const destNetworkHandler = networkHandlerFactory.getNetworkHandler(
    destination
  );
  let response;
  try {
    stats.counter("tf_proxy_dest_req_count", 1, {
      destination
    });
    const startTime = new Date();
    const rawProxyResponse = await destNetworkHandler.proxy(destinationRequest);
    stats.timing("transformer_proxy_time", startTime, {
      destination
    });
    stats.counter("tf_proxy_dest_resp_count", 1, {
      destination,
      success: rawProxyResponse.success
    });

    const processedProxyResponse = destNetworkHandler.processAxiosResponse(
      rawProxyResponse
    );
    stats.counter("tf_proxy_proc_ax_response_count", 1, {
      destination
    });
    response = destNetworkHandler.responseHandler(
      processedProxyResponse,
      destination
    );
    stats.counter("tf_proxy_resp_handler_count", 1, {
      destination
    });
  } catch (err) {
    logger.error("Error occurred while completing proxy request:");
    logger.error(err);
    response = generateErrorObject(
      err,
      destination,
      TRANSFORMER_METRIC.TRANSFORMER_STAGE.RESPONSE_TRANSFORM
    );
    response.statTags = {
      errorAt: TRANSFORMER_METRIC.ERROR_AT.PROXY,
      ...response.statTags
    };
    if (!err.responseTransformFailure) {
      response.message = `[Error occurred while processing response for destination ${destination}]: ${err.message}`;
    }
    stats.counter("tf_proxy_err_count", 1, {
      destination
    });
    errNotificationClient.notify(err, "Data Delivery", {
      ...response,
      ...getCommonMetadata(ctx),
      ...getReqMetadata()
    });
  }
  ctx.body = { output: response };
  // Sending `204` status(obtained from destination) is not working as expected
  // Since this is success scenario, we'll be forcefully sending `200` status-code to server
  ctx.status = isHttpStatusSuccess(response.status) ? 200 : response.status;
  return ctx.body;
}

if (transformerProxy) {
  SUPPORTED_VERSIONS.forEach(version => {
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

if (proxyTestModeEnabled) {
  router.use(destProxyRoutes);
}

router.get("/version", ctx => {
  ctx.body = process.env.npm_package_version || "Version Info not found";
});

router.get("/transformerBuildVersion", ctx => {
  ctx.body = process.env.transformer_build_version || "Version Info not found";
});

router.get("/health", ctx => {
  const {
    git_commit_sha: gitCommitSha,
    transformer_build_version: imageVersion
  } = process.env;
  ctx.body = {
    service: "UP",
    ...(imageVersion && { version: imageVersion }),
    ...(gitCommitSha && { gitCommitSha })
  };
});

router.get("/features", ctx => {
  const obj = JSON.parse(fs.readFileSync("features.json", "utf8"));
  ctx.body = JSON.stringify(obj);
});

const batchHandler = ctx => {
  const getReqMetadata = destEvents => {
    try {
      const reqBody = ctx.request.body;
      const firstEvent = destEvents[0];
      return {
        destType: reqBody?.destType,
        destinationId: firstEvent?.destination?.ID,
        destName: firstEvent?.destination?.Name,
        metadata: firstEvent?.metadata
      };
    } catch (error) {
      // Do nothing
    }
    return {};
  };

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
      const errorObj = generateErrorObject(
        error,
        destType,
        TRANSFORMER_METRIC.TRANSFORMER_STAGE.TRANSFORM
      );
      const errResp = getErrorRespEvents(
        destEvents.map(d => d.metadata),
        500,
        error.message || "Error occurred while processing payload.",
        { errorAt: TRANSFORMER_METRIC.ERROR_AT.BATCH, ...errorObj.statTags }
      );
      response.errors.push(errResp);
      errNotificationClient.notify(error, "Batch Transformation", {
        ...errResp,
        ...getCommonMetadata(ctx),
        ...getReqMetadata(destEvents)
      });
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
  const getReqMetadata = () => {
    try {
      const reqBody = ctx.request.body;
      return { destType: reqBody?.destType };
    } catch (error) {
      // Do nothing
    }
    return {};
  };

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
    errNotificationClient.notify(error, "File Upload", {
      ...response,
      ...getCommonMetadata(ctx),
      ...getReqMetadata()
    });
  }
  ctx.body = response;
  return ctx.body;
};

const pollStatus = async ctx => {
  const getReqMetadata = () => {
    try {
      const reqBody = ctx.request.body;
      return { destType: reqBody?.destType, importId: reqBody?.importId };
    } catch (error) {
      // Do nothing
    }
    return {};
  };

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
    errNotificationClient.notify(error, "Poll Status", {
      ...response,
      ...getCommonMetadata(ctx),
      ...getReqMetadata()
    });
  }
  ctx.body = response;
  return ctx.body;
};

const getJobStatus = async (ctx, type) => {
  const getReqMetadata = () => {
    try {
      const reqBody = ctx.request.body;
      return { destType: reqBody?.destType, importId: reqBody?.importId };
    } catch (error) {
      // Do nothing
    }
    return {};
  };

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
    errNotificationClient.notify(error, "Job Status", {
      ...response,
      ...getCommonMetadata(ctx),
      ...getReqMetadata()
    });
  }
  ctx.body = response;
  return ctx.body;
};

const handleDeletionOfUsers = async ctx => {
  const getReqMetadata = () => {
    try {
      const reqBody = ctx.request.body;
      return { destType: reqBody?.destType };
    } catch (error) {
      // Do nothing
    }
    return {};
  };

  const { body } = ctx.request;
  const respList = [];
  let response;
  await Promise.all(
    body.map(async b => {
      const { destType } = b;
      const destUserDeletionHandler = getDeletionUserHandler(
        "v0",
        destType.toLowerCase()
      );
      if (
        !destUserDeletionHandler ||
        !destUserDeletionHandler.processDeleteUsers
      ) {
        ctx.status = 404;
        ctx.body = "Doesn't support deletion of users";
        return null;
      }

      try {
        response = await destUserDeletionHandler.processDeleteUsers(b);
        if (response) {
          respList.push(response);
        }
      } catch (error) {
        // adding the status to the request
        ctx.status = error.response ? error.response.status : 400;
        const resp = {
          statusCode: error.response ? error.response.status : 400,
          error: error.message || "Error occurred while processing"
        };
        respList.push(resp);
        errNotificationClient.notify(error, "User Deletion", {
          ...resp,
          ...getCommonMetadata(ctx),
          ...getReqMetadata()
        });
      }
    })
  );
  ctx.body = respList;
  return ctx.body;
  // const { destType } = ctx.request.body;
};
const metricsController = async ctx => {
  ctx.status = 200;
  ctx.type = prometheusRegistry.contentType;
  ctx.body = await prometheusRegistry.metrics();
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

// Api to handle deletion of users for data regulation
// {
//   "destType": "dest name",
//   "userAttributes": [
//       {
//           "userId": "user_1"
//       },
//       {
//           "userId": "user_2"
//       }
//   ],
//   "config": {
//       "apiKey": "",
//       "apiSecret": ""
//   }
// }
router.post(`/deleteUsers`, async ctx => {
  await handleDeletionOfUsers(ctx);
});

router.get("/metrics", async ctx => {
  await metricsController(ctx);
});

module.exports = {
  router,
  handleDest,
  routerHandleDest,
  batchHandler,
  handleProxyRequest,
  handleDeletionOfUsers,
  fileUpload,
  pollStatus,
  getJobStatus
};
