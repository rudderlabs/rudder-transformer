/* eslint-disable import/no-dynamic-require */
/* eslint-disable global-require */
/* eslint-disable no-shadow */
const fs = require("fs");
const path = require("path");
const Router = require("koa-router");
const { handleDestinationNetwork } = require("./routerUtils");
const { userTransformHandler } = require("./util/customTransformer");

const version = "v0";
const API_VERSION = "1";

const testRouter = new Router({ prefix: "/test-router" });

const getDestHandler = (version, destination) => {
  return require(`./${version}/destinations/${destination}/transform`);
};

const getDestinations = () => {
  return fs.readdirSync(path.resolve(__dirname, version, "destinations"));
};

// Test Router request payload
// {
//   "events": [
//   {
//     "libraries": [...]
//     "message": {...},
//     "destination": {...},
//     "stage": {
//       "user_transform": true,
//       "dest_transform": true,
//       "dest_response": true
//     }
//   },
//   {...}
//   ]
// }

getDestinations().forEach(async dest => {
  testRouter.post(`/${version}/${dest}`, async ctx => {
    try {
      const { events } = ctx.request.body;
      if (!events || !Array.isArray(events)) {
        throw new Error("events array is required in payload");
      }
      const respList = [];
      await Promise.all(
        events.map(async event => {
          const { message, destination, stage, libraries } = event;
          const ev = {
            message,
            destination,
            libraries
          };

          let response = {};
          let errorFound = false;

          if (stage.user_transform) {
            let librariesVersionIDs = [];
            if (event.libraries) {
              librariesVersionIDs = events[0].libraries.map(
                library => library.versionId
              );
            }
            const transformationVersionId =
              event.destination &&
              event.destination.Transformations &&
              event.destination.Transformations[0] &&
              event.destination.Transformations[0].versionId;

            if (transformationVersionId) {
              try {
                const destTransformedEvents = await userTransformHandler(
                  [event],
                  transformationVersionId,
                  librariesVersionIDs
                );
                // console.log(destTransformedEvents);
                const { transformedEvent } = destTransformedEvents[0];
                response.user_transformed_payload = transformedEvent;
                // console.log(transformedEvent);
                ev.message = transformedEvent;
              } catch (err) {
                errorFound = true;
                // console.log(error);
                response.user_transformed_payload = {
                  error: err.message || JSON.stringify(err)
                };
              }
            } else {
              errorFound = true;
              response.user_transformed_payload = {
                error: "Transformation VersionID not found"
              };
            }
          }

          if (stage.dest_transform) {
            if (!errorFound) {
              try {
                const desthandler = getDestHandler(version, dest);
                const transformedOutput = await desthandler.process(ev);
                response.dest_transformed_payload = transformedOutput;
              } catch (err) {
                errorFound = true;
                response.dest_transformed_payload = {
                  error: err.message || JSON.stringify(err)
                };
              }
            } else {
              response.dest_transformed_payload = {
                error:
                  "error encountered in user_transformation stage. Aborting."
              };
            }
          }
          if (stage.dest_response) {
            if (!errorFound) {
              const ctxMock = {
                request: {
                  body: {
                    ...response.dest_transformed_payload
                  }
                }
              };
              await handleDestinationNetwork(version, dest, ctxMock);
              const { output } = ctxMock.body;
              response = {
                ...response,
                destination_response: output.destination.data,
                destination_response_status: output.destination.status
              };
            } else {
              response.destination_response = {
                error:
                  "error encountered in dest_transformation stage. Aborting."
              };
            }
          }
          respList.push(response);
        })
      );
      ctx.set("apiVersion", API_VERSION);
      ctx.body = respList;
    } catch (err) {
      // fallback error response
      ctx.body = {
        error: err.message || JSON.stringify(err)
      };
    }
  });
});

module.exports = { testRouter };
