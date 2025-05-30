import { testScenariosForV1API } from './business';
import { testScenariosForZOHO_DEV } from './zoho_dev';

export const data = [...testScenariosForV1API, ...testScenariosForZOHO_DEV];
