const setValue = require('set-value');
const { safeSetValue } = require('./safeSetValue');

describe('safeSetValue', () => {
  describe('writes that set-value accepts behave exactly like set-value', () => {
    it.each([
      ['flat key', 'email', 'a@b.com'],
      ['nested path', 'user.address.city', 'Berlin'],
      ['escaped dot is one literal key', 'a\\.constructor', 1],
      ['key merely containing a reserved word', 'myConstructor', 1],
      ['reserved word differing in case', 'CONSTRUCTOR', 1],
    ])('%s', (_name, path, value) => {
      const viaSafe = safeSetValue({}, path, value);
      const viaSet = setValue({}, path, value);

      expect(viaSafe).toEqual(viaSet);
    });
  });

  describe('writes that set-value rejects are skipped instead of thrown', () => {
    // These are exactly the paths that produced `Cannot set unsafe key: "constructor"`
    // in production. Asserting set-value still throws keeps this suite honest if the
    // library's rules ever change — safeSetValue deliberately keeps no copy of them.
    it.each([
      'constructor',
      '__proto__',
      'prototype',
      'user_properties.constructor',
      'a.__proto__',
    ])('skips "%s"', (path) => {
      expect(() => setValue({}, path, 'boom')).toThrow(/Cannot set unsafe key/);

      const target = { existing: 'kept' };
      expect(() => safeSetValue(target, path, 'boom')).not.toThrow();
      expect(target.existing).toBe('kept');
    });

    it('returns the target so callers can keep chaining', () => {
      const target = {};
      expect(safeSetValue(target, 'constructor', 1)).toBe(target);
    });

    it('leaves Object.prototype alone', () => {
      safeSetValue({}, '__proto__.polluted', 'yes');
      safeSetValue({}, 'constructor.prototype.polluted', 'yes');

      expect({}.polluted).toBeUndefined();
    });

    it('drops only the offending key, keeping the rest of the payload', () => {
      const traits = { email: 'a@b.com', constructor: 'boom', plan: 'pro' };
      const payload = {};

      Object.keys(traits).forEach((k) => safeSetValue(payload, `user_properties.${k}`, traits[k]));

      expect(payload).toEqual({ user_properties: { email: 'a@b.com', plan: 'pro' } });
    });
  });

  describe('failures that are not about the path still surface', () => {
    it('rethrows when the target rejects the write', () => {
      const frozen = Object.freeze({});

      expect(() => safeSetValue(frozen, 'email', 'a@b.com')).toThrow();
    });

    it('rethrows the original error, not the probe error', () => {
      // The probe runs against a throwaway object; the caller must still see the failure
      // that their own target produced.
      const target = {
        get email() {
          return undefined;
        },
      };
      Object.defineProperty(target, 'email', {
        set() {
          throw new TypeError('target rejected email');
        },
      });

      expect(() => safeSetValue(target, 'email', 'a@b.com')).toThrow('target rejected email');
    });

    it('treats a caller-supplied splitter that fails as a path problem, so the field is skipped', () => {
      // Documented consequence of letting set-value arbitrate: the probe fails on a
      // throwaway target too, so this counts as "the path is unwritable". No call site
      // passes a custom splitter today.
      const options = {
        split: () => {
          throw new Error('split exploded');
        },
      };

      expect(() => safeSetValue({}, 'email', 1, options)).not.toThrow();
    });
  });
});
