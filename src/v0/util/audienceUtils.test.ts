import sha256 from 'sha256';
import { InstrumentationError, hashToSha256 } from '@rudderstack/integrations-lib';
import { processAudienceRecord, AudienceField, HashingType } from './audienceUtils';

jest.mock('../../util/stats', () => ({
  increment: jest.fn(),
}));

import stats from '../../util/stats';
import { createHash } from 'crypto';
import md5 from 'md5';

const mockStatsIncrement = stats.increment as jest.Mock;

const makeDestination = (
  overrides: {
    isHashRequired?: boolean;
    workspaceId?: string;
    id?: string;
    type?: string;
  } = {},
) => ({
  workspaceId: overrides.workspaceId ?? 'ws-1',
  id: overrides.id ?? 'dest-1',
  type: overrides.type ?? 'test_dest',
  config: {
    isHashRequired: overrides.isHashRequired ?? false,
  },
});

const emailField: AudienceField = {
  normalize: (v) => v.toLowerCase().trim(),
  validate: (v) => v.includes('@'),
  hashingType: HashingType.SHA256,
};

const phoneField: AudienceField = {
  normalize: (v) => v.replace(/\D/g, ''),
  validate: (v) => v.length >= 7,
  hashingType: HashingType.SHA256,
};

const idField: AudienceField = {
  normalize: (v) => v,
  hashingType: HashingType.NONE,
};

beforeEach(() => {
  mockStatsIncrement.mockClear();
});

