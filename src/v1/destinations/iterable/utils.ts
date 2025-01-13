import {
  ITERABLE_RESPONSE_EMAIL_PATHS,
  ITERABLE_RESPONSE_USER_ID_PATHS,
} from '../../../v0/destinations/iterable/config';
import { IterableBulkApiResponse } from './types';

const get = require('get-value');

/**
 * Checks if a value is present in a response array based on a given path.
 * @param {Object} response - The response object to search within.
 * @param {string} path - The path to the response array.
 * @param {any} value - The value to check for in the array.
 * @returns {boolean} - True if the value is in the array, otherwise false.
 */
const isValueInResponseArray = (destinationResponse, path, value) => {
  const respArr = get(destinationResponse, path);
  return Array.isArray(respArr) && respArr.includes(value);
};

/**
 * Determines if an event should be aborted based on the response from a destination
 * and extracts an error message if applicable.
 * ref:
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
 * @param {Object} event - The event object containing various event properties.
 * @param {Object} destinationResponse - The response object from the destination.
 * @returns {Object} An object containing a boolean `isAbortable` indicating if the event
 * should be aborted, and an `errorMsg` string with the error message if applicable.
 */

export const checkIfEventIsAbortableAndExtractErrorMessage = (
  event: any,
  destinationResponse: IterableBulkApiResponse,
): {
  isAbortable: boolean;
  errorMsg: string;
} => {
  const { failCount } = destinationResponse.response;

  if (failCount === 0) {
    return { isAbortable: false, errorMsg: '' };
  }

  const eventValues = {
    email: event.email,
    userId: event.userId,
    eventName: event.eventName,
  };

  let errorMsg = '';
  const userIdMatchPath = ITERABLE_RESPONSE_USER_ID_PATHS.filter((userIdPath) =>
    isValueInResponseArray(destinationResponse.response, userIdPath, eventValues.userId),
  );
  if (userIdMatchPath.length > 0) {
    errorMsg += `userId error:"${eventValues.userId}" in "${userIdMatchPath}".`;
  }

  const emailMatchPath = ITERABLE_RESPONSE_EMAIL_PATHS.filter((emailPath) =>
    isValueInResponseArray(destinationResponse.response, emailPath, eventValues.email),
  );

  if (emailMatchPath.length > 0) {
    errorMsg += `email error:"${eventValues.email}" in "${emailMatchPath}".`;
  }

  const eventNameMatchPath = ['disallowedEventNames'].filter((eventNamePath) =>
    isValueInResponseArray(destinationResponse.response, eventNamePath, eventValues.eventName),
  );

  if (eventNameMatchPath.length > 0) {
    errorMsg += `eventName error:"${eventValues.eventName}" in "${eventNameMatchPath}".`;
  }

  if (errorMsg) {
    return {
      isAbortable: true,
      errorMsg,
    };
  }

  return { isAbortable: false, errorMsg: '' };
};
