/* eslint-disable class-methods-use-this */
import IntegrationDestinationService from '../interfaces/DestinationService';
import {
  DeliveryResponse,
  Destination,
  ErrorDetailer,
  MetaTransferObject,
  ProcessorTransformationOutput,
  ProcessorTransformationRequest,
  ProcessorTransformationResponse,
  RouterTransformationRequestData,
  RouterTransformationResponse,
  UserDeletionRequest,
  UserDeletionResponse,
} from '../types';
import tags from '../v0/util/tags';
import stats from '../util/stats';
import logger from '../logger';
import { CommonUtils } from '../util/common';

const NS_PER_SEC = 1e9;

export default class ComparatorService implements IntegrationDestinationService {
  secondaryService: IntegrationDestinationService;

  primaryService: IntegrationDestinationService;

  constructor(
    primaryService: IntegrationDestinationService,
    secondaryService: IntegrationDestinationService,
  ) {
    this.primaryService = primaryService;
    this.secondaryService = secondaryService;
  }

  public init(): void {
    this.primaryService.init();
    this.secondaryService.init();
  }

  public getName(): string {
    return 'Comparator';
  }

  public getTags(
    destType: string,
    destinationId: string,
    workspaceId: string,
    feature: string,
  ): MetaTransferObject {
    const metaTO = {
      errorDetails: {
        destType: destType.toUpperCase(),
        module: tags.MODULES.DESTINATION,
        implementation: this.primaryService.getName(),
        feature,
        destinationId,
        workspaceId,
      } as ErrorDetailer,
      errorContext: '[Native Integration Service] Comparator Service Failure',
    } as MetaTransferObject;
    return metaTO;
  }

  private getTestThreshold(destination: Destination) {
    return destination.DestinationDefinition?.Config?.camparisonTestThreshold || 0;
  }

  private getComparisonLogs(
    primaryResplist: any,
    secondaryResplist: any,
    destinationId: string,
    destination: string,
    feature: string,
  ) {
    if (primaryResplist.length !== secondaryResplist.length) {
      logger.error(
        `[LIVE_COMPARE_TEST] failed for destinationId=${destinationId}, destType=${destination}, feature=${feature}, ${this.primaryService.getName()} output size: ${
          primaryResplist.length
        },  ${this.secondaryService.getName()} output size: ${secondaryResplist.length}`,
      );
      return;
    }

    // eslint-disable-next-line no-restricted-syntax
    for (const [index, element] of primaryResplist.entries()) {
      const objectDiff = CommonUtils.objectDiff(element, secondaryResplist[index]);
      if (Object.keys(objectDiff).length > 0) {
        logger.error(
          `[LIVE_COMPARE_TEST] failed for destinationId=${destinationId}, destType=${destination}, feature=${feature}, diff_keys=${JSON.stringify(
            Object.keys(objectDiff),
          )}`,
        );

        //   logger.error(
        //     `[LIVE_COMPARE_TEST] failed for  destinationId=${destinationId}, destType=${destination}, feature=${feature}, diff=${JSON.stringify(
        //       objectDiff,
        //     )}`,
        //   );
        //   logger.error(
        //     `[LIVE_COMPARE_TEST] failed for  destinationId=${destinationId}, destType=${destination}, feature=${feature}, input=${JSON.stringify(
        //       events[0],
        //     )}`,
        //   );
        //   logger.error(
        //     `[LIVE_COMPARE_TEST] failed for  destinationId=${destinationId}, destType=${destination}, feature=${feature}, results=${JSON.stringify(
        //       {
        //         primaryResult: primaryResplist[index],
        //         secondaryResult: secondaryResplist[index],
        //       },
        //     )}`,
        //   );
      }
    }
  }