describe('processAudienceRecord', () => {
  describe('normalization', () => {
    it('normalizes field values using the fieldConfig normalize function', () => {
      const result = processAudienceRecord(
        { email: '  User@Example.COM  ' },
        {
          fieldConfigs: { email: emailField },
          destination: makeDestination({ isHashRequired: true }),
        },
      );
      expect(result.email).toBe(sha256('user@example.com'));
    });

    it('uses identity normalization for unknown fields (no fieldConfig)', () => {
      const result = processAudienceRecord(
        { unknown_field: ' SomeValue' },
        { fieldConfigs: {}, destination: makeDestination() },
      );
      expect(result.unknown_field).toBe(' SomeValue');
    });

    it('drops fields that normalize to an empty string', () => {
      const emptyNormalize: AudienceField = {
        normalize: () => '',
        hashingType: HashingType.NONE,
      };
      const result = processAudienceRecord(
        { email: 'user@example.com' },
        { fieldConfigs: { email: emptyNormalize }, destination: makeDestination() },
      );
      expect(result).not.toHaveProperty('email');
    });

    it('converts raw value to string before normalizing', () => {
      const result = processAudienceRecord(
        { age: 42 },
        {
          fieldConfigs: { age: { normalize: (v) => v, hashingType: HashingType.NONE } },
          destination: makeDestination(),
        },
      );
      expect(result.age).toBe('42');
    });
  });

  describe('hashing', () => {
    it('hashes hashable fields when isHashRequired=true', () => {
      const result = processAudienceRecord(
        { email: 'user@example.com' },
        {
          fieldConfigs: { email: emailField },
          destination: makeDestination({ isHashRequired: true }),
        },
      );
      expect(result.email).toBe(sha256('user@example.com'));
    });

    it('passes pre-hashed hashable fields through when isHashRequired=false', () => {
      const sha256HashedEmail = hashToSha256('user@example.com');
      const result = processAudienceRecord(
        { email: sha256HashedEmail },
        {
          fieldConfigs: { email: emailField },
          destination: makeDestination({ isHashRequired: false }),
        },
      );
      expect(result.email).toBe(sha256HashedEmail);
    });

    it('does not hash non-hashable fields even when isHashRequired=true', () => {
      const result = processAudienceRecord(
        { extern_id: 'abc123' },
        {
          fieldConfigs: { extern_id: idField },
          destination: makeDestination({ isHashRequired: true }),
        },
      );
      expect(result.extern_id).toBe('abc123');
    });
  });

  describe('validation', () => {
    it('drops invalid fields and emits invalid field metric', () => {
      const result = processAudienceRecord(
        { email: 'not-an-email' },
        {
          fieldConfigs: { email: emailField },
          destination: makeDestination({ isHashRequired: true }),
        },
      );
      expect(result).not.toHaveProperty('email');
      expect(mockStatsIncrement).toHaveBeenCalledWith('test_dest_invalid_field', {
        fieldName: 'email',
        workspaceId: 'ws-1',
        destinationId: 'dest-1',
      });
    });

    it('does not emit invalid_field metric for valid fields', () => {
      processAudienceRecord(
        { email: 'user@example.com' },
        {
          fieldConfigs: { email: emailField },
          destination: makeDestination({ isHashRequired: true }),
        },
      );
      expect(mockStatsIncrement).not.toHaveBeenCalledWith(
        'test_dest_invalid_field',
        expect.anything(),
      );
    });

    it('uses a permissive default validator for fields without validate function', () => {
      const noValidate: AudienceField = { normalize: (v) => v, hashingType: HashingType.NONE };
      const result = processAudienceRecord(
        { custom: 'anything' },
        { fieldConfigs: { custom: noValidate }, destination: makeDestination() },
      );
      expect(result).toHaveProperty('custom', 'anything');
      expect(mockStatsIncrement).not.toHaveBeenCalledWith(
        'test_dest_invalid_field',
        expect.anything(),
      );
    });
  });

  describe('hashing consistency validation', () => {
    const plaintextEmail = 'user@example.com';
    const sha256HashedEmail = hashToSha256(plaintextEmail);
    const sha512HashedEmail = createHash('sha512').update(plaintextEmail).digest('hex');
    const md5HashedEmail = md5(plaintextEmail);

    it('hashing ON + pre-hashed value → emits metric and throws InstrumentationError', () => {
      expect(() =>
        processAudienceRecord(
          { email: sha256HashedEmail },
          {
            fieldConfigs: { email: emailField },
            destination: makeDestination({ isHashRequired: true }),
          },
        ),
      ).toThrow(/already be hashed/);
      expect(mockStatsIncrement).toHaveBeenCalledWith('audience_hashing_inconsistency', {
        propertyName: 'email',
        type: 'hashed_when_hash_enabled',
        workspaceId: 'ws-1',
        destinationId: 'dest-1',
        destType: 'test_dest',
      });
    });

    it('hashing OFF + plaintext value → emits metric and throws InstrumentationError', () => {
      expect(() =>
        processAudienceRecord(
          { email: plaintextEmail },
          {
            fieldConfigs: { email: emailField },
            destination: makeDestination({ isHashRequired: false }),
          },
        ),
      ).toThrow(/appears to be unhashed/);
      expect(mockStatsIncrement).toHaveBeenCalledWith('audience_hashing_inconsistency', {
        propertyName: 'email',
        type: 'unhashed_when_hash_disabled',
        workspaceId: 'ws-1',
        destinationId: 'dest-1',
        destType: 'test_dest',
      });
    });

    it('does not emit hashing inconsistency metric for non-hashable fields', () => {
      processAudienceRecord(
        { extern_id: sha256HashedEmail },
        {
          fieldConfigs: { extern_id: idField },
          destination: makeDestination({ isHashRequired: true }),
        },
      );
      expect(mockStatsIncrement).not.toHaveBeenCalledWith(
        'audience_hashing_inconsistency',
        expect.anything(),
      );
    });

    it('does not emit metric when hashing ON and value is plaintext (consistent)', () => {
      processAudienceRecord(
        { email: plaintextEmail },
        {
          fieldConfigs: { email: emailField },
          destination: makeDestination({ isHashRequired: true }),
        },
      );
      expect(mockStatsIncrement).not.toHaveBeenCalledWith(
        'audience_hashing_inconsistency',
        expect.anything(),
      );
    });

    it('does not emit metric when hashing OFF and value is pre-hashed (consistent)', () => {
      processAudienceRecord(
        { email: sha256HashedEmail },
        {
          fieldConfigs: { email: emailField },
          destination: makeDestination({ isHashRequired: false }),
        },
      );
      expect(mockStatsIncrement).not.toHaveBeenCalledWith(
        'audience_hashing_inconsistency',
        expect.anything(),
      );
    });

    it('dont throw error when hashing type is sha256 and value is already hashed', () => {
      const emailField: AudienceField = {
        normalize: (v) => v,
        hashingType: HashingType.SHA256,
      };
      const result = processAudienceRecord(
        { email: sha256HashedEmail },
        {
          fieldConfigs: { email: emailField },
          destination: makeDestination({ isHashRequired: false }),
        },
      );
      expect(result.email).toBe(sha256HashedEmail);
    });

    it('dont throw error when hashing type is sha512 and value is already hashed', () => {
      const emailField: AudienceField = {
        normalize: (v) => v,
        hashingType: HashingType.SHA512,
      };
      const result = processAudienceRecord(
        { email: sha512HashedEmail },
        {
          fieldConfigs: { email: emailField },
          destination: makeDestination({ isHashRequired: false }),
        },
      );
      expect(result.email).toBe(sha512HashedEmail);
    });

    it('dont throw error when hashing type is md5 and value is already hashed', () => {
      const emailField: AudienceField = {
        normalize: (v) => v,
        hashingType: HashingType.MD5,
      };
      const result = processAudienceRecord(
        { email: md5HashedEmail },
        {
          fieldConfigs: { email: emailField },
          destination: makeDestination({ isHashRequired: false }),
        },
      );
      expect(result.email).toBe(md5HashedEmail);
    });
  });

  describe('multiple fields', () => {
    it('processes all fields independently', () => {
      const result = processAudienceRecord(
        { email: 'user@example.com', phone: '+1 (650) 555-1212', extern_id: 'abc' },
        {
          fieldConfigs: { email: emailField, phone: phoneField, extern_id: idField },
          destination: makeDestination({ isHashRequired: true }),
        },
      );
      expect(result.email).toBe(sha256('user@example.com'));
      expect(result.phone).toBe(sha256('16505551212'));
      expect(result.extern_id).toBe('abc');
    });

    it('drops invalid fields and keeps valid ones', () => {
      const result = processAudienceRecord(
        { email: 'bad', phone: '+1 (650) 555-1212' },
        {
          fieldConfigs: { email: emailField, phone: phoneField },
          destination: makeDestination({ isHashRequired: true }),
        },
      );
      expect(result).not.toHaveProperty('email');
      expect(result).toHaveProperty('phone', sha256('16505551212'));
    });

    it('processes fields not in fieldConfigs as passthrough strings', () => {
      const result = processAudienceRecord(
        { email: 'user@example.com', custom: 'value' },
        {
          fieldConfigs: { email: emailField },
          destination: makeDestination({ isHashRequired: true }),
        },
      );
      expect(result.email).toBe(sha256('user@example.com'));
      expect(result.custom).toBe('value');
    });
  });
});
