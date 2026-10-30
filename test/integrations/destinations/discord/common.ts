export const templateErrorDestination = {
  ID: 'discord-template-destination',
  Name: 'test-Discord',
  DestinationDefinition: {
    ID: 'discord-definition',
    Name: 'DISCORD',
    DisplayName: 'Discord',
    Config: { excludeKeys: [], includeKeys: [] },
  },
  Config: {
    eventTemplateSettings: [],
    webhookUrl: 'https://abcd.com/efgh/89078/979868/98678',
  },
  Enabled: true,
  Transformations: [],
  IsProcessorEnabled: true,
};

export const templateErrorMetadata = {
  destinationId: templateErrorDestination.ID,
  destinationType: 'DISCORD',
  jobId: 130,
  messageId: 'discord-template-message',
  sourceId: 'discord-template-source',
};

export const templateErrorStatTags = {
  destType: 'DISCORD',
  destinationId: templateErrorDestination.ID,
  errorCategory: 'dataValidation',
  errorType: 'configuration',
  feature: 'processor',
  implementation: 'native',
  module: 'destination',
};

export const templateErrorTrackMessage = {
  type: 'track',
  event: 'Signed Up',
  userId: '12345',
  properties: { plan: 'Pro' },
};

export const templateErrorIdentifyMessage = {
  type: 'identify',
  userId: '12345',
  traits: { name: 'Alex' },
};
