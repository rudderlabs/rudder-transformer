export const SUPPORTED_EVENT_TYPE = 'record';
export const ACTION_TYPES = ['insert', 'delete', 'update'];
export const ENDPOINTS = {
  GET_TOKEN: `auth.marketingcloudapis.com/v2/token`,
  UPSERT_CONTACT: `rest.marketingcloudapis.com/contacts/v1/contacts`,
  DELETE_CONTACT: `rest.marketingcloudapis.com/contacts/v1/contacts/actions/delete?type=keys`,
  DATA_EXTENSION: `rest.marketingcloudapis.com/hub/v1/dataevents/key:`,
};
