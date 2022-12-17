import { ErrorDetailer, ObjectType } from "../types/types";
import { client } from "../util/errorNotifier";

export default class ErrorReportingService {
  private static getCommonMetdata(dto: ErrorDetailer) {
    return {
      namespace: dto.serverRequestMetadata["namespace"] || "Unknown",
      cluster: dto.serverRequestMetadata["cluster"] || "Unknown"
    };
  }

  private static getRequestMetadata(dto: ErrorDetailer) {
    return {
      destType: dto.integrationType,
      destinationInfos: dto.destinationInfo,
      metadatas: dto.eventMetadatas,
      originalRequest: dto.inputPayload
    };
  }

  public static reportError(
    error: ObjectType,
    errorResp: Object,
    errorDTO: ErrorDetailer
  ) {
    client.notify(error, errorDTO.errorContext, {
      ...errorResp,
      ...this.getCommonMetdata(errorDTO),
      ...this.getRequestMetadata(errorDTO)
    });
  }
}
