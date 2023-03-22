/* eslint-disable import/no-dynamic-require */
/* eslint-disable global-require */
const Router = require('@koa/router');
const _ = require('lodash');
const fs = require('fs');
const path = require('path');
const logger = require('./logger');
const stats = require('./util/stats');
const { SUPPORTED_VERSIONS, API_VERSION } = require('./routes/utils/constants');
const { client: errNotificationClient } = require('./util/errorNotifier');
const tags = require('./v0/util/tags');

const {
  isNonFuncObject,
  getMetadata,
  generateErrorObject,
  isHttpStatusSuccess,
  getErrorRespEvents,
  isCdkDestination,
  getErrorStatusCode,
  checkAndCorrectUserId,
} = require('./v0/util');
const { processDynamicConfig } = require('./util/dynamicConfig');
const { DestHandlerMap } = require('./constants/destinationCanonicalNames');
const { userTransformHandler } = require('./routerUtils');
const networkHandlerFactory = require('./adapters/networkHandlerFactory');
const profilingRouter = require('./routes/profiling');
const destProxyRoutes = require('./routes/destinationProxy');
const eventValidator = require('./util/eventValidation');
const { prometheusRegistry } = require('./middleware');
const { getIntegrations } = require('./routes/utils');
const { setupUserTransformHandler, validateCode } = require('./util/customTransformer');
const { CommonUtils } = require('./util/common');
const { RespStatusError, RetryRequestError, sendViolationMetrics } = require('./util/utils');
const { isCdkV2Destination, getCdkV2TestThreshold } = require('./cdk/v2/utils');
const { PlatformError } = require('./v0/util/errorTypes');
const { getCachedWorkflowEngine, processCdkV2Workflow } = require('./cdk/v2/handler');
const { processCdkV1 } = require('./cdk/v1/handler');
const { extractLibraries } = require('./util/customTransformer');

const CDK_V1_DEST_PATH = 'cdk/v1';

const transformerMode = process.env.TRANSFORMER_MODE;

const startDestTransformer = transformerMode === 'destination' || !transformerMode;
const startSourceTransformer = transformerMode === 'source' || !transformerMode;
const transformerProxy = process.env.TRANSFORMER_PROXY || true;
const proxyTestModeEnabled =
  process.env.TRANSFORMER_PROXY_TEST_ENABLED?.toLowerCase() === 'true' || false;
const transformerTestModeEnabled = process.env.TRANSFORMER_TEST_MODE
  ? process.env.TRANSFORMER_TEST_MODE.toLowerCase() === 'true'
  : false;
const NS_PER_SEC = 1e9;

const router = new Router();

// Router for assistance in profiling
router.use(profilingRouter);

const getDestHandler = (version, dest) => {
  if (Object.prototype.hasOwnProperty.call(DestHandlerMap, dest)) {
    return require(`./${version}/destinations/${DestHandlerMap[dest]}/transform`);
  }
  return require(`./${version}/destinations/${dest}/transform`);
};

const getDestFileUploadHandler = (version, dest) =>
  require(`./${version}/destinations/${dest}/fileUpload`);

const getPollStatusHandler = (version, dest) => require(`./${version}/destinations/${dest}/poll`);

const getJobStatusHandler = (version, dest) =>
  require(`./${version}/destinations/${dest}/fetchJobStatus`);

const getDeletionUserHandler = (version, dest) =>
  require(`./${version}/destinations/${dest}/deleteUsers`);

const getSourceHandler = (version, source) => require(`./${version}/sources/${source}/transform`);

let areFunctionsEnabled = -1;
const functionsEnabled = () => {
  if (areFunctionsEnabled === -1) {
    areFunctionsEnabled = process.env.ENABLE_FUNCTIONS === 'false' ? 0 : 1;
  }
  return areFunctionsEnabled === 1;
};

// eslint-disable-next-line no-unused-vars
function getCommonMetadata(ctx) {
  // TODO: Parse information such as
  // cluster, namespace, etc information
  // from the request
  return {
    namespace: 'Unknown',
    cluster: 'Unknown',
  };
}

async function getCdkV2Result(destName, event, feature) {
  const cdkResult = {};
  try {
    cdkResult.output = await processCdkV2Workflow(destName, event, feature);
  } catch (error) {
    cdkResult.error = {
      message: error.message,
      statusCode: getErrorStatusCode(error),
    };
  }
  return cdkResult;
}

