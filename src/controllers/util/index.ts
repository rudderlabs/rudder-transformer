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
import { getValueFromMessage } from '../../v0/util';
import genericFieldMap from '../../v0/util/data/GenericFieldMapping.json';
import { EventType, MappedToDestinationKey } from '../../constants';

export default class ControllerUtility {
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
      (sourceEvent) => ({ event: sourceEvent, source: undefined } as SourceInput),
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
}
