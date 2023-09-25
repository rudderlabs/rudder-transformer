import { enhanceRequestOptions } from '../../../../src/adapters/network';
import { JSON_MIME_TYPE } from '../../../../src/v0/util/constant';

export const networkCallsData = [
  {
    httpReq: enhanceRequestOptions({
      method: 'post',
      url: 'https://hq1.appsflyer.com/api/gdpr/v1/opendsr_request',
      headers: {
        'Content-Type': JSON_MIME_TYPE,
        Accept: 'application/json, text/plain, */*',
        Authorization: 'Bearer dummyApiToken',
      },
      data: {
        subject_request_type: 'erasure',
        subject_identities: [
          {
            identity_format: 'raw',
            identity_type: 'android_advertising_id',
            identity_value: '1665148898336-5539842602053895577',
          },
        ],
        property_id: 'AnAID',
        subject_request_id: 'generated_uuid',
        submitted_time: '2023-09-24T11:22:24.018Z',
      },
    }),
    httpRes: {
      data: {
        error: {
          code: 400,
          af_gdpr_code: 'e411',
          message: "AppID given in 'property_id' is incorrect or does not belong to your account",
        },
      },
      status: 400,
    },
  },
  {
    httpReq: enhanceRequestOptions({
      method: 'post',
      url: 'https://hq1.appsflyer.com/api/gdpr/v1/opendsr_request',
      data: {
        subject_request_type: 'erasure',
        subject_identities: [
          {
            identity_format: 'raw',
            identity_type: 'ios_advertising_id',
            identity_value: '1665148898336-5539842602053895577',
          },
        ],
        status_callback_urls: ['https://examplecontroller.com/opengdpr_callbacks'],
        property_id: '123456789',
        subject_request_id: 'generated_uuid',
        submitted_time: '2023-09-24T11:22:24.018Z',
      },
      headers: {
        'Content-Type': JSON_MIME_TYPE,
        Accept: 'application/json, text/plain, */*',
        Authorization: 'Bearer dummyApiToken',
      },
    }),
    httpRes: {
      status: 200,
      statusText: 'success',
    },
  },
];
