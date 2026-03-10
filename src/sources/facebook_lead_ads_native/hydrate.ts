import { z } from 'zod';
import { BaseError, formatZodError, InstrumentationError } from '@rudderstack/integrations-lib';
import { httpGET } from '../../adapters/network';
import { processAxiosResponse } from '../../adapters/utils/networkUtils';
import {
  SourceHydrationOutput,
  SourceHydrationRequestSchema,
  HydrationBatchItemSchema,
  HydrationSourceSchema,
  HydrationEventSchema,
  SourceHydrationRequest,
} from '../../types/sourceHydration';
import { HTTP_STATUS_CODES } from '../../v0/util/constant';
import { errorResponseHandler } from '../../v0/util/facebookUtils/networkHandler';

// Complete schema
const FacebookLeadAdsHydrationInputSchema = SourceHydrationRequestSchema.extend({
  batch: z.array(
    HydrationBatchItemSchema.extend({
      event: HydrationEventSchema.extend({
        anonymousId: z.string().min(1, 'anonymousId is required'),
        context: z
          .object({
            traits: z.record(z.unknown()).optional(),
          })
          .passthrough()
          .optional(),
      }),
    }),
  ),
  source: HydrationSourceSchema.extend({
    internalSecret: z
      .object({
        pageAccessToken: z.string().min(1, 'Page access token is required'),
      })
      .passthrough(),
  }),
});

interface FacebookSuccessResponse {
  field_data?: {
    name: string;
    values: string[];
  }[];
}

type APIResponse = {
  statusCode: number;
} & ({ data: FacebookSuccessResponse } | { error: string });

const FACEBOOK_GRAPH_API_URL = 'https://graph.facebook.com/v24.0';

/**
 * Fetches lead data from Facebook Graph API for a single lead ID
 * @param leadId - The Facebook lead ID to fetch
 * @param accessToken - Facebook access token
 * @param metadata - Metadata for API call metrics
 * @returns Promise with lead data or error
 */
async function fetchLeadData(
  leadId: string,
  accessToken: string,
  metadata: Record<string, unknown>,
): Promise<APIResponse> {
  const url = `${FACEBOOK_GRAPH_API_URL}/${leadId}`;
  const clientResponse = await httpGET(
    url,
    {
      params: {
        access_token: accessToken,
      },
    },
    {
      sourceType: 'facebook_lead_ads_native',
      feature: 'hydration',
      endpointPath: '/leadId',
      requestMethod: 'GET',
      metadata,
    },
  );

  const processedResponse = processAxiosResponse(clientResponse);

  if (processedResponse.status === HTTP_STATUS_CODES.OK) {
    return {
      data: processedResponse.response,
      statusCode: HTTP_STATUS_CODES.OK,
    };
  }

  // Use Facebook's error handler for proper error classification
  try {
    errorResponseHandler({
      response: processedResponse.response,
      status: processedResponse.status,
    });
  } catch (error: unknown) {
    if (error instanceof BaseError) {
      return {
        statusCode: error.status,
        error: error.message,
      };
    }
    throw new Error(`Unexpected: unknown error type ${error}`);
  }
  // This should never be reached since errorResponseHandler always throws for errors
  throw new Error('Unexpected: errorResponseHandler did not throw for non-OK response');
}

/**
 * Hydrates multiple lead IDs by fetching their data from Facebook in parallel
 * @param input - Object containing batch array and source config
 * @returns Promise with hydration results and overall status code
 */
export async function hydrate(input: SourceHydrationRequest): Promise<SourceHydrationOutput> {
  // Validate input using Zod schema
  const validationResult = FacebookLeadAdsHydrationInputSchema.safeParse(input);

  if (!validationResult.success) {
    throw new InstrumentationError(formatZodError(validationResult.error));
  }

  const { batch, source } = validationResult.data;
  const accessToken = source.internalSecret.pageAccessToken;

  // Fetch all leads in parallel and map results back to jobs
  const results = await Promise.all(
    batch.map(async (job) => {
      const leadgenId = job.event.anonymousId;
      const result = await fetchLeadData(leadgenId, accessToken, {
        sourceId: source.id,
        workspaceId: source.workspaceId,
      });

      const updatedJob: SourceHydrationOutput['batch'][number] = {
        ...job,
        statusCode: result.statusCode,
      };

      // Handle error case - return early
      if ('error' in result) {
        updatedJob.errorMessage = result.error;
        return updatedJob;
      }

      const traits: Record<string, unknown> = {
        ...(job.event.context?.traits || {}),
      };

      // Convert field_data array to traits object
      result.data.field_data?.forEach((field) => {
        if (field.values.length > 0) {
          const [firstValue] = field.values;
          traits[field.name] = firstValue;
        }
      });

      // Return job with updated traits
      updatedJob.event = {
        ...job.event,
        context: {
          ...job.event.context,
          traits,
        },
      };

      return updatedJob;
    }),
  );

  return {
    batch: results,
  };
}
