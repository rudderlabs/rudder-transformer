import { mapInBatches } from '@rudderstack/integrations-lib';
import { Context } from 'koa';
import { REFRESH_TOKEN } from '../adapters/networkhandler/authConstants';
import logger from '../logger';
import { ServiceSelector } from '../helpers/serviceSelector';
import { DestinationPostTransformationService } from '../services/destination/postTransformation';
import { DestinationPreTransformationService } from '../services/destination/preTransformation';
import { MiscService } from '../services/misc';
import type { Metadata, RudderMessage } from '../types/rudderEvents';
import {
  ProcessorTransformationRequest,
  RouterTransformationRequest,
  RouterTransformationResponse,
} from '../types';
import { DynamicConfigParser } from '../util/dynamicConfigParser';
import stats from '../util/stats';
import { getIntegrationVersion, getDestinationVersion } from '../util/utils';
import { checkInvalidRtTfEvents } from '../v0/util';
import tags from '../v0/util/tags';
import { ControllerUtility } from './util';

const MACHINE_OAUTH_AUTH_TYPE = 'machine_oauth';

export class DestinationController {
  public static async destinationTransformAtProcessor(ctx: Context) {
    const requestMetadata = MiscService.getRequestMetadata(ctx);
    const events = ctx.request.body as ProcessorTransformationRequest[];
    const metaTags = MiscService.getMetaTags(events[0].metadata);
    const { version, destination }: { version: string; destination: string } = ctx.params;
    stats.histogram('dest_transform_input_events', events.length, {
      destination,
      version,
      destVersion: getDestinationVersion(events[0]?.destination?.version),
      ...metaTags,
    });
    const groups = ServiceSelector.groupByDestinationService(events);
    const resplist = (
      await mapInBatches(groups, async ([integrationService, groupEvents]) => {
        let preparedEvents = groupEvents;
        try {
          integrationService.init();
          preparedEvents = DestinationPreTransformationService.preProcess(
            preparedEvents,
            ctx,
          ) as ProcessorTransformationRequest[];
          const timestampCorrectEvents = ControllerUtility.handleTimestampInEvents(preparedEvents);
          preparedEvents = await DynamicConfigParser.process(timestampCorrectEvents);
          return await integrationService.doProcessorTransformation(
            preparedEvents,
            destination,
            version,
            requestMetadata,
          );
        } catch (error: unknown) {
          return preparedEvents.map((ev) => {
            const metaTO = integrationService.getTags(
              destination,
              ev.metadata?.destinationId,
              ev.metadata?.workspaceId,
              tags.FEATURES.PROCESSOR,
            );
            metaTO.metadata = ev.metadata;
            return DestinationPostTransformationService.handleProcessorTransformFailureEvents(
              error as Error,
              metaTO,
            );
          });
        }
      })
    ).flat();
    ctx.body = resplist;
    ControllerUtility.postProcess(ctx);
    stats.histogram('dest_transform_output_events', resplist.length, {
      destination,
      version,
      destVersion: getDestinationVersion(events[0]?.destination?.version),
      ...metaTags,
    });
    return ctx;
  }

