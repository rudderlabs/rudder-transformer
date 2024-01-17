const fs = require("fs");
const path = require("path");
const vRouter = require("../../src/legacy/router");

const version = "v0";
const integration = "marketo_bulk_upload";
const transformer = require(`../../src/${version}/destinations/${integration}/transform`);

jest.mock("axios");
let reqTransformBody;
let respTransformBody;
let respFileUploadBody;
let reqFileUploadBody;
let reqPollBody;
let respPollBody;
let reqJobStatusBody;
let respJobStatusBody;

try {
  reqTransformBody = JSON.parse(
    fs.readFileSync(path.resolve(__dirname, `./data/${integration}_input.json`))
  );
  respTransformBody = JSON.parse(
    fs.readFileSync(
      path.resolve(__dirname, `./data/${integration}_output.json`)
    )
  );
  reqFileUploadBody = JSON.parse(
    fs.readFileSync(
      path.resolve(__dirname, `./data/${integration}_fileUpload_input.json`)
    )
  );
  respFileUploadBody = JSON.parse(
    fs.readFileSync(
      path.resolve(__dirname, `./data/${integration}_fileUpload_output.json`)
    )
  );
  reqPollBody = JSON.parse(
    fs.readFileSync(
      path.resolve(__dirname, `./data/${integration}_poll_input.json`)
    )
  );
  respPollBody = JSON.parse(
    fs.readFileSync(
      path.resolve(__dirname, `./data/${integration}_poll_output.json`)
    )
  );
  reqJobStatusBody = JSON.parse(
    fs.readFileSync(
      path.resolve(__dirname, `./data/${integration}_jobStatus_input.json`)
    )
  );
  respJobStatusBody = JSON.parse(
    fs.readFileSync(
      path.resolve(__dirname, `./data/${integration}_jobStatus_output.json`)
    )
  );
} catch (error) {
  throw new Error("Could not read files." + error);
}

describe(`${integration}   Tests`, () => {
  describe("Transformer.js", () => {
    reqTransformBody.forEach(async (input, index) => {
      it(`Payload - ${index}`, async () => {
        try {
          const output = await transformer.process(input);
          expect(output).toEqual(respTransformBody[index]);
        } catch (error) {
          expect(error.message).toEqual(respTransformBody[index].error);
        }
      });
    });
  });

  describe("fileUpload.js", () => {
    reqFileUploadBody.forEach(async (input, index) => {
      it(`Payload - ${index}`, async () => {
        try {
          const output = await vRouter.fileUpload(input);
          expect(output).toEqual(respFileUploadBody[index]);
        } catch (error) {
          expect(error.message).toEqual(respFileUploadBody[index].error);
        }
      });
    });
  });

  describe("poll.js", () => {
    reqPollBody.forEach(async (input, index) => {
      it(`Payload - ${index}`, async () => {
        try {
          const output = await vRouter.pollStatus(input);
          expect(output).toEqual(respPollBody[index]);
        } catch (error) {
          expect(error.message).toEqual(respPollBody[index].error);
        }
      });
    });
  });

  describe("fetchJobStatus.js for warn", () => {
    reqJobStatusBody.forEach(async (input, index) => {
      it(`Payload - ${index}`, async () => {
        try {
          const output = await vRouter.getJobStatus(input, "warn");
          expect(output).toEqual(respJobStatusBody[0].data[index]);
        } catch (error) {
          expect(error.message).toEqual(respJobStatusBody[0].data[index].error);
        }
      });
    });
  });

  describe("fetchJobStatus.js for fail", () => {
    reqJobStatusBody.forEach(async (input, index) => {
      it(`Payload - ${index}`, async () => {
        try {
          const output = await vRouter.getJobStatus(input, "fail");
          expect(output).toEqual(respJobStatusBody[1].data[index]);
        } catch (error) {
          expect(error.message).toEqual(respJobStatusBody[1].data[index].error);
        }
      });
    });
  });
});
