import { SegmentAction } from './config';
import { EventStructure, RespList } from './type';

const { InstrumentationError } = require('@rudderstack/integrations-lib');

const {
  batchResponseBuilder,
  getEventAction,
  getCustomerSearchPayloadAndEvent,
  filterCustomers,
} = require('./utils');

const { handleRtTfSingleEventError, getEventType } = require('../../util');
const { EventType } = require('../../../constants');

const getEventChunks = (
  event: EventStructure,
  insertOrUpdateRespList: RespList[],
  deleteRespList: RespList[],
) => {
  const eventAction = getEventAction(event);
  const { identifiers } = event?.message || {};
  const id: string | number = Object.values(identifiers)[0];
  const payload = {
    ids: [id],
  };
  if (eventAction === SegmentAction.DELETE) {
    deleteRespList.push({ payload, metadata: event.metadata });
  } else {
    insertOrUpdateRespList.push({ payload, metadata: event.metadata });
  }
};

const validateEvent = (event: EventStructure) => {
  const eventType = getEventType(event?.message);
  if (eventType !== EventType.RECORD) {
    throw new InstrumentationError(`message type ${eventType} is not supported`);
  }

  const eventAction = getEventAction(event);
  if (!Object.values(SegmentAction).includes(eventAction)) {
    throw new InstrumentationError(`action ${eventAction} is not supported`);
  }

  const identifiers = event?.message?.identifiers || {};
  if (Object.entries(identifiers).length === 0) {
    throw new InstrumentationError(`identifiers cannot be empty`);
  }
};

async function preProcessInputs(inputs: any[], reqMetadata: any) {
  const payloadAndEventList: any[] = [];
  const errorRespList: any[] = [];
  const successInputs: any[] = [];

  const { destination, connection } = inputs[0];

  inputs.forEach((event) => {
    try {
      validateEvent(event);
      getCustomerSearchPayloadAndEvent(event, payloadAndEventList);
    } catch (error) {
      const errRespEvent = handleRtTfSingleEventError(event, error, reqMetadata);
      errorRespList.push(errRespEvent);
    }
  });

  const { filteredSuccessInputs, filteredErrorRespList } = await filterCustomers(
    payloadAndEventList,
    destination,
    connection,
    reqMetadata,
  );
  successInputs.push(...filteredSuccessInputs);
  errorRespList.push(...filteredErrorRespList);

  return { successInputs, errorRespList };
}

const processRouterDest = async (inputs: any[], reqMetadata: any) => {
  if (!inputs || inputs.length === 0) {
    return [];
  }
  // filtering inputs to discard the events, in which, user is not present in customer io
  const { successInputs, errorRespList } = await preProcessInputs(inputs, reqMetadata);

  const batchErrorRespList: any[] = [];
  const insertOrUpdateRespList: RespList[] = [];
  const deleteRespList: RespList[] = [];
  const { destination, connection } = inputs[0];

  successInputs.forEach((event) => {
    try {
      getEventChunks(event, insertOrUpdateRespList, deleteRespList);
    } catch (error) {
      const errRespEvent: any = handleRtTfSingleEventError(event, error, reqMetadata);
      batchErrorRespList.push(errRespEvent);
    }
  });

  const batchSuccessfulRespList = batchResponseBuilder(
    insertOrUpdateRespList,
    deleteRespList,
    destination,
    connection,
  );
  return [...batchSuccessfulRespList, ...errorRespList, ...batchErrorRespList];
};
module.exports = { processRouterDest };
