import { testScenariosForV0API, testScenariosForV1API } from './business';
import { oauthError } from './oauth';

export const data = [...testScenariosForV0API, ...testScenariosForV1API, ...oauthError];
