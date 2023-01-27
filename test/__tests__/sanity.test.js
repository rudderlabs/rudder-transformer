jest.mock("axios");
const name = "Sanity";
const fs = require("fs");
const path = require("path");
const version = "v0";
const { getDirectories } = require("./util");
const { mockaxios } = require("../__mocks__/network");

// ********************************
// Getting Started
// ********************************
// sanity-folder-structure
//  __tests__
//  |
//  |--sanity.test.js
//  |--data
//  |   |
//  |   |--sanity
//  |       |
//  |       {integration(s)}_output.json
//  |       {integration(s)}_router_output.json
//  |       sanity_input.json
//  |       sanity_router_input.json
//  |       destination_config.json

// ------ destination_config.json ------
// JSON to store the destination-config of all the destinations
// Each destination-config object has a config object storing the
// processor/ router (transform-at) configs
// -------------------------------------
// If transformation is only done at processor
// only use the processor as key and store the
// destination definition as value.
//
// Format :
//  {
//   "clevertap": {
//     "config": {
//       "processor": { ...destination_definition },
//       "router": { ...destination_definition  }
//     }
//   }
//    ..
//    ..
// }

//  ----- sanity_input.json -----
// JSON to store the sanity input messages which will be
// used to test sanity for all the destination.
//
// Format:
// {
//    "messages": [
//          { sanity_input_message_1},
//          { sanity_input_message_2},
//          { sanity_input_message_3}
//          ...
//      ]
// }

//  ----- sanity_router_input.json -----
// JSON to store the sanity input messages which will be
// used to test sanity for all the destination.
// These inputs will be used for testing router
// transformation for all destination which support it.
//
// Format:
// {
//    "messages": [
//          { router_sanity_input_message_1},
//          { router_sanity_input_message_2},
//          { router_sanity_input_message_3}
//          ...
//      ]
// }

//  ------ {integration(s)}_output.json ------
// These are specific output for each of the destinations
// given the sanity input. We are using jest result matcher
// to check if the output is matching with the expected output.
// Example clevertap_output.json
// Format:
// [
//   {sanity_output_for_message_1},
//   {sanity_output_for_message_2},
//   ..
// ]

//  ------ {integration(s)}_router_output.json ------
// These are specific output for each of the destinations
// given the router sanity input.
// ** CHECK IF THE PARTICULAR DESTINATION SUPPORTS ROUTER TRANSFORMATION **
// Example clevertap_router_output.json
// Format:
// [
//   {router_sanity_output_for_message_1},
//   {router_sanity_output_for_message_2},
//   ..
// ]

// Parsing all the destination names from /v0/destinations dir structure
// parsing it into an array of string. This keeping the destinations to test
// dynamic.
// const integrations = getDirectories(
//   path.resolve(__dirname, `../${version}/destinations/`)
// );
// For Testing Current:
// Uncomment this Line and comment the above 3 lines
const integrations = ["marketo"];

// Parsing the sanity input JSON which will be used for testing each destination
const processorSanityInput = JSON.parse(
  fs.readFileSync(path.resolve(__dirname, `./data/sanity/sanity_input.json`))
);

// Parsing the sanity router input JSON which will be used for testing each destination
// which support it
const routerSanityInputRouter = JSON.parse(
  fs.readFileSync(
    path.resolve(__dirname, `./data/sanity/sanity_router_input.json`)
  )
);
// Parsing the destination config JSON from which we will get the destination definitions
// along with if the destination supports router-transformation
const destinationConfig = JSON.parse(
  fs.readFileSync(
    path.resolve(__dirname, `./data/sanity/destination_config.json`)
  )
);

// Iterating each of the destinations
integrations.forEach(intg => {
  // Getting the transformation object
  const transformer = require(`../../src/${version}/destinations/${intg}/transform`);
  // Getting the config for this particular destination
  const { config } = destinationConfig[`${intg}`];
  // Where the ransformation is done at (processor, router ..)
  Object.keys(config).forEach(processAt => {
    // Depending on the case
    switch (processAt) {
      case "processor":
        {
          // Parsing the expected data for this particular destination
          const expectedData = JSON.parse(
            fs.readFileSync(
              path.resolve(__dirname, `./data/sanity/${intg}_output.json`)
            )
          );
          // For each of the messages we are processing using the transformer
          processorSanityInput.messages.forEach((message, index) => {
            // Building the event object with specified destination-definition
            const event = {
              message,
              destination: config[`${processAt}`]
            };
            // Sending the event to transformer and matching the result with expected output
            it(`${name} - integration[Processor]: ${intg} payload:${index}`, async () => {
              try {
                const output = await transformer.process(event);
                expect(output).toEqual(expectedData[index]);
              } catch (error) {
                expect(error.message).toEqual(expectedData[index].error);
              }
            });
          });
        }
        break;

      case "router":
        {
          // Parsing the expected router output data for this particular destination
          const expectedData = JSON.parse(
            fs.readFileSync(
              path.resolve(
                __dirname,
                `./data/sanity/${intg}_router_output.json`
              )
            )
          );
          // For each of the messages we are processing using the router transformer
          routerSanityInputRouter.messages.forEach((message, index) => {
            // Building the event object with specified destination-definition
            const events = [
              {
                message,
                metadata: {
                  jobId: 1
                },
                destination: config[`${processAt}`]
              }
            ];
            // Sending the event to router transformer of this destinationand matching the result with expected output
            it(`${name} - integration(Router): ${intg} payload:${index}`, async () => {
              const routerOutput = await transformer.processRouterDest(events);
              expect(routerOutput[0]).toEqual(expectedData[index]);
            });
          });
        }
        break;
      default:
        throw new Error("Undefined Transform-At Config");
    }
  });
});
