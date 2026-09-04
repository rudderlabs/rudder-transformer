import { z } from 'zod';
import get from 'get-value';
import { InstrumentationError } from '@rudderstack/integrations-lib';
import {
  TransformedEvent,
  ChunkBatchStrategy,
  CustomBatchStrategy,
} from '../../../services/destination/destinationIntegration/destinationIntegration';
import { VDMV2ObjectDestination } from '../../../services/destination/destinationIntegration/vdmV2ObjectDestination';
import type { BatchStrategy } from '../../../services/destination/destinationIntegration/types';
import { removeUndefinedValues } from '../../util';
import { recordInputSchema, eventStreamInputSchema, CustomerIOV2Payload } from './v2/types';
import {
  MAX_OBJECT_SIZE_BYTES,
  MAX_BATCH_PAYLOAD,
  getV2Endpoint,
  isEventStreamV2APIEnabled,
} from './v2/config';
import { buildRecordEvent } from './v2/recordTransform';
import { validateConfigFields } from './util';
import {
  buildIdentify,
  buildTrack,
  buildPage,
  buildScreen,
  buildMerge,
  buildObject,
  buildDevice,
  deviceActionFor,
  buildRequestMeta,
} from './v2/util';
import { process as v1ProcessEventStream } from './transform';
import { CUSTOMERIO_RECORD_OBJECTS, type CustomerIORecordObject } from './types';
import { customerIODelivery } from './v2/delivery';

class CustomerIOIntegration extends VDMV2ObjectDestination<
  CustomerIOV2Payload,
  typeof recordInputSchema,
  typeof eventStreamInputSchema
> {
  protected readonly recordSchema = recordInputSchema;

  protected readonly eventStreamSchema = eventStreamInputSchema;

  // Only the 207 multi-status needs handling; see ./v2/delivery.
  static readonly delivery = customerIODelivery;

  private assertObjectSize(body: unknown): void {
    const size = Buffer.byteLength(JSON.stringify(body), 'utf8');
    if (size > MAX_OBJECT_SIZE_BYTES) {
      throw new InstrumentationError(
        `Event size (${size} bytes) exceeds CustomerIO's 32KB per-object limit.`,
      );
    }
  }

  private buildRecord(
    input: z.infer<typeof recordInputSchema>,
    objectType: CustomerIORecordObject,
  ): TransformedEvent<CustomerIOV2Payload> {
    validateConfigFields(this.destination);
    const body = buildRecordEvent(input.message, objectType);
    this.assertObjectSize(body);
    return { body, ...buildRequestMeta(this.destination) };
  }

  transformObjectRecord(input: z.infer<typeof recordInputSchema>) {
    const person = () => this.buildRecord(input, CUSTOMERIO_RECORD_OBJECTS.person);
    const event = () => this.buildRecord(input, CUSTOMERIO_RECORD_OBJECTS.event);
    return {
      [CUSTOMERIO_RECORD_OBJECTS.person]: { insert: person, update: person, delete: person },
      [CUSTOMERIO_RECORD_OBJECTS.event]: { insert: event, update: event },
    };
  }

  private wrapEventStreamBody(payload: CustomerIOV2Payload): TransformedEvent<CustomerIOV2Payload> {
    const body = removeUndefinedValues(payload) as CustomerIOV2Payload;
    this.assertObjectSize(body);
    return { body, ...buildRequestMeta(this.destination) };
  }

  // Reuses processRouterDest's own per-event builder (transform.ts) so event-stream events
  // keep shipping in their V1 request shape unless destination.Config.apiVersion opts into v2.
  // That builder dispatches on message.type itself, so one call handles every event-stream type.
  private buildV1EventStreamEvent(message: unknown): TransformedEvent<CustomerIOV2Payload> {
    const v1Response = v1ProcessEventStream({
      message,
      destination: this.destination,
    });
    return {
      // V1 payload shapes (e.g. `{ data, name, type: 'event', ... }`) don't conform to
      // CustomerIOV2Payload's `type`/`action` fields — this path exists only to ship them
      // through unchanged.
      body: v1Response.body.JSON as unknown as CustomerIOV2Payload,
      endpoint: v1Response.endpoint,
      endpointPath: v1Response.endpointPath,
      method: v1Response.method,
      headers: v1Response.headers,
    };
  }

  transformEventStream(input: z.infer<typeof eventStreamInputSchema>) {
    const { message } = input;

    if (!isEventStreamV2APIEnabled(this.destination)) {
      // buildV1EventStreamEvent (via processSingleMessage) already validates config
      // fields, so skip the redundant check below.
      const v1Handler = () => this.buildV1EventStreamEvent(message);
      return {
        identify: v1Handler,
        track: v1Handler,
        page: v1Handler,
        screen: v1Handler,
        group: v1Handler,
        alias: v1Handler,
      };
    }

    validateConfigFields(this.destination);
    return {
      identify: () => this.wrapEventStreamBody(buildIdentify(message, this.destination)),
      track: () => {
        const evName = get(message, 'event');
        const deviceAction = deviceActionFor(message, evName, this.destination);
        return this.wrapEventStreamBody(
          deviceAction
            ? buildDevice(message, deviceAction, this.destination)
            : buildTrack(message, evName, this.destination),
        );
      },
      page: () =>
        this.wrapEventStreamBody(
          buildPage(
            message,
            'page',
            get(message, 'name') || get(message, 'properties.url'),
            this.destination,
          ),
        ),
      screen: () =>
        this.wrapEventStreamBody(
          buildScreen(
            message,
            'screen',
            get(message, 'event') || get(message, 'properties.name'),
            this.destination,
          ),
        ),
      group: () => this.wrapEventStreamBody(buildObject(message, this.destination)),
      alias: () => this.wrapEventStreamBody(buildMerge(message, this.destination)),
    };
  }

  getBatchStrategy(endpoint: string): BatchStrategy<CustomerIOV2Payload> {
    if (endpoint === getV2Endpoint(this.destination.Config.datacenter)) {
      return new ChunkBatchStrategy<CustomerIOV2Payload>({
        maxPayloadSize: MAX_BATCH_PAYLOAD,
        wrapBody: (bodies) => ({ batch: bodies }),
      });
    }
    // V1 endpoints — used for event-stream events unless destination.Config.apiVersion is v2 —
    // don't support batching; each event ships as its own request, matching
    // processRouterDest's behaviour.
    return new CustomBatchStrategy<CustomerIOV2Payload>((payloads) =>
      payloads.map((payload) => ({ body: payload.body, jobIds: new Set([payload.jobId]) })),
    );
  }
}

export const Integration = CustomerIOIntegration;
