export const data = [
  {
    name: 'fb',
    description: 'Test 0',
    feature: 'processor',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: [
          {
            message: {
              anonymousId: 'c82cbdff-e5be-4009-ac78-cdeea09ab4b1',
              destination_props: {
                Fb: {
                  app_id: 'RudderFbApp',
                },
              },
              context: {
                device: {
                  id: 'df16bffa-5c3d-4fbb-9bce-3bab098129a7R',
                  manufacturer: 'Xiaomi',
                  model: 'Redmi 6',
                  name: 'xiaomi',
                  type: 'Android',
                },
                network: {
                  carrier: 'Banglalink',
                },
                os: {
                  name: 'android',
                  version: '8.1.0',
                },
                screen: {
                  height: '100',
                  density: 50,
                },
                traits: {
                  email: 'abc@gmail.com',
                  anonymousId: 'c82cbdff-e5be-4009-ac78-cdeea09ab4b1',
                },
              },
              event: 'spin_result',
              integrations: {
                AM: true,
                All: false,
                GA: true,
              },
              message_id: 'a80f82be-9bdc-4a9f-b2a5-15621ee41df8',
              properties: {
                revenue: 400,
                additional_bet_index: 0,
                battle_id: 'N/A',
                bet_amount: 9,
                bet_level: 1,
                bet_multiplier: 1,
                coin_balance: 9466052,
                current_module_name: 'CasinoGameModule',
                days_in_game: 0,
                extra_param: 'N/A',
                fb_profile: '0',
                featureGameType: 'N/A',
                game_fps: 30,
                game_id: 'fireEagleBase',
                game_name: 'FireEagleSlots',
                gem_balance: 0,
                graphicsQuality: 'HD',
                idfa: '2bf99787-33d2-4ae2-a76a-c49672f97252',
                internetReachability: 'ReachableViaLocalAreaNetwork',
                isLowEndDevice: 'False',
                is_auto_spin: 'False',
                is_turbo: 'False',
                isf: 'False',
                ishighroller: 'False',
                jackpot_win_amount: 90,
                jackpot_win_type: 'Silver',
                level: 6,
                lifetime_gem_balance: 0,
                no_of_spin: 1,
                player_total_battles: 0,
                player_total_shields: 0,
                start_date: '2019-08-01',
                total_payments: 0,
                tournament_id: 'T1561970819',
                userId: 'c82cbdff-e5be-4009-ac78-cdeea09ab4b1',
                versionSessionCount: 2,
                win_amount: 0,
                products: [
                  {
                    product_id: 123,
                  },
                  {
                    product_id: 345,
                  },
                  {
                    product_id: 567,
                  },
                ],
              },
              timestamp: '2019-09-01T15:46:51.693229+05:30',
              type: 'track',
              user_properties: {
                coin_balance: 9466052,
                current_module_name: 'CasinoGameModule',
                fb_profile: '0',
                game_fps: 30,
                game_name: 'FireEagleSlots',
                gem_balance: 0,
                graphicsQuality: 'HD',
                idfa: '2bf99787-33d2-4ae2-a76a-c49672f97252',
                internetReachability: 'ReachableViaLocalAreaNetwork',
                isLowEndDevice: false,
                level: 6,
                lifetime_gem_balance: 0,
                player_total_battles: 0,
                player_total_shields: 0,
                start_date: '2019-08-01',
                total_payments: 0,
                userId: 'c82cbdff-e5be-4009-ac78-cdeea09ab4b1',
                versionSessionCount: 2,
              },
            },
            destination: {
              Config: {
                appID: 'RudderFbApp',
              },
            },
          },
        ],
      },
    },
    output: {
      response: {
        status: 200,
        body: [
          {
            error: 'If properties.revenue is present, properties.currency is required.',
            statTags: {
              destType: 'FB',
              errorCategory: 'dataValidation',
              errorType: 'instrumentation',
              feature: 'processor',
              implementation: 'native',
              module: 'destination',
            },
            statusCode: 400,
          },
        ],
      },
    },
  },
  {
    name: 'fb',
    description: 'Test 1',
    feature: 'processor',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: [
          {
            message: {
              anonymousId: 'c82cbdff-e5be-4009-ac78-cdeea09ab4b1',
              destination_props: {
                Fb: {
                  app_id: 'RudderFbApp',
                },
              },
              context: {
                device: {
                  id: 'df16bffa-5c3d-4fbb-9bce-3bab098129a7R',
                  manufacturer: 'Xiaomi',
                  model: 'Redmi 6',
                  name: 'xiaomi',
                  type: 'Android',
                },
                network: {
                  carrier: 'Banglalink',
                },
                os: {
                  name: 'android',
                  version: '8.1.0',
                },
                screen: {
                  height: '100',
                  density: 50,
                },
                traits: {
                  email: 'abc@gmail.com',
                  anonymousId: 'c82cbdff-e5be-4009-ac78-cdeea09ab4b1',
                },
              },
              event: 'spin_result',
              integrations: {
                AM: true,
                All: false,
                GA: true,
              },
              message_id: 'a80f82be-9bdc-4a9f-b2a5-15621ee41df8',
              properties: {
                revenue: 400,
                currency: 'GBP',
                additional_bet_index: 0,
                battle_id: 'N/A',
                bet_amount: 9,
                bet_level: 1,
                bet_multiplier: 1,
                coin_balance: 9466052,
                current_module_name: 'CasinoGameModule',
                days_in_game: 0,
                extra_param: 'N/A',
                fb_profile: '0',
                featureGameType: 'N/A',
                game_fps: 30,
                game_id: 'fireEagleBase',
                game_name: 'FireEagleSlots',
                gem_balance: 0,
                graphicsQuality: 'HD',
                idfa: '2bf99787-33d2-4ae2-a76a-c49672f97252',
                internetReachability: 'ReachableViaLocalAreaNetwork',
                isLowEndDevice: 'False',
                is_auto_spin: 'False',
                is_turbo: 'False',
                isf: 'False',
                ishighroller: 'False',
                jackpot_win_amount: 90,
                jackpot_win_type: 'Silver',
                level: 6,
                lifetime_gem_balance: 0,
                no_of_spin: 1,
                player_total_battles: 0,
                player_total_shields: 0,
                start_date: '2019-08-01',
                total_payments: 0,
                tournament_id: 'T1561970819',
                userId: 'c82cbdff-e5be-4009-ac78-cdeea09ab4b1',
                versionSessionCount: 2,
                win_amount: 0,
                products: [
                  {
                    product_id: 123,
                  },
                  {
                    product_id: 345,
                  },
                  {
                    product_id: 567,
                  },
                ],
              },
              timestamp: '2019-09-01T15:46:51.693229+05:30',
              type: 'track',
              user_properties: {
                coin_balance: 9466052,
                current_module_name: 'CasinoGameModule',
                fb_profile: '0',
                game_fps: 30,
                game_name: 'FireEagleSlots',
                gem_balance: 0,
                graphicsQuality: 'HD',
                idfa: '2bf99787-33d2-4ae2-a76a-c49672f97252',
                internetReachability: 'ReachableViaLocalAreaNetwork',
                isLowEndDevice: false,
                level: 6,
                lifetime_gem_balance: 0,
                player_total_battles: 0,
                player_total_shields: 0,
                start_date: '2019-08-01',
                total_payments: 0,
                userId: 'c82cbdff-e5be-4009-ac78-cdeea09ab4b1',
                versionSessionCount: 2,
              },
            },
            destination: {
              Config: {
                appID: 'RudderFbApp',
              },
            },
          },
        ],
      },
    },
    output: {
      response: {
        status: 200,
        body: [
          {
            error:
              'Value of properties.products.sub.product_id is not of valid type. It should be of type string',
            statTags: {
              destType: 'FB',
              errorCategory: 'dataValidation',
              errorType: 'instrumentation',
              feature: 'processor',
              implementation: 'native',
              module: 'destination',
            },
            statusCode: 400,
          },
        ],
      },
    },
  },
  {
    name: 'fb',
    description: 'Test 2',
    feature: 'processor',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: [
          {
            message: {
              anonymousId: 'c82cbdff-e5be-4009-ac78-cdeea09ab4b1',
              destination_props: {
                Fb: {
                  app_id: 'RudderFbApp',
                },
              },
              context: {
                device: {
                  id: 'df16bffa-5c3d-4fbb-9bce-3bab098129a7R',
                  manufacturer: 'Xiaomi',
                  model: 'Redmi 6',
                  name: 'xiaomi',
                  type: 'Android',
                },
                network: {
                  carrier: 'Banglalink',
                },
                os: {
                  name: 'android',
                  version: '8.1.0',
                },
                screen: {
                  height: '100',
                  density: 50,
                },
                traits: {
                  email: 'abc@gmail.com',
                  anonymousId: 'c82cbdff-e5be-4009-ac78-cdeea09ab4b1',
                },
              },
              event: 'spin_result',
              integrations: {
                AM: true,
                All: false,
                GA: true,
              },
              message_id: 'a80f82be-9bdc-4a9f-b2a5-15621ee41df8',
              properties: {
                revenue: '400',
                currency: 'GBP',
                additional_bet_index: 0,
                battle_id: 'N/A',
                bet_amount: 9,
                bet_level: 1,
                bet_multiplier: 1,
                coin_balance: 9466052,
                current_module_name: 'CasinoGameModule',
                days_in_game: 0,
                extra_param: 'N/A',
                fb_profile: '0',
                featureGameType: 'N/A',
                game_fps: 30,
                game_id: 'fireEagleBase',
                game_name: 'FireEagleSlots',
                gem_balance: 0,
                graphicsQuality: 'HD',
                idfa: '2bf99787-33d2-4ae2-a76a-c49672f97252',
                internetReachability: 'ReachableViaLocalAreaNetwork',
                isLowEndDevice: 'False',
                is_auto_spin: 'False',
                is_turbo: 'False',
                isf: 'False',
                ishighroller: 'False',
                jackpot_win_amount: 90,
                jackpot_win_type: 'Silver',
                level: 6,
                lifetime_gem_balance: 0,
                no_of_spin: 1,
                player_total_battles: 0,
                player_total_shields: 0,
                start_date: '2019-08-01',
                total_payments: 0,
                tournament_id: 'T1561970819',
                userId: 'c82cbdff-e5be-4009-ac78-cdeea09ab4b1',
                versionSessionCount: 2,
                win_amount: 0,
                products: [
                  {
                    product_id: '123',
                  },
                  {
                    product_id: '345',
                  },
                  {
                    product_id: '567',
                  },
                ],
              },
              timestamp: '2019-09-01T15:46:51.693229+05:30',
              type: 'track',
              user_properties: {
                coin_balance: 9466052,
                current_module_name: 'CasinoGameModule',
                fb_profile: '0',
                game_fps: 30,
                game_name: 'FireEagleSlots',
                gem_balance: 0,
                graphicsQuality: 'HD',
                idfa: '2bf99787-33d2-4ae2-a76a-c49672f97252',
                internetReachability: 'ReachableViaLocalAreaNetwork',
                isLowEndDevice: false,
                level: 6,
                lifetime_gem_balance: 0,
                player_total_battles: 0,
                player_total_shields: 0,
                start_date: '2019-08-01',
                total_payments: 0,
                userId: 'c82cbdff-e5be-4009-ac78-cdeea09ab4b1',
                versionSessionCount: 2,
              },
            },
            destination: {
              Config: {
                appID: 'RudderFbApp',
              },
            },
          },
        ],
      },
    },
    output: {
      response: {
        status: 200,
        body: [
          {
            error: 'Value of properties.revenue is not of valid type. It should be of type number',
            statTags: {
              destType: 'FB',
              errorCategory: 'dataValidation',
              errorType: 'instrumentation',
              feature: 'processor',
              implementation: 'native',
              module: 'destination',
            },
            statusCode: 400,
          },
        ],
      },
    },
  },
  {
    name: 'fb',
    description: 'Test 3',
    feature: 'processor',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: [
          {
            message: {
              anonymousId: 'c82cbdff-e5be-4009-ac78-cdeea09ab4b1',
              destination_props: {
                Fb: {
                  app_id: 'RudderFbApp',
                },
              },
              context: {
                device: {
                  id: 'df16bffa-5c3d-4fbb-9bce-3bab098129a7R',
                  manufacturer: 'Xiaomi',
                  model: 'Redmi 6',
                  name: 'xiaomi',
                  advertisingId: 'df16bffa-5c3d-4fbb-9bce-3bab098129a7R',
                  type: 'Android',
                },
                ip: '1.2.3.4',
                network: {
                  carrier: 'Banglalink',
                },
                os: {
                  name: 'android',
                  version: '8.1.0',
                },
                screen: {
                  width: '640',
                  height: '480',
                  density: 1.23456,
                },
                timezone: 'Europe/Berlin',
                traits: {
                  email: 'abc@gmail.com',
                  anonymousId: 'c82cbdff-e5be-4009-ac78-cdeea09ab4b1',
                  firstName: 'test',
                  lastName: 'last',
                  gender: 1234,
                  phone: '+91-9831311135',
                },
              },
              event: 'spin_result',
              integrations: {
                AM: true,
                All: false,
                GA: true,
              },
              userId: 'c82cbdff-e5be-4009-ac78-cdeea09ab4b1',
              message_id: 'a80f82be-9bdc-4a9f-b2a5-15621ee41df8',
              properties: {
                revenue: 400,
                currency: 'GBP',
                additional_bet_index: 0,
                battle_id: 'N/A',
                bet_amount: 9,
                bet_level: 1,
                bet_multiplier: 1,
                coin_balance: 9466052,
                current_module_name: 'CasinoGameModule',
                days_in_game: 0,
                extra_param: 'N/A',
                fb_profile: '0',
                featureGameType: 'N/A',
                game_fps: 30,
                game_id: 'fireEagleBase',
                game_name: 'FireEagleSlots',
                gem_balance: 0,
                graphicsQuality: 'HD',
                idfa: '2bf99787-33d2-4ae2-a76a-c49672f97252',
                internetReachability: 'ReachableViaLocalAreaNetwork',
                isLowEndDevice: 'False',
                is_auto_spin: 'False',
                is_turbo: 'False',
                isf: 'False',
                ishighroller: 'False',
                jackpot_win_amount: 90,
                jackpot_win_type: 'Silver',
                level: 6,
                lifetime_gem_balance: 0,
                no_of_spin: 1,
                player_total_battles: 0,
                player_total_shields: 0,
                start_date: '2019-08-01',
                total_payments: 0,
                tournament_id: 'T1561970819',
                userId: 'c82cbdff-e5be-4009-ac78-cdeea09ab4b1',
                versionSessionCount: 2,
                win_amount: 0,
                products: [
                  {
                    product_id: '123',
                  },
                  {
                    product_id: '345',
                  },
                  {
                    product_id: '567',
                  },
                ],
              },
              timestamp: '2019-09-01T15:46:51.693229+05:30',
              type: 'track',
              user_properties: {
                coin_balance: 9466052,
                current_module_name: 'CasinoGameModule',
                fb_profile: '0',
                game_fps: 30,
                game_name: 'FireEagleSlots',
                gem_balance: 0,
                graphicsQuality: 'HD',
                idfa: '2bf99787-33d2-4ae2-a76a-c49672f97252',
                internetReachability: 'ReachableViaLocalAreaNetwork',
                isLowEndDevice: false,
                level: 6,
                lifetime_gem_balance: 0,
                player_total_battles: 0,
                player_total_shields: 0,
                start_date: '2019-08-01',
                total_payments: 0,
                userId: 'c82cbdff-e5be-4009-ac78-cdeea09ab4b1',
                versionSessionCount: 2,
              },
            },
            destination: {
              Config: {
                appID: 'RudderFbApp',
              },
            },
          },
        ],
      },
    },
    output: {
      response: {
        status: 200,
        body: [
          {
            output: {
              body: {
                XML: {},
                JSON_ARRAY: {},
                FORM: {
                  event: 'CUSTOM_APP_EVENTS',
                  advertiser_id: 'df16bffa-5c3d-4fbb-9bce-3bab098129a7R',
                  'ud[em]': '48ddb93f0b30c475423fe177832912c5bcdce3cc72872f8051627967ef278e08',
                  'ud[fn]': '9f86d081884c7d659a2feaa0c55ad015a3bf4f1b2b0b822cd15d6c15b0f00a08',
                  'ud[ln]': '3547cb112ac4489af2310c0626cdba6f3097a2ad5a3b42ddd3b59c76c7a079a3',
                  'ud[ph]': '588211a01b10feacbf7988d97a06e86c18af5259a7f457fd8759b7f7409a7d1f',
                  extinfo:
                    '["a2","","","","8.1.0","Redmi 6","","","Banglalink",640,480,"1.23",0,0,0,"Europe/Berlin"]',
                  app_user_id: 'c82cbdff-e5be-4009-ac78-cdeea09ab4b1',
                  custom_events:
                    '[{"_logTime":1567333011693,"_eventName":"spin_result","_valueToSum":400,"fb_currency":"GBP","additional_bet_index":0,"battle_id":"N/A","bet_amount":9,"bet_level":1,"bet_multiplier":1,"coin_balance":9466052,"current_module_name":"CasinoGameModule","days_in_game":0,"extra_param":"N/A","fb_profile":"0","featureGameType":"N/A","game_fps":30,"game_id":"fireEagleBase","game_name":"FireEagleSlots","gem_balance":0,"graphicsQuality":"HD","idfa":"2bf99787-33d2-4ae2-a76a-c49672f97252","internetReachability":"ReachableViaLocalAreaNetwork","isLowEndDevice":"False","is_auto_spin":"False","is_turbo":"False","isf":"False","ishighroller":"False","jackpot_win_amount":90,"jackpot_win_type":"Silver","level":6,"lifetime_gem_balance":0,"no_of_spin":1,"player_total_battles":0,"player_total_shields":0,"start_date":"2019-08-01","total_payments":0,"tournament_id":"T1561970819","userId":"c82cbdff-e5be-4009-ac78-cdeea09ab4b1","versionSessionCount":2,"win_amount":0,"fb_content_id":["123","345","567"]}]',
                  advertiser_tracking_enabled: '0',
                  application_tracking_enabled: '0',
                },
                JSON: {},
              },
              endpoint: 'https://graph.facebook.com/v17.0/RudderFbApp/activities',
              files: {},
              headers: {
                'x-forwarded-for': '1.2.3.4',
              },
              method: 'POST',
              params: {},
              statusCode: 200,
              type: 'REST',
              userId: 'c82cbdff-e5be-4009-ac78-cdeea09ab4b1',
              version: '1',
            },
            statusCode: 200,
          },
        ],
      },
    },
  },
  {
    name: 'fb',
    description: 'Test 4',
    feature: 'processor',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: [
          {
            message: {
              anonymousId: 'c82cbdff-e5be-4009-ac78-cdeea09ab4b1',
              destination_props: {
                Fb: {
                  app_id: 'RudderFbApp',
                },
              },
              context: {
                device: {
                  id: 'df16bffa-5c3d-4fbb-9bce-3bab098129a7R',
                  manufacturer: 'Xiaomi',
                  model: 'Redmi 6',
                  name: 'xiaomi',
                  advertisingId: 'df16bffa-5c3d-4fbb-9bce-3bab098129a7R',
                  type: 'Android',
                },
                ip: '1.2.3.4',
                network: {
                  carrier: 'Banglalink',
                },
                os: {
                  name: 'android',
                  version: '8.1.0',
                },
                screen: {
                  width: '640',
                  height: '480',
                  density: 1.23456,
                },
                timezone: 'Europe/Berlin',
                traits: {
                  email: 'abc@gmail.com',
                  anonymousId: 'c82cbdff-e5be-4009-ac78-cdeea09ab4b1',
                  firstName: 'test',
                  lastName: 'last',
                  gender: 'Male',
                  phone: '+91-9831311135',
                },
              },
              event: 'spin_result',
              integrations: {
                AM: true,
                All: false,
                GA: true,
              },
              userId: 'c82cbdff-e5be-4009-ac78-cdeea09ab4b1',
              message_id: 'a80f82be-9bdc-4a9f-b2a5-15621ee41df8',
              properties: {
                revenue: 400,
                currency: 'GBP',
                additional_bet_index: 0,
                battle_id: 'N/A',
                bet_amount: 9,
                bet_level: 1,
                bet_multiplier: 1,
                coin_balance: 9466052,
                current_module_name: 'CasinoGameModule',
                days_in_game: 0,
                extra_param: 'N/A',
                fb_profile: '0',
                featureGameType: 'N/A',
                game_fps: 30,
                game_id: 'fireEagleBase',
                game_name: 'FireEagleSlots',
                gem_balance: 0,
                graphicsQuality: 'HD',
                idfa: '2bf99787-33d2-4ae2-a76a-c49672f97252',
                internetReachability: 'ReachableViaLocalAreaNetwork',
                isLowEndDevice: 'False',
                is_auto_spin: 'False',
                is_turbo: 'False',
                isf: 'False',
                ishighroller: 'False',
                jackpot_win_amount: 90,
                jackpot_win_type: 'Silver',
                level: 6,
                lifetime_gem_balance: 0,
                no_of_spin: 1,
                player_total_battles: 0,
                player_total_shields: 0,
                start_date: '2019-08-01',
                total_payments: 0,
                tournament_id: 'T1561970819',
                userId: 'c82cbdff-e5be-4009-ac78-cdeea09ab4b1',
                versionSessionCount: 2,
                win_amount: 0,
                products: [
                  {
                    product_id: '123',
                  },
                  {
                    product_id: '345',
                  },
                  {
                    product_id: '567',
                  },
                ],
              },
              timestamp: '2019-09-01T15:46:51.693229+05:30',
              type: 'track',
              user_properties: {
                coin_balance: 9466052,
                current_module_name: 'CasinoGameModule',
                fb_profile: '0',
                game_fps: 30,
                game_name: 'FireEagleSlots',
                gem_balance: 0,
                graphicsQuality: 'HD',
                idfa: '2bf99787-33d2-4ae2-a76a-c49672f97252',
                internetReachability: 'ReachableViaLocalAreaNetwork',
                isLowEndDevice: false,
                level: 6,
                lifetime_gem_balance: 0,
                player_total_battles: 0,
                player_total_shields: 0,
                start_date: '2019-08-01',
                total_payments: 0,
                userId: 'c82cbdff-e5be-4009-ac78-cdeea09ab4b1',
                versionSessionCount: 2,
              },
            },
            destination: {
              Config: {
                appID: 'RudderFbApp',
              },
            },
          },
        ],
      },
    },
    output: {
      response: {
        status: 200,
        body: [
          {
            output: {
              body: {
                XML: {},
                JSON_ARRAY: {},
                FORM: {
                  event: 'CUSTOM_APP_EVENTS',
                  advertiser_id: 'df16bffa-5c3d-4fbb-9bce-3bab098129a7R',
                  'ud[em]': '48ddb93f0b30c475423fe177832912c5bcdce3cc72872f8051627967ef278e08',
                  'ud[fn]': '9f86d081884c7d659a2feaa0c55ad015a3bf4f1b2b0b822cd15d6c15b0f00a08',
                  'ud[ge]': '62c66a7a5dd70c3146618063c344e531e6d4b59e379808443ce962b3abd63c5a',
                  'ud[ln]': '3547cb112ac4489af2310c0626cdba6f3097a2ad5a3b42ddd3b59c76c7a079a3',
                  'ud[ph]': '588211a01b10feacbf7988d97a06e86c18af5259a7f457fd8759b7f7409a7d1f',
                  extinfo:
                    '["a2","","","","8.1.0","Redmi 6","","","Banglalink",640,480,"1.23",0,0,0,"Europe/Berlin"]',
                  app_user_id: 'c82cbdff-e5be-4009-ac78-cdeea09ab4b1',
                  custom_events:
                    '[{"_logTime":1567333011693,"_eventName":"spin_result","_valueToSum":400,"fb_currency":"GBP","additional_bet_index":0,"battle_id":"N/A","bet_amount":9,"bet_level":1,"bet_multiplier":1,"coin_balance":9466052,"current_module_name":"CasinoGameModule","days_in_game":0,"extra_param":"N/A","fb_profile":"0","featureGameType":"N/A","game_fps":30,"game_id":"fireEagleBase","game_name":"FireEagleSlots","gem_balance":0,"graphicsQuality":"HD","idfa":"2bf99787-33d2-4ae2-a76a-c49672f97252","internetReachability":"ReachableViaLocalAreaNetwork","isLowEndDevice":"False","is_auto_spin":"False","is_turbo":"False","isf":"False","ishighroller":"False","jackpot_win_amount":90,"jackpot_win_type":"Silver","level":6,"lifetime_gem_balance":0,"no_of_spin":1,"player_total_battles":0,"player_total_shields":0,"start_date":"2019-08-01","total_payments":0,"tournament_id":"T1561970819","userId":"c82cbdff-e5be-4009-ac78-cdeea09ab4b1","versionSessionCount":2,"win_amount":0,"fb_content_id":["123","345","567"]}]',
                  advertiser_tracking_enabled: '0',
                  application_tracking_enabled: '0',
                },
                JSON: {},
              },
              endpoint: 'https://graph.facebook.com/v17.0/RudderFbApp/activities',
              files: {},
              headers: {
                'x-forwarded-for': '1.2.3.4',
              },
              method: 'POST',
              params: {},
              statusCode: 200,
              type: 'REST',
              userId: 'c82cbdff-e5be-4009-ac78-cdeea09ab4b1',
              version: '1',
            },
            statusCode: 200,
          },
        ],
      },
    },
  },
  {
    name: 'fb',
    description: 'Test 5',
    feature: 'processor',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: [
          {
            message: {
              anonymousId: 'c82cbdff-e5be-4009-ac78-cdeea09ab4b1',
              destination_props: {
                Fb: {
                  app_id: 'RudderFbApp',
                },
              },
              context: {
                device: {
                  id: 'df16bffa-5c3d-4fbb-9bce-3bab098129a7R',
                  manufacturer: 'Xiaomi',
                  model: 'Redmi 6',
                  name: 'xiaomi',
                  type: 'Android',
                },
                network: {
                  carrier: 'Banglalink',
                },
                os: {
                  name: 'android',
                  version: '8.1.0',
                },
                screen: {
                  height: '100',
                  density: 50,
                },
                traits: {
                  email: 'abc@gmail.com',
                  anonymousId: 'c82cbdff-e5be-4009-ac78-cdeea09ab4b1',
                },
              },
              event: 'spin_result',
              integrations: {
                AM: true,
                All: false,
                GA: true,
              },
              message_id: 'a80f82be-9bdc-4a9f-b2a5-15621ee41df8',
              properties: {
                name: 'Main.1233',
              },
              timestamp: '2019-09-01T15:46:51.693229+05:30',
              type: 'screen',
            },
            destination: {
              Config: {
                appID: 'RudderFbApp',
              },
            },
          },
        ],
      },
    },
    output: {
      response: {
        status: 200,
        body: [
          {
            output: {
              version: '1',
              type: 'REST',
              method: 'POST',
              endpoint: 'https://graph.facebook.com/v17.0/RudderFbApp/activities',
              headers: {},
              params: {},
              body: {
                JSON: {},
                XML: {},
                JSON_ARRAY: {},
                FORM: {
                  extinfo:
                    '["a2","","","","8.1.0","Redmi 6","","","Banglalink",0,100,"50.00",0,0,0,""]',
                  custom_events:
                    '[{"_logTime":1567333011693,"_eventName":"Viewed Screen","fb_description":"Main.1233"}]',
                  'ud[em]': '48ddb93f0b30c475423fe177832912c5bcdce3cc72872f8051627967ef278e08',
                  advertiser_tracking_enabled: '0',
                  application_tracking_enabled: '0',
                  event: 'CUSTOM_APP_EVENTS',
                },
              },
              files: {},
              userId: 'c82cbdff-e5be-4009-ac78-cdeea09ab4b1',
              statusCode: 200,
            },
            statusCode: 200,
          },
        ],
      },
    },
  },
  {
    name: 'fb',
    description: 'Test 6',
    feature: 'processor',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: [
          {
            message: {
              anonymousId: 'c82cbdff-e5be-4009-ac78-cdeea09ab4b1',
              destination_props: {
                Fb: {
                  app_id: 'RudderFbApp',
                },
              },
              context: {
                device: {
                  id: 'df16bffa-5c3d-4fbb-9bce-3bab098129a7R',
                  manufacturer: 'Xiaomi',
                  model: 'Redmi 6',
                  name: 'xiaomi',
                  type: 'Android',
                },
                network: {
                  carrier: 'Banglalink',
                },
                os: {
                  name: 'android',
                  version: '8.1.0',
                },
                screen: {
                  height: '100',
                  density: 50,
                },
                traits: {
                  email: 'abc@gmail.com',
                  anonymousId: 'c82cbdff-e5be-4009-ac78-cdeea09ab4b1',
                },
              },
              event: 'spin_result',
              integrations: {
                AM: true,
                All: false,
                GA: true,
              },
              message_id: 'a80f82be-9bdc-4a9f-b2a5-15621ee41df8',
              properties: {
                name: 'Main',
              },
              timestamp: '2019-09-01T15:46:51.693229+05:30',
              type: 'screen',
            },
            destination: {
              Config: {
                appID: 'RudderFbApp',
              },
            },
          },
        ],
      },
    },
    output: {
      response: {
        status: 200,
        body: [
          {
            output: {
              version: '1',
              type: 'REST',
              method: 'POST',
              endpoint: 'https://graph.facebook.com/v17.0/RudderFbApp/activities',
              headers: {},
              params: {},
              body: {
                JSON: {},
                XML: {},
                JSON_ARRAY: {},
                FORM: {
                  extinfo:
                    '["a2","","","","8.1.0","Redmi 6","","","Banglalink",0,100,"50.00",0,0,0,""]',
                  custom_events:
                    '[{"_logTime":1567333011693,"_eventName":"Viewed Main Screen","fb_description":"Main"}]',
                  'ud[em]': '48ddb93f0b30c475423fe177832912c5bcdce3cc72872f8051627967ef278e08',
                  advertiser_tracking_enabled: '0',
                  application_tracking_enabled: '0',
                  event: 'CUSTOM_APP_EVENTS',
                },
              },
              files: {},
              userId: 'c82cbdff-e5be-4009-ac78-cdeea09ab4b1',
              statusCode: 200,
            },
            statusCode: 200,
          },
        ],
      },
    },
  },
  {
    name: 'fb',
    description: 'Test 7',
    feature: 'processor',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: [
          {
            message: {
              anonymousId: 'c82cbdff-e5be-4009-ac78-cdeea09ab4b1',
              destination_props: {
                Fb: {
                  app_id: 'RudderFbApp',
                },
              },
              context: {
                device: {
                  id: 'df16bffa-5c3d-4fbb-9bce-3bab098129a7R',
                  manufacturer: 'Xiaomi',
                  model: 'Redmi 6',
                  name: 'xiaomi',
                  type: 'Android',
                },
                network: {
                  carrier: 'Banglalink',
                },
                os: {
                  name: 'android',
                  version: '8.1.0',
                },
                screen: {
                  height: '100',
                  density: 50,
                },
                traits: {
                  email: 'abc@gmail.com',
                  anonymousId: 'c82cbdff-e5be-4009-ac78-cdeea09ab4b1',
                },
              },
              event: 'New.Event',
              integrations: {
                AM: true,
                All: false,
                GA: true,
              },
              message_id: 'a80f82be-9bdc-4a9f-b2a5-15621ee41df8',
              properties: {
                name: 'Main',
              },
              timestamp: '2019-09-01T15:46:51.693229+05:30',
              type: 'track',
            },
            destination: {
              Config: {
                appID: 'RudderFbApp',
              },
            },
          },
        ],
      },
    },
    output: {
      response: {
        status: 200,
        body: [
          {
            error:
              'Event name New.Event is not a valid FB APP event name.It must match the regex ^[0-9a-zA-Z_][0-9a-zA-Z _-]{0,39}$.',
            statTags: {
              destType: 'FB',
              errorCategory: 'dataValidation',
              errorType: 'instrumentation',
              feature: 'processor',
              implementation: 'native',
              module: 'destination',
            },
            statusCode: 400,
          },
        ],
      },
    },
  },
  {
    name: 'fb',
    description: 'Test 8',
    feature: 'processor',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: [
          {
            message: {
              anonymousId: 'c82cbdff-e5be-4009-ac78-cdeea09ab4b1',
              destination_props: {
                Fb: {
                  app_id: 'RudderFbApp',
                },
              },
              context: {
                device: {
                  id: 'df16bffa-5c3d-4fbb-9bce-3bab098129a7R',
                  manufacturer: 'Xiaomi',
                  model: 'Redmi 6',
                  name: 'xiaomi',
                  type: 'iOS',
                },
                network: {
                  carrier: 'Banglalink',
                },
                os: {
                  name: 'iOS',
                  version: '8.1.0',
                },
                screen: {
                  height: '100',
                  density: 50,
                },
                traits: {
                  email: 'abc@gmail.com',
                  anonymousId: 'c82cbdff-e5be-4009-ac78-cdeea09ab4b1',
                },
              },
              event: 'spin_result',
              integrations: {
                AM: true,
                All: false,
                GA: true,
              },
              message_id: 'a80f82be-9bdc-4a9f-b2a5-15621ee41df8',
              properties: {
                name: 'Viewed Main Screen1 by expicit call Screen',
              },
              timestamp: '2019-09-01T15:46:51.693229+05:30',
              type: 'screen',
            },
            destination: {
              Config: {
                appID: 'RudderFbApp',
              },
            },
          },
        ],
      },
    },
    output: {
      response: {
        status: 200,
        body: [
          {
            output: {
              version: '1',
              type: 'REST',
              method: 'POST',
              endpoint: 'https://graph.facebook.com/v17.0/RudderFbApp/activities',
              headers: {},
              params: {},
              body: {
                JSON: {},
                XML: {},
                JSON_ARRAY: {},
                FORM: {
                  extinfo:
                    '["i2","","","","8.1.0","Redmi 6","","","Banglalink",0,100,"50.00",0,0,0,""]',
                  custom_events:
                    '[{"_logTime":1567333011693,"_eventName":"Viewed Screen","fb_description":"Viewed Main Screen1 by expicit call Screen"}]',
                  'ud[em]': '48ddb93f0b30c475423fe177832912c5bcdce3cc72872f8051627967ef278e08',
                  advertiser_tracking_enabled: '0',
                  application_tracking_enabled: '0',
                  event: 'CUSTOM_APP_EVENTS',
                },
              },
              files: {},
              userId: 'c82cbdff-e5be-4009-ac78-cdeea09ab4b1',
              statusCode: 200,
            },
            statusCode: 200,
          },
        ],
      },
    },
  },
  {
    name: 'fb',
    description: 'Test 9',
    feature: 'processor',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: [
          {
            message: {
              anonymousId: 'c82cbdff-e5be-4009-ac78-cdeea09ab4b1',
              destination_props: {
                Fb: {
                  app_id: 'RudderFbApp',
                },
              },
              context: {
                device: {
                  id: 'df16bffa-5c3d-4fbb-9bce-3bab098129a7R',
                  manufacturer: 'Xiaomi',
                  model: 'Redmi 6',
                  name: 'xiaomi',
                  type: 'Android',
                },
                network: {
                  carrier: 'Banglalink',
                },
                os: {
                  name: 'Android',
                  version: '8.1.0',
                },
                screen: {
                  height: '100',
                  density: 50,
                },
                traits: {
                  email: 'abc@gmail.com',
                  anonymousId: 'c82cbdff-e5be-4009-ac78-cdeea09ab4b1',
                },
              },
              event: 'spin_result',
              integrations: {
                AM: true,
                All: false,
                GA: true,
              },
              message_id: 'a80f82be-9bdc-4a9f-b2a5-15621ee41df8',
              properties: {
                name: 'Viewed Main Screen1 by expicit call Screen',
              },
              timestamp: '2019-09-01T15:46:51.693229+05:30',
              type: 'screen',
            },
            destination: {
              Config: {
                appID: 'RudderFbApp',
              },
            },
          },
        ],
      },
    },
    output: {
      response: {
        status: 200,
        body: [
          {
            output: {
              version: '1',
              type: 'REST',
              method: 'POST',
              endpoint: 'https://graph.facebook.com/v17.0/RudderFbApp/activities',
              headers: {},
              params: {},
              body: {
                JSON: {},
                XML: {},
                JSON_ARRAY: {},
                FORM: {
                  extinfo:
                    '["a2","","","","8.1.0","Redmi 6","","","Banglalink",0,100,"50.00",0,0,0,""]',
                  custom_events:
                    '[{"_logTime":1567333011693,"_eventName":"Viewed Screen","fb_description":"Viewed Main Screen1 by expicit call Screen"}]',
                  'ud[em]': '48ddb93f0b30c475423fe177832912c5bcdce3cc72872f8051627967ef278e08',
                  advertiser_tracking_enabled: '0',
                  application_tracking_enabled: '0',
                  event: 'CUSTOM_APP_EVENTS',
                },
              },
              files: {},
              userId: 'c82cbdff-e5be-4009-ac78-cdeea09ab4b1',
              statusCode: 200,
            },
            statusCode: 200,
          },
        ],
      },
    },
  },
  {
    name: 'fb',
    description: 'Test 10',
    feature: 'processor',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: [
          {
            message: {
              anonymousId: 'c82cbdff-e5be-4009-ac78-cdeea09ab4b1',
              destination_props: {
                Fb: {
                  app_id: 'RudderFbApp',
                },
              },
              context: {
                device: {
                  id: 'df16bffa-5c3d-4fbb-9bce-3bab098129a7R',
                  manufacturer: 'Xiaomi',
                  model: 'Redmi 6',
                  name: 'xiaomi',
                  type: 'Android',
                },
                network: {
                  carrier: 'Banglalink',
                },
                os: {
                  name: 'Android',
                  version: '8.1.0',
                },
                screen: {
                  height: '100',
                  density: 50,
                },
                traits: {
                  email: 'abc@gmail.com',
                  anonymousId: 'c82cbdff-e5be-4009-ac78-cdeea09ab4b1',
                },
              },
              event: 'spin_result',
              integrations: {
                AM: true,
                All: false,
                GA: true,
              },
              message_id: 'a80f82be-9bdc-4a9f-b2a5-15621ee41df8',
              properties: {
                name: 'Viewed Main Screen1 by expicit call Screen',
              },
              timestamp: '2019-09-01T15:46:51.693229+05:30',
              type: 'screen',
            },
            destination: {
              Config: {
                appID: 'RudderFbApp',
              },
            },
          },
        ],
      },
    },
    output: {
      response: {
        status: 200,
        body: [
          {
            output: {
              version: '1',
              type: 'REST',
              method: 'POST',
              endpoint: 'https://graph.facebook.com/v17.0/RudderFbApp/activities',
              headers: {},
              params: {},
              body: {
                JSON: {},
                XML: {},
                JSON_ARRAY: {},
                FORM: {
                  extinfo:
                    '["a2","","","","8.1.0","Redmi 6","","","Banglalink",0,100,"50.00",0,0,0,""]',
                  custom_events:
                    '[{"_logTime":1567333011693,"_eventName":"Viewed Screen","fb_description":"Viewed Main Screen1 by expicit call Screen"}]',
                  'ud[em]': '48ddb93f0b30c475423fe177832912c5bcdce3cc72872f8051627967ef278e08',
                  advertiser_tracking_enabled: '0',
                  application_tracking_enabled: '0',
                  event: 'CUSTOM_APP_EVENTS',
                },
              },
              files: {},
              userId: 'c82cbdff-e5be-4009-ac78-cdeea09ab4b1',
              statusCode: 200,
            },
            statusCode: 200,
          },
        ],
      },
    },
  },
  {
    name: 'fb',
    description: 'Test 11',
    feature: 'processor',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: [
          {
            message: {
              anonymousId: 'c82cbdff-e5be-4009-ac78-cdeea09ab4b1',
              destination_props: {
                Fb: {
                  app_id: 'RudderFbApp',
                },
              },
              context: {
                device: {
                  id: 'df16bffa-5c3d-4fbb-9bce-3bab098129a7R',
                  manufacturer: 'Xiaomi',
                  model: 'Redmi 6',
                  name: 'xiaomi',
                  advertisingId: 'df16bffa-5c3d-4fbb-9bce-3bab098129a7R',
                  type: 'Android',
                },
                network: {
                  carrier: 'Banglalink',
                },
                os: {
                  name: 'android',
                  version: '8.1.0',
                },
                screen: {
                  height: '100',
                  density: 50,
                },
                traits: {
                  email: 'abc@gmail.com',
                  anonymousId: 'c82cbdff-e5be-4009-ac78-cdeea09ab4b1',
                  firstName: 'test',
                  lastName: 'last',
                  gender: 'Male',
                  phone: '919831311135',
                },
              },
              event: 'spin_result',
              integrations: {
                AM: true,
                All: false,
                GA: true,
              },
              userId: 'c82cbdff-e5be-4009-ac78-cdeea09ab4b1',
              message_id: 'a80f82be-9bdc-4a9f-b2a5-15621ee41df8',
              properties: {
                revenue: 400,
                currency: 'GBP',
                additional_bet_index: 0,
                battle_id: 'N/A',
                bet_amount: 9,
                bet_level: 1,
                bet_multiplier: 1,
                coin_balance: 9466052,
                current_module_name: 'CasinoGameModule',
                days_in_game: 0,
                extra_param: 'N/A',
                fb_profile: '0',
                featureGameType: 'N/A',
                game_fps: 30,
                game_id: 'fireEagleBase',
                game_name: 'FireEagleSlots',
                gem_balance: 0,
                graphicsQuality: 'HD',
                idfa: '2bf99787-33d2-4ae2-a76a-c49672f97252',
                internetReachability: 'ReachableViaLocalAreaNetwork',
                isLowEndDevice: 'False',
                is_auto_spin: 'False',
                is_turbo: 'False',
                isf: 'False',
                ishighroller: 'False',
                jackpot_win_amount: 90,
                jackpot_win_type: 'Silver',
                level: 6,
                lifetime_gem_balance: 0,
                no_of_spin: 1,
                player_total_battles: 0,
                player_total_shields: 0,
                start_date: '2019-08-01',
                total_payments: 0,
                tournament_id: 'T1561970819',
                userId: 'c82cbdff-e5be-4009-ac78-cdeea09ab4b1',
                versionSessionCount: 2,
                win_amount: 0,
                products: [
                  {
                    product_id: '123',
                  },
                  {
                    product_id: '345',
                  },
                  {
                    product_id: '567',
                  },
                ],
              },
              timestamp: '2019-09-01T15:46:51.693229+05:30',
              type: 'track',
              user_properties: {
                coin_balance: 9466052,
                current_module_name: 'CasinoGameModule',
                fb_profile: '0',
                game_fps: 30,
                game_name: 'FireEagleSlots',
                gem_balance: 0,
                graphicsQuality: 'HD',
                idfa: '2bf99787-33d2-4ae2-a76a-c49672f97252',
                internetReachability: 'ReachableViaLocalAreaNetwork',
                isLowEndDevice: false,
                level: 6,
                lifetime_gem_balance: 0,
                player_total_battles: 0,
                player_total_shields: 0,
                start_date: '2019-08-01',
                total_payments: 0,
                userId: 'c82cbdff-e5be-4009-ac78-cdeea09ab4b1',
                versionSessionCount: 2,
              },
            },
            destination: {
              Config: {
                appID: 'RudderFbApp',
              },
            },
          },
        ],
      },
    },
    output: {
      response: {
        status: 200,
        body: [
          {
            output: {
              version: '1',
              type: 'REST',
              method: 'POST',
              endpoint: 'https://graph.facebook.com/v17.0/RudderFbApp/activities',
              headers: {},
              params: {},
              body: {
                JSON: {},
                XML: {},
                JSON_ARRAY: {},
                FORM: {
                  extinfo:
                    '["a2","","","","8.1.0","Redmi 6","","","Banglalink",0,100,"50.00",0,0,0,""]',
                  custom_events:
                    '[{"_logTime":1567333011693,"_eventName":"spin_result","_valueToSum":400,"fb_currency":"GBP","additional_bet_index":0,"battle_id":"N/A","bet_amount":9,"bet_level":1,"bet_multiplier":1,"coin_balance":9466052,"current_module_name":"CasinoGameModule","days_in_game":0,"extra_param":"N/A","fb_profile":"0","featureGameType":"N/A","game_fps":30,"game_id":"fireEagleBase","game_name":"FireEagleSlots","gem_balance":0,"graphicsQuality":"HD","idfa":"2bf99787-33d2-4ae2-a76a-c49672f97252","internetReachability":"ReachableViaLocalAreaNetwork","isLowEndDevice":"False","is_auto_spin":"False","is_turbo":"False","isf":"False","ishighroller":"False","jackpot_win_amount":90,"jackpot_win_type":"Silver","level":6,"lifetime_gem_balance":0,"no_of_spin":1,"player_total_battles":0,"player_total_shields":0,"start_date":"2019-08-01","total_payments":0,"tournament_id":"T1561970819","userId":"c82cbdff-e5be-4009-ac78-cdeea09ab4b1","versionSessionCount":2,"win_amount":0,"fb_content_id":["123","345","567"]}]',
                  app_user_id: 'c82cbdff-e5be-4009-ac78-cdeea09ab4b1',
                  advertiser_id: 'df16bffa-5c3d-4fbb-9bce-3bab098129a7R',
                  'ud[em]': '48ddb93f0b30c475423fe177832912c5bcdce3cc72872f8051627967ef278e08',
                  'ud[fn]': '9f86d081884c7d659a2feaa0c55ad015a3bf4f1b2b0b822cd15d6c15b0f00a08',
                  'ud[ln]': '3547cb112ac4489af2310c0626cdba6f3097a2ad5a3b42ddd3b59c76c7a079a3',
                  'ud[ph]': '588211a01b10feacbf7988d97a06e86c18af5259a7f457fd8759b7f7409a7d1f',
                  'ud[ge]': '62c66a7a5dd70c3146618063c344e531e6d4b59e379808443ce962b3abd63c5a',
                  advertiser_tracking_enabled: '0',
                  application_tracking_enabled: '0',
                  event: 'CUSTOM_APP_EVENTS',
                },
              },
              files: {},
              userId: 'c82cbdff-e5be-4009-ac78-cdeea09ab4b1',
              statusCode: 200,
            },
            statusCode: 200,
          },
        ],
      },
    },
  },
  {
    name: 'fb',
    description: 'Test 12',
    feature: 'processor',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: [
          {
            message: {
              anonymousId: 'c82cbdff-e5be-4009-ac78-cdeea09ab4b1',
              destination_props: {
                Fb: {
                  app_id: 'RudderFbApp',
                },
              },
              context: {
                device: {
                  id: 'df16bffa-5c3d-4fbb-9bce-3bab098129a7R',
                  manufacturer: 'Xiaomi',
                  model: 'Redmi 6',
                  name: 'xiaomi',
                  advertisingId: 'df16bffa-5c3d-4fbb-9bce-3bab098129a7R',
                  type: 'Android',
                },
                network: {
                  carrier: 'Banglalink',
                },
                os: {
                  name: 'android',
                  version: '8.1.0',
                },
                screen: {
                  height: '100',
                  density: 50,
                },
                traits: {
                  email: 'abc@gmail.com',
                  anonymousId: 'c82cbdff-e5be-4009-ac78-cdeea09ab4b1',
                  firstName: 'test',
                  lastName: 'last',
                  gender: 'Male',
                  phone: '+0091-9831311135',
                },
              },
              event: 'spin_result',
              integrations: {
                AM: true,
                All: false,
                GA: true,
              },
              userId: 'c82cbdff-e5be-4009-ac78-cdeea09ab4b1',
              message_id: 'a80f82be-9bdc-4a9f-b2a5-15621ee41df8',
              properties: {
                revenue: 400,
                currency: 'GBP',
                additional_bet_index: 0,
                battle_id: 'N/A',
                bet_amount: 9,
                bet_level: 1,
                bet_multiplier: 1,
                coin_balance: 9466052,
                current_module_name: 'CasinoGameModule',
                days_in_game: 0,
                extra_param: 'N/A',
                fb_profile: '0',
                featureGameType: 'N/A',
                game_fps: 30,
                game_id: 'fireEagleBase',
                game_name: 'FireEagleSlots',
                gem_balance: 0,
                graphicsQuality: 'HD',
                idfa: '2bf99787-33d2-4ae2-a76a-c49672f97252',
                internetReachability: 'ReachableViaLocalAreaNetwork',
                isLowEndDevice: 'False',
                is_auto_spin: 'False',
                is_turbo: 'False',
                isf: 'False',
                ishighroller: 'False',
                jackpot_win_amount: 90,
                jackpot_win_type: 'Silver',
                level: 6,
                lifetime_gem_balance: 0,
                no_of_spin: 1,
                player_total_battles: 0,
                player_total_shields: 0,
                start_date: '2019-08-01',
                total_payments: 0,
                tournament_id: 'T1561970819',
                userId: 'c82cbdff-e5be-4009-ac78-cdeea09ab4b1',
                versionSessionCount: 2,
                win_amount: 0,
                products: [
                  {
                    product_id: '123',
                  },
                  {
                    product_id: '345',
                  },
                  {
                    product_id: '567',
                  },
                ],
              },
              timestamp: '2019-09-01T15:46:51.693229+05:30',
              type: 'track',
              user_properties: {
                coin_balance: 9466052,
                current_module_name: 'CasinoGameModule',
                fb_profile: '0',
                game_fps: 30,
                game_name: 'FireEagleSlots',
                gem_balance: 0,
                graphicsQuality: 'HD',
                idfa: '2bf99787-33d2-4ae2-a76a-c49672f97252',
                internetReachability: 'ReachableViaLocalAreaNetwork',
                isLowEndDevice: false,
                level: 6,
                lifetime_gem_balance: 0,
                player_total_battles: 0,
                player_total_shields: 0,
                start_date: '2019-08-01',
                total_payments: 0,
                userId: 'c82cbdff-e5be-4009-ac78-cdeea09ab4b1',
                versionSessionCount: 2,
              },
            },
            destination: {
              Config: {
                appID: 'RudderFbApp',
              },
            },
          },
        ],
      },
    },
    output: {
      response: {
        status: 200,
        body: [
          {
            output: {
              version: '1',
              type: 'REST',
              method: 'POST',
              endpoint: 'https://graph.facebook.com/v17.0/RudderFbApp/activities',
              headers: {},
              params: {},
              body: {
                JSON: {},
                XML: {},
                JSON_ARRAY: {},
                FORM: {
                  extinfo:
                    '["a2","","","","8.1.0","Redmi 6","","","Banglalink",0,100,"50.00",0,0,0,""]',
                  custom_events:
                    '[{"_logTime":1567333011693,"_eventName":"spin_result","_valueToSum":400,"fb_currency":"GBP","additional_bet_index":0,"battle_id":"N/A","bet_amount":9,"bet_level":1,"bet_multiplier":1,"coin_balance":9466052,"current_module_name":"CasinoGameModule","days_in_game":0,"extra_param":"N/A","fb_profile":"0","featureGameType":"N/A","game_fps":30,"game_id":"fireEagleBase","game_name":"FireEagleSlots","gem_balance":0,"graphicsQuality":"HD","idfa":"2bf99787-33d2-4ae2-a76a-c49672f97252","internetReachability":"ReachableViaLocalAreaNetwork","isLowEndDevice":"False","is_auto_spin":"False","is_turbo":"False","isf":"False","ishighroller":"False","jackpot_win_amount":90,"jackpot_win_type":"Silver","level":6,"lifetime_gem_balance":0,"no_of_spin":1,"player_total_battles":0,"player_total_shields":0,"start_date":"2019-08-01","total_payments":0,"tournament_id":"T1561970819","userId":"c82cbdff-e5be-4009-ac78-cdeea09ab4b1","versionSessionCount":2,"win_amount":0,"fb_content_id":["123","345","567"]}]',
                  app_user_id: 'c82cbdff-e5be-4009-ac78-cdeea09ab4b1',
                  advertiser_id: 'df16bffa-5c3d-4fbb-9bce-3bab098129a7R',
                  'ud[em]': '48ddb93f0b30c475423fe177832912c5bcdce3cc72872f8051627967ef278e08',
                  'ud[fn]': '9f86d081884c7d659a2feaa0c55ad015a3bf4f1b2b0b822cd15d6c15b0f00a08',
                  'ud[ln]': '3547cb112ac4489af2310c0626cdba6f3097a2ad5a3b42ddd3b59c76c7a079a3',
                  'ud[ph]': '588211a01b10feacbf7988d97a06e86c18af5259a7f457fd8759b7f7409a7d1f',
                  'ud[ge]': '62c66a7a5dd70c3146618063c344e531e6d4b59e379808443ce962b3abd63c5a',
                  advertiser_tracking_enabled: '0',
                  application_tracking_enabled: '0',
                  event: 'CUSTOM_APP_EVENTS',
                },
              },
              files: {},
              userId: 'c82cbdff-e5be-4009-ac78-cdeea09ab4b1',
              statusCode: 200,
            },
            statusCode: 200,
          },
        ],
      },
    },
  },
  {
    name: 'fb',
    description: 'Test 13',
    feature: 'processor',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: [
          {
            message: {
              anonymousId: 'c82cbdff-e5be-4009-ac78-cdeea09ab4b1',
              destination_props: {
                Fb: {
                  app_id: 'RudderFbApp',
                },
              },
              context: {
                device: {
                  id: 'df16bffa-5c3d-4fbb-9bce-3bab098129a7R',
                  type: 'watchos',
                },
                network: {
                  carrier: 'Banglalink',
                },
                screen: {
                  height: '100',
                  density: 50,
                },
                traits: {
                  email: 'abc@gmail.com',
                  anonymousId: 'c82cbdff-e5be-4009-ac78-cdeea09ab4b1',
                },
              },
              event: 'spin_result',
              integrations: {
                AM: true,
                All: false,
                GA: true,
              },
              message_id: 'a80f82be-9bdc-4a9f-b2a5-15621ee41df8',
              properties: {
                name: 'Viewed Main Screen1 by expicit call Screen',
              },
              request_ip: '2.3.4.5',
              timestamp: '2019-09-01T15:46:51.693229+05:30',
              type: 'screen',
            },
            destination: {
              Config: {
                appID: 'RudderFbApp',
              },
            },
          },
        ],
      },
    },
    output: {
      response: {
        status: 200,
        body: [
          {
            output: {
              version: '1',
              type: 'REST',
              method: 'POST',
              endpoint: 'https://graph.facebook.com/v17.0/RudderFbApp/activities',
              headers: {
                'x-forwarded-for': '2.3.4.5',
              },
              params: {},
              body: {
                JSON: {},
                JSON_ARRAY: {},
                XML: {},
                FORM: {
                  extinfo: '["i2","","","","","","","","Banglalink",0,100,"50.00",0,0,0,""]',
                  custom_events:
                    '[{"_logTime":1567333011693,"_eventName":"Viewed Screen","fb_description":"Viewed Main Screen1 by expicit call Screen"}]',
                  'ud[em]': '48ddb93f0b30c475423fe177832912c5bcdce3cc72872f8051627967ef278e08',
                  advertiser_tracking_enabled: '0',
                  application_tracking_enabled: '0',
                  event: 'CUSTOM_APP_EVENTS',
                },
              },
              files: {},
              userId: 'c82cbdff-e5be-4009-ac78-cdeea09ab4b1',
              statusCode: 200,
            },
            statusCode: 200,
          },
        ],
      },
    },
  },
  {
    name: 'fb',
    description: 'Test 14',
    feature: 'processor',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: [
          {
            message: {
              anonymousId: 'c82cbdff-e5be-4009-ac78-cdeea09ab4b1',
              destination_props: {
                Fb: {
                  app_id: 'RudderFbApp',
                },
              },
              context: {
                device: {
                  id: 'df16bffa-5c3d-4fbb-9bce-3bab098129a7R',
                  manufacturer: 'Xiaomi',
                  model: 'Redmi 6',
                  name: 'xiaomi',
                  advertisingId: 'df16bffa-5c3d-4fbb-9bce-3bab098129a7R',
                },
                network: {
                  carrier: 'Banglalink',
                },
                os: {
                  name: 'android',
                  version: '8.1.0',
                },
                screen: {
                  height: '100',
                  density: 50,
                },
                traits: {
                  email: 'abc@gmail.com',
                  anonymousId: 'c82cbdff-e5be-4009-ac78-cdeea09ab4b1',
                  firstName: 'test',
                  lastName: 'last',
                  gender: 'Male',
                  phone: '919831311135',
                },
              },
              event: 'spin_result',
              integrations: {
                AM: true,
                All: false,
                GA: true,
              },
              userId: 'c82cbdff-e5be-4009-ac78-cdeea09ab4b1',
              message_id: 'a80f82be-9bdc-4a9f-b2a5-15621ee41df8',
              properties: {
                revenue: 400,
                currency: 'GBP',
                additional_bet_index: 0,
                battle_id: 'N/A',
                bet_amount: 9,
                bet_level: 1,
                bet_multiplier: 1,
                coin_balance: 9466052,
                current_module_name: 'CasinoGameModule',
                days_in_game: 0,
                extra_param: 'N/A',
                fb_profile: '0',
                featureGameType: 'N/A',
                game_fps: 30,
                game_id: 'fireEagleBase',
                game_name: 'FireEagleSlots',
                gem_balance: 0,
                graphicsQuality: 'HD',
                idfa: '2bf99787-33d2-4ae2-a76a-c49672f97252',
                internetReachability: 'ReachableViaLocalAreaNetwork',
                isLowEndDevice: 'False',
                is_auto_spin: 'False',
                is_turbo: 'False',
                isf: 'False',
                ishighroller: 'False',
                jackpot_win_amount: 90,
                jackpot_win_type: 'Silver',
                level: 6,
                lifetime_gem_balance: 0,
                no_of_spin: 1,
                player_total_battles: 0,
                player_total_shields: 0,
                start_date: '2019-08-01',
                total_payments: 0,
                tournament_id: 'T1561970819',
                userId: 'c82cbdff-e5be-4009-ac78-cdeea09ab4b1',
                versionSessionCount: 2,
                win_amount: 0,
                products: [
                  {
                    product_id: '123',
                  },
                  {
                    product_id: '345',
                  },
                  {
                    product_id: '567',
                  },
                ],
              },
              timestamp: '2019-09-01T15:46:51.693229+05:30',
              type: 'track',
              user_properties: {
                coin_balance: 9466052,
                current_module_name: 'CasinoGameModule',
                fb_profile: '0',
                game_fps: 30,
                game_name: 'FireEagleSlots',
                gem_balance: 0,
                graphicsQuality: 'HD',
                idfa: '2bf99787-33d2-4ae2-a76a-c49672f97252',
                internetReachability: 'ReachableViaLocalAreaNetwork',
                isLowEndDevice: false,
                level: 6,
                lifetime_gem_balance: 0,
                player_total_battles: 0,
                player_total_shields: 0,
                start_date: '2019-08-01',
                total_payments: 0,
                userId: 'c82cbdff-e5be-4009-ac78-cdeea09ab4b1',
                versionSessionCount: 2,
              },
            },
            destination: {
              Config: {
                appID: 'RudderFbApp',
              },
            },
          },
        ],
      },
    },
    output: {
      response: {
        status: 200,
        body: [
          {
            error: 'Extended device information i.e, "context.device.type" is required',
            statTags: {
              destType: 'FB',
              errorCategory: 'dataValidation',
              errorType: 'instrumentation',
              feature: 'processor',
              implementation: 'native',
              module: 'destination',
            },
            statusCode: 400,
          },
        ],
      },
    },
  },
  {
    name: 'fb',
    description: 'Test 15',
    feature: 'processor',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: [
          {
            message: {
              anonymousId: 'c82cbdff-e5be-4009-ac78-cdeea09ab4b1',
              destination_props: {
                Fb: {
                  app_id: 'RudderFbApp',
                },
              },
              context: {
                device: {
                  id: 'df16bffa-5c3d-4fbb-9bce-3bab098129a7R',
                  manufacturer: 'Xiaomi',
                  model: 'Redmi 6',
                  name: 'xiaomi',
                  type: 'Android',
                },
                network: {
                  carrier: 'Banglalink',
                },
                os: {
                  name: 'android',
                  version: '8.1.0',
                },
                screen: {
                  height: '100',
                  density: 50,
                },
                traits: {
                  email: 'abc@gmail.com',
                  anonymousId: 'c82cbdff-e5be-4009-ac78-cdeea09ab4b1',
                },
              },
              event: 'spin_result',
              integrations: {
                AM: true,
                All: false,
                GA: true,
              },
              message_id: 'a80f82be-9bdc-4a9f-b2a5-15621ee41df8',
              properties: {
                revenue: 0,
                currency: 'INR',
                additional_bet_index: 0,
                battle_id: 'N/A',
                bet_amount: 9,
                bet_level: 1,
                bet_multiplier: 1,
                coin_balance: 9466052,
                current_module_name: 'CasinoGameModule',
                days_in_game: 0,
                extra_param: 'N/A',
                fb_profile: '0',
                featureGameType: 'N/A',
                game_fps: 30,
                game_id: 'fireEagleBase',
                game_name: 'FireEagleSlots',
                gem_balance: 0,
                graphicsQuality: 'HD',
                idfa: '2bf99787-33d2-4ae2-a76a-c49672f97252',
                internetReachability: 'ReachableViaLocalAreaNetwork',
                isLowEndDevice: 'False',
                is_auto_spin: 'False',
                is_turbo: 'False',
                isf: 'False',
                ishighroller: 'False',
                jackpot_win_amount: 90,
                jackpot_win_type: 'Silver',
                level: 6,
                lifetime_gem_balance: 0,
                no_of_spin: 1,
                player_total_battles: 0,
                player_total_shields: 0,
                start_date: '2019-08-01',
                total_payments: 0,
                tournament_id: 'T1561970819',
                userId: 'c82cbdff-e5be-4009-ac78-cdeea09ab4b1',
                versionSessionCount: 2,
                win_amount: 0,
                products: [
                  {
                    product_id: '123',
                  },
                  {
                    product_id: '345',
                  },
                ],
              },
              timestamp: '2019-09-01T15:46:51.693229+05:30',
              type: 'track',
              user_properties: {
                coin_balance: 9466052,
                current_module_name: 'CasinoGameModule',
                fb_profile: '0',
                game_fps: 30,
                game_name: 'FireEagleSlots',
                gem_balance: 0,
                graphicsQuality: 'HD',
                idfa: '2bf99787-33d2-4ae2-a76a-c49672f97252',
                internetReachability: 'ReachableViaLocalAreaNetwork',
                isLowEndDevice: false,
                level: 6,
                lifetime_gem_balance: 0,
                player_total_battles: 0,
                player_total_shields: 0,
                start_date: '2019-08-01',
                total_payments: 0,
                userId: 'c82cbdff-e5be-4009-ac78-cdeea09ab4b1',
                versionSessionCount: 2,
              },
            },
            destination: {
              Config: {
                appID: 'RudderFbApp',
              },
            },
          },
        ],
      },
    },
    output: {
      response: {
        status: 200,
        body: [
          {
            output: {
              version: '1',
              type: 'REST',
              method: 'POST',
              endpoint: 'https://graph.facebook.com/v17.0/RudderFbApp/activities',
              headers: {},
              params: {},
              body: {
                JSON: {},
                JSON_ARRAY: {},
                XML: {},
                FORM: {
                  extinfo:
                    '["a2","","","","8.1.0","Redmi 6","","","Banglalink",0,100,"50.00",0,0,0,""]',
                  custom_events:
                    '[{"_logTime":1567333011693,"_eventName":"spin_result","_valueToSum":0,"fb_currency":"INR","additional_bet_index":0,"battle_id":"N/A","bet_amount":9,"bet_level":1,"bet_multiplier":1,"coin_balance":9466052,"current_module_name":"CasinoGameModule","days_in_game":0,"extra_param":"N/A","fb_profile":"0","featureGameType":"N/A","game_fps":30,"game_id":"fireEagleBase","game_name":"FireEagleSlots","gem_balance":0,"graphicsQuality":"HD","idfa":"2bf99787-33d2-4ae2-a76a-c49672f97252","internetReachability":"ReachableViaLocalAreaNetwork","isLowEndDevice":"False","is_auto_spin":"False","is_turbo":"False","isf":"False","ishighroller":"False","jackpot_win_amount":90,"jackpot_win_type":"Silver","level":6,"lifetime_gem_balance":0,"no_of_spin":1,"player_total_battles":0,"player_total_shields":0,"start_date":"2019-08-01","total_payments":0,"tournament_id":"T1561970819","userId":"c82cbdff-e5be-4009-ac78-cdeea09ab4b1","versionSessionCount":2,"win_amount":0,"fb_content_id":["123","345"]}]',
                  'ud[em]': '48ddb93f0b30c475423fe177832912c5bcdce3cc72872f8051627967ef278e08',
                  advertiser_tracking_enabled: '0',
                  application_tracking_enabled: '0',
                  event: 'CUSTOM_APP_EVENTS',
                },
              },
              files: {},
              userId: 'c82cbdff-e5be-4009-ac78-cdeea09ab4b1',
              statusCode: 200,
            },
            statusCode: 200,
          },
        ],
      },
    },
  },
];
