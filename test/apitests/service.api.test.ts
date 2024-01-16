import fs from 'fs';
import path from 'path';
import request from 'supertest';
import { createHttpTerminator } from 'http-terminator';
import Koa from 'koa';
import bodyParser from 'koa-bodyparser';
import setValue from 'set-value';
import { applicationRoutes } from '../../src/routes';

let server: any;
const OLD_ENV = process.env;

beforeAll(async () => {
  process.env = { ...OLD_ENV }; // Make a copy
  const app = new Koa();
  app.use(
    bodyParser({
      jsonLimit: '200mb',
    }),
  );
  applicationRoutes(app);
  server = app.listen(9090);
});

afterAll(async () => {
  process.env = OLD_ENV; // Restore old environment
  const httpTerminator = createHttpTerminator({
    server,
  });
  await httpTerminator.terminate();
});

const getDataFromPath = (pathInput) => {
  const testDataFile = fs.readFileSync(path.resolve(__dirname, pathInput));
  return JSON.parse(testDataFile.toString());
};

describe('features tests', () => {
  test('successful features response', async () => {
    const expectedData = JSON.parse(
      fs.readFileSync(path.resolve(__dirname, '../../src/features.json'), 'utf8'),
    );
    const response = await request(server).get('/features');
    expect(response.status).toEqual(200);
    expect(JSON.parse(response.text)).toEqual(expectedData);
  });

  test('features regulations should be array', async () => {
    const response = await request(server).get('/features');
    expect(response.status).toEqual(200);
    const regulations = JSON.parse(response.text).regulations;
    expect(Array.isArray(regulations)).toBeTruthy();
  });

  test('features routerTransform should be object', async () => {
    const response = await request(server).get('/features');
    expect(response.status).toEqual(200);
    const routerTransform = JSON.parse(response.text).routerTransform;
    expect(Array.isArray(routerTransform)).toBeFalsy();
    expect(typeof routerTransform).toBe('object');
    expect(Object.keys(routerTransform).length).toBeGreaterThan(0);
  });

  test('features supportSourceTransformV1 to be boolean', async () => {
    const response = await request(server).get('/features');
    expect(response.status).toEqual(200);
    const supportSourceTransformV1 = JSON.parse(response.text).supportSourceTransformV1;
    expect(typeof supportSourceTransformV1).toBe('boolean');
  });

  test('features supportTransformerProxyV1 to be boolean', async () => {
    const response = await request(server).get('/features');
    expect(response.status).toEqual(200);
    const supportTransformerProxyV1 = JSON.parse(response.text).supportTransformerProxyV1;
    expect(typeof supportTransformerProxyV1).toBe('boolean');
  });
});

