const { setContextualFields } = require('./utils');

const getTestMessage = () => {
  let message = {
    event: 'testEventName',
    anonymousId: 'anonId',
    context: {
      device: {
        token: 1234,
      },
      os: {
        token: 5678,
      },
      app: {
        name: 'name',
        version: 'version',
        namespace: 'namespace',
      },
      campaign: {
        name: 'name',
        source: 'source',
        medium: 'medium',
        content: 'content',
        term: 'term',
        campaignId: 'campaignId',
      },
      screen: {
        width: 'width',
        height: 'height',
        innerHeight: 'innerHeight',
        innerWidth: 'innerWidth',
      },
    },
  };
  return message;
};

describe('setContextualFields', () => {
  it('correct flow', () => {
    let expectedOutput = {
      aiid: 'namespace',
      an: 'name',
      av: 'version',
      cc: 'content',
      ci: 'campaignId',
      ck: 'term',
      cm: 'medium',
      cn: 'name',
      cs: 'source',
      sr: 'widthxheight',
      ua: undefined,
      ul: undefined,
      vp: 'innerWidthxinnerHeight',
    };
    expect(setContextualFields({}, getTestMessage(), {})).toEqual(expectedOutput);
  });
});
