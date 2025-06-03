import { get, set } from 'lodash';
import { data as zohoDevData } from '../../zoho/router/data';

// TODO: Remove once we complete migration of zoho to account management framework
// this test cases are added for zoho_dev(a temporary destination). We are verifying if the route is working fine for zoho_dev
// will be removed once we complete migration of zoho
const updateAccountData = zohoDevData.map((data) => {
  data.name = 'zoho_dev';
  data.input.request.body.destType = 'zoho_dev';
  const output = get(data, 'output.response.body.output');
  if (Array.isArray(output)) {
    output.forEach((eachOutput) => {
      if (get(eachOutput, 'statTags')) {
        set(eachOutput, 'statTags.destType', 'ZOHO_DEV');
      }
    });
  }
  return data;
});

export const data = updateAccountData;
