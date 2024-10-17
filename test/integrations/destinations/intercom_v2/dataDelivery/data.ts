import { oauthScenariosV0, oauthScenariosV1 } from './oauth';
import { testScenariosForV0API, testScenariosForV1API } from './business';

export const data = [
  ...oauthScenariosV0,
  ...oauthScenariosV1,
  ...testScenariosForV0API,
  ...testScenariosForV1API,
];
