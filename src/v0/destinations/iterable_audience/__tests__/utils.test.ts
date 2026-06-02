import { InstrumentationError } from '@rudderstack/integrations-lib';
import {
  IDENTIFIER_FIELD_CONFIG,
  buildSubscribeBody,
  buildUnsubscribeBody,
  selectIdentifierForRow,
} from '../utils';
import { PROJECT_TYPES } from '../config';
import type { IterableSubscriber } from '../types';

describe('IDENTIFIER_FIELD_CONFIG.email', () => {
  it('normalize trims and lowercases', () => {
    expect(IDENTIFIER_FIELD_CONFIG.email.normalize!('  Alice@Example.COM  ')).toBe(
      'alice@example.com',
    );
  });

  it('validate accepts well-formed email', () => {
    expect(IDENTIFIER_FIELD_CONFIG.email.validate!('alice@example.com')).toBe(true);
  });

  it('validate rejects malformed email', () => {
    expect(IDENTIFIER_FIELD_CONFIG.email.validate!('not-an-email')).toBe(false);
    expect(IDENTIFIER_FIELD_CONFIG.email.validate!('missing@domain')).toBe(false);
  });
});

describe('IDENTIFIER_FIELD_CONFIG.userId', () => {
  it('normalize preserves case', () => {
    expect(IDENTIFIER_FIELD_CONFIG.userId.normalize!('User-ABC_123')).toBe('User-ABC_123');
  });

  it('validate accepts case-mixed value', () => {
    expect(IDENTIFIER_FIELD_CONFIG.userId.validate!('User-ABC_123')).toBe(true);
  });

  it('validate rejects leading whitespace', () => {
    expect(IDENTIFIER_FIELD_CONFIG.userId.validate!(' u-1')).toBe(false);
  });

  it('validate rejects trailing whitespace', () => {
    expect(IDENTIFIER_FIELD_CONFIG.userId.validate!('u-1 ')).toBe(false);
  });

  it('validate rejects empty string', () => {
    expect(IDENTIFIER_FIELD_CONFIG.userId.validate!('')).toBe(false);
  });
});

describe('selectIdentifierForRow', () => {
  it('email-based + email present returns email subscriber', () => {
    expect(selectIdentifierForRow({ email: 'a@b.com' }, PROJECT_TYPES.EMAIL_BASED)).toEqual({
      email: 'a@b.com',
    });
  });

  it('email-based + only userId present throws', () => {
    expect(() => selectIdentifierForRow({ userId: 'u-1' }, PROJECT_TYPES.EMAIL_BASED)).toThrow(
      InstrumentationError,
    );
  });

  it('userId-based + userId returns userId subscriber', () => {
    expect(selectIdentifierForRow({ userId: 'u-1' }, PROJECT_TYPES.USERID_BASED)).toEqual({
      userId: 'u-1',
    });
  });

  it('userId-based + only email present throws', () => {
    expect(() => selectIdentifierForRow({ email: 'a@b.com' }, PROJECT_TYPES.USERID_BASED)).toThrow(
      InstrumentationError,
    );
  });

  it('hybrid + both sends email and userId', () => {
    expect(
      selectIdentifierForRow({ email: 'a@b.com', userId: 'u-1' }, PROJECT_TYPES.HYBRID),
    ).toEqual({ userId: 'u-1', email: 'a@b.com' });
  });

  it('hybrid + email only returns email', () => {
    expect(selectIdentifierForRow({ email: 'a@b.com' }, PROJECT_TYPES.HYBRID)).toEqual({
      email: 'a@b.com',
    });
  });

  it('hybrid + neither throws', () => {
    expect(() => selectIdentifierForRow({}, PROJECT_TYPES.HYBRID)).toThrow(InstrumentationError);
  });

  it('email-based + empty input throws', () => {
    expect(() => selectIdentifierForRow({}, PROJECT_TYPES.EMAIL_BASED)).toThrow(
      InstrumentationError,
    );
  });
});

describe('buildSubscribeBody', () => {
  it('returns listId + subscribers without channelUnsubscribe', () => {
    const subscribers: IterableSubscriber[] = [{ email: 'a@b.com' }];
    const body = buildSubscribeBody(42, subscribers);
    expect(body).toEqual({ listId: 42, subscribers });
    expect(Object.prototype.hasOwnProperty.call(body, 'channelUnsubscribe')).toBe(false);
  });

  it('includes updateExistingUsersOnly:true when explicitly set', () => {
    const subscribers: IterableSubscriber[] = [{ email: 'a@b.com' }];
    expect(buildSubscribeBody(42, subscribers, true)).toEqual({
      listId: 42,
      subscribers,
      updateExistingUsersOnly: true,
    });
  });

  it('includes updateExistingUsersOnly:false when explicitly set', () => {
    const subscribers: IterableSubscriber[] = [{ email: 'a@b.com' }];
    expect(buildSubscribeBody(42, subscribers, false)).toEqual({
      listId: 42,
      subscribers,
      updateExistingUsersOnly: false,
    });
  });

  it('omits updateExistingUsersOnly from the wire body when undefined', () => {
    const subscribers: IterableSubscriber[] = [{ email: 'a@b.com' }];
    const body = buildSubscribeBody(42, subscribers, undefined);
    // toEqual treats `{ x: undefined }` as equal to `{}`, mirroring how
    // JSON.stringify drops `undefined`-valued keys before the wire send.
    expect(body).toEqual({ listId: 42, subscribers });
    expect(JSON.parse(JSON.stringify(body))).toEqual({ listId: 42, subscribers });
  });
});

describe('buildUnsubscribeBody', () => {
  it('returns listId + subscribers + channelUnsubscribe:false', () => {
    const subscribers: IterableSubscriber[] = [{ userId: 'u-1' }];
    const body = buildUnsubscribeBody(42, subscribers);
    expect(body).toEqual({
      listId: 42,
      subscribers,
      channelUnsubscribe: false,
    });
    // Iterable's unsubscribe endpoint does not document updateExistingUsersOnly;
    // make sure it never sneaks into the unsubscribe body.
    expect(Object.prototype.hasOwnProperty.call(body, 'updateExistingUsersOnly')).toBe(false);
  });

  it('keeps channelUnsubscribe:false explicit even with empty subscribers', () => {
    expect(buildUnsubscribeBody('list-id', [])).toEqual({
      listId: 'list-id',
      subscribers: [],
      channelUnsubscribe: false,
    });
  });
});
