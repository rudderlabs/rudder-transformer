import IDestination from '../../../../../interfaces/Destination';
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
} from '../../../../../types';
import { InstrumentationError } from '../../../../../v0/util/errorTypes';

export default class NativeSalesforceStreamingImpl implements IDestination {
  name: string;

  supportsBatching: boolean;

  constructor() {
    this.name = 'Salesforce';
    this.supportsBatching = false;
  }

  getImplementationName(): string {
    return 'cdk(native)';
  }

  getDestinationName(): string {
    return this.name;
  }

  generateCommonContext() {
    // implement this
  }

  isBatchingSupported(): boolean {
    return this.supportsBatching;
  }

  validate(request: RudderStackEvent): void {
    // implement this with basic validation
  }

  onIdentify(event: RudderStackEvent, commonContext: any): any {
    // implement this
  }

  onTrack(event: RudderStackEvent, commonContext: any): any {
    throw new InstrumentationError('Salesforce destination does not support track events');
  }

  onScreen(event: RudderStackEvent, commonContext: any): any {
    throw new InstrumentationError('Salesforce destination does not support screen events');
  }

  onPage(event: RudderStackEvent, commonContext: any): any {
    throw new InstrumentationError('Salesforce destination does not support page events');
  }

  onGroup(event: RudderStackEvent, commonContext: any): any {
    throw new InstrumentationError('Salesforce destination does not support group events');
  }

  onAlias(event: RudderStackEvent, commonContext: any): any {
    // implement this
  }

  onDelete(event: RudderStackEvent, commonContext: any): any {
    throw new InstrumentationError('Salesforce destination does not support group events');
  }

  batch(
    inputs: {
      transformedPayload: any;
      metadata: Metadata;
      destination: Destination;
    }[],
    commonContext: any,
  ): { transformedPayload: any; metadata: Metadata; destination: Destination }[] {
    // implement this
    return [] as any;
  }

  enrichForDelivery(
    transformedEvent: any,
    metadata: Metadata,
    destination: Destination,
    stage: TransformationStage,
  ): ProcessorTransformationResponse | RouterTransformationResponse {
    // implement this
    return {} as any;
  }

  deliver(transformedEvent: TransformedOutput): Promise<DeliveryResponse> {
    // implement this
    return {} as any;
  }

  delete(userDeletionRequest:UserDeletionRequest): Promise<UserDeletionResponse> {
    // implement this
    return {} as any;
  }
}
