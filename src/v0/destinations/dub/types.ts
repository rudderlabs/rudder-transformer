import { z } from 'zod';

import { Destination, RouterTransformationRequestData, RudderMessage } from '../../../types';

// Refer link for type definition: https://dub.co/docs/api-reference/endpoint/track-lead
export interface TrackLeadRequestBody {
  /**
   * The unique ID of the click that the lead conversion event is attributed to.
   * You can read this value from `dub_id` cookie. If an empty string is provided,
   * Dub will try to find an existing customer with the provided `customerExternalId`
   * and use the `clickId` from the customer if found.
   */
  clickId: string;

  /**
   * The name of the lead event to track. Can also be used as a unique identifier
   * to associate a given lead event for a customer for a subsequent sale event
   * (via the `leadEventName` prop in `/track/sale`).
   * Required string length: 1 - 255
   */
  eventName: string;

  /**
   * The unique ID of the customer in your system. Will be used to identify and
   * attribute all future events to this customer.
   * Required string length: 1 - 100
   */
  customerExternalId: string;

  /**
   * The name of the customer. If not passed, a random name will be generated
   * (e.g. "Big Red Caribou").
   * Maximum length: 100
   */
  customerName?: string | null;

  /**
   * The email address of the customer.
   * Maximum length: 100
   */
  customerEmail?: string | null;

  /**
   * The avatar URL of the customer.
   */
  customerAvatar?: string | null;

  /**
   * The mode to use for tracking the lead event.
   * - `async` will not block the request
   * - `wait` will block the request until the lead event is fully recorded in Dub
   * - `deferred` will defer the lead event creation to a subsequent request
   * Default: async
   */
  mode?: 'async' | 'wait' | 'deferred';

  /**
   * The numerical value associated with this lead event (e.g., number of provisioned
   * seats in a free trial). If defined as N, the lead event will be tracked N times.
   */
  eventQuantity?: number | null;

  /**
   * Additional metadata to be stored with the lead event.
   * Max 10,000 characters.
   */
  metadata?: Record<string, unknown> | null;
}

export interface TrackLeadResponse {
  click: {
    id: string;
  };
  customer: {
    name: string;
    email: string;
    avatar: string;
    externalId: string;
  };
}
// Refer link for type definition: https://dub.co/docs/api-reference/endpoint/track-sale
export interface TrackSaleRequestBody {
  /**
   * The unique ID of the customer in your system. Will be used to identify and
   * attribute all future events to this customer.
   * Required string length: 1 - 100
   */
  customerExternalId: string;

  /**
   * The amount of the sale in cents (for all two-decimal currencies).
   * If the sale is in a zero-decimal currency, pass the full integer value (e.g. 1437 JPY).
   * Required range: x >= 0
   */
  amount: number;

  /**
   * The currency of the sale. Accepts ISO 4217 currency codes.
   * Sales will be automatically converted and stored as USD at the latest exchange rates.
   * Default: usd
   */
  currency?: string;

  /**
   * The name of the sale event. Recommended format: "Invoice paid" or "Subscription created".
   * Maximum length: 255
   * Default: Purchase
   */
  eventName?: string;

  /**
   * The payment processor via which the sale was made.
   */
  paymentProcessor?: 'stripe' | 'shopify' | 'polar' | 'paddle' | 'revenuecat' | 'custom';

  /**
   * The invoice ID of the sale. Can be used as a idempotency key –
   * only one sale event can be recorded for a given invoice ID.
   */
  invoiceId?: string | null;

  /**
   * Additional metadata to be stored with the sale event.
   * Max 10,000 characters when stringified.
   */
  metadata?: Record<string, any> | null;

  /**
   * The name of the lead event that occurred before the sale (case-sensitive).
   * This is used to associate the sale event with a particular lead event.
   * For sale tracking without a pre-existing lead event, this field can also be
   * used to specify the lead event name.
   */
  leadEventName?: string | null;

  /**
   * [For sale tracking without a pre-existing lead event]: The unique ID of the
   * click that the sale conversion event is attributed to.
   * You can read this value from `dub_id` cookie.
   */
  clickId?: string | null;

  /**
   * [For sale tracking without a pre-existing lead event]: The name of the customer.
   * If not passed, a random name will be generated (e.g. "Big Red Caribou").
   * Maximum length: 100
   */
  customerName?: string | null;

  /**
   * [For sale tracking without a pre-existing lead event]: The email address of the customer.
   * Maximum length: 100
   */
  customerEmail?: string | null;

  /**
   * [For sale tracking without a pre-existing lead event]: The avatar URL of the customer.
   */
  customerAvatar?: string | null;
}

export interface TrackSaleResponse {
  eventName: string;
  customer: {
    id: string;
    name: string;
    email: string;
    avatar: string;
    externalId: string;
  } | null;
  sale: {
    amount: number;
    currency: string;
    paymentProcessor: string;
    invoiceId: string;
    metadata: Record<string, any>;
  } | null;
}

// DubIO specific configuration types
export const DubIODestinationConfigSchema = z
  .object({
    apiKey: z.string(),
    eventMapping: z.array(
      z.object({
        from: z.string(),
        to: z.enum(['LEAD_CONVERSION', 'SALES_CONVERSION']),
      }),
    ),
    convertAmountToCents: z.boolean().optional().default(true),
  })
  .passthrough();

export type DubIODestinationConfig = z.infer<typeof DubIODestinationConfigSchema>;
export type DubIODestination = Destination<DubIODestinationConfig>;
export type DubIORouterRequest = RouterTransformationRequestData<RudderMessage, DubIODestination>;
