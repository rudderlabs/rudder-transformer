import {
  ITERABLE_RESPONSE_EMAIL_PATHS,
  ITERABLE_RESPONSE_USER_ID_PATHS,
} from '../../../v0/destinations/iterable/config';
import { IterableBulkApiResponse } from './types';

const get = require('get-value');

/**
 * Creates an optimized error checker function that pre-processes response data
 * into lookup maps for O(1) access instead of O(n) array searches.
 *
 * Determines if an event should be aborted based on the response from a destination
 * and extracts an error message if applicable.
 *
 * References:
 * 1) https://api.iterable.com/api/docs#users_updateEmail
 * 2) https://api.iterable.com/api/docs#events_track
 * 3) https://api.iterable.com/api/docs#users_bulkUpdateUser
 * 4) https://api.iterable.com/api/docs#events_trackBulk
 * 5) https://api.iterable.com/api/docs#catalogs_bulkUpdateCatalogItems
 * 6) https://api.iterable.com/api/docs#users_registerDeviceToken
 * 7) https://api.iterable.com/api/docs#users_registerBrowserToken
 * 8) https://api.iterable.com/api/docs#commerce_trackPurchase
 * 9) https://api.iterable.com/api/docs#commerce_updateCart
 *
 * @param {IterableBulkApiResponse} destinationResponse - The response object from the destination.
 * @returns {Function} A function that checks if an event should be aborted with optimized lookups.
 *                   Returns an object containing a boolean `isAbortable` indicating if the event
 *                   should be aborted, and an `errorMsg` string with the error message if applicable.
 */
export const createBatchErrorChecker = (destinationResponse: IterableBulkApiResponse) => {
  const { failCount, ...response } = destinationResponse.response;

  if (failCount === 0) {
    return () => ({ isAbortable: false, errorMsg: '' });
  }

  // Pre-process response data into lookup maps for O(1) access
  const emailErrorMap = new Map<string, string[]>(); // email -> paths where it was found
  const userIdErrorMap = new Map<string, string[]>(); // userId -> paths where it was found
  const eventNameErrorMap = new Set<string>();

  // Build lookup maps from response paths
  ITERABLE_RESPONSE_EMAIL_PATHS.forEach((path) => {
    const respArr = get(response, path);
    if (Array.isArray(respArr)) {
      respArr.forEach((email) => {
        if (!emailErrorMap.has(email)) {
          emailErrorMap.set(email, []);
        }
        emailErrorMap.get(email)?.push(path);
      });
    }
  });

  ITERABLE_RESPONSE_USER_ID_PATHS.forEach((path) => {
    const respArr = get(response, path);
    if (Array.isArray(respArr)) {
      respArr.forEach((userId) => {
        if (!userIdErrorMap.has(userId)) {
          userIdErrorMap.set(userId, []);
        }
        userIdErrorMap.get(userId)?.push(path);
      });
    }
  });

  const disallowedEventNames = get(response, 'disallowedEventNames');
  if (Array.isArray(disallowedEventNames)) {
    disallowedEventNames.forEach((eventName) => eventNameErrorMap.add(eventName));
  }

  return (event: any) => {
    const eventValues = {
      email: event.email,
      userId: event.userId,
      eventName: event.eventName,
    };

    let errorMsg = '';

    if (eventValues.userId && userIdErrorMap.has(eventValues.userId)) {
      const paths = userIdErrorMap.get(eventValues.userId);
      errorMsg += `userId error:"${eventValues.userId}" in "${paths?.join(',')}".`;
    }

    if (eventValues.email && emailErrorMap.has(eventValues.email)) {
      const paths = emailErrorMap.get(eventValues.email);
      errorMsg += `email error:"${eventValues.email}" in "${paths?.join(',')}".`;
    }

    if (eventValues.eventName && eventNameErrorMap.has(eventValues.eventName)) {
      errorMsg += `eventName error:"${eventValues.eventName}" in "disallowedEventNames".`;
    }

    return {
      isAbortable: errorMsg.length > 0,
      errorMsg,
    };
  };
};
