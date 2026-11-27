import {
  resolveDeliverySpec,
  retry,
} from '../../../services/destination/destinationIntegration/destinationIntegration';
import { Integration } from './routerTransform';
import { processDestinationIntegration } from '../../../services/destination/destinationIntegration/processDestinationIntegration';
import type { RouterTransformationRequestData } from '../../../types';

jest.mock('./utils', () => ({
  ...jest.requireActual('./utils'),
  createClient: (event: RouterTransformationRequestData) => ({
    baseUrl: 'https://example.zendesk.com/api/v2/',
    headers: { Authorization: 'Bearer token' },
    request: jest.fn().mockResolvedValue({ users: [{ id: 22 }] }),
  }),
}));

const spec = resolveDeliverySpec(Integration);
const context = (destinationVersion: number) =>
  ({
    request: { destinationVersion },
    status: 401,
  }) as Parameters<NonNullable<(typeof spec.statusOverrides)[401]>>[0];

describe('Zendesk delivery authentication', () => {
  it('uses the framework default for v1 Basic-auth 401', () => {
    const fallback = jest.fn(() => retry('legacy 401'));
    expect(spec.statusOverrides[401]?.(context(1), fallback)).toEqual(retry('legacy 401'));
    expect(fallback).toHaveBeenCalledTimes(1);
  });

  it('asks for refresh on a 401 using the version emitted by the framework', async () => {
    const destination = {
      ID: 'dest',
      version: 2,
      Config: { domain: 'example', rudderAccountId: 'account' },
      deliveryAccount: {
        id: 'account',
        accountDefinitionName: 'DESTINATION_ZENDESK_OAUTH_AUTH_CODE',
      },
      DestinationDefinition: { Name: 'ZENDESK' },
    };
    const event = {
      destination,
      message: {
        type: 'track',
        event: 'Bought',
        userId: 'uid',
        context: { traits: { email: 'a@b.com' } },
      },
      metadata: {
        jobId: 1,
        workspaceId: 'ws',
        destinationId: 'dest',
        secret: { accessToken: 'token' },
      },
    } as unknown as RouterTransformationRequestData;
    const [output] = await processDestinationIntegration([event], Integration, {});
    expect(output.batchedRequest).toMatchObject({ destinationVersion: 2 });
    const request = output.batchedRequest;
    const fallback = jest.fn(() => retry('legacy 401'));
    expect(
      spec.statusOverrides[401]?.({ ...context(2), request } as never, fallback),
    ).toMatchObject({
      as: 'authExpired',
    });
    expect(fallback).not.toHaveBeenCalled();
  });

  it('asks the framework to refresh an OAuth token on v2 401', () => {
    const fallback = jest.fn(() => retry('legacy 401'));
    expect(spec.statusOverrides[401]?.(context(2), fallback)).toEqual({
      kind: 'retry',
      reason: 'Zendesk OAuth access token expired',
      as: 'authExpired',
    });
    expect(fallback).not.toHaveBeenCalled();
  });
});
