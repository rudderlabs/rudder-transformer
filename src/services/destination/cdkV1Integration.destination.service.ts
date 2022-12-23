import { ConfigFactory, Executor } from "rudder-transformer-cdk";
import IntegrationDestinationService from "../../interfaces/IntegrationDestinationService";
import {
  DeliveryResponse,
  MetaTransferObject,
  ProcessorRequest,
  ProcessorResponse,
  RouterRequestData,
  RouterResponse,
  TransformedEvent
} from "../../types/index";
import { TransformationError } from "../../v0/util/errorTypes";
import tags from "../../v0/util/tags";
import PostTransformationServiceDestination from "./postTransformation.destination.service";

export default class CDKV1DestinationService
  implements IntegrationDestinationService {
  public async processorRoutine(
    events: ProcessorRequest[],
    destinationType: string,
    destHandler: any,
    requestMetadata: Object
  ): Promise<ProcessorResponse[]> {
    const tfConfig = await ConfigFactory.getConfig(destinationType);
    const respList: ProcessorResponse[] = await Promise.all<any>(
      events.map(async event => {
        try {
          let transformedPayloads: any = await Executor.execute(
            event as any,
            tfConfig
          );
          return PostTransformationServiceDestination.handleSuccessEventsAtProcessorDest(
            event,
            transformedPayloads,
            destHandler
          );
        } catch (error) {
          let metaTO: MetaTransferObject;
          metaTO.errorDetails = {
            destType: destinationType.toUpperCase(),
            module: tags.MODULES.DESTINATION,
            implementation: tags.IMPLEMENTATIONS.CDK_V1,
            feature: tags.FEATURES.PROCESSOR,
            destinationId: event.metadata.destinationId,
            workspaceId: event.metadata.workspaceId,
            context:
              "[CDKV1 Integration Service] Failure During Processor Transform"
          };
          metaTO.metadata = event.metadata;
          return PostTransformationServiceDestination.handleFailedEventsAtProcessorDest(
            error,
            metaTO
          );
        }
      })
    );
    return respList;
  }

  public routerRoutine(
    _events: RouterRequestData[],
    _destinationType: string,
    _destHandler: string,
    _requestMetadata: Object
  ): Promise<RouterResponse[]> {
    throw new TransformationError(
      "CDKV1 Does not Implement Router Transform Routine"
    );
  }

  public batchRoutine(
    _events: RouterRequestData[],
    _destinationType: string,
    _destHandler: any,
    _requestMetadata: Object
  ) {
    throw new TransformationError(
      "CDKV1 Does not Implement Batch Transform Routine"
    );
  }

  public deliveryRoutine(
    _event: TransformedEvent,
    _destinationType: string,
    _networkHandler: any,
    _requestMetadata: Object
  ): Promise<DeliveryResponse> {
    throw new TransformationError("CDV1 Does not Implement Delivery Routine");
  }
}
