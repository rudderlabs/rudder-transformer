import { readString } from './coerce';
import { BuildRouterTransformBodyOptions } from './types';

export const buildRouterTransformBody = (
  destination: string,
  message: Record<string, unknown>,
  config: Record<string, unknown>,
  jobId: number,
  options?: BuildRouterTransformBodyOptions,
) => ({
  input: [
    {
      message,
      destination: { ID: `live-${destination}`, Config: config, Enabled: true },
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
    },
  ],
  destType: destination,
});
