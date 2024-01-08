const destType = 'the_trade_desk';
const destTypeInUpperCase = 'THE_TRADE_DESK';
const advertiserId = 'test-advertiser-id';
const dataProviderId = 'rudderstack';
const segmentName = 'test-segment';
const sampleDestination = {
  Config: {
    advertiserId,
    advertiserSecretKey: 'test-advertiser-secret-key',
    dataServer: 'apac',
    ttlInDays: 30,
    audienceId: segmentName,
  },
  DestinationDefinition: { Config: { cdkV2Enabled: true } },
};

const sampleSource = {
  job_id: 'test-job-id',
  job_run_id: 'test-job-run-id',
  task_run_id: 'test-task-run-id',
  version: 'v1.40.4',
};

const sampleContext = {
  destinationFields: 'daid, uid2',
  externalId: [
    {
      identifierType: 'tdid',
      type: 'THE_TRADE_DESK-test-segment',
    },
  ],
  mappedToDestination: 'true',
  sources: sampleSource,
};

export {
  destType,
  destTypeInUpperCase,
  advertiserId,
  dataProviderId,
  segmentName,
  sampleDestination,
  sampleContext,
};
