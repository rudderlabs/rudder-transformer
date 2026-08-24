import { DeliveryJobState } from '../../../types/index';
import { capDeliveryV1Errors } from '../deliveryResponseCap';
import stats from '../../../util/stats';

const TRUNCATION_MARKER = '[truncated:';
const METRIC = 'proxy_destination_response_truncated';

let counterSpy: jest.SpyInstance;

beforeEach(() => {
  counterSpy = jest.spyOn(stats, 'counter').mockImplementation(() => {});
});

afterEach(() => {
  jest.restoreAllMocks();
});

const jobStates = (error: string, count: number): DeliveryJobState[] =>
  Array.from(
    { length: count },
    (_, i) => ({ error, statusCode: 500, metadata: { jobId: i + 1 } }) as DeliveryJobState,
  );

/**
 * The truncation itself is module-private — `capDeliveryV1Errors` is the only entry point, so that
 * a job state cannot be capped without going through the memo. These exercise it through one job
 * state, which is the smallest thing the public function accepts.
 */
const capOne = (error: string, maxBytes: number): string => {
  const response = jobStates(error, 1);
  capDeliveryV1Errors(response, 'BRAZE', maxBytes);
  return response[0].error;
};

describe('capDeliveryV1Errors - within the cap', () => {
  it('returns the error unchanged and reports nothing', () => {
    const body = JSON.stringify({ errors: [{ code: 190, message: 'Invalid OAuth token' }] });

    expect(capOne(body, 500)).toBe(body);
    expect(capOne('', 500)).toBe('');
    expect(counterSpy).not.toHaveBeenCalled();
  });

  it('passes a non-string through untouched', () => {
    // `JSON.stringify` returns `undefined` for an absent destination body, and the v0->v1
    // adaptation carries that into the job state. Capping must not turn it into a string or throw.
    expect(capOne(undefined as unknown as string, 500)).toBeUndefined();
    expect(counterSpy).not.toHaveBeenCalled();
  });
});

describe('capDeliveryV1Errors - over the cap', () => {
  it('cuts the error to the budget and says so', () => {
    const capped = capOne('a'.repeat(5000), 500);

    expect(Buffer.byteLength(capped)).toBeLessThanOrEqual(500);
    expect(capped).toContain(TRUNCATION_MARKER);
    expect(capped).toContain('5000 bytes');
    expect(capped.startsWith('aaa')).toBe(true);
  });

  it('counts bytes, not UTF-16 code units', () => {
    // 400 x 3-byte characters is 1200 bytes but only 400 `.length` units, so a slice-based cap
    // would wrongly conclude this fits in a 1000 byte budget.
    const body = 'あ'.repeat(400);
    expect(body.length).toBeLessThan(1000);

    const capped = capOne(body, 1000);
    expect(capped).not.toBe(body);
    expect(Buffer.byteLength(capped)).toBeLessThanOrEqual(1000);
  });

  it.each([
    ['3-byte characters', 'あ'],
    ['surrogate pairs', '😀'],
  ])('never cuts %s in half', (_label, char) => {
    // Sweep the budget so the cut lands at every offset within a character.
    for (let maxBytes = 200; maxBytes < 260; maxBytes += 1) {
      const capped = capOne(char.repeat(400), maxBytes);
      expect(capped).not.toContain('�');
      // A UTF-8 round trip is lossless only when every character survived intact.
      expect(Buffer.from(capped, 'utf8').toString('utf8')).toEqual(capped);
      expect(Buffer.byteLength(capped)).toBeLessThanOrEqual(maxBytes);
    }
  });

  it('falls back to the notice alone when the budget cannot fit it', () => {
    const capped = capOne('a'.repeat(5000), 5);

    expect(capped).toContain(TRUNCATION_MARKER);
    // Bounded by the notice, a small constant - the point is that it cannot be the 5000 byte input.
    expect(Buffer.byteLength(capped)).toBeLessThan(200);
  });

  it('is idempotent - re-capping an already capped error changes nothing', () => {
    const once = capOne('a'.repeat(5000), 500);

    expect(capOne(once, 500)).toBe(once);
  });
});

