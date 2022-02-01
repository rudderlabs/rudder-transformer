/* eslint-disable import/no-dynamic-require */
/* eslint-disable global-require */
const Router = require("koa-router");
const _ = require("lodash");
const fs = require("fs");
const logger = require("./logger");
const stats = require("./util/stats");

const sizeof = require('object-sizeof')
const { DestHandlerMap } = require("./constants");
const jsonDiff = require('json-diff');
const heapdump = require("heapdump");
const { updateTransformationCodeV1, myCache } = require("./util/customTransforrmationsStore");
const { cache } = require("./util/customTransforrmationsStore-v1");

const {
  isNonFuncObject,
  getMetadata,
  generateErrorObject
} = require("./v0/util");
const { processDynamicConfig } = require("./util/dynamicConfig");
const { userTransformHandler } = require("./routerUtils");
const { TRANSFORMER_METRIC } = require("./v0/util/constant");
const networkHandlerFactory = require("./adapters/networkHandlerFactory");

require("dotenv").config();
const eventValidator = require("./util/eventValidation");
const { prometheusRegistry } = require("./middleware");

let successfulVersions = [];
let failedVersions = [];
let finalResults = {};
const versionIdsMap = {
  "1fHddAUiVeBwp2SwZ0aG71X454q": "1uecaeOsMHcwnySPZbfjJYXpzpP",
  "1htBITAbZb6oMHymeum7UF7xRzd": "1uecaaj2fdUA4VbMuhk7akkRxLd",
  "1o2OT5cYDxm7zGO9pMt40XaX6rM": "1uecair5961vkvcTX3Vy3vJt1dE",
  "1pDAWi760WAW96LLZTsbqFAuK08": "1uecahgeDgRdzvFrEkW9iRBL92H",
  "1ypPtyuFjCYYCCR1hfPqc3dlcGA": "24VqzX0wJhBEH0QaPld8w8FWqer",
  "1jZCAI2VrDB9QS6hjkVyhXjhdzS": "1uyuxPdpjz0jS7LeQAYxWmymsvO",
  "1iF1tH9zAfc3KZ9OJzzBIl1VPia": "1uecajSwFTbwEYSZ2F6mklCbYc3",
  "1iLHAfJjp8lFBrf3XPdGF5M9l3F": "1uecasvnLWWah8ngRHYXGA9kN5G",
  "1jZC3aruHvIXGBTdwJ6kFA1GJdR": "1uecarKehKLWra0lHOShyha2AL9",
  "1iUDrOIvGBZwji5SeKtVgNmG6UR": "1uecahgeDgRdzvFrEkW9iRBL92H",
  "1hvMxM8v2BzhlXQWj1bLUxvulIP": "1uyuxPdpjz0jS7LeQAYxWmymsvO",
  "1iI4BsKlN9bk9tbma6RMG1NAl96": "1uecb0KPUjewpswma6JRQmNuUiB",
  "1o2mvdEPpuDYu3z6UeW0iHBMffG": "1uecayY1yudoMOlIx8SCcASyMbQ",
  "1s5u0SjDG5X3HcCbY24JQ5ykfrA": "1xaQlKL9qSslxTbXmsTQwYUZKhs",
  "1udGSiF1Bp6jAic37JEOSYG22Ez": "1xaMjo7YokwitRKzSdNFkTGK2hm",
  "1qMYBT4LLFcmi0cU59MIE61MwoV": "1uecb0tARn3USCpwBR9JMXgWFUR",
  "1klz2PRe75x3pc1IuQGE1JbGS1y": "1uecb9h6fqQMFAZA2bDj7ythR9C",
  "1t2kGu1qRz11BvfAplCdYFdlC8h": "1xZmWfrbCyM2hNt9PdEwas9VRwq",
  "1rqrpnPoUZVjq4VmHXK2ADpVleV": "1xa0FYl1amVuA9xDFbFaNGUF0o0",
  "1rZihudH1HurUghaKWoG1ivyRfh": "1uecbCFnURw9JqR6I8EpRDnV8da",
  "1rh0srM5fH9yWr7WHWqpPPzeEXO": "1uecbOCwiy1stMJdWjtWSaVLXA8",
  "1u2nigrRiZbCloWHwNFCCIX3NP4": "1uecbIsfuVJ4kW4qCIFwnQyN4Du",
  "1oezI5OihLXxZwinVn4CjvPK1Cj": "1uecbblonXhAsoKEQJ0OwpuxDlt",
  "1bLaSZgS4UhGnggH4ZLdhmbgUlX": "1uecbpkMToY5dfsvcUUj3l5KBfo",
  "20B31YmHnMrrAfxa4gfymzcgHtQ": "24VsU3ozrR0nAGYSJRoOf3w1Yyt",
  "1kp5NcAOv9jLcgbFSAo6RtFTIT8": "1uecbWlhCNFYobmMaL49xZ7rp1w",
  "1sWhcuNB78V0Hq3ebVuU7eQKvp2": "1xa1aT5qjJgWJF0tHfCMtwZ6Uwd",
  "1ilNgx7qoMlClUESjCdTnE7LYdA": "1uecc22mkn3qn8qtQJnUfy25MCf",
  "1U9zJ1KQ321vePoo14NNGMqmOzM": "1uecc6FmYjD5tubC1omfrmhGZhb",
  "1YiEU0JDDBOl2vtx3hhb31ErcLK": "1uecc7SaHD8TID68e2FqWc6QphC",
  "1axJesPakkAmZQYeJNV1YaA6OSB": "1uecc8dlr9jDnXUGuApMliD8CWo"
};
const workspaceMap = {
  "1fHddAUiVeBwp2SwZ0aG71X454q": "acorns-dgaray",
  "1htBITAbZb6oMHymeum7UF7xRzd": "acorns-dgaray",
  "1o2OT5cYDxm7zGO9pMt40XaX6rM": "acorns-dgaray",
  "1pDAWi760WAW96LLZTsbqFAuK08": "acorns-dgaray",
  "1ypPtyuFjCYYCCR1hfPqc3dlcGA": "acorns-dgaray",
  "1jZCAI2VrDB9QS6hjkVyhXjhdzS": "acorns-dgaray+dedupe",
  "1iF1tH9zAfc3KZ9OJzzBIl1VPia": "acorns-dgaray+production",
  "1iLHAfJjp8lFBrf3XPdGF5M9l3F": "acorns-dgaray+production",
  "1jZC3aruHvIXGBTdwJ6kFA1GJdR": "acorns-dgaray+production",
  "1iUDrOIvGBZwji5SeKtVgNmG6UR": "acorns-dgaray+production",
  "1hvMxM8v2BzhlXQWj1bLUxvulIP": "acorns-dgaray+production",
  "1iI4BsKlN9bk9tbma6RMG1NAl96": "acorns-dgaray+production",
  "1o2mvdEPpuDYu3z6UeW0iHBMffG": "acorns-dgaray+production",
  "1s5u0SjDG5X3HcCbY24JQ5ykfrA": "acorns-dgaray+production",
  "1udGSiF1Bp6jAic37JEOSYG22Ez": "amperity-caleb",
  "1qMYBT4LLFcmi0cU59MIE61MwoV": "carbmanager-kevin",
  "1klz2PRe75x3pc1IuQGE1JbGS1y": "codota-nimrod",
  "1t2kGu1qRz11BvfAplCdYFdlC8h": "codota-nimrod",
  "1rqrpnPoUZVjq4VmHXK2ADpVleV": "Crate & Barrel",
  "1rZihudH1HurUghaKWoG1ivyRfh": "Crate & Barrel",
  "1rh0srM5fH9yWr7WHWqpPPzeEXO": "Crate & Barrel",
  "1u2nigrRiZbCloWHwNFCCIX3NP4": "Crate & Barrel",
  "1oezI5OihLXxZwinVn4CjvPK1Cj": "mattermost-alex",
  "1bLaSZgS4UhGnggH4ZLdhmbgUlX": "RudderStack Production",
  "1xaNtgrNWiCk4F0bhA8IWfcXZ1U": "RudderStack Production",
  "20B31YmHnMrrAfxa4gfymzcgHtQ": "Sbermarket",
  "1kp5NcAOv9jLcgbFSAo6RtFTIT8": "Sbermarket",
  "1sWhcuNB78V0Hq3ebVuU7eQKvp2": "Sbermarket",
  "1ilNgx7qoMlClUESjCdTnE7LYdA": "suprdaily-sarang.bondre",
  "1U9zJ1KQ321vePoo14NNGMqmOzM": "Torpedo",
  "1YiEU0JDDBOl2vtx3hhb31ErcLK": "Torpedo",
  "1axJesPakkAmZQYeJNV1YaA6OSB": "Torpedo"
};
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

