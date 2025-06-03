import { forEachInBatches, InstrumentationError } from '@rudderstack/integrations-lib';
import { CatalogAction } from './config';
import { batchResponseBuilder } from './utils';

import { handleRtTfSingleEventError, isEmptyObject } from '../../../../v0/util';

const prepareCatalogInsertOrUpdatePayload = (fields: any): any => {
  // eslint-disable-next-line @typescript-eslint/naming-convention
  const { item_id, ...properties } = fields;
  return { item_id, properties };
};

const processEvent = (event: any) => {
  const { message } = event;
  const { fields, action } = message;
  const response = {
    action,
    payload: null,
  };
  if (isEmptyObject(fields)) {
    throw new InstrumentationError('`fields` cannot be empty');
  }
  if (!fields.item_id) {
    throw new InstrumentationError('`item_id` cannot be empty');
  }
  if (action === CatalogAction.INSERT || action === CatalogAction.UPDATE) {
    response.payload = prepareCatalogInsertOrUpdatePayload(fields);
  } else if (action === CatalogAction.DELETE) {
    response.payload = fields.item_id;
  } else {
    throw new InstrumentationError(
      `Invalid action type ${action}. You can only add, update or remove items from the catalog`,
    );
  }
  return response;
};

const getEventChunks = (
  input: any,
  insertItemRespList: any[],
  updateItemRespList: any[],
  deleteItemRespList: any[],
) => {
  switch (input.response.action) {
    case CatalogAction.INSERT:
      insertItemRespList.push({ payload: input.response.payload, metadata: input.metadata });
      break;
    case CatalogAction.UPDATE:
      updateItemRespList.push({ payload: input.response.payload, metadata: input.metadata });
      break;
    case CatalogAction.DELETE:
      deleteItemRespList.push({ payload: input.response.payload, metadata: input.metadata });
      break;
    default:
      throw new InstrumentationError(`Invalid action type ${input.response.action}`);
  }
};

export const processRecordInputs = async (inputs: any[], destination: any) => {
  const insertItemRespList: any[] = [];
  const updateItemRespList: any[] = [];
  const deleteItemRespList: any[] = [];
  const batchErrorRespList: any[] = [];

  if (!inputs || inputs.length === 0) {
    return [];
  }

  await forEachInBatches(inputs, async (input) => {
    try {
      getEventChunks(
        {
          response: processEvent(input),
          metadata: input.metadata,
        },
        insertItemRespList,
        updateItemRespList,
        deleteItemRespList,
      );
    } catch (error) {
      const errRespEvent = handleRtTfSingleEventError(input, error, {});
      batchErrorRespList.push(errRespEvent);
    }
  });

  const batchSuccessfulRespList = batchResponseBuilder(
    insertItemRespList,
    updateItemRespList,
    deleteItemRespList,
    destination,
  );
  return [...batchSuccessfulRespList, ...batchErrorRespList];
};
