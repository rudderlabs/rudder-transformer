import {
  ErrorDetailer,
  RudderMessage,
  SourceTransformResponse
} from "../../types/index";
import { generateErrorObject } from "../../v0/util";
import ErrorReportingService from "../errorReporting.service";

export default class PostTransformationSourceService {
  public static handleFailureEventsSource(
    error: Object,
    errorDTO: ErrorDetailer
  ) {
    const errObj = generateErrorObject(
      error,
      errorDTO.integrationType,
      errorDTO.stage
    );
    ErrorReportingService.reportError(error, errObj, errorDTO);
    return {
      statusCode: errObj.status,
      error:
        errObj.message ||
        "[Source Transform] Error occurred while processing payload.",
      statTags: {
        ...errObj.statTags
      }
    } as SourceTransformResponse;
  }

  public static handleSuccessEventsSource(
    events: RudderMessage | RudderMessage[] | SourceTransformResponse
  ): SourceTransformResponse {
    if (Array.isArray(events)) {
      return { output: { batch: events } } as SourceTransformResponse;
    } else {
      // We send response back to the source
      // through outputToSource. This is not sent to gateway
      // We will not return array for events not meant for gateway
      if (Object.prototype.hasOwnProperty.call(events, "outputToSource")) {
        return events as SourceTransformResponse;
      }
      return { output: { batch: [events] } } as SourceTransformResponse;
    }
  }
}
