import { head } from 'lodash';

export const data = [
  {
    name: 'webhook',
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
              context: {
                device: {
                  id: 'df16bffa-5c3d-4fbb-9bce-3bab098129a7R',
                  manufacturer: 'Xiaomi',
                  model: 'Redmi 6',
                  name: 'xiaomi',
                },
                network: {
                  carrier: 'Banglalink',
                },
                os: {
                  name: 'android',
                  version: '8.1.0',
                },
                traits: {
                  address: {
                    city: 'Dhaka',
                    country: 'Bangladesh',
                  },
                  anonymousId: 'c82cbdff-e5be-4009-ac78-cdeea09ab4b1',
                },
              },
              event: 'spin_result',
              integrations: {
                All: true,
              },
              message_id: 'a80f82be-9bdc-4a9f-b2a5-15621ee41df8',
              properties: {
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
                webhookUrl: 'http://6b0e6a60.ngrok.io',
                headers: [
                  {
                    from: '',
                    to: '',
                  },
                  {
                    from: 'test2',
                    to: 'value2',
                  },
                ],
              },
              DestinationDefinition: {
                Config: {
                  cdkV2Enabled: true,
                },
              },
            },
            metadata: {
              destinationId: 'destId',
              workspaceId: 'wspId',
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
                JSON: {
                  anonymousId: 'c82cbdff-e5be-4009-ac78-cdeea09ab4b1',
                  context: {
                    device: {
                      id: 'df16bffa-5c3d-4fbb-9bce-3bab098129a7R',
                      manufacturer: 'Xiaomi',
                      model: 'Redmi 6',
                      name: 'xiaomi',
                    },
                    network: {
                      carrier: 'Banglalink',
                    },
                    os: {
                      name: 'android',
                      version: '8.1.0',
                    },
                    traits: {
                      address: {
                        city: 'Dhaka',
                        country: 'Bangladesh',
                      },
                      anonymousId: 'c82cbdff-e5be-4009-ac78-cdeea09ab4b1',
                    },
                  },
                  event: 'spin_result',
                  integrations: {
                    All: true,
                  },
                  message_id: 'a80f82be-9bdc-4a9f-b2a5-15621ee41df8',
                  properties: {
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
                JSON_ARRAY: {},
                XML: {},
                FORM: {},
              },
              version: '1',
              userId: 'c82cbdff-e5be-4009-ac78-cdeea09ab4b1',
              type: 'REST',
              method: 'POST',
              endpoint: 'http://6b0e6a60.ngrok.io',
              headers: {
                'content-type': 'application/json',
                test2: 'value2',
              },
              params: {},
              files: {},
            },
            metadata: {
              destinationId: 'destId',
              workspaceId: 'wspId',
            },
            statusCode: 200,
          },
        ],
      },
    },
  },
  {
    name: 'webhook',
    description: 'Empty headers',
    feature: 'processor',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: [
          {
            message: {
              anonymousId: 'c82cbdff-e5be-4009-ac78-cdeea09ab4b1',
              context: {
                device: {
                  id: 'df16bffa-5c3d-4fbb-9bce-3bab098129a7R',
                  manufacturer: 'Xiaomi',
                  model: 'Redmi 6',
                  name: 'xiaomi',
                },
                network: {
                  carrier: 'Banglalink',
                },
                os: {
                  name: 'android',
                  version: '8.1.0',
                },
                traits: {
                  address: {
                    city: 'Dhaka',
                    country: 'Bangladesh',
                  },
                  anonymousId: 'c82cbdff-e5be-4009-ac78-cdeea09ab4b1',
                },
              },
              header: {},
              event: 'spin_result',
              integrations: {
                All: true,
              },
              message_id: 'a80f82be-9bdc-4a9f-b2a5-15621ee41df8',
              properties: {
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
                webhookUrl: 'http://6b0e6a60.ngrok.io',
                headers: [
                  {
                    from: '',
                    to: '',
                  },
                  {
                    from: 'test2',
                    to: 'value2',
                  },
                ],
              },
              DestinationDefinition: {
                Config: {
                  cdkV2Enabled: true,
                },
              },
            },
            metadata: {
              destinationId: 'destId',
              workspaceId: 'wspId',
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
                JSON: {
                  anonymousId: 'c82cbdff-e5be-4009-ac78-cdeea09ab4b1',
                  context: {
                    device: {
                      id: 'df16bffa-5c3d-4fbb-9bce-3bab098129a7R',
                      manufacturer: 'Xiaomi',
                      model: 'Redmi 6',
                      name: 'xiaomi',
                    },
                    network: {
                      carrier: 'Banglalink',
                    },
                    os: {
                      name: 'android',
                      version: '8.1.0',
                    },
                    traits: {
                      address: {
                        city: 'Dhaka',
                        country: 'Bangladesh',
                      },
                      anonymousId: 'c82cbdff-e5be-4009-ac78-cdeea09ab4b1',
                    },
                  },
                  event: 'spin_result',
                  integrations: {
                    All: true,
                  },
                  message_id: 'a80f82be-9bdc-4a9f-b2a5-15621ee41df8',
                  properties: {
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
                JSON_ARRAY: {},
                XML: {},
                FORM: {},
              },
              version: '1',
              userId: 'c82cbdff-e5be-4009-ac78-cdeea09ab4b1',
              type: 'REST',
              method: 'POST',
              endpoint: 'http://6b0e6a60.ngrok.io',
              headers: {
                'content-type': 'application/json',
                test2: 'value2',
              },
              params: {},
              files: {},
            },
            metadata: {
              destinationId: 'destId',
              workspaceId: 'wspId',
            },
            statusCode: 200,
          },
        ],
      },
    },
  },
  {
    name: 'webhook',
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
              context: {
                device: {
                  id: 'df16bffa-5c3d-4fbb-9bce-3bab098129a7R',
                  manufacturer: 'Xiaomi',
                  model: 'Redmi 6',
                  name: 'xiaomi',
                },
                network: {
                  carrier: 'Banglalink',
                },
                os: {
                  name: 'android',
                  version: '8.1.0',
                },
                traits: {
                  address: {
                    city: 'Dhaka',
                    country: 'Bangladesh',
                  },
                  anonymousId: 'c82cbdff-e5be-4009-ac78-cdeea09ab4b1',
                },
              },
              event: 'spin_result',
              integrations: {
                All: true,
              },
              message_id: 'a80f82be-9bdc-4a9f-b2a5-15621ee41df8',
              properties: {
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
                webhookUrl: 'https://6b0e6a60.ngrok.io/n',
              },
              DestinationDefinition: {
                Config: {
                  cdkV2Enabled: true,
                },
              },
            },
            metadata: {
              destinationId: 'destId',
              workspaceId: 'wspId',
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
                JSON: {
                  anonymousId: 'c82cbdff-e5be-4009-ac78-cdeea09ab4b1',
                  context: {
                    device: {
                      id: 'df16bffa-5c3d-4fbb-9bce-3bab098129a7R',
                      manufacturer: 'Xiaomi',
                      model: 'Redmi 6',
                      name: 'xiaomi',
                    },
                    network: {
                      carrier: 'Banglalink',
                    },
                    os: {
                      name: 'android',
                      version: '8.1.0',
                    },
                    traits: {
                      address: {
                        city: 'Dhaka',
                        country: 'Bangladesh',
                      },
                      anonymousId: 'c82cbdff-e5be-4009-ac78-cdeea09ab4b1',
                    },
                  },
                  event: 'spin_result',
                  integrations: {
                    All: true,
                  },
                  message_id: 'a80f82be-9bdc-4a9f-b2a5-15621ee41df8',
                  properties: {
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
                JSON_ARRAY: {},
                XML: {},
                FORM: {},
              },
              version: '1',
              userId: 'c82cbdff-e5be-4009-ac78-cdeea09ab4b1',
              type: 'REST',
              method: 'POST',
              endpoint: 'https://6b0e6a60.ngrok.io/n',
              headers: {
                'content-type': 'application/json',
              },
              params: {},
              files: {},
            },
            metadata: {
              destinationId: 'destId',
              workspaceId: 'wspId',
            },
            statusCode: 200,
          },
        ],
      },
    },
  },
  {
    name: 'webhook',
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
              context: {
                device: {
                  id: 'df16bffa-5c3d-4fbb-9bce-3bab098129a7R',
                  manufacturer: 'Xiaomi',
                  model: 'Redmi 6',
                  name: 'xiaomi',
                },
                network: {
                  carrier: 'Banglalink',
                },
                os: {
                  name: 'android',
                  version: '8.1.0',
                },
                traits: {
                  address: {
                    city: 'Dhaka',
                    country: 'Bangladesh',
                  },
                  anonymousId: 'c82cbdff-e5be-4009-ac78-cdeea09ab4b1',
                },
              },
              event: 'spin_result',
              integrations: {
                All: true,
              },
              message_id: 'a80f82be-9bdc-4a9f-b2a5-15621ee41df8',
              properties: {
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
                webhookUrl: 'https://6b0e6a60.',
              },
              DestinationDefinition: {
                Config: {
                  cdkV2Enabled: true,
                },
              },
            },
            metadata: {
              destinationId: 'destId',
              workspaceId: 'wspId',
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
                JSON: {
                  anonymousId: 'c82cbdff-e5be-4009-ac78-cdeea09ab4b1',
                  context: {
                    device: {
                      id: 'df16bffa-5c3d-4fbb-9bce-3bab098129a7R',
                      manufacturer: 'Xiaomi',
                      model: 'Redmi 6',
                      name: 'xiaomi',
                    },
                    network: {
                      carrier: 'Banglalink',
                    },
                    os: {
                      name: 'android',
                      version: '8.1.0',
                    },
                    traits: {
                      address: {
                        city: 'Dhaka',
                        country: 'Bangladesh',
                      },
                      anonymousId: 'c82cbdff-e5be-4009-ac78-cdeea09ab4b1',
                    },
                  },
                  event: 'spin_result',
                  integrations: {
                    All: true,
                  },
                  message_id: 'a80f82be-9bdc-4a9f-b2a5-15621ee41df8',
                  properties: {
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
                JSON_ARRAY: {},
                XML: {},
                FORM: {},
              },
              version: '1',
              userId: 'c82cbdff-e5be-4009-ac78-cdeea09ab4b1',
              type: 'REST',
              method: 'POST',
              endpoint: 'https://6b0e6a60.',
              headers: {
                'content-type': 'application/json',
              },
              params: {},
              files: {},
            },
            metadata: {
              destinationId: 'destId',
              workspaceId: 'wspId',
            },
            statusCode: 200,
          },
        ],
      },
    },
  },
  {
    name: 'webhook',
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
              context: {
                device: {
                  id: 'df16bffa-5c3d-4fbb-9bce-3bab098129a7R',
                  manufacturer: 'Xiaomi',
                  model: 'Redmi 6',
                  name: 'xiaomi',
                },
                network: {
                  carrier: 'Banglalink',
                },
                os: {
                  name: 'android',
                  version: '8.1.0',
                },
                traits: {
                  address: {
                    city: 'Dhaka',
                    country: 'Bangladesh',
                  },
                  anonymousId: 'c82cbdff-e5be-4009-ac78-cdeea09ab4b1',
                },
              },
              event: 'spin_result',
              integrations: {
                All: true,
              },
              message_id: 'a80f82be-9bdc-4a9f-b2a5-15621ee41df8',
              properties: {
                k1: 'v1',
                k2: {
                  k3: 'c3',
                  k4: {
                    k5: 'c5',
                  },
                },
              },
              timestamp: '2019-09-01T15:46:51.693229+05:30',
              type: 'track',
            },
            destination: {
              Config: {
                webhookUrl: 'https://6b0e6a60.',
                webhookMethod: 'GET',
                headers: [
                  {
                    from: 'X-customHeader',
                    to: 'customHeaderVal',
                  },
                ],
              },
              DestinationDefinition: {
                Config: {
                  cdkV2Enabled: true,
                },
              },
            },
            metadata: {
              destinationId: 'destId',
              workspaceId: 'wspId',
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
                JSON: {},
                JSON_ARRAY: {},
                XML: {},
                FORM: {},
              },
              version: '1',
              userId: 'c82cbdff-e5be-4009-ac78-cdeea09ab4b1',
              type: 'REST',
              method: 'GET',
              endpoint: 'https://6b0e6a60.',
              headers: {
                'x-customheader': 'customHeaderVal',
              },
              params: {
                k1: 'v1',
                'k2.k3': 'c3',
                'k2.k4.k5': 'c5',
              },
              files: {},
            },
            metadata: {
              destinationId: 'destId',
              workspaceId: 'wspId',
            },
            statusCode: 200,
          },
        ],
      },
    },
  },
  {
    name: 'webhook',
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
              context: {
                device: {
                  id: 'df16bffa-5c3d-4fbb-9bce-3bab098129a7R',
                  manufacturer: 'Xiaomi',
                  model: 'Redmi 6',
                  name: 'xiaomi',
                },
                network: {
                  carrier: 'Banglalink',
                },
                os: {
                  name: 'android',
                  version: '8.1.0',
                },
                traits: {
                  address: {
                    city: 'Dhaka',
                    country: 'Bangladesh',
                  },
                  anonymousId: 'c82cbdff-e5be-4009-ac78-cdeea09ab4b1',
                },
              },
              event: 'spin_result',
              integrations: {
                All: true,
              },
              message_id: 'a80f82be-9bdc-4a9f-b2a5-15621ee41df8',
              properties: {
                k1: 'v1',
                k2: {
                  k3: 'c3',
                  k4: {
                    k5: 'c5',
                  },
                },
              },
              timestamp: '2019-09-01T15:46:51.693229+05:30',
              type: 'track',
            },
            destination: {
              Config: {
                webhookUrl: 'https://6b0e6a60.',
                webhookMethod: 'GET',
              },
              DestinationDefinition: {
                Config: {
                  cdkV2Enabled: true,
                },
              },
            },
            metadata: {
              destinationId: 'destId',
              workspaceId: 'wspId',
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
                JSON: {},
                JSON_ARRAY: {},
                XML: {},
                FORM: {},
              },
              version: '1',
              userId: 'c82cbdff-e5be-4009-ac78-cdeea09ab4b1',
              type: 'REST',
              method: 'GET',
              endpoint: 'https://6b0e6a60.',
              headers: {},
              params: {
                k1: 'v1',
                'k2.k3': 'c3',
                'k2.k4.k5': 'c5',
              },
              files: {},
            },
            metadata: {
              destinationId: 'destId',
              workspaceId: 'wspId',
            },
            statusCode: 200,
          },
        ],
      },
    },
  },
  {
    name: 'webhook',
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
              context: {
                device: {
                  id: 'df16bffa-5c3d-4fbb-9bce-3bab098129a7R',
                  manufacturer: 'Xiaomi',
                  model: 'Redmi 6',
                  name: 'xiaomi',
                },
                network: {
                  carrier: 'Banglalink',
                },
                os: {
                  name: 'android',
                  version: '8.1.0',
                },
                traits: {
                  address: {
                    city: 'Dhaka',
                    country: 'Bangladesh',
                  },
                  anonymousId: 'c82cbdff-e5be-4009-ac78-cdeea09ab4b1',
                },
              },
              event: 'spin_result',
              integrations: {
                All: true,
              },
              message_id: 'a80f82be-9bdc-4a9f-b2a5-15621ee41df8',
              properties: {
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
              },
              timestamp: '2019-09-01T15:46:51.693229+05:30',
              type: 'track',
              request_ip: '127.0.0.1',
            },
            destination: {
              Config: {
                webhookUrl: 'http://6b0e6a60.ngrok.io',
                header: [
                  {
                    from: 'test1',
                    to: 'value1',
                  },
                  {
                    from: 'test2',
                    to: 'value2',
                  },
                ],
              },
              DestinationDefinition: {
                Config: {
                  cdkV2Enabled: true,
                },
              },
            },
            metadata: {
              destinationId: 'destId',
              workspaceId: 'wspId',
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
                JSON: {
                  anonymousId: 'c82cbdff-e5be-4009-ac78-cdeea09ab4b1',
                  context: {
                    device: {
                      id: 'df16bffa-5c3d-4fbb-9bce-3bab098129a7R',
                      manufacturer: 'Xiaomi',
                      model: 'Redmi 6',
                      name: 'xiaomi',
                    },
                    network: {
                      carrier: 'Banglalink',
                    },
                    os: {
                      name: 'android',
                      version: '8.1.0',
                    },
                    traits: {
                      address: {
                        city: 'Dhaka',
                        country: 'Bangladesh',
                      },
                      anonymousId: 'c82cbdff-e5be-4009-ac78-cdeea09ab4b1',
                    },
                    ip: '127.0.0.1',
                  },
                  event: 'spin_result',
                  integrations: {
                    All: true,
                  },
                  message_id: 'a80f82be-9bdc-4a9f-b2a5-15621ee41df8',
                  properties: {
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
                  },
                  timestamp: '2019-09-01T15:46:51.693229+05:30',
                  type: 'track',
                  request_ip: '127.0.0.1',
                },
                JSON_ARRAY: {},
                XML: {},
                FORM: {},
              },
              version: '1',
              userId: 'c82cbdff-e5be-4009-ac78-cdeea09ab4b1',
              type: 'REST',
              method: 'POST',
              endpoint: 'http://6b0e6a60.ngrok.io',
              headers: {
                'content-type': 'application/json',
              },
              params: {},
              files: {},
            },
            metadata: {
              destinationId: 'destId',
              workspaceId: 'wspId',
            },
            statusCode: 200,
          },
        ],
      },
    },
  },
  {
    name: 'webhook',
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
              context: {
                device: {
                  id: 'df16bffa-5c3d-4fbb-9bce-3bab098129a7R',
                  manufacturer: 'Xiaomi',
                  model: 'Redmi 6',
                  name: 'xiaomi',
                },
                network: {
                  carrier: 'Banglalink',
                },
                os: {
                  name: 'android',
                  version: '8.1.0',
                },
                traits: {
                  address: {
                    city: 'Dhaka',
                    country: 'Bangladesh',
                  },
                  anonymousId: 'c82cbdff-e5be-4009-ac78-cdeea09ab4b1',
                },
              },
              event: 'spin_result',
              integrations: {
                All: true,
              },
              message_id: 'a80f82be-9bdc-4a9f-b2a5-15621ee41df8',
              properties: {
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
              },
              timestamp: '2019-09-01T15:46:51.693229+05:30',
              type: 'track',
              request_ip: '127.0.0.1',
            },
            destination: {
              Config: {
                webhookUrl: 'http://6b0e6a60.ngrok.io',
                headers: [
                  {
                    from: 'Content-Type',
                    to: 'application/xml',
                  },
                  {
                    from: 'test2',
                    to: 'value2',
                  },
                ],
              },
              DestinationDefinition: {
                Config: {
                  cdkV2Enabled: true,
                },
              },
            },
            metadata: {
              destinationId: 'destId',
              workspaceId: 'wspId',
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
                JSON: {
                  anonymousId: 'c82cbdff-e5be-4009-ac78-cdeea09ab4b1',
                  context: {
                    device: {
                      id: 'df16bffa-5c3d-4fbb-9bce-3bab098129a7R',
                      manufacturer: 'Xiaomi',
                      model: 'Redmi 6',
                      name: 'xiaomi',
                    },
                    network: {
                      carrier: 'Banglalink',
                    },
                    os: {
                      name: 'android',
                      version: '8.1.0',
                    },
                    traits: {
                      address: {
                        city: 'Dhaka',
                        country: 'Bangladesh',
                      },
                      anonymousId: 'c82cbdff-e5be-4009-ac78-cdeea09ab4b1',
                    },
                    ip: '127.0.0.1',
                  },
                  event: 'spin_result',
                  integrations: {
                    All: true,
                  },
                  message_id: 'a80f82be-9bdc-4a9f-b2a5-15621ee41df8',
                  properties: {
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
                  },
                  timestamp: '2019-09-01T15:46:51.693229+05:30',
                  type: 'track',
                  request_ip: '127.0.0.1',
                },
                JSON_ARRAY: {},
                XML: {},
                FORM: {},
              },
              version: '1',
              userId: 'c82cbdff-e5be-4009-ac78-cdeea09ab4b1',
              type: 'REST',
              method: 'POST',
              endpoint: 'http://6b0e6a60.ngrok.io',
              headers: {
                'content-type': 'application/xml',
                test2: 'value2',
              },
              params: {},
              files: {},
            },
            metadata: {
              destinationId: 'destId',
              workspaceId: 'wspId',
            },
            statusCode: 200,
          },
        ],
      },
    },
  },
  {
    name: 'webhook',
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
              event: 'spin_result',
              integrations: {
                All: true,
              },
              message_id: 'a80f82be-9bdc-4a9f-b2a5-15621ee41df8',
              properties: {
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
              },
              timestamp: '2019-09-01T15:46:51.693229+05:30',
              type: 'track',
            },
            destination: {
              Config: {
                webhookUrl: 'http://6b0e6a60.ngrok.io',
                headers: [
                  {
                    from: 'Content-Type',
                    to: 'application/xml',
                  },
                  {
                    from: 'test2',
                    to: 'value2',
                  },
                ],
              },
              DestinationDefinition: {
                Config: {
                  cdkV2Enabled: true,
                },
              },
            },
            metadata: {
              destinationId: 'destId',
              workspaceId: 'wspId',
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
                JSON: {
                  anonymousId: 'c82cbdff-e5be-4009-ac78-cdeea09ab4b1',
                  event: 'spin_result',
                  integrations: {
                    All: true,
                  },
                  message_id: 'a80f82be-9bdc-4a9f-b2a5-15621ee41df8',
                  properties: {
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
                  },
                  timestamp: '2019-09-01T15:46:51.693229+05:30',
                  type: 'track',
                },
                JSON_ARRAY: {},
                XML: {},
                FORM: {},
              },
              version: '1',
              userId: 'c82cbdff-e5be-4009-ac78-cdeea09ab4b1',
              type: 'REST',
              method: 'POST',
              endpoint: 'http://6b0e6a60.ngrok.io',
              headers: {
                'content-type': 'application/xml',
                test2: 'value2',
              },
              params: {},
              files: {},
            },
            metadata: {
              destinationId: 'destId',
              workspaceId: 'wspId',
            },
            statusCode: 200,
          },
        ],
      },
    },
  },
  {
    name: 'webhook',
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
              context: {
                device: {
                  id: 'df16bffa-5c3d-4fbb-9bce-3bab098129a7R',
                  manufacturer: 'Xiaomi',
                  model: 'Redmi 6',
                  name: 'xiaomi',
                },
                network: {
                  carrier: 'Banglalink',
                },
                os: {
                  name: 'android',
                  version: '8.1.0',
                },
                traits: {
                  address: {
                    city: 'Dhaka',
                    country: 'Bangladesh',
                  },
                  anonymousId: 'c82cbdff-e5be-4009-ac78-cdeea09ab4b1',
                },
              },
              event: 'spin_result',
              integrations: {
                All: true,
              },
              message_id: 'a80f82be-9bdc-4a9f-b2a5-15621ee41df8',
              properties: {
                additional_bet_index: 0,
                battle_id: 'N/A',
                featureGameType: 'N/A',
                win_amount: 0,
              },
              timestamp: '2019-09-01T15:46:51.693229+05:30',
              type: 'track',
              header: {
                dynamic_header_key_string: 'dynamic_header_value_string',
                dynamic_header_key_num: 10,
                dynamic_header_key_object: {
                  k1: 'v1',
                },
              },
              appendPath: '/product/search?string=value',
            },
            destination: {
              Config: {
                webhookUrl: 'http://6b0e6a60.ngrok.io',
                headers: [
                  {
                    from: '',
                    to: '',
                  },
                  {
                    from: 'test2',
                    to: 'value2',
                  },
                ],
              },
              DestinationDefinition: {
                Config: {
                  cdkV2Enabled: true,
                },
              },
            },
            metadata: {
              destinationId: 'destId',
              workspaceId: 'wspId',
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
                JSON: {
                  anonymousId: 'c82cbdff-e5be-4009-ac78-cdeea09ab4b1',
                  context: {
                    device: {
                      id: 'df16bffa-5c3d-4fbb-9bce-3bab098129a7R',
                      manufacturer: 'Xiaomi',
                      model: 'Redmi 6',
                      name: 'xiaomi',
                    },
                    network: {
                      carrier: 'Banglalink',
                    },
                    os: {
                      name: 'android',
                      version: '8.1.0',
                    },
                    traits: {
                      address: {
                        city: 'Dhaka',
                        country: 'Bangladesh',
                      },
                      anonymousId: 'c82cbdff-e5be-4009-ac78-cdeea09ab4b1',
                    },
                  },
                  event: 'spin_result',
                  integrations: {
                    All: true,
                  },
                  message_id: 'a80f82be-9bdc-4a9f-b2a5-15621ee41df8',
                  properties: {
                    additional_bet_index: 0,
                    battle_id: 'N/A',
                    featureGameType: 'N/A',
                    win_amount: 0,
                  },
                  timestamp: '2019-09-01T15:46:51.693229+05:30',
                  type: 'track',
                },
                JSON_ARRAY: {},
                XML: {},
                FORM: {},
              },
              version: '1',
              userId: 'c82cbdff-e5be-4009-ac78-cdeea09ab4b1',
              type: 'REST',
              method: 'POST',
              endpoint: 'http://6b0e6a60.ngrok.io/product/search?string=value',
              headers: {
                'content-type': 'application/json',
                test2: 'value2',
                dynamic_header_key_string: 'dynamic_header_value_string',
                dynamic_header_key_num: '10',
                dynamic_header_key_object: '{"k1":"v1"}',
              },
              params: {},
              files: {},
            },
            metadata: {
              destinationId: 'destId',
              workspaceId: 'wspId',
            },
            statusCode: 200,
          },
        ],
      },
    },
  },
  {
    name: 'webhook',
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
              context: {
                device: {
                  id: 'df16bffa-5c3d-4fbb-9bce-3bab098129a7R',
                  manufacturer: 'Xiaomi',
                  model: 'Redmi 6',
                  name: 'xiaomi',
                },
                network: {
                  carrier: 'Banglalink',
                },
                os: {
                  name: 'android',
                  version: '8.1.0',
                },
                traits: {
                  address: {
                    city: 'Dhaka',
                    country: 'Bangladesh',
                  },
                  anonymousId: 'c82cbdff-e5be-4009-ac78-cdeea09ab4b1',
                },
              },
              event: 'spin_result',
              integrations: {
                All: true,
              },
              message_id: 'a80f82be-9bdc-4a9f-b2a5-15621ee41df8',
              properties: {
                additional_bet_index: 0,
                battle_id: 'N/A',
                featureGameType: 'N/A',
                win_amount: 0,
              },
              timestamp: '2019-09-01T15:46:51.693229+05:30',
              type: 'track',
              fullPath: 'https://www.google.com',
            },
            destination: {
              Config: {
                webhookUrl: 'http://6b0e6a60.ngrok.io',
                headers: [
                  {
                    from: '',
                    to: '',
                  },
                  {
                    from: 'test2',
                    to: 'value2',
                  },
                ],
              },
              DestinationDefinition: {
                Config: {
                  cdkV2Enabled: true,
                },
              },
            },
            metadata: {
              destinationId: 'destId',
              workspaceId: 'wspId',
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
                JSON: {
                  anonymousId: 'c82cbdff-e5be-4009-ac78-cdeea09ab4b1',
                  context: {
                    device: {
                      id: 'df16bffa-5c3d-4fbb-9bce-3bab098129a7R',
                      manufacturer: 'Xiaomi',
                      model: 'Redmi 6',
                      name: 'xiaomi',
                    },
                    network: {
                      carrier: 'Banglalink',
                    },
                    os: {
                      name: 'android',
                      version: '8.1.0',
                    },
                    traits: {
                      address: {
                        city: 'Dhaka',
                        country: 'Bangladesh',
                      },
                      anonymousId: 'c82cbdff-e5be-4009-ac78-cdeea09ab4b1',
                    },
                  },
                  event: 'spin_result',
                  integrations: {
                    All: true,
                  },
                  message_id: 'a80f82be-9bdc-4a9f-b2a5-15621ee41df8',
                  properties: {
                    additional_bet_index: 0,
                    battle_id: 'N/A',
                    featureGameType: 'N/A',
                    win_amount: 0,
                  },
                  timestamp: '2019-09-01T15:46:51.693229+05:30',
                  type: 'track',
                },
                JSON_ARRAY: {},
                XML: {},
                FORM: {},
              },
              version: '1',
              userId: 'c82cbdff-e5be-4009-ac78-cdeea09ab4b1',
              type: 'REST',
              method: 'POST',
              endpoint: 'https://www.google.com',
              headers: {
                'content-type': 'application/json',
                test2: 'value2',
              },
              params: {},
              files: {},
            },
            metadata: {
              destinationId: 'destId',
              workspaceId: 'wspId',
            },
            statusCode: 200,
          },
        ],
      },
    },
  },
  {
    name: 'webhook',
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
              context: {
                device: {
                  id: 'df16bffa-5c3d-4fbb-9bce-3bab098129a7R',
                  manufacturer: 'Xiaomi',
                  model: 'Redmi 6',
                  name: 'xiaomi',
                },
                network: {
                  carrier: 'Banglalink',
                },
                os: {
                  name: 'android',
                  version: '8.1.0',
                },
                traits: {
                  address: {
                    city: 'Dhaka',
                    country: 'Bangladesh',
                  },
                  anonymousId: 'c82cbdff-e5be-4009-ac78-cdeea09ab4b1',
                },
              },
              event: 'spin_result',
              integrations: {
                All: true,
              },
              message_id: 'a80f82be-9bdc-4a9f-b2a5-15621ee41df8',
              properties: {
                additional_bet_index: 0,
                battle_id: 'N/A',
                featureGameType: 'N/A',
                win_amount: 0,
              },
              timestamp: '2019-09-01T15:46:51.693229+05:30',
              type: 'track',
              fullPath: 'https://www.google.com/',
              appendPath: '?searchTerms=cats',
            },
            destination: {
              Config: {
                webhookUrl: 'http://6b0e6a60.ngrok.io',
                headers: [
                  {
                    from: '',
                    to: '',
                  },
                  {
                    from: 'test2',
                    to: 'value2',
                  },
                ],
              },
              DestinationDefinition: {
                Config: {
                  cdkV2Enabled: true,
                },
              },
            },
            metadata: {
              destinationId: 'destId',
              workspaceId: 'wspId',
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
                JSON: {
                  anonymousId: 'c82cbdff-e5be-4009-ac78-cdeea09ab4b1',
                  context: {
                    device: {
                      id: 'df16bffa-5c3d-4fbb-9bce-3bab098129a7R',
                      manufacturer: 'Xiaomi',
                      model: 'Redmi 6',
                      name: 'xiaomi',
                    },
                    network: {
                      carrier: 'Banglalink',
                    },
                    os: {
                      name: 'android',
                      version: '8.1.0',
                    },
                    traits: {
                      address: {
                        city: 'Dhaka',
                        country: 'Bangladesh',
                      },
                      anonymousId: 'c82cbdff-e5be-4009-ac78-cdeea09ab4b1',
                    },
                  },
                  event: 'spin_result',
                  integrations: {
                    All: true,
                  },
                  message_id: 'a80f82be-9bdc-4a9f-b2a5-15621ee41df8',
                  properties: {
                    additional_bet_index: 0,
                    battle_id: 'N/A',
                    featureGameType: 'N/A',
                    win_amount: 0,
                  },
                  timestamp: '2019-09-01T15:46:51.693229+05:30',
                  type: 'track',
                },
                JSON_ARRAY: {},
                XML: {},
                FORM: {},
              },
              version: '1',
              userId: 'c82cbdff-e5be-4009-ac78-cdeea09ab4b1',
              type: 'REST',
              method: 'POST',
              endpoint: 'https://www.google.com/?searchTerms=cats',
              headers: {
                'content-type': 'application/json',
                test2: 'value2',
              },
              params: {},
              files: {},
            },
            metadata: {
              destinationId: 'destId',
              workspaceId: 'wspId',
            },
            statusCode: 200,
          },
        ],
      },
    },
  },
  {
    name: 'webhook',
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
              context: {
                device: {
                  id: 'df16bffa-5c3d-4fbb-9bce-3bab098129a7R',
                  manufacturer: 'Xiaomi',
                  model: 'Redmi 6',
                  name: 'xiaomi',
                },
                network: {
                  carrier: 'Banglalink',
                },
                os: {
                  name: 'android',
                  version: '8.1.0',
                },
                traits: {
                  address: {
                    city: 'Dhaka',
                    country: 'Bangladesh',
                  },
                  anonymousId: 'c82cbdff-e5be-4009-ac78-cdeea09ab4b1',
                },
              },
              event: 'spin_result',
              integrations: {
                All: true,
              },
              message_id: 'a80f82be-9bdc-4a9f-b2a5-15621ee41df8',
              properties: {
                additional_bet_index: 0,
                battle_id: 'N/A',
                featureGameType: 'N/A',
                win_amount: 0,
              },
              timestamp: '2019-09-01T15:46:51.693229+05:30',
              type: 'track',
              fullPath: 'https://www.google.com/',
              appendPath: '?searchTerms=cats',
            },
            destination: {
              Config: {
                webhookUrl: 'http://6b0e6a60.ngrok.io',
                webhookMethod: 'PUT',
                headers: [
                  {
                    from: '',
                    to: '',
                  },
                  {
                    from: 'test2',
                    to: 'value2',
                  },
                ],
              },
              DestinationDefinition: {
                Config: {
                  cdkV2Enabled: true,
                },
              },
            },
            metadata: {
              destinationId: 'destId',
              workspaceId: 'wspId',
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
                JSON: {
                  anonymousId: 'c82cbdff-e5be-4009-ac78-cdeea09ab4b1',
                  context: {
                    device: {
                      id: 'df16bffa-5c3d-4fbb-9bce-3bab098129a7R',
                      manufacturer: 'Xiaomi',
                      model: 'Redmi 6',
                      name: 'xiaomi',
                    },
                    network: {
                      carrier: 'Banglalink',
                    },
                    os: {
                      name: 'android',
                      version: '8.1.0',
                    },
                    traits: {
                      address: {
                        city: 'Dhaka',
                        country: 'Bangladesh',
                      },
                      anonymousId: 'c82cbdff-e5be-4009-ac78-cdeea09ab4b1',
                    },
                  },
                  event: 'spin_result',
                  integrations: {
                    All: true,
                  },
                  message_id: 'a80f82be-9bdc-4a9f-b2a5-15621ee41df8',
                  properties: {
                    additional_bet_index: 0,
                    battle_id: 'N/A',
                    featureGameType: 'N/A',
                    win_amount: 0,
                  },
                  timestamp: '2019-09-01T15:46:51.693229+05:30',
                  type: 'track',
                },
                JSON_ARRAY: {},
                XML: {},
                FORM: {},
              },
              version: '1',
              userId: 'c82cbdff-e5be-4009-ac78-cdeea09ab4b1',
              type: 'REST',
              method: 'PUT',
              endpoint: 'https://www.google.com/?searchTerms=cats',
              headers: {
                'content-type': 'application/json',
                test2: 'value2',
              },
              params: {},
              files: {},
            },
            metadata: {
              destinationId: 'destId',
              workspaceId: 'wspId',
            },
            statusCode: 200,
          },
        ],
      },
    },
  },
  {
    name: 'webhook',
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
              context: {
                device: {
                  id: 'df16bffa-5c3d-4fbb-9bce-3bab098129a7R',
                  manufacturer: 'Xiaomi',
                  model: 'Redmi 6',
                  name: 'xiaomi',
                },
                network: {
                  carrier: 'Banglalink',
                },
                os: {
                  name: 'android',
                  version: '8.1.0',
                },
                traits: {
                  address: {
                    city: 'Dhaka',
                    country: 'Bangladesh',
                  },
                  anonymousId: 'c82cbdff-e5be-4009-ac78-cdeea09ab4b1',
                },
              },
              event: 'spin_result',
              integrations: {
                All: true,
              },
              message_id: 'a80f82be-9bdc-4a9f-b2a5-15621ee41df8',
              properties: {
                additional_bet_index: 0,
                battle_id: 'N/A',
                featureGameType: 'N/A',
                win_amount: 0,
              },
              timestamp: '2019-09-01T15:46:51.693229+05:30',
              type: 'track',
              fullPath: 'https://www.google.com/',
              appendPath: '?searchTerms=cats',
            },
            destination: {
              Config: {
                webhookUrl: 'http://6b0e6a60.ngrok.io',
                webhookMethod: 'DELETE',
                headers: [
                  {
                    from: '',
                    to: '',
                  },
                  {
                    from: 'test2',
                    to: 'value2',
                  },
                ],
              },
              DestinationDefinition: {
                Config: {
                  cdkV2Enabled: true,
                },
              },
            },
            metadata: {
              destinationId: 'destId',
              workspaceId: 'wspId',
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
                JSON: {},
                JSON_ARRAY: {},
                XML: {},
                FORM: {},
              },
              version: '1',
              userId: 'c82cbdff-e5be-4009-ac78-cdeea09ab4b1',
              type: 'REST',
              method: 'DELETE',
              endpoint: 'https://www.google.com/?searchTerms=cats',
              headers: {
                test2: 'value2',
              },
              params: {
                additional_bet_index: 0,
                battle_id: 'N/A',
                featureGameType: 'N/A',
                win_amount: 0,
              },
              files: {},
            },
            metadata: {
              destinationId: 'destId',
              workspaceId: 'wspId',
            },
            statusCode: 200,
          },
        ],
      },
    },
  },
  {
    name: 'webhook',
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
              context: {
                device: {
                  id: 'df16bffa-5c3d-4fbb-9bce-3bab098129a7R',
                  manufacturer: 'Xiaomi',
                  model: 'Redmi 6',
                  name: 'xiaomi',
                },
                network: {
                  carrier: 'Banglalink',
                },
                os: {
                  name: 'android',
                  version: '8.1.0',
                },
                traits: {
                  address: {
                    city: 'Dhaka',
                    country: 'Bangladesh',
                  },
                  anonymousId: 'c82cbdff-e5be-4009-ac78-cdeea09ab4b1',
                },
              },
              event: 'spin_result',
              integrations: {
                All: true,
              },
              message_id: 'a80f82be-9bdc-4a9f-b2a5-15621ee41df8',
              properties: {
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
                webhookUrl: 'http://6b0e6a60.ngrok.io',
                webhookMethod: 'POST',
                headers: [
                  {
                    from: 'test2',
                    to: 'value2',
                  },
                ],
              },
              DestinationDefinition: {
                Config: {
                  cdkV2Enabled: true,
                },
              },
            },
            metadata: {
              destinationId: 'destId',
              workspaceId: 'wspId',
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
                JSON: {
                  anonymousId: 'c82cbdff-e5be-4009-ac78-cdeea09ab4b1',
                  context: {
                    device: {
                      id: 'df16bffa-5c3d-4fbb-9bce-3bab098129a7R',
                      manufacturer: 'Xiaomi',
                      model: 'Redmi 6',
                      name: 'xiaomi',
                    },
                    network: {
                      carrier: 'Banglalink',
                    },
                    os: {
                      name: 'android',
                      version: '8.1.0',
                    },
                    traits: {
                      address: {
                        city: 'Dhaka',
                        country: 'Bangladesh',
                      },
                      anonymousId: 'c82cbdff-e5be-4009-ac78-cdeea09ab4b1',
                    },
                  },
                  event: 'spin_result',
                  integrations: {
                    All: true,
                  },
                  message_id: 'a80f82be-9bdc-4a9f-b2a5-15621ee41df8',
                  properties: {
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
                JSON_ARRAY: {},
                XML: {},
                FORM: {},
              },
              version: '1',
              userId: 'c82cbdff-e5be-4009-ac78-cdeea09ab4b1',
              type: 'REST',
              method: 'POST',
              endpoint: 'http://6b0e6a60.ngrok.io',
              headers: {
                'content-type': 'application/json',
                test2: 'value2',
              },
              params: {},
              files: {},
            },
            metadata: {
              destinationId: 'destId',
              workspaceId: 'wspId',
            },
            statusCode: 200,
          },
        ],
      },
    },
  },
  {
    name: 'webhook',
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
              context: {
                device: {
                  id: 'df16bffa-5c3d-4fbb-9bce-3bab098129a7R',
                  manufacturer: 'Xiaomi',
                  model: 'Redmi 6',
                  name: 'xiaomi',
                },
                network: {
                  carrier: 'Banglalink',
                },
                os: {
                  name: 'android',
                  version: '8.1.0',
                },
                traits: {
                  address: {
                    city: 'Dhaka',
                    country: 'Bangladesh',
                  },
                  anonymousId: 'c82cbdff-e5be-4009-ac78-cdeea09ab4b1',
                },
              },
              event: 'spin_result',
              integrations: {
                All: true,
              },
              message_id: 'a80f82be-9bdc-4a9f-b2a5-15621ee41df8',
              properties: {
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
                webhookUrl: 'http://6b0e6a60.ngrok.io',
                webhookMethod: 'PATCH',
                headers: [
                  {
                    from: 'test2',
                    to: 'value2',
                  },
                ],
              },
              DestinationDefinition: {
                Config: {
                  cdkV2Enabled: true,
                },
              },
            },
            metadata: {
              destinationId: 'destId',
              workspaceId: 'wspId',
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
                JSON: {
                  anonymousId: 'c82cbdff-e5be-4009-ac78-cdeea09ab4b1',
                  context: {
                    device: {
                      id: 'df16bffa-5c3d-4fbb-9bce-3bab098129a7R',
                      manufacturer: 'Xiaomi',
                      model: 'Redmi 6',
                      name: 'xiaomi',
                    },
                    network: {
                      carrier: 'Banglalink',
                    },
                    os: {
                      name: 'android',
                      version: '8.1.0',
                    },
                    traits: {
                      address: {
                        city: 'Dhaka',
                        country: 'Bangladesh',
                      },
                      anonymousId: 'c82cbdff-e5be-4009-ac78-cdeea09ab4b1',
                    },
                  },
                  event: 'spin_result',
                  integrations: {
                    All: true,
                  },
                  message_id: 'a80f82be-9bdc-4a9f-b2a5-15621ee41df8',
                  properties: {
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
                JSON_ARRAY: {},
                XML: {},
                FORM: {},
              },
              version: '1',
              userId: 'c82cbdff-e5be-4009-ac78-cdeea09ab4b1',
              type: 'REST',
              method: 'PATCH',
              endpoint: 'http://6b0e6a60.ngrok.io',
              headers: {
                'content-type': 'application/json',
                test2: 'value2',
              },
              params: {},
              files: {},
            },
            metadata: {
              destinationId: 'destId',
              workspaceId: 'wspId',
            },
            statusCode: 200,
          },
        ],
      },
    },
  },
  {
    name: 'webhook',
    description: 'Test POST method with track message type',
    feature: 'processor',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: [
          {
            message: {
              anonymousId: 'c82cbdff-e5be-4009-ac78-cdeea09ab4b1',
              event: 'spin_result',
              integrations: {
                All: true,
              },
              message_id: 'a80f82be-9bdc-4a9f-b2a5-15621ee41df8',
              properties: {
                additional_bet_index: 0,
                level: 1,
              },
              timestamp: '2019-09-01T15:46:51.693229+05:30',
              type: 'track',
            },
            destination: {
              Config: {
                webhookUrl: 'http://6b0e6a60.ngrok.io',
                headers: [
                  {
                    from: 'Content-Type',
                    to: 'application/xml',
                  },
                  {
                    from: 'test2',
                    to: 'value2',
                  },
                ],
              },
              DestinationDefinition: {
                Config: {
                  cdkV2Enabled: true,
                },
              },
            },
            metadata: {
              destinationId: 'destId',
              workspaceId: 'wspId',
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
                JSON: {
                  anonymousId: 'c82cbdff-e5be-4009-ac78-cdeea09ab4b1',
                  event: 'spin_result',
                  integrations: {
                    All: true,
                  },
                  message_id: 'a80f82be-9bdc-4a9f-b2a5-15621ee41df8',
                  properties: {
                    additional_bet_index: 0,
                    level: 1,
                  },
                  timestamp: '2019-09-01T15:46:51.693229+05:30',
                  type: 'track',
                },
                JSON_ARRAY: {},
                XML: {},
                FORM: {},
              },
              version: '1',
              userId: 'c82cbdff-e5be-4009-ac78-cdeea09ab4b1',
              type: 'REST',
              method: 'POST',
              endpoint: 'http://6b0e6a60.ngrok.io',
              headers: {
                'content-type': 'application/xml',
                test2: 'value2',
              },
              params: {},
              files: {},
            },
            metadata: {
              destinationId: 'destId',
              workspaceId: 'wspId',
            },
            statusCode: 200,
          },
        ],
      },
    },
  },
  {
    name: 'webhook',
    description: 'Test method PATCH',
    feature: 'processor',
    module: 'destination',
    version: 'v0',
    input: {
      request: {
        body: [
          {
            message: {
              anonymousId: 'c82cbdff-e5be-4009-ac78-cdeea09ab4b1',
              context: {
                traits: {
                  address: {
                    city: 'Dhaka',
                    country: 'Bangladesh',
                  },
                  anonymousId: 'c82cbdff-e5be-4009-ac78-cdeea09ab4b1',
                },
              },
              event: 'spin_result',
              integrations: {
                All: true,
              },
              message_id: 'a80f82be-9bdc-4a9f-b2a5-15621ee41df8',
              properties: {
                prop1: 1,
              },
              timestamp: '2019-09-01T15:46:51.693229+05:30',
              type: 'track',
              user_properties: {
                coin_balance: 9466052,
              },
            },
            destination: {
              Config: {
                webhookUrl: 'http://6b0e6a60.ngrok.io',
                webhookMethod: 'PATCH',
                headers: [
                  {
                    from: 'test2',
                    to: 'value2',
                  },
                ],
              },
              DestinationDefinition: {
                Config: {
                  cdkV2Enabled: true,
                },
              },
            },
            metadata: {
              destinationId: 'destId',
              workspaceId: 'wspId',
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
                JSON: {
                  anonymousId: 'c82cbdff-e5be-4009-ac78-cdeea09ab4b1',
                  context: {
                    traits: {
                      address: {
                        city: 'Dhaka',
                        country: 'Bangladesh',
                      },
                      anonymousId: 'c82cbdff-e5be-4009-ac78-cdeea09ab4b1',
                    },
                  },
                  event: 'spin_result',
                  integrations: {
                    All: true,
                  },
                  message_id: 'a80f82be-9bdc-4a9f-b2a5-15621ee41df8',
                  properties: {
                    prop1: 1,
                  },
                  timestamp: '2019-09-01T15:46:51.693229+05:30',
                  type: 'track',
                  user_properties: {
                    coin_balance: 9466052,
                  },
                },
                JSON_ARRAY: {},
                XML: {},
                FORM: {},
              },
              version: '1',
              userId: 'c82cbdff-e5be-4009-ac78-cdeea09ab4b1',
              type: 'REST',
              method: 'PATCH',
              endpoint: 'http://6b0e6a60.ngrok.io',
              headers: {
                'content-type': 'application/json',
                test2: 'value2',
              },
              params: {},
              files: {},
            },
            metadata: {
              destinationId: 'destId',
              workspaceId: 'wspId',
            },
            statusCode: 200,
          },
        ],
      },
    },
  },
  {
    name: 'webhook',
    description: 'Test with different datatype on headers',
    feature: 'processor',
    module: 'destination',
    version: 'v0',
    id: 'webhook-headers',
    input: {
      request: {
        body: [
          {
            message: {
              type: 'track',
              userId: 'testUser273421',
              anonymousId: 'anon-testUser27342',
              event: 'Submit',
              header: {
                key1: 'abcd',
                key2: {
                  key1: '',
                  key2: '',
                },
                ijkl: {
                  int: 1234,
                  string: 'abcd',
                  array: [1, 2, 'a', true],
                  object: { key1: 'value' },
                },
                key3: true,
                key4: null,
                key5: 'undefined',
                key6: function log() {
                  console.log('abcd');
                },
              },
              properties: {
                name: 'Shirt',
                revenue: 4.99,
              },
              context: {
                traits: {
                  email: 'testuser@testmail.com',
                },
                ip: '14.5.67.21',
                library: {
                  name: 'http',
                },
              },
            },
            destination: {
              id: '1uNlE1KpXEzslgnehFArr9cMf7g',
              Config: {
                webhookUrl: 'https://webhook.site/81dc2730-807f-4bbc-8914-5b37d21c8a55',
                webhookMethod: 'POST',

                connectionMode: 'cloud',
                eventDelivery: false,
                eventDeliveryTS: 1720497286192,
              },
              DestinationDefinition: {
                Config: {
                  secretKeys: ['headers.to'],
                  excludeKeys: [],
                  includeKeys: ['consentManagement'],
                  cdkV2Enabled: true,
                  transformAtV1: 'processor',
                  isAudienceSupported: true,
                },
                configSchema: {},
                responseRules: null,
                options: null,
                uiConfig: {},
                id: '1aIXpUrvpGno4gEuF2GvI3O9dOe',
                name: 'WEBHOOK',
                displayName: 'Webhook',
                category: null,
                createdAt: '2020-04-09T09:24:24.089Z',
                updatedAt: '2024-05-30T11:57:04.889Z',
              },
            },
            metadata: {
              destinationId: '1234',
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
            metadata: {
              destinationId: '1234',
            },
            output: {
              body: {
                FORM: {},
                JSON: {
                  anonymousId: 'anon-testUser27342',
                  context: {
                    ip: '14.5.67.21',
                    library: {
                      name: 'http',
                    },
                    traits: {
                      email: 'testuser@testmail.com',
                    },
                  },
                  event: 'Submit',
                  properties: {
                    name: 'Shirt',
                    revenue: 4.99,
                  },
                  type: 'track',
                  userId: 'testUser273421',
                },
                JSON_ARRAY: {},
                XML: {},
              },
              endpoint: 'https://webhook.site/81dc2730-807f-4bbc-8914-5b37d21c8a55',
              files: {},
              headers: {
                'content-type': 'application/json',
                ijkl: '{"int":1234,"string":"abcd","array":[1,2,"a",true],"object":{"key1":"value"}}',
                key1: 'abcd',
                key2: '{"key1":"","key2":""}',
                key3: 'true',
                key4: 'null',
                key5: 'undefined',
              },
              method: 'POST',
              params: {},
              type: 'REST',
              userId: 'anon-testUser27342',
              version: '1',
            },
            statusCode: 200,
          },
        ],
      },
    },
  },
];
