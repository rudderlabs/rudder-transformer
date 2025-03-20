import { createMockContext } from '@shopify/jest-koa-mocks';
import { ProcessorTransformationRequest } from '../../../types/index';
import { DestinationPreTransformationService } from '../../destination/preTransformation';

describe('PreTransformation Service', () => {
  test('should enhance events with query params', async () => {
    const ctx = createMockContext();
    ctx.request.query = { cycle: 'true', x: 'y' };

    const events: ProcessorTransformationRequest[] = [
      { message: { a: 'b' } } as unknown as ProcessorTransformationRequest,
    ];
    const expected: ProcessorTransformationRequest[] = [
      {
        message: { a: 'b' },
        request: { query: { cycle: 'true', x: 'y' } },
      } as unknown as ProcessorTransformationRequest,
    ];

    const resp = DestinationPreTransformationService.preProcess(events, ctx);
    expect(resp).toEqual(expected);
  });
});
