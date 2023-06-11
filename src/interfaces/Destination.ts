import { AnywhereConfiguration } from 'aws-sdk/clients/gamelift';
import {
  DeliveryResponse,
  Destination,
  Metadata,
  ProcessorTransformationResponse,
  RouterTransformationResponse,
  RudderStackEvent,
  TransformationStage,
  TransformedOutput,
  UserDeletionRequest,
  UserDeletionResponse,
} from '../types';

export default interface IDestination {
  name: string;
  supportsBatching: boolean;

  getDestinationName(): string;
  getImplementationName(): string;
  generateCommonContext(): any;

  validate(event: RudderStackEvent, destination: Destination): void;
  onTrack(
    event: RudderStackEvent,
    metadata: Metadata,
    destination: Destination,
    commonContext: any,
  ): any;
  onScreen(
    event: RudderStackEvent,
    metadata: Metadata,
    destination: Destination,
    commonContext: any,
  ): any;
  onPage(
    event: RudderStackEvent,
    metadata: Metadata,
    destination: Destination,
    commonContext: any,
  ): any;
  onIdentify(
    event: RudderStackEvent,
    metadata: Metadata,
    destination: Destination,
    commonContext: any,
  ): AnywhereConfiguration;
  onGroup(
    event: RudderStackEvent,
    metadata: Metadata,
    destination: Destination,
    commonContext: any,
  ): any;
  onAlias(
    event: RudderStackEvent,
    metadata: Metadata,
    destination: Destination,
    commonContext: any,
  ): any;
  batch(
    inputs: {
      transformedPayload: any;
      metadata: Metadata;
      destination: Destination;
    }[],
    commonContext: any,
  ): { transformedPayload: any; metadata: Metadata; destination: Destination }[];
  enrichForDelivery(
    transformedEvent: any,
    metadata: Metadata,
    destination: Destination,
    commonContext: any,
    stage: TransformationStage,
  ): ProcessorTransformationResponse | RouterTransformationResponse;

  deliver(transformedEvent: TransformedOutput): Promise<DeliveryResponse>;

  delete(userDeletionRequest:UserDeletionRequest): Promise<UserDeletionResponse>;
  }