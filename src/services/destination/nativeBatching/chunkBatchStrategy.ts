import type { TransformedEvent, BatchGroup, BatchStrategy } from './types';
import { BodyFormat, parseSizeToBytes } from './types';

export class ChunkBatchStrategy<TBody extends Record<string, unknown> = Record<string, unknown>>
  implements BatchStrategy<TBody>
{
  bodyFormat: BodyFormat;

  private maxItems: number;

  private maxPayloadSize: number;

  private wrapBody: (bodies: TBody[]) => Record<string, unknown>;

  constructor(opts: {
    maxItems?: number;
    maxPayloadSize?: string;
    bodyFormat?: BodyFormat;
    wrapBody: (bodies: TBody[]) => Record<string, unknown>;
  }) {
    this.maxItems = opts.maxItems ?? Infinity;
    this.maxPayloadSize = opts.maxPayloadSize ? parseSizeToBytes(opts.maxPayloadSize) : Infinity;
    this.bodyFormat = opts.bodyFormat ?? BodyFormat.JSON;
    this.wrapBody = opts.wrapBody;
  }

  batch(payloads: (TransformedEvent<TBody> & { jobId: number })[]): BatchGroup[] {
    const results: BatchGroup[] = [];
    let currentBodies: TBody[] = [];
    let currentJobIds = new Set<number>();

    const flush = () => {
      if (currentBodies.length > 0) {
        results.push({
          body: this.wrapBody(currentBodies),
          jobIds: new Set(currentJobIds),
        });
        currentBodies = [];
        currentJobIds = new Set();
      }
    };

    for (const payload of payloads) {
      if (currentBodies.length >= this.maxItems) {
        flush();
      }

      if (this.maxPayloadSize < Infinity) {
        const prospectiveBytes = Buffer.byteLength(
          JSON.stringify(this.wrapBody([...currentBodies, payload.body])),
        );
        if (prospectiveBytes > this.maxPayloadSize) {
          flush();
        }
      }

      currentBodies.push(payload.body);
      currentJobIds.add(payload.jobId);
    }

    flush();
    return results;
  }
}