  private getComaprisonStats(
    primaryResplist: any,
    secondaryResplist: any,
    destinationId: string,
    destination: string,
    feature: string,
  ) {
    if (primaryResplist.length !== secondaryResplist.length) {
      stats.counter('compare_test_failed_count', 1, {
        destinationId,
        destination,
        feature,
      });
      return;
    }

    let hasComparisonFailed = false;
    // eslint-disable-next-line no-restricted-syntax
    for (const [index, element] of primaryResplist.entries()) {
      const objectDiff = CommonUtils.objectDiff(element, secondaryResplist[index]);
      if (Object.keys(objectDiff).length > 0) {
        stats.counter('compare_test_failed_count', 1, {
          destinationId,
          destination,
          feature,
        });
        hasComparisonFailed = true;
      }
    }

    if (!hasComparisonFailed) {
      stats.counter('compare_test_success_count', 1, {
        destinationId,
        destination,
        feature,
      });
    }
  }

  private async compare(
    events: any,
    primaryResplist: any,
    secondaryServiceCallback: any,
    destinationType: string,
    version: string,
    requestMetadata: NonNullable<unknown>,
    feature: string,
    destinationId: string,
  ): Promise<void> {
    const secondaryStartTime = process.hrtime();
    const secondaryResplist = await secondaryServiceCallback(
      events,
      destinationType,
      version,
      requestMetadata,
    );
    const secondaryTimeDiff = process.hrtime(secondaryStartTime);
    const secondaryTime = secondaryTimeDiff[0] * NS_PER_SEC + secondaryTimeDiff[1];
    stats.gauge(`${this.secondaryService.getName()}_transformation_time`, secondaryTime, {
      destination: destinationType,
      feature,
    });

    this.getComaprisonStats(
      primaryResplist,
      secondaryResplist,
      destinationId,
      destinationType,
      feature,
    );
    this.getComparisonLogs(
      primaryResplist,
      secondaryResplist,
      destinationId,
      destinationType,
      feature,
    );
  }

  public async doProcessorTransformation(
    events: ProcessorTransformationRequest[],
    destinationType: string,
    version: string,
    requestMetadata: NonNullable<unknown>,
  ): Promise<ProcessorTransformationResponse[]> {
    const destinationId = events[0].destination.ID;
    const primaryStartTime = process.hrtime();
    const primaryResplist = await this.primaryService.doProcessorTransformation(
      events,
      destinationType,
      version,
      requestMetadata,
    );
    const primaryTimeDiff = process.hrtime(primaryStartTime);
    const primaryTime = primaryTimeDiff[0] * NS_PER_SEC + primaryTimeDiff[1];
    stats.gauge(`${this.primaryService.getName()}_transformation_time`, primaryTime, {
      destinationId,
      destination: destinationType,
      feature: tags.FEATURES.PROCESSOR,
    });

    try {
      const envThreshold = parseFloat(process.env.COMPARISON_TEST || '0');
      const destThreshold = this.getTestThreshold(events[0].destination);
      const compareTestThreshold = envThreshold * destThreshold;
      if (
        Number.isNaN(compareTestThreshold) ||
        !compareTestThreshold ||
        compareTestThreshold < Math.random()
      ) {
        return primaryResplist;
      }
      this.compare(
        events,
        primaryResplist,
        this.secondaryService.doProcessorTransformation,
        destinationType,
        version,
        requestMetadata,
        tags.FEATURES.PROCESSOR,
        destinationId,
      );
    } catch (error) {
      stats.counter('compare_test_failed_count', 1, {
        destinationId,
        destination: destinationType,
        feature: tags.FEATURES.PROCESSOR,
      });
      logger.error(
        `[LIVE_COMPARE_TEST] errored for destinationId=${destinationId}, destType=${destinationType}, feature=${tags.FEATURES.PROCESSOR}`,
        error,
      );
    }

    return primaryResplist;
  }

