import { sendToDestination, userTransformHandler } from '../../routerUtils';
import { FixMe } from '../../types';
import { isBatchingFrameworkEnabled } from '../../constants/batchedDestinationsMap';
import { FetchHandler } from '../../helpers/fetchHandlers';
import { processBatchedDestination } from '../destination/nativeBatching/processBatchedDestination';
import type { RouterTransformationRequestData } from '../../types/destinationTransformation';
import type { Destination, Connection } from '../../types/controlPlaneConfig';
import type { Metadata, RudderMessage } from '../../types/rudderEvents';

type DestTransformInput = {
  message: RudderMessage;
  destination: Destination & { WorkspaceId: string };
  connection?: Connection;
};

type EventTesterStage = {
  user_transform: boolean;
  dest_transform: boolean;
  send_to_destination: boolean;
};

type EventTesterV2Payload = {
  events: RudderMessage[];
  destination: Destination;
  connection: Connection;
  stage: EventTesterStage;
  libraries: Array<{ versionId?: string }>;
};

type UserTransformResult = {
  message?: RudderMessage;
  error?: string;
};

export class EventTesterService {
  private static getDestHandler(version, destination) {
    // eslint-disable-next-line global-require, import/no-dynamic-require
    return require(`../../${version}/destinations/${destination}/transform`);
  }

  private static async runDestTransform(
    version: string,
    dest: string,
    ev: DestTransformInput,
  ): Promise<unknown[]> {
    const { WorkspaceId: workspaceId } = ev.destination;
    if (!workspaceId) {
      throw new Error('destination.WorkspaceId is required');
    }
    if (isBatchingFrameworkEnabled(dest, workspaceId)) {
      const IntegrationClass = FetchHandler.getBatchDestinationHandler(dest);
      const input: RouterTransformationRequestData = {
        message: ev.message,
        // Synthetic minimal metadata — the test endpoint doesn't carry full router metadata.
        metadata: { workspaceId } as Metadata,
        destination: ev.destination,
        connection: ev.connection,
      };
      const responses = await processBatchedDestination([input], IntegrationClass, {});
      const failed = responses.find((r) => r.error);
      if (failed) {
        throw new Error(failed.error);
      }
      return responses.map((r) => r.batchedRequest);
    }
    const output = await this.getDestHandler(version, dest).process(ev);
    return Array.isArray(output) ? output : [output];
  }

  private static async runDestTransformBatch(
    version: string,
    dest: string,
    events: DestTransformInput[],
  ): Promise<unknown[]> {
    if (events.length === 0) {
      return [];
    }
    const { WorkspaceId: workspaceId } = events[0].destination;
    if (!workspaceId) {
      throw new Error('destination.WorkspaceId is required');
    }

    if (isBatchingFrameworkEnabled(dest, workspaceId)) {
      const IntegrationClass = FetchHandler.getBatchDestinationHandler(dest);
      const inputs: RouterTransformationRequestData[] = events.map((event, idx) => ({
        message: event.message,
        metadata: { workspaceId, jobId: idx + 1 } as Metadata,
        destination: event.destination,
        connection: event.connection,
      }));
      const responses = await processBatchedDestination(inputs, IntegrationClass, {});
      const failed = responses.find((r) => r.error);
      if (failed) {
        throw new Error(failed.error);
      }
      return responses.map((r) => r.batchedRequest);
    }

    const transformed = await Promise.all(
      events.map((event) => this.runDestTransform(version, dest, event)),
    );
    return transformed.flat();
  }

