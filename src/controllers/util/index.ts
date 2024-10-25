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
  SourceInputConversionResult,
  SourceInputV2,
  SourceRequestV2,
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

  private static convertSourceInputv1Tov0(
    sourceEvents: SourceInput[],
  ): SourceInputConversionResult<NonNullable<unknown>>[] {
    return sourceEvents.map((sourceEvent) => ({
      output: sourceEvent.event as NonNullable<unknown>,
    }));
  }

  private static convertSourceInputv1Tov2(
    sourceEvents: SourceInput[],
  ): SourceInputConversionResult<SourceInputV2>[] {
    // Currently this is not being used
    // Hold off on testing this until atleast one v2 source has been implemented
    return sourceEvents.map((sourceEvent) => {
      try {
        const sourceRequest: SourceRequestV2 = {
          method: '',
          url: '',
          proto: '',
          headers: {},
          query_parameters: {},
          body: JSON.stringify(sourceEvent.event),
        };
        const sourceInputV2: SourceInputV2 = {
          request: sourceRequest,
          source: sourceEvent.source,
        };
        return {
          output: sourceInputV2,
        };
      } catch (err) {
        const conversionError =
          err instanceof Error ? err : new Error('error converting v1 to v2 spec');
        return { output: {} as SourceInputV2, conversionError };
      }
    });
  }

  private static convertSourceInputv0Tov1(
    sourceEvents: unknown[],
  ): SourceInputConversionResult<SourceInput>[] {
    return sourceEvents.map((sourceEvent) => ({
      output: { event: sourceEvent, source: undefined } as SourceInput,
    }));
  }

  private static convertSourceInputv2Tov0(
    sourceEvents: SourceInputV2[],
  ): SourceInputConversionResult<NonNullable<unknown>>[] {
    return sourceEvents.map((sourceEvent) => {
      try {
        const v0Event = JSON.parse(sourceEvent.request.body);
        v0Event.query_parameters = sourceEvent.request.query_parameters;
        return { output: v0Event };
      } catch (err) {
        const conversionError =
          err instanceof Error ? err : new Error('error converting v2 to v0 spec');
        return { output: {} as NonNullable<unknown>, conversionError };
      }
    });
  }

  private static convertSourceInputv2Tov1(
    sourceEvents: SourceInputV2[],
  ): SourceInputConversionResult<SourceInput>[] {
    return sourceEvents.map((sourceEvent) => {
      try {
        const v1Event = { event: JSON.parse(sourceEvent.request.body), source: sourceEvent.source };
        v1Event.event.query_parameters = sourceEvent.request.query_parameters;
        return { output: v1Event };
      } catch (err) {
        const conversionError =
          err instanceof Error ? err : new Error('error converting v2 to v1 spec');
        return { output: {} as SourceInput, conversionError };
      }
    });
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

    // let updatedInput: SourceInputConversionResult<NonNullable<unknown>>[] = input.map((event) => ({
    //   output: event,
    // }));
    // if (requestVersion === 'v0' && implementationVersion === 'v1') {
    //   updatedInput = this.convertSourceInputv0Tov1(input);
    // } else if (requestVersion === 'v1' && implementationVersion === 'v0') {
    //   updatedInput = this.convertSourceInputv1Tov0(input as SourceInput[]);
    // } else if (requestVersion === 'v1' && implementationVersion === 'v2') {
    //   updatedInput = this.convertSourceInputv1Tov2(input as SourceInput[]);
    // } else if (requestVersion === 'v2' && implementationVersion === 'v0') {
    //   updatedInput = this.convertSourceInputv2Tov0(input as SourceInputV2[]);
    // } else if (requestVersion === 'v2' && implementationVersion === 'v1') {
    //   updatedInput = this.convertSourceInputv2Tov1(input as SourceInputV2[]);
    // }
    // return { implementationVersion, input: updatedInput };
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
