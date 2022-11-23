import { ConfigFactory, Executor } from "rudder-transformer-cdk";
import { ProcessorRequest } from "../types/procRequestT";

export class CDKV1Service {
  public static async processCdkV1Workflow(
    destination: string,
    event: ProcessorRequest
  ) {
    const tfConfig = await ConfigFactory.getConfig(destination);
    const respEvents = await Executor.execute(event as any, tfConfig);
    return respEvents;
  }
}