async function compareWithCdkV2(destType, inputArr, feature, v0Result, v0Time) {
  try {
    const envThreshold = parseFloat(process.env.CDK_LIVE_TEST || '0', 10);
    let destThreshold = getCdkV2TestThreshold(inputArr[0]);
    if (feature === tags.FEATURES.ROUTER) {
      destThreshold = getCdkV2TestThreshold(inputArr[0][0]);
    }
    const liveTestThreshold = envThreshold * destThreshold;
    if (
      Number.isNaN(liveTestThreshold) ||
      !liveTestThreshold ||
      liveTestThreshold < Math.random()
    ) {
      return;
    }
    const startTime = process.hrtime();
    const cdkResult = await getCdkV2Result(destType, inputArr[0], feature);
    const diff = process.hrtime(startTime);
    const cdkTime = diff[0] * NS_PER_SEC + diff[1];
    stats.gauge('v0_transformation_time', v0Time, {
      destType,
      feature,
    });
    stats.gauge('cdk_transformation_time', cdkTime, {
      destType,
      feature,
    });
    const objectDiff = CommonUtils.objectDiff(v0Result, cdkResult);
    if (Object.keys(objectDiff).length > 0) {
      stats.counter('cdk_live_compare_test_failed', 1, { destType, feature });
      logger.error(
        `[LIVE_COMPARE_TEST] failed for destType=${destType}, feature=${feature}, diff_keys=${JSON.stringify(
          Object.keys(objectDiff),
        )}`,
      );
      // logger.error(
      //   `[LIVE_COMPARE_TEST] failed for destType=${destType}, feature=${feature}, diff=${JSON.stringify(
      //     objectDiff
      //   )}`
      // );
      // logger.error(
      //   `[LIVE_COMPARE_TEST] failed for destType=${destType}, feature=${feature}, input=${JSON.stringify(
      //     inputArr[0]
      //   )}`
      // );
      // logger.error(
      //   `[LIVE_COMPARE_TEST] failed for destType=${destType}, feature=${feature}, results=${JSON.stringify(
      //     { v0: v0Result, cdk: cdkResult }
      //   )}`
      // );
      return;
    }
    stats.counter('cdk_live_compare_test_success', 1, { destType, feature });
  } catch (error) {
    stats.counter('cdk_live_compare_test_errored', 1, { destType, feature });
    logger.error(`[LIVE_COMPARE_TEST] errored for destType=${destType}, feature=${feature}`, error);
  }
}

/**
 * Enriches the transformed event with more information
 * - userId stringification
 *
 * @param {Object} transformedEvent - single transformed event
 * @returns transformedEvent after enrichment
 */
const enrichTransformedEvent = (transformedEvent) => ({
  ...transformedEvent,
  userId: checkAndCorrectUserId(transformedEvent.statusCode, transformedEvent?.userId),
});

async function handleV0Destination(destHandler, destType, inputArr, feature) {
  const v0Result = {};
  let v0Time = 0;
  try {
    const startTime = process.hrtime();
    v0Result.output = await destHandler(...inputArr);
    const diff = process.hrtime(startTime);
    v0Time = diff[0] * NS_PER_SEC + diff[1];
    // Comparison is happening in async and after return from here
    // this object is getting modified so comparison was failing to
    // avoid that we are cloning it.
    return _.cloneDeep(v0Result.output);
  } catch (error) {
    v0Result.error = {
      message: error.message,
      statusCode: getErrorStatusCode(error),
    };
    throw error;
  } finally {
    if (process.env.NODE_ENV === 'test') {
      await compareWithCdkV2(destType, inputArr, feature, v0Result, v0Time);
    } else {
      compareWithCdkV2(destType, inputArr, feature, v0Result, v0Time);
    }
  }
}

async function handleDest(ctx, version, destination) {
  const getReqMetadata = (event) => {
    try {
      return {
        destType: destination,
        destinationId: event?.destination?.ID,
        destName: event?.destination?.Name,
        metadata: event?.metadata,
      };
    } catch (error) {
      // Do nothing
    }
    return {};
  };

  const events = ctx.request.body;
  if (!Array.isArray(events) || events.length === 0) {
    throw new PlatformError('Event is missing or in inappropriate format');
  }
  const reqParams = ctx.request.query;
  logger.debug(`[DT] Input events: ${JSON.stringify(events)}`);

  const metaTags =
    events && events.length > 0 && events[0].metadata ? getMetadata(events[0].metadata) : {};
  stats.increment('dest_transform_input_events', events.length, {
    destination,
    version,
    ...metaTags,
  });
  const executeStartTime = new Date();
  let destHandler = null;
  const respList = await Promise.all(
    events.map(async (event) => {
      try {
        let parsedEvent = event;
        parsedEvent.request = { query: reqParams };
        parsedEvent = processDynamicConfig(parsedEvent);
        let respEvents;
        if (isCdkV2Destination(parsedEvent)) {
          respEvents = await processCdkV2Workflow(
            destination,
            parsedEvent,
            tags.FEATURES.PROCESSOR,
          );
        } else if (isCdkDestination(parsedEvent)) {
          respEvents = await processCdkV1(destination, parsedEvent);
        } else {
          if (destHandler === null) {
            destHandler = getDestHandler(version, destination);
          }
          respEvents = await handleV0Destination(
            destHandler.process,
            destination,
            [parsedEvent],
            tags.FEATURES.PROCESSOR,
          );
        }
        if (respEvents) {
          if (!Array.isArray(respEvents)) {
            respEvents = [respEvents];
          }
          return respEvents.map((ev) => ({
            output: enrichTransformedEvent(ev),
            metadata: destHandler?.processMetadata
              ? destHandler.processMetadata({
                  metadata: event.metadata,
                  inputEvent: parsedEvent,
                  outputEvent: ev,
                })
              : event.metadata,
            statusCode: 200,
          }));
        }
        return undefined;
      } catch (error) {
        logger.error(error);

        let implementation = tags.IMPLEMENTATIONS.NATIVE;
        let errCtx = 'Processor Transformation';
        if (isCdkV2Destination(event)) {
          errCtx = `CDK V2 - ${errCtx}`;
          implementation = tags.IMPLEMENTATIONS.CDK_V2;
        } else if (isCdkDestination(event)) {
          errCtx = `CDK - ${errCtx}`;
          implementation = tags.IMPLEMENTATIONS.CDK_V1;
        }

        const errObj = generateErrorObject(error, {
          [tags.TAG_NAMES.DEST_TYPE]: destination.toUpperCase(),
          [tags.TAG_NAMES.MODULE]: tags.MODULES.DESTINATION,
          [tags.TAG_NAMES.IMPLEMENTATION]: implementation,
          [tags.TAG_NAMES.FEATURE]: tags.FEATURES.PROCESSOR,
          [tags.TAG_NAMES.DESTINATION_ID]: event.metadata?.destinationId,
          [tags.TAG_NAMES.WORKSPACE_ID]: event.metadata?.workspaceId,
        });

        const resp = {
          metadata: event.metadata,
          destination: event.destination,
          statusCode: errObj.status,
          error: errObj.message,
          statTags: errObj.statTags,
        };

        errNotificationClient.notify(error, errCtx, {
          ...resp,
          ...getCommonMetadata(ctx),
          ...getReqMetadata(event),
        });
        return resp;
      }
    }),
  );
  stats.timing('cdk_events_latency', executeStartTime, {
    destination,
    ...metaTags,
  });
  logger.debug(`[DT] Output events: ${JSON.stringify(respList)}`);
  stats.increment('dest_transform_output_events', respList.length, {
    destination,
    version,
    ...metaTags,
  });
  ctx.body = respList.flat();
  return ctx.body;
}

