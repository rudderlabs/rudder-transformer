const { normalizePageContext, constructFullPayload } = require('./utils');

// Ninetailed rejects the entire batch when any event's context.page is missing one of
// these, so every mapped page object must carry all five.
const REQUIRED_PAGE_FIELDS = ['path', 'query', 'referrer', 'search', 'url'];

describe('normalizePageContext', () => {
  it('adds search when the source omitted it', () => {
    // Real payload that produced "events.index[5].context.page.search: Required"
    const page = {
      path: '/to/ohtefCKH',
      query: {},
      referrer: 'https://www.tiktok.com/',
      tab_url: 'https://koko-ai.pro.typeform.com/to/ohtefCKH',
      title: 'Mental Health First Aid',
      url: 'https://koko-ai.pro.typeform.com/to/ohtefCKH',
    };

    const result = normalizePageContext(page);

    expect(result.search).toBe('');
    expect(Object.keys(result)).toEqual(expect.arrayContaining(REQUIRED_PAGE_FIELDS));
  });

  it('preserves an empty search rather than dropping it', () => {
    const result = normalizePageContext({
      path: '/p',
      query: {},
      referrer: '',
      search: '',
      url: 'u',
    });

    expect(result).toHaveProperty('search', '');
  });

  it('preserves real values and passes through unknown keys', () => {
    const page = {
      path: '/lp',
      query: { utm_campaign: 'spring' },
      referrer: 'https://www.google.com/',
      search: '?utm_campaign=spring',
      url: 'https://x.com/lp?utm_campaign=spring',
      title: 'LP',
      tab_url: 'https://x.com/lp?utm_campaign=spring',
    };

    expect(normalizePageContext(page)).toEqual(page);
  });

  it('fills every required field for a page object that only has extras', () => {
    const result = normalizePageContext({ title: 'Only a title' });

    expect(result).toEqual({
      title: 'Only a title',
      path: '',
      referrer: '',
      search: '',
      url: '',
      query: {},
    });
  });

  it('replaces non-string and non-object values with valid defaults', () => {
    const result = normalizePageContext({
      path: null,
      referrer: 42,
      search: undefined,
      url: { nested: true },
      query: 'not-an-object',
    });

    expect(result).toEqual({ path: '', referrer: '', search: '', url: '', query: {} });
  });

  it('does not mutate the input', () => {
    const page = { path: '/p' };

    normalizePageContext(page);

    expect(page).toEqual({ path: '/p' });
  });

  it.each([
    ['undefined', undefined],
    ['null', null],
    ['a string', 'not-a-page'],
    ['an array', []],
  ])('returns %s untouched', (_name, input) => {
    expect(normalizePageContext(input)).toEqual(input);
  });
});

describe('constructFullPayload page handling', () => {
  const baseMessage = {
    type: 'track',
    event: 'Product Viewed',
    anonymousId: 'anon-1',
    messageId: 'msg-1',
    originalTimestamp: '2026-08-13T00:00:00Z',
  };

  it('backfills search on a partial page context', () => {
    const payload = constructFullPayload({
      ...baseMessage,
      context: {
        page: { path: '/to/ohtefCKH', url: 'https://koko-ai.pro.typeform.com/to/ohtefCKH' },
      },
    });

    expect(payload.context.page).toEqual(
      expect.objectContaining({ path: '/to/ohtefCKH', search: '', referrer: '', query: {} }),
    );
  });

  it('keeps an empty search present end to end', () => {
    const payload = constructFullPayload({
      ...baseMessage,
      context: {
        page: {
          path: '/p/stainless-steel-square-eyeglass-frames/32340/3234014',
          query: {},
          referrer: 'https://www.zennioptical.com/men-glasses',
          search: '',
          url: 'https://www.zennioptical.com/p/stainless-steel-square-eyeglass-frames/32340/3234014',
        },
      },
    });

    expect(payload.context.page).toHaveProperty('search', '');
    expect(JSON.stringify(payload)).toContain('"search"');
  });

  it('does not invent a page for events that carry no page context', () => {
    const payload = constructFullPayload({ ...baseMessage, context: { locale: 'en-US' } });

    expect(payload.context.page).toBeUndefined();
  });
});
