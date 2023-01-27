/* eslint-disable camelcase */
/* eslint-disable import/no-dynamic-require */
/* eslint-disable global-require */
/* eslint-disable no-shadow */
const fs = require('fs');
const path = require('path');
const Router = require('koa-router');
const { sendToDestination, userTransformHandler } = require('./routerUtils');

const version = 'v0';
const API_VERSION = '1';

const isSupportedContentType = (contentType) => {
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
};

const testRouter = new Router({ prefix: '/test-router' });

const getDestHandler = (version, destination) =>
  require(`./${version}/destinations/${destination}/transform`);

const getDestinations = () => fs.readdirSync(path.resolve(__dirname, version, 'destinations'));

const transformDestination = (dest) => {
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
  transformedObj.DestinationDefinition = destDef;
  return transformedObj;
};

const handleTestEvent = async (ctx, dest) => {
  try {
    const { events } = ctx.request.body;
    if (!events || !Array.isArray(events)) {
      throw new Error('events array is required in payload');
    }
    const respList = [];
    ctx.set('apiVersion', API_VERSION);
    await Promise.all(
      events.map(async (event) => {
        const { message, destination, stage, libraries } = event;
        const ev = {
          message,
          destination: transformDestination(destination),
          libraries,
        };

        let response = {};
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
            } catch (err) {
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
              const desthandler = getDestHandler(version, dest);
              const transformedOutput = await desthandler.process(ev);
              if (Array.isArray(transformedOutput)) {
                response.dest_transformed_payload = transformedOutput;
              } else {
                response.dest_transformed_payload = [transformedOutput];
              }
            } catch (err) {
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
            const destResponses = [];
            const destResponseStatuses = [];

            const transformedPayloads = response.dest_transformed_payload;
            // eslint-disable-next-line no-restricted-syntax
            for (const payload of transformedPayloads) {
              // eslint-disable-next-line no-await-in-loop
              const parsedResponse = await sendToDestination(dest, payload);

              let contentType = '';
              let response = '';
              if (parsedResponse.headers) {
                contentType = parsedResponse.headers['content-type'];
                if (isSupportedContentType(contentType)) {
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
            response.destination_response = {
              error: 'error encountered in dest_transformation stage. Aborting.',
            };
          }
        }
        respList.push(response);
      }),
    );
    ctx.body = respList;
  } catch (err) {
    // fail-safety error response
    ctx.body = {
      error: err.message || JSON.stringify(err),
    };
    ctx.status = 400;
  }
};

getDestinations().forEach(async (destination) => {
  testRouter.post(`/${version}/${destination}`, async (ctx) => {
    await handleTestEvent(ctx, destination);
    return ctx;
  });
});

testRouter.get(`/${version}/health`, (ctx) => {
  ctx.body = 'OK';
});

module.exports = { testRouter, handleTestEvent };
