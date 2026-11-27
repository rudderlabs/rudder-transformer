import fetch from 'node-fetch';
import { UserTransformService } from '../../src/services/userTransform';
import { FeatureFlags, FEATURE_FILTER_CODE } from '../../src/middlewares/featureFlag';
jest.mock('node-fetch', () => jest.fn());

const integration = 'user_transformation_service';
const name = 'User Transformations';
const randomID = () => Math.random().toString(36).substring(2, 15);

describe('User Transform Service', () => {
  it(`Filtering ${name} Test`, async () => {
    const versionId = '24'; // set in input file
    const inputData = require(`./data/${integration}_filter_input.json`);
    const expectedData = require(`./data/${integration}_filter_output.json`);

    const respBody = {
      codeVersion: '1',
      name,
      versionId: versionId,
      code: `export async function transformEvent(event, metadata) {
                const eventType = event.type;
                log(eventType);
                log(eventType.match(/track/g));
                if(eventType === 'non-standard') throw new Error('non-standard event');
                if(eventType && !eventType.match(/track/g)) return;
                return event;
              }
            `,
    };
    (fetch as jest.MockedFunction<typeof fetch>).mockResolvedValue({
      status: 200,
      json: jest.fn().mockResolvedValue(respBody),
    });
    const output = await UserTransformService.transformRoutine(inputData, {
      [FEATURE_FILTER_CODE]: true,
    } as FeatureFlags);
    expect(fetch).toHaveBeenCalledWith(
      `https://api.rudderlabs.com/transformation/getByVersionId?versionId=${versionId}`,
    );

    expect(output).toEqual(expectedData);
  });

  it('executes a codeVersion 1 fail-open catch with the sandbox log function', async () => {
    const [inputEvent] = require(`./data/${integration}_filter_input.json`);
    const codeRevision = {
      codeVersion: '1',
      name,
      code: `export async function transformEvent(event) {
                try {
                  throw new Error('Jev unavailable');
                } catch (error) {
                  log('Jev classification failed:', error.message);
                  return event;
                }
              }
            `,
    };

    const output = await UserTransformService.testTransformRoutine(
      [inputEvent],
      codeRevision,
      [],
      [],
      true,
    );

    expect(output).toEqual({
      status: 200,
      body: {
        transformedEvents: [
          {
            transformedEvent: inputEvent.message,
            metadata: inputEvent.metadata,
          },
        ],
        logs: ['Log: Jev classification failed: Jev unavailable'],
      },
    });
  });
  // A 400 per event, not a retryable status: rudder-server would otherwise retry the batch forever.
  it('answers a batch whose events name different workspaces with a 400 per event and no lookup', async () => {
    (fetch as jest.MockedFunction<typeof fetch>).mockClear();
    const event = (messageId: string, workspaceId: string) => ({
      message: { messageId, type: 'track', event: 'e' },
      metadata: { messageId, workspaceId, sourceId: 'src', destinationId: 'dst' },
      destination: { Transformations: [{ VersionID: 'mixed-workspaces-version' }] },
    });

    const output = await UserTransformService.transformRoutine([
      event('m1', 'workspace-a'),
      event('m2', 'workspace-b'),
    ] as any);

    expect(output.retryStatus).toBe(200);
    expect(
      output.transformedEvents.map(({ statusCode, error }) => ({ statusCode, error })),
    ).toEqual([
      { statusCode: 400, error: 'Error: Events in a batch must belong to a single workspace' },
      { statusCode: 400, error: 'Error: Events in a batch must belong to a single workspace' },
    ]);
    expect(fetch).not.toHaveBeenCalled();
  });
});
