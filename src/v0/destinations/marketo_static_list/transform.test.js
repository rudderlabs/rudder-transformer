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

    // assert that the result is as expected
    expect(result.length).toEqual(3);
    expect(result[0].batchedRequest.length).toEqual(1); // 1 batched request for 2 record events
    expect(result[1].batchedRequest.length).toEqual(1); // 1 batched request for 1 record events
    expect(result[2].batchedRequest.length).toEqual(1); // 1 batched request for 1 record events
    expect(result[0].batchedRequest[0].endpoint).toEqual(
      'https://marketo_acct_id_success.mktorest.com/rest/v1/lists/id001/leads.json?id=1001&id=1003',
    ); // 1 api call for 2 leadIds
    expect(result[1].batchedRequest[0].endpoint).toEqual(
      'https://marketo_acct_id_success.mktorest.com/rest/v1/lists/id002/leads.json?id=2001',
    ); // 1 api call for 1 leadId
    expect(result[2].batchedRequest[0].endpoint).toEqual(
      'https://marketo_acct_id_success.mktorest.com/rest/v1/lists/id002/leads.json?id=1002',
    ); // 1 api call for 1 leadId
    expect(result[1].batchedRequest[0].method).toEqual('DELETE'); // DELETE requests are sent first
    expect(result[0].metadata.length).toEqual(2); // 2 metadata objects for 2 record events
    expect(result[1].metadata.length).toEqual(1); // 1 metadata object for 1 record event
    expect(result[2].metadata.length).toEqual(1); // 1 metadata object for 1 record event
    expect(result).toEqual(recordOutput); // overall result should be equal to the expected output
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

    // assert that the result is as expected
    /*
      Total 3 API calls
      1. 1 API call for 100 DELETE requests
      2. 1 API call for 100 POST requests = limit reached for Marketo, leads split to next API call
      3. 1 API call for 50 POST requests
    */
    expect(result.length).toEqual(2);
    expect(result[0].batchedRequest.length).toEqual(1); // 1 batched request for 1 record event
    expect(result[1].batchedRequest.length).toEqual(2); // 1 batched request for 2 record events
    expect(result[0].batchedRequest[0].endpoint).toEqual(
      'https://marketo_acct_id_success.mktorest.com/rest/v1/lists/1122/leads.json?id=351&id=352&id=353&id=354&id=355&id=356&id=357&id=358&id=359&id=360&id=361&id=362&id=363&id=364&id=365&id=366&id=367&id=368&id=369&id=370&id=371&id=372&id=373&id=374&id=375&id=376&id=377&id=378&id=379&id=380&id=381&id=382&id=383&id=384&id=385&id=386&id=387&id=388&id=389&id=390&id=391&id=392&id=393&id=394&id=395&id=396&id=397&id=398&id=399&id=400&id=401&id=402&id=403&id=404&id=405&id=406&id=407&id=408&id=409&id=410&id=411&id=412&id=413&id=414&id=415&id=416&id=417&id=418&id=419&id=420&id=421&id=422&id=423&id=424&id=425&id=426&id=427&id=428&id=429&id=430&id=431&id=432&id=433&id=434&id=435&id=436&id=437&id=438&id=439&id=440&id=441&id=442&id=443&id=444&id=445&id=446&id=447&id=448&id=449&id=450',
    );
    expect(result[1].batchedRequest[0].endpoint).toEqual(
      'https://marketo_acct_id_success.mktorest.com/rest/v1/lists/1122/leads.json?id=1&id=2&id=3&id=4&id=5&id=6&id=7&id=8&id=9&id=10&id=11&id=12&id=13&id=14&id=15&id=16&id=17&id=18&id=19&id=20&id=21&id=22&id=23&id=24&id=25&id=26&id=27&id=28&id=29&id=30&id=31&id=32&id=33&id=34&id=35&id=36&id=37&id=38&id=39&id=40&id=41&id=42&id=43&id=44&id=45&id=46&id=47&id=48&id=49&id=50&id=51&id=52&id=53&id=54&id=55&id=56&id=57&id=58&id=59&id=60&id=61&id=62&id=63&id=64&id=65&id=66&id=67&id=68&id=69&id=70&id=71&id=72&id=73&id=74&id=75&id=76&id=77&id=78&id=79&id=80&id=81&id=82&id=83&id=84&id=85&id=86&id=87&id=88&id=89&id=90&id=91&id=92&id=93&id=94&id=95&id=96&id=97&id=98&id=99&id=100&id=101&id=102&id=103&id=104&id=105&id=106&id=107&id=108&id=109&id=110&id=111&id=112&id=113&id=114&id=115&id=116&id=117&id=118&id=119&id=120&id=121&id=122&id=123&id=124&id=125&id=126&id=127&id=128&id=129&id=130&id=131&id=132&id=133&id=134&id=135&id=136&id=137&id=138&id=139&id=140&id=141&id=142&id=143&id=144&id=145&id=146&id=147&id=148&id=149&id=150&id=151&id=152&id=153&id=154&id=155&id=156&id=157&id=158&id=159&id=160&id=161&id=162&id=163&id=164&id=165&id=166&id=167&id=168&id=169&id=170&id=171&id=172&id=173&id=174&id=175&id=176&id=177&id=178&id=179&id=180&id=181&id=182&id=183&id=184&id=185&id=186&id=187&id=188&id=189&id=190&id=191&id=192&id=193&id=194&id=195&id=196&id=197&id=198&id=199&id=200&id=201&id=202&id=203&id=204&id=205&id=206&id=207&id=208&id=209&id=210&id=211&id=212&id=213&id=214&id=215&id=216&id=217&id=218&id=219&id=220&id=221&id=222&id=223&id=224&id=225&id=226&id=227&id=228&id=229&id=230&id=231&id=232&id=233&id=234&id=235&id=236&id=237&id=238&id=239&id=240&id=241&id=242&id=243&id=244&id=245&id=246&id=247&id=248&id=249&id=250&id=251&id=252&id=253&id=254&id=255&id=256&id=257&id=258&id=259&id=260&id=261&id=262&id=263&id=264&id=265&id=266&id=267&id=268&id=269&id=270&id=271&id=272&id=273&id=274&id=275&id=276&id=277&id=278&id=279&id=280&id=281&id=282&id=283&id=284&id=285&id=286&id=287&id=288&id=289&id=290&id=291&id=292&id=293&id=294&id=295&id=296&id=297&id=298&id=299&id=300',
    );
    expect(result[1].batchedRequest[1].endpoint).toEqual(
      'https://marketo_acct_id_success.mktorest.com/rest/v1/lists/1122/leads.json?id=301&id=302&id=303&id=304&id=305&id=306&id=307&id=308&id=309&id=310&id=311&id=312&id=313&id=314&id=315&id=316&id=317&id=318&id=319&id=320&id=321&id=322&id=323&id=324&id=325&id=326&id=327&id=328&id=329&id=330&id=331&id=332&id=333&id=334&id=335&id=336&id=337&id=338&id=339&id=340&id=341&id=342&id=343&id=344&id=345&id=346&id=347&id=348&id=349&id=350',
    );
    expect(result[0].batchedRequest[0].method).toEqual('DELETE'); // DELETE requests are sent first
    expect(result[1].batchedRequest[0].method).toEqual('POST');
    expect(result[1].batchedRequest[1].method).toEqual('POST');
    expect(result[0].metadata.length).toEqual(100); // 100 metadata objects for 100 record events
    expect(result[1].metadata.length).toEqual(350); // 350 metadata objects for 350 record events
    expect(result).toEqual(largeRecordOutput); // overall result should be equal to the expected output
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

    // assert that the result is as expected
    /*
      Total 4 API calls
      1. 1 API call for 10 DELETE requests
      2. 1 API call for 10 POST requests = limit reached for Marketo, leads split to next API call
      3. 1 API call for 2 POST requests
      4. 1 API call for 2 POST requests
    */
    expect(result.length).toEqual(4);
    expect(result[0].batchedRequest.length).toEqual(1); // 1 batched request for 1 record event
    expect(result[1].batchedRequest.length).toEqual(1); // 1 batched request for 1 record event
    expect(result[2].batchedRequest.length).toEqual(2); // 1 batched request for 2 audiencelist events
    expect(result[3].batchedRequest.length).toEqual(2); // 1 batched request for 2 audiencelist events
    expect(result[0].batchedRequest[0].endpoint).toEqual(
      'https://marketo_acct_id_success.mktorest.com/rest/v1/lists/1122/leads.json?id=911&id=912&id=913&id=914&id=915&id=916&id=917&id=918&id=919&id=920',
    );
    expect(result[1].batchedRequest[0].endpoint).toEqual(
      'https://marketo_acct_id_success.mktorest.com/rest/v1/lists/1122/leads.json?id=901&id=902&id=903&id=904&id=905&id=906&id=907&id=908&id=909&id=910',
    );
    expect(result[2].batchedRequest[0].endpoint).toEqual(
      'https://marketo_acct_id_success.mktorest.com/rest/v1/lists/1234/leads.json?id=704&id=705&id=706',
    );
    expect(result[2].batchedRequest[1].endpoint).toEqual(
      'https://marketo_acct_id_success.mktorest.com/rest/v1/lists/1234/leads.json?id=501&id=502&id=503',
    );
    expect(result[3].batchedRequest[0].endpoint).toEqual(
      'https://marketo_acct_id_success.mktorest.com/rest/v1/lists/1234/leads.json?id=0&id=1&id=2&id=3&id=4&id=5&id=6&id=7&id=8&id=9&id=10&id=11&id=12&id=13&id=14&id=15&id=16&id=17&id=18&id=19&id=20&id=21&id=22&id=23&id=24&id=25&id=26&id=27&id=28&id=29&id=30&id=31&id=32&id=33&id=34&id=35&id=36&id=37&id=38&id=39&id=40&id=41&id=42&id=43&id=44&id=45&id=46&id=47&id=48&id=49&id=50&id=51&id=52&id=53&id=54&id=55&id=56&id=57&id=58&id=59&id=60&id=61&id=62&id=63&id=64&id=65&id=66&id=67&id=68&id=69&id=70&id=71&id=72&id=73&id=74&id=75&id=76&id=77&id=78&id=79&id=80&id=81&id=82&id=83&id=84&id=85&id=86&id=87&id=88&id=89&id=90&id=91&id=92&id=93&id=94&id=95&id=96&id=97&id=98&id=99&id=100&id=101&id=102&id=103&id=104&id=105&id=106&id=107&id=108&id=109&id=110&id=111&id=112&id=113&id=114&id=115&id=116&id=117&id=118&id=119&id=120&id=121&id=122&id=123&id=124&id=125&id=126&id=127&id=128&id=129&id=130&id=131&id=132&id=133&id=134&id=135&id=136&id=137&id=138&id=139&id=140&id=141&id=142&id=143&id=144&id=145&id=146&id=147&id=148&id=149&id=150&id=151&id=152&id=153&id=154&id=155&id=156&id=157&id=158&id=159&id=160&id=161&id=162&id=163&id=164&id=165&id=166&id=167&id=168&id=169&id=170&id=171&id=172&id=173&id=174&id=175&id=176&id=177&id=178&id=179&id=180&id=181&id=182&id=183&id=184&id=185&id=186&id=187&id=188&id=189&id=190&id=191&id=192&id=193&id=194&id=195&id=196&id=197&id=198&id=199&id=200&id=201&id=202&id=203&id=204&id=205&id=206&id=207&id=208&id=209&id=210&id=211&id=212&id=213&id=214&id=215&id=216&id=217&id=218&id=219&id=220&id=221&id=222&id=223&id=224&id=225&id=226&id=227&id=228&id=229&id=230&id=231&id=232&id=233&id=234&id=235&id=236&id=237&id=238&id=239&id=240&id=241&id=242&id=243&id=244&id=245&id=246&id=247&id=248&id=249&id=250&id=251&id=252&id=253&id=254&id=255&id=256&id=257&id=258&id=259&id=260&id=261&id=262&id=263&id=264&id=265&id=266&id=267&id=268&id=269&id=270&id=271&id=272&id=273&id=274&id=275&id=276&id=277&id=278&id=279&id=280&id=281&id=282&id=283&id=284&id=285&id=286&id=287&id=288&id=289&id=290&id=291&id=292&id=293&id=294&id=295&id=296&id=297&id=298&id=299',
    );
    expect(result[2].batchedRequest[1].endpoint).toEqual(
      'https://marketo_acct_id_success.mktorest.com/rest/v1/lists/1234/leads.json?id=501&id=502&id=503',
    );
    expect(result[0].batchedRequest[0].method).toEqual('DELETE'); // DELETE requests are sent first
    expect(result[1].batchedRequest[0].method).toEqual('POST');
    expect(result[1].batchedRequest[0].method).toEqual('POST');
    expect(result[2].batchedRequest[0].method).toEqual('DELETE');
    expect(result[0].metadata.length).toEqual(10);
    expect(result[1].metadata.length).toEqual(10);
    expect(result[2].metadata.length).toEqual(1);
    expect(result[3].metadata.length).toEqual(1);
    expect(result).toEqual(mixedBatchOutput); // overall result should be equal to the expected output
  });
});
afterAll(() => {
  mockAdapter.restore();
});