  public static async destinationTransformAtRouter(ctx: Context) {
    const requestMetadata = MiscService.getRequestMetadata(ctx);
    const routerRequest = ctx.request.body as RouterTransformationRequest<
      RudderMessage,
      Metadata & { secret?: { accessToken?: string } }
    >;
    const destination = routerRequest.destType;
    const events = routerRequest.input;

    const errorRespEvents = checkInvalidRtTfEvents(events);
    if (errorRespEvents.length > 0) {
      errorRespEvents[0].metadata = [
        {
          destType: destination,
        },
      ];

      ctx.body = { output: errorRespEvents };
      ControllerUtility.postProcess(ctx);
      return ctx;
    }

    const metaTags = MiscService.getMetaTags(events[0].metadata);
    stats.histogram('dest_transform_input_events', events.length, {
      destination,
      version: 'v0',
      destVersion: getDestinationVersion(events[0]?.destination?.version),
      ...metaTags,
    });

    const refreshResponses: RouterTransformationResponse[] = [];
    const dispatchEvents: typeof events = [];
    for (const event of events) {
      const account = event.destination?.deliveryAccount;
      const linkedAccountId = event.destination?.Config?.rudderAccountId;
      const accessToken = event.metadata?.secret?.accessToken;
      if (
        event.destination?.Config?.authenticationEnabled !== false &&
        typeof linkedAccountId === 'string' &&
        linkedAccountId.length > 0 &&
        account?.accountDefinition?.authenticationType === MACHINE_OAUTH_AUTH_TYPE &&
        (typeof accessToken !== 'string' || accessToken.length === 0)
      ) {
        refreshResponses.push({
          metadata: [event.metadata],
          destination: event.destination,
          batched: false,
          statusCode: 500,
          error:
            'OAuth token unavailable; if this persists, upgrade rudder-server for machine_oauth support',
          authErrorCategory: REFRESH_TOKEN,
        });
        logger.info(REFRESH_TOKEN, {
          accountId: account.id,
          accountDefinitionName: account.accountDefinitionName,
          destinationId: event.destination.ID,
          destinationDefinitionId: event.destination.DestinationDefinition?.ID,
        });
      } else {
        dispatchEvents.push(event);
      }
    }

    const groups = ServiceSelector.groupByDestinationService(dispatchEvents);
    const resplist = (
      await mapInBatches(groups, async ([integrationService, groupEvents]) => {
        let preparedEvents = groupEvents;
        try {
          const processedEvents = DestinationPreTransformationService.preProcess(
            preparedEvents,
            ctx,
          );
          const timestampCorrectEvents = ControllerUtility.handleTimestampInEvents(processedEvents);
          preparedEvents = await DynamicConfigParser.process(timestampCorrectEvents);
          return await integrationService.doRouterTransformation(
            preparedEvents,
            destination,
            getIntegrationVersion(),
            requestMetadata,
          );
        } catch (error: unknown) {
          const metaTO = integrationService.getTags(
            destination,
            preparedEvents[0]?.metadata?.destinationId,
            preparedEvents[0]?.metadata?.workspaceId,
            tags.FEATURES.ROUTER,
          );
          metaTO.metadatas = preparedEvents.map((ev) => ev.metadata);
          return [
            DestinationPostTransformationService.handleRouterTransformFailureEvents(
              error as Error,
              metaTO,
            ),
          ];
        }
      })
    ).flat();

    ctx.body = { output: [...refreshResponses, ...resplist] };
    ControllerUtility.postProcess(ctx);
    stats.histogram('dest_transform_output_events', refreshResponses.length + resplist.length, {
      destination,
      version: 'v0',
      destVersion: getDestinationVersion(events[0]?.destination?.version),
      ...metaTags,
    });
    return ctx;
  }

  public static batchProcess(ctx: Context) {
    const requestMetadata = MiscService.getRequestMetadata(ctx);
    const routerRequest = ctx.request.body as RouterTransformationRequest;
    const destination = routerRequest.destType;
    const events = routerRequest.input;

    ctx.body = ServiceSelector.groupByDestinationService(events).flatMap(
      ([integrationService, groupEvents]) => {
        try {
          const processedEvents = DestinationPreTransformationService.preProcess(groupEvents, ctx);
          const timestampCorrectEvents = ControllerUtility.handleTimestampInEvents(processedEvents);
          return integrationService.doBatchTransformation(
            timestampCorrectEvents,
            destination,
            getIntegrationVersion(),
            requestMetadata,
          );
        } catch (error: unknown) {
          const metaTO = integrationService.getTags(
            destination,
            groupEvents[0]?.metadata?.destinationId,
            groupEvents[0]?.metadata?.workspaceId,
            tags.FEATURES.BATCH,
          );
          metaTO.metadatas = groupEvents.map((ev) => ev.metadata);
          return [
            DestinationPostTransformationService.handleBatchTransformFailureEvents(
              error as Error,
              metaTO,
            ),
          ];
        }
      },
    );
    ControllerUtility.postProcess(ctx);
    return ctx;
  }
}
