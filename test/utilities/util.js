import { getDestHandler } from "../../src/versionedRouter";
const supertest = require("supertest");

const app = require("../app");

const version = "v0";

const destRoutePath = `/${version}/destinations/`;
const sourceRoutePath = `/${version}/sources/`;

const executeTests = (dataPoint, index) => {
  switch (dataPoint.testType) {
    case "proc_tf":
      it(`${index}. ${dataPoint.destinationName} destination (proc_tf) tests - ${dataPoint.description}`, async () => {
        let response = await supertest(app.callback())
          .post(`${destRoutePath}${dataPoint.destinationName}`)
          .send(dataPoint.input);
        expect(response.statusCode).toBe(200);
        response = JSON.parse(response.text);
        expect(response[0].error ? response[0] : response[0].output).toEqual(
          dataPoint.output
        );
      });
      break;
    case "router_tf":
      it(`${index}. ${dataPoint.destinationName} destination (router_tf) tests -`, async () => {
        let response = await supertest(app.callback())
          .post(`/routerTransform`)
          .send(dataPoint.input);
        expect(response.statusCode).toBe(200);
        response = JSON.parse(response.text);
        expect(response.output).toEqual(dataPoint.output);
      });
      break;
    case "source_tf":
      it(`${index}. ${dataPoint.sourceName} Source Tests: payload: ${index}`, async () => {
        let response = await supertest(app.callback())
          .post(`${sourceRoutePath}${dataPoint.sourceName}`)
          .send(dataPoint.input);
        expect(response.statusCode).toBe(200);
        response = JSON.parse(response.text);
        console.log(`source: ${response}`);
        expect(response[0].error ? response[0] : response[0].output).toEqual(
          dataPoint.output
        );
      });
      break;
    default:
      break;
  }
};

module.exports = {
  executeTests
};
