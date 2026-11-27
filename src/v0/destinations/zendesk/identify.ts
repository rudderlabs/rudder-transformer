import { NetworkError } from '@rudderstack/integrations-lib';
import { constructPayload, setValueForUntrustedPath } from '../../util';
import { FIELD_DEFAULTS, MAPPINGS, USER_FIELDS } from './frameworkConfig';
import { ensureFields } from './lookup';
import { findUser, requireUserId, traitsOf, type ZendeskClient } from './utils';
import type { ZendeskInput, ZendeskMessage } from './types';

export const identify = async (
  client: ZendeskClient,
  message: ZendeskMessage,
  config: ZendeskInput['destination']['Config'],
): Promise<{ alreadyDelivered: true }> => {
  requireUserId(message);
  const traits = traitsOf(message);
  await ensureFields(client, USER_FIELDS, traits);
  const payload = constructPayload(traits, MAPPINGS.identify) as Record<string, any>;
  payload.user ??= {};
  const externalId = traits.userId || traits.id || message.userId;
  payload.user.external_id = externalId;
  if (externalId) setValueForUntrustedPath(payload, 'user.user_fields.id', externalId);
  Object.keys(traits).forEach((field) => {
    if (!FIELD_DEFAULTS[USER_FIELDS].includes(field) && typeof traits[field] !== 'object') {
      setValueForUntrustedPath(payload, `user.user_fields.${field}`, traits[field]);
    }
  });
  if (config.createUsersAsVerified) payload.user.verified = true;
  const response = await client.request('post', 'users/create_or_update.json', payload);
  const userId = response?.user?.id;
  if (!userId) throw new NetworkError('Zendesk did not return a user ID', 500);

  if (config.searchByExternalId && traits.email) {
    const identities = await client.request('get', `users/${userId}/identities`);
    const duplicate = identities?.identities?.find(
      (identity: any) =>
        identity.type === 'email' && identity.value === traits.email && !identity.primary,
    );
    const primary = identities?.identities?.find(
      (identity: any) =>
        identity.type === 'email' && identity.value !== traits.email && identity.primary,
    );
    if (duplicate?.id) await client.request('delete', `users/${userId}/identities/${duplicate.id}`);
    if (primary?.id)
      await client.request('put', `users/${userId}/identities/${primary.id}`, {
        identity: {
          type: 'email',
          value: String(traits.email),
          verified: !!config.createUsersAsVerified,
        },
      });
  }

  if (config.removeUsersFromOrganization && traits.company?.remove && traits.company.id) {
    const user = await findUser(client, traits.email || traits.primaryEmail);
    if (user?.id) {
      const memberships = await client.request(
        'get',
        `users/${user.id}/organization_memberships.json`,
      );
      const membership = memberships?.organization_memberships?.find(
        (item: any) => item.organization_id === traits.company.id,
      );
      if (membership?.id) {
        await client.request(
          'delete',
          `users/${user.id}/organization_memberships/${membership.id}.json`,
        );
      }
    }
  }
  return { alreadyDelivered: true };
};
