import logger from '../logger';
import { RetryRequestError, RespStatusError, constructValidationErrors } from '../util/utils';
import { getMetadata, getTrackingPlanMetadata } from '../v0/util';
import eventValidator from '../util/eventValidation';
import stats from '../util/stats';
import { HTTP_STATUS_CODES } from '../v0/util/constant';

export class TrackingPlanservice {
  public static async validate(events, requestSize, reqParams) {
    const startTime = Date.now();
    const respList: any[] = [];
    const metaTags = events.length && events[0].metadata ? getMetadata(events[0].metadata) : {};
    const tpTags: any =
      events.length && events[0].metadata ? getTrackingPlanMetadata(events[0].metadata) : {};
    let ctxStatusCode = 200;

    for (let i = 0; i < events.length; i++) {
      let eventValidationResponse: any;
      let exceptionOccured = false;
      const eventStartTime = Date.now();
      const event = events[i];

      try {
        event.request = { query: reqParams };
        const validatedEvent = await eventValidator.handleValidation(event);
        eventValidationResponse = {
          output: event.message,
          metadata: event.metadata,
          statusCode: validatedEvent['dropEvent']
            ? HTTP_STATUS_CODES.BAD_REQUEST
            : HTTP_STATUS_CODES.OK,
          validationErrors: validatedEvent['validationErrors'],
          error: JSON.stringify(constructValidationErrors(validatedEvent['validationErrors'])),
        };
      } catch (error: any) {
        logger.debug(
          `Error occurred while validating event`,
          'event',
          `${event.message?.event}::${event.message?.type}`,
          'trackingPlan',
          `${tpTags?.trackingPlanId}`,
          'error',
          error.message,
        );

        exceptionOccured = true;
        // no need to process further if
        // we have error of retry request error
        if (error instanceof RetryRequestError) {
          ctxStatusCode = error.statusCode;
          break;
        }

        eventValidationResponse = {
          output: event.message,
          metadata: event.metadata,
          statusCode: error instanceof RespStatusError ? error.statusCode : HTTP_STATUS_CODES.OK,
          validationErrors: [],
          error: `Error occurred while validating: ${error}`,
        };
      } finally {
        // finally on every event, we need to
        // capture the information related to the validates event
        stats.timing('tp_event_validation_latency', eventStartTime, {
          ...metaTags,
          ...tpTags,
          status: eventValidationResponse.statusCode,
          exception: exceptionOccured,
        });
      }

      respList.push(eventValidationResponse);
    }

    stats.histogram('tp_batch_size', requestSize, {
      ...metaTags,
      ...tpTags,
    });

    // capture overall function latency
    // with metadata tags
    stats.histogram('tp_batch_validation_latency', (Date.now() - startTime) / 1000, {
      ...metaTags,
      ...tpTags,
    });

    return { body: respList, status: ctxStatusCode };
  }
}
