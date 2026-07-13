import { isNumber } from 'lodash';
import { InstrumentationError, ConfigurationError } from '@rudderstack/integrations-lib';
import isString from 'lodash/isString';
import type {
  GaecConfig,
  GaecPayload,
  GaecDeliveryRequest,
  GaecInputMessage,
  GaecProcessInput,
  GaecRouterRequest,
  ConversionAdjustment,
} from './types';
import { trackMapping } from './config';
import { processUserIdentifiers } from './utils';
import type { Metadata } from '../../../types';
import type { RouterTransformationResponse } from '../../../types/destinationTransformation';
import {
  constructPayload,
  defaultRequestConfig,
  removeHyphens,
  simpleProcessRouterDest,
  getAccessToken,
} from '../../util';
import { JSON_MIME_TYPE } from '../../util/constant';
import { isFeatureEnabled } from '../../../util/featureFlags';

const ADJUSTMENT_TYPE_ENHANCEMENT = 'ENHANCEMENT';
const ADJUSTMENT_TYPE_RESTATEMENT = 'RESTATEMENT';

const MISSING_IDENTIFIERS_ERROR =
  'Any of email, phone, firstName, lastName, city, street, countryCode, postalCode or streetAddress is required in traits.';

const responseBuilder = (
  metadata: Metadata,
  message: GaecInputMessage,
  destination: { Config: GaecConfig; [key: string]: unknown },
  payload: GaecPayload,
): GaecDeliveryRequest => {
  // typed at construction: the builder starts from empty slots and is mutated in place
  // into the full request shape below, exactly like the original JS
  const deliveryRequest: GaecDeliveryRequest = defaultRequestConfig();
  const { event } = message;
  const { subAccount } = destination.Config;
  let { customerId, loginCustomerId } = destination.Config;

  if (isNumber(customerId)) {
    customerId = customerId.toString();
  }
  if (!isString(customerId)) {
    throw new InstrumentationError('customerId should be a string or number');
  }
  const filteredCustomerId = removeHyphens(customerId);

  deliveryRequest.body.JSON = payload;
  const accessToken = getAccessToken(metadata, 'access_token');
  deliveryRequest.headers = {
    Authorization: `Bearer ${accessToken}`,
    'Content-Type': JSON_MIME_TYPE,
  };
  const filteredLoginCustomerId = removeHyphens(loginCustomerId);
  deliveryRequest.params = {
    event,
    customerId: filteredCustomerId,
    accessToken,
    loginCustomerId: filteredLoginCustomerId,
    subAccount,
  };
  if (subAccount) {
    if (!loginCustomerId) {
      throw new ConfigurationError(`loginCustomerId is required as subAccount is true.`);
    }
    if (isNumber(loginCustomerId)) {
      loginCustomerId = loginCustomerId.toString();
    }
    if (loginCustomerId && !isString(loginCustomerId)) {
      throw new InstrumentationError('loginCustomerId should be a string or number');
    }
    deliveryRequest.headers['login-customer-id'] = filteredLoginCustomerId;
  }

  return deliveryRequest;
};

