import { InstrumentationError, NetworkError } from '@rudderstack/integrations-lib';
import { constructPayload, setValueForUntrustedPath } from '../../util';
import { FIELD_DEFAULTS, MAPPINGS, ORGANIZATION_FIELDS } from './frameworkConfig';
import { ensureFields } from './lookup';
import {
  createUser,
  findUser,
  makeDeliveryRequest,
  requireUserId,
  zendeskPageUrl,
  type ZendeskClient,
} from './utils';
import type { ZendeskInput, ZendeskMessage } from './types';

export const group = async (
  client: ZendeskClient,
  message: ZendeskMessage,
  config: ZendeskInput['destination']['Config'],
) => {
  if (!message.traits) throw new InstrumentationError('Organisation Traits are missing. Aborting.');
  await ensureFields(client, ORGANIZATION_FIELDS, message.traits);
  const payload = constructPayload(message, MAPPINGS.group) as Record<string, any>;
  payload.organization ??= {};
  if (payload.organization.external_id) {
    setValueForUntrustedPath(
      payload,
      'organization.organization_fields.id',
      payload.organization.external_id,
    );
  }
  Object.keys(message.traits).forEach((field) => {
    if (
      !FIELD_DEFAULTS[ORGANIZATION_FIELDS].includes(field) &&
      typeof message.traits?.[field] !== 'object'
    ) {
      setValueForUntrustedPath(
        payload,
        `organization.organization_fields.${field}`,
        message.traits?.[field],
      );
    }
  });
  const path = 'organizations/create_or_update.json';
  if (config.sendGroupCallsWithoutUserId && !message.userId) {
    return makeDeliveryRequest(client, path, payload);
  }
  requireUserId(message);
  // A groupId supplies a stable external_id for replay-safe upserts. Without it,
  // retain the legacy create_or_update request and propagate Zendesk's response.
  const result = await client.request('post', path, payload);
  const organizationId = result?.organization?.id;
  if (!organizationId) throw new NetworkError('Zendesk did not return an organization ID', 500);
  const traits = message.context?.traits || {};
  let user = await findUser(client, traits.email || traits.primaryEmail);
  if (!user?.id) {
    if (!traits.name || !traits.email) throw new InstrumentationError('User not found');
    user = await createUser(client, message, config, traits);
  }
  const membershipPath = `users/${user.id}/organization_memberships.json`;
  let next: string | null = `${client.baseUrl}${membershipPath}`;
  const seen = new Set<string>();
  while (next) {
    const pageUrl = zendeskPageUrl(next, client.baseUrl, membershipPath);
    if (!pageUrl || seen.has(pageUrl)) {
      throw new NetworkError('Invalid Zendesk memberships pagination', 500);
    }
    seen.add(pageUrl);
    // eslint-disable-next-line no-await-in-loop -- pagination is sequential
    const memberships = await client.request('get', seen.size === 1 ? membershipPath : pageUrl);
    if (
      !Array.isArray(memberships?.organization_memberships) ||
      !(
        memberships.next_page === null ||
        memberships.next_page === undefined ||
        typeof memberships.next_page === 'string'
      )
    ) {
      throw new NetworkError('Invalid Zendesk memberships response', 500);
    }
    if (
      memberships.organization_memberships.some(
        (item: any) => item.organization_id === organizationId,
      )
    ) {
      return { alreadyDelivered: true as const };
    }
    next = memberships.next_page ?? null;
  }
  return makeDeliveryRequest(client, 'organization_memberships.json', {
    organization_membership: { user_id: user.id, organization_id: organizationId },
  });
};
