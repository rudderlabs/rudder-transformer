import IDestination from '../../interfaces/Destination';
import {
  DeliveryResponse,
  Destination,
  ErrorDetailer,
  MetaTransferObject,
  Metadata,
  ProcessorTransformationRequest,
  RouterTransformationRequestData,
  RudderStackEvent,
  TransformationStage,
} from '../../types';
import { isDefinedAndNotNull } from '../../v0/util';
import { InstrumentationError } from '../../v0/util/errorTypes';
import tags from '../../v0/util/tags';
import DestinationPostTransformationService from '../../services/destination/postTransformation';

export default class ExecutorUtility {
  public static buildErrorResponses(
    implementation: IDestination,
    error: any,
    metadata: Metadata,
    destination: Destination,
    stage: TransformationStage,
  ) {
    const metaTO = {
      errorDetails: {
        destType: 'salesforce',
        module: tags.MODULES.DESTINATION,
        implementation: implementation.getImplementationName(),
        feature: stage,
        destinationId: destination.ID,
        workspaceId: destination.WorkspaceID,
      } as ErrorDetailer,
      errorContext: `[${implementation.getDestinationName()} implementation:${implementation.getImplementationName()}] Failure During Transformation`,
    } as MetaTransferObject;
    metaTO.metadata = metadata;
    const erroredResp =
      stage === 'router'
        ? DestinationPostTransformationService.handleRouterTransformFailureEvents(error, metaTO)
        : DestinationPostTransformationService.handleProcessorTransformFailureEvents(error, metaTO);
    return erroredResp;
  }

  public static async executeTransformation(
    implementation: IDestination,
    inputs: (ProcessorTransformationRequest | RouterTransformationRequestData)[],
    stage: TransformationStage,
  ) {
    const commonContext = implementation.generateCommonContext();
    const transformedPayloads = await Promise.all(
      inputs.map((input: ProcessorTransformationRequest | RouterTransformationRequestData) => {
        const {
          message,
          destination,
          metadata,
        }: { message: RudderStackEvent; destination: Destination; metadata: Metadata } = input;

        try {
          let transformedPayload: Object;
          implementation.validate(message, destination);
          switch (message.type) {
            case 'track':
              transformedPayload = implementation.onTrack(
                message,
                metadata,
                destination,
                commonContext,
              );
              break;
            case 'identify':
              transformedPayload = implementation.onIdentify(
                message,
                metadata,
                destination,
                commonContext,
              );
              break;
            case 'page':
              transformedPayload = implementation.onPage(
                message,
                metadata,
                destination,
                commonContext,
              );
              break;
            case 'screen':
              transformedPayload = implementation.onScreen(
                message,
                metadata,
                destination,
                commonContext,
              );
              break;
            case 'group':
              transformedPayload = implementation.onGroup(
                message,
                metadata,
                destination,
                commonContext,
              );
              break;
            case 'alias':
              transformedPayload = implementation.onAlias(
                message,
                metadata,
                destination,
                commonContext,
              );
              break;
            default:
              throw new InstrumentationError('Invalid message type');
          }
          return { transformedPayload, metadata, destination };
        } catch (error: any) {
          return { error, metadata, destination };
        }
      }),
    );
    const failedEvents = transformedPayloads.filter(
      (payload) => !isDefinedAndNotNull(payload.transformedPayload),
    ) as unknown as { error: object; metadata: Metadata; destination: Destination }[];

    const erroredResponses = failedEvents.map((failedEvent) =>
      ExecutorUtility.buildErrorResponses(
        implementation,
        failedEvent.error,
        failedEvent.metadata,
        failedEvent.destination,
        stage,
      ),
    );

    const succededEvents = transformedPayloads.filter((payload) =>
      isDefinedAndNotNull(payload.transformedPayload),
    ) as unknown as {
      transformedPayload: any;
      metadata: Metadata;
      destination: Destination;
    }[];

    let eventsToEnrich: { transformedPayload: any; metadata: Metadata; destination: Destination }[];

    if (implementation.supportsBatching) {
      eventsToEnrich = implementation.batch(succededEvents, commonContext);
    } else {
      eventsToEnrich = succededEvents;
    }

    const finalResponses = eventsToEnrich.map((eventToEnrich) =>
      implementation.enrichForDelivery(
        eventToEnrich.transformedPayload,
        eventToEnrich.metadata,
        eventToEnrich.destination,
        commonContext,
        stage,
      ),
    );
    return finalResponses.concat(erroredResponses);
  }

  
}
