export const data = [
	{
		"name": "gainsight_px",
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
								"apiKey": "sample-api-key",
								"productTagKey": "AP-XABC-123",
								"accountAttributeMap": [
									{
										"from": "",
										"to": ""
									}
								],
								"userAttributeMap": [
									{
										"from": "",
										"to": ""
									}
								],
								"globalContextMap": [
									{
										"from": "projectId",
										"to": "p-123"
									},
									{
										"from": "tag",
										"to": "sample-category-tag"
									}
								]
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
							"userId": "sample-user-id",
							"messageId": "84e26acc-56a5-4835-8233-591137fca468",
							"session_id": "3049dc4c-5a95-4ccd-a3e7-d74a7e411f22",
							"originalTimestamp": "2019-10-14T09:03:17.562Z",
							"anonymousId": "sample-anon-id",
							"type": "track",
							"event": "Product Added",
							"properties": {
								"product_id": "123",
								"sku": "F16",
								"category": "Games",
								"name": "Game",
								"brand": "Gamepro",
								"variant": "111",
								"price": 13.49,
								"quantity": 11,
								"coupon": "DISC21",
								"position": 1,
								"url": "https://www.website.com/product/path",
								"image_url": "https://www.website.com/product/path.png"
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
							"body": {
								"XML": {},
								"JSON_ARRAY": {},
								"FORM": {},
								"JSON": {
									"attributes": {
										"product_id": "123",
										"sku": "F16",
										"category": "Games",
										"name": "Game",
										"brand": "Gamepro",
										"variant": "111",
										"price": 13.49,
										"quantity": 11,
										"coupon": "DISC21",
										"position": 1,
										"url": "https://www.website.com/product/path",
										"image_url": "https://www.website.com/product/path.png"
									},
									"propertyKey": "AP-XABC-123",
									"userType": "USER",
									"identifyId": "sample-user-id",
									"date": 1571043797562,
									"eventName": "Product Added",
									"globalContext": {
										"projectId": "p-123",
										"tag": "sample-category-tag"
									}
								}
							},
							"type": "REST",
							"files": {},
							"method": "POST",
							"params": {},
							"headers": {
								"X-APTRINSIC-API-KEY": "sample-api-key",
								"Content-Type": "application/json"
							},
							"version": "1",
							"endpoint": "https://api.aptrinsic.com/v1/events/custom",
							"userId": ""
						},
						"statusCode": 200
					}
				]
			}
		}
	},
	{
		"name": "gainsight_px",
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
								"apiKey": "sample-api-key",
								"productTagKey": "AP-XABC-123",
								"accountAttributeMap": [
									{
										"from": "",
										"to": ""
									}
								],
								"userAttributeMap": [
									{
										"from": "",
										"to": ""
									}
								],
								"globalContextMap": [
									{
										"from": "projectId",
										"to": "p-123"
									},
									{
										"from": "tag",
										"to": "sample-category-tag"
									}
								]
							}
						},
						"message": {
							"channel": "web",
							"context": {
								"os": {
									"name": "",
									"version": ""
								},
								"app": {
									"name": "RudderLabs JavaScript SDK",
									"version": "1.27.0",
									"namespace": "com.rudderlabs.javascript"
								},
								"page": {
									"url": "http://127.0.0.1:8887/",
									"path": "/",
									"title": "RudderStack in 5",
									"search": "",
									"tab_url": "http://127.0.0.1:8887/",
									"referrer": "$direct",
									"initial_referrer": "$direct",
									"referring_domain": "",
									"initial_referring_domain": ""
								},
								"locale": "en-US",
								"screen": {
									"width": 1512,
									"height": 982,
									"density": 2,
									"innerWidth": 774,
									"innerHeight": 774
								},
								"library": {
									"name": "RudderLabs JavaScript SDK",
									"version": "1.27.0"
								},
								"campaign": {},
								"sessionId": 1679967592314,
								"userAgent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/110.0.0.0 Safari/537.36",
								"properties": {
									"email": "84@84.com",
									"price": "56.0",
									"quantity": "5"
								}
							},
							"userId": "sample-user-id",
							"messageId": "84e26acc-56a5-4835-8233-591137fca468",
							"session_id": "3049dc4c-5a95-4ccd-a3e7-d74a7e411f22",
							"originalTimestamp": "2019-10-14T09:03:17.562Z",
							"anonymousId": "sample-anon-id",
							"type": "track",
							"event": "Marketing - Plan Change Events",
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
							"body": {
								"XML": {},
								"JSON_ARRAY": {},
								"FORM": {},
								"JSON": {
									"attributes": {},
									"url": "http://127.0.0.1:8887/",
									"propertyKey": "AP-XABC-123",
									"userType": "USER",
									"identifyId": "sample-user-id",
									"referrer": "$direct",
									"date": 1571043797562,
									"sessionId": 1679967592314,
									"eventName": "Marketing - Plan Change Events",
									"globalContext": {
										"projectId": "p-123",
										"tag": "sample-category-tag"
									}
								}
							},
							"type": "REST",
							"files": {},
							"method": "POST",
							"params": {},
							"headers": {
								"X-APTRINSIC-API-KEY": "sample-api-key",
								"Content-Type": "application/json"
							},
							"version": "1",
							"endpoint": "https://api.aptrinsic.com/v1/events/custom",
							"userId": ""
						},
						"statusCode": 200
					}
				]
			}
		}
	},
	{
		"name": "gainsight_px",
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
								"apiKey": "sample-api-key",
								"productTagKey": "AP-XABC-123",
								"accountAttributeMap": [
									{
										"from": "",
										"to": ""
									}
								],
								"userAttributeMap": [
									{
										"from": "",
										"to": ""
									}
								],
								"globalContextMap": [
									{
										"from": "projectId",
										"to": "p-123"
									},
									{
										"from": "tag",
										"to": "sample-category-tag"
									}
								]
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
							"userId": "sample-user-id",
							"messageId": "84e26acc-56a5-4835-8233-591137fca468",
							"session_id": "3049dc4c-5a95-4ccd-a3e7-d74a7e411f22",
							"originalTimestamp": "2019-10-14T09:03:17.562Z",
							"anonymousId": "sample-anon-id",
							"type": "track",
							"event": "Track Me",
							"properties": {
								"description": "Sample Track call",
								"globalContext": {
									"testOverride": "some-value"
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
							"body": {
								"XML": {},
								"JSON_ARRAY": {},
								"FORM": {},
								"JSON": {
									"attributes": {
										"description": "Sample Track call"
									},
									"propertyKey": "AP-XABC-123",
									"userType": "USER",
									"identifyId": "sample-user-id",
									"date": 1571043797562,
									"eventName": "Track Me",
									"globalContext": {
										"testOverride": "some-value"
									}
								}
							},
							"type": "REST",
							"files": {},
							"method": "POST",
							"params": {},
							"headers": {
								"X-APTRINSIC-API-KEY": "sample-api-key",
								"Content-Type": "application/json"
							},
							"version": "1",
							"endpoint": "https://api.aptrinsic.com/v1/events/custom",
							"userId": ""
						},
						"statusCode": 200
					}
				]
			}
		}
	},
	{
		"name": "gainsight_px",
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
								"apiKey": "sample-api-key",
								"productTagKey": "AP-XABC-123",
								"accountAttributeMap": [
									{
										"from": "",
										"to": ""
									}
								],
								"userAttributeMap": [
									{
										"from": "hobbyCustomField",
										"to": "hobby"
									}
								],
								"globalContextMap": []
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
							"userId": "sample-user-id",
							"anonymousId": "sample-anon-id",
							"type": "identify",
							"traits": {
								"type": "USER",
								"gender": "MALE",
								"email": "user@email.com",
								"firstName": "Sample",
								"lastName": "User",
								"signUpDate": 1624431528295,
								"title": "engineer",
								"countryName": "USA",
								"countryCode": "US",
								"city": "New York",
								"hobbyCustomField": "Sample Hobby"
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
							"body": {
								"XML": {},
								"JSON_ARRAY": {},
								"FORM": {},
								"JSON": {
									"type": "USER",
									"gender": "MALE",
									"email": "user@email.com",
									"firstName": "Sample",
									"lastName": "User",
									"signUpDate": 1624431528295,
									"createDate": 1571043797562,
									"title": "engineer",
									"propertyKeys": [
										"AP-XABC-123"
									],
									"location": {
										"countryName": "USA",
										"countryCode": "US",
										"city": "New York"
									},
									"customAttributes": {
										"hobby": "Sample Hobby"
									}
								}
							},
							"type": "REST",
							"files": {},
							"method": "PUT",
							"params": {},
							"headers": {
								"X-APTRINSIC-API-KEY": "sample-api-key",
								"Content-Type": "application/json"
							},
							"version": "1",
							"endpoint": "https://api.aptrinsic.com/v1/users/sample-user-id",
							"userId": ""
						},
						"statusCode": 200
					}
				]
			}
		}
	},
	{
		"name": "gainsight_px",
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
								"apiKey": "sample-api-key",
								"productTagKey": "AP-XABC-123",
								"accountAttributeMap": [
									{
										"from": "",
										"to": ""
									}
								],
								"userAttributeMap": [],
								"globalContextMap": []
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
								},
								"traits": {
									"type": "USER",
									"gender": "MALE",
									"email": "user@email.com",
									"firstName": "Sample",
									"lastName": "User",
									"medium": null
								}
							},
							"messageId": "84e26acc-56a5-4835-8233-591137fca468",
							"session_id": "3049dc4c-5a95-4ccd-a3e7-d74a7e411f22",
							"originalTimestamp": "2019-10-14T09:03:17.562Z",
							"anonymousId": "sample-anon-id",
							"userId": "sample-user-id",
							"groupId": "ecorp-id",
							"type": "group",
							"traits": {
								"name": "ECorp",
								"industry": "software",
								"numberOfEmployees": 400,
								"website": "www.ecorp.com",
								"plan": "premium"
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
							"body": {
								"XML": {},
								"JSON_ARRAY": {},
								"FORM": {},
								"JSON": {
									"accountId": "ecorp-id"
								}
							},
							"type": "REST",
							"files": {},
							"method": "PUT",
							"params": {},
							"headers": {
								"X-APTRINSIC-API-KEY": "sample-api-key",
								"Content-Type": "application/json"
							},
							"version": "1",
							"endpoint": "https://api.aptrinsic.com/v1/users/sample-user-id",
							"userId": ""
						},
						"statusCode": 200
					}
				]
			}
		}
	},
	{
		"name": "gainsight_px",
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
								"apiKey": "sample-api-key",
								"productTagKey": "AP-XABC-123",
								"accountAttributeMap": [
									{
										"from": "",
										"to": ""
									}
								],
								"userAttributeMap": [
									{
										"from": "hobbyCustomField",
										"to": "hobby"
									}
								],
								"globalContextMap": []
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
							"type": "identify",
							"traits": {
								"type": "USER",
								"gender": "MALE",
								"email": "user@email.com",
								"firstName": "Sample",
								"lastName": "User",
								"signUpDate": 1624431528295,
								"title": "engineer",
								"countryName": "USA",
								"countryCode": "US",
								"city": "New York",
								"hobbyCustomField": "Sample Hobby"
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
						"error": "userId or anonymousId is required for identify",
						"statTags": {
							"destType": "GAINSIGHT_PX",
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
		"name": "gainsight_px",
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
								"apiKey": "sample-api-key",
								"productTagKey": "AP-XABC-123",
								"accountAttributeMap": [
									{
										"from": "",
										"to": ""
									}
								],
								"userAttributeMap": [
									{
										"from": "",
										"to": ""
									}
								],
								"globalContextMap": [
									{
										"from": "projectId",
										"to": "p-123"
									},
									{
										"from": "tag",
										"to": "sample-category-tag"
									}
								]
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
							"event": "Product Added",
							"properties": {
								"product_id": "123",
								"sku": "F16",
								"category": "Games",
								"name": "Game",
								"brand": "Gamepro",
								"variant": "111",
								"price": 13.49,
								"quantity": 11,
								"coupon": "DISC21",
								"position": 1,
								"url": "https://www.website.com/product/path",
								"image_url": "https://www.website.com/product/path.png"
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
						"error": "Missing required value from \"userId\"",
						"statTags": {
							"destType": "GAINSIGHT_PX",
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
		"name": "gainsight_px",
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
								"apiKey": "sample-api-key",
								"productTagKey": "AP-XABC-123",
								"accountAttributeMap": [
									{
										"from": "",
										"to": ""
									}
								],
								"userAttributeMap": [],
								"globalContextMap": []
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
								},
								"traits": {
									"type": "USER",
									"gender": "MALE",
									"email": "user@email.com",
									"firstName": "Sample",
									"lastName": "User"
								}
							},
							"messageId": "84e26acc-56a5-4835-8233-591137fca468",
							"session_id": "3049dc4c-5a95-4ccd-a3e7-d74a7e411f22",
							"originalTimestamp": "2019-10-14T09:03:17.562Z",
							"anonymousId": "sample-anon-id",
							"userId": "sample-user-id",
							"type": "group",
							"traits": {
								"name": "ECorp",
								"industry": "software",
								"numberOfEmployees": 400,
								"website": "www.ecorp.com",
								"plan": "premium"
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
						"error": "groupId is required for group",
						"statTags": {
							"destType": "GAINSIGHT_PX",
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
		"name": "gainsight_px",
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
								"apiKey": "sample-api-key",
								"productTagKey": "AP-XABC-123",
								"accountAttributeMap": [
									{
										"from": "",
										"to": ""
									}
								],
								"userAttributeMap": [
									{
										"from": "",
										"to": ""
									}
								],
								"globalContextMap": [
									{
										"from": "projectId",
										"to": "p-123"
									},
									{
										"from": "tag",
										"to": "sample-category-tag"
									}
								]
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
							"userId": "sample-user-id",
							"messageId": "84e26acc-56a5-4835-8233-591137fca468",
							"session_id": "3049dc4c-5a95-4ccd-a3e7-d74a7e411f22",
							"originalTimestamp": "2019-10-14T09:03:17.562Z",
							"anonymousId": "sample-anon-id",
							"type": "track",
							"event": "Stringify Test",
							"properties": {
								"description": "Stringify test for object values",
								"nested": {
									"a": [
										1,
										2,
										3
									],
									"b": {
										"c": 1
									}
								},
								"arr": [
									1,
									2,
									3
								]
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
							"body": {
								"XML": {},
								"JSON_ARRAY": {},
								"FORM": {},
								"JSON": {
									"attributes": {
										"description": "Stringify test for object values",
										"nested": "{\"a\":[1,2,3],\"b\":{\"c\":1}}",
										"arr": "[1,2,3]"
									},
									"propertyKey": "AP-XABC-123",
									"userType": "USER",
									"identifyId": "sample-user-id",
									"date": 1571043797562,
									"eventName": "Stringify Test",
									"globalContext": {
										"projectId": "p-123",
										"tag": "sample-category-tag"
									}
								}
							},
							"type": "REST",
							"files": {},
							"method": "POST",
							"params": {},
							"headers": {
								"X-APTRINSIC-API-KEY": "sample-api-key",
								"Content-Type": "application/json"
							},
							"version": "1",
							"endpoint": "https://api.aptrinsic.com/v1/events/custom",
							"userId": ""
						},
						"statusCode": 200
					}
				]
			}
		}
	},
	{
		"name": "gainsight_px",
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
								"apiKey": "sample-api-key",
								"productTagKey": "AP-XABC-123",
								"accountAttributeMap": [
									{
										"from": "",
										"to": ""
									}
								],
								"userAttributeMap": [
									{
										"from": "",
										"to": ""
									}
								],
								"globalContextMap": [
									{
										"from": "projectId",
										"to": "p-123"
									},
									{
										"from": "tag",
										"to": "sample-category-tag"
									}
								]
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
							"userId": "sample-user-id",
							"messageId": "84e26acc-56a5-4835-8233-591137fca468",
							"session_id": "3049dc4c-5a95-4ccd-a3e7-d74a7e411f22",
							"originalTimestamp": "2019-10-14T09:03:17.562Z",
							"anonymousId": "sample-anon-id",
							"type": "track",
							"event": "Stringify Test",
							"properties": {
								"description": "Stringify test for object values",
								"nested": {
									"a": [
										1,
										2,
										3
									],
									"b": {
										"c": 1
									}
								},
								"arr": [
									1,
									2,
									3
								],
								"globalContext": {
									"someKey": "someVal"
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
							"body": {
								"XML": {},
								"JSON_ARRAY": {},
								"FORM": {},
								"JSON": {
									"attributes": {
										"description": "Stringify test for object values",
										"nested": "{\"a\":[1,2,3],\"b\":{\"c\":1}}",
										"arr": "[1,2,3]"
									},
									"propertyKey": "AP-XABC-123",
									"userType": "USER",
									"identifyId": "sample-user-id",
									"date": 1571043797562,
									"eventName": "Stringify Test",
									"globalContext": {
										"someKey": "someVal"
									}
								}
							},
							"type": "REST",
							"files": {},
							"method": "POST",
							"params": {},
							"headers": {
								"X-APTRINSIC-API-KEY": "sample-api-key",
								"Content-Type": "application/json"
							},
							"version": "1",
							"endpoint": "https://api.aptrinsic.com/v1/events/custom",
							"userId": ""
						},
						"statusCode": 200
					}
				]
			}
		}
	},
	{
		"name": "gainsight_px",
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
								"apiKey": "sample-api-key",
								"productTagKey": "AP-XABC-123",
								"accountAttributeMap": [
									{
										"from": "",
										"to": ""
									}
								],
								"userAttributeMap": [],
								"globalContextMap": []
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
								},
								"traits": {
									"type": "USER",
									"gender": "MALE",
									"email": "user@email.com",
									"firstName": "Sample",
									"lastName": "User"
								}
							},
							"messageId": "84e26acc-56a5-4835-8233-591137fca468",
							"session_id": "3049dc4c-5a95-4ccd-a3e7-d74a7e411f22",
							"originalTimestamp": "2019-10-14T09:03:17.562Z",
							"anonymousId": "sample-anon-id",
							"userId": "absent-id",
							"groupId": "ecorp-id",
							"type": "group",
							"traits": {
								"name": "ECorp",
								"industry": "software",
								"numberOfEmployees": 400,
								"website": "www.ecorp.com",
								"plan": "premium"
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
						"error": "aborting group call: {\"status\":\"NOT_FOUND\",\"message\":\"User was not found for parameters {id=absent-id}\",\"debugMessage\":null,\"subErrors\":null}",
						"statTags": {
							"destType": "GAINSIGHT_PX",
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
		"name": "gainsight_px",
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
								"apiKey": "sample-api-key",
								"productTagKey": "AP-XABC-123",
								"accountAttributeMap": [
									{
										"from": "",
										"to": ""
									}
								],
								"userAttributeMap": [
									{
										"from": "hobbyCustomField",
										"to": "hobby"
									}
								],
								"globalContextMap": []
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
							"userId": "absent-id",
							"anonymousId": "sample-anon-id",
							"type": "identify",
							"traits": {
								"type": "USER",
								"gender": "MALE",
								"email": "user@email.com",
								"firstName": "Sample",
								"lastName": "User",
								"signUpDate": 1624431528295,
								"title": "engineer",
								"countryName": "USA",
								"countryCode": "US",
								"city": "New York",
								"hobbyCustomField": "Sample Hobby"
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
							"body": {
								"XML": {},
								"JSON_ARRAY": {},
								"FORM": {},
								"JSON": {
									"identifyId": "absent-id",
									"type": "USER",
									"gender": "MALE",
									"email": "user@email.com",
									"firstName": "Sample",
									"lastName": "User",
									"signUpDate": 1624431528295,
									"createDate": 1571043797562,
									"title": "engineer",
									"propertyKeys": [
										"AP-XABC-123"
									],
									"location": {
										"countryName": "USA",
										"countryCode": "US",
										"city": "New York"
									},
									"customAttributes": {
										"hobby": "Sample Hobby"
									}
								}
							},
							"type": "REST",
							"files": {},
							"method": "POST",
							"params": {},
							"headers": {
								"X-APTRINSIC-API-KEY": "sample-api-key",
								"Content-Type": "application/json"
							},
							"version": "1",
							"endpoint": "https://api.aptrinsic.com/v1/users",
							"userId": ""
						},
						"statusCode": 200
					}
				]
			}
		}
	},
	{
		"name": "gainsight_px",
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
								"apiKey": "sample-api-key",
								"productTagKey": "AP-XABC-123",
								"accountAttributeMap": [
									{
										"from": "",
										"to": ""
									}
								],
								"userAttributeMap": [
									{
										"from": "",
										"to": ""
									}
								],
								"globalContextMap": []
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
							"userId": "absent-id",
							"anonymousId": "sample-anon-id",
							"type": "identify",
							"traits": {
								"type": "USER",
								"gender": "MALE",
								"email": "user@email.com",
								"firstName": "Sample",
								"lastName": "User",
								"signUpDate": 1624431528295,
								"title": "engineer",
								"countryName": "USA",
								"countryCode": "US",
								"city": "New York",
								"hobbyCustomField": "Sample Hobby",
								"accountId": 1234
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
							"body": {
								"XML": {},
								"JSON_ARRAY": {},
								"FORM": {},
								"JSON": {
									"identifyId": "absent-id",
									"type": "USER",
									"gender": "MALE",
									"email": "user@email.com",
									"firstName": "Sample",
									"lastName": "User",
									"signUpDate": 1624431528295,
									"createDate": 1571043797562,
									"title": "engineer",
									"propertyKeys": [
										"AP-XABC-123"
									],
									"accountId": "1234",
									"location": {
										"countryName": "USA",
										"countryCode": "US",
										"city": "New York"
									},
									"customAttributes": {}
								}
							},
							"type": "REST",
							"files": {},
							"method": "POST",
							"params": {},
							"headers": {
								"X-APTRINSIC-API-KEY": "sample-api-key",
								"Content-Type": "application/json"
							},
							"version": "1",
							"endpoint": "https://api.aptrinsic.com/v1/users",
							"userId": ""
						},
						"statusCode": 200
					}
				]
			}
		}
	},
	{
		"name": "gainsight_px",
		"description": "Test 13",
		"feature": "processor",
		"module": "destination",
		"version": "v0",
		"input": {
			"request": {
				"body": [
					{
						"destination": {
							"Config": {
								"apiKey": "sample-api-key",
								"productTagKey": "AP-XABC-123",
								"accountAttributeMap": [
									{
										"from": "",
										"to": ""
									}
								],
								"userAttributeMap": [],
								"globalContextMap": []
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
								},
								"traits": {
									"type": "USER",
									"gender": "MALE",
									"email": "user@email.com",
									"firstName": "Sample",
									"lastName": "User"
								}
							},
							"messageId": "84e26acc-56a5-4835-8233-591137fca468",
							"session_id": "3049dc4c-5a95-4ccd-a3e7-d74a7e411f22",
							"originalTimestamp": "2019-10-14T09:03:17.562Z",
							"anonymousId": "sample-anon-id",
							"userId": "absent-id",
							"groupId": "ecorp-id",
							"type": "group",
							"traits": {
								"name": "ECorp",
								"industry": "software",
								"numberOfEmployees": 400,
								"website": "www.ecorp.com",
								"plan": "premium",
								"term": null
							},
							"integrations": {
								"All": true,
								"GAINSIGHT_PX": {
									"limitAPIForGroup": true
								}
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
							"method": "PUT",
							"endpoint": "https://api.aptrinsic.com/v1/users/absent-id",
							"headers": {
								"X-APTRINSIC-API-KEY": "sample-api-key",
								"Content-Type": "application/json"
							},
							"params": {},
							"body": {
								"JSON": {
									"accountId": "ecorp-id"
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
		"name": "gainsight_px",
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
								"apiKey": "sample-api-key",
								"productTagKey": "AP-XABC-123",
								"accountAttributeMap": [
									{
										"from": "",
										"to": ""
									}
								],
								"userAttributeMap": [
									{
										"from": "hobbyCustomField",
										"to": "hobby"
									}
								],
								"globalContextMap": []
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
							"userId": "sample-user-id",
							"anonymousId": "sample-anon-id",
							"type": "identify",
							"traits": {
								"type": "USER",
								"gender": "MALE",
								"email": "user@email.com",
								"firstName": "Sample",
								"lastName": "User",
								"signUpDate": 1624431528295,
								"title": "engineer",
								"countryName": "USA",
								"countryCode": "US",
								"city": "New York",
								"hobbyCustomField": "Sample Hobby",
								"term": null,
								"campaign": ""
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
							"body": {
								"XML": {},
								"JSON_ARRAY": {},
								"FORM": {},
								"JSON": {
									"type": "USER",
									"gender": "MALE",
									"email": "user@email.com",
									"firstName": "Sample",
									"lastName": "User",
									"signUpDate": 1624431528295,
									"createDate": 1571043797562,
									"title": "engineer",
									"propertyKeys": [
										"AP-XABC-123"
									],
									"location": {
										"countryName": "USA",
										"countryCode": "US",
										"city": "New York"
									},
									"customAttributes": {
										"hobby": "Sample Hobby"
									}
								}
							},
							"type": "REST",
							"files": {},
							"method": "PUT",
							"params": {},
							"headers": {
								"X-APTRINSIC-API-KEY": "sample-api-key",
								"Content-Type": "application/json"
							},
							"version": "1",
							"endpoint": "https://api.aptrinsic.com/v1/users/sample-user-id",
							"userId": ""
						},
						"statusCode": 200
					}
				]
			}
		}
	}
]