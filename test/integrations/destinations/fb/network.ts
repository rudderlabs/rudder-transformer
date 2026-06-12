import { getFormData } from '../../../../src/adapters/network';
import { data } from './dataDelivery/data';
import { VERSION } from '../../../../src/v0/destinations/fb/config';

export const networkCallsData = [
  {
    httpReq: {
      url: `https://graph.facebook.com/${VERSION}/RudderFbApp/activities?access_token=invalid_access_token`,
      data: getFormData(data[0].input.request.body.body?.FORM).toString(),
      params: { destination: 'fb' },
      headers: { 'User-Agent': 'RudderLabs' },
      method: 'POST',
    },
    httpRes: {
      data: {
        error: {
          message: 'The access token could not be decrypted',
          error_user_msg: 'Invalid OAuth 2.0 access token',
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
      url: `https://graph.facebook.com/${VERSION}/RudderFbApp/activities?access_token=my_access_token`,
      data: getFormData(data[1].input.request.body.body?.FORM).toString(),
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
  {
    httpReq: {
      url: `https://graph.facebook.com/${VERSION}/1234567891234567/events?access_token=invalid_timestamp_correct_access_token`,
      data: getFormData(data[2].input.request.body.body?.FORM).toString(),
      params: { destination: 'fb' },
      headers: { 'User-Agent': 'RudderLabs' },
      method: 'POST',
    },
    httpRes: {
      data: {
        error: {
          message: 'Invalid parameter',
          type: 'OAuthException',
          code: 100,
          error_subcode: 2804003,
          is_transient: false,
          error_user_title: 'Event Timestamp Too Old',
          error_user_msg:
            'The timestamp for this event is too far in the past. Events need to be sent from your server within 7 days of when they occurred. Enter a timestamp that has occurred within the last 7 days.',
          fbtrace_id: 'A6UyEgg_HdoiRX9duxcBOjb',
        },
      },
      status: 400,
    },
  },
  {
    httpReq: {
      url: `https://graph.facebook.com/${VERSION}/1234567891234567/events?access_token=throttled_valid_access_token`,
      data: getFormData(data[3].input.request.body.body?.FORM).toString(),
      params: { destination: 'fb' },
      headers: { 'User-Agent': 'RudderLabs' },
      method: 'POST',
    },
    httpRes: {
      data: {
        error: {
          message: 'User request limit reached',
          type: 'OAuthException',
          code: 17,
          fbtrace_id: 'facebook_px_trace_id_4',
        },
      },
      status: 500,
    },
  },
  {
    httpReq: {
      url: `https://graph.facebook.com/${VERSION}/1234567891234567/events?access_token=invalid_account_id_valid_access_token`,
      data: getFormData(data[4].input.request.body.body?.FORM).toString(),
      params: { destination: 'fb' },
      headers: { 'User-Agent': 'RudderLabs' },
      method: 'POST',
    },
    httpRes: {
      data: {
        error: {
          message:
            "Unsupported post request. Object with ID '1234567891234569' does not exist, cannot be loaded due to missing permissions, or does not support this operation. Please read the Graph API documentation at https://developers.facebook.com/docs/graph-api",
          type: 'GraphMethodException',
          code: 100,
          error_subcode: 33,
          fbtrace_id: 'facebook_px_trace_id_5',
        },
      },
      status: 400,
    },
  },
];
