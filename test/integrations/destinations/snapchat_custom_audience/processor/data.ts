export const data = [
	{
		"name": "snapchat_custom_audience",
		"description": "Test 0",
		"feature": "processor",
		"module": "destination",
		"version": "v0",
		"input": {
			"request": {
				"body": [
					{
						"metadata": {
							"secret": {
								"access_token": "dummyAccessToken",
								"refresh_token": "dummyRefreshToken",
								"developer_token": "dummyDeveloperToken"
							}
						},
						"destination": {
							"Config": {
								"segmentId": "123",
								"disableHashing": false,
								"schema": "email"
							}
						},
						"message": {
							"userId": "user 1",
							"anonymousId": "anon-id-new",
							"event": "event1",
							"type": "audiencelist",
							"properties": {
								"listData": {
									"add": [
										{
											"email": "test@abc.com",
											"phone": "@09876543210",
											"firstName": "test",
											"lastName": "rudderlabs",
											"country": "US",
											"postalCode": "1245"
										}
									]
								},
								"enablePartialFailure": true
							},
							"context": {
								"ip": "14.5.67.21",
								"library": {
									"name": "http"
								}
							},
							"timestamp": "2020-02-02T00:23:09.544Z"
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
							"endpoint": "https://adsapi.snapchat.com/v1/segments/123/users",
							"headers": {
								"Authorization": "Bearer dummyAccessToken",
								"Content-Type": "application/json"
							},
							"params": {},
							"body": {
								"JSON": {
									"users": [
										{
											"schema": [
												"EMAIL_SHA256"
											],
											"data": [
												[
													"d3142c8f9c9129484daf28df80cc5c955791efed5e69afabb603bc8cb9ffd419"
												]
											]
										}
									]
								},
								"JSON_ARRAY": {},
								"XML": {},
								"FORM": {}
							},
							"files": {},
							"userId": ""
						},
						"metadata": {
							"secret": {
								"access_token": "dummyAccessToken",
								"refresh_token": "dummyRefreshToken",
								"developer_token": "dummyDeveloperToken"
							}
						},
						"statusCode": 200
					}
				]
			}
		}
	},
	{
		"name": "snapchat_custom_audience",
		"description": "Test 1",
		"feature": "processor",
		"module": "destination",
		"version": "v0",
		"input": {
			"request": {
				"body": [
					{
						"metadata": {
							"secret": {
								"access_token": "dummyAccessToken",
								"refresh_token": "dummyRefreshToken",
								"developer_token": "dummyDeveloperToken"
							}
						},
						"destination": {
							"Config": {
								"segmentId": "123",
								"disableHashing": true,
								"schema": "email"
							}
						},
						"message": {
							"userId": "user 1",
							"anonymousId": "anon-id-new",
							"event": "event1",
							"type": "audiencelist",
							"properties": {
								"listData": {
									"remove": [
										{
											"email": "d3142c8f9c9129484daf28df80cc5c955791efed5e69afabb603bc8cb9ffd419",
											"phone": "@09876543210",
											"firstName": "test",
											"lastName": "rudderlabs",
											"country": "US",
											"postalCode": "1245"
										}
									]
								},
								"enablePartialFailure": true
							},
							"context": {
								"ip": "14.5.67.21",
								"library": {
									"name": "http"
								}
							},
							"timestamp": "2020-02-02T00:23:09.544Z"
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
							"method": "DELETE",
							"endpoint": "https://adsapi.snapchat.com/v1/segments/123/users",
							"headers": {
								"Authorization": "Bearer dummyAccessToken",
								"Content-Type": "application/json"
							},
							"params": {},
							"body": {
								"JSON": {
									"users": [
										{
											"schema": [
												"EMAIL_SHA256"
											],
											"data": [
												[
													"d3142c8f9c9129484daf28df80cc5c955791efed5e69afabb603bc8cb9ffd419"
												]
											],
											"id": "123"
										}
									]
								},
								"JSON_ARRAY": {},
								"XML": {},
								"FORM": {}
							},
							"files": {},
							"userId": ""
						},
						"metadata": {
							"secret": {
								"access_token": "dummyAccessToken",
								"refresh_token": "dummyRefreshToken",
								"developer_token": "dummyDeveloperToken"
							}
						},
						"statusCode": 200
					}
				]
			}
		}
	},
	{
		"name": "snapchat_custom_audience",
		"description": "Test 2",
		"feature": "processor",
		"module": "destination",
		"version": "v0",
		"input": {
			"request": {
				"body": [
					{
						"metadata": {
							"secret": {
								"access_token": "dummyAccessToken",
								"refresh_token": "dummyRefreshToken",
								"developer_token": "dummyDeveloperToken"
							}
						},
						"destination": {
							"Config": {
								"segmentId": "123",
								"disableHashing": false,
								"schema": "email"
							}
						},
						"message": {
							"userId": "user 1",
							"anonymousId": "anon-id-new",
							"event": "event1",
							"type": "audiencelist",
							"properties": {
								"listData": {
									"add": [
										{
											"email": "test@abc.com",
											"phone": "@09876543210",
											"firstName": "test",
											"lastName": "rudderlabs",
											"country": "US",
											"postalCode": "1245"
										}
									],
									"remove": [
										{
											"email": "test@abc.com",
											"phone": "@09876543210",
											"firstName": "test",
											"lastName": "rudderlabs",
											"country": "US",
											"postalCode": "1245"
										}
									]
								},
								"enablePartialFailure": true
							},
							"context": {
								"ip": "14.5.67.21",
								"library": {
									"name": "http"
								}
							},
							"timestamp": "2020-02-02T00:23:09.544Z"
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
							"endpoint": "https://adsapi.snapchat.com/v1/segments/123/users",
							"headers": {
								"Authorization": "Bearer dummyAccessToken",
								"Content-Type": "application/json"
							},
							"params": {},
							"body": {
								"JSON": {
									"users": [
										{
											"schema": [
												"EMAIL_SHA256"
											],
											"data": [
												[
													"d3142c8f9c9129484daf28df80cc5c955791efed5e69afabb603bc8cb9ffd419"
												]
											]
										}
									]
								},
								"JSON_ARRAY": {},
								"XML": {},
								"FORM": {}
							},
							"files": {},
							"userId": ""
						},
						"metadata": {
							"secret": {
								"access_token": "dummyAccessToken",
								"refresh_token": "dummyRefreshToken",
								"developer_token": "dummyDeveloperToken"
							}
						},
						"statusCode": 200
					},
					{
						"output": {
							"version": "1",
							"type": "REST",
							"method": "DELETE",
							"endpoint": "https://adsapi.snapchat.com/v1/segments/123/users",
							"headers": {
								"Authorization": "Bearer dummyAccessToken",
								"Content-Type": "application/json"
							},
							"params": {},
							"body": {
								"JSON": {
									"users": [
										{
											"schema": [
												"EMAIL_SHA256"
											],
											"data": [
												[
													"d3142c8f9c9129484daf28df80cc5c955791efed5e69afabb603bc8cb9ffd419"
												]
											],
											"id": "123"
										}
									]
								},
								"JSON_ARRAY": {},
								"XML": {},
								"FORM": {}
							},
							"files": {},
							"userId": ""
						},
						"metadata": {
							"secret": {
								"access_token": "dummyAccessToken",
								"refresh_token": "dummyRefreshToken",
								"developer_token": "dummyDeveloperToken"
							}
						},
						"statusCode": 200
					}
				]
			}
		}
	},
	{
		"name": "snapchat_custom_audience",
		"description": "Test 3",
		"feature": "processor",
		"module": "destination",
		"version": "v0",
		"input": {
			"request": {
				"body": [
					{
						"metadata": {
							"secret": {
								"access_token": "dummyAccessToken",
								"refresh_token": "dummyRefreshToken",
								"developer_token": "dummyDeveloperToken"
							}
						},
						"destination": {
							"Config": {
								"segmentId": "123",
								"disableHashing": false,
								"schema": "email"
							}
						},
						"message": {
							"userId": "user 1",
							"anonymousId": "anon-id-new",
							"event": "event1",
							"type": "audiencelist",
							"properties": {
								"listData": {
									"add": [
										{
											"email": "test@abc.com",
											"phone": "@09876543210",
											"firstName": "test",
											"lastName": "rudderlabs",
											"country": "US",
											"postalCode": "1245"
										},
										{
											"email": "test@rudderstack.com",
											"phone": "@09876543210",
											"firstName": "rudderlabs",
											"lastName": "rudderlabs",
											"country": "US",
											"postalCode": "1245"
										}
									]
								},
								"enablePartialFailure": true
							},
							"context": {
								"ip": "14.5.67.21",
								"library": {
									"name": "http"
								}
							},
							"timestamp": "2020-02-02T00:23:09.544Z"
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
							"endpoint": "https://adsapi.snapchat.com/v1/segments/123/users",
							"headers": {
								"Authorization": "Bearer dummyAccessToken",
								"Content-Type": "application/json"
							},
							"params": {},
							"body": {
								"JSON": {
									"users": [
										{
											"schema": [
												"EMAIL_SHA256"
											],
											"data": [
												[
													"d3142c8f9c9129484daf28df80cc5c955791efed5e69afabb603bc8cb9ffd419"
												],
												[
													"1c5e54849f5c711ce38fa60716fbbe44bff478f9ca250897b39cdfc2438cd1bd"
												]
											]
										}
									]
								},
								"JSON_ARRAY": {},
								"XML": {},
								"FORM": {}
							},
							"files": {},
							"userId": ""
						},
						"metadata": {
							"secret": {
								"access_token": "dummyAccessToken",
								"refresh_token": "dummyRefreshToken",
								"developer_token": "dummyDeveloperToken"
							}
						},
						"statusCode": 200
					}
				]
			}
		}
	},
	{
		"name": "snapchat_custom_audience",
		"description": "Test 4",
		"feature": "processor",
		"module": "destination",
		"version": "v0",
		"input": {
			"request": {
				"body": [
					{
						"metadata": {
							"secret": {
								"access_token": "dummyAccessToken",
								"refresh_token": "dummyRefreshToken",
								"developer_token": "dummyDeveloperToken"
							}
						},
						"destination": {
							"Config": {
								"segmentId": "123",
								"disableHashing": false,
								"schema": "email"
							}
						},
						"message": {
							"userId": "user 1",
							"anonymousId": "anon-id-new",
							"event": "event1",
							"type": "audiencelist",
							"properties": {
								"listData": {
									"remove": [
										{
											"email": "test@abc.com",
											"phone": "@09876543210",
											"firstName": "test",
											"lastName": "rudderlabs",
											"country": "US",
											"postalCode": "1245"
										},
										{
											"email": "test@rudderstack.com",
											"phone": "@09876543210",
											"firstName": "rudderlabs",
											"lastName": "rudderlabs",
											"country": "US",
											"postalCode": "1245"
										}
									]
								},
								"enablePartialFailure": true
							},
							"context": {
								"ip": "14.5.67.21",
								"library": {
									"name": "http"
								}
							},
							"timestamp": "2020-02-02T00:23:09.544Z"
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
							"method": "DELETE",
							"endpoint": "https://adsapi.snapchat.com/v1/segments/123/users",
							"headers": {
								"Authorization": "Bearer dummyAccessToken",
								"Content-Type": "application/json"
							},
							"params": {},
							"body": {
								"JSON": {
									"users": [
										{
											"schema": [
												"EMAIL_SHA256"
											],
											"data": [
												[
													"d3142c8f9c9129484daf28df80cc5c955791efed5e69afabb603bc8cb9ffd419"
												],
												[
													"1c5e54849f5c711ce38fa60716fbbe44bff478f9ca250897b39cdfc2438cd1bd"
												]
											],
											"id": "123"
										}
									]
								},
								"JSON_ARRAY": {},
								"XML": {},
								"FORM": {}
							},
							"files": {},
							"userId": ""
						},
						"metadata": {
							"secret": {
								"access_token": "dummyAccessToken",
								"refresh_token": "dummyRefreshToken",
								"developer_token": "dummyDeveloperToken"
							}
						},
						"statusCode": 200
					}
				]
			}
		}
	},
	{
		"name": "snapchat_custom_audience",
		"description": "Test 5",
		"feature": "processor",
		"module": "destination",
		"version": "v0",
		"input": {
			"request": {
				"body": [
					{
						"metadata": {
							"secret": {
								"access_token": "dummyAccessToken",
								"refresh_token": "dummyRefreshToken",
								"developer_token": "dummyDeveloperToken"
							}
						},
						"destination": {
							"Config": {
								"segmentId": "123",
								"disableHashing": false,
								"schema": "email"
							}
						},
						"message": {
							"userId": "user 1",
							"anonymousId": "anon-id-new",
							"event": "event1",
							"type": "audience",
							"properties": {
								"listData": {
									"add": [
										{
											"email": "test@rudderstack.com",
											"phone": "@09876543210",
											"firstName": "rudderlabs",
											"lastName": "rudderlabs",
											"country": "US",
											"postalCode": "1245"
										}
									]
								},
								"enablePartialFailure": true
							},
							"context": {
								"ip": "14.5.67.21",
								"library": {
									"name": "http"
								}
							},
							"timestamp": "2020-02-02T00:23:09.544Z"
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
						"metadata": {
							"secret": {
								"access_token": "dummyAccessToken",
								"refresh_token": "dummyRefreshToken",
								"developer_token": "dummyDeveloperToken"
							}
						},
						"statusCode": 400,
						"error": "Event type audience is not supported",
						"statTags": {
							"errorCategory": "dataValidation",
							"errorType": "instrumentation",
							"destType": "SNAPCHAT_CUSTOM_AUDIENCE",
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
		"name": "snapchat_custom_audience",
		"description": "Test 6",
		"feature": "processor",
		"module": "destination",
		"version": "v0",
		"input": {
			"request": {
				"body": [
					{
						"metadata": {
							"secret": {
								"access_token": "dummyAccessToken",
								"refresh_token": "dummyRefreshToken",
								"developer_token": "dummyDeveloperToken"
							}
						},
						"destination": {
							"Config": {
								"segmentId": "123",
								"disableHashing": false,
								"schema": "email"
							}
						},
						"message": {
							"userId": "user 1",
							"anonymousId": "anon-id-new",
							"event": "event1",
							"properties": {
								"listData": {
									"add": [
										{
											"email": "test@rudderstack.com",
											"phone": "@09876543210",
											"firstName": "rudderlabs",
											"lastName": "rudderlabs",
											"country": "US",
											"postalCode": "1245"
										}
									]
								},
								"enablePartialFailure": true
							},
							"context": {
								"ip": "14.5.67.21",
								"library": {
									"name": "http"
								}
							},
							"timestamp": "2020-02-02T00:23:09.544Z"
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
						"metadata": {
							"secret": {
								"access_token": "dummyAccessToken",
								"refresh_token": "dummyRefreshToken",
								"developer_token": "dummyDeveloperToken"
							}
						},
						"statusCode": 400,
						"error": "Event type is required",
						"statTags": {
							"errorCategory": "dataValidation",
							"errorType": "instrumentation",
							"destType": "SNAPCHAT_CUSTOM_AUDIENCE",
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
		"name": "snapchat_custom_audience",
		"description": "Test 7",
		"feature": "processor",
		"module": "destination",
		"version": "v0",
		"input": {
			"request": {
				"body": [
					{
						"metadata": {
							"secret": {
								"access_token": "dummyAccessToken",
								"refresh_token": "dummyRefreshToken",
								"developer_token": "dummyDeveloperToken"
							}
						},
						"destination": {
							"Config": {
								"segmentId": "123",
								"disableHashing": false,
								"schema": "email"
							}
						},
						"message": {
							"userId": "user 1",
							"anonymousId": "anon-id-new",
							"event": "event1",
							"type": "audiencelist",
							"context": {
								"ip": "14.5.67.21",
								"library": {
									"name": "http"
								}
							},
							"timestamp": "2020-02-02T00:23:09.544Z"
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
						"metadata": {
							"secret": {
								"access_token": "dummyAccessToken",
								"refresh_token": "dummyRefreshToken",
								"developer_token": "dummyDeveloperToken"
							}
						},
						"statusCode": 400,
						"error": "Message properties is not present. Aborting message",
						"statTags": {
							"errorCategory": "dataValidation",
							"errorType": "instrumentation",
							"destType": "SNAPCHAT_CUSTOM_AUDIENCE",
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
		"name": "snapchat_custom_audience",
		"description": "Test 8",
		"feature": "processor",
		"module": "destination",
		"version": "v0",
		"input": {
			"request": {
				"body": [
					{
						"metadata": {
							"secret": {
								"access_token": "dummyAccessToken",
								"refresh_token": "dummyRefreshToken",
								"developer_token": "dummyDeveloperToken"
							}
						},
						"destination": {
							"Config": {
								"segmentId": "123",
								"disableHashing": false,
								"schema": "email"
							}
						},
						"message": {
							"userId": "user 1",
							"anonymousId": "anon-id-new",
							"event": "event1",
							"type": "audiencelist",
							"properties": {
								"enablePartialFailure": true
							},
							"context": {
								"ip": "14.5.67.21",
								"library": {
									"name": "http"
								}
							},
							"timestamp": "2020-02-02T00:23:09.544Z"
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
						"metadata": {
							"secret": {
								"access_token": "dummyAccessToken",
								"refresh_token": "dummyRefreshToken",
								"developer_token": "dummyDeveloperToken"
							}
						},
						"statusCode": 400,
						"error": "listData is not present inside properties. Aborting message",
						"statTags": {
							"errorCategory": "dataValidation",
							"errorType": "instrumentation",
							"destType": "SNAPCHAT_CUSTOM_AUDIENCE",
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
		"name": "snapchat_custom_audience",
		"description": "Test 9",
		"feature": "processor",
		"module": "destination",
		"version": "v0",
		"input": {
			"request": {
				"body": [
					{
						"metadata": {
							"secret": {
								"access_token": "dummyAccessToken",
								"refresh_token": "dummyRefreshToken",
								"developer_token": "dummyDeveloperToken"
							}
						},
						"destination": {
							"Config": {
								"segmentId": "123",
								"disableHashing": false,
								"schema": "email"
							}
						},
						"message": {
							"userId": "user 1",
							"anonymousId": "anon-id-new",
							"event": "event1",
							"type": "audiencelist",
							"properties": {
								"listData": {
									"abc": "123"
								},
								"enablePartialFailure": true
							},
							"context": {
								"ip": "14.5.67.21",
								"library": {
									"name": "http"
								}
							},
							"timestamp": "2020-02-02T00:23:09.544Z"
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
						"metadata": {
							"secret": {
								"access_token": "dummyAccessToken",
								"refresh_token": "dummyRefreshToken",
								"developer_token": "dummyDeveloperToken"
							}
						},
						"statusCode": 400,
						"error": "Neither 'add' nor 'remove' property is present inside 'listData'. Aborting message",
						"statTags": {
							"errorCategory": "dataValidation",
							"errorType": "instrumentation",
							"destType": "SNAPCHAT_CUSTOM_AUDIENCE",
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
		"name": "snapchat_custom_audience",
		"description": "Test 10",
		"feature": "processor",
		"module": "destination",
		"version": "v0",
		"input": {
			"request": {
				"body": [
					{
						"metadata": {
							"secret": {
								"access_token": "dummyAccessToken",
								"refresh_token": "dummyRefreshToken",
								"developer_token": "dummyDeveloperToken"
							}
						},
						"destination": {
							"Config": {
								"segmentId": "123",
								"disableHashing": false,
								"schema": "email"
							}
						},
						"message": {
							"userId": "user 1",
							"anonymousId": "anon-id-new",
							"event": "event1",
							"type": "audiencelist",
							"properties": {
								"listData": {
									"remove": [
										{
											"email": "",
											"phone": "@09876543210",
											"firstName": "test",
											"lastName": "rudderlabs",
											"country": "US",
											"postalCode": "1245"
										},
										{
											"phone": "@09876543210",
											"firstName": "test",
											"lastName": "rudderlabs",
											"country": "US",
											"postalCode": "1245"
										}
									]
								},
								"enablePartialFailure": true
							},
							"context": {
								"ip": "14.5.67.21",
								"library": {
									"name": "http"
								}
							},
							"timestamp": "2020-02-02T00:23:09.544Z"
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
						"metadata": {
							"secret": {
								"access_token": "dummyAccessToken",
								"refresh_token": "dummyRefreshToken",
								"developer_token": "dummyDeveloperToken"
							}
						},
						"statusCode": 400,
						"error": "Required schema parameter email is not found from payload",
						"statTags": {
							"errorCategory": "dataValidation",
							"errorType": "instrumentation",
							"destType": "SNAPCHAT_CUSTOM_AUDIENCE",
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
		"name": "snapchat_custom_audience",
		"description": "Test 11",
		"feature": "processor",
		"module": "destination",
		"version": "v0",
		"input": {
			"request": {
				"body": [
					{
						"metadata": {
							"secret": {
								"access_token": "dummyAccessToken",
								"refresh_token": "dummyRefreshToken",
								"developer_token": "dummyDeveloperToken"
							}
						},
						"destination": {
							"Config": {
								"segmentId": "123",
								"disableHashing": false,
								"schema": "email"
							}
						},
						"message": {
							"userId": "user 1",
							"anonymousId": "anon-id-new",
							"event": "event1",
							"type": "audiencelist",
							"properties": {
								"listData": {
									"remove": [
										{
											"email": "abcd@abc.com",
											"phone": "@09876543210",
											"firstName": "test",
											"lastName": "rudderlabs",
											"country": "US",
											"postalCode": "1245"
										},
										{
											"phone": "@09876543210",
											"firstName": "test",
											"lastName": "rudderlabs",
											"country": "US",
											"postalCode": "1245"
										}
									]
								},
								"enablePartialFailure": true
							},
							"context": {
								"ip": "14.5.67.21",
								"library": {
									"name": "http"
								}
							},
							"timestamp": "2020-02-02T00:23:09.544Z"
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
							"method": "DELETE",
							"endpoint": "https://adsapi.snapchat.com/v1/segments/123/users",
							"headers": {
								"Authorization": "Bearer dummyAccessToken",
								"Content-Type": "application/json"
							},
							"params": {},
							"body": {
								"JSON": {
									"users": [
										{
											"schema": [
												"EMAIL_SHA256"
											],
											"data": [
												[
													"8c37cbc5d9abb3082303c6548571cfc7655a4546ddc1e943f041fc9126e7274a"
												]
											],
											"id": "123"
										}
									]
								},
								"JSON_ARRAY": {},
								"XML": {},
								"FORM": {}
							},
							"files": {},
							"userId": ""
						},
						"metadata": {
							"secret": {
								"access_token": "dummyAccessToken",
								"refresh_token": "dummyRefreshToken",
								"developer_token": "dummyDeveloperToken"
							}
						},
						"statusCode": 200
					}
				]
			}
		}
	},
	{
		"name": "snapchat_custom_audience",
		"description": "Test 12",
		"feature": "processor",
		"module": "destination",
		"version": "v0",
		"input": {
			"request": {
				"body": [
					{
						"metadata": {
							"secret": {
								"access_token": "dummyAccessToken",
								"refresh_token": "dummyRefreshToken",
								"developer_token": "dummyDeveloperToken"
							}
						},
						"destination": {
							"Config": {
								"segmentId": "123",
								"disableHashing": false,
								"schema": "phone"
							}
						},
						"message": {
							"userId": "user 1",
							"anonymousId": "anon-id-new",
							"event": "event1",
							"type": "audiencelist",
							"properties": {
								"listData": {
									"add": [
										{
											"email": "test@abc.com",
											"phone": "09876543210",
											"firstName": "test",
											"lastName": "rudderlabs",
											"country": "US",
											"postalCode": "1245"
										}
									]
								},
								"enablePartialFailure": true
							},
							"context": {
								"ip": "14.5.67.21",
								"library": {
									"name": "http"
								}
							},
							"timestamp": "2020-02-02T00:23:09.544Z"
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
							"endpoint": "https://adsapi.snapchat.com/v1/segments/123/users",
							"headers": {
								"Authorization": "Bearer dummyAccessToken",
								"Content-Type": "application/json"
							},
							"params": {},
							"body": {
								"JSON": {
									"users": [
										{
											"schema": [
												"PHONE_SHA256"
											],
											"data": [
												[
													"7619ee8cea49187f309616e30ecf54be072259b43760f1f550a644945d5572f2"
												]
											]
										}
									]
								},
								"JSON_ARRAY": {},
								"XML": {},
								"FORM": {}
							},
							"files": {},
							"userId": ""
						},
						"metadata": {
							"secret": {
								"access_token": "dummyAccessToken",
								"refresh_token": "dummyRefreshToken",
								"developer_token": "dummyDeveloperToken"
							}
						},
						"statusCode": 200
					}
				]
			}
		}
	},
	{
		"name": "snapchat_custom_audience",
		"description": "Test 13",
		"feature": "processor",
		"module": "destination",
		"version": "v0",
		"input": {
			"request": {
				"body": [
					{
						"metadata": {
							"secret": {
								"access_token": "dummyAccessToken",
								"refresh_token": "dummyRefreshToken",
								"developer_token": "dummyDeveloperToken"
							}
						},
						"destination": {
							"Config": {
								"segmentId": "123",
								"disableHashing": false,
								"schema": "mobileAdId"
							}
						},
						"message": {
							"userId": "user 1",
							"anonymousId": "anon-id-new",
							"event": "event1",
							"type": "audiencelist",
							"properties": {
								"listData": {
									"add": [
										{
											"email": "test@abc.com",
											"phone": "09876543210",
											"mobileId": "1334",
											"firstName": "test",
											"lastName": "rudderlabs",
											"country": "US",
											"postalCode": "1245"
										}
									]
								},
								"enablePartialFailure": true
							},
							"context": {
								"ip": "14.5.67.21",
								"library": {
									"name": "http"
								}
							},
							"timestamp": "2020-02-02T00:23:09.544Z"
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
							"endpoint": "https://adsapi.snapchat.com/v1/segments/123/users",
							"headers": {
								"Authorization": "Bearer dummyAccessToken",
								"Content-Type": "application/json"
							},
							"params": {},
							"body": {
								"JSON": {
									"users": [
										{
											"schema": [
												"MOBILE_AD_ID_SHA256"
											],
											"data": [
												[
													"eb43272640b269219a01caf99c5a4122d6edc0916d45ac13c0ce80ca3ad2def0"
												]
											]
										}
									]
								},
								"JSON_ARRAY": {},
								"XML": {},
								"FORM": {}
							},
							"files": {},
							"userId": ""
						},
						"metadata": {
							"secret": {
								"access_token": "dummyAccessToken",
								"refresh_token": "dummyRefreshToken",
								"developer_token": "dummyDeveloperToken"
							}
						},
						"statusCode": 200
					}
				]
			}
		}
	}
]