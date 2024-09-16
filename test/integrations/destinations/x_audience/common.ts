export const authHeaderConstant =
  'OAuth oauth_consumer_key="qwe", oauth_nonce="V1kMh028kZLLhfeYozuL0B45Pcx6LvuW", oauth_signature="Di4cuoGv4PnCMMEeqfWTcqhvdwc%3D", oauth_signature_method="HMAC-SHA1", oauth_timestamp="1685603652", oauth_token="dummyAccessToken", oauth_version="1.0"';
export const destination = {
  Config: {
    accountId: '{"Dummy Name":"1234"}',
    audienceId: 'dummyId',
  },
  ID: 'xpixel-1234',
};

export const generateMetadata = (jobId: number, userId?: string): any => {
  return {
    jobId,
    attemptNum: 1,
    userId: userId || 'default-userId',
    sourceId: 'default-sourceId',
    destinationId: 'default-destinationId',
    workspaceId: 'default-workspaceId',
    secret: {
      consumerKey: 'validConsumerKey',
      consumerSecret: 'validConsumerSecret',
      accessToken: 'validAccessToken',
      accessTokenSecret: 'validAccessTokenSecret',
    },
    dontBatch: false,
  };
};
