import sha256 from 'sha256';
import stats from '../../../../util/stats';
import { processAudienceRecord } from '../../../util/audienceUtils';
import { DESTINATION_TYPE } from '../config';
import { PINTEREST_FIELD_CONFIG, pickPinterestIdentifiers, toRecordRow } from '../utils';

const runProcess = (identifiers: Record<string, unknown>, isHashRequired = true) =>
  processAudienceRecord(pickPinterestIdentifiers(identifiers), {
    fieldConfigs: PINTEREST_FIELD_CONFIG,
    destination: {
      workspaceId: 'ws-1',
      id: 'dest-1',
      type: DESTINATION_TYPE,
      config: { isHashRequired },
    },
  });

describe('pinterest_audience normalisation (spec §3.3)', () => {
  const hashedCases = [
    {
      name: 'D3 email is trimmed and lowercased',
      identifiers: { EMAIL: '  Alice@Example.COM ' },
      expected: { EMAIL: sha256('alice@example.com') },
    },
    {
      name: 'D4 MAID is lowercased',
      identifiers: { MAID: 'CDDA802E-FB9C-47AD-9866-0794D394C912' },
      expected: { MAID: sha256('cdda802e-fb9c-47ad-9866-0794d394c912') },
    },
    {
      name: 'MAID surrounding whitespace is trimmed',
      identifiers: { MAID: ' ea7583cd-a667-48bc-b806-42ecb2b48606 ' },
      expected: { MAID: sha256('ea7583cd-a667-48bc-b806-42ecb2b48606') },
    },
    {
      name: 'D5 phone keeps digits only',
      identifiers: { PHONE: '+1 (415) 555-0132' },
      expected: { PHONE: sha256('14155550132') },
    },
    {
      name: 'phone dots are stripped',
      identifiers: { PHONE: '44.20.7946.0958' },
      expected: { PHONE: sha256('442079460958') },
    },
    {
      name: 'phone at the 8-digit floor',
      identifiers: { PHONE: '1234-5678' },
      expected: { PHONE: sha256('12345678') },
    },
    {
      name: 'phone at the 15-digit ceiling',
      identifiers: { PHONE: '+123 456 789 012 345' },
      expected: { PHONE: sha256('123456789012345') },
    },
    {
      name: 'numeric phone value',
      identifiers: { PHONE: 14155550132 },
      expected: { PHONE: sha256('14155550132') },
    },
    {
      name: 'all three identifiers in one record',
      identifiers: {
        EMAIL: 'bob@example.com',
        MAID: 'cdda802e-fb9c-47ad-9866-0794d394c912',
        PHONE: '14155550132',
      },
      expected: {
        EMAIL: sha256('bob@example.com'),
        MAID: sha256('cdda802e-fb9c-47ad-9866-0794d394c912'),
        PHONE: sha256('14155550132'),
      },
    },
  ];

  const droppedCases = [
    { name: 'D6 phone under 8 digits', identifiers: { PHONE: '12345' }, fieldName: 'PHONE' },
    { name: 'phone over 15 digits', identifiers: { PHONE: '1234567890123456' }, fieldName: 'PHONE' },
    { name: 'email without @', identifiers: { EMAIL: 'alice.example.com' }, fieldName: 'EMAIL' },
    { name: 'email with empty local part', identifiers: { EMAIL: '@example.com' }, fieldName: 'EMAIL' },
    { name: 'email with empty domain', identifiers: { EMAIL: 'alice@' }, fieldName: 'EMAIL' },
    { name: 'email with two @', identifiers: { EMAIL: 'a@b@example.com' }, fieldName: 'EMAIL' },
    {
      name: 'MAID without dashes',
      identifiers: { MAID: 'cdda802efb9c47ad98660794d394c912' },
      fieldName: 'MAID',
    },
    {
      name: 'MAID with a non-hex character',
      identifiers: { MAID: 'zdda802e-fb9c-47ad-9866-0794d394c912' },
      fieldName: 'MAID',
    },
  ];

  afterEach(() => jest.restoreAllMocks());

  it.each(hashedCases)('hashes: $name', ({ identifiers, expected }) => {
    expect(runProcess(identifiers)).toEqual(expected);
  });

  it.each(droppedCases)('drops and counts: $name', ({ identifiers, fieldName }) => {
    const increment = jest.spyOn(stats, 'increment');
    expect(runProcess(identifiers)).toEqual({});
    expect(increment).toHaveBeenCalledWith('pinterest_audience_invalid_field', {
      fieldName,
      workspaceId: 'ws-1',
      destinationId: 'dest-1',
    });
  });
});

describe('pinterest_audience hashing switch (D8, D9)', () => {
  it('D8 passes SHA-256 values through unchanged when isHashRequired is false', () => {
    const preHashed = {
      EMAIL: sha256('alice@example.com'),
      MAID: sha256('cdda802e-fb9c-47ad-9866-0794d394c912'),
      PHONE: sha256('14155550132'),
    };
    expect(runProcess(preHashed, false)).toEqual(preHashed);
  });

  it('D9 rejects a plain value when isHashRequired is false', () => {
    expect(() => runProcess({ EMAIL: 'alice@example.com' }, false)).toThrow(
      'Hashing is disabled but the value for field EMAIL appears to be unhashed. Either enable hashing or send pre-hashed data.',
    );
  });

  it('rejects an already-hashed value when isHashRequired is true', () => {
    expect(() => runProcess({ EMAIL: sha256('alice@example.com') })).toThrow(
      /appears to already be hashed/,
    );
  });
});

describe('pickPinterestIdentifiers', () => {
  it('keeps only EMAIL, MAID and PHONE', () => {
    expect(
      pickPinterestIdentifiers({
        EMAIL: 'a@example.com',
        email: 'b@example.com',
        EXTERNAL_ID: 'x-1',
        toString: 'not-a-function',
        MAID: 'm',
        PHONE: 'p',
      }),
    ).toEqual({ EMAIL: 'a@example.com', MAID: 'm', PHONE: 'p' });
  });
});

describe('toRecordRow', () => {
  it.each([
    {
      name: 'all three',
      processed: { PHONE: 'p', EMAIL: 'e', MAID: 'm' },
      expected: { email: 'e', maid: 'm', hashed_phone_number: 'p' },
    },
    { name: 'email only', processed: { EMAIL: 'e' }, expected: { email: 'e' } },
    { name: 'nothing', processed: {}, expected: {} },
  ])('renames to records_v2 keys: $name', ({ processed, expected }) => {
    expect(toRecordRow(processed)).toEqual(expected);
  });
});
