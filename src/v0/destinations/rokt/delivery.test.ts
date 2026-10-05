import {
  firstJobIdentity,
  handleDeliveryResponse,
} from '../../../services/destination/destinationIntegration/delivery';
import type { DeliveryContext } from '../../../services/destination/destinationIntegration/delivery';
import type { ProxyMetdata, ProxyV1Request } from '../../../types';
import { Integration } from './routerTransform';

const job: ProxyMetdata = {
  jobId: 1,
  attemptNum: 1,
  userId: 'synthetic-user',
  sourceId: 'source-1',
  destinationId: 'rokt-dest-1',
  workspaceId: 'ws-1',
  secret: {},
  dontBatch: false,
};

const context = (
  status: number,
  response: unknown = {},
  jobCount = 1,
  serializedBatch = '[]',
): DeliveryContext => {
  const jobs = Array.from({ length: jobCount }, (_, index) => ({ ...job, jobId: index + 1 }));

  return {
    status,
    response,
    jobs,
    request: { body: { JSON_ARRAY: { batch: serializedBatch } } } as unknown as ProxyV1Request,
    destinationConfig: {},
    ...firstJobIdentity(jobs),
  };
};

const currencyError = {
  code: 'BAD_REQUEST',
  message:
    "Error reading string. Unexpected token: StartObject. Path 'data.custom_attributes.currency', line 1, position 314.",
};

const advertisingIdError = {
  code: 'BAD_REQUEST',
  message:
    "Error converting value &quot;not-a-guid&quot; to type 'System.Guid'. Path '[1].device_info.ios_advertising_id', line 1, position 153.",
};

describe('ROKT delivery', () => {
  it('treats HTTP 202 with an empty response body as successful', () => {
    expect(handleDeliveryResponse(Integration, context(202))).toEqual({ kind: 'success' });
  });

  it('maps an indexed batch-level error to only the failed event', () => {
    expect(
      handleDeliveryResponse(Integration, context(202, { errors: [advertisingIdError] }, 3)),
    ).toEqual({
      kind: 'perItem',
      verdicts: [
        { kind: 'success' },
        {
          kind: 'retry',
          reason:
            "Rokt rejected this event: BAD_REQUEST - Error converting value \"not-a-guid\" to type 'System.Guid'. Path '[1].device_info.ios_advertising_id', line 1, position 153.; retrying it individually.",
          dontBatch: true,
        },
        { kind: 'success' },
      ],
    });
  });

  it('maps an event-data error position to only the failed event', () => {
    const batches = [{ value: 'good-1' }, { currency: { code: 'USD' } }, { value: 'good-2' }];
    const serializedBatch = JSON.stringify(batches);
    const position = serializedBatch.indexOf('{"code":"USD"}') + 1;
    const positionedCurrencyError = {
      ...currencyError,
      message: currencyError.message.replace(/position \d+/, `position ${position}`),
    };

    expect(
      handleDeliveryResponse(
        Integration,
        context(202, { errors: [positionedCurrencyError] }, 3, serializedBatch),
      ),
    ).toEqual({
      kind: 'perItem',
      verdicts: [
        { kind: 'success' },
        {
          kind: 'retry',
          reason: `Rokt rejected this event: ${positionedCurrencyError.code} - ${positionedCurrencyError.message}; retrying it individually.`,
          dontBatch: true,
        },
        { kind: 'success' },
      ],
    });
  });

  it('retries every job when a partial failure cannot be attributed', () => {
    const unlocatedError = { code: 'BAD_REQUEST', message: 'Invalid event batch.' };

    expect(
      handleDeliveryResponse(Integration, context(202, { errors: [unlocatedError] }, 3)),
    ).toEqual({
      kind: 'retry',
      reason:
        'Rokt rejected 1 of 3 events (BAD_REQUEST - Invalid event batch.); retrying each event individually.',
      dontBatch: true,
    });
  });

  it('includes parsed Rokt errors when aborting HTTP 400 responses', () => {
    expect(handleDeliveryResponse(Integration, context(400, { errors: [currencyError] }))).toEqual({
      kind: 'abort',
      reason:
        "Rokt rejected the bulk request (status 400): BAD_REQUEST - Error reading string. Unexpected token: StartObject. Path 'data.custom_attributes.currency', line 1, position 314.",
    });
  });

  it('explains empty HTTP 401 and 403 credential responses', () => {
    expect(handleDeliveryResponse(Integration, context(401, ''))).toEqual({
      kind: 'abort',
      reason: 'Rokt rejected the bulk request (status 401): no credentials were sent.',
    });
    expect(handleDeliveryResponse(Integration, context(403, ''))).toEqual({
      kind: 'abort',
      reason:
        'Rokt rejected the bulk request (status 403): the Server-to-Server key/secret were rejected; check the destination credentials.',
    });
  });

  it('describes responses that do not contain Rokt errors', () => {
    expect(handleDeliveryResponse(Integration, context(400, { unexpected: true }))).toEqual({
      kind: 'abort',
      reason:
        'Rokt rejected the bulk request (status 400): Rokt returned no recognized error details.',
    });
  });

  it('preserves framework success, throttle, and retry semantics for other responses', () => {
    expect(handleDeliveryResponse(Integration, context(200))).toEqual({ kind: 'success' });
    expect(handleDeliveryResponse(Integration, context(429))).toMatchObject({
      kind: 'retry',
      as: 'throttled',
    });
    expect(handleDeliveryResponse(Integration, context(503))).toMatchObject({ kind: 'retry' });
  });
});
