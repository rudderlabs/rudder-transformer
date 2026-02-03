export const ACTION_MAP: Record<string, string> = {
  add: 'add',
  remove: 'delete',
};

export const SHA256_TRAITS = ['IDFA_SHA256', 'AAID_SHA256', 'EMAIL_SHA256', 'PHONE_SHA256'];

export const BASE_URL = 'https://business-api.tiktok.com/open_api/v1.3';
export const ENDPOINT_PATH = '/segment/mapping/';
export const ENDPOINT = `${BASE_URL}${ENDPOINT_PATH}`;
