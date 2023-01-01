import {
  MetaTransferObject,
  RudderMessage,
  SourceTransformResponse
} from "../../types/index";
import { generateErrorObject } from "../../v0/util";
import ErrorReportingService from "../errorReporting";

export default class PostTransformationSourceService {
  public static handleFailureEventsSource(
    error: Object,
    metaTO: MetaTransferObject
  ): SourceTransformResponse {
    const errObj = generateErrorObject(error, metaTO.errorDetails);
    const response = {
      statusCode: errObj.status,
      error:
        errObj.message ||
        "[Source Transform] Error occurred while processing payload.",
      statTags: errObj.statTags
    } as SourceTransformResponse;
    ErrorReportingService.reportError(
      error,
      metaTO.errorDetails.context,
      response
    );
    return response;
  }

  public static handleSuccessEventsSource(
    events: RudderMessage | RudderMessage[] | SourceTransformResponse
  ): SourceTransformResponse {
    // We send response back to the source
    // through outputToSource. This is not sent to gateway
    // We will not return array for events not meant for gateway
    if (Object.prototype.hasOwnProperty.call(events, "outputToSource")) {
      return events as SourceTransformResponse;
    } else if (Array.isArray(events)) {
      return { output: { batch: events } } as SourceTransformResponse;
    } else {
      return { output: { batch: [events] } } as SourceTransformResponse;
    }
  }
}
