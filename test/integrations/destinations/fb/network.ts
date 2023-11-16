import { cloneDeep } from 'lodash';
import { getFormData } from '../../../../src/adapters/network';
import * as fbPixelNw from '../facebook_pixel/network';
import { data } from './dataDelivery/data';

const fbPixelTcs = data
  .filter((_, i) => [2, 3, 4].includes(i))
  .map((d) => {
    const fbendpoint = d.input.request.body.endpoint;
    const fbpTc = fbPixelNw.networkCallsData.filter((nw) => {
      return nw.httpReq.url === fbendpoint;
    })[0];
    const clonedFbpTc = cloneDeep(fbpTc);
    const clonedFormData = cloneDeep(d.input.request.body.body.FORM);
    clonedFbpTc.httpReq.data = getFormData(clonedFormData).toString();
    return clonedFbpTc;
  });

export const networkCallsData = [
  {
    httpReq: {
      url: 'https://graph.facebook.com/v17.0/RudderFbApp/activities?access_token=invalid_access_token',
      data: getFormData(data[0].input.request.body.body.FORM).toString(),
      params: { destination: 'fb' },
      headers: { 'User-Agent': 'RudderLabs' },
      method: 'POST',
    },
    httpRes: {
      data: {
        error: {
          message: 'The access token could not be decrypted',
          type: 'OAuthException',
          code: 190,
          fbtrace_id: 'fbpixel_trace_id',
        },
      },
      status: 500,
    },
  },
  {
    httpReq: {
      url: 'https://graph.facebook.com/v17.0/RudderFbApp/activities?access_token=my_access_token',
      data: getFormData(data[1].input.request.body.body.FORM).toString(),
      params: { destination: 'fb' },
      headers: { 'x-forwarded-for': '1.2.3.4', 'User-Agent': 'RudderLabs' },
      method: 'POST',
    },
    httpRes: {
      data: { events_received: 1, fbtrace_id: 'facebook_trace_id' },
      status: 200,
      statusText: 'OK',
    },
  },
  ...fbPixelTcs,
];
