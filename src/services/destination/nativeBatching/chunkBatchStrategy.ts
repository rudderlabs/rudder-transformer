import type { TransformedEvent, BatchGroup, BatchStrategy } from './types';
import { BodyFormat } from './types';
import { chunkPayloads } from './chunkPayloads';

export class ChunkBatchStrategy<TBody extends Record<string, unknown> = Record<string, unknown>>
  implements BatchStrategy<TBody>
{
  bodyFormat: BodyFormat;

  private maxItems?: number;

  private maxPayloadSize?: string;

  private wrapBody: (bodies: TBody[]) => Record<string, unknown>;

  constructor(opts: {
    maxItems?: number;
    maxPayloadSize?: string;
    bodyFormat?: BodyFormat;
    wrapBody: (bodies: TBody[]) => Record<string, unknown>;
  }) {
    this.maxItems = opts.maxItems;
    this.maxPayloadSize = opts.maxPayloadSize;
    this.bodyFormat = opts.bodyFormat ?? BodyFormat.JSON;
    this.wrapBody = opts.wrapBody;
  }

  async batch(payloads: (TransformedEvent<TBody> & { jobId: number })[]): Promise<BatchGroup[]> {
    const chunks = chunkPayloads(payloads, {
      maxItems: this.maxItems,
      maxPayloadSize: this.maxPayloadSize,
      wrapBody: this.wrapBody,
    });
    return chunks.map((chunk) => ({
      body: this.wrapBody(chunk.bodies),
      jobIds: chunk.jobIds,
    }));
  }
}
