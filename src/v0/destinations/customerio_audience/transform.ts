import { SegmentAction } from './config';
import { EventStructure, RespList } from './type';

const { InstrumentationError } = require('@rudderstack/integrations-lib');

const { batchResponseBuilder, getEventAction } = require('./utils');

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

const processRouterDest = async (inputs: any[], reqMetadata: any) => {
  if (!inputs || inputs.length === 0) {
    return [];
  }

  const batchErrorRespList: any[] = [];
  const insertOrUpdateRespList: RespList[] = [];
  const deleteRespList: RespList[] = [];
  const { destination, connection } = inputs[0];

  inputs.forEach((event) => {
    try {
      validateEvent(event);
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
  return [...batchSuccessfulRespList, ...batchErrorRespList];
};
module.exports = { processRouterDest };
