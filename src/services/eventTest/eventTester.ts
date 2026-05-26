import { sendToDestination, userTransformHandler } from '../../routerUtils';
import { FixMe } from '../../types';
import { NativeIntegrationDestinationService } from '../destination/nativeIntegration';
import type { Destination, Connection } from '../../types/controlPlaneConfig';
import type { Metadata, RudderMessage } from '../../types/rudderEvents';

type DestTransformInput = {
  message: Record<string, unknown>;
  destination: Record<string, unknown>;
  connection?: Record<string, unknown>;
};

type EventTesterStage = {
  user_transform?: boolean;
  dest_transform?: boolean;
  send_to_destination?: boolean;
};

type EventTesterV2Payload = {
  events: Record<string, unknown>[];
  destination: Record<string, unknown>;
  connection?: Record<string, unknown>;
  stage: EventTesterStage;
  libraries?: Record<string, unknown>[];
};

type UserTransformResult = {
  message?: Record<string, unknown>;
  error?: string;
};

type EventTesterV2Response = {
  user_transformed_payload: unknown[];
  dest_transformed_payload: unknown[];
  destination_response: unknown[];
  destination_response_status: number[];
};

export class EventTesterService {
  private static async runDestTransform(
    version: string,
    dest: string,
    events: DestTransformInput[],
  ): Promise<{ payloads: unknown[]; error?: string }> {
    if (events.length === 0) {
      return { payloads: [] };
    }
    const workspaceId = events[0].destination.WorkspaceId;
    if (typeof workspaceId !== 'string' || !workspaceId) {
      return { payloads: [], error: 'destination.WorkspaceId is required' };
    }

    const inputs = events.map((event, idx) => ({
      message: event.message as RudderMessage,
      // Synthetic minimal metadata — the test endpoint doesn't carry full router metadata.
      metadata: { workspaceId, jobId: 12} as Metadata,
      destination: event.destination as Destination,
      connection: event.connection as Connection,
    }));

    const service = new NativeIntegrationDestinationService();
    const responses = await service.doRouterTransformation(inputs, dest, version, {});
    const failed = responses.find((r) => r.error);
    if (failed) {
      return { payloads: [], error: failed.error };
    }
    const payloads = responses.flatMap((r) =>
      Array.isArray(r.batchedRequest)
        ? r.batchedRequest
        : [r.batchedRequest]
    );
    return { payloads };
  }

  private static async runUserTransform(
    events: DestTransformInput[],
    libraries: Record<string, unknown>[] = [],
  ): Promise<UserTransformResult[]> {
    if (events.length === 0) {
      return [];
    }
    const librariesVersionIDs = libraries
      .map((library) => library.versionId)
      .filter((versionId): versionId is string => typeof versionId === 'string');
    const { Transformations } = events[0].destination;
    const transformationVersionId = Array.isArray(Transformations)
      ? Transformations[0]?.versionId
      : undefined;

    if (!transformationVersionId) {
      return events.map(() => ({ error: 'Transformation VersionID not found' }));
    }

    const results: UserTransformResult[] = new Array(events.length);
    await Promise.all(
      events.map(async (event, idx) => {
        try {
          const transformedEvents = await userTransformHandler()(
            [event],
            transformationVersionId,
            librariesVersionIDs,
          );
          const transformedEvent = transformedEvents[0];
          if (transformedEvent.error) {
            throw new Error(transformedEvent.error);
          }
          results[idx] = { message: transformedEvent.transformedEvent };
        } catch (err: unknown) {
          results[idx] = { error: err instanceof Error ? err.message : JSON.stringify(err) };
        }
      }),
    );
    return results;
  }

