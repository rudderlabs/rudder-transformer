import { RudderStackEvent, Integration, Destination, WorkflowType } from 'rs-integration-lib';
import { IntegrationsFactory } from 'rudder-integrations-store';
import groupBy from 'lodash/groupBy';
import {
  Metadata,
  ProcessorTransformationRequest,
  RouterTransformationRequestData,
  TransformedOutput,
} from '../types';
import { generateErrorObject } from '../v0/util';

// error handling

export class PluginAdapter {
  private static pluginCache: Map<string, Integration> = new Map();

  private static async getPlugin(
    integrationName: string,
    workflowType: WorkflowType,
  ): Promise<Integration> {
    const cacheKey = `${integrationName}_${workflowType}`;
    if (this.pluginCache.has(cacheKey)) {
      return this.pluginCache.get(cacheKey) as Integration;
    }
    // TODO: default integration config need to make it dynamic by making some sort of config call or get it from config file
    // const integrationConfig: IntegrationConfig = {
    //   name: integrationName,
    //   saveResponse: true,
    //   eventOrdering: true,
    //   plugins: ['preprocessor', 'multiplexer'],
    // };

    const integration = await IntegrationsFactory.createIntegration(integrationName, workflowType);
    this.pluginCache.set(cacheKey, integration);
    return integration;
  }

  public static async transformAtProcessor(
    inputs: ProcessorTransformationRequest[],
    integrationName: string,
  ) {
    // TODO: decide the workflow type based on config
    const workflowType = WorkflowType.STREAM;
    const integrationPlugin = await PluginAdapter.getPlugin(integrationName, workflowType);

    const groupedEventsByDestinationId = groupBy(
      inputs,
      (ev: ProcessorTransformationRequest) => ev.destination?.ID,
    );
    const eventsPerDestinationId: ProcessorTransformationRequest[][] = Object.values(
      groupedEventsByDestinationId,
    );

    const result = await Promise.all(
      eventsPerDestinationId.map(async (inputs) => {
        const events = inputs.map((input) => ({
          event: input.message as RudderStackEvent,
          metadata: input.metadata,
        }));
        const { destination } = inputs[0];
        const output = await integrationPlugin.execute(events, destination as Destination);
        const responseList = output.context;
        const errors = output.errorResults;

        const errorList: { metadata: Metadata; response: any; destination: Destination }[] = [];
        // handle the error scenario
        if (errors.length > 0) {
          const nestedErrorList = errors.map((e) => {
            const errResponses = e.metadata.map((metadata) => ({
              metadata,
              response: generateErrorObject(e.error), // add further tags here
              destination: e.destination,
            }));
            return errResponses;
          });
          errorList.push(...nestedErrorList.flat());
        }

        // handle the success scenario
        const transformedPayloadList: {
          payload: TransformedOutput;
          metadata: Metadata;
          destination: Destination;
        }[] = [];
        for (const [_, response] of responseList.entries()) {
          for (const [index, payload] of response.payload.entries()) {
            const transformedPayload = payload as TransformedOutput;
            transformedPayloadList.push({
              payload: transformedPayload,
              metadata: response.metadata[index],
              destination: response.destination,
            });
          }
        }
        return { transformedPayloadList, errorList };
      }),
    );

    const allSuccessList: {
      payload: TransformedOutput;
      metadata: Metadata;
      destination: Destination;
    }[] = result.flatMap((res) => res.transformedPayloadList);
    const allErrorList: { metadata: Metadata; response: any; destination: Destination }[] =
      result.flatMap((res) => res.errorList);

    return { allSuccessList, allErrorList };
  }