const processTrackEvent = (
  metadata: Metadata,
  message: GaecInputMessage,
  destination: { Config: GaecConfig; [key: string]: unknown },
): GaecDeliveryRequest => {
  const { Config, ID } = destination;
  const { event } = message;
  const { listOfConversions, adjustmentType, requireHash } = Config;
  const isConfiguredConversion =
    Array.isArray(listOfConversions) && listOfConversions.some((i) => i.conversions === event);
  if (event === undefined || event === '' || !isConfiguredConversion) {
    throw new ConfigurationError(
      `Conversion named "${String(event)}" was not specified in the RudderStack destination configuration`,
    );
  }

  // `!` mirrors the original JS's implicit non-null trust in `constructPayload`'s return —
  // a null surfaces as a TypeError on the next access, exactly like the original JS.
  // hashToSha256 has been removed from trackConfig.json; the mapping now extracts raw values
  // only (trim). processUserIdentifiers handles normalization, consistency-check, and hashing.
  const payload: GaecPayload = constructPayload(message, trackMapping)!;

  payload.partialFailure = true;
  // `?.` on [0] is a genuine runtime guard: the array may be empty, and the intended
  // failure is this InstrumentationError, not a TypeError
  if (!payload.conversionAdjustments![0]?.userIdentifiers) {
    throw new InstrumentationError(MISSING_IDENTIFIERS_ERROR);
  }
  const firstAdjustment: ConversionAdjustment = payload.conversionAdjustments![0];
  firstAdjustment.adjustmentType = ADJUSTMENT_TYPE_ENHANCEMENT;
  // Removing the null values from userIdentifier
  // (`!` is type-only: the throw above guarantees userIdentifiers is present, and the
  // assignment stays unconditional like the original JS)
  const arr = firstAdjustment.userIdentifiers;
  firstAdjustment.userIdentifiers = arr!.filter((item) => !!item);

  const isRestatement =
    isFeatureEnabled('DEST_GAEC_ADJUSTMENT_TYPE_SUPPORTED_WORKSPACE_IDS', metadata.workspaceId) &&
    adjustmentType &&
    adjustmentType === ADJUSTMENT_TYPE_RESTATEMENT;

  if (isRestatement) {
    firstAdjustment.adjustmentType = ADJUSTMENT_TYPE_RESTATEMENT;
    delete firstAdjustment.userIdentifiers;
    delete firstAdjustment.userAgent;
  } else {
    // Run processUserIdentifiers ONLY when identifiers will actually be sent.
    // Restatement events delete userIdentifiers — running the hash pipeline on them
    // would throw spurious hash-inconsistency errors.
    // `destinationId` for metric labels: v0 destination objects carry uppercase `ID`
    // (same field GARL reads); it comes through the index signature as unknown, so a
    // string guard + '' fallback is needed
    const destinationId = typeof ID === 'string' ? ID : '';
    processUserIdentifiers(payload, {
      requireHash,
      workspaceId: metadata.workspaceId,
      destinationId,
    });

    // After pruning, re-check: processUserIdentifiers may have dropped all identifiers
    // (e.g. all were invalid), leaving userIdentifiers empty.
    if (!firstAdjustment.userIdentifiers || firstAdjustment.userIdentifiers.length === 0) {
      throw new InstrumentationError(MISSING_IDENTIFIERS_ERROR);
    }
  }

  return responseBuilder(metadata, message, destination, payload);
};

const processEvent = (
  metadata: Metadata,
  message: GaecInputMessage,
  destination: { Config: GaecConfig },
): GaecDeliveryRequest => {
  const { type } = message;
  if (!type) {
    throw new InstrumentationError('Invalid payload. Message Type is not present');
  }
  if (typeof type !== 'string' || type.toLowerCase() !== 'track') {
    throw new InstrumentationError(
      `Message Type ${String(type)} is not supported. Aborting message.`,
    );
  }
  return processTrackEvent(metadata, message, destination);
};

// `metadata`/`destination` are statically optional on the envelope (the router-input
// schema only validates `message`); `!` mirrors the original JS delegate's implicit trust.
const process = (event: GaecProcessInput): GaecDeliveryRequest =>
  processEvent(event.metadata!, event.message, event.destination!);

const processRouterDest = async (
  inputs: GaecRouterRequest[],
  reqMetadata: NonNullable<unknown>,
): Promise<RouterTransformationResponse[]> => {
  // `simpleProcessRouterDest`'s inferred return is untyped; annotation at the boundary. The
  // 4th arg (processParams) is unused by GAEC's per-event `process`; passed explicitly to
  // satisfy the imported signature.
  const respList: RouterTransformationResponse[] = await simpleProcessRouterDest(
    inputs,
    process,
    reqMetadata,
    undefined,
  );
  return respList;
};

export { process, processRouterDest };
