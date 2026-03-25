import { InstrumentationError, ConfigurationError } from '@rudderstack/integrations-lib';
import { processAudienceRecord } from '../../../util/audienceUtils';
import {
  isDefinedAndNotNullAndNotEmpty,
  constructPayload,
  defaultRequestConfig,
  removeHyphens,
  removeUndefinedAndNullValues,
} from '../../../util';
import { JSON_MIME_TYPE } from '../../../util/constant';
import logger from '../../../../logger';
import { GARL_FIELD_CONFIG } from '../util';
import { TYPEOFLIST, consentConfigMap, destType } from '../config';
import { populateConsentFromConfig } from '../../../util/googleUtils';
import { DATA_MANAGER_DEFAULT_ACCOUNT_TYPE, dmUserIdentifierMapping } from './config';
import type {
  AudienceMember,
  Consent,
  ConsentStatus,
  AddressInfo,
  UserIdentifier,
  DataManagerDestination,
  GARLIngestAPIPayload,
  GARLRemoveAPIPayload,
  GARLBatchRequest,
} from './types';
import type { GARLDestinationConfig } from '../types';

type MappedUserIdentifier = {
  emailAddress?: string;
  phoneNumber?: string;
  addressInfo?: Partial<AddressInfo>;
};

interface AudienceDestinationContext {
  workspaceId: string;
  destinationId: string;
  isHashRequired: boolean;
}

const ADDRESS_SCHEMA_FIELDS = ['firstName', 'lastName', 'country', 'postalCode'];

// Mapping from GoogleUtils consent values (GRANTED/DENIED) to DM API values
const CONSENT_VALUE_MAP: Partial<Record<string, ConsentStatus>> = {
  GRANTED: 'CONSENT_GRANTED',
  DENIED: 'CONSENT_DENIED',
};

const mapConsentValue = (value: string | undefined): ConsentStatus =>
  CONSENT_VALUE_MAP[value ?? ''] ?? 'CONSENT_STATUS_UNSPECIFIED';

/**
 * Converts a consent object from the GoogleUtils format (GRANTED/DENIED)
 * to the DM API format (CONSENT_GRANTED/CONSENT_DENIED).
 */
export const buildConsent = (consentObj: Record<string, string>): Consent => ({
  adUserData: mapConsentValue(consentObj.adUserData),
  adPersonalization: mapConsentValue(consentObj.adPersonalization),
});

/**
 * Filters processed fields down to only those permitted by userSchema.
 * - Named fields (e.g. 'email', 'phone') must be listed in userSchema.
 * - Address sub-fields (firstName, lastName, country, postalCode) are included
 *   when userSchema contains 'addressInfo' or any individual address field name.
 */
const filterFieldsBySchema = (
  fields: Record<string, unknown>,
  userSchema: string[] | undefined,
): Record<string, unknown> => {
  if (!userSchema) return fields;

  const needsAddress =
    userSchema.includes('addressInfo') || userSchema.some((s) => ADDRESS_SCHEMA_FIELDS.includes(s));

  return Object.fromEntries(
    Object.entries(fields).filter(
      ([k]) => userSchema.includes(k) || (needsAddress && ADDRESS_SCHEMA_FIELDS.includes(k)),
    ),
  );
};

/**
 * Builds an AudienceMember from already-processed (normalized/hashed) fields.
 * Returns null if no valid identifier can be constructed.
 *
 * - mobileDeviceID list: mobileId  → mobileData.mobileIds[]
 * - userID list:         thirdPartyUserId → userIdData.userId
 * - General list:        uses userIdentifier.json mapping via constructPayload to build
 *                        userData.userIdentifiers[] (email, phone, addressInfo).
 *                        AddressInfo requires all four fields; omitted if any is missing.
 */
export const buildAudienceMemberFromProcessedFields = (
  fields: Record<string, unknown>,
  typeOfList: string,
  userSchema: string[] | undefined,
  memberConsent?: Consent,
): AudienceMember | null => {
  const member: AudienceMember = {};

  if (typeOfList === 'mobileDeviceID') {
    const mobileId = fields[TYPEOFLIST.mobileDeviceID];
    if (!mobileId) return null;
    member.mobileData = { mobileIds: [String(mobileId)] };
  } else if (typeOfList === 'userID') {
    const userId = fields[TYPEOFLIST.userID];
    if (!userId) return null;
    member.userIdData = { userId: String(userId) };
  } else {
    // General list — use mapping JSON to build userData.userIdentifiers[]
    const schemaFields = filterFieldsBySchema(fields, userSchema);
    const mapped = constructPayload(
      schemaFields,
      dmUserIdentifierMapping,
    ) as MappedUserIdentifier | null;

    const userIdentifiers: UserIdentifier[] = [];

    if (mapped?.emailAddress) {
      userIdentifiers.push({ emailAddress: mapped.emailAddress });
    }
    if (mapped?.phoneNumber) {
      userIdentifiers.push({ phoneNumber: mapped.phoneNumber });
    }
    if (mapped?.addressInfo) {
      // AddressInfo requires all 4 fields per Google DM API spec
      const { givenName, familyName, regionCode, postalCode } = mapped.addressInfo;
      if (givenName && familyName && regionCode && postalCode) {
        userIdentifiers.push({ addressInfo: { givenName, familyName, regionCode, postalCode } });
      }
    }

    if (userIdentifiers.length === 0) return null;
    member.userData = { userIdentifiers };
  }

  if (memberConsent) {
    member.consent = memberConsent;
  }

  return member;
};

