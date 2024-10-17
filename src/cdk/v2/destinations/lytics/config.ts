import { getMappingConfig } from '../../../../v0/util';

const CONFIG_CATEGORIES = {
  CUSTOMER_PROPERTIES_CONFIG: { name: 'LYTICSIdentifyConfig' },
};

const MAPPING_CONFIG = getMappingConfig(CONFIG_CATEGORIES, __dirname);
export const CUSTOMER_PROPERTIES_CONFIG =
  MAPPING_CONFIG[CONFIG_CATEGORIES.CUSTOMER_PROPERTIES_CONFIG.name];
