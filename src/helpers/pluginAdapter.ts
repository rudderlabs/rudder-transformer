/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/naming-convention */
/* eslint-disable @typescript-eslint/no-shadow */
/* eslint-disable no-restricted-syntax */
import {
  RudderStackEvent,
  RudderStackEventPayload,
  Integration,
  Destination,
  WorkflowType,
  Metadata,
  get,
} from '@rudderstack/integrations-lib';
import { IntegrationsFactory } from '@rudderstack/integrations-store';
import groupBy from 'lodash/groupBy';
import {
  ProcessorTransformationRequest,
  RouterTransformationRequestData,
  TransformedOutput,
} from '../types';
import { generateErrorObject } from '../v0/util';
import { MappedToDestinationKey } from '../constants';

export type TransformedPayloadInfo = {
  payload: any[];
  metadata: Metadata[];
};

export type ErrorInfo = {
  error: any;
  metadata: Metadata[];
};

export type ProcTransformedState = {
  payload: TransformedOutput;
  metadata: Metadata;
  destination: Destination;
};

export type RtTransformedState = {
  payload: TransformedOutput[];
  metadata: Metadata[];
  destination: Destination;
};

export type ErrorState = { metadata: Metadata; response: any; destination: Destination };

export class PluginAdapter {
  private static pluginCache: Map<string, Integration> = new Map();

  static deduplicateMetadataByJobId(metadata: Metadata[]) {
    const jobIdMap = new Map();
    const deduplicatedMetadata: Metadata[] = [];
    for (const meta of metadata) {
      if (!jobIdMap.has(meta.jobId)) {
        jobIdMap.set(meta.jobId, 'exists');
        deduplicatedMetadata.push(meta);
      }
    }
    return deduplicatedMetadata;
  }

  static async getPlugin(
    integrationName: string,
    workflowType: WorkflowType,
  ): Promise<Integration> {
    const cacheKey = `${integrationName}_${workflowType}`;
    if (this.pluginCache.has(cacheKey)) {
      return this.pluginCache.get(cacheKey) as Integration;
    }
    const integration = await IntegrationsFactory.createIntegration(integrationName, workflowType);
    this.pluginCache.set(cacheKey, integration);
    return integration;
  }

  static handleErrors(errors: ErrorInfo[], destination: Destination): ErrorState[] {
    const errorList: ErrorState[] = [];

    // deduplicate error metadata for each error
    errors.forEach((error) => {
      // eslint-disable-next-line no-param-reassign
      error.metadata = PluginAdapter.deduplicateMetadataByJobId(error.metadata);
    });

    if (errors.length > 0) {
      const nestedErrorList = errors.map((e) =>
        e.metadata.map((metadata) => ({
          metadata,
          response: generateErrorObject(e.error),
          destination,
        })),
      );
      errorList.push(...nestedErrorList.flat());
    }

    return errorList;
  }

  // Proc Transform Related Functions
  static handleProcSuccess(
    responseList: TransformedPayloadInfo[],
    destination: Destination,
  ): ProcTransformedState[] {
    const transformedPayloadList: ProcTransformedState[] = [];

    for (const [_, response] of responseList.entries()) {
      for (const [index, payload] of response.payload.entries()) {
        const transformedPayload = payload as TransformedOutput;
        transformedPayloadList.push({
          payload: transformedPayload,
          metadata: response.metadata[index],
          destination,
        });
      }
    }

    return transformedPayloadList;
  }

  static async processProcEvents(
    integrationPlugin: Integration,
    events: ProcessorTransformationRequest[],
    destination: Destination,
  ): Promise<{ transformedPayloadList: ProcTransformedState[]; errorList: ErrorState[] }> {
    const eventsPayload = events.map((input) => ({
      event: [{ message: input.message as RudderStackEvent } as RudderStackEventPayload],
      metadata: [input.metadata],
    }));

    const output = await integrationPlugin.execute(eventsPayload, destination);
    const responseList = output.resultContext;
    const errors = output.errorResults;

    // Handle Errors
    const errorList = PluginAdapter.handleErrors(errors, destination);

    // Handle Success
    const transformedPayloadList = PluginAdapter.handleProcSuccess(responseList, destination);

    return { transformedPayloadList, errorList };
  }

