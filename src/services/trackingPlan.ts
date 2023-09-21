import logger from '../logger';
import { RetryRequestError, RespStatusError, constructValidationErrors } from '../util/utils';
import { getMetadata } from '../v0/util';
import eventValidator from '../util/eventValidation';
import stats from '../util/stats';

export default class TrackingPlanservice {
  public static async validateTrackingPlan(events, requestSize, reqParams) {
    const requestStartTime = new Date();
    const respList: any[] = [];
    const metaTags = events[0].metadata ? getMetadata(events[0].metadata) : {};
    let ctxStatusCode = 200;

    for (let i = 0; i < events.length; i++) {
      const event = events[i];
      const eventStartTime = new Date();
      try {
        const parsedEvent = event;
        parsedEvent.request = { query: reqParams };
        const hv = await eventValidator.handleValidation(parsedEvent);
        if (hv['dropEvent']) {
          respList.push({
            output: event.message,
            metadata: event.metadata,
            statusCode: 400,
            validationErrors: hv['validationErrors'],
            error: JSON.stringify(constructValidationErrors(hv['validationErrors'])),
          });
          stats.counter('tp_violation_type', 1, {
            violationType: hv['violationType'],
            ...metaTags,
          });
        } else {
          respList.push({
            output: event.message,
            metadata: event.metadata,
            statusCode: 200,
            validationErrors: hv['validationErrors'],
            error: JSON.stringify(constructValidationErrors(hv['validationErrors'])),
          });
          stats.counter('tp_propagated_events', 1, {
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
        stats.counter('tp_errors', 1, {
          ...metaTags,
          workspaceId: event.metadata?.workspaceId,
          trackingPlanId: event.metadata?.trackingPlanId,
        });
      } finally {
        stats.timing('tp_event_latency', eventStartTime, {
          ...metaTags,
        });
      }
    }

    stats.counter('tp_events_count', events.length, {
      ...metaTags,
    });

    stats.histogram('tp_request_size', requestSize, {
      ...metaTags,
    });

    stats.timing('tp_request_latency', requestStartTime, {
      ...metaTags,
      workspaceId: events[0]?.metadata?.workspaceId,
      trackingPlanId: events[0]?.metadata?.trackingPlanId,
    });

    return { body: respList, status: ctxStatusCode };
  }
}
