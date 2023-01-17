jest.unmock("axios");
const axios = require("axios");
const fs = require("fs");
const path = require("path");

const BASE_URL = "http://localhost:9090";
const axiosClient = axios.create({
  baseURL: BASE_URL,
  timeout: 5000
});

const getDataFromPath = pathInput => {
  const testDataFile = fs.readFileSync(path.resolve(__dirname, pathInput));
  return JSON.parse(testDataFile);
};

describe("Basic route tests", () => {
  test("successful features response", async () => {
    const expectedData = JSON.parse(fs.readFileSync("features.json", "utf8"));
    const response = await axiosClient.get("/features");
    expect(response.status).toEqual(200);
    expect(response.data).toEqual(expectedData);
  });
});

describe("Destination api tests", () => {
  describe("Processor transform tests", () => {
    test("(webhook) success scenario with single event", async () => {
      const data = getDataFromPath(
        "./data_scenarios/destination/proc/sucess.json"
      );
      const response = await axiosClient.post(
        "/v0/destinations/webhook",
        data.input
      );
      expect(response.status).toEqual(200);
      expect(response.data).toEqual(data.output);
    });

    test("(webhook) failure scenario with single event config not containing webhook endpoint", async () => {
      const data = getDataFromPath(
        "./data_scenarios/destination/proc/failure.json"
      );
      const response = await axiosClient.post(
        "/v0/destinations/webhook",
        data.input
      );
      expect(response.status).toEqual(200);
      expect(response.data).toEqual(data.output);
    });

    test("(pinterest) success scenario with multiplex events", async () => {
      const data = getDataFromPath(
        "./data_scenarios/destination/proc/multiplex_success.json"
      );
      const response = await axiosClient.post(
        "/v0/destinations/pinterest_tag",
        data.input
      );
      expect(response.status).toEqual(200);
      expect(response.data).toEqual(data.output);
    });

    test("(pinterest) failure scneario for multiplex but event fails at validation", async () => {
      const data = getDataFromPath(
        "./data_scenarios/destination/proc/multiplex_failure.json"
      );
      const response = await axiosClient.post(
        "/v0/destinations/pinterest_tag",
        data.input
      );
      expect(response.status).toEqual(200);
      expect(response.data).toEqual(data.output);
    });

    test("(webhook) success snceario for batch of input", async () => {
      const data = getDataFromPath(
        "./data_scenarios/destination/proc/batch_input.json"
      );
      const response = await axiosClient.post(
        "/v0/destinations/webhook",
        data.input
      );
      expect(response.status).toEqual(200);
      expect(response.data).toEqual(data.output);
    });

    test("(webhook) success snceario for batch of input of 2 events and expect 3 output events", async () => {
      const data = getDataFromPath(
        "./data_scenarios/destination/proc/batch_input_multiplex.json"
      );
      const response = await axiosClient.post(
        "/v0/destinations/pinterest_tag",
        data.input
      );
      expect(response.status).toEqual(200);
      expect(response.data).toEqual(data.output);
    });

    test("(pinterest) partial success scenario for multiplex with 2 events and expect 3 output events with 3rd one failing", async () => {
      const data = getDataFromPath(
        "./data_scenarios/destination/proc/multiplex_partial_failure.json"
      );
      const response = await axiosClient.post(
        "/v0/destinations/pinterest_tag",
        data.input
      );
      expect(response.status).toEqual(200);
      expect(response.data).toEqual(data.output);
    });
  });

  describe("Batch transform tests", () => {
    test("(am) successful batch transform", async () => {
      const data = getDataFromPath(
        "./data_scenarios/destination/batch/successful_batch.json"
      );
      const response = await axiosClient.post("/batch", data.input);
      expect(response.status).toEqual(200);
      expect(response.data).toEqual(data.output);
    });

    test("(am) failure batch transform", async () => {
      const data = getDataFromPath(
        "./data_scenarios/destination/batch/failure_batch.json"
      );
      const response = await axiosClient.post("/batch", data.input);
      expect(response.status).toEqual(200);
      expect(response.data).toEqual(data.output);
    });
  });

  describe("Router transform tests", () => {
    test("(webhook) successful router transform", async () => {
      const data = getDataFromPath(
        "./data_scenarios/destination/router/successful_test.json"
      );
      const response = await axiosClient.post("/routerTransform", data.input);
      expect(response.status).toEqual(200);
      expect(response.data).toEqual(data.output);
    });
    test("(pinterest_tag) failure router transform(partial failure", async () => {
      const data = getDataFromPath(
        "./data_scenarios/destination/router/failure_test.json"
      );
      const response = await axiosClient.post("/routerTransform", data.input);
      expect(response.status).toEqual(200);
      expect(response.data).toEqual(data.output);
    });

    test("(webhook) send events for 2 destinations router transform", async () => {
      const data = getDataFromPath(
        "./data_scenarios/destination/router/two_destination_test.json"
      );
      const response = await axiosClient.post("/routerTransform", data.input);
      expect(response.status).toEqual(200);
      expect(response.data).toEqual(data.output);
    });
  });
});

describe("Source api tests", () => {
  test("(shopify) successful source transform", async () => {
    const data = getDataFromPath("./data_scenarios/source/successful.json");
    const response = await axiosClient.post("/v0/sources/shopify", data.input);
    delete response.data[0].output.batch[0].anonymousId;
    expect(response.status).toEqual(200);
    expect(response.data).toEqual(data.output);
  });

  test("(shopify) failure source transform (shopify)", async () => {
    const data = getDataFromPath("./data_scenarios/source/failure.json");
    const response = await axiosClient.post("/v0/sources/shopify", data.input);
    expect(response.status).toEqual(200);
    expect(response.data).toEqual(data.output);
  });

  test("(shopify) success source transform (monday)", async () => {
    const data = getDataFromPath(
      "./data_scenarios/source/response_to_caller.json"
    );
    const response = await axiosClient.post("/v0/sources/monday", data.input);
    expect(response.status).toEqual(200);
    expect(response.data).toEqual(data.output);
  });
});

describe("CDK V1 api tests", () => {
  test("(zapier) successful transform", async () => {
    const data = getDataFromPath("./data_scenarios/cdk_v1/success.json");
    const response = await axiosClient.post(
      "/v0/destinations/zapier",
      data.input
    );
    expect(response.status).toEqual(200);
    expect(response.data).toEqual(data.output);
  });

  test("(zapier) failure transform", async () => {
    const data = getDataFromPath("./data_scenarios/cdk_v1/failure.json");
    const response = await axiosClient.post(
      "/v0/destinations/zapier",
      data.input
    );
    expect(response.status).toEqual(200);
    expect(response.data).toEqual(data.output);
  });
});

describe("CDK V2 api tests", () => {
  test("(pinterest_tag) successful transform", async () => {
    const data = getDataFromPath("./data_scenarios/cdk_v2/success.json");
    const response = await axiosClient.post(
      "/v0/destinations/pinterest_tag",
      data.input
    );
    expect(response.status).toEqual(200);
    expect(response.data).toEqual(data.output);
  });

  test("(pinterest_tag) partial failure scenario", async () => {
    const data = getDataFromPath("./data_scenarios/cdk_v2/failure.json");
    const response = await axiosClient.post(
      "/v0/destinations/pinterest_tag",
      data.input
    );
    expect(response.status).toEqual(200);
    expect(response.data).toEqual(data.output);
  });
});
