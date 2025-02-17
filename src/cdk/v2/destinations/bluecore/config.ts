import { getMappingConfig } from '../../../../v0/util';

export interface ConfigCategory {
  name: string;
  type: string;
}

export interface ConfigCategories {
  IDENTIFY: ConfigCategory;
  TRACK: ConfigCategory;
  COMMON: ConfigCategory;
}

export interface EventMapping {
  src: string[];
  dest: string;
}

export const BASE_URL = 'https://api.bluecore.app/api/track/mobile/v1';

export const CONFIG_CATEGORIES: ConfigCategories = {
  IDENTIFY: {
    name: 'bluecoreIdentifyConfig',
    type: 'identify',
  },
  TRACK: {
    name: 'bluecoreTrackConfig',
    type: 'track',
  },
  COMMON: {
    name: 'bluecoreCommonConfig',
    type: 'common',
  },
};

export const EVENT_NAME_MAPPING: EventMapping[] = [
  {
    src: ['product viewed'],
    dest: 'viewed_product',
  },
  {
    src: ['products searched'],
    dest: 'search',
  },
  {
    src: ['product added'],
    dest: 'add_to_cart',
  },
  {
    src: ['product removed'],
    dest: 'remove_from_cart',
  },
  {
    src: ['product added to wishlist'],
    dest: 'wishlist',
  },
  {
    src: ['order completed'],
    dest: 'purchase',
  },
];

export const BLUECORE_EXCLUSION_FIELDS: string[] = ['query', 'order_id', 'total'];

export const IDENTIFY_EXCLUSION_LIST: string[] = [
  'name',
  'firstName',
  'first_name',
  'firstname',
  'lastName',
  'last_name',
  'lastname',
  'email',
  'age',
  'sex',
  'address',
  'action',
  'event',
];

export const TRACK_EXCLUSION_LIST: string[] = [
  ...IDENTIFY_EXCLUSION_LIST,
  'query',
  'order_id',
  'total',
  'products',
];

export const MAPPING_CONFIG = getMappingConfig(CONFIG_CATEGORIES, __dirname);
