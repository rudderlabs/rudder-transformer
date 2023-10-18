export const data = [
	{
		"name": "salesforce",
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
								"initialAccessToken": "dummyInitialAccessToken",
								"password": "dummyPassword1",
								"userName": "testsalesforce1453@gmail.com"
							},
							"DestinationDefinition": {
								"DisplayName": "Salesforce",
								"ID": "1T96GHZ0YZ1qQSLULHCoJkow9KC",
								"Name": "SALESFORCE"
							},
							"Enabled": true,
							"ID": "1WqFFH5esuVPnUgHkvEoYxDcX3y",
							"Name": "tst",
							"Transformations": []
						},
						"message": {
							"anonymousId": "1e7673da-9473-49c6-97f7-da848ecafa76",
							"channel": "web",
							"context": {
								"app": {
									"build": "1.0.0",
									"name": "RudderLabs JavaScript SDK",
									"namespace": "com.rudderlabs.javascript",
									"version": "1.0.0"
								},
								"ip": "0.0.0.0",
								"library": {
									"name": "RudderLabs JavaScript SDK",
									"version": "1.0.0"
								},
								"locale": "en-US",
								"os": {
									"name": "",
									"version": ""
								},
								"screen": {
									"density": 2
								},
								"traits": {
									"anonymousId": "1e7673da-9473-49c6-97f7-da848ecafa76",
									"company": "Initech",
									"address": {
										"city": "east greenwich",
										"country": "USA",
										"state": "California",
										"street": "19123 forest lane",
										"postalCode": "94115"
									},
									"email": "peter.gibbons@initech.com",
									"name": "Peter Gibbons",
									"phone": "570-690-4150",
									"rating": "Hot",
									"title": "VP of Derp"
								},
								"userAgent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_2) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/79.0.3945.130 Safari/537.36"
							},
							"integrations": {
								"All": true
							},
							"messageId": "f19c35da-e9de-4c6e-b6e5-9e60cccc12c8",
							"originalTimestamp": "2020-01-27T12:20:55.301Z",
							"receivedAt": "2020-01-27T17:50:58.657+05:30",
							"request_ip": "14.98.244.60",
							"sentAt": "2020-01-27T12:20:56.849Z",
							"timestamp": "2020-01-27T17:50:57.109+05:30",
							"type": "identify",
							"userId": "1e7673da-9473-49c6-97f7-da848ecafa76"
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
						"error": "Salesforce Request Failed: \"400\" due to \"{\"error\":\"invalid_grant\",\"error_description\":\"authentication failure\"}\", (Aborted) :- authentication failed during fetching access token.",
						"statTags": {
							"errorCategory": "network",
							"errorType": "aborted",
							"destType": "SALESFORCE",
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
		"name": "salesforce",
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
								"initialAccessToken": "dummyInitialAccessToken",
								"password": "dummyPassword1",
								"userName": "testsalesforce1453@gmail.com"
							},
							"DestinationDefinition": {
								"DisplayName": "Salesforce",
								"ID": "1T96GHZ0YZ1qQSLULHCoJkow9KC",
								"Name": "SALESFORCE"
							},
							"Enabled": true,
							"ID": "1WqFFH5esuVPnUgHkvEoYxDcX3y",
							"Name": "tst",
							"Transformations": []
						},
						"message": {
							"anonymousId": "1e7673da-9473-49c6-97f7-da848ecafa76",
							"channel": "web",
							"context": {
								"app": {
									"build": "1.0.0",
									"name": "RudderLabs JavaScript SDK",
									"namespace": "com.rudderlabs.javascript",
									"version": "1.0.0"
								},
								"ip": "0.0.0.0",
								"library": {
									"name": "RudderLabs JavaScript SDK",
									"version": "1.0.0"
								},
								"locale": "en-US",
								"os": {
									"name": "",
									"version": ""
								},
								"screen": {
									"density": 2
								},
								"userAgent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_2) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/79.0.3945.130 Safari/537.36"
							},
							"integrations": {
								"All": true
							},
							"traits": {
								"anonymousId": "1e7673da-9473-49c6-97f7-da848ecafa76",
								"company": "Initech",
								"address": {
									"city": "east greenwich",
									"country": "USA",
									"state": "California",
									"street": "19123 forest lane",
									"postalCode": "94115"
								},
								"email": "peter.gibbons@initech.com",
								"name": "Peter Gibbons",
								"phone": "570-690-4150",
								"rating": "Hot",
								"title": "VP of Derp"
							},
							"messageId": "f19c35da-e9de-4c6e-b6e5-9e60cccc12c8",
							"originalTimestamp": "2020-01-27T12:20:55.301Z",
							"receivedAt": "2020-01-27T17:50:58.657+05:30",
							"request_ip": "14.98.244.60",
							"sentAt": "2020-01-27T12:20:56.849Z",
							"timestamp": "2020-01-27T17:50:57.109+05:30",
							"type": "identify",
							"userId": "1e7673da-9473-49c6-97f7-da848ecafa76"
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
						"error": "Salesforce Request Failed: \"400\" due to \"{\"error\":\"invalid_grant\",\"error_description\":\"authentication failure\"}\", (Aborted) :- authentication failed during fetching access token.",
						"statTags": {
							"errorCategory": "network",
							"errorType": "aborted",
							"destType": "SALESFORCE",
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
		"name": "salesforce",
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
								"initialAccessToken": "dummyInitialAccessToken",
								"password": "dummyPassword1",
								"userName": "testsalesforce1453@gmail.com"
							},
							"DestinationDefinition": {
								"DisplayName": "Salesforce",
								"ID": "1T96GHZ0YZ1qQSLULHCoJkow9KC",
								"Name": "SALESFORCE"
							},
							"Enabled": true,
							"ID": "1WqFFH5esuVPnUgHkvEoYxDcX3y",
							"Name": "tst",
							"Transformations": []
						},
						"message": {
							"anonymousId": "1e7673da-9473-49c6-97f7-da848ecafa76",
							"channel": "web",
							"context": {
								"app": {
									"build": "1.0.0",
									"name": "RudderLabs JavaScript SDK",
									"namespace": "com.rudderlabs.javascript",
									"version": "1.0.0"
								},
								"ip": "0.0.0.0",
								"library": {
									"name": "RudderLabs JavaScript SDK",
									"version": "1.0.0"
								},
								"locale": "en-US",
								"os": {
									"name": "",
									"version": ""
								},
								"screen": {
									"density": 2
								},
								"userAgent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_2) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/79.0.3945.130 Safari/537.36"
							},
							"integrations": {
								"All": true
							},
							"traits": {
								"anonymousId": "1e7673da-9473-49c6-97f7-da848ecafa76",
								"company": "Initech",
								"address": {
									"city": "east greenwich",
									"country": "USA",
									"state": "California",
									"street": "19123 forest lane",
									"postalCode": "94115"
								},
								"email": "peter.gibbons@initech.com",
								"name": "Peter Gibbons",
								"phone": "570-690-4150",
								"rating": "Hot",
								"title": "VP of Derp",
								"LeadSource": "RudderLabs"
							},
							"messageId": "f19c35da-e9de-4c6e-b6e5-9e60cccc12c8",
							"originalTimestamp": "2020-01-27T12:20:55.301Z",
							"receivedAt": "2020-01-27T17:50:58.657+05:30",
							"request_ip": "14.98.244.60",
							"sentAt": "2020-01-27T12:20:56.849Z",
							"timestamp": "2020-01-27T17:50:57.109+05:30",
							"type": "identify",
							"userId": "1e7673da-9473-49c6-97f7-da848ecafa76"
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
						"error": "Salesforce Request Failed: \"400\" due to \"{\"error\":\"invalid_grant\",\"error_description\":\"authentication failure\"}\", (Aborted) :- authentication failed during fetching access token.",
						"statTags": {
							"errorCategory": "network",
							"errorType": "aborted",
							"destType": "SALESFORCE",
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
		"name": "salesforce",
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
								"initialAccessToken": "dummyInitialAccessToken",
								"password": "dummyPassword1",
								"userName": "testsalesforce1453@gmail.com"
							},
							"DestinationDefinition": {
								"DisplayName": "Salesforce",
								"ID": "1T96GHZ0YZ1qQSLULHCoJkow9KC",
								"Name": "SALESFORCE"
							},
							"Enabled": true,
							"ID": "1WqFFH5esuVPnUgHkvEoYxDcX3y",
							"Name": "tst",
							"Transformations": []
						},
						"message": {
							"anonymousId": "1e7673da-9473-49c6-97f7-da848ecafa76",
							"channel": "web",
							"context": {
								"app": {
									"build": "1.0.0",
									"name": "RudderLabs JavaScript SDK",
									"namespace": "com.rudderlabs.javascript",
									"version": "1.0.0"
								},
								"ip": "0.0.0.0",
								"library": {
									"name": "RudderLabs JavaScript SDK",
									"version": "1.0.0"
								},
								"locale": "en-US",
								"os": {
									"name": "",
									"version": ""
								},
								"screen": {
									"density": 2
								},
								"userAgent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_2) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/79.0.3945.130 Safari/537.36"
							},
							"integrations": {
								"All": true
							},
							"traits": {
								"anonymousId": "1e7673da-9473-49c6-97f7-da848ecafa76",
								"company": "Initech",
								"address": {
									"city": "east greenwich",
									"country": "USA",
									"state": "California",
									"street": "19123 forest lane",
									"postalCode": "94115"
								},
								"email": "peter.gibbons@initech.com",
								"name": "Peter Gibbons",
								"phone": "570-690-4150",
								"rating": "Hot",
								"title": "VP of Derp",
								"LeadSource": "RudderLabs"
							},
							"messageId": "f19c35da-e9de-4c6e-b6e5-9e60cccc12c8",
							"originalTimestamp": "2020-01-27T12:20:55.301Z",
							"receivedAt": "2020-01-27T17:50:58.657+05:30",
							"request_ip": "14.98.244.60",
							"sentAt": "2020-01-27T12:20:56.849Z",
							"timestamp": "2020-01-27T17:50:57.109+05:30",
							"type": "track",
							"userId": "1e7673da-9473-49c6-97f7-da848ecafa76"
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
						"error": "Salesforce Request Failed: \"400\" due to \"{\"error\":\"invalid_grant\",\"error_description\":\"authentication failure\"}\", (Aborted) :- authentication failed during fetching access token.",
						"statTags": {
							"errorCategory": "network",
							"errorType": "aborted",
							"destType": "SALESFORCE",
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
		"name": "salesforce",
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
								"initialAccessToken": "dummyInitialAccessToken",
								"password": "dummyPassword1",
								"userName": "testsalesforce1453@gmail.com"
							},
							"DestinationDefinition": {
								"DisplayName": "Salesforce",
								"ID": "1T96GHZ0YZ1qQSLULHCoJkow9KC",
								"Name": "SALESFORCE"
							},
							"Enabled": true,
							"ID": "1WqFFH5esuVPnUgHkvEoYxDcX3y",
							"Name": "tst",
							"Transformations": []
						},
						"message": {
							"anonymousId": "1e7673da-9473-49c6-97f7-da848ecafa76",
							"channel": "web",
							"context": {
								"app": {
									"build": "1.0.0",
									"name": "RudderLabs JavaScript SDK",
									"namespace": "com.rudderlabs.javascript",
									"version": "1.0.0"
								},
								"ip": "0.0.0.0",
								"library": {
									"name": "RudderLabs JavaScript SDK",
									"version": "1.0.0"
								},
								"locale": "en-US",
								"os": {
									"name": "",
									"version": ""
								},
								"screen": {
									"density": 2
								},
								"userAgent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_2) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/79.0.3945.130 Safari/537.36"
							},
							"integrations": {
								"All": true
							},
							"traits": {
								"anonymousId": "1e7673da-9473-49c6-97f7-da848ecafa76",
								"company": "Initech",
								"address": {
									"city": "east greenwich",
									"country": "USA",
									"state": "California",
									"street": "19123 forest lane",
									"postalCode": "94115"
								},
								"email": "peter.gibbons@initech.com",
								"name": "Peter Gibbons",
								"phone": "570-690-4150",
								"rating": "Hot",
								"title": "VP of Derp",
								"LeadSource": "RudderLabs",
								"customKey": "customValue",
								"customNullValue": null
							},
							"messageId": "f19c35da-e9de-4c6e-b6e5-9e60cccc12c8",
							"originalTimestamp": "2020-01-27T12:20:55.301Z",
							"receivedAt": "2020-01-27T17:50:58.657+05:30",
							"request_ip": "14.98.244.60",
							"sentAt": "2020-01-27T12:20:56.849Z",
							"timestamp": "2020-01-27T17:50:57.109+05:30",
							"type": "identify",
							"userId": "1e7673da-9473-49c6-97f7-da848ecafa76"
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
						"error": "Salesforce Request Failed: \"400\" due to \"{\"error\":\"invalid_grant\",\"error_description\":\"authentication failure\"}\", (Aborted) :- authentication failed during fetching access token.",
						"statTags": {
							"errorCategory": "network",
							"errorType": "aborted",
							"destType": "SALESFORCE",
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
		"name": "salesforce",
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
								"initialAccessToken": "dummyInitialAccessToken",
								"password": "dummyPassword1",
								"userName": "testsalesforce1453@gmail.com"
							},
							"DestinationDefinition": {
								"DisplayName": "Salesforce",
								"ID": "1T96GHZ0YZ1qQSLULHCoJkow9KC",
								"Name": "SALESFORCE"
							},
							"Enabled": true,
							"ID": "1WqFFH5esuVPnUgHkvEoYxDcX3y",
							"Name": "tst",
							"Transformations": []
						},
						"message": {
							"anonymousId": "1e7673da-9473-49c6-97f7-da848ecafa76",
							"channel": "web",
							"context": {
								"app": {
									"build": "1.0.0",
									"name": "RudderLabs JavaScript SDK",
									"namespace": "com.rudderlabs.javascript",
									"version": "1.0.0"
								},
								"ip": "0.0.0.0",
								"library": {
									"name": "RudderLabs JavaScript SDK",
									"version": "1.0.0"
								},
								"locale": "en-US",
								"os": {
									"name": "",
									"version": ""
								},
								"screen": {
									"density": 2
								},
								"userAgent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_2) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/79.0.3945.130 Safari/537.36"
							},
							"integrations": {
								"All": true
							},
							"traits": {
								"anonymousId": "1e7673da-9473-49c6-97f7-da848ecafa76",
								"address": {
									"city": "east greenwich",
									"country": "USA",
									"state": "California",
									"street": "19123 forest lane",
									"postalCode": "94115"
								},
								"email": "peter.gibbons@initech.com",
								"phone": "570-690-4150",
								"rating": "Hot",
								"title": "VP of Derp",
								"LeadSource": "RudderLabs",
								"customKey": "customValue",
								"customNullValue": null
							},
							"messageId": "f19c35da-e9de-4c6e-b6e5-9e60cccc12c8",
							"originalTimestamp": "2020-01-27T12:20:55.301Z",
							"receivedAt": "2020-01-27T17:50:58.657+05:30",
							"request_ip": "14.98.244.60",
							"sentAt": "2020-01-27T12:20:56.849Z",
							"timestamp": "2020-01-27T17:50:57.109+05:30",
							"type": "identify",
							"userId": "1e7673da-9473-49c6-97f7-da848ecafa76"
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
						"error": "Salesforce Request Failed: \"400\" due to \"{\"error\":\"invalid_grant\",\"error_description\":\"authentication failure\"}\", (Aborted) :- authentication failed during fetching access token.",
						"statTags": {
							"errorCategory": "network",
							"errorType": "aborted",
							"destType": "SALESFORCE",
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
		"name": "salesforce",
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
								"initialAccessToken": "dummyInitialAccessToken",
								"password": "dummyPassword1",
								"userName": "testsalesforce1453@gmail.com"
							},
							"DestinationDefinition": {
								"DisplayName": "Salesforce",
								"ID": "1T96GHZ0YZ1qQSLULHCoJkow9KC",
								"Name": "SALESFORCE"
							},
							"Enabled": true,
							"ID": "1WqFFH5esuVPnUgHkvEoYxDcX3y",
							"Name": "tst",
							"Transformations": []
						},
						"message": {
							"anonymousId": "1e7673da-9473-49c6-97f7-da848ecafa76",
							"channel": "web",
							"context": {
								"app": {
									"build": "1.0.0",
									"name": "RudderLabs JavaScript SDK",
									"namespace": "com.rudderlabs.javascript",
									"version": "1.0.0"
								},
								"ip": "0.0.0.0",
								"library": {
									"name": "RudderLabs JavaScript SDK",
									"version": "1.0.0"
								},
								"locale": "en-US",
								"os": {
									"name": "",
									"version": ""
								},
								"screen": {
									"density": 2
								},
								"traits": {
									"City": "east greenwich",
									"Company": "Initech",
									"Country": "USA",
									"Email": "peter.gibbons@initech.com",
									"FirstName": "Peter",
									"LastName": "Gibbons",
									"Phone": "570-690-4150",
									"PostalCode": "94115",
									"Rating": "Hot",
									"State": "California",
									"Street": "19123 forest lane",
									"Title": "VP of Derp"
								},
								"userAgent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_2) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/79.0.3945.130 Safari/537.36",
								"externalId": [
									{
										"type": "Salesforce-Contact",
										"id": "sf-contact-id"
									}
								]
							},
							"integrations": {
								"All": true
							},
							"messageId": "f19c35da-e9de-4c6e-b6e5-9e60cccc12c8",
							"originalTimestamp": "2020-01-27T12:20:55.301Z",
							"receivedAt": "2020-01-27T17:50:58.657+05:30",
							"request_ip": "14.98.244.60",
							"sentAt": "2020-01-27T12:20:56.849Z",
							"timestamp": "2020-01-27T17:50:57.109+05:30",
							"type": "identify",
							"userId": "1e7673da-9473-49c6-97f7-da848ecafa76"
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
						"error": "Salesforce Request Failed: \"400\" due to \"{\"error\":\"invalid_grant\",\"error_description\":\"authentication failure\"}\", (Aborted) :- authentication failed during fetching access token.",
						"statTags": {
							"errorCategory": "network",
							"errorType": "aborted",
							"destType": "SALESFORCE",
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
		"name": "salesforce",
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
								"initialAccessToken": "dummyInitialAccessToken",
								"password": "dummyPassword1",
								"userName": "testsalesforce1453@gmail.com",
								"mapProperty": false
							},
							"DestinationDefinition": {
								"DisplayName": "Salesforce",
								"ID": "1T96GHZ0YZ1qQSLULHCoJkow9KC",
								"Name": "SALESFORCE"
							},
							"Enabled": true,
							"ID": "1WqFFH5esuVPnUgHkvEoYxDcX3y",
							"Name": "tst",
							"Transformations": []
						},
						"message": {
							"anonymousId": "1e7673da-9473-49c6-97f7-da848ecafa76",
							"channel": "web",
							"context": {
								"app": {
									"build": "1.0.0",
									"name": "RudderLabs JavaScript SDK",
									"namespace": "com.rudderlabs.javascript",
									"version": "1.0.0"
								},
								"ip": "0.0.0.0",
								"library": {
									"name": "RudderLabs JavaScript SDK",
									"version": "1.0.0"
								},
								"locale": "en-US",
								"os": {
									"name": "",
									"version": ""
								},
								"screen": {
									"density": 2
								},
								"traits": {
									"Phone": "570-690-4150",
									"Rating": "Hot",
									"Title": "VP of Derp",
									"FirstName": "Peter",
									"LastName": "Gibbons",
									"PostalCode": "94115",
									"City": "east greenwich",
									"Country": "USA",
									"State": "California",
									"Street": "19123 forest lane",
									"Company": "Initech"
								},
								"userAgent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_2) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/79.0.3945.130 Safari/537.36",
								"externalId": [
									{
										"type": "Salesforce-Lead",
										"id": "sf-contact-id"
									}
								]
							},
							"integrations": {
								"All": true
							},
							"messageId": "f19c35da-e9de-4c6e-b6e5-9e60cccc12c8",
							"originalTimestamp": "2020-01-27T12:20:55.301Z",
							"receivedAt": "2020-01-27T17:50:58.657+05:30",
							"request_ip": "14.98.244.60",
							"sentAt": "2020-01-27T12:20:56.849Z",
							"timestamp": "2020-01-27T17:50:57.109+05:30",
							"type": "identify",
							"userId": "1e7673da-9473-49c6-97f7-da848ecafa76"
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
						"error": "Salesforce Request Failed: \"400\" due to \"{\"error\":\"invalid_grant\",\"error_description\":\"authentication failure\"}\", (Aborted) :- authentication failed during fetching access token.",
						"statTags": {
							"errorCategory": "network",
							"errorType": "aborted",
							"destType": "SALESFORCE",
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
		"name": "salesforce",
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
								"initialAccessToken": "7fiy1FKcO9sohsxq1v6J88sg",
								"password": "dummyPassword2",
								"userName": "test.c97-qvpd@force.com.test",
								"sandbox": true
							},
							"DestinationDefinition": {
								"DisplayName": "Salesforce",
								"ID": "1T96GHZ0YZ1qQSLULHCoJkow9KC",
								"Name": "SALESFORCE"
							},
							"Enabled": true,
							"ID": "1ut7LcVW1QC56y2EoTNo7ZwBWSY",
							"Name": "Test SF",
							"Transformations": []
						},
						"message": {
							"anonymousId": "1e7673da-9473-49c6-97f7-da848ecafa76",
							"channel": "web",
							"context": {
								"app": {
									"build": "1.0.0",
									"name": "RudderLabs JavaScript SDK",
									"namespace": "com.rudderlabs.javascript",
									"version": "1.0.0"
								},
								"ip": "0.0.0.0",
								"library": {
									"name": "RudderLabs JavaScript SDK",
									"version": "1.0.0"
								},
								"locale": "en-US",
								"os": {
									"name": "",
									"version": ""
								},
								"screen": {
									"density": 2
								},
								"traits": {
									"anonymousId": "1e7673da-9473-49c6-97f7-da848ecafa76",
									"company": "Initech",
									"address": {
										"city": "east greenwich",
										"country": "USA",
										"state": "California",
										"street": "19123 forest lane",
										"postalCode": "94115"
									},
									"email": "peter.gibbons@initech.com",
									"name": "Peter Gibbons",
									"phone": "570-690-4150",
									"rating": "Hot",
									"title": "VP of Derp"
								},
								"userAgent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_2) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/79.0.3945.130 Safari/537.36"
							},
							"integrations": {
								"All": true
							},
							"messageId": "f19c35da-e9de-4c6e-b6e5-9e60cccc12c8",
							"originalTimestamp": "2020-01-27T12:20:55.301Z",
							"receivedAt": "2020-01-27T17:50:58.657+05:30",
							"request_ip": "14.98.244.60",
							"sentAt": "2020-01-27T12:20:56.849Z",
							"timestamp": "2020-01-27T17:50:57.109+05:30",
							"type": "identify",
							"userId": "1e7673da-9473-49c6-97f7-da848ecafa76"
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
						"error": "Salesforce Request Failed: \"400\" due to \"{\"error\":\"invalid_grant\",\"error_description\":\"authentication failure\"}\", (Aborted) :- authentication failed during fetching access token.",
						"statTags": {
							"errorCategory": "network",
							"errorType": "aborted",
							"destType": "SALESFORCE",
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
		"name": "salesforce",
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
								"initialAccessToken": "7fiy1FKcO9sohsxq1v6J88sg",
								"password": "dummyPassword2",
								"userName": "test.c97-qvpd@force.com.test",
								"sandbox": true
							},
							"DestinationDefinition": {
								"DisplayName": "Salesforce",
								"ID": "1T96GHZ0YZ1qQSLULHCoJkow9KC",
								"Name": "SALESFORCE"
							},
							"Enabled": true,
							"ID": "1ut7LcVW1QC56y2EoTNo7ZwBWSY",
							"Name": "Test SF",
							"Transformations": []
						},
						"message": {
							"anonymousId": "1e7673da-9473-49c6-97f7-da848ecafa76",
							"channel": "web",
							"context": {
								"mappedToDestination": true,
								"externalId": [
									{
										"id": "a005g0000383kmUAAQ",
										"type": "SALESFORCE-custom_object__c",
										"identifierType": "Id"
									}
								],
								"app": {
									"build": "1.0.0",
									"name": "RudderLabs JavaScript SDK",
									"namespace": "com.rudderlabs.javascript",
									"version": "1.0.0"
								},
								"ip": "0.0.0.0",
								"library": {
									"name": "RudderLabs JavaScript SDK",
									"version": "1.0.0"
								},
								"locale": "en-US",
								"os": {
									"name": "",
									"version": ""
								},
								"screen": {
									"density": 2
								},
								"traits": {
									"email": "john@rs.com",
									"firstname": "john doe"
								},
								"userAgent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_2) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/79.0.3945.130 Safari/537.36"
							},
							"integrations": {
								"All": true
							},
							"messageId": "f19c35da-e9de-4c6e-b6e5-9e60cccc12c8",
							"originalTimestamp": "2020-01-27T12:20:55.301Z",
							"receivedAt": "2020-01-27T17:50:58.657+05:30",
							"request_ip": "14.98.244.60",
							"sentAt": "2020-01-27T12:20:56.849Z",
							"timestamp": "2020-01-27T17:50:57.109+05:30",
							"type": "identify",
							"userId": "1e7673da-9473-49c6-97f7-da848ecafa76"
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
						"error": "Salesforce Request Failed: \"400\" due to \"{\"error\":\"invalid_grant\",\"error_description\":\"authentication failure\"}\", (Aborted) :- authentication failed during fetching access token.",
						"statTags": {
							"errorCategory": "network",
							"errorType": "aborted",
							"destType": "SALESFORCE",
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
		"name": "salesforce",
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
								"initialAccessToken": "7fiy1FKcO9sohsxq1v6J88sg",
								"password": "dummyPassword2",
								"userName": "test.c97-qvpd@force.com.test",
								"sandbox": true
							},
							"DestinationDefinition": {
								"DisplayName": "Salesforce",
								"ID": "1T96GHZ0YZ1qQSLULHCoJkow9KC",
								"Name": "SALESFORCE"
							},
							"Enabled": true,
							"ID": "1ut7LcVW1QC56y2EoTNo7ZwBWSY",
							"Name": "Test SF",
							"Transformations": []
						},
						"message": {
							"anonymousId": "1e7673da-9473-49c6-97f7-da848ecafa76",
							"channel": "web",
							"context": {
								"mappedToDestination": true,
								"externalId": [
									{
										"id": "a005g0000383kmUAAQ",
										"type": "SALESFORCE-custom_object__c",
										"identifierType": "Id"
									}
								],
								"app": {
									"build": "1.0.0",
									"name": "RudderLabs JavaScript SDK",
									"namespace": "com.rudderlabs.javascript",
									"version": "1.0.0"
								},
								"ip": "0.0.0.0",
								"library": {
									"name": "RudderLabs JavaScript SDK",
									"version": "1.0.0"
								},
								"locale": "en-US",
								"os": {
									"name": "",
									"version": ""
								},
								"screen": {
									"density": 2
								},
								"traits": {
									"email": "john@rs.com",
									"firstname": "john doe",
									"Id": "some-id"
								},
								"userAgent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_2) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/79.0.3945.130 Safari/537.36"
							},
							"integrations": {
								"All": true
							},
							"messageId": "f19c35da-e9de-4c6e-b6e5-9e60cccc12c8",
							"originalTimestamp": "2020-01-27T12:20:55.301Z",
							"receivedAt": "2020-01-27T17:50:58.657+05:30",
							"request_ip": "14.98.244.60",
							"sentAt": "2020-01-27T12:20:56.849Z",
							"timestamp": "2020-01-27T17:50:57.109+05:30",
							"type": "identify",
							"userId": "1e7673da-9473-49c6-97f7-da848ecafa76"
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
						"error": "Salesforce Request Failed: \"400\" due to \"{\"error\":\"invalid_grant\",\"error_description\":\"authentication failure\"}\", (Aborted) :- authentication failed during fetching access token.",
						"statTags": {
							"errorCategory": "network",
							"errorType": "aborted",
							"destType": "SALESFORCE",
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