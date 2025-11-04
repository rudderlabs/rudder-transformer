import { z } from 'zod';
import { httpGET } from '../../adapters/network';
import { processAxiosResponse } from '../../adapters/utils/networkUtils';
import { SourceHydrationJob, SourceHydrationResponse } from '../../types';
import { HTTP_STATUS_CODES } from '../../v0/util/constant';

const RequestBodySchema = z
  .object({
    jobs: z.array(
      z
        .object({
          event: z
            .object({
              anonymousId: z.string(),
              context: z
                .object({
                  traits: z.record(z.unknown()).optional(),
                })
                .passthrough()
                .optional(),
            })
            .passthrough(),
        })
        .passthrough(),
    ),
    source: z
      .object({
        config: z
          .object({
            internalSecret: z
              .object({
                pageAccessToken: z.string().min(1, 'Page access token is required'),
              })
              .passthrough(),
          })
          .passthrough(),
      })
      .passthrough(),
  })
  .passthrough();

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
 * @returns Promise with lead data or error
 */
async function fetchLeadData(leadId: string, accessToken: string): Promise<APIResponse> {
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
    },
  );

  const processedResponse = processAxiosResponse(clientResponse);

  if (processedResponse.status === HTTP_STATUS_CODES.OK) {
    return {
      data: processedResponse.response,
      statusCode: HTTP_STATUS_CODES.OK,
    };
  }
  return {
    statusCode: processedResponse.status,
    error: processedResponse.response?.error?.message || 'Unknown error',
  };
}

/**
 * Hydrates multiple lead IDs by fetching their data from Facebook in parallel
 * @param input - Object containing leadIds array and accessToken
 * @returns Promise with hydration results and overall status code
 */
export async function hydrate(input: unknown): Promise<SourceHydrationResponse> {
  // Validate input using Zod schema
  const validationResult = RequestBodySchema.safeParse(input);

  if (!validationResult.success) {
    return {
      error: validationResult.error || 'Invalid input',
      statusCode: HTTP_STATUS_CODES.BAD_REQUEST,
    };
  }

  const { jobs, source } = validationResult.data;
  const accessToken = source.config.internalSecret.pageAccessToken;

  // Fetch all leads in parallel and map results back to jobs
  const results = await Promise.all(
    jobs.map(async (job) => {
      const leadgenId = job.event.anonymousId;
      const result = await fetchLeadData(leadgenId, accessToken);

      const updatedJob: SourceHydrationJob = {
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
    jobs: results,
  };
}
