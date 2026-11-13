import { PlatformError } from '@rudderstack/integrations-lib';
import isEmpty from 'lodash/isEmpty';
import { BatchedRequestBody } from '../../types/destinationTransformation';

const bodyFormats = ['JSON', 'JSON_ARRAY', 'XML', 'FORM', 'GZIP'] as const;

export const validateDeliveryRequestBody = (
  requests?: { body?: BatchedRequestBody } | { body?: BatchedRequestBody }[],
): void => {
  const requestList = Array.isArray(requests) ? requests : [requests];
  requestList.forEach((request) => {
    const presentFormats = bodyFormats.filter((format) => !isEmpty(request?.body?.[format]));
    if (presentFormats.length > 1) {
      throw new PlatformError(
        `delivery request has more than one non-empty body format: ${presentFormats.join(', ')}`,
      );
    }
  });
};
