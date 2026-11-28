import { RetryableError } from '@rudderstack/integrations-lib';
import stats from '../../../util/stats';
import { FIELD_DEFAULTS, ORGANIZATION_FIELDS, USER_FIELDS } from './frameworkConfig';
import { zendeskPageUrl, type ZendeskClient } from './utils';

const TTL_MS = 60 * 60 * 1000;
const MAX_CACHE_ENTRIES = 1000;
const cache = new Map<string, { keys: Set<string>; expires: number }>();

export const ensureFields = async (
  client: ZendeskClient,
  type: typeof USER_FIELDS | typeof ORGANIZATION_FIELDS,
  traits: Record<string, any>,
): Promise<void> => {
  const key = JSON.stringify([client.destinationId, client.subdomain, client.accountId, type]);
  const labels = { type };
  let entry = cache.get(key);
  if (!entry || entry.expires <= Date.now()) {
    stats.counter('zendesk_field_cache_lookup_count', 1, { ...labels, outcome: 'miss' });
    const keys = new Set<string>(FIELD_DEFAULTS[type]);
    let next: string | null = `${client.baseUrl}${type}.json`;
    const seen = new Set<string>();
    while (next) {
      const pageUrl = zendeskPageUrl(next, client.baseUrl, `${type}.json`);
      if (!pageUrl || seen.has(pageUrl)) {
        stats.counter('zendesk_field_cache_lookup_count', 1, { ...labels, outcome: 'malformed' });
        throw new RetryableError('Invalid Zendesk field-list pagination', 500);
      }
      seen.add(pageUrl);
      // eslint-disable-next-line no-await-in-loop -- pagination is sequential
      const page = await client.request('get', pageUrl);
      if (
        !Array.isArray(page?.[type]) ||
        !page[type].every((field: any) => typeof field?.key === 'string') ||
        !(page.next_page === null || typeof page.next_page === 'string')
      ) {
        stats.counter('zendesk_field_cache_lookup_count', 1, { ...labels, outcome: 'malformed' });
        throw new RetryableError('Malformed Zendesk field-list response', 500);
      }
      page[type].forEach((field: { key: string }) => keys.add(field.key));
      next = page.next_page;
    }
    entry = { keys, expires: Date.now() + TTL_MS };
    cache.delete(key);
    if (cache.size >= MAX_CACHE_ENTRIES) cache.delete(cache.keys().next().value as string);
    cache.set(key, entry);
  } else {
    stats.counter('zendesk_field_cache_lookup_count', 1, { ...labels, outcome: 'hit' });
  }

  for (const field of Object.keys(traits)) {
    if (typeof traits[field] !== 'object' && !entry.keys.has(field)) {
      const singular = type.slice(0, -1);
      const body = { [singular]: { title: field, active: true, key: field, description: field } };
      try {
        // eslint-disable-next-line no-await-in-loop -- write through before next field
        await client.request('post', `${type}.json`, body);
      } catch (error) {
        // Treat only an explicit key conflict as another writer's completed create;
        // unrelated validation failures must not populate the cache.
        const response = (error as { destinationResponse?: unknown }).destinationResponse as
          | {
              errors?: { field?: string; description?: string }[];
            }
          | undefined;
        const duplicate =
          Array.isArray(response?.errors) &&
          response.errors.some(
            (item) =>
              item.field === 'key' &&
              item.description?.toLowerCase().includes('already been taken'),
          );
        if ((error as { status?: number }).status !== 422 || !duplicate) throw error;
      }
      entry.keys.add(field);
    }
  }
};
