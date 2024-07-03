import { generateMetadata } from '../../../testUtils';
import {
  destType,
  destination,
  properties,
  runtimeEnvironment,
  routerInstrumentationErrorStatTags,
} from '../common';

export const data = [
  {
    id: 'MovableInk-router-test-1',
    name: destType,
    description: 'Basic Router Test to test multiple payloads',
    scenario: 'Framework',
    successCriteria:
      'Some events should be transformed successfully and some should fail for missing fields and status code should be 200',
    feature: 'router',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: {
          input: [
            {
              destination,
              message: {
                type: 'identify',
                anonymousId: 'anonId123',
                integrations: {
                  All: true,
                },
                originalTimestamp: '2024-03-04T15:32:56.409Z',
              },
              metadata: generateMetadata(1),
            },
            {
              destination,
              message: {
                event: 'srp-screen-view',
                type: 'track',
                userId: 'test_123',
                context: {
                  traits: {
                    firstName: 'john',
                    lastName: 'doe',
                  },
                },
                integrations: {
                  Wunderkind: {
                    extraEventProperties: {
                      screen_name: 'shopping/vehicle-details',
                      type: 'custom_event',
                      id: '1393f120-53b8-4126-8deb-874c26b5b06d',
                      timestamp_ms: 1703685306737,
                      source_id: 'test-source-id',
                      session_id: 1688982077105114764,
                      name: 'srp-screen-view',
                      custom_event_type: 'other',
                    },
                    lambdaRootLevelProperties: {
                      type: 'event_processing_request',
                      id: 'a2a5575b-d3b0-4a14-96a5-79f8e38b0778',
                      timestamp_ms: 1718893923387,
                      source_id: 'test-source-id',
                      source_channel: 'native',
                      device_application_stamp: 'test-device-application-stamp',
                      user_identities: [
                        {
                          type: 'customer',
                          encoding: 'raw',
                          value: 'eb3f565d-49bd-418c-ae31-801f25da0ce2',
                        },
                        {
                          type: 'email',
                          encoding: 'raw',
                          value: 'johndoe@gmail.com',
                        },
                        {
                          type: 'other',
                          encoding: 'raw',
                          value: '7c2c3abd-62bf-473e-998d-034df0f25ea3',
                        },
                      ],
                      user_attribute_lists: {},
                      runtime_environment: runtimeEnvironment,
                    },
                  },
                },
                properties,
              },
              metadata: generateMetadata(2),
            },
          ],
          destType,
        },
      },
    },
    output: {
      response: {
        status: 200,
        body: {
          output: [
            {
              metadata: [generateMetadata(1)],
              batched: false,
              statusCode: 400,
              error: 'message type identify is not supported',
              statTags: routerInstrumentationErrorStatTags,
              destination,
            },
            {
              batchedRequest: {
                payload:
                  '{"account":{"account_id":"test-account-id","account_settings":{"instance_id":"test-instance-id","key":"test-api-key"}},"type":"event_processing_request","id":"a2a5575b-d3b0-4a14-96a5-79f8e38b0778","timestamp_ms":1718893923387,"source_id":"test-source-id","source_channel":"native","device_application_stamp":"test-device-application-stamp","user_identities":[{"type":"customer","encoding":"raw","value":"eb3f565d-49bd-418c-ae31-801f25da0ce2"},{"type":"email","encoding":"raw","value":"johndoe@gmail.com"},{"type":"other","encoding":"raw","value":"7c2c3abd-62bf-473e-998d-034df0f25ea3"}],"user_attribute_lists":{},"runtime_environment":{"sdk_version":"8.8.0","type":"ios","identities":[{"type":"apple_push_notification_token","encoding":"raw","value":"9e3dba8db39f9d130f3d1584c8aab674e9f4b06d0b1b52867e128d3e7b1130f1"},{"type":"ios_vendor_id","encoding":"raw","value":"78c53c15-32a1-4b65-adac-bec2d7bb8fab"}],"build_id":"20E12","brand":"iPhone14,7","product":"iPhone14,7","name":"iPhone","manufacturer":"Apple","os_version":"16.3.1","model":"iPhone14,7","screen_height":2532,"screen_width":1170,"locale_language":"en-US","locale_country":"US","network_country":"us","network_carrier":"Verizon","network_code":"480","network_mobile_country_code":"311","timezone_offset":-7,"timezone_name":"America/Phoenix","cpu_architecture":"arm64","radio_access_technology":"LTE","application_name":"Abc.com - New Account","application_version":"8.8.0","application_package":"com.abc","apple_search_ads_attribution":{},"client_ip_address":"192.0.2.0"},"user_attributes":{"firstName":"john","lastName":"doe"},"events":[{"screen_name":"shopping/vehicle-details","type":"custom_event","id":"1393f120-53b8-4126-8deb-874c26b5b06d","timestamp_ms":1703685306737,"source_id":"test-source-id","session_id":1688982077105115000,"name":"srp-screen-view","custom_event_type":"other","attributes":{"profileLoginType":"logged-in","launchType":"organic","platform":"iphone-app","fuelType":"Gasoline","makeName":"Volvo","vehicleAdCategory":"multi_cat","searchInstanceId":"test-search-instance-id","customerId":"test-customer-id","drivetrain":"All-wheel Drive","year":"2024","canonical_mmt":"volvo:xc90:b5_core_bright_theme","mileage":"5","make":"volvo","pushNotification":"disabled","advertiserId":"00000000-0000-0000-0000-000000000000","exteriorColor":"Crystal White","adobeId":"test-adobe-id","pageChannel":"shopping","bodyStyle":"suv","tripId":"test-trip-id","stockType":"new","makeModelTrim":"volvo:xc90:b5_core_bright_theme","pageName":"shopping/vehicle-details","model":"xc90","deviceType":"mobile","listingId":"test-listing-id","dealerZip":"30341","cpoIndicator":"false","trim":"b5_core_bright_theme","canonical_mmty":"volvo:xc90:b5_core_bright_theme:2024","sellerType":"franchise","price":"56002","vin":"test-vin","resultSelected":"89","zip":"85381","stockSubStock":"new","profileUserId":"test-profile-user-id","pageKey":"vehicle-details","badges":"homeDelivery,virtualAppointment","modelName":"XC90"}}]}',
              },
              metadata: [generateMetadata(2)],
              destination,
              batched: false,
              statusCode: 200,
            },
          ],
        },
      },
    },
  },
];
