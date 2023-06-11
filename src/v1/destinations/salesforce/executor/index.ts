import fs from 'fs';
import IDestination from '../../../../interfaces/Destination';
import NativeSalesforceStreamingImpl from '../implementation/streaming/native';
import NativeSalesforceRetlImpl from '../implementation/retl/native';
import CDKSalesforceStreamingImpl from '../implementation/streaming/cdk';
import CDKSalesforceRetlImpl from '../implementation/retl/cdk';
import AdapterUtility from '../../../util/executorUtil';
import {
  DeliveryResponse,
  ProcessorTransformationRequest,
  ProcessorTransformationResponse,
  RouterTransformationRequestData,
  RouterTransformationResponse,
  TransformationStage,
  TransformedOutput,
  UserDeletionRequest,
  UserDeletionResponse,
} from '../../../../types';
import Executor from '../../../../interfaces/Executor';

export default class SalesforceExecutor implements Executor {
  streamingImplementation: IDestination;

  retlImplementation: IDestination;

  // add constructor
  constructor() {
    this.streamingImplementation = new NativeSalesforceStreamingImpl();
    this.retlImplementation = new NativeSalesforceRetlImpl();
    this.setImplementationState();
  }

  getStreamingImplementationState() {
    return this.streamingImplementation;
  }

  getRetlImplementationState() {
    return this.retlImplementation;
  }

  setImplementationState() {
    const metdata = JSON.parse(fs.readFileSync('../metadata.json').toString());
    const { implementation } = metdata;
    const streamingImplementation = implementation['streaming'];
    const retlImplementation = implementation['retl'];
    if (streamingImplementation === 'cdk') {
      this.streamingImplementation = new CDKSalesforceStreamingImpl();
    }
    if (retlImplementation === 'cdk') {
      this.retlImplementation = new CDKSalesforceRetlImpl();
    }
  }

  async executeStreaming(
    inputs: (ProcessorTransformationRequest | RouterTransformationRequestData)[],
    stage: TransformationStage,
  ): Promise<(ProcessorTransformationResponse | RouterTransformationResponse)[]> {
    const output = await AdapterUtility.executeTransformation(
      this.streamingImplementation,
      inputs,
      stage,
    );
    return output;
  }

  async executeRetl(
    inputs: (ProcessorTransformationRequest | RouterTransformationRequestData)[],
    stage: TransformationStage,
  ): Promise<(ProcessorTransformationResponse | RouterTransformationResponse)[]> {
    const output = await AdapterUtility.executeTransformation(
      this.retlImplementation,
      inputs,
      stage,
    );
    return output;
  }

  public async executeDelivery(destinationRequest: TransformedOutput): Promise<DeliveryResponse> {
    return await this.streamingImplementation.deliver(destinationRequest);
  }

  public async executeDeletion(
    requests: UserDeletionRequest[],
    rudderDestInfo: string,
  ): Promise<UserDeletionResponse[]> {
    const response = await Promise.all(
      requests.map(async (request) => {
        const result: UserDeletionResponse = await this.streamingImplementation.delete({
          ...request,
          rudderDestInfo,
        });
        return result;
      }),
    );
    return response;
  }
}
