import fs = require('fs');
import path = require('path');
import { Context } from 'koa';
import isEmpty from 'lodash/isEmpty';
import get from 'get-value';
import { API_VERSION, CHANNELS, RETL_TIMESTAMP } from '../../routes/utils/constants';
import { getCompatibleStatusCode } from '../../adapters/utils/networkUtils';
import {
  ProcessorTransformationRequest,
  RouterTransformationRequestData,
  RudderMessage,
  SourceInput,
} from '../../types';
import { getValueFromMessage, getDestinationExternalIDInfoForRetl } from '../../v0/util';
import genericFieldMap from '../../v0/util/data/GenericFieldMapping.json';
import { EventType, MappedToDestinationKey } from '../../constants';
import { EVENT_TYPE } from 'rudder-transformer-cdk/build/constants';
import { agnosticDestinations } from '../../features.json';

type RECORD_EVENT = {
  type: 'record';
  action: string;
  destinationFields?: string;
  fields: object;
  channel: string;
  context: object;
  recordid: string;
  rudderid: string;
  messageid: string;
  event?: string;
};

export class ControllerUtility {
  private static sourceVersionMap: Map<string, string> = new Map();

  public static timestampValsMap: Record<string, string[]> = {
    [EventType.IDENTIFY]: [
      `context.${RETL_TIMESTAMP}`,
      `context.traits.${RETL_TIMESTAMP}`,
      `traits.${RETL_TIMESTAMP}`,
      ...genericFieldMap.timestamp,
    ],
    [EventType.TRACK]: [`properties.${RETL_TIMESTAMP}`, ...genericFieldMap.timestamp],
  };

  private static getSourceVersionsMap(): Map<string, any> {
    if (this.sourceVersionMap?.size > 0) {
      return this.sourceVersionMap;
    }
    const versions = ['v0', 'v1'];
    versions.forEach((version) => {
      const files = fs.readdirSync(path.resolve(__dirname, `../../${version}/sources`), {
        withFileTypes: true,
      });
      const sources = files.filter((file) => file.isDirectory()).map((folder) => folder.name);
      sources.forEach((source) => {
        this.sourceVersionMap.set(source, version);
      });
    });
    return this.sourceVersionMap;
  }

  private static convertSourceInputv1Tov0(sourceEvents: SourceInput[]): NonNullable<unknown>[] {
    return sourceEvents.map((sourceEvent) => sourceEvent.event);
  }

  private static convertSourceInputv0Tov1(sourceEvents: unknown[]): SourceInput[] {
    return sourceEvents.map(
      (sourceEvent) => ({ event: sourceEvent, source: undefined }) as SourceInput,
    );
  }

  public static adaptInputToVersion(
    sourceType: string,
    requestVersion: string,
    input: NonNullable<unknown>[],
  ): { implementationVersion: string; input: NonNullable<unknown>[] } {
    const sourceToVersionMap = this.getSourceVersionsMap();
    const implementationVersion = sourceToVersionMap.get(sourceType);
    let updatedInput: NonNullable<unknown>[] = input;
    if (requestVersion === 'v0' && implementationVersion === 'v1') {
      updatedInput = this.convertSourceInputv0Tov1(input);
    } else if (requestVersion === 'v1' && implementationVersion === 'v0') {
      updatedInput = this.convertSourceInputv1Tov0(input as SourceInput[]);
    }
    return { implementationVersion, input: updatedInput };
  }

  private static getCompatibleStatusCode(status: number): number {
    return getCompatibleStatusCode(status);
  }

  public static postProcess(ctx: Context, status = 200) {
    ctx.set('apiVersion', API_VERSION);
    ctx.status = status;
  }

  public static deliveryPostProcess(ctx: Context, status = 200) {
    ctx.set('apiVersion', API_VERSION);
    ctx.status = this.getCompatibleStatusCode(status);
  }

  public static handleTimestampInEvents(
    events: Array<ProcessorTransformationRequest | RouterTransformationRequestData>,
  ): Array<ProcessorTransformationRequest | RouterTransformationRequestData> {
    return events.map((event) => {
      const newMsg = { ...event.message } as RudderMessage;
      // RETL event & not VDM
      if (newMsg.channel === CHANNELS.sources && !get(newMsg, MappedToDestinationKey)) {
        const timestampValsArr = ControllerUtility.timestampValsMap[newMsg.type];
        if (!Array.isArray(timestampValsArr) || isEmpty(timestampValsArr)) {
          return event;
        }
        newMsg.timestamp = getValueFromMessage(newMsg, timestampValsArr);
      }
      return { ...event, message: newMsg };
    });
  }

