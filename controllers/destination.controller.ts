import { Context } from "koa";
import { ProcessorRequest } from "../types/procRequestT";
import { OrchestratorService } from "../services/orchestrator.service";

export class DestinationController {
  public static async destinationVanillaTransformAtProcessor(ctx: Context) {
    const events = ctx.request.body as ProcessorRequest[];
    const { version, destination } = ctx.params;
    const reqParams = ctx.request.query;
    const respList = await OrchestratorService.processDestinationWorkflow(
      events,
      reqParams,
      destination,
      version
    );
    ctx.body = respList.flat();
    return ctx.body;
  }

  public async destinationVanillaTransformAtRouter(ctx: Context) {}
}
