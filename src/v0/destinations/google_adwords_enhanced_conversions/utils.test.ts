import sha256 from 'sha256';
import { processUserIdentifiers, GAEC_FIELD_CONFIG } from './utils';
import type { GaecPayload } from './types';

// Shared destination context for tests (undefined requireHash models configs that omit it)
const makeDestCtx = (
  requireHash: boolean | undefined,
  workspaceId = 'ws1',
  destinationId = 'dest1',
) => ({
  requireHash,
  workspaceId,
  destinationId,
});

// Helper to build a minimal valid GaecPayload with userIdentifiers.
// hashedPhoneNumber/hashedStreetAddress accept unknown: the mapping output is unvalidated,
// so tests model non-string shapes (numeric phone, the traits.address object fallback).
const makePayload = (overrides: {
  hashedEmail?: string;
  hashedPhoneNumber?: unknown;
  hashedFirstName?: string;
  hashedLastName?: string;
  hashedStreetAddress?: unknown;
  city?: string;
  state?: string;
  countryCode?: string;
  postalCode?: string;
}): GaecPayload => {
  const {
    hashedEmail,
    hashedPhoneNumber,
    hashedFirstName,
    hashedLastName,
    hashedStreetAddress,
    city,
    state,
    countryCode,
    postalCode,
  } = overrides;

  const userIdentifiers: Array<Record<string, unknown> | null> = [null, null, null];

  if (hashedEmail) {
    userIdentifiers[0] = { hashedEmail };
  }
  if (hashedPhoneNumber) {
    userIdentifiers[1] = { hashedPhoneNumber };
  }
  const addressInfo: Record<string, unknown> = {};
  if (hashedFirstName) addressInfo.hashedFirstName = hashedFirstName;
  if (hashedLastName) addressInfo.hashedLastName = hashedLastName;
  if (hashedStreetAddress) addressInfo.hashedStreetAddress = hashedStreetAddress;
  if (city) addressInfo.city = city;
  if (state) addressInfo.state = state;
  if (countryCode) addressInfo.countryCode = countryCode;
  if (postalCode) addressInfo.postalCode = postalCode;
  if (Object.keys(addressInfo).length > 0) {
    userIdentifiers[2] = { addressInfo };
  }

  return {
    conversionAdjustments: [
      {
        adjustmentType: 'ENHANCEMENT',
        orderId: '12345',
        userIdentifiers,
      },
    ],
  };
};

