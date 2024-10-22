import Legacy from './legacy';
import OAuth from './oauth';
import {
  LEGACY,
  OAUTH,
  SALESFORCE_OAUTH,
  SALESFORCE_OAUTH_SANDBOX,
} from '../../destinations/salesforce/config';
import { ACCESS_TOKEN_CACHE_TTL_SECONDS } from '../../destinations/wootric/config';

const oauth = new OAuth();
const legacy = new Legacy(ACCESS_TOKEN_CACHE_TTL_SECONDS);

const getAuthInfo = async (event: { destination: { DestinationDefinition: { Name: string } } }) => {
  const { Name } = event.destination.DestinationDefinition;
  const lowerCaseName = Name?.toLowerCase?.();
  if (lowerCaseName === SALESFORCE_OAUTH_SANDBOX || lowerCaseName === SALESFORCE_OAUTH) {
    return oauth.collectAuthorizationInfo(event);
  }
  return legacy.collectAuthorizationInfo(event);
};

export default { [OAUTH]: oauth, [LEGACY]: legacy, getAuthInfo };
