const { getMappingConfig, getHashFromArray } = require('../../util');

const CONFIG_CATEGORIES = {
  IDENTIFY: { name: 'MARKETOIdentify' },
};

const LEAD_LOOKUP_METRIC = 'marketo_lead_lookup';
const ACTIVITY_METRIC = 'marketo_activity';
const FETCH_TOKEN_METRIC = 'marketo_fetch_token';

const MAPPING_CONFIG = getMappingConfig(CONFIG_CATEGORIES, __dirname);
const DESTINATION = 'marketo';

const formatConfig = (destination) => ({
  ID: destination.ID,
  ...destination.Config,
  customActivityEventMap: getHashFromArray(
    destination.Config.rudderEventsMapping,
    'event',
    'marketoActivityId',
    false,
  ),
  customActivityPropertyMap: getHashFromArray(
    destination.Config.customActivityPropertyMap,
    'from',
    'to',
    false,
  ),
  customActivityPrimaryKeyMap: getHashFromArray(
    destination.Config.rudderEventsMapping,
    'event',
    'marketoPrimarykey',
    false,
  ),
  leadTraitMapping: getHashFromArray(destination.Config.leadTraitMapping, 'from', 'to', false),
  responseRules: destination.DestinationDefinition
    ? destination.DestinationDefinition.ResponseRules
    : null,
});

module.exports = {
  LEAD_LOOKUP_METRIC,
  ACTIVITY_METRIC,
  FETCH_TOKEN_METRIC,
  DESTINATION,
  formatConfig,
  identifyConfig: MAPPING_CONFIG[CONFIG_CATEGORIES.IDENTIFY.name],
};
