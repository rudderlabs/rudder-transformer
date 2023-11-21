const { processRouterDest } = require('./transform');
const axios = require('axios');
const MockAxiosAdapter = require('axios-mock-adapter');
const {
  recordInputs,
  audiencelistInputs,
  reqMetadata,
  recordOutput,
  largeRecordOutput,
  mixedBatchOutput,
  recordEventGenerator,
} = require('./testData/testData');

const mockAdapter = new MockAxiosAdapter(axios, { onNoMatch: 'throwException' });
beforeAll(() => {
  mockAdapter
    .onGet('https://marketo_acct_id_success.mktorest.com/identity/oauth/token')
    .reply(200, { access_token: 'access_token_success' });
});
describe('Unit cases covering the router flow for both record and audiencelist event types', () => {
  it('Sending a small batch of only record events (4 events)', async () => {
    const inputs = recordInputs;
    const result = await processRouterDest(inputs, reqMetadata);
    expect(result).toEqual(recordOutput);
  });

  it('Sending a large batch of only record events (450 events: 350 inserts | 100 deletes )', async () => {
    const largeRecordInputs = [];
    for (let index = 0; index < 350; index++) {
      largeRecordInputs.push(recordEventGenerator(index + 1, 'insert', 1122));
    }
    for (let index = 350; index < 450; index++) {
      largeRecordInputs.push(recordEventGenerator(index + 1, 'delete', 1122));
    }
    const result = await processRouterDest(largeRecordInputs, reqMetadata);
    expect(result).toEqual(largeRecordOutput);
  });

  it('Sending a mixed batch of record and audiencelist events (22 events: 10 inserts | 10 deletes | 2 audiencelist (⌐■_■) )', async () => {
    const mixedBatchInputs = [];
    for (let index = 900; index < 910; index++) {
      mixedBatchInputs.push(recordEventGenerator(index + 1, 'insert', 1122));
    }
    for (let index = 910; index < 920; index++) {
      mixedBatchInputs.push(recordEventGenerator(index + 1, 'delete', 1122));
    }
    mixedBatchInputs.push(...audiencelistInputs);
    const result = await processRouterDest(mixedBatchInputs, reqMetadata);
    expect(result).toEqual(mixedBatchOutput);
  });
});
afterAll(() => {
  mockAdapter.restore();
});
