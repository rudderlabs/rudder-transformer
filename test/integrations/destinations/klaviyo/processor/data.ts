export const data = [
	{
		"name": "klaviyo",
		"description": "Profile updating call and subscribe user (old transformer)",
		"feature": "processor",
		"module": "destination",
		"version": "v0",
		"input": {
			"request": {
				"body": [
					{
						"destination": {
							"Config": {
								"publicApiKey": "dummyPublicApiKey",
								"privateApiKey": "dummyPrivateApiKey"
							}
						},
						"message": {
							"type": "identify",
							"sentAt": "2021-01-03T17:02:53.195Z",
							"userId": "user@1",
							"channel": "web",
							"context": {
								"os": {
									"name": "",
									"version": ""
								},
								"app": {
									"name": "RudderLabs JavaScript SDK",
									"build": "1.0.0",
									"version": "1.1.11",
									"namespace": "com.rudderlabs.javascript"
								},
								"traits": {
									"firstName": "Test",
									"lastName": "Rudderlabs",
									"email": "test@rudderstack.com",
									"phone": "+12 345 578 900",
									"userId": "user@1",
									"title": "Developer",
									"organization": "Rudder",
									"city": "Tokyo",
									"region": "Kanto",
									"country": "JP",
									"zip": "100-0001",
									"Flagged": false,
									"Residence": "Shibuya",
									"properties": {
										"listId": "XUepkK",
										"subscribe": true,
										"consent": [
											"email",
											"sms"
										]
									}
								},
								"locale": "en-US",
								"screen": {
									"density": 2
								},
								"library": {
									"name": "RudderLabs JavaScript SDK",
									"version": "1.1.11"
								},
								"campaign": {},
								"userAgent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10.16; rv:84.0) Gecko/20100101 Firefox/84.0"
							},
							"rudderId": "8f8fa6b5-8e24-489c-8e22-61f23f2e364f",
							"messageId": "2116ef8c-efc3-4ca4-851b-02ee60dad6ff",
							"anonymousId": "97c46c81-3140-456d-b2a9-690d70aaca35",
							"integrations": {
								"All": true
							},
							"originalTimestamp": "2021-01-03T17:02:53.193Z"
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
						"output":
						{
							"version": "1",
							"type": "REST",
							"userId": "",
							"method": "PATCH",
							"endpoint": "https://a.klaviyo.com/api/profiles/01GW3PHVY0MTCDGS0A1612HARX",
							"headers": {
								"Authorization": "Klaviyo-API-Key dummyPrivateApiKey",
								"Content-Type": "application/json",
								"Accept": "application/json",
								"revision": "2023-02-22"
							},
							"params": {},
							"body": {
								"JSON": {
									"data": {
										"type": "profile",
										"attributes": {
											"external_id": "user@1",
											"email": "test@rudderstack.com",
											"first_name": "Test",
											"last_name": "Rudderlabs",
											"phone_number": "+12 345 578 900",
											"title": "Developer",
											"organization": "Rudder",
											"location": {
												"city": "Tokyo",
												"region": "Kanto",
												"country": "JP",
												"zip": "100-0001"
											},
											"properties": {
												"Flagged": false,
												"Residence": "Shibuya"
											}
										},
										"id": "01GW3PHVY0MTCDGS0A1612HARX"
									}
								},
								"JSON_ARRAY": {},
								"XML": {},
								"FORM": {}
							},
							"files": {}
						},
						"statusCode": 200
					}, {
						"output":
						{
							"version": "1",
							"type": "REST",
							"method": "POST",
							"userId": "",
							"endpoint": "https://a.klaviyo.com/api/profile-subscription-bulk-create-jobs",
							"headers": {
								"Content-Type": "application/json",
								"Accept": "application/json",
								"Authorization": "Klaviyo-API-Key dummyPrivateApiKey",
								"revision": "2023-02-22"
							},
							"params": {},
							"body": {
								"JSON": {
									"data": {
										"type": "profile-subscription-bulk-create-job",
										"attributes": {
											"list_id": "XUepkK",
											"subscriptions": [
												{
													"email": "test@rudderstack.com",
													"phone_number": "+12 345 578 900",
													"channels": {
														"email": [
															"MARKETING"
														],
														"sms": [
															"MARKETING"
														]
													}
												}
											]
										}
									}
								},
								"JSON_ARRAY": {},
								"XML": {},
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
		"name": "klaviyo",
		"description": "Identify call for with flattenProperties enabled (old transformer)",
		"feature": "processor",
		"module": "destination",
		"version": "v0",
		"input": {
			"request": {
				"body": [
					{
						"destination": {
							"Config": {
								"publicApiKey": "dummyPublicApiKey",
								"privateApiKey": "dummyPrivateApiKey",
								"flattenProperties": true
							}
						},
						"message": {
							"type": "identify",
							"sentAt": "2021-01-03T17:02:53.195Z",
							"userId": "user@1",
							"channel": "web",
							"context": {
								"os": {
									"name": "",
									"version": ""
								},
								"app": {
									"name": "RudderLabs JavaScript SDK",
									"build": "1.0.0",
									"version": "1.1.11",
									"namespace": "com.rudderlabs.javascript"
								},
								"traits": {
									"firstName": "Test",
									"lastName": "Rudderlabs",
									"email": "test@rudderstack.com",
									"phone": "+12 345 578 900",
									"userId": "user@1",
									"title": "Developer",
									"organization": "Rudder",
									"city": "Tokyo",
									"region": "Kanto",
									"country": "JP",
									"zip": "100-0001",
									"Flagged": false,
									"Residence": "Shibuya",
									"friend": {
										"names": {
											"first": "Alice",
											"last": "Smith"
										},
										"age": 25
									},
									"properties": {
										"listId": "XUepkK",
										"subscribe": true,
										"consent": [
											"email",
											"sms"
										]
									}
								},
								"locale": "en-US",
								"screen": {
									"density": 2
								},
								"library": {
									"name": "RudderLabs JavaScript SDK",
									"version": "1.1.11"
								},
								"campaign": {},
								"userAgent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10.16; rv:84.0) Gecko/20100101 Firefox/84.0"
							},
							"rudderId": "8f8fa6b5-8e24-489c-8e22-61f23f2e364f",
							"messageId": "2116ef8c-efc3-4ca4-851b-02ee60dad6ff",
							"anonymousId": "97c46c81-3140-456d-b2a9-690d70aaca35",
							"integrations": {
								"All": true
							},
							"originalTimestamp": "2021-01-03T17:02:53.193Z"
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
						"output":
						{
							"version": "1",
							"type": "REST",
							"userId": "",
							"method": "PATCH",
							"endpoint": "https://a.klaviyo.com/api/profiles/01GW3PHVY0MTCDGS0A1612HARX",
							"headers": {
								"Authorization": "Klaviyo-API-Key dummyPrivateApiKey",
								"Content-Type": "application/json",
								"Accept": "application/json",
								"revision": "2023-02-22"
							},
							"params": {},
							"body": {
								"JSON": {
									"data": {
										"type": "profile",
										"attributes": {
											"external_id": "user@1",
											"email": "test@rudderstack.com",
											"first_name": "Test",
											"last_name": "Rudderlabs",
											"phone_number": "+12 345 578 900",
											"title": "Developer",
											"organization": "Rudder",
											"location": {
												"city": "Tokyo",
												"region": "Kanto",
												"country": "JP",
												"zip": "100-0001"
											},
											"properties": {
												"friend.age": 25,
												"friend.names.first": "Alice",
												"friend.names.last": "Smith",
												"Flagged": false,
												"Residence": "Shibuya"
											}
										},
										"id": "01GW3PHVY0MTCDGS0A1612HARX"
									}
								},
								"JSON_ARRAY": {},
								"XML": {},
								"FORM": {}
							},
							"files": {}
						},
						"statusCode": 200
					},
					{
						"output": {
							"version": "1",
							"type": "REST",
							"userId": "",
							"method": "POST",
							"endpoint": "https://a.klaviyo.com/api/profile-subscription-bulk-create-jobs",
							"headers": {
								"Content-Type": "application/json",
								"Accept": "application/json",
								"Authorization": "Klaviyo-API-Key dummyPrivateApiKey",
								"revision": "2023-02-22"
							},
							"params": {},
							"body": {
								"JSON": {
									"data": {
										"type": "profile-subscription-bulk-create-job",
										"attributes": {
											"list_id": "XUepkK",
											"subscriptions": [
												{
													"email": "test@rudderstack.com",
													"phone_number": "+12 345 578 900",
													"channels": {
														"email": [
															"MARKETING"
														],
														"sms": [
															"MARKETING"
														]
													}
												}
											]
										}
									}
								},
								"JSON_ARRAY": {},
								"XML": {},
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
		"name": "klaviyo",
		"description": "Profile updation call and subcribe user",
		"feature": "processor",
		"module": "destination",
		"version": "v0",
		"input": {
			"request": {
				"body": [
					{
						"destination": {
							"Config": {
								"publicApiKey": "dummyPublicApiKey",
								"privateApiKey": "dummyPrivateApiKeyforfailure"
							}
						},
						"message": {
							"type": "identify",
							"sentAt": "2021-01-03T17:02:53.195Z",
							"userId": "user@1",
							"channel": "web",
							"context": {
								"os": {
									"name": "",
									"version": ""
								},
								"app": {
									"name": "RudderLabs JavaScript SDK",
									"build": "1.0.0",
									"version": "1.1.11",
									"namespace": "com.rudderlabs.javascript"
								},
								"traits": {
									"firstName": "Test",
									"lastName": "Rudderlabs",
									"email": "test3@rudderstack.com",
									"phone": "+12 345 578 900",
									"userId": "user@1",
									"title": "Developer",
									"organization": "Rudder",
									"city": "Tokyo",
									"region": "Kanto",
									"country": "JP",
									"zip": "100-0001",
									"Flagged": false,
									"Residence": "Shibuya",
									"properties": {
										"listId": "XUepkK",
										"subscribe": true,
										"consent": [
											"email",
											"sms"
										]
									}
								},
								"locale": "en-US",
								"screen": {
									"density": 2
								},
								"library": {
									"name": "RudderLabs JavaScript SDK",
									"version": "1.1.11"
								},
								"campaign": {},
								"userAgent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10.16; rv:84.0) Gecko/20100101 Firefox/84.0"
							},
							"rudderId": "8f8fa6b5-8e24-489c-8e22-61f23f2e364f",
							"messageId": "2116ef8c-efc3-4ca4-851b-02ee60dad6ff",
							"anonymousId": "97c46c81-3140-456d-b2a9-690d70aaca35",
							"integrations": {
								"All": true
							},
							"originalTimestamp": "2021-01-03T17:02:53.193Z"
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
						"error": "{\"message\":\"Failed to create user due to \\\"\\\"\",\"destinationResponse\":\"\\\"\\\"\"}",
						"statTags": {
							"destType": "KLAVIYO",
							"errorCategory": "network",
							"errorType": "retryable",
							"feature": "processor",
							"implementation": "native",
							"module": "destination"
						},
						"statusCode": 500
					}
				]
			}
		}
	},
	{
		"name": "klaviyo",
		"description": "Profile updation call listId is not provided for subscribing the user",
		"feature": "processor",
		"module": "destination",
		"version": "v0",
		"input": {
			"request": {
				"body": [
					{
						"destination": {
							"Config": {
								"publicApiKey": "dummyPublicApiKey",
								"privateApiKey": "dummyPrivateApiKey"
							}
						},
						"message": {
							"type": "identify",
							"sentAt": "2021-01-03T17:02:53.195Z",
							"userId": "user@1",
							"channel": "web",
							"context": {
								"os": {
									"name": "",
									"version": ""
								},
								"app": {
									"name": "RudderLabs JavaScript SDK",
									"build": "1.0.0",
									"version": "1.1.11",
									"namespace": "com.rudderlabs.javascript"
								},
								"traits": {
									"firstName": "Test",
									"lastName": "Rudderlabs",
									"email": "test@rudderstack.com",
									"phone": "+12 345 578 900",
									"userId": "user@1",
									"title": "Developer",
									"organization": "Rudder",
									"city": "Tokyo",
									"region": "Kanto",
									"country": "JP",
									"zip": "100-0001",
									"Flagged": false,
									"Residence": "Shibuya",
									"properties": {
										"subscribe": false,
										"consent": [
											"email",
											"sms"
										]
									}
								},
								"locale": "en-US",
								"screen": {
									"density": 2
								},
								"library": {
									"name": "RudderLabs JavaScript SDK",
									"version": "1.1.11"
								},
								"campaign": {},
								"userAgent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10.16; rv:84.0) Gecko/20100101 Firefox/84.0"
							},
							"rudderId": "8f8fa6b5-8e24-489c-8e22-61f23f2e364f",
							"messageId": "2116ef8c-efc3-4ca4-851b-02ee60dad6ff",
							"anonymousId": "97c46c81-3140-456d-b2a9-690d70aaca35",
							"integrations": {
								"All": true
							},
							"originalTimestamp": "2021-01-03T17:02:53.193Z"
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
							"method": "PATCH",
							"endpoint": "https://a.klaviyo.com/api/profiles/01GW3PHVY0MTCDGS0A1612HARX",
							"headers": {
								"Authorization": "Klaviyo-API-Key dummyPrivateApiKey",
								"Content-Type": "application/json",
								"Accept": "application/json",
								"revision": "2023-02-22"
							},
							"params": {},
							"body": {
								"JSON": {
									"data": {
										"type": "profile",
										"attributes": {
											"external_id": "user@1",
											"email": "test@rudderstack.com",
											"first_name": "Test",
											"last_name": "Rudderlabs",
											"phone_number": "+12 345 578 900",
											"title": "Developer",
											"organization": "Rudder",
											"location": {
												"city": "Tokyo",
												"region": "Kanto",
												"country": "JP",
												"zip": "100-0001"
											},
											"properties": {
												"Flagged": false,
												"Residence": "Shibuya"
											}
										},
										"id": "01GW3PHVY0MTCDGS0A1612HARX"
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
		"name": "klaviyo",
		"description": "Identify call with enforceEmailAsPrimary enabled from UI",
		"feature": "processor",
		"module": "destination",
		"version": "v0",
		"input": {
			"request": {
				"body": [
					{
						"destination": {
							"Config": {
								"publicApiKey": "dummyPublicApiKey",
								"privateApiKey": "dummyPrivateApiKey",
								"enforceEmailAsPrimary": true
							}
						},
						"message": {
							"type": "identify",
							"sentAt": "2021-01-03T17:02:53.195Z",
							"userId": "user@1",
							"channel": "web",
							"context": {
								"os": {
									"name": "",
									"version": ""
								},
								"app": {
									"name": "RudderLabs JavaScript SDK",
									"build": "1.0.0",
									"version": "1.1.11",
									"namespace": "com.rudderlabs.javascript"
								},
								"traits": {
									"firstName": "Test",
									"lastName": "Rudderlabs",
									"email": "test@rudderstack.com",
									"phone": "+12 345 578 900",
									"userId": "user@1",
									"title": "Developer",
									"organization": "Rudder",
									"city": "Tokyo",
									"region": "Kanto",
									"country": "JP",
									"zip": "100-0001",
									"Flagged": false,
									"Residence": "Shibuya",
									"properties": {
										"listId": "XUepkK",
										"subscribe": true,
										"consent": [
											"email",
											"sms"
										]
									}
								},
								"locale": "en-US",
								"screen": {
									"density": 2
								},
								"library": {
									"name": "RudderLabs JavaScript SDK",
									"version": "1.1.11"
								},
								"campaign": {},
								"userAgent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10.16; rv:84.0) Gecko/20100101 Firefox/84.0"
							},
							"rudderId": "8f8fa6b5-8e24-489c-8e22-61f23f2e364f",
							"messageId": "2116ef8c-efc3-4ca4-851b-02ee60dad6ff",
							"anonymousId": "97c46c81-3140-456d-b2a9-690d70aaca35",
							"integrations": {
								"All": true
							},
							"originalTimestamp": "2021-01-03T17:02:53.193Z"
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
						"output":
						{
							"version": "1",
							"type": "REST",
							"userId": "",
							"method": "PATCH",
							"endpoint": "https://a.klaviyo.com/api/profiles/01GW3PHVY0MTCDGS0A1612HARX",
							"headers": {
								"Authorization": "Klaviyo-API-Key dummyPrivateApiKey",
								"Content-Type": "application/json",
								"Accept": "application/json",
								"revision": "2023-02-22"
							},
							"params": {},
							"body": {
								"JSON": {
									"data": {
										"type": "profile",
										"attributes": {
											"email": "test@rudderstack.com",
											"first_name": "Test",
											"last_name": "Rudderlabs",
											"phone_number": "+12 345 578 900",
											"title": "Developer",
											"organization": "Rudder",
											"location": {
												"city": "Tokyo",
												"region": "Kanto",
												"country": "JP",
												"zip": "100-0001"
											},
											"properties": {
												"Flagged": false,
												"Residence": "Shibuya",
												"_id": "user@1"
											}
										},
										"id": "01GW3PHVY0MTCDGS0A1612HARX"
									}
								},
								"JSON_ARRAY": {},
								"XML": {},
								"FORM": {}
							},
							"files": {}
						},
						"statusCode": 200
					},
					{
						"output": {
							"version": "1",
							"type": "REST",
							"userId": "",
							"method": "POST",
							"endpoint": "https://a.klaviyo.com/api/profile-subscription-bulk-create-jobs",
							"headers": {
								"Content-Type": "application/json",
								"Accept": "application/json",
								"Authorization": "Klaviyo-API-Key dummyPrivateApiKey",
								"revision": "2023-02-22"
							},
							"params": {},
							"body": {
								"JSON": {
									"data": {
										"type": "profile-subscription-bulk-create-job",
										"attributes": {
											"list_id": "XUepkK",
											"subscriptions": [
												{
													"email": "test@rudderstack.com",
													"phone_number": "+12 345 578 900",
													"channels": {
														"email": [
															"MARKETING"
														],
														"sms": [
															"MARKETING"
														]
													}
												}
											]
										}
									}
								},
								"JSON_ARRAY": {},
								"XML": {},
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
		"name": "klaviyo",
		"description": "Identify call without user custom Properties",
		"feature": "processor",
		"module": "destination",
		"version": "v0",
		"input": {
			"request": {
				"body": [
					{
						"destination": {
							"Config": {
								"publicApiKey": "dummyPublicApiKey",
								"privateApiKey": "dummyPrivateApiKey",
								"enforceEmailAsPrimary": false
							}
						},
						"message": {
							"type": "identify",
							"sentAt": "2021-01-03T17:02:53.195Z",
							"userId": "user@1",
							"channel": "web",
							"context": {
								"os": {
									"name": "",
									"version": ""
								},
								"app": {
									"name": "RudderLabs JavaScript SDK",
									"build": "1.0.0",
									"version": "1.1.11",
									"namespace": "com.rudderlabs.javascript"
								},
								"traits": {
									"firstName": "Test",
									"lastName": "Rudderlabs",
									"email": "test@rudderstack.com",
									"phone": "+12 345 578 900",
									"userId": "user@1",
									"title": "Developer",
									"organization": "Rudder",
									"city": "Tokyo",
									"region": "Kanto",
									"country": "JP",
									"zip": "100-0001",
									"properties": {
										"listId": "XUepkK",
										"subscribe": true,
										"consent": [
											"email",
											"sms"
										]
									}
								},
								"locale": "en-US",
								"screen": {
									"density": 2
								},
								"library": {
									"name": "RudderLabs JavaScript SDK",
									"version": "1.1.11"
								},
								"campaign": {},
								"userAgent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10.16; rv:84.0) Gecko/20100101 Firefox/84.0"
							},
							"rudderId": "8f8fa6b5-8e24-489c-8e22-61f23f2e364f",
							"messageId": "2116ef8c-efc3-4ca4-851b-02ee60dad6ff",
							"anonymousId": "97c46c81-3140-456d-b2a9-690d70aaca35",
							"integrations": {
								"All": true
							},
							"originalTimestamp": "2021-01-03T17:02:53.193Z"
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
							"userId": "",
							"method": "PATCH",
							"endpoint": "https://a.klaviyo.com/api/profiles/01GW3PHVY0MTCDGS0A1612HARX",
							"headers": {
								"Authorization": "Klaviyo-API-Key dummyPrivateApiKey",
								"Content-Type": "application/json",
								"Accept": "application/json",
								"revision": "2023-02-22"
							},
							"params": {},
							"body": {
								"JSON": {
									"data": {
										"type": "profile",
										"attributes": {
											"email": "test@rudderstack.com",
											"first_name": "Test",
											"last_name": "Rudderlabs",
											"phone_number": "+12 345 578 900",
											"external_id": "user@1",
											"title": "Developer",
											"organization": "Rudder",
											"location": {
												"city": "Tokyo",
												"region": "Kanto",
												"country": "JP",
												"zip": "100-0001"
											}
										},
										"id": "01GW3PHVY0MTCDGS0A1612HARX"
									}
								},
								"JSON_ARRAY": {},
								"XML": {},
								"FORM": {}
							},
							"files": {}
						},
						"statusCode": 200
					},
					{
						"output": {
							"version": "1",
							"type": "REST",
							"userId": "",
							"method": "POST",
							"endpoint": "https://a.klaviyo.com/api/profile-subscription-bulk-create-jobs",
							"headers": {
								"Content-Type": "application/json",
								"Accept": "application/json",
								"Authorization": "Klaviyo-API-Key dummyPrivateApiKey",
								"revision": "2023-02-22"
							},
							"params": {},
							"body": {
								"JSON": {
									"data": {
										"type": "profile-subscription-bulk-create-job",
										"attributes": {
											"list_id": "XUepkK",
											"subscriptions": [
												{
													"email": "test@rudderstack.com",
													"phone_number": "+12 345 578 900",
													"channels": {
														"email": [
															"MARKETING"
														],
														"sms": [
															"MARKETING"
														]
													}
												}
											]
										}
									}
								},
								"JSON_ARRAY": {},
								"XML": {},
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
		"name": "klaviyo",
		"description": "Identify call without email and phone & enforceEmailAsPrimary enabled from UI",
		"feature": "processor",
		"module": "destination",
		"version": "v0",
		"input": {
			"request": {
				"body": [
					{
						"destination": {
							"Config": {
								"publicApiKey": "dummyPublicApiKey",
								"privateApiKey": "dummyPrivateApiKey",
								"enforceEmailAsPrimary": true
							}
						},
						"message": {
							"type": "identify",
							"sentAt": "2021-01-03T17:02:53.195Z",
							"userId": "user@1",
							"channel": "web",
							"context": {
								"os": {
									"name": "",
									"version": ""
								},
								"app": {
									"name": "RudderLabs JavaScript SDK",
									"build": "1.0.0",
									"version": "1.1.11",
									"namespace": "com.rudderlabs.javascript"
								},
								"traits": {
									"firstName": "Test",
									"lastName": "Rudderlabs",
									"userId": "user@1",
									"title": "Developer",
									"organization": "Rudder",
									"city": "Tokyo",
									"region": "Kanto",
									"country": "JP",
									"zip": "100-0001",
									"Flagged": false,
									"Residence": "Shibuya",
									"properties": {
										"listId": "XUepkK",
										"subscribe": true,
										"consent": [
											"email",
											"sms"
										]
									}
								},
								"locale": "en-US",
								"screen": {
									"density": 2
								},
								"library": {
									"name": "RudderLabs JavaScript SDK",
									"version": "1.1.11"
								},
								"campaign": {},
								"userAgent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10.16; rv:84.0) Gecko/20100101 Firefox/84.0"
							},
							"rudderId": "8f8fa6b5-8e24-489c-8e22-61f23f2e364f",
							"messageId": "2116ef8c-efc3-4ca4-851b-02ee60dad6ff",
							"anonymousId": "97c46c81-3140-456d-b2a9-690d70aaca35",
							"integrations": {
								"All": true
							},
							"originalTimestamp": "2021-01-03T17:02:53.193Z"
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
						"error": "None of email and phone are present in the payload",
						"statTags": {
							"destType": "KLAVIYO",
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
		"name": "klaviyo",
		"description": "Screen event call",
		"feature": "processor",
		"module": "destination",
		"version": "v0",
		"input": {
			"request": {
				"body": [
					{
						"destination": {
							"Config": {
								"publicApiKey": "dummyPublicApiKey",
								"privateApiKey": "dummyPrivateApiKey"
							}
						},
						"message": {
							"type": "screen",
							"event": "TestEven001",
							"sentAt": "2021-01-25T16:12:02.048Z",
							"userId": "sajal12",
							"channel": "mobile",
							"context": {
								"os": {
									"name": "Android",
									"version": "10"
								},
								"app": {
									"name": "KlaviyoTest",
									"build": "1",
									"version": "1.0",
									"namespace": "com.rudderstack.android.rudderstack.sampleAndroidApp"
								},
								"device": {
									"id": "9c6bd77ea9da3e68",
									"name": "raphaelin",
									"type": "android",
									"model": "Redmi K20 Pro",
									"manufacturer": "Xiaomi"
								},
								"locale": "en-IN",
								"screen": {
									"width": 1080,
									"height": 2210,
									"density": 440
								},
								"traits": {
									"id": "user@1",
									"age": "22",
									"email": "test@rudderstack.com",
									"phone": "9112340375",
									"anonymousId": "9c6bd77ea9da3e68"
								},
								"library": {
									"name": "com.rudderstack.android.sdk.core",
									"version": "1.0.2"
								},
								"network": {
									"wifi": true,
									"carrier": "airtel",
									"cellular": true,
									"bluetooth": false
								},
								"timezone": "Asia/Kolkata",
								"userAgent": "Dalvik/2.1.0 (Linux; U; Android 10; Redmi K20 Pro MIUI/V12.0.4.0.QFKINXM)"
							},
							"rudderId": "b7b24f86-f7bf-46d8-b2b4-ccafc080239c",
							"messageId": "1611588776408-ee5a3212-fbf9-4cbb-bbad-3ed0f7c6a2ce",
							"properties": {
								"PreviouslyVicePresident": true,
								"YearElected": 1801,
								"VicePresidents": [
									"Aaron Burr",
									"George Clinton"
								]
							},
							"anonymousId": "9c6bd77ea9da3e68",
							"integrations": {
								"All": true
							},
							"originalTimestamp": "2021-01-25T15:32:56.409Z"
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
							"endpoint": "https://a.klaviyo.com/api/events",
							"headers": {
								"Accept": "application/json",
								"Authorization": "Klaviyo-API-Key dummyPrivateApiKey",
								"Content-Type": "application/json",
								"revision": "2023-02-22"
							},
							"params": {},
							"body": {
								"JSON": {
									"data": {
										"type": "event",
										"attributes": {
											"metric": {
												"name": "TestEven001"
											},
											"properties": {
												"PreviouslyVicePresident": true,
												"YearElected": 1801,
												"VicePresidents": [
													"Aaron Burr",
													"George Clinton"
												]
											},
											"profile": {
												"$email": "test@rudderstack.com",
												"$phone_number": "9112340375",
												"$id": "sajal12",
												"age": "22"
											}
										}
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
		"name": "klaviyo",
		"description": "Track event call with flatten properties enabled",
		"feature": "processor",
		"module": "destination",
		"version": "v0",
		"input": {
			"request": {
				"body": [
					{
						"destination": {
							"Config": {
								"publicApiKey": "dummyPublicApiKey",
								"privateApiKey": "dummyPrivateApiKey",
								"flattenProperties": true
							}
						},
						"message": {
							"type": "track",
							"event": "TestEven001",
							"sentAt": "2021-01-25T16:12:02.048Z",
							"userId": "sajal12",
							"channel": "mobile",
							"context": {
								"os": {
									"name": "Android",
									"version": "10"
								},
								"app": {
									"name": "KlaviyoTest",
									"build": "1",
									"version": "1.0",
									"namespace": "com.rudderstack.android.rudderstack.sampleAndroidApp"
								},
								"device": {
									"id": "9c6bd77ea9da3e68",
									"name": "raphaelin",
									"type": "android",
									"model": "Redmi K20 Pro",
									"manufacturer": "Xiaomi"
								},
								"locale": "en-IN",
								"screen": {
									"width": 1080,
									"height": 2210,
									"density": 440
								},
								"traits": {
									"id": "user@1",
									"age": "22",
									"email": "test@rudderstack.com",
									"phone": "9112340375",
									"anonymousId": "9c6bd77ea9da3e68",
									"plan_details": {
										"plan_type": "gold",
										"duration": "3 months"
									}
								},
								"library": {
									"name": "com.rudderstack.android.sdk.core",
									"version": "1.0.2"
								},
								"network": {
									"wifi": true,
									"carrier": "airtel",
									"cellular": true,
									"bluetooth": false
								},
								"timezone": "Asia/Kolkata",
								"userAgent": "Dalvik/2.1.0 (Linux; U; Android 10; Redmi K20 Pro MIUI/V12.0.4.0.QFKINXM)"
							},
							"rudderId": "b7b24f86-f7bf-46d8-b2b4-ccafc080239c",
							"messageId": "1611588776408-ee5a3212-fbf9-4cbb-bbad-3ed0f7c6a2ce",
							"properties": {
								"vicePresdentInfo": {
									"PreviouslVicePresident": true,
									"YearElected": 1801,
									"VicePresidents": [
										"AaronBurr",
										"GeorgeClinton"
									]
								}
							},
							"anonymousId": "9c6bd77ea9da3e68",
							"integrations": {
								"All": true
							},
							"originalTimestamp": "2021-01-25T15:32:56.409Z"
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
							"endpoint": "https://a.klaviyo.com/api/events",
							"headers": {
								"Accept": "application/json",
								"Authorization": "Klaviyo-API-Key dummyPrivateApiKey",
								"Content-Type": "application/json",
								"revision": "2023-02-22"
							},
							"params": {},
							"body": {
								"JSON": {
									"data": {
										"type": "event",
										"attributes": {
											"metric": {
												"name": "TestEven001"
											},
											"properties": {
												"vicePresdentInfo.PreviouslVicePresident": true,
												"vicePresdentInfo.VicePresidents": [
													"AaronBurr",
													"GeorgeClinton"
												],
												"vicePresdentInfo.YearElected": 1801
											},
											"profile": {
												"$email": "test@rudderstack.com",
												"$phone_number": "9112340375",
												"$id": "sajal12",
												"age": "22",
												"plan_details.plan_type": "gold",
												"plan_details.duration": "3 months"
											}
										}
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
		"name": "klaviyo",
		"description": "Track event call",
		"feature": "processor",
		"module": "destination",
		"version": "v0",
		"input": {
			"request": {
				"body": [
					{
						"destination": {
							"Config": {
								"publicApiKey": "dummyPublicApiKey",
								"privateApiKey": "dummyPrivateApiKey"
							}
						},
						"message": {
							"type": "track",
							"event": "TestEven002",
							"sentAt": "2021-01-25T16:12:02.048Z",
							"userId": "sajal12",
							"channel": "mobile",
							"context": {
								"os": {
									"name": "Android",
									"version": "10"
								},
								"app": {
									"name": "KlaviyoTest",
									"build": "1",
									"version": "1.0",
									"namespace": "com.rudderstack.android.rudderstack.sampleAndroidApp"
								},
								"device": {
									"id": "9c6bd77ea9da3e68",
									"name": "raphaelin",
									"type": "android",
									"model": "Redmi K20 Pro",
									"manufacturer": "Xiaomi"
								},
								"locale": "en-IN",
								"screen": {
									"width": 1080,
									"height": 2210,
									"density": 440
								},
								"traits": {
									"id": "user@1",
									"age": "22",
									"name": "Test",
									"email": "test@rudderstack.com",
									"phone": "9112340375",
									"anonymousId": "9c6bd77ea9da3e68",
									"description": "Sample description"
								},
								"library": {
									"name": "com.rudderstack.android.sdk.core",
									"version": "1.0.2"
								},
								"network": {
									"wifi": true,
									"carrier": "airtel",
									"cellular": true,
									"bluetooth": false
								},
								"timezone": "Asia/Kolkata",
								"userAgent": "Dalvik/2.1.0 (Linux; U; Android 10; Redmi K20 Pro MIUI/V12.0.4.0.QFKINXM)"
							},
							"rudderId": "b7b24f86-f7bf-46d8-b2b4-ccafc080239c",
							"messageId": "1611588776408-ee5a3212-fbf9-4cbb-bbad-3ed0f7c6a2ce",
							"properties": {
								"PreviouslyVicePresident": true,
								"YearElected": 1801,
								"VicePresidents": [
									"Aaron Burr",
									"George Clinton"
								],
								"revenue": 3000
							},
							"anonymousId": "9c6bd77ea9da3e68",
							"integrations": {
								"All": true
							},
							"originalTimestamp": "2021-01-25T15:32:56.409Z"
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
							"endpoint": "https://a.klaviyo.com/api/events",
							"headers": {
								"Accept": "application/json",
								"Authorization": "Klaviyo-API-Key dummyPrivateApiKey",
								"Content-Type": "application/json",
								"revision": "2023-02-22"
							},
							"params": {},
							"body": {
								"JSON": {
									"data": {
										"type": "event",
										"attributes": {
											"metric": {
												"name": "TestEven002"
											},
											"properties": {
												"PreviouslyVicePresident": true,
												"YearElected": 1801,
												"VicePresidents": [
													"Aaron Burr",
													"George Clinton"
												]
											},
											"profile": {
												"$email": "test@rudderstack.com",
												"$phone_number": "9112340375",
												"$id": "sajal12",
												"age": "22",
												"name": "Test",
												"description": "Sample description"
											},
											"value": 3000
										}
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
		"name": "klaviyo",
		"description": "Track event call, with make email or phone as primary identifier toggle on",
		"feature": "processor",
		"module": "destination",
		"version": "v0",
		"input": {
			"request": {
				"body": [
					{
						"destination": {
							"Config": {
								"publicApiKey": "dummyPublicApiKey",
								"privateApiKey": "dummyPrivateApiKey",
								"enforceEmailAsPrimary": true
							}
						},
						"message": {
							"type": "track",
							"event": "TestEven001",
							"sentAt": "2021-01-25T16:12:02.048Z",
							"userId": "sajal12",
							"channel": "mobile",
							"context": {
								"os": {
									"name": "Android",
									"version": "10"
								},
								"app": {
									"name": "KlaviyoTest",
									"build": "1",
									"version": "1.0",
									"namespace": "com.rudderstack.android.rudderstack.sampleAndroidApp"
								},
								"device": {
									"id": "9c6bd77ea9da3e68",
									"name": "raphaelin",
									"type": "android",
									"model": "Redmi K20 Pro",
									"manufacturer": "Xiaomi"
								},
								"locale": "en-IN",
								"screen": {
									"width": 1080,
									"height": 2210,
									"density": 440
								},
								"traits": {
									"id": "user@1",
									"age": "22",
									"email": "test@rudderstack.com",
									"phone": "9112340375",
									"anonymousId": "9c6bd77ea9da3e68"
								},
								"library": {
									"name": "com.rudderstack.android.sdk.core",
									"version": "1.0.2"
								},
								"network": {
									"wifi": true,
									"carrier": "airtel",
									"cellular": true,
									"bluetooth": false
								},
								"timezone": "Asia/Kolkata",
								"userAgent": "Dalvik/2.1.0 (Linux; U; Android 10; Redmi K20 Pro MIUI/V12.0.4.0.QFKINXM)"
							},
							"rudderId": "b7b24f86-f7bf-46d8-b2b4-ccafc080239c",
							"messageId": "1611588776408-ee5a3212-fbf9-4cbb-bbad-3ed0f7c6a2ce",
							"properties": {
								"PreviouslyVicePresident": true,
								"YearElected": 1801,
								"VicePresidents": [
									"Aaron Burr",
									"George Clinton"
								]
							},
							"anonymousId": "9c6bd77ea9da3e68",
							"integrations": {
								"All": true
							},
							"originalTimestamp": "2021-01-25T15:32:56.409Z"
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
							"endpoint": "https://a.klaviyo.com/api/events",
							"headers": {
								"Accept": "application/json",
								"Authorization": "Klaviyo-API-Key dummyPrivateApiKey",
								"Content-Type": "application/json",
								"revision": "2023-02-22"
							},
							"params": {},
							"body": {
								"JSON": {
									"data": {
										"type": "event",
										"attributes": {
											"metric": {
												"name": "TestEven001"
											},
											"properties": {
												"PreviouslyVicePresident": true,
												"YearElected": 1801,
												"VicePresidents": [
													"Aaron Burr",
													"George Clinton"
												]
											},
											"profile": {
												"$email": "test@rudderstack.com",
												"$phone_number": "9112340375",
												"age": "22",
												"_id": "sajal12"
											}
										}
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
		"name": "klaviyo",
		"description": "Track event call, without email and phone & with (make email or phone as primary identifier) toggle on",
		"feature": "processor",
		"module": "destination",
		"version": "v0",
		"input": {
			"request": {
				"body": [
					{
						"destination": {
							"Config": {
								"publicApiKey": "dummyPublicApiKey",
								"privateApiKey": "dummyPrivateApiKey",
								"enforceEmailAsPrimary": true
							}
						},
						"message": {
							"type": "track",
							"event": "TestEven001",
							"sentAt": "2021-01-25T16:12:02.048Z",
							"userId": "sajal12",
							"channel": "mobile",
							"context": {
								"os": {
									"name": "Android",
									"version": "10"
								},
								"app": {
									"name": "KlaviyoTest",
									"build": "1",
									"version": "1.0",
									"namespace": "com.rudderstack.android.rudderstack.sampleAndroidApp"
								},
								"device": {
									"id": "9c6bd77ea9da3e68",
									"name": "raphaelin",
									"type": "android",
									"model": "Redmi K20 Pro",
									"manufacturer": "Xiaomi"
								},
								"locale": "en-IN",
								"screen": {
									"width": 1080,
									"height": 2210,
									"density": 440
								},
								"traits": {
									"id": "user@1",
									"age": "22",
									"anonymousId": "9c6bd77ea9da3e68"
								},
								"library": {
									"name": "com.rudderstack.android.sdk.core",
									"version": "1.0.2"
								},
								"network": {
									"wifi": true,
									"carrier": "airtel",
									"cellular": true,
									"bluetooth": false
								},
								"timezone": "Asia/Kolkata",
								"userAgent": "Dalvik/2.1.0 (Linux; U; Android 10; Redmi K20 Pro MIUI/V12.0.4.0.QFKINXM)"
							},
							"rudderId": "b7b24f86-f7bf-46d8-b2b4-ccafc080239c",
							"messageId": "1611588776408-ee5a3212-fbf9-4cbb-bbad-3ed0f7c6a2ce",
							"properties": {
								"PreviouslyVicePresident": true,
								"YearElected": 1801,
								"VicePresidents": [
									"Aaron Burr",
									"George Clinton"
								]
							},
							"anonymousId": "9c6bd77ea9da3e68",
							"integrations": {
								"All": true
							},
							"originalTimestamp": "2021-01-25T15:32:56.409Z"
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
						"error": "None of email and phone are present in the payload",
						"statTags": {
							"destType": "KLAVIYO",
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
		"name": "klaviyo",
		"description": "group call",
		"feature": "processor",
		"module": "destination",
		"version": "v0",
		"input": {
			"request": {
				"body": [
					{
						"destination": {
							"Config": {
								"publicApiKey": "dummyPublicApiKey",
								"privateApiKey": "dummyPrivateApiKey"
							}
						},
						"message": {
							"userId": "user123",
							"type": "group",
							"groupId": "XUepkK",
							"traits": {
								"subscribe": true
							},
							"context": {
								"traits": {
									"email": "test@rudderstack.com",
									"phone": "+12 345 678 900",
									"consent": [
										"email"
									]
								},
								"ip": "14.5.67.21",
								"library": {
									"name": "http"
								}
							},
							"timestamp": "2020-01-21T00:21:34.208Z"
						}
					}
				]
			}
		},
		"output": {
			"response": {
				"status": 200,
				"body": [
					{ "output": { "body": { "FORM": {}, "JSON": { "data": { "attributes": { "list_id": "XUepkK", "subscriptions": [{ "email": "test@rudderstack.com", "phone_number": "+12 345 678 900" }] }, "type": "profile-subscription-bulk-create-job" } }, "JSON_ARRAY": {}, "XML": {} }, "endpoint": "https://a.klaviyo.com/api/profile-subscription-bulk-create-jobs", "files": {}, "headers": { "Accept": "application/json", "Authorization": "Klaviyo-API-Key dummyPrivateApiKey", "Content-Type": "application/json", "revision": "2023-02-22" }, "method": "POST", "params": {}, "type": "REST", "userId": "", "version": "1" }, "statusCode": 200 }
				]
			}
		}
	},
	{
		"name": "klaviyo",
		"description": "group call without groupId",
		"feature": "processor",
		"module": "destination",
		"version": "v0",
		"input": {
			"request": {
				"body": [
					{
						"destination": {
							"Config": {
								"publicApiKey": "dummyPublicApiKey",
								"privateApiKey": "dummyPrivateApiKey"
							}
						},
						"message": {
							"userId": "user123",
							"type": "group",
							"groupId": "",
							"traits": {
								"subscribe": true
							},
							"context": {
								"traits": {
									"email": "test@rudderstack.com",
									"phone": "+12 345 678 900",
									"consent": "email"
								},
								"ip": "14.5.67.21",
								"library": {
									"name": "http"
								}
							},
							"timestamp": "2020-01-21T00:21:34.208Z"
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
						"error": "groupId is a required field for group events",
						"statTags": {
							"destType": "KLAVIYO",
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
		"name": "klaviyo",
		"description": "[Error]: Check for unsupported message type",
		"feature": "processor",
		"module": "destination",
		"version": "v0",
		"input": {
			"request": {
				"body": [
					{
						"destination": {
							"Config": {
								"publicApiKey": "dummyPublicApiKey",
								"privateApiKey": "dummyPrivateApiKey"
							}
						},
						"message": {
							"userId": "user123",
							"type": "random",
							"groupId": "XUepkK",
							"traits": {
								"subscribe": true
							},
							"context": {
								"traits": {
									"email": "test@rudderstack.com",
									"phone": "+12 345 678 900",
									"consent": "email"
								},
								"ip": "14.5.67.21",
								"library": {
									"name": "http"
								}
							},
							"timestamp": "2020-01-21T00:21:34.208Z"
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
						"error": "Event type random is not supported",
						"statTags": {
							"destType": "KLAVIYO",
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
		"name": "klaviyo",
		"description": "Track call with Ecom events (Viewed Product)",
		"feature": "processor",
		"module": "destination",
		"version": "v0",
		"input": {
			"request": {
				"body": [
					{
						"destination": {
							"Config": {
								"publicApiKey": "dummyPublicApiKey",
								"privateApiKey": "dummyPrivateApiKey"
							}
						},
						"message": {
							"type": "track",
							"event": "product viewed",
							"sentAt": "2021-01-25T16:12:02.048Z",
							"userId": "sajal12",
							"channel": "mobile",
							"context": {
								"os": {
									"name": "Android",
									"version": "10"
								},
								"app": {
									"name": "KlaviyoTest",
									"build": "1",
									"version": "1.0",
									"namespace": "com.rudderstack.android.rudderstack.sampleAndroidApp"
								},
								"device": {
									"id": "9c6bd77ea9da3e68",
									"name": "raphaelin",
									"type": "android",
									"model": "Redmi K20 Pro",
									"manufacturer": "Xiaomi"
								},
								"locale": "en-IN",
								"screen": {
									"width": 1080,
									"height": 2210,
									"density": 440
								},
								"traits": {
									"id": "user@1",
									"age": "22",
									"name": "Test",
									"email": "test@rudderstack.com",
									"phone": "9112340375",
									"anonymousId": "9c6bd77ea9da3e68",
									"description": "Sample description"
								},
								"library": {
									"name": "com.rudderstack.android.sdk.core",
									"version": "1.0.2"
								},
								"network": {
									"wifi": true,
									"carrier": "airtel",
									"cellular": true,
									"bluetooth": false
								},
								"timezone": "Asia/Kolkata",
								"userAgent": "Dalvik/2.1.0 (Linux; U; Android 10; Redmi K20 Pro MIUI/V12.0.4.0.QFKINXM)"
							},
							"rudderId": "b7b24f86-f7bf-46d8-b2b4-ccafc080239c",
							"messageId": "1611588776408-ee5a3212-fbf9-4cbb-bbad-3ed0f7c6a2ce",
							"properties": {
								"name": "test product",
								"product_id": "1114",
								"sku": "WINNIePuh12",
								"image_url": "http://www.example.com/path/to/product/image.png",
								"url": "http://www.example.com/path/to/product",
								"brand": "Not for Kids",
								"price": 9.9,
								"categories": [
									"Fiction",
									"Children"
								]
							},
							"anonymousId": "9c6bd77ea9da3e68",
							"integrations": {
								"All": true
							},
							"originalTimestamp": "2021-01-25T15:32:56.409Z"
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
							"endpoint": "https://a.klaviyo.com/api/events",
							"headers": {
								"Authorization": "Klaviyo-API-Key dummyPrivateApiKey",
								"Content-Type": "application/json",
								"Accept": "application/json",
								"revision": "2023-02-22"
							},
							"params": {},
							"body": {
								"JSON": {
									"data": {
										"type": "event",
										"attributes": {
											"metric": {
												"name": "Viewed Product"
											},
											"profile": {
												"$email": "test@rudderstack.com",
												"$phone_number": "9112340375",
												"$id": "sajal12",
												"age": "22",
												"name": "Test",
												"description": "Sample description"
											},
											"properties": {
												"ProductName": "test product",
												"ProductID": "1114",
												"SKU": "WINNIePuh12",
												"ImageURL": "http://www.example.com/path/to/product/image.png",
												"URL": "http://www.example.com/path/to/product",
												"Brand": "Not for Kids",
												"Price": 9.9,
												"Categories": [
													"Fiction",
													"Children"
												]
											}
										}
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
		"name": "klaviyo",
		"description": "Track call with Ecom events (Checkout Started) with enabled flattenProperties",
		"feature": "processor",
		"module": "destination",
		"version": "v0",
		"input": {
			"request": {
				"body": [
					{
						"destination": {
							"Config": {
								"publicApiKey": "dummyPublicApiKey",
								"privateApiKey": "dummyPrivateApiKey",
								"flattenProperties": true
							}
						},
						"message": {
							"type": "track",
							"event": "checkout started",
							"sentAt": "2021-01-25T16:12:02.048Z",
							"userId": "sajal12",
							"channel": "mobile",
							"context": {
								"os": {
									"name": "Android",
									"version": "10"
								},
								"app": {
									"name": "KlaviyoTest",
									"build": "1",
									"version": "1.0",
									"namespace": "com.rudderstack.android.rudderstack.sampleAndroidApp"
								},
								"device": {
									"id": "9c6bd77ea9da3e68",
									"name": "raphaelin",
									"type": "android",
									"model": "Redmi K20 Pro",
									"manufacturer": "Xiaomi"
								},
								"locale": "en-IN",
								"screen": {
									"width": 1080,
									"height": 2210,
									"density": 440
								},
								"traits": {
									"id": "user@1",
									"age": "22",
									"name": "Test",
									"email": "test@rudderstack.com",
									"phone": "9112340375",
									"anonymousId": "9c6bd77ea9da3e68",
									"description": "Sample description"
								},
								"library": {
									"name": "com.rudderstack.android.sdk.core",
									"version": "1.0.2"
								},
								"network": {
									"wifi": true,
									"carrier": "airtel",
									"cellular": true,
									"bluetooth": false
								},
								"timezone": "Asia/Kolkata",
								"userAgent": "Dalvik/2.1.0 (Linux; U; Android 10; Redmi K20 Pro MIUI/V12.0.4.0.QFKINXM)"
							},
							"rudderId": "b7b24f86-f7bf-46d8-b2b4-ccafc080239c",
							"messageId": "1611588776408-ee5a3212-fbf9-4cbb-bbad-3ed0f7c6a2ce",
							"properties": {
								"order_id": "1234",
								"affiliation": "Apple Store",
								"value": 20,
								"revenue": 15,
								"shipping": 4,
								"tax": 1,
								"discount": 1.5,
								"coupon": "ImagePro",
								"currency": "USD",
								"products": [
									{
										"product_id": "123",
										"sku": "G-32",
										"name": "Monopoly",
										"price": 14,
										"quantity": 1,
										"category": "Games",
										"url": "https://www.website.com/product/path",
										"image_url": "https://www.website.com/product/path.jpg"
									},
									{
										"product_id": "345",
										"sku": "F-32",
										"name": "UNO",
										"price": 3.45,
										"quantity": 2,
										"category": "Games"
									}
								]
							},
							"anonymousId": "9c6bd77ea9da3e68",
							"integrations": {
								"All": true
							},
							"originalTimestamp": "2021-01-25T15:32:56.409Z"
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
							"endpoint": "https://a.klaviyo.com/api/events",
							"headers": {
								"Authorization": "Klaviyo-API-Key dummyPrivateApiKey",
								"Content-Type": "application/json",
								"Accept": "application/json",
								"revision": "2023-02-22"
							},
							"params": {},
							"body": {
								"JSON": {
									"data": {
										"type": "event",
										"attributes": {
											"metric": {
												"name": "Started Checkout"
											},
											"properties": {
												"$event_id": "1234",
												"$value": 20,
												"items[0].ProductID": "123",
												"items[0].SKU": "G-32",
												"items[0].ProductName": "Monopoly",
												"items[0].Quantity": 1,
												"items[0].ItemPrice": 14,
												"items[0].ProductURL": "https://www.website.com/product/path",
												"items[0].ImageURL": "https://www.website.com/product/path.jpg",
												"items[1].ProductID": "345",
												"items[1].SKU": "F-32",
												"items[1].ProductName": "UNO",
												"items[1].Quantity": 2,
												"items[1].ItemPrice": 3.45
											},
											"profile": {
												"$email": "test@rudderstack.com",
												"$phone_number": "9112340375",
												"$id": "sajal12",
												"age": "22",
												"name": "Test",
												"description": "Sample description"
											}
										}
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
		"name": "klaviyo",
		"description": "Track call with Ecom events (Added to Cart) with properties.products",
		"feature": "processor",
		"module": "destination",
		"version": "v0",
		"input": {
			"request": {
				"body": [
					{
						"destination": {
							"Config": {
								"publicApiKey": "dummyPublicApiKey",
								"privateApiKey": "dummyPrivateApiKey"
							}
						},
						"message": {
							"type": "track",
							"event": "product added",
							"sentAt": "2021-01-25T16:12:02.048Z",
							"userId": "sajal12",
							"channel": "mobile",
							"context": {
								"os": {
									"name": "Android",
									"version": "10"
								},
								"app": {
									"name": "KlaviyoTest",
									"build": "1",
									"version": "1.0",
									"namespace": "com.rudderstack.android.rudderstack.sampleAndroidApp"
								},
								"device": {
									"id": "9c6bd77ea9da3e68",
									"name": "raphaelin",
									"type": "android",
									"model": "Redmi K20 Pro",
									"manufacturer": "Xiaomi"
								},
								"locale": "en-IN",
								"screen": {
									"width": 1080,
									"height": 2210,
									"density": 440
								},
								"traits": {
									"id": "user@1",
									"age": "22",
									"name": "Test",
									"email": "test@rudderstack.com",
									"phone": "9112340375",
									"anonymousId": "9c6bd77ea9da3e68",
									"description": "Sample description"
								},
								"library": {
									"name": "com.rudderstack.android.sdk.core",
									"version": "1.0.2"
								},
								"network": {
									"wifi": true,
									"carrier": "airtel",
									"cellular": true,
									"bluetooth": false
								},
								"timezone": "Asia/Kolkata",
								"userAgent": "Dalvik/2.1.0 (Linux; U; Android 10; Redmi K20 Pro MIUI/V12.0.4.0.QFKINXM)"
							},
							"rudderId": "b7b24f86-f7bf-46d8-b2b4-ccafc080239c",
							"messageId": "1611588776408-ee5a3212-fbf9-4cbb-bbad-3ed0f7c6a2ce",
							"properties": {
								"order_id": "1234",
								"value": 12.12,
								"categories": [
									"Fiction3",
									"Children3"
								],
								"checkout_url": "http://www.heythere.com",
								"item_names": [
									"book1",
									"book2"
								],
								"products": [
									{
										"product_id": "b1pid",
										"sku": "123x",
										"name": "book1",
										"url": "heyther.com",
										"price": 12
									},
									{
										"product_id": "b2pid",
										"sku": "123x",
										"name": "book2",
										"url": "heyther2.com",
										"price": 14
									}
								]
							},
							"anonymousId": "9c6bd77ea9da3e68",
							"integrations": {
								"All": true
							},
							"originalTimestamp": "2021-01-25T15:32:56.409Z"
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
							"endpoint": "https://a.klaviyo.com/api/events",
							"headers": {
								"Authorization": "Klaviyo-API-Key dummyPrivateApiKey",
								"Content-Type": "application/json",
								"Accept": "application/json",
								"revision": "2023-02-22"
							},
							"params": {},
							"body": {
								"JSON": {
									"data": {
										"type": "event",
										"attributes": {
											"metric": {
												"name": "Added to Cart"
											},
											"profile": {
												"$email": "test@rudderstack.com",
												"$phone_number": "9112340375",
												"$id": "sajal12",
												"age": "22",
												"name": "Test",
												"description": "Sample description"
											},
											"properties": {
												"$value": 12.12,
												"AddedItemCategories": [
													"Fiction3",
													"Children3"
												],
												"ItemNames": [
													"book1",
													"book2"
												],
												"CheckoutURL": "http://www.heythere.com",
												"items": [
													{
														"ProductID": "b1pid",
														"SKU": "123x",
														"ProductName": "book1",
														"ItemPrice": 12,
														"ProductURL": "heyther.com"
													},
													{
														"ProductID": "b2pid",
														"SKU": "123x",
														"ProductName": "book2",
														"ItemPrice": 14,
														"ProductURL": "heyther2.com"
													}
												]
											}
										}
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
	}
]