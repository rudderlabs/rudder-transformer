import { sendToDestination, userTransformHandler } from '../../routerUtils';

export default class EventTesterService {
  private static getDestHandler(version, destination) {
    return require(`../../${version}/destinations/${destination}/transform`);
  }

  private static transformDestination(dest) {
    function capitalize(s) {
      return s === 'id' ? s.toUpperCase() : s.charAt(0).toUpperCase() + s.slice(1);
    }
    const transformedObj = {};
    const { destinationDefinition } = dest;
    Object.keys(dest).forEach((key) => {
      transformedObj[capitalize(key)] = dest[key];
    });

    const destDef = {};
    Object.keys(destinationDefinition).forEach((key) => {
      destDef[capitalize(key)] = destinationDefinition[key];
    });
    transformedObj['DestinationDefinition'] = destDef;
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
        const { message, destination, stage, libraries } = event;
        const ev = {
          message,
          destination: this.transformDestination(destination),
          libraries,
        };

        let response = {};
        let errorFound = false;

        if (stage.user_transform) {
          let librariesVersionIDs = [];
          if (event.libraries) {
            librariesVersionIDs = events[0].libraries.map((library) => library.versionId);
          }
          const transformationVersionId =
            ev.destination &&
            ev.destination['Transformations'] &&
            ev.destination['Transformations'][0] &&
            ev.destination['Transformations'][0].versionId;

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

              response['user_transformed_payload'] = userTransformedEvent.transformedEvent;
              ev.message = userTransformedEvent.transformedEvent;
            } catch (err: any) {
              errorFound = true;
              response['user_transformed_payload'] = {
                error: err.message || JSON.stringify(err),
              };
            }
          } else {
            response['user_transformed_payload'] = {
              error: 'Transformation VersionID not found',
            };
          }
        }

        if (stage.dest_transform) {
          if (!errorFound) {
            try {
              const desthandler = this.getDestHandler(version, dest);
              const transformedOutput = await desthandler.process(ev);
              if (Array.isArray(transformedOutput)) {
                response['dest_transformed_payload'] = transformedOutput;
              } else {
                response['dest_transformed_payload'] = [transformedOutput];
              }
            } catch (err: any) {
              errorFound = true;
              response['dest_transformed_payload'] = {
                error: err.message || JSON.stringify(err),
              };
            }
          } else {
            response['dest_transformed_payload'] = {
              error: 'error encountered in user_transformation stage. Aborting.',
            };
          }
        }
        // const transformerStatuses = [];
        if (stage.dest_transform && stage.send_to_destination) {
          // send event to destination only after transformation
          if (!errorFound) {
            const destResponses: any[] = [];
            const destResponseStatuses: any[] = [];

            const transformedPayloads = response['dest_transformed_payload'];
            // eslint-disable-next-line no-restricted-syntax
            for (const payload of transformedPayloads) {
              // eslint-disable-next-line no-await-in-loop
              const parsedResponse = await sendToDestination(dest, payload);

              let contentType = '';
              let response = '';
              if (parsedResponse.headers) {
                contentType = parsedResponse.headers['content-type'];
                if (this.isSupportedContentType(contentType)) {
                  response = parsedResponse.response;
                }
              } else if (parsedResponse.networkFailure) {
                response = parsedResponse.response;
              }

              destResponses.push(response);
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
            response['destination_response'] = {
              error: 'error encountered in dest_transformation stage. Aborting.',
            };
          }
        }
        respList.push(response);
      }),
    );
    return respList;
  }
}
