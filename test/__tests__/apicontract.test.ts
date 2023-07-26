import fs from 'fs';
import path from 'path';
import request from 'supertest';
import { createHttpTerminator } from 'http-terminator';
import Koa from 'koa';
import bodyParser from 'koa-bodyparser';
import { applicationRoutes } from '../../src/routes';
import min from 'lodash/min';

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

const integrations = {
  ACTIVE_CAMPAIGN: 'active_campaign',
  ALGOLIA: 'algolia',
  CANDU: 'candu',
  DELIGHTED: 'delighted',
  DRIP: 'drip',
  FB_CUSTOM_AUDIENCE: 'fb_custom_audience',
  GA: 'ga',
  GAINSIGHT: 'gainsight',
  GAINSIGHT_PX: 'gainsight_px',
  GOOGLESHEETS: 'googlesheets',
  GOOGLE_ADWORDS_ENHANCED_CONVERSIONS: 'google_adwords_enhanced_conversions',
  GOOGLE_ADWORDS_REMARKETING_LISTS: 'google_adwords_remarketing_lists',
  GOOGLE_ADWORDS_OFFLINE_CONVERSIONS: 'google_adwords_offline_conversions',
  HS: 'hs',
  ITERABLE: 'iterable',
  KLAVIYO: 'klaviyo',
  KUSTOMER: 'kustomer',
  MAILCHIMP: 'mailchimp',
  MAILMODO: 'mailmodo',
  MARKETO: 'marketo',
  OMETRIA: 'ometria',
  PARDOT: 'pardot',
  PINTEREST_TAG: 'pinterest_tag',
  PROFITWELL: 'profitwell',
  SALESFORCE: 'salesforce',
  SFMC: 'sfmc',
  SNAPCHAT_CONVERSION: 'snapchat_conversion',
  TIKTOK_ADS: 'tiktok_ads',
  TRENGO: 'trengo',
  YAHOO_DSP: 'yahoo_dsp',
  CANNY: 'canny',
  LAMBDA: 'lambda',
  WOOTRIC: 'wootric',
  GOOGLE_CLOUD_FUNCTION: 'google_cloud_function',
  BQSTREAM: 'bqstream',
  CLICKUP: 'clickup',
  FRESHMARKETER: 'freshmarketer',
  FRESHSALES: 'freshsales',
  MONDAY: 'monday',
  CUSTIFY: 'custify',
  USER: 'user',
  REFINER: 'refiner',
  FACEBOOK_OFFLINE_CONVERSIONS: 'facebook_offline_conversions',
  MAILJET: 'mailjet',
  SNAPCHAT_CUSTOM_AUDIENCE: 'snapchat_custom_audience',
  MARKETO_STATIC_LIST: 'marketo_static_list',
  CAMPAIGN_MANAGER: 'campaign_manager',
  SENDGRID: 'sendgrid',
  SENDINBLUE: 'sendinblue',
  ZENDESK: 'zendesk',
  MP: 'mp',
  TIKTOK_ADS_OFFLINE_EVENTS: 'tiktok_ads_offline_events',
  CRITEO_AUDIENCE: 'criteo_audience',
  CUSTOMERIO: 'customerio',
  BRAZE: 'braze',
  OPTIMIZELY_FULLSTACK: 'optimizely_fullstack',
  TWITTER_ADS: 'twitter_ads',
};

const features = getDataFromPath('../../src/features.json');
let allIntegrations: string[] = [];
Object.keys(features.routerTransform).forEach((feature) => {
  allIntegrations.push(integrations[feature]);
});

console.log(allIntegrations);

const assertRouterOutput = (routerOutput, inputData) => {
  const returnedJobids = {};
  routerOutput.forEach((outEvent) => {
    //Assert that metadata is present and is an array
    const metadata = outEvent.metadata;
    expect(Array.isArray(metadata)).toEqual(true);

    //Assert that statusCode is present and is a number between 200 and 600
    const statusCode = outEvent.statusCode;
    expect(statusCode).toBeDefined();
    expect(typeof statusCode === 'number').toEqual(true);
    const validStatusCode = statusCode >= 200 && statusCode < 600;
    expect(validStatusCode).toEqual(true);

    //Assert that every job_id in the input is present in the output one and only one time.
    metadata.forEach((meta) => {
      const jobId = meta.jobId;
      expect(returnedJobids[jobId]).toBeUndefined();
      returnedJobids[jobId] = true;
    });
  });

  const inputJobids = {};
  inputData.input.forEach((input) => {
    const jobId = input.metadata.jobId;
    inputJobids[jobId] = true;
  });

  expect(returnedJobids).toEqual(inputJobids);

  if (inputData.order) {
    routerOutput.sort((a, b) => {
      const aMin = min(a.metadata.map((meta) => meta.jobId));
      const bMin = min(b.metadata.map((meta) => meta.jobId));
      return aMin - bMin;
    });

    let userIdJobIdMap = {};
    routerOutput.forEach((outEvent) => {
      const metadata = outEvent.metadata;
      metadata.forEach((meta) => {
        const jobId = meta.jobId;
        const userId = meta.userId;
        let arr = userIdJobIdMap[userId] || [];
        arr.push(jobId);
        userIdJobIdMap[userId] = arr;
      });
    });

    //The jobids for a user should be in order. If not, there is an issue.
    Object.keys(userIdJobIdMap).forEach((userId) => {
      const jobIds = userIdJobIdMap[userId];
      for (let i = 0; i < jobIds.length - 1; i++) {
        expect(jobIds[i] < jobIds[i + 1]).toEqual(true);
      }
    });
  }
};

describe('Router transform tests', () => {
  allIntegrations.forEach((integration) => {
    const data = getDataFromPath('./data/generic_router_input.json');
    data.input.forEach((inputData) => {
      test(`${integration} router transform`, async () => {
        inputData.destType = integration;

        const response = await request(server)
          .post('/routerTransform')
          .set('Accept', 'application/json')
          .send(inputData);
        expect(response.status).toEqual(200);

        const routerOutput = JSON.parse(response.text).output;

        assertRouterOutput(routerOutput, inputData);
      });
    });
  });
});

const batchIntegrations = ['am', 'kafka'];
describe('Batch tests', () => {
  batchIntegrations.forEach((integration) => {
    const data = getDataFromPath('./data/generic_router_input.json');
    data.input.forEach((inputData) => {
      test(`${integration} batch`, async () => {
        inputData.destType = integration;

        const response = await request(server)
          .post('/batch')
          .set('Accept', 'application/json')
          .send(inputData);
        expect(response.status).toEqual(200);

        const routerOutput = JSON.parse(response.text);

        assertRouterOutput(routerOutput, inputData);
      });
    });
  });
});