  public static async transformAtProcessor(
    inputs: ProcessorTransformationRequest[],
    integrationName: string,
  ) {
    const mappedToDestination = get(inputs[0].message, MappedToDestinationKey);
    const workflowType = mappedToDestination ? WorkflowType.RETL : WorkflowType.STREAM;
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
        const { destination } = inputs[0];
        const output = await PluginAdapter.processProcEvents(
          integrationPlugin,
          inputs,
          destination,
        );

        return {
          transformedPayloadList: output.transformedPayloadList,
          errorList: output.errorList,
        };
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

  // Rt Transform Related Functions

  static rankResponsesByUniqueJobIds(responseList: TransformedPayloadInfo[]) {
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

    return uniqueJobRank;
  }

  static createFinalResponse(
    uniqueJobRank: { uniqueJobIds: number; index: number }[],
    responseList: TransformedPayloadInfo[],
    destination: Destination,
  ): RtTransformedState[] {
    const finalResponse: RtTransformedState[] = [];
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
            const jobIdsInResponse = finalResponse[position].metadata.map((fRmeta) => fRmeta.jobId);
            // check if the jobId is already present in the metadata array
            if (!jobIdsInResponse.includes(meta.jobId)) {
              finalResponse[position].metadata.push(meta);
            }
          });
          finalResponse[position].destination = destination;
          isCurrentResponseAddedToFinalPayload = true;
          // break the loop as we have already appended the entire rankedResponse to the finalResponse
          break;
        }
      }
      // if the current rankedResponse is not added to the finalResponse, then we need to add it as a new entry
      if (!isCurrentResponseAddedToFinalPayload) {
        finalResponse.push({
          payload: rankedResponse.payload.map((payload) => payload as TransformedOutput),
          // only stored deduplicated metadata in the final response
          metadata: PluginAdapter.deduplicateMetadataByJobId(rankedResponse.metadata),
          destination,
        });
        // update the jobIdPositionMap for all the jobIds in the rankedResponse
        rankedResponse.metadata.forEach((meta) => {
          jobIdPositionMap.set(meta.jobId, finalResponse.length - 1);
        });
      }
    }
    return finalResponse;
  }

  static handleRtSuccess(
    responseList: TransformedPayloadInfo[],
    destination: Destination,
  ): RtTransformedState[] {
    // Rank responses based on unique jobIds in metadata array
    const uniqueJobRank = PluginAdapter.rankResponsesByUniqueJobIds(responseList);

    // Create final response with deduplicated metadata
    const finalResponse = PluginAdapter.createFinalResponse(
      uniqueJobRank,
      responseList,
      destination,
    );

    return finalResponse;
  }

  static async processRtEvents(
    integrationPlugin: Integration,
    events: RouterTransformationRequestData[],
    destination: Destination,
  ): Promise<{ transformedPayloadList: RtTransformedState[]; errorList: ErrorState[] }> {
    const inputPayload = events.map((input) => ({
      event: [{ message: input.message as RudderStackEvent } as RudderStackEventPayload],
      metadata: [input.metadata],
    }));

    const output = await integrationPlugin.execute(inputPayload, destination);
    const responseList = output.resultContext;
    const errors = output.errorResults;

    // Handle Errors
    const errorList = PluginAdapter.handleErrors(errors, destination);

    // Handle Success
    const transformedPayloadList = PluginAdapter.handleRtSuccess(responseList, destination);

    return { transformedPayloadList, errorList };
  }

  public static async transformAtRouter(
    inputs: RouterTransformationRequestData[],
    integrationName: string,
  ) {
    const mappedToDestination = get(inputs[0].message, MappedToDestinationKey);
    const workflowType = mappedToDestination ? WorkflowType.RETL : WorkflowType.STREAM;

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
      eventsPerDestinationId.map(async (events) => {
        const output = await PluginAdapter.processRtEvents(
          integrationPlugin,
          events,
          events[0].destination,
        );
        return {
          errorList: output.errorList,
          transformedPayloadList: output.transformedPayloadList,
        };
      }),
    );

    const allSuccessList = result.flatMap((res) => res.transformedPayloadList);
    const allErrorList: { metadata: Metadata; response: any; destination: Destination }[] =
      result.flatMap((res) => res.errorList);

    return { allSuccessList, allErrorList };
  }
}
