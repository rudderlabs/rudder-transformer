import lodash from 'lodash';
import { hashToSha256 } from '@rudderstack/integrations-lib';
import { createHash } from 'crypto';
import { BASE_ENDPOINT, COMPANY_ENDPOINT, FIELD_MAP, USER_ENDPOINT } from './config';

export function hashIdentifiers(identifiers: string[]): Record<string, string> {
  const hashedIdentifiers = {};
  Object.keys(identifiers).forEach((key) => {
    if (key === 'sha256Email') {
      hashedIdentifiers[key] = hashToSha256(identifiers[key]);
    } else if (key === 'sha512Email') {
      hashedIdentifiers[key] = createHash('sha512').update(identifiers[key]).digest('hex');
    } else {
      hashedIdentifiers[key] = identifiers[key];
    }
  });
  return hashedIdentifiers;
}

export function prepareUserIds(
  identifiers: Record<string, string>,
): { idType: string; idValue: string }[] {
  const userIds: { idType: string; idValue: string }[] = [];
  Object.keys(identifiers).forEach((key) => {
    userIds.push({ idType: FIELD_MAP[key], idValue: identifiers[key] });
  });
  return userIds;
}

export function generateEndpoint(audienceType: string, audienceId: string) {
  if (audienceType === 'user') {
    return BASE_ENDPOINT + USER_ENDPOINT.replace('audienceId', audienceId);
  }
  return BASE_ENDPOINT + COMPANY_ENDPOINT.replace('audienceId', audienceId);
}

export function batchResponseBuilder(successfulEvents) {
  const chunkOnActionType = lodash.groupBy(
    successfulEvents,
    (event) => event.message[0].body.JSON.elements[0].action,
  );
  const result: any = [];
  Object.keys(chunkOnActionType).forEach((actionType) => {
    const firstEvent = chunkOnActionType[actionType][0];
    const { method, endpoint, headers, type, version } = firstEvent.message[0];
    const batchEvent = {
      batchedRequest: {
        body: {
          JSON: { elements: firstEvent.message[0].body.JSON.elements },
          JSON_ARRAY: {},
          XML: {},
          FORM: {},
        },
        version,
        type,
        method,
        endpoint,
        headers,
        params: {},
        files: {},
      },
      metadata: [firstEvent.metadata],
      batched: true,
      statusCode: 200,
      destination: firstEvent.destination,
    };
    firstEvent.metadata = [firstEvent.metadata];
    chunkOnActionType[actionType].forEach((element, index) => {
      if (index !== 0) {
        batchEvent.batchedRequest.body.JSON.elements.push(element.message[0].body.JSON.elements[0]);
        batchEvent.metadata.push(element.metadata);
      }
    });
    result.push(batchEvent);
  });
  return result;
}

export const generateActionType = (actionType: string): string => {
  if (actionType === 'insert' || actionType === 'update') {
    return 'ADD';
  }
  if (actionType === 'delete') {
    return 'REMOVE';
  }
  return actionType;
};
