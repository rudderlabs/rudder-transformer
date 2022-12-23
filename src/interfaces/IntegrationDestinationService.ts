import {
    DeliveryResponse,
    ProcessorRequest,
    ProcessorResponse,
    RouterRequestData,
    RouterResponse,
    TransformedEvent
  } from "../types/index";
  
  export default interface IntegrationDestinationService {
    processorRoutine(
      events: ProcessorRequest[],
      destinationType: string,
      destHandler: any,
      requestMetadata: Object
    ): Promise<ProcessorResponse[]>;
  
    routerRoutine(
      events: RouterRequestData[],
      destinationType: string,
      destHandler: any,
      requestMetadata: Object
    ): Promise<RouterResponse[]>;
  
    batchRoutine(
      events: RouterRequestData[],
      destinationType: string,
      destHandler: any,
      requestMetadata: Object
    ): any;
  
    deliveryRoutine(
      event: TransformedEvent,
      destinationType: string,
      networkHandler: any,
      requestMetadata: Object
    ): Promise<DeliveryResponse>;
  }
  