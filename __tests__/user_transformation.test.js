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
    const { userTransformHandler } = require("../util/customTransformer");
    const inputData = require(`./data/${integration}_input.json`);
    const expectedData = require(`./data/${integration}_output.json`);

    const respBody = {
      code: `
      import add from './add';
      import { sub, increment} from './math';
      import {max, min, find} from './lodash';
      export function transform(events) {
          const filteredEvents = events.map(event => {
            log("Sum is ", add(4,5));
            log("Diff is ", sub(4,5));
            log("lodash max iis ", max([34324,24324]))
            event.sum = add(4,5);
            event.diff = sub(4,5);
            event.inc = increment(22);
            event.max = max([2,3,5,6,7,8]);
            event.min = min([-2,3,5,6,7,8]);
            event.find = find([2,3,5,6,7,8],(x)=>x===6);
            return event;
          });
            return filteredEvents;
          }
          `
    };
    fetch.mockReturnValueOnce(
      Promise.resolve(new Response(JSON.stringify(respBody)))
    );

    const output = await userTransformHandler(inputData, 23);

    expect(fetch).toHaveBeenCalledTimes(1);
    expect(fetch).toHaveBeenCalledWith(
      "https://api.rudderlabs.com/transformation/getByVersionId?versionId=23"
    );

    expect(output).toEqual(expectedData);
  });

  it(`Filtering ${name} Test`, async () => {
    const { userTransformHandler } = require("../util/customTransformer");
    const inputData = require(`./data/${integration}_filter_input.json`);
    const expectedData = require(`./data/${integration}_filter_output.json`);

    const respBody = {
      code: `export function transform(events) {
                        let filteredEvents = events.filter(event => {
                          const eventType = event.type;
                          return eventType && eventType.match(/track/g);
                        });

                        filteredEvents = filteredEvents.map(event => {
                          const eventMetadata = metadata(event);
                          event.sourceId = eventMetadata.sourceId;
                          return event;
                        })
                        return filteredEvents;
                      }
                      `
    };
    fetch.mockReturnValue(
      Promise.resolve(new Response(JSON.stringify(respBody)))
    );
    const output = await userTransformHandler(inputData, 24);

    expect(fetch).toHaveBeenCalledTimes(1);
    expect(fetch).toHaveBeenCalledWith(
      "https://api.rudderlabs.com/transformation/getByVersionId?versionId=24"
    );

    expect(output).toEqual(expectedData);
  });
});
