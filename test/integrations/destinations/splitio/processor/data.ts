export const data = [
	{
		"name": "splitio",
		"description": "Test 0",
		"feature": "processor",
		"module": "destination",
		"version": "v0",
		"input": {
			"request": {
				"body": [
					{
						"message": {
							"traits": {
								"martin": 21.565,
								"trafficTypeName": "user",
								"vertical": "restaurant",
								"eventTypeId": "page_load end to end",
								"timestamp": 1513357833000,
								"GMV": false
							},
							"userId": "user123",
							"messageId": "c73198a8-41d8-4426-9fd9-de167194d5f3",
							"rudderId": "bda76e3e-87eb-4153-9d1e-e9c2ed48b7a5",
							"context": {
								"ip": "14.5.67.21",
								"traits": {
									"abc": "new-val",
									"key": "key_user_0",
									"value": "0.93"
								},
								"library": {
									"name": "http"
								}
							},
							"type": "group",
							"groupId": "group1",
							"timestamp": "2020-01-21T00:21:34.208Z",
							"writeKey": "1pe7u01A7rYOrvacE6WSgI6ESXh",
							"receivedAt": "2021-04-19T14:53:18.215+05:30",
							"requestIP": "[::1]"
						},
						"destination": {
							"Config": {
								"apiKey": "abcde",
								"environment": "staging",
								"trafficType": "user"
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
							"endpoint": "https://events.split.io/api/events",
							"headers": {
								"Content-Type": "application/json",
								"Authorization": "Bearer abcde"
							},
							"params": {},
							"body": {
								"JSON": {
									"eventTypeId": "group",
									"key": "user123",
									"timestamp": 1579566094208,
									"environmentName": "staging",
									"trafficTypeName": "user",
									"properties": {
										"martin": 21.565,
										"vertical": "restaurant",
										"GMV": false
									}
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
		"name": "splitio",
		"description": "Test 1",
		"feature": "processor",
		"module": "destination",
		"version": "v0",
		"input": {
			"request": {
				"body": [
					{
						"message": {
							"traits": {
								"martin": 21.565,
								"trafficTypeName": "user",
								"eventTypeId": "page_load end to end",
								"timestamp": 1513357833000,
								"address": {
									"city": "San Francisco",
									"state": "CA",
									"country": "USA"
								},
								"key1": {
									"a": "a"
								},
								"key2": [
									1,
									2,
									3
								],
								"key3": {
									"key4": {}
								},
								"key5": null
							},
							"userId": "user123",
							"messageId": "c73198a8-41d8-4426-9fd9-de167194d5f3",
							"rudderId": "bda76e3e-87eb-4153-9d1e-e9c2ed48b7a5",
							"context": {
								"ip": "14.5.67.21",
								"traits": {
									"abc": "new-val",
									"key": "key_user_0"
								},
								"library": {
									"name": "http"
								}
							},
							"type": "identify",
							"timestamp": "2020-01-21T00:21:34.208Z",
							"writeKey": "1pe7u01A7rYOrvacE6WSgI6ESXh",
							"receivedAt": "2021-04-19T14:53:18.215+05:30",
							"requestIP": "[::1]"
						},
						"destination": {
							"Config": {
								"apiKey": "abcde",
								"environment": "staging",
								"trafficType": "user"
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
							"endpoint": "https://events.split.io/api/events",
							"headers": {
								"Content-Type": "application/json",
								"Authorization": "Bearer abcde"
							},
							"params": {},
							"body": {
								"JSON": {
									"eventTypeId": "identify",
									"key": "user123",
									"timestamp": 1579566094208,
									"environmentName": "staging",
									"trafficTypeName": "user",
									"properties": {
										"martin": 21.565,
										"address.city": "San Francisco",
										"address.state": "CA",
										"address.country": "USA",
										"key1.a": "a",
										"key2[0]": 1,
										"key2[1]": 2,
										"key2[2]": 3
									}
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
		"name": "splitio",
		"description": "Test 2",
		"feature": "processor",
		"module": "destination",
		"version": "v0",
		"input": {
			"request": {
				"body": [
					{
						"message": {
							"event": "splitio_test_1",
							"messageId": "9b200548-5961-4448-9dbc-098b7ce85751",
							"properties": {
								"eventTypeId": "page_load",
								"trafficTypeName": "user",
								"key": "key_user_0",
								"timestamp": 1513357833000,
								"value": "0.93",
								"martin": 21.565,
								"vertical": "restaurant",
								"GMV": true,
								"abc": "new-val",
								"property1": {
									"property2": 1,
									"property3": "test",
									"property4": {
										"subProp1": {
											"a": "a",
											"b": "b"
										},
										"subProp2": [
											"a",
											"b"
										],
										"subProp3": {
											"prop": {}
										}
									}
								},
								"properties5": null
							},
							"receivedAt": "2021-03-01T22:55:54.806Z",
							"rudderId": "6886eb9e-215d-4f61-a651-4b8ef18aaea3",
							"timestamp": "2021-03-01T22:55:54.771Z",
							"type": "track",
							"userId": "user 1"
						},
						"destination": {
							"Config": {
								"apiKey": "abcde",
								"environment": "production",
								"trafficType": "user"
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
							"endpoint": "https://events.split.io/api/events",
							"headers": {
								"Content-Type": "application/json",
								"Authorization": "Bearer abcde"
							},
							"params": {},
							"body": {
								"JSON": {
									"eventTypeId": "splitio_test_1",
									"key": "user 1",
									"timestamp": 1614639354771,
									"value": 0.93,
									"environmentName": "production",
									"trafficTypeName": "user",
									"properties": {
										"martin": 21.565,
										"vertical": "restaurant",
										"GMV": true,
										"abc": "new-val",
										"property1.property2": 1,
										"property1.property3": "test",
										"property1.property4.subProp1.a": "a",
										"property1.property4.subProp1.b": "b",
										"property1.property4.subProp2[0]": "a",
										"property1.property4.subProp2[1]": "b"
									}
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
		"name": "splitio",
		"description": "Test 3",
		"feature": "processor",
		"module": "destination",
		"version": "v0",
		"input": {
			"request": {
				"body": [
					{
						"message": {
							"name": "splitio_test_1",
							"messageId": "9b200548-5961-4448-9dbc-098b7ce85751",
							"properties": {
								"eventTypeId": "page_load",
								"trafficTypeName": "user",
								"key": "key_user_0",
								"timestamp": 1513357833000,
								"value": "0.93",
								"martin": 21.565,
								"vertical": "restaurant",
								"GMV": true,
								"abc": "new-val"
							},
							"receivedAt": "2021-03-01T22:55:54.806Z",
							"rudderId": "6886eb9e-215d-4f61-a651-4b8ef18aaea3",
							"timestamp": "2021-03-01T22:55:54.771Z",
							"type": "page",
							"userId": "user 1"
						},
						"destination": {
							"Config": {
								"apiKey": "abcde",
								"environment": "production",
								"trafficType": "user"
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
							"endpoint": "https://events.split.io/api/events",
							"headers": {
								"Content-Type": "application/json",
								"Authorization": "Bearer abcde"
							},
							"params": {},
							"body": {
								"JSON": {
									"eventTypeId": "Viewed_splitio_test_1_page",
									"key": "user 1",
									"timestamp": 1614639354771,
									"value": 0.93,
									"environmentName": "production",
									"trafficTypeName": "user",
									"properties": {
										"martin": 21.565,
										"vertical": "restaurant",
										"GMV": true,
										"abc": "new-val"
									}
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
		"name": "splitio",
		"description": "Test 4",
		"feature": "processor",
		"module": "destination",
		"version": "v0",
		"input": {
			"request": {
				"body": [
					{
						"message": {
							"name": "splitio_test_1",
							"messageId": "9b200548-5961-4448-9dbc-098b7ce85751",
							"properties": {
								"eventTypeId": "page_load",
								"trafficTypeName": "user",
								"key": "key_user_0",
								"timestamp": 1513357833000,
								"value": "0.93",
								"martin": 21.565,
								"vertical": "restaurant",
								"GMV": true,
								"abc": "new-val"
							},
							"receivedAt": "2021-03-01T22:55:54.806Z",
							"rudderId": "6886eb9e-215d-4f61-a651-4b8ef18aaea3",
							"timestamp": "2021-03-01T22:55:54.771Z",
							"type": "screen",
							"userId": "user 1"
						},
						"destination": {
							"Config": {
								"apiKey": "abcde",
								"environment": "staging",
								"trafficType": "user"
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
							"endpoint": "https://events.split.io/api/events",
							"headers": {
								"Content-Type": "application/json",
								"Authorization": "Bearer abcde"
							},
							"params": {},
							"body": {
								"JSON": {
									"eventTypeId": "Viewed_splitio_test_1_screen",
									"key": "user 1",
									"timestamp": 1614639354771,
									"value": 0.93,
									"environmentName": "staging",
									"trafficTypeName": "user",
									"properties": {
										"martin": 21.565,
										"vertical": "restaurant",
										"GMV": true,
										"abc": "new-val"
									}
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
		"name": "splitio",
		"description": "Test 5",
		"feature": "processor",
		"module": "destination",
		"version": "v0",
		"input": {
			"request": {
				"body": [
					{
						"message": {
							"userId": "user123",
							"messageId": "c73198a8-41d8-4426-9fd9-de167194d5f3",
							"rudderId": "bda76e3e-87eb-4153-9d1e-e9c2ed48b7a5",
							"context": {
								"ip": "14.5.67.21",
								"traits": {
									"abc": "new-val",
									"key": "key_user_0",
									"newProperty": "1",
									"martin": 21.565,
									"vertical": "restaurant",
									"GMV": false
								},
								"library": {
									"name": "http"
								}
							},
							"type": "identify",
							"timestamp": "2020-01-21T00:21:34.208Z",
							"writeKey": "1pe7u01A7rYOrvacE6WSgI6ESXh",
							"receivedAt": "2021-04-19T14:53:18.215+05:30",
							"requestIP": "[::1]"
						},
						"destination": {
							"Config": {
								"apiKey": "abcde",
								"environment": "staging",
								"trafficType": "user"
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
							"endpoint": "https://events.split.io/api/events",
							"headers": {
								"Content-Type": "application/json",
								"Authorization": "Bearer abcde"
							},
							"params": {},
							"body": {
								"JSON": {
									"eventTypeId": "identify",
									"key": "user123",
									"timestamp": 1579566094208,
									"environmentName": "staging",
									"trafficTypeName": "user",
									"properties": {
										"abc": "new-val",
										"newProperty": "1",
										"martin": 21.565,
										"vertical": "restaurant",
										"GMV": false
									}
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
		"name": "splitio",
		"description": "Test 6",
		"feature": "processor",
		"module": "destination",
		"version": "v0",
		"input": {
			"request": {
				"body": [
					{
						"message": {
							"userId": "user123",
							"messageId": "c73198a8-41d8-4426-9fd9-de167194d5f3",
							"rudderId": "bda76e3e-87eb-4153-9d1e-e9c2ed48b7a5",
							"context": {
								"ip": "14.5.67.21",
								"traits": {
									"abc": "new-val",
									"key": "key_user_0",
									"newProperty": "1"
								},
								"library": {
									"name": "http"
								}
							},
							"timestamp": "2020-01-21T00:21:34.208Z",
							"writeKey": "1pe7u01A7rYOrvacE6WSgI6ESXh",
							"receivedAt": "2021-04-19T14:53:18.215+05:30",
							"requestIP": "[::1]"
						},
						"destination": {
							"Config": {
								"apiKey": "abcde",
								"environment": "staging",
								"trafficType": "user"
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
						"error": "Event type is required",
						"statTags": {
							"errorCategory": "dataValidation",
							"errorType": "instrumentation",
							"destType": "SPLITIO",
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
		"name": "splitio",
		"description": "Test 7",
		"feature": "processor",
		"module": "destination",
		"version": "v0",
		"input": {
			"request": {
				"body": [
					{
						"message": {
							"userId": "user123",
							"messageId": "c73198a8-41d8-4426-9fd9-de167194d5f3",
							"rudderId": "bda76e3e-87eb-4153-9d1e-e9c2ed48b7a5",
							"context": {
								"ip": "14.5.67.21",
								"traits": {
									"abc": "new-val",
									"key": "key_user_0",
									"newProperty": "1"
								},
								"library": {
									"name": "http"
								}
							},
							"type": "abc",
							"timestamp": "2020-01-21T00:21:34.208Z",
							"writeKey": "1pe7u01A7rYOrvacE6WSgI6ESXh",
							"receivedAt": "2021-04-19T14:53:18.215+05:30",
							"requestIP": "[::1]"
						},
						"destination": {
							"Config": {
								"apiKey": "abcde",
								"environment": "staging",
								"trafficType": "user"
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
						"error": "Event type abc is not supported",
						"statTags": {
							"errorCategory": "dataValidation",
							"errorType": "instrumentation",
							"destType": "SPLITIO",
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
		"name": "splitio",
		"description": "Test 8",
		"feature": "processor",
		"module": "destination",
		"version": "v0",
		"input": {
			"request": {
				"body": [
					{
						"message": {
							"name": "@$%%^&",
							"messageId": "9b200548-5961-4448-9dbc-098b7ce85751",
							"properties": {
								"eventTypeId": "page_load",
								"trafficTypeName": "user",
								"key": "key_user_0",
								"timestamp": 1513357833000,
								"value": "0.93",
								"martin": 21.565,
								"vertical": "restaurant",
								"GMV": true,
								"abc": "new-val"
							},
							"receivedAt": "2021-03-01T22:55:54.806Z",
							"rudderId": "6886eb9e-215d-4f61-a651-4b8ef18aaea3",
							"timestamp": "2021-03-01T22:55:54.771Z",
							"type": "page",
							"userId": "user 1"
						},
						"destination": {
							"Config": {
								"apiKey": "abcde",
								"environment": "production",
								"trafficType": "user"
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
						"error": "eventTypeId does not match with ideal format /^[\\dA-Za-z][\\w.-]{0,79}$/",
						"statTags": {
							"errorCategory": "dataValidation",
							"errorType": "instrumentation",
							"destType": "SPLITIO",
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
		"name": "splitio",
		"description": "Test 9",
		"feature": "processor",
		"module": "destination",
		"version": "v0",
		"input": {
			"request": {
				"body": [
					{
						"message": {
							"name": "1pplication accepted",
							"messageId": "9b200548-5961-4448-9dbc-098b7ce85751",
							"category": "food",
							"properties": {
								"eventTypeId": "page_load",
								"trafficTypeName": "user",
								"key": "key_user_0",
								"timestamp": 1513357833000,
								"value": "bc2",
								"martin": 21.565,
								"vertical": [
									"restaurant",
									"mall"
								],
								"GMV": true,
								"abc": "new-val"
							},
							"receivedAt": "2021-03-01T22:55:54.806Z",
							"rudderId": "6886eb9e-215d-4f61-a651-4b8ef18aaea3",
							"timestamp": "2021-03-01T22:55:54.771Z",
							"type": "page",
							"userId": "user 1"
						},
						"destination": {
							"Config": {
								"apiKey": "abcde",
								"environment": "production",
								"trafficType": "user"
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
							"endpoint": "https://events.split.io/api/events",
							"headers": {
								"Content-Type": "application/json",
								"Authorization": "Bearer abcde"
							},
							"params": {},
							"body": {
								"JSON": {
									"eventTypeId": "Viewed_1pplication_accepted_page",
									"key": "user 1",
									"timestamp": 1614639354771,
									"environmentName": "production",
									"trafficTypeName": "user",
									"properties": {
										"martin": 21.565,
										"vertical[0]": "restaurant",
										"vertical[1]": "mall",
										"GMV": true,
										"abc": "new-val",
										"category": "food"
									}
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
		"name": "splitio",
		"description": "Test 10",
		"feature": "processor",
		"module": "destination",
		"version": "v0",
		"input": {
			"request": {
				"body": [
					{
						"message": {
							"userId": "user123",
							"messageId": "c73198a8-41d8-4426-9fd9-de167194d5f3",
							"rudderId": "bda76e3e-87eb-4153-9d1e-e9c2ed48b7a5",
							"context": {
								"ip": "14.5.67.21",
								"library": {
									"name": "http"
								}
							},
							"type": "identify",
							"timestamp": "2020-01-21T00:21:34.208Z",
							"writeKey": "1pe7u01A7rYOrvacE6WSgI6ESXh",
							"receivedAt": "2021-04-19T14:53:18.215+05:30",
							"requestIP": "[::1]"
						},
						"destination": {
							"Config": {
								"apiKey": "abcde",
								"environment": "staging",
								"trafficType": "user"
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
							"endpoint": "https://events.split.io/api/events",
							"headers": {
								"Content-Type": "application/json",
								"Authorization": "Bearer abcde"
							},
							"params": {},
							"body": {
								"JSON": {
									"eventTypeId": "identify",
									"key": "user123",
									"timestamp": 1579566094208,
									"environmentName": "staging",
									"trafficTypeName": "user",
									"properties": {}
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
	}
]