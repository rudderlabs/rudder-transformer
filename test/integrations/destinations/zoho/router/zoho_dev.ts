import { accountData } from './account';

// TODO: Remove once we complete migration of zoho to account management framework
// this test cases are added for zoho_dev(a temporary destination). We are verifying if the route is working fine for zoho_dev
// will be removed once we complete migration of zoho
const updateAccountData = accountData.map((data) => {
  data.name = 'zoho_dev';
  data.input.request.body.destType = 'zoho_dev';
});

export const zoho_dev_account = updateAccountData;
