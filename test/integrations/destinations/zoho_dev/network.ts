import { networkCallsData as zohoNetworkCallsData } from '../zoho/network';

const updateNetworkCallsData = zohoNetworkCallsData.map((data) => {
  if (data.httpReq.params) {
    data.httpReq.params = { destination: 'ZOHO_DEV' };
  }
  return data;
});

export const networkCallsData = updateNetworkCallsData;
