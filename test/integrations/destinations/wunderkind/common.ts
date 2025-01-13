import { Destination } from '../../../../src/types';

export const destType = 'wunderkind';
const destTypeInUpperCase = 'WUNDERKIND';
const displayName = 'WUNDERKIND';
export const destination: Destination = {
  Config: {
    accountID: 'test-account-id',
    instanceID: 'test-instance-id',
    apiKey: 'test-api-key',
  },
  DestinationDefinition: {
    DisplayName: displayName,
    ID: '123',
    Name: destTypeInUpperCase,
    Config: { cdkV2Enabled: true },
  },
  Enabled: true,
  ID: '123',
  Name: destTypeInUpperCase,
  Transformations: [],
  WorkspaceID: 'test-workspace-id',
};

export const properties = {
  profileLoginType: 'logged-in',
  launchType: 'organic',
  platform: 'iphone-app',
  fuelType: 'Gasoline',
  makeName: 'Volvo',
  vehicleAdCategory: 'multi_cat',
  searchInstanceId: 'test-search-instance-id',
  customerId: 'test-customer-id',
  drivetrain: 'All-wheel Drive',
  year: '2024',
  canonical_mmt: 'volvo:xc90:b5_core_bright_theme',
  mileage: '5',
  make: 'volvo',
  pushNotification: 'disabled',
  advertiserId: '00000000-0000-0000-0000-000000000000',
  exteriorColor: 'Crystal White',
  adobeId: 'test-adobe-id',
  pageChannel: 'shopping',
  bodyStyle: 'suv',
  tripId: 'test-trip-id',
  stockType: 'new',
  makeModelTrim: 'volvo:xc90:b5_core_bright_theme',
  pageName: 'shopping/vehicle-details',
  model: 'xc90',
  deviceType: 'mobile',
  listingId: 'test-listing-id',
  dealerZip: '30341',
  cpoIndicator: 'false',
  trim: 'b5_core_bright_theme',
  canonical_mmty: 'volvo:xc90:b5_core_bright_theme:2024',
  sellerType: 'franchise',
  price: '56002',
  vin: 'test-vin',
  resultSelected: '89',
  zip: '85381',
  stockSubStock: 'new',
  profileUserId: 'test-profile-user-id',
  pageKey: 'vehicle-details',
  badges: 'homeDelivery,virtualAppointment',
  modelName: 'XC90',
};

export const runtimeEnvironment = {
  sdk_version: '8.8.0',
  type: 'ios',
  identities: [
    {
      type: 'apple_push_notification_token',
      encoding: 'raw',
      value: '9e3dba8db39f9d130f3d1584c8aab674e9f4b06d0b1b52867e128d3e7b1130f1',
    },
    {
      type: 'ios_vendor_id',
      encoding: 'raw',
      value: '78c53c15-32a1-4b65-adac-bec2d7bb8fab',
    },
  ],
  build_id: '20E12',
  brand: 'iPhone14,7',
  product: 'iPhone14,7',
  name: 'iPhone',
  manufacturer: 'Apple',
  os_version: '16.3.1',
  model: 'iPhone14,7',
  screen_height: 2532,
  screen_width: 1170,
  locale_language: 'en-US',
  locale_country: 'US',
  network_country: 'us',
  network_carrier: 'Verizon',
  network_code: '480',
  network_mobile_country_code: '311',
  timezone_offset: -7,
  timezone_name: 'America/Phoenix',
  cpu_architecture: 'arm64',
  radio_access_technology: 'LTE',
  application_name: 'Abc.com - New Account',
  application_version: '8.8.0',
  application_package: 'com.abc',
  apple_search_ads_attribution: {},
  client_ip_address: '192.0.2.0',
};

export const processorInstrumentationErrorStatTags = {
  destType: destTypeInUpperCase,
  errorCategory: 'dataValidation',
  errorType: 'instrumentation',
  feature: 'processor',
  implementation: 'cdkV2',
  module: 'destination',
  destinationId: 'default-destinationId',
  workspaceId: 'default-workspaceId',
};

export const routerInstrumentationErrorStatTags = {
  ...processorInstrumentationErrorStatTags,
  feature: 'router',
};
