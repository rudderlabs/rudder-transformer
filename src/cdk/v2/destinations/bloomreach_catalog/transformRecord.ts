import { base64Convertor, InstrumentationError } from '@rudderstack/integrations-lib';
import {
  CatalogAction,
  getCreateBulkCatalogItemEndpoint,
  getDeleteBulkCatalogItemEndpoint,
  getUpdateBulkCatalogItemEndpoint,
} from './config';
import { batchResponseBuilder } from './utils';

const {
  defaultRequestConfig,
  handleRtTfSingleEventError,
  isEmptyObject,
} = require('../../../../v0/util');

export const prepareRecordInsertOrUpdatePayload = (fields: any): any => {
  // eslint-disable-next-line @typescript-eslint/naming-convention
  const { item_id, ...properties } = fields;
  return { item_id, properties };
};

export const processRecordInputs = (inputs: any[], destination: any) => {
  const { Config } = destination;
  const events: any[] = [];
  const errorResponseList: any[] = [];

  if (!inputs || inputs.length === 0) {
    return [];
  }

  const invalidActionTypeError = new InstrumentationError(
    'Invalid action type. You can only add, update or remove items from the catalog',
  );

  const emptyFieldsError = new InstrumentationError('`fields` cannot be empty');

  const itemIdError = new InstrumentationError('`item_id` cannot be empty');

  const headers = {
    'Content-Type': 'application/json',
    Authorization: `Basic ${base64Convertor(`${Config.apiKey}:${Config.apiSecret}`)}`,
  };

  const insertEndpoint = getCreateBulkCatalogItemEndpoint(
    Config.apiBaseUrl,
    Config.projectToken,
    Config.catalogID,
  );
  const updateEndpoint = getUpdateBulkCatalogItemEndpoint(
    Config.apiBaseUrl,
    Config.projectToken,
    Config.catalogID,
  );
  const deleteEndpoint = getDeleteBulkCatalogItemEndpoint(
    Config.apiBaseUrl,
    Config.projectToken,
    Config.catalogID,
  );

  inputs.forEach((input) => {
    const { fields, action } = input.message;

    if (isEmptyObject(fields)) {
      errorResponseList.push(handleRtTfSingleEventError(input, emptyFieldsError, {}));
      return;
    }

    if (!fields.item_id) {
      errorResponseList.push(handleRtTfSingleEventError(input, itemIdError, {}));
      return;
    }

    const response = defaultRequestConfig();
    response.headers = headers;
    switch (action) {
      case CatalogAction.INSERT:
        response.body.JSON = prepareRecordInsertOrUpdatePayload(fields);
        response.endpoint = insertEndpoint;
        response.method = 'PUT';
        break;
      case CatalogAction.UPDATE:
        response.body.JSON = prepareRecordInsertOrUpdatePayload(fields);
        response.endpoint = updateEndpoint;
        response.method = 'POST';
        break;
      case CatalogAction.DELETE:
        response.body.JSON = fields.item_id;
        response.endpoint = deleteEndpoint;
        response.method = 'DELETE';
        break;
      default:
        errorResponseList.push(handleRtTfSingleEventError(input, invalidActionTypeError, {}));
        return;
    }
    const event = {
      message: response,
      destination,
      metadata: input.metadata,
    };
    events.push(event);
  });
  const response = batchResponseBuilder(events);
  return [...response, ...errorResponseList];
};
