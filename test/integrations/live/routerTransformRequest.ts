import { readString } from './coerce';
import type {
  BuildRouterTransformBodyOptions,
  RouterTransformRequestBody,
  SeededEvent,
} from './types';

// Assembles the /routerTransform body from the events a pipeline step seeded — one `input[]` entry
// per event, all in one call. A step whose `seed` returns a single event passes a one-element
// array; one that returns several passes the whole batch, which is what lets the router group (or
// fan out) them for real.
export const buildRouterTransformBody = (
  destination: string,
  events: SeededEvent[],
  config: Record<string, unknown>,
  options?: BuildRouterTransformBodyOptions,
): RouterTransformRequestBody => ({
  input: events.map(({ message, jobId }) => ({
    message,
    destination: {
      ID: `live-${destination}`,
      // The service selector routes on DestinationDefinition.Name (e.g. CDK v2 vs native), as
      // rudder-server sends it; without it every CDK v2 destination falls back to the native path.
      DestinationDefinition: { Name: destination.toUpperCase() },
      Config: config,
      Enabled: true,
      ...(options?.deliveryAccount ? { deliveryAccount: options.deliveryAccount } : {}),
      ...(options?.destinationOverride ?? {}),
    },
    ...(options?.connection ? { connection: options.connection } : {}),
    metadata: {
      jobId,
      attemptNum: 0,
      userId: readString(message.userId, 'live-user'),
      sourceId: 'live-sourceId',
      destinationId: `live-${destination}`,
      workspaceId: 'live-workspaceId',
      secret: options?.secret ?? {},
      ...(options?.metadataOverride ?? {}),
    },
  })),
  destType: destination,
});
