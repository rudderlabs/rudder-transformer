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
  describe('normalize + hash (requireHash: true)', () => {
    it('normalizes and hashes a raw email', () => {
      const payload = makePayload({ hashedEmail: 'TEST@EXAMPLE.COM' });
      const identifiers = processUserIdentifiers(payload, makeDestCtx(true));
      expect(identifiers).toEqual([{ hashedEmail: sha256('test@example.com') }]);
      // the input payload is left untouched — the function returns instead of mutating
      expect(payload.conversionAdjustments?.[0]?.userIdentifiers?.[0]).toEqual({
        hashedEmail: 'TEST@EXAMPLE.COM',
      });
    });

    it('normalizes gmail email: strips dots and +suffix, then hashes', () => {
      const payload = makePayload({ hashedEmail: 'j.o.h.n+alias@gmail.com' });
      const identifiers = processUserIdentifiers(payload, makeDestCtx(true));
      expect(identifiers).toEqual([{ hashedEmail: sha256('john@gmail.com') }]);
    });

    it('normalizes and hashes a raw phone number (prepends +)', () => {
      const payload = makePayload({ hashedPhoneNumber: '912382193' });
      const identifiers = processUserIdentifiers(payload, makeDestCtx(true));
      expect(identifiers).toEqual([{ hashedPhoneNumber: sha256('+912382193') }]);
    });

    it('normalizes (trim+lowercase) and hashes first/last names', () => {
      const payload = makePayload({ hashedFirstName: ' John ', hashedLastName: 'GOMES' });
      const identifiers = processUserIdentifiers(payload, makeDestCtx(true));
      expect(identifiers).toEqual([
        {
          addressInfo: {
            hashedFirstName: sha256('john'),
            hashedLastName: sha256('gomes'),
          },
        },
      ]);
    });

    it('normalizes (trim+lowercase) and hashes street address', () => {
      const payload = makePayload({
        hashedStreetAddress: '71 Cherry Court SOUTHAMPTON SO53 5PD UK',
        city: 'London',
      });
      const identifiers = processUserIdentifiers(payload, makeDestCtx(true));
      expect(identifiers).toEqual([
        {
          addressInfo: {
            hashedStreetAddress: sha256('71 cherry court southampton so53 5pd uk'),
            city: 'London',
          },
        },
      ]);
    });

    it('passes pre-hashed values through when requireHash: false', () => {
      const preHashedEmail = sha256('test@example.com');
      const payload = makePayload({ hashedEmail: preHashedEmail });
      const identifiers = processUserIdentifiers(payload, makeDestCtx(false));
      expect(identifiers).toEqual([{ hashedEmail: preHashedEmail }]);
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
      const identifiers = processUserIdentifiers(payload, makeDestCtx(true));
      // email entry does not survive since hashedEmail was dropped
      expect(identifiers).toEqual([]);
    });

    it('drops invalid phone number (non-numeric after normalization)', () => {
      const payload = makePayload({ hashedPhoneNumber: 'not-a-phone' });
      const identifiers = processUserIdentifiers(payload, makeDestCtx(true));
      expect(identifiers).toEqual([]);
    });

    it('drops empty/whitespace-only email', () => {
      const payload = makePayload({ hashedEmail: '   ' });
      const identifiers = processUserIdentifiers(payload, makeDestCtx(true));
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
      const identifiers = processUserIdentifiers(payload, makeDestCtx(true));
      expect(identifiers).toEqual([
        { addressInfo: { hashedFirstName: sha256('john'), city: 'London' } },
      ]);
    });

    it('drops an object-valued street address without a consistency throw when requireHash:false', () => {
      const preHashedFirstName = sha256('john');
      const payload = makePayload({
        hashedFirstName: preHashedFirstName,
        hashedStreetAddress: { streetAddress: '71 Cherry Court' },
      });
      const identifiers = processUserIdentifiers(payload, makeDestCtx(false));
      expect(identifiers).toEqual([{ addressInfo: { hashedFirstName: preHashedFirstName } }]);
    });

    it('accepts a numeric phone value and hashes its string form', () => {
      const payload = makePayload({ hashedPhoneNumber: 912382193 });
      const identifiers = processUserIdentifiers(payload, makeDestCtx(true));
      expect(identifiers).toEqual([{ hashedPhoneNumber: sha256('+912382193') }]);
    });
  });

  describe('requireHash default semantics', () => {
    it('hashes when requireHash is undefined (missing from config)', () => {
      const payload = makePayload({ hashedEmail: 'TEST@EXAMPLE.COM' });
      const identifiers = processUserIdentifiers(payload, makeDestCtx(undefined));
      expect(identifiers).toEqual([{ hashedEmail: sha256('test@example.com') }]);
    });
  });

  describe('surviving-entry rebuilding', () => {
    it('excludes the email entry when hashedEmail is dropped', () => {
      const payload = makePayload({ hashedEmail: 'invalid' });
      const identifiers = processUserIdentifiers(payload, makeDestCtx(true));
      expect(identifiers).toEqual([]);
    });

    it('keeps addressInfo without hashable fields when non-hashable fields are present', () => {
      // Whitespace-only names normalize to '' and are dropped by the pipeline;
      // the valid city is preserved and the address entry kept
      const payload = makePayload({
        hashedFirstName: '   ', // whitespace → normalized to '' → dropped
        hashedLastName: '   ', // whitespace → normalized to '' → dropped
        city: 'London',
      });
      const identifiers = processUserIdentifiers(payload, makeDestCtx(true));
      expect(identifiers).toEqual([{ addressInfo: { city: 'London' } }]);
    });

    it('excludes the address entry when all hashable AND non-hashable address fields are absent', () => {
      // Only firstName provided; whitespace normalizes to '' and is dropped
      const payload = makePayload({ hashedFirstName: '   ' });
      const identifiers = processUserIdentifiers(payload, makeDestCtx(true));
      expect(identifiers).toEqual([]);
    });

    it('keeps a valid email entry while excluding an invalid phone entry', () => {
      const payload = makePayload({
        hashedEmail: 'test@example.com',
        hashedPhoneNumber: 'not-a-phone',
      });
      const identifiers = processUserIdentifiers(payload, makeDestCtx(true));
      expect(identifiers).toEqual([{ hashedEmail: sha256('test@example.com') }]);
    });
  });

  describe('no-op cases', () => {
    it('returns an empty array when userIdentifiers is absent', () => {
      const payload: GaecPayload = {
        conversionAdjustments: [{ adjustmentType: 'RESTATEMENT', orderId: '12345' }],
      };
      // Should not throw
      const identifiers = processUserIdentifiers(payload, makeDestCtx(true));
      expect(identifiers).toEqual([]);
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
