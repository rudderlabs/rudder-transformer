import { ObjectType, ProcessorRequest } from "../types/types";
import { MiscService } from "./misc.service";
import VanillaWorkflowService from "./vanillaWorkflow.service";
import CDKV1Service from "./cdkV1Workflow.service";
import CDKV2Service from "./cdkV2Workflow.service";

export class WorkFlowSelectorService {
  private static destHandlerMap: Map<string, any> = new Map();
  private static worflowServiceMap: Map<string, any> = new Map();

  public static fetchCachedWorkflows(workflowType: string) {
    let workflow: any;
    if (this.worflowServiceMap.has(workflowType)) {
      workflow = this.worflowServiceMap.get(workflowType);
    } else {
      switch (workflowType) {
        case "CDKV1":
          this.worflowServiceMap.set("CDKV1", new CDKV1Service());
          break;
        case "CDKV2":
          this.worflowServiceMap.set("CDKV2", new CDKV2Service());
          break;
        default:
          this.worflowServiceMap.set("Vanilla", new VanillaWorkflowService());
      }
      workflow = this.worflowServiceMap.get(workflowType);
    }
    return workflow;
  }

  public static getDestHandler(dest: string, version: string) {
    let destinationHandler: any;
    if (this.destHandlerMap.get(dest)) {
      destinationHandler = this.destHandlerMap.get(dest);
    } else {
      destinationHandler = MiscService.getDestHandler(dest, version);
      this.destHandlerMap.set(dest, destinationHandler);
    }
    return destinationHandler;
  }

  private static isCdkDestination(destinationDefinitionConfig: ObjectType) {
    return !!destinationDefinitionConfig?.["cdkEnabled"];
  }

  private static isCdkV2Destination(destinationDefinitionConfig: ObjectType) {
    return !!destinationDefinitionConfig?.["cdkV2Enabled"];
  }

  public static getTransformerWorkflow(events: ProcessorRequest[]) {
    const destinationDefinitionConfig: ObjectType =
      events[0].destination.DestinationDefinition.Config;
    if (this.isCdkDestination(destinationDefinitionConfig)) {
      return this.fetchCachedWorkflows("CDKV1");
    } else if (this.isCdkV2Destination(destinationDefinitionConfig)) {
      return this.fetchCachedWorkflows("CDKV2");
    } else {
      return this.fetchCachedWorkflows("Vanilla");
    }
  }
}
