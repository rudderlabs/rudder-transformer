import { mapInBatches } from '@rudderstack/integrations-lib';
import { getSuccessRespEvents, handleRtTfSingleEventError } from '../../util';
import { RecordAction } from '../../../types/rudderEvents';
import { RouterTransformationResponse } from '../../../types';
import { SYNC_MODES } from './config';
import {
  buildSubscribeRequest,
  buildUnsubscribeRequest,
  chunkSubscribers,
  getSubscriberForEvent,
  getSyncMode,
} from './utils';
import { IterableAudienceRouterRequest } from './types';

const processRouterDest = async (
  events: IterableAudienceRouterRequest[],
): Promise<RouterTransformationResponse[]> => {
  if (!events?.length) {
    return [];
  }

  const validEvents: { event: IterableAudienceRouterRequest; subscriber: { email?: string; userId?: string } }[] = [];
  const failedResponses: RouterTransformationResponse[] = [];

  await mapInBatches(events, (event) => {
    try {
      if (event.message?.type?.toLowerCase() !== 'record') {
        throw new Error('unsupported event type for iterable_audience');
      }
      const subscriber = getSubscriberForEvent(event);
      validEvents.push({ event, subscriber });
    } catch (error) {
      failedResponses.push(handleRtTfSingleEventError(event, error, {}));
    }
  });

  if (!validEvents.length) {
    return failedResponses;
  }

  const seedEvent = validEvents[0].event;
  const syncMode = getSyncMode(seedEvent);

  const subscribeItems = validEvents.filter((item) => item.event.message.action !== RecordAction.DELETE);
  const unsubscribeItems = validEvents.filter((item) => item.event.message.action === RecordAction.DELETE);

  const responses: RouterTransformationResponse[] = [];

  const pushBatchedSuccess = (
    batchItems: typeof subscribeItems,
    requestBuilder: (event: IterableAudienceRouterRequest, subscribers: { email?: string; userId?: string }[]) => any,
  ) => {
    const subscriberBatches = chunkSubscribers(batchItems.map((item) => item.subscriber));
    const metadataBatches = chunkSubscribers(batchItems.map((item) => item.event.metadata));

    subscriberBatches.forEach((subscribers, index) => {
      const req = requestBuilder(seedEvent, subscribers);
      responses.push(
        getSuccessRespEvents(req, metadataBatches[index], seedEvent.destination, true),
      );
    });
  };

  if (syncMode === SYNC_MODES.MIRROR) {
    if (unsubscribeItems.length) {
      pushBatchedSuccess(unsubscribeItems, buildUnsubscribeRequest);
    }
    if (subscribeItems.length) {
      pushBatchedSuccess(subscribeItems, buildSubscribeRequest);
    }
  } else {
    if (subscribeItems.length) {
      pushBatchedSuccess(subscribeItems, buildSubscribeRequest);
    }
    if (unsubscribeItems.length) {
      pushBatchedSuccess(unsubscribeItems, buildUnsubscribeRequest);
    }
  }

  return [...failedResponses, ...responses];
};

export { processRouterDest };
