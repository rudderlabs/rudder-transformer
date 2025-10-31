import { TransformationError } from '@rudderstack/integrations-lib';
import { EventType } from '../../constants';
import { InputEventType, OutputEventType, FacebookEntry, FacebookChange } from './type';
import { SourceInputV2 } from '../../types';
import { getBodyFromV2SpecPayload } from '../../v0/util';
import logger from '../../logger';

function processEvent(inputEvent: InputEventType): OutputEventType[] {
  if (inputEvent.object !== 'page') {
    throw new TransformationError('object field must be "page"');
  }

  const events: OutputEventType[] = [];

  // Iterate through each entry
  if (!inputEvent.entry || inputEvent.entry.length === 0) {
    throw new TransformationError('entry field is required');
  }

  inputEvent.entry.forEach((entry: FacebookEntry) => {
    const sentAt = entry.time ? new Date(entry.time * 1000).toISOString() : undefined;

    // Iterate through each change in the entry
    if (!entry.changes) {
      logger.info('[facebook_lead_ads_native] Skipping entry: missing changes field', {
        entryId: entry.id,
      });
      return;
    }

    entry.changes.forEach((change: FacebookChange) => {
      const { value } = change;

      // Skip if required fields are missing
      if (!value || !value.leadgen_id || !value.page_id || !value.form_id) {
        logger.info('[facebook_lead_ads_native] Skipping change: missing required fields', {
          entryId: entry.id,
        });
        return;
      }

      // Create the RudderStack identify event
      const event: OutputEventType = {
        type: EventType.IDENTIFY,
        anonymousId: value.leadgen_id,
        messageId: `${value.page_id}-${value.form_id}-${value.leadgen_id}`,
        context: {
          traits: {
            page_id: value.page_id,
            form_id: value.form_id,
          },
        },
        originalTimestamp: value.created_time
          ? new Date(value.created_time * 1000).toISOString()
          : undefined,
        sentAt,
      };

      events.push(event);
    });
  });
  if (events.length === 0) {
    throw new TransformationError('No valid events found');
  }

  return events;
}

const process = (payload: SourceInputV2) => {
  const body = getBodyFromV2SpecPayload(payload);
  return processEvent(body);
};

export { process };
