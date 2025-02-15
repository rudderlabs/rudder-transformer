import { getMappingConfig } from '../../../../v0/util';

export interface CordialConfig {
  apiBaseUrl: string;
  apiKey: string;
}

export interface ConfigCategory {
  name: string;
  type: string;
}

export const getCreateContactEndpoint = (config: CordialConfig): string =>
  `${config.apiBaseUrl}/v2/contacts`;

export const getUpdateContactEndpoint = (
  config: CordialConfig,
  contactId?: string,
  email?: string,
): string => {
  if (contactId) {
    return `${config.apiBaseUrl}/v2/contacts/${contactId}`;
  }
  return `${config.apiBaseUrl}/v2/contacts/email:${email}`;
};

export const getEventsEndpoint = (config: CordialConfig): string =>
  `${config.apiBaseUrl}/v2/contactactivities`;

export const getContactEndpoint = getUpdateContactEndpoint;

const CONFIG_CATEGORIES: Record<string, ConfigCategory> = {
  IDENTIFY: {
    name: 'CordialIdentifyConfig',
    type: 'identify',
  },
  TRACK: {
    name: 'CordialTrackConfig',
    type: 'track',
  },
};

const MAPPING_CONFIG = getMappingConfig(CONFIG_CATEGORIES, __dirname);

export const IDENTIFY_CONFIG = MAPPING_CONFIG[CONFIG_CATEGORIES.IDENTIFY.name];
export const TRACK_CONFIG = MAPPING_CONFIG[CONFIG_CATEGORIES.TRACK.name];

export const destType = 'cordial';
