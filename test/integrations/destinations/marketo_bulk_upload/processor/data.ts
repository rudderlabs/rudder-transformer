export const data = [
	{
		"name": "marketo_bulk_upload",
		"description": "Test 0",
		"feature": "processor",
		"module": "destination",
		"version": "v0",
		"input": {
			"request": {
				"body": [
					{
						"message": {
							"type": "identify",
							"traits": {
								"name": "Carlo Lombard",
								"plan": "Quarterly Team+ Plan for Enuffsaid Media",
								"email": "carlo@enuffsaid.media"
							},
							"userId": 476335,
							"context": {
								"ip": "14.0.2.238",
								"page": {
									"url": "enuffsaid.proposify.com",
									"path": "/settings",
									"method": "POST",
									"referrer": "https://enuffsaid.proposify.com/login"
								},
								"userAgent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/97.0.4692.71 Safari/537.36"
							},
							"rudderId": "786dfec9-jfh",
							"messageId": "5d9bc6e2-ekjh"
						},
						"destination": {
							"ID": "1mMy5cqbtfuaKZv1IhVQKnBdVwe",
							"Config": {
								"munchkinId": "XXXX",
								"clientId": "YYYY",
								"clientSecret": "ZZZZ",
								"columnFieldsMapping": [
									{
										"to": "name__c",
										"from": "name"
									},
									{
										"to": "email__c",
										"from": "email"
									},
									{
										"to": "plan__c",
										"from": "plan"
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
							"version": "1",
							"type": "REST",
							"method": "POST",
							"endpoint": "/fileUpload",
							"headers": {},
							"params": {},
							"body": {
								"JSON": {
									"name__c": "Carlo Lombard",
									"email__c": "carlo@enuffsaid.media",
									"plan__c": "Quarterly Team+ Plan for Enuffsaid Media"
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
		"name": "marketo_bulk_upload",
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
								"name": "Carlo Lombard",
								"plan": "Quarterly Team+ Plan for Enuffsaid Media",
								"email": "carlo@enuffsaid.media"
							},
							"userId": 476335,
							"context": {
								"ip": "14.0.2.238",
								"page": {
									"url": "enuffsaid.proposify.com",
									"path": "/settings",
									"method": "POST",
									"referrer": "https://enuffsaid.proposify.com/login"
								},
								"userAgent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/97.0.4692.71 Safari/537.36"
							},
							"rudderId": "786dfec9-jfh",
							"messageId": "5d9bc6e2-ekjh"
						},
						"destination": {
							"ID": "1mMy5cqbtfuaKZv1IhVQKnBdVwe",
							"Config": {
								"munchkinId": "XXXX",
								"clientId": "YYYY",
								"clientSecret": "ZZZZ",
								"columnFieldsMapping": [
									{
										"to": "name__c",
										"from": "name"
									},
									{
										"to": "email__c",
										"from": "email"
									},
									{
										"to": "plan__c",
										"from": "plan"
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
						"error": "Event type is required",
						"statTags": {
							"destType": "MARKETO_BULK_UPLOAD",
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
		"name": "marketo_bulk_upload",
		"description": "Test 2",
		"feature": "processor",
		"module": "destination",
		"version": "v0",
		"input": {
			"request": {
				"body": [
					{
						"message": {
							"type": "track",
							"traits": {
								"name": "Carlo Lombard",
								"plan": "Quarterly Team+ Plan for Enuffsaid Media",
								"email": "carlo@enuffsaid.media"
							},
							"userId": 476335,
							"context": {
								"ip": "14.0.2.238",
								"page": {
									"url": "enuffsaid.proposify.com",
									"path": "/settings",
									"method": "POST",
									"referrer": "https://enuffsaid.proposify.com/login"
								},
								"userAgent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/97.0.4692.71 Safari/537.36"
							},
							"rudderId": "786dfec9-jfh",
							"messageId": "5d9bc6e2-ekjh"
						},
						"destination": {
							"ID": "1mMy5cqbtfuaKZv1IhVQKnBdVwe",
							"Config": {
								"munchkinId": "XXXX",
								"clientId": "YYYY",
								"clientSecret": "ZZZZ",
								"columnFieldsMapping": [
									{
										"to": "name__c",
										"from": "name"
									},
									{
										"to": "email__c",
										"from": "email"
									},
									{
										"to": "plan__c",
										"from": "plan"
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
						"error": "Event type track is not supported",
						"statTags": {
							"destType": "MARKETO_BULK_UPLOAD",
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
		"name": "marketo_bulk_upload",
		"description": "Test 3",
		"feature": "processor",
		"module": "destination",
		"version": "v0",
		"input": {
			"request": {
				"body": [
					{
						"message": {
							"type": "identify",
							"traits": {
								"name": "Carlo Lombard",
								"plan": "Quarterly Team+ Plan for Enuffsaid Media",
								"email": "carlo@enuffsaid.media"
							},
							"userId": 476335,
							"context": {
								"ip": "14.0.2.238",
								"page": {
									"url": "enuffsaid.proposify.com",
									"path": "/settings",
									"method": "POST",
									"referrer": "https://enuffsaid.proposify.com/login"
								},
								"userAgent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/97.0.4692.71 Safari/537.36"
							},
							"rudderId": "786dfec9-jfh",
							"messageId": "5d9bc6e2-ekjh"
						},
						"destination": {
							"ID": "1mMy5cqbtfuaKZv1IhVQKnBdVwe",
							"Config": {
								"munchkinId": "XXXX",
								"clientId": "YYYY",
								"clientSecret": "ZZZZ",
								"columnFieldsMapping": [
									{
										"to": "name__c",
										"from": "1"
									},
									{
										"to": "email__c",
										"from": "email1"
									},
									{
										"to": "plan__c",
										"from": "plan1"
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
							"version": "1",
							"type": "REST",
							"method": "POST",
							"endpoint": "/fileUpload",
							"headers": {},
							"params": {},
							"body": {
								"JSON": {},
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
		"name": "marketo_bulk_upload",
		"description": "Test 4",
		"feature": "processor",
		"module": "destination",
		"version": "v0",
		"input": {
			"request": {
				"body": [
					{
						"message": {
							"type": "identify",
							"traits": {
								"name": "Carlo Lombard",
								"plan": "Quarterly Team+ Plan for Enuffsaid Media",
								"email": "carlo@enuffsaid.media"
							},
							"userId": 476335,
							"context": {
								"ip": "14.0.2.238",
								"page": {
									"url": "enuffsaid.proposify.com",
									"path": "/settings",
									"method": "POST",
									"referrer": "https://enuffsaid.proposify.com/login"
								},
								"userAgent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/97.0.4692.71 Safari/537.36"
							},
							"rudderId": "786dfec9-jfh",
							"messageId": "5d9bc6e2-ekjh"
						},
						"destination": {
							"ID": "1mMy5cqbtfuaKZv1IhVQKnBdVwe",
							"Config": {
								"munchkinId": "XXXX",
								"clientId": "YYYY",
								"clientSecret": "ZZZZ",
								"columnFieldsMapping": [
									{
										"to": "name__c",
										"from": "name"
									},
									{
										"to": "email__c",
										"from": "email1"
									},
									{
										"to": "plan__c",
										"from": "plan1"
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
							"version": "1",
							"type": "REST",
							"method": "POST",
							"endpoint": "/fileUpload",
							"headers": {},
							"params": {},
							"body": {
								"JSON": {
									"name__c": "Carlo Lombard"
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
		"name": "marketo_bulk_upload",
		"description": "Test 5",
		"feature": "processor",
		"module": "destination",
		"version": "v0",
		"input": {
			"request": {
				"body": [
					{
						"message": {
							"type": "identify",
							"traits": {
								"name": "Carlo Lombard",
								"plan": 1
							},
							"userId": 476335,
							"context": {
								"ip": "14.0.2.238",
								"page": {
									"url": "enuffsaid.proposify.com",
									"path": "/settings",
									"method": "POST",
									"referrer": "https://enuffsaid.proposify.com/login"
								},
								"userAgent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/97.0.4692.71 Safari/537.36"
							},
							"rudderId": "786dfec9-jfh",
							"messageId": "5d9bc6e2-ekjh"
						},
						"destination": {
							"ID": "1mMy5cqbtfuaKZv1IhVQKnBdVwe",
							"Config": {
								"munchkinId": "XXXX",
								"clientId": "YYYY",
								"clientSecret": "ZZZZ",
								"columnFieldsMapping": [
									{
										"to": "name__c",
										"from": "name"
									},
									{
										"to": "email__c",
										"from": "email"
									},
									{
										"to": "plan__c",
										"from": "plan"
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
							"version": "1",
							"type": "REST",
							"method": "POST",
							"endpoint": "/fileUpload",
							"headers": {},
							"params": {},
							"body": {
								"JSON": {
									"name__c": "Carlo Lombard",
									"plan__c": 1
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