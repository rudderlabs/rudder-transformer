import stableStringify from 'fast-json-stable-stringify';
import { sendToDestination, userTransformHandler } from '../../routerUtils';
import { FixMe } from '../../types';
import { isBatchingFrameworkEnabled } from '../../constants/batchedDestinationsMap';
import { FetchHandler } from '../../helpers/fetchHandlers';
import { processBatchedDestination } from '../destination/nativeBatching/processBatchedDestination';
import type {
  EventTesterBatchOutput,
  EventTesterGroupResponse,
  EventTesterInputEvent,
  RouterTransformationRequestData,
  RouterTransformationResponse,
} from '../../types/destinationTransformation';
import type { Destination, Connection } from '../../types/controlPlaneConfig';
import type { Metadata, RudderMessage } from '../../types/rudderEvents';

type DestTransformInput = {
  message: RudderMessage;
  destination: Destination & { WorkspaceId: string };
  connection?: Connection;
  metadata: Metadata;
};

type GroupedEvent = {
  inputIndex: number;
  source: EventTesterInputEvent;
  transformedDestination: Destination & { WorkspaceId: string };
  transformedMessage: RudderMessage;
  userTransformedPayload?: unknown;
  errorFound: boolean;
};

type DestinationSendResult = {
  responsePayload: unknown;
  status: number;
};

export class EventTesterService {
  private static getDestHandler(version, destination) {
    // eslint-disable-next-line global-require, import/no-dynamic-require
    return require(`../../${version}/destinations/${destination}/transform`);
  }

  private static toDestTransformInput(groupEvents: GroupedEvent[]): DestTransformInput[] {
    return groupEvents.map((groupEvent, idx) => ({
      message: groupEvent.transformedMessage,
      destination: groupEvent.transformedDestination,
      connection: groupEvent.source.connection,
      metadata: {
        workspaceId: groupEvent.transformedDestination.WorkspaceId,
        jobId: idx + 1,
      } as Metadata,
    }));
  }

  private static flattenBatchedRequests(
    responses: RouterTransformationResponse[],
    jobIdToInputIndex: Map<number, number>,
  ): EventTesterBatchOutput[] {
    return responses.flatMap((response) => {
      if (!response.batchedRequest) {
        return [];
      }
      const requestList = Array.isArray(response.batchedRequest)
        ? response.batchedRequest
        : [response.batchedRequest];
      const sourceEventIndexes = response.metadata
        .map((metadata) => (metadata.jobId ? jobIdToInputIndex.get(metadata.jobId) : undefined))
        .filter((index): index is number => index !== undefined)
        .sort((a, b) => a - b);
      return requestList.map((payload) => ({
        payload,
        source_event_indexes: sourceEventIndexes,
      }));
    });
  }

  private static async runDestTransform(
    version: string,
    dest: string,
    events: DestTransformInput[],
  ): Promise<EventTesterBatchOutput[]> {
    if (events.length === 0) {
      return [];
    }

    const { WorkspaceId: workspaceId } = events[0].destination;
    if (!workspaceId) {
      throw new Error('destination.WorkspaceId is required');
    }

    const jobIdToInputIndex = new Map<number, number>();
    events.forEach((event, index) => {
      jobIdToInputIndex.set(event.metadata.jobId!, index);
    });

    let responses: RouterTransformationResponse[];
    if (isBatchingFrameworkEnabled(dest, workspaceId)) {
      const IntegrationClass = FetchHandler.getBatchDestinationHandler(dest);
      const inputs: RouterTransformationRequestData[] = events.map((event) => ({
        message: event.message,
        metadata: event.metadata,
        destination: event.destination,
        connection: event.connection,
      }));
      responses = await processBatchedDestination(inputs, IntegrationClass, {});
    } else {
      const handler = this.getDestHandler(version, dest);
      if (typeof handler.processRouterDest === 'function') {
        responses = await handler.processRouterDest(events);
      } else {
        responses = await Promise.all(
          events.map(async (event) => {
            const output = await handler.process({
              message: event.message,
              destination: event.destination,
              connection: event.connection,
            });
            const batchedRequest = Array.isArray(output) ? output : [output];
            return {
              batchedRequest,
              metadata: [event.metadata],
              batched: false,
              destination: event.destination,
              statusCode: 200,
            } as RouterTransformationResponse;
          }),
        );
      }
    }

    const failedResponse = responses.find((response) => response.error);
    if (failedResponse?.error) {
      throw new Error(failedResponse.error);
    }

    return this.flattenBatchedRequests(responses, jobIdToInputIndex);
  }

