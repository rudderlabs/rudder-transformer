export const authHeaderConstant =
  '"OAuth oauth_consumer_key="validConsumerKey", oauth_nonce="j8kZvaJQRTaLX8h460CgHNs6rCEArNOW", oauth_signature="uAu%2FGdA6qPGW88pjVd7%2FgnAlHtM%3D", oauth_signature_method="HMAC-SHA1", oauth_timestamp="1725014809", oauth_token="validAccessToken", oauth_version="1.0"';

export const destination = {
  config: {
    accountId: '1234',
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
