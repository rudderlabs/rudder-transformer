import {
  MetaTransferObject,
  RudderMessage,
  SourceTransformationResponse,
  SourceTransformationSuccessResponse,
  CatchErr,
} from '../../types';
import { CommonUtils } from '../../util/common';
import { generateErrorObject } from '../../v0/util';
import { ErrorReportingService } from '../errorReporting';

export class SourcePostTransformationService {
  public static handleFailureEventsSource(
    error: CatchErr,
    metaTO: MetaTransferObject,
  ): SourceTransformationResponse {
    const errObj = generateErrorObject(error, metaTO.errorDetails);
    const response = {
      statusCode: errObj.status,
      error: errObj.message || '[Source Transform] Error occurred while processing payload.',
      statTags: errObj.statTags,
    } as SourceTransformationResponse;
    ErrorReportingService.reportError(error, metaTO.errorContext, response);
    return response;
  }

  public static handleSuccessEventsSource(
    events: RudderMessage | RudderMessage[] | SourceTransformationResponse,
    context: { headers?: Record<string, string> },
  ): SourceTransformationResponse {
    // We send response back to the source
    // through outputToSource. This is not sent to gateway
    // We will not return array for events not meant for gateway
    let sourceTransformationResponse = events as SourceTransformationSuccessResponse;
    if (!Object.prototype.hasOwnProperty.call(events, 'outputToSource')) {
      const eventsBatch = CommonUtils.toArray(events);
      sourceTransformationResponse = {
        output: { batch: eventsBatch },
      } as SourceTransformationSuccessResponse;
    }

    if (sourceTransformationResponse.output) {
      sourceTransformationResponse.output.batch.forEach((event) => {
        const newEvent = event as RudderMessage;
        newEvent.context = { ...event.context, ...context };
      });
    }
    return sourceTransformationResponse;
  }
}