async function handleValidation(ctx) {
  const requestStartTime = new Date();
  const events = ctx.request.body;
  const requestSize = ctx.request.get('content-length');
  const reqParams = ctx.request.query;
  const respList = [];
  const metaTags = events[0].metadata ? getMetadata(events[0].metadata) : {};
  let ctxStatusCode = 200;
  // eslint-disable-next-line no-restricted-syntax
  for (const event of events) {
    const eventStartTime = new Date();
    try {
      const parsedEvent = event;
      parsedEvent.request = { query: reqParams };
      // eslint-disable-next-line no-await-in-loop
      const hv = await eventValidator.handleValidation(parsedEvent);
      sendViolationMetrics(hv.validationErrors, hv.dropEvent, metaTags);
      if (hv.dropEvent) {
        const errMessage = `Error occurred while validating because : ${hv.violationType}`;
        respList.push({
          output: event.message,
          metadata: event.metadata,
          statusCode: 400,
          validationErrors: hv.validationErrors,
          error: errMessage,
        });
        stats.gauge('hv_violation_type', 1, {
          violationType: hv.violationType,
          ...metaTags,
        });
      } else {
        respList.push({
          output: event.message,
          metadata: event.metadata,
          statusCode: 200,
          validationErrors: hv.validationErrors,
        });
        stats.gauge('hv_propagated_events', 1, {
          ...metaTags,
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
        error: errMessage,
      });
      stats.gauge('hv_errors', 1, {
        ...metaTags,
      });
    } finally {
      stats.timing('hv_event_latency', eventStartTime, {
        ...metaTags,
      });
    }
  }
  ctx.body = respList;
  ctx.status = ctxStatusCode;
  ctx.set('apiVersion', API_VERSION);

  stats.gauge('hv_events_count', events.length, {
    ...metaTags,
  });
  stats.gauge('hv_request_size', requestSize, {
    ...metaTags,
  });
  stats.timing('hv_request_latency', requestStartTime, {
    ...metaTags,
  });
}

async function isValidRouterDest(event, destType) {
  const isCdkV2Dest = isCdkV2Destination(event);
  if (isCdkV2Dest) {
    try {
      await getCachedWorkflowEngine(destType, tags.FEATURES.ROUTER);
      return true;
    } catch (error) {
      return false;
    }
  }
  try {
    const routerDestHandler = getDestHandler('v0', destType);
    return routerDestHandler?.processRouterDest !== undefined;
  } catch (error) {
    return false;
  }
}

async function routerHandleDest(ctx) {
  const getReqMetadata = () => {
    try {
      return {
        destType: ctx.request?.body?.destType,
      };
    } catch (error) {
      // Do nothing
    }
    return {};
  };

  const respEvents = [];
  let destType;
  let defTags;
  try {
    const { input } = ctx.request.body;
    destType = ctx.request.body.destType;
    defTags = {
      [tags.TAG_NAMES.DEST_TYPE]: destType.toUpperCase(),
      [tags.TAG_NAMES.MODULE]: tags.MODULES.DESTINATION,
      [tags.TAG_NAMES.FEATURE]: tags.FEATURES.ROUTER,
      [tags.TAG_NAMES.IMPLEMENTATION]: tags.IMPLEMENTATIONS.NATIVE,
    };

    const routerDestHandler = getDestHandler('v0', destType);
    const isValidRTDest = await isValidRouterDest(input[0], destType);
    if (!isValidRTDest) {
      ctx.status = 404;
      ctx.body = `${destType} doesn't support router transform`;
      return null;
    }
    const allDestEvents = _.groupBy(input, (event) => event.destination.ID);
    await Promise.all(
      Object.values(allDestEvents).map(async (destInputArray) => {
        const newDestInputArray = processDynamicConfig(destInputArray, 'router');
        let listOutput;
        if (isCdkV2Destination(newDestInputArray[0])) {
          listOutput = await processCdkV2Workflow(
            destType,
            newDestInputArray,
            tags.FEATURES.ROUTER,
          );
        } else {
          listOutput = await handleV0Destination(
            routerDestHandler.processRouterDest,
            destType,
            [newDestInputArray, { ...getCommonMetadata(ctx), ...getReqMetadata() }],
            tags.FEATURES.ROUTER,
          );
        }
        const hasProcMetadataForRouter = routerDestHandler.processMetadataForRouter;
        // enriching transformed event
        listOutput.forEach((listOut) => {
          const { batchedRequest } = listOut;
          if (Array.isArray(batchedRequest)) {
            // eslint-disable-next-line no-param-reassign
            listOut.batchedRequest = batchedRequest.map((batReq) => enrichTransformedEvent(batReq));
          } else if (batchedRequest && typeof batchedRequest === 'object') {
            // eslint-disable-next-line no-param-reassign
            listOut.batchedRequest = enrichTransformedEvent(batchedRequest);
          }

          if (hasProcMetadataForRouter) {
            // eslint-disable-next-line no-param-reassign
            listOut.metadata = routerDestHandler.processMetadataForRouter(listOut);
          }
        });
        respEvents.push(...listOutput);
      }),
    );

    // Add default stat tags
    respEvents
      .filter((resp) => 'error' in resp && _.isObject(resp.statTags) && !_.isEmpty(resp.statTags))
      .forEach((resp) => {
        resp.statTags = {
          ...resp.statTags,
          ...defTags,
          [tags.TAG_NAMES.DESTINATION_ID]: resp.metadata[0]?.destinationId,
          [tags.TAG_NAMES.WORKSPACE_ID]: resp.metadata[0]?.workspaceId,
        };
      });
  } catch (error) {
    logger.error(error);

    const errObj = generateErrorObject(error, defTags);

    const resp = {
      statusCode: errObj.status,
      error: errObj.message,
      statTags: errObj.statTags,
    };

    // Add support to perform refreshToken action for OAuth destinations
    if (error?.authErrorCategory) {
      resp.authErrorCategory = error.authErrorCategory;
    }

    errNotificationClient.notify(error, 'Router Transformation', {
      ...resp,
      ...getCommonMetadata(ctx),
      ...getReqMetadata(),
    });

    respEvents.push(resp);
  }
  ctx.body = { output: respEvents };
  return ctx.body;
}

if (startDestTransformer) {
  SUPPORTED_VERSIONS.forEach((version) => {
    const destinations = getIntegrations(path.resolve(__dirname, `./${version}/destinations`));
    destinations.push(...getIntegrations(path.resolve(__dirname, `./${CDK_V1_DEST_PATH}`)));
    destinations.forEach((destination) => {
      // eg. v0/destinations/ga
      router.post(`/${version}/destinations/${destination}`, async (ctx) => {
        const startTime = new Date();
        await handleDest(ctx, version, destination);
        ctx.set('apiVersion', API_VERSION);
        // Assuming that events are from one single source

        const metaTags =
          ctx.request.body && ctx.request.body.length > 0 && ctx.request.body[0].metadata
            ? getMetadata(ctx.request.body[0].metadata)
            : {};
        stats.timing('dest_transform_request_latency', startTime, {
          destination,
          version,
          ...metaTags,
        });
        stats.increment('dest_transform_requests', 1, {
          destination,
          version,
          ...metaTags,
        });
      });
      // eg. v0/ga. will be deprecated in favor of v0/destinations/ga format
      router.post(`/${version}/${destination}`, async (ctx) => {
        const startTime = new Date();
        await handleDest(ctx, version, destination);
        ctx.set('apiVersion', API_VERSION);
        // Assuming that events are from one single source

        const metaTags =
          ctx.request.body && ctx.request.body.length > 0 && ctx.request.body[0].metadata
            ? getMetadata(ctx.request.body[0].metadata)
            : {};
        stats.timing('dest_transform_request_latency', startTime, {
          destination,
          ...metaTags,
        });
        stats.increment('dest_transform_requests', 1, {
          destination,
          version,
          ...metaTags,
        });
      });
      router.post('/routerTransform', async (ctx) => {
        ctx.set('apiVersion', API_VERSION);
        await routerHandleDest(ctx);
      });
    });
  });

  if (functionsEnabled()) {
    router.post('/extractLibs', async (ctx) => {
      try {
        const {
          code,
          versionId,
          validateImports = false,
          additionalLibraries = [],
          language = 'javascript',
          testMode = false,
        } = ctx.request.body;

        if (!code) {
          throw new Error('Invalid request. Code is missing');
        }

        const obj = await extractLibraries(
          code,
          versionId,
          validateImports,
          additionalLibraries,
          language,
          testMode || versionId === 'testVersionId',
        );
        ctx.body = obj;
      } catch (err) {
        ctx.status = 400;
        ctx.body = { error: err.error || err.message };
      }
    });

    router.post('/customTransform', async (ctx) => {
      const startTime = new Date();
      const events = ctx.request.body;
      const { processSessions } = ctx.query;
      logger.debug(`[CT] Input events: ${JSON.stringify(events)}`);
      stats.gauge('user_transform_input_events', events.length, {
        processSessions,
      });
      let groupedEvents;
      if (processSessions) {
        groupedEvents = _.groupBy(events, (event) => {
          // to have the backward-compatibility and being extra careful. We need to remove this (message.anonymousId) in next release.
          const rudderId = event.metadata.rudderId || event.message.anonymousId;
          return `${event.destination.ID}_${event.metadata.sourceId}_${rudderId}`;
        });
      } else {
        groupedEvents = _.groupBy(
          events,
          (event) => `${event.metadata.destinationId}_${event.metadata.sourceId}`,
        );
      }
      stats.gauge('user_transform_function_group_size', Object.entries(groupedEvents).length, {
        processSessions,
      });

      let ctxStatusCode = 200;
      const transformedEvents = [];
      let librariesVersionIDs = [];
      if (events[0].libraries) {
        librariesVersionIDs = events[0].libraries.map((library) => library.VersionID);
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
          const messageIds = destEvents.map((ev) => ev.metadata && ev.metadata.messageId);
          const commonMetadata = {
            sourceId: destEvents[0].metadata && destEvents[0].metadata.sourceId,
            destinationId: destEvents[0].metadata && destEvents[0].metadata.destinationId,
            destinationType: destEvents[0].metadata && destEvents[0].metadata.destinationType,
            messageIds,
          };

          const metaTags =
            destEvents.length > 0 && destEvents[0].metadata
              ? getMetadata(destEvents[0].metadata)
              : {};
          const userFuncStartTime = new Date();
          if (transformationVersionId) {
            let destTransformedEvents;
            try {
              stats.gauge('user_transform_function_input_events', destEvents.length, {
                processSessions,
                ...metaTags,
              });
              destTransformedEvents = await userTransformHandler()(
                destEvents,
                transformationVersionId,
                librariesVersionIDs,
              );
              transformedEvents.push(
                ...destTransformedEvents.map((ev) => {
                  if (ev.error) {
                    return {
                      statusCode: 400,
                      error: ev.error,
                      metadata: _.isEmpty(ev.metadata) ? commonMetadata : ev.metadata,
                    };
                  }
                  if (!isNonFuncObject(ev.transformedEvent)) {
                    return {
                      statusCode: 400,
                      error: `returned event in events from user transformation is not an object. transformationVersionId:${transformationVersionId} and returned event: ${JSON.stringify(
                        ev.transformedEvent,
                      )}`,
                      metadata: _.isEmpty(ev.metadata) ? commonMetadata : ev.metadata,
                    };
                  }
                  return {
                    output: ev.transformedEvent,
                    metadata: _.isEmpty(ev.metadata) ? commonMetadata : ev.metadata,
                    statusCode: 200,
                  };
                }),
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
              destTransformedEvents = destEvents.map((e) => ({
                statusCode: status,
                metadata: e.metadata,
                error: errorString,
              }));
              transformedEvents.push(...destTransformedEvents);
              stats.gauge('user_transform_errors', destEvents.length, {
                transformationVersionId,
                processSessions,
                ...metaTags,
              });
            } finally {
              stats.timing('user_transform_function_latency', userFuncStartTime, {
                transformationVersionId,
                processSessions,
                ...metaTags,
              });
            }
          } else {
            const errorMessage = 'Transformation VersionID not found';
            logger.error(`[CT] ${errorMessage}`);
            transformedEvents.push({
              statusCode: 400,
              error: errorMessage,
              metadata: commonMetadata,
            });
            stats.gauge('user_transform_errors', destEvents.length, {
              transformationVersionId,
              processSessions,
              ...metaTags,
            });
          }
        }),
      );
      logger.debug(`[CT] Output events: ${JSON.stringify(transformedEvents)}`);
      ctx.body = transformedEvents;
      ctx.status = ctxStatusCode;
      ctx.set('apiVersion', API_VERSION);
      stats.timing('user_transform_request_latency', startTime, {
        processSessions,
      });
      stats.gauge('user_transform_requests', 1, { processSessions });
      stats.gauge('user_transform_output_events', transformedEvents.length, {
        processSessions,
      });
    });
  }
}

