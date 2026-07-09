import get from 'get-value';
import { cloneDeep, isNumber } from 'lodash';
import { InstrumentationError, ConfigurationError } from '@rudderstack/integrations-lib';
import isString from 'lodash/isString';
import type {
  GaecConfig,
  GaecPayload,
  GaecDeliveryRequest,
  GaecRouterRequest,
  ConversionAdjustment,
} from './types';
import { trackMapping } from './config';
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

/** Shape of a single element in the mapping JSON (trackConfig.json). */
interface MappingElement {
  metadata?: {
    type?: string | string[];
  };
  [key: string]: unknown;
}

const isMappingElement = (value: unknown): value is MappingElement =>
  typeof value === 'object' && value !== null;

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === 'object' && value !== null;

const isGaecPayload = (value: unknown): value is GaecPayload =>
  isRecord(value) && Array.isArray(value.conversionAdjustments);

/**
 * This function is helping to update the mappingJson.
 * It is removing the metadata field with type "hashToSha256"
 * @param mapping -> it is the configMapping.json
 * @returns
 */
const updateMappingJson = (mapping: unknown[]): unknown[] => {
  const newMapping: unknown[] = [];
  mapping.forEach((element) => {
    if (
      isMappingElement(element) &&
      get(element, 'metadata.type') &&
      element.metadata?.type?.includes('hashToSha256')
    ) {
      // eslint-disable-next-line no-param-reassign -- intentional in-place mutation: this function's purpose is to rewrite metadata.type
      element.metadata = { ...element.metadata, type: 'toString' };
    }
    newMapping.push(element);
  });
  return newMapping;
};

const responseBuilder = (
  metadata: Record<string, unknown>,
  message: Record<string, unknown>,
  destination: { Config: GaecConfig },
  payload: GaecPayload,
): GaecDeliveryRequest => {
  const { event } = message;
  const { subAccount } = destination.Config;
  let { customerId, loginCustomerId } = destination.Config;

  if (isNumber(customerId)) {
    customerId = customerId.toString();
  }
  if (!isString(customerId)) {
    throw new InstrumentationError('customerId should be a string or number');
  }
  const filteredCustomerId: string = removeHyphens(customerId);

  const accessToken: string = getAccessToken(metadata, 'access_token');
  const headers: GaecDeliveryRequest['headers'] = {
    Authorization: `Bearer ${accessToken}`,
    'Content-Type': JSON_MIME_TYPE,
  };
  const params: GaecDeliveryRequest['params'] = {
    // `event` was validated as a configured conversion name (a string) in processTrackEvent.
    event: typeof event === 'string' ? event : '',
    customerId: filteredCustomerId,
    accessToken,
    loginCustomerId: undefined,
    subAccount,
  };
  if (subAccount) {
    if (!loginCustomerId) {
      throw new ConfigurationError(`loginCustomerId is required as subAccount is true.`);
    }
    if (isNumber(loginCustomerId)) {
      loginCustomerId = loginCustomerId.toString();
    }
    if (!isString(loginCustomerId)) {
      throw new InstrumentationError('loginCustomerId should be a string or number');
    }
    const filteredLoginCustomerId: string = removeHyphens(loginCustomerId);
    params.loginCustomerId = filteredLoginCustomerId;
    headers['login-customer-id'] = filteredLoginCustomerId;
  }

  // `defaultRequestConfig()`'s inferred body/params fields are empty objects, so the typed
  // request is assembled as a literal (spread + override) rather than mutated in place.
  const baseRequest = defaultRequestConfig();
  return {
    ...baseRequest,
    headers,
    params,
    body: { ...baseRequest.body, JSON: payload },
  };
};

const processTrackEvent = (
  metadata: Record<string, unknown>,
  message: Record<string, unknown>,
  destination: { Config: GaecConfig },
): GaecDeliveryRequest => {
  const { Config } = destination;
  const { event } = message;
  const { listOfConversions, adjustmentType } = Config;
  const isConfiguredConversion =
    Array.isArray(listOfConversions) && listOfConversions.some((i) => i.conversions === event);
  if (!event || !isConfiguredConversion) {
    throw new ConfigurationError(
      `Conversion named "${String(event)}" was not specified in the RudderStack destination configuration`,
    );
  }
  const { requireHash } = Config;
  let updatedMapping = cloneDeep(trackMapping);

  if (requireHash === false) {
    updatedMapping = updateMappingJson(updatedMapping);
  }

  // `constructPayload` returns null when nothing in the message is mappable; the guard also
  // narrows its loosely inferred return to the typed payload.
  const payload = constructPayload(message, updatedMapping);
  if (!isGaecPayload(payload)) {
    throw new InstrumentationError('Payload could not be constructed from the message');
  }

  payload.partialFailure = true;
  if (!payload.conversionAdjustments[0]?.userIdentifiers) {
    throw new InstrumentationError(
      `Any of email, phone, firstName, lastName, city, street, countryCode, postalCode or streetAddress is required in traits.`,
    );
  }
  const firstAdjustment: ConversionAdjustment = payload.conversionAdjustments[0];
  firstAdjustment.adjustmentType = ADJUSTMENT_TYPE_ENHANCEMENT;
  // Removing the null values from userIdentifier
  // (truthiness guard rather than `!== undefined`: the vendored src/util/lodash-es-core.js
  // declares a global `undefined`, which disables `!== undefined` narrowing project-wide)
  const arr = firstAdjustment.userIdentifiers;
  if (arr) {
    firstAdjustment.userIdentifiers = arr.filter((item) => !!item);
  }

  // `isFeatureEnabled` treats a flag value of 'ALL' as enabled regardless of workspaceId,
  // so a missing/non-string workspaceId is passed as '' rather than short-circuiting to false.
  const { workspaceId } = metadata;
  if (
    isFeatureEnabled(
      'DEST_GAEC_ADJUSTMENT_TYPE_SUPPORTED_WORKSPACE_IDS',
      typeof workspaceId === 'string' ? workspaceId : '',
    ) &&
    adjustmentType &&
    adjustmentType === ADJUSTMENT_TYPE_RESTATEMENT
  ) {
    firstAdjustment.adjustmentType = ADJUSTMENT_TYPE_RESTATEMENT;
    delete firstAdjustment.userIdentifiers;
    delete firstAdjustment.userAgent;
  }
  return responseBuilder(metadata, message, destination, payload);
};

const processEvent = (
  metadata: Record<string, unknown>,
  message: Record<string, unknown>,
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

const isGaecDestination = (value: unknown): value is { Config: GaecConfig } =>
  isRecord(value) && isRecord(value.Config);

// `event` arrives loosely typed from the Zod passthrough in routerTransform.ts; narrow its
// fields with type guards before handing them to the strictly typed processEvent.
const process = (event: Record<string, unknown>): GaecDeliveryRequest => {
  const { metadata, message, destination } = event;
  if (!isRecord(metadata) || !isRecord(message) || !isGaecDestination(destination)) {
    throw new InstrumentationError(
      'Invalid event. metadata, message and destination must be objects',
    );
  }
  return processEvent(metadata, message, destination);
};

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
