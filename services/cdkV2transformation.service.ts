import { processCdkV2Workflow } from "../cdk/v2/handler";
import { ProcessorRequest } from "../types/procRequestT";


export class CDKV2Service {
  public static async processCdkV2Workflow(
    destination: string,
    event: ProcessorRequest,
    flowType: string
  ) {
    const respEvents = await processCdkV2Workflow(destination, event, flowType);
    return respEvents;
  }
}
