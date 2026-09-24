import { collapseArrayMarkers, escapeSegment, parsePath } from './path';

describe('secretPaths path grammar', () => {
  // The generator writes paths with escapeSegment and the validator reads them back with
  // parsePath. If the two ever disagree the validator checks a grammar the generator does not
  // emit, and that failure reports as "no leaks found" rather than as an error.
  describe('escapeSegment / parsePath round-trip', () => {
    it.each([
      [['headers', 'Authorization']],
      [['params', 'api_secret']],
      // gjson/sjson treat these as path syntax, so they must survive escaped
      [['headers', 'X-Api.Key']],
      [['headers', 'star*key']],
      [['headers', 'question?key']],
      [['headers', 'back\\slash']],
      // brackets are not special to gjson - AWIN really does send a param called `bd[0]`
      [['params', 'bd[0]']],
      [['body', 'JSON', 'messages', '#', 'from']],
      // a segment ending in a backslash, followed by another: the case a lookbehind-based
      // split gets wrong, because it cannot tell an escaped backslash from an escaping one
      [['body', 'ends\\', 'inner']],
    ])('round-trips %j', (segments: string[]) => {
      expect(parsePath(segments.map(escapeSegment).join('.'))).toEqual(segments);
    });
  });

  describe('collapseArrayMarkers', () => {
    it('collapses marked array positions to a single wildcard', () => {
      expect(collapseArrayMarkers('body.JSON.messages.#0.from')).toBe('body.JSON.messages.#.from');
      expect(collapseArrayMarkers('body.JSON.a.#0.b.#12.c')).toBe('body.JSON.a.#.b.#.c');
    });

    it('leaves a key that merely looks numeric alone', () => {
      expect(collapseArrayMarkers('params.bd[0]')).toBe('params.bd[0]');
      expect(collapseArrayMarkers('body.JSON.0.id')).toBe('body.JSON.0.id');
    });
  });
});
