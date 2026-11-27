import { NetworkError } from '@rudderstack/integrations-lib';
import { ensureFields } from './lookup';
import type { ZendeskClient } from './utils';

const request = jest.fn();
const baseUrl = 'https://example.zendesk.com/api/v2/';
const client = (destinationId: string, accountId?: string) =>
  ({
    baseUrl,
    destinationId,
    subdomain: 'example',
    accountId,
    request,
  }) as unknown as ZendeskClient;
const fields = { user_fields: [{ key: 'name' }], next_page: null };

beforeEach(() => request.mockReset());

describe('Zendesk custom field cache', () => {
  it('loads paginated keys once, then hits the destination/account-scoped cache', async () => {
    const current = client('pagination', 'oauth-A');
    request
      .mockResolvedValueOnce({ user_fields: [], next_page: `${baseUrl}user_fields.json?page=2` })
      .mockResolvedValueOnce({ user_fields: [{ key: 'custom' }], next_page: null });
    await ensureFields(current, 'user_fields', { custom: 'one' });
    await ensureFields(current, 'user_fields', { custom: 'two' });
    expect(request).toHaveBeenCalledTimes(2);
    expect(request).toHaveBeenNthCalledWith(2, 'get', `${baseUrl}user_fields.json?page=2`);

    request.mockResolvedValueOnce(fields).mockResolvedValueOnce({ user_field: { key: 'other' } });
    await ensureFields(client('pagination', 'oauth-B'), 'user_fields', { other: 'value' });
    expect(request).toHaveBeenCalledWith('post', 'user_fields.json', {
      user_field: { title: 'other', active: true, key: 'other', description: 'other' },
    });
  });

  it.each([
    `${baseUrl}user_fields?page[size]=100&cursor=abc`,
    '/api/v2/user_fields.json?page%5Bafter%5D=abc',
  ])('reads valid next-page URL %s', async (next) => {
    request
      .mockResolvedValueOnce({ user_fields: [], next_page: next })
      .mockResolvedValueOnce({ user_fields: [{ key: 'paged' }], next_page: null });
    await ensureFields(client(`pages-${next}`), 'user_fields', { paged: 'value' });
    expect(request).toHaveBeenCalledTimes(2);
    expect(request).toHaveBeenNthCalledWith(2, 'get', new URL(next, baseUrl).href);
  });

  it('writes through a created key without posting it twice', async () => {
    request.mockResolvedValueOnce(fields).mockResolvedValueOnce({ user_field: { key: 'new' } });
    const current = client('write-through');
    await ensureFields(current, 'user_fields', { new: 'first' });
    await ensureFields(current, 'user_fields', { new: 'second' });
    expect(request).toHaveBeenCalledTimes(2);
  });

  it('refreshes a field list after its one-hour TTL', async () => {
    const now = jest.spyOn(Date, 'now');
    try {
      now.mockReturnValue(1_000_000);
      request.mockResolvedValueOnce(fields);
      const current = client('expires');
      await ensureFields(current, 'user_fields', { name: 'first' });
      now.mockReturnValue(1_000_000 + 60 * 60 * 1000 + 1);
      request.mockResolvedValueOnce(fields);
      await ensureFields(current, 'user_fields', { name: 'second' });
      expect(request).toHaveBeenCalledTimes(2);
    } finally {
      now.mockRestore();
    }
  });

  it('writes through a duplicate-key 422 only when Zendesk confirms the key was taken', async () => {
    const current = client('422-duplicate');
    request.mockResolvedValueOnce(fields).mockRejectedValueOnce(
      new NetworkError(
        'duplicate',
        422,
        {},
        {
          errors: [{ field: 'key', description: 'has already been taken' }],
        },
      ),
    );
    await ensureFields(current, 'user_fields', { concurrent: 'v' });
    await ensureFields(current, 'user_fields', { concurrent: 'again' });
    expect(request).toHaveBeenCalledTimes(2);
  });

  it('rejects a 422 instead of caching an unverified field creation', async () => {
    const current = client('422-error');
    request
      .mockResolvedValueOnce(fields)
      .mockRejectedValueOnce(new NetworkError('invalid custom field', 422));
    await expect(ensureFields(current, 'user_fields', { invalid: 'v' })).rejects.toThrow(
      'invalid custom field',
    );
    request.mockResolvedValueOnce({ user_field: { key: 'invalid' } });
    await ensureFields(current, 'user_fields', { invalid: 'v' });
    expect(request).toHaveBeenCalledTimes(3);
  });

  it.each([
    { name: 'cross-account URL', next: 'https://attacker.example/user_fields.json' },
    { name: 'other Zendesk path', next: `${baseUrl}user_fields.json.evil` },
    {
      name: 'cross-account prefix',
      next: 'https://example.zendesk.com.evil/api/v2/user_fields.json',
    },
    { name: 'pagination cycle', next: `${baseUrl}user_fields.json` },
  ])('rejects $name rather than fetching outside the expected pages', async ({ next, name }) => {
    const current = client(`malformed-${name}`);
    request.mockResolvedValueOnce({ user_fields: [], next_page: next });
    await expect(ensureFields(current, 'user_fields', {})).rejects.toThrow(
      'Invalid Zendesk field-list pagination',
    );
    expect(request).toHaveBeenCalledTimes(1);
  });
});
