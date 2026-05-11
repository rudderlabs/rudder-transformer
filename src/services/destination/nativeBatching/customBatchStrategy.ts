import type { TransformedEvent, BatchGroup, BatchStrategy } from './types';
import { BodyFormat } from './types';

export class CustomBatchStrategy<TBody extends Record<string, unknown> = Record<string, unknown>>
  implements BatchStrategy<TBody>
{
  bodyFormat: BodyFormat;

  private batchFn: (
    payloads: (TransformedEvent<TBody> & { jobId: number })[],
  ) => BatchGroup[] | Promise<BatchGroup[]>;

  constructor(
    batchFn: (
      payloads: (TransformedEvent<TBody> & { jobId: number })[],
    ) => BatchGroup[] | Promise<BatchGroup[]>,
    bodyFormat?: BodyFormat,
  ) {
    this.batchFn = batchFn;
    this.bodyFormat = bodyFormat ?? BodyFormat.JSON;
  }

  async batch(payloads: (TransformedEvent<TBody> & { jobId: number })[]): Promise<BatchGroup[]> {
    return this.batchFn(payloads);
  }
}