  private static async sendPayloadsToDestination(
    dest: string,
    transformedPayloads: unknown[],
  ): Promise<{ responses: unknown[]; statuses: number[] }> {
    const responses: unknown[] = [];
    const statuses: number[] = [];

    for (const payload of transformedPayloads) {
      // eslint-disable-next-line no-await-in-loop
      const parsedResponse = await sendToDestination(dest, payload);
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

      responses.push(responsePayload);
      statuses.push(parsedResponse.status);
    }

    return { responses, statuses };
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

  public static async testEvent(events: any, version: string, dest: any) {
    const respList: any[] = [];
    if (!events || !Array.isArray(events)) {
      throw new Error('events array is required in payload');
    }
    await Promise.all(
      events.map(async (event) => {
        const { message, destination, connection, stage, libraries } = event;
        const ev = {
          message,
          destination: this.transformDestination(destination),
          connection,
          libraries,
        };

        let response: FixMe = {};
        let errorFound = false;

        if (stage.user_transform) {
          const results = await this.runUserTransform([ev], libraries || []);
          const result = results[0];
          if (result.error) {
            errorFound = true;
            response.user_transformed_payload = { error: result.error };
          } else {
            response.user_transformed_payload = result.message;
            ev.message = result.message;
          }
        }

        if (stage.dest_transform) {
          if (!errorFound) {
            const destResult = await this.runDestTransform(version, dest, [ev]);
            if (destResult.error) {
              errorFound = true;
              response.dest_transformed_payload = { error: destResult.error };
            } else {
              response.dest_transformed_payload = destResult.payloads;
            }
          } else {
            response.dest_transformed_payload = {
              error: 'error encountered in user_transformation stage. Aborting.',
            };
          }
        }
        if (stage.dest_transform && stage.send_to_destination) {
          if (!errorFound) {
            const { responses, statuses } = await this.sendPayloadsToDestination(
              dest,
              response.dest_transformed_payload,
            );
            response = {
              ...response,
              destination_response: responses,
              destination_response_status: statuses,
            };
          } else {
            response.destination_response = {
              error: 'error encountered in dest_transformation stage. Aborting.',
            };
          }
        }
        respList.push(response);
      }),
    );
    return respList;
  }

  public static async testEventV2(
    payload: EventTesterV2Payload,
    version: string,
    dest: string,
  ): Promise<EventTesterV2Response> {
    const { events, destination, connection, stage, libraries } = payload;

    const transformedDestination = this.transformDestination(destination);
    const preparedEvents: DestTransformInput[] = events.map((message) => ({
      message,
      destination: transformedDestination,
      connection,
    }));

    let userTransformResults: UserTransformResult[];
    if (stage.user_transform) {
      userTransformResults = await this.runUserTransform(preparedEvents, libraries || []);
    } else {
      userTransformResults = preparedEvents.map((event) => ({ message: event.message }));
    }

    const response: EventTesterV2Response = {
      user_transformed_payload: stage.user_transform
        ? userTransformResults.map((r) => (r.error ? { error: r.error } : r.message))
        : [],
      dest_transformed_payload: [],
      destination_response: [],
      destination_response_status: [],
    };

    if (!stage.dest_transform) {
      return response;
    }

    const eventsForDestTransform = userTransformResults
      .filter((r) => !r.error && r.message)
      .map((r) => ({
        message: r.message!,
        destination: transformedDestination,
        connection,
      }));

    const destResult = await this.runDestTransform(version, dest, eventsForDestTransform);

    if (destResult.error) {
      response.dest_transformed_payload = [{ error: destResult.error }];
      if (stage.send_to_destination) {
        response.destination_response = [
          { error: 'error encountered in dest_transformation stage. Aborting.' },
        ];
      }
      return response;
    }

    response.dest_transformed_payload = destResult.payloads;
    if (!stage.send_to_destination) {
      return response;
    }

    const destinationResponse = await this.sendPayloadsToDestination(
      dest,
      response.dest_transformed_payload,
    );
    response.destination_response = destinationResponse.responses;
    response.destination_response_status = destinationResponse.statuses;
    return response;
  }
}
