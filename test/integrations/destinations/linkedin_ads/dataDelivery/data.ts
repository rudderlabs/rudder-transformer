import { testScenariosForV1API, statTags as baseStatTags } from './business';
import { oauthScenariosV1 } from './oauth';

export const data = [...testScenariosForV1API, ...oauthScenariosV1];
