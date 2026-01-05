import { SUPPORTED_FUNC_NAMES } from '../../util/ivmFactory';
import { JavascriptRunner } from './javascriptRunner';
import stats from '../../util/stats';
import { CredentialInput, LibraryCodeInput } from '../types';

interface TransformationCodeRunnerMetadata {
  transformationId: string;
  workspaceId: string;
}

interface TransformationCodeRunnerInput {
  code: string;
  dependencies: {
    libraries: LibraryCodeInput[];
    credentials: CredentialInput[];
  };
  testMode: boolean;
}
export class TransformationJavascriptRunner {
  private runner: JavascriptRunner;

  constructor(
    readonly input: TransformationCodeRunnerInput,
    readonly metadata: TransformationCodeRunnerMetadata,
  ) {
    this.runner = new JavascriptRunner(
      {
        code: this.wrapCode(this.input.code),
        dependencies: this.input.dependencies.libraries,
        credentials: this.input.dependencies.credentials,
        testMode: this.input.testMode,
      },
      metadata,
    );
  }

  async init() {
    await this.runner.init();
  }

  async transform(events: any[]) {
    const start = Date.now();
    const exportedFuncNames = await this.runner.engine.listExportsFromModule('main');
    const transformationType = exportedFuncNames.find((funcName) =>
      SUPPORTED_FUNC_NAMES.includes(funcName),
    );
    if (!transformationType) {
      throw new Error(
        `Expected one of ${SUPPORTED_FUNC_NAMES}. Found ${exportedFuncNames.join(', ')}`,
      );
    }
    const payload = {
      events,
      transformationType,
    };
    const result = await this.runner.run('transformWrapper', [payload], {
      timeout: 1000,
      promise: true,
    });
    stats.timing('transformation_execution_duration', start, { ...this.metadata });
    return result;
  }

  async dispose() {
    await this.runner.dispose();
  }

  private wrapCode(userCode: string, testMode = false): string {
    return `${userCode}
    export async function transformWrapper(transformationPayload) {
      let events = transformationPayload.events
      let transformType = transformationPayload.transformationType
      let outputEvents = []
      const eventMessages = events.map(event => event.message);
      const eventsMetadata = {};
      events.forEach(ev => {
        eventsMetadata[ev.message.messageId] = ev.metadata;
      });

      const isObject = (o) => Object.prototype.toString.call(o) === '[object Object]';

      var metadata = function(event) {
        const eventMetadata = event ? eventsMetadata[event.messageId] || {} : {};
        return {
          sourceId: eventMetadata.sourceId,
          sourceName: eventMetadata.sourceName,
          workspaceId: eventMetadata.workspaceId,
          sourceType: eventMetadata.sourceType,
          sourceCategory: eventMetadata.sourceCategory,
          destinationId: eventMetadata.destinationId,
          destinationType: eventMetadata.destinationType,
          destinationName: eventMetadata.destinationName,

          namespace: eventMetadata.namespace,
          originalSourceId: eventMetadata.originalSourceId,
          trackingPlanId: eventMetadata.trackingPlanId,
          trackingPlanVersion: eventMetadata.trackingPlanVersion,
          sourceTpConfig: eventMetadata.sourceTpConfig,
          mergedTpConfig: eventMetadata.mergedTpConfig,
          jobId: eventMetadata.jobId,
          sourceJobId: eventMetadata.sourceJobId,
          sourceJobRunId: eventMetadata.sourceJobRunId,
          sourceTaskRunId: eventMetadata.sourceTaskRunId,
          recordId: eventMetadata.recordId,
          messageId: eventMetadata.messageId,
          messageIds: eventMetadata.messageIds,
          rudderId: eventMetadata.rudderId,
          receivedAt: eventMetadata.receivedAt,
          eventName: eventMetadata.eventName,
          eventType: eventMetadata.eventType,
          sourceDefinitionId: eventMetadata.sourceDefinitionId,
          destinationDefinitionId: eventMetadata.destinationDefinitionId,
          transformationId: eventMetadata.transformationId,
          transformationVersionId: eventMetadata.transformationVersionId,
          isTest: ${testMode},
        };
      }
      switch(transformType) {
        case "transformBatch":
          let transformedEventsBatch;
          try {
            transformedEventsBatch = await transformBatch(eventMessages, metadata);
          } catch (error) {
            outputEvents.push({error: extractStackTrace(error.stack, [transformType]), metadata: {}});
            return outputEvents;
          }
          if (!Array.isArray(transformedEventsBatch)) {
            outputEvents.push({error: "returned events from transformBatch(event) is not an array", metadata: {}});
            break;
          }
          outputEvents = transformedEventsBatch.map(transformedEvent => {
            if (!isObject(transformedEvent)) {
              return{error: "returned event in events array from transformBatch(events) is not an object", metadata: {}};
            }
            return{transformedEvent, metadata: metadata(transformedEvent)};
          })
          break;
        case "transformEvent":
          await Promise.all(eventMessages.map(async ev => {
            const currMsgId = ev.messageId;
            try{
              let transformedOutput = await transformEvent(ev, metadata);
              // if func returns null/undefined drop event
              if (transformedOutput === null || transformedOutput === undefined) return;
              if (Array.isArray(transformedOutput)) {
                const producedEvents = [];
                const encounteredError = !transformedOutput.every(e => {
                  if (isObject(e)) {
                    producedEvents.push({transformedEvent: e, metadata: eventsMetadata[currMsgId] || {}});
                    return true;
                  } else {
                    outputEvents.push({error: "returned event in events array from transformEvent(event) is not an object", metadata: eventsMetadata[currMsgId] || {}});
                    return false;
                  }
                })
                if (!encounteredError) {
                  outputEvents.push(...producedEvents);
                }
                return;
              }
              if (!isObject(transformedOutput)) {
                return outputEvents.push({error: "returned event from transformEvent(event) is not an object", metadata: eventsMetadata[currMsgId] || {}});
              }
              outputEvents.push({transformedEvent: transformedOutput, metadata: eventsMetadata[currMsgId] || {}});
              return;
            } catch (error) {
              // Handling the errors in versionedRouter.js
              return outputEvents.push({error: extractStackTrace(error.stack, [transformType]), metadata: eventsMetadata[currMsgId] || {}});
            }
          }));
          break;
      }
      return outputEvents
    }
    `;
  }
}
