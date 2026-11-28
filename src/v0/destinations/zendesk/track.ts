import { InstrumentationError } from '@rudderstack/integrations-lib';
import {
  createUser,
  findUser,
  makeDeliveryRequest,
  requireUserId,
  traitsOf,
  type ZendeskClient,
} from './utils';
import type { ZendeskInput, ZendeskMessage } from './types';

// Keep the legacy source-name validation and default during the rollout.
// eslint-disable-next-line @typescript-eslint/no-var-requires,global-require,import/extensions
const { getSourceName } = require('./util.js');

export const track = async (
  client: ZendeskClient,
  message: ZendeskMessage,
  config: ZendeskInput['destination']['Config'],
) => {
  requireUserId(message);
  const traits = traitsOf(message);
  let { email } = traits;
  if (!email) throw new InstrumentationError('email not found in traits.');
  let user = await findUser(client, email);
  if (!user?.id) {
    user = await createUser(client, message, config, traits);
    if (!user.email) throw new InstrumentationError('User email not found');
    email = user.email;
  }
  const source = getSourceName(config);
  return makeDeliveryRequest(client, `users/${user.id}/events`, {
    event: {
      description: message.event,
      type: message.event,
      source,
      properties: message.properties,
    },
    profile: { type: message.event, source, identifiers: [{ type: 'email', value: email }] },
  });
};