  public static transformToRecordEvent(
    events: Array<ProcessorTransformationRequest | RouterTransformationRequestData>,
  ) {
    // is events[0].destination.Name present in feature.json
    // if true then process this methid else return

    const destName = events[0].destination.DestinationDefinition.Name;
    if (!Object.keys(agnosticDestinations).includes(destName.toUpperCase())) {
      return events;
    }

    console.log('[Hubspot]:: Transforming to record event');
    events.forEach((event) => {
      // type of event
      // create fields from destination config
      // then create the record events
      const eventMessage = { ...event.message } as RudderMessage;
      const fields = ControllerUtility.getFieldFromDestConfig(eventMessage, destName);
      const action: string = ControllerUtility.getActionForRecordEvent(eventMessage);

      if (!eventMessage.context['mappedToDestination']) {
        if (eventMessage.context['externalId']) {
          eventMessage.context['lookupId'] = eventMessage.context['externalId'];
          // delete externalId from context
          delete eventMessage.context['externalId'];
        }
        const externalId = ControllerUtility.createExternalId(eventMessage, destName);
        eventMessage.context['externalId'] = externalId;
      }
      const translatedRecord: RECORD_EVENT = {
        type: 'record',
        action: action,
        destinationFields: eventMessage.destinationFields,
        fields: fields,
        channel: eventMessage.channel,
        context: eventMessage.context,
        recordid: eventMessage.recordId || '',
        rudderid: eventMessage.rudderId || '',
        messageid: eventMessage.messageId,
        event: eventMessage.event,
      };
      event.message = translatedRecord;
    });
    return events;
  }

  public static createExternalId(eventMessage: RudderMessage, destName: string) {
    const type = eventMessage.type;
    if (!eventMessage.context['externalId']) {
      const externalId = [
        {
          type: `${destName}-${type}`,
          identifierType: type,
        },
      ];
      return externalId;
    }
    return eventMessage.context['externalId'];
  }

  public static getActionForRecordEvent(eventMessage: RudderMessage): string {
    const type = eventMessage.type;
    if (type === EventType.RECORD) {
      return eventMessage.action || 'insert';
    }
    if (!eventMessage.context['mappedToDestination']) {
      if (eventMessage.type === EventType.IDENTIFY && eventMessage.context['externalId']) {
        return 'update';
      }
    }
    return 'insert';
  }

  public static getFieldFromDestConfig(eventMessage: RudderMessage, destName: string) {
    // go to src/v0/destinations/destName/agnoisticConfig.json
    const isVdmEnabled = eventMessage.context['mappedToDestination'];
    const eventTypeName = eventMessage.type;
    if (isVdmEnabled) {
      let fields: any = {};
      // get the fields from the vdm
      fields = eventTypeName == 'track' ? eventMessage.properties : eventMessage.traits;

      const { identifierType, destinationExternalId } = getDestinationExternalIDInfoForRetl(
        eventMessage,
        destName,
      );

      if (identifierType && destinationExternalId) {
        fields[identifierType] = destinationExternalId;
      }
      return fields;
    }
    // get the fields from the agnostic config
    return ControllerUtility.translateFromAgnosticConfig(eventTypeName, destName, eventMessage);
  }

  public static translateFromAgnosticConfig(
    eventTypeName: string,
    destName: string,
    eventMessage: RudderMessage,
  ) {
    const configPath = path.join(
      __dirname,
      `../../v0/destinations/${destName.toLowerCase()}/agnotstic.json`,
    );
    console.log(configPath);
    const agnosticConfig = JSON.parse(fs.readFileSync(configPath, 'utf8'));
    let object;
    if (getDestinationExternalIDInfoForRetl(eventMessage, destName).objectType) {
      object = getDestinationExternalIDInfoForRetl(eventMessage, destName).objectType;
    } else {
      object = eventTypeName;
    }
    if (!agnosticConfig[object]) {
      throw new Error(`object not found in agnostic config`);
    }

    const mappedEvent: any = {};

    agnosticConfig[object].forEach((fieldMapping) => {
      // eslint-disable-next-line no-restricted-syntax
      for (const sourceKey of fieldMapping.sourceKeys) {
        const value = ControllerUtility.getNestedValue(eventMessage, sourceKey);
        if (value !== undefined) {
          mappedEvent[fieldMapping.destKey] = value;
          break;
        }
      }

      if (fieldMapping.required && mappedEvent[fieldMapping.destKey] === undefined) {
        throw new Error(`Required field ${fieldMapping.destKey} not found in event message`);
      }
    });

    return mappedEvent;
  }

  public static getNestedValue(obj: any, keyPath: string) {
    return keyPath.split('.').reduce((acc, key) => (acc ? acc[key] : undefined), obj);
  }
}
