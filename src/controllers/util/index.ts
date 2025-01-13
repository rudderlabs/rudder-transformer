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
  SourceInputConversionResult,
} from '../../types';
import { getValueFromMessage } from '../../v0/util';
import genericFieldMap from '../../v0/util/data/GenericFieldMapping.json';
import { EventType, MappedToDestinationKey } from '../../constants';
import { versionConversionFactory } from './versionConversion';

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

  public static adaptInputToVersion(
    sourceType: string,
    requestVersion: string,
    input: NonNullable<unknown>[],
  ): { implementationVersion: string; input: SourceInputConversionResult<NonNullable<unknown>>[] } {
    const sourceToVersionMap = this.getSourceVersionsMap();
    const implementationVersion = sourceToVersionMap.get(sourceType);

    const conversionStrategy = versionConversionFactory.getStrategy(
      requestVersion,
      implementationVersion,
    );
    return { implementationVersion, input: conversionStrategy.convert(input) };
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
