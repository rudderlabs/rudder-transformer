import { Context } from "koa";
import MiscService from "../services/misc.service";
import { ServiceSelector } from "../util/serviceSelector";
import ControllerUtility from "./util";
import logger from "../logger";
import TaggingService from "../services/tagging.service";
import PostTransformationServiceSource from "../services/source/postTransformation.source";

export default class SourceController {
  public static async sourceTransform(ctx: Context) {
    logger.debug(
      "Native(Source-Transform):: Request to transformer::",
      JSON.stringify(ctx.request.body)
    );
    let requestMetadata = MiscService.getRequestMetadata(ctx);
    const events = ctx.request.body as Object[];
    const { version, source }: { version: string; source: string } = ctx.params;
    try {
      const integrationService = ServiceSelector.getNativeIntegrationServiceSource();
      const resplist = await integrationService.sourceTransformRoutine(
        events,
        source,
        version,
        requestMetadata
      );
      ctx.body = resplist;
    } catch (err) {
      const metaTO = TaggingService.getNativeSourceTransformTags();
      const resp = PostTransformationServiceSource.handleFailureEventsSource(
        err,
        metaTO
      );
      ctx.body = [resp];
    }
    ControllerUtility.postProcess(ctx);
    logger.debug(
      "Native(Source-Transform):: Response from transformer::",
      JSON.stringify(ctx.body)
    );
    return ctx;
  }
}
