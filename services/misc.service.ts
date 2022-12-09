import { Context } from "koa";
import { DestHandlerMap } from "../constants/destinationCanonicalNames";
import { API_VERSION } from "../routes/utils/constants";
export class MiscService {
  public static getDestHandler(dest: string, version: string) {
    if (DestHandlerMap.hasOwnProperty(dest)) {
      return require(`../${version}/destinations/${DestHandlerMap[dest]}/transform`);
    }
    return require(`../${version}/destinations/${dest}/transform`);
  }

  public static getRequestMetadata(ctx: Context) {
    // TODO: Parse information such as
    // cluster, namespace, etc information
    // from the request
    return {
      namespace: "Unknown",
      cluster: "Unknown"
    };
  }

  public static transformerPostProcessor(ctx: Context) {
    ctx.set("apiVersion", API_VERSION);
  }
}
