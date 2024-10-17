export const destination = {
  DestinationDefinition: {
    Config: {
      excludeKeys: [],
      includeKeys: [],
    },
  },
  Config: {
    advertiserId: '{"Dummy Name":"1234"}',
    audienceId: 'dummyId',
  },
  ID: 'amazonAud-1234',
};

export const generateMetadata = (jobId: number, userId?: string): any => {
  return {
    jobId,
    attemptNum: 1,
    userId: userId || 'default-userId',
    sourceId: 'default-sourceId',
    destinationId: 'default-destinationId',
    workspaceId: 'default-workspaceId',
    dontBatch: false,
    secret: {
      accessToken: 'dummyAccessToken',
      refreshToken: 'dummyRefreshToken',
      clientId: 'dummyClientId',
    },
  };
};
