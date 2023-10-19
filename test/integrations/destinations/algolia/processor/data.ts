export const data = [
	{
		"name": "algolia",
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
								"app": {
									"build": "1.0.0",
									"name": "RudderLabs JavaScript SDK",
									"namespace": "com.rudderlabs.javascript",
									"version": "1.0.0"
								},
								"traits": {
									"email": "testone@gmail.com",
									"firstName": "test",
									"lastName": "one"
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
									"path": "/destinations/ometria",
									"referrer": "",
									"search": "",
									"title": "",
									"url": "https://docs.rudderstack.com/destinations/ometria",
									"category": "destination",
									"initial_referrer": "https://docs.rudderstack.com",
									"initial_referring_domain": "docs.rudderstack.com"
								}
							},
							"type": "track",
							"messageId": "84e26acc-56a5-4835-8233-591137fca468",
							"session_id": "3049dc4c-5a95-4ccd-a3e7-d74a7e411f22",
							"originalTimestamp": "2019-10-14T09:03:17.562Z",
							"anonymousId": "123456",
							"event": "product clicked",
							"userId": "testuserId1",
							"properties": {
								"index": "products",
								"filters": [
									"field1:hello",
									"val1:val2"
								]
							},
							"integrations": {
								"All": true
							},
							"sentAt": "2019-10-14T09:03:22.563Z"
						},
						"destination": {
							"Config": {
								"apiKey": "dummyApiKey",
								"applicationId": "O2YARRI15I",
								"eventTypeSettings": [
									{
										"from": "product clicked",
										"to": "cLick "
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
						"output": {
							"body": {
								"FORM": {},
								"JSON_ARRAY": {},
								"JSON": {
									"events": [
										{
											"eventName": "product clicked",
											"eventType": "click",
											"filters": [
												"field1:hello",
												"val1:val2"
											],
											"index": "products",
											"userToken": "testuserId1"
										}
									]
								},
								"XML": {}
							},
							"endpoint": "https://insights.algolia.io/1/events",
							"files": {},
							"headers": {
								"X-Algolia-API-Key": "dummyApiKey",
								"X-Algolia-Application-Id": "O2YARRI15I"
							},
							"method": "POST",
							"params": {},
							"type": "REST",
							"userId": "",
							"version": "1"
						},
						"statusCode": 200
					}
				]
			}
		}
	},
	{
		"name": "algolia",
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
								"app": {
									"build": "1.0.0",
									"name": "RudderLabs JavaScript SDK",
									"namespace": "com.rudderlabs.javascript",
									"version": "1.0.0"
								},
								"traits": {
									"email": "testone@gmail.com",
									"firstName": "test",
									"lastName": "one"
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
									"path": "/destinations/ometria",
									"referrer": "",
									"search": "",
									"title": "",
									"url": "https://docs.rudderstack.com/destinations/ometria",
									"category": "destination",
									"initial_referrer": "https://docs.rudderstack.com",
									"initial_referring_domain": "docs.rudderstack.com"
								}
							},
							"type": "track",
							"messageId": "84e26acc-56a5-4835-8233-591137fca468",
							"session_id": "3049dc4c-5a95-4ccd-a3e7-d74a7e411f22",
							"originalTimestamp": "2019-10-14T09:03:17.562Z",
							"anonymousId": "123456",
							"event": "product list viewed",
							"userId": "testuserId1",
							"properties": {
								"index": "products",
								"products": [
									{
										"objectId": "ecommerce-sample-data-919",
										"position": 7
									},
									{
										"objectId": "9780439784542",
										"position": 8
									}
								],
								"queryId": "43b15df305339e827f0ac0bdc5ebcaa7"
							},
							"integrations": {
								"All": true
							},
							"sentAt": "2019-10-14T09:03:22.563Z"
						},
						"destination": {
							"Config": {
								"apiKey": "dummyApiKey",
								"applicationId": "O2YARRI15I",
								"eventTypeSettings": [
									{
										"from": "product list viewed",
										"to": "click"
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
						"output": {
							"body": {
								"FORM": {},
								"JSON_ARRAY": {},
								"JSON": {
									"events": [
										{
											"eventName": "product list viewed",
											"eventType": "click",
											"objectIDs": [
												"ecommerce-sample-data-919",
												"9780439784542"
											],
											"positions": [
												7,
												8
											],
											"index": "products",
											"userToken": "testuserId1",
											"queryID": "43b15df305339e827f0ac0bdc5ebcaa7"
										}
									]
								},
								"XML": {}
							},
							"endpoint": "https://insights.algolia.io/1/events",
							"files": {},
							"headers": {
								"X-Algolia-API-Key": "dummyApiKey",
								"X-Algolia-Application-Id": "O2YARRI15I"
							},
							"method": "POST",
							"params": {},
							"type": "REST",
							"userId": "",
							"version": "1"
						},
						"statusCode": 200
					}
				]
			}
		}
	},
	{
		"name": "algolia",
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
									"email": "testone@gmail.com",
									"firstName": "test",
									"lastName": "one"
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
									"path": "/destinations/ometria",
									"referrer": "",
									"search": "",
									"title": "",
									"url": "https://docs.rudderstack.com/destinations/ometria",
									"category": "destination",
									"initial_referrer": "https://docs.rudderstack.com",
									"initial_referring_domain": "docs.rudderstack.com"
								}
							},
							"type": "track",
							"messageId": "84e26acc-56a5-4835-8233-591137fca468",
							"session_id": "3049dc4c-5a95-4ccd-a3e7-d74a7e411f22",
							"originalTimestamp": "2019-10-14T09:03:17.562Z",
							"anonymousId": "123456",
							"event": "product clicked",
							"userId": "testuserId1",
							"properties": {
								"eventType": "click",
								"index": "products",
								"queryId": "43b15df305339e827f0ac0bdc5ebcaa8"
							},
							"integrations": {
								"All": true
							},
							"sentAt": "2019-10-14T09:03:22.563Z"
						},
						"destination": {
							"Config": {
								"apiKey": "dummyApiKey",
								"applicationId": "O2YARRI15I",
								"eventTypeSettings": []
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
						"error": "Either filters or  objectIds is required.",
						"statTags": {
							"destType": "ALGOLIA",
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
		"name": "algolia",
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
									"email": "testone@gmail.com",
									"firstName": "test",
									"lastName": "one"
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
									"path": "/destinations/ometria",
									"referrer": "",
									"search": "",
									"title": "",
									"url": "https://docs.rudderstack.com/destinations/ometria",
									"category": "destination",
									"initial_referrer": "https://docs.rudderstack.com",
									"initial_referring_domain": "docs.rudderstack.com"
								}
							},
							"type": "track",
							"messageId": "84e26acc-56a5-4835-8233-591137fca468",
							"session_id": "3049dc4c-5a95-4ccd-a3e7-d74a7e411f22",
							"originalTimestamp": "2019-10-14T09:03:17.562Z",
							"anonymousId": "123456",
							"userId": "testuserId1",
							"event": "product clicked",
							"properties": {
								"index": "products",
								"queryId": "43b15df305339e827f0ac0bdc5ebcaa7"
							},
							"integrations": {
								"All": true
							},
							"sentAt": "2019-10-14T09:03:22.563Z"
						},
						"destination": {
							"Config": {
								"apiKey": "dummyApiKey",
								"applicationId": "O2YARRI15I",
								"eventTypeSettings": []
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
						"error": "eventType is mandatory for track call",
						"statTags": {
							"destType": "ALGOLIA",
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
		"name": "algolia",
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
									"email": "testone@gmail.com",
									"firstName": "test",
									"lastName": "one"
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
									"path": "/destinations/ometria",
									"referrer": "",
									"search": "",
									"title": "",
									"url": "https://docs.rudderstack.com/destinations/ometria",
									"category": "destination",
									"initial_referrer": "https://docs.rudderstack.com",
									"initial_referring_domain": "docs.rudderstack.com"
								}
							},
							"type": "track",
							"messageId": "84e26acc-56a5-4835-8233-591137fca468",
							"session_id": "3049dc4c-5a95-4ccd-a3e7-d74a7e411f22",
							"originalTimestamp": "2019-10-14T09:03:17.562Z",
							"anonymousId": "123456",
							"event": "product list viewed",
							"userId": "testuserId1",
							"properties": {
								"index": "products",
								"products": [
									{
										"objectId": "ecommerce-sample-data-919",
										"position": 7
									},
									{
										"objectId": "9780439784542",
										"position": 8
									}
								],
								"queryId": ""
							},
							"integrations": {
								"All": true
							},
							"sentAt": "2019-10-14T09:03:22.563Z"
						},
						"destination": {
							"Config": {
								"apiKey": "dummyApiKey",
								"applicationId": "O2YARRI15I",
								"eventTypeSettings": [
									{
										"from": "product list viewed",
										"to": "click"
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
						"error": "for click eventType either both positions and queryId should be present or none",
						"statTags": {
							"destType": "ALGOLIA",
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
		"name": "algolia",
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
									"email": "testone@gmail.com",
									"firstName": "test",
									"lastName": "one"
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
									"path": "/destinations/ometria",
									"referrer": "",
									"search": "",
									"title": "",
									"url": "https://docs.rudderstack.com/destinations/ometria",
									"category": "destination",
									"initial_referrer": "https://docs.rudderstack.com",
									"initial_referring_domain": "docs.rudderstack.com"
								}
							},
							"type": "track",
							"messageId": "84e26acc-56a5-4835-8233-591137fca468",
							"session_id": "3049dc4c-5a95-4ccd-a3e7-d74a7e411f22",
							"originalTimestamp": "2019-10-14T09:03:17.562Z",
							"anonymousId": "123456",
							"event": "product list viewed",
							"userId": "testuserId1",
							"properties": {
								"index": "products",
								"products": [
									{
										"objectId": "ecommerce-sample-data-919",
										"position": 7
									},
									{
										"objectId": "9780439784542",
										"position": 8
									}
								],
								"queryId": "43b15df305339e827f0ac0bdc5ebcaa7"
							},
							"integrations": {
								"All": true
							},
							"sentAt": "2019-10-14T09:03:22.563Z"
						},
						"destination": {
							"Config": {
								"apiKey": "dummyApiKey",
								"applicationId": "O2YARRI15I",
								"eventTypeSettings": [
									{
										"from": "product list viewed",
										"to": "view"
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
						"output": {
							"body": {
								"FORM": {},
								"JSON_ARRAY": {},
								"JSON": {
									"events": [
										{
											"eventName": "product list viewed",
											"eventType": "view",
											"index": "products",
											"objectIDs": [
												"ecommerce-sample-data-919",
												"9780439784542"
											],
											"userToken": "testuserId1",
											"queryID": "43b15df305339e827f0ac0bdc5ebcaa7"
										}
									]
								},
								"XML": {}
							},
							"endpoint": "https://insights.algolia.io/1/events",
							"files": {},
							"headers": {
								"X-Algolia-API-Key": "dummyApiKey",
								"X-Algolia-Application-Id": "O2YARRI15I"
							},
							"method": "POST",
							"params": {},
							"type": "REST",
							"userId": "",
							"version": "1"
						},
						"statusCode": 200
					}
				]
			}
		}
	},
	{
		"name": "algolia",
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
									"email": "testone@gmail.com",
									"firstName": "test",
									"lastName": "one"
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
									"path": "/destinations/ometria",
									"referrer": "",
									"search": "",
									"title": "",
									"url": "https://docs.rudderstack.com/destinations/ometria",
									"category": "destination",
									"initial_referrer": "https://docs.rudderstack.com",
									"initial_referring_domain": "docs.rudderstack.com"
								}
							},
							"type": "track",
							"messageId": "84e26acc-56a5-4835-8233-591137fca468",
							"session_id": "3049dc4c-5a95-4ccd-a3e7-d74a7e411f22",
							"originalTimestamp": "2019-10-14T09:03:17.562Z",
							"anonymousId": "123456",
							"event": "product list viewed",
							"userId": "testuserId1",
							"properties": {
								"index": "products",
								"products": [
									{
										"objectId": "ecommerce-sample-data-919",
										"position": "7"
									},
									{
										"objectId": "9780439784542",
										"position": "a"
									}
								],
								"queryId": "43b15df305339e827f0ac0bdc5ebcaa7"
							},
							"integrations": {
								"All": true
							},
							"sentAt": "2019-10-14T09:03:22.563Z"
						},
						"destination": {
							"Config": {
								"apiKey": "dummyApiKey",
								"applicationId": "O2YARRI15I",
								"eventTypeSettings": [
									{
										"from": "product list viewed",
										"to": "click"
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
						"error": "for click eventType either both positions and queryId should be present or none",
						"statTags": {
							"destType": "ALGOLIA",
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
		"name": "algolia",
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
									"email": "testone@gmail.com",
									"firstName": "test",
									"lastName": "one"
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
									"path": "/destinations/ometria",
									"referrer": "",
									"search": "",
									"title": "",
									"url": "https://docs.rudderstack.com/destinations/ometria",
									"category": "destination",
									"initial_referrer": "https://docs.rudderstack.com",
									"initial_referring_domain": "docs.rudderstack.com"
								}
							},
							"type": "track",
							"messageId": "84e26acc-56a5-4835-8233-591137fca468",
							"session_id": "3049dc4c-5a95-4ccd-a3e7-d74a7e411f22",
							"originalTimestamp": "2019-10-14T09:03:17.562Z",
							"anonymousId": "123456",
							"event": "product list viewed",
							"userId": "testuserId1",
							"properties": {
								"index": "products",
								"products": [
									{
										"objectId": "ecommerce-sample-data-919",
										"position": "7"
									},
									{
										"objectId": "9780439784542",
										"position": "a"
									}
								],
								"queryId": "43b15df305339e827f0ac0bdc5ebcaa7"
							},
							"integrations": {
								"All": true
							},
							"sentAt": "2019-10-14T09:03:22.563Z"
						},
						"destination": {
							"Config": {
								"apiKey": "dummyApiKey",
								"applicationId": "O2YARRI15I",
								"eventTypeSettings": [
									{
										"from": "product list viewed",
										"to": "check"
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
						"error": "eventType can be either click, view or conversion",
						"statTags": {
							"destType": "ALGOLIA",
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
		"name": "algolia",
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
									"email": "testone@gmail.com",
									"firstName": "test",
									"lastName": "one"
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
									"path": "/destinations/ometria",
									"referrer": "",
									"search": "",
									"title": "",
									"url": "https://docs.rudderstack.com/destinations/ometria",
									"category": "destination",
									"initial_referrer": "https://docs.rudderstack.com",
									"initial_referring_domain": "docs.rudderstack.com"
								}
							},
							"type": "track",
							"messageId": "84e26acc-56a5-4835-8233-591137fca468",
							"session_id": "3049dc4c-5a95-4ccd-a3e7-d74a7e411f22",
							"originalTimestamp": "2019-10-14T09:03:17.562Z",
							"anonymousId": "123456",
							"event": "product list viewed",
							"userId": "testuserId1",
							"properties": {
								"index": "products",
								"products": [
									{
										"objectId": "ecommerce-sample-data-919",
										"position": "7"
									},
									{
										"objectId": "9780439784542",
										"position": "a"
									}
								],
								"queryId": "43b15df305339e827f0ac0bdc5ebcaa7"
							},
							"integrations": {
								"All": true
							},
							"sentAt": "2019-10-14T09:03:22.563Z"
						},
						"destination": {
							"Config": {
								"apiKey": "dummyApiKey",
								"applicationId": "O2YARRI15I"
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
						"error": "eventType is mandatory for track call",
						"statTags": {
							"destType": "ALGOLIA",
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
		"name": "algolia",
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
									"email": "testone@gmail.com",
									"firstName": "test",
									"lastName": "one"
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
									"path": "/destinations/ometria",
									"referrer": "",
									"search": "",
									"title": "",
									"url": "https://docs.rudderstack.com/destinations/ometria",
									"category": "destination",
									"initial_referrer": "https://docs.rudderstack.com",
									"initial_referring_domain": "docs.rudderstack.com"
								}
							},
							"type": "track",
							"messageId": "84e26acc-56a5-4835-8233-591137fca468",
							"session_id": "3049dc4c-5a95-4ccd-a3e7-d74a7e411f22",
							"originalTimestamp": "2019-10-14T09:03:17.562Z",
							"anonymousId": "123456",
							"event": "product clicked",
							"userId": "testuserId1",
							"properties": {
								"filters": [
									"field1:hello",
									"val1:val2"
								]
							},
							"integrations": {
								"All": true
							},
							"sentAt": "2019-10-14T09:03:22.563Z"
						},
						"destination": {
							"Config": {
								"apiKey": "dummyApiKey",
								"applicationId": "O2YARRI15I",
								"eventTypeSettings": [
									{
										"from": "product clicked",
										"to": "cLick "
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
						"error": "Missing required value from \"properties.index\"",
						"statTags": {
							"destType": "ALGOLIA",
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
		"name": "algolia",
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
									"email": "testone@gmail.com",
									"firstName": "test",
									"lastName": "one"
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
									"path": "/destinations/ometria",
									"referrer": "",
									"search": "",
									"title": "",
									"url": "https://docs.rudderstack.com/destinations/ometria",
									"category": "destination",
									"initial_referrer": "https://docs.rudderstack.com",
									"initial_referring_domain": "docs.rudderstack.com"
								}
							},
							"type": "track",
							"messageId": "84e26acc-56a5-4835-8233-591137fca468",
							"session_id": "3049dc4c-5a95-4ccd-a3e7-d74a7e411f22",
							"originalTimestamp": "2019-10-14T09:03:17.562Z",
							"anonymousId": "123456",
							"event": [
								"abc",
								"def"
							],
							"userId": "testuserId1",
							"properties": {
								"filters": [
									"field1:hello",
									"val1:val2"
								]
							},
							"integrations": {
								"All": true
							},
							"sentAt": "2019-10-14T09:03:22.563Z"
						},
						"destination": {
							"Config": {
								"apiKey": "dummyApiKey",
								"applicationId": "O2YARRI15I",
								"eventTypeSettings": [
									{
										"from": "product clicked",
										"to": "cLick "
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
						"error": "event name should be a string",
						"statTags": {
							"destType": "ALGOLIA",
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
	}
]