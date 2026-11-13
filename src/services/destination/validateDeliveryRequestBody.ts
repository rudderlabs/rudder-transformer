import { PlatformError } from '@rudderstack/integrations-lib';
import isEmpty from 'lodash/isEmpty';
import { DELIVERY_BODY_FORMATS } from '../../adapters/network';
import { BatchedRequestBody } from '../../types/destinationTransformation';

export const validateDeliveryRequestBody = (
  requests?: { body?: BatchedRequestBody } | { body?: BatchedRequestBody }[],
): void => {
  const requestList = Array.isArray(requests) ? requests : [requests];
  requestList.forEach((request) => {
    const presentFormats = DELIVERY_BODY_FORMATS.filter(
      (format) => !isEmpty(request?.body?.[format as keyof BatchedRequestBody]),
    );
    if (presentFormats.length > 1) {
      throw new PlatformError(
        `delivery request has more than one non-empty body format: ${presentFormats.join(', ')}`,
      );
    }
  });
};