async function handleDest(ctx, version, destination) {
  const destHandler = getDestHandler(version, destination);
  const events = ctx.request.body;
  const reqParams = ctx.request.query;
  logger.debug(`[DT] Input events: ${JSON.stringify(events)}`);

  const metaTags =
    events && events.length && events[0].metadata
      ? getMetadata(events[0].metadata)
      : {};
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
          error: error.message || "Error occurred while processing payload."
        });
      }
    })
  );
  logger.debug(`[DT] Output events: ${JSON.stringify(respList)}`);
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
  // versions.forEach(version => {
  //   const destinations = getIntegrations(`${version}/destinations`);
  //   destinations.forEach(destination => {
  //     // eg. v0/destinations/ga
  //     router.post(`/${version}/destinations/${destination}`, async ctx => {
  //       const startTime = new Date();
  //       await handleDest(ctx, version, destination);
  //       stats.timing("dest_transform_request_latency", startTime, {
  //         destination,
  //         version
  //       });
  //       stats.increment("dest_transform_requests", 1, { destination, version });
  //     });
  //     // eg. v0/ga. will be deprecated in favor of v0/destinations/ga format
  //     router.post(`/${version}/${destination}`, async ctx => {
  //       const startTime = new Date();
  //       await handleDest(ctx, version, destination);
  //       stats.timing("dest_transform_request_latency", startTime, {
  //         destination,
  //         version
  //       });
  //       stats.increment("dest_transform_requests", 1, { destination, version });
  //     });
  //     router.post("/routerTransform", async ctx => {
  //       await routerHandleDest(ctx);
  //     });
  //   });
  // });

  if (functionsEnabled()) {
    router.post("/customTransform", async ctx => {
      const startTime = new Date();
      const events = ctx.request.body;
      const { processSessions } = ctx.query;
      logger.debug(`[CT] Input events: ${JSON.stringify(events)}`);
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

              
              let destTransformedEventsNew;
              logger.info('Executing difference check');
              if (transformationVersionId in versionIdsMap) {
                logger.info('version Hit ', transformationVersionId);
                destTransformedEvents = await userTransformHandler()(
                  destEvents,
                  transformationVersionId,
                  librariesVersionIDs
                );
                destTransformedEventsNew = await userTransformHandler()(
                  destEvents,
                  versionIdsMap[transformationVersionId],
                  librariesVersionIDs
                );

                if (!(transformationVersionId in finalResults)) {
                  finalResults[transformationVersionId] = {
                    success: 0,
                    fail: 0
                  };
                }
                let responseMatched = true;
                try {
                  destTransformedEvents.sort((a,b) => a.transformedEvent.messageId > b.transformedEvent.messageId ? 1: 
                    (a.transformedEvent.messageId < b.transformedEvent.messageId ? -1 : 0));
                  destTransformedEventsNew.sort((a,b) => a.transformedEvent.messageId > b.transformedEvent.messageId ? 1: 
                    (a.transformedEvent.messageId < b.transformedEvent.messageId ? -1 : 0));
                } catch (err) {console.log("sorting issue")}
                for (let i = 0; i < destTransformedEvents.length; i++) {
                  let responseDiff = jsonDiff.diff(destTransformedEventsNew[i].transformedEvent, destTransformedEvents[i].transformedEvent);
                  if (responseDiff) {
                    responseMatched = false;
                    break;
                  }
                }
                if (!responseMatched) {
                  logger.info("Failed Hit ", transformationVersionId);
                  stats.counter("match_fail", 1, { transformationVersionId, workspace: workspaceMap[transformationVersionId] });
                  finalResults[transformationVersionId]['fail'] = 1 + finalResults[transformationVersionId]['fail'];
                  if (!failedVersions.includes(transformationVersionId)) {
                    failedVersions.push(transformationVersionId)
                    fs.writeFileSync('./failedVersions.txt', failedVersions.length.toString() + '\n' + failedVersions.toString())
                  }

                  fs.writeFileSync(`./tout_${transformationVersionId}_${Date.now()%20}.txt`,
                    JSON.stringify(destTransformedEvents, null, 2) + '\n #### v1 ### \n' + JSON.stringify(destTransformedEventsNew, null, 2) 
                    + '\n#### Input ### \n' + JSON.stringify(destEvents, null, 2)
                  );
                } else {
                  logger.info("Successful Hit ", transformationVersionId);
                  stats.counter("match_success", 1, { transformationVersionId, workspace: workspaceMap[transformationVersionId] });
                  finalResults[transformationVersionId].success = 1 + finalResults[transformationVersionId].success;
                  if (!successfulVersions.includes(transformationVersionId)) {
                    successfulVersions.push(transformationVersionId);
                    fs.writeFileSync('./successfulVersions.txt', successfulVersions.length.toString() + '\n' + successfulVersions.toString())
                  }
                }
                logger.info(finalResults);
              } else {
                throw new Error('Filtered out');
              }
              
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
              logger.error(error.message);
              const errorString = error.toString();
              destTransformedEvents = destEvents.map(e => {
                return {
                  statusCode: 400,
                  metadata: e.metadata,
                  error: errorString
                };
              });

            } finally {

            }
          } else {
            const errorMessage = "Transformation VersionID not found";
            // logger.error(`[CT] ${errorMessage}`);
            transformedEvents.push({
              statusCode: 400,
              error: errorMessage,
              metadata: commonMetadata
            });

          }
        })
      );
      logger.debug(`[CT] Output events: ${JSON.stringify(transformedEvents)}`);
      ctx.body = transformedEvents;
      ctx.set("apiVersion", API_VERSION);
    });
  }
}

