import { InstrumentationError } from '@rudderstack/integrations-lib';

export const validateAudienceListMessageType = (messageType: string | undefined) => {
  if (!messageType) {
    throw new InstrumentationError('message Type is not present. Aborting message.');
  }
  if (messageType.toLowerCase() !== 'audiencelist') {
    throw new InstrumentationError(
      `Event type ${messageType.toLowerCase()} is not supported. Aborting message.`,
    );
  }
};
