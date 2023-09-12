export const data = [
	{
		"name": "indicative",
		"description": "Test 0",
		"feature": "processor",
		"module": "destination",
		"version": "v0",
		"input": {
			"request": {
				"body": [
					{
						"destination": {
							"Config": {
								"apiKey": "abcde"
							}
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
					}
				]
			}
		},
		"output": {
			"response": {
				"status": 200,
				"body": [
					{
						"output": {
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
						},
						"statusCode": 200
					}
				]
			}
		}
	},
	{
		"name": "indicative",
		"description": "Test 1",
		"feature": "processor",
		"module": "destination",
		"version": "v0",
		"input": {
			"request": {
				"body": [
					{
						"destination": {
							"Config": {
								"apiKey": "abcde"
							}
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
					}
				]
			}
		},
		"output": {
			"response": {
				"status": 200,
				"body": [
					{
						"output": {
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
						"statusCode": 200
					}, {
						"output": {
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
						},
						"statusCode": 200
					}
				]
			}
		}
	},
	{
		"name": "indicative",
		"description": "Test 2",
		"feature": "processor",
		"module": "destination",
		"version": "v0",
		"input": {
			"request": {
				"body": [
					{
						"destination": {
							"Config": {
								"apiKey": "abcde"
							}
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
								"traits": {
									"anonymousId": "123456",
									"email": "sayan@gmail.com",
									"address": {
										"city": "kolkata",
										"country": "India",
										"postalCode": 712136,
										"state": "WB",
										"street": ""
									},
									"ip": "0.0.0.0",
									"age": 26
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
							"type": "identify",
							"messageId": "84e26acc-56a5-4835-8233-591137fca468",
							"session_id": "3049dc4c-5a95-4ccd-a3e7-d74a7e411f22",
							"originalTimestamp": "2019-10-14T09:03:17.562Z",
							"anonymousId": "123456",
							"userId": "123456",
							"integrations": {
								"All": true
							},
							"sentAt": "2019-10-14T09:03:22.563Z"
						}
					}
				]
			}
		},
		"output": {
			"response": {
				"status": 200,
				"body": [
					{
						"output": {
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
										"ip": "0.0.0.0",
										"age": 26,
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
						"statusCode": 200
					}, {
						"output": {
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
									"previousId": "123456",
									"newId": "123456",
									"apiKey": "abcde"
								},
								"XML": {},
								"JSON_ARRAY": {},
								"FORM": {}
							},
							"files": {},
							"userId": "123456"
						},
						"statusCode": 200
					}
				]
			}
		}
	},
	{
		"name": "indicative",
		"description": "Test 3",
		"feature": "processor",
		"module": "destination",
		"version": "v0",
		"input": {
			"request": {
				"body": [
					{
						"destination": {
							"Config": {
								"apiKey": "abcde"
							}
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
								"traits": {
									"email": "sayan@gmail.com",
									"anonymousId": "12345"
								},
								"library": {
									"name": "RudderLabs JavaScript SDK",
									"version": "1.0.0"
								},
								"userAgent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/77.0.3865.90 Safari/537.36",
								"locale": "en-US",
								"os": {
									"name": "",
									"version": ""
								},
								"screen": {
									"density": 2
								}
							},
							"request_ip": "1.1.1.1",
							"type": "page",
							"messageId": "5e10d13a-bf9a-44bf-b884-43a9e591ea71",
							"session_id": "3049dc4c-5a95-4ccd-a3e7-d74a7e411f22",
							"originalTimestamp": "2019-10-14T11:15:18.299Z",
							"anonymousId": "00000000000000000000000000",
							"userId": "12345",
							"properties": {
								"path": "/test",
								"referrer": "Rudder",
								"search": "abc",
								"title": "Test Page",
								"url": "www.rudderlabs.com"
							},
							"integrations": {
								"All": true
							},
							"name": "ApplicationLoaded",
							"sentAt": "2019-10-14T11:15:53.296Z"
						}
					}
				]
			}
		},
		"output": {
			"response": {
				"status": 200,
				"body": [
					{
						"output": {
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
									"eventUniqueId": "12345",
									"eventName": "Page View ApplicationLoaded",
									"properties": {
										"path": "/test",
										"referrer": "Rudder",
										"search": "abc",
										"title": "Test Page",
										"url": "www.rudderlabs.com",
										"browser": "Chrome",
										"browser_version": "77.0.3865.90",
										"device": "Macintosh",
										"os": "Mac OS"
									},
									"eventTime": 1571051718299,
									"apiKey": "abcde"
								},
								"XML": {},
								"JSON_ARRAY": {},
								"FORM": {}
							},
							"files": {},
							"userId": "12345"
						},
						"statusCode": 200
					}
				]
			}
		}
	},
	{
		"name": "indicative",
		"description": "Test 4",
		"feature": "processor",
		"module": "destination",
		"version": "v0",
		"input": {
			"request": {
				"body": [
					{
						"destination": {
							"Config": {
								"apiKey": "abcde"
							}
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
								"traits": {
									"email": "sayan@gmail.com",
									"anonymousId": "12345"
								},
								"library": {
									"name": "RudderLabs JavaScript SDK",
									"version": "1.0.0"
								},
								"userAgent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/77.0.3865.90 Safari/537.36",
								"locale": "en-US",
								"os": {
									"name": "",
									"version": ""
								},
								"screen": {
									"density": 2
								}
							},
							"request_ip": "1.1.1.1",
							"type": "page",
							"messageId": "5e10d13a-bf9a-44bf-b884-43a9e591ea71",
							"session_id": "3049dc4c-5a95-4ccd-a3e7-d74a7e411f22",
							"originalTimestamp": "2019-10-14T11:15:18.299Z",
							"anonymousId": "00000000000000000000000000",
							"userId": "12345",
							"properties": {
								"name": "ApplicationLoaded",
								"path": "/test",
								"referrer": "Rudder",
								"search": "abc",
								"title": "Test Page",
								"url": "www.rudderlabs.com"
							},
							"integrations": {
								"All": true
							},
							"sentAt": "2019-10-14T11:15:53.296Z"
						}
					}
				]
			}
		},
		"output": {
			"response": {
				"status": 200,
				"body": [
					{
						"output": {
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
									"eventUniqueId": "12345",
									"eventName": "Page View ApplicationLoaded",
									"properties": {
										"name": "ApplicationLoaded",
										"path": "/test",
										"referrer": "Rudder",
										"search": "abc",
										"title": "Test Page",
										"url": "www.rudderlabs.com",
										"browser": "Chrome",
										"browser_version": "77.0.3865.90",
										"device": "Macintosh",
										"os": "Mac OS"
									},
									"eventTime": 1571051718299,
									"apiKey": "abcde"
								},
								"XML": {},
								"JSON_ARRAY": {},
								"FORM": {}
							},
							"files": {},
							"userId": "12345"
						},
						"statusCode": 200
					}
				]
			}
		}
	},
	{
		"name": "indicative",
		"description": "Test 5",
		"feature": "processor",
		"module": "destination",
		"version": "v0",
		"input": {
			"request": {
				"body": [
					{
						"destination": {
							"Config": {
								"apiKey": "abcde"
							}
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
								"traits": {
									"email": "sayan@gmail.com",
									"anonymousId": "12345"
								},
								"library": {
									"name": "RudderLabs JavaScript SDK",
									"version": "1.0.0"
								},
								"userAgent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/77.0.3865.90 Safari/537.36",
								"locale": "en-US",
								"os": {
									"name": "",
									"version": ""
								},
								"screen": {
									"density": 2
								}
							},
							"request_ip": "1.1.1.1",
							"type": "page",
							"messageId": "5e10d13a-bf9a-44bf-b884-43a9e591ea71",
							"session_id": "3049dc4c-5a95-4ccd-a3e7-d74a7e411f22",
							"originalTimestamp": "2019-10-14T11:15:18.299Z",
							"anonymousId": "00000000000000000000000000",
							"userId": "12345",
							"properties": {
								"path": "/test",
								"referrer": "Rudder",
								"search": "abc",
								"title": "Test Page",
								"url": "www.rudderlabs.com"
							},
							"integrations": {
								"All": true
							},
							"sentAt": "2019-10-14T11:15:53.296Z"
						}
					}
				]
			}
		},
		"output": {
			"response": {
				"status": 200,
				"body": [
					{
						"output": {
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
									"eventUniqueId": "12345",
									"eventName": "Page View",
									"properties": {
										"path": "/test",
										"referrer": "Rudder",
										"search": "abc",
										"title": "Test Page",
										"url": "www.rudderlabs.com",
										"browser": "Chrome",
										"browser_version": "77.0.3865.90",
										"device": "Macintosh",
										"os": "Mac OS"
									},
									"eventTime": 1571051718299,
									"apiKey": "abcde"
								},
								"XML": {},
								"JSON_ARRAY": {},
								"FORM": {}
							},
							"files": {},
							"userId": "12345"
						},
						"statusCode": 200
					}
				]
			}
		}
	},
	{
		"name": "indicative",
		"description": "Test 6",
		"feature": "processor",
		"module": "destination",
		"version": "v0",
		"input": {
			"request": {
				"body": [
					{
						"destination": {
							"Config": {
								"apiKey": "abcde"
							}
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
								"traits": {
									"email": "sayan@gmail.com",
									"anonymousId": "12345"
								},
								"library": {
									"name": "RudderLabs JavaScript SDK",
									"version": "1.0.0"
								},
								"userAgent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/77.0.3865.90 Safari/537.36",
								"locale": "en-US",
								"os": {
									"name": "",
									"version": ""
								},
								"screen": {
									"density": 2
								}
							},
							"request_ip": "1.1.1.1",
							"type": "screen",
							"messageId": "5e10d13a-bf9a-44bf-b884-43a9e591ea71",
							"session_id": "3049dc4c-5a95-4ccd-a3e7-d74a7e411f22",
							"originalTimestamp": "2019-10-14T11:15:18.299Z",
							"anonymousId": "00000000000000000000000000",
							"userId": "12345",
							"properties": {
								"path": "/test",
								"referrer": "Rudder",
								"search": "abc",
								"title": "Test Page",
								"url": "www.rudderlabs.com"
							},
							"integrations": {
								"All": true
							},
							"name": "Home",
							"sentAt": "2019-10-14T11:15:53.296Z"
						}
					}
				]
			}
		},
		"output": {
			"response": {
				"status": 200,
				"body": [
					{
						"output": {
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
									"eventUniqueId": "12345",
									"eventName": "Screen View Home",
									"properties": {
										"path": "/test",
										"referrer": "Rudder",
										"search": "abc",
										"title": "Test Page",
										"url": "www.rudderlabs.com",
										"browser": "Chrome",
										"browser_version": "77.0.3865.90",
										"device": "Macintosh",
										"os": "Mac OS"
									},
									"eventTime": 1571051718299,
									"apiKey": "abcde"
								},
								"XML": {},
								"JSON_ARRAY": {},
								"FORM": {}
							},
							"files": {},
							"userId": "12345"
						},
						"statusCode": 200
					}
				]
			}
		}
	},
	{
		"name": "indicative",
		"description": "Test 7",
		"feature": "processor",
		"module": "destination",
		"version": "v0",
		"input": {
			"request": {
				"body": [
					{
						"destination": {
							"Config": {
								"apiKey": "abcde"
							}
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
							"originalTimestamp": "2019-09-01T15:46:51.693Z",
							"type": "track"
						}
					}
				]
			}
		},
		"output": {
			"response": {
				"status": 200,
				"body": [
					{
						"output": {
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
						},
						"statusCode": 200
					}
				]
			}
		}
	},
	{
		"name": "indicative",
		"description": "Test 8",
		"feature": "processor",
		"module": "destination",
		"version": "v0",
		"input": {
			"request": {
				"body": [
					{
						"destination": {
							"Config": {
								"apiKey": "abcde"
							}
						},
						"message": {
							"anonymousId": "e6ab2c5e-2cda-44a9-a962-e2f67df78bca",
							"channel": "web",
							"context": {
								"app": {
									"build": "1.0.0",
									"name": "RudderLabs JavaScript SDK",
									"namespace": "com.rudderlabs.javascript",
									"version": "1.0.5"
								},
								"ip": "0.0.0.0",
								"library": {
									"name": "RudderLabs JavaScript SDK",
									"version": "1.0.5"
								},
								"locale": "en-GB",
								"os": {
									"name": "",
									"version": ""
								},
								"screen": {
									"density": 2
								},
								"traits": {
									"city": "Disney",
									"country": "USA",
									"email": "mickey@disney.com",
									"firstname": "Mickey"
								},
								"userAgent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_2) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/79.0.3945.117 Safari/537.36"
							},
							"integrations": {
								"All": true
							},
							"messageId": "79313729-7fe5-4204-963a-dc46f4205e4e",
							"originalTimestamp": "2020-01-24T06:29:02.366Z",
							"previousId": "test_previous_id",
							"receivedAt": "2020-01-24T11:59:02.403+05:30",
							"request_ip": "[::1]:53711",
							"sentAt": "2020-01-24T06:29:02.366Z",
							"timestamp": "2020-01-24T11:59:02.403+05:30",
							"type": "alias",
							"userId": "test_new_user_id"
						}
					}
				]
			}
		},
		"output": {
			"response": {
				"status": 200,
				"body": [
					{
						"output": {
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
									"previousId": "test_previous_id",
									"newId": "test_new_user_id",
									"apiKey": "abcde"
								},
								"XML": {},
								"JSON_ARRAY": {},
								"FORM": {}
							},
							"files": {},
							"userId": "test_new_user_id"
						},
						"statusCode": 200
					}
				]
			}
		}
	},
	{
		"name": "indicative",
		"description": "Test 9",
		"feature": "processor",
		"module": "destination",
		"version": "v0",
		"input": {
			"request": {
				"body": [
					{
						"destination": {
							"Config": {
								"apiKey": "abcde"
							}
						},
						"message": {
							"anonymousId": "e6ab2c5e-2cda-44a9-a962-e2f67df78bca",
							"channel": "web",
							"context": {
								"app": {
									"build": "1.0.0",
									"name": "RudderLabs JavaScript SDK",
									"namespace": "com.rudderlabs.javascript",
									"version": "1.0.5"
								},
								"ip": "0.0.0.0",
								"library": {
									"name": "RudderLabs JavaScript SDK",
									"version": "1.0.5"
								},
								"locale": "en-GB",
								"os": {
									"name": "",
									"version": ""
								},
								"screen": {
									"density": 2
								},
								"traits": {
									"city": "Disney",
									"country": "USA",
									"email": "mickey@disney.com",
									"firstname": "Mickey"
								},
								"userAgent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_2) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/79.0.3945.117 Safari/537.36"
							},
							"integrations": {
								"All": true
							},
							"messageId": "79313729-7fe5-4204-963a-dc46f4205e4e",
							"originalTimestamp": "2020-01-24T06:29:02.366Z",
							"previousId": "test_previous_id",
							"receivedAt": "2020-01-24T11:59:02.403+05:30",
							"request_ip": "[::1]:53711",
							"sentAt": "2020-01-24T06:29:02.366Z",
							"timestamp": "2020-01-24T11:59:02.403+05:30",
							"userId": "test_new_user_id"
						}
					}
				]
			}
		},
		"output": {
			"response": {
				"status": 200,
				"body": [
					{
						"error": "Message Type is not present. Aborting message.",
						"statTags": {
							"destType": "INDICATIVE",
							"errorCategory": "dataValidation",
							"errorType": "instrumentation",
							"feature": "processor",
							"implementation": "native",
							"module": "destination"
						},
						"statusCode": 400
					}
				]
			}
		}
	},
	{
		"name": "indicative",
		"description": "Test 10",
		"feature": "processor",
		"module": "destination",
		"version": "v0",
		"input": {
			"request": {
				"body": [
					{
						"destination": {
							"Config": {
								"apiKey": "abcde"
							}
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
							"anonymousId": "123456",
							"userId": "123456",
							"type": "group",
							"traits": {
								"anonymousId": "123456",
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
					}
				]
			}
		},
		"output": {
			"response": {
				"status": 200,
				"body": [
					{
						"error": "Message type group not supported",
						"statTags": {
							"destType": "INDICATIVE",
							"errorCategory": "dataValidation",
							"errorType": "instrumentation",
							"feature": "processor",
							"implementation": "native",
							"module": "destination"
						},
						"statusCode": 400
					}
				]
			}
		}
	},
	{
		"name": "indicative",
		"description": "Test 11",
		"feature": "processor",
		"module": "destination",
		"version": "v0",
		"input": {
			"request": {
				"body": [
					{
						"destination": {
							"Config": {
								"apiKey": "abcde"
							}
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
							"originalTimestamp": "2019-10-14T09:03:17.562Z",
							"anonymousId": "test_anon_id",
							"type": "identify",
							"traits": {
								"anonymousId": "test_anon_id",
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
					}
				]
			}
		},
		"output": {
			"response": {
				"status": 200,
				"body": [
					{
						"output": {
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
									"uniqueId": "test_anon_id",
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
							"userId": "test_anon_id",
							"files": {}
						},
						"statusCode": 200
					}
				]
			}
		}
	},
	{
		"name": "indicative",
		"description": "Test 12",
		"feature": "processor",
		"module": "destination",
		"version": "v0",
		"input": {
			"request": {
				"body": [
					{
						"destination": {
							"Config": {
								"apiKey": "abcde"
							}
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
								"searchResponse": {
									"hits": [
										{
											"Vrm": "026067",
											"Make": "AUDI",
											"Year": 2010,
											"DName": "PISCA PROFESSIONAL INDUSTRIAL SOLUTION Consulting & Acquisition GmbH",
											"Model": "A5",
											"Price": 13990,
											"Mileage": 163000,
											"DealerId": "1f338e5b-740f-6a38-bee1-ecff97acda69",
											"Derivative": "A5 Cabrio 1.8 TFSI  Cabrio"
										},
										{
											"Vrm": "4527",
											"Make": "AUDI",
											"Year": 2009,
											"DName": "Stephan Walters - Autohaus Walters",
											"Model": "A5",
											"Price": 14450,
											"Mileage": 99990,
											"DealerId": "68c7b5ae-8cf0-6595-9fd2-8644b9682838",
											"Derivative": "A5 Cabrio 40 TFSI S tronic S line Cabrio"
										},
										{
											"Vrm": "10007",
											"Make": "AUDI",
											"Year": 2017,
											"DName": "ps kfz-vertrieb GmbH",
											"Model": "A5",
											"Price": 14580,
											"Mileage": 151500,
											"DealerId": "a107e9a8-ac3c-6790-bb84-052dd5eed5e8",
											"Derivative": "A5 Sportback 2.0 TDI ultra S tronic  Coupe"
										},
										{
											"Vrm": "031983",
											"Make": "AUDI",
											"Year": 2012,
											"DName": "Hüseyin Zan Fahrzeughandel \"Autopark Grendelmatt\"",
											"Model": "A5",
											"Price": 10980,
											"Mileage": 197335,
											"DealerId": "8a574713-2fbe-6f0c-b1a8-39ba7ee683fc",
											"Derivative": "A5 2.0 TDI Sportback DPF multitronic  Coupe"
										},
										{
											"Vrm": "042012",
											"Make": "AUDI",
											"Year": 2015,
											"DName": "Hüseyin Zan Fahrzeughandel \"Autopark Grendelmatt\"",
											"Model": "A5",
											"Price": 15980,
											"Mileage": 144205,
											"DealerId": "8a574713-2fbe-6f0c-b1a8-39ba7ee683fc",
											"Derivative": "A5 Coupe 35 TDI S tronic S line Coupe"
										},
										{
											"Vrm": "002743",
											"Make": "AUDI",
											"Year": 2010,
											"DName": "Auto Mayer e.K.Inh. Skelcim Imeri",
											"Model": "A5",
											"Price": 13980,
											"Mileage": 121015,
											"DealerId": "972258cb-132f-62a9-bd31-e02f9f70fa7b",
											"Derivative": "A5 Cabrio 2.0 TDI DPF  Cabrio"
										},
										{
											"Vrm": "205536_3895",
											"Make": "AUDI",
											"Year": 2011,
											"DName": "Autohaus Löbau GmbH",
											"Model": "A5",
											"Price": 12790,
											"Mileage": 89236,
											"DealerId": "9e697219-293e-63a0-884a-2d03f77bbbef",
											"Derivative": "A5 2.0 TDI Sportback DPF  Coupe"
										},
										{
											"Vrm": "116265",
											"Make": "AUDI",
											"Year": 2016,
											"DName": "Elspass Autoland GmbH & Co. KG",
											"Model": "A1",
											"Price": 14690,
											"Mileage": 42800,
											"DealerId": "00c1bf3f-b19d-6198-a509-c7f2ff73c29a",
											"Derivative": "A1 1.0 TFSI ultra  Limousine"
										},
										{
											"Vrm": "010159",
											"Make": "AUDI",
											"Year": 2013,
											"DName": "Hermann Meyer GmbH & Co. KG",
											"Model": "A1",
											"Price": 9950,
											"Mileage": 93996,
											"DealerId": "35d4fe7e-81a0-6e99-a575-6f62bffb8900",
											"Derivative": "A1 1.4 TFSI Ambition Limousine"
										},
										{
											"Vrm": "010178",
											"Make": "AUDI",
											"Year": 2016,
											"DName": "Hermann Meyer GmbH & Co. KG",
											"Model": "A1",
											"Price": 12950,
											"Mileage": 69454,
											"DealerId": "35d4fe7e-81a0-6e99-a575-6f62bffb8900",
											"Derivative": "A1 1.4 TFSI Sportback S tronic Attraction Limousine"
										}
									],
									"page": 0,
									"merge": {
										"nbHitsMax": 1000,
										"nbHitslimit": 1000,
										"nbSearchers": 2,
										"nbHitsProcessed": 10,
										"personalization": {
											"impact": 100,
											"enabled": true,
											"profile": {
												"time": 0,
												"facets": {},
												"taskID": 0
											},
											"percentile": 0,
											"nbPersoScanned": 0,
											"nbPersoSkipped": 0,
											"nbPersoReranked": 0,
											"nbPersoReturned": 0,
											"nbPersoSelected": 0,
											"nbRelevanceBuckets": 8
										},
										"lastHitToDisplay": 10,
										"nbHitsNumberingEnd": 10
									},
									"nbHits": 13,
									"nbPages": 2,
									"queryID": "c5a176f8493236fcbfe69c3298d41659",
									"indexUsed": "Germany_prod_stock_Finance_0",
									"serverUsed": "d85-de-1.algolia.net",
									"hitsPerPage": 10,
									"parsedQuery": "audi a5",
									"timeoutHits": false,
									"appliedRules": [
										{
											"objectID": "1539345377254"
										},
										{
											"objectID": "1548767806494"
										}
									],
									"facets_stats": {
										"Doors": {
											"avg": 3,
											"max": 5,
											"min": 2,
											"sum": 48
										},
										"Price": {
											"avg": 13210,
											"max": 15980,
											"min": 9950,
											"sum": 171730
										},
										"VrmYear": {
											"avg": 2013,
											"max": 2017,
											"min": 2009,
											"sum": 26171
										}
									},
									"timeoutCounts": false
								}
							},
							"userId": "test_user_id",
							"timestamp": "2019-09-01T15:46:51.693Z",
							"type": "track"
						}
					}
				]
			}
		},
		"output": {
			"response": {
				"status": 200,
				"body": [
					{
						"output": {
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
										"searchResponse.hits.Vrm": "026067,4527,10007,031983,042012,002743,205536_3895,116265,010159,010178",
										"searchResponse.hits.Make": "AUDI,AUDI,AUDI,AUDI,AUDI,AUDI,AUDI,AUDI,AUDI,AUDI",
										"searchResponse.hits.Year": "2010,2009,2017,2012,2015,2010,2011,2016,2013,2016",
										"searchResponse.hits.DName": "PISCA PROFESSIONAL INDUSTRIAL SOLUTION Consulting & Acquisition GmbH,Stephan Walters - Autohaus Walters,ps kfz-vertrieb GmbH,Hüseyin Zan Fahrzeughandel \"Autopark Grendelmatt\",Hüseyin Zan Fahrzeughandel \"Autopark Grendelmatt\",Auto Mayer e.K.Inh. Skelcim Imeri,Autohaus Löbau GmbH,Elspass Autoland GmbH & Co. KG,Hermann Meyer GmbH & Co. KG,Hermann Meyer GmbH & Co. KG",
										"searchResponse.hits.Model": "A5,A5,A5,A5,A5,A5,A5,A1,A1,A1",
										"searchResponse.hits.Price": "13990,14450,14580,10980,15980,13980,12790,14690,9950,12950",
										"searchResponse.hits.Mileage": "163000,99990,151500,197335,144205,121015,89236,42800,93996,69454",
										"searchResponse.hits.DealerId": "1f338e5b-740f-6a38-bee1-ecff97acda69,68c7b5ae-8cf0-6595-9fd2-8644b9682838,a107e9a8-ac3c-6790-bb84-052dd5eed5e8,8a574713-2fbe-6f0c-b1a8-39ba7ee683fc,8a574713-2fbe-6f0c-b1a8-39ba7ee683fc,972258cb-132f-62a9-bd31-e02f9f70fa7b,9e697219-293e-63a0-884a-2d03f77bbbef,00c1bf3f-b19d-6198-a509-c7f2ff73c29a,35d4fe7e-81a0-6e99-a575-6f62bffb8900,35d4fe7e-81a0-6e99-a575-6f62bffb8900",
										"searchResponse.hits.Derivative": "A5 Cabrio 1.8 TFSI  Cabrio,A5 Cabrio 40 TFSI S tronic S line Cabrio,A5 Sportback 2.0 TDI ultra S tronic  Coupe,A5 2.0 TDI Sportback DPF multitronic  Coupe,A5 Coupe 35 TDI S tronic S line Coupe,A5 Cabrio 2.0 TDI DPF  Cabrio,A5 2.0 TDI Sportback DPF  Coupe,A1 1.0 TFSI ultra  Limousine,A1 1.4 TFSI Ambition Limousine,A1 1.4 TFSI Sportback S tronic Attraction Limousine",
										"searchResponse.page": 0,
										"searchResponse.merge.nbHitsMax": 1000,
										"searchResponse.merge.nbHitslimit": 1000,
										"searchResponse.merge.nbSearchers": 2,
										"searchResponse.merge.nbHitsProcessed": 10,
										"searchResponse.merge.personalization.impact": 100,
										"searchResponse.merge.personalization.enabled": true,
										"searchResponse.merge.personalization.profile.time": 0,
										"searchResponse.merge.personalization.profile.taskID": 0,
										"searchResponse.merge.personalization.percentile": 0,
										"searchResponse.merge.personalization.nbPersoScanned": 0,
										"searchResponse.merge.personalization.nbPersoSkipped": 0,
										"searchResponse.merge.personalization.nbPersoReranked": 0,
										"searchResponse.merge.personalization.nbPersoReturned": 0,
										"searchResponse.merge.personalization.nbPersoSelected": 0,
										"searchResponse.merge.personalization.nbRelevanceBuckets": 8,
										"searchResponse.merge.lastHitToDisplay": 10,
										"searchResponse.merge.nbHitsNumberingEnd": 10,
										"searchResponse.nbHits": 13,
										"searchResponse.nbPages": 2,
										"searchResponse.queryID": "c5a176f8493236fcbfe69c3298d41659",
										"searchResponse.indexUsed": "Germany_prod_stock_Finance_0",
										"searchResponse.serverUsed": "d85-de-1.algolia.net",
										"searchResponse.hitsPerPage": 10,
										"searchResponse.parsedQuery": "audi a5",
										"searchResponse.timeoutHits": false,
										"searchResponse.appliedRules.objectID": "1539345377254,1548767806494",
										"searchResponse.facets_stats.Doors.avg": 3,
										"searchResponse.facets_stats.Doors.max": 5,
										"searchResponse.facets_stats.Doors.min": 2,
										"searchResponse.facets_stats.Doors.sum": 48,
										"searchResponse.facets_stats.Price.avg": 13210,
										"searchResponse.facets_stats.Price.max": 15980,
										"searchResponse.facets_stats.Price.min": 9950,
										"searchResponse.facets_stats.Price.sum": 171730,
										"searchResponse.facets_stats.VrmYear.avg": 2013,
										"searchResponse.facets_stats.VrmYear.max": 2017,
										"searchResponse.facets_stats.VrmYear.min": 2009,
										"searchResponse.facets_stats.VrmYear.sum": 26171,
										"searchResponse.timeoutCounts": false
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
						},
						"statusCode": 200
					}
				]
			}
		}
	},
	{
		"name": "indicative",
		"description": "Test 13",
		"feature": "processor",
		"module": "destination",
		"version": "v0",
		"input": {
			"request": {
				"body": [
					{
						"destination": {
							"ID": "1afmecIpsJm7D72aRTksxyODrwR",
							"Name": "Segment",
							"DestinationDefinition": {
								"ID": "1afjjahf0X5lSyNze7Xh7aqJs11",
								"Name": "SEGMENT",
								"DisplayName": "Segment",
								"Config": {
									"excludeKeys": [],
									"includeKeys": []
								}
							},
							"Config": {
								"writeKey": "abcdefghijklmnopqrstuvwxyz"
							},
							"Enabled": true,
							"Transformations": [],
							"IsProcessorEnabled": true
						},
						"message": {
							"anonymousId": "ac7722c2-ccb6-4ae2-baf6-1effe861f4cd",
							"channel": "web",
							"context": {
								"app": {
									"build": "1.0.0",
									"name": "RudderLabs JavaScript SDK",
									"namespace": "com.rudderlabs.javascript",
									"version": "1.1.1-rc.2"
								},
								"library": {
									"name": "RudderLabs JavaScript SDK",
									"version": "1.1.1-rc.2"
								},
								"locale": "en-GB",
								"os": {
									"name": "",
									"version": ""
								},
								"page": {
									"path": "/tests/html/index4.html",
									"referrer": "",
									"search": "",
									"title": "",
									"url": "http://localhost/tests/html/index4.html"
								},
								"screen": {
									"density": 2
								},
								"traits": {
									"age": 23,
									"email": "testmp@email.com",
									"firstname": "Test Transformer"
								},
								"userAgent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_3) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.163 Safari/537.36"
							},
							"event": "JuhuSearchResults",
							"integrations": {
								"All": true
							},
							"messageId": "584fde02-901a-4964-a4a0-4078b999d5b2",
							"originalTimestamp": "2020-04-17T14:55:31.372Z",
							"traits": {
								"searchResponse": {
									"hits": [
										{
											"Vrm": "026067",
											"Make": "AUDI",
											"Year": 2010,
											"DName": "PISCA PROFESSIONAL INDUSTRIAL SOLUTION Consulting & Acquisition GmbH",
											"Model": "A5",
											"Price": 13990,
											"Mileage": 163000,
											"DealerId": "1f338e5b-740f-6a38-bee1-ecff97acda69",
											"Derivative": "A5 Cabrio 1.8 TFSI  Cabrio"
										},
										{
											"Vrm": "4527",
											"Make": "AUDI",
											"Year": 2009,
											"DName": "Stephan Walters - Autohaus Walters",
											"Model": "A5",
											"Price": 14450,
											"Mileage": 99990,
											"DealerId": "68c7b5ae-8cf0-6595-9fd2-8644b9682838",
											"Derivative": "A5 Cabrio 40 TFSI S tronic S line Cabrio"
										},
										{
											"Vrm": "10007",
											"Make": "AUDI",
											"Year": 2017,
											"DName": "ps kfz-vertrieb GmbH",
											"Model": "A5",
											"Price": 14580,
											"Mileage": 151500,
											"DealerId": "a107e9a8-ac3c-6790-bb84-052dd5eed5e8",
											"Derivative": "A5 Sportback 2.0 TDI ultra S tronic  Coupe"
										},
										{
											"Vrm": "031983",
											"Make": "AUDI",
											"Year": 2012,
											"DName": "Hüseyin Zan Fahrzeughandel \"Autopark Grendelmatt\"",
											"Model": "A5",
											"Price": 10980,
											"Mileage": 197335,
											"DealerId": "8a574713-2fbe-6f0c-b1a8-39ba7ee683fc",
											"Derivative": "A5 2.0 TDI Sportback DPF multitronic  Coupe"
										},
										{
											"Vrm": "042012",
											"Make": "AUDI",
											"Year": 2015,
											"DName": "Hüseyin Zan Fahrzeughandel \"Autopark Grendelmatt\"",
											"Model": "A5",
											"Price": 15980,
											"Mileage": 144205,
											"DealerId": "8a574713-2fbe-6f0c-b1a8-39ba7ee683fc",
											"Derivative": "A5 Coupe 35 TDI S tronic S line Coupe"
										},
										{
											"Vrm": "002743",
											"Make": "AUDI",
											"Year": 2010,
											"DName": "Auto Mayer e.K.Inh. Skelcim Imeri",
											"Model": "A5",
											"Price": 13980,
											"Mileage": 121015,
											"DealerId": "972258cb-132f-62a9-bd31-e02f9f70fa7b",
											"Derivative": "A5 Cabrio 2.0 TDI DPF  Cabrio"
										},
										{
											"Vrm": "205536_3895",
											"Make": "AUDI",
											"Year": 2011,
											"DName": "Autohaus Löbau GmbH",
											"Model": "A5",
											"Price": 12790,
											"Mileage": 89236,
											"DealerId": "9e697219-293e-63a0-884a-2d03f77bbbef",
											"Derivative": "A5 2.0 TDI Sportback DPF  Coupe"
										},
										{
											"Vrm": "116265",
											"Make": "AUDI",
											"Year": 2016,
											"DName": "Elspass Autoland GmbH & Co. KG",
											"Model": "A1",
											"Price": 14690,
											"Mileage": 42800,
											"DealerId": "00c1bf3f-b19d-6198-a509-c7f2ff73c29a",
											"Derivative": "A1 1.0 TFSI ultra  Limousine"
										},
										{
											"Vrm": "010159",
											"Make": "AUDI",
											"Year": 2013,
											"DName": "Hermann Meyer GmbH & Co. KG",
											"Model": "A1",
											"Price": 9950,
											"Mileage": 93996,
											"DealerId": "35d4fe7e-81a0-6e99-a575-6f62bffb8900",
											"Derivative": "A1 1.4 TFSI Ambition Limousine"
										},
										{
											"Vrm": "010178",
											"Make": "AUDI",
											"Year": 2016,
											"DName": "Hermann Meyer GmbH & Co. KG",
											"Model": "A1",
											"Price": 12950,
											"Mileage": 69454,
											"DealerId": "35d4fe7e-81a0-6e99-a575-6f62bffb8900",
											"Derivative": "A1 1.4 TFSI Sportback S tronic Attraction Limousine"
										}
									],
									"page": 0,
									"merge": {
										"nbHitsMax": 1000,
										"nbHitslimit": 1000,
										"nbSearchers": 2,
										"nbHitsProcessed": 10,
										"personalization": {
											"impact": 100,
											"enabled": true,
											"profile": {
												"time": 0,
												"facets": {},
												"taskID": 0
											},
											"percentile": 0,
											"nbPersoScanned": 0,
											"nbPersoSkipped": 0,
											"nbPersoReranked": 0,
											"nbPersoReturned": 0,
											"nbPersoSelected": 0,
											"nbRelevanceBuckets": 8
										},
										"lastHitToDisplay": 10,
										"nbHitsNumberingEnd": 10
									},
									"nbHits": 13,
									"nbPages": 2,
									"queryID": "c5a176f8493236fcbfe69c3298d41659",
									"indexUsed": "Germany_prod_stock_Finance_0",
									"serverUsed": "d85-de-1.algolia.net",
									"hitsPerPage": 10,
									"parsedQuery": "audi a5",
									"timeoutHits": false,
									"appliedRules": [
										{
											"objectID": "1539345377254"
										},
										{
											"objectID": "1548767806494"
										}
									],
									"facets_stats": {
										"Doors": {
											"avg": 3,
											"max": 5,
											"min": 2,
											"sum": 48
										},
										"Price": {
											"avg": 13210,
											"max": 15980,
											"min": 9950,
											"sum": 171730
										},
										"VrmYear": {
											"avg": 2013,
											"max": 2017,
											"min": 2009,
											"sum": 26171
										}
									},
									"timeoutCounts": false
								}
							},
							"receivedAt": "2020-04-17T20:25:31.401+05:30",
							"request_ip": "[::1]:57365",
							"sentAt": "2020-04-17T14:55:31.372Z",
							"timestamp": "2020-04-17T20:25:31.401+05:30",
							"name": "test page",
							"type": "identify",
							"userId": "user12345"
						}
					}
				]
			}
		},
		"output": {
			"response": {
				"status": 200,
				"body": [
					{
						"output": {
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
									"uniqueId": "user12345",
									"properties": {
										"searchResponse.hits.Vrm": "026067,4527,10007,031983,042012,002743,205536_3895,116265,010159,010178",
										"searchResponse.hits.Make": "AUDI,AUDI,AUDI,AUDI,AUDI,AUDI,AUDI,AUDI,AUDI,AUDI",
										"searchResponse.hits.Year": "2010,2009,2017,2012,2015,2010,2011,2016,2013,2016",
										"searchResponse.hits.DName": "PISCA PROFESSIONAL INDUSTRIAL SOLUTION Consulting & Acquisition GmbH,Stephan Walters - Autohaus Walters,ps kfz-vertrieb GmbH,Hüseyin Zan Fahrzeughandel \"Autopark Grendelmatt\",Hüseyin Zan Fahrzeughandel \"Autopark Grendelmatt\",Auto Mayer e.K.Inh. Skelcim Imeri,Autohaus Löbau GmbH,Elspass Autoland GmbH & Co. KG,Hermann Meyer GmbH & Co. KG,Hermann Meyer GmbH & Co. KG",
										"searchResponse.hits.Model": "A5,A5,A5,A5,A5,A5,A5,A1,A1,A1",
										"searchResponse.hits.Price": "13990,14450,14580,10980,15980,13980,12790,14690,9950,12950",
										"searchResponse.hits.Mileage": "163000,99990,151500,197335,144205,121015,89236,42800,93996,69454",
										"searchResponse.hits.DealerId": "1f338e5b-740f-6a38-bee1-ecff97acda69,68c7b5ae-8cf0-6595-9fd2-8644b9682838,a107e9a8-ac3c-6790-bb84-052dd5eed5e8,8a574713-2fbe-6f0c-b1a8-39ba7ee683fc,8a574713-2fbe-6f0c-b1a8-39ba7ee683fc,972258cb-132f-62a9-bd31-e02f9f70fa7b,9e697219-293e-63a0-884a-2d03f77bbbef,00c1bf3f-b19d-6198-a509-c7f2ff73c29a,35d4fe7e-81a0-6e99-a575-6f62bffb8900,35d4fe7e-81a0-6e99-a575-6f62bffb8900",
										"searchResponse.hits.Derivative": "A5 Cabrio 1.8 TFSI  Cabrio,A5 Cabrio 40 TFSI S tronic S line Cabrio,A5 Sportback 2.0 TDI ultra S tronic  Coupe,A5 2.0 TDI Sportback DPF multitronic  Coupe,A5 Coupe 35 TDI S tronic S line Coupe,A5 Cabrio 2.0 TDI DPF  Cabrio,A5 2.0 TDI Sportback DPF  Coupe,A1 1.0 TFSI ultra  Limousine,A1 1.4 TFSI Ambition Limousine,A1 1.4 TFSI Sportback S tronic Attraction Limousine",
										"searchResponse.page": 0,
										"searchResponse.merge.nbHitsMax": 1000,
										"searchResponse.merge.nbHitslimit": 1000,
										"searchResponse.merge.nbSearchers": 2,
										"searchResponse.merge.nbHitsProcessed": 10,
										"searchResponse.merge.personalization.impact": 100,
										"searchResponse.merge.personalization.enabled": true,
										"searchResponse.merge.personalization.profile.time": 0,
										"searchResponse.merge.personalization.profile.taskID": 0,
										"searchResponse.merge.personalization.percentile": 0,
										"searchResponse.merge.personalization.nbPersoScanned": 0,
										"searchResponse.merge.personalization.nbPersoSkipped": 0,
										"searchResponse.merge.personalization.nbPersoReranked": 0,
										"searchResponse.merge.personalization.nbPersoReturned": 0,
										"searchResponse.merge.personalization.nbPersoSelected": 0,
										"searchResponse.merge.personalization.nbRelevanceBuckets": 8,
										"searchResponse.merge.lastHitToDisplay": 10,
										"searchResponse.merge.nbHitsNumberingEnd": 10,
										"searchResponse.nbHits": 13,
										"searchResponse.nbPages": 2,
										"searchResponse.queryID": "c5a176f8493236fcbfe69c3298d41659",
										"searchResponse.indexUsed": "Germany_prod_stock_Finance_0",
										"searchResponse.serverUsed": "d85-de-1.algolia.net",
										"searchResponse.hitsPerPage": 10,
										"searchResponse.parsedQuery": "audi a5",
										"searchResponse.timeoutHits": false,
										"searchResponse.appliedRules.objectID": "1539345377254,1548767806494",
										"searchResponse.facets_stats.Doors.avg": 3,
										"searchResponse.facets_stats.Doors.max": 5,
										"searchResponse.facets_stats.Doors.min": 2,
										"searchResponse.facets_stats.Doors.sum": 48,
										"searchResponse.facets_stats.Price.avg": 13210,
										"searchResponse.facets_stats.Price.max": 15980,
										"searchResponse.facets_stats.Price.min": 9950,
										"searchResponse.facets_stats.Price.sum": 171730,
										"searchResponse.facets_stats.VrmYear.avg": 2013,
										"searchResponse.facets_stats.VrmYear.max": 2017,
										"searchResponse.facets_stats.VrmYear.min": 2009,
										"searchResponse.facets_stats.VrmYear.sum": 26171,
										"searchResponse.timeoutCounts": false,
										"browser": "Chrome",
										"browser_version": "80.0.3987.163",
										"device": "Macintosh",
										"os": "Mac OS"
									}
								},
								"XML": {},
								"JSON_ARRAY": {},
								"FORM": {}
							},
							"files": {},
							"userId": "user12345"
						},
						"statusCode": 200
					}, {
						"output": {
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
									"previousId": "ac7722c2-ccb6-4ae2-baf6-1effe861f4cd",
									"newId": "user12345"
								},
								"XML": {},
								"JSON_ARRAY": {},
								"FORM": {}
							},
							"files": {},
							"userId": "user12345"
						},
						"statusCode": 200
					}
				]
			}
		}
	},
	{
		"name": "indicative",
		"description": "Test 14",
		"feature": "processor",
		"module": "destination",
		"version": "v0",
		"input": {
			"request": {
				"body": [
					{
						"destination": {
							"Config": {
								"apiKey": "abcde"
							}
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
								"traits": {
									"email": "sayan@gmail.com",
									"anonymousId": "12345"
								},
								"library": {
									"name": "RudderLabs JavaScript SDK",
									"version": "1.0.0"
								},
								"userAgent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/77.0.3865.90 Safari/537.36",
								"locale": "en-US",
								"os": {
									"name": "",
									"version": ""
								},
								"screen": {
									"density": 2
								},
								"page": {
									"path": "/tests/html/index4.html",
									"referrer": "",
									"search": "abc",
									"title": "Test Page",
									"url": "http://localhost/tests/html/index4.html"
								}
							},
							"request_ip": "1.1.1.1",
							"type": "page",
							"messageId": "5e10d13a-bf9a-44bf-b884-43a9e591ea71",
							"session_id": "3049dc4c-5a95-4ccd-a3e7-d74a7e411f22",
							"originalTimestamp": "2019-10-14T11:15:18.299Z",
							"anonymousId": "00000000000000000000000000",
							"userId": "12345",
							"properties": {
								"path": "/test",
								"referrer": "Rudder",
								"search": "abc",
								"title": "Test Page",
								"url": "www.rudderlabs.com"
							},
							"integrations": {
								"All": true
							},
							"name": "ApplicationLoaded",
							"sentAt": "2019-10-14T11:15:53.296Z"
						}
					}
				]
			}
		},
		"output": {
			"response": {
				"status": 200,
				"body": [
					{
						"output": {
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
									"eventUniqueId": "12345",
									"eventName": "Page View ApplicationLoaded",
									"properties": {
										"path": "/test",
										"referrer": "Rudder",
										"search": "abc",
										"title": "Test Page",
										"url": "www.rudderlabs.com",
										"browser": "Chrome",
										"browser_version": "77.0.3865.90",
										"device": "Macintosh",
										"os": "Mac OS"
									},
									"eventTime": 1571051718299,
									"apiKey": "abcde"
								},
								"XML": {},
								"JSON_ARRAY": {},
								"FORM": {}
							},
							"files": {},
							"userId": "12345"
						},
						"statusCode": 200
					}
				]
			}
		}
	},
	{
		"name": "indicative",
		"description": "Test 15",
		"feature": "processor",
		"module": "destination",
		"version": "v0",
		"input": {
			"request": {
				"body": [
					{
						"destination": {
							"Config": {
								"apiKey": "abcde"
							}
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
								"traits": {
									"email": "sayan@gmail.com",
									"anonymousId": "12345"
								},
								"library": {
									"name": "RudderLabs JavaScript SDK",
									"version": "1.0.0"
								},
								"userAgent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/77.0.3865.90 Safari/537.36",
								"locale": "en-US",
								"os": {
									"name": "",
									"version": ""
								},
								"screen": {
									"density": 2
								},
								"page": {
									"path": "/tests/html/index4.html",
									"referrer": "",
									"search": "abc",
									"title": "Test Page",
									"url": "http://localhost/tests/html/index4.html"
								}
							},
							"request_ip": "1.1.1.1",
							"type": "page",
							"messageId": "5e10d13a-bf9a-44bf-b884-43a9e591ea71",
							"session_id": "3049dc4c-5a95-4ccd-a3e7-d74a7e411f22",
							"originalTimestamp": "2019-10-14T11:15:18.299Z",
							"anonymousId": "00000000000000000000000000",
							"userId": "12345",
							"integrations": {
								"All": true
							},
							"name": "ApplicationLoaded",
							"sentAt": "2019-10-14T11:15:53.296Z"
						}
					}
				]
			}
		},
		"output": {
			"response": {
				"status": 200,
				"body": [
					{
						"output": {
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
									"eventUniqueId": "12345",
									"eventName": "Page View ApplicationLoaded",
									"properties": {
										"path": "/tests/html/index4.html",
										"referrer": "",
										"search": "abc",
										"title": "Test Page",
										"url": "http://localhost/tests/html/index4.html",
										"browser": "Chrome",
										"browser_version": "77.0.3865.90",
										"device": "Macintosh",
										"os": "Mac OS"
									},
									"eventTime": 1571051718299,
									"apiKey": "abcde"
								},
								"XML": {},
								"JSON_ARRAY": {},
								"FORM": {}
							},
							"files": {},
							"userId": "12345"
						},
						"statusCode": 200
					}
				]
			}
		}
	},
	{
		"name": "indicative",
		"description": "Test 16",
		"feature": "processor",
		"module": "destination",
		"version": "v0",
		"input": {
			"request": {
				"body": [
					{
						"destination": {
							"Config": {
								"apiKey": "abcde"
							}
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
								},
								"page": {
									"path": "/tests/html/index4.html",
									"referrer": "",
									"search": "abc",
									"title": "Test Page",
									"url": "http://localhost/tests/html/index4.html"
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
					}
				]
			}
		},
		"output": {
			"response": {
				"status": 200,
				"body": [
					{
						"output": {
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
										"path": "/tests/html/index4.html",
										"referrer": "",
										"search": "abc",
										"title": "Test Page",
										"url": "http://localhost/tests/html/index4.html",
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
						},
						"statusCode": 200
					}
				]
			}
		}
	},
	{
		"name": "indicative",
		"description": "Test 17",
		"feature": "processor",
		"module": "destination",
		"version": "v0",
		"input": {
			"request": {
				"body": [
					{
						"destination": {
							"Config": {
								"apiKey": "abcde"
							}
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
								},
								"page": {
									"path": "/tests/html/index4.html",
									"referrer": "",
									"search": "abc",
									"title": "Test Page",
									"url": "http://localhost/tests/html/index4.html"
								}
							},
							"event": "spin_result",
							"integrations": {
								"AM": true
							},
							"message_id": "a80f82be-9bdc-4a9f-b2a5-15621ee41df8",
							"properties": {
								"searchResponse": {
									"hits": [
										{
											"Vrm": "026067",
											"Make": "AUDI",
											"Year": 2010,
											"DName": "PISCA PROFESSIONAL INDUSTRIAL SOLUTION Consulting & Acquisition GmbH",
											"Model": "A5",
											"Price": 13990,
											"Mileage": 163000,
											"DealerId": "1f338e5b-740f-6a38-bee1-ecff97acda69",
											"Derivative": "A5 Cabrio 1.8 TFSI  Cabrio"
										},
										{
											"Vrm": "4527",
											"Make": "AUDI",
											"Year": 2009,
											"DName": "Stephan Walters - Autohaus Walters",
											"Model": "A5",
											"Price": 14450,
											"Mileage": 99990,
											"DealerId": "68c7b5ae-8cf0-6595-9fd2-8644b9682838",
											"Derivative": "A5 Cabrio 40 TFSI S tronic S line Cabrio"
										},
										{
											"Vrm": "10007",
											"Make": "AUDI",
											"Year": 2017,
											"DName": "ps kfz-vertrieb GmbH",
											"Model": "A5",
											"Price": 14580,
											"Mileage": 151500,
											"DealerId": "a107e9a8-ac3c-6790-bb84-052dd5eed5e8",
											"Derivative": "A5 Sportback 2.0 TDI ultra S tronic  Coupe"
										},
										{
											"Vrm": "031983",
											"Make": "AUDI",
											"Year": 2012,
											"DName": "Hüseyin Zan Fahrzeughandel \"Autopark Grendelmatt\"",
											"Model": "A5",
											"Price": 10980,
											"Mileage": 197335,
											"DealerId": "8a574713-2fbe-6f0c-b1a8-39ba7ee683fc",
											"Derivative": "A5 2.0 TDI Sportback DPF multitronic  Coupe"
										},
										{
											"Vrm": "042012",
											"Make": "AUDI",
											"Year": 2015,
											"DName": "Hüseyin Zan Fahrzeughandel \"Autopark Grendelmatt\"",
											"Model": "A5",
											"Price": 15980,
											"Mileage": 144205,
											"DealerId": "8a574713-2fbe-6f0c-b1a8-39ba7ee683fc",
											"Derivative": "A5 Coupe 35 TDI S tronic S line Coupe"
										},
										{
											"Vrm": "002743",
											"Make": "AUDI",
											"Year": 2010,
											"DName": "Auto Mayer e.K.Inh. Skelcim Imeri",
											"Model": "A5",
											"Price": 13980,
											"Mileage": 121015,
											"DealerId": "972258cb-132f-62a9-bd31-e02f9f70fa7b",
											"Derivative": "A5 Cabrio 2.0 TDI DPF  Cabrio"
										},
										{
											"Vrm": "205536_3895",
											"Make": "AUDI",
											"Year": 2011,
											"DName": "Autohaus Löbau GmbH",
											"Model": "A5",
											"Price": 12790,
											"Mileage": 89236,
											"DealerId": "9e697219-293e-63a0-884a-2d03f77bbbef",
											"Derivative": "A5 2.0 TDI Sportback DPF  Coupe"
										},
										{
											"Vrm": "116265",
											"Make": "AUDI",
											"Year": 2016,
											"DName": "Elspass Autoland GmbH & Co. KG",
											"Model": "A1",
											"Price": 14690,
											"Mileage": 42800,
											"DealerId": "00c1bf3f-b19d-6198-a509-c7f2ff73c29a",
											"Derivative": "A1 1.0 TFSI ultra  Limousine"
										},
										{
											"Vrm": "010159",
											"Make": "AUDI",
											"Year": 2013,
											"DName": "Hermann Meyer GmbH & Co. KG",
											"Model": "A1",
											"Price": 9950,
											"Mileage": 93996,
											"DealerId": "35d4fe7e-81a0-6e99-a575-6f62bffb8900",
											"Derivative": "A1 1.4 TFSI Ambition Limousine"
										},
										{
											"Vrm": "010178",
											"Make": "AUDI",
											"Year": 2016,
											"DName": "Hermann Meyer GmbH & Co. KG",
											"Model": "A1",
											"Price": 12950,
											"Mileage": 69454,
											"DealerId": "35d4fe7e-81a0-6e99-a575-6f62bffb8900",
											"Derivative": "A1 1.4 TFSI Sportback S tronic Attraction Limousine"
										}
									],
									"page": 0,
									"merge": {
										"nbHitsMax": 1000,
										"nbHitslimit": 1000,
										"nbSearchers": 2,
										"nbHitsProcessed": 10,
										"personalization": {
											"impact": 100,
											"enabled": true,
											"profile": {
												"time": 0,
												"facets": {},
												"taskID": 0
											},
											"percentile": 0,
											"nbPersoScanned": 0,
											"nbPersoSkipped": 0,
											"nbPersoReranked": 0,
											"nbPersoReturned": 0,
											"nbPersoSelected": 0,
											"nbRelevanceBuckets": 8
										},
										"lastHitToDisplay": 10,
										"nbHitsNumberingEnd": 10
									},
									"nbHits": 13,
									"nbPages": 2,
									"queryID": "c5a176f8493236fcbfe69c3298d41659",
									"indexUsed": "Germany_prod_stock_Finance_0",
									"serverUsed": "d85-de-1.algolia.net",
									"hitsPerPage": 10,
									"parsedQuery": "audi a5",
									"timeoutHits": false,
									"appliedRules": [
										{
											"objectID": "1539345377254"
										},
										{
											"objectID": "1548767806494"
										}
									],
									"facets_stats": {
										"Doors": {
											"avg": 3,
											"max": 5,
											"min": 2,
											"sum": 48
										},
										"Price": {
											"avg": 13210,
											"max": 15980,
											"min": 9950,
											"sum": 171730
										},
										"VrmYear": {
											"avg": 2013,
											"max": 2017,
											"min": 2009,
											"sum": 26171
										}
									},
									"timeoutCounts": false
								}
							},
							"userId": "test_user_id",
							"timestamp": "2019-09-01T15:46:51.693Z",
							"type": "track"
						}
					}
				]
			}
		},
		"output": {
			"response": {
				"status": 200,
				"body": [
					{
						"output": {
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
										"path": "/tests/html/index4.html",
										"referrer": "",
										"search": "abc",
										"title": "Test Page",
										"url": "http://localhost/tests/html/index4.html",
										"searchResponse.hits.Vrm": "026067,4527,10007,031983,042012,002743,205536_3895,116265,010159,010178",
										"searchResponse.hits.Make": "AUDI,AUDI,AUDI,AUDI,AUDI,AUDI,AUDI,AUDI,AUDI,AUDI",
										"searchResponse.hits.Year": "2010,2009,2017,2012,2015,2010,2011,2016,2013,2016",
										"searchResponse.hits.DName": "PISCA PROFESSIONAL INDUSTRIAL SOLUTION Consulting & Acquisition GmbH,Stephan Walters - Autohaus Walters,ps kfz-vertrieb GmbH,Hüseyin Zan Fahrzeughandel \"Autopark Grendelmatt\",Hüseyin Zan Fahrzeughandel \"Autopark Grendelmatt\",Auto Mayer e.K.Inh. Skelcim Imeri,Autohaus Löbau GmbH,Elspass Autoland GmbH & Co. KG,Hermann Meyer GmbH & Co. KG,Hermann Meyer GmbH & Co. KG",
										"searchResponse.hits.Model": "A5,A5,A5,A5,A5,A5,A5,A1,A1,A1",
										"searchResponse.hits.Price": "13990,14450,14580,10980,15980,13980,12790,14690,9950,12950",
										"searchResponse.hits.Mileage": "163000,99990,151500,197335,144205,121015,89236,42800,93996,69454",
										"searchResponse.hits.DealerId": "1f338e5b-740f-6a38-bee1-ecff97acda69,68c7b5ae-8cf0-6595-9fd2-8644b9682838,a107e9a8-ac3c-6790-bb84-052dd5eed5e8,8a574713-2fbe-6f0c-b1a8-39ba7ee683fc,8a574713-2fbe-6f0c-b1a8-39ba7ee683fc,972258cb-132f-62a9-bd31-e02f9f70fa7b,9e697219-293e-63a0-884a-2d03f77bbbef,00c1bf3f-b19d-6198-a509-c7f2ff73c29a,35d4fe7e-81a0-6e99-a575-6f62bffb8900,35d4fe7e-81a0-6e99-a575-6f62bffb8900",
										"searchResponse.hits.Derivative": "A5 Cabrio 1.8 TFSI  Cabrio,A5 Cabrio 40 TFSI S tronic S line Cabrio,A5 Sportback 2.0 TDI ultra S tronic  Coupe,A5 2.0 TDI Sportback DPF multitronic  Coupe,A5 Coupe 35 TDI S tronic S line Coupe,A5 Cabrio 2.0 TDI DPF  Cabrio,A5 2.0 TDI Sportback DPF  Coupe,A1 1.0 TFSI ultra  Limousine,A1 1.4 TFSI Ambition Limousine,A1 1.4 TFSI Sportback S tronic Attraction Limousine",
										"searchResponse.page": 0,
										"searchResponse.merge.nbHitsMax": 1000,
										"searchResponse.merge.nbHitslimit": 1000,
										"searchResponse.merge.nbSearchers": 2,
										"searchResponse.merge.nbHitsProcessed": 10,
										"searchResponse.merge.personalization.impact": 100,
										"searchResponse.merge.personalization.enabled": true,
										"searchResponse.merge.personalization.profile.time": 0,
										"searchResponse.merge.personalization.profile.taskID": 0,
										"searchResponse.merge.personalization.percentile": 0,
										"searchResponse.merge.personalization.nbPersoScanned": 0,
										"searchResponse.merge.personalization.nbPersoSkipped": 0,
										"searchResponse.merge.personalization.nbPersoReranked": 0,
										"searchResponse.merge.personalization.nbPersoReturned": 0,
										"searchResponse.merge.personalization.nbPersoSelected": 0,
										"searchResponse.merge.personalization.nbRelevanceBuckets": 8,
										"searchResponse.merge.lastHitToDisplay": 10,
										"searchResponse.merge.nbHitsNumberingEnd": 10,
										"searchResponse.nbHits": 13,
										"searchResponse.nbPages": 2,
										"searchResponse.queryID": "c5a176f8493236fcbfe69c3298d41659",
										"searchResponse.indexUsed": "Germany_prod_stock_Finance_0",
										"searchResponse.serverUsed": "d85-de-1.algolia.net",
										"searchResponse.hitsPerPage": 10,
										"searchResponse.parsedQuery": "audi a5",
										"searchResponse.timeoutHits": false,
										"searchResponse.appliedRules.objectID": "1539345377254,1548767806494",
										"searchResponse.facets_stats.Doors.avg": 3,
										"searchResponse.facets_stats.Doors.max": 5,
										"searchResponse.facets_stats.Doors.min": 2,
										"searchResponse.facets_stats.Doors.sum": 48,
										"searchResponse.facets_stats.Price.avg": 13210,
										"searchResponse.facets_stats.Price.max": 15980,
										"searchResponse.facets_stats.Price.min": 9950,
										"searchResponse.facets_stats.Price.sum": 171730,
										"searchResponse.facets_stats.VrmYear.avg": 2013,
										"searchResponse.facets_stats.VrmYear.max": 2017,
										"searchResponse.facets_stats.VrmYear.min": 2009,
										"searchResponse.facets_stats.VrmYear.sum": 26171,
										"searchResponse.timeoutCounts": false
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
						},
						"statusCode": 200
					}
				]
			}
		}
	},
	{
		"name": "indicative",
		"description": "Test 18",
		"feature": "processor",
		"module": "destination",
		"version": "v0",
		"input": {
			"request": {
				"body": [
					{
						"destination": {
							"Config": {
								"apiKey": "abcde"
							}
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
								},
								"page": {
									"path": "/tests/html/index4.html",
									"referrer": "",
									"search": "abc",
									"title": "Test Page",
									"url": "http://localhost/tests/html/index4.html"
								}
							},
							"event": "spin_result",
							"integrations": {
								"AM": true
							},
							"message_id": "a80f82be-9bdc-4a9f-b2a5-15621ee41df8",
							"properties": {
								"searchResponse": {
									"primitiveArr1": [
										"abc",
										"def"
									],
									"primitiveArr2": [
										1,
										2,
										3
									],
									"arrOfArr": [
										[
											"abc",
											"def"
										],
										[
											1,
											2,
											3
										]
									],
									"emptyArr": [],
									"complexArr1": [
										{
											"crr1K1": {
												"discardK1": "discardV1"
											}
										}
									]
								}
							},
							"userId": "test_user_id",
							"timestamp": "2019-09-01T15:46:51.693Z",
							"type": "track"
						}
					}
				]
			}
		},
		"output": {
			"response": {
				"status": 200,
				"body": [
					{
						"output": {
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
										"path": "/tests/html/index4.html",
										"referrer": "",
										"search": "abc",
										"title": "Test Page",
										"url": "http://localhost/tests/html/index4.html",
										"searchResponse.primitiveArr1": "abc,def",
										"searchResponse.primitiveArr2": "1,2,3"
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
						},
						"statusCode": 200
					}
				]
			}
		}
	},
	{
		"name": "indicative",
		"description": "Test 19",
		"feature": "processor",
		"module": "destination",
		"version": "v0",
		"input": {
			"request": {
				"body": [
					{
						"destination": {
							"Config": {
								"apiKey": "abcde"
							}
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
								},
								"campaign": {}
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
					}
				]
			}
		},
		"output": {
			"response": {
				"status": 200,
				"body": [
					{
						"output": {
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
						},
						"statusCode": 200
					}
				]
			}
		}
	},
	{
		"name": "indicative",
		"description": "Test 20",
		"feature": "processor",
		"module": "destination",
		"version": "v0",
		"input": {
			"request": {
				"body": [
					{
						"destination": {
							"Config": {
								"apiKey": "abcde"
							}
						},
						"message": {
							"anonymousId": "8d872292709c6fbe",
							"channel": "mobile",
							"context": {
								"app": {
									"build": "1",
									"name": "AMTestProject",
									"namespace": "com.rudderstack.android.rudderstack.sampleAndroidApp",
									"version": "1.0"
								},
								"device": {
									"id": "8d872292709c6fbe",
									"manufacturer": "Google",
									"model": "AOSPonIAEmulator",
									"name": "generic_x86_arm",
									"type": "android"
								},
								"library": {
									"name": "com.rudderstack.android.sdk.core",
									"version": "1.0.2"
								},
								"locale": "en-US",
								"network": {
									"carrier": "Android",
									"bluetooth": false,
									"cellular": true,
									"wifi": true
								},
								"os": {
									"name": "Android",
									"version": "9"
								},
								"screen": {
									"density": 420,
									"height": 1794,
									"width": 1080
								},
								"timezone": "Asia/Kolkata",
								"traits": {
									"address": {
										"city": "kolkata",
										"country": "India"
									}
								},
								"userAgent": "Dalvik/2.1.0 (Linux; U; Android 9; AOSP on IA Emulator Build/PSR1.180720.117)"
							},
							"event": "Product Clicked",
							"integrations": {
								"All": true
							},
							"messageId": "1590431830915-73bed370-5889-436d-9a9e-0c0e0c809d06",
							"properties": {
								"revenue": "30",
								"currency": "USD",
								"quantity": "5",
								"test_key_2": {
									"test_child_key_1": "test_child_value_1"
								},
								"price": "58.0"
							},
							"originalTimestamp": "2020-05-25T18:37:10.917Z",
							"type": "track",
							"userId": "sample_user_id"
						}
					}
				]
			}
		},
		"output": {
			"response": {
				"status": 200,
				"body": [
					{
						"output": {
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
									"eventUniqueId": "sample_user_id",
									"eventName": "Product Clicked",
									"properties": {
										"revenue": "30",
										"currency": "USD",
										"quantity": "5",
										"test_key_2.test_child_key_1": "test_child_value_1",
										"price": "58.0",
										"device": "Android 9",
										"os": "Android"
									},
									"eventTime": 1590431830917,
									"apiKey": "abcde"
								},
								"XML": {},
								"JSON_ARRAY": {},
								"FORM": {}
							},
							"files": {},
							"userId": "sample_user_id"
						},
						"statusCode": 200
					}
				]
			}
		}
	}
]