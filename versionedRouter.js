/* eslint-disable no-prototype-builtins */
/* eslint-disable import/no-dynamic-require */
/* eslint-disable global-require */
const Router = require("koa-router");
const _ = require("lodash");
const { lstatSync, readdirSync } = require("fs");
const fs = require("fs");
const logger = require("./logger");
const stats = require("./util/stats");
const { isNonFuncObject, getMetadata } = require("./v0/util");
const sizeof = require('object-sizeof')
const { DestHandlerMap } = require("./constants");
const jsonDiff = require('json-diff');
const heapdump = require("heapdump");
const { updateTransformationCodeV1, myCache } = require("./util/customTransforrmationsStore");
const { cache } = require("./util/customTransforrmationsStore-v1");

require("dotenv").config();

let successfulVersions = [];
let failedVersions = [];
let finalResults = {};
const versionIdsMap = {
  "1t2hNs8uUo9fi4qMLfLSh60CVVH": "1xZnrrxxCQro3SGHuhNRiFOQwzv",
  "1pdbtF51tth5O91EHVRJmmDrj25": "1xaOS4pmlEwVzO8sFw2RtYCOKM7",
  "1o2OT5cYDxm7zGO9pMt40XaX6rM": "1uecair5961vkvcTX3Vy3vJt1dE",
  "1lyCCCmIaVAHfCSWuvJZ9HWcdrZ": "1uecblSMnRLkpAneQfiyceHF8pp",
  // "1oDeiLKVW8oyt7BbFUHZk5rPVYP": "1uecbOKhIUim7jjkj8is5Y1BOfg",
  "1hvMxM8v2BzhlXQWj1bLUxvulIP": "1uecaejuXoeDAYaZNlF9cVlahNL",
  "1vLV5wx8wg094Q4nagcuM4wktUo": "1xaJP1tjgJf7dltgNRL1cEXrLeR",
  "1jZC3aruHvIXGBTdwJ6kFA1GJdR": "1uecarKehKLWra0lHOShyha2AL9",
  // "1tzWclkncyuEGF94osWdnqPPxuI": "1xaBueJhqMRTEXAs0ESXtoTZjga",
  "1myKbhF92cYsU1K4OmuXVbtMeIm": "1uecbTMPtwbFso9UNuh4wWBbByu",
  "1odNK2YlQsrErE9B10LPtSL65XY": "1uecbHpImCutZ2hXd55ifB3bhxc",
  "1rh0srM5fH9yWr7WHWqpPPzeEXO": "1uecbOCwiy1stMJdWjtWSaVLXA8",
  "1fRlNp1G791D38ryWTPwOPQ5N47": "1xaVPFuUXfCOjp46mVEsoBlpNgp",
  "1ilNgx7qoMlClUESjCdTnE7LYdA": "1uecc22mkn3qn8qtQJnUfy25MCf",
  "1lHf2fmkiboL2TX8xFHWb525yIc": "1uecazv1JdrdkTJZnMsaLfASBp0",
  // "1q9Q0kCJsKolHsYnYqkXJwJu89n": "1uecbKHCIlhhgLD0BOkYQDzWb2o",
  "1eJWIeO4w8l57bQwNTCWPsy1X72": "1uecbAwS9y1e8Fjw0EUACqoioCw",
  "1bW8Q7t7w1HvCnGXYDysA8RE23I": "1uecblvLrP79bWqQOe5ff0am5dK",
  "1meK7PMe3LzffkM8ed5O4JwTe0o": "1xaISIrjTlDTxfpN9fhj43pZpgl",
  "1rQMCqv8gJAdZMz6o2KcwW0uBZd": "1uecbZMkP0l1CWA7u9MrfJ86IEv",
  "1t2kGu1qRz11BvfAplCdYFdlC8h": "1xZmWfrbCyM2hNt9PdEwas9VRwq",
  "1rWgHgwXFMGnIQuPyinIHbdhlC6": "1uecbyeOXDuw8tktNxpO7WSdzjV",
  "1jT6yDPBBhvtEroYQ0ey9HHD9pZ": "1uecbwKyNvLqpfPMpQkrqathDuS",
  "1hYgwaZCN8hBKSJdrQptXcDEVTz": "1xaLWUgsd4On8qyQOXM9TjRKlsT",
  "1jZCAI2VrDB9QS6hjkVyhXjhdzS": "1uyuxPdpjz0jS7LeQAYxWmymsvO",
  "1u2nigrRiZbCloWHwNFCCIX3NP4": "1uecbIsfuVJ4kW4qCIFwnQyN4Du",
  "1vfU8pQv2ScG968e3TpPQLlkN5G": "1xZjvlTI7ZxuOy0bqE7YVwVwtuz",
  // "1sDrZmo8QFXSQ5123qhhmHmUPaA": "1xaFcsi5CrmNXsoTDdDWykcJiY6",
  "1cWkcPaG8Pk5361bVenLjaEvcH0": "1xaV1yfGlxzFsPwXzSH3CF1c4XZ",
  "1iLB3VfL1DQNPJbRlimJaa8Rfye": "1xaQDTyWjnMFEd0TBPdkjLptVvy",
  "1qMYBT4LLFcmi0cU59MIE61MwoV": "1uecb0tARn3USCpwBR9JMXgWFUR",
  "1iI4BsKlN9bk9tbma6RMG1NAl96": "1uecb0KPUjewpswma6JRQmNuUiB",
  "1rTaNtEYGABSI7UXgsWAWQeivqi": "1uecbC6QXngLHWMGAwX9jezVyvN",
  // "1oaQqhINSLmgaZkVxV4AkOAv6cK": "1uecbll1Kgb4T4QyiqkgMEAtfrd",
  "1qkmeNKxtyDYibtBppKXM22RrbO": "1xa9lNCLqn62SEss036UV8F9wFZ",
  // "1q7CxGoktW8LOinUOQ1QrqM1NpF": "1uecbZrVA3qi20fgonxoG3Bacp6",
  "1kWT2juf5YG7t80LEBJmGmyEaT1": "1uecbsfaUbSQzehXXUXob0tGhzj",
  // "1oF0WqwieSZvnfRc5gFuCcLtMcb": "1uecc0U012AVN5W1O4Wr3iMuUW4",
  "1U9zJ1KQ321vePoo14NNGMqmOzM": "1uecc6FmYjD5tubC1omfrmhGZhb",
  "1udGSiF1Bp6jAic37JEOSYG22Ez": "1xaMjo7YokwitRKzSdNFkTGK2hm",
  // "1sDs3UZBeG8z37mipWkBxtL0aYp": "1xaFKuQSDK6mgQFwYzRJiblPGX5",
  "1roRmBgJXRcJ4q4Av8naYVBGVGO": "1uecboezgldUKqEhpvf56rTmSO4",
  "1oF16WTqmROva7xiiHSFdt0lAjM": "1uecbwrEbIoE3k6SOQ4lNFHSaND",
  "1mwrGK3zAEVrfWJW0qepPuEVhDI": "1uecbufejhpEvM2kw5rhazIve3j",
  "1xBi2MZp6Gmcml3ZKb8YdPzXp8D": "1uecbr7mgF27LccJiyzLmx3y221",
  "1rqrpnPoUZVjq4VmHXK2ADpVleV": "1xa0FYl1amVuA9xDFbFaNGUF0o0",
  "1rWgUbQqVIQKSkMYdmPZ8fPAid7": "1uecbyeOXDuw8tktNxpO7WSdzjV",
  "1kMS1g7jakfkPbyXM46i6m9rdq5": "1uecaaVRNOypgusF2DraeAgIIGp",
  "1rWgUoms63eT2DafTg4uP975H7p": "1uecbyeOXDuw8tktNxpO7WSdzjV",
  "1hM7ON82R1xkc6IpKVDJKOAFNWr": "1uecbWr5tQhMak68boTGMJuowWm",
  "1iLHAfJjp8lFBrf3XPdGF5M9l3F": "1uecasvnLWWah8ngRHYXGA9kN5G",
  "1klz2PRe75x3pc1IuQGE1JbGS1y": "1uecb9h6fqQMFAZA2bDj7ythR9C",
  // "1oF1EYZq44ILJewcPuNWcfZVkkv": "1uecbz4twjTU95Cw9QlF6CfrSh0",
  "1nfq4Xwi3w3nAzDtwZq3JTLOj3Z": "1uecb21QsxkZ2QSYTfVSPNxYYW8",
  "1obCmE2A2Zkh9dDDaP4LWxxKilp": "1uecbtQJxAxntPzXWpQhiND3Jcb",
  // "1wVXJRkXjmv0zWmWf0Q1NkWuJnK": "1x8MHXSbaoeddzcwnEkaTSyqCM2",
  "1rZihudH1HurUghaKWoG1ivyRfh": "1uecbCFnURw9JqR6I8EpRDnV8da",
  "1r79scSmqwANQrek1r3Z4XIhphD": "1uecbt0sDkGMMI9Pv5zyJg94hnN",
  "1wzzcR5jinaKmYK3pkmwXVEcSfF": "1uecbyow0tcxbogujEzfZQ7WIwf",
  "1axJesPakkAmZQYeJNV1YaA6OSB": "1uecc8dlr9jDnXUGuApMliD8CWo",
  "1r7UKcx6mgRV4ThNvQkww9gIgLE": "1uyuxRSzWoUHbbWdaPaZ8iiRUZj",
  "1sWhcuNB78V0Hq3ebVuU7eQKvp2": "1xa1aT5qjJgWJF0tHfCMtwZ6Uwd",
  "1iS45271Gr8koRSzQ1qFvUkJN4u": "1uecbQw0aUTCnUf56JNRFYhKsSl",
  "1iUDrOIvGBZwji5SeKtVgNmG6UR": "1uecahgeDgRdzvFrEkW9iRBL92H",
  "1vfY3ANKH719QimtMOjVSDU4ZQ6": "1xZjGZ4elyRrxsr6bRw4mvWqPDs",
  "1sj3iELDQ0F34CPoMmUzldXJ7Ke": "1uecawYb9QCFWOuR41Hiz1laJAg",
  "1bALcjH3m0eO9jfX4F71QyuStmx": "1uecbmxhoXlLQGolAzATLTnrxvW",
  "1ppnSpbvT9C52DqLaq8lbzpJikD": "1uecc29nxM17SCZczT72atWxbhs",
  // "1tzWjOSACdJWG1HD7moq2UfP8xp": "1xaBTPqetwlmpnodvhjLW0qPZu5",
  "1bLaSZgS4UhGnggH4ZLdhmbgUlX": "1uecbpkMToY5dfsvcUUj3l5KBfo",
  "1hSapjIqPxW3S05UJHiLaq5NV1e": "1uecbQHeYO7DpUmdnD4WjZUOUqW",
  "1wXqNOaWh7qhD7c7glQR5B2w8GD": "1uecbFDCKHvmHerHCltvDNNFEW8",
  "1r6yexiIubbFVlYtYsHBilJwBNO": "1uecbaJeoeix4RQEKEHeaImicYU",
  "1fvJCilq5Pdd7VpqSDtZVwFrbdI": "1xa2mPIkTjqTGILt1ynHRmv2xlj",
  "1fyKcPMGLYuZGZkZJvIzvtwuMTQ": "1xa29rOqbAPrlac4Z3eGbZ9sxyL",
  "1bCf5oso6EOq2CraHVR8wLErnOu": "1xaKBxKxX5m3bXzQ7rqpBih4V7w",
  "1iF1tH9zAfc3KZ9OJzzBIl1VPia": "1uecajSwFTbwEYSZ2F6mklCbYc3",
  "1oKPaANYGM9w5rXV9DT9ait4VST": "1uecb8CKoQpR0mfnkQw2u1M6lei",
  "1lboP54BPHWgBzUDvL86nm2xfRU": "1uecbMtn24JpG4GrwrH3TCrAe4c",
  // "1rniAGANyePjs1eJskKgzbu4s2O": "1uecbcHzoA4EFnY8hxENFq1dWC3",
  "1oezI5OihLXxZwinVn4CjvPK1Cj": "1uecbblonXhAsoKEQJ0OwpuxDlt",
  "1s5u0SjDG5X3HcCbY24JQ5ykfrA": "1xaQlKL9qSslxTbXmsTQwYUZKhs",
  "1kp5NcAOv9jLcgbFSAo6RtFTIT8": "1uecbWlhCNFYobmMaL49xZ7rp1w",
  // "1vYC7S87j7n1UXJ3z2OOL73va2M": "1xZlf5nlExSYf5dg7YyXOTKSloz",
  "1qoFjAV3SKvqkgrEYvGGS0ykRSr": "1uecb1KoHxeab28BcDExwypi8uU",
  "1qIrt2ek3CWdD0UB0eCylmsb0fo": "1uecbFTLyJfXtTneFqRy7ShOilq",
  "1sLJB8J7DcfBeqjoHAwAKaprESF": "1uecbnZ1auyAq9qa702fgvYiWIG",
  "1htBITAbZb6oMHymeum7UF7xRzd": "1uecaaj2fdUA4VbMuhk7akkRxLd",
  "1agxJ5xwDFC6SUbIphLuArAWvTd": "1xa5o088OKWFkHhy1tGTAno99y1",
  "1o2mvdEPpuDYu3z6UeW0iHBMffG": "1uecayY1yudoMOlIx8SCcASyMbQ",
  "1lqNvXpqBebKtQo8ubnia9EA6d2": "1xaKVKIbsL1XX2P0vFOTqKG9gre",
  "1YiEU0JDDBOl2vtx3hhb31ErcLK": "1uecc7SaHD8TID68e2FqWc6QphC",
  "1YiEsLXzGLD8T1OL9Qhzwqgw9BQ": "1xa6MUAIjiw55KAjGLJkGtT3jDy",
  "1pDAWi760WAW96LLZTsbqFAuK08": "1uecahgeDgRdzvFrEkW9iRBL92H",
  "1fHddAUiVeBwp2SwZ0aG71X454q": "1uecaeOsMHcwnySPZbfjJYXpzpP",
  "1qKHF9493kAjn3vFS6sd5UiU4So": "1uecbgWFGi7rzVlPbuFQHAZXs1t",
  "1ozIswpvM4JH8lPE5yAI5Yz99j2": "1uecbNiYQJ5ViiQPJq5K2lpQUKY",
  "1t2jRrhAAzLvSkDKRuXCKVvQxDz": "1xZot4nuoRywXRmhp6TU63XWygQ",
  // "1rnjsQz08jABpD1BhcjkmaXVYVi": "1uecbcHzoA4EFnY8hxENFq1dWC3",
  "1kmfXuszsFEx0ftUiWOEK0BxnTy": "1uecbvhiuTfuo42M1fXDDSUqZpK",
  "1oF0VBga7kaflRVKrn2RxXANoZM": "1uecc2yTIXOTP1aYDA63r28YoVh",
  "1mLo6coVqlVcDRokgMNb2jnOHai": "1xaLy9zuSLZGBNe84x4RrbbHZoW",
  "1rTOdCvUsuwJbiE3KwXqRz2wRI9": "1uecbC6QXngLHWMGAwX9jezVyvN",
  "1bALgeqVdrYOpbV35q8OMW9SsyE": "1uecbmxhoXlLQGolAzATLTnrxvW",
  "1oFNxZpLJswwfL2X4mhD6Zcv1iT": "1uecc2Vs8dd415hK8E0MhihFrfH",
  "1huAXIynPf8kYgEwAddiC0aro46": "1uecaejuXoeDAYaZNlF9cVlahNL"
};
const versions = ["v0"];
const API_VERSION = "1";