  private static transformDestination(dest) {
    function capitalize(s) {
      return s === 'id' ? s.toUpperCase() : s.charAt(0).toUpperCase() + s.slice(1);
    }
    const transformedObj: FixMe = {};
    const { destinationDefinition } = dest;
    Object.keys(dest).forEach((key) => {
      transformedObj[capitalize(key)] = dest[key];
    });

    const destDef = {};
    Object.keys(destinationDefinition).forEach((key) => {
      destDef[capitalize(key)] = destinationDefinition[key];
    });
    transformedObj.DestinationDefinition = destDef;
    return transformedObj;
  }

  private static isSupportedContentType(contentType) {
    let supported = false;
    const SUPPORTED_CONTENT_TYPES = ['application/xml', 'application/json', 'text'];
    if (contentType) {
      SUPPORTED_CONTENT_TYPES.some((type) => {
        if (contentType.toLowerCase().includes(type)) {
          supported = true;
          return true;
        }
        return false;
      });
    }
    return supported;
  }

  private static getGroupingKey(
    destination: Destination,
    connection: Connection,
    stage: FixMe,
  ): string {
    return stableStringify({ destination, connection, stage });
  }

  private static validateSendFlags(
    batchOutputs: EventTesterBatchOutput[],
    groupEvents: GroupedEvent[],
  ): void {
    batchOutputs.forEach((batchOutput) => {
      const sendFlags = batchOutput.source_event_indexes.map(
        (index) => !!groupEvents[index]?.source.stage?.send_to_destination,
      );
      const hasTrue = sendFlags.some(Boolean);
      const hasFalse = sendFlags.some((flag) => !flag);
      if (hasTrue && hasFalse) {
        throw new Error(
          'Mixed send_to_destination flags within a batched destination payload are not supported.',
        );
      }
    });
  }

  private static async applyUserTransform(groupEvents: GroupedEvent[]): Promise<GroupedEvent[]> {
    return Promise.all(
      groupEvents.map(async (groupEvent) => {
        const librariesVersionIDs = (groupEvent.source.libraries ?? []).map(
          (library) => library.VersionID,
        );
        const transformationVersionId =
          groupEvent.transformedDestination?.Transformations?.[0]?.VersionID;

        if (!transformationVersionId) {
          return {
            ...groupEvent,
            userTransformedPayload: {
              error: 'Transformation VersionID not found',
            },
          };
        }

        try {
          const destTransformedEvents = await userTransformHandler()(
            [
              {
                message: groupEvent.transformedMessage,
                destination: groupEvent.transformedDestination,
                connection: groupEvent.source.connection,
                libraries: groupEvent.source.libraries,
              },
            ],
            transformationVersionId,
            librariesVersionIDs,
          );
          const userTransformedEvent = destTransformedEvents[0];
          if (userTransformedEvent.error) {
            throw new Error(userTransformedEvent.error);
          }

          return {
            ...groupEvent,
            transformedMessage: userTransformedEvent.transformedEvent,
            userTransformedPayload: userTransformedEvent.transformedEvent,
          };
        } catch (err: any) {
          return {
            ...groupEvent,
            errorFound: true,
            userTransformedPayload: {
              error: err.message || JSON.stringify(err),
            },
          };
        }
      }),
    );
  }

