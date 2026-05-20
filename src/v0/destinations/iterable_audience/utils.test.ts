import {
  buildSubscribeRequest,
  buildUnsubscribeRequest,
  chunkSubscribers,
  getSubscriberForEvent,
} from './utils';
import { RecordAction } from '../../../types/rudderEvents';

const baseEvent: any = {
  message: {
    type: 'record',
    action: RecordAction.INSERT,
    identifiers: { email: 'TeSt@Example.com', userId: 'user_1' },
  },
  destination: {
    Config: {
      apiKey: 'secret',
      dataCenter: 'USDC',
      projectType: 'hybrid',
    },
  },
  connection: {
    config: {
      destination: {
        audienceId: 123,
        identifierMappings: [{ from: 'email_col', to: 'email' }],
      },
    },
  },
};

describe('iterable_audience utils', () => {
  it('should normalize email for hybrid mapped email', () => {
    const subscriber = getSubscriberForEvent(baseEvent);
    expect(subscriber).toEqual({ email: 'test@example.com' });
  });

  it('should use userId for userid_based', () => {
    const event = {
      ...baseEvent,
      destination: { Config: { ...baseEvent.destination.Config, projectType: 'userid_based' } },
    };
    const subscriber = getSubscriberForEvent(event);
    expect(subscriber).toEqual({ userId: 'user_1' });
  });

  it('should chunk subscribers with max size', () => {
    const input = new Array(1001).fill(null).map((_, i) => ({ userId: `u_${i}` }));
    const chunks = chunkSubscribers(input);
    expect(chunks).toHaveLength(2);
    expect(chunks[0]).toHaveLength(1000);
    expect(chunks[1]).toHaveLength(1);
  });

  it('should build subscribe request', () => {
    const req = buildSubscribeRequest(baseEvent, [{ email: 'test@example.com' }]);
    expect(req.endpoint).toContain('/lists/subscribe');
    expect(req.body.JSON.channelUnsubscribe).toBeUndefined();
  });

  it('should build unsubscribe request with channelUnsubscribe false', () => {
    const req = buildUnsubscribeRequest(baseEvent, [{ email: 'test@example.com' }]);
    expect(req.endpoint).toContain('/lists/unsubscribe');
    expect(req.body.JSON.channelUnsubscribe).toBe(false);
  });
});
