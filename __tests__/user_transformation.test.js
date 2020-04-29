jest.mock("node-fetch");
const fetch = require("node-fetch", () => jest.fn());
const { Response } = jest.requireActual("node-fetch");

const integration = "user_transformation";
const name = "User Transformations";

const fs = require("fs");
const path = require("path");

describe("User transformation", () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });
  it(`Simple ${name} Test`, async () => {
    const inputDataFile = fs.readFileSync(
      path.resolve(__dirname, `./data/${integration}_input.json`)
    );
    const outputDataFile = fs.readFileSync(
      path.resolve(__dirname, `./data/${integration}_output.json`)
    );
    const { userTransformHandler } = require("../util/customTransformer");
    const respBody = {
      code: `function transform(events) {
            return events;
          }
          `,
    };
    fetch.mockReturnValueOnce(
      Promise.resolve(new Response(JSON.stringify(respBody)))
    );

    const inputData = JSON.parse(inputDataFile);
    const expectedData = JSON.parse(outputDataFile);
    const output = await userTransformHandler(inputData, 23);

    expect(fetch).toHaveBeenCalledTimes(1);
    expect(fetch).toHaveBeenCalledWith(
      "https://api.rudderlabs.com/transformation/getByVersionId?versionId=23"
    );

    expect(output).toEqual(expectedData);
  });

  it(`Filtering ${name} Test`, async () => {
    const inputDataFile = fs.readFileSync(
      path.resolve(__dirname, `./data/${integration}_filter_input.json`)
    );
    const outputDataFile = fs.readFileSync(
      path.resolve(__dirname, `./data/${integration}_filter_output.json`)
    );
    const { userTransformHandler } = require("../util/customTransformer");
    const respBody = {
      code: `function transform(events) {
                        let filteredEvents = events.filter(event => {
                          const eventType = event.type;
                          return eventType && eventType.match(/track/g);
                        });

                        filteredEvents = filteredEvents.map(event => {
                          const eventMetadata = metadata(event);
                          event.sourceId = eventMetadata.sourceId;
                          return event;
                        })
                        log(" -- Returning filtered events --");
                        log(filteredEvents);
                        return filteredEvents;
                      }
                      `,
    };
    fetch.mockReturnValue(
      Promise.resolve(new Response(JSON.stringify(respBody)))
    );
    const inputData = JSON.parse(inputDataFile);
    const expectedData = JSON.parse(outputDataFile);
    const output = await userTransformHandler(inputData, 24);

    expect(fetch).toHaveBeenCalledTimes(1);
    expect(fetch).toHaveBeenCalledWith(
      "https://api.rudderlabs.com/transformation/getByVersionId?versionId=24"
    );

    expect(output).toEqual(expectedData);
  });
});