  public async doRouterTransformation(
    events: RouterTransformationRequestData[],
    destinationType: string,
    version: string,
    requestMetadata: NonNullable<unknown>,
  ): Promise<RouterTransformationResponse[]> {
    const destinationId = events[0].destination.ID;
    const primaryStartTime = process.hrtime();
    const primaryResplist = await this.primaryService.doRouterTransformation(
      events,
      destinationType,
      version,
      requestMetadata,
    );
    const primaryTimeDiff = process.hrtime(primaryStartTime);
    const primaryTime = primaryTimeDiff[0] * NS_PER_SEC + primaryTimeDiff[1];
    stats.gauge(`${this.primaryService.getName()}_transformation_time`, primaryTime, {
      destinationId,
      destination: destinationType,
      feature: tags.FEATURES.ROUTER,
    });

    try {
      const envThreshold = parseFloat(process.env.COMPARISON_TEST || '0');
      const destThreshold = this.getTestThreshold(events[0].destination);
      const compareTestThreshold = envThreshold * destThreshold;
      if (
        Number.isNaN(compareTestThreshold) ||
        !compareTestThreshold ||
        compareTestThreshold < Math.random()
      ) {
        return primaryResplist;
      }
      this.compare(
        events,
        primaryResplist,
        this.secondaryService.doRouterTransformation,
        destinationType,
        version,
        requestMetadata,
        tags.FEATURES.ROUTER,
        destinationId,
      );
    } catch (error) {
      stats.counter('compare_test_failed_count', 1, {
        destinationId,
        destination: destinationType,
        feature: tags.FEATURES.ROUTER,
      });
      logger.error(
        `[LIVE_COMPARE_TEST] errored for destinationId=${destinationId}, destType=${destinationType}, feature=${tags.FEATURES.ROUTER}`,
        error,
      );
    }

    return primaryResplist;
  }

  public doBatchTransformation(
    events: RouterTransformationRequestData[],
    destinationType: string,
    version: string,
    requestMetadata: NonNullable<unknown>,
  ): RouterTransformationResponse[] {
    const destinationId = events[0].destination.ID;
    const primaryStartTime = process.hrtime();
    const primaryResplist = this.primaryService.doBatchTransformation(
      events,
      destinationType,
      version,
      requestMetadata,
    );
    const primaryTimeDiff = process.hrtime(primaryStartTime);
    const primaryTime = primaryTimeDiff[0] * NS_PER_SEC + primaryTimeDiff[1];
    stats.gauge(`${this.primaryService.getName()}_transformation_time`, primaryTime, {
      destinationId,
      destination: destinationType,
      feature: tags.FEATURES.BATCH,
    });

    try {
      const envThreshold = parseFloat(process.env.COMPARISON_TEST || '0');
      const destThreshold = this.getTestThreshold(events[0].destination);
      const compareTestThreshold = envThreshold * destThreshold;
      if (
        Number.isNaN(compareTestThreshold) ||
        !compareTestThreshold ||
        compareTestThreshold < Math.random()
      ) {
        return primaryResplist;
      }
      this.compare(
        events,
        primaryResplist,
        this.secondaryService.doBatchTransformation,
        destinationType,
        version,
        requestMetadata,
        tags.FEATURES.BATCH,
        destinationId,
      );
    } catch (error) {
      stats.counter('compare_test_failed_count', 1, {
        destinationId,
        destination: destinationType,
        feature: tags.FEATURES.BATCH,
      });
      logger.error(
        `[LIVE_COMPARE_TEST] errored for destinationId=${destinationId}, destType=${destinationType}, feature=${tags.FEATURES.BATCH}`,
        error,
      );
    }

    return primaryResplist;
  }

  public async deliver(
    event: ProcessorTransformationOutput,
    destinationType: string,
    requestMetadata: NonNullable<unknown>,
  ): Promise<DeliveryResponse> {
    const primaryResplist = await this.primaryService.deliver(
      event,
      destinationType,
      requestMetadata,
    );
    logger.error('[LIVE_COMPARE_TEST] not implemented for delivery routine');

    return primaryResplist;
  }

  public async processUserDeletion(
    requests: UserDeletionRequest[],
    rudderDestInfo: string,
  ): Promise<UserDeletionResponse[]> {
    const primaryResplist = await this.primaryService.processUserDeletion(requests, rudderDestInfo);
    logger.error('[LIVE_COMPARE_TEST] not implemented for deletion routine');

    return primaryResplist;
  }
}
