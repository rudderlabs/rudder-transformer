import { testScenariosForV0API, testScenariosForV1API } from './business';
import { oauthError } from './oauth';
import { dmDataDeliveryTests } from './dataManager';

export const data = [
  ...testScenariosForV0API,
  ...testScenariosForV1API,
  ...oauthError,
  ...dmDataDeliveryTests,
];