describe('Destination api tests', () => {
  describe('Processor transform tests', () => {
    test('(webhook) success scenario with single event', async () => {
      const data = getDataFromPath('./data_scenarios/destination/proc/sucess.json');
      const response = await request(server)
        .post('/v0/destinations/webhook')
        .set('Accept', 'application/json')
        .send(data.input);
      expect(response.status).toEqual(200);
      expect(JSON.parse(response.text)).toEqual(data.output);
    });

    test('(webhook) failure scenario with single event config not containing webhook endpoint', async () => {
      const data = getDataFromPath('./data_scenarios/destination/proc/failure.json');
      const response = await request(server)
        .post('/v0/destinations/webhook')
        .set('Accept', 'application/json')
        .send(data.input);
      expect(response.status).toEqual(200);
      expect(JSON.parse(response.text)).toEqual(data.output);
    });

    test('(pinterest) success scenario with multiplex events', async () => {
      const data = getDataFromPath('./data_scenarios/destination/proc/multiplex_success.json');
      const response = await request(server)
        .post('/v0/destinations/pinterest_tag')
        .set('Accept', 'application/json')
        .send(data.input);
      expect(response.status).toEqual(200);
      expect(JSON.parse(response.text)).toEqual(data.output);
    });

    test('(pinterest) failure scneario for multiplex but event fails at validation', async () => {
      const data = getDataFromPath('./data_scenarios/destination/proc/multiplex_failure.json');
      const response = await request(server)
        .post('/v0/destinations/pinterest_tag')
        .set('Accept', 'application/json')
        .send(data.input);
      expect(response.status).toEqual(200);
      expect(JSON.parse(response.text)).toEqual(data.output);
    });

    test('(webhook) success snceario for batch of input', async () => {
      const data = getDataFromPath('./data_scenarios/destination/proc/batch_input.json');
      const response = await request(server)
        .post('/v0/destinations/webhook')
        .set('Accept', 'application/json')
        .send(data.input);
      expect(response.status).toEqual(200);
      expect(JSON.parse(response.text)).toEqual(data.output);
    });

    test('(webhook) success snceario for batch of input of 2 events and expect 3 output events', async () => {
      const data = getDataFromPath('./data_scenarios/destination/proc/batch_input_multiplex.json');
      const response = await request(server)
        .post('/v0/destinations/pinterest_tag')
        .set('Accept', 'application/json')
        .send(data.input);
      expect(response.status).toEqual(200);
      expect(JSON.parse(response.text)).toEqual(data.output);
    });

    test('(pinterest) partial success scenario for multiplex with 2 events and expect 3 output events with 3rd one failing', async () => {
      const data = getDataFromPath(
        './data_scenarios/destination/proc/multiplex_partial_failure.json',
      );
      const response = await request(server)
        .post('/v0/destinations/pinterest_tag')
        .set('Accept', 'application/json')
        .send(data.input);
      expect(response.status).toEqual(200);
      expect(JSON.parse(response.text)).toEqual(data.output);
    });
  });

  describe('Batch transform tests', () => {
    test('(am) successful batch transform', async () => {
      const data = getDataFromPath('./data_scenarios/destination/batch/successful_batch.json');
      const response = await request(server)
        .post('/batch')
        .set('Accept', 'application/json')
        .send(data.input);
      expect(response.status).toEqual(200);
      expect(JSON.parse(response.text)).toEqual(data.output);
    });

    test('(am) failure batch transform', async () => {
      const data = getDataFromPath('./data_scenarios/destination/batch/failure_batch.json');
      const response = await request(server)
        .post('/batch')
        .set('Accept', 'application/json')
        .send(data.input);
      expect(response.status).toEqual(200);
      expect(JSON.parse(response.text)).toEqual(data.output);
    });
  });

  describe('Router transform tests', () => {
    test('(webhook) successful router transform', async () => {
      const data = getDataFromPath('./data_scenarios/destination/router/successful_test.json');
      const response = await request(server)
        .post('/routerTransform')
        .set('Accept', 'application/json')
        .send(data.input);
      expect(response.status).toEqual(200);
      expect(JSON.parse(response.text)).toEqual(data.output);
    });
    test('(pinterest_tag) failure router transform(partial failure)', async () => {
      const data = getDataFromPath('./data_scenarios/destination/router/failure_test.json');
      const response = await request(server)
        .post('/routerTransform')
        .set('Accept', 'application/json')
        .send(data.input);
      expect(response.status).toEqual(200);
      expect(JSON.parse(response.text)).toEqual(data.output);
    });

    test('(webhook) send events for 2 destinations router transform', async () => {
      const data = getDataFromPath('./data_scenarios/destination/router/two_destination_test.json');
      const response = await request(server)
        .post('/routerTransform')
        .set('Accept', 'application/json')
        .send(data.input);
      expect(response.status).toEqual(200);
      expect(JSON.parse(response.text)).toEqual(data.output);
    });
  });
});

describe('Source api tests', () => {
  test('(shopify) successful source transform', async () => {
    const data = getDataFromPath('./data_scenarios/source/v0/successful.json');
    const response = await request(server)
      .post('/v0/sources/shopify')
      .set('Accept', 'application/json')
      .send(data.input);
    const parsedResp = JSON.parse(response.text);
    delete parsedResp[0].output.batch[0].anonymousId;
    expect(response.status).toEqual(200);
    expect(parsedResp).toEqual(data.output);
  });

  test('(shopify) failure source transform (shopify)', async () => {
    const data = getDataFromPath('./data_scenarios/source/v0/failure.json');
    const response = await request(server)
      .post('/v0/sources/shopify')
      .set('Accept', 'application/json')
      .send(data.input);
    expect(response.status).toEqual(200);
    expect(JSON.parse(response.text)).toEqual(data.output);
  });

  test('(shopify) success source transform (monday)', async () => {
    const data = getDataFromPath('./data_scenarios/source/v0/response_to_caller.json');
    const response = await request(server)
      .post('/v0/sources/monday')
      .set('Accept', 'application/json')
      .send(data.input);
    expect(response.status).toEqual(200);
    expect(JSON.parse(response.text)).toEqual(data.output);
  });

  test('(webhook) successful source transform for source present in v1 and server providing v0 endpoint', async () => {
    const data = getDataFromPath('./data_scenarios/source/v1/successful.json');
    const response = await request(server)
      .post('/v1/sources/webhook')
      .set('Accept', 'application/json')
      .send(data.input);
    const parsedResp = JSON.parse(response.text);
    delete parsedResp[0].output.batch[0].anonymousId;
    expect(response.status).toEqual(200);
    expect(parsedResp).toEqual(data.output);
  });

  test('(NA_SOURCE) failure source transform ', async () => {
    const data = getDataFromPath('./data_scenarios/source/v1/failure.json');
    const response = await request(server)
      .post('/v0/sources/NA_SOURCE')
      .set('Accept', 'application/json')
      .send(data.input);
    expect(response.status).toEqual(200);
    expect(JSON.parse(response.text)).toEqual(data.output);
  });

  test('(pipedream) success source transform for source present in v0 and server providing v1 endpoint', async () => {
    const data = getDataFromPath('./data_scenarios/source/v1/pipedream.json');
    const response = await request(server)
      .post('/v1/sources/pipedream')
      .set('Accept', 'application/json')
      .send(data.input);
    expect(response.status).toEqual(200);
    expect(JSON.parse(response.text)).toEqual(data.output);
  });
});

