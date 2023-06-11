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
import { InstrumentationError, TransformationError } from '../../../../../v0/util/errorTypes';

export default class CDKSalesforceRetlImpl implements IDestination {
  name: string;

  supportsBatching: boolean;

  constructor() {
    this.name = 'Salesforce';
    this.supportsBatching = false;
  }

  getImplementationName(): string {
    return 'cdk(retl)';
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
    throw new TransformationError('Salesforce destination does not support CDK implementation');
  }

  onIdentify(event: RudderStackEvent, commonContext: any): any {
    // implement this
    throw new TransformationError('Salesforce destination does not support CDK implementation');
  }

  onTrack(event: RudderStackEvent, commonContext: any): any {
    throw new TransformationError('Salesforce destination does not support CDK implementation');
  }

  onScreen(event: RudderStackEvent, commonContext: any): any {
    throw new TransformationError('Salesforce destination does not support CDK implementation');
  }

  onPage(event: RudderStackEvent, commonContext: any): any {
    throw new TransformationError('Salesforce destination does not support CDK implementation');
  }

  onGroup(event: RudderStackEvent, commonContext: any): any {
    throw new TransformationError('Salesforce destination does not support CDK implementation');
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
    throw new TransformationError('Salesforce destination does not support CDK implementation');
  }

  enrichForDelivery(
    transformedEvent: any,
    metadata: Metadata,
    destination: Destination,
    stage: TransformationStage,
  ): ProcessorTransformationResponse | RouterTransformationResponse {
    // implement this
    throw new TransformationError('Salesforce destination does not support CDK implementation');
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
