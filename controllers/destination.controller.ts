import { Context } from "koa";
import { ProcessorRequest } from "../types/types";
import { WorkFlowSelectorService } from "../services/worflowSelector.service";
import IWorkFlow from "../services/IWorkFlow";

export class DestinationController {
  public static async destinationVanillaTransformAtProcessor(ctx: Context) {
    const events = ctx.request.body as ProcessorRequest[];
    const { version, destination } = ctx.params;
    const reqParams = ctx.request.query;
    const destinationHandler = WorkFlowSelectorService.getDestHandler(
      destination,
      version
    );
    const workFlowService: IWorkFlow = WorkFlowSelectorService.getTransformerWorkflow(
      events
    );
    const resplist = await workFlowService.processorWorkflow(events, destination, destinationHandler);
    ctx.body = resplist.flat();
    return ctx.body;
  }

  public async destinationVanillaTransformAtRouter(ctx: Context) {}
}
