import { init, parse } from 'es-module-lexer';
import { TransformationsJSEnvironment } from './transformationsJSEnvironment';
import { CredentialInput, LibraryCodeInput } from '../types';

enum TransformationType {
  TRANSFORM_EVENT = 'transformEvent',
  TRANSFORM_BATCH = 'transformBatch',
}

const SUPPORTED_FUNC_NAMES = [
  TransformationType.TRANSFORM_EVENT,
  TransformationType.TRANSFORM_BATCH,
];

type TestEvent = Record<string, unknown>;
type Metadata = Record<string, unknown>;
export type TestEventOutputError = { error: string; metadata: Metadata };
export type TestEventOutput = { transformedEvent: TestEvent; metadata: Metadata };
export type TransformationOutput = (TestEventOutput | TestEventOutputError)[];

interface TransformationCodeRunnerMetadata {
  transformationId?: string;
  workspaceId?: string;
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
  private executionEnvironment?: TransformationsJSEnvironment;

  constructor(
    readonly input: TransformationCodeRunnerInput,
    readonly metadata?: TransformationCodeRunnerMetadata,
  ) {}

  private async initializeExecutionEnvironment() {
    const transformationType = await this.getTransformationType();
    this.executionEnvironment = new TransformationsJSEnvironment(
      {
        code: this.wrapCode(this.input.code, transformationType),
        dependencies: this.input.dependencies.libraries,
        credentials: this.input.dependencies.credentials,
        testMode: this.input.testMode,
      },
      this.metadata,
    );
  }

  private transformationType?: TransformationType;

  private async getTransformationType(): Promise<TransformationType> {
    if (!this.transformationType) {
      try {
        await init;
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const [, exports] = parse(this.input.code);
        this.transformationType = exports.find((exp) =>
          SUPPORTED_FUNC_NAMES.includes(exp.n as TransformationType),
        )?.n as TransformationType;
      } catch (e) {
        throw new Error(`Failed to parse code: ${e}`);
      }
    }
    if (!this.transformationType) {
      throw new Error(`Expected one of ${SUPPORTED_FUNC_NAMES.join(', ')}`);
    }
    return this.transformationType;
  }

  async transform(events: TestEvent[]) {
    if (!this.executionEnvironment) {
      await this.initializeExecutionEnvironment();
    }
    const result = await this.executionEnvironment!.run<TransformationOutput>(
      'transformWrapper',
      [events],
      {
        timeout: 60000,
        promise: true,
      },
    );
    return result;
  }

  async dispose() {
    if (this.executionEnvironment) {
      await this.executionEnvironment.dispose();
    }
  }

  private wrapCode(userCode: string, transformationType?: string): string {
    const commonCode = `${userCode}
    const isObject = (o) => Object.prototype.toString.call(o) === '[object Object]';

    function getMetadata(eventsMetadata, event) {
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
          isTest: eventMetadata.isTest
        };
    }
    `;

    const batchWrapper = `
    export async function transformWrapper(events) {
       let outputEvents = []
       const eventMessages = events.map(event => event.message);
       const eventsMetadata = {};
       events.forEach(ev => {
         eventsMetadata[ev.message.messageId] = ev.metadata;
       });
       
       const metadata = function(event) {
          return getMetadata(eventsMetadata, event);
       }
       
       let transformedEventsBatch;
       try {
         transformedEventsBatch = await transformBatch(eventMessages, metadata);
       } catch (error) {
         outputEvents.push({error: extractStackTrace(error.stack, ["transformBatch"]), metadata: {}});
         return outputEvents;
       }
       if (!Array.isArray(transformedEventsBatch)) {
         outputEvents.push({error: "returned events from transformBatch(event) is not an array", metadata: {}});
         return outputEvents;
       }
       outputEvents = transformedEventsBatch.map(transformedEvent => {
         if (!isObject(transformedEvent)) {
           return{error: "returned event in events array from transformBatch(events) is not an object", metadata: {}};
         }
         return{transformedEvent, metadata: metadata(transformedEvent)};
       })
       return outputEvents;
    }
    `;

    const eventWrapper = `
    export async function transformWrapper(events) {
       let outputEvents = []
       const eventMessages = events.map(event => event.message);
       const eventsMetadata = {};
       events.forEach(ev => {
         eventsMetadata[ev.message.messageId] = ev.metadata;
       });
       
       const metadata = function(event) {
          return getMetadata(eventsMetadata, event);
       }

       await Promise.all(eventMessages.map(async ev => {
            const currMsgId = ev.messageId;
            try{
              let transformedOutput = await transformEvent(ev, metadata);
              // if func returns null/undefined drop event
              if (transformedOutput === null || transformedOutput === undefined){ return;}
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
              return outputEvents.push({error: extractStackTrace(error.stack, ["transformEvent"]), metadata: eventsMetadata[currMsgId] || {}});
            }
       }));
       return outputEvents;
    }
    `;

    return `
    ${commonCode}
    ${transformationType === 'transformBatch' ? batchWrapper : eventWrapper}
    `;
  }
}
