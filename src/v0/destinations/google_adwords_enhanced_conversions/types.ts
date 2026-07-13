// Shared types for the google_adwords_enhanced_conversions destination.
// Populated as part of the INT-6744 JS -> TS migration.

import type { Destination, Metadata, RudderMessage } from '../../../types';
import type { RouterTransformationRequestData } from '../../../types/destinationTransformation';

/**
 * Runtime configuration for the GAEC destination, sourced from the RudderStack
 * control-plane. All scalar fields may arrive as string or number because the
 * control-plane serialises some numeric IDs as numbers.
 */
export interface GaecConfig {
  // Omitted by most control-plane configs; missing means "hash" (only explicit false disables it)
  requireHash?: boolean;
  customerId: string | number;
  loginCustomerId?: string | number;
  subAccount?: boolean;
  listOfConversions: Array<{ conversions: string }>;
  adjustmentType?: string;
}

/** Typed Destination for GAEC. */
export type GaecDestination = Destination<GaecConfig>;

/** The router-transform input envelope the framework sends for each event. */
export type GaecRouterRequest = RouterTransformationRequestData<
  RudderMessage,
  GaecDestination,
  undefined,
  Metadata
>;

/**
 * Minimal message shape the GAEC transform reads. Satisfied by both `RudderMessage`
 * (`type` is the MessageType literal union) and the router path's Zod-validated
 * message (`type` is a refined plain string).
 */
export interface GaecInputMessage {
  type?: string;
  event?: string;
  [key: string]: unknown;
}

/**
 * The envelope `process` receives. The router-input schema (routerTransform.ts) only
 * validates `message` and passes the rest of the envelope through unvalidated, so
 * `metadata` and `destination` are runtime-present but statically optional — accesses
 * use `!`, mirroring the original JS delegate's implicit trust.
 */
export interface GaecProcessInput {
  metadata?: Metadata;
  message: GaecInputMessage;
  destination?: { Config: GaecConfig };
}

/** Address component nested inside a UserIdentifier. */
export interface AddressInfo {
  hashedFirstName?: string;
  hashedLastName?: string;
  hashedStreetAddress?: string;
  city?: string;
  state?: string;
  postalCode?: string;
  countryCode?: string;
  [key: string]: unknown;
}

/** A single user-identifier entry produced by the mapping. */
export interface UserIdentifierEntry {
  hashedEmail?: string;
  hashedPhoneNumber?: string;
  addressInfo?: AddressInfo;
  [key: string]: unknown;
}

/**
 * A single conversion-adjustment object as expected by the Google Ads API.
 * Index signature is present so the object is assignable to the framework's
 * `Record<string, unknown>` without widening.
 */
export interface ConversionAdjustment {
  adjustmentType?: string;
  orderId?: string;
  adjustmentDateTime?: string;
  conversionAction?: string;
  userAgent?: string;
  userIdentifiers?: Array<UserIdentifierEntry | null>;
  gclidDateTimePair?: { gclid?: string; conversionDateTime?: string };
  restatementValue?: { adjustedValue?: number; currencyCode?: string };
  [key: string]: unknown;
}

/**
 * The payload object produced by `constructPayload` and sent to the Google Ads API.
 * Shape is derived from `trackConfig.json` mapping (every destKey nests under
 * `conversionAdjustments[0]`, so a non-null construction always carries the array).
 * `conversionAdjustments` is optional so the untyped `constructPayload` return and
 * `defaultRequestConfig()`'s empty `JSON` slot assign directly; accesses use `!`
 * (migration guide #6) to mirror the original JS's implicit non-null trust.
 */
export interface GaecPayload {
  conversionAdjustments?: ConversionAdjustment[];
  partialFailure?: boolean;
}

/**
 * The delivery-request object returned by `process` / `responseBuilder`.
 * Defined as a standalone structural type (not extending `ProcessorTransformationOutput`)
 * to avoid body-covariance complaints while still satisfying every field access in
 * `routerTransform.ts`.
 */
export interface GaecDeliveryRequest {
  endpoint: string;
  method: string;
  headers: Record<string, string>;
  // fields are optional so `defaultRequestConfig()`'s empty `params` object is directly
  // assignable and the request can be mutated in place, exactly like the original JS
  params: {
    event?: string;
    customerId?: string;
    accessToken?: string;
    loginCustomerId?: string;
    subAccount?: boolean;
    [key: string]: unknown;
  };
  body: {
    JSON: GaecPayload;
    JSON_ARRAY?: Record<string, unknown>;
    XML?: Record<string, unknown>;
    FORM?: Record<string, unknown>;
    [key: string]: unknown;
  };
  files?: Record<string, unknown>;
  userId?: string;
  version?: string;
  type?: string;
  [key: string]: unknown;
}