const transformerMode = process.env.TRANSFORMER_MODE;

const startDestTransformer =
  transformerMode === "destination" || !transformerMode;
const startSourceTransformer = transformerMode === "source" || !transformerMode;
const networkMode = process.env.TRANSFORMER_NETWORK_MODE || true;

const router = new Router();

const isDirectory = source => {
  return lstatSync(source).isDirectory();
};

const getIntegrations = type =>
  readdirSync(type).filter(destName => isDirectory(`${type}/${destName}`));

const getDestHandler = (version, dest) => {
  if (DestHandlerMap.hasOwnProperty(dest)) {
    return require(`./${version}/destinations/${DestHandlerMap[dest]}/transform`);
  }
  return require(`./${version}/destinations/${dest}/transform`);
};

const getDestNetHander = (version, dest) => {
  const destination = _.toLower(dest);
  let destNetHandler = require(`./${version}/destinations/${destination}/nethandler`);
  if (!destNetHandler && !destNetHandler.sendData) {
    destNetHandler = require("./adapters/genericnethandler");
  }
  return destNetHandler;
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

const eventValidator = require("./util/eventValidation");
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

  const metaTags =
    events && events.length && events[0].metadata
      ? getMetadata(events[0].metadata)
      : {};
  const respList = [];
  await Promise.all(
    events.map(async event => {
      try {
        const parsedEvent = event;
        parsedEvent.request = { query: reqParams };
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
      parsedEvent.request = {query: reqParams};
      const hv = await eventValidator.handleValidation(parsedEvent);
      if (hv.dropEvent) {
        const errMessage = `Error occurred while validating because : ${hv.violationType}`
        respList.push({
          output: event.message,
          metadata: event.metadata,
          statusCode: 400,
          validationErrors: hv.validationErrors,
          errors: errMessage
        });
        stats.counter("hv_violation_type", 1, {
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
        stats.counter("hv_errors", 1, {
          ...metaTags
        });
      }
    } catch (error) {
      const errMessage = `Error occurred while validating : ${error}`
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
          event => event.metadata.destinationId + "_" + event.metadata.sourceId
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
                  }
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
                  finalResults[transformationVersionId]['fail'] = 1 + finalResults[transformationVersionId]['fail'];
                  if (!failedVersions.includes(transformationVersionId)) {
                    failedVersions.push(transformationVersionId)
                    fs.writeFileSync('./failedVersions.txt', failedVersions.length.toString() + '\n' + failedVersions.toString())
                  }

                  fs.writeFileSync(`./tout_${transformationVersionId}_${Date.now()%20}.txt`,
                    JSON.stringify(destTransformedEvents, null, 2) + '\n #### v1 ### \n' + JSON.stringify(destTransformedEventsNew, null, 2) 
                    + '\n#### Input ### \n' + JSON.stringify(destEvents, null, 2)
                  )
                } else {
                  logger.info('Successful Hit ', transformationVersionId)
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
              stats.timing(
                "user_transform_function_latency",
                userFuncStartTime,
                { transformationVersionId, processSessions, ...metaTags }
              );
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

async function handleDestinationNetwork(version, ctx) {
  const { destination } = ctx.request.body;
  const destNetHandler = getDestNetHander(version, destination);
  // flow should never reach the below (if) its a desperate fall-back
  if (!destNetHandler || !destNetHandler.sendData) {
    ctx.status = 404;
    ctx.body = `${destination} doesn't support transformer proxy`;
    return ctx.body;
  }
  const resp = await destNetHandler.sendData(ctx.request.body);
  ctx.body = { output: resp };
  return ctx.body;
}

if (networkMode) {
  versions.forEach(version => {
    router.post("/network/proxy", async ctx => {
      await handleDestinationNetwork(version, ctx);
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

