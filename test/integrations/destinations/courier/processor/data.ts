export const data = [
	{
		"name": "courier",
		"description": "Test 0",
		"feature": "processor",
		"module": "destination",
		"version": "v0",
		"input": {
			"request": {
				"body": [
					{
						"message": {
							"type": "track",
							"channel": "web",
							"event": "Product Added",
							"properties": {},
							"context": {},
							"rudderId": "8f8fa6b5-8e24-489c-8e22-61f23f2e364f",
							"messageId": "2116ef8c-efc3-4ca4-851b-02ee60dad6ff",
							"anonymousId": "97c46c81-3140-456d-b2a9-690d70aaca35"
						},
						"destination": {
							"Config": {}
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
						"error": "apiKey is required",
						"statTags": {
							"errorCategory": "dataValidation",
							"errorType": "configuration",
							"destType": "COURIER",
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
		"name": "courier",
		"description": "Test 1",
		"feature": "processor",
		"module": "destination",
		"version": "v0",
		"input": {
			"request": {
				"body": [
					{
						"message": {
							"context": {
								"ip": "8.8.8.8"
							},
							"traits": {
								"name": "Joe Doe",
								"email": "joe@example.com",
								"plan": "basic",
								"age": 27
							},
							"type": "identify",
							"userId": "userIdTest",
							"originalTimestamp": "2022-10-17T15:53:10.566+05:30",
							"messageId": "8d04cc30-fc15-49bd-901f-c5c3f72a7d82"
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
						"output": {
							"version": "1",
							"type": "REST",
							"method": "POST",
							"endpoint": "https://api.courier.com/inbound/rudderstack",
							"headers": {
								"Content-Type": "application/json",
								"Authorization": "Bearer dummyApiKey"
							},
							"params": {},
							"body": {
								"JSON": {
									"context": {
										"ip": "8.8.8.8"
									},
									"traits": {
										"name": "Joe Doe",
										"email": "joe@example.com",
										"plan": "basic",
										"age": 27
									},
									"type": "identify",
									"userId": "userIdTest",
									"originalTimestamp": "2022-10-17T15:53:10.566+05:30",
									"messageId": "8d04cc30-fc15-49bd-901f-c5c3f72a7d82"
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
		"name": "courier",
		"description": "Test 2",
		"feature": "processor",
		"module": "destination",
		"version": "v0",
		"input": {
			"request": {
				"body": [
					{
						"message": {
							"context": {
								"ip": "8.8.8.8",
								"traits": {
									"name": "Joe Doe",
									"email": "joe@example.com",
									"plan": "basic",
									"age": 27
								}
							},
							"type": "identify",
							"userId": "userIdTest",
							"originalTimestamp": "2022-10-17T15:53:10.566+05:30",
							"messageId": "8d04cc30-fc15-49bd-901f-c5c3f72a7d82"
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
						"output": {
							"version": "1",
							"type": "REST",
							"method": "POST",
							"endpoint": "https://api.courier.com/inbound/rudderstack",
							"headers": {
								"Content-Type": "application/json",
								"Authorization": "Bearer dummyApiKey"
							},
							"params": {},
							"body": {
								"JSON": {
									"context": {
										"ip": "8.8.8.8",
										"traits": {
											"name": "Joe Doe",
											"email": "joe@example.com",
											"plan": "basic",
											"age": 27
										}
									},
									"type": "identify",
									"userId": "userIdTest",
									"originalTimestamp": "2022-10-17T15:53:10.566+05:30",
									"messageId": "8d04cc30-fc15-49bd-901f-c5c3f72a7d82",
									"traits": {
										"name": "Joe Doe",
										"email": "joe@example.com",
										"plan": "basic",
										"age": 27
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
		"name": "courier",
		"description": "Test 3",
		"feature": "processor",
		"module": "destination",
		"version": "v0",
		"input": {
			"request": {
				"body": [
					{
						"message": {
							"context": {
								"ip": "8.8.8.8"
							},
							"type": "identify",
							"userId": "userIdTest",
							"originalTimestamp": "2022-10-17T15:53:10.566+05:30",
							"messageId": "8d04cc30-fc15-49bd-901f-c5c3f72a7d82"
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
						"error": "traits is a required field for identify call",
						"statTags": {
							"errorCategory": "dataValidation",
							"errorType": "instrumentation",
							"destType": "COURIER",
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
		"name": "courier",
		"description": "Test 4",
		"feature": "processor",
		"module": "destination",
		"version": "v0",
		"input": {
			"request": {
				"body": [
					{
						"message": {
							"context": {
								"ip": "8.8.8.8"
							},
							"event": "trackTest",
							"properties": {
								"activity": "checkout"
							},
							"userId": "userIdTest",
							"type": "track",
							"messageId": "3c0abc14-96a2-4aed-9dfc-ee463832cc24",
							"originalTimestamp": "2022-10-17T15:32:44.202+05:30"
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
						"output": {
							"version": "1",
							"type": "REST",
							"method": "POST",
							"endpoint": "https://api.courier.com/inbound/rudderstack",
							"headers": {
								"Content-Type": "application/json",
								"Authorization": "Bearer dummyApiKey"
							},
							"params": {},
							"body": {
								"JSON": {
									"context": {
										"ip": "8.8.8.8"
									},
									"event": "trackTest",
									"properties": {
										"activity": "checkout"
									},
									"userId": "userIdTest",
									"type": "track",
									"messageId": "3c0abc14-96a2-4aed-9dfc-ee463832cc24",
									"originalTimestamp": "2022-10-17T15:32:44.202+05:30"
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