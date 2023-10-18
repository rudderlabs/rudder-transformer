export const data = [
	{
		"name": "rockerbox",
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
								"advertiserId": "KDH4JNDHCFJHJ57SJOWJE490W01JFNHGDSSFHDKDSDF"
							}
						},
						"message": {
							"context": {
								"traits": {
									"homwTown": "kanpur",
									"age": "24"
								}
							},
							"type": "Identify",
							"userId": "yash001",
							"originalTimestamp": "2019-10-14T09:03:17.562Z"
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
						"statusCode": 400,
						"error": "Message type identify is not supported",
						"statTags": {
							"errorCategory": "dataValidation",
							"errorType": "instrumentation",
							"destType": "ROCKERBOX",
							"module": "destination",
							"implementation": "native",
							"feature": "processor"
						}
					}
				]
			}
		}
	},
	{
		"name": "rockerbox",
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
								"advertiserId": "test id",
								"eventFilteringOption": "disable",
								"whitelistedEvents": [
									{
										"eventName": ""
									}
								],
								"blacklistedEvents": [
									{
										"eventName": ""
									}
								],
								"eventsMap": [
									{
										"from": "Product Added To Cart",
										"to": "conv.add_to_cart"
									}
								],
								"useNativeSDK": {
									"web": false
								},
								"clientAuthId": {
									"web": "test-client-auth-id"
								},
								"oneTrustCookieCategories": {
									"web": [
										{
											"oneTrustCookieCategory": "Marketing Sample"
										}
									]
								},
								"customDomain": {
									"web": "https://cookiedomain.com"
								},
								"enableCookieSync": {
									"web": true
								}
							}
						},
						"message": {
							"type": "track",
							"event": "Product Added",
							"sentAt": "2022-08-07T20:02:19.352Z",
							"userId": "userSampleX138",
							"channel": "web",
							"context": {
								"os": {
									"name": "",
									"version": ""
								},
								"locale": "en-IN",
								"screen": {
									"width": 1440,
									"height": 900,
									"density": 2,
									"innerWidth": 584,
									"innerHeight": 789
								},
								"traits": {
									"email": "userSampleX120@gmail.com",
									"phone": "9878764736",
									"last_name": "Stack",
									"first_name": "Rudder",
									"subscription": "youtube"
								},
								"campaign": {},
								"userAgent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/103.0.0.0 Safari/537.36"
							},
							"rudderId": "4a47e99b-2afc-45c6-b902-ed69282ca805",
							"messageId": "1659902539347900-c622426c-a1dd-44c0-ac6d-d4dbee3f4a93",
							"properties": {
								"checkout_id": "12345",
								"product_url": "http://www.yourdomain.com/products/red-t-shirt",
								"product_name": "Red T-shirt"
							},
							"anonymousId": "5f093403-1457-4a2c-b4e4-c61ec3bacf56",
							"integrations": {
								"All": true
							},
							"originalTimestamp": "2022-08-07T20:02:19.347Z"
						},
						"writeKey": "2D0yaayoBD7bp8uFomnBONdedcA",
						"requestIP": "[::1]",
						"receivedAt": "2022-08-08T01:32:19.369+05:30"
					}
				]
			}
		},
		"output": {
			"response": {
				"status": 200,
				"body": [
					{
						"statusCode": 400,
						"error": "The event is not associated to a RockerBox event. Aborting!",
						"statTags": {
							"errorCategory": "dataValidation",
							"errorType": "configuration",
							"destType": "ROCKERBOX",
							"module": "destination",
							"implementation": "native",
							"feature": "processor"
						}
					}
				]
			}
		}
	},
	{
		"name": "rockerbox",
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
								"advertiserId": "test id",
								"eventFilteringOption": "disable",
								"whitelistedEvents": [
									{
										"eventName": ""
									}
								],
								"blacklistedEvents": [
									{
										"eventName": ""
									}
								],
								"eventsMap": [
									{
										"from": "Product Added",
										"to": "conv.add_to_cart"
									}
								],
								"useNativeSDK": {
									"web": false
								},
								"clientAuthId": {
									"web": "test-client-auth-id"
								},
								"oneTrustCookieCategories": {
									"web": [
										{
											"oneTrustCookieCategory": "Marketing Sample"
										}
									]
								},
								"customDomain": {
									"web": "https://cookiedomain.com"
								},
								"enableCookieSync": {
									"web": true
								}
							}
						},
						"message": {
							"type": "track",
							"event": "Product Added",
							"sentAt": "2022-08-07T20:02:19.352Z",
							"userId": "userSampleX138",
							"channel": "web",
							"context": {
								"os": {
									"name": "",
									"version": ""
								},
								"locale": "en-IN",
								"traits": {
									"email": "userSampleX120@gmail.com",
									"phone": "9878764736",
									"last_name": "Stack",
									"first_name": "Rudder"
								},
								"campaign": {},
								"userAgent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/103.0.0.0 Safari/537.36"
							},
							"rudderId": "4a47e99b-2afc-45c6-b902-ed69282ca805",
							"messageId": "1659902539347900-c622426c-a1dd-44c0-ac6d-d4dbee3f4a93",
							"properties": {
								"checkout_id": "12345",
								"product_url": "http://www.yourdomain.com/products/red-t-shirt",
								"product_name": "Red T-shirt"
							},
							"anonymousId": "5f093403-1457-4a2c-b4e4-c61ec3bacf56",
							"integrations": {
								"All": true
							},
							"originalTimestamp": "2022-08-07T20:02:19.347Z"
						},
						"writeKey": "2D0yaayoBD7bp8uFomnBONdedcA",
						"requestIP": "[::1]",
						"receivedAt": "2022-08-08T01:32:19.369+05:30"
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
							"endpoint": "https://webhooks.getrockerbox.com/rudderstack",
							"headers": {},
							"params": {
								"advertiser": "test id"
							},
							"body": {
								"JSON": {
									"customer_id": "userSampleX138",
									"anonymous_id": "5f093403-1457-4a2c-b4e4-c61ec3bacf56",
									"email": "userSampleX120@gmail.com",
									"phone": "9878764736",
									"timestamp": 1659902539,
									"conversion_source": "RudderStack",
									"action": "conv.add_to_cart",
									"checkout_id": "12345",
									"product_url": "http://www.yourdomain.com/products/red-t-shirt",
									"product_name": "Red T-shirt"
								},
								"JSON_ARRAY": {},
								"XML": {},
								"FORM": {}
							},
							"files": {},
							"userId": ""
						},
						"statusCode": 200
					}
				]
			}
		}
	},
	{
		"name": "rockerbox",
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
								"advertiserId": "test id",
								"eventFilteringOption": "disable",
								"whitelistedEvents": [
									{
										"eventName": ""
									}
								],
								"blacklistedEvents": [
									{
										"eventName": ""
									}
								],
								"eventsMap": [
									{
										"from": "Product Added",
										"to": "conv.add_to_cart"
									}
								],
								"useNativeSDK": {
									"web": false
								},
								"clientAuthId": {
									"web": "test-client-auth-id"
								},
								"oneTrustCookieCategories": {
									"web": [
										{
											"oneTrustCookieCategory": "Marketing Sample"
										}
									]
								},
								"customDomain": {
									"web": "https://cookiedomain.com"
								},
								"enableCookieSync": {
									"web": true
								}
							}
						},
						"message": {
							"type": "track",
							"event": "Product Added",
							"sentAt": "2022-08-07T20:02:19.352Z",
							"userId": "userSampleX138",
							"channel": "web",
							"context": {
								"os": {
									"name": "",
									"version": ""
								},
								"locale": "en-IN",
								"traits": {
									"email": "userSampleX120@gmail.com",
									"phone": "9878764736",
									"last_name": "Stack",
									"first_name": "Rudder"
								},
								"externalId": [
									{
										"type": "rockerboxExternalId",
										"id": "rbUid"
									}
								],
								"campaign": {},
								"userAgent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/103.0.0.0 Safari/537.36"
							},
							"rudderId": "4a47e99b-2afc-45c6-b902-ed69282ca805",
							"messageId": "1659902539347900-c622426c-a1dd-44c0-ac6d-d4dbee3f4a93",
							"properties": {
								"checkout_id": "12345",
								"product_url": "http://www.yourdomain.com/products/red-t-shirt",
								"product_name": "Red T-shirt",
								"externalId": "rbUid",
								"countryCode": "IN",
								"listingId": "10101"
							},
							"anonymousId": "5f093403-1457-4a2c-b4e4-c61ec3bacf56",
							"integrations": {
								"All": true
							},
							"originalTimestamp": "2022-08-07T20:02:19.347Z"
						},
						"writeKey": "2D0yaayoBD7bp8uFomnBONdedcA",
						"requestIP": "[::1]",
						"receivedAt": "2022-08-08T01:32:19.369+05:30"
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
							"endpoint": "https://webhooks.getrockerbox.com/rudderstack",
							"headers": {},
							"params": {
								"advertiser": "test id"
							},
							"body": {
								"JSON": {
									"customer_id": "userSampleX138",
									"anonymous_id": "5f093403-1457-4a2c-b4e4-c61ec3bacf56",
									"email": "userSampleX120@gmail.com",
									"phone": "9878764736",
									"timestamp": 1659902539,
									"country_code": "IN",
									"listing_id": "10101",
									"conversion_source": "RudderStack",
									"action": "conv.add_to_cart",
									"checkout_id": "12345",
									"product_url": "http://www.yourdomain.com/products/red-t-shirt",
									"product_name": "Red T-shirt",
									"externalId": "rbUid"
								},
								"JSON_ARRAY": {},
								"XML": {},
								"FORM": {}
							},
							"files": {},
							"userId": ""
						},
						"statusCode": 200
					}
				]
			}
		}
	},
	{
		"name": "rockerbox",
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
								"advertiserId": "hdowhfiqhfwaiwhrdafshbfacicolsa",
								"eventFilteringOption": "disable",
								"whitelistedEvents": [
									{
										"eventName": ""
									}
								],
								"blacklistedEvents": [
									{
										"eventName": ""
									}
								],
								"eventsMap": [
									{
										"from": "Product Added",
										"to": "conv.add_to_cart"
									}
								],
								"customPropsMapping": [
									{
										"from": "unit_id",
										"to": "unitID"
									},
									{
										"from": "merch_id",
										"to": "merch_id"
									},
									{
										"from": "bounce_id",
										"to": "bounceID"
									}
								],
								"useNativeSDK": {
									"web": false
								},
								"useNativeSDKToSend": {
									"web": false
								},
								"clientAuthId": {
									"web": ""
								},
								"oneTrustCookieCategories": {
									"web": [
										{
											"oneTrustCookieCategory": ""
										}
									]
								},
								"customDomain": {
									"web": ""
								},
								"enableCookieSync": {
									"web": false
								}
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
							"type": "track",
							"traits": {
								"userId": "anon_id",
								"email": "jamesDoe@gmail.com",
								"name": "James Doe",
								"phone": "92374162212",
								"gender": "M",
								"employed": true,
								"birthday": "1614775793",
								"education": "Science",
								"graduate": true,
								"married": true,
								"customerType": "Prime",
								"msg_push": true,
								"msgSms": true,
								"msgemail": true,
								"msgwhatsapp": false,
								"custom_tags": [
									"Test_User",
									"Interested_User",
									"DIY_Hobby"
								],
								"custom_mappings": {
									"Office": "Trastkiv",
									"Country": "Russia"
								},
								"address": {
									"city": "kolkata",
									"country": "India",
									"postalCode": 789223,
									"state": "WB",
									"street": ""
								}
							},
							"properties": {
								"unit_id": 123,
								"merch_id": false,
								"bounceiD": "fakefake",
								"counce_id": ""
							},
							"event": "Product Added",
							"integrations": {
								"All": true
							},
							"sentAt": "2019-10-14T09:03:22.563Z"
						},
						"writeKey": "2D0yaayoBD7bp8uFomnBONdedcA",
						"requestIP": "[::1]",
						"receivedAt": "2022-08-08T01:32:19.369+05:30"
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
							"endpoint": "https://webhooks.getrockerbox.com/rudderstack",
							"headers": {},
							"params": {
								"advertiser": "hdowhfiqhfwaiwhrdafshbfacicolsa"
							},
							"body": {
								"JSON": {
									"customer_id": "anon_id",
									"anonymous_id": "anon_id",
									"email": "jamesDoe@gmail.com",
									"phone": "92374162212",
									"timestamp": 1571043797,
									"conversion_source": "RudderStack",
									"action": "conv.add_to_cart",
									"unit_id": 123,
									"merch_id": false,
									"bounceiD": "fakefake",
									"counce_id": ""
								},
								"JSON_ARRAY": {},
								"XML": {},
								"FORM": {}
							},
							"files": {},
							"userId": ""
						},
						"statusCode": 200
					}
				]
			}
		}
	},
	{
		"name": "rockerbox",
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
								"advertiserId": "KDH4JNDHCFJHJ57SJOWJE490W01JFNHGDSSFHDKDSDF"
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
							"type": "track",
							"traits": {
								"email": "jamesDoe@gmail.com",
								"name": "James Doe",
								"phone": "92374162212",
								"gender": "M",
								"employed": true,
								"birthday": "1614775793",
								"education": "Science",
								"graduate": true,
								"married": true,
								"customerType": "Prime",
								"msg_push": true,
								"msgSms": true,
								"msgemail": true,
								"msgwhatsapp": false,
								"custom_tags": [
									"Test_User",
									"Interested_User",
									"DIY_Hobby"
								],
								"custom_mappings": {
									"Office": "Trastkiv",
									"Country": "Russia"
								},
								"address": {
									"city": "kolkata",
									"country": "India",
									"postalCode": 789223,
									"state": "WB",
									"street": ""
								}
							},
							"properties": {
								"unit_id": 123,
								"merch_id": false,
								"bounceiD": "fakefake",
								"counce_id": ""
							},
							"event": "Product Added",
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
						"statusCode": 400,
						"error": "Anyone of userId or anonymousId is required to make the call",
						"statTags": {
							"errorCategory": "dataValidation",
							"errorType": "instrumentation",
							"destType": "ROCKERBOX",
							"module": "destination",
							"implementation": "native",
							"feature": "processor"
						}
					}
				]
			}
		}
	}
]