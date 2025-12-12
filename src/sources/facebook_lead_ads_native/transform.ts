import { TransformationError } from '@rudderstack/integrations-lib';
import { EventType } from '../../constants';
import { InputEventType, OutputEventType, FacebookEntry, FacebookChange } from './type';
import { Source, SourceInputV2 } from '../../types';
import { getBodyFromV2SpecPayload } from '../../v0/util';
import logger from '../../logger';

function processEvent(source: Source, inputEvent: InputEventType): OutputEventType[] {
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

      /*
        - If multiple sources are subscribed to the same leadgen events, and the messageId doesn’t include the sourceId,
          data plane’s deduplication logic might treat events for different sources as duplicates and drop them.
          Include the sourceId to ensure that each source’s events are considered distinct.
        - Keep the messageId short to avoid increasing data plane's disk size requirements.
      */
      // Ensure to keep the messageId
      const messageId = `${source.ID}-${value.leadgen_id}`;

      // Create the RudderStack identify event
      const event: OutputEventType = {
        type: EventType.IDENTIFY,
        anonymousId: value.leadgen_id,
        messageId,
        context: {
          traits: {
            pageId: value.page_id,
            formId: value.form_id,
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
  return processEvent(payload.source, body);
};

export { process };
