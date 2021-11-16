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
const samplePaylods = JSON.parse(fs.readFileSync("./samplePayloads.json"));
const dynamicFields = JSON.parse(fs.readFileSync("./dynamicFields.json"));

const testRouter = new Router({ prefix: "/test-router" });

const getDestHandler = (version, destination) => {
  return require(`./${version}/destinations/${destination}/transform`);
};

const getDestinations = () => {
  return fs.readdirSync(path.resolve(__dirname, version, "destinations"));
};

const handleDynamicFields = (destName, payload) => {
  const destFields = dynamicFields[destName];
  if (!destFields) {
    // no dynamic field for destination
    return payload;
  }
  Object.keys(destFields).forEach(key => {
    const keyFormat = destFields[key];
    switch (keyFormat) {
      case "unixTimestamp":
        payload[key] = Date.now();
        break;
      default:
        break;
    }
  });
  return payload;
};

const transformDestination = dest => {
  function capitalize(s) {
    return s === "id"
      ? s.toUpperCase()
      : s.charAt(0).toUpperCase() + s.slice(1);
  }
  const transformedObj = {};
  const { destinationDefinition } = dest;
  Object.keys(dest).forEach(key => {
    transformedObj[capitalize(key)] = dest[key];
  });

  const destDef = {};
  Object.keys(destinationDefinition).forEach(key => {
    destDef[capitalize(key)] = destinationDefinition[key];
  });
  transformedObj.DestinationDefinition = destDef;
  return transformedObj;
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
      ctx.set("apiVersion", API_VERSION);
      await Promise.all(
        events.map(async event => {
          const { message, destination, stage, libraries } = event;
          const updatedMessage = handleDynamicFields(
            destination.destinationDefinition.name,
            message
          );
          const ev = {
            message: updatedMessage,
            destination: transformDestination(destination),
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
              ev.destination &&
              ev.destination.Transformations &&
              ev.destination.Transformations[0] &&
              ev.destination.Transformations[0].versionId;

            if (transformationVersionId) {
              try {
                const destTransformedEvents = await userTransformHandler(
                  [ev],
                  transformationVersionId,
                  librariesVersionIDs
                );
                const userTransformedEvent = destTransformedEvents[0];
                if (userTransformedEvent.error) {
                  throw new Error(userTransformedEvent.error);
                }

                response.user_transformed_payload =
                  userTransformedEvent.transformedEvent;
                ev.message = userTransformedEvent.transformedEvent;
              } catch (err) {
                errorFound = true;
                response.user_transformed_payload = {
                  error: err.message || JSON.stringify(err)
                };
              }
            } else {
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
                if (Array.isArray(transformedOutput)) {
                  response.dest_transformed_payload = transformedOutput;
                } else {
                  response.dest_transformed_payload = [transformedOutput];
                }
              } catch (err) {
                // console.log("****ERR**********", err)
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
          if (stage.dest_transform && stage.dest_response) {
            // send event to destination only after transformation
            if (!errorFound) {
              const destResponses = [];
              const destResponseStatuses = [];
              const transformerMessages = [];
              const transformerStatuses = [];

              // let transformedPayloads;
              // console.log("DEST TRANSFORM", response.dest_transformed_payload);
              const transformedPayloads = response.dest_transformed_payload;
              // if (!Array.isArray(response.dest_transformed_payload)) {
              //   transformedPayloads = [response.dest_transformed_payload];
              // } else {
              //   transformedPayloads = response.dest_transformed_payload;
              // }
              // console.log("*******", JSON.stringify(transformedPayloads));
              // eslint-disable-next-line no-restricted-syntax
              for (const payload of transformedPayloads) {
                const ctxMock = {
                  request: {
                    body: {
                      ...payload
                    }
                  }
                };
                // eslint-disable-next-line no-await-in-loop
                await handleDestinationNetwork(version, dest, ctxMock);
                const { output } = ctxMock.body;
                // console.log("****OUTPUT*****", output)
                // handler for node sys error cases
                if (!output.destination) {
                  // console.log("*****OUTPUT******", output);
                  throw new Error(output.message);
                }
                destResponses.push(output.destination.data);
                destResponseStatuses.push(output.destination.status);
                transformerMessages.push(output.message);
                transformerStatuses.push(output.status);
              }
              response = {
                ...response,
                destination_response: destResponses,
                destination_response_status: destResponseStatuses,
                transformer_message: transformerMessages,
                transformer_status: transformerStatuses
              };
              // console.log("DEST_RESPONSE ", response)
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
      ctx.body = respList;
    } catch (err) {
      // fallback error response
      // console.log("******ERR CHECK****", err);
      ctx.body = {
        error: err.message || JSON.stringify(err)
      };
      ctx.status = 400;
    }
  });
});

testRouter.get(`/${version}/health`, ctx => {
  ctx.body = "OK";
});

testRouter.get(`/${version}/sample`, ctx => {
  const { dest } = ctx.request.query;
  // console.log("DESTINATION NAME", dest);
  if (!dest) {
    ctx.body = {
      error: "destination name not found"
    };
    ctx.status = 400;
    return ctx;
  }
  const destinationName = dest.trim().toUpperCase();
  if (!samplePaylods[destinationName]) {
    ctx.body = {
      error: `payload for ${dest} not found`
    };
    ctx.status = 400;
    return ctx;
  }
  ctx.body = samplePaylods[destinationName];
});

module.exports = { testRouter };