describe('capDeliveryV1Errors - across a batch', () => {
  const DEFAULT_MAX_BYTES = 50 * 1024;

  it('leaves a response within the cap untouched and reports nothing', () => {
    const error = JSON.stringify({ errors: [{ code: 190 }] });
    const response = jobStates(error, 3);

    capDeliveryV1Errors(response, 'BRAZE');

    response.forEach((jobState) => expect(jobState.error).toBe(error));
    expect(counterSpy).not.toHaveBeenCalled();
  });

  it('caps every entry and counts one truncation per job state', () => {
    const response = jobStates('x'.repeat(2 * 1024 * 1024), 300);

    capDeliveryV1Errors(response, 'FB_CUSTOM_AUDIENCE');

    response.forEach((jobState) => {
      expect(Buffer.byteLength(jobState.error)).toBeLessThanOrEqual(DEFAULT_MAX_BYTES);
      expect(jobState.error).toContain(TRUNCATION_MARKER);
    });
    // One `counter` call carrying the job count, not 300 `increment` calls.
    expect(counterSpy).toHaveBeenCalledTimes(1);
    expect(counterSpy).toHaveBeenCalledWith(METRIC, 300, { destType: 'FB_CUSTOM_AUDIENCE' });
  });

  it('allocates one capped string for a shared error, not one per job', () => {
    // The memo, and the reason it exists. Every producer builds one error string and shares it
    // across the batch, so truncating each entry independently would allocate `batchSize` distinct
    // copies - re-creating the amplification this module removes, at 50KB a job instead of 2MB.
    // Asserted by call count: `toBe` is `Object.is`, and separately-allocated equal strings are
    // still the same value, so identity alone cannot distinguish them.
    const response = jobStates('x'.repeat(2 * 1024 * 1024), 300);
    const sliceSpy = jest.spyOn(String.prototype, 'slice');

    try {
      capDeliveryV1Errors(response, 'BRAZE');
      // The truncation slices exactly once per string it actually cuts.
      expect(sliceSpy).toHaveBeenCalledTimes(1);
    } finally {
      sliceSpy.mockRestore();
    }
  });

  it('collapses equal-but-distinct strings a per-job producer builds', () => {
    // `braze`'s `buildJobStates` and `hs`'s per-item states build the error inside their own map,
    // so the entries are equal by value but separately allocated. `!==` compares strings by value,
    // so the memo still collapses them.
    const response = Array.from({ length: 100 }, (_, i) => ({
      error: `${'x'.repeat(2 * 1024 * 1024)}`,
      statusCode: 500,
      metadata: { jobId: i + 1 },
    })) as DeliveryJobState[];
    const sliceSpy = jest.spyOn(String.prototype, 'slice');

    try {
      capDeliveryV1Errors(response, 'BRAZE');
      expect(sliceSpy).toHaveBeenCalledTimes(1);
    } finally {
      sliceSpy.mockRestore();
    }
  });

  it('counts only the entries it actually cut', () => {
    const response = [
      ...jobStates('small', 2),
      ...jobStates('x'.repeat(2 * 1024 * 1024), 3),
      ...jobStates('also small', 1),
    ];

    capDeliveryV1Errors(response, 'BRAZE');

    expect(counterSpy).toHaveBeenCalledWith(METRIC, 3, { destType: 'BRAZE' });
    expect(response[0].error).toBe('small');
    expect(response[5].error).toBe('also small');
  });

  it('tolerates an absent response and an unknown destType', () => {
    expect(() => capDeliveryV1Errors(undefined, 'BRAZE')).not.toThrow();
    expect(() => capDeliveryV1Errors([], 'BRAZE')).not.toThrow();

    const response = jobStates('x'.repeat(5 * 1024 * 1024), 1);
    capDeliveryV1Errors(response, undefined);
    expect(counterSpy).toHaveBeenCalledWith(METRIC, 1, { destType: undefined });
  });
});

describe('capDeliveryV1Errors - configured limit', () => {
  const ENV_KEY = 'PROXY_DESTINATION_RESPONSE_MAX_BYTES';
  const OLD_ENV = process.env;
  // The module's default; not exported, so the expectation is stated here.
  const DEFAULT_MAX_BYTES = 50 * 1024;

  // The limit is module-private, so it is asserted through the behaviour it drives rather than by
  // reading the constant.
  const loadWith = (value?: string) => {
    jest.resetModules();
    process.env = { ...OLD_ENV };
    if (value === undefined) {
      delete process.env[ENV_KEY];
    } else {
      process.env[ENV_KEY] = value;
    }
    // eslint-disable-next-line @typescript-eslint/no-var-requires, global-require
    const { capDeliveryV1Errors: capWithEnv } = require('../deliveryResponseCap');
    return (error: string): string => {
      const response = jobStates(error, 1);
      capWithEnv(response, 'BRAZE');
      return response[0].error;
    };
  };

  afterEach(() => {
    process.env = OLD_ENV;
    jest.resetModules();
  });

  it('defaults to 50 KB', () => {
    const capWithEnv = loadWith(undefined);

    expect(capWithEnv('x'.repeat(DEFAULT_MAX_BYTES))).toHaveLength(DEFAULT_MAX_BYTES);
    expect(Buffer.byteLength(capWithEnv('x'.repeat(200 * 1024)))).toBeLessThanOrEqual(
      DEFAULT_MAX_BYTES,
    );
  });

  it('keeps the largest batch the proxy delivers under the maximum string length', () => {
    // The reason the default is 50KB and not 100KB. The cap is per job, so the response still
    // serializes to `batchSize x cap`; at the 6000-job batch that produced INT-6978, 100KB lands
    // at ~600MB and throws the `RangeError` this whole change exists to prevent.
    const V8_MAX_STRING_BYTES = 512 * 1024 * 1024;
    const LARGEST_OBSERVED_BATCH = 6000;

    expect(DEFAULT_MAX_BYTES * LARGEST_OBSERVED_BATCH).toBeLessThan(V8_MAX_STRING_BYTES);
  });

  it('honours a configured override', () => {
    const capWithEnv = loadWith('2048');

    expect(Buffer.byteLength(capWithEnv('x'.repeat(50000)))).toBeLessThanOrEqual(2048);
  });

  it.each(['not-a-number', ''])('falls back to the default for %p', (value) => {
    const capWithEnv = loadWith(value);

    expect(capWithEnv('x'.repeat(DEFAULT_MAX_BYTES))).toHaveLength(DEFAULT_MAX_BYTES);
  });

  it.each(['0', '-1'])('takes %p at face value, leaving room for the notice alone', (value) => {
    // Not clamped: the configured value is used as given, so a non-positive limit truncates
    // everything down to the notice rather than falling back to the default.
    const capWithEnv = loadWith(value);
    const capped = capWithEnv('x'.repeat(5000));

    expect(capped).toContain(TRUNCATION_MARKER);
    expect(capped).not.toContain('xxx');
  });
});