  public static async transformAtRouter(
    inputs: RouterTransformationRequestData[],
    integrationName: string,
  ) {
    // TODO: decide the workflow type based on config
    const workflowType = WorkflowType.STREAM;

    const integrationPlugin = await PluginAdapter.getPlugin(integrationName, workflowType);
    // group events by destinationId
    // example: { destinationId1: [event1, event2], destinationId2: [event3, event4]}
    const groupedEventsByDestinationId = groupBy(
      inputs,
      (ev: RouterTransformationRequestData) => ev.destination?.ID,
    );
    // example: [[event1, event2], [event3, event4]]
    const eventsPerDestinationId: RouterTransformationRequestData[][] = Object.values(
      groupedEventsByDestinationId,
    );

    const result = await Promise.all(
      eventsPerDestinationId.map(async (inputs) => {
        const events = inputs.map((input) => ({
          event: input.message as RudderStackEvent,
          metadata: input.metadata,
        }));

        const { destination } = inputs[0];

        // calling the plugin and we can expect batched and multiplexed responses
        // example: [ { payload: [event1, event2, event3], metadata: [metadata1, metadata2, metdata3] }, { payload: [event3, event4], metadata: [metadata3, metadata4] } ]

        const output = await integrationPlugin.execute(events, destination as Destination);
        const responseList = output.context;
        const errors = output.errorResults;

        // handle error scenario
        const errorList: { metadata: Metadata; response: any; destination: Destination }[] = [];
        if (errors.length > 0) {
          const nestedErrorList = errors.map((e) => {
            const errResponses = e.metadata.map((metadata) => ({
              metadata,
              response: generateErrorObject(e.error), // add further tags here
              destination: e.destination,
            }));
            return errResponses;
          });
          errorList.push(...nestedErrorList.flat());
        }

        // handle success scenraio
        // ranking the responses based on the number of unique jobIds in the metadata array
        const uniqueJobRank: { uniqueJobIds: number; index: number }[] = [];
        for (const [index, response] of responseList.entries()) {
          const uniqueJobIds = Array.from(new Set(response.metadata.map((meta) => meta.jobId)));
          uniqueJobRank.push({
            uniqueJobIds: uniqueJobIds.length,
            index,
          });
        }
        uniqueJobRank.sort((a, b) => b.uniqueJobIds - a.uniqueJobIds);
        // ranking ends here with uniqueJobRank containing the index of the responseList in the order of the number of unique jobIds in the metadata array
        // example: [ { uniqueJobIds: 3, index: 0 }, { uniqueJobIds: 2, index: 1 } ]

        const finalResponse: {
          payload: TransformedOutput[];
          metadata: Metadata[];
          destination: Destination;
        }[] = [];
        // creating a map of jobId to position in the metadata array
        // example: { jobId1: 1, jobId2: 1, jobId3: 0, jobId4: 2}
        // motivation: prevent metadata duplication in the final response at all levels
        const jobIdPositionMap: Map<number, number> = new Map();
        for (const rank of uniqueJobRank) {
          // iteratively checking payloads with the highest number of unique jobIds to lowest
          const rankedResponse = responseList[rank.index];
          let isCurrentResponseAddedToFinalPayload = false;
          // iterate each metadata in the rankedResponse to check if any jobId is already present in the finalResponse
          for (const meta of rankedResponse.metadata) {
            // check if the jobId already has a position in final response
            if (jobIdPositionMap.has(meta.jobId)) {
              // if yes, then we need append the entire rankedResponse including all the payloads and metadata at same position
              const position = jobIdPositionMap.get(meta.jobId) as number;
              const currentOutput = rankedResponse.payload.map(
                (payload) => payload as TransformedOutput,
              );
              finalResponse[position].payload.push(...currentOutput);
              // push metdata to final response only if it is not already present
              rankedResponse.metadata.forEach((meta) => {
                // get all the exisitng jobIds in the metadata array at the position from the finalResponse
                const jobIdsInResponse = finalResponse[position].metadata.map(
                  (fRmeta) => fRmeta.jobId,
                );
                // check if the jobId is already present in the metadata array
                if (!jobIdsInResponse.includes(meta.jobId)) {
                  finalResponse[position].metadata.push(meta);
                }
              });
              finalResponse[position].destination = rankedResponse.destination;
              isCurrentResponseAddedToFinalPayload = true;
              // break the loop as we have already appended the entire rankedResponse to the finalResponse
              break;
            }
          }
          // if the current rankedResponse is not added to the finalResponse, then we need to add it as a new entry
          if (!isCurrentResponseAddedToFinalPayload) {
            finalResponse.push({
              payload: rankedResponse.payload.map((payload) => payload as TransformedOutput),
              metadata: rankedResponse.metadata,
              destination: rankedResponse.destination,
            });
            // update the jobIdPositionMap for all the jobIds in the rankedResponse
            rankedResponse.metadata.forEach((meta) => {
              jobIdPositionMap.set(meta.jobId, finalResponse.length - 1);
            });
          }
        }
        return { transformedPayloadList: finalResponse, errorList };
      }),
    );
    const allSuccessList: {
      payload: TransformedOutput[];
      metadata: Metadata[];
      destination: Destination;
    }[] = result.flatMap((res) => res.transformedPayloadList);
    const allErrorList: { metadata: Metadata; response: any; destination: Destination }[] =
      result.flatMap((res) => res.errorList);

    return { allSuccessList, allErrorList };
  }
}