  private static async sendPayloadToDestination(
    dest: string,
    transformedPayload: EventTesterBatchOutput,
  ): Promise<DestinationSendResult> {
    const parsedResponse = await sendToDestination(dest, transformedPayload.payload);

    let contentType = '';
    let responsePayload = '';
    if (parsedResponse.headers) {
      contentType = parsedResponse.headers['content-type'];
      if (this.isSupportedContentType(contentType)) {
        responsePayload = parsedResponse.response;
      }
    } else if (parsedResponse.networkFailure) {
      responsePayload = parsedResponse.response;
    }

    return {
      responsePayload,
      status: parsedResponse.status,
    };
  }

  private static buildGroupedEvents(events: EventTesterInputEvent[]): Map<string, GroupedEvent[]> {
    const groupedEventsMap = new Map<string, GroupedEvent[]>();
    events.forEach((event, inputIndex) => {
      const transformedDestination = this.transformDestination(event.destination);
      const groupEvent: GroupedEvent = {
        inputIndex,
        source: event,
        transformedDestination,
        transformedMessage: event.message,
        errorFound: false,
      };
      const key = this.getGroupingKey(
        transformedDestination,
        event.connection as Connection,
        event.stage as FixMe,
      );
      const existingGroup = groupedEventsMap.get(key) ?? [];
      existingGroup.push(groupEvent);
      groupedEventsMap.set(key, existingGroup);
    });
    return groupedEventsMap;
  }

  private static async buildGroupResponse(
    groupEvents: GroupedEvent[],
    version: string,
    dest: string,
  ): Promise<EventTesterGroupResponse> {
    const firstEvent = groupEvents[0].source;
    const groupResponse: EventTesterGroupResponse = {
      group: {
        destination: groupEvents[0].transformedDestination,
        connection: firstEvent.connection,
        stage: firstEvent.stage,
      },
      source_event_indexes: groupEvents.map((event) => event.inputIndex),
    };

    let preparedGroupEvents = groupEvents;

    if (firstEvent.stage?.user_transform) {
      preparedGroupEvents = await this.applyUserTransform(preparedGroupEvents);
      groupResponse.user_transformed_payloads = preparedGroupEvents.map((groupEvent) => ({
        source_event_index: groupEvent.inputIndex,
        payload: groupEvent.userTransformedPayload,
      }));
    }

    if (firstEvent.stage?.dest_transform) {
      if (preparedGroupEvents.some((groupEvent) => groupEvent.errorFound)) {
        groupResponse.dest_transformed_payload = {
          error: 'error encountered in user_transformation stage. Aborting.',
        };
      } else {
        const batchOutputs = await this.runDestTransform(
          version,
          dest,
          this.toDestTransformInput(preparedGroupEvents),
        );
        this.validateSendFlags(batchOutputs, preparedGroupEvents);
        groupResponse.dest_transformed_payload = batchOutputs;
      }
    }

    if (firstEvent.stage?.dest_transform && firstEvent.stage?.send_to_destination) {
      if (
        !groupResponse.dest_transformed_payload ||
        !Array.isArray(groupResponse.dest_transformed_payload)
      ) {
        groupResponse.destination_response = {
          error: 'error encountered in dest_transformation stage. Aborting.',
        };
      } else {
        const sendResults = await Promise.all(
          groupResponse.dest_transformed_payload.map((transformedPayload) =>
            this.sendPayloadToDestination(dest, transformedPayload),
          ),
        );

        groupResponse.destination_response = sendResults.map((result) => result.responsePayload);
        groupResponse.destination_response_status = sendResults.map((result) => result.status);
      }
    }

    return groupResponse;
  }

  public static async testEvent(
    events: EventTesterInputEvent[],
    version: string,
    dest: string,
  ): Promise<EventTesterGroupResponse[]> {
    if (!events || !Array.isArray(events)) {
      throw new Error('events array is required in payload');
    }

    const groupedEventsMap = this.buildGroupedEvents(events);
    const groupedResponses: EventTesterGroupResponse[] = [];
    for (const groupEvents of groupedEventsMap.values()) {
      // eslint-disable-next-line no-await-in-loop -- keep deterministic group/result ordering
      const groupResponse = await this.buildGroupResponse(groupEvents, version, dest);
      groupedResponses.push(groupResponse);
    }

    return groupedResponses;
  }
}
