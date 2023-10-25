export const mockFns = (_) => {
	// @ts-ignore
	jest
		.useFakeTimers()
		.setSystemTime(new Date('2023-09-29'));
};
export const data = [
	{
		"name": "ga",
		"description": "Test 0",
		"feature": "processor",
		"module": "destination",
		"version": "v0",
		"input": {
			"request": {
				"body": [
					{
						"message": {
							"channel": "web",
							"context": {
								"externalId": [
									{
										"id": "lynnanderson@smith.net",
										"identifierType": "device_id",
										"type": "AM-users"
									}
								],
								"mappedToDestination": "true",
								"app": {
									"build": "1.0.0",
									"name": "RudderLabs JavaScript SDK",
									"namespace": "com.rudderlabs.javascript",
									"version": "1.0.0"
								},
								"traits": {
									"anonymousId": "123456",
									"email": "test@rudderstack.com",
									"address": {
										"country": "India",
										"postalCode": 712136,
										"state": "WB",
										"street": "",
										"os_version": "test os"
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
								},
								"page": {
									"path": "/destinations/amplitude",
									"referrer": "",
									"search": "",
									"title": "",
									"url": "https://docs.rudderstack.com/destinations/amplitude",
									"category": "destination",
									"initial_referrer": "https://docs.rudderstack.com",
									"initial_referring_domain": "docs.rudderstack.com"
								}
							},
							"traits": {
								"anonymousId": "123456",
								"email": "test@rudderstack.com",
								"city": "kolkata",
								"address": {
									"country": "India",
									"postalCode": 712136,
									"state": "WB",
									"street": ""
								},
								"os_version": "test os",
								"ip": "0.0.0.0",
								"age": 26,
								"an": "Test App name",
								"ul": "Test ul"
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
						},
						"destination": {
							"Config": {
								"trackingID": "UA-165994240-1",
								"doubleClick": true,
								"enhancedLinkAttribution": true,
								"classic": true,
								"ignoredReferrers": "",
								"serverClassic": false,
								"includeSearch": true,
								"trackCategorizedPages": true,
								"trackNamedPages": true,
								"sampleRate": "100",
								"siteSpeedSampleRate": "1",
								"setAllMappedProps": true,
								"enableServerSideIdentify": true,
								"serverSideIdentifyEventCategory": "name",
								"serverSideIdentifyEventAction": "action1",
								"anonymizeIp": true,
								"domain": "domain",
								"enhancedEcommerce": true,
								"nonInteraction": true,
								"optimize": "abc123",
								"sendUserId": true,
								"useGoogleAmpClientId": true,
								"web-useNativeSDK": true,
								"dimensions": [
									{
										"from": "name",
										"to": "dimension1"
									},
									{
										"from": "custom2",
										"to": "dimension2"
									}
								],
								"metrics": [
									{
										"from": "email",
										"to": "metric1"
									},
									{
										"from": "trait2",
										"to": "metric2"
									}
								],
								"resetCustomDimensionsOnPage": [
									{
										"resetCustomDimensionsOnPage": "abc"
									},
									{
										"resetCustomDimensionsOnPage": "xyz"
									}
								],
								"contentGroupings": [
									{
										"from": "plan",
										"to": "contentGroup1"
									},
									{
										"from": "name",
										"to": "contentGroup2"
									}
								]
							},
							"Enabled": true
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
							"endpoint": "https://www.google-analytics.com/collect",
							"headers": {},
							"params": {
								"ea": "action1",
								"ec": "All",
								"ni": 1,
								"ul": "Test ul",
								"an": "Test App name",
								"cm1": "test@rudderstack.com",
								"v": "1",
								"t": "event",
								"tid": "UA-165994240-1",
								"ds": "web",
								"npa": 1,
								"aip": 1,
								"ua": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/77.0.3865.90 Safari/537.36",
								"av": "1.0.0",
								"aiid": "com.rudderlabs.javascript",
								"uid": "123456",
								"cid": "123456",
								"uip": "0.0.0.0",
								"qt": 124901802438
							},
							"body": {
								"JSON": {},
								"JSON_ARRAY": {},
								"XML": {},
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
		"name": "ga",
		"description": "Test 1",
		"feature": "processor",
		"module": "destination",
		"version": "v0",
		"input": {
			"request": {
				"body": [
					{
						"message": {
							"channel": "web",
							"context": {
								"traits": {
									"name": "Rudder Test"
								},
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
							"properties": {
								"plan": "standard plan",
								"name": "rudder test"
							},
							"type": "identify",
							"messageId": "84e26acc-56a5-4835-8233-591137fca468",
							"originalTimestamp": "2019-10-14T11:15:18.299Z",
							"anonymousId": "00000000000000000000000000",
							"userId": "123456",
							"integrations": {
								"All": true
							},
							"sentAt": "2019-10-14T09:03:22.563Z"
						},
						"destination": {
							"Config": {
								"trackingID": "UA-165994240-1",
								"doubleClick": true,
								"enhancedLinkAttribution": true,
								"classic": true,
								"ignoredReferrers": "",
								"serverClassic": false,
								"includeSearch": true,
								"trackCategorizedPages": true,
								"trackNamedPages": true,
								"sampleRate": "100",
								"siteSpeedSampleRate": "1",
								"setAllMappedProps": true,
								"enableServerSideIdentify": true,
								"serverSideIdentifyEventCategory": "name",
								"serverSideIdentifyEventAction": "action1",
								"anonymizeIp": true,
								"domain": "domain",
								"enhancedEcommerce": true,
								"nonInteraction": true,
								"optimize": "abc123",
								"sendUserId": true,
								"useGoogleAmpClientId": true,
								"web-useNativeSDK": true,
								"dimensions": [
									{
										"from": "name",
										"to": "dimension1"
									},
									{
										"from": "custom2",
										"to": "dimension2"
									}
								],
								"metrics": [
									{
										"from": "email",
										"to": "metric1"
									},
									{
										"from": "trait2",
										"to": "metric2"
									}
								],
								"resetCustomDimensionsOnPage": [
									{
										"resetCustomDimensionsOnPage": "abc"
									},
									{
										"resetCustomDimensionsOnPage": "xyz"
									}
								],
								"contentGroupings": [
									{
										"from": "plan",
										"to": "contentGroup1"
									},
									{
										"from": "name",
										"to": "contentGroup2"
									}
								]
							},
							"Enabled": true
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
							"endpoint": "https://www.google-analytics.com/collect",
							"headers": {},
							"params": {
								"ea": "action1",
								"ec": "Rudder Test",
								"cd1": "Rudder Test",
								"cg2": "Rudder Test",
								"v": "1",
								"t": "event",
								"tid": "UA-165994240-1",
								"ds": "web",
								"an": "RudderLabs JavaScript SDK",
								"av": "1.0.0",
								"aiid": "com.rudderlabs.javascript",
								"npa": 1,
								"aip": 1,
								"uid": "123456",
								"cid": "00000000000000000000000000",
								"ni": 1,
								"uip": "0.0.0.0",
								"ua": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/77.0.3865.90 Safari/537.36",
								"ul": "en-US",
								"qt": 124893881701
							},
							"body": {
								"JSON": {},
								"XML": {},
								"JSON_ARRAY": {},
								"FORM": {}
							},
							"files": {},
							"userId": "00000000000000000000000000"
						},
						"statusCode": 200
					}
				]
			}
		}
	},
	{
		"name": "ga",
		"description": "Test 2",
		"feature": "processor",
		"module": "destination",
		"version": "v0",
		"input": {
			"request": {
				"body": [
					{
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
									"email": "test@rudderstack.com"
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
							"type": "page",
							"messageId": "5e10d13a-bf9a-44bf-b884-43a9e591ea71",
							"originalTimestamp": "2019-10-14T11:15:18.299Z",
							"anonymousId": "00000000000000000000000000",
							"userId": "12345",
							"properties": {
								"path": "/abc",
								"referrer": "q",
								"search": "",
								"title": "a",
								"url": "https://www.example.com/abc"
							},
							"integrations": {
								"All": true
							},
							"name": "ApplicationLoaded",
							"sentAt": "2019-10-14T11:15:53.296Z"
						},
						"destination": {
							"Config": {
								"trackingID": "UA-165994240-1",
								"doubleClick": true,
								"enhancedLinkAttribution": true,
								"classic": true,
								"ignoredReferrers": "",
								"serverClassic": false,
								"includeSearch": true,
								"trackCategorizedPages": true,
								"trackNamedPages": true,
								"sampleRate": "100",
								"siteSpeedSampleRate": "1",
								"setAllMappedProps": true,
								"enableServerSideIdentify": true,
								"serverSideIdentifyEventCategory": "cat1",
								"serverSideIdentifyEventAction": "action1",
								"anonymizeIp": true,
								"domain": "domain",
								"enhancedEcommerce": true,
								"nonInteraction": true,
								"optimize": "abc123",
								"sendUserId": true,
								"useGoogleAmpClientId": true,
								"web-useNativeSDK": true,
								"dimensions": [
									{
										"from": "name",
										"to": "dimension1"
									},
									{
										"from": "custom2",
										"to": "dimension2"
									}
								],
								"metrics": [
									{
										"from": "email",
										"to": "metric1"
									},
									{
										"from": "trait2",
										"to": "metric2"
									}
								],
								"resetCustomDimensionsOnPage": [
									{
										"resetCustomDimensionsOnPage": "abc"
									},
									{
										"resetCustomDimensionsOnPage": "xyz"
									}
								],
								"contentGroupings": [
									{
										"from": "plan",
										"to": "contentGroup1"
									},
									{
										"from": "prop2",
										"to": "contentGroup2"
									}
								]
							},
							"Enabled": true
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
							"endpoint": "https://www.google-analytics.com/collect",
							"headers": {},
							"params": {
								"v": "1",
								"t": "pageview",
								"tid": "UA-165994240-1",
								"ds": "web",
								"an": "RudderLabs JavaScript SDK",
								"av": "1.0.0",
								"aiid": "com.rudderlabs.javascript",
								"npa": 1,
								"aip": 1,
								"cid": "00000000000000000000000000",
								"ua": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/77.0.3865.90 Safari/537.36",
								"uid": "12345",
								"uip": "0.0.0.0",
								"ul": "en-US",
								"dh": "www.example.com",
								"dl": "https://www.example.com/abc",
								"dp": "%2Fabc",
								"dr": "q",
								"dt": "a",
								"qt": 124893881701
							},
							"body": {
								"JSON": {},
								"XML": {},
								"JSON_ARRAY": {},
								"FORM": {}
							},
							"files": {},
							"userId": "00000000000000000000000000"
						},
						"statusCode": 200
					}
				]
			}
		}
	},
	{
		"name": "ga",
		"description": "Test 3",
		"feature": "processor",
		"module": "destination",
		"version": "v0",
		"input": {
			"request": {
				"body": [
					{
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
									"email": "test@rudderstack.com"
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
							"type": "track",
							"messageId": "ec5481b6-a926-4d2e-b293-0b3a77c4d3be",
							"originalTimestamp": "2019-10-14T11:15:18.300Z",
							"anonymousId": "00000000000000000000000000",
							"userId": "12345",
							"event": "test track event GA3",
							"properties": {
								"category": "test-category",
								"user_actual_role": "system_admin, system_user",
								"user_actual_id": 12345
							},
							"integrations": {
								"All": true
							},
							"sentAt": "2019-10-14T11:15:53.296Z"
						},
						"destination": {
							"Config": {
								"trackingID": "UA-165994240-1",
								"doubleClick": true,
								"enhancedLinkAttribution": true,
								"classic": true,
								"ignoredReferrers": "",
								"serverClassic": false,
								"includeSearch": true,
								"trackCategorizedPages": true,
								"trackNamedPages": true,
								"sampleRate": "100",
								"siteSpeedSampleRate": "1",
								"setAllMappedProps": true,
								"enableServerSideIdentify": true,
								"serverSideIdentifyEventCategory": "cat1",
								"serverSideIdentifyEventAction": "action1",
								"anonymizeIp": true,
								"domain": "domain",
								"enhancedEcommerce": true,
								"nonInteraction": true,
								"optimize": "abc123",
								"sendUserId": true,
								"useGoogleAmpClientId": true,
								"web-useNativeSDK": true,
								"dimensions": [
									{
										"from": "name",
										"to": "dimension1"
									},
									{
										"from": "custom2",
										"to": "dimension2"
									}
								],
								"metrics": [
									{
										"from": "email",
										"to": "metric1"
									},
									{
										"from": "trait2",
										"to": "metric2"
									}
								],
								"resetCustomDimensionsOnPage": [
									{
										"resetCustomDimensionsOnPage": "abc"
									},
									{
										"resetCustomDimensionsOnPage": "xyz"
									}
								],
								"contentGroupings": [
									{
										"from": "plan",
										"to": "contentGroup1"
									},
									{
										"from": "prop2",
										"to": "contentGroup2"
									}
								]
							},
							"Enabled": true
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
							"endpoint": "https://www.google-analytics.com/collect",
							"headers": {},
							"params": {
								"ec": "test-category",
								"ni": 1,
								"v": "1",
								"el": "event",
								"t": "event",
								"tid": "UA-165994240-1",
								"ds": "web",
								"an": "RudderLabs JavaScript SDK",
								"av": "1.0.0",
								"aiid": "com.rudderlabs.javascript",
								"npa": 1,
								"aip": 1,
								"cid": "00000000000000000000000000",
								"ea": "test track event GA3",
								"ua": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/77.0.3865.90 Safari/537.36",
								"uid": "12345",
								"ul": "en-US",
								"qt": 124893881700
							},
							"body": {
								"JSON": {},
								"XML": {},
								"JSON_ARRAY": {},
								"FORM": {}
							},
							"files": {},
							"userId": "00000000000000000000000000"
						},
						"statusCode": 200
					}
				]
			}
		}
	},
	{
		"name": "ga",
		"description": "Test 4",
		"feature": "processor",
		"module": "destination",
		"version": "v0",
		"input": {
			"request": {
				"body": [
					{
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
									"email": "test@rudderstack.com"
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
							"type": "track",
							"messageId": "ec5481b6-a926-4d2e-b293-0b3a77c4d3be",
							"originalTimestamp": "2019-10-14T11:15:18.300Z",
							"anonymousId": "00000000000000000000000000",
							"userId": "12345",
							"event": "order completed",
							"properties": {
								"order_id": "rudderstackorder1",
								"total": 99.99,
								"shipping": 13.99,
								"tax": 20.99,
								"currency": "INR",
								"products": [
									{
										"quantity": 1,
										"price": 24.75,
										"name": "my product",
										"sku": "p-298"
									},
									{
										"quantity": 3,
										"price": 24.75,
										"name": "other product",
										"sku": "p-299"
									}
								]
							},
							"integrations": {
								"All": true
							},
							"sentAt": "2019-10-14T11:15:53.296Z"
						},
						"destination": {
							"Config": {
								"trackingID": "UA-165994240-1",
								"doubleClick": true,
								"enhancedLinkAttribution": true,
								"classic": true,
								"ignoredReferrers": "",
								"serverClassic": false,
								"includeSearch": true,
								"trackCategorizedPages": true,
								"trackNamedPages": true,
								"sampleRate": "100",
								"siteSpeedSampleRate": "1",
								"setAllMappedProps": true,
								"enableServerSideIdentify": true,
								"serverSideIdentifyEventCategory": "cat1",
								"serverSideIdentifyEventAction": "action1",
								"anonymizeIp": true,
								"domain": "domain",
								"enhancedEcommerce": true,
								"nonInteraction": true,
								"optimize": "abc123",
								"sendUserId": true,
								"useGoogleAmpClientId": true,
								"web-useNativeSDK": true,
								"dimensions": [
									{
										"from": "name",
										"to": "dimension1"
									},
									{
										"from": "custom2",
										"to": "dimension2"
									}
								],
								"metrics": [
									{
										"from": "email",
										"to": "metric1"
									},
									{
										"from": "trait2",
										"to": "metric2"
									}
								],
								"resetCustomDimensionsOnPage": [
									{
										"resetCustomDimensionsOnPage": "abc"
									},
									{
										"resetCustomDimensionsOnPage": "xyz"
									}
								],
								"contentGroupings": [
									{
										"from": "plan",
										"to": "contentGroup1"
									},
									{
										"from": "prop2",
										"to": "contentGroup2"
									}
								]
							},
							"Enabled": true
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
							"endpoint": "https://www.google-analytics.com/collect",
							"headers": {},
							"params": {
								"pa": "purchase",
								"tr": 99.99,
								"ev": 100,
								"pr1id": "p-298",
								"pr1cd1": "my product",
								"pr1nm": "my product",
								"pr1pr": 24.75,
								"pr2id": "p-299",
								"pr2cd1": "other product",
								"pr2nm": "other product",
								"pr2pr": 24.75,
								"ea": "order completed",
								"ec": "EnhancedEcommerce",
								"v": "1",
								"t": "event",
								"el": "event",
								"tid": "UA-165994240-1",
								"ds": "web",
								"an": "RudderLabs JavaScript SDK",
								"av": "1.0.0",
								"aiid": "com.rudderlabs.javascript",
								"npa": 1,
								"aip": 1,
								"cid": "00000000000000000000000000",
								"ti": "rudderstackorder1",
								"ts": 13.99,
								"tt": 20.99,
								"cu": "INR",
								"ua": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/77.0.3865.90 Safari/537.36",
								"uid": "12345",
								"ni": 1,
								"pr1qt": 1,
								"pr2qt": 3,
								"ul": "en-US",
								"qt": 124893881700
							},
							"body": {
								"JSON": {},
								"XML": {},
								"JSON_ARRAY": {},
								"FORM": {}
							},
							"files": {},
							"userId": "00000000000000000000000000"
						},
						"statusCode": 200
					}
				]
			}
		}
	},
	{
		"name": "ga",
		"description": "Test 5",
		"feature": "processor",
		"module": "destination",
		"version": "v0",
		"input": {
			"request": {
				"body": [
					{
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
									"email": "test@rudderstack.com"
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
							"type": "track",
							"messageId": "ec5481b6-a926-4d2e-b293-0b3a77c4d3be",
							"originalTimestamp": "2019-10-14T11:15:18.300Z",
							"anonymousId": "00000000000000000000000000",
							"userId": "12345",
							"event": "product added",
							"properties": {
								"currency": "CAD",
								"quantity": 1,
								"price": 24.75,
								"name": "my product 1",
								"category": "cat 1",
								"sku": "p-298",
								"testDimension": true,
								"testMetric": true,
								"position": 4.5
							},
							"integrations": {
								"All": true
							},
							"sentAt": "2019-10-14T11:15:53.296Z"
						},
						"destination": {
							"Config": {
								"trackingID": "UA-165994240-1",
								"doubleClick": true,
								"enhancedLinkAttribution": true,
								"classic": true,
								"ignoredReferrers": "",
								"serverClassic": false,
								"includeSearch": true,
								"trackCategorizedPages": true,
								"trackNamedPages": true,
								"sampleRate": "100",
								"siteSpeedSampleRate": "1",
								"setAllMappedProps": true,
								"enableServerSideIdentify": true,
								"serverSideIdentifyEventCategory": "cat1",
								"serverSideIdentifyEventAction": "action1",
								"anonymizeIp": true,
								"domain": "domain",
								"enhancedEcommerce": true,
								"nonInteraction": true,
								"optimize": "abc123",
								"sendUserId": true,
								"useGoogleAmpClientId": true,
								"web-useNativeSDK": true,
								"dimensions": [
									{
										"from": "name",
										"to": "dimension1"
									},
									{
										"from": "custom2",
										"to": "dimension2"
									}
								],
								"metrics": [
									{
										"from": "email",
										"to": "metric1"
									},
									{
										"from": "trait2",
										"to": "metric2"
									}
								],
								"resetCustomDimensionsOnPage": [
									{
										"resetCustomDimensionsOnPage": "abc"
									},
									{
										"resetCustomDimensionsOnPage": "xyz"
									}
								],
								"contentGroupings": [
									{
										"from": "plan",
										"to": "contentGroup1"
									},
									{
										"from": "prop2",
										"to": "contentGroup2"
									}
								]
							},
							"Enabled": true
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
							"endpoint": "https://www.google-analytics.com/collect",
							"headers": {},
							"params": {
								"ea": "product added",
								"ec": "cat 1",
								"pa": "add",
								"pr1cd1": "my product 1",
								"pr1id": "p-298",
								"cd1": "my product 1",
								"v": "1",
								"t": "event",
								"el": "event",
								"tid": "UA-165994240-1",
								"ds": "web",
								"an": "RudderLabs JavaScript SDK",
								"av": "1.0.0",
								"aiid": "com.rudderlabs.javascript",
								"npa": 1,
								"aip": 1,
								"cid": "00000000000000000000000000",
								"pr1nm": "my product 1",
								"pr1ca": "cat 1",
								"cu": "CAD",
								"pr1ps": 4.5,
								"pr1pr": 24.75,
								"pr1qt": 1,
								"ua": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/77.0.3865.90 Safari/537.36",
								"uid": "12345",
								"ni": 1,
								"ul": "en-US",
								"qt": 124893881700
							},
							"body": {
								"JSON": {},
								"XML": {},
								"JSON_ARRAY": {},
								"FORM": {}
							},
							"files": {},
							"userId": "00000000000000000000000000"
						},
						"statusCode": 200
					}
				]
			}
		}
	},
	{
		"name": "ga",
		"description": "Test 6",
		"feature": "processor",
		"module": "destination",
		"version": "v0",
		"input": {
			"request": {
				"body": [
					{
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
									"email": "test@rudderstack.com"
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
							"type": "track",
							"messageId": "ec5481b6-a926-4d2e-b293-0b3a77c4d3be",
							"originalTimestamp": "2019-10-14T11:15:18.300Z",
							"anonymousId": "00000000000000000000000000",
							"userId": "12345",
							"event": "product removed",
							"properties": {
								"currency": "CAD",
								"quantity": 1,
								"price": 24.75,
								"name": "my product 1",
								"category": "cat 1",
								"sku": "p-298",
								"testDimension": true,
								"testMetric": true,
								"position": 4.5
							},
							"integrations": {
								"All": true
							},
							"sentAt": "2019-10-14T11:15:53.296Z"
						},
						"destination": {
							"Config": {
								"trackingID": "UA-165994240-1",
								"doubleClick": true,
								"enhancedLinkAttribution": true,
								"classic": true,
								"ignoredReferrers": "",
								"serverClassic": false,
								"includeSearch": true,
								"trackCategorizedPages": true,
								"trackNamedPages": true,
								"sampleRate": "100",
								"siteSpeedSampleRate": "1",
								"setAllMappedProps": true,
								"enableServerSideIdentify": true,
								"serverSideIdentifyEventCategory": "cat1",
								"serverSideIdentifyEventAction": "action1",
								"anonymizeIp": true,
								"domain": "domain",
								"enhancedEcommerce": true,
								"nonInteraction": true,
								"optimize": "abc123",
								"sendUserId": true,
								"useGoogleAmpClientId": true,
								"web-useNativeSDK": true,
								"dimensions": [
									{
										"from": "name",
										"to": "dimension1"
									},
									{
										"from": "custom2",
										"to": "dimension2"
									}
								],
								"metrics": [
									{
										"from": "email",
										"to": "metric1"
									},
									{
										"from": "trait2",
										"to": "metric2"
									}
								],
								"resetCustomDimensionsOnPage": [
									{
										"resetCustomDimensionsOnPage": "abc"
									},
									{
										"resetCustomDimensionsOnPage": "xyz"
									}
								],
								"contentGroupings": [
									{
										"from": "plan",
										"to": "contentGroup1"
									},
									{
										"from": "prop2",
										"to": "contentGroup2"
									}
								]
							},
							"Enabled": true
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
							"endpoint": "https://www.google-analytics.com/collect",
							"headers": {},
							"params": {
								"ea": "product removed",
								"ec": "cat 1",
								"pa": "remove",
								"pr1cd1": "my product 1",
								"pr1id": "p-298",
								"cd1": "my product 1",
								"v": "1",
								"t": "event",
								"el": "event",
								"tid": "UA-165994240-1",
								"ds": "web",
								"an": "RudderLabs JavaScript SDK",
								"av": "1.0.0",
								"aiid": "com.rudderlabs.javascript",
								"npa": 1,
								"aip": 1,
								"cid": "00000000000000000000000000",
								"pr1nm": "my product 1",
								"pr1ca": "cat 1",
								"cu": "CAD",
								"pr1ps": 4.5,
								"pr1pr": 24.75,
								"pr1qt": 1,
								"ua": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/77.0.3865.90 Safari/537.36",
								"uid": "12345",
								"ul": "en-US",
								"ni": 1,
								"qt": 124893881700
							},
							"body": {
								"JSON": {},
								"XML": {},
								"JSON_ARRAY": {},
								"FORM": {}
							},
							"files": {},
							"userId": "00000000000000000000000000"
						},
						"statusCode": 200
					}
				]
			}
		}
	},
	{
		"name": "ga",
		"description": "Test 7",
		"feature": "processor",
		"module": "destination",
		"version": "v0",
		"input": {
			"request": {
				"body": [
					{
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
									"email": "test@rudderstack.com"
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
							"type": "track",
							"messageId": "ec5481b6-a926-4d2e-b293-0b3a77c4d3be",
							"originalTimestamp": "2019-10-14T11:15:18.300Z",
							"anonymousId": "00000000000000000000000000",
							"userId": "12345",
							"event": "product viewed",
							"properties": {
								"currency": "CAD",
								"quantity": 1,
								"price": 24.75,
								"name": "my product 1",
								"category": "cat 1",
								"sku": "p-298",
								"testDimension": true,
								"testMetric": true,
								"position": 4.5
							},
							"integrations": {
								"All": true
							},
							"sentAt": "2019-10-14T11:15:53.296Z"
						},
						"destination": {
							"Config": {
								"trackingID": "UA-165994240-1",
								"doubleClick": true,
								"enhancedLinkAttribution": true,
								"classic": true,
								"ignoredReferrers": "",
								"serverClassic": false,
								"includeSearch": true,
								"trackCategorizedPages": true,
								"trackNamedPages": true,
								"sampleRate": "100",
								"siteSpeedSampleRate": "1",
								"setAllMappedProps": true,
								"enableServerSideIdentify": true,
								"serverSideIdentifyEventCategory": "cat1",
								"serverSideIdentifyEventAction": "action1",
								"anonymizeIp": true,
								"domain": "domain",
								"enhancedEcommerce": true,
								"nonInteraction": true,
								"optimize": "abc123",
								"sendUserId": true,
								"useGoogleAmpClientId": true,
								"web-useNativeSDK": true,
								"dimensions": [
									{
										"from": "name",
										"to": "dimension1"
									},
									{
										"from": "custom2",
										"to": "dimension2"
									}
								],
								"metrics": [
									{
										"from": "email",
										"to": "metric1"
									},
									{
										"from": "trait2",
										"to": "metric2"
									}
								],
								"resetCustomDimensionsOnPage": [
									{
										"resetCustomDimensionsOnPage": "abc"
									},
									{
										"resetCustomDimensionsOnPage": "xyz"
									}
								],
								"contentGroupings": [
									{
										"from": "plan",
										"to": "contentGroup1"
									},
									{
										"from": "prop2",
										"to": "contentGroup2"
									}
								]
							},
							"Enabled": true
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
							"endpoint": "https://www.google-analytics.com/collect",
							"headers": {},
							"params": {
								"ea": "product viewed",
								"ec": "cat 1",
								"pa": "detail",
								"pr1cd1": "my product 1",
								"pr1id": "p-298",
								"cd1": "my product 1",
								"v": "1",
								"t": "event",
								"el": "event",
								"tid": "UA-165994240-1",
								"ds": "web",
								"an": "RudderLabs JavaScript SDK",
								"av": "1.0.0",
								"aiid": "com.rudderlabs.javascript",
								"npa": 1,
								"aip": 1,
								"cid": "00000000000000000000000000",
								"pr1nm": "my product 1",
								"pr1ca": "cat 1",
								"cu": "CAD",
								"pr1ps": 4.5,
								"pr1pr": 24.75,
								"pr1qt": 1,
								"ua": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/77.0.3865.90 Safari/537.36",
								"uid": "12345",
								"ul": "en-US",
								"ni": 1,
								"qt": 124893881700
							},
							"body": {
								"JSON": {},
								"XML": {},
								"JSON_ARRAY": {},
								"FORM": {}
							},
							"files": {},
							"userId": "00000000000000000000000000"
						},
						"statusCode": 200
					}
				]
			}
		}
	},
	{
		"name": "ga",
		"description": "Test 8",
		"feature": "processor",
		"module": "destination",
		"version": "v0",
		"input": {
			"request": {
				"body": [
					{
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
									"email": "test@rudderstack.com"
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
							"type": "track",
							"messageId": "ec5481b6-a926-4d2e-b293-0b3a77c4d3be",
							"originalTimestamp": "2019-10-14T11:15:18.299Z",
							"anonymousId": "00000000000000000000000000",
							"userId": "12345",
							"event": "product removed",
							"properties": {
								"currency": "CAD",
								"quantity": 1,
								"price": 24.75,
								"name": "my product 1",
								"category": "cat 1",
								"sku": "p-298",
								"testDimension": true,
								"testMetric": true,
								"position": 4.5
							},
							"integrations": {
								"All": true
							},
							"sentAt": "2019-10-14T11:15:53.296Z"
						},
						"destination": {
							"Config": {
								"trackingID": "UA-165994240-1",
								"doubleClick": true,
								"enhancedLinkAttribution": true,
								"classic": true,
								"ignoredReferrers": "",
								"serverClassic": false,
								"includeSearch": true,
								"trackCategorizedPages": true,
								"trackNamedPages": true,
								"sampleRate": "100",
								"siteSpeedSampleRate": "1",
								"setAllMappedProps": true,
								"enableServerSideIdentify": true,
								"serverSideIdentifyEventCategory": "cat1",
								"serverSideIdentifyEventAction": "action1",
								"anonymizeIp": true,
								"domain": "domain",
								"enhancedEcommerce": true,
								"nonInteraction": true,
								"optimize": "abc123",
								"sendUserId": true,
								"useGoogleAmpClientId": true,
								"web-useNativeSDK": true,
								"dimensions": [
									{
										"from": "name",
										"to": "dimension1"
									},
									{
										"from": "custom2",
										"to": "dimension2"
									}
								],
								"metrics": [
									{
										"from": "email",
										"to": "metric1"
									},
									{
										"from": "trait2",
										"to": "metric2"
									}
								],
								"resetCustomDimensionsOnPage": [
									{
										"resetCustomDimensionsOnPage": "abc"
									},
									{
										"resetCustomDimensionsOnPage": "xyz"
									}
								],
								"contentGroupings": [
									{
										"from": "plan",
										"to": "contentGroup1"
									},
									{
										"from": "prop2",
										"to": "contentGroup2"
									}
								]
							},
							"Enabled": true
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
							"endpoint": "https://www.google-analytics.com/collect",
							"headers": {},
							"params": {
								"ea": "product removed",
								"ec": "cat 1",
								"pa": "remove",
								"pr1cd1": "my product 1",
								"pr1id": "p-298",
								"cd1": "my product 1",
								"v": "1",
								"t": "event",
								"el": "event",
								"tid": "UA-165994240-1",
								"ds": "web",
								"an": "RudderLabs JavaScript SDK",
								"av": "1.0.0",
								"aiid": "com.rudderlabs.javascript",
								"npa": 1,
								"aip": 1,
								"cid": "00000000000000000000000000",
								"pr1nm": "my product 1",
								"pr1ca": "cat 1",
								"cu": "CAD",
								"pr1ps": 4.5,
								"pr1pr": 24.75,
								"pr1qt": 1,
								"ua": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/77.0.3865.90 Safari/537.36",
								"uid": "12345",
								"ul": "en-US",
								"ni": 1,
								"qt": 124893881701
							},
							"body": {
								"JSON": {},
								"XML": {},
								"JSON_ARRAY": {},
								"FORM": {}
							},
							"files": {},
							"userId": "00000000000000000000000000"
						},
						"statusCode": 200
					}
				]
			}
		}
	},
	{
		"name": "ga",
		"description": "Test 9",
		"feature": "processor",
		"module": "destination",
		"version": "v0",
		"input": {
			"request": {
				"body": [
					{
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
									"email": "test@rudderstack.com"
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
							"type": "track",
							"messageId": "ec5481b6-a926-4d2e-b293-0b3a77c4d3be",
							"originalTimestamp": "2019-10-14T11:15:18.300Z",
							"anonymousId": "00000000000000000000000000",
							"userId": "12345",
							"event": "product viewed",
							"properties": {
								"currency": "CAD",
								"quantity": 1,
								"price": 24.75,
								"name": "my product 1",
								"category": "cat 1",
								"sku": "p-298",
								"testDimension": true,
								"testMetric": true,
								"position": 4.5
							},
							"integrations": {
								"All": true
							},
							"sentAt": "2019-10-14T11:15:53.296Z"
						},
						"destination": {
							"Config": {
								"trackingID": "UA-165994240-1",
								"doubleClick": true,
								"enhancedLinkAttribution": true,
								"classic": true,
								"ignoredReferrers": "",
								"serverClassic": false,
								"includeSearch": true,
								"trackCategorizedPages": true,
								"trackNamedPages": true,
								"sampleRate": "100",
								"siteSpeedSampleRate": "1",
								"setAllMappedProps": true,
								"enableServerSideIdentify": true,
								"serverSideIdentifyEventCategory": "cat1",
								"serverSideIdentifyEventAction": "action1",
								"anonymizeIp": true,
								"domain": "domain",
								"enhancedEcommerce": true,
								"nonInteraction": true,
								"optimize": "abc123",
								"sendUserId": true,
								"useGoogleAmpClientId": true,
								"web-useNativeSDK": true,
								"dimensions": [
									{
										"from": "name",
										"to": "dimension1"
									},
									{
										"from": "custom2",
										"to": "dimension2"
									}
								],
								"metrics": [
									{
										"from": "email",
										"to": "metric1"
									},
									{
										"from": "trait2",
										"to": "metric2"
									}
								],
								"resetCustomDimensionsOnPage": [
									{
										"resetCustomDimensionsOnPage": "abc"
									},
									{
										"resetCustomDimensionsOnPage": "xyz"
									}
								],
								"contentGroupings": [
									{
										"from": "plan",
										"to": "contentGroup1"
									},
									{
										"from": "prop2",
										"to": "contentGroup2"
									}
								]
							},
							"Enabled": true
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
							"endpoint": "https://www.google-analytics.com/collect",
							"headers": {},
							"params": {
								"ea": "product viewed",
								"ec": "cat 1",
								"pa": "detail",
								"pr1cd1": "my product 1",
								"pr1id": "p-298",
								"cd1": "my product 1",
								"v": "1",
								"t": "event",
								"el": "event",
								"tid": "UA-165994240-1",
								"ds": "web",
								"an": "RudderLabs JavaScript SDK",
								"av": "1.0.0",
								"aiid": "com.rudderlabs.javascript",
								"npa": 1,
								"aip": 1,
								"cid": "00000000000000000000000000",
								"pr1nm": "my product 1",
								"pr1ca": "cat 1",
								"cu": "CAD",
								"pr1ps": 4.5,
								"pr1pr": 24.75,
								"pr1qt": 1,
								"ua": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/77.0.3865.90 Safari/537.36",
								"uid": "12345",
								"ul": "en-US",
								"ni": 1,
								"qt": 124893881700
							},
							"body": {
								"JSON": {},
								"XML": {},
								"JSON_ARRAY": {},
								"FORM": {}
							},
							"files": {},
							"userId": "00000000000000000000000000"
						},
						"statusCode": 200
					}
				]
			}
		}
	},
	{
		"name": "ga",
		"description": "Test 10",
		"feature": "processor",
		"module": "destination",
		"version": "v0",
		"input": {
			"request": {
				"body": [
					{
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
									"email": "test@rudderstack.com"
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
							"type": "track",
							"messageId": "ec5481b6-a926-4d2e-b293-0b3a77c4d3be",
							"originalTimestamp": "2019-10-14T11:15:18.300Z",
							"anonymousId": "00000000000000000000000000",
							"userId": "12345",
							"event": "product list filtered",
							"properties": {
								"category": "cat 1",
								"list_id": "1234",
								"filters": [
									{
										"type": "department",
										"value": "beauty"
									},
									{
										"type": "price",
										"value": "under"
									}
								],
								"sorts": [
									{
										"type": "price",
										"value": "desc"
									}
								],
								"products": [
									{
										"product_id": "507f1f77bcf86cd799439011",
										"productDimension": "My Product Dimension",
										"productMetric": "My Product Metric"
									}
								],
								"testDimension": true,
								"testMetric": true
							},
							"integrations": {
								"All": true
							},
							"sentAt": "2019-10-14T11:15:53.296Z"
						},
						"destination": {
							"Config": {
								"trackingID": "UA-165994240-1",
								"doubleClick": true,
								"enhancedLinkAttribution": true,
								"classic": true,
								"ignoredReferrers": "",
								"serverClassic": false,
								"includeSearch": true,
								"trackCategorizedPages": true,
								"trackNamedPages": true,
								"sampleRate": "100",
								"siteSpeedSampleRate": "1",
								"setAllMappedProps": true,
								"enableServerSideIdentify": true,
								"serverSideIdentifyEventCategory": "cat1",
								"serverSideIdentifyEventAction": "action1",
								"anonymizeIp": true,
								"domain": "domain",
								"enhancedEcommerce": true,
								"nonInteraction": true,
								"optimize": "abc123",
								"sendUserId": true,
								"useGoogleAmpClientId": true,
								"web-useNativeSDK": true,
								"dimensions": [
									{
										"from": "name",
										"to": "dimension1"
									},
									{
										"from": "custom2",
										"to": "dimension2"
									}
								],
								"metrics": [
									{
										"from": "email",
										"to": "metric1"
									},
									{
										"from": "trait2",
										"to": "metric2"
									}
								],
								"resetCustomDimensionsOnPage": [
									{
										"resetCustomDimensionsOnPage": "abc"
									},
									{
										"resetCustomDimensionsOnPage": "xyz"
									}
								],
								"contentGroupings": [
									{
										"from": "plan",
										"to": "contentGroup1"
									},
									{
										"from": "prop2",
										"to": "contentGroup2"
									}
								]
							},
							"Enabled": true
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
							"endpoint": "https://www.google-analytics.com/collect",
							"headers": {},
							"params": {
								"ea": "product list filtered",
								"ec": "cat 1",
								"pa": "detail",
								"il1pi1id": "507f1f77bcf86cd799439011",
								"v": "1",
								"t": "event",
								"el": "event",
								"tid": "UA-165994240-1",
								"ds": "web",
								"an": "RudderLabs JavaScript SDK",
								"av": "1.0.0",
								"aiid": "com.rudderlabs.javascript",
								"npa": 1,
								"aip": 1,
								"il1nm": "1234",
								"ua": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/77.0.3865.90 Safari/537.36",
								"cid": "00000000000000000000000000",
								"uid": "12345",
								"il1pi1qt": 1,
								"il1pi1va": "department:beauty,price:under::price:desc",
								"ul": "en-US",
								"ni": 1,
								"qt": 124893881700
							},
							"body": {
								"JSON": {},
								"XML": {},
								"JSON_ARRAY": {},
								"FORM": {}
							},
							"files": {},
							"userId": "00000000000000000000000000"
						},
						"statusCode": 200
					}
				]
			}
		}
	},
	{
		"name": "ga",
		"description": "Test 11",
		"feature": "processor",
		"module": "destination",
		"version": "v0",
		"input": {
			"request": {
				"body": [
					{
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
									"email": "test@rudderstack.com"
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
							"type": "track",
							"messageId": "ec5481b6-a926-4d2e-b293-0b3a77c4d3be",
							"originalTimestamp": "2019-10-14T11:15:18.300Z",
							"anonymousId": "00000000000000000000000000",
							"userId": "12345",
							"event": "product list viewed",
							"properties": {
								"category": "cat 1",
								"list_id": "1234",
								"filters": [
									{
										"type": "department",
										"value": "beauty"
									},
									{
										"type": "price",
										"value": "under"
									}
								],
								"sorts": [
									{
										"type": "price",
										"value": "desc"
									}
								],
								"products": [
									{
										"product_id": "507f1f77bcf86cd799439011",
										"productDimension": "My Product Dimension",
										"productMetric": "My Product Metric",
										"position": 10
									},
									{
										"product_id": "507f1f77bcf86cdef799439011",
										"productDimension": "My Product Dimension1",
										"productMetric": "My Product Metric1",
										"position": -10
									}
								],
								"testDimension": true,
								"testMetric": true
							},
							"integrations": {
								"All": true
							},
							"sentAt": "2019-10-14T11:15:53.296Z"
						},
						"destination": {
							"Config": {
								"trackingID": "UA-165994240-1",
								"doubleClick": true,
								"enhancedLinkAttribution": true,
								"classic": true,
								"ignoredReferrers": "",
								"serverClassic": false,
								"includeSearch": true,
								"trackCategorizedPages": true,
								"trackNamedPages": true,
								"sampleRate": "100",
								"siteSpeedSampleRate": "1",
								"setAllMappedProps": true,
								"enableServerSideIdentify": true,
								"serverSideIdentifyEventCategory": "cat1",
								"serverSideIdentifyEventAction": "action1",
								"anonymizeIp": true,
								"domain": "domain",
								"enhancedEcommerce": true,
								"nonInteraction": true,
								"optimize": "abc123",
								"sendUserId": true,
								"useGoogleAmpClientId": true,
								"web-useNativeSDK": true,
								"dimensions": [
									{
										"from": "name",
										"to": "dimension1"
									},
									{
										"from": "custom2",
										"to": "dimension2"
									}
								],
								"metrics": [
									{
										"from": "email",
										"to": "metric1"
									},
									{
										"from": "trait2",
										"to": "metric2"
									}
								],
								"resetCustomDimensionsOnPage": [
									{
										"resetCustomDimensionsOnPage": "abc"
									},
									{
										"resetCustomDimensionsOnPage": "xyz"
									}
								],
								"contentGroupings": [
									{
										"from": "plan",
										"to": "contentGroup1"
									},
									{
										"from": "prop2",
										"to": "contentGroup2"
									}
								]
							},
							"Enabled": true
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
							"endpoint": "https://www.google-analytics.com/collect",
							"headers": {},
							"params": {
								"ea": "product list viewed",
								"ec": "cat 1",
								"pa": "detail",
								"il1pi1id": "507f1f77bcf86cd799439011",
								"il1pi1ps": 10,
								"il1pi2id": "507f1f77bcf86cdef799439011",
								"il1pi2ps": -10,
								"v": "1",
								"t": "event",
								"el": "event",
								"tid": "UA-165994240-1",
								"ds": "web",
								"an": "RudderLabs JavaScript SDK",
								"av": "1.0.0",
								"aiid": "com.rudderlabs.javascript",
								"npa": 1,
								"aip": 1,
								"il1nm": "1234",
								"ua": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/77.0.3865.90 Safari/537.36",
								"cid": "00000000000000000000000000",
								"uid": "12345",
								"il1pi1qt": 1,
								"il1pi1va": "department:beauty,price:under::price:desc",
								"il1pi2qt": 1,
								"il1pi2va": "department:beauty,price:under::price:desc",
								"ul": "en-US",
								"ni": 1,
								"qt": 124893881700
							},
							"body": {
								"JSON": {},
								"XML": {},
								"JSON_ARRAY": {},
								"FORM": {}
							},
							"files": {},
							"userId": "00000000000000000000000000"
						},
						"statusCode": 200
					}
				]
			}
		}
	},
	{
		"name": "ga",
		"description": "Test 12",
		"feature": "processor",
		"module": "destination",
		"version": "v0",
		"input": {
			"request": {
				"body": [
					{
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
									"email": "test@rudderstack.com"
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
							"type": "track",
							"messageId": "ec5481b6-a926-4d2e-b293-0b3a77c4d3be",
							"originalTimestamp": "2019-10-14T11:15:18.300Z",
							"anonymousId": "00000000000000000000000000",
							"userId": "12345",
							"event": "product clicked",
							"properties": {
								"currency": "CAD",
								"quantity": 1,
								"price": 24.75,
								"name": "my product",
								"category": "cat 1",
								"sku": "p-298",
								"list": "search results",
								"testDimension": true,
								"testMetric": true
							},
							"integrations": {
								"All": true
							},
							"sentAt": "2019-10-14T11:15:53.296Z"
						},
						"destination": {
							"Config": {
								"trackingID": "UA-165994240-1",
								"doubleClick": true,
								"enhancedLinkAttribution": true,
								"classic": true,
								"ignoredReferrers": "",
								"serverClassic": false,
								"includeSearch": true,
								"trackCategorizedPages": true,
								"trackNamedPages": true,
								"sampleRate": "100",
								"siteSpeedSampleRate": "1",
								"setAllMappedProps": true,
								"enableServerSideIdentify": true,
								"serverSideIdentifyEventCategory": "cat1",
								"serverSideIdentifyEventAction": "action1",
								"anonymizeIp": true,
								"domain": "domain",
								"enhancedEcommerce": true,
								"nonInteraction": true,
								"optimize": "abc123",
								"sendUserId": true,
								"useGoogleAmpClientId": true,
								"web-useNativeSDK": true,
								"dimensions": [
									{
										"from": "name",
										"to": "dimension1"
									},
									{
										"from": "custom2",
										"to": "dimension2"
									}
								],
								"metrics": [
									{
										"from": "email",
										"to": "metric1"
									},
									{
										"from": "trait2",
										"to": "metric2"
									}
								],
								"resetCustomDimensionsOnPage": [
									{
										"resetCustomDimensionsOnPage": "abc"
									},
									{
										"resetCustomDimensionsOnPage": "xyz"
									}
								],
								"contentGroupings": [
									{
										"from": "plan",
										"to": "contentGroup1"
									},
									{
										"from": "prop2",
										"to": "contentGroup2"
									}
								]
							},
							"Enabled": true
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
							"endpoint": "https://www.google-analytics.com/collect",
							"headers": {},
							"params": {
								"ea": "product clicked",
								"ec": "cat 1",
								"pa": "click",
								"pr1cd1": "my product",
								"pr1id": "p-298",
								"cd1": "my product",
								"v": "1",
								"t": "event",
								"el": "event",
								"tid": "UA-165994240-1",
								"ds": "web",
								"an": "RudderLabs JavaScript SDK",
								"av": "1.0.0",
								"aiid": "com.rudderlabs.javascript",
								"npa": 1,
								"aip": 1,
								"cid": "00000000000000000000000000",
								"pr1nm": "my product",
								"pr1ca": "cat 1",
								"cu": "CAD",
								"pr1pr": 24.75,
								"pr1qt": 1,
								"ua": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/77.0.3865.90 Safari/537.36",
								"uid": "12345",
								"pal": "search results",
								"ul": "en-US",
								"ni": 1,
								"qt": 124893881700
							},
							"body": {
								"JSON": {},
								"XML": {},
								"JSON_ARRAY": {},
								"FORM": {}
							},
							"files": {},
							"userId": "00000000000000000000000000"
						},
						"statusCode": 200
					}
				]
			}
		}
	},
	{
		"name": "ga",
		"description": "Test 13",
		"feature": "processor",
		"module": "destination",
		"version": "v0",
		"input": {
			"request": {
				"body": [
					{
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
									"email": "test@rudderstack.com"
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
							"type": "track",
							"messageId": "ec5481b6-a926-4d2e-b293-0b3a77c4d3be",
							"originalTimestamp": "2019-10-14T11:15:18.300Z",
							"anonymousId": "00000000000000000000000000",
							"userId": "12345",
							"event": "promotion viewed",
							"properties": {
								"currency": "CAD",
								"promotion_id": "PROMO_1234",
								"name": "my product",
								"creative": "summer_banner2",
								"position": "banner_slot1",
								"testDimension": true,
								"testMetric": true
							},
							"integrations": {
								"All": true
							},
							"sentAt": "2019-10-14T11:15:53.296Z"
						},
						"destination": {
							"Config": {
								"trackingID": "UA-165994240-1",
								"doubleClick": true,
								"enhancedLinkAttribution": true,
								"classic": true,
								"ignoredReferrers": "",
								"serverClassic": false,
								"includeSearch": true,
								"trackCategorizedPages": true,
								"trackNamedPages": true,
								"sampleRate": "100",
								"siteSpeedSampleRate": "1",
								"setAllMappedProps": true,
								"enableServerSideIdentify": true,
								"serverSideIdentifyEventCategory": "cat1",
								"serverSideIdentifyEventAction": "action1",
								"anonymizeIp": true,
								"domain": "domain",
								"enhancedEcommerce": true,
								"nonInteraction": true,
								"optimize": "abc123",
								"sendUserId": true,
								"useGoogleAmpClientId": true,
								"web-useNativeSDK": true,
								"dimensions": [
									{
										"from": "name",
										"to": "dimension1"
									},
									{
										"from": "custom2",
										"to": "dimension2"
									}
								],
								"metrics": [
									{
										"from": "email",
										"to": "metric1"
									},
									{
										"from": "trait2",
										"to": "metric2"
									}
								],
								"resetCustomDimensionsOnPage": [
									{
										"resetCustomDimensionsOnPage": "abc"
									},
									{
										"resetCustomDimensionsOnPage": "xyz"
									}
								],
								"contentGroupings": [
									{
										"from": "plan",
										"to": "contentGroup1"
									},
									{
										"from": "prop2",
										"to": "contentGroup2"
									}
								]
							},
							"Enabled": true
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
							"endpoint": "https://www.google-analytics.com/collect",
							"headers": {},
							"params": {
								"ea": "promotion viewed",
								"ec": "EnhancedEcommerce",
								"cu": "CAD",
								"promoa": "view",
								"pa": "view",
								"cd1": "my product",
								"v": "1",
								"t": "event",
								"el": "event",
								"tid": "UA-165994240-1",
								"ds": "web",
								"an": "RudderLabs JavaScript SDK",
								"av": "1.0.0",
								"aiid": "com.rudderlabs.javascript",
								"npa": 1,
								"aip": 1,
								"cid": "00000000000000000000000000",
								"promo1id": "PROMO_1234",
								"promo1cr": "summer_banner2",
								"promo1ps": "banner_slot1",
								"promo1nm": "my product",
								"ua": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/77.0.3865.90 Safari/537.36",
								"uid": "12345",
								"ul": "en-US",
								"ni": 1,
								"qt": 124893881700
							},
							"body": {
								"JSON": {},
								"XML": {},
								"JSON_ARRAY": {},
								"FORM": {}
							},
							"files": {},
							"userId": "00000000000000000000000000"
						},
						"statusCode": 200
					}
				]
			}
		}
	},
	{
		"name": "ga",
		"description": "Test 14",
		"feature": "processor",
		"module": "destination",
		"version": "v0",
		"input": {
			"request": {
				"body": [
					{
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
									"email": "test@rudderstack.com"
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
							"type": "track",
							"messageId": "ec5481b6-a926-4d2e-b293-0b3a77c4d3be",
							"originalTimestamp": "2019-10-14T11:15:18.300Z",
							"anonymousId": "00000000000000000000000000",
							"userId": "12345",
							"event": "promotion clicked",
							"properties": {
								"currency": "CAD",
								"promotion_id": "PROMO_1234",
								"name": "my product",
								"creative": "summer_banner2",
								"position": "banner_slot1",
								"testDimension": true,
								"testMetric": true
							},
							"integrations": {
								"All": true
							},
							"sentAt": "2019-10-14T11:15:53.296Z"
						},
						"destination": {
							"Config": {
								"trackingID": "UA-165994240-1",
								"doubleClick": true,
								"enhancedLinkAttribution": true,
								"classic": true,
								"ignoredReferrers": "",
								"serverClassic": false,
								"includeSearch": true,
								"trackCategorizedPages": true,
								"trackNamedPages": true,
								"sampleRate": "100",
								"siteSpeedSampleRate": "1",
								"setAllMappedProps": true,
								"enableServerSideIdentify": true,
								"serverSideIdentifyEventCategory": "cat1",
								"serverSideIdentifyEventAction": "action1",
								"anonymizeIp": true,
								"domain": "domain",
								"enhancedEcommerce": true,
								"nonInteraction": true,
								"optimize": "abc123",
								"sendUserId": true,
								"useGoogleAmpClientId": true,
								"web-useNativeSDK": true,
								"dimensions": [
									{
										"from": "name",
										"to": "dimension1"
									},
									{
										"from": "custom2",
										"to": "dimension2"
									}
								],
								"metrics": [
									{
										"from": "email",
										"to": "metric1"
									},
									{
										"from": "trait2",
										"to": "metric2"
									}
								],
								"resetCustomDimensionsOnPage": [
									{
										"resetCustomDimensionsOnPage": "abc"
									},
									{
										"resetCustomDimensionsOnPage": "xyz"
									}
								],
								"contentGroupings": [
									{
										"from": "plan",
										"to": "contentGroup1"
									},
									{
										"from": "prop2",
										"to": "contentGroup2"
									}
								]
							},
							"Enabled": true
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
							"endpoint": "https://www.google-analytics.com/collect",
							"headers": {},
							"params": {
								"ea": "promotion clicked",
								"ec": "EnhancedEcommerce",
								"cu": "CAD",
								"promoa": "promo_click",
								"pa": "promo_click",
								"cd1": "my product",
								"v": "1",
								"t": "event",
								"el": "event",
								"tid": "UA-165994240-1",
								"ds": "web",
								"an": "RudderLabs JavaScript SDK",
								"av": "1.0.0",
								"aiid": "com.rudderlabs.javascript",
								"npa": 1,
								"aip": 1,
								"cid": "00000000000000000000000000",
								"promo1id": "PROMO_1234",
								"promo1cr": "summer_banner2",
								"promo1ps": "banner_slot1",
								"promo1nm": "my product",
								"ua": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/77.0.3865.90 Safari/537.36",
								"uid": "12345",
								"ul": "en-US",
								"ni": 1,
								"qt": 124893881700
							},
							"body": {
								"JSON": {},
								"XML": {},
								"JSON_ARRAY": {},
								"FORM": {}
							},
							"files": {},
							"userId": "00000000000000000000000000"
						},
						"statusCode": 200
					}
				]
			}
		}
	},
	{
		"name": "ga",
		"description": "Test 15",
		"feature": "processor",
		"module": "destination",
		"version": "v0",
		"input": {
			"request": {
				"body": [
					{
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
									"email": "test@rudderstack.com"
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
							"type": "track",
							"messageId": "ec5481b6-a926-4d2e-b293-0b3a77c4d3be",
							"originalTimestamp": "2019-10-14T11:15:18.300Z",
							"anonymousId": "00000000000000000000000000",
							"userId": "12345",
							"event": "checkout started",
							"properties": {
								"currency": "CAD",
								"products": [
									{
										"quantity": 1,
										"price": 24.75,
										"name": "my product",
										"sku": "p-298"
									},
									{
										"quantity": 1,
										"price": 24.75,
										"name": "my product 2",
										"sku": "p-299"
									}
								],
								"step": 1,
								"paymentMethod": "Visa",
								"testDimension": true,
								"testMetric": true
							},
							"integrations": {
								"All": true
							},
							"sentAt": "2019-10-14T11:15:53.296Z"
						},
						"destination": {
							"Config": {
								"trackingID": "UA-165994240-1",
								"doubleClick": true,
								"enhancedLinkAttribution": true,
								"classic": true,
								"ignoredReferrers": "",
								"serverClassic": false,
								"includeSearch": true,
								"trackCategorizedPages": true,
								"trackNamedPages": true,
								"sampleRate": "100",
								"siteSpeedSampleRate": "1",
								"setAllMappedProps": true,
								"enableServerSideIdentify": true,
								"serverSideIdentifyEventCategory": "cat1",
								"serverSideIdentifyEventAction": "action1",
								"anonymizeIp": true,
								"domain": "domain",
								"enhancedEcommerce": true,
								"nonInteraction": true,
								"optimize": "abc123",
								"sendUserId": true,
								"useGoogleAmpClientId": true,
								"web-useNativeSDK": true,
								"dimensions": [
									{
										"from": "name",
										"to": "dimension1"
									},
									{
										"from": "custom2",
										"to": "dimension2"
									}
								],
								"metrics": [
									{
										"from": "email",
										"to": "metric1"
									},
									{
										"from": "trait2",
										"to": "metric2"
									}
								],
								"resetCustomDimensionsOnPage": [
									{
										"resetCustomDimensionsOnPage": "abc"
									},
									{
										"resetCustomDimensionsOnPage": "xyz"
									}
								],
								"contentGroupings": [
									{
										"from": "plan",
										"to": "contentGroup1"
									},
									{
										"from": "prop2",
										"to": "contentGroup2"
									}
								]
							},
							"Enabled": true
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
							"endpoint": "https://www.google-analytics.com/collect",
							"headers": {},
							"params": {
								"pa": "checkout",
								"pr1id": "p-298",
								"pr1cd1": "my product",
								"pr1nm": "my product",
								"pr1pr": 24.75,
								"pr2id": "p-299",
								"pr2cd1": "my product 2",
								"pr2nm": "my product 2",
								"pr2pr": 24.75,
								"ea": "checkout started",
								"ec": "EnhancedEcommerce",
								"v": "1",
								"t": "event",
								"el": "event",
								"tid": "UA-165994240-1",
								"ds": "web",
								"an": "RudderLabs JavaScript SDK",
								"av": "1.0.0",
								"aiid": "com.rudderlabs.javascript",
								"npa": 1,
								"aip": 1,
								"cid": "00000000000000000000000000",
								"cu": "CAD",
								"ua": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/77.0.3865.90 Safari/537.36",
								"uid": "12345",
								"cos": 1,
								"pr1qt": 1,
								"pr2qt": 1,
								"ul": "en-US",
								"ni": 1,
								"qt": 124893881700
							},
							"body": {
								"JSON": {},
								"XML": {},
								"JSON_ARRAY": {},
								"FORM": {}
							},
							"files": {},
							"userId": "00000000000000000000000000"
						},
						"statusCode": 200
					}
				]
			}
		}
	},
	{
		"name": "ga",
		"description": "Test 16",
		"feature": "processor",
		"module": "destination",
		"version": "v0",
		"input": {
			"request": {
				"body": [
					{
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
									"email": "test@rudderstack.com"
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
							"type": "track",
							"messageId": "ec5481b6-a926-4d2e-b293-0b3a77c4d3be",
							"originalTimestamp": "2019-10-14T11:15:18.300Z",
							"anonymousId": "00000000000000000000000000",
							"userId": "12345",
							"event": "order updated",
							"properties": {
								"currency": "CAD",
								"products": [
									{
										"quantity": 1,
										"price": 24.75,
										"name": "my product",
										"sku": "p-298"
									},
									{
										"quantity": 1,
										"price": 24.75,
										"name": "my product 2",
										"sku": "p-299"
									}
								],
								"step": 1,
								"paymentMethod": "Visa",
								"testDimension": true,
								"testMetric": true
							},
							"integrations": {
								"All": true
							},
							"sentAt": "2019-10-14T11:15:53.296Z"
						},
						"destination": {
							"Config": {
								"trackingID": "UA-165994240-1",
								"doubleClick": true,
								"enhancedLinkAttribution": true,
								"classic": true,
								"ignoredReferrers": "",
								"serverClassic": false,
								"includeSearch": true,
								"trackCategorizedPages": true,
								"trackNamedPages": true,
								"sampleRate": "100",
								"siteSpeedSampleRate": "1",
								"setAllMappedProps": true,
								"enableServerSideIdentify": true,
								"serverSideIdentifyEventCategory": "cat1",
								"serverSideIdentifyEventAction": "action1",
								"anonymizeIp": true,
								"domain": "domain",
								"enhancedEcommerce": true,
								"nonInteraction": true,
								"optimize": "abc123",
								"sendUserId": true,
								"useGoogleAmpClientId": true,
								"web-useNativeSDK": true,
								"dimensions": [
									{
										"from": "name",
										"to": "dimension1"
									},
									{
										"from": "custom2",
										"to": "dimension2"
									}
								],
								"metrics": [
									{
										"from": "email",
										"to": "metric1"
									},
									{
										"from": "trait2",
										"to": "metric2"
									}
								],
								"resetCustomDimensionsOnPage": [
									{
										"resetCustomDimensionsOnPage": "abc"
									},
									{
										"resetCustomDimensionsOnPage": "xyz"
									}
								],
								"contentGroupings": [
									{
										"from": "plan",
										"to": "contentGroup1"
									},
									{
										"from": "prop2",
										"to": "contentGroup2"
									}
								]
							},
							"Enabled": true
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
							"endpoint": "https://www.google-analytics.com/collect",
							"headers": {},
							"params": {
								"pa": "checkout",
								"pr1id": "p-298",
								"pr1cd1": "my product",
								"pr1nm": "my product",
								"pr1pr": 24.75,
								"pr2id": "p-299",
								"pr2cd1": "my product 2",
								"pr2nm": "my product 2",
								"pr2pr": 24.75,
								"ea": "order updated",
								"ec": "EnhancedEcommerce",
								"v": "1",
								"t": "event",
								"el": "event",
								"tid": "UA-165994240-1",
								"ds": "web",
								"an": "RudderLabs JavaScript SDK",
								"av": "1.0.0",
								"aiid": "com.rudderlabs.javascript",
								"npa": 1,
								"aip": 1,
								"cid": "00000000000000000000000000",
								"cu": "CAD",
								"ua": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/77.0.3865.90 Safari/537.36",
								"uid": "12345",
								"cos": 1,
								"pr1qt": 1,
								"pr2qt": 1,
								"ul": "en-US",
								"ni": 1,
								"qt": 124893881700
							},
							"body": {
								"JSON": {},
								"XML": {},
								"JSON_ARRAY": {},
								"FORM": {}
							},
							"files": {},
							"userId": "00000000000000000000000000"
						},
						"statusCode": 200
					}
				]
			}
		}
	},
	{
		"name": "ga",
		"description": "Test 17",
		"feature": "processor",
		"module": "destination",
		"version": "v0",
		"input": {
			"request": {
				"body": [
					{
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
									"email": "test@rudderstack.com"
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
							"type": "track",
							"messageId": "ec5481b6-a926-4d2e-b293-0b3a77c4d3be",
							"originalTimestamp": "2019-10-14T11:15:18.300Z",
							"anonymousId": "00000000000000000000000000",
							"userId": "12345",
							"event": "checkout step viewed",
							"properties": {
								"currency": "CAD",
								"step": 1
							},
							"integrations": {
								"All": true
							},
							"sentAt": "2019-10-14T11:15:53.296Z"
						},
						"destination": {
							"Config": {
								"trackingID": "UA-165994240-1",
								"doubleClick": true,
								"enhancedLinkAttribution": true,
								"classic": true,
								"ignoredReferrers": "",
								"serverClassic": false,
								"includeSearch": true,
								"trackCategorizedPages": true,
								"trackNamedPages": true,
								"sampleRate": "100",
								"siteSpeedSampleRate": "1",
								"setAllMappedProps": true,
								"enableServerSideIdentify": true,
								"serverSideIdentifyEventCategory": "cat1",
								"serverSideIdentifyEventAction": "action1",
								"anonymizeIp": true,
								"domain": "domain",
								"enhancedEcommerce": true,
								"nonInteraction": true,
								"optimize": "abc123",
								"sendUserId": true,
								"useGoogleAmpClientId": true,
								"web-useNativeSDK": true,
								"dimensions": [
									{
										"from": "name",
										"to": "dimension1"
									},
									{
										"from": "custom2",
										"to": "dimension2"
									}
								],
								"metrics": [
									{
										"from": "email",
										"to": "metric1"
									},
									{
										"from": "trait2",
										"to": "metric2"
									}
								],
								"resetCustomDimensionsOnPage": [
									{
										"resetCustomDimensionsOnPage": "abc"
									},
									{
										"resetCustomDimensionsOnPage": "xyz"
									}
								],
								"contentGroupings": [
									{
										"from": "plan",
										"to": "contentGroup1"
									},
									{
										"from": "prop2",
										"to": "contentGroup2"
									}
								]
							},
							"Enabled": true
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
							"endpoint": "https://www.google-analytics.com/collect",
							"headers": {},
							"params": {
								"pa": "checkout",
								"ea": "checkout step viewed",
								"ec": "EnhancedEcommerce",
								"v": "1",
								"t": "event",
								"el": "event",
								"tid": "UA-165994240-1",
								"ds": "web",
								"an": "RudderLabs JavaScript SDK",
								"av": "1.0.0",
								"aiid": "com.rudderlabs.javascript",
								"npa": 1,
								"aip": 1,
								"cid": "00000000000000000000000000",
								"cos": 1,
								"ua": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/77.0.3865.90 Safari/537.36",
								"uid": "12345",
								"ul": "en-US",
								"ni": 1,
								"qt": 124893881700
							},
							"body": {
								"JSON": {},
								"XML": {},
								"JSON_ARRAY": {},
								"FORM": {}
							},
							"files": {},
							"userId": "00000000000000000000000000"
						},
						"statusCode": 200
					}
				]
			}
		}
	},
	{
		"name": "ga",
		"description": "Test 18",
		"feature": "processor",
		"module": "destination",
		"version": "v0",
		"input": {
			"request": {
				"body": [
					{
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
									"email": "test@rudderstack.com"
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
							"type": "track",
							"messageId": "ec5481b6-a926-4d2e-b293-0b3a77c4d3be",
							"originalTimestamp": "2019-10-14T11:15:18.300Z",
							"anonymousId": "00000000000000000000000000",
							"userId": "12345",
							"event": "checkout step completed",
							"properties": {
								"currency": "CAD",
								"step": 1,
								"paymentMethod": "Visa"
							},
							"integrations": {
								"All": true
							},
							"sentAt": "2019-10-14T11:15:53.296Z"
						},
						"destination": {
							"Config": {
								"trackingID": "UA-165994240-1",
								"doubleClick": true,
								"enhancedLinkAttribution": true,
								"classic": true,
								"ignoredReferrers": "",
								"serverClassic": false,
								"includeSearch": true,
								"trackCategorizedPages": true,
								"trackNamedPages": true,
								"sampleRate": "100",
								"siteSpeedSampleRate": "1",
								"setAllMappedProps": true,
								"enableServerSideIdentify": true,
								"serverSideIdentifyEventCategory": "cat1",
								"serverSideIdentifyEventAction": "action1",
								"anonymizeIp": true,
								"domain": "domain",
								"enhancedEcommerce": true,
								"nonInteraction": true,
								"optimize": "abc123",
								"sendUserId": true,
								"useGoogleAmpClientId": true,
								"web-useNativeSDK": true,
								"dimensions": [
									{
										"from": "name",
										"to": "dimension1"
									},
									{
										"from": "custom2",
										"to": "dimension2"
									}
								],
								"metrics": [
									{
										"from": "email",
										"to": "metric1"
									},
									{
										"from": "trait2",
										"to": "metric2"
									}
								],
								"resetCustomDimensionsOnPage": [
									{
										"resetCustomDimensionsOnPage": "abc"
									},
									{
										"resetCustomDimensionsOnPage": "xyz"
									}
								],
								"contentGroupings": [
									{
										"from": "plan",
										"to": "contentGroup1"
									},
									{
										"from": "prop2",
										"to": "contentGroup2"
									}
								]
							},
							"Enabled": true
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
							"endpoint": "https://www.google-analytics.com/collect",
							"headers": {},
							"params": {
								"pa": "checkout_option",
								"ea": "checkout step completed",
								"ec": "EnhancedEcommerce",
								"v": "1",
								"t": "event",
								"el": "event",
								"tid": "UA-165994240-1",
								"ds": "web",
								"an": "RudderLabs JavaScript SDK",
								"av": "1.0.0",
								"aiid": "com.rudderlabs.javascript",
								"npa": 1,
								"aip": 1,
								"cid": "00000000000000000000000000",
								"cos": 1,
								"ua": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/77.0.3865.90 Safari/537.36",
								"uid": "12345",
								"ul": "en-US",
								"ni": 1,
								"qt": 124893881700
							},
							"body": {
								"JSON": {},
								"XML": {},
								"JSON_ARRAY": {},
								"FORM": {}
							},
							"files": {},
							"userId": "00000000000000000000000000"
						},
						"statusCode": 200
					}
				]
			}
		}
	},
	{
		"name": "ga",
		"description": "Test 19",
		"feature": "processor",
		"module": "destination",
		"version": "v0",
		"input": {
			"request": {
				"body": [
					{
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
									"email": "test@rudderstack.com"
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
							"type": "track",
							"messageId": "ec5481b6-a926-4d2e-b293-0b3a77c4d3be",
							"originalTimestamp": "2019-10-14T11:15:18.300Z",
							"anonymousId": "00000000000000000000000000",
							"userId": "12345",
							"event": "order refunded",
							"properties": {
								"products": [
									{
										"quantity": 1,
										"sku": "p-298"
									},
									{
										"quantity": 1,
										"sku": "p-299"
									}
								],
								"testDimension": true,
								"testMetric": true
							},
							"integrations": {
								"All": true
							},
							"sentAt": "2019-10-14T11:15:53.296Z"
						},
						"destination": {
							"Config": {
								"trackingID": "UA-165994240-1",
								"doubleClick": true,
								"enhancedLinkAttribution": true,
								"classic": true,
								"ignoredReferrers": "",
								"serverClassic": false,
								"includeSearch": true,
								"trackCategorizedPages": true,
								"trackNamedPages": true,
								"sampleRate": "100",
								"siteSpeedSampleRate": "1",
								"setAllMappedProps": true,
								"enableServerSideIdentify": true,
								"serverSideIdentifyEventCategory": "cat1",
								"serverSideIdentifyEventAction": "action1",
								"anonymizeIp": true,
								"domain": "domain",
								"enhancedEcommerce": true,
								"nonInteraction": true,
								"optimize": "abc123",
								"sendUserId": true,
								"useGoogleAmpClientId": true,
								"web-useNativeSDK": true,
								"dimensions": [
									{
										"from": "name",
										"to": "dimension1"
									},
									{
										"from": "custom2",
										"to": "dimension2"
									}
								],
								"metrics": [
									{
										"from": "email",
										"to": "metric1"
									},
									{
										"from": "trait2",
										"to": "metric2"
									}
								],
								"resetCustomDimensionsOnPage": [
									{
										"resetCustomDimensionsOnPage": "abc"
									},
									{
										"resetCustomDimensionsOnPage": "xyz"
									}
								],
								"contentGroupings": [
									{
										"from": "plan",
										"to": "contentGroup1"
									},
									{
										"from": "prop2",
										"to": "contentGroup2"
									}
								]
							},
							"Enabled": true
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
							"endpoint": "https://www.google-analytics.com/collect",
							"headers": {},
							"params": {
								"ni": 1,
								"v": "1",
								"t": "event",
								"el": "event",
								"tid": "UA-165994240-1",
								"ds": "web",
								"an": "RudderLabs JavaScript SDK",
								"av": "1.0.0",
								"aiid": "com.rudderlabs.javascript",
								"npa": 1,
								"aip": 1,
								"cid": "00000000000000000000000000",
								"ea": "order refunded",
								"ec": "EnhancedEcommerce",
								"ua": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/77.0.3865.90 Safari/537.36",
								"uid": "12345",
								"pa": "refund",
								"pr1id": "p-298",
								"pr1qt": 1,
								"pr2id": "p-299",
								"ul": "en-US",
								"pr2qt": 1,
								"qt": 124893881700
							},
							"body": {
								"JSON": {},
								"XML": {},
								"JSON_ARRAY": {},
								"FORM": {}
							},
							"files": {},
							"userId": "00000000000000000000000000"
						},
						"statusCode": 200
					}
				]
			}
		}
	},
	{
		"name": "ga",
		"description": "Test 20",
		"feature": "processor",
		"module": "destination",
		"version": "v0",
		"input": {
			"request": {
				"body": [
					{
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
									"email": "test@rudderstack.com"
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
							"type": "track",
							"messageId": "ec5481b6-a926-4d2e-b293-0b3a77c4d3be",
							"originalTimestamp": "2019-10-14T11:15:18.300Z",
							"anonymousId": "00000000000000000000000000",
							"userId": "12345",
							"event": "order starterefundedd",
							"properties": {
								"products": [
									{
										"quantity": 1,
										"sku": "p-298"
									},
									{
										"quantity": 1,
										"sku": "p-299"
									}
								],
								"testDimension": true,
								"testMetric": true
							},
							"integrations": {
								"All": true
							},
							"sentAt": "2019-10-14T11:15:53.296Z"
						},
						"destination": {
							"Config": {
								"trackingID": "UA-165994240-1",
								"doubleClick": true,
								"enhancedLinkAttribution": true,
								"classic": true,
								"ignoredReferrers": "",
								"serverClassic": false,
								"includeSearch": true,
								"trackCategorizedPages": true,
								"trackNamedPages": true,
								"sampleRate": "100",
								"siteSpeedSampleRate": "1",
								"setAllMappedProps": true,
								"enableServerSideIdentify": true,
								"serverSideIdentifyEventCategory": "cat1",
								"serverSideIdentifyEventAction": "action1",
								"anonymizeIp": true,
								"domain": "domain",
								"enhancedEcommerce": true,
								"nonInteraction": true,
								"optimize": "abc123",
								"sendUserId": true,
								"useGoogleAmpClientId": true,
								"web-useNativeSDK": true,
								"metrics": [
									{
										"from": "email",
										"to": "metric1"
									},
									{
										"from": "trait2",
										"to": "metric2"
									}
								],
								"resetCustomDimensionsOnPage": [
									{
										"resetCustomDimensionsOnPage": "abc"
									},
									{
										"resetCustomDimensionsOnPage": "xyz"
									}
								],
								"contentGroupings": [
									{
										"from": "plan",
										"to": "contentGroup1"
									},
									{
										"from": "prop2",
										"to": "contentGroup2"
									}
								]
							},
							"Enabled": true
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
							"endpoint": "https://www.google-analytics.com/collect",
							"headers": {},
							"params": {
								"ul": "en-US",
								"ec": "All",
								"ni": 1,
								"v": "1",
								"t": "event",
								"el": "event",
								"tid": "UA-165994240-1",
								"ds": "web",
								"an": "RudderLabs JavaScript SDK",
								"av": "1.0.0",
								"aiid": "com.rudderlabs.javascript",
								"npa": 1,
								"aip": 1,
								"cid": "00000000000000000000000000",
								"ea": "order starterefundedd",
								"ua": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/77.0.3865.90 Safari/537.36",
								"uid": "12345",
								"qt": 124893881700
							},
							"body": {
								"JSON": {},
								"XML": {},
								"JSON_ARRAY": {},
								"FORM": {}
							},
							"files": {},
							"userId": "00000000000000000000000000"
						},
						"statusCode": 200
					}
				]
			}
		}
	},
	{
		"name": "ga",
		"description": "Test 21",
		"feature": "processor",
		"module": "destination",
		"version": "v0",
		"input": {
			"request": {
				"body": [
					{
						"message": {
							"channel": "web",
							"context": {
								"traits": {
									"email": "test@rudderstack.com"
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
							"type": "track",
							"messageId": "ec5481b6-a926-4d2e-b293-0b3a77c4d3be",
							"originalTimestamp": "2019-10-14T11:15:18.300Z",
							"anonymousId": "00000000000000000000000000",
							"userId": "12345",
							"event": "order starterefundedd",
							"properties": {
								"products": [
									{
										"quantity": 1,
										"sku": "p-298"
									},
									{
										"quantity": 1,
										"sku": "p-299"
									}
								],
								"testDimension": true,
								"testMetric": true
							},
							"integrations": {
								"All": true
							},
							"sentAt": "2019-10-14T11:15:53.296Z"
						},
						"destination": {
							"Config": {
								"trackingID": "UA-165994240-1",
								"doubleClick": true,
								"enhancedLinkAttribution": true,
								"classic": true,
								"ignoredReferrers": "",
								"serverClassic": false,
								"includeSearch": true,
								"trackCategorizedPages": true,
								"trackNamedPages": true,
								"sampleRate": "100",
								"siteSpeedSampleRate": "1",
								"setAllMappedProps": true,
								"enableServerSideIdentify": true,
								"serverSideIdentifyEventCategory": "cat1",
								"serverSideIdentifyEventAction": "action1",
								"anonymizeIp": true,
								"domain": "domain",
								"enhancedEcommerce": true,
								"nonInteraction": true,
								"optimize": "abc123",
								"sendUserId": true,
								"useGoogleAmpClientId": true,
								"web-useNativeSDK": true,
								"metrics": [
									{
										"from": "email",
										"to": "metric1"
									},
									{
										"from": "trait2",
										"to": "metric2"
									}
								],
								"resetCustomDimensionsOnPage": [
									{
										"resetCustomDimensionsOnPage": "abc"
									},
									{
										"resetCustomDimensionsOnPage": "xyz"
									}
								],
								"contentGroupings": [
									{
										"from": "plan",
										"to": "contentGroup1"
									},
									{
										"from": "prop2",
										"to": "contentGroup2"
									}
								]
							},
							"Enabled": true
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
							"endpoint": "https://www.google-analytics.com/collect",
							"headers": {},
							"params": {
								"ul": "en-US",
								"ec": "All",
								"ni": 1,
								"v": "1",
								"t": "event",
								"el": "event",
								"tid": "UA-165994240-1",
								"ds": "web",
								"npa": 1,
								"aip": 1,
								"cid": "00000000000000000000000000",
								"ea": "order starterefundedd",
								"ua": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/77.0.3865.90 Safari/537.36",
								"uid": "12345",
								"qt": 124893881700
							},
							"body": {
								"JSON": {},
								"XML": {},
								"JSON_ARRAY": {},
								"FORM": {}
							},
							"files": {},
							"userId": "00000000000000000000000000"
						},
						"statusCode": 200
					}
				]
			}
		}
	},
	{
		"name": "ga",
		"description": "Test 22",
		"feature": "processor",
		"module": "destination",
		"version": "v0",
		"input": {
			"request": {
				"body": [
					{
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
									"email": "test@rudderstack.com"
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
							"type": "track",
							"messageId": "ec5481b6-a926-4d2e-b293-0b3a77c4d3be",
							"originalTimestamp": "2019-10-14T11:15:18.300Z",
							"anonymousId": "00000000000000000000000000",
							"userId": "12345",
							"event": "order starterefundedd",
							"properties": {
								"products": [
									{
										"quantity": 1,
										"sku": "p-298"
									},
									{
										"quantity": 1,
										"sku": "p-299"
									}
								],
								"testDimension": true,
								"testMetric": true
							},
							"integrations": {
								"All": true
							},
							"sentAt": "2019-10-14T11:15:53.296Z"
						},
						"destination": {
							"Config": {
								"trackingID": "UA-165994240-1",
								"enhancedLinkAttribution": true,
								"classic": true,
								"ignoredReferrers": "",
								"serverClassic": false,
								"includeSearch": true,
								"trackCategorizedPages": true,
								"trackNamedPages": true,
								"sampleRate": "100",
								"siteSpeedSampleRate": "1",
								"setAllMappedProps": true,
								"enableServerSideIdentify": true,
								"serverSideIdentifyEventCategory": "cat1",
								"serverSideIdentifyEventAction": "action1",
								"anonymizeIp": true,
								"domain": "domain",
								"enhancedEcommerce": true,
								"nonInteraction": true,
								"optimize": "abc123",
								"sendUserId": true,
								"useGoogleAmpClientId": true,
								"web-useNativeSDK": true,
								"dimensions": [
									{
										"from": "name",
										"to": "dimension1"
									},
									{
										"from": "custom2",
										"to": "dimension2"
									}
								],
								"metrics": [
									{
										"from": "email",
										"to": "metric1"
									},
									{
										"from": "trait2",
										"to": "metric2"
									}
								],
								"resetCustomDimensionsOnPage": [
									{
										"resetCustomDimensionsOnPage": "abc"
									},
									{
										"resetCustomDimensionsOnPage": "xyz"
									}
								],
								"contentGroupings": [
									{
										"from": "plan",
										"to": "contentGroup1"
									},
									{
										"from": "prop2",
										"to": "contentGroup2"
									}
								]
							},
							"Enabled": true
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
							"endpoint": "https://www.google-analytics.com/collect",
							"headers": {},
							"params": {
								"ul": "en-US",
								"ec": "All",
								"ni": 1,
								"v": "1",
								"t": "event",
								"el": "event",
								"tid": "UA-165994240-1",
								"ds": "web",
								"an": "RudderLabs JavaScript SDK",
								"av": "1.0.0",
								"aiid": "com.rudderlabs.javascript",
								"aip": 1,
								"cid": "00000000000000000000000000",
								"ea": "order starterefundedd",
								"ua": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/77.0.3865.90 Safari/537.36",
								"uid": "12345",
								"qt": 124893881700
							},
							"body": {
								"JSON": {},
								"XML": {},
								"JSON_ARRAY": {},
								"FORM": {}
							},
							"files": {},
							"userId": "00000000000000000000000000"
						},
						"statusCode": 200
					}
				]
			}
		}
	},
	{
		"name": "ga",
		"description": "Test 23",
		"feature": "processor",
		"module": "destination",
		"version": "v0",
		"input": {
			"request": {
				"body": [
					{
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
									"email": "test@rudderstack.com"
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
							"type": "track",
							"messageId": "ec5481b6-a926-4d2e-b293-0b3a77c4d3be",
							"originalTimestamp": "2019-10-14T11:15:18.300Z",
							"anonymousId": "00000000000000000000000000",
							"userId": "12345",
							"event": "order starterefundedd",
							"properties": {
								"products": [
									{
										"quantity": 1,
										"sku": "p-298"
									},
									{
										"quantity": 1,
										"sku": "p-299"
									}
								],
								"testDimension": true,
								"testMetric": true
							},
							"integrations": {
								"All": true
							},
							"sentAt": "2019-10-14T11:15:53.296Z"
						},
						"destination": {
							"Config": {
								"trackingID": "UA-165994240-1",
								"doubleClick": true,
								"enhancedLinkAttribution": true,
								"classic": true,
								"ignoredReferrers": "",
								"serverClassic": false,
								"includeSearch": true,
								"trackCategorizedPages": true,
								"trackNamedPages": true,
								"sampleRate": "100",
								"siteSpeedSampleRate": "1",
								"setAllMappedProps": true,
								"enableServerSideIdentify": true,
								"serverSideIdentifyEventCategory": "cat1",
								"serverSideIdentifyEventAction": "action1",
								"domain": "domain",
								"enhancedEcommerce": true,
								"nonInteraction": true,
								"optimize": "abc123",
								"sendUserId": true,
								"useGoogleAmpClientId": true,
								"web-useNativeSDK": true,
								"dimensions": [
									{
										"from": "name",
										"to": "dimension1"
									},
									{
										"from": "custom2",
										"to": "dimension2"
									}
								],
								"metrics": [
									{
										"from": "email",
										"to": "metric1"
									},
									{
										"from": "trait2",
										"to": "metric2"
									}
								],
								"resetCustomDimensionsOnPage": [
									{
										"resetCustomDimensionsOnPage": "abc"
									},
									{
										"resetCustomDimensionsOnPage": "xyz"
									}
								],
								"contentGroupings": [
									{
										"from": "plan",
										"to": "contentGroup1"
									},
									{
										"from": "prop2",
										"to": "contentGroup2"
									}
								]
							},
							"Enabled": true
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
							"endpoint": "https://www.google-analytics.com/collect",
							"headers": {},
							"params": {
								"ul": "en-US",
								"ec": "All",
								"ni": 1,
								"v": "1",
								"t": "event",
								"el": "event",
								"tid": "UA-165994240-1",
								"ds": "web",
								"an": "RudderLabs JavaScript SDK",
								"av": "1.0.0",
								"aiid": "com.rudderlabs.javascript",
								"npa": 1,
								"cid": "00000000000000000000000000",
								"ea": "order starterefundedd",
								"ua": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/77.0.3865.90 Safari/537.36",
								"uid": "12345",
								"qt": 124893881700
							},
							"body": {
								"JSON": {},
								"XML": {},
								"JSON_ARRAY": {},
								"FORM": {}
							},
							"files": {},
							"userId": "00000000000000000000000000"
						},
						"statusCode": 200
					}
				]
			}
		}
	},
	{
		"name": "ga",
		"description": "Test 24",
		"feature": "processor",
		"module": "destination",
		"version": "v0",
		"input": {
			"request": {
				"body": [
					{
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
									"email": "test@rudderstack.com"
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
							"type": "track",
							"messageId": "ec5481b6-a926-4d2e-b293-0b3a77c4d3be",
							"originalTimestamp": "2019-10-14T11:15:18.300Z",
							"anonymousId": "00000000000000000000000000",
							"userId": "12345",
							"event": "order starterefundedd",
							"properties": {
								"products": [
									{
										"quantity": 1,
										"sku": "p-298"
									},
									{
										"quantity": 1,
										"sku": "p-299"
									}
								],
								"testDimension": true,
								"testMetric": true
							},
							"integrations": {
								"All": true
							},
							"sentAt": "2019-10-14T11:15:53.296Z"
						},
						"destination": {
							"Config": {
								"trackingID": "UA-165994240-1",
								"doubleClick": true,
								"classic": true,
								"ignoredReferrers": "",
								"serverClassic": false,
								"includeSearch": true,
								"trackCategorizedPages": true,
								"trackNamedPages": true,
								"sampleRate": "100",
								"siteSpeedSampleRate": "1",
								"setAllMappedProps": true,
								"enableServerSideIdentify": true,
								"serverSideIdentifyEventCategory": "cat1",
								"serverSideIdentifyEventAction": "action1",
								"anonymizeIp": true,
								"domain": "domain",
								"enhancedEcommerce": true,
								"nonInteraction": true,
								"optimize": "abc123",
								"sendUserId": true,
								"useGoogleAmpClientId": true,
								"web-useNativeSDK": true,
								"dimensions": [
									{
										"from": "name",
										"to": "dimension1"
									},
									{
										"from": "custom2",
										"to": "dimension2"
									}
								],
								"metrics": [
									{
										"from": "email",
										"to": "metric1"
									},
									{
										"from": "trait2",
										"to": "metric2"
									}
								],
								"resetCustomDimensionsOnPage": [
									{
										"resetCustomDimensionsOnPage": "abc"
									},
									{
										"resetCustomDimensionsOnPage": "xyz"
									}
								],
								"contentGroupings": [
									{
										"from": "plan",
										"to": "contentGroup1"
									},
									{
										"from": "prop2",
										"to": "contentGroup2"
									}
								]
							},
							"Enabled": true
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
							"endpoint": "https://www.google-analytics.com/collect",
							"headers": {},
							"params": {
								"ul": "en-US",
								"ec": "All",
								"ni": 1,
								"v": "1",
								"t": "event",
								"el": "event",
								"tid": "UA-165994240-1",
								"ds": "web",
								"an": "RudderLabs JavaScript SDK",
								"av": "1.0.0",
								"aiid": "com.rudderlabs.javascript",
								"npa": 1,
								"aip": 1,
								"cid": "00000000000000000000000000",
								"ea": "order starterefundedd",
								"ua": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/77.0.3865.90 Safari/537.36",
								"uid": "12345",
								"qt": 124893881700
							},
							"body": {
								"JSON": {},
								"XML": {},
								"JSON_ARRAY": {},
								"FORM": {}
							},
							"files": {},
							"userId": "00000000000000000000000000"
						},
						"statusCode": 200
					}
				]
			}
		}
	},
	{
		"name": "ga",
		"description": "Test 25",
		"feature": "processor",
		"module": "destination",
		"version": "v0",
		"input": {
			"request": {
				"body": [
					{
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
									"email": "test@rudderstack.com"
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
							"type": "track",
							"messageId": "ec5481b6-a926-4d2e-b293-0b3a77c4d3be",
							"originalTimestamp": "2019-10-14T11:15:18.300Z",
							"anonymousId": "00000000000000000000000000",
							"userId": "12345",
							"event": "linkid test",
							"properties": {
								"linkid": "abc123",
								"testDimension": true,
								"testMetric": true
							},
							"integrations": {
								"All": true
							},
							"sentAt": "2019-10-14T11:15:53.296Z"
						},
						"destination": {
							"Config": {
								"trackingID": "UA-165994240-1",
								"doubleClick": true,
								"enhancedLinkAttribution": true,
								"classic": true,
								"ignoredReferrers": "",
								"serverClassic": false,
								"includeSearch": true,
								"trackCategorizedPages": true,
								"trackNamedPages": true,
								"sampleRate": "100",
								"siteSpeedSampleRate": "1",
								"setAllMappedProps": true,
								"enableServerSideIdentify": true,
								"serverSideIdentifyEventCategory": "cat1",
								"serverSideIdentifyEventAction": "action1",
								"domain": "domain",
								"enhancedEcommerce": true,
								"nonInteraction": true,
								"optimize": "abc123",
								"sendUserId": true,
								"useGoogleAmpClientId": true,
								"web-useNativeSDK": true,
								"dimensions": [
									{
										"from": "name",
										"to": "dimension1"
									},
									{
										"from": "custom2",
										"to": "dimension2"
									}
								],
								"metrics": [
									{
										"from": "email",
										"to": "metric1"
									},
									{
										"from": "trait2",
										"to": "metric2"
									}
								],
								"resetCustomDimensionsOnPage": [
									{
										"resetCustomDimensionsOnPage": "abc"
									},
									{
										"resetCustomDimensionsOnPage": "xyz"
									}
								],
								"contentGroupings": [
									{
										"from": "plan",
										"to": "contentGroup1"
									},
									{
										"from": "prop2",
										"to": "contentGroup2"
									}
								]
							},
							"Enabled": true
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
							"endpoint": "https://www.google-analytics.com/collect",
							"headers": {},
							"params": {
								"ul": "en-US",
								"ec": "All",
								"ni": 1,
								"v": "1",
								"t": "event",
								"el": "event",
								"tid": "UA-165994240-1",
								"ds": "web",
								"an": "RudderLabs JavaScript SDK",
								"av": "1.0.0",
								"aiid": "com.rudderlabs.javascript",
								"npa": 1,
								"linkid": "abc123",
								"cid": "00000000000000000000000000",
								"ea": "linkid test",
								"ua": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/77.0.3865.90 Safari/537.36",
								"uid": "12345",
								"qt": 124893881700
							},
							"body": {
								"JSON": {},
								"XML": {},
								"JSON_ARRAY": {},
								"FORM": {}
							},
							"files": {},
							"userId": "00000000000000000000000000"
						},
						"statusCode": 200
					}
				]
			}
		}
	},
	{
		"name": "ga",
		"description": "Test 26",
		"feature": "processor",
		"module": "destination",
		"version": "v0",
		"input": {
			"request": {
				"body": [
					{
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
									"email": "test@rudderstack.com"
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
								"campaign": {
									"name": "sampleName",
									"source": "sampleSource",
									"medium": "sampleMedium",
									"content": "sampleContent",
									"term": "sampleTerm"
								}
							},
							"type": "track",
							"messageId": "ec5481b6-a926-4d2e-b293-0b3a77c4d3be",
							"originalTimestamp": "2019-10-14T11:15:18.300Z",
							"anonymousId": "00000000000000000000000000",
							"userId": "12345",
							"event": "campaign test",
							"properties": {
								"testDimension": true,
								"testMetric": true
							},
							"integrations": {
								"All": true
							},
							"sentAt": "2019-10-14T11:15:53.296Z"
						},
						"destination": {
							"Config": {
								"trackingID": "UA-165994240-1",
								"doubleClick": true,
								"enhancedLinkAttribution": true,
								"classic": true,
								"ignoredReferrers": "",
								"serverClassic": false,
								"includeSearch": true,
								"trackCategorizedPages": true,
								"trackNamedPages": true,
								"sampleRate": "100",
								"siteSpeedSampleRate": "1",
								"setAllMappedProps": true,
								"enableServerSideIdentify": true,
								"serverSideIdentifyEventCategory": "cat1",
								"serverSideIdentifyEventAction": "action1",
								"domain": "domain",
								"enhancedEcommerce": true,
								"nonInteraction": true,
								"optimize": "abc123",
								"sendUserId": true,
								"useGoogleAmpClientId": true,
								"web-useNativeSDK": true,
								"dimensions": [
									{
										"from": "name",
										"to": "dimension1"
									},
									{
										"from": "custom2",
										"to": "dimension2"
									}
								],
								"metrics": [
									{
										"from": "email",
										"to": "metric1"
									},
									{
										"from": "trait2",
										"to": "metric2"
									}
								],
								"resetCustomDimensionsOnPage": [
									{
										"resetCustomDimensionsOnPage": "abc"
									},
									{
										"resetCustomDimensionsOnPage": "xyz"
									}
								],
								"contentGroupings": [
									{
										"from": "plan",
										"to": "contentGroup1"
									},
									{
										"from": "prop2",
										"to": "contentGroup2"
									}
								]
							},
							"Enabled": true
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
							"endpoint": "https://www.google-analytics.com/collect",
							"headers": {},
							"params": {
								"ul": "en-US",
								"ec": "All",
								"ni": 1,
								"v": "1",
								"t": "event",
								"el": "event",
								"tid": "UA-165994240-1",
								"ds": "web",
								"an": "RudderLabs JavaScript SDK",
								"av": "1.0.0",
								"aiid": "com.rudderlabs.javascript",
								"npa": 1,
								"cn": "sampleName",
								"cs": "sampleSource",
								"cm": "sampleMedium",
								"cc": "sampleContent",
								"ck": "sampleTerm",
								"cid": "00000000000000000000000000",
								"ea": "campaign test",
								"ua": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/77.0.3865.90 Safari/537.36",
								"uid": "12345",
								"qt": 124893881700
							},
							"body": {
								"JSON": {},
								"XML": {},
								"JSON_ARRAY": {},
								"FORM": {}
							},
							"files": {},
							"userId": "00000000000000000000000000"
						},
						"statusCode": 200
					}
				]
			}
		}
	},
	{
		"name": "ga",
		"description": "Test 27",
		"feature": "processor",
		"module": "destination",
		"version": "v0",
		"input": {
			"request": {
				"body": [
					{
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
									"email": "test@rudderstack.com"
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
								"campaign": {
									"name": "sampleName",
									"source": "sampleSource",
									"medium": "sampleMedium",
									"content": "sampleContent",
									"term": "sampleTerm"
								}
							},
							"type": "track",
							"messageId": "ec5481b6-a926-4d2e-b293-0b3a77c4d3be",
							"originalTimestamp": "2019-10-14T11:15:18.300Z",
							"anonymousId": "00000000000000000000000000",
							"event": "campaign test",
							"properties": {
								"testDimension": true,
								"testMetric": true
							},
							"integrations": {
								"All": true
							},
							"sentAt": "2019-10-14T11:15:53.296Z"
						},
						"destination": {
							"Config": {
								"trackingID": "UA-165994240-1",
								"doubleClick": true,
								"enhancedLinkAttribution": true,
								"classic": true,
								"ignoredReferrers": "",
								"serverClassic": false,
								"includeSearch": true,
								"trackCategorizedPages": true,
								"trackNamedPages": true,
								"sampleRate": "100",
								"siteSpeedSampleRate": "1",
								"setAllMappedProps": true,
								"enableServerSideIdentify": true,
								"serverSideIdentifyEventCategory": "cat1",
								"serverSideIdentifyEventAction": "action1",
								"domain": "domain",
								"enhancedEcommerce": true,
								"nonInteraction": true,
								"optimize": "abc123",
								"sendUserId": true,
								"useGoogleAmpClientId": true,
								"web-useNativeSDK": true,
								"dimensions": [
									{
										"from": "name",
										"to": "dimension1"
									},
									{
										"from": "custom2",
										"to": "dimension2"
									}
								],
								"metrics": [
									{
										"from": "email",
										"to": "metric1"
									},
									{
										"from": "trait2",
										"to": "metric2"
									}
								],
								"resetCustomDimensionsOnPage": [
									{
										"resetCustomDimensionsOnPage": "abc"
									},
									{
										"resetCustomDimensionsOnPage": "xyz"
									}
								],
								"contentGroupings": [
									{
										"from": "plan",
										"to": "contentGroup1"
									},
									{
										"from": "prop2",
										"to": "contentGroup2"
									}
								]
							},
							"Enabled": true
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
							"endpoint": "https://www.google-analytics.com/collect",
							"headers": {},
							"params": {
								"ul": "en-US",
								"ec": "All",
								"ni": 1,
								"v": "1",
								"t": "event",
								"el": "event",
								"tid": "UA-165994240-1",
								"ds": "web",
								"an": "RudderLabs JavaScript SDK",
								"av": "1.0.0",
								"aiid": "com.rudderlabs.javascript",
								"npa": 1,
								"cn": "sampleName",
								"cs": "sampleSource",
								"cm": "sampleMedium",
								"cc": "sampleContent",
								"ck": "sampleTerm",
								"cid": "00000000000000000000000000",
								"ea": "campaign test",
								"ua": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/77.0.3865.90 Safari/537.36",
								"qt": 124893881700
							},
							"body": {
								"JSON": {},
								"XML": {},
								"JSON_ARRAY": {},
								"FORM": {}
							},
							"files": {},
							"userId": "00000000000000000000000000"
						},
						"statusCode": 200
					}
				]
			}
		}
	},
	{
		"name": "ga",
		"description": "Test 28",
		"feature": "processor",
		"module": "destination",
		"version": "v0",
		"input": {
			"request": {
				"body": [
					{
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
									"email": "test@rudderstack.com"
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
								"campaign": {
									"name": "sampleName",
									"source": "sampleSource",
									"medium": "sampleMedium",
									"content": "sampleContent",
									"term": "sampleTerm"
								}
							},
							"type": "track",
							"messageId": "ec5481b6-a926-4d2e-b293-0b3a77c4d3be",
							"originalTimestamp": "2019-10-14T11:15:18.300Z",
							"anonymousId": "00000000000000000000000000",
							"event": "campaign test",
							"properties": {
								"testDimension": true,
								"testMetric": true
							},
							"integrations": {
								"All": true
							},
							"sentAt": "2019-10-14T11:15:53.296Z"
						},
						"destination": {
							"Config": {
								"trackingID": "UA-165994240-1",
								"doubleClick": true,
								"enhancedLinkAttribution": true,
								"classic": true,
								"ignoredReferrers": "",
								"serverClassic": false,
								"includeSearch": true,
								"trackCategorizedPages": true,
								"trackNamedPages": true,
								"sampleRate": "100",
								"siteSpeedSampleRate": "1",
								"setAllMappedProps": true,
								"enableServerSideIdentify": true,
								"serverSideIdentifyEventCategory": "cat1",
								"domain": "domain",
								"enhancedEcommerce": true,
								"nonInteraction": true,
								"optimize": "abc123",
								"sendUserId": true,
								"useGoogleAmpClientId": true,
								"web-useNativeSDK": true,
								"dimensions": [
									{
										"from": "name",
										"to": "dimension1"
									},
									{
										"from": "custom2",
										"to": "dimension2"
									}
								],
								"metrics": [
									{
										"from": "email",
										"to": "metric1"
									},
									{
										"from": "trait2",
										"to": "metric2"
									}
								],
								"resetCustomDimensionsOnPage": [
									{
										"resetCustomDimensionsOnPage": "abc"
									},
									{
										"resetCustomDimensionsOnPage": "xyz"
									}
								],
								"contentGroupings": [
									{
										"from": "plan",
										"to": "contentGroup1"
									},
									{
										"from": "prop2",
										"to": "contentGroup2"
									}
								]
							},
							"Enabled": true
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
							"endpoint": "https://www.google-analytics.com/collect",
							"headers": {},
							"params": {
								"ul": "en-US",
								"ec": "All",
								"ni": 1,
								"v": "1",
								"t": "event",
								"el": "event",
								"tid": "UA-165994240-1",
								"ds": "web",
								"an": "RudderLabs JavaScript SDK",
								"av": "1.0.0",
								"aiid": "com.rudderlabs.javascript",
								"npa": 1,
								"cn": "sampleName",
								"cs": "sampleSource",
								"cm": "sampleMedium",
								"cc": "sampleContent",
								"ck": "sampleTerm",
								"cid": "00000000000000000000000000",
								"ea": "campaign test",
								"ua": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/77.0.3865.90 Safari/537.36",
								"qt": 124893881700
							},
							"body": {
								"JSON": {},
								"XML": {},
								"JSON_ARRAY": {},
								"FORM": {}
							},
							"files": {},
							"userId": "00000000000000000000000000"
						},
						"statusCode": 200
					}
				]
			}
		}
	},
	{
		"name": "ga",
		"description": "Test 29",
		"feature": "processor",
		"module": "destination",
		"version": "v0",
		"input": {
			"request": {
				"body": [
					{
						"message": {
							"channel": "web",
							"context": {
								"app": {
									"build": "1.0.0",
									"name": "RudderLabs JavaScript SDK",
									"namespace": "com.rudderlabs.javascript",
									"version": "1.1.2"
								},
								"traits": {
									"abc": "1234"
								},
								"library": {
									"name": "RudderLabs JavaScript SDK",
									"version": "1.1.2"
								},
								"userAgent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_3) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/83.0.4103.97 Safari/537.36",
								"locale": "en-GB",
								"os": {
									"name": "",
									"version": ""
								},
								"screen": {
									"density": 2
								},
								"page": {
									"path": "/tests/html/ecomm_test.html",
									"referrer": "http://0.0.0.0:1112/tests/html/",
									"search": "",
									"title": "GA Ecommerce Test",
									"url": "http://0.0.0.0:1112/tests/html/ecomm_test.html"
								}
							},
							"type": "identify",
							"messageId": "bc8a6af8-37fd-46a9-9592-ea29a256435f",
							"originalTimestamp": "2020-06-22T11:30:32.493Z",
							"anonymousId": "38e169a1-3234-46f7-9ceb-c1a6a69005fe",
							"userId": "123",
							"integrations": {
								"All": true
							},
							"sentAt": "2020-06-22T11:30:32.494Z"
						},
						"destination": {
							"Config": {
								"trackingID": "UA-165994240-1",
								"doubleClick": true,
								"enhancedLinkAttribution": true,
								"classic": true,
								"ignoredReferrers": "",
								"serverClassic": false,
								"includeSearch": true,
								"trackCategorizedPages": true,
								"trackNamedPages": true,
								"sampleRate": "100",
								"siteSpeedSampleRate": "1",
								"setAllMappedProps": true,
								"enableServerSideIdentify": true,
								"serverSideIdentifyEventCategory": "cat1",
								"domain": "domain",
								"enhancedEcommerce": true,
								"nonInteraction": true,
								"optimize": "abc123",
								"sendUserId": true,
								"useGoogleAmpClientId": true,
								"web-useNativeSDK": true,
								"dimensions": [
									{
										"from": "name",
										"to": "dimension1"
									},
									{
										"from": "custom2",
										"to": "dimension2"
									}
								],
								"metrics": [
									{
										"from": "email",
										"to": "metric1"
									},
									{
										"from": "trait2",
										"to": "metric2"
									}
								],
								"resetCustomDimensionsOnPage": [
									{
										"resetCustomDimensionsOnPage": "abc"
									},
									{
										"resetCustomDimensionsOnPage": "xyz"
									}
								],
								"contentGroupings": [
									{
										"from": "plan",
										"to": "contentGroup1"
									},
									{
										"from": "prop2",
										"to": "contentGroup2"
									}
								]
							},
							"Enabled": true
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
							"endpoint": "https://www.google-analytics.com/collect",
							"headers": {},
							"params": {
								"ea": "User Enriched",
								"dt": "GA Ecommerce Test",
								"ec": "All",
								"v": "1",
								"t": "event",
								"tid": "UA-165994240-1",
								"ds": "web",
								"an": "RudderLabs JavaScript SDK",
								"av": "1.1.2",
								"aiid": "com.rudderlabs.javascript",
								"npa": 1,
								"uid": "123",
								"cid": "38e169a1-3234-46f7-9ceb-c1a6a69005fe",
								"ni": 1,
								"ua": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_3) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/83.0.4103.97 Safari/537.36",
								"ul": "en-GB",
								"qt": 103120167507
							},
							"body": {
								"JSON": {},
								"XML": {},
								"JSON_ARRAY": {},
								"FORM": {}
							},
							"files": {},
							"userId": "38e169a1-3234-46f7-9ceb-c1a6a69005fe"
						},
						"statusCode": 200
					}
				]
			}
		}
	},
	{
		"name": "ga",
		"description": "Test 30",
		"feature": "processor",
		"module": "destination",
		"version": "v0",
		"input": {
			"request": {
				"body": [
					{
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
									"email": "test@rudderstack.com"
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
							"type": "page",
							"messageId": "5e10d13a-bf9a-44bf-b884-43a9e591ea71",
							"originalTimestamp": "2019-10-14T11:15:18.299Z",
							"anonymousId": "00000000000000000000000000",
							"userId": "12345",
							"integrations": {
								"All": true
							},
							"name": "ApplicationLoaded",
							"sentAt": "2019-10-14T11:15:53.296Z"
						},
						"destination": {
							"Config": {
								"trackingID": "UA-165994240-1",
								"doubleClick": true,
								"enhancedLinkAttribution": true,
								"classic": true,
								"ignoredReferrers": "",
								"serverClassic": false,
								"includeSearch": true,
								"trackCategorizedPages": true,
								"trackNamedPages": true,
								"sampleRate": "100",
								"siteSpeedSampleRate": "1",
								"setAllMappedProps": true,
								"enableServerSideIdentify": true,
								"serverSideIdentifyEventCategory": "cat1",
								"serverSideIdentifyEventAction": "action1",
								"anonymizeIp": true,
								"domain": "domain",
								"enhancedEcommerce": true,
								"nonInteraction": true,
								"optimize": "abc123",
								"sendUserId": true,
								"useGoogleAmpClientId": true,
								"web-useNativeSDK": true,
								"dimensions": [
									{
										"from": "name",
										"to": "dimension1"
									},
									{
										"from": "custom2",
										"to": "dimension2"
									}
								],
								"metrics": [
									{
										"from": "email",
										"to": "metric1"
									},
									{
										"from": "trait2",
										"to": "metric2"
									}
								],
								"resetCustomDimensionsOnPage": [
									{
										"resetCustomDimensionsOnPage": "abc"
									},
									{
										"resetCustomDimensionsOnPage": "xyz"
									}
								],
								"contentGroupings": [
									{
										"from": "plan",
										"to": "contentGroup1"
									},
									{
										"from": "prop2",
										"to": "contentGroup2"
									}
								]
							},
							"Enabled": true
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
							"endpoint": "https://www.google-analytics.com/collect",
							"headers": {},
							"params": {
								"v": "1",
								"t": "pageview",
								"tid": "UA-165994240-1",
								"ds": "web",
								"an": "RudderLabs JavaScript SDK",
								"av": "1.0.0",
								"aiid": "com.rudderlabs.javascript",
								"npa": 1,
								"aip": 1,
								"cid": "00000000000000000000000000",
								"ua": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/77.0.3865.90 Safari/537.36",
								"uid": "12345",
								"ul": "en-US",
								"uip": "0.0.0.0",
								"qt": 124893881701
							},
							"body": {
								"JSON": {},
								"XML": {},
								"JSON_ARRAY": {},
								"FORM": {}
							},
							"files": {},
							"userId": "00000000000000000000000000"
						},
						"statusCode": 200
					}
				]
			}
		}
	},
	{
		"name": "ga",
		"description": "Test 31",
		"feature": "processor",
		"module": "destination",
		"version": "v0",
		"input": {
			"request": {
				"body": [
					{
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
									"email": "test@rudderstack.com"
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
							"type": "page",
							"messageId": "5e10d13a-bf9a-44bf-b884-43a9e591ea71",
							"originalTimestamp": "2019-10-14T11:15:18.299Z",
							"anonymousId": "00000000000000000000000000",
							"userId": "12345",
							"properties": {
								"path": "/abc",
								"referrer": "",
								"search": "?xyz=1",
								"title": "",
								"url": "https://www.example.com/abc"
							},
							"integrations": {
								"All": true
							},
							"name": "ApplicationLoaded",
							"sentAt": "2019-10-14T11:15:53.296Z"
						},
						"destination": {
							"Config": {
								"trackingID": "UA-165994240-1",
								"doubleClick": true,
								"enhancedLinkAttribution": true,
								"classic": true,
								"ignoredReferrers": "",
								"serverClassic": false,
								"includeSearch": true,
								"trackCategorizedPages": true,
								"trackNamedPages": true,
								"sampleRate": "100",
								"siteSpeedSampleRate": "1",
								"setAllMappedProps": true,
								"enableServerSideIdentify": true,
								"serverSideIdentifyEventCategory": "cat1",
								"serverSideIdentifyEventAction": "action1",
								"anonymizeIp": true,
								"domain": "domain",
								"enhancedEcommerce": true,
								"nonInteraction": true,
								"optimize": "abc123",
								"sendUserId": true,
								"useGoogleAmpClientId": true,
								"web-useNativeSDK": true,
								"dimensions": [
									{
										"from": "name",
										"to": "dimension1"
									},
									{
										"from": "custom2",
										"to": "dimension2"
									}
								],
								"metrics": [
									{
										"from": "email",
										"to": "metric1"
									},
									{
										"from": "trait2",
										"to": "metric2"
									}
								],
								"resetCustomDimensionsOnPage": [
									{
										"resetCustomDimensionsOnPage": "abc"
									},
									{
										"resetCustomDimensionsOnPage": "xyz"
									}
								],
								"contentGroupings": [
									{
										"from": "plan",
										"to": "contentGroup1"
									},
									{
										"from": "prop2",
										"to": "contentGroup2"
									}
								]
							},
							"Enabled": true
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
							"endpoint": "https://www.google-analytics.com/collect",
							"headers": {},
							"params": {
								"v": "1",
								"t": "pageview",
								"tid": "UA-165994240-1",
								"ds": "web",
								"an": "RudderLabs JavaScript SDK",
								"av": "1.0.0",
								"aiid": "com.rudderlabs.javascript",
								"npa": 1,
								"aip": 1,
								"cid": "00000000000000000000000000",
								"ua": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/77.0.3865.90 Safari/537.36",
								"uid": "12345",
								"ul": "en-US",
								"uip": "0.0.0.0",
								"dh": "www.example.com",
								"dl": "https://www.example.com/abc",
								"dp": "%2Fabc%3Fxyz%3D1",
								"qt": 124893881701
							},
							"body": {
								"JSON": {},
								"XML": {},
								"JSON_ARRAY": {},
								"FORM": {}
							},
							"files": {},
							"userId": "00000000000000000000000000"
						},
						"statusCode": 200
					}
				]
			}
		}
	},
	{
		"name": "ga",
		"description": "Test 32",
		"feature": "processor",
		"module": "destination",
		"version": "v0",
		"input": {
			"request": {
				"body": [
					{
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
									"email": "test@rudderstack.com"
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
							"type": "track",
							"messageId": "5e10d13a-bf9a-44bf-b884-43a9e591ea71",
							"originalTimestamp": "2019-10-14T11:15:18.299Z",
							"anonymousId": "00000000000000000000000000",
							"userId": "12345",
							"integrations": {
								"All": true
							},
							"event": "sample event",
							"sentAt": "2019-10-14T11:15:53.296Z"
						},
						"destination": {
							"Config": {
								"trackingID": "UA-165994240-1",
								"doubleClick": true,
								"enhancedLinkAttribution": true,
								"classic": true,
								"ignoredReferrers": "",
								"serverClassic": false,
								"includeSearch": true,
								"trackCategorizedPages": true,
								"trackNamedPages": true,
								"sampleRate": "100",
								"siteSpeedSampleRate": "1",
								"setAllMappedProps": true,
								"enableServerSideIdentify": true,
								"serverSideIdentifyEventCategory": "cat1",
								"serverSideIdentifyEventAction": "action1",
								"anonymizeIp": true,
								"domain": "domain",
								"nonInteraction": true,
								"optimize": "abc123",
								"sendUserId": true,
								"useGoogleAmpClientId": true,
								"web-useNativeSDK": true,
								"dimensions": [
									{
										"from": "name",
										"to": "dimension1"
									},
									{
										"from": "custom2",
										"to": "dimension2"
									}
								],
								"metrics": [
									{
										"from": "email",
										"to": "metric1"
									},
									{
										"from": "trait2",
										"to": "metric2"
									}
								],
								"resetCustomDimensionsOnPage": [
									{
										"resetCustomDimensionsOnPage": "abc"
									},
									{
										"resetCustomDimensionsOnPage": "xyz"
									}
								],
								"contentGroupings": [
									{
										"from": "plan",
										"to": "contentGroup1"
									},
									{
										"from": "prop2",
										"to": "contentGroup2"
									}
								]
							},
							"Enabled": true
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
							"endpoint": "https://www.google-analytics.com/collect",
							"headers": {},
							"params": {
								"ec": "All",
								"ni": 1,
								"v": "1",
								"t": "event",
								"el": "event",
								"tid": "UA-165994240-1",
								"ds": "web",
								"an": "RudderLabs JavaScript SDK",
								"av": "1.0.0",
								"aiid": "com.rudderlabs.javascript",
								"npa": 1,
								"aip": 1,
								"cid": "00000000000000000000000000",
								"ea": "sample event",
								"ua": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/77.0.3865.90 Safari/537.36",
								"uid": "12345",
								"ul": "en-US",
								"uip": "0.0.0.0",
								"qt": 124893881701
							},
							"body": {
								"JSON": {},
								"XML": {},
								"JSON_ARRAY": {},
								"FORM": {}
							},
							"files": {},
							"userId": "00000000000000000000000000"
						},
						"statusCode": 200
					}
				]
			}
		}
	},
	{
		"name": "ga",
		"description": "Test 33",
		"feature": "processor",
		"module": "destination",
		"version": "v0",
		"input": {
			"request": {
				"body": [
					{
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
									"email": "test@rudderstack.com"
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
							"type": "track",
							"messageId": "ec5481b6-a926-4d2e-b293-0b3a77c4d3be",
							"originalTimestamp": "2019-10-14T11:15:18.300Z",
							"anonymousId": "00000000000000000000000000",
							"userId": "12345",
							"event": "Order Refunded",
							"properties": {
								"order_id": "rudderstackorder1",
								"total": 99.99,
								"shipping": 13.99,
								"tax": 20.99,
								"currency": "INR",
								"products": [
									{
										"quantity": 1,
										"price": 24.75,
										"name": "my product",
										"sku": "p-298"
									},
									{
										"quantity": 3,
										"price": 24.75,
										"name": "other product",
										"sku": "p-299"
									}
								]
							},
							"integrations": {
								"All": true
							},
							"sentAt": "2019-10-14T11:15:53.296Z"
						},
						"destination": {
							"Config": {
								"trackingID": "UA-165994240-1",
								"doubleClick": true,
								"enhancedLinkAttribution": true,
								"classic": true,
								"ignoredReferrers": "",
								"serverClassic": false,
								"includeSearch": true,
								"trackCategorizedPages": true,
								"trackNamedPages": true,
								"sampleRate": "100",
								"siteSpeedSampleRate": "1",
								"setAllMappedProps": true,
								"enableServerSideIdentify": true,
								"serverSideIdentifyEventCategory": "cat1",
								"serverSideIdentifyEventAction": "action1",
								"anonymizeIp": true,
								"domain": "domain",
								"enhancedEcommerce": true,
								"nonInteraction": true,
								"optimize": "abc123",
								"sendUserId": true,
								"useGoogleAmpClientId": true,
								"web-useNativeSDK": true,
								"dimensions": [
									{
										"from": "name",
										"to": "dimension1"
									},
									{
										"from": "custom2",
										"to": "dimension2"
									}
								],
								"metrics": [
									{
										"from": "email",
										"to": "metric1"
									},
									{
										"from": "trait2",
										"to": "metric2"
									}
								],
								"resetCustomDimensionsOnPage": [
									{
										"resetCustomDimensionsOnPage": "abc"
									},
									{
										"resetCustomDimensionsOnPage": "xyz"
									}
								],
								"contentGroupings": [
									{
										"from": "plan",
										"to": "contentGroup1"
									},
									{
										"from": "prop2",
										"to": "contentGroup2"
									}
								]
							},
							"Enabled": true
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
							"endpoint": "https://www.google-analytics.com/collect",
							"headers": {},
							"params": {
								"pa": "refund",
								"ev": 100,
								"pr1id": "p-298",
								"pr1cd1": "my product",
								"pr1nm": "my product",
								"pr1pr": 24.75,
								"pr1qt": 1,
								"pr2id": "p-299",
								"pr2cd1": "other product",
								"pr2nm": "other product",
								"pr2pr": 24.75,
								"pr2qt": 3,
								"ea": "Order Refunded",
								"ec": "EnhancedEcommerce",
								"v": "1",
								"t": "event",
								"el": "event",
								"tid": "UA-165994240-1",
								"ds": "web",
								"an": "RudderLabs JavaScript SDK",
								"av": "1.0.0",
								"aiid": "com.rudderlabs.javascript",
								"npa": 1,
								"aip": 1,
								"ua": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/77.0.3865.90 Safari/537.36",
								"cid": "00000000000000000000000000",
								"ti": "rudderstackorder1",
								"uid": "12345",
								"ul": "en-US",
								"ni": 1,
								"qt": 124893881700
							},
							"body": {
								"JSON": {},
								"XML": {},
								"JSON_ARRAY": {},
								"FORM": {}
							},
							"files": {},
							"userId": "00000000000000000000000000"
						},
						"statusCode": 200
					}
				]
			}
		}
	},
	{
		"name": "ga",
		"description": "Test 34",
		"feature": "processor",
		"module": "destination",
		"version": "v0",
		"input": {
			"request": {
				"body": [
					{
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
									"email": "test@rudderstack.com"
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
							"type": "track",
							"messageId": "ec5481b6-a926-4d2e-b293-0b3a77c4d3be",
							"originalTimestamp": "2019-10-14T11:15:18.300Z",
							"anonymousId": "00000000000000000000000000",
							"userId": "12345",
							"event": "Order Refunded",
							"properties": {
								"order_id": "rudderstackorder1",
								"total": 99.99,
								"shipping": 13.99,
								"tax": 20.99,
								"currency": "INR"
							},
							"integrations": {
								"All": true
							},
							"sentAt": "2019-10-14T11:15:53.296Z"
						},
						"destination": {
							"Config": {
								"trackingID": "UA-165994240-1",
								"doubleClick": true,
								"enhancedLinkAttribution": true,
								"classic": true,
								"ignoredReferrers": "",
								"serverClassic": false,
								"includeSearch": true,
								"trackCategorizedPages": true,
								"trackNamedPages": true,
								"sampleRate": "100",
								"siteSpeedSampleRate": "1",
								"setAllMappedProps": true,
								"enableServerSideIdentify": true,
								"serverSideIdentifyEventCategory": "cat1",
								"serverSideIdentifyEventAction": "action1",
								"anonymizeIp": true,
								"domain": "domain",
								"enhancedEcommerce": true,
								"nonInteraction": true,
								"optimize": "abc123",
								"sendUserId": true,
								"useGoogleAmpClientId": true,
								"web-useNativeSDK": true,
								"dimensions": [
									{
										"from": "name",
										"to": "dimension1"
									},
									{
										"from": "custom2",
										"to": "dimension2"
									}
								],
								"metrics": [
									{
										"from": "email",
										"to": "metric1"
									},
									{
										"from": "trait2",
										"to": "metric2"
									}
								],
								"resetCustomDimensionsOnPage": [
									{
										"resetCustomDimensionsOnPage": "abc"
									},
									{
										"resetCustomDimensionsOnPage": "xyz"
									}
								],
								"contentGroupings": [
									{
										"from": "plan",
										"to": "contentGroup1"
									},
									{
										"from": "prop2",
										"to": "contentGroup2"
									}
								]
							},
							"Enabled": true
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
							"endpoint": "https://www.google-analytics.com/collect",
							"headers": {},
							"params": {
								"ev": 100,
								"pa": "refund",
								"ti": "rudderstackorder1",
								"ea": "Order Refunded",
								"ec": "EnhancedEcommerce",
								"v": "1",
								"t": "event",
								"el": "event",
								"tid": "UA-165994240-1",
								"ds": "web",
								"an": "RudderLabs JavaScript SDK",
								"av": "1.0.0",
								"aiid": "com.rudderlabs.javascript",
								"npa": 1,
								"aip": 1,
								"ua": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/77.0.3865.90 Safari/537.36",
								"cid": "00000000000000000000000000",
								"uid": "12345",
								"ul": "en-US",
								"ni": 1,
								"qt": 124893881700
							},
							"body": {
								"JSON": {},
								"XML": {},
								"JSON_ARRAY": {},
								"FORM": {}
							},
							"files": {},
							"userId": "00000000000000000000000000"
						},
						"statusCode": 200
					}
				]
			}
		}
	},
	{
		"name": "ga",
		"description": "Test 35",
		"feature": "processor",
		"module": "destination",
		"version": "v0",
		"input": {
			"request": {
				"body": [
					{
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
									"email": "test@rudderstack.com"
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
							"type": "track",
							"messageId": "ec5481b6-a926-4d2e-b293-0b3a77c4d3be",
							"originalTimestamp": "2019-10-14T11:15:18.300Z",
							"anonymousId": "00000000000000000000000000",
							"userId": "12345",
							"event": "Order Refunded",
							"properties": {
								"order_id": "rudderstackorder1",
								"total": 99.99,
								"shipping": 13.99,
								"tax": 20.99,
								"currency": "INR",
								"products": []
							},
							"integrations": {
								"All": true
							},
							"sentAt": "2019-10-14T11:15:53.296Z"
						},
						"destination": {
							"Config": {
								"trackingID": "UA-165994240-1",
								"doubleClick": true,
								"enhancedLinkAttribution": true,
								"classic": true,
								"ignoredReferrers": "",
								"serverClassic": false,
								"includeSearch": true,
								"trackCategorizedPages": true,
								"trackNamedPages": true,
								"sampleRate": "100",
								"siteSpeedSampleRate": "1",
								"setAllMappedProps": true,
								"enableServerSideIdentify": true,
								"serverSideIdentifyEventCategory": "cat1",
								"serverSideIdentifyEventAction": "action1",
								"anonymizeIp": true,
								"domain": "domain",
								"enhancedEcommerce": true,
								"nonInteraction": true,
								"optimize": "abc123",
								"sendUserId": true,
								"useGoogleAmpClientId": true,
								"web-useNativeSDK": true,
								"dimensions": [
									{
										"from": "name",
										"to": "dimension1"
									},
									{
										"from": "custom2",
										"to": "dimension2"
									}
								],
								"metrics": [
									{
										"from": "email",
										"to": "metric1"
									},
									{
										"from": "trait2",
										"to": "metric2"
									}
								],
								"resetCustomDimensionsOnPage": [
									{
										"resetCustomDimensionsOnPage": "abc"
									},
									{
										"resetCustomDimensionsOnPage": "xyz"
									}
								],
								"contentGroupings": [
									{
										"from": "plan",
										"to": "contentGroup1"
									},
									{
										"from": "prop2",
										"to": "contentGroup2"
									}
								]
							},
							"Enabled": true
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
							"endpoint": "https://www.google-analytics.com/collect",
							"headers": {},
							"params": {
								"ev": 100,
								"pa": "refund",
								"ti": "rudderstackorder1",
								"ea": "Order Refunded",
								"ec": "EnhancedEcommerce",
								"v": "1",
								"t": "event",
								"el": "event",
								"tid": "UA-165994240-1",
								"ds": "web",
								"an": "RudderLabs JavaScript SDK",
								"av": "1.0.0",
								"aiid": "com.rudderlabs.javascript",
								"npa": 1,
								"aip": 1,
								"ua": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/77.0.3865.90 Safari/537.36",
								"cid": "00000000000000000000000000",
								"uid": "12345",
								"ul": "en-US",
								"ni": 1,
								"qt": 124893881700
							},
							"body": {
								"JSON": {},
								"XML": {},
								"JSON_ARRAY": {},
								"FORM": {}
							},
							"files": {},
							"userId": "00000000000000000000000000"
						},
						"statusCode": 200
					}
				]
			}
		}
	},
	{
		"name": "ga",
		"description": "Test 36",
		"feature": "processor",
		"module": "destination",
		"version": "v0",
		"input": {
			"request": {
				"body": [
					{
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
									"email": "test@rudderstack.com"
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
							"type": "track",
							"messageId": "ec5481b6-a926-4d2e-b293-0b3a77c4d3be",
							"originalTimestamp": "2019-10-14T11:15:18.300Z",
							"anonymousId": "00000000000000000000000000",
							"userId": "12345",
							"event": "Order Refunded",
							"properties": {
								"order_id": "rudderstackorder1",
								"total": 99.99,
								"shipping": 13.99,
								"tax": 20.99,
								"currency": "INR",
								"products": [
									{
										"quantity": 1,
										"price": 24.75,
										"name": "my product",
										"sku": "p-298",
										"product_id": "1"
									},
									{
										"quantity": 3,
										"price": 24.75,
										"name": "other product",
										"sku": "p-299",
										"product_id": "2"
									}
								]
							},
							"integrations": {
								"All": true
							},
							"sentAt": "2019-10-14T11:15:53.296Z"
						},
						"destination": {
							"Config": {
								"trackingID": "UA-165994240-1",
								"doubleClick": true,
								"enhancedLinkAttribution": true,
								"classic": true,
								"ignoredReferrers": "",
								"serverClassic": false,
								"includeSearch": true,
								"trackCategorizedPages": true,
								"trackNamedPages": true,
								"sampleRate": "100",
								"siteSpeedSampleRate": "1",
								"setAllMappedProps": true,
								"enableServerSideIdentify": true,
								"serverSideIdentifyEventCategory": "cat1",
								"serverSideIdentifyEventAction": "action1",
								"anonymizeIp": true,
								"domain": "domain",
								"enhancedEcommerce": true,
								"nonInteraction": true,
								"optimize": "abc123",
								"sendUserId": true,
								"useGoogleAmpClientId": true,
								"web-useNativeSDK": true,
								"dimensions": [
									{
										"from": "name",
										"to": "dimension1"
									},
									{
										"from": "custom2",
										"to": "dimension2"
									}
								],
								"metrics": [
									{
										"from": "email",
										"to": "metric1"
									},
									{
										"from": "trait2",
										"to": "metric2"
									}
								],
								"resetCustomDimensionsOnPage": [
									{
										"resetCustomDimensionsOnPage": "abc"
									},
									{
										"resetCustomDimensionsOnPage": "xyz"
									}
								],
								"contentGroupings": [
									{
										"from": "plan",
										"to": "contentGroup1"
									},
									{
										"from": "prop2",
										"to": "contentGroup2"
									}
								]
							},
							"Enabled": true
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
							"endpoint": "https://www.google-analytics.com/collect",
							"headers": {},
							"params": {
								"ev": 100,
								"pa": "refund",
								"pr1id": "1",
								"pr1cd1": "my product",
								"pr1nm": "my product",
								"pr1pr": 24.75,
								"pr1qt": 1,
								"pr2id": "2",
								"pr2cd1": "other product",
								"pr2nm": "other product",
								"pr2pr": 24.75,
								"pr2qt": 3,
								"ea": "Order Refunded",
								"ec": "EnhancedEcommerce",
								"v": "1",
								"t": "event",
								"el": "event",
								"tid": "UA-165994240-1",
								"ds": "web",
								"an": "RudderLabs JavaScript SDK",
								"av": "1.0.0",
								"aiid": "com.rudderlabs.javascript",
								"npa": 1,
								"aip": 1,
								"ua": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/77.0.3865.90 Safari/537.36",
								"cid": "00000000000000000000000000",
								"ti": "rudderstackorder1",
								"uid": "12345",
								"ul": "en-US",
								"ni": 1,
								"qt": 124893881700
							},
							"body": {
								"JSON": {},
								"XML": {},
								"JSON_ARRAY": {},
								"FORM": {}
							},
							"files": {},
							"userId": "00000000000000000000000000"
						},
						"statusCode": 200
					}
				]
			}
		}
	},
	{
		"name": "ga",
		"description": "Test 37",
		"feature": "processor",
		"module": "destination",
		"version": "v0",
		"input": {
			"request": {
				"body": [
					{
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
									"email": "test@rudderstack.com"
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
							"type": "track",
							"messageId": "ec5481b6-a926-4d2e-b293-0b3a77c4d3be",
							"originalTimestamp": "2019-10-14T11:15:18.300Z",
							"anonymousId": "00000000000000000000000000",
							"userId": "12345",
							"event": "Cart Shared",
							"properties": {
								"order_id": "rudderstackorder1",
								"total": 99.99,
								"shipping": 13.99,
								"tax": 20.99,
								"currency": "INR",
								"products": [
									{
										"quantity": 1,
										"price": 24.75,
										"name": "my product",
										"sku": "p-298",
										"product_id": "1"
									},
									{
										"quantity": 3,
										"price": 24.75,
										"name": "other product",
										"sku": "p-299",
										"product_id": "2"
									}
								]
							},
							"integrations": {
								"All": true
							},
							"sentAt": "2019-10-14T11:15:53.296Z"
						},
						"destination": {
							"Config": {
								"trackingID": "UA-165994240-1",
								"doubleClick": true,
								"enhancedLinkAttribution": true,
								"classic": true,
								"ignoredReferrers": "",
								"serverClassic": false,
								"includeSearch": true,
								"trackCategorizedPages": true,
								"trackNamedPages": true,
								"sampleRate": "100",
								"siteSpeedSampleRate": "1",
								"setAllMappedProps": true,
								"enableServerSideIdentify": true,
								"serverSideIdentifyEventCategory": "cat1",
								"serverSideIdentifyEventAction": "action1",
								"anonymizeIp": true,
								"domain": "domain",
								"enhancedEcommerce": true,
								"nonInteraction": true,
								"optimize": "abc123",
								"sendUserId": true,
								"useGoogleAmpClientId": true,
								"web-useNativeSDK": true,
								"dimensions": [
									{
										"from": "name",
										"to": "dimension1"
									},
									{
										"from": "custom2",
										"to": "dimension2"
									}
								],
								"metrics": [
									{
										"from": "email",
										"to": "metric1"
									},
									{
										"from": "trait2",
										"to": "metric2"
									}
								],
								"resetCustomDimensionsOnPage": [
									{
										"resetCustomDimensionsOnPage": "abc"
									},
									{
										"resetCustomDimensionsOnPage": "xyz"
									}
								],
								"contentGroupings": [
									{
										"from": "plan",
										"to": "contentGroup1"
									},
									{
										"from": "prop2",
										"to": "contentGroup2"
									}
								]
							},
							"Enabled": true
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
							"endpoint": "https://www.google-analytics.com/collect",
							"headers": {},
							"params": {
								"ev": 100,
								"ea": "Cart Shared",
								"ec": "All",
								"ni": 1,
								"v": "1",
								"t": "event",
								"el": "event",
								"tid": "UA-165994240-1",
								"ds": "web",
								"an": "RudderLabs JavaScript SDK",
								"av": "1.0.0",
								"aiid": "com.rudderlabs.javascript",
								"npa": 1,
								"aip": 1,
								"cid": "00000000000000000000000000",
								"ua": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/77.0.3865.90 Safari/537.36",
								"uid": "12345",
								"st": " 1 2",
								"ul": "en-US",
								"qt": 124893881700
							},
							"body": {
								"JSON": {},
								"XML": {},
								"JSON_ARRAY": {},
								"FORM": {}
							},
							"files": {},
							"userId": "00000000000000000000000000"
						},
						"statusCode": 200
					}
				]
			}
		}
	},
	{
		"name": "ga",
		"description": "Test 38",
		"feature": "processor",
		"module": "destination",
		"version": "v0",
		"input": {
			"request": {
				"body": [
					{
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
									"email": "test@rudderstack.com"
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
							"type": "track",
							"messageId": "ec5481b6-a926-4d2e-b293-0b3a77c4d3be",
							"originalTimestamp": "2019-10-14T11:15:18.300Z",
							"anonymousId": "00000000000000000000000000",
							"userId": "12345",
							"event": "Product Shared",
							"properties": {
								"product_id": "rudderstackorder1",
								"total": 99.99,
								"shipping": 13.99,
								"tax": 20.99,
								"currency": "INR",
								"url": "https://www.example.com/abc"
							},
							"integrations": {
								"All": true
							},
							"sentAt": "2019-10-14T11:15:53.296Z"
						},
						"destination": {
							"Config": {
								"trackingID": "UA-165994240-1",
								"doubleClick": true,
								"enhancedLinkAttribution": true,
								"classic": true,
								"ignoredReferrers": "",
								"serverClassic": false,
								"includeSearch": true,
								"trackCategorizedPages": true,
								"trackNamedPages": true,
								"sampleRate": "100",
								"siteSpeedSampleRate": "1",
								"setAllMappedProps": true,
								"enableServerSideIdentify": true,
								"serverSideIdentifyEventCategory": "cat1",
								"serverSideIdentifyEventAction": "action1",
								"anonymizeIp": true,
								"domain": "domain",
								"enhancedEcommerce": true,
								"nonInteraction": true,
								"optimize": "abc123",
								"sendUserId": true,
								"useGoogleAmpClientId": true,
								"web-useNativeSDK": true,
								"dimensions": [
									{
										"from": "name",
										"to": "dimension1"
									},
									{
										"from": "custom2",
										"to": "dimension2"
									}
								],
								"metrics": [
									{
										"from": "email",
										"to": "metric1"
									},
									{
										"from": "trait2",
										"to": "metric2"
									}
								],
								"resetCustomDimensionsOnPage": [
									{
										"resetCustomDimensionsOnPage": "abc"
									},
									{
										"resetCustomDimensionsOnPage": "xyz"
									}
								],
								"contentGroupings": [
									{
										"from": "plan",
										"to": "contentGroup1"
									},
									{
										"from": "prop2",
										"to": "contentGroup2"
									}
								]
							},
							"Enabled": true
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
							"endpoint": "https://www.google-analytics.com/collect",
							"headers": {},
							"params": {
								"ev": 100,
								"ea": "Product Shared",
								"ec": "All",
								"ni": 1,
								"v": "1",
								"t": "event",
								"el": "event",
								"tid": "UA-165994240-1",
								"ds": "web",
								"an": "RudderLabs JavaScript SDK",
								"av": "1.0.0",
								"aiid": "com.rudderlabs.javascript",
								"npa": 1,
								"aip": 1,
								"cid": "00000000000000000000000000",
								"ua": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/77.0.3865.90 Safari/537.36",
								"uid": "12345",
								"st": "https://www.example.com/abc",
								"dh": "www.example.com",
								"dl": "https://www.example.com/abc",
								"dp": "%2Fabc",
								"ul": "en-US",
								"qt": 124893881700
							},
							"body": {
								"JSON": {},
								"XML": {},
								"JSON_ARRAY": {},
								"FORM": {}
							},
							"files": {},
							"userId": "00000000000000000000000000"
						},
						"statusCode": 200
					}
				]
			}
		}
	},
	{
		"name": "ga",
		"description": "Test 39",
		"feature": "processor",
		"module": "destination",
		"version": "v0",
		"input": {
			"request": {
				"body": [
					{
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
									"email": "test@rudderstack.com"
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
							"type": "track",
							"messageId": "ec5481b6-a926-4d2e-b293-0b3a77c4d3be",
							"originalTimestamp": "2019-10-14T11:15:18.300Z",
							"anonymousId": "00000000000000000000000000",
							"userId": "12345",
							"event": "Product List Clicked",
							"properties": {
								"list_id": "Sample Product List",
								"category": "Sample Product List",
								"products": [
									{
										"quantity": 1,
										"price": 24.75,
										"name": "my product",
										"sku": "p-298",
										"product_id": "1"
									},
									{
										"quantity": 3,
										"price": 24.75,
										"name": "other product",
										"sku": "p-299",
										"product_id": "2"
									}
								]
							},
							"integrations": {
								"All": true
							},
							"sentAt": "2019-10-14T11:15:53.296Z"
						},
						"destination": {
							"Config": {
								"trackingID": "UA-165994240-1",
								"doubleClick": true,
								"enhancedLinkAttribution": true,
								"classic": true,
								"ignoredReferrers": "",
								"serverClassic": false,
								"includeSearch": true,
								"trackCategorizedPages": true,
								"trackNamedPages": true,
								"sampleRate": "100",
								"siteSpeedSampleRate": "1",
								"setAllMappedProps": true,
								"enableServerSideIdentify": true,
								"serverSideIdentifyEventCategory": "cat1",
								"serverSideIdentifyEventAction": "action1",
								"anonymizeIp": true,
								"domain": "domain",
								"enhancedEcommerce": true,
								"nonInteraction": true,
								"optimize": "abc123",
								"sendUserId": true,
								"useGoogleAmpClientId": true,
								"web-useNativeSDK": true,
								"dimensions": [
									{
										"from": "name",
										"to": "dimension1"
									},
									{
										"from": "custom2",
										"to": "dimension2"
									}
								],
								"metrics": [
									{
										"from": "email",
										"to": "metric1"
									},
									{
										"from": "trait2",
										"to": "metric2"
									}
								],
								"resetCustomDimensionsOnPage": [
									{
										"resetCustomDimensionsOnPage": "abc"
									},
									{
										"resetCustomDimensionsOnPage": "xyz"
									}
								],
								"contentGroupings": [
									{
										"from": "plan",
										"to": "contentGroup1"
									},
									{
										"from": "prop2",
										"to": "contentGroup2"
									}
								]
							},
							"Enabled": true
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
							"endpoint": "https://www.google-analytics.com/collect",
							"headers": {},
							"params": {
								"ea": "Product List Clicked",
								"ec": "Sample Product List",
								"pa": "click",
								"il1pi1id": "1",
								"pr1cd1": "my product",
								"il1pi1nm": "my product",
								"il1pi1pr": 24.75,
								"il1pi2id": "2",
								"pr2cd1": "other product",
								"il1pi2nm": "other product",
								"il1pi2pr": 24.75,
								"v": "1",
								"t": "event",
								"el": "event",
								"tid": "UA-165994240-1",
								"ds": "web",
								"an": "RudderLabs JavaScript SDK",
								"av": "1.0.0",
								"aiid": "com.rudderlabs.javascript",
								"npa": 1,
								"aip": 1,
								"il1nm": "Sample Product List",
								"ua": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/77.0.3865.90 Safari/537.36",
								"cid": "00000000000000000000000000",
								"uid": "12345",
								"ni": 1,
								"il1pi2qt": 3,
								"il1pi1qt": 1,
								"ul": "en-US",
								"qt": 124893881700
							},
							"body": {
								"JSON": {},
								"XML": {},
								"JSON_ARRAY": {},
								"FORM": {}
							},
							"files": {},
							"userId": "00000000000000000000000000"
						},
						"statusCode": 200
					}
				]
			}
		}
	},
	{
		"name": "ga",
		"description": "Test 40",
		"feature": "processor",
		"module": "destination",
		"version": "v0",
		"input": {
			"request": {
				"body": [
					{
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
									"email": "test@rudderstack.com"
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
							"type": "track",
							"messageId": "ec5481b6-a926-4d2e-b293-0b3a77c4d3be",
							"originalTimestamp": "2019-10-14T11:15:18.300Z",
							"anonymousId": "00000000000000000000000000",
							"userId": "12345",
							"event": "Product List Clicked",
							"properties": {
								"list_id": "Sample Product List",
								"category": "Sample Product List",
								"products": [
									{
										"quantity": 1,
										"price": 24.75,
										"name": "my product",
										"sku": "p-298"
									},
									{
										"quantity": 3,
										"price": 24.75,
										"name": "other product",
										"sku": "p-299"
									}
								]
							},
							"integrations": {
								"All": true
							},
							"sentAt": "2019-10-14T11:15:53.296Z"
						},
						"destination": {
							"Config": {
								"trackingID": "UA-165994240-1",
								"doubleClick": true,
								"enhancedLinkAttribution": true,
								"classic": true,
								"ignoredReferrers": "",
								"serverClassic": false,
								"includeSearch": true,
								"trackCategorizedPages": true,
								"trackNamedPages": true,
								"sampleRate": "100",
								"siteSpeedSampleRate": "1",
								"setAllMappedProps": true,
								"enableServerSideIdentify": true,
								"serverSideIdentifyEventCategory": "cat1",
								"serverSideIdentifyEventAction": "action1",
								"anonymizeIp": true,
								"domain": "domain",
								"enhancedEcommerce": true,
								"nonInteraction": true,
								"optimize": "abc123",
								"sendUserId": true,
								"useGoogleAmpClientId": true,
								"web-useNativeSDK": true,
								"dimensions": [
									{
										"from": "name",
										"to": "dimension1"
									},
									{
										"from": "custom2",
										"to": "dimension2"
									}
								],
								"metrics": [
									{
										"from": "email",
										"to": "metric1"
									},
									{
										"from": "trait2",
										"to": "metric2"
									}
								],
								"resetCustomDimensionsOnPage": [
									{
										"resetCustomDimensionsOnPage": "abc"
									},
									{
										"resetCustomDimensionsOnPage": "xyz"
									}
								],
								"contentGroupings": [
									{
										"from": "plan",
										"to": "contentGroup1"
									},
									{
										"from": "prop2",
										"to": "contentGroup2"
									}
								]
							},
							"Enabled": true
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
							"endpoint": "https://www.google-analytics.com/collect",
							"headers": {},
							"params": {
								"ea": "Product List Clicked",
								"ec": "Sample Product List",
								"pa": "click",
								"il1pi1id": "p-298",
								"pr1cd1": "my product",
								"il1pi1nm": "my product",
								"il1pi1pr": 24.75,
								"il1pi2id": "p-299",
								"pr2cd1": "other product",
								"il1pi2nm": "other product",
								"il1pi2pr": 24.75,
								"v": "1",
								"t": "event",
								"el": "event",
								"tid": "UA-165994240-1",
								"ds": "web",
								"an": "RudderLabs JavaScript SDK",
								"av": "1.0.0",
								"aiid": "com.rudderlabs.javascript",
								"npa": 1,
								"aip": 1,
								"il1nm": "Sample Product List",
								"ua": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/77.0.3865.90 Safari/537.36",
								"cid": "00000000000000000000000000",
								"uid": "12345",
								"ul": "en-US",
								"il1pi2qt": 3,
								"il1pi1qt": 1,
								"ni": 1,
								"qt": 124893881700
							},
							"body": {
								"JSON": {},
								"XML": {},
								"JSON_ARRAY": {},
								"FORM": {}
							},
							"files": {},
							"userId": "00000000000000000000000000"
						},
						"statusCode": 200
					}
				]
			}
		}
	},
	{
		"name": "ga",
		"description": "Test 41",
		"feature": "processor",
		"module": "destination",
		"version": "v0",
		"input": {
			"request": {
				"body": [
					{
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
									"email": "test@rudderstack.com"
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
							"type": "track",
							"messageId": "ec5481b6-a926-4d2e-b293-0b3a77c4d3be",
							"originalTimestamp": "2019-10-14T11:15:18.300Z",
							"anonymousId": "00000000000000000000000000",
							"userId": "12345",
							"event": "Product List Clicked",
							"properties": {
								"list_id": "Sample Product List",
								"category": "Sample Product List",
								"products": []
							},
							"integrations": {
								"All": true
							},
							"sentAt": "2019-10-14T11:15:53.296Z"
						},
						"destination": {
							"Config": {
								"trackingID": "UA-165994240-1",
								"doubleClick": true,
								"enhancedLinkAttribution": true,
								"classic": true,
								"ignoredReferrers": "",
								"serverClassic": false,
								"includeSearch": true,
								"trackCategorizedPages": true,
								"trackNamedPages": true,
								"sampleRate": "100",
								"siteSpeedSampleRate": "1",
								"setAllMappedProps": true,
								"enableServerSideIdentify": true,
								"serverSideIdentifyEventCategory": "cat1",
								"serverSideIdentifyEventAction": "action1",
								"anonymizeIp": true,
								"domain": "domain",
								"enhancedEcommerce": true,
								"nonInteraction": true,
								"optimize": "abc123",
								"sendUserId": true,
								"useGoogleAmpClientId": true,
								"web-useNativeSDK": true,
								"dimensions": [
									{
										"from": "name",
										"to": "dimension1"
									},
									{
										"from": "custom2",
										"to": "dimension2"
									}
								],
								"metrics": [
									{
										"from": "email",
										"to": "metric1"
									},
									{
										"from": "trait2",
										"to": "metric2"
									}
								],
								"resetCustomDimensionsOnPage": [
									{
										"resetCustomDimensionsOnPage": "abc"
									},
									{
										"resetCustomDimensionsOnPage": "xyz"
									}
								],
								"contentGroupings": [
									{
										"from": "plan",
										"to": "contentGroup1"
									},
									{
										"from": "prop2",
										"to": "contentGroup2"
									}
								]
							},
							"Enabled": true
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
							"endpoint": "https://www.google-analytics.com/collect",
							"headers": {},
							"params": {
								"ni": 1,
								"ea": "Product List Clicked",
								"ec": "Sample Product List",
								"pa": "click",
								"el": "event",
								"v": "1",
								"t": "event",
								"tid": "UA-165994240-1",
								"ds": "web",
								"npa": 1,
								"aip": 1,
								"ua": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/77.0.3865.90 Safari/537.36",
								"ul": "en-US",
								"an": "RudderLabs JavaScript SDK",
								"av": "1.0.0",
								"aiid": "com.rudderlabs.javascript",
								"il1nm": "Sample Product List",
								"uid": "12345",
								"cid": "00000000000000000000000000",
								"qt": 124893881700
							},
							"body": {
								"JSON": {},
								"XML": {},
								"JSON_ARRAY": {},
								"FORM": {}
							},
							"files": {},
							"userId": "00000000000000000000000000"
						},
						"statusCode": 200
					}
				]
			}
		}
	},
	{
		"name": "ga",
		"description": "Test 42",
		"feature": "processor",
		"module": "destination",
		"version": "v0",
		"input": {
			"request": {
				"body": [
					{
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
									"email": "test@rudderstack.com"
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
							"type": "track",
							"messageId": "ec5481b6-a926-4d2e-b293-0b3a77c4d3be",
							"originalTimestamp": "2019-10-14T11:15:18.300Z",
							"anonymousId": "00000000000000000000000000",
							"userId": "12345",
							"event": "Order Cancelled",
							"properties": {
								"order_id": "rudderstackorder1",
								"total": 99.99,
								"shipping": 13.99,
								"tax": 20.99,
								"currency": "INR",
								"products": [
									{
										"quantity": 1,
										"price": 24.75,
										"name": "my product",
										"sku": "p-298",
										"product_id": "1"
									},
									{
										"quantity": 3,
										"price": 24.75,
										"name": "other product",
										"sku": "p-299",
										"product_id": "2"
									}
								]
							},
							"integrations": {
								"All": true
							},
							"sentAt": "2019-10-14T11:15:53.296Z"
						},
						"destination": {
							"Config": {
								"trackingID": "UA-165994240-1",
								"doubleClick": true,
								"enhancedLinkAttribution": true,
								"classic": true,
								"ignoredReferrers": "",
								"serverClassic": false,
								"includeSearch": true,
								"trackCategorizedPages": true,
								"trackNamedPages": true,
								"sampleRate": "100",
								"siteSpeedSampleRate": "1",
								"setAllMappedProps": true,
								"enableServerSideIdentify": true,
								"serverSideIdentifyEventCategory": "cat1",
								"serverSideIdentifyEventAction": "action1",
								"anonymizeIp": true,
								"domain": "domain",
								"enhancedEcommerce": true,
								"nonInteraction": true,
								"optimize": "abc123",
								"sendUserId": true,
								"useGoogleAmpClientId": true,
								"web-useNativeSDK": true,
								"dimensions": [
									{
										"from": "name",
										"to": "dimension1"
									},
									{
										"from": "custom2",
										"to": "dimension2"
									}
								],
								"metrics": [
									{
										"from": "email",
										"to": "metric1"
									},
									{
										"from": "trait2",
										"to": "metric2"
									}
								],
								"resetCustomDimensionsOnPage": [
									{
										"resetCustomDimensionsOnPage": "abc"
									},
									{
										"resetCustomDimensionsOnPage": "xyz"
									}
								],
								"contentGroupings": [
									{
										"from": "plan",
										"to": "contentGroup1"
									},
									{
										"from": "prop2",
										"to": "contentGroup2"
									}
								]
							},
							"Enabled": true
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
							"endpoint": "https://www.google-analytics.com/collect",
							"headers": {},
							"params": {
								"pa": "refund",
								"ev": 100,
								"tr": 99.99,
								"pr1id": "1",
								"pr1cd1": "my product",
								"pr1nm": "my product",
								"pr1pr": 24.75,
								"pr2id": "2",
								"pr2cd1": "other product",
								"pr2nm": "other product",
								"pr2pr": 24.75,
								"ea": "Order Cancelled",
								"ec": "EnhancedEcommerce",
								"v": "1",
								"t": "event",
								"el": "event",
								"tid": "UA-165994240-1",
								"ds": "web",
								"an": "RudderLabs JavaScript SDK",
								"av": "1.0.0",
								"aiid": "com.rudderlabs.javascript",
								"npa": 1,
								"aip": 1,
								"cid": "00000000000000000000000000",
								"ti": "rudderstackorder1",
								"ts": 13.99,
								"tt": 20.99,
								"cu": "INR",
								"ua": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/77.0.3865.90 Safari/537.36",
								"uid": "12345",
								"ul": "en-US",
								"pr1qt": 1,
								"pr2qt": 3,
								"ni": 1,
								"qt": 124893881700
							},
							"body": {
								"JSON": {},
								"XML": {},
								"JSON_ARRAY": {},
								"FORM": {}
							},
							"files": {},
							"userId": "00000000000000000000000000"
						},
						"statusCode": 200
					}
				]
			}
		}
	},
	{
		"name": "ga",
		"description": "Test 43",
		"feature": "processor",
		"module": "destination",
		"version": "v0",
		"input": {
			"request": {
				"body": [
					{
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
									"email": "test@rudderstack.com"
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
							"type": "track",
							"messageId": "ec5481b6-a926-4d2e-b293-0b3a77c4d3be",
							"originalTimestamp": "2019-10-14T11:15:18.300Z",
							"anonymousId": "00000000000000000000000000",
							"userId": "12345",
							"event": "Order Cancelled",
							"properties": {
								"order_id": "rudderstackorder1",
								"value": 99.99,
								"shipping": 13.99,
								"tax": 20.99,
								"currency": "INR",
								"products": [
									{
										"quantity": 1,
										"price": 24.75,
										"name": "my product",
										"sku": "p-298",
										"product_id": "1"
									},
									{
										"quantity": 3,
										"price": 24.75,
										"name": "other product",
										"sku": "p-299",
										"product_id": "2"
									}
								]
							},
							"integrations": {
								"All": true
							},
							"sentAt": "2019-10-14T11:15:53.296Z"
						},
						"destination": {
							"Config": {
								"trackingID": "UA-165994240-1",
								"doubleClick": true,
								"enhancedLinkAttribution": true,
								"classic": true,
								"ignoredReferrers": "",
								"serverClassic": false,
								"includeSearch": true,
								"trackCategorizedPages": true,
								"trackNamedPages": true,
								"sampleRate": "100",
								"siteSpeedSampleRate": "1",
								"setAllMappedProps": true,
								"enableServerSideIdentify": true,
								"serverSideIdentifyEventCategory": "cat1",
								"serverSideIdentifyEventAction": "action1",
								"anonymizeIp": true,
								"domain": "domain",
								"enhancedEcommerce": true,
								"nonInteraction": true,
								"optimize": "abc123",
								"sendUserId": true,
								"useGoogleAmpClientId": true,
								"web-useNativeSDK": true,
								"dimensions": [
									{
										"from": "name",
										"to": "dimension1"
									},
									{
										"from": "custom2",
										"to": "dimension2"
									}
								],
								"metrics": [
									{
										"from": "email",
										"to": "metric1"
									},
									{
										"from": "trait2",
										"to": "metric2"
									}
								],
								"resetCustomDimensionsOnPage": [
									{
										"resetCustomDimensionsOnPage": "abc"
									},
									{
										"resetCustomDimensionsOnPage": "xyz"
									}
								],
								"contentGroupings": [
									{
										"from": "plan",
										"to": "contentGroup1"
									},
									{
										"from": "prop2",
										"to": "contentGroup2"
									}
								]
							},
							"Enabled": true
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
							"endpoint": "https://www.google-analytics.com/collect",
							"headers": {},
							"params": {
								"pa": "refund",
								"tr": 99.99,
								"pr1id": "1",
								"pr1cd1": "my product",
								"pr1nm": "my product",
								"pr1pr": 24.75,
								"pr2id": "2",
								"pr2cd1": "other product",
								"pr2nm": "other product",
								"pr2pr": 24.75,
								"ea": "Order Cancelled",
								"ev": 100,
								"ec": "EnhancedEcommerce",
								"v": "1",
								"t": "event",
								"el": "event",
								"tid": "UA-165994240-1",
								"ds": "web",
								"an": "RudderLabs JavaScript SDK",
								"av": "1.0.0",
								"aiid": "com.rudderlabs.javascript",
								"npa": 1,
								"aip": 1,
								"cid": "00000000000000000000000000",
								"ti": "rudderstackorder1",
								"ts": 13.99,
								"tt": 20.99,
								"cu": "INR",
								"ua": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/77.0.3865.90 Safari/537.36",
								"uid": "12345",
								"ul": "en-US",
								"pr1qt": 1,
								"pr2qt": 3,
								"ni": 1,
								"qt": 124893881700
							},
							"body": {
								"JSON": {},
								"XML": {},
								"JSON_ARRAY": {},
								"FORM": {}
							},
							"files": {},
							"userId": "00000000000000000000000000"
						},
						"statusCode": 200
					}
				]
			}
		}
	},
	{
		"name": "ga",
		"description": "Test 44",
		"feature": "processor",
		"module": "destination",
		"version": "v0",
		"input": {
			"request": {
				"body": [
					{
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
									"email": "test@rudderstack.com"
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
							"type": "track",
							"messageId": "ec5481b6-a926-4d2e-b293-0b3a77c4d3be",
							"originalTimestamp": "2019-10-14T11:15:18.300Z",
							"anonymousId": "00000000000000000000000000",
							"userId": "12345",
							"event": "Order Cancelled",
							"properties": {
								"order_id": "rudderstackorder1",
								"revenue": 99.99,
								"shipping": 13.99,
								"tax": 20.99,
								"currency": "INR",
								"products": [
									{
										"quantity": 1,
										"price": 24.75,
										"name": "my product",
										"sku": "p-298",
										"product_id": "1"
									},
									{
										"quantity": 3,
										"price": 24.75,
										"name": "other product",
										"sku": "p-299",
										"product_id": "2"
									}
								]
							},
							"integrations": {
								"All": true
							},
							"sentAt": "2019-10-14T11:15:53.296Z"
						},
						"destination": {
							"Config": {
								"trackingID": "UA-165994240-1",
								"doubleClick": true,
								"enhancedLinkAttribution": true,
								"classic": true,
								"ignoredReferrers": "",
								"serverClassic": false,
								"includeSearch": true,
								"trackCategorizedPages": true,
								"trackNamedPages": true,
								"sampleRate": "100",
								"siteSpeedSampleRate": "1",
								"setAllMappedProps": true,
								"enableServerSideIdentify": true,
								"serverSideIdentifyEventCategory": "cat1",
								"serverSideIdentifyEventAction": "action1",
								"anonymizeIp": true,
								"domain": "domain",
								"enhancedEcommerce": true,
								"nonInteraction": true,
								"optimize": "abc123",
								"sendUserId": true,
								"useGoogleAmpClientId": true,
								"web-useNativeSDK": true,
								"dimensions": [
									{
										"from": "name",
										"to": "dimension1"
									},
									{
										"from": "custom2",
										"to": "dimension2"
									}
								],
								"metrics": [
									{
										"from": "email",
										"to": "metric1"
									},
									{
										"from": "trait2",
										"to": "metric2"
									}
								],
								"resetCustomDimensionsOnPage": [
									{
										"resetCustomDimensionsOnPage": "abc"
									},
									{
										"resetCustomDimensionsOnPage": "xyz"
									}
								],
								"contentGroupings": [
									{
										"from": "plan",
										"to": "contentGroup1"
									},
									{
										"from": "prop2",
										"to": "contentGroup2"
									}
								]
							},
							"Enabled": true
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
							"endpoint": "https://www.google-analytics.com/collect",
							"headers": {},
							"params": {
								"pa": "refund",
								"tr": 99.99,
								"pr1id": "1",
								"pr1cd1": "my product",
								"pr1nm": "my product",
								"pr1pr": 24.75,
								"pr2id": "2",
								"pr2cd1": "other product",
								"pr2nm": "other product",
								"pr2pr": 24.75,
								"ea": "Order Cancelled",
								"ev": 100,
								"ec": "EnhancedEcommerce",
								"v": "1",
								"t": "event",
								"el": "event",
								"tid": "UA-165994240-1",
								"ds": "web",
								"an": "RudderLabs JavaScript SDK",
								"av": "1.0.0",
								"aiid": "com.rudderlabs.javascript",
								"npa": 1,
								"aip": 1,
								"cid": "00000000000000000000000000",
								"ti": "rudderstackorder1",
								"ts": 13.99,
								"tt": 20.99,
								"cu": "INR",
								"ua": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/77.0.3865.90 Safari/537.36",
								"uid": "12345",
								"ul": "en-US",
								"pr1qt": 1,
								"pr2qt": 3,
								"ni": 1,
								"qt": 124893881700
							},
							"body": {
								"JSON": {},
								"XML": {},
								"JSON_ARRAY": {},
								"FORM": {}
							},
							"files": {},
							"userId": "00000000000000000000000000"
						},
						"statusCode": 200
					}
				]
			}
		}
	},
	{
		"name": "ga",
		"description": "Test 45",
		"feature": "processor",
		"module": "destination",
		"version": "v0",
		"input": {
			"request": {
				"body": [
					{
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
									"email": "test@rudderstack.com"
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
							"type": "track",
							"messageId": "ec5481b6-a926-4d2e-b293-0b3a77c4d3be",
							"originalTimestamp": "2019-10-14T11:15:18.300Z",
							"anonymousId": "00000000000000000000000000",
							"userId": "12345",
							"event": "Order Cancelled",
							"properties": {
								"order_id": "rudderstackorder1",
								"revenue": 99.99,
								"shipping": 13.99,
								"tax": 20.99,
								"currency": "INR",
								"products": []
							},
							"integrations": {
								"All": true
							},
							"sentAt": "2019-10-14T11:15:53.296Z"
						},
						"destination": {
							"Config": {
								"trackingID": "UA-165994240-1",
								"doubleClick": true,
								"enhancedLinkAttribution": true,
								"classic": true,
								"ignoredReferrers": "",
								"serverClassic": false,
								"includeSearch": true,
								"trackCategorizedPages": true,
								"trackNamedPages": true,
								"sampleRate": "100",
								"siteSpeedSampleRate": "1",
								"setAllMappedProps": true,
								"enableServerSideIdentify": true,
								"serverSideIdentifyEventCategory": "cat1",
								"serverSideIdentifyEventAction": "action1",
								"anonymizeIp": true,
								"domain": "domain",
								"enhancedEcommerce": true,
								"nonInteraction": true,
								"optimize": "abc123",
								"sendUserId": true,
								"useGoogleAmpClientId": true,
								"web-useNativeSDK": true,
								"dimensions": [
									{
										"from": "name",
										"to": "dimension1"
									},
									{
										"from": "custom2",
										"to": "dimension2"
									}
								],
								"metrics": [
									{
										"from": "email",
										"to": "metric1"
									},
									{
										"from": "trait2",
										"to": "metric2"
									}
								],
								"resetCustomDimensionsOnPage": [
									{
										"resetCustomDimensionsOnPage": "abc"
									},
									{
										"resetCustomDimensionsOnPage": "xyz"
									}
								],
								"contentGroupings": [
									{
										"from": "plan",
										"to": "contentGroup1"
									},
									{
										"from": "prop2",
										"to": "contentGroup2"
									}
								]
							},
							"Enabled": true
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
						"error": "No product information supplied for transaction event",
						"statTags": {
							"destType": "GA",
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
		"name": "ga",
		"description": "Test 46",
		"feature": "processor",
		"module": "destination",
		"version": "v0",
		"input": {
			"request": {
				"body": [
					{
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
									"email": "test@rudderstack.com"
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
							"type": "track",
							"messageId": "ec5481b6-a926-4d2e-b293-0b3a77c4d3be",
							"originalTimestamp": "2019-10-14T11:15:18.300Z",
							"anonymousId": "00000000000000000000000000",
							"userId": "12345",
							"event": "Cart Viewed",
							"properties": {
								"order_id": "rudderstackorder1",
								"revenue": 99.99,
								"shipping": 13.99,
								"tax": 20.99,
								"currency": "INR",
								"products": [
									{
										"quantity": 1,
										"price": 24.75,
										"name": "my product",
										"sku": "p-298",
										"product_id": "1"
									},
									{
										"quantity": 3,
										"price": 24.75,
										"name": "other product",
										"sku": "p-299",
										"product_id": "2"
									}
								]
							},
							"integrations": {
								"All": true
							},
							"sentAt": "2019-10-14T11:15:53.296Z"
						},
						"destination": {
							"Config": {
								"trackingID": "UA-165994240-1",
								"doubleClick": true,
								"enhancedLinkAttribution": true,
								"classic": true,
								"ignoredReferrers": "",
								"serverClassic": false,
								"includeSearch": true,
								"trackCategorizedPages": true,
								"trackNamedPages": true,
								"sampleRate": "100",
								"siteSpeedSampleRate": "1",
								"setAllMappedProps": true,
								"enableServerSideIdentify": true,
								"serverSideIdentifyEventCategory": "cat1",
								"serverSideIdentifyEventAction": "action1",
								"anonymizeIp": true,
								"domain": "domain",
								"enhancedEcommerce": true,
								"nonInteraction": true,
								"optimize": "abc123",
								"sendUserId": true,
								"useGoogleAmpClientId": true,
								"web-useNativeSDK": true,
								"dimensions": [
									{
										"from": "name",
										"to": "dimension1"
									},
									{
										"from": "custom2",
										"to": "dimension2"
									}
								],
								"metrics": [
									{
										"from": "email",
										"to": "metric1"
									},
									{
										"from": "trait2",
										"to": "metric2"
									}
								],
								"resetCustomDimensionsOnPage": [
									{
										"resetCustomDimensionsOnPage": "abc"
									},
									{
										"resetCustomDimensionsOnPage": "xyz"
									}
								],
								"contentGroupings": [
									{
										"from": "plan",
										"to": "contentGroup1"
									},
									{
										"from": "prop2",
										"to": "contentGroup2"
									}
								]
							},
							"Enabled": true
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
							"endpoint": "https://www.google-analytics.com/collect",
							"headers": {},
							"params": {
								"ea": "Cart Viewed",
								"ev": 100,
								"ec": "EnhancedEcommerce",
								"pa": "detail",
								"v": "1",
								"t": "event",
								"el": "event",
								"tid": "UA-165994240-1",
								"ds": "web",
								"an": "RudderLabs JavaScript SDK",
								"av": "1.0.0",
								"aiid": "com.rudderlabs.javascript",
								"npa": 1,
								"aip": 1,
								"ua": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/77.0.3865.90 Safari/537.36",
								"cid": "00000000000000000000000000",
								"uid": "12345",
								"ul": "en-US",
								"ni": 1,
								"pr1cd1": "my product",
								"pr1id": "1",
								"pr1nm": "my product",
								"pr1pr": 24.75,
								"pr1qt": 1,
								"pr2cd1": "other product",
								"pr2id": "2",
								"pr2nm": "other product",
								"pr2pr": 24.75,
								"pr2qt": 3,
								"qt": 124893881700
							},
							"body": {
								"JSON": {},
								"XML": {},
								"JSON_ARRAY": {},
								"FORM": {}
							},
							"files": {},
							"userId": "00000000000000000000000000"
						},
						"statusCode": 200
					}
				]
			}
		}
	},
	{
		"name": "ga",
		"description": "Test 47",
		"feature": "processor",
		"module": "destination",
		"version": "v0",
		"input": {
			"request": {
				"body": [
					{
						"message": {
							"channel": "web",
							"context": {
								"traits": {
									"name1": "Test"
								},
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
							"properties": {
								"plan": "standard plan",
								"name": "rudder test"
							},
							"type": "identify",
							"messageId": "84e26acc-56a5-4835-8233-591137fca468",
							"originalTimestamp": "2019-10-14T09:03:17.562Z",
							"anonymousId": "00000000000000000000000000",
							"userId": "123456",
							"integrations": {
								"All": true
							},
							"traits": {
								"name1": "Test"
							},
							"sentAt": "2019-10-14T09:03:22.563Z"
						},
						"destination": {
							"Config": {
								"trackingID": "UA-165994240-1",
								"doubleClick": true,
								"enhancedLinkAttribution": true,
								"classic": true,
								"ignoredReferrers": "",
								"serverClassic": false,
								"includeSearch": true,
								"trackCategorizedPages": true,
								"trackNamedPages": true,
								"sampleRate": "100",
								"siteSpeedSampleRate": "1",
								"setAllMappedProps": true,
								"serverSideIdentifyEventCategory": "name",
								"serverSideIdentifyEventAction": "action1",
								"anonymizeIp": true,
								"domain": "domain",
								"enhancedEcommerce": true,
								"nonInteraction": true,
								"optimize": "abc123",
								"sendUserId": true,
								"useGoogleAmpClientId": true,
								"web-useNativeSDK": true,
								"dimensions": [
									{
										"from": "name",
										"to": "dimension1"
									},
									{
										"from": "custom2",
										"to": "dimension2"
									}
								],
								"metrics": [
									{
										"from": "email",
										"to": "metric1"
									},
									{
										"from": "trait2",
										"to": "metric2"
									}
								],
								"resetCustomDimensionsOnPage": [
									{
										"resetCustomDimensionsOnPage": "abc"
									},
									{
										"resetCustomDimensionsOnPage": "xyz"
									}
								],
								"contentGroupings": [
									{
										"from": "plan",
										"to": "contentGroup1"
									},
									{
										"from": "prop2",
										"to": "contentGroup2"
									}
								]
							},
							"Enabled": true
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
						"error": "server side identify is not on",
						"statTags": {
							"destType": "GA",
							"errorCategory": "dataValidation",
							"errorType": "configuration",
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
		"name": "ga",
		"description": "Test 48",
		"feature": "processor",
		"module": "destination",
		"version": "v0",
		"input": {
			"request": {
				"body": [
					{
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
									"email": "test@rudderstack.com"
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
							"type": "screen",
							"messageId": "5e10d13a-bf9a-44bf-b884-43a9e591ea71",
							"originalTimestamp": "2019-10-14T11:15:18.299Z",
							"anonymousId": "00000000000000000000000000",
							"userId": "12345",
							"properties": {
								"name": "homescreen"
							},
							"integrations": {
								"All": true
							},
							"sentAt": "2019-10-14T11:15:53.296Z"
						},
						"destination": {
							"Config": {
								"trackingID": "UA-165994240-1",
								"doubleClick": true,
								"enhancedLinkAttribution": true,
								"classic": true,
								"ignoredReferrers": "",
								"serverClassic": false,
								"includeSearch": true,
								"trackCategorizedPages": true,
								"trackNamedPages": true,
								"sampleRate": "100",
								"siteSpeedSampleRate": "1",
								"setAllMappedProps": true,
								"enableServerSideIdentify": true,
								"serverSideIdentifyEventCategory": "cat1",
								"serverSideIdentifyEventAction": "action1",
								"anonymizeIp": true,
								"domain": "domain",
								"enhancedEcommerce": true,
								"nonInteraction": true,
								"optimize": "abc123",
								"sendUserId": true,
								"useGoogleAmpClientId": true,
								"web-useNativeSDK": true,
								"dimensions": [
									{
										"from": "name",
										"to": "dimension1"
									},
									{
										"from": "custom2",
										"to": "dimension2"
									}
								],
								"metrics": [
									{
										"from": "email",
										"to": "metric1"
									},
									{
										"from": "trait2",
										"to": "metric2"
									}
								],
								"resetCustomDimensionsOnPage": [
									{
										"resetCustomDimensionsOnPage": "abc"
									},
									{
										"resetCustomDimensionsOnPage": "xyz"
									}
								],
								"contentGroupings": [
									{
										"from": "plan",
										"to": "contentGroup1"
									},
									{
										"from": "prop2",
										"to": "contentGroup2"
									}
								]
							},
							"Enabled": true
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
							"endpoint": "https://www.google-analytics.com/collect",
							"headers": {},
							"params": {
								"cd1": "homescreen",
								"v": "1",
								"t": "screenview",
								"tid": "UA-165994240-1",
								"ds": "web",
								"an": "RudderLabs JavaScript SDK",
								"av": "1.0.0",
								"aiid": "com.rudderlabs.javascript",
								"npa": 1,
								"aip": 1,
								"cid": "00000000000000000000000000",
								"cd": "homescreen",
								"ua": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/77.0.3865.90 Safari/537.36",
								"uid": "12345",
								"ul": "en-US",
								"uip": "0.0.0.0",
								"qt": 124893881701
							},
							"body": {
								"JSON": {},
								"XML": {},
								"JSON_ARRAY": {},
								"FORM": {}
							},
							"files": {},
							"userId": "00000000000000000000000000"
						},
						"statusCode": 200
					}
				]
			}
		}
	},
	{
		"name": "ga",
		"description": "Test 49",
		"feature": "processor",
		"module": "destination",
		"version": "v0",
		"input": {
			"request": {
				"body": [
					{
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
									"email": "test@rudderstack.com"
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
							"type": "newtype",
							"messageId": "5e10d13a-bf9a-44bf-b884-43a9e591ea71",
							"originalTimestamp": "2019-10-14T11:15:18.299Z",
							"anonymousId": "00000000000000000000000000",
							"userId": "12345",
							"properties": {
								"name": "homescreen"
							},
							"integrations": {
								"All": true
							},
							"sentAt": "2019-10-14T11:15:53.296Z"
						},
						"destination": {
							"Config": {
								"trackingID": "UA-165994240-1",
								"doubleClick": true,
								"enhancedLinkAttribution": true,
								"classic": true,
								"ignoredReferrers": "",
								"serverClassic": false,
								"includeSearch": true,
								"trackCategorizedPages": true,
								"trackNamedPages": true,
								"sampleRate": "100",
								"siteSpeedSampleRate": "1",
								"setAllMappedProps": true,
								"enableServerSideIdentify": true,
								"serverSideIdentifyEventCategory": "cat1",
								"serverSideIdentifyEventAction": "action1",
								"anonymizeIp": true,
								"domain": "domain",
								"enhancedEcommerce": true,
								"nonInteraction": true,
								"optimize": "abc123",
								"sendUserId": true,
								"useGoogleAmpClientId": true,
								"web-useNativeSDK": true,
								"dimensions": [
									{
										"from": "name",
										"to": "dimension1"
									},
									{
										"from": "custom2",
										"to": "dimension2"
									}
								],
								"metrics": [
									{
										"from": "email",
										"to": "metric1"
									},
									{
										"from": "trait2",
										"to": "metric2"
									}
								],
								"resetCustomDimensionsOnPage": [
									{
										"resetCustomDimensionsOnPage": "abc"
									},
									{
										"resetCustomDimensionsOnPage": "xyz"
									}
								],
								"contentGroupings": [
									{
										"from": "plan",
										"to": "contentGroup1"
									},
									{
										"from": "prop2",
										"to": "contentGroup2"
									}
								]
							},
							"Enabled": true
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
						"error": "Message type newtype not supported",
						"statTags": {
							"destType": "GA",
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
		"name": "ga",
		"description": "Test 50",
		"feature": "processor",
		"module": "destination",
		"version": "v0",
		"input": {
			"request": {
				"body": [
					{
						"message": {
							"channel": "web",
							"context": {
								"traits": {
									"name": "Test"
								},
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
							"properties": {
								"plan": "standard plan",
								"name": "rudder test"
							},
							"type": "identify",
							"messageId": "84e26acc-56a5-4835-8233-591137fca468",
							"originalTimestamp": "2019-10-14T09:03:17.562Z",
							"userId": "12345",
							"integrations": {
								"All": true
							},
							"sentAt": "2019-10-14T09:03:22.563Z"
						},
						"destination": {
							"Config": {
								"trackingID": "UA-165994240-1",
								"doubleClick": true,
								"enhancedLinkAttribution": true,
								"classic": true,
								"ignoredReferrers": "",
								"serverClassic": false,
								"includeSearch": true,
								"trackCategorizedPages": true,
								"trackNamedPages": true,
								"sampleRate": "100",
								"siteSpeedSampleRate": "1",
								"setAllMappedProps": true,
								"enableServerSideIdentify": true,
								"serverSideIdentifyEventCategory": "name",
								"serverSideIdentifyEventAction": "action1",
								"anonymizeIp": true,
								"domain": "domain",
								"enhancedEcommerce": true,
								"nonInteraction": true,
								"optimize": "abc123",
								"sendUserId": true,
								"useGoogleAmpClientId": true,
								"web-useNativeSDK": true,
								"dimensions": [
									{
										"from": "name",
										"to": "dimension1"
									},
									{
										"from": "custom2",
										"to": "dimension2"
									}
								],
								"metrics": [
									{
										"from": "email",
										"to": "metric1"
									},
									{
										"from": "trait2",
										"to": "metric2"
									}
								],
								"resetCustomDimensionsOnPage": [
									{
										"resetCustomDimensionsOnPage": "abc"
									},
									{
										"resetCustomDimensionsOnPage": "xyz"
									}
								],
								"contentGroupings": [
									{
										"from": "plan",
										"to": "contentGroup1"
									},
									{
										"from": "prop2",
										"to": "contentGroup2"
									}
								]
							},
							"Enabled": true
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
							"userId": "12345",
							"method": "POST",
							"endpoint": "https://www.google-analytics.com/collect",
							"headers": {},
							"params": {
								"ea": "action1",
								"ec": "Test",
								"ni": 1,
								"cd1": "Test",
								"v": "1",
								"t": "event",
								"tid": "UA-165994240-1",
								"ds": "web",
								"an": "RudderLabs JavaScript SDK",
								"av": "1.0.0",
								"aiid": "com.rudderlabs.javascript",
								"npa": 1,
								"aip": 1,
								"ua": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/77.0.3865.90 Safari/537.36",
								"ul": "en-US",
								"uid": "12345",
								"cid": "827ccb0eea8a706c4c34a16891f84e7b",
								"uip": "0.0.0.0",
								"qt": 124901802438
							},
							"body": {
								"JSON": {},
								"XML": {},
								"JSON_ARRAY": {},
								"FORM": {}
							},
							"files": {}
						},
						"statusCode": 200
					}
				]
			}
		}
	},
	{
		"name": "ga",
		"description": "Test 51",
		"feature": "processor",
		"module": "destination",
		"version": "v0",
		"input": {
			"request": {
				"body": [
					{
						"message": {
							"channel": "web",
							"context": {
								"traits": {
									"name": "Test"
								},
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
							"properties": {
								"plan": "standard plan",
								"name": "rudder test"
							},
							"type": "identify",
							"messageId": "84e26acc-56a5-4835-8233-591137fca468",
							"originalTimestamp": "2019-10-14T09:03:17.562Z",
							"userId": "12345",
							"integrations": {
								"All": true
							},
							"sentAt": "2019-10-14T09:03:22.563Z"
						},
						"destination": {
							"Config": {
								"trackingID": "UA-165994240-1",
								"doubleClick": true,
								"enhancedLinkAttribution": true,
								"classic": true,
								"ignoredReferrers": "",
								"serverClassic": false,
								"includeSearch": true,
								"trackCategorizedPages": true,
								"trackNamedPages": true,
								"sampleRate": "100",
								"siteSpeedSampleRate": "1",
								"setAllMappedProps": true,
								"enableServerSideIdentify": true,
								"serverSideIdentifyEventCategory": "name",
								"serverSideIdentifyEventAction": "action1",
								"anonymizeIp": true,
								"disableMd5": true,
								"domain": "domain",
								"enhancedEcommerce": true,
								"nonInteraction": true,
								"optimize": "abc123",
								"sendUserId": true,
								"useGoogleAmpClientId": true,
								"web-useNativeSDK": true,
								"dimensions": [
									{
										"from": "name",
										"to": "dimension1"
									},
									{
										"from": "custom2",
										"to": "dimension2"
									}
								],
								"metrics": [
									{
										"from": "email",
										"to": "metric1"
									},
									{
										"from": "trait2",
										"to": "metric2"
									}
								],
								"resetCustomDimensionsOnPage": [
									{
										"resetCustomDimensionsOnPage": "abc"
									},
									{
										"resetCustomDimensionsOnPage": "xyz"
									}
								],
								"contentGroupings": [
									{
										"from": "plan",
										"to": "contentGroup1"
									},
									{
										"from": "prop2",
										"to": "contentGroup2"
									}
								]
							},
							"Enabled": true
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
							"userId": "12345",
							"method": "POST",
							"endpoint": "https://www.google-analytics.com/collect",
							"headers": {},
							"params": {
								"ea": "action1",
								"ec": "Test",
								"ni": 1,
								"cd1": "Test",
								"v": "1",
								"t": "event",
								"tid": "UA-165994240-1",
								"ds": "web",
								"an": "RudderLabs JavaScript SDK",
								"av": "1.0.0",
								"aiid": "com.rudderlabs.javascript",
								"npa": 1,
								"aip": 1,
								"ua": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/77.0.3865.90 Safari/537.36",
								"ul": "en-US",
								"uid": "12345",
								"uip": "0.0.0.0",
								"qt": 124901802438
							},
							"body": {
								"JSON": {},
								"XML": {},
								"JSON_ARRAY": {},
								"FORM": {}
							},
							"files": {}
						},
						"statusCode": 200
					}
				]
			}
		}
	},
	{
		"name": "ga",
		"description": "Test 52",
		"feature": "processor",
		"module": "destination",
		"version": "v0",
		"input": {
			"request": {
				"body": [
					{
						"message": {
							"channel": "web",
							"context": {
								"traits": {
									"name": "Test"
								},
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
							"properties": {
								"plan": "standard plan",
								"name": "rudder test"
							},
							"type": "identify",
							"messageId": "84e26acc-56a5-4835-8233-591137fca468",
							"originalTimestamp": "2019-10-14T09:03:17.562Z",
							"userId": "12345",
							"integrations": {
								"All": true,
								"GA": {
									"clientId": "clientId"
								},
								"Google Analytics": {
									"clientId": "clientId"
								}
							},
							"sentAt": "2019-10-14T09:03:22.563Z"
						},
						"destination": {
							"Config": {
								"trackingID": "UA-165994240-1",
								"doubleClick": true,
								"enhancedLinkAttribution": true,
								"classic": true,
								"ignoredReferrers": "",
								"serverClassic": false,
								"includeSearch": true,
								"trackCategorizedPages": true,
								"trackNamedPages": true,
								"sampleRate": "100",
								"siteSpeedSampleRate": "1",
								"setAllMappedProps": true,
								"enableServerSideIdentify": true,
								"serverSideIdentifyEventCategory": "name",
								"serverSideIdentifyEventAction": "action1",
								"anonymizeIp": true,
								"domain": "domain",
								"enhancedEcommerce": true,
								"nonInteraction": true,
								"optimize": "abc123",
								"sendUserId": true,
								"useGoogleAmpClientId": true,
								"web-useNativeSDK": true,
								"dimensions": [
									{
										"from": "name",
										"to": "dimension1"
									},
									{
										"from": "custom2",
										"to": "dimension2"
									}
								],
								"metrics": [
									{
										"from": "email",
										"to": "metric1"
									},
									{
										"from": "trait2",
										"to": "metric2"
									}
								],
								"resetCustomDimensionsOnPage": [
									{
										"resetCustomDimensionsOnPage": "abc"
									},
									{
										"resetCustomDimensionsOnPage": "xyz"
									}
								],
								"contentGroupings": [
									{
										"from": "plan",
										"to": "contentGroup1"
									},
									{
										"from": "prop2",
										"to": "contentGroup2"
									}
								]
							},
							"Enabled": true
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
							"userId": "12345",
							"method": "POST",
							"endpoint": "https://www.google-analytics.com/collect",
							"headers": {},
							"params": {
								"ea": "action1",
								"ec": "Test",
								"ni": 1,
								"cd1": "Test",
								"v": "1",
								"t": "event",
								"tid": "UA-165994240-1",
								"ds": "web",
								"an": "RudderLabs JavaScript SDK",
								"av": "1.0.0",
								"aiid": "com.rudderlabs.javascript",
								"npa": 1,
								"aip": 1,
								"ua": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/77.0.3865.90 Safari/537.36",
								"ul": "en-US",
								"uid": "12345",
								"cid": "clientId",
								"uip": "0.0.0.0",
								"qt": 124901802438
							},
							"body": {
								"JSON": {},
								"XML": {},
								"JSON_ARRAY": {},
								"FORM": {}
							},
							"files": {}
						},
						"statusCode": 200
					}
				]
			}
		}
	},
	{
		"name": "ga",
		"description": "Test 53",
		"feature": "processor",
		"module": "destination",
		"version": "v0",
		"input": {
			"request": {
				"body": [
					{
						"message": {
							"channel": "web",
							"context": {
								"externalId": [
									{
										"id": "externalClientId",
										"type": "gaExternalId"
									}
								],
								"traits": {
									"name": "Test"
								},
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
							"properties": {
								"plan": "standard plan",
								"name": "rudder test"
							},
							"type": "identify",
							"messageId": "84e26acc-56a5-4835-8233-591137fca468",
							"originalTimestamp": "2019-10-14T09:03:17.562Z",
							"userId": "12345",
							"integrations": {
								"All": true
							},
							"sentAt": "2019-10-14T09:03:22.563Z"
						},
						"destination": {
							"Config": {
								"trackingID": "UA-165994240-1",
								"doubleClick": true,
								"enhancedLinkAttribution": true,
								"classic": true,
								"ignoredReferrers": "",
								"serverClassic": false,
								"includeSearch": true,
								"trackCategorizedPages": true,
								"trackNamedPages": true,
								"sampleRate": "100",
								"siteSpeedSampleRate": "1",
								"setAllMappedProps": true,
								"enableServerSideIdentify": true,
								"serverSideIdentifyEventCategory": "name",
								"serverSideIdentifyEventAction": "action1",
								"anonymizeIp": true,
								"domain": "domain",
								"enhancedEcommerce": true,
								"nonInteraction": true,
								"optimize": "abc123",
								"sendUserId": true,
								"useGoogleAmpClientId": true,
								"web-useNativeSDK": true,
								"dimensions": [
									{
										"from": "name",
										"to": "dimension1"
									},
									{
										"from": "custom2",
										"to": "dimension2"
									}
								],
								"metrics": [
									{
										"from": "email",
										"to": "metric1"
									},
									{
										"from": "trait2",
										"to": "metric2"
									}
								],
								"resetCustomDimensionsOnPage": [
									{
										"resetCustomDimensionsOnPage": "abc"
									},
									{
										"resetCustomDimensionsOnPage": "xyz"
									}
								],
								"contentGroupings": [
									{
										"from": "plan",
										"to": "contentGroup1"
									},
									{
										"from": "prop2",
										"to": "contentGroup2"
									}
								]
							},
							"Enabled": true
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
							"userId": "12345",
							"method": "POST",
							"endpoint": "https://www.google-analytics.com/collect",
							"headers": {},
							"params": {
								"ea": "action1",
								"ec": "Test",
								"ni": 1,
								"cd1": "Test",
								"v": "1",
								"t": "event",
								"tid": "UA-165994240-1",
								"ds": "web",
								"an": "RudderLabs JavaScript SDK",
								"av": "1.0.0",
								"aiid": "com.rudderlabs.javascript",
								"npa": 1,
								"aip": 1,
								"ua": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/77.0.3865.90 Safari/537.36",
								"ul": "en-US",
								"uid": "12345",
								"cid": "externalClientId",
								"uip": "0.0.0.0",
								"qt": 124901802438
							},
							"body": {
								"JSON": {},
								"XML": {},
								"JSON_ARRAY": {},
								"FORM": {}
							},
							"files": {}
						},
						"statusCode": 200
					}
				]
			}
		}
	},
	{
		"name": "ga",
		"description": "Test 54",
		"feature": "processor",
		"module": "destination",
		"version": "v0",
		"input": {
			"request": {
				"body": [
					{
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
									"email": "test@rudderstack.com"
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
							"type": "track",
							"messageId": "ec5481b6-a926-4d2e-b293-0b3a77c4d3be",
							"originalTimestamp": "2019-10-14T11:15:18.300Z",
							"anonymousId": "00000000000000000000000000",
							"userId": "12345",
							"event": "product list viewed",
							"properties": {
								"nonInteraction": 0,
								"category": "cat 1",
								"list_id": "1234",
								"filters": {
									"a": "department",
									"b": "beauty"
								},
								"sorts": [
									{
										"type": "price",
										"value": "desc"
									}
								],
								"products": [
									{
										"product_id": "507f1f77bcf86cd799439011",
										"productDimension": "My Product Dimension",
										"productMetric": "My Product Metric",
										"position": 10
									},
									{
										"product_id": "507f1f77bcf86cdef799439011",
										"productDimension": "My Product Dimension1",
										"productMetric": "My Product Metric1",
										"position": -10
									}
								],
								"testDimension": true,
								"testMetric": true
							},
							"integrations": {
								"All": true
							},
							"sentAt": "2019-10-14T11:15:53.296Z"
						},
						"destination": {
							"Config": {
								"trackingID": "UA-165994240-1",
								"doubleClick": true,
								"enhancedLinkAttribution": true,
								"classic": true,
								"ignoredReferrers": "",
								"serverClassic": false,
								"includeSearch": true,
								"trackCategorizedPages": true,
								"trackNamedPages": true,
								"sampleRate": "100",
								"siteSpeedSampleRate": "1",
								"setAllMappedProps": true,
								"enableServerSideIdentify": true,
								"serverSideIdentifyEventCategory": "cat1",
								"serverSideIdentifyEventAction": "action1",
								"anonymizeIp": true,
								"domain": "domain",
								"enhancedEcommerce": true,
								"nonInteraction": true,
								"optimize": "abc123",
								"sendUserId": true,
								"useGoogleAmpClientId": true,
								"web-useNativeSDK": true,
								"dimensions": [
									{
										"from": "name",
										"to": "dimension1"
									},
									{
										"from": "custom2",
										"to": "dimension2"
									}
								],
								"metrics": [
									{
										"from": "email",
										"to": "metric1"
									},
									{
										"from": "trait2",
										"to": "metric2"
									}
								],
								"resetCustomDimensionsOnPage": [
									{
										"resetCustomDimensionsOnPage": "abc"
									},
									{
										"resetCustomDimensionsOnPage": "xyz"
									}
								],
								"contentGroupings": [
									{
										"from": "plan",
										"to": "content1"
									},
									{
										"from": "prop2",
										"to": "content2"
									}
								]
							},
							"Enabled": true
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
							"endpoint": "https://www.google-analytics.com/collect",
							"headers": {},
							"params": {
								"ni": 0,
								"ea": "product list viewed",
								"ec": "cat 1",
								"pa": "detail",
								"il1pi1id": "507f1f77bcf86cd799439011",
								"il1pi1va": "::price:desc",
								"il1pi1ps": 10,
								"il1pi1qt": 1,
								"il1pi2id": "507f1f77bcf86cdef799439011",
								"il1pi2va": "::price:desc",
								"il1pi2ps": -10,
								"il1pi2qt": 1,
								"el": "event",
								"v": "1",
								"t": "event",
								"tid": "UA-165994240-1",
								"ds": "web",
								"npa": 1,
								"aip": 1,
								"ua": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/77.0.3865.90 Safari/537.36",
								"ul": "en-US",
								"an": "RudderLabs JavaScript SDK",
								"av": "1.0.0",
								"aiid": "com.rudderlabs.javascript",
								"il1nm": "1234",
								"uid": "12345",
								"cid": "00000000000000000000000000",
								"qt": 124893881700
							},
							"body": {
								"JSON": {},
								"XML": {},
								"JSON_ARRAY": {},
								"FORM": {}
							},
							"files": {},
							"userId": "00000000000000000000000000"
						},
						"statusCode": 200
					}
				]
			}
		}
	},
	{
		"name": "ga",
		"description": "Test 55",
		"feature": "processor",
		"module": "destination",
		"version": "v0",
		"input": {
			"request": {
				"body": [
					{
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
									"email": "test@rudderstack.com"
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
							"type": "page",
							"messageId": "5e10d13a-bf9a-44bf-b884-43a9e591ea71",
							"originalTimestamp": "2019-10-14T11:15:18.299Z",
							"anonymousId": "00000000000000000000000000",
							"userId": "12345",
							"properties": {
								"referrer": "https://google.com/answer/7554821?zippy=%2Cfields-in-event-snippets-for-counter-tags%2Cstep-add-the-global-snippet-to-every-page-of-your-site%2Cstep-add-the-event-snippet-to-pages-with-events-youre-tracking%2Cfields-in-the-global-snippet%2Cfields-in-the-event-snippet---overview%2Cfields-in-all-event-snippets%2Cexample-event-snippet-for-counter---standard-activities%2Cexample-event-snippet-for-counter---unique-activities%2Cexample-event-snippet-for-counter---per-session-activities%2Cfields-in-event-snippets-for-sales-tags%2Cexample-event-snippet-for-sales---transaction-activities%2Cexample-event-snippet-for-sales---items-sold-activities%2Ccustom-fields%2Cnoscript-section-of-event-snippets%2Cdo-i-need-to-set-up-cache-busting-with-the-global-site-tag%2Cwhy-is-the-global-site-tag-placed-in-the-head-when-iframe-and-image-tags-were-placed-in-the-body-of-my-site%2Cwhere-can-i-learn-more-about-the-global-site-tag%2Cstep-add-the-event-snippet-to-pages-with-events-youre-tracking%2Cfields-in-the-global-snippet%2Cfields-in-the-event-snippet---overview%2Cfields-in-all-event-snippets%2Cexample-event-snippet-for-counter---standard-activities%2Cexample-event-snippet-for-counter---unique-activities%2Cexample-event-snippet-for-counter---per-session-activities%2Cfields-in-event-snippets-for-sales-tags%2Cexample-event-snippet-for-sales---transaction-activities%2Cexample-event-snippet-for-sales---items-sold-activities%2Ccustom-fields%2Cnoscript-section-of-event-snippets%2Cdo-i-need-to-set-up-cache-busting-with-the-global-site-tag%2Cwhy-is-the-global-site-tag-placed-in-the-head-when-iframe-and-image-tags-were-placed-in-the-body-of-my-site%2Cwhere-can-i-learn-more-about-the-global-site-tag%2Cstep-add-the-event-snippet-to-pages-with-events-youre-tracking%2Cfields-in-the-global-snippet%2Cfields-in-the-event-snippet---overview%2Cfields-in-all-event-snippets%2Cexample-event-snippet-for-counter---standard-activities%2Cexample-event-snippet-for-counter---unique-activities%2Cexample-event-snippet-for-counter---per-session-activities%2Cfields-in-event-snippets-for-sales-tags%2Cexample-event-snippet-for-sales---transaction-activities%2Cexample-event-snippet-for-sales---items-sold-activities%2Ccustom-fields%2Cnoscript-section-of-event-snippets%2Cdo-i-need-to-set-up-cache-busting-with-the-global-site-tag%2Cwhy-is-the-global-site-tag-placed-in-the-head-when-iframe-and-image-tags-were-placed-in-the-body-of-my-site%2Cwhere-can-i-learn-more-about-the-global-site-tag%2Cwhy-is-the-global-site-tag-placed-in-the-head-when-iframe-and-image-tags-were-placed-in-the-body-of-my-site%2Cwhere-can-i-learn-more-about-the-global-site-tag%2Cwhy-is-the-global-site-tag-placed-in-the-head-when-iframe-and-image-tags-were-placed-in-the-body-of-my-site%2Cwhere-can-i-learn-more-about-the-global-site-tag%2Cwhy-is-the-global-site-tag-placed-in-the-head-when-iframe-and-image-tags-were-placed-in-the-body-of-my-site%2Cwhere-can-i-learn-more-about-the-global-site-tag%2Cwhy-is-the-global-site-tag-placed-in-the-head-when-iframe-and-image-tags-were-placed-in-the-body-of-my-site%2Cwhere-can-i-learn-more-about-the-global-site-tag%2Cwhy-is-the-global-site-tag-placed-in-the-head-when-iframe-and-image-tags-were-placed-in-the-body-of-my-site%2Cwhere-can-i-learn-more-about-tg%2Cwhy-is-the-global-site-tag-placed-in-the-head-when-iframe-and-image-tags-were-placed-in-the-body-of-my-site%2Cwhere-can-i-learns-more-about-the-global-site-tag%2Cwhy-is-the-globalthe-head-when-iframe-and-image-tags-were-placed-in-the-body-placed-of-my-site%2Cwhere-can-i-learn-g2Cwhy-is-the-global-site-tag-placed-in-the-head-when-iframe-and-and-in-the-body-of-my-site%2Cwhere-can-i-learn-more-about-the-global-site-tag%2Cwhy-n-the-head-when-iframe-and-image-tags-were-placed-in-the-body-of-my-site%2Cwhere-can-i-learn-more-about-the-global-site-tag",
								"search": "",
								"title": "a",
								"url": "https://support.google.com/campaignmanager/answer/7554821?zippy=%2Cfields-in-event-snippets-for-counter-tags%2Cstep-add-the-global-snippet-to-every-page-of-your-site%2Cstep-add-the-event-snippet-to-pages-with-events-youre-tracking%2Cfields-in-the-global-snippet%2Cfields-in-the-event-snippet---overview%2Cfields-in-all-event-snippets%2Cexample-event-snippet-for-counter---standard-activities%2Cexample-event-snippet-for-counter---unique-activities%2Cexample-event-snippet-for-counter---per-session-activities%2Cfields-in-event-snippets-for-sales-tags%2Cexample-event-snippet-for-sales---transaction-activities%2Cexample-event-snippet-for-sales---items-sold-activities%2Ccustom-fields%2Cnoscript-section-of-event-snippets%2Cdo-i-need-to-set-up-cache-busting-with-the-global-site-tag%2Cwhy-is-the-global-site-tag-placed-in-the-head-when-iframe-and-image-tags-were-placed-in-the-body-of-my-site%2Cwhere-can-i-learn-more-about-the-global-site-tag%2Cstep-add-the-event-snippet-to-pages-with-events-youre-tracking%2Cfields-in-the-global-snippet%2Cfields-in-the-event-snippet---overview%2Cfields-in-all-event-snippets%2Cexample-event-snippet-for-counter---standard-activities%2Cexample-event-snippet-for-counter---unique-activities%2Cexample-event-snippet-for-counter---per-session-activities%2Cfields-in-event-snippets-for-sales-tags%2Cexample-event-snippet-for-sales---transaction-activities%2Cexample-event-snippet-for-sales---items-sold-activities%2Ccustom-fields%2Cnoscript-section-of-event-snippets%2Cdo-i-need-to-set-up-cache-busting-with-the-global-site-tag%2Cwhy-is-the-global-site-tag-placed-in-the-head-when-iframe-and-image-tags-were-placed-in-the-body-of-my-site%2Cwhere-can-i-learn-more-about-the-global-site-tag%2Cstep-add-the-event-snippet-to-pages-with-events-youre-tracking%2Cfields-in-the-global-snippet%2Cfields-in-the-event-snippet---overview%2Cfields-in-all-event-snippets%2Cexample-event-snippet-for-counter---standard-activities%2Cexample-event-snippet-for-counter---unique-activities%2Cexample-event-snippet-for-counter---per-session-activities%2Cfields-in-event-snippets-for-sales-tags%2Cexample-event-snippet-for-sales---transaction-activities%2Cexample-event-snippet-for-sales---items-sold-activities%2Ccustom-fields%2Cnoscript-section-of-event-snippets%2Cdo-i-need-to-set-up-cache-busting-with-the-global-site-tag%2Cwhy-is-the-global-site-tag-placed-in-the-head-when-iframe-and-image-tags-were-placed-in-the-body-of-my-site%2Cwhere-can-i-learn-more-about-the-global-site-tag%2Cwhy-is-the-global-site-tag-placed-in-the-head-when-iframe-and-image-tags-were-placed-in-the-body-of-my-site%2Cwhere-can-i-learn-more-about-the-global-site-tag%2Cwhy-is-the-global-site-tag-placed-in-the-head-when-iframe-and-image-tags-were-placed-in-the-body-of-my-site%2Cwhere-can-i-learn-more-about-the-global-site-tag%2Cwhy-is-the-global-site-tag-placed-in-the-head-when-iframe-and-image-tags-were-placed-in-the-body-of-my-site%2Cwhere-can-i-learn-more-about-the-global-site-tag%2Cwhy-is-the-global-site-tag-placed-in-the-head-when-iframe-and-image-tags-were-placed-in-the-body-of-my-site%2Cwhere-can-i-learn-more-about-the-global-site-tag%2Cwhy-is-the-global-site-tag-placed-in-the-head-when-iframe-and-image-tags-were-placed-in-the-body-of-my-site%2Cwhere-can-i-learn-more-about-the-global-site-tag%2Cwhy-is-the-global-site-tag-placed-in-the-head-lakjsdlkfjalsdkfjis-the-global-site-tag-placed-in-the-head-lakjsdlkfjalsdkfjis-the-global-site-tag-placed-in-the-head-lakjsdlkfjalsdkfjakljshdlfkjahsldkfjahlskdfjhaklsjdfhalksjdhflakjshdflakjsdhfklasjhdflaksjhdflaksjdfhlakjshdflakjsdhfklasjhdflaksjhdflaksjdfhlakjshdflakjsdhfklasjhdflaksjhdflaksjdfhljkkwoipqpweoirpoqiwerpoqi1111111111111"
							},
							"integrations": {
								"All": true
							},
							"name": "ApplicationLoaded",
							"sentAt": "2019-10-14T11:15:53.296Z"
						},
						"destination": {
							"Config": {
								"anonymizeIp": false,
								"eventDeliveryTS": 1657516676962,
								"eventFilteringOption": "disable",
								"trackingID": "UA-165994240-1"
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
						"output": {
							"version": "1",
							"type": "REST",
							"method": "POST",
							"endpoint": "https://www.google-analytics.com/collect",
							"headers": {},
							"params": {
								"dp": "%2Fcampaignmanager%2Fanswer%2F7554821",
								"dl": "https://support.google.com/campaignmanager/answer/7554821?zippy=%2Cfields-in-event-snippets-for-counter-tags%2Cstep-add-the-global-snippet-to-every-page-of-your-site%2Cstep-add-the-event-snippet-to-pages-with-events-youre-tracking%2Cfields-in-the-global-snippet%2Cfields-in-the-event-snippet---overview%2Cfields-in-all-event-snippets%2Cexample-event-snippet-for-counter---standard-activities%2Cexample-event-snippet-for-counter---unique-activities%2Cexample-event-snippet-for-counter---per-session-activities%2Cfields-in-event-snippets-for-sales-tags%2Cexample-event-snippet-for-sales---transaction-activities%2Cexample-event-snippet-for-sales---items-sold-activities%2Ccustom-fields%2Cnoscript-section-of-event-snippets%2Cdo-i-need-to-set-up-cache-busting-with-the-global-site-tag%2Cwhy-is-the-global-site-tag-placed-in-the-head-when-iframe-and-image-tags-were-placed-in-the-body-of-my-site%2Cwhere-can-i-learn-more-about-the-global-site-tag%2Cstep-add-the-event-snippet-to-pages-with-events-youre-tracking%2Cfields-in-the-global-snippet%2Cfields-in-the-event-snippet---overview%2Cfields-in-all-event-snippets%2Cexample-event-snippet-for-counter---standard-activities%2Cexample-event-snippet-for-counter---unique-activities%2Cexample-event-snippet-for-counter---per-session-activities%2Cfields-in-event-snippets-for-sales-tags%2Cexample-event-snippet-for-sales---transaction-activities%2Cexample-event-snippet-for-sales---items-sold-activities%2Ccustom-fields%2Cnoscript-section-of-event-snippets%2Cdo-i-need-to-set-up-cache-busting-with-the-global-site-tag%2Cwhy-is-the-global-site-tag-placed-in-the-head-when-iframe-and-image-tags-were-placed-in-the-body-of-my-site%2Cwhere-can-i-learn-more-about-the-global-site-tag%2Cstep-add-the-event-snippet-to-pages-with-events-youre-tracking%2Cfields-in-the-global-snippet%2Cfields-in-the-event-snippet---overview%2Cfields-in-all-event-snippets%2Cexample-event-snippet-for-counter---standard-activities%2Cexample-event-snippet-for-counter---unique-activities%2Cexample-event-snippet-for-counter---per-session-activities%2Cfields-in-event-snippets-for-sales-tags%2Cexample-event-snippet-for-sales---transaction-activities%2Cexample-event-snippet-for-sales---items-sold-activities%2Ccustom-fields%2Cnoscript-section-of-event-snippets%2Cdo-i-need-to-set-up-cache-busting-with-the-global-site-tag%2Cwhy-is-the-global-site-tag-placed-in-the-head-when-iframe-and-image-tags-were-placed-in-the-body-of-my-site%2Cwhere-can-i-learn-more-about-the-global-site-tag%2Cwhy-is-the-global-site-tag-placed-in-the-head-when-iframe-and-image-tags-were-placed-in-the-body-of-my-site%2Cwhere-can-i-learn-more-about-the-global-site-tag%2Cwhy-is-the-global-site-tag-placed-in-the-head-when-iframe-and-image-tags-were-placed-in-the-body-of-my-site%2Cwhere-can-i-learn-more-about-the-global-site-tag%2Cwhy-is-the-global-site-tag-placed-in-the-head-when-iframe-and-image-tags-were-placed-in-the-body-of-my-site%2Cwhere-can-i-learn-more-about-the-global-site-tag%2Cwhy-is-the-global-site-tag-placed-in-the-head-when-iframe-and-image-tags-were-placed-in-the-body-of-my-site%2Cwhere-can-i-learn-more-about-the-global-site-tag%2Cwhy-is-the-global-site-tag-placed-in-the-head-when-iframe-and-image-tags-were-placed-in-the-body-of-my-site%2Cwhere-can-i-learn-more-about-the-global-site-tag%2Cwhy-is-the-global-site-tag-placed-in-the-head-lakjsdlkfjalsdkfjis-the-global-site-tag-placed-in-the-head-lakjsdlkfjalsdkfjis-the-global-site-tag-placed-in-the-head-lakjsdlkfjalsdkfjakljshdlfkjahsldkfjahlskdfjhaklsjdfhalksjdhflakjshdflakjsdhfklasjhdflaksjhdflaksjdfhlakjshdflakjsdhfklasjhdflaksjhdflaksjdfhlakjshdflakjsdhfklasjhdflaksjhdflaksjdfhljkkwoipqpweoirpoqiwerpoqi1111111111111",
								"dh": "support.google.com",
								"dt": "a",
								"dr": "https://google.com/answer/7554821?zippy=%2Cfields-in-event-snippets-for-counter-tags%2Cstep-add-the-global-snippet-to-every-page-of-your-site%2Cstep-add-the-event-snippet-to-pages-with-events-youre-tracking%2Cfields-in-the-global-snippet%2Cfields-in-the-event-snippet---overview%2Cfields-in-all-event-snippets%2Cexample-event-snippet-for-counter---standard-activities%2Cexample-event-snippet-for-counter---unique-activities%2Cexample-event-snippet-for-counter---per-session-activities%2Cfields-in-event-snippets-for-sales-tags%2Cexample-event-snippet-for-sales---transaction-activities%2Cexample-event-snippet-for-sales---items-sold-activities%2Ccustom-fields%2Cnoscript-section-of-event-snippets%2Cdo-i-need-to-set-up-cache-busting-with-the-global-site-tag%2Cwhy-is-the-global-site-tag-placed-in-the-head-when-iframe-and-image-tags-were-placed-in-the-body-of-my-site%2Cwhere-can-i-learn-more-about-the-global-site-tag%2Cstep-add-the-event-snippet-to-pages-with-events-youre-tracking%2Cfields-in-the-global-snippet%2Cfields-in-the-event-snippet---overview%2Cfields-in-all-event-snippets%2Cexample-event-snippet-for-counter---standard-activities%2Cexample-event-snippet-for-counter---unique-activities%2Cexample-event-snippet-for-counter---per-session-activities%2Cfields-in-event-snippets-for-sales-tags%2Cexample-event-snippet-for-sales---transaction-activities%2Cexample-event-snippet-for-sales---items-sold-activities%2Ccustom-fields%2Cnoscript-section-of-event-snippets%2Cdo-i-need-to-set-up-cache-busting-with-the-global-site-tag%2Cwhy-is-the-global-site-tag-placed-in-the-head-when-iframe-and-image-tags-were-placed-in-the-body-of-my-site%2Cwhere-can-i-learn-more-about-the-global-site-tag%2Cstep-add-the-event-snippet-to-pages-with-events-youre-tracking%2Cfields-in-the-global-snippet%2Cfields-in-the-event-snippet---overview%2Cfields-in-all-event-snippets%2Cexample-event-snippet-for-counter---standard-activities%2Cexample-event-snippet-for-counter---unique-activities%2Cexample-event-snippet-for-counter---per-session-activities%2Cfields-in-event-snippets-for-sales-tags%2Cexample-event-snippet-for-sales---transaction-activities%2Cexample-event-snippet-for-sales---items-sold-activities%2Ccustom-fields%2Cnoscript-section-of-event-snippets%2Cdo-i-need-to-set-up-cache-busting-with-the-global-site-tag%2Cwhy-is-the-global-site-tag-placed-in-the-head-when-iframe-and-image-tags-were-placed-in-the-body-of-my-site%2Cwhere-can-i-learn-more-about-the-global-site-tag%2Cwhy-is-the-global-site-tag-placed-in-the-head-when-iframe-and-image-tags-were-placed-in-the-body-of-my-site%2Cwhere-can-i-learn-more-about-the-global-site-tag%2Cwhy-is-the-global-site-tag-placed-in-the-head-when-iframe-and-image-tags-were-placed-in-the-body-of-my-site%2Cwhere-can-i-learn-more-about-the-global-site-tag%2Cwhy-is-the-global-site-tag-placed-in-the-head-when-iframe-and-image-tags-were-placed-in-the-body-of-my-site%2Cwhere-can-i-learn-more-about-the-global-site-tag%2Cwhy-is-the-global-site-tag-placed-in-the-head-when-iframe-and-image-tags-were-placed-in-the-body-of-my-site%2Cwhere-can-i-learn-more-about-the-global-site-tag%2Cwhy-is-the-global-site-tag-placed-in-the-head-when-iframe-and-image-tags-were-placed-in-the-body-of-my-site%2Cwhere-can-i-learn-more-about-tg%2Cwhy-is-the-global-site-tag-placed-in-the-head-when-iframe-and-image-tags-were-placed-in-the-body-of-my-site%2Cwhere-can-i-learns-more-about-the-global-site-tag%2Cwhy-is-the-globalthe-head-when-iframe-and-image-tags-were-placed-in-the-body-placed-of-my-site%2Cwhere-can-i-learn-g2Cwhy-is-the-global-site-tag-placed-in-the-head-when-iframe-and-and-in-the-body-of-my-site%2Cwhere-can-i-learn-more-about-the-global-site-tag%2Cwhy-n-the-head-when-iframe-and-image-tags-were-placed-in-the-body-of-my-site%2Cwhere-can-i-learn-more-about-the-global-site-tag",
								"v": "1",
								"t": "pageview",
								"tid": "UA-165994240-1",
								"ds": "web",
								"ua": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/77.0.3865.90 Safari/537.36",
								"ul": "en-US",
								"an": "RudderLabs JavaScript SDK",
								"av": "1.0.0",
								"aiid": "com.rudderlabs.javascript",
								"cid": "00000000000000000000000000",
								"uip": "0.0.0.0",
								"qt": 124893881701
							},
							"body": {
								"JSON": {},
								"JSON_ARRAY": {},
								"XML": {},
								"FORM": {}
							},
							"files": {},
							"userId": "00000000000000000000000000"
						},
						"statusCode": 200
					}
				]
			}
		}
	}
].map((d) => ({ ...d, mockFns }))