import type { TransformedEvent } from './types';
import { parseSizeToBytes } from './types';

export type PayloadChunk<TBody extends Record<string, unknown>> = {
  bodies: TBody[];
  jobIds: Set<number>;
};

export function chunkPayloadsBySize<TBody extends Record<string, unknown>>(
  payloads: (TransformedEvent<TBody> & { jobId: number })[],
  opts: {
    maxItems?: number;
    maxPayloadSize?: string;
    wrapBody: (bodies: TBody[]) => Record<string, unknown>;
  },
): PayloadChunk<TBody>[] {
  const maxItems = opts.maxItems ?? Infinity;
  const maxPayloadSize = opts.maxPayloadSize ? parseSizeToBytes(opts.maxPayloadSize) : Infinity;
  const { wrapBody } = opts;

  const chunks: PayloadChunk<TBody>[] = [];
  let currentBodies: TBody[] = [];
  let currentJobIds = new Set<number>();

  const flush = () => {
    if (currentBodies.length > 0) {
      chunks.push({ bodies: currentBodies, jobIds: currentJobIds });
      currentBodies = [];
      currentJobIds = new Set();
    }
  };

  for (const payload of payloads) {
    if (currentBodies.length >= maxItems) {
      flush();
    }

    if (maxPayloadSize < Infinity) {
      const prospectiveBytes = Buffer.byteLength(
        JSON.stringify(wrapBody([...currentBodies, payload.body])),
      );
      if (prospectiveBytes > maxPayloadSize) {
        flush();
      }
    }

    currentBodies.push(payload.body);
    currentJobIds.add(payload.jobId);
  }

  flush();
  return chunks;
}
