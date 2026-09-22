import type { RouterTestData } from '../../../testTypes';
import { destination, endpoint, metadata } from '../common';

const request = (params: Record<string, unknown>) => ({
  batchedRequest: {
    version: '1',
    type: 'REST',
    method: 'GET',
    endpoint,
    endpointPath: 'postback',
    headers: {},
    params,
    body: { JSON: {}, JSON_ARRAY: {}, XML: {}, FORM: {} },
    files: {},
  },
  metadata: [metadata(1)],
  destination,
  batched: true,
  statusCode: 200,
});

export const data: RouterTestData[] = [
  {
    id: 'everflow-router-full-track',
    name: 'everflow',
    description: 'Everflow track events map to singleton GET postbacks with raw query params',
    scenario: 'Cloud-mode Advertiser S2S Postback transformation',
    successCriteria:
      'Mapped params remain raw, timestamp uses epoch seconds, and forbidden params are absent',
    feature: 'router',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        method: 'POST',
        body: {
          input: [
            {
              message: {
                type: 'track',
                event: 'Order Completed & Verified',
                messageId: 'message-1',
                anonymousId: 'anonymous-1',
                userId: 'user-1',
                timestamp: '2026-05-20T12:34:56.789Z',
                traits: { email: 'fallback@example.com' },
                context: {
                  traits: { email: 'user@example.com' },
                  ip: '203.0.113.1',
                  userAgent: 'Test Agent/1.0',
                  device: { type: 'IPadOS', advertisingId: 'apple-ad-id' },
                  app: { namespace: 'com.example.app' },
                },
                properties: {
                  transactionId: 'transaction & 1',
                  revenue: '99.95',
                  currency: 'usd',
                  coupon: 'SPRING SALE',
                  eventId: 10,
                  advEventId: 'advertiser-event-1',
                  orderId: 'order-1',
                  adv1: 42,
                  adv10: false,
                  oid: 'offer-1',
                  affid: 'affiliate-1',
                  aid: 'must-not-be-sent',
                  sub1: 'must-not-be-sent',
                  random: 'must-not-be-sent',
                  source_id: 'must-not-be-sent',
                  unknown: 'must-not-be-sent',
                },
              },
              metadata: metadata(1),
              destination,
            },
          ],
          destType: 'everflow',
        },
      },
    },
    output: {
      response: {
        status: 200,
        body: {
          output: [
            request({
              nid: 'network-1',
              transaction_id: 'transaction & 1',
              verification_token: 'verification-token-1',
              amount: 99.95,
              currency: 'USD',
              coupon_code: 'SPRING SALE',
              event_id: 10,
              adv_event_id: 'advertiser-event-1',
              event_name: 'Order Completed & Verified',
              order_id: 'order-1',
              email: 'user@example.com',
              user_id: 'user-1',
              user_ip: '203.0.113.1',
              user_agent: 'Test Agent/1.0',
              timestamp: 1779280496,
              oid: 'offer-1',
              affid: 'affiliate-1',
              idfa: 'apple-ad-id',
              app_id: 'com.example.app',
              adv1: '42',
              adv10: 'false',
            }),
          ],
        },
      },
    },
  },
  {
    id: 'everflow-router-base-conversion',
    name: 'everflow',
    description: 'Everflow delivers a Base conversion without event routing parameters',
    scenario: 'Minimum valid track event',
    successCriteria:
      'Only account and transaction parameters are sent when optional values are unresolved',
    feature: 'router',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        method: 'POST',
        body: {
          input: [
            {
              message: { type: 'track', properties: { tid: 'minimum-transaction' } },
              metadata: metadata(1),
              destination: {
                ...destination,
                Config: { ...destination.Config, verificationToken: '' },
              },
            },
          ],
          destType: 'everflow',
        },
      },
    },
    output: {
      response: {
        status: 200,
        body: {
          output: [
            {
              ...request({ nid: 'network-1', transaction_id: 'minimum-transaction' }),
              destination: {
                ...destination,
                Config: { ...destination.Config, verificationToken: '' },
              },
            },
          ],
        },
      },
    },
  },
];
