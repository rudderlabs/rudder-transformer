import { Context } from "koa";
import { MiscService } from "../services/misc.service";
import { ObjectType } from "../types/types";
import { ServiceSelector } from "../util/serviceSelector";

export default class SourceController {
  public static async sourceTransform(ctx: Context) {
    let requestMetadata = MiscService.getRequestMetadata(ctx);
    const events = ctx.request.body as ObjectType[];
    const { version, source }: { version: string; source: string } = ctx.params;
    const integrationService = ServiceSelector.getNativeIntegrationServiceSource();
    const sourceHandler = ServiceSelector.getSourceHandler(source, version);
    const resplist = await integrationService.sourceTransformRoutine(
      events,
      source,
      sourceHandler,
      requestMetadata
    );
    ctx.body = resplist;
    MiscService.transformerPostProcessor(ctx);
    return ctx;
  }
}
