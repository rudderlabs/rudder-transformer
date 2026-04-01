import type { TransformedEvent, BatchGroup, BatchStrategy } from './types';
import { BodyFormat } from './types';

export class CustomBatchStrategy<TBody extends Record<string, unknown> = Record<string, unknown>>
  implements BatchStrategy<TBody>
{
  bodyFormat: BodyFormat;

  private batchFn: (payloads: (TransformedEvent<TBody> & { jobId: number })[]) => BatchGroup[];

  constructor(
    batchFn: (payloads: (TransformedEvent<TBody> & { jobId: number })[]) => BatchGroup[],
    bodyFormat?: BodyFormat,
  ) {
    this.batchFn = batchFn;
    this.bodyFormat = bodyFormat ?? BodyFormat.JSON;
  }

  batch(payloads: (TransformedEvent<TBody> & { jobId: number })[]): BatchGroup[] {
    return this.batchFn(payloads);
  }
}
