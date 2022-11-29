import {
  Metadata,
  ProcessorRequest,
  ProcessorResponse,
  RouterData,
  RouterResponse,
  TransformationDefaultResponse
} from "../types/types";

export default interface IWorkFlow {
  processorWorkflow(
    events: ProcessorRequest[],
    destinationType: string,
    destHandler: any
  ): Promise<ProcessorResponse[]>;

  routerWorkflow(
    events: RouterData[],
    destinationType: string,
    destHandler: any
  ): Promise<RouterResponse[]>;

  batchWorkflow(
    events: RouterData[],
    destinationType: string,
    destHandler: any
  ): any

  proxyWorkflow(
    event: TransformationDefaultResponse,
    metadata: Metadata,
    destinationType: string,
    networkHandler: any
  ): any
}
