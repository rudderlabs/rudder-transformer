import { isObject, isEmptyObject, getIntegrationsObj } from '../../../../v0/util';
import { RudderMessage, Destination } from '../../../../types';
import { BloomreachDestinationConfig } from './types';

const getCustomerIDsFromIntegrationObject = (message: RudderMessage): any => {
  const integrationObj = getIntegrationsObj(message, 'bloomreach' as any) || {};
  const { hardID, softID } = integrationObj;
  const customerIDs = {};

  if (isObject(hardID) && !isEmptyObject(hardID)) {
    Object.keys(hardID).forEach((id) => {
      customerIDs[id] = hardID[id];
    });
  }

  if (isObject(softID) && !isEmptyObject(softID)) {
    Object.keys(softID).forEach((id) => {
      customerIDs[id] = softID[id];
    });
  }

  return customerIDs;
};

export const prepareCustomerIDs = (
  message: RudderMessage,
  destination: Destination<BloomreachDestinationConfig>,
): any => {
  const customerIDs = {
    [destination.Config.hardID]: message.userId,
    [destination.Config.softID]: message.anonymousId,
    ...getCustomerIDsFromIntegrationObject(message),
  };
  return customerIDs;
};
