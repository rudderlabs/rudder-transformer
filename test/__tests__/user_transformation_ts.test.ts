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
});
