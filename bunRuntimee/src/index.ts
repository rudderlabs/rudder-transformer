import { Elysia } from "elysia";
const eventValidator = require('../../src/util/eventValidation');
const stats = require('../../src/util/stats');
const logger = require('../../src/logger');
const {constructValidationErrors, RetryRequestError, RespStatusError} = require('../../src/util/utils');

const app = new Elysia().get("/", () => "Hello Elysia");

const API_VERSION = '2';

app.get("/health", () => "OK");

const getMetadata = (metadata) => ({
  sourceType: metadata.sourceType,
  destinationType: metadata.destinationType,
  k8_namespace: metadata.namespace,
});

const sendViolationMetrics = (validationErrors, dropped, metaTags) => {
  const vTags = {
    'Unplanned-Event': 0,
    'Additional-Properties': 0,
    'Datatype-Mismatch': 0,
    'Required-Missing': 0,
    'Unknown-Violation': 0,
  };

  validationErrors.forEach((error) => {
    vTags[error.type] += 1;
  });

  Object.entries(vTags).forEach(([key, value]) => {
    if (value > 0) {
      stats.counter('hv_metrics', value, { ...metaTags, dropped, violationType: key });
    }
  });
  stats.counter('hv_metrics', validationErrors.length, {
    ...metaTags,
    dropped,
    violationType: 'Total',
  });
};


async function handleValidation(ctx) {
  const requestStartTime = new Date();
  const events = ctx.body;
  // console.log(events)
  const requestSize = Number(ctx.request.headers.get('content-length'));
  const reqParams = ctx.request.query;
  const respList: any = [];
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
        respList.push({
          output: event.message,
          metadata: event.metadata,
          statusCode: 400,
          validationErrors: hv.validationErrors,
          error: JSON.stringify(constructValidationErrors(hv.validationErrors)),
        });
        stats.counter('hv_violation_type', 1, {
          violationType: hv.violationType,
          ...metaTags,
        });
      } else {
        respList.push({
          output: event.message,
          metadata: event.metadata,
          statusCode: 200,
          validationErrors: hv.validationErrors,
          error: JSON.stringify(constructValidationErrors(hv.validationErrors)),
        });
        stats.counter('hv_propagated_events', 1, {
          ...metaTags,
        });
      }
    } catch (error: any) {
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
      stats.counter('hv_errors', 1, {
        ...metaTags,
      });
    } finally {
      stats.timing('hv_event_latency', eventStartTime, {
        ...metaTags,
      });
    }
  }

  // console.log(respList)
  // console.log(ctx)
  ctx.body = respList;
  ctx.status = ctxStatusCode;
  // console.log(ctx);
  // ctx.set('apiVersion', API_VERSION);

  stats.counter('hv_events_count', events.length, {
    ...metaTags,
  });
  stats.histogram('hv_request_size', requestSize, {
    ...metaTags,
  });
  stats.timing('hv_request_latency', requestStartTime, {
    ...metaTags,
  });
  return respList;
}

app.post("/v0/validate",async (ctx) => {
  return await handleValidation(ctx);
} );

app.listen(9091);

console.log(
  `🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`
);