/**
 * Processes a single raw record through normalization/validation/hashing
 * and maps it to an AudienceMember for the DM API.
 *
 * Returns `{ member }` on success or `{ error }` on failure.
 */
export const buildAudienceMember = (
  rawRecord: Record<string, unknown>,
  typeOfList: string,
  userSchema: string[] | undefined,
  ctx: AudienceDestinationContext,
  memberConsent?: Consent,
): { member: AudienceMember } | { error: Error } => {
  const { workspaceId, destinationId, isHashRequired } = ctx;

  let processedFields: Record<string, unknown>;
  try {
    processedFields = processAudienceRecord(rawRecord, {
      fieldConfigs: GARL_FIELD_CONFIG,
      destination: {
        workspaceId,
        id: destinationId,
        type: destType,
        config: { isHashRequired },
      },
    });
  } catch (e) {
    return { error: e instanceof Error ? e : new Error(String(e)) };
  }

  const member = buildAudienceMemberFromProcessedFields(
    processedFields,
    typeOfList,
    userSchema,
    memberConsent,
  );

  if (!member) {
    return { error: new InstrumentationError('Event has no valid identifiers') };
  }

  return { member };
};

/**
 * Processes a raw array (from listData.add or listData.remove) into AudienceMember[].
 * Elements that produce no valid identifiers are skipped with a log warning.
 * Used for audiencelist events where per-element error reporting isn't available.
 */
export const buildAudienceMembersFromListData = (
  attributeArray: Record<string, unknown>[],
  typeOfList: string,
  userSchema: string[] | undefined,
  ctx: AudienceDestinationContext,
  memberConsent?: Consent,
): AudienceMember[] => {
  if (!isDefinedAndNotNullAndNotEmpty(attributeArray)) return [];

  const members: AudienceMember[] = [];
  attributeArray.forEach((rawElement, index) => {
    const result = buildAudienceMember(rawElement, typeOfList, userSchema, ctx, memberConsent);
    if ('error' in result) {
      logger.info(`[GARL DM API] Skipping element at index ${index}`);
    } else {
      members.push(result.member);
    }
  });

  return members;
};

/**
 * Resolves member-level consent from destination config using populateConsentFromConfig.
 */
export const buildMemberConsentFromConfig = (
  config: GARLDestinationConfig,
): Consent | undefined => {
  const raw = populateConsentFromConfig(config, consentConfigMap) as
    | Record<string, string>
    | undefined;
  return raw ? buildConsent(raw) : undefined;
};

/**
 * Builds the DM API Destination object.
 * operatingAccount — the account that owns the audience (always required).
 * loginAccount     — the manager/sub-account used to access it (required when subAccount=true).
 * productDestinationId — the audience ID within the operating account.
 *
 * Ref: https://developers.google.com/data-manager/api/devguides/concepts/destinations
 */
export const buildDataManagerDestination = (
  Config: GARLDestinationConfig,
  audienceId: string,
): DataManagerDestination => {
  if (!isDefinedAndNotNullAndNotEmpty(audienceId)) {
    throw new ConfigurationError('Audience ID is a mandatory field');
  }

  const dest: DataManagerDestination = {
    operatingAccount: {
      accountId: removeHyphens(Config.customerId),
      accountType: DATA_MANAGER_DEFAULT_ACCOUNT_TYPE,
    },
    productDestinationId: audienceId,
  };

  if (Config.subAccount) {
    if (!Config.loginCustomerId) {
      throw new ConfigurationError('loginCustomerId is required as subAccount is true.');
    }
    dest.loginAccount = {
      accountId: removeHyphens(Config.loginCustomerId),
      accountType: DATA_MANAGER_DEFAULT_ACCOUNT_TYPE,
    };
  }

  return dest;
};

/**
 * Builds the HTTP headers for a DM API request.
 * Includes Authorization, Content-Type, and the optional login-customer-id header
 * required when accessing through a manager (sub) account.
 */
export const buildDataManagerHeaders = (
  accessToken: string,
  Config: GARLDestinationConfig,
): Record<string, string> => {
  const headers: Record<string, string> = {
    Authorization: `Bearer ${accessToken}`,
    'Content-Type': JSON_MIME_TYPE,
  };

  if (Config.subAccount && Config.loginCustomerId) {
    headers['login-customer-id'] = removeHyphens(Config.loginCustomerId);
  }

  return headers;
};

/**
 * Assembles the final HTTP request config from an already-built payload.
 * Endpoint and endpointPath are passed by the caller — responseBuilder has
 * no knowledge of which operation (ingest vs remove) is being performed.
 */
export const responseBuilder = (
  accessToken: string,
  payload: GARLIngestAPIPayload | GARLRemoveAPIPayload,
  endpoint: string,
  endpointPath: string,
  Config: GARLDestinationConfig,
): GARLBatchRequest => {
  const response = defaultRequestConfig() as GARLBatchRequest;
  response.endpoint = endpoint;
  response.endpointPath = endpointPath;
  response.body.JSON = removeUndefinedAndNullValues(payload) as
    | GARLIngestAPIPayload
    | GARLRemoveAPIPayload;
  response.params = {};
  response.headers = buildDataManagerHeaders(accessToken, Config);

  return response;
};
