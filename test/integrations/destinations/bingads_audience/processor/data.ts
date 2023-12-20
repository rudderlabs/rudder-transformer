export const data = [
	{
		"name": "bingads_audience",
		"description": "unhashed email available with hashEmail as true in config",
		"feature": "processor",
		"module": "destination",
		"version": "v0",
		"input": {
			"request": {
				"body": [
					{
						"message": {
							"userId": "user 1",
							"type": "audiencelist",
							"properties": {
								"listData": {
									"add": [
										{
											"email": "alex@email.com"
										},
										{
											"email": "amy@abc.com"
										},
										{
											"email": "van@abc.com"
										}
									]
								}
							},
							"context": {
								"ip": "14.5.67.21",
								"library": {
									"name": "http"
								}
							},
							"timestamp": "2020-02-02T00:23:09.544Z"
						},
						"destination": {
							"Config": {
								"customerAccountId": "89236978",
								"customerId": "78678678",
								"audienceId": "564567",
								"hashEmail": true
							},
							"DestinationDefinition": {
								"Config": {
									"cdkV2Enabled": true
								}
							}
						},
						"metadata": {
							"destinationId": 1234
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
							"endpoint": "",
							"headers": {},
							"params": {},
							"body": {
								"JSON": {
									"list": [
										{
											"hashedEmail": "ac0f1baec38a9ef3cfcb56db981df7d9bab2568c7f53ef3776d1c059ec58e72b",
											"email": "alex@email.com"
										},
										{
											"hashedEmail": "49eaeca26c878f268ad33af8cfa8194ca5b8b8e448b1c775bf9153a2de734579",
											"email": "amy@abc.com"
										},
										{
											"hashedEmail": "2048acfa84a01121060ca2fc8a673a76d427176dc37224d4408c21973bd90e5c",
											"email": "van@abc.com"
										}
									],
									"action": "Add"
								},
								"JSON_ARRAY": {},
								"XML": {},
								"FORM": {}
							},
							"files": {},
							"userId": ""
						},
						"metadata": {
							"destinationId": 1234
						},
						"statusCode": 200
					}
				]
			}
		}
	},
	{
		"name": "bingads_audience",
		"description": "hashed email available with hashEmail as false in config",
		"feature": "processor",
		"module": "destination",
		"version": "v0",
		"input": {
			"request": {
				"body": [
					{
						"message": {
							"userId": "user 1",
							"type": "audiencelist",
							"properties": {
								"listData": {
									"add": [
										{
											"email": "ac0f1baec38a9ef3cfcb56db981df7d9bab2568c7f53ef3776d1c059ec58e72b"
										},
										{
											"email": "49eaeca26c878f268ad33af8cfa8194ca5b8b8e448b1c775bf9153a2de734579"
										},
										{
											"email": "2048acfa84a01121060ca2fc8a673a76d427176dc37224d4408c21973bd90e5c"
										}
									]
								}
							},
							"context": {
								"ip": "14.5.67.21",
								"library": {
									"name": "http"
								}
							},
							"timestamp": "2020-02-02T00:23:09.544Z"
						},
						"destination": {
							"Config": {
								"customerAccountId": "89236978",
								"customerId": "78678678",
								"audienceId": "564567",
								"hashEmail": false
							},
							"DestinationDefinition": {
								"Config": {
									"cdkV2Enabled": true
								}
							}
						},
						"metadata": {
							"destinationId": 1234
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
							"endpoint": "",
							"headers": {},
							"params": {},
							"body": {
								"JSON": {
									"list": [
										{
											"hashedEmail": "ac0f1baec38a9ef3cfcb56db981df7d9bab2568c7f53ef3776d1c059ec58e72b",
											"email": "ac0f1baec38a9ef3cfcb56db981df7d9bab2568c7f53ef3776d1c059ec58e72b"
										},
										{
											"hashedEmail": "49eaeca26c878f268ad33af8cfa8194ca5b8b8e448b1c775bf9153a2de734579",
											"email": "49eaeca26c878f268ad33af8cfa8194ca5b8b8e448b1c775bf9153a2de734579"
										},
										{
											"hashedEmail": "2048acfa84a01121060ca2fc8a673a76d427176dc37224d4408c21973bd90e5c",
											"email": "2048acfa84a01121060ca2fc8a673a76d427176dc37224d4408c21973bd90e5c"
										}
									],
									"action": "Add"
								},
								"JSON_ARRAY": {},
								"XML": {},
								"FORM": {}
							},
							"files": {},
							"userId": ""
						},
						"metadata": {
							"destinationId": 1234
						},
						"statusCode": 200
					}
				]
			}
		}
	},
	{
		"name": "bingads_audience",
		"description": "Unsupported action type",
		"feature": "processor",
		"module": "destination",
		"version": "v0",
		"input": {
			"request": {
				"body": [
					{
						"message": {
							"userId": "user 1",
							"type": "audiencelist",
							"properties": {
								"listData": {
									"addition": [
										{
											"email": "alex@email.com"
										},
										{
											"email": "amy@abc.com"
										},
										{
											"email": "van@abc.com"
										}
									]
								}
							},
							"context": {
								"ip": "14.5.67.21",
								"library": {
									"name": "http"
								}
							},
							"timestamp": "2020-02-02T00:23:09.544Z"
						},
						"destination": {
							"Config": {
								"customerAccountId": "89236978",
								"customerId": "78678678",
								"audienceId": "564567",
								"hashEmail": true
							},
							"DestinationDefinition": {
								"Config": {
									"cdkV2Enabled": true
								}
							}
						},
						"metadata": {
							"destinationId": 1234
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
							"destinationId": 1234
						},
						"statusCode": 400,
						"error": "unsupported action type. Aborting message.: Workflow: procWorkflow, Step: validateInput, ChildStep: undefined, OriginalError: unsupported action type. Aborting message.",
						"statTags": {
							"errorCategory": "dataValidation",
							"errorType": "instrumentation",
							"implementation": "cdkV2",
							"destType": "BINGADS_AUDIENCE",
							"module": "destination",
							"feature": "processor",
							"destinationId": 1234
						}
					}
				]
			}
		}
	},
	{
		"name": "bingads_audience",
		"description": "Unsupported event type",
		"feature": "processor",
		"module": "destination",
		"version": "v0",
		"input": {
			"request": {
				"body": [
					{
						"message": {
							"userId": "user 1",
							"type": "track",
							"properties": {
								"listData": {
									"add": [
										{
											"email": "alex@email.com"
										},
										{
											"email": "amy@abc.com"
										},
										{
											"email": "van@abc.com"
										}
									]
								}
							},
							"context": {
								"ip": "14.5.67.21",
								"library": {
									"name": "http"
								}
							},
							"timestamp": "2020-02-02T00:23:09.544Z"
						},
						"destination": {
							"Config": {
								"customerAccountId": "89236978",
								"customerId": "78678678",
								"audienceId": "564567",
								"hashEmail": true
							},
							"DestinationDefinition": {
								"Config": {
									"cdkV2Enabled": true
								}
							}
						},
						"metadata": {
							"destinationId": 1234
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
							"destinationId": 1234
						},
						"statusCode": 400,
						"error": "Event type track is not supported. Aborting message.: Workflow: procWorkflow, Step: validateInput, ChildStep: undefined, OriginalError: Event type track is not supported. Aborting message.",
						"statTags": {
							"errorCategory": "dataValidation",
							"errorType": "instrumentation",
							"implementation": "cdkV2",
							"destType": "BINGADS_AUDIENCE",
							"module": "destination",
							"feature": "processor",
							"destinationId": 1234
						}
					}
				]
			}
		}
	},
	{
		"name": "bingads_audience",
		"description": "event type not present",
		"feature": "processor",
		"module": "destination",
		"version": "v0",
		"input": {
			"request": {
				"body": [
					{
						"message": {
							"userId": "user 1",
							"type": "",
							"properties": {
								"listData": {
									"add": [
										{
											"email": "alex@email.com"
										},
										{
											"email": "amy@abc.com"
										},
										{
											"email": "van@abc.com"
										}
									]
								}
							},
							"context": {
								"ip": "14.5.67.21",
								"library": {
									"name": "http"
								}
							},
							"timestamp": "2020-02-02T00:23:09.544Z"
						},
						"destination": {
							"Config": {
								"customerAccountId": "89236978",
								"customerId": "78678678",
								"audienceId": "564567",
								"hashEmail": true
							},
							"DestinationDefinition": {
								"Config": {
									"cdkV2Enabled": true
								}
							}
						},
						"metadata": {
							"destinationId": 1234
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
							"destinationId": 1234
						},
						"statusCode": 400,
						"error": "message Type is not present. Aborting message.: Workflow: procWorkflow, Step: validateInput, ChildStep: undefined, OriginalError: message Type is not present. Aborting message.",
						"statTags": {
							"errorCategory": "dataValidation",
							"errorType": "instrumentation",
							"implementation": "cdkV2",
							"destType": "BINGADS_AUDIENCE",
							"module": "destination",
							"feature": "processor",
							"destinationId": 1234
						}
					}
				]
			}
		}
	},
	{
		"name": "bingads_audience",
		"description": "Message properties is not present",
		"feature": "processor",
		"module": "destination",
		"version": "v0",
		"input": {
			"request": {
				"body": [
					{
						"message": {
							"userId": "user 1",
							"type": "audiencelist",
							"context": {
								"ip": "14.5.67.21",
								"library": {
									"name": "http"
								}
							},
							"timestamp": "2020-02-02T00:23:09.544Z"
						},
						"destination": {
							"Config": {
								"customerAccountId": "89236978",
								"customerId": "78678678",
								"audienceId": "564567",
								"hashEmail": true
							},
							"DestinationDefinition": {
								"Config": {
									"cdkV2Enabled": true
								}
							}
						},
						"metadata": {
							"destinationId": 1234
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
							"destinationId": 1234
						},
						"statusCode": 400,
						"error": "Message properties is not present. Aborting message.: Workflow: procWorkflow, Step: validateInput, ChildStep: undefined, OriginalError: Message properties is not present. Aborting message.",
						"statTags": {
							"errorCategory": "dataValidation",
							"errorType": "instrumentation",
							"implementation": "cdkV2",
							"destType": "BINGADS_AUDIENCE",
							"module": "destination",
							"feature": "processor",
							"destinationId": 1234
						}
					}
				]
			}
		}
	},
	{
		"name": "bingads_audience",
		"description": "listData is not present in properties",
		"feature": "processor",
		"module": "destination",
		"version": "v0",
		"input": {
			"request": {
				"body": [
					{
						"message": {
							"userId": "user 1",
							"type": "audiencelist",
							"properties": {},
							"context": {
								"ip": "14.5.67.21",
								"library": {
									"name": "http"
								}
							},
							"timestamp": "2020-02-02T00:23:09.544Z"
						},
						"destination": {
							"Config": {
								"customerAccountId": "89236978",
								"customerId": "78678678",
								"audienceId": "564567",
								"hashEmail": true
							},
							"DestinationDefinition": {
								"Config": {
									"cdkV2Enabled": true
								}
							}
						},
						"metadata": {
							"destinationId": 1234
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
							"destinationId": 1234
						},
						"statusCode": 400,
						"error": "listData is not present inside properties. Aborting message.: Workflow: procWorkflow, Step: validateInput, ChildStep: undefined, OriginalError: listData is not present inside properties. Aborting message.",
						"statTags": {
							"errorCategory": "dataValidation",
							"errorType": "instrumentation",
							"implementation": "cdkV2",
							"destType": "BINGADS_AUDIENCE",
							"module": "destination",
							"feature": "processor",
							"destinationId": 1234
						}
					}
				]
			}
		}
	},
	{
		"name": "bingads_audience",
		"description": "Both add and remove are present in listData",
		"feature": "processor",
		"module": "destination",
		"version": "v0",
		"input": {
			"request": {
				"body": [
					{
						"message": {
							"userId": "user 1",
							"type": "audiencelist",
							"properties": {
								"listData": {
									"remove": [
										{
											"email": "ac0f1baec38a9ef3cfcb56db981df7d9bab2568c7f53ef3776d1c059ec58e72b"
										},
										{
											"email": "49eaeca26c878f268ad33af8cfa8194ca5b8b8e448b1c775bf9153a2de734579"
										},
										{
											"email": "2048acfa84a01121060ca2fc8a673a76d427176dc37224d4408c21973bd90e5c"
										}
									],
									"update": [
										{
											"email": "ac0f1baec38a9ef3cfcb56db981df7d9bab2568c7f53ef3776d1c059ec58e72b"
										},
										{
											"email": "49eaeca26c878f268ad33af8cfa8194ca5b8b8e448b1c775bf9153a2de734579"
										},
										{
											"email": "2048acfa84a01121060ca2fc8a673a76d427176dc37224d4408c21973bd90e5c"
										}
									]
								}
							},
							"context": {
								"ip": "14.5.67.21",
								"library": {
									"name": "http"
								}
							},
							"timestamp": "2020-02-02T00:23:09.544Z"
						},
						"destination": {
							"Config": {
								"customerAccountId": "89236978",
								"customerId": "78678678",
								"audienceId": "564567",
								"hashEmail": false
							},
							"DestinationDefinition": {
								"Config": {
									"cdkV2Enabled": true
								}
							}
						},
						"metadata": {
							"destinationId": 1234
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
							"endpoint": "",
							"headers": {},
							"params": {},
							"body": {
								"JSON": {
									"list": [
										{
											"hashedEmail": "ac0f1baec38a9ef3cfcb56db981df7d9bab2568c7f53ef3776d1c059ec58e72b",
											"email": "ac0f1baec38a9ef3cfcb56db981df7d9bab2568c7f53ef3776d1c059ec58e72b"
										},
										{
											"hashedEmail": "49eaeca26c878f268ad33af8cfa8194ca5b8b8e448b1c775bf9153a2de734579",
											"email": "49eaeca26c878f268ad33af8cfa8194ca5b8b8e448b1c775bf9153a2de734579"
										},
										{
											"hashedEmail": "2048acfa84a01121060ca2fc8a673a76d427176dc37224d4408c21973bd90e5c",
											"email": "2048acfa84a01121060ca2fc8a673a76d427176dc37224d4408c21973bd90e5c"
										}
									],
									"action": "Remove"
								},
								"JSON_ARRAY": {},
								"XML": {},
								"FORM": {}
							},
							"files": {},
							"userId": ""
						},
						"metadata": {
							"destinationId": 1234
						},
						"statusCode": 200
					},
					{
						"output": {
							"version": "1",
							"type": "REST",
							"method": "POST",
							"endpoint": "",
							"headers": {},
							"params": {},
							"body": {
								"JSON": {
									"list": [
										{
											"hashedEmail": "ac0f1baec38a9ef3cfcb56db981df7d9bab2568c7f53ef3776d1c059ec58e72b",
											"email": "ac0f1baec38a9ef3cfcb56db981df7d9bab2568c7f53ef3776d1c059ec58e72b"
										},
										{
											"hashedEmail": "49eaeca26c878f268ad33af8cfa8194ca5b8b8e448b1c775bf9153a2de734579",
											"email": "49eaeca26c878f268ad33af8cfa8194ca5b8b8e448b1c775bf9153a2de734579"
										},
										{
											"hashedEmail": "2048acfa84a01121060ca2fc8a673a76d427176dc37224d4408c21973bd90e5c",
											"email": "2048acfa84a01121060ca2fc8a673a76d427176dc37224d4408c21973bd90e5c"
										}
									],
									"action": "Replace"
								},
								"JSON_ARRAY": {},
								"XML": {},
								"FORM": {}
							},
							"files": {},
							"userId": ""
						},
						"metadata": {
							"destinationId": 1234
						},
						"statusCode": 200
					}
				]
			}
		}
	},
	{
		"name": "bingads_audience",
		"description": "Only single user data is present",
		"feature": "processor",
		"module": "destination",
		"version": "v0",
		"input": {
			"request": {
				"body": [
					{
						"message": {
							"userId": "user 1",
							"type": "audiencelist",
							"properties": {
								"listData": {
									"add": [
										{
											"email": "alex@email.com"
										}
									]
								}
							},
							"context": {
								"ip": "14.5.67.21",
								"library": {
									"name": "http"
								}
							},
							"timestamp": "2020-02-02T00:23:09.544Z"
						},
						"metadata": {
							"sourceType": "",
							"destinationType": "",
							"namespace": ""
						},
						"destination": {
							"DestinationDefinition": {
								"Config": {
									"cdkV2Enabled": true
								}
							},
							"Config": {
								"customerAccountId": "89236978",
								"customerId": "78678678",
								"audienceId": "564567",
								"hashEmail": true
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
							"endpoint": "",
							"headers": {},
							"params": {},
							"body": {
								"JSON": {
									"list": [
										{
											"hashedEmail": "ac0f1baec38a9ef3cfcb56db981df7d9bab2568c7f53ef3776d1c059ec58e72b",
											"email": "alex@email.com"
										}
									],
									"action": "Add"
								},
								"JSON_ARRAY": {},
								"XML": {},
								"FORM": {}
							},
							"files": {},
							"userId": ""
						},
						"metadata": {
							"sourceType": "",
							"destinationType": "",
							"namespace": ""
						},
						"statusCode": 200
					}
				]
			}
		}
	},
	{
		"name": "bingads_audience",
		"description": "unhashed email available with hashEmail as true in config",
		"feature": "processor",
		"module": "destination",
		"version": "v0",
		"input": {
			"request": {
				"body": [
					{
						message: {
							userId: 'user 1',
							type: 'audiencelist',
							properties: {
								listData: {
									add: [
										{
											email: 'alex@email.com',
										},
										{
											email: 'amy@abc.com',
										},
										{
											email: 'van@abc.com',
										},
									],
								},
							},
							context: {
								ip: '14.5.67.21',
								library: {
									name: 'http',
								},
							},
							timestamp: '2020-02-02T00:23:09.544Z',
						},
						destination: {
							DestinationDefinition: {
								"Config": {
									"cdkV2Enabled": true
								}
							},
							Config: {
								customerAccountId: '89236978',
								customerId: '78678678',
								audienceId: '564567',
								hashEmail: true,
							},
						},
						"metadata": {
							"sourceType": "",
							"destinationType": "",
							"namespace": ""
						},
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
							"destinationType": "",
							"namespace": "",
							"sourceType": "",
						},
						"output": {
							"body": {
								"FORM": {},
								"JSON": {
									list: [
										{
											hashedEmail: 'ac0f1baec38a9ef3cfcb56db981df7d9bab2568c7f53ef3776d1c059ec58e72b',
											email: 'alex@email.com',
										},
										{
											hashedEmail: '49eaeca26c878f268ad33af8cfa8194ca5b8b8e448b1c775bf9153a2de734579',
											email: 'amy@abc.com',
										},
										{
											hashedEmail: '2048acfa84a01121060ca2fc8a673a76d427176dc37224d4408c21973bd90e5c',
											email: 'van@abc.com',
										},
									],
									action: 'Add',
								},
								"JSON_ARRAY": {},
								"XML": {},
							},
							"endpoint": "",
							"files": {},
							"headers": {},
							"method": "POST",
							"params": {},
							"type": "REST",
							"userId": "",
							"version": "1",
						},
						"statusCode": 200,
					}
				]
			}
		}
	},
	{
		"name": "bingads_audience",
		"description": "hashed email available with hashEmail as false in config",
		"feature": "processor",
		"module": "destination",
		"version": "v0",
		"input": {
			"request": {
				"body": [
					{
						message: {
							userId: 'user 1',
							type: 'audiencelist',
							properties: {
								listData: {
									update: [
										{
											email: 'ac0f1baec38a9ef3cfcb56db981df7d9bab2568c7f53ef3776d1c059ec58e72b',
										},
										{
											email: '49eaeca26c878f268ad33af8cfa8194ca5b8b8e448b1c775bf9153a2de734579',
										},
									],
									remove: [
										{
											email: '2048acfa84a01121060ca2fc8a673a76d427176dc37224d4408c21973bd90e5c',
										},
									],
								},
							},
							context: {
								ip: '14.5.67.21',
								library: {
									name: 'http',
								},
							},
							timestamp: '2020-02-02T00:23:09.544Z',
						},
						destination: {
							"DestinationDefinition": {
								"Config": {
									"cdkV2Enabled": true
								}
							},
							Config: {
								customerAccountId: '89236978',
								customerId: '78678678',
								audienceId: '564567',
								hashEmail: false,
							},
						},
						"metadata": {
							"sourceType": "",
							"destinationType": "",
							"namespace": ""
						},
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
							"endpoint": "",
							"headers": {},
							"params": {},
							"body": {
								"JSON": {
									"list": [
										{
											"hashedEmail": "ac0f1baec38a9ef3cfcb56db981df7d9bab2568c7f53ef3776d1c059ec58e72b",
											"email": "ac0f1baec38a9ef3cfcb56db981df7d9bab2568c7f53ef3776d1c059ec58e72b"
										},
										{
											"hashedEmail": "49eaeca26c878f268ad33af8cfa8194ca5b8b8e448b1c775bf9153a2de734579",
											"email": "49eaeca26c878f268ad33af8cfa8194ca5b8b8e448b1c775bf9153a2de734579"
										}
									],
									"action": "Replace"
								},
								"JSON_ARRAY": {},
								"XML": {},
								"FORM": {}
							},
							"files": {},
							"userId": ""
						},
						"metadata": {
							"sourceType": "",
							"destinationType": "",
							"namespace": ""
						},
						"statusCode": 200
					},
					{
						"output": {
							"version": "1",
							"type": "REST",
							"method": "POST",
							"endpoint": "",
							"headers": {},
							"params": {},
							"body": {
								"JSON": {
									"list": [
										{
											"hashedEmail": "2048acfa84a01121060ca2fc8a673a76d427176dc37224d4408c21973bd90e5c",
											"email": "2048acfa84a01121060ca2fc8a673a76d427176dc37224d4408c21973bd90e5c"
										}
									],
									"action": "Remove"
								},
								"JSON_ARRAY": {},
								"XML": {},
								"FORM": {}
							},
							"files": {},
							"userId": ""
						},
						"metadata": {
							"sourceType": "",
							"destinationType": "",
							"namespace": ""
						},
						"statusCode": 200
					}
				]
			}
		}
	},
	{
		"name": "bingads_audience",
		"description": "validateInput should fail when properties are missing",
		"feature": "processor",
		"module": "destination",
		"version": "v0",
		"input": {
			"request": {
				"body": [
					{
						message: {
							userId: 'user 1',
							type: 'audiencelist',
							context: {
								ip: '14.5.67.21',
								library: {
									name: 'http',
								},
							},
							timestamp: '2020-02-02T00:23:09.544Z',
						},
						destination: {
							"DestinationDefinition": {
								"Config": {
									"cdkV2Enabled": true
								}
							},
							Config: {
								customerAccountId: '89236978',
								customerId: '78678678',
								audienceId: '564567',
								hashEmail: false,
							},
						},
						"metadata": {
							"sourceType": "",
							"destinationType": "",
							"namespace": ""
						},
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
							"sourceType": "",
							"destinationType": "",
							"namespace": ""
						},
						"statusCode": 400,
						"error": "Message properties is not present. Aborting message.: Workflow: procWorkflow, Step: validateInput, ChildStep: undefined, OriginalError: Message properties is not present. Aborting message.",
						"statTags": {
							"errorCategory": "dataValidation",
							"errorType": "instrumentation",
							"implementation": "cdkV2",
							"destType": "BINGADS_AUDIENCE",
							"module": "destination",
							"feature": "processor"
						}
					}
				]
			}
		}
	}
]