import { hashToSha256 } from '@rudderstack/integrations-lib';
import { createHash } from 'crypto';
import {
  COMPANY_ENDPOINT,
  COMPANY_ENDPOINT_PATH,
  FIELD_MAP,
  USER_ENDPOINT,
  USER_ENDPOINT_PATH,
} from './config';

export function hashIdentifiers(
  identifiers: Record<string, string | null>,
): Record<string, string> {
  const hashedIdentifiers = {};
  Object.keys(identifiers).forEach((key) => {
    const value = identifiers[key];
    if (value) {
      if (key === 'sha256Email') {
        hashedIdentifiers[key] = hashToSha256(value);
      } else if (key === 'sha512Email') {
        hashedIdentifiers[key] = createHash('sha512').update(value).digest('hex');
      } else {
        hashedIdentifiers[key] = value;
      }
    }
  });
  return hashedIdentifiers;
}

export function prepareUserIds(
  identifiers: Record<string, string | null>,
): { idType: string; idValue: string }[] {
  const userIds: { idType: (typeof FIELD_MAP)[keyof typeof FIELD_MAP]; idValue: string }[] = [];
  Object.keys(identifiers).forEach((key) => {
    const value = identifiers[key];
    if (value) {
      userIds.push({ idType: FIELD_MAP[key], idValue: value });
    }
  });
  return userIds;
}

export function generateEndpoint(audienceType: string, audienceId: string) {
  if (audienceType === 'user') {
    return { endpoint: USER_ENDPOINT(audienceId), endpointPath: USER_ENDPOINT_PATH };
  }
  return { endpoint: COMPANY_ENDPOINT(audienceId), endpointPath: COMPANY_ENDPOINT_PATH };
}
