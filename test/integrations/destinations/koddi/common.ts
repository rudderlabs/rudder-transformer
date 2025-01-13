import { Destination } from '../../../../src/types';

const destType = 'koddi';
const destTypeInUpperCase = 'KODDI';
const displayName = 'Koddi';
const channel = 'web';
const destination: Destination = {
  Config: {
    apiBaseUrl: 'https://www.test-client.com',
    clientName: 'test-client',
  },
  DestinationDefinition: {
    DisplayName: displayName,
    ID: '123',
    Name: destTypeInUpperCase,
    Config: { cdkV2Enabled: true },
  },
  Enabled: true,
  ID: '123',
  Name: destTypeInUpperCase,
  Transformations: [],
  WorkspaceID: 'test-workspace-id',
};

const processorInstrumentationErrorStatTags = {
  destType: destTypeInUpperCase,
  errorCategory: 'dataValidation',
  errorType: 'instrumentation',
  feature: 'processor',
  implementation: 'cdkV2',
  module: 'destination',
  destinationId: 'default-destinationId',
  workspaceId: 'default-workspaceId',
};

const RouterInstrumentationErrorStatTags = {
  ...processorInstrumentationErrorStatTags,
  feature: 'router',
};

const getHeader = {
  accept: 'application/json',
};

const postHeader = {
  ...getHeader,
  'content-type': 'application/json',
};

const bidders = [
  {
    bidder: 'bidder1',
    alternate_bidder: 'alternate1',
    count: 1,
    base_price: 100,
    total_price: 227,
  },
];

const alternateBidders = [
  {
    count: 1,
    base_price: 100,
    total_price: 227,
  },
];

export {
  destType,
  channel,
  destination,
  processorInstrumentationErrorStatTags,
  RouterInstrumentationErrorStatTags,
  getHeader,
  postHeader,
  bidders,
  alternateBidders,
};
