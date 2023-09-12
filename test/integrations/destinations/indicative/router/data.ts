export const data = [
    {
        name: 'fb',
        description: 'Test 0',
        feature: 'router',
        module: 'destination',
        version: 'v0',
        input: {
            request: {
                body: {
                    input: [
                        {
                            "destination": {
                                "Config": {
                                    "apiKey": "abcde"
                                }
                            },
                            "metadata": {
                                "jobId": 2
                            },
                            "message": {
                                "anonymousId": "c82cbdff-e5be-4009-ac78-cdeea09ab4b1",
                                "context": {
                                    "device": {
                                        "id": "df16bffa-5c3d-4fbb-9bce-3bab098129a7R",
                                        "manufacturer": "Xiaomi",
                                        "model": "Redmi 6",
                                        "name": "xiaomi"
                                    },
                                    "network": {
                                        "carrier": "Banglalink"
                                    },
                                    "os": {
                                        "name": "android",
                                        "version": "8.1.0"
                                    },
                                    "traits": {
                                        "address": {
                                            "city": "Dhaka",
                                            "country": "Bangladesh"
                                        },
                                        "anonymousId": "c82cbdff-e5be-4009-ac78-cdeea09ab4b1"
                                    }
                                },
                                "event": "spin_result",
                                "integrations": {
                                    "AM": true
                                },
                                "message_id": "a80f82be-9bdc-4a9f-b2a5-15621ee41df8",
                                "properties": {
                                    "additional_bet_index": 0,
                                    "battle_id": "N/A",
                                    "bet_amount": 9,
                                    "bet_level": 1,
                                    "bet_multiplier": 1,
                                    "coin_balance": 9466052,
                                    "current_module_name": "CasinoGameModule",
                                    "days_in_game": 0,
                                    "extra_param": "N/A",
                                    "fb_profile": "0",
                                    "featureGameType": "N/A",
                                    "game_fps": 30,
                                    "game_id": "fireEagleBase",
                                    "game_name": "FireEagleSlots",
                                    "gem_balance": 0,
                                    "graphicsQuality": "HD",
                                    "idfa": "2bf99787-33d2-4ae2-a76a-c49672f97252",
                                    "internetReachability": "ReachableViaLocalAreaNetwork",
                                    "isLowEndDevice": "False",
                                    "is_auto_spin": "False",
                                    "is_turbo": "False",
                                    "isf": "False",
                                    "ishighroller": "False",
                                    "jackpot_win_amount": 90,
                                    "jackpot_win_type": "Silver",
                                    "level": 6,
                                    "lifetime_gem_balance": 0,
                                    "no_of_spin": 1,
                                    "player_total_battles": 0,
                                    "player_total_shields": 0,
                                    "start_date": "2019-08-01",
                                    "total_payments": 0,
                                    "tournament_id": "T1561970819",
                                    "versionSessionCount": 2,
                                    "win_amount": 0
                                },
                                "userId": "test_user_id",
                                "timestamp": "2019-09-01T15:46:51.693Z",
                                "type": "track"
                            }
                        },
                        {
                            "destination": {
                                "Config": {
                                    "apiKey": "abcde"
                                }
                            },
                            "metadata": {
                                "jobId": 2
                            },
                            "message": {
                                "channel": "web",
                                "context": {
                                    "app": {
                                        "build": "1.0.0",
                                        "name": "RudderLabs JavaScript SDK",
                                        "namespace": "com.rudderlabs.javascript",
                                        "version": "1.0.0"
                                    },
                                    "library": {
                                        "name": "RudderLabs JavaScript SDK",
                                        "version": "1.0.0"
                                    },
                                    "userAgent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/77.0.3865.90 Safari/537.36",
                                    "locale": "en-US",
                                    "ip": "0.0.0.0",
                                    "os": {
                                        "name": "",
                                        "version": ""
                                    },
                                    "screen": {
                                        "density": 2
                                    }
                                },
                                "messageId": "84e26acc-56a5-4835-8233-591137fca468",
                                "session_id": "3049dc4c-5a95-4ccd-a3e7-d74a7e411f22",
                                "originalTimestamp": "2019-10-14T09:03:17.562Z",
                                "anonymousId": "anon_id",
                                "userId": "123456",
                                "type": "identify",
                                "traits": {
                                    "anonymousId": "anon_id",
                                    "email": "sayan@gmail.com",
                                    "address": {
                                        "city": "kolkata",
                                        "country": "India",
                                        "postalCode": 712136,
                                        "state": "WB",
                                        "street": ""
                                    }
                                },
                                "integrations": {
                                    "All": true
                                },
                                "sentAt": "2019-10-14T09:03:22.563Z"
                            }
                        },
                    ],
                    destType: 'indicative',
                },
            },
        },
        output: {
            response: {
                status: 200,
                body: {
                    output: [
                        {
                            "batchedRequest": [
                                {
                                    "version": "1",
                                    "type": "REST",
                                    "method": "POST",
                                    "endpoint": "https://api.indicative.com/service/event",
                                    "headers": {
                                        "Indicative-Client": "RudderStack",
                                        "Content-Type": "application/json"
                                    },
                                    "params": {},
                                    "body": {
                                        "JSON": {
                                            "eventUniqueId": "test_user_id",
                                            "eventName": "spin_result",
                                            "properties": {
                                                "additional_bet_index": 0,
                                                "battle_id": "N/A",
                                                "bet_amount": 9,
                                                "bet_level": 1,
                                                "bet_multiplier": 1,
                                                "coin_balance": 9466052,
                                                "current_module_name": "CasinoGameModule",
                                                "days_in_game": 0,
                                                "extra_param": "N/A",
                                                "fb_profile": "0",
                                                "featureGameType": "N/A",
                                                "game_fps": 30,
                                                "game_id": "fireEagleBase",
                                                "game_name": "FireEagleSlots",
                                                "gem_balance": 0,
                                                "graphicsQuality": "HD",
                                                "idfa": "2bf99787-33d2-4ae2-a76a-c49672f97252",
                                                "internetReachability": "ReachableViaLocalAreaNetwork",
                                                "isLowEndDevice": "False",
                                                "is_auto_spin": "False",
                                                "is_turbo": "False",
                                                "isf": "False",
                                                "ishighroller": "False",
                                                "jackpot_win_amount": 90,
                                                "jackpot_win_type": "Silver",
                                                "level": 6,
                                                "lifetime_gem_balance": 0,
                                                "no_of_spin": 1,
                                                "player_total_battles": 0,
                                                "player_total_shields": 0,
                                                "start_date": "2019-08-01",
                                                "total_payments": 0,
                                                "tournament_id": "T1561970819",
                                                "versionSessionCount": 2,
                                                "win_amount": 0
                                            },
                                            "eventTime": 1567352811693,
                                            "apiKey": "abcde"
                                        },
                                        "XML": {},
                                        "JSON_ARRAY": {},
                                        "FORM": {}
                                    },
                                    "files": {},
                                    "userId": "test_user_id"
                                }
                            ],
                            "metadata": [
                                {
                                    "jobId": 2
                                }
                            ],
                            "batched": false,
                            "statusCode": 200,
                            "destination": {
                                "Config": {
                                    "apiKey": "abcde"
                                }
                            }
                        },
                        {
                            "batchedRequest": [
                                {
                                    "version": "1",
                                    "type": "REST",
                                    "method": "POST",
                                    "endpoint": "https://api.indicative.com/service/identify",
                                    "headers": {
                                        "Indicative-Client": "RudderStack",
                                        "Content-Type": "application/json"
                                    },
                                    "params": {},
                                    "body": {
                                        "JSON": {
                                            "uniqueId": "123456",
                                            "properties": {
                                                "email": "sayan@gmail.com",
                                                "address.city": "kolkata",
                                                "address.country": "India",
                                                "address.postalCode": 712136,
                                                "address.state": "WB",
                                                "address.street": "",
                                                "browser": "Chrome",
                                                "browser_version": "77.0.3865.90",
                                                "device": "Macintosh",
                                                "os": "Mac OS"
                                            },
                                            "apiKey": "abcde"
                                        },
                                        "XML": {},
                                        "JSON_ARRAY": {},
                                        "FORM": {}
                                    },
                                    "files": {},
                                    "userId": "123456"
                                },
                                {
                                    "version": "1",
                                    "type": "REST",
                                    "method": "POST",
                                    "endpoint": "https://api.indicative.com/service/alias",
                                    "headers": {
                                        "Indicative-Client": "RudderStack",
                                        "Content-Type": "application/json"
                                    },
                                    "params": {},
                                    "body": {
                                        "JSON": {
                                            "previousId": "anon_id",
                                            "newId": "123456",
                                            "apiKey": "abcde"
                                        },
                                        "XML": {},
                                        "JSON_ARRAY": {},
                                        "FORM": {}
                                    },
                                    "files": {},
                                    "userId": "123456"
                                }
                            ],
                            "metadata": [
                                {
                                    "jobId": 2
                                }
                            ],
                            "batched": false,
                            "statusCode": 200,
                            "destination": {
                                "Config": {
                                    "apiKey": "abcde"
                                }
                            }
                        },
                    ],
                },
            },
        },
    },
];
