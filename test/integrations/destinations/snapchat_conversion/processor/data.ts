export const data = [
	{
		"name": "snapchat_conversion",
		"description": "Test 0",
		"feature": "processor",
		"module": "destination",
		"version": "v0",
		"input": {
			"request": {
				"body": [
					{
						"message": {
							"messageId": "ec5481b6-a926-4d2e-b293-0b3a77c4d3be",
							"originalTimestamp": "2022-04-22T10:57:58Z",
							"channel": "web",
							"anonymousId": "ea5cfab2-3961-4d8a-8187-3d1858c99090",
							"context": {
								"traits": {
									"email": "test@email.com",
									"phone": "+91 2111111 "
								},
								"app": {
									"build": "1.0.0",
									"name": "RudderLabs JavaScript SDK",
									"namespace": "com.rudderlabs.javascript",
									"version": "1.0.0"
								},
								"device": {
									"advertisingId": "T0T0T072-5e28-45a1-9eda-ce22a3e36d1a",
									"id": "3f034872-5e28-45a1-9eda-ce22a3e36d1a",
									"manufacturer": "Google",
									"model": "AOSP on IA Emulator",
									"name": "generic_x86_arm",
									"type": "ios",
									"attTrackingStatus": 3
								},
								"library": {
									"name": "RudderLabs JavaScript SDK",
									"version": "1.0.0"
								},
								"locale": "en-US",
								"os": {
									"name": "iOS",
									"version": "14.4.1"
								},
								"screen": {
									"density": 2
								},
								"externalId": [
									{
										"type": "ga4AppInstanceId",
										"id": "f0dd99v4f979fb997ce453373900f891"
									}
								],
								"userAgent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_2) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/79.0.3945.88 Safari/537.36"
							},
							"type": "page",
							"name": "Home Page Viewed",
							"properties": {
								"title": "Home | RudderStack",
								"url": "http://www.rudderstack.com"
							},
							"integrations": {
								"All": true
							},
							"sentAt": "2022-04-22T10:57:58Z"
						},
						"destination": {
							"Config": {
								"apiKey": "dummyApiKey",
								"pixelId": "dummyPixelId"
							}
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
						"error": "Events must be sent within 28 days of their occurrence",
						"statTags": {
							"errorCategory": "dataValidation",
							"errorType": "instrumentation",
							"destType": "SNAPCHAT_CONVERSION",
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
		"name": "snapchat_conversion",
		"description": "Test 1",
		"feature": "processor",
		"module": "destination",
		"version": "v0",
		"input": {
			"request": {
				"body": [
					{
						"message": {
							"messageId": "ec5481b6-a926-4d2e-b293-0b3a77c4d3be",
							"originalTimestamp": "2022-04-22T10:57:58Z",
							"anonymousId": "ea5cfab2-3961-4d8a-8187-3d1858c99090",
							"context": {
								"traits": {
									"email": "test@email.com",
									"phone": "+91 2111111 ",
									"firstName": "john",
									"middleName": "victor",
									"lastName": "doe",
									"city": "some_city",
									"state": "some_state"
								},
								"app": {
									"build": "1.0.0",
									"name": "RudderLabs JavaScript SDK",
									"namespace": "com.rudderlabs.javascript",
									"version": "1.0.0"
								},
								"device": {
									"advertisingId": "T0T0T072-5e28-45a1-9eda-ce22a3e36d1a",
									"id": "3f034872-5e28-45a1-9eda-ce22a3e36d1a",
									"manufacturer": "Google",
									"model": "AOSP on IA Emulator",
									"name": "generic_x86_arm",
									"type": "ios",
									"attTrackingStatus": 3
								},
								"library": {
									"name": "RudderLabs JavaScript SDK",
									"version": "1.0.0"
								},
								"locale": "en-US",
								"os": {
									"name": "iOS",
									"version": "14.4.1"
								},
								"screen": {
									"density": 2
								},
								"externalId": [
									{
										"type": "ga4AppInstanceId",
										"id": "f0dd99v4f979fb997ce453373900f891"
									}
								],
								"userAgent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_2) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/79.0.3945.88 Safari/537.36"
							},
							"type": "track",
							"event": "Products Searched",
							"properties": {
								"query": "t-shirts",
								"event_conversion_type": "web",
								"number_items": 4,
								"click_id": "some_click_id",
								"description": "Products Searched event for conversion type offline"
							},
							"integrations": {
								"All": true
							},
							"sentAt": "2022-04-22T10:57:58Z"
						},
						"destination": {
							"Config": {
								"pixelId": "dummyPixelId",
								"apiKey": "dummyApiKey"
							}
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
						"error": "Events must be sent within 28 days of their occurrence",
						"statTags": {
							"errorCategory": "dataValidation",
							"errorType": "instrumentation",
							"destType": "SNAPCHAT_CONVERSION",
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
		"name": "snapchat_conversion",
		"description": "Test 2",
		"feature": "processor",
		"module": "destination",
		"version": "v0",
		"input": {
			"request": {
				"body": [
					{
						"message": {
							"messageId": "ec5481b6-a926-4d2e-b293-0b3a77c4d3be",
							"originalTimestamp": "2022-04-22T10:57:58Z",
							"anonymousId": "ea5cfab2-3961-4d8a-8187-3d1858c99090",
							"context": {
								"traits": {
									"email": "test@email.com",
									"phone": "+91 2111111 ",
									"country": "IN",
									"zicode": "Sxp-12345",
									"region": "some_region"
								},
								"app": {
									"build": "1.0.0",
									"name": "RudderLabs JavaScript SDK",
									"namespace": "com.rudderlabs.javascript",
									"version": "1.0.0"
								},
								"device": {
									"advertisingId": "T0T0T072-5e28-45a1-9eda-ce22a3e36d1a",
									"id": "3f034872-5e28-45a1-9eda-ce22a3e36d1a",
									"manufacturer": "Google",
									"model": "AOSP on IA Emulator",
									"name": "generic_x86_arm",
									"type": "ios",
									"attTrackingStatus": 3
								},
								"library": {
									"name": "RudderLabs JavaScript SDK",
									"version": "1.0.0"
								},
								"locale": "en-US",
								"os": {
									"name": "iOS",
									"version": "14.4.1"
								},
								"screen": {
									"density": 2
								},
								"externalId": [
									{
										"type": "ga4AppInstanceId",
										"id": "f0dd99v4f979fb997ce453373900f891"
									}
								],
								"userAgent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_2) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/79.0.3945.88 Safari/537.36"
							},
							"type": "track",
							"properties": {
								"query": "t-shirts",
								"event_conversion_type": "web"
							},
							"integrations": {
								"All": true
							},
							"sentAt": "2022-04-22T10:57:58Z"
						},
						"destination": {
							"Config": {
								"pixelId": "dummyPixelId",
								"apiKey": "dummyApiKey"
							}
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
						"error": "Event name is required",
						"statTags": {
							"errorCategory": "dataValidation",
							"errorType": "instrumentation",
							"destType": "SNAPCHAT_CONVERSION",
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
		"name": "snapchat_conversion",
		"description": "Test 3",
		"feature": "processor",
		"module": "destination",
		"version": "v0",
		"input": {
			"request": {
				"body": [
					{
						"message": {
							"messageId": "ec5481b6-a926-4d2e-b293-0b3a77c4d3be",
							"originalTimestamp": "2022-04-22T10:57:58Z",
							"anonymousId": "ea5cfab2-3961-4d8a-8187-3d1858c99090",
							"context": {
								"traits": {
									"email": "test@email.com",
									"phone": "+91 2111111 "
								},
								"app": {
									"build": "1.0.0",
									"name": "RudderLabs JavaScript SDK",
									"namespace": "com.rudderlabs.javascript",
									"version": "1.0.0"
								},
								"device": {
									"advertisingId": "T0T0T072-5e28-45a1-9eda-ce22a3e36d1a",
									"id": "3f034872-5e28-45a1-9eda-ce22a3e36d1a",
									"manufacturer": "Google",
									"model": "AOSP on IA Emulator",
									"name": "generic_x86_arm",
									"type": "ios",
									"attTrackingStatus": 3
								},
								"library": {
									"name": "RudderLabs JavaScript SDK",
									"version": "1.0.0"
								},
								"locale": "en-US",
								"os": {
									"name": "iOS",
									"version": "14.4.1"
								},
								"screen": {
									"density": 2
								},
								"externalId": [
									{
										"type": "ga4AppInstanceId",
										"id": "f0dd99v4f979fb997ce453373900f891"
									}
								],
								"userAgent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_2) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/79.0.3945.88 Safari/537.36"
							},
							"type": "identify",
							"event": "Products Searched",
							"properties": {
								"query": "t-shirts",
								"event_conversion_type": "web"
							},
							"integrations": {
								"All": true
							},
							"sentAt": "2022-04-22T10:57:58Z"
						},
						"destination": {
							"Config": {
								"pixelId": "dummyPixelId",
								"apiKey": "dummyApiKey"
							}
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
						"error": "Event type identify is not supported",
						"statTags": {
							"errorCategory": "dataValidation",
							"errorType": "instrumentation",
							"destType": "SNAPCHAT_CONVERSION",
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
		"name": "snapchat_conversion",
		"description": "Test 4",
		"feature": "processor",
		"module": "destination",
		"version": "v0",
		"input": {
			"request": {
				"body": [
					{
						"message": {
							"messageId": "ec5481b6-a926-4d2e-b293-0b3a77c4d3be",
							"originalTimestamp": "2022-04-22T10:57:58Z",
							"anonymousId": "ea5cfab2-3961-4d8a-8187-3d1858c99090",
							"context": {
								"traits": {
									"email": "test@email.com",
									"phone": "+91 2111111 "
								},
								"app": {
									"build": "1.0.0",
									"name": "RudderLabs JavaScript SDK",
									"namespace": "com.rudderlabs.javascript",
									"version": "1.0.0"
								},
								"device": {
									"advertisingId": "T0T0T072-5e28-45a1-9eda-ce22a3e36d1a",
									"id": "3f034872-5e28-45a1-9eda-ce22a3e36d1a",
									"manufacturer": "Google",
									"model": "AOSP on IA Emulator",
									"name": "generic_x86_arm",
									"type": "ios",
									"attTrackingStatus": 3
								},
								"library": {
									"name": "RudderLabs JavaScript SDK",
									"version": "1.0.0"
								},
								"locale": "en-US",
								"os": {
									"name": "iOS",
									"version": "14.4.1"
								},
								"screen": {
									"density": 2
								},
								"externalId": [
									{
										"type": "ga4AppInstanceId",
										"id": "f0dd99v4f979fb997ce453373900f891"
									}
								],
								"userAgent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_2) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/79.0.3945.88 Safari/537.36"
							},
							"type": "track",
							"event": "Products Searched",
							"properties": {
								"query": "t-shirts",
								"event_conversion_type": "web"
							},
							"integrations": {
								"All": true
							},
							"sentAt": "2022-04-22T10:57:58Z"
						},
						"destination": {
							"Config": {
								"apiKey": "dummyApiKey"
							}
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
						"error": "Pixel Id is required for web and offline events",
						"statTags": {
							"errorCategory": "dataValidation",
							"errorType": "configuration",
							"destType": "SNAPCHAT_CONVERSION",
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
		"name": "snapchat_conversion",
		"description": "Test 5",
		"feature": "processor",
		"module": "destination",
		"version": "v0",
		"input": {
			"request": {
				"body": [
					{
						"message": {
							"messageId": "ec5481b6-a926-4d2e-b293-0b3a77c4d3be",
							"originalTimestamp": "2022-04-22T10:57:58Z",
							"channel": "web",
							"anonymousId": "ea5cfab2-3961-4d8a-8187-3d1858c99090",
							"context": {
								"traits": {
									"email": "test@email.com",
									"phone": "+91 2111111 "
								},
								"app": {
									"build": "1.0.0",
									"name": "RudderLabs JavaScript SDK",
									"namespace": "com.rudderlabs.javascript",
									"version": "1.0.0"
								},
								"device": {
									"advertisingId": "T0T0T072-5e28-45a1-9eda-ce22a3e36d1a",
									"id": "3f034872-5e28-45a1-9eda-ce22a3e36d1a",
									"manufacturer": "Google",
									"model": "AOSP on IA Emulator",
									"name": "generic_x86_arm",
									"type": "ios",
									"attTrackingStatus": 3
								},
								"library": {
									"name": "RudderLabs JavaScript SDK",
									"version": "1.0.0"
								},
								"locale": "en-US",
								"os": {
									"name": "iOS",
									"version": "14.4.1"
								},
								"screen": {
									"density": 2
								},
								"externalId": [
									{
										"type": "ga4AppInstanceId",
										"id": "f0dd99v4f979fb997ce453373900f891"
									}
								],
								"userAgent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_2) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/79.0.3945.88 Safari/537.36"
							},
							"type": "track",
							"event": "Products Searched",
							"properties": {
								"query": "t-shirts",
								"event_conversion_type": "web"
							},
							"integrations": {
								"All": true
							},
							"sentAt": "2022-04-22T10:57:58Z"
						},
						"destination": {
							"Config": {
								"apiKey": "dummyApiKey",
								"pixelId": "dummyPixelId"
							}
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
						"error": "Events must be sent within 28 days of their occurrence",
						"statTags": {
							"errorCategory": "dataValidation",
							"errorType": "instrumentation",
							"destType": "SNAPCHAT_CONVERSION",
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
		"name": "snapchat_conversion",
		"description": "Test 6",
		"feature": "processor",
		"module": "destination",
		"version": "v0",
		"input": {
			"request": {
				"body": [
					{
						"message": {
							"messageId": "ec5481b6-a926-4d2e-b293-0b3a77c4d3be",
							"originalTimestamp": "2022-04-22T10:57:58Z",
							"channel": "mobile",
							"anonymousId": "ea5cfab2-3961-4d8a-8187-3d1858c99090",
							"context": {
								"traits": {
									"email": "test@email.com",
									"phone": "+91 2111111 "
								},
								"app": {
									"build": "1.0.0",
									"name": "RudderLabs JavaScript SDK",
									"namespace": "com.rudderlabs.javascript",
									"version": "1.0.0"
								},
								"device": {
									"advertisingId": "T0T0T072-5e28-45a1-9eda-ce22a3e36d1a",
									"id": "3f034872-5e28-45a1-9eda-ce22a3e36d1a",
									"manufacturer": "Google",
									"model": "AOSP on IA Emulator",
									"name": "generic_x86_arm",
									"type": "ios",
									"attTrackingStatus": 3
								},
								"library": {
									"name": "RudderLabs JavaScript SDK",
									"version": "1.0.0"
								},
								"locale": "en-US",
								"os": {
									"name": "iOS",
									"version": "14.4.1"
								},
								"screen": {
									"density": 2
								},
								"externalId": [
									{
										"type": "ga4AppInstanceId",
										"id": "f0dd99v4f979fb997ce453373900f891"
									}
								],
								"userAgent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_2) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/79.0.3945.88 Safari/537.36"
							},
							"type": "track",
							"event": "Products Searched",
							"properties": {
								"query": "t-shirts",
								"event_conversion_type": "web"
							},
							"integrations": {
								"All": true
							},
							"sentAt": "2022-04-22T10:57:58Z"
						},
						"destination": {
							"Config": {
								"apiKey": "dummyApiKey",
								"pixelId": "dummyPixelId"
							}
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
						"error": "Snap App Id is required for app events",
						"statTags": {
							"errorCategory": "dataValidation",
							"errorType": "configuration",
							"destType": "SNAPCHAT_CONVERSION",
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
		"name": "snapchat_conversion",
		"description": "Test 7",
		"feature": "processor",
		"module": "destination",
		"version": "v0",
		"input": {
			"request": {
				"body": [
					{
						"message": {
							"messageId": "ec5481b6-a926-4d2e-b293-0b3a77c4d3be",
							"originalTimestamp": "2022-04-22T10:57:58Z",
							"channel": "mobile",
							"anonymousId": "ea5cfab2-3961-4d8a-8187-3d1858c99090",
							"context": {
								"traits": {
									"email": "test@email.com",
									"phone": "+91 2111111 "
								},
								"app": {
									"build": "1.0.0",
									"name": "RudderLabs JavaScript SDK",
									"namespace": "com.rudderlabs.javascript",
									"version": "1.0.0"
								},
								"device": {
									"advertisingId": "T0T0T072-5e28-45a1-9eda-ce22a3e36d1a",
									"id": "3f034872-5e28-45a1-9eda-ce22a3e36d1a",
									"manufacturer": "Google",
									"model": "AOSP on IA Emulator",
									"name": "generic_x86_arm",
									"type": "ios",
									"attTrackingStatus": 3
								},
								"library": {
									"name": "RudderLabs JavaScript SDK",
									"version": "1.0.0"
								},
								"locale": "en-US",
								"os": {
									"name": "iOS",
									"version": "14.4.1"
								},
								"screen": {
									"density": 2
								},
								"externalId": [
									{
										"type": "ga4AppInstanceId",
										"id": "f0dd99v4f979fb997ce453373900f891"
									}
								],
								"userAgent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_2) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/79.0.3945.88 Safari/537.36"
							},
							"type": "track",
							"event": "Products Searched",
							"properties": {
								"query": "t-shirts",
								"event_conversion_type": "web"
							},
							"integrations": {
								"All": true
							},
							"sentAt": "2022-04-22T10:57:58Z"
						},
						"destination": {
							"Config": {
								"apiKey": "dummyApiKey",
								"pixelId": "dummyPixelId",
								"appId": "dhfeih44f"
							}
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
						"error": "Snap App Id is required for app events",
						"statTags": {
							"errorCategory": "dataValidation",
							"errorType": "configuration",
							"destType": "SNAPCHAT_CONVERSION",
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
		"name": "snapchat_conversion",
		"description": "Test 8",
		"feature": "processor",
		"module": "destination",
		"version": "v0",
		"input": {
			"request": {
				"body": [
					{
						"message": {
							"messageId": "ec5481b6-a926-4d2e-b293-0b3a77c4d3be",
							"originalTimestamp": "2022-04-22T10:57:58Z",
							"channel": "mobile",
							"anonymousId": "ea5cfab2-3961-4d8a-8187-3d1858c99090",
							"context": {
								"traits": {
									"email": "test@email.com",
									"phone": "+91 2111111 "
								},
								"app": {
									"build": "1.0.0",
									"name": "RudderLabs JavaScript SDK",
									"namespace": "com.rudderlabs.javascript",
									"version": "1.0.0"
								},
								"device": {
									"advertisingId": "T0T0T072-5e28-45a1-9eda-ce22a3e36d1a",
									"id": "3f034872-5e28-45a1-9eda-ce22a3e36d1a",
									"manufacturer": "Google",
									"model": "AOSP on IA Emulator",
									"name": "generic_x86_arm",
									"type": "ios",
									"attTrackingStatus": 3
								},
								"library": {
									"name": "RudderLabs JavaScript SDK",
									"version": "1.0.0"
								},
								"locale": "en-US",
								"os": {
									"name": "iOS",
									"version": "14.4.1"
								},
								"screen": {
									"density": 2
								},
								"externalId": [
									{
										"type": "ga4AppInstanceId",
										"id": "f0dd99v4f979fb997ce453373900f891"
									}
								],
								"userAgent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_2) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/79.0.3945.88 Safari/537.36"
							},
							"type": "track",
							"event": "Products Searched",
							"properties": {
								"query": "t-shirts",
								"event_conversion_type": "web"
							},
							"integrations": {
								"All": true
							},
							"sentAt": "2022-04-22T10:57:58Z"
						},
						"destination": {
							"Config": {
								"apiKey": "dummyApiKey",
								"pixelId": "dummyPixelId",
								"appId": "dhfeih44f",
								"snapAppId": "hfhdhfd"
							}
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
						"error": "Events must be sent within 28 days of their occurrence",
						"statTags": {
							"errorCategory": "dataValidation",
							"errorType": "instrumentation",
							"destType": "SNAPCHAT_CONVERSION",
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
		"name": "snapchat_conversion",
		"description": "Test 9",
		"feature": "processor",
		"module": "destination",
		"version": "v0",
		"input": {
			"request": {
				"body": [
					{
						"message": {
							"messageId": "ec5481b6-a926-4d2e-b293-0b3a77c4d3be",
							"originalTimestamp": "2022-04-22T10:57:58Z",
							"channel": "mobile",
							"anonymousId": "ea5cfab2-3961-4d8a-8187-3d1858c99090",
							"context": {
								"traits": {
									"email": "test@email.com",
									"phone": "+91 2111111 ",
									"country": "IN",
									"zipcode": "Sxp-12345",
									"region": "some_region"
								},
								"app": {
									"build": "1.0.0",
									"name": "RudderLabs JavaScript SDK",
									"namespace": "com.rudderlabs.javascript",
									"version": "1.0.0"
								},
								"device": {
									"advertisingId": "T0T0T072-5e28-45a1-9eda-ce22a3e36d1a",
									"id": "3f034872-5e28-45a1-9eda-ce22a3e36d1a",
									"manufacturer": "Google",
									"model": "AOSP on IA Emulator",
									"name": "generic_x86_arm",
									"type": "ios",
									"attTrackingStatus": 3
								},
								"library": {
									"name": "RudderLabs JavaScript SDK",
									"version": "1.0.0"
								},
								"locale": "en-US",
								"os": {
									"name": "iOS",
									"version": "14.4.1"
								},
								"screen": {
									"density": 2
								},
								"externalId": [
									{
										"type": "ga4AppInstanceId",
										"id": "f0dd99v4f979fb997ce453373900f891"
									}
								],
								"userAgent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_2) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/79.0.3945.88 Safari/537.36"
							},
							"type": "track",
							"event": "Product List Viewed",
							"properties": {
								"products": [
									{
										"product_id": "123",
										"price": "14"
									},
									{
										"product_id": "123",
										"price": 14,
										"quantity": 3
									}
								]
							},
							"integrations": {
								"All": true
							},
							"sentAt": "2022-04-22T10:57:58Z"
						},
						"destination": {
							"Config": {
								"apiKey": "dummyApiKey",
								"pixelId": "dummyPixelId",
								"appId": "dhfeih44f",
								"snapAppId": "hfhdhfd"
							}
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
						"error": "Events must be sent within 28 days of their occurrence",
						"statTags": {
							"errorCategory": "dataValidation",
							"errorType": "instrumentation",
							"destType": "SNAPCHAT_CONVERSION",
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
		"name": "snapchat_conversion",
		"description": "Test 10",
		"feature": "processor",
		"module": "destination",
		"version": "v0",
		"input": {
			"request": {
				"body": [
					{
						"message": {
							"messageId": "ec5481b6-a926-4d2e-b293-0b3a77c4d3be",
							"originalTimestamp": "2022-04-22T10:57:58Z",
							"channel": "mobile",
							"anonymousId": "ea5cfab2-3961-4d8a-8187-3d1858c99090",
							"context": {
								"traits": {
									"email": "test@email.com",
									"phone": "+91 2111111 "
								},
								"app": {
									"build": "1.0.0",
									"name": "RudderLabs JavaScript SDK",
									"namespace": "com.rudderlabs.javascript",
									"version": "1.0.0"
								},
								"device": {
									"advertisingId": "T0T0T072-5e28-45a1-9eda-ce22a3e36d1a",
									"id": "3f034872-5e28-45a1-9eda-ce22a3e36d1a",
									"manufacturer": "Google",
									"model": "AOSP on IA Emulator",
									"name": "generic_x86_arm",
									"type": "ios",
									"attTrackingStatus": 3
								},
								"library": {
									"name": "RudderLabs JavaScript SDK",
									"version": "1.0.0"
								},
								"locale": "en-US",
								"os": {
									"name": "iOS",
									"version": "14.4.1"
								},
								"screen": {
									"density": 2
								},
								"externalId": [
									{
										"type": "ga4AppInstanceId",
										"id": "f0dd99v4f979fb997ce453373900f891"
									}
								],
								"userAgent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_2) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/79.0.3945.88 Safari/537.36"
							},
							"type": "track",
							"event": "checkout_started",
							"properties": {
								"products": [
									{
										"product_id": "123",
										"price": "14"
									},
									{
										"product_id": "123",
										"price": 14,
										"quantity": "2"
									}
								]
							},
							"integrations": {
								"All": true
							},
							"sentAt": "2022-04-22T10:57:58Z"
						},
						"destination": {
							"Config": {
								"apiKey": "dummyApiKey",
								"pixelId": "dummyPixelId",
								"appId": "dhfeih44f",
								"snapAppId": "hfhdhfd"
							}
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
						"error": "Events must be sent within 28 days of their occurrence",
						"statTags": {
							"errorCategory": "dataValidation",
							"errorType": "instrumentation",
							"destType": "SNAPCHAT_CONVERSION",
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
		"name": "snapchat_conversion",
		"description": "Test 11",
		"feature": "processor",
		"module": "destination",
		"version": "v0",
		"input": {
			"request": {
				"body": [
					{
						"message": {
							"messageId": "ec5481b6-a926-4d2e-b293-0b3a77c4d3be",
							"originalTimestamp": "2022-04-22T10:57:58Z",
							"channel": "mobile",
							"anonymousId": "ea5cfab2-3961-4d8a-8187-3d1858c99090",
							"context": {
								"traits": {
									"email": "test@email.com",
									"phone": "+91 2111111 "
								},
								"app": {
									"build": "1.0.0",
									"name": "RudderLabs JavaScript SDK",
									"namespace": "com.rudderlabs.javascript",
									"version": "1.0.0"
								},
								"device": {
									"advertisingId": "T0T0T072-5e28-45a1-9eda-ce22a3e36d1a",
									"id": "3f034872-5e28-45a1-9eda-ce22a3e36d1a",
									"manufacturer": "Google",
									"model": "AOSP on IA Emulator",
									"name": "generic_x86_arm",
									"type": "ios",
									"attTrackingStatus": 3
								},
								"library": {
									"name": "RudderLabs JavaScript SDK",
									"version": "1.0.0"
								},
								"locale": "en-US",
								"os": {
									"name": "iOS",
									"version": "14.4.1"
								},
								"screen": {
									"density": 2
								},
								"externalId": [
									{
										"type": "ga4AppInstanceId",
										"id": "f0dd99v4f979fb997ce453373900f891"
									}
								],
								"userAgent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_2) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/79.0.3945.88 Safari/537.36"
							},
							"type": "track",
							"event": "Order Completed",
							"properties": {
								"brands": [
									"brand01",
									"brand02"
								],
								"products": [
									{
										"product_id": "123",
										"price": "14",
										"quantity": 1
									},
									{
										"product_id": "124",
										"price": 14,
										"quantity": 3
									}
								]
							},
							"integrations": {
								"All": true
							},
							"sentAt": "2022-04-22T10:57:58Z"
						},
						"destination": {
							"Config": {
								"apiKey": "dummyApiKey",
								"pixelId": "dummyPixelId",
								"appId": "dhfeih44f",
								"snapAppId": "hfhdhfd"
							}
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
						"error": "Events must be sent within 28 days of their occurrence",
						"statTags": {
							"errorCategory": "dataValidation",
							"errorType": "instrumentation",
							"destType": "SNAPCHAT_CONVERSION",
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
		"name": "snapchat_conversion",
		"description": "Test 12",
		"feature": "processor",
		"module": "destination",
		"version": "v0",
		"input": {
			"request": {
				"body": [
					{
						"message": {
							"messageId": "ec5481b6-a926-4d2e-b293-0b3a77c4d3be",
							"originalTimestamp": "2022-04-22T10:57:58Z",
							"channel": "mobile",
							"anonymousId": "ea5cfab2-3961-4d8a-8187-3d1858c99090",
							"context": {
								"traits": {
									"email": "test@email.com",
									"phone": "+91 2111111 "
								},
								"app": {
									"build": "1.0.0",
									"name": "RudderLabs JavaScript SDK",
									"namespace": "com.rudderlabs.javascript",
									"version": "1.0.0"
								},
								"device": {
									"advertisingId": "T0T0T072-5e28-45a1-9eda-ce22a3e36d1a",
									"id": "3f034872-5e28-45a1-9eda-ce22a3e36d1a",
									"manufacturer": "Google",
									"model": "AOSP on IA Emulator",
									"name": "generic_x86_arm",
									"type": "ios",
									"attTrackingStatus": 3
								},
								"library": {
									"name": "RudderLabs JavaScript SDK",
									"version": "1.0.0"
								},
								"locale": "en-US",
								"os": {
									"name": "iOS",
									"version": "14.4.1"
								},
								"screen": {
									"density": 2
								},
								"externalId": [
									{
										"type": "ga4AppInstanceId",
										"id": "f0dd99v4f979fb997ce453373900f891"
									}
								],
								"userAgent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_2) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/79.0.3945.88 Safari/537.36"
							},
							"type": "track",
							"event": "Product Added",
							"properties": {
								"product_id": "123",
								"price": "14",
								"category": "shoes",
								"currency": "USD"
							},
							"integrations": {
								"All": true
							},
							"sentAt": "2022-04-22T10:57:58Z"
						},
						"destination": {
							"Config": {
								"apiKey": "dummyApiKey",
								"pixelId": "dummyPixelId",
								"appId": "dhfeih44f",
								"snapAppId": "hfhdhfd"
							}
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
						"error": "Events must be sent within 28 days of their occurrence",
						"statTags": {
							"errorCategory": "dataValidation",
							"errorType": "instrumentation",
							"destType": "SNAPCHAT_CONVERSION",
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
		"name": "snapchat_conversion",
		"description": "Test 13",
		"feature": "processor",
		"module": "destination",
		"version": "v0",
		"input": {
			"request": {
				"body": [
					{
						"message": {
							"messageId": "ec5481b6-a926-4d2e-b293-0b3a77c4d3be",
							"originalTimestamp": "2022-04-22T10:57:58Z",
							"channel": "web",
							"anonymousId": "ea5cfab2-3961-4d8a-8187-3d1858c99090",
							"context": {
								"traits": {
									"email": "test@email.com",
									"phone": "+91 2111111 "
								},
								"app": {
									"build": "1.0.0",
									"name": "RudderLabs JavaScript SDK",
									"namespace": "com.rudderlabs.javascript",
									"version": "1.0.0"
								},
								"device": {
									"advertisingId": "T0T0T072-5e28-45a1-9eda-ce22a3e36d1a",
									"id": "3f034872-5e28-45a1-9eda-ce22a3e36d1a",
									"manufacturer": "Google",
									"model": "AOSP on IA Emulator",
									"name": "generic_x86_arm",
									"type": "ios",
									"attTrackingStatus": 3
								},
								"library": {
									"name": "RudderLabs JavaScript SDK",
									"version": "1.0.0"
								},
								"locale": "en-US",
								"os": {
									"name": "iOS",
									"version": "14.4.1"
								},
								"screen": {
									"density": 2
								},
								"externalId": [
									{
										"type": "ga4AppInstanceId",
										"id": "f0dd99v4f979fb997ce453373900f891"
									}
								],
								"userAgent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_2) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/79.0.3945.88 Safari/537.36"
							},
							"type": "track",
							"event": "Product Viewed",
							"properties": {
								"product_id": "123",
								"price": "14",
								"category": "shoes",
								"currency": "USD",
								"number_items": 14,
								"quantity": 1
							},
							"integrations": {
								"All": true
							},
							"sentAt": "2022-04-22T10:57:58Z"
						},
						"destination": {
							"Config": {
								"apiKey": "dummyApiKey",
								"pixelId": "dummyPixelId",
								"appId": "dhfeih44f",
								"snapAppId": "hfhdhfd"
							}
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
						"error": "Events must be sent within 28 days of their occurrence",
						"statTags": {
							"errorCategory": "dataValidation",
							"errorType": "instrumentation",
							"destType": "SNAPCHAT_CONVERSION",
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
		"name": "snapchat_conversion",
		"description": "Test 14",
		"feature": "processor",
		"module": "destination",
		"version": "v0",
		"input": {
			"request": {
				"body": [
					{
						"message": {
							"messageId": "ec5481b6-a926-4d2e-b293-0b3a77c4d3be",
							"originalTimestamp": "2022-04-22T10:57:58Z",
							"channel": "",
							"anonymousId": "ea5cfab2-3961-4d8a-8187-3d1858c99090",
							"context": {
								"traits": {
									"email": "test@email.com",
									"phone": "+91 2111111 "
								},
								"app": {
									"build": "1.0.0",
									"name": "RudderLabs JavaScript SDK",
									"namespace": "com.rudderlabs.javascript",
									"version": "1.0.0"
								},
								"device": {
									"advertisingId": "T0T0T072-5e28-45a1-9eda-ce22a3e36d1a",
									"id": "3f034872-5e28-45a1-9eda-ce22a3e36d1a",
									"manufacturer": "Google",
									"model": "AOSP on IA Emulator",
									"name": "generic_x86_arm",
									"type": "ios",
									"attTrackingStatus": 3
								},
								"library": {
									"name": "RudderLabs JavaScript SDK",
									"version": "1.0.0"
								},
								"locale": "en-US",
								"os": {
									"name": "iOS",
									"version": "14.4.1"
								},
								"screen": {
									"density": 2
								},
								"externalId": [
									{
										"type": "ga4AppInstanceId",
										"id": "f0dd99v4f979fb997ce453373900f891"
									}
								],
								"userAgent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_2) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/79.0.3945.88 Safari/537.36"
							},
							"type": "track",
							"event": "Product Viewed",
							"properties": {
								"product_id": "123",
								"price": "14",
								"category": "shoes",
								"currency": "USD",
								"quantity": 1
							},
							"integrations": {
								"All": true
							},
							"sentAt": "2022-04-22T10:57:58Z"
						},
						"destination": {
							"Config": {
								"apiKey": "dummyApiKey",
								"pixelId": "dummyPixelId",
								"appId": "dhfeih44f",
								"snapAppId": "hfhdhfd"
							}
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
						"error": "Events must be sent within 28 days of their occurrence",
						"statTags": {
							"errorCategory": "dataValidation",
							"errorType": "instrumentation",
							"destType": "SNAPCHAT_CONVERSION",
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
		"name": "snapchat_conversion",
		"description": "Test 15",
		"feature": "processor",
		"module": "destination",
		"version": "v0",
		"input": {
			"request": {
				"body": [
					{
						"message": {
							"messageId": "ec5481b6-a926-4d2e-b293-0b3a77c4d3be",
							"originalTimestamp": "2022-04-22T10:57:58Z",
							"channel": "",
							"anonymousId": "ea5cfab2-3961-4d8a-8187-3d1858c99090",
							"context": {
								"traits": {
									"email": "test@email.com",
									"phone": "+91 2111111 "
								},
								"app": {
									"build": "1.0.0",
									"name": "RudderLabs JavaScript SDK",
									"namespace": "com.rudderlabs.javascript",
									"version": "1.0.0"
								},
								"device": {
									"advertisingId": "T0T0T072-5e28-45a1-9eda-ce22a3e36d1a",
									"id": "3f034872-5e28-45a1-9eda-ce22a3e36d1a",
									"manufacturer": "Google",
									"model": "AOSP on IA Emulator",
									"name": "generic_x86_arm",
									"type": "ios",
									"attTrackingStatus": 3
								},
								"library": {
									"name": "RudderLabs JavaScript SDK",
									"version": "1.0.0"
								},
								"locale": "en-US",
								"os": {
									"name": "iOS",
									"version": "14.4.1"
								},
								"screen": {
									"density": 2
								},
								"externalId": [
									{
										"type": "ga4AppInstanceId",
										"id": "f0dd99v4f979fb997ce453373900f891"
									}
								],
								"userAgent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_2) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/79.0.3945.88 Safari/537.36"
							},
							"type": "track",
							"event": "Payment Info Entered",
							"properties": {
								"checkout_id": "12dfdfdf3"
							},
							"integrations": {
								"All": true
							},
							"sentAt": "2022-04-22T10:57:58Z"
						},
						"destination": {
							"Config": {
								"apiKey": "dummyApiKey",
								"pixelId": "dummyPixelId",
								"appId": "dhfeih44f",
								"snapAppId": "hfhdhfd"
							}
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
						"error": "Events must be sent within 28 days of their occurrence",
						"statTags": {
							"errorCategory": "dataValidation",
							"errorType": "instrumentation",
							"destType": "SNAPCHAT_CONVERSION",
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
		"name": "snapchat_conversion",
		"description": "Test 16",
		"feature": "processor",
		"module": "destination",
		"version": "v0",
		"input": {
			"request": {
				"body": [
					{
						"message": {
							"messageId": "ec5481b6-a926-4d2e-b293-0b3a77c4d3be",
							"originalTimestamp": "2022-04-22T10:57:58Z",
							"channel": "",
							"anonymousId": "ea5cfab2-3961-4d8a-8187-3d1858c99090",
							"context": {
								"traits": {
									"email": "test@email.com",
									"phone": "+91 2111111 "
								},
								"app": {
									"build": "1.0.0",
									"name": "RudderLabs JavaScript SDK",
									"namespace": "com.rudderlabs.javascript",
									"version": "1.0.0"
								},
								"device": {
									"advertisingId": "T0T0T072-5e28-45a1-9eda-ce22a3e36d1a",
									"id": "3f034872-5e28-45a1-9eda-ce22a3e36d1a",
									"manufacturer": "Google",
									"model": "AOSP on IA Emulator",
									"name": "generic_x86_arm",
									"type": "ios",
									"attTrackingStatus": 3
								},
								"library": {
									"name": "RudderLabs JavaScript SDK",
									"version": "1.0.0"
								},
								"locale": "en-US",
								"os": {
									"name": "iOS",
									"version": "14.4.1"
								},
								"screen": {
									"density": 2
								},
								"externalId": [
									{
										"type": "ga4AppInstanceId",
										"id": "f0dd99v4f979fb997ce453373900f891"
									}
								],
								"userAgent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_2) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/79.0.3945.88 Safari/537.36"
							},
							"type": "track",
							"event": "subscribe",
							"properties": {
								"checkout_id": "123",
								"price": "14",
								"category": "shoes",
								"currency": "USD"
							},
							"integrations": {
								"All": true
							},
							"sentAt": "2022-04-22T10:57:58Z"
						},
						"destination": {
							"Config": {
								"apiKey": "dummyApiKey",
								"pixelId": "dummyPixelId",
								"appId": "dhfeih44f",
								"snapAppId": "hfhdhfd"
							}
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
						"error": "Events must be sent within 28 days of their occurrence",
						"statTags": {
							"errorCategory": "dataValidation",
							"errorType": "instrumentation",
							"destType": "SNAPCHAT_CONVERSION",
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
		"name": "snapchat_conversion",
		"description": "Test 17",
		"feature": "processor",
		"module": "destination",
		"version": "v0",
		"input": {
			"request": {
				"body": [
					{
						"message": {
							"messageId": "ec5481b6-a926-4d2e-b293-0b3a77c4d3be",
							"originalTimestamp": "2022-04-22T10:57:58Z",
							"channel": "",
							"anonymousId": "ea5cfab2-3961-4d8a-8187-3d1858c99090",
							"context": {
								"traits": {
									"email": "test@email.com",
									"phone": "+91 2111111 "
								},
								"app": {
									"build": "1.0.0",
									"name": "RudderLabs JavaScript SDK",
									"namespace": "com.rudderlabs.javascript",
									"version": "1.0.0"
								},
								"device": {
									"advertisingId": "T0T0T072-5e28-45a1-9eda-ce22a3e36d1a",
									"id": "3f034872-5e28-45a1-9eda-ce22a3e36d1a",
									"manufacturer": "Google",
									"model": "AOSP on IA Emulator",
									"name": "generic_x86_arm",
									"type": "ios",
									"attTrackingStatus": 3
								},
								"library": {
									"name": "RudderLabs JavaScript SDK",
									"version": "1.0.0"
								},
								"locale": "en-US",
								"os": {
									"name": "iOS",
									"version": "14.4.1"
								},
								"screen": {
									"density": 2
								},
								"externalId": [
									{
										"type": "ga4AppInstanceId",
										"id": "f0dd99v4f979fb997ce453373900f891"
									}
								],
								"userAgent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_2) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/79.0.3945.88 Safari/537.36"
							},
							"type": "track",
							"event": "Promotion Viewed",
							"properties": {
								"checkout_id": "123",
								"price": "14",
								"category": "shoes",
								"currency": "USD"
							},
							"integrations": {
								"All": true
							},
							"sentAt": "2022-04-22T10:57:58Z"
						},
						"destination": {
							"Config": {
								"apiKey": "dummyApiKey",
								"pixelId": "dummyPixelId",
								"appId": "dhfeih44f",
								"snapAppId": "hfhdhfd"
							}
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
						"error": "Events must be sent within 28 days of their occurrence",
						"statTags": {
							"errorCategory": "dataValidation",
							"errorType": "instrumentation",
							"destType": "SNAPCHAT_CONVERSION",
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
		"name": "snapchat_conversion",
		"description": "Test 18",
		"feature": "processor",
		"module": "destination",
		"version": "v0",
		"input": {
			"request": {
				"body": [
					{
						"message": {
							"messageId": "ec5481b6-a926-4d2e-b293-0b3a77c4d3be",
							"originalTimestamp": "2022-04-22T10:57:58Z",
							"channel": "",
							"anonymousId": "ea5cfab2-3961-4d8a-8187-3d1858c99090",
							"context": {
								"traits": {
									"email": "test@email.com",
									"phone": "+91 2111111 "
								},
								"app": {
									"build": "1.0.0",
									"name": "RudderLabs JavaScript SDK",
									"namespace": "com.rudderlabs.javascript",
									"version": "1.0.0"
								},
								"device": {
									"advertisingId": "T0T0T072-5e28-45a1-9eda-ce22a3e36d1a",
									"id": "3f034872-5e28-45a1-9eda-ce22a3e36d1a",
									"manufacturer": "Google",
									"model": "AOSP on IA Emulator",
									"name": "generic_x86_arm",
									"type": "ios",
									"attTrackingStatus": 3
								},
								"library": {
									"name": "RudderLabs JavaScript SDK",
									"version": "1.0.0"
								},
								"locale": "en-US",
								"os": {
									"name": "iOS",
									"version": "14.4.1"
								},
								"screen": {
									"density": 2
								},
								"externalId": [
									{
										"type": "ga4AppInstanceId",
										"id": "f0dd99v4f979fb997ce453373900f891"
									}
								],
								"userAgent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_2) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/79.0.3945.88 Safari/537.36"
							},
							"type": "track",
							"event": "Promotion clicked",
							"properties": {
								"checkout_id": "123",
								"price": "14",
								"category": "shoes",
								"currency": "USD"
							},
							"integrations": {
								"All": true
							},
							"sentAt": "2022-04-22T10:57:58Z"
						},
						"destination": {
							"Config": {
								"apiKey": "dummyApiKey",
								"pixelId": "dummyPixelId",
								"appId": "dhfeih44f",
								"snapAppId": "hfhdhfd"
							}
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
						"error": "Events must be sent within 28 days of their occurrence",
						"statTags": {
							"errorCategory": "dataValidation",
							"errorType": "instrumentation",
							"destType": "SNAPCHAT_CONVERSION",
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
		"name": "snapchat_conversion",
		"description": "Test 19",
		"feature": "processor",
		"module": "destination",
		"version": "v0",
		"input": {
			"request": {
				"body": [
					{
						"message": {
							"messageId": "ec5481b6-a926-4d2e-b293-0b3a77c4d3be",
							"originalTimestamp": "2022-04-22T10:57:58Z",
							"channel": "",
							"anonymousId": "ea5cfab2-3961-4d8a-8187-3d1858c99090",
							"context": {
								"traits": {
									"email": "test@email.com",
									"phone": "+91 2111111 "
								},
								"app": {
									"build": "1.0.0",
									"name": "RudderLabs JavaScript SDK",
									"namespace": "com.rudderlabs.javascript",
									"version": "1.0.0"
								},
								"device": {
									"advertisingId": "T0T0T072-5e28-45a1-9eda-ce22a3e36d1a",
									"id": "3f034872-5e28-45a1-9eda-ce22a3e36d1a",
									"manufacturer": "Google",
									"model": "AOSP on IA Emulator",
									"name": "generic_x86_arm",
									"type": "ios",
									"attTrackingStatus": 3
								},
								"library": {
									"name": "RudderLabs JavaScript SDK",
									"version": "1.0.0"
								},
								"locale": "en-US",
								"os": {
									"name": "iOS",
									"version": "14.4.1"
								},
								"screen": {
									"density": 2
								},
								"externalId": [
									{
										"type": "ga4AppInstanceId",
										"id": "f0dd99v4f979fb997ce453373900f891"
									}
								],
								"userAgent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_2) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/79.0.3945.88 Safari/537.36"
							},
							"type": "track",
							"event": "save",
							"properties": {
								"checkout_id": "123",
								"price": "14",
								"category": "shoes",
								"currency": "USD"
							},
							"integrations": {
								"All": true
							},
							"sentAt": "2022-04-22T10:57:58Z"
						},
						"destination": {
							"Config": {
								"apiKey": "dummyApiKey",
								"pixelId": "dummyPixelId",
								"appId": "dhfeih44f",
								"snapAppId": "hfhdhfd"
							}
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
						"error": "Events must be sent within 28 days of their occurrence",
						"statTags": {
							"errorCategory": "dataValidation",
							"errorType": "instrumentation",
							"destType": "SNAPCHAT_CONVERSION",
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
		"name": "snapchat_conversion",
		"description": "Test 20",
		"feature": "processor",
		"module": "destination",
		"version": "v0",
		"input": {
			"request": {
				"body": [
					{
						"message": {
							"messageId": "ec5481b6-a926-4d2e-b293-0b3a77c4d3be",
							"originalTimestamp": "2022-04-22T10:57:58Z",
							"anonymousId": "ea5cfab2-3961-4d8a-8187-3d1858c99090",
							"context": {
								"traits": {
									"email": "test@email.com",
									"phone": "+91 2111111 "
								},
								"app": {
									"build": "1.0.0",
									"name": "RudderLabs JavaScript SDK",
									"namespace": "com.rudderlabs.javascript",
									"version": "1.0.0"
								},
								"device": {
									"advertisingId": "T0T0T072-5e28-45a1-9eda-ce22a3e36d1a",
									"id": "3f034872-5e28-45a1-9eda-ce22a3e36d1a",
									"manufacturer": "Google",
									"model": "AOSP on IA Emulator",
									"name": "generic_x86_arm",
									"type": "ios",
									"attTrackingStatus": 3
								},
								"library": {
									"name": "RudderLabs JavaScript SDK",
									"version": "1.0.0"
								},
								"locale": "en-US",
								"os": {
									"name": "iOS",
									"version": "14.4.1"
								},
								"screen": {
									"density": 2
								},
								"externalId": [
									{
										"type": "ga4AppInstanceId",
										"id": "f0dd99v4f979fb997ce453373900f891"
									}
								],
								"userAgent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_2) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/79.0.3945.88 Safari/537.36"
							},
							"type": "track",
							"event": "Product Viewed",
							"properties": {
								"eventConversionType": "web",
								"checkout_id": "123",
								"price": "14",
								"category": "shoes",
								"currency": "USD",
								"url": "hjhb.com"
							},
							"integrations": {
								"All": true
							},
							"sentAt": "2022-04-22T10:57:58Z"
						},
						"destination": {
							"Config": {
								"apiKey": "dummyApiKey",
								"pixelId": "dummyPixelId",
								"appId": "dhfeih44f",
								"snapAppId": "hfhdhfd"
							}
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
						"error": "Events must be sent within 28 days of their occurrence",
						"statTags": {
							"errorCategory": "dataValidation",
							"errorType": "instrumentation",
							"destType": "SNAPCHAT_CONVERSION",
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
		"name": "snapchat_conversion",
		"description": "Test 21",
		"feature": "processor",
		"module": "destination",
		"version": "v0",
		"input": {
			"request": {
				"body": [
					{
						"message": {
							"messageId": "ec5481b6-a926-4d2e-b293-0b3a77c4d3be",
							"originalTimestamp": "2022-04-22T10:57:58Z",
							"anonymousId": "ea5cfab2-3961-4d8a-8187-3d1858c99090",
							"context": {
								"traits": {
									"email": "test@email.com",
									"phone": "+91 2111111 "
								},
								"app": {
									"build": "1.0.0",
									"name": "RudderLabs JavaScript SDK",
									"namespace": "com.rudderlabs.javascript",
									"version": "1.0.0"
								},
								"device": {
									"advertisingId": "T0T0T072-5e28-45a1-9eda-ce22a3e36d1a",
									"id": "3f034872-5e28-45a1-9eda-ce22a3e36d1a",
									"manufacturer": "Google",
									"model": "AOSP on IA Emulator",
									"name": "generic_x86_arm",
									"type": "ios",
									"attTrackingStatus": 3
								},
								"library": {
									"name": "RudderLabs JavaScript SDK",
									"version": "1.0.0"
								},
								"locale": "en-US",
								"os": {
									"name": "iOS",
									"version": "14.4.1"
								},
								"screen": {
									"density": 2
								},
								"externalId": [
									{
										"type": "ga4AppInstanceId",
										"id": "f0dd99v4f979fb997ce453373900f891"
									}
								],
								"userAgent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_2) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/79.0.3945.88 Safari/537.36"
							},
							"type": "track",
							"event": "Product Viewed",
							"properties": {
								"eventConversionType": "offline",
								"checkout_id": "123",
								"price": "14",
								"category": "shoes",
								"currency": "USD",
								"url": "hjhb.com"
							},
							"integrations": {
								"All": true
							},
							"sentAt": "2022-04-22T10:57:58Z"
						},
						"destination": {
							"Config": {
								"apiKey": "dummyApiKey",
								"pixelId": "dummyPixelId",
								"appId": "dhfeih44f",
								"snapAppId": "hfhdhfd"
							}
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
						"error": "Events must be sent within 28 days of their occurrence",
						"statTags": {
							"errorCategory": "dataValidation",
							"errorType": "instrumentation",
							"destType": "SNAPCHAT_CONVERSION",
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
		"name": "snapchat_conversion",
		"description": "Test 22",
		"feature": "processor",
		"module": "destination",
		"version": "v0",
		"input": {
			"request": {
				"body": [
					{
						"message": {
							"messageId": "ec5481b6-a926-4d2e-b293-0b3a77c4d3be",
							"originalTimestamp": "2022-04-22T10:57:58Z",
							"anonymousId": "ea5cfab2-3961-4d8a-8187-3d1858c99090",
							"context": {
								"traits": {
									"email": "test@email.com",
									"phone": "+91 2111111 "
								},
								"app": {
									"build": "1.0.0",
									"name": "RudderLabs JavaScript SDK",
									"namespace": "com.rudderlabs.javascript",
									"version": "1.0.0"
								},
								"device": {
									"advertisingId": "T0T0T072-5e28-45a1-9eda-ce22a3e36d1a",
									"id": "3f034872-5e28-45a1-9eda-ce22a3e36d1a",
									"manufacturer": "Google",
									"model": "AOSP on IA Emulator",
									"name": "generic_x86_arm",
									"type": "ios",
									"attTrackingStatus": 3
								},
								"library": {
									"name": "RudderLabs JavaScript SDK",
									"version": "1.0.0"
								},
								"locale": "en-US",
								"os": {
									"name": "iOS",
									"version": "14.4.1"
								},
								"screen": {
									"density": 2
								},
								"externalId": [
									{
										"type": "ga4AppInstanceId",
										"id": "f0dd99v4f979fb997ce453373900f891"
									}
								],
								"userAgent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_2) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/79.0.3945.88 Safari/537.36"
							},
							"type": "track",
							"event": "Products Searched",
							"properties": {
								"query": "t-shirts",
								"event_conversion_type": "web",
								"event_tag": "offline"
							},
							"integrations": {
								"All": true
							},
							"sentAt": "2022-04-22T10:57:58Z"
						},
						"destination": {
							"Config": {
								"pixelId": "dummyPixelId",
								"apiKey": "dummyApiKey"
							}
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
						"error": "Events must be sent within 28 days of their occurrence",
						"statTags": {
							"errorCategory": "dataValidation",
							"errorType": "instrumentation",
							"destType": "SNAPCHAT_CONVERSION",
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
		"name": "snapchat_conversion",
		"description": "Test 23",
		"feature": "processor",
		"module": "destination",
		"version": "v0",
		"input": {
			"request": {
				"body": [
					{
						"message": {
							"messageId": "ec5481b6-a926-4d2e-b293-0b3a77c4d3be",
							"originalTimestamp": "2022-04-22T10:57:58Z",
							"channel": "mobile",
							"anonymousId": "ea5cfab2-3961-4d8a-8187-3d1858c99090",
							"context": {
								"traits": {
									"email": "test@email.com",
									"phone": "+91 2111111 "
								},
								"app": {
									"build": "1.0.0",
									"name": "RudderLabs JavaScript SDK",
									"namespace": "com.rudderlabs.javascript",
									"version": "1.0.0"
								},
								"device": {
									"advertisingId": "T0T0T072-5e28-45a1-9eda-ce22a3e36d1a",
									"id": "3f034872-5e28-45a1-9eda-ce22a3e36d1a",
									"manufacturer": "Google",
									"model": "AOSP on IA Emulator",
									"name": "generic_x86_arm",
									"type": "ios",
									"attTrackingStatus": 3
								},
								"library": {
									"name": "RudderLabs JavaScript SDK",
									"version": "1.0.0"
								},
								"locale": "en-US",
								"os": {
									"name": "iOS",
									"version": "14.4.1"
								},
								"screen": {
									"density": 2
								},
								"externalId": [
									{
										"type": "ga4AppInstanceId",
										"id": "f0dd99v4f979fb997ce453373900f891"
									}
								],
								"userAgent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_2) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/79.0.3945.88 Safari/537.36"
							},
							"type": "track",
							"event": "Product Added to Wishlist",
							"properties": {
								"product_id": "123",
								"price": "14",
								"category": "shoes",
								"currency": "USD"
							},
							"integrations": {
								"All": true
							},
							"sentAt": "2022-04-22T10:57:58Z"
						},
						"destination": {
							"Config": {
								"apiKey": "dummyApiKey",
								"pixelId": "dummyPixelId",
								"appId": "dhfeih44f",
								"snapAppId": "hfhdhfd"
							}
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
						"error": "Events must be sent within 28 days of their occurrence",
						"statTags": {
							"errorCategory": "dataValidation",
							"errorType": "instrumentation",
							"destType": "SNAPCHAT_CONVERSION",
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
		"name": "snapchat_conversion",
		"description": "Test 24",
		"feature": "processor",
		"module": "destination",
		"version": "v0",
		"input": {
			"request": {
				"body": [
					{
						"message": {
							"messageId": "ec5481b6-a926-4d2e-b293-0b3a77c4d3be",
							"originalTimestamp": "2022-04-22T10:57:58Z",
							"anonymousId": "ea5cfab2-3961-4d8a-8187-3d1858c99090",
							"context": {
								"traits": {
									"email": "test@email.com",
									"phone": "+91 2111111 "
								},
								"app": {
									"build": "1.0.0",
									"name": "RudderLabs JavaScript SDK",
									"namespace": "com.rudderlabs.javascript",
									"version": "1.0.0"
								},
								"device": {
									"advertisingId": "T0T0T072-5e28-45a1-9eda-ce22a3e36d1a",
									"id": "3f034872-5e28-45a1-9eda-ce22a3e36d1a",
									"manufacturer": "Google",
									"model": "AOSP on IA Emulator",
									"name": "generic_x86_arm",
									"type": "ios",
									"attTrackingStatus": 3
								},
								"library": {
									"name": "RudderLabs JavaScript SDK",
									"version": "1.0.0"
								},
								"locale": "en-US",
								"os": {
									"name": "iOS",
									"version": "14.4.1"
								},
								"screen": {
									"density": 2
								},
								"externalId": [
									{
										"type": "ga4AppInstanceId",
										"id": "f0dd99v4f979fb997ce453373900f891"
									}
								],
								"userAgent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_2) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/79.0.3945.88 Safari/537.36"
							},
							"type": "track",
							"event": "ProdSearched",
							"properties": {
								"query": "t-shirts",
								"event_conversion_type": "web"
							},
							"integrations": {
								"All": true
							},
							"sentAt": "2022-04-22T10:57:58Z"
						},
						"destination": {
							"Config": {
								"pixelId": "dummyPixelId",
								"apiKey": "dummyApiKey",
								"rudderEventsToSnapEvents": [
									{
										"from": "ProdSearched",
										"to": "products_searched"
									}
								]
							}
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
						"error": "Events must be sent within 28 days of their occurrence",
						"statTags": {
							"errorCategory": "dataValidation",
							"errorType": "instrumentation",
							"destType": "SNAPCHAT_CONVERSION",
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
		"name": "snapchat_conversion",
		"description": "Test 25",
		"feature": "processor",
		"module": "destination",
		"version": "v0",
		"input": {
			"request": {
				"body": [
					{
						"message": {
							"messageId": "ec5481b6-a926-4d2e-b293-0b3a77c4d3be",
							"originalTimestamp": "2022-04-22T10:57:58Z",
							"anonymousId": "ea5cfab2-3961-4d8a-8187-3d1858c99090",
							"context": {
								"traits": {
									"email": "test@email.com",
									"phone": "+91 2111111 "
								},
								"app": {
									"build": "1.0.0",
									"name": "RudderLabs JavaScript SDK",
									"namespace": "com.rudderlabs.javascript",
									"version": "1.0.0"
								},
								"device": {
									"advertisingId": "T0T0T072-5e28-45a1-9eda-ce22a3e36d1a",
									"id": "3f034872-5e28-45a1-9eda-ce22a3e36d1a",
									"manufacturer": "Google",
									"model": "AOSP on IA Emulator",
									"name": "generic_x86_arm",
									"type": "ios",
									"attTrackingStatus": 3
								},
								"library": {
									"name": "RudderLabs JavaScript SDK",
									"version": "1.0.0"
								},
								"locale": "en-US",
								"os": {
									"name": "iOS",
									"version": "14.4.1"
								},
								"screen": {
									"density": 2
								},
								"externalId": [
									{
										"type": "ga4AppInstanceId",
										"id": "f0dd99v4f979fb997ce453373900f891"
									}
								],
								"userAgent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_2) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/79.0.3945.88 Safari/537.36"
							},
							"type": "track",
							"event": "ProdSearched",
							"properties": {
								"query": "t-shirts",
								"event_conversion_type": "web"
							},
							"integrations": {
								"All": true
							},
							"sentAt": "2022-04-22T10:57:58Z"
						},
						"destination": {
							"Config": {
								"pixelId": "dummyPixelId",
								"apiKey": "dummyApiKey",
								"rudderEventsToSnapEvents": []
							}
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
						"error": "Event ProdSearched doesn't match with Snapchat Events!",
						"statTags": {
							"errorCategory": "dataValidation",
							"errorType": "instrumentation",
							"destType": "SNAPCHAT_CONVERSION",
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
		"name": "snapchat_conversion",
		"description": "Test 26",
		"feature": "processor",
		"module": "destination",
		"version": "v0",
		"input": {
			"request": {
				"body": [
					{
						"message": {
							"messageId": "ec5481b6-a926-4d2e-b293-0b3a77c4d3be",
							"originalTimestamp": "2022-04-22T10:57:58Z",
							"anonymousId": "ea5cfab2-3961-4d8a-8187-3d1858c99090",
							"context": {
								"traits": {
									"email": "test@email.com",
									"phone": "+91 2111111 "
								},
								"app": {
									"build": "1.0.0",
									"name": "RudderLabs JavaScript SDK",
									"namespace": "com.rudderlabs.javascript",
									"version": "1.0.0"
								},
								"device": {
									"advertisingId": "T0T0T072-5e28-45a1-9eda-ce22a3e36d1a",
									"id": "3f034872-5e28-45a1-9eda-ce22a3e36d1a",
									"manufacturer": "Google",
									"model": "AOSP on IA Emulator",
									"name": "generic_x86_arm",
									"type": "ios",
									"attTrackingStatus": 3
								},
								"library": {
									"name": "RudderLabs JavaScript SDK",
									"version": "1.0.0"
								},
								"locale": "en-US",
								"os": {
									"name": "iOS",
									"version": "14.4.1"
								},
								"screen": {
									"density": 2
								},
								"userAgent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_2) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/79.0.3945.88 Safari/537.36"
							},
							"type": "track",
							"event": "Product Added to Cart",
							"properties": {
								"query": "t-shirts",
								"event_conversion_type": "web"
							},
							"integrations": {
								"All": true
							},
							"sentAt": "2022-04-22T10:57:58Z"
						},
						"destination": {
							"Config": {
								"pixelId": "dummyPixelId",
								"apiKey": "dummyApiKey",
								"rudderEventsToSnapEvents": [
									{
										"from": "Product_Added_To_Cart",
										"to": "products_searched"
									}
								]
							}
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
						"error": "Events must be sent within 28 days of their occurrence",
						"statTags": {
							"errorCategory": "dataValidation",
							"errorType": "instrumentation",
							"destType": "SNAPCHAT_CONVERSION",
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
		"name": "snapchat_conversion",
		"description": "Test 27",
		"feature": "processor",
		"module": "destination",
		"version": "v0",
		"input": {
			"request": {
				"body": [
					{
						"message": {
							"messageId": "ec5481b6-a926-4d2e-b293-0b3a77c4d3be",
							"originalTimestamp": "2022-04-22T10:57:58Z",
							"anonymousId": "ea5cfab2-3961-4d8a-8187-3d1858c99090",
							"context": {
								"traits": {
									"email": "test@email.com",
									"phone": "+91 2111111 "
								},
								"app": {
									"build": "1.0.0",
									"name": "RudderLabs JavaScript SDK",
									"namespace": "com.rudderlabs.javascript",
									"version": "1.0.0"
								},
								"device": {
									"advertisingId": "T0T0T072-5e28-45a1-9eda-ce22a3e36d1a",
									"id": "3f034872-5e28-45a1-9eda-ce22a3e36d1a",
									"manufacturer": "Google",
									"model": "AOSP on IA Emulator",
									"name": "generic_x86_arm",
									"type": "ios",
									"attTrackingStatus": 3
								},
								"library": {
									"name": "RudderLabs JavaScript SDK",
									"version": "1.0.0"
								},
								"locale": "en-US",
								"os": {
									"name": "iOS",
									"version": "14.4.1"
								},
								"screen": {
									"density": 2
								},
								"userAgent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_2) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/79.0.3945.88 Safari/537.36"
							},
							"type": "track",
							"event": "Product_Added_to_Cart",
							"properties": {
								"query": "t-shirts",
								"event_conversion_type": "web"
							},
							"integrations": {
								"All": true
							},
							"sentAt": "2022-04-22T10:57:58Z"
						},
						"destination": {
							"Config": {
								"pixelId": "dummyPixelId",
								"apiKey": "dummyApiKey",
								"rudderEventsToSnapEvents": [
									{
										"from": "Product Added To Cart",
										"to": "products_searched"
									}
								]
							}
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
						"error": "Events must be sent within 28 days of their occurrence",
						"statTags": {
							"errorCategory": "dataValidation",
							"errorType": "instrumentation",
							"destType": "SNAPCHAT_CONVERSION",
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
		"name": "snapchat_conversion",
		"description": "Test 28",
		"feature": "processor",
		"module": "destination",
		"version": "v0",
		"input": {
			"request": {
				"body": [
					{
						"message": {
							"messageId": "ec5481b6-a926-4d2e-b293-0b3a77c4d3be",
							"originalTimestamp": "2022-04-22T10:57:58Z",
							"channel": "mobile",
							"anonymousId": "ea5cfab2-3961-4d8a-8187-3d1858c99090",
							"context": {
								"traits": {
									"email": "test@email.com",
									"phone": "+91 2111111 "
								},
								"app": {
									"build": "1.0.0",
									"name": "RudderLabs JavaScript SDK",
									"namespace": "com.rudderlabs.javascript",
									"version": "1.0.0"
								},
								"device": {
									"advertisingId": "T0T0T072-5e28-45a1-9eda-ce22a3e36d1a",
									"id": "3f034872-5e28-45a1-9eda-ce22a3e36d1a",
									"manufacturer": "Google",
									"model": "AOSP on IA Emulator",
									"name": "generic_x86_arm",
									"type": "ios",
									"attTrackingStatus": 3
								},
								"library": {
									"name": "RudderLabs JavaScript SDK",
									"version": "1.0.0"
								},
								"locale": "en-US",
								"os": {
									"name": "iOS",
									"version": "14.4.1"
								},
								"screen": {
									"density": 2
								},
								"externalId": [
									{
										"type": "ga4AppInstanceId",
										"id": "f0dd99v4f979fb997ce453373900f891"
									}
								],
								"userAgent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_2) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/79.0.3945.88 Safari/537.36"
							},
							"type": "track",
							"event": "Order Completed",
							"properties": {
								"products": [
									{
										"product_id": "123",
										"price": "14",
										"quantity": 1
									},
									{
										"product_id": "123",
										"price": 14,
										"quantity": 3
									}
								],
								"revenue": "100"
							},
							"integrations": {
								"All": true
							},
							"sentAt": "2022-04-22T10:57:58Z"
						},
						"destination": {
							"Config": {
								"apiKey": "dummyApiKey",
								"pixelId": "dummyPixelId",
								"appId": "dhfeih44f",
								"snapAppId": "hfhdhfd"
							}
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
						"error": "Events must be sent within 28 days of their occurrence",
						"statTags": {
							"errorCategory": "dataValidation",
							"errorType": "instrumentation",
							"destType": "SNAPCHAT_CONVERSION",
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
		"name": "snapchat_conversion",
		"description": "Test 29",
		"feature": "processor",
		"module": "destination",
		"version": "v0",
		"input": {
			"request": {
				"body": [
					{
						"message": {
							"messageId": "ec5481b6-a926-4d2e-b293-0b3a77c4d3be",
							"originalTimestamp": "2022-04-22T10:57:58Z",
							"channel": "mobile",
							"anonymousId": "ea5cfab2-3961-4d8a-8187-3d1858c99090",
							"context": {
								"traits": {
									"email": "test@email.com",
									"phone": "+91 2111111 "
								},
								"app": {
									"build": "1.0.0",
									"name": "RudderLabs JavaScript SDK",
									"namespace": "com.rudderlabs.javascript",
									"version": "1.0.0"
								},
								"device": {
									"advertisingId": "T0T0T072-5e28-45a1-9eda-ce22a3e36d1a",
									"id": "3f034872-5e28-45a1-9eda-ce22a3e36d1a",
									"manufacturer": "Google",
									"model": "AOSP on IA Emulator",
									"name": "generic_x86_arm",
									"type": "ios",
									"attTrackingStatus": 3
								},
								"library": {
									"name": "RudderLabs JavaScript SDK",
									"version": "1.0.0"
								},
								"locale": "en-US",
								"os": {
									"name": "iOS",
									"version": "14.4.1"
								},
								"screen": {
									"density": 2
								},
								"externalId": [
									{
										"type": "ga4AppInstanceId",
										"id": "f0dd99v4f979fb997ce453373900f891"
									}
								],
								"userAgent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_2) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/79.0.3945.88 Safari/537.36"
							},
							"type": "track",
							"event": "Product List Viewed",
							"properties": {
								"products": [
									{
										"product_id": "123",
										"price": "14"
									},
									{
										"product_id": "123",
										"price": 14,
										"quantity": 3
									}
								],
								"revenue": "100"
							},
							"integrations": {
								"All": true
							},
							"sentAt": "2022-04-22T10:57:58Z"
						},
						"destination": {
							"Config": {
								"apiKey": "dummyApiKey",
								"pixelId": "dummyPixelId",
								"appId": "dhfeih44f",
								"snapAppId": "hfhdhfd"
							}
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
						"error": "Events must be sent within 28 days of their occurrence",
						"statTags": {
							"errorCategory": "dataValidation",
							"errorType": "instrumentation",
							"destType": "SNAPCHAT_CONVERSION",
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