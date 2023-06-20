const { processUserPayload } = require('../../../../src/v0/destinations/pinterest_tag/utils');

const userFields = [
  {
    em: 'abc@gmail.com',
    ph: '+1234589947',
    ge: 'male',
    db: '19960314',
    ln: 'Ganguly',
    fn: 'Shrouti',
    ct: 'Kolkata',
    st: 'WB',
    zp: '700114',
    country: 'IN',
    hashed_maids: 'abc123',
    client_ip_address: '0.0.0.0',
    client_user_agent: 'chrome',
    external_id: '50be5c78-6c3f-4b60-be84-97805a316fb1',
  },
  {
    em: ['abc@gmail.com', 'def@gmail.com'],
    ph: ['+1234589947', '+1234589948'],
    ln: ['Ganguly', 'Xu'],
    db: ['19960314', '19960315'],
    ge: ['female', 'male'],
    fn: ['Shrouti', 'Alex'],
    ct: ['Kolkata', 'Mumbai'],
    st: ['WB', 'MH'],
    zp: ['700114', '700115'],
    country: ['IN', 'IN'],
    hashed_maids: ['abc123', 'def123'],
    client_ip_address: '0.0.0.0',
    client_user_agent: 'chrome',
    external_id: ['50be5c78-6c3f-4b60-be84-97805a316fb1', '50be5c78-6c3f-4b60-be84-97805a316fb2'],
  },
];

const expectedOutput = [
  {
    em: ['48ddb93f0b30c475423fe177832912c5bcdce3cc72872f8051627967ef278e08'],
    ph: ['d164bbe036663cb5c96835e9ccc6501e9a521127ea62f6359744928ba932413b'],
    ln: ['b507b6eb07a0166a64a6c06f5c684c732116d2b9c966e1176c3d7fcc1295bcc8'],
    fn: ['d03a692ebd9ab84a8147d666baf05673c8113fa436f92e658a25ee306f383776'],
    ct: ['6689106ca7922c30b2fd2c175c85bc7fc2d52cc4941bdd7bb622c6cdc6284a85'],
    st: ['3b45022ab36728cdae12e709e945bba267c50ee8a91e6e4388539a8e03a3fdcd'],
    zp: ['1a4292e00780e18d00e76fde9850aee5344e939ba593333cd5e4b4aa2cd33b0c'],
    country: ['582967534d0f909d196b97f9e6921342777aea87b46fa52df165389db1fb8ccf'],
    hashed_maids: ['6ca13d52ca70c883e0f0bb101e425a89e8624de51db2d2392593af6a84118090'],
    ge: ['0d248e82c62c9386878327d491c762a002152d42ab2c391a31c44d9f62675ddf'],
    external_id: ['3217d71a74c219d6e31e28267b313a7ceb6a2c032db1a091c9416b25b2ae2bc8'],
    db: ['25f0dd07093aa653929e6e4d7710eeee84073ce654786612c09d1db67114c7ef'],
    client_user_agent: 'chrome',
    client_ip_address: '0.0.0.0',
  },
  {
    em: [
      '48ddb93f0b30c475423fe177832912c5bcdce3cc72872f8051627967ef278e08',
      'c392e50ebeca7bea4405e9c545023451ac56620031f81263f681269bde14218b',
    ],
    ph: [
      'd164bbe036663cb5c96835e9ccc6501e9a521127ea62f6359744928ba932413b',
      '22bdde2594851294f2a6f4c34af704e68b398b03129ea9ceb58f0ffe33f6db52',
    ],
    ln: [
      'b507b6eb07a0166a64a6c06f5c684c732116d2b9c966e1176c3d7fcc1295bcc8',
      '9c2f138690fca4890c3c4a6691610fbbbdf32091cc001f7355cfdf574baa52b9',
    ],
    db: [
      '25f0dd07093aa653929e6e4d7710eeee84073ce654786612c09d1db67114c7ef',
      '66874ab18465ad8260b5276de8a6fc20ef56b5710e54be77ba2b7b0fb8d99540',
    ],
    ge: [
      '9f165139a8c2894a47aea23b77d330eca847264224a44d5a17b19db8b9a72c08',
      '0d248e82c62c9386878327d491c762a002152d42ab2c391a31c44d9f62675ddf',
    ],
    fn: [
      'd03a692ebd9ab84a8147d666baf05673c8113fa436f92e658a25ee306f383776',
      '4135aa9dc1b842a653dea846903ddb95bfb8c5a10c504a7fa16e10bc31d1fdf0',
    ],
    ct: [
      '6689106ca7922c30b2fd2c175c85bc7fc2d52cc4941bdd7bb622c6cdc6284a85',
      'd209bcc17778fd19fd2bc0c99a3868bf011da5162d3a75037a605768ebc276e2',
    ],
    st: [
      '3b45022ab36728cdae12e709e945bba267c50ee8a91e6e4388539a8e03a3fdcd',
      '1b0316ed1cfed044035c55363e02ccafab26d66b1c2746b94d17285f043324aa',
    ],
    zp: [
      '1a4292e00780e18d00e76fde9850aee5344e939ba593333cd5e4b4aa2cd33b0c',
      '4d6755aa1e85517191f06cc91448696c173e1195ae51f94a1670116ac7b5c47b',
    ],
    country: [
      '582967534d0f909d196b97f9e6921342777aea87b46fa52df165389db1fb8ccf',
      '582967534d0f909d196b97f9e6921342777aea87b46fa52df165389db1fb8ccf',
    ],
    hashed_maids: [
      '6ca13d52ca70c883e0f0bb101e425a89e8624de51db2d2392593af6a84118090',
      '78ecf2b02cdfee12360cd83f65d5a8bbecbb15de93705d9df1d4d100ca5a6030',
    ],
    client_ip_address: '0.0.0.0',
    client_user_agent: 'chrome',
    external_id: [
      '3217d71a74c219d6e31e28267b313a7ceb6a2c032db1a091c9416b25b2ae2bc8',
      '309dbb489ab5951ea3a1ef2a78f62ce902693fa56a474fe2407d564dbc21f83c',
    ],
  },
];

describe('format and hash the user fields', () => {
  it('Should return the formatted and hashed (not for all fields) data in required format (values are all string)', () => {
    expect(processUserPayload(userFields[0])).toEqual(expectedOutput[0]);
  });

  it('Should return the formatted and hashed (not for all fields) data in required format (values are array of strings)', () => {
    expect(processUserPayload(userFields[1])).toEqual(expectedOutput[1]);
  });
});