describe('CDK V1 api tests', () => {
  test('(zapier) successful transform', async () => {
    const data = getDataFromPath('./data_scenarios/cdk_v1/success.json');
    const response = await request(server)
      .post('/v0/destinations/zapier')
      .set('Accept', 'application/json')
      .send(data.input);
    expect(response.status).toEqual(200);
    expect(JSON.parse(response.text)).toEqual(data.output);
  });

  test('(zapier) failure transform', async () => {
    const data = getDataFromPath('./data_scenarios/cdk_v1/failure.json');
    const response = await request(server)
      .post('/v0/destinations/zapier')
      .set('Accept', 'application/json')
      .send(data.input);
    expect(response.status).toEqual(200);
    expect(JSON.parse(response.text)).toEqual(data.output);
  });
});

describe('CDK V2 api tests', () => {
  test('(pinterest_tag) successful transform', async () => {
    const data = getDataFromPath('./data_scenarios/cdk_v2/success.json');
    const response = await request(server)
      .post('/v0/destinations/pinterest_tag')
      .set('Accept', 'application/json')
      .send(data.input);
    expect(response.status).toEqual(200);
    expect(JSON.parse(response.text)).toEqual(data.output);
  });

  test('(pinterest_tag) partial failure scenario', async () => {
    const data = getDataFromPath('./data_scenarios/cdk_v2/failure.json');
    const response = await request(server)
      .post('/v0/destinations/pinterest_tag')
      .set('Accept', 'application/json')
      .send(data.input);
    expect(response.status).toEqual(200);
    expect(JSON.parse(response.text)).toEqual(data.output);
  });
});

jest.setTimeout(100000);
describe('Comparsion service tests', () => {
  test('compare cdk v2 and native', async () => {
    process.env.COMPARATOR_ENABLED = 'true';
    const data = getDataFromPath('./data_scenarios/cdk_v2/success.json');
    data.input.forEach((input) => {
      setValue(input, 'destination.DestinationDefinition.Config.comparisonTestEnabeld', true);
      setValue(input, 'destination.DestinationDefinition.Config.comparisonService', 'native_dest');
    });
    const response = await request(server)
      .post('/v0/destinations/pinterest_tag')
      .set('Accept', 'application/json')
      .send(data.input);
    expect(response.status).toEqual(200);
    expect(JSON.parse(response.text)).toEqual(data.output);
  });

  test('compare native and cdk v2', async () => {
    process.env.COMPARATOR_ENABLED = 'true';
    const data = getDataFromPath('./data_scenarios/destination/router/successful_test.json');
    data.input.input.forEach((input) => {
      setValue(input, 'destination.DestinationDefinition.Config.comparisonTestEnabeld', true);
      setValue(input, 'destination.DestinationDefinition.Config.comparisonService', 'cdkv2_dest');
    });
    data.output.output.forEach((output) => {
      setValue(output, 'destination.DestinationDefinition.Config.comparisonTestEnabeld', true);
      setValue(output, 'destination.DestinationDefinition.Config.comparisonService', 'cdkv2_dest');
    });
    const response = await request(server)
      .post('/routerTransform')
      .set('Accept', 'application/json')
      .send(data.input);
    expect(response.status).toEqual(200);
    expect(JSON.parse(response.text)).toEqual(data.output);
  });
});
