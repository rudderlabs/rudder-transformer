import { client } from "../util/errorNotifier";
import { isCdkV2Destination } from "../cdk/v2/utils";
import { isCdkDestination } from "../v0/util";
import { DestHandlerMap } from "../constants/destinationCanonicalNames";

export class MiscService {
  public static getDestHandler(dest: string, version: string) {
    if (DestHandlerMap.hasOwnProperty(dest)) {
      return require(`../${version}/destinations/${DestHandlerMap[dest]}/transform`);
    }
    return require(`../${version}/destinations/${dest}/transform`);
  }

  public static bugSnagNotify(
    resp: any,
    error: any,
    event: any,
    destination: any
  ) {
    const getCommonMetadata = (metadata: any) => {
      // TODO: Parse information such as
      // cluster, namespace, etc information
      // from the request
      return {
        namespace: "Unknown",
        cluster: "Unknown"
      };
    };

    const getReqMetadata = (event: any) => {
      try {
        return {
          destType: destination,
          destinationId: event?.destination?.ID,
          destName: event?.destination?.Name,
          metadata: event?.metadata
        };
      } catch (error) {
        // Do nothing
      }
      return {};
    };

    let errCtx = "Destination Transformation";
    if (isCdkV2Destination(event)) {
      errCtx = `CDK V2 - ${errCtx}`;
    } else if (isCdkDestination(event)) {
      errCtx = `CDK - ${errCtx}`;
    }

    client.notify(error, errCtx, {
      ...resp,
      ...getCommonMetadata(event.metadata),
      ...getReqMetadata(event)
    });
  }
}
