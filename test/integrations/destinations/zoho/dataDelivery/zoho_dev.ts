import { get, set } from 'lodash';
import { ProxyV1TestData } from '../../../testTypes';
import { testScenariosForV1API } from './business';

const updatedTestScenariosForZoho_dev = testScenariosForV1API.map((data) => {
  data.name = 'zoho_dev';
  if (get(data, 'output.response.body.output.statTags')) {
    set(data, 'output.response.body.output.statTags.destType', 'ZOHO_DEV');
  }
  return data;
});

// TODO: Remove once we complete migration of zoho to account management framework
// this test cases are added for zoho_dev(a temporary destination). We are verifying if the route is working fine for zoho_dev
// will be removed once we complete migration of zoho
export const testScenariosForZOHO_DEV: ProxyV1TestData[] = updatedTestScenariosForZoho_dev;
