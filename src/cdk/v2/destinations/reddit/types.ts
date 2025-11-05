import { z } from 'zod';
import { Destination, RouterTransformationRequestData, RudderMessage } from '../../../../types';

// All the types are based on the following documentation:
// https://ads-api.reddit.com/docs/v3/operations/Post%20Conversion%20Events

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

// Reddit API v3 Conversion Events Schema
export const RedditUserDataSchema = z.object({
  email: z.string().optional(),
  external_id: z.string().optional(),
  ip_address: z.string().optional(),
  phone_number: z.string().optional(),
  user_agent: z.string().optional(),
  aaid: z.string().optional(),
  idfa: z.string().optional(),
  uuid: z.string().optional(),
  data_processing_options: z
    .object({
      country: z.string().optional(),
      region: z.string().optional(),
      modes: z.array(z.enum(['LDU'])).optional(),
    })
    .optional(),
  screen_dimensions: z
    .object({
      width: z.number().optional(),
      height: z.number().optional(),
    })
    .optional(),
});

export const RedditProductSchema = z.object({
  category: z.string().optional(),
  id: z.string().optional(),
  name: z.string().optional(),
});

export const RedditEventMetadataSchema = z.object({
  conversion_id: z.string().optional(),
  currency: z.string().optional(),
  item_count: z.number().optional(),
  value: z.number().optional(),
  products: z.array(RedditProductSchema).optional(),
});

export const RedditEventTypeSchema = z.discriminatedUnion('tracking_type', [
  z.object({
    tracking_type: z.literal('CUSTOM'),
    custom_event_name: z.string(),
  }),
  z.object({
    tracking_type: z.enum([
      'PAGE_VISIT',
      'VIEW_CONTENT',
      'SEARCH',
      'ADD_TO_CART',
      'ADD_TO_WISHLIST',
      'LEAD',
      'PURCHASE',
      'SIGN_UP',
    ]),
  }),
]);

export const RedditConversionEventSchema = z.object({
  click_id: z.string().optional(),
  event_at: z.number(),
  action_source: z.enum(['WEBSITE']),
  user: RedditUserDataSchema.optional(),
  type: RedditEventTypeSchema,
  metadata: RedditEventMetadataSchema.optional(),
});

export const RedditConversionEventsPayloadSchema = z.object({
  data: z.object({
    test_id: z.string().optional(),
    events: z.array(RedditConversionEventSchema),
  }),
});

export const RedditResponseSchema = z.object({
  version: z.string(),
  type: z.string(),
  method: z.string(),
  endpoint: z.string(),
  headers: z.object({
    'Content-Type': z.string(),
    Authorization: z.string(),
  }),
  body: z.object({
    JSON: RedditConversionEventsPayloadSchema,
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
export type RedditEventType = z.infer<typeof RedditEventTypeSchema>;
export type RedditProductType = z.infer<typeof RedditProductSchema>;
export type RedditEventMetadata = z.infer<typeof RedditEventMetadataSchema>;
export type RedditConversionEventsPayload = z.infer<typeof RedditConversionEventsPayloadSchema>;
export type RedditUserData = z.infer<typeof RedditUserDataSchema>;
export type RedditConversionEvent = z.infer<typeof RedditConversionEventSchema>;
export type RedditResponse = z.infer<typeof RedditResponseSchema>;

// Interfaces for RudderMessage properties structure
export interface ProductProperties {
  product_id?: string;
  name?: string;
  category?: string;
}

export interface EventProperties {
  products?: ProductProperties[];
  product_id?: string;
  name?: string;
  category?: string;
}
