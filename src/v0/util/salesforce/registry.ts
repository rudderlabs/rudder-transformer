import Legacy from './legacy';
import OAuth from './oauth';
import {
  SALESFORCE_OAUTH,
  SALESFORCE_OAUTH_SANDBOX,
  SALESFORCE,
  ACCESS_TOKEN_CACHE_TTL,
} from '../../destinations/salesforce/config';

const oauth = new OAuth();
const legacy = new Legacy(ACCESS_TOKEN_CACHE_TTL);

const getAuthInfo = async (event: { destination: { DestinationDefinition: { Name: string } } }) => {
  const { Name } = event.destination.DestinationDefinition;
  const lowerCaseName = Name?.toLowerCase?.();
  if (lowerCaseName === SALESFORCE_OAUTH_SANDBOX || lowerCaseName === SALESFORCE_OAUTH) {
    return oauth.collectAuthorizationInfo(event);
  }
  return legacy.collectAuthorizationInfo(event);
};

export default {
  [SALESFORCE_OAUTH_SANDBOX]: oauth,
  [SALESFORCE_OAUTH]: oauth,
  [SALESFORCE]: legacy,
  getAuthInfo,
};
