export const data = [
	{
		"name": "tiktok_ads_offline_events",
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
								"accessToken": "dummyAccessToken",
								"hashUserProperties": true
							}
						},
						"message": {
							"type": "Identify",
							"userId": "yash001",
							"originalTimestamp": "2019-10-14T09:03:17.562Z"
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
						"error": "Event type identify is not supported",
						"statTags": {
							"errorCategory": "dataValidation",
							"errorType": "instrumentation",
							"destType": "TIKTOK_ADS_OFFLINE_EVENTS",
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
		"name": "tiktok_ads_offline_events",
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
								"accessToken": "dummyAccessToken",
								"hashUserProperties": false
							}
						},
						"message": {
							"event": "subscribe",
							"context": {
								"traits": {
									"phone": "c775e7b757ede630cd0aa1113bd102661ab38829ca52a6422ab782862f268646"
								},
								"channel": "web"
							},
							"properties": {
								"eventSetId": "7181537436256731137",
								"eventId": "1616318632825_352",
								"order_id": "abc_xyz",
								"shop_id": "123abc",
								"currency": "USD",
								"value": 46,
								"price": 8,
								"quantity": 2,
								"content_type": "product1234",
								"product_id": "1077218",
								"name": "socks",
								"category": "Men's cloth"
							},
							"type": "track",
							"userId": "eventIdn01",
							"timestamp": "2023-01-03"
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
							"endpoint": "https://business-api.tiktok.com/open_api/v1.3/offline/track/",
							"headers": {
								"Access-Token": "dummyAccessToken",
								"Content-Type": "application/json"
							},
							"params": {},
							"body": {
								"JSON": {
									"event_set_id": "7181537436256731137",
									"event_id": "1616318632825_352",
									"timestamp": "2023-01-03",
									"properties": {
										"order_id": "abc_xyz",
										"shop_id": "123abc",
										"currency": "USD",
										"value": 46,
										"event_channel": "web",
										"contents": [
											{
												"content_name": "socks",
												"content_type": "product1234",
												"content_category": "Men's cloth",
												"content_id": "1077218",
												"price": 8,
												"quantity": 2
											}
										]
									},
									"event": "Subscribe",
									"partner_name": "RudderStack",
									"context": {
										"user": {
											"phone_numbers": [
												"c775e7b757ede630cd0aa1113bd102661ab38829ca52a6422ab782862f268646"
											]
										}
									}
								},
								"JSON_ARRAY": {},
								"XML": {},
								"FORM": {}
							},
							"files": {},
							"event_set_id": "7181537436256731137",
							"userId": ""
						},
						"statusCode": 200
					}
				]
			}
		}
	},
	{
		"name": "tiktok_ads_offline_events",
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
								"accessToken": "dummyAccessToken",
								"hashUserProperties": true
							}
						},
						"message": {
							"event": "subscribe",
							"context": {
								"traits": {
									"phone": "1234567890"
								},
								"channel": "web"
							},
							"properties": {
								"eventSetId": "7181537436256731137",
								"eventId": "1616318632825_352",
								"prop1": "val1"
							},
							"type": "track",
							"userId": "eventIdn01",
							"timestamp": "2023-01-03"
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
							"endpoint": "https://business-api.tiktok.com/open_api/v1.3/offline/track/",
							"headers": {
								"Access-Token": "dummyAccessToken",
								"Content-Type": "application/json"
							},
							"params": {},
							"body": {
								"JSON": {
									"event_set_id": "7181537436256731137",
									"event_id": "1616318632825_352",
									"timestamp": "2023-01-03",
									"properties": {
										"event_channel": "web"
									},
									"event": "Subscribe",
									"partner_name": "RudderStack",
									"context": {
										"user": {
											"phone_numbers": [
												"c775e7b757ede630cd0aa1113bd102661ab38829ca52a6422ab782862f268646"
											]
										}
									}
								},
								"JSON_ARRAY": {},
								"XML": {},
								"FORM": {}
							},
							"files": {},
							"event_set_id": "7181537436256731137",
							"userId": ""
						},
						"statusCode": 200
					}
				]
			}
		}
	},
	{
		"name": "tiktok_ads_offline_events",
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
								"accessToken": "dummyAccessToken",
								"hashUserProperties": true,
								"eventsToStandard": [
									{
										"from": "RandomEvent",
										"to": "SubmitForm"
									}
								]
							}
						},
						"message": {
							"event": "RandomEvent",
							"context": {
								"traits": {
									"phone": "1234567890"
								},
								"channel": "web"
							},
							"properties": {
								"eventSetId": "7185009018564395009",
								"eventId": "1616318632003_004",
								"prop1": "val1"
							},
							"userId": "eventIdn01",
							"timestamp": "2023-01-03",
							"type": "track"
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
							"endpoint": "https://business-api.tiktok.com/open_api/v1.3/offline/track/",
							"headers": {
								"Access-Token": "dummyAccessToken",
								"Content-Type": "application/json"
							},
							"params": {},
							"body": {
								"JSON": {
									"event_set_id": "7185009018564395009",
									"event_id": "1616318632003_004",
									"timestamp": "2023-01-03",
									"properties": {
										"event_channel": "web"
									},
									"event": "SubmitForm",
									"partner_name": "RudderStack",
									"context": {
										"user": {
											"phone_numbers": [
												"c775e7b757ede630cd0aa1113bd102661ab38829ca52a6422ab782862f268646"
											]
										}
									}
								},
								"JSON_ARRAY": {},
								"XML": {},
								"FORM": {}
							},
							"files": {},
							"event_set_id": "7185009018564395009",
							"userId": ""
						},
						"statusCode": 200
					}
				]
			}
		}
	},
	{
		"name": "tiktok_ads_offline_events",
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
								"hashUserProperties": true
							}
						},
						"message": {
							"type": "track",
							"userId": "yash001",
							"originalTimestamp": "2019-10-14T09:03:17.562Z"
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
						"error": "Access Token not found",
						"statTags": {
							"errorCategory": "dataValidation",
							"errorType": "configuration",
							"destType": "TIKTOK_ADS_OFFLINE_EVENTS",
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
		"name": "tiktok_ads_offline_events",
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
								"accessToken": "dummyAccessToken",
								"hashUserProperties": true
							}
						},
						"message": {
							"event": "subscribe",
							"context": {
								"traits": {
									"phone": "1234567890",
									"email": "random@mail.com"
								},
								"channel": "web"
							},
							"properties": {
								"eventSetId": "7181537436256731137",
								"eventId": "1616318632825_352",
								"products": [
									{
										"price": 8,
										"quantity": 2,
										"content_type": "product1",
										"product_id": "1077218",
										"name": "socks",
										"category": "Men's cloth"
									},
									{
										"price": 18,
										"quantity": 12,
										"content_type": "product2",
										"product_id": "1077219",
										"name": "socks1",
										"category": "Men's cloth1"
									}
								]
							},
							"type": "track",
							"userId": "eventIdn01",
							"timestamp": "2023-01-03"
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
							"endpoint": "https://business-api.tiktok.com/open_api/v1.3/offline/track/",
							"headers": {
								"Access-Token": "dummyAccessToken",
								"Content-Type": "application/json"
							},
							"params": {},
							"body": {
								"JSON": {
									"event_set_id": "7181537436256731137",
									"event_id": "1616318632825_352",
									"timestamp": "2023-01-03",
									"properties": {
										"event_channel": "web",
										"contents": [
											{
												"content_name": "socks",
												"content_type": "product1",
												"content_category": "Men's cloth",
												"content_id": "1077218",
												"price": 8,
												"quantity": 2
											},
											{
												"content_name": "socks1",
												"content_type": "product2",
												"content_category": "Men's cloth1",
												"content_id": "1077219",
												"price": 18,
												"quantity": 12
											}
										]
									},
									"event": "Subscribe",
									"partner_name": "RudderStack",
									"context": {
										"user": {
											"emails": [
												"d9fcca64ec1b250da4261a3f89a8e0f7749c4e0f5a1a918e5397194c8b5a9f16"
											],
											"phone_numbers": [
												"c775e7b757ede630cd0aa1113bd102661ab38829ca52a6422ab782862f268646"
											]
										}
									}
								},
								"JSON_ARRAY": {},
								"XML": {},
								"FORM": {}
							},
							"files": {},
							"event_set_id": "7181537436256731137",
							"userId": ""
						},
						"statusCode": 200
					}
				]
			}
		}
	},
	{
		"name": "tiktok_ads_offline_events",
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
								"accessToken": "dummyAccessToken",
								"hashUserProperties": true,
								"eventsToStandard": [
									{
										"from": "CompletePayment",
										"to": "Purchase"
									}
								]
							}
						},
						"message": {
							"type": "track",
							"event": "CompletePayment",
							"sentAt": "2023-03-22T00:02:33.802Z",
							"traits": {
								"email": [
									"efaaf5c8803af4fbf305d7a110c832673d89ed40983770329092fd04b0ba7900",
									"078d6c8e19f24093368d1712d7801970467f59216f7ccc087bf81b91e0e1f68f"
								],
								"phone": [
									"c4994d14e724936f1169147dddf1673a09af69b55cc54bc695dbe246bd093b05",
									"078d6c8e19f24093368d1712d7801970467f59216f7ccc087bf81b91e0e1f68f"
								]
							},
							"userId": "60241286212",
							"channel": "sources",
							"context": {
								"sources": {
									"job_id": "2N4WuoNQpGYmCPASUvnV86QyhY4/Syncher",
									"version": "v1.20.0",
									"job_run_id": "cgd4a063b2fn2e1j0q90",
									"task_run_id": "cgd4a063b2fn2e1j0qa0"
								}
							},
							"recordId": "16322",
							"rudderId": "5b4ed73f-69aa-4198-88d1-3d4d509acbf1",
							"messageId": "cgd4b663b2fn2e1j8th0",
							"timestamp": "2023-03-22T00:02:33.170Z",
							"properties": {
								"phone": "c4994d14e724936f1169147dddf1673a09af69b55cc54bc695dbe246bd093b05",
								"value": 32.839999999999996,
								"emails": "[\"efaaf5c8803af4fbf305d7a110c832673d89ed40983770329092fd04b0ba7900\",\"078d6c8e19f24093368d1712d7801970467f59216f7ccc087bf81b91e0e1f68f\",\"\",\"\",\"\",\"\",\"\",\"\",\"\",\"\"]",
								"eventId": "8965fb56-090f-47a5-aa7f-bbab22d9ec90",
								"currency": "USD",
								"order_id": 60241286212,
								"eventSetId": "7211223771099742210",
								"event_name": "CompletePayment"
							},
							"receivedAt": "2023-03-22T00:02:33.171Z",
							"request_ip": "10.7.78.187",
							"anonymousId": "60241286212",
							"originalTimestamp": "2023-03-22T00:02:33.802Z"
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
							"endpoint": "https://business-api.tiktok.com/open_api/v1.3/offline/track/",
							"headers": {
								"Access-Token": "dummyAccessToken",
								"Content-Type": "application/json"
							},
							"params": {},
							"body": {
								"JSON": {
									"event_set_id": "7211223771099742210",
									"event_id": "8965fb56-090f-47a5-aa7f-bbab22d9ec90",
									"timestamp": "2023-03-22T00:02:33.170Z",
									"properties": {
										"order_id": 60241286212,
										"currency": "USD",
										"value": 32.839999999999996
									},
									"event": "Purchase",
									"partner_name": "RudderStack",
									"context": {
										"user": {
											"emails": [
												"4dc75b075057df6f6b729e74a9feed1244dcf8ceb7903eaba13203f3268ae4b9",
												"77b639edeb3cd6c801ea05176b8acbfa38d5f38490b764cd0c80756d0cf9ec68"
											],
											"phone_numbers": [
												"28b7b205c2936d2ded022d2587fb2677a76e560e921b3ad615b739b0238baa5d",
												"77b639edeb3cd6c801ea05176b8acbfa38d5f38490b764cd0c80756d0cf9ec68"
											]
										}
									}
								},
								"JSON_ARRAY": {},
								"XML": {},
								"FORM": {}
							},
							"files": {},
							"event_set_id": "7211223771099742210",
							"userId": ""
						},
						"statusCode": 200
					}
				]
			}
		}
	}
]