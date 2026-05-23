import { ConfigurationError, InstrumentationError } from '@rudderstack/integrations-lib';
import {
  IDENTIFIER_FIELD_CONFIG,
  buildSubscribeBody,
  buildUnsubscribeBody,
  remapToIterableFields,
  selectIdentifierForRow,
  validateProjectTypeMappings,
} from '../utils';
import { PROJECT_TYPES } from '../config';
import type { IdentifierMapping, IterableSubscriber } from '../types';

describe('remapToIterableFields', () => {
  const mappings: IdentifierMapping[] = [
    { from: 'email_col', to: 'email' },
    { from: 'uid_col', to: 'userId' },
  ];

  it('maps non-empty source columns to iterable field keys', () => {
    expect(remapToIterableFields({ email_col: 'a@b.com', uid_col: 'u-1' }, mappings)).toEqual({
      email: 'a@b.com',
      userId: 'u-1',
    });
  });

  it('drops null, undefined, and empty-string values', () => {
    expect(remapToIterableFields({ email_col: null, uid_col: '' }, mappings)).toEqual({});
    expect(remapToIterableFields({ email_col: undefined, uid_col: 'u-1' }, mappings)).toEqual({
      userId: 'u-1',
    });
  });

  it('ignores source columns not present in mappings', () => {
    expect(remapToIterableFields({ extra_col: 'x', email_col: 'a@b.com' }, mappings)).toEqual({
      email: 'a@b.com',
    });
  });
});

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

  it('hybrid + both prefers userId', () => {
    expect(
      selectIdentifierForRow({ email: 'a@b.com', userId: 'u-1' }, PROJECT_TYPES.HYBRID),
    ).toEqual({ userId: 'u-1' });
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
});

describe('buildUnsubscribeBody', () => {
  it('returns listId + subscribers + channelUnsubscribe:false', () => {
    const subscribers: IterableSubscriber[] = [{ userId: 'u-1' }];
    expect(buildUnsubscribeBody(42, subscribers)).toEqual({
      listId: 42,
      subscribers,
      channelUnsubscribe: false,
    });
  });

  it('keeps channelUnsubscribe:false explicit even with empty subscribers', () => {
    expect(buildUnsubscribeBody('list-id', [])).toEqual({
      listId: 'list-id',
      subscribers: [],
      channelUnsubscribe: false,
    });
  });
});

describe('validateProjectTypeMappings', () => {
  it('email-based with one email mapping passes', () => {
    expect(() =>
      validateProjectTypeMappings(PROJECT_TYPES.EMAIL_BASED, [{ from: 'email', to: 'email' }]),
    ).not.toThrow();
  });

  it('email-based with userId mapping throws', () => {
    expect(() =>
      validateProjectTypeMappings(PROJECT_TYPES.EMAIL_BASED, [{ from: 'user_id', to: 'userId' }]),
    ).toThrow(ConfigurationError);
  });

  it('email-based with two mappings throws', () => {
    expect(() =>
      validateProjectTypeMappings(PROJECT_TYPES.EMAIL_BASED, [
        { from: 'email', to: 'email' },
        { from: 'user_id', to: 'userId' },
      ]),
    ).toThrow(ConfigurationError);
  });

  it('userId-based with one userId mapping passes', () => {
    expect(() =>
      validateProjectTypeMappings(PROJECT_TYPES.USERID_BASED, [{ from: 'user_id', to: 'userId' }]),
    ).not.toThrow();
  });

  it('userId-based with email mapping throws', () => {
    expect(() =>
      validateProjectTypeMappings(PROJECT_TYPES.USERID_BASED, [{ from: 'email', to: 'email' }]),
    ).toThrow(ConfigurationError);
  });

  it('hybrid with email+userId passes', () => {
    expect(() =>
      validateProjectTypeMappings(PROJECT_TYPES.HYBRID, [
        { from: 'email', to: 'email' },
        { from: 'user_id', to: 'userId' },
      ]),
    ).not.toThrow();
  });

  it('hybrid with one mapping passes', () => {
    expect(() =>
      validateProjectTypeMappings(PROJECT_TYPES.HYBRID, [{ from: 'email', to: 'email' }]),
    ).not.toThrow();
  });

  it('hybrid with two email mappings (non-distinct) throws', () => {
    expect(() =>
      validateProjectTypeMappings(PROJECT_TYPES.HYBRID, [
        { from: 'email_a', to: 'email' },
        { from: 'email_b', to: 'email' },
      ]),
    ).toThrow(ConfigurationError);
  });

  it('hybrid with three mappings throws', () => {
    expect(() =>
      validateProjectTypeMappings(PROJECT_TYPES.HYBRID, [
        { from: 'email', to: 'email' },
        { from: 'user_id', to: 'userId' },
        { from: 'email2', to: 'email' },
      ]),
    ).toThrow(ConfigurationError);
  });

  it('hybrid with zero mappings throws', () => {
    expect(() => validateProjectTypeMappings(PROJECT_TYPES.HYBRID, [])).toThrow(ConfigurationError);
  });
});