describe('processUserIdentifiers', () => {
  describe('normalize + hash write-back (requireHash: true)', () => {
    it('normalizes and hashes a raw email', () => {
      const payload = makePayload({ hashedEmail: 'TEST@EXAMPLE.COM' });
      processUserIdentifiers(payload, makeDestCtx(true));
      const entry = payload.conversionAdjustments?.[0]?.userIdentifiers?.[0];
      expect(entry).toEqual({ hashedEmail: sha256('test@example.com') });
    });

    it('normalizes gmail email: strips dots and +suffix, then hashes', () => {
      const payload = makePayload({ hashedEmail: 'j.o.h.n+alias@gmail.com' });
      processUserIdentifiers(payload, makeDestCtx(true));
      const entry = payload.conversionAdjustments?.[0]?.userIdentifiers?.[0];
      expect(entry).toEqual({ hashedEmail: sha256('john@gmail.com') });
    });

    it('normalizes and hashes a raw phone number (prepends +)', () => {
      const payload = makePayload({ hashedPhoneNumber: '912382193' });
      processUserIdentifiers(payload, makeDestCtx(true));
      const entry = payload.conversionAdjustments?.[0]?.userIdentifiers?.[0];
      expect(entry).toEqual({ hashedPhoneNumber: sha256('+912382193') });
    });

    it('normalizes (trim+lowercase) and hashes first/last names', () => {
      const payload = makePayload({ hashedFirstName: ' John ', hashedLastName: 'GOMES' });
      processUserIdentifiers(payload, makeDestCtx(true));
      const firstAdj = payload.conversionAdjustments?.[0];
      const addressEntry = firstAdj?.userIdentifiers?.[0];
      expect(addressEntry).toEqual({
        addressInfo: {
          hashedFirstName: sha256('john'),
          hashedLastName: sha256('gomes'),
        },
      });
    });

    it('normalizes (trim+lowercase) and hashes street address', () => {
      const payload = makePayload({
        hashedStreetAddress: '71 Cherry Court SOUTHAMPTON SO53 5PD UK',
        city: 'London',
      });
      processUserIdentifiers(payload, makeDestCtx(true));
      const firstAdj = payload.conversionAdjustments?.[0];
      const addressEntry = firstAdj?.userIdentifiers?.[0];
      expect(addressEntry).toEqual({
        addressInfo: {
          hashedStreetAddress: sha256('71 cherry court southampton so53 5pd uk'),
          city: 'London',
        },
      });
    });

    it('passes pre-hashed values through when requireHash: false', () => {
      const preHashedEmail = sha256('test@example.com');
      const payload = makePayload({ hashedEmail: preHashedEmail });
      processUserIdentifiers(payload, makeDestCtx(false));
      const entry = payload.conversionAdjustments?.[0]?.userIdentifiers?.[0];
      expect(entry).toEqual({ hashedEmail: preHashedEmail });
    });
  });

  describe('mismatch throws (strict path)', () => {
    it('throws when requireHash:true and value appears pre-hashed', () => {
      const preHashedEmail = sha256('test@example.com');
      const payload = makePayload({ hashedEmail: preHashedEmail });
      expect(() => processUserIdentifiers(payload, makeDestCtx(true))).toThrow(
        /Hashing is enabled but the value for field hashedEmail appears to already be hashed/,
      );
    });

    it('throws when requireHash:false and value appears raw (unhashed email)', () => {
      const payload = makePayload({ hashedEmail: 'test@example.com' });
      expect(() => processUserIdentifiers(payload, makeDestCtx(false))).toThrow(
        /Hashing is disabled but the value for field hashedEmail appears to be unhashed/,
      );
    });

    it('throws when requireHash:false and phone appears raw', () => {
      const payload = makePayload({ hashedPhoneNumber: '912382193' });
      expect(() => processUserIdentifiers(payload, makeDestCtx(false))).toThrow(
        /Hashing is disabled but the value for field hashedPhoneNumber appears to be unhashed/,
      );
    });
  });

  describe('invalid / empty field drops', () => {
    it('drops invalid email (not a valid email after normalization)', () => {
      const payload = makePayload({ hashedEmail: 'not-an-email' });
      processUserIdentifiers(payload, makeDestCtx(true));
      const identifiers = payload.conversionAdjustments?.[0]?.userIdentifiers;
      // email entry should be pruned since hashedEmail was dropped
      expect(identifiers).toEqual([]);
    });

    it('drops invalid phone number (non-numeric after normalization)', () => {
      const payload = makePayload({ hashedPhoneNumber: 'not-a-phone' });
      processUserIdentifiers(payload, makeDestCtx(true));
      const identifiers = payload.conversionAdjustments?.[0]?.userIdentifiers;
      expect(identifiers).toEqual([]);
    });

    it('drops empty/whitespace-only email', () => {
      const payload = makePayload({ hashedEmail: '   ' });
      processUserIdentifiers(payload, makeDestCtx(true));
      const identifiers = payload.conversionAdjustments?.[0]?.userIdentifiers;
      expect(identifiers).toEqual([]);
    });
  });

  describe('non-scalar field drops', () => {
    it('drops an object-valued street address instead of hashing String(object)', () => {
      // Models the trackConfig fallback resolving the whole context.traits.address object
      const payload = makePayload({
        hashedFirstName: 'John',
        city: 'London',
        hashedStreetAddress: { streetAddress: '71 Cherry Court', city: 'London' },
      });
      processUserIdentifiers(payload, makeDestCtx(true));
      expect(payload.conversionAdjustments?.[0]?.userIdentifiers).toEqual([
        { addressInfo: { hashedFirstName: sha256('john'), city: 'London' } },
      ]);
    });

    it('drops an object-valued street address without a consistency throw when requireHash:false', () => {
      const preHashedFirstName = sha256('john');
      const payload = makePayload({
        hashedFirstName: preHashedFirstName,
        hashedStreetAddress: { streetAddress: '71 Cherry Court' },
      });
      processUserIdentifiers(payload, makeDestCtx(false));
      expect(payload.conversionAdjustments?.[0]?.userIdentifiers).toEqual([
        { addressInfo: { hashedFirstName: preHashedFirstName } },
      ]);
    });

    it('accepts a numeric phone value and hashes its string form', () => {
      const payload = makePayload({ hashedPhoneNumber: 912382193 });
      processUserIdentifiers(payload, makeDestCtx(true));
      expect(payload.conversionAdjustments?.[0]?.userIdentifiers).toEqual([
        { hashedPhoneNumber: sha256('+912382193') },
      ]);
    });
  });

  describe('requireHash default semantics', () => {
    it('hashes when requireHash is undefined (missing from config)', () => {
      const payload = makePayload({ hashedEmail: 'TEST@EXAMPLE.COM' });
      processUserIdentifiers(payload, makeDestCtx(undefined));
      expect(payload.conversionAdjustments?.[0]?.userIdentifiers).toEqual([
        { hashedEmail: sha256('test@example.com') },
      ]);
    });
  });

  describe('pruning behavior', () => {
    it('prunes the email entry when hashedEmail is dropped', () => {
      const payload = makePayload({ hashedEmail: 'invalid' });
      processUserIdentifiers(payload, makeDestCtx(true));
      const identifiers = payload.conversionAdjustments?.[0]?.userIdentifiers;
      // No entry with {} should remain
      expect(identifiers?.some((e) => e && Object.keys(e).length === 0)).toBe(false);
    });

    it('prunes addressInfo when all hashable fields are dropped but preserves non-hashable fields', () => {
      // Invalid first/last name but valid city — city should be preserved; address entry kept
      const payload = makePayload({
        hashedFirstName: '', // empty → drops
        hashedLastName: '', // empty → drops
        city: 'London',
      });
      processUserIdentifiers(payload, makeDestCtx(true));
      const identifiers = payload.conversionAdjustments?.[0]?.userIdentifiers;
      expect(identifiers).toEqual([{ addressInfo: { city: 'London' } }]);
    });

    it('prunes the entire address entry when all hashable AND non-hashable address fields are absent', () => {
      // Only firstName provided, it's invalid
      const payload = makePayload({ hashedFirstName: '' });
      processUserIdentifiers(payload, makeDestCtx(true));
      const identifiers = payload.conversionAdjustments?.[0]?.userIdentifiers;
      expect(identifiers).toEqual([]);
    });

    it('preserves a valid email entry while pruning an invalid phone entry', () => {
      const payload = makePayload({
        hashedEmail: 'test@example.com',
        hashedPhoneNumber: 'not-a-phone',
      });
      processUserIdentifiers(payload, makeDestCtx(true));
      const identifiers = payload.conversionAdjustments?.[0]?.userIdentifiers;
      expect(identifiers).toEqual([{ hashedEmail: sha256('test@example.com') }]);
    });
  });

  describe('no-op cases', () => {
    it('returns without mutating when userIdentifiers is absent', () => {
      const payload: GaecPayload = {
        conversionAdjustments: [{ adjustmentType: 'RESTATEMENT', orderId: '12345' }],
      };
      // Should not throw
      processUserIdentifiers(payload, makeDestCtx(true));
      expect(payload.conversionAdjustments?.[0]?.userIdentifiers).toBeUndefined();
    });
  });
});

describe('GAEC_FIELD_CONFIG', () => {
  it('exports config for all five PII fields', () => {
    expect(Object.keys(GAEC_FIELD_CONFIG).sort()).toEqual(
      [
        'hashedEmail',
        'hashedFirstName',
        'hashedLastName',
        'hashedPhoneNumber',
        'hashedStreetAddress',
      ].sort(),
    );
  });
});
