import sha256 from 'sha256';
import { InstrumentationError } from '@rudderstack/integrations-lib';
import { processAudienceRecord, AudienceField } from './audienceUtils';

jest.mock('../../util/stats', () => ({
  increment: jest.fn(),
}));

import stats from '../../util/stats';

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
  hashable: true,
};

const phoneField: AudienceField = {
  normalize: (v) => v.replace(/\D/g, ''),
  validate: (v) => v.length >= 7,
  hashable: true,
};

const idField: AudienceField = {
  normalize: (v) => v,
  hashable: false,
};

beforeEach(() => {
  mockStatsIncrement.mockClear();
  delete process.env.AUDIENCE_HASHING_VALIDATION_ENABLED;
  delete process.env.TEST_DEST_REJECT_INVALID_FIELDS;
});

afterEach(() => {
  delete process.env.AUDIENCE_HASHING_VALIDATION_ENABLED;
  delete process.env.TEST_DEST_REJECT_INVALID_FIELDS;
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
        hashable: false,
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
          fieldConfigs: { age: { normalize: (v) => v, hashable: false } },
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

    it('does not hash hashable fields when isHashRequired=false', () => {
      const result = processAudienceRecord(
        { email: 'user@example.com' },
        {
          fieldConfigs: { email: emailField },
          destination: makeDestination({ isHashRequired: false }),
        },
      );
      expect(result.email).toBe('user@example.com');
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
    it('keeps invalid fields by default (REJECT_INVALID_FIELDS not set)', () => {
      const result = processAudienceRecord(
        { email: 'not-an-email' },
        {
          fieldConfigs: { email: emailField },
          destination: makeDestination({ isHashRequired: true }),
        },
      );
      expect(result).toHaveProperty('email', sha256('not-an-email'));
      expect(mockStatsIncrement).toHaveBeenCalledWith('test_dest_invalid_field', {
        fieldName: 'email',
        workspaceId: 'ws-1',
        destinationId: 'dest-1',
      });
    });

    it('drops invalid fields when REJECT_INVALID_FIELDS env var is enabled', () => {
      process.env.TEST_DEST_REJECT_INVALID_FIELDS = 'true';
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
        { fieldConfigs: { email: emailField }, destination: makeDestination() },
      );
      expect(mockStatsIncrement).not.toHaveBeenCalledWith(
        'test_dest_invalid_field',
        expect.anything(),
      );
    });

    it('uses a permissive default validator for fields without validate function', () => {
      const noValidate: AudienceField = { normalize: (v) => v, hashable: false };
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
    const hashedValue = 'b94d27b9934d3e08a52e52d7da7dabfac484efe04294e576ca48e1cb0d7d6267'; // 64 hex chars
    const plaintextEmail = 'user@example.com';

    it('emits audience_hashing_inconsistency metric when hashing ON but value already hashed', () => {
      processAudienceRecord(
        { email: hashedValue },
        {
          fieldConfigs: { email: emailField },
          destination: makeDestination({ isHashRequired: true }),
        },
      );
      expect(mockStatsIncrement).toHaveBeenCalledWith('audience_hashing_inconsistency', {
        propertyName: 'email',
        type: 'hashed_when_hash_enabled',
        workspaceId: 'ws-1',
        destinationId: 'dest-1',
        destType: 'test_dest',
      });
    });

    it('emits audience_hashing_inconsistency metric when hashing OFF but value is plaintext', () => {
      processAudienceRecord(
        { email: plaintextEmail },
        {
          fieldConfigs: { email: emailField },
          destination: makeDestination({ isHashRequired: false }),
        },
      );
      expect(mockStatsIncrement).toHaveBeenCalledWith('audience_hashing_inconsistency', {
        propertyName: 'email',
        type: 'unhashed_when_hash_disabled',
        workspaceId: 'ws-1',
        destinationId: 'dest-1',
        destType: 'test_dest',
      });
    });

    it('throws InstrumentationError when AUDIENCE_HASHING_VALIDATION_ENABLED=true and hashing ON + pre-hashed value', () => {
      process.env.AUDIENCE_HASHING_VALIDATION_ENABLED = 'true';
      expect(() =>
        processAudienceRecord(
          { email: hashedValue },
          {
            fieldConfigs: { email: emailField },
            destination: makeDestination({ isHashRequired: true }),
          },
        ),
      ).toThrow(InstrumentationError);
      expect(() =>
        processAudienceRecord(
          { email: hashedValue },
          {
            fieldConfigs: { email: emailField },
            destination: makeDestination({ isHashRequired: true }),
          },
        ),
      ).toThrow(/already be hashed/);
    });

    it('throws InstrumentationError when AUDIENCE_HASHING_VALIDATION_ENABLED=true and hashing OFF + plaintext value', () => {
      process.env.AUDIENCE_HASHING_VALIDATION_ENABLED = 'true';
      expect(() =>
        processAudienceRecord(
          { email: plaintextEmail },
          {
            fieldConfigs: { email: emailField },
            destination: makeDestination({ isHashRequired: false }),
          },
        ),
      ).toThrow(/appears to be unhashed/);
    });

    it('does not emit hashing inconsistency metric for non-hashable fields', () => {
      processAudienceRecord(
        { extern_id: hashedValue },
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
        { email: hashedValue },
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

    it('drops invalid fields and keeps valid ones when reject enabled', () => {
      process.env.TEST_DEST_REJECT_INVALID_FIELDS = 'true';
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
