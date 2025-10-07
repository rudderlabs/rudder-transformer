import { z } from 'zod';
import { Destination, RouterTransformationRequestData, RudderMessage } from '../../../../types';

export const RedditDestinationConfigSchema = z
  .object({
    rudderAccountId: z.string(),
    accountId: z.string(),
    eventsMapping: z.array(
      z.object({
        from: z.string(),
        to: z.enum([
          'ViewContent',
          'Search',
          'AddToCart',
          'AddToWishlist',
          'Purchase',
          'SignUp',
          'Lead',
          'PageVisit',
        ]),
      }),
    ),
    hashData: z.boolean().optional().default(true),
    version: z.enum(['v2', 'v3']).optional().default('v2'),
  })
  .passthrough();

export const RedditMetadataSchema = z.object({
  secret: z.object({
    accessToken: z.string(),
  }),
});

export type RedditDestinationConfig = z.infer<typeof RedditDestinationConfigSchema>;
export type RedditMetadata = z.infer<typeof RedditMetadataSchema>;
export type RedditDestination = Destination<RedditDestinationConfig>;
export type RedditRouterRequest = RouterTransformationRequestData<
  RudderMessage,
  RedditDestination,
  undefined,
  RedditMetadata
>;