if (transformerTestModeEnabled) {
  router.post('/transformation/test', async (ctx) => {
    try {
      const { events, trRevCode, libraryVersionIDs = [] } = ctx.request.body;
      if (!trRevCode || !trRevCode.code || !trRevCode.codeVersion) {
        throw new Error('Invalid Request. Missing parameters in transformation code block');
      }
      if (!events || events.length === 0) {
        throw new Error('Invalid request. Missing events');
      }

      logger.debug(`[CT] Test Input Events: ${JSON.stringify(events)}`);
      trRevCode.versionId = 'testVersionId';
      const res = await userTransformHandler()(
        events,
        trRevCode.versionId,
        libraryVersionIDs,
        trRevCode,
        true,
      );
      logger.debug(`[CT] Test Output Events: ${JSON.stringify(res.transformedEvents)}`);
      ctx.body = res;
    } catch (error) {
      ctx.status = error.statusCode || 400;
      ctx.body = { error: error.message };
    }
  });

  router.post('/transformationLibrary/test', async (ctx) => {
    try {
      const { code, language = 'javascript' } = ctx.request.body;

      if (!code) {
        throw new Error('Invalid request. Missing code');
      }

      const res = await validateCode(code, language);
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
  router.post('/transformation/sethandle', async (ctx) => {
    try {
      const { trRevCode, libraryVersionIDs = [] } = ctx.request.body;
      const { code, versionId, language, testName, testWithPublish = false } = trRevCode || {};
      if (!code || !language || !testName || (language === 'pythonfaas' && !versionId)) {
        throw new Error('Invalid Request. Missing parameters in transformation code block');
      }

      logger.debug(`[CT] Setting up a transformation ${testName} with publish: ${testWithPublish}`);
      if (!trRevCode.versionId) {
        trRevCode.versionId = 'testVersionId';
      }
      if (!trRevCode.workspaceId) {
        trRevCode.workspaceId = 'workspaceId';
      }
      const res = await setupUserTransformHandler(trRevCode, libraryVersionIDs, testWithPublish);
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
  stats.increment('source_transform_input_events', events.length, {
    source,
    version,
  });
  const respList = [];
  await Promise.all(
    events.map(async (event) => {
      try {
        const respEvents = await sourceHandler.process(event);

        // We send response back to the source
        // through outputToSource. This is not sent to gateway
        if (Object.prototype.hasOwnProperty.call(respEvents, 'outputToSource')) {
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

        // TODO: Update the data contact for source transformation
        // and then send the following additional information
        // const errObj = generateErrorObject(error, {
        //   [tags.TAG_NAMES.SRC_TYPE]: source.toUpperCase(),
        //   [tags.TAG_NAMES.MODULE]: tags.MODULES.SOURCE,
        //   [tags.TAG_NAMES.IMPLEMENTATION]: tags.IMPLEMENTATIONS.NATIVE,
        //   [tags.TAG_NAMES.FEATURE]: tags.FEATURES.PROCESSOR
        //   [tags.TAG_NAMES.SOURCE_ID]: TBD
        // });

        // const resp = {
        //   statusCode: errObj.status,
        //   error: errObj.message,
        //   statTags: errObj.statTags
        // };

        const resp = {
          statusCode: 400,
          error: error.message || 'Error occurred while processing payload.',
        };

        respList.push(resp);
        stats.counter('source_transform_errors', events.length, {
          source,
          version,
        });
        errNotificationClient.notify(error, 'Source Transformation', {
          ...resp,
          ...getCommonMetadata(ctx),
          ...getReqMetadata(),
        });
      }
    }),
  );
  logger.debug(`[ST] Output source events: ${JSON.stringify(respList)}`);
  stats.increment('source_transform_output_events', respList.length, {
    source,
    version,
  });
  ctx.body = respList;
  ctx.set('apiVersion', API_VERSION);
}

if (startSourceTransformer) {
  SUPPORTED_VERSIONS.forEach((version) => {
    const sources = getIntegrations(path.resolve(__dirname, `./${version}/sources`));
    sources.forEach((source) => {
      // eg. v0/sources/customerio
      router.post(`/${version}/sources/${source}`, async (ctx) => {
        const startTime = new Date();
        await handleSource(ctx, version, source);
        stats.timing('source_transform_request_latency', startTime, {
          source,
          version,
        });
        stats.increment('source_transform_requests', 1, { source, version });
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

  const { metadata, ...destinationRequest } = ctx.request.body;
  const destNetworkHandler = networkHandlerFactory.getNetworkHandler(destination);
  let response;
  try {
    stats.counter('tf_proxy_dest_req_count', 1, {
      destination,
    });
    const startTime = new Date();
    const rawProxyResponse = await destNetworkHandler.proxy(destinationRequest);
    stats.timing('transformer_proxy_time', startTime, {
      destination,
    });
    stats.counter('tf_proxy_dest_resp_count', 1, {
      destination,
      success: rawProxyResponse.success,
    });

    const processedProxyResponse = destNetworkHandler.processAxiosResponse(rawProxyResponse);
    stats.counter('tf_proxy_proc_ax_response_count', 1, {
      destination,
    });
    response = destNetworkHandler.responseHandler(
      { ...processedProxyResponse, rudderJobMetadata: metadata },
      destination,
    );
    stats.counter('tf_proxy_resp_handler_count', 1, {
      destination,
    });
  } catch (err) {
    logger.error('Error occurred while completing proxy request:');
    logger.error(err);

    const errObj = generateErrorObject(err, {
      [tags.TAG_NAMES.DEST_TYPE]: destination.toUpperCase(),
      [tags.TAG_NAMES.MODULE]: tags.MODULES.DESTINATION,
      [tags.TAG_NAMES.IMPLEMENTATION]: tags.IMPLEMENTATIONS.NATIVE,
      [tags.TAG_NAMES.FEATURE]: tags.FEATURES.DATA_DELIVERY,
      [tags.TAG_NAMES.DESTINATION_ID]: metadata?.destinationId,
      [tags.TAG_NAMES.WORKSPACE_ID]: metadata?.workspaceId,
    });

    response = {
      status: errObj.status,
      ...(errObj.authErrorCategory && {
        authErrorCategory: errObj.authErrorCategory,
      }),
      destinationResponse: errObj.destinationResponse,
      message: errObj.message,
      statTags: errObj.statTags,
    };

    stats.counter('tf_proxy_err_count', 1, {
      destination,
    });

    errNotificationClient.notify(err, 'Data Delivery', {
      ...response,
      ...getCommonMetadata(ctx),
      ...getReqMetadata(),
    });
  }
  ctx.body = { output: response };
  // Sending `204` status(obtained from destination) is not working as expected
  // Since this is success scenario, we'll be forcefully sending `200` status-code to server
  ctx.status = isHttpStatusSuccess(response.status) ? 200 : response.status;
  return ctx.body;
}

if (transformerProxy) {
  SUPPORTED_VERSIONS.forEach((version) => {
    const destinations = getIntegrations(path.resolve(__dirname, `./${version}/destinations`));
    destinations.forEach((destination) => {
      router.post(`/${version}/destinations/${destination}/proxy`, async (ctx) => {
        const startTime = new Date();
        ctx.set('apiVersion', API_VERSION);
        await handleProxyRequest(destination, ctx);
        stats.timing('transformer_total_proxy_latency', startTime, {
          destination,
          version,
        });
      });
    });
  });
}

if (proxyTestModeEnabled) {
  router.use(destProxyRoutes);
}

router.get('/version', (ctx) => {
  ctx.body = process.env.npm_package_version || 'Version Info not found';
});

router.get('/transformerBuildVersion', (ctx) => {
  ctx.body = process.env.transformer_build_version || 'Version Info not found';
});

router.get('/health', (ctx) => {
  const { git_commit_sha: gitCommitSha, transformer_build_version: imageVersion } = process.env;
  ctx.body = {
    service: 'UP',
    ...(imageVersion && { version: imageVersion }),
    ...(gitCommitSha && { gitCommitSha }),
  };
});

router.get('/features', (ctx) => {
  const obj = JSON.parse(fs.readFileSync('features.json', 'utf8'));
  ctx.body = JSON.stringify(obj);
});

const batchHandler = (ctx) => {
  const getReqMetadata = (destEvents) => {
    try {
      const reqBody = ctx.request.body;
      const firstEvent = destEvents[0];
      return {
        destType: reqBody?.destType,
        destinationId: firstEvent?.destination?.ID,
        destName: firstEvent?.destination?.Name,
        metadata: firstEvent?.metadata,
      };
    } catch (error) {
      // Do nothing
    }
    return {};
  };

  const { destType, input } = ctx.request.body;
  const destHandler = getDestHandler('v0', destType);
  if (!destHandler || !destHandler.batch) {
    ctx.status = 404;
    ctx.body = `${destType} doesn't support batching`;
    return null;
  }
  const allDestEvents = _.groupBy(input, (event) => event.destination.ID);

  const response = { batchedRequests: [], errors: [] };
  Object.entries(allDestEvents).map(async ([, destEvents]) => {
    // TODO: check await needed?
    try {
      destEvents = processDynamicConfig(destEvents, 'batch');
      const destBatchedRequests = destHandler.batch(destEvents);
      response.batchedRequests.push(...destBatchedRequests);
    } catch (error) {
      const errorObj = generateErrorObject(error, {
        [tags.TAG_NAMES.DEST_TYPE]: destType.toUpperCase(),
        [tags.TAG_NAMES.MODULE]: tags.MODULES.DESTINATION,
        [tags.TAG_NAMES.IMPLEMENTATION]: tags.IMPLEMENTATIONS.NATIVE,
        [tags.TAG_NAMES.FEATURE]: tags.FEATURES.BATCH,
        [tags.TAG_NAMES.DESTINATION_ID]: destEvents[0].metadata?.destinationId,
        [tags.TAG_NAMES.WORKSPACE_ID]: destEvents[0].metadata?.workspaceId,
      });
      const errResp = getErrorRespEvents(
        destEvents.map((d) => d.metadata),
        500, // not using errorObj.status
        errorObj.message,
        errorObj.statTags,
      );
      response.errors.push({
        ...errResp,
        destination: destEvents[0].destination,
      });
      errNotificationClient.notify(error, 'Batch Transformation', {
        ...errResp,
        ...getCommonMetadata(ctx),
        ...getReqMetadata(destEvents),
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
router.post('/batch', (ctx) => {
  ctx.set('apiVersion', API_VERSION);
  batchHandler(ctx);
});

const fileUpload = async (ctx) => {
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
  const destFileUploadHandler = getDestFileUploadHandler('v0', destType.toLowerCase());

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
      error: error.message || 'Error occurred while processing payload.',
      metadata: error.response ? error.response.metadata : null,
    };
    errNotificationClient.notify(error, 'File Upload', {
      ...response,
      ...getCommonMetadata(ctx),
      ...getReqMetadata(),
    });
  }
  ctx.body = response;
  return ctx.body;
};

const pollStatus = async (ctx) => {
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
  const destFileUploadHandler = getPollStatusHandler('v0', destType.toLowerCase());
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
      error: error.message || 'Error occurred while processing payload.',
    };
    errNotificationClient.notify(error, 'Poll Status', {
      ...response,
      ...getCommonMetadata(ctx),
      ...getReqMetadata(),
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
  const destFileUploadHandler = getJobStatusHandler('v0', destType.toLowerCase());

  if (!destFileUploadHandler || !destFileUploadHandler.processJobStatus) {
    ctx.status = 404;
    ctx.body = `${destType} doesn't support bulk upload`;
    return null;
  }
  let response;
  try {
    response = await destFileUploadHandler.processJobStatus(ctx.request.body, type);
  } catch (error) {
    response = {
      statusCode: error.response ? error.response.status : 400,
      error: error.message || 'Error occurred while processing payload.',
    };
    errNotificationClient.notify(error, 'Job Status', {
      ...response,
      ...getCommonMetadata(ctx),
      ...getReqMetadata(),
    });
  }
  ctx.body = response;
  return ctx.body;
};

const handleDeletionOfUsers = async (ctx) => {
  const getReqMetadata = () => {
    try {
      const reqBody = ctx.request.body;
      return {
        destType: reqBody[0]?.destType,
        jobs: reqBody.map((req) => req.jobId),
      };
    } catch (error) {
      // Do nothing
    }
    return {};
  };

  const getRudderDestInfo = () => {
    try {
      const rudderDestInfoHeader = ctx.get('x-rudder-dest-info');
      const destInfoHeader = JSON.parse(rudderDestInfoHeader);
      if (!Array.isArray(destInfoHeader)) {
        return destInfoHeader;
      }
    } catch (error) {
      logger.error(`Error while getting rudderDestInfo header value: ${error}`);
    }
    return {};
  };

  const { body } = ctx.request;
  const respList = [];
  const rudderDestInfo = getRudderDestInfo();
  let response;
  await Promise.all(
    body.map(async (reqBody) => {
      const { destType } = reqBody;
      const destUserDeletionHandler = getDeletionUserHandler('v0', destType.toLowerCase());
      if (!destUserDeletionHandler || !destUserDeletionHandler.processDeleteUsers) {
        ctx.status = 404;
        ctx.body = "Doesn't support deletion of users";
        return null;
      }

      try {
        response = await destUserDeletionHandler.processDeleteUsers({
          ...reqBody,
          rudderDestInfo,
        });
        if (response) {
          respList.push(response);
        }
      } catch (error) {
        const errObj = generateErrorObject(error, {
          [tags.TAG_NAMES.DEST_TYPE]: destType.toUpperCase(),
          [tags.TAG_NAMES.MODULE]: tags.MODULES.DESTINATION,
          [tags.TAG_NAMES.IMPLEMENTATION]: tags.IMPLEMENTATIONS.NATIVE,
          [tags.TAG_NAMES.FEATURE]: tags.FEATURES.USER_DELETION,
        });

        // adding the status to the request
        ctx.status = errObj.status;
        const resp = {
          statusCode: errObj.status,
          error: errObj.message,
          ...(errObj.authErrorCategory && {
            authErrorCategory: errObj.authErrorCategory,
          }),
        };

        respList.push(resp);
        logger.error(`Error Response List: ${JSON.stringify(respList, null, 2)}`);

        errNotificationClient.notify(error, 'User Deletion', {
          ...resp,
          ...getCommonMetadata(ctx),
          ...getReqMetadata(),
        });
      }
      return undefined;
    }),
  );
  ctx.body = respList;
  return ctx.body;
  // const { destType } = ctx.request.body;
};
const metricsController = async (ctx) => {
  ctx.status = 200;
  ctx.type = prometheusRegistry.contentType;
  ctx.body = await prometheusRegistry.metrics();
  return ctx.body;
};

router.post('/fileUpload', async (ctx) => {
  await fileUpload(ctx);
});

router.post('/pollStatus', async (ctx) => {
  await pollStatus(ctx);
});

router.post('/getFailedJobs', async (ctx) => {
  await getJobStatus(ctx, 'fail');
});

router.post('/getWarningJobs', async (ctx) => {
  await getJobStatus(ctx, 'warn');
});
// eg. v0/validate. will validate events as per respective tracking plans
router.post(`/v0/validate`, async (ctx) => {
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
router.post(`/deleteUsers`, async (ctx) => {
  await handleDeletionOfUsers(ctx);
});

router.get('/metrics', async (ctx) => {
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
  getJobStatus,
  processCdkV2Workflow,
  handleV0Destination,
  getDestHandler,
};
