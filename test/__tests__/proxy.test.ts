const name = 'Proxy';
import fs from 'fs';
import path from 'path';
import request from 'supertest';
import { createHttpTerminator } from 'http-terminator';
import { mockedAxiosClient } from '../__mocks__/network';
import Koa from 'koa';
import bodyParser from 'koa-bodyparser';
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

jest.mock('axios', () => jest.fn(mockedAxiosClient));

const version = '1';
const destinations = [
  'marketo',
  'braze',
  'pardot',
  'google_adwords_remarketing_lists',
  'google_adwords_enhanced_conversions',
  'facebook_pixel',
  'fb',
  'snapchat_custom_audience',
  'clevertap',
  'salesforce',
  'marketo_static_list',
  'criteo_audience',
  'tiktok_ads',
];

// start of generic tests
const inputDataFile = fs.readFileSync(path.resolve(__dirname, `./data/proxy_input.json`));
const outputDataFile = fs.readFileSync(path.resolve(__dirname, `./data/proxy_output.json`));
const inputData = JSON.parse(inputDataFile.toString());
const expectedData = JSON.parse(outputDataFile.toString());

inputData.forEach((input, index) => {
  it(`${name} Tests: payload - ${index}`, async () => {
    const response = await request(server)
      .post(`/${version}/destinations/any/proxy`)
      .set('Accept', 'application/json')
      .send(input);
    expect(response.body).toEqual(expectedData[index]);
  });
});
// end of generic tests

// destination tests start
destinations.forEach((destination) => {
  const inputDataFile = fs.readFileSync(
    path.resolve(__dirname, `./data/${destination}_proxy_input.json`),
  );
  const outputDataFile = fs.readFileSync(
    path.resolve(__dirname, `./data/${destination}_proxy_output.json`),
  );
  const inputData = JSON.parse(inputDataFile.toString());
  const expectedData = JSON.parse(outputDataFile.toString());

  describe(`Proxy Test for ${destination}`, () => {
    inputData.forEach((input, index) => {
      it(`${name} Tests: ${destination} - Payload ${index}`, async () => {
        const response = await request(server)
          .post(`/${version}/destinations/${destination}/proxy`)
          .set('Accept', 'application/json')
          .send(input);
        expect(response.body).toEqual(expectedData[index]);
      });
    });
  });
});
// destination tests end
