import { z } from 'zod';
import {
  CustomBatchStrategy,
  DestinationIntegration,
  makeRouterInputSchema,
  type BatchGroup,
  type BatchStrategy,
  type TransformedEvent,
} from '../../../services/destination/destinationIntegration/destinationIntegration';
import { JSON_MIME_TYPE } from '../../util/constant';
import { ENDPOINT, ENDPOINT_PATH, MAX_BATCH_SIZE } from './config';
import { topsortDelivery } from './delivery';
import {
  TopsortDestinationConfigSchema,
  TopsortMessageSchema,
  type TopsortEvent,
  type TopsortEventType,
} from './types';
import { buildTopsortEvents } from './utils';

const topsortInputSchema = makeRouterInputSchema({
  destinationConfig: TopsortDestinationConfigSchema,
  message: TopsortMessageSchema.refine((msg) => msg.type.toLowerCase() === 'track', {
    message: 'Only "track" events are supported. Dropping event.',
  }),
});

type PendingRequest = {
  events: Record<TopsortEventType, TopsortEvent['event'][]>;
  jobIds: Set<number>;
};

const newPendingRequest = (): PendingRequest => ({
  events: { impressions: [], clicks: [], purchases: [] },
  jobIds: new Set(),
});

// A request carries only the event arrays it has events for.
const toBatchGroup = ({ events, jobIds }: PendingRequest): BatchGroup => ({
  body: Object.fromEntries(
    Object.entries(events).filter(([, typeEvents]) => typeEvents.length > 0),
  ),
  jobIds,
});

// The Events API accepts impressions, clicks and purchases in one request but caps each array
// at MAX_BATCH_SIZE independently, so a new request starts only when the array an event belongs
// in is full. A job whose fanned-out events straddle that boundary lands in both requests; the
// framework folds them back into one response for that job.
const batchIntoRequests = (
  payloads: (TransformedEvent<TopsortEvent> & { jobId: number })[],
): BatchGroup[] => {
  const requests: BatchGroup[] = [];
  let pending = newPendingRequest();

  payloads.forEach(({ body, jobId }) => {
    if (pending.events[body.type].length >= MAX_BATCH_SIZE) {
      requests.push(toBatchGroup(pending));
      pending = newPendingRequest();
    }
    pending.events[body.type].push(body.event);
    pending.jobIds.add(jobId);
  });

  if (pending.jobIds.size > 0) {
    requests.push(toBatchGroup(pending));
  }
  return requests;
};

class TopsortIntegration extends DestinationIntegration<TopsortEvent, typeof topsortInputSchema> {
  static readonly delivery = topsortDelivery;

  transformEvent(input: z.infer<typeof topsortInputSchema>): TransformedEvent<TopsortEvent>[] {
    const headers = {
      'content-type': JSON_MIME_TYPE,
      Authorization: `Bearer ${this.destination.Config.apiKey}`,
    };

    return buildTopsortEvents(input.message, this.destination.Config).map((body) => ({
      body,
      endpoint: ENDPOINT,
      endpointPath: ENDPOINT_PATH,
      method: 'POST',
      headers,
    }));
  }

  getBatchStrategy(): BatchStrategy<TopsortEvent> {
    return new CustomBatchStrategy<TopsortEvent>(batchIntoRequests);
  }

  getInputSchema() {
    return topsortInputSchema;
  }
}

export const Integration = TopsortIntegration;
