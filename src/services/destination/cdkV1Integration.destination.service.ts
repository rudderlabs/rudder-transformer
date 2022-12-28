import { ConfigFactory, Executor } from "rudder-transformer-cdk";
import IntegrationDestinationService from "../../interfaces/IntegrationDestinationService";
import {
  DeliveryResponse,
  ProcessorRequest,
  ProcessorResponse,
  RouterRequestData,
  RouterResponse,
  TransformedEvent
} from "../../types/index";
import { TransformationError } from "../../v0/util/errorTypes";
import TaggingService from "../tagging.service";
import PostTransformationServiceDestination from "./postTransformation.destination.service";

export default class CDKV1DestinationService
  implements IntegrationDestinationService {
  public async processorRoutine(
    events: ProcessorRequest[],
    destinationType: string,
    _version: string,
    _requestMetadata: Object
  ): Promise<ProcessorResponse[]> {
    const tfConfig = await ConfigFactory.getConfig(destinationType);
    const respList: ProcessorResponse[][] = await Promise.all(
      events.map(async event => {
        try {
          let transformedPayloads: any = await Executor.execute(
            event as any,
            tfConfig
          );
          // We are not passing destinationHandler to post processor as we don't have post processing in CDK flows
          return PostTransformationServiceDestination.handleSuccessEventsAtProcessorDest(
            event,
            transformedPayloads,
            undefined
          );
        } catch (error) {
          const metaTO = TaggingService.getCDKV1ProcTransformTags(
            destinationType,
            event.metadata.destinationId,
            event.metadata.workspaceId
          );
          metaTO.metadata = event.metadata;
          const erroredResp = PostTransformationServiceDestination.handleFailedEventsAtProcessorDest(
            error,
            metaTO
          );
          return [erroredResp];
        }
      })
    );
    return respList.flat();
  }

  public routerRoutine(
    _events: RouterRequestData[],
    _destinationType: string,
    _version: string,
    _requestMetadata: Object
  ): Promise<RouterResponse[]> {
    throw new TransformationError(
      "CDKV1 Does not Implement Router Transform Routine"
    );
  }

  public batchRoutine(
    _events: RouterRequestData[],
    _destinationType: string,
    _version: any,
    _requestMetadata: Object
  ): RouterResponse[] {
    throw new TransformationError(
      "CDKV1 Does not Implement Batch Transform Routine"
    );
  }

  public deliveryRoutine(
    _event: TransformedEvent,
    _destinationType: string,
    _requestMetadata: Object
  ): Promise<DeliveryResponse> {
    throw new TransformationError("CDV1 Does not Implement Delivery Routine");
  }
}