async function handleSource(ctx, version, source) {
  const sourceHandler = getSourceHandler(version, source);
  const events = ctx.request.body;
  logger.debug(`[ST] Input source events: ${JSON.stringify(events)}`);

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

      }
    })
  );
  logger.debug(`[ST] Output source events: ${JSON.stringify(respList)}`);

  ctx.body = respList;
  ctx.set("apiVersion", API_VERSION);
}

if (startSourceTransformer) {
  // versions.forEach(version => {
  //   const sources = getIntegrations(`${version}/sources`);
  //   sources.forEach(source => {
  //     // eg. v0/sources/customerio
  //     router.post(`/${version}/sources/${source}`, async ctx => {
  //       const startTime = new Date();
  //       await handleSource(ctx, version, source);
  //       stats.timing("source_transform_request_latency", startTime, {
  //         source,
  //         version
  //       });
  //       stats.increment("source_transform_requests", 1, { source, version });
  //     });
  //   });
  // });
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

router.get("/results", ctx => {
  ctx.body = finalResults;
});

router.get("/debug", ctx => {
  ctx.body = {
    tsize: JSON.stringify(myCache.data || '').length,
    tkeys: Object.keys(myCache.data || {}).length,
    tmem: sizeof(myCache),
    lsize: JSON.stringify(cache.data || '').length,
    lkeys: Object.keys(cache.data || {}).length,
    lmem: sizeof(cache)
  }
});

router.post("/publish", async ctx => {
  const { versionId, publish } = ctx.query;
  if(! (versionId in versionIdsMap)) {
    ctx.body = "versionId not found in map";
    ctx.status = 400;
  }
  
  const newVersionId = versionIdsMap[versionId];
  try {
    const res = await updateTransformationCodeV1(versionId, newVersionId, publish);
    ctx.body = res;
  } catch(err) {
    console.log(err);
    ctx.body = err.message;
  }
});

// router.post("/batch", ctx => {
//   const { destType, input } = ctx.request.body;
//   const destHandler = getDestHandler("v0", destType);
//   if (!destHandler || !destHandler.batch) {
//     ctx.status = 404;
//     ctx.body = `${destType} doesn't support batching`;
//     return;
//   }
//   const allDestEvents = _.groupBy(input, event => event.destination.ID);

//   const response = { batchedRequests: [], errors: [] };
//   Object.entries(allDestEvents).map(async ([destID, destEvents]) => {
//     // TODO: check await needed?
//     try {
//       const destBatchedRequests = destHandler.batch(destEvents);
//       response.batchedRequests.push(...destBatchedRequests);
//     } catch (error) {
//       response.errors.push(
//         error.message || "Error occurred while processing payload."
//       );
//     }
//   });
//   if (response.errors.length > 0) {
//     ctx.status = 500;
//     ctx.body = response.errors;
//     return;
//   }
//   ctx.body = response.batchedRequests;
// });

router.get("/heapdump", ctx => {
  heapdump.writeSnapshot((err, filename) => {
    logger.debug("Heap dump written to", filename);
  });
  ctx.body = "OK";
});

module.exports = { router, handleDest, routerHandleDest };

