import logger from '../logger';
import { RetryRequestError, RespStatusError, constructValidationErrors } from '../util/utils';
import { getMetadata } from '../v0/util';
import eventValidator from '../util/eventValidation';
import stats from '../util/stats';

export default class TrackingPlanservice {
  /**
   * validate takes in events as argument and iterates over the events
   * validating them using the tracking 
   * @param events 
   * @param requestSize 
   * @param reqParams 
   * @returns 
   */
  public static async validate(events, requestSize, reqParams) {
    const requestStartTime = new Date();
    const validatedEvents: any[] = [];
    const metaTags = events[0].metadata ? getMetadata(events[0].metadata) : {};
    let ctxStatusCode = 200;


    events.forEach(async (event) => {
      let errorReport;
      let exception = false;

      try {
        const parsedEvent = event;
        parsedEvent.request = { query: reqParams };
        const failure = await eventValidator.handleValidation(parsedEvent);

        failure['dropEvent'] ? 
        errorReport = {
          statusCode: 400,
          validationErrors: failure['validationErrors'],
          error: JSON.stringify(constructValidationErrors(failure['validationErrors'])),
          violationType: failure['violationType'],
        }:
        errorReport = {
          statusCode: 200,
          validationErrors: failure['validationErrors'],
          error: JSON.stringify(constructValidationErrors(failure['validationErrors'])),
        };

      } catch (error) {
        exception = true;

        const errMessage = `Error occurred while validating : ${error}`;
        logger.error(errMessage);

        let status = 200;
        if (error instanceof RetryRequestError) {
          ctxStatusCode = error.statusCode;
        }
        if (error instanceof RespStatusError) {
          status = error.statusCode;
        }

        errorReport = {
          statusCode: status,
          validationErrors: [],
          error: errMessage,
        }
      }

      // stat which is fired per tp event validation level
      // containing labels which allows us to identify the information
      // at each stage.
      stats.counter('tp_event_validation', 1, {
        ...metaTags,
        workspaceId: event.metadata?.workspaceId,
        trackingPlanId: event.metadata?.trackingPlanId,
        status: errorReport?.status,
        violationType: errorReport.violationType ? errorReport.violationType : '',
        exception: exception,
      });

      // push validated event into final return which contains error report
      // for the validation and output along with metadata.
      validatedEvents.push({
        output: event.message,
        meatdata: event.metadata,
        ...errorReport,
      });

    });

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

    return { body: validatedEvents, status: ctxStatusCode };
  }
}
