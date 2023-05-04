import { MetaTransferObject, RudderMessage, SourceTransformationResponse } from '../../types/index';
import { generateErrorObject } from '../../v0/util';
import ErrorReportingService from '../errorReporting';

export default class PostTransformationSourceService {
  public static handleFailureEventsSource(
    error: Object,
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
  ): SourceTransformationResponse {
    // We send response back to the source
    // through outputToSource. This is not sent to gateway
    // We will not return array for events not meant for gateway
    if (Object.prototype.hasOwnProperty.call(events, 'outputToSource')) {
      return events as SourceTransformationResponse;
    } if (Array.isArray(events)) {
      return { output: { batch: events } } as SourceTransformationResponse;
    } 
      return { output: { batch: [events] } } as SourceTransformationResponse;
    
  }
}
