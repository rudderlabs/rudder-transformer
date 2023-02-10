import dotenv from 'dotenv';
import {
  ComparatorInput,
  Destination,
  ProcessorTransformationRequest,
  RouterTransformationRequestData,
} from '../types';
import ServiceSelector from '../helpers/serviceSelector';
import tags from '../v0/util/tags';
import stats from '../util/stats';
import logger from '../logger';
import { CommonUtils } from '../util/common';
import { PlatformError } from '../v0/util/errorTypes';
const NS_PER_SEC = 1e9;

dotenv.config();

export default class ComparatorService {
  private static getTestThreshold(destination: Destination) {
    return destination.DestinationDefinition?.Config['camparisonTestThreshold'] || 0;
  }

  public static async compareDestinationService(input: ComparatorInput): Promise<void> {
    const { events, version, destination, requestMetadata, feature } = input;

    try {
      const primaryServiceName = process.env.COMPARISON_TEST_PRIMARY_SERVICE;
      const secondaryServiceName = process.env.COMPARISON_TEST_SECONDARY_SERVICE;

      const envThreshold = parseFloat(process.env.COMPARISON_TEST || '0');
      const destThreshold = this.getTestThreshold(events[0].destination);
      const compareTestThreshold = envThreshold * destThreshold;
      if (
        Number.isNaN(compareTestThreshold) ||
        !compareTestThreshold ||
        compareTestThreshold < Math.random()
      ) {
        return;
      }

      const primaryIntegrationService =
        ServiceSelector.getDestinationServiceByName(primaryServiceName);
      const secondaryIntegrationService =
        ServiceSelector.getDestinationServiceByName(secondaryServiceName);
      primaryIntegrationService.init();
      secondaryIntegrationService.init();

      let primaryRoutine: any;
      let secondaryRoutine: any;
      let definedEvents: any;
      switch (feature) {
        case tags.FEATURES.PROCESSOR: {
          definedEvents = events as ProcessorTransformationRequest[];
          primaryRoutine = primaryIntegrationService.processorRoutine;
          secondaryRoutine = secondaryIntegrationService.processorRoutine;
          break;
        }
        case tags.FEATURES.ROUTER: {
          definedEvents = events as RouterTransformationRequestData[];
          primaryRoutine = primaryIntegrationService.routerRoutine;
          secondaryRoutine = secondaryIntegrationService.routerRoutine;
          break;
        }
        case tags.FEATURES.BATCH: {
          definedEvents = events as RouterTransformationRequestData[];
          primaryRoutine = primaryIntegrationService.batchRoutine;
          secondaryRoutine = secondaryIntegrationService.batchRoutine;
          break;
        }
        default:
          throw new PlatformError('Incorrect Integration Feature for comparison');
      }

      const primaryStartTime = process.hrtime();
      const primaryResplist = await primaryRoutine(
        definedEvents.slice(0, 1),
        destination,
        version,
        requestMetadata,
      );
      const primaryTimeDiff = process.hrtime(primaryStartTime);
      const primaryTime = primaryTimeDiff[0] * NS_PER_SEC + primaryTimeDiff[1];
      stats.gauge(`${primaryIntegrationService.getName}_transformation_time`, primaryTime, {
        destination,
        feature,
      });

      const secondaryStartTime = process.hrtime();
      const secondaryResplist = await secondaryRoutine(
        definedEvents.slice(0, 1),
        destination,
        version,
        requestMetadata,
      );
      const secondaryTimeDiff = process.hrtime(secondaryStartTime);
      const secondaryTime = secondaryTimeDiff[0] * NS_PER_SEC + secondaryTimeDiff[1];
      stats.gauge(`${secondaryIntegrationService.getName}_transformation_time`, secondaryTime, {
        destination,
        feature,
      });

      if (primaryResplist.length !== secondaryResplist.length) {
        logger.error(
          `[LIVE_COMPARE_TEST] failed for destType=${destination}, feature=${feature}, ${primaryIntegrationService.getName()} output size: ${
            primaryResplist.length
          },  ${secondaryIntegrationService.getName()} output size: ${secondaryResplist.length}`,
        );
      }

      for (let index = 0; index < primaryResplist.length; index++) {
        const objectDiff = CommonUtils.objectDiff(primaryResplist[index], secondaryResplist[index]);
        if (Object.keys(objectDiff).length > 0) {
          stats.counter('compare_test_failed_count', 1, {
            destination,
            feature,
          });
          logger.error(
            `[LIVE_COMPARE_TEST] failed for destType=${destination}, feature=${feature}, diff_keys=${JSON.stringify(
              Object.keys(objectDiff),
            )}`,
          );

          //   logger.error(
          //     `[LIVE_COMPARE_TEST] failed for destType=${destination}, feature=${feature}, diff=${JSON.stringify(
          //       objectDiff,
          //     )}`,
          //   );
          //   logger.error(
          //     `[LIVE_COMPARE_TEST] failed for destType=${destination}, feature=${feature}, input=${JSON.stringify(
          //       events[0],
          //     )}`,
          //   );
          //   logger.error(
          //     `[LIVE_COMPARE_TEST] failed for destType=${destination}, feature=${feature}, results=${JSON.stringify(
          //       {
          //         primaryResult: primaryResplist[index],
          //         secondaryResult: secondaryResplist[index],
          //       },
          //     )}`,
          //   );
          return;
        }
      }

      stats.counter('compare_test_success_count', 1, {
        destination,
        feature: feature,
      });
    } catch (error) {
      stats.counter('compare_test_failed_count', 1, {
        destination,
        feature: feature,
      });
      logger.error(
        `[LIVE_COMPARE_TEST] errored for destType=${destination}, feature=${feature}`,
        error,
      );
    }
  }
}