  private static async runUserTransform(
    events: DestTransformInput[],
    libraries: Array<{ versionId?: string }> = [],
  ): Promise<UserTransformResult[]> {
    if (events.length === 0) {
      return [];
    }
    const librariesVersionIDs = libraries
      .map((library) => library.versionId)
      .filter((versionId): versionId is string => Boolean(versionId));
    const destination = events[0].destination as FixMe;
    const transformationVersionId =
      destination.Transformations &&
      destination.Transformations[0] &&
      destination.Transformations[0].versionId;

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
        } catch (err: any) {
          results[idx] = { error: err.message || JSON.stringify(err) };
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
          let librariesVersionIDs = [];
          if (libraries) {
            librariesVersionIDs = events[0].libraries.map((library) => library.versionId);
          }
          const transformationVersionId =
            ev.destination &&
            ev.destination.Transformations &&
            ev.destination.Transformations[0] &&
            ev.destination.Transformations[0].versionId;

          if (transformationVersionId) {
            try {
              const destTransformedEvents = await userTransformHandler()(
                [ev],
                transformationVersionId,
                librariesVersionIDs,
              );
              const userTransformedEvent = destTransformedEvents[0];
              if (userTransformedEvent.error) {
                throw new Error(userTransformedEvent.error);
              }

              response.user_transformed_payload = userTransformedEvent.transformedEvent;
              ev.message = userTransformedEvent.transformedEvent;
            } catch (err: any) {
              errorFound = true;
              response.user_transformed_payload = {
                error: err.message || JSON.stringify(err),
              };
            }
          } else {
            response.user_transformed_payload = {
              error: 'Transformation VersionID not found',
            };
          }
        }

        if (stage.dest_transform) {
          if (!errorFound) {
            try {
              response.dest_transformed_payload = await this.runDestTransform(version, dest, ev);
            } catch (err: any) {
              errorFound = true;
              response.dest_transformed_payload = {
                error: err.message || JSON.stringify(err),
              };
            }
          } else {
            response.dest_transformed_payload = {
              error: 'error encountered in user_transformation stage. Aborting.',
            };
          }
        }
        // const transformerStatuses = [];
        if (stage.dest_transform && stage.send_to_destination) {
          // send event to destination only after transformation
          if (!errorFound) {
            const destResponses: FixMe[] = [];
            const destResponseStatuses: FixMe[] = [];

            const transformedPayloads = response.dest_transformed_payload;
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

              destResponses.push(responsePayload);
              destResponseStatuses.push(parsedResponse.status);

              // TODO: Use updated handleResponseTransform function
              // Removing the below part, because transformerStatus is not
              // currently being returned by test api response

              // call response transform here
              // const ctxMock = {
              //   request: {
              //     body: parsedResponse
              //   }
              // };
              // handleResponseTransform(version, dest, ctxMock);
              // const { output } = ctxMock.body;
              // transformerStatuses.push(output.status);
            }
            response = {
              ...response,
              destination_response: destResponses,
              destination_response_status: destResponseStatuses,
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

  public static async testEventV2(payload: EventTesterV2Payload, version: string, dest: string) {
    const { events, destination, connection, stage, libraries } = payload;
    if (!events || !Array.isArray(events)) {
      throw new Error('events array is required in payload');
    }

    const transformedDestination = this.transformDestination(destination);
    const preparedEvents: DestTransformInput[] = events.map((message) => ({
      message,
      destination: transformedDestination,
      connection,
    }));

    const userTransformResults: unknown[] = [];
    const eventsForDestinationTransform: DestTransformInput[] = [];

    if (stage.user_transform) {
      const results = await this.runUserTransform(preparedEvents, libraries);
      results.forEach((result, idx) => {
        if (result.error) {
          userTransformResults[idx] = { error: result.error };
          return;
        }
        userTransformResults[idx] = result.message;
        eventsForDestinationTransform.push({
          ...preparedEvents[idx],
          message: result.message as RudderMessage,
        });
      });
    } else {
      preparedEvents.forEach((event, idx) => {
        userTransformResults[idx] = event.message;
      });
      eventsForDestinationTransform.push(...preparedEvents);
    }

    const response: {
      user_transformed_payload: unknown[];
      dest_transformed_payload: unknown[];
      destination_response: unknown[];
      destination_response_status: number[];
    } = {
      user_transformed_payload: userTransformResults,
      dest_transformed_payload: [],
      destination_response: [],
      destination_response_status: [],
    };

    if (!stage.dest_transform) {
      return response;
    }

    try {
      response.dest_transformed_payload = await this.runDestTransformBatch(
        version,
        dest,
        eventsForDestinationTransform,
      );
    } catch (err: any) {
      response.dest_transformed_payload = [{ error: err.message || JSON.stringify(err) }];
      if (stage.send_to_destination) {
        response.destination_response = [{
          error: 'error encountered in dest_transformation stage. Aborting.',
        }];
        response.destination_response_status = [400];
      }
      return response;
    }

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
