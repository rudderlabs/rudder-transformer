import {
  generateMetadata,
  generatePayloadForDelivery,
  generateV1PayloadForDelivery,
} from '../../../testUtils';
import { badRequestStructure, badRequestStructureV1, generalFailureScnearioV0, networkFailureScnearioV0, networkFailureScnearioV1, oauthScenariosV0, oauthScenariosV1, partialFailureScnearioV1 } from './failures';
import { successScenarioV0, successScenarioV1 } from './success';
export const getEndpointBatchInsert = (profileId: string) => {
  return `https://dfareporting.googleapis.com/dfareporting/v4/userprofiles/${profileId}/conversions/batchinsert`;
};

export const getEndpointBatchUpdate = (profileId: string) => {
  return `https://dfareporting.googleapis.com/dfareporting/v4/userprofiles/${profileId}/conversions/batchupdate`;
};

export const encryptionInfo = {
  kind: 'dfareporting#encryptionInfo',
  encryptionSource: 'AD_SERVING',
  encryptionEntityId: '3564523',
  encryptionEntityType: 'DCM_ACCOUNT',
};

export const conversion1 = {
  timestampMicros: '1668624722000000',
  floodlightConfigurationId: '213123123',
  ordinal: '1',
  floodlightActivityId: '456543345245',
  value: 7,
  gclid: '123',
  limitAdTracking: true,
  childDirectedTreatment: true,
};

export const headers = {
  Authorization: 'Bearer dummyApiKey',
  'Content-Type': 'application/json',
};

export const conversion2 = {
  timestampMicros: '1668624722000000',
  floodlightConfigurationId: '213123123',
  ordinal: '1',
  floodlightActivityId: '456543345245',
  value: 8,
  gclid: '123',
  limitAdTracking: true,
  childDirectedTreatment: true,
};

export const secret = {
  access_token: 'secret',
  refresh_token: 'refresh',
  developer_token: 'developer_Token',
};

export const data = [
  ...successScenarioV0,
  ...successScenarioV1,
  ...generalFailureScnearioV0,
  ...networkFailureScnearioV0,
  ...oauthScenariosV0,
  ...badRequestStructure,
  ...partialFailureScnearioV1,
  ...networkFailureScnearioV1,
  ...oauthScenariosV1,
  ...badRequestStructureV1

];
