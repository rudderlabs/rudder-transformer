import { defaultMockFns } from "../mocks"

export const data = [
	{
		"name": "facebook_conversions",
		"description": "Timestamp validation. Events must be sent within seven days of their occurrence or up to one minute in the future",
		"feature": "processor",
		"module": "destination",
		"version": "v0",
		"input": {
			"request": {
				"body": [
					{
						"message": {
							"anonymousId": "c82cbdff-e5be-4009-ac78-cdeea09ab4b1",
							"channel": "web",
							"context": {
								"device": {
									"id": "df16bffa-5c3d-4fbb-9bce-3bab098129a7R",
									"manufacturer": "Xiaomi",
									"model": "Redmi 6",
									"name": "xiaomi"
								},
								"network": {
									"carrier": "Banglalink"
								},
								"os": {
									"name": "android",
									"version": "8.1.0"
								},
								"screen": {
									"height": "100",
									"density": 50
								},
								"traits": {
									"email": "    aBc@gmail.com   ",
									"address": {
										"zip": 1234
									},
									"anonymousId": "c82cbdff-e5be-4009-ac78-cdeea09ab4b1"
								}
							},
							"event": "randomevent",
							"integrations": {
								"All": true
							},
							"message_id": "a80f82be-9bdc-4a9f-b2a5-15621ee41df8",
							"properties": {
								"revenue": 400,
								"additional_bet_index": 0
							},
							"timestamp": "2023-09-01T15:46:51.693229+05:30",
							"type": "track"
						},
						"destination": {
							"Config": {
								"limitedDataUsage": true,
								"blacklistPiiProperties": [
									{
										"blacklistPiiProperties": "",
										"blacklistPiiHash": false
									}
								],
								"accessToken": "09876",
								"datasetId": "dummyID",
								"eventsToEvents": [
									{
										"from": "",
										"to": ""
									}
								],
								"eventCustomProperties": [
									{
										"eventCustomProperties": ""
									}
								],
								"removeExternalId": true,
								"whitelistPiiProperties": [
									{
										"whitelistPiiProperties": ""
									}
								]
							},
							"Enabled": true
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
						"error": "Events must be sent within seven days of their occurrence or up to one minute in the future.",
						"statusCode": 400,
						"statTags": {
							"destType": "FACEBOOK_CONVERSIONS",
							"errorCategory": "dataValidation",
							"errorType": "instrumentation",
							"feature": "processor",
							"implementation": "native",
							"module": "destination",
						}
					}
				]
			}
		},
		"mockFns": defaultMockFns
	},
	{
		"name": "facebook_conversions",
		"description": "Track event without event property set",
		"feature": "processor",
		"module": "destination",
		"version": "v0",
		"input": {
			"request": {
				"body": [
					{
						"message": {
							"anonymousId": "c82cbdff-e5be-4009-ac78-cdeea09ab4b1",
							"channel": "web",
							"context": {
								"device": {
									"id": "df16bffa-5c3d-4fbb-9bce-3bab098129a7R",
									"manufacturer": "Xiaomi",
									"model": "Redmi 6",
									"name": "xiaomi"
								},
								"network": {
									"carrier": "Banglalink"
								},
								"os": {
									"name": "android",
									"version": "8.1.0"
								},
								"screen": {
									"height": "100",
									"density": 50
								},
								"traits": {
									"email": "    aBc@gmail.com   ",
									"address": {
										"zip": 1234
									},
									"anonymousId": "c82cbdff-e5be-4009-ac78-cdeea09ab4b1"
								}
							},
							"event": "",
							"integrations": {
								"All": true
							},
							"message_id": "a80f82be-9bdc-4a9f-b2a5-15621ee41df8",
							"properties": {
								"revenue": 400,
								"additional_bet_index": 0
							},
							"timestamp": "2023-11-12T15:46:51.693229+05:30",
							"type": "track"
						},
						"destination": {
							"Config": {
								"limitedDataUsage": true,
								"blacklistPiiProperties": [
									{
										"blacklistPiiProperties": "",
										"blacklistPiiHash": false
									}
								],
								"accessToken": "09876",
								"datasetId": "dummyID",
								"eventsToEvents": [
									{
										"from": "",
										"to": ""
									}
								],
								"eventCustomProperties": [
									{
										"eventCustomProperties": ""
									}
								],
								"removeExternalId": true,
								"whitelistPiiProperties": [
									{
										"whitelistPiiProperties": ""
									}
								],
								"actionSource": "website"
							},
							"Enabled": true
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
						"error": "'event' is required and should be a string",
						"statTags": {
							"destType": "FACEBOOK_CONVERSIONS",
							"errorCategory": "dataValidation",
							"errorType": "instrumentation",
							"feature": "processor",
							"implementation": "native",
							"module": "destination",
						},
						"statusCode": 400,
					}
				]
			}
		},
		"mockFns": defaultMockFns
	},
	{
		"name": "facebook_conversions",
		"description": "Simple track event",
		"feature": "processor",
		"module": "destination",
		"version": "v0",
		"input": {
			"request": {
				"body": [
					{
						"message": {
							"anonymousId": "c82cbdff-e5be-4009-ac78-cdeea09ab4b1",
							"channel": "web",
							"context": {
								"device": {
									"id": "df16bffa-5c3d-4fbb-9bce-3bab098129a7R",
									"manufacturer": "Xiaomi",
									"model": "Redmi 6",
									"name": "xiaomi"
								},
								"network": {
									"carrier": "Banglalink"
								},
								"os": {
									"name": "android",
									"version": "8.1.0"
								},
								"screen": {
									"height": "100",
									"density": 50
								},
								"traits": {
									"email": "    aBc@gmail.com   ",
									"address": {
										"zip": 1234
									},
									"anonymousId": "c82cbdff-e5be-4009-ac78-cdeea09ab4b1"
								}
							},
							"event": "spin_result",
							"integrations": {
								"All": true
							},
							"message_id": "a80f82be-9bdc-4a9f-b2a5-15621ee41df8",
							"properties": {
								"revenue": 400,
								"additional_bet_index": 0
							},
							"timestamp": "2023-11-12T15:46:51.693229+05:30",
							"type": "track"
						},
						"destination": {
							"Config": {
								"limitedDataUsage": true,
								"blacklistPiiProperties": [
									{
										"blacklistPiiProperties": "",
										"blacklistPiiHash": false
									}
								],
								"accessToken": "09876",
								"datasetId": "dummyID",
								"eventsToEvents": [
									{
										"from": "",
										"to": ""
									}
								],
								"eventCustomProperties": [
									{
										"eventCustomProperties": ""
									}
								],
								"removeExternalId": true,
								"whitelistPiiProperties": [
									{
										"whitelistPiiProperties": ""
									}
								],
								"actionSource": "website"
							},
							"Enabled": true
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
							"endpoint": "https://graph.facebook.com/v18.0/dummyID/events?access_token=09876",
							"headers": {},
							"params": {},
							"body": {
								"JSON": {},
								"XML": {},
								"JSON_ARRAY": {},
								"FORM": {
									"data": [
										"{\"user_data\":{\"em\":\"48ddb93f0b30c475423fe177832912c5bcdce3cc72872f8051627967ef278e08\",\"zp\":\"03ac674216f3e15c761ee1a5e255f067953623c8b388b4459e13f978d7c846f4\"},\"event_name\":\"spin_result\",\"event_time\":1699784211,\"action_source\":\"website\",\"custom_data\":{\"revenue\":400,\"additional_bet_index\":0,\"value\":400,\"currency\":\"USD\"}}"
									]
								}
							},
							"files": {},
							"userId": ""
						},
						"statusCode": 200
					}
				]
			}
		},
		"mockFns": defaultMockFns
	},
	{
		"name": "facebook_conversions",
		"description": "Track event with standard event products searched",
		"feature": "processor",
		"module": "destination",
		"version": "v0",
		"input": {
			"request": {
				"body": [
					{
						"message": {
							"anonymousId": "c82cbdff-e5be-4009-ac78-cdeea09ab4b1",
							"channel": "web",
							"context": {
								"device": {
									"id": "df16bffa-5c3d-4fbb-9bce-3bab098129a7R",
									"manufacturer": "Xiaomi",
									"model": "Redmi 6",
									"name": "xiaomi"
								},
								"network": {
									"carrier": "Banglalink"
								},
								"os": {
									"name": "android",
									"version": "8.1.0"
								},
								"screen": {
									"height": "100",
									"density": 50
								},
								"traits": {
									"email": "    aBc@gmail.com   ",
									"address": {
										"zip": 1234
									},
									"anonymousId": "c82cbdff-e5be-4009-ac78-cdeea09ab4b1"
								}
							},
							"event": "products searched",
							"integrations": {
								"All": true
							},
							"message_id": "a80f82be-9bdc-4a9f-b2a5-15621ee41df8",
							"properties": {
								"revenue": 400,
								"additional_bet_index": 0
							},
							"timestamp": "2023-11-12T15:46:51.693229+05:30",
							"type": "track"
						},
						"destination": {
							"Config": {
								"limitedDataUsage": true,
								"blacklistPiiProperties": [
									{
										"blacklistPiiProperties": "",
										"blacklistPiiHash": false
									}
								],
								"accessToken": "09876",
								"datasetId": "dummyID",
								"eventsToEvents": [
									{
										"from": "",
										"to": ""
									}
								],
								"eventCustomProperties": [
									{
										"eventCustomProperties": ""
									}
								],
								"removeExternalId": true,
								"whitelistPiiProperties": [
									{
										"whitelistPiiProperties": ""
									}
								],
								"actionSource": "website"
							},
							"Enabled": true
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
							"endpoint": "https://graph.facebook.com/v18.0/dummyID/events?access_token=09876",
							"headers": {},
							"params": {},
							"body": {
								"JSON": {},
								"XML": {},
								"JSON_ARRAY": {},
								"FORM": {
									"data": [
										"{\"user_data\":{\"em\":\"48ddb93f0b30c475423fe177832912c5bcdce3cc72872f8051627967ef278e08\",\"zp\":\"03ac674216f3e15c761ee1a5e255f067953623c8b388b4459e13f978d7c846f4\"},\"event_name\":\"Search\",\"event_time\":1699784211,\"action_source\":\"website\",\"custom_data\":{\"revenue\":400,\"additional_bet_index\":0,\"content_ids\":[],\"contents\":[],\"content_type\":\"product\",\"currency\":\"USD\",\"value\":400}}"
									]
								}
							},
							"files": {},
							"userId": ""
						},
						"statusCode": 200
					}
				]
			}
		},
		"mockFns": defaultMockFns
	},
	{
		"name": "facebook_conversions",
		"description": "Track event with standard event product added",
		"feature": "processor",
		"module": "destination",
		"version": "v0",
		"input": {
			"request": {
				"body": [
					{
						"message": {
							"anonymousId": "c82cbdff-e5be-4009-ac78-cdeea09ab4b1",
							"channel": "web",
							"context": {
								"device": {
									"id": "df16bffa-5c3d-4fbb-9bce-3bab098129a7R",
									"manufacturer": "Xiaomi",
									"model": "Redmi 6",
									"name": "xiaomi"
								},
								"network": {
									"carrier": "Banglalink"
								},
								"os": {
									"name": "android",
									"version": "8.1.0"
								},
								"screen": {
									"height": "100",
									"density": 50
								},
								"traits": {
									"email": "    aBc@gmail.com   ",
									"address": {
										"zip": 1234
									},
									"anonymousId": "c82cbdff-e5be-4009-ac78-cdeea09ab4b1"
								}
							},
							"event": "product added",
							"integrations": {
								"All": true
							},
							"message_id": "a80f82be-9bdc-4a9f-b2a5-15621ee41df8",
							"properties": {
								"revenue": 400,
								"additional_bet_index": 0
							},
							"timestamp": "2023-11-12T15:46:51.693229+05:30",
							"type": "track"
						},
						"destination": {
							"Config": {
								"limitedDataUsage": true,
								"blacklistPiiProperties": [
									{
										"blacklistPiiProperties": "",
										"blacklistPiiHash": false
									}
								],
								"accessToken": "09876",
								"datasetId": "dummyID",
								"eventsToEvents": [
									{
										"from": "",
										"to": ""
									}
								],
								"eventCustomProperties": [
									{
										"eventCustomProperties": ""
									}
								],
								"removeExternalId": true,
								"whitelistPiiProperties": [
									{
										"whitelistPiiProperties": ""
									}
								],
								"actionSource": "website"
							},
							"Enabled": true
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
							"endpoint": "https://graph.facebook.com/v18.0/dummyID/events?access_token=09876",
							"headers": {},
							"params": {},
							"body": {
								"JSON": {},
								"XML": {},
								"JSON_ARRAY": {},
								"FORM": {
									"data": [
										"{\"user_data\":{\"em\":\"48ddb93f0b30c475423fe177832912c5bcdce3cc72872f8051627967ef278e08\",\"zp\":\"03ac674216f3e15c761ee1a5e255f067953623c8b388b4459e13f978d7c846f4\"},\"event_name\":\"AddToCart\",\"event_time\":1699784211,\"action_source\":\"website\",\"custom_data\":{\"revenue\":400,\"additional_bet_index\":0,\"content_ids\":[],\"contents\":[],\"content_type\":\"product\",\"currency\":\"USD\",\"value\":400}}"
									]
								}
							},
							"files": {},
							"userId": ""
						},
						"statusCode": 200
					}
				]
			}
		},
		"mockFns": defaultMockFns
	},
	{
		"name": "facebook_conversions",
		"description": "Track event with standard event product viewed",
		"feature": "processor",
		"module": "destination",
		"version": "v0",
		"input": {
			"request": {
				"body": [
					{
						"message": {
							"anonymousId": "c82cbdff-e5be-4009-ac78-cdeea09ab4b1",
							"channel": "web",
							"context": {
								"device": {
									"id": "df16bffa-5c3d-4fbb-9bce-3bab098129a7R",
									"manufacturer": "Xiaomi",
									"model": "Redmi 6",
									"name": "xiaomi"
								},
								"network": {
									"carrier": "Banglalink"
								},
								"os": {
									"name": "android",
									"version": "8.1.0"
								},
								"screen": {
									"height": "100",
									"density": 50
								},
								"traits": {
									"email": "    aBc@gmail.com   ",
									"address": {
										"zip": 1234
									},
									"anonymousId": "c82cbdff-e5be-4009-ac78-cdeea09ab4b1"
								}
							},
							"event": "product viewed",
							"integrations": {
								"All": true
							},
							"message_id": "a80f82be-9bdc-4a9f-b2a5-15621ee41df8",
							"properties": {
								"revenue": 400,
								"additional_bet_index": 0
							},
							"timestamp": "2023-11-12T15:46:51.693229+05:30",
							"type": "track"
						},
						"destination": {
							"Config": {
								"limitedDataUsage": true,
								"blacklistPiiProperties": [
									{
										"blacklistPiiProperties": "",
										"blacklistPiiHash": false
									}
								],
								"accessToken": "09876",
								"datasetId": "dummyID",
								"eventsToEvents": [
									{
										"from": "",
										"to": ""
									}
								],
								"eventCustomProperties": [
									{
										"eventCustomProperties": ""
									}
								],
								"removeExternalId": true,
								"whitelistPiiProperties": [
									{
										"whitelistPiiProperties": ""
									}
								],
								"actionSource": "website"
							},
							"Enabled": true
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
							"endpoint": "https://graph.facebook.com/v18.0/dummyID/events?access_token=09876",
							"headers": {},
							"params": {},
							"body": {
								"JSON": {},
								"XML": {},
								"JSON_ARRAY": {},
								"FORM": {
									"data": [
										"{\"user_data\":{\"em\":\"48ddb93f0b30c475423fe177832912c5bcdce3cc72872f8051627967ef278e08\",\"zp\":\"03ac674216f3e15c761ee1a5e255f067953623c8b388b4459e13f978d7c846f4\"},\"event_name\":\"ViewContent\",\"event_time\":1699784211,\"action_source\":\"website\",\"custom_data\":{\"revenue\":400,\"additional_bet_index\":0,\"content_ids\":[],\"contents\":[],\"content_type\":\"product\",\"currency\":\"USD\",\"value\":400}}"
									]
								}
							},
							"files": {},
							"userId": ""
						},
						"statusCode": 200
					}
				]
			}
		},
		"mockFns": defaultMockFns
	},
	{
		"name": "facebook_conversions",
		"description": "Track event with standard event product list viewed",
		"feature": "processor",
		"module": "destination",
		"version": "v0",
		"input": {
			"request": {
				"body": [
					{
						"message": {
							"anonymousId": "c82cbdff-e5be-4009-ac78-cdeea09ab4b1",
							"channel": "web",
							"context": {
								"device": {
									"id": "df16bffa-5c3d-4fbb-9bce-3bab098129a7R",
									"manufacturer": "Xiaomi",
									"model": "Redmi 6",
									"name": "xiaomi"
								},
								"network": {
									"carrier": "Banglalink"
								},
								"os": {
									"name": "android",
									"version": "8.1.0"
								},
								"screen": {
									"height": "100",
									"density": 50
								},
								"traits": {
									"email": "    aBc@gmail.com   ",
									"address": {
										"zip": 1234
									},
									"anonymousId": "c82cbdff-e5be-4009-ac78-cdeea09ab4b1"
								}
							},
							"event": "product list viewed",
							"integrations": {
								"All": true
							},
							"message_id": "a80f82be-9bdc-4a9f-b2a5-15621ee41df8",
							"properties": {
								"revenue": 400,
								"additional_bet_index": 0,
								"products": [
									{
										"product_id": 1234,
										"quantity": 5,
										"price": 55
									}
								]
							},
							"timestamp": "2023-11-12T15:46:51.693229+05:30",
							"type": "track"
						},
						"destination": {
							"Config": {
								"limitedDataUsage": true,
								"blacklistPiiProperties": [
									{
										"blacklistPiiProperties": "",
										"blacklistPiiHash": false
									}
								],
								"accessToken": "09876",
								"datasetId": "dummyID",
								"eventsToEvents": [
									{
										"from": "",
										"to": ""
									}
								],
								"eventCustomProperties": [
									{
										"eventCustomProperties": ""
									}
								],
								"removeExternalId": true,
								"whitelistPiiProperties": [
									{
										"whitelistPiiProperties": ""
									}
								],
								"actionSource": "website"
							},
							"Enabled": true
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
							"endpoint": "https://graph.facebook.com/v18.0/dummyID/events?access_token=09876",
							"headers": {},
							"params": {},
							"body": {
								"JSON": {},
								"XML": {},
								"JSON_ARRAY": {},
								"FORM": {
									"data": [
										"{\"user_data\":{\"em\":\"48ddb93f0b30c475423fe177832912c5bcdce3cc72872f8051627967ef278e08\",\"zp\":\"03ac674216f3e15c761ee1a5e255f067953623c8b388b4459e13f978d7c846f4\"},\"event_name\":\"ViewContent\",\"event_time\":1699784211,\"action_source\":\"website\",\"custom_data\":{\"revenue\":400,\"additional_bet_index\":0,\"products\":[{\"product_id\":1234,\"quantity\":5,\"price\":55}],\"content_ids\":[1234],\"contents\":[{\"id\":1234,\"quantity\":5,\"item_price\":55}],\"content_type\":\"product\",\"currency\":\"USD\",\"value\":400}}"
									]
								}
							},
							"files": {},
							"userId": ""
						},
						"statusCode": 200
					}
				]
			}
		},
		"mockFns": defaultMockFns
	},
	{
		"name": "facebook_conversions",
		"description": "Track event with standard event product list viewed without products array",
		"feature": "processor",
		"module": "destination",
		"version": "v0",
		"input": {
			"request": {
				"body": [
					{
						"message": {
							"anonymousId": "c82cbdff-e5be-4009-ac78-cdeea09ab4b1",
							"channel": "web",
							"context": {
								"device": {
									"id": "df16bffa-5c3d-4fbb-9bce-3bab098129a7R",
									"manufacturer": "Xiaomi",
									"model": "Redmi 6",
									"name": "xiaomi"
								},
								"network": {
									"carrier": "Banglalink"
								},
								"os": {
									"name": "android",
									"version": "8.1.0"
								},
								"screen": {
									"height": "100",
									"density": 50
								},
								"traits": {
									"email": "    aBc@gmail.com   ",
									"address": {
										"zip": 1234
									},
									"anonymousId": "c82cbdff-e5be-4009-ac78-cdeea09ab4b1"
								}
							},
							"event": "product list viewed",
							"integrations": {
								"All": true
							},
							"message_id": "a80f82be-9bdc-4a9f-b2a5-15621ee41df8",
							"properties": {
								"revenue": 400,
								"additional_bet_index": 0,
								"category": "randomCategory"
							},
							"timestamp": "2023-11-12T15:46:51.693229+05:30",
							"type": "track"
						},
						"destination": {
							"Config": {
								"limitedDataUsage": true,
								"blacklistPiiProperties": [
									{
										"blacklistPiiProperties": "",
										"blacklistPiiHash": false
									}
								],
								"accessToken": "09876",
								"datasetId": "dummyID",
								"eventsToEvents": [
									{
										"from": "",
										"to": ""
									}
								],
								"eventCustomProperties": [
									{
										"eventCustomProperties": ""
									}
								],
								"removeExternalId": true,
								"whitelistPiiProperties": [
									{
										"whitelistPiiProperties": ""
									}
								],
								"actionSource": "website"
							},
							"Enabled": true
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
							"endpoint": "https://graph.facebook.com/v18.0/dummyID/events?access_token=09876",
							"headers": {},
							"params": {},
							"body": {
								"JSON": {},
								"XML": {},
								"JSON_ARRAY": {},
								"FORM": {
									"data": [
										"{\"user_data\":{\"em\":\"48ddb93f0b30c475423fe177832912c5bcdce3cc72872f8051627967ef278e08\",\"zp\":\"03ac674216f3e15c761ee1a5e255f067953623c8b388b4459e13f978d7c846f4\"},\"event_name\":\"ViewContent\",\"event_time\":1699784211,\"action_source\":\"website\",\"custom_data\":{\"revenue\":400,\"additional_bet_index\":0,\"category\":\"randomCategory\",\"content_ids\":[\"randomCategory\"],\"contents\":[{\"id\":\"randomCategory\",\"quantity\":1}],\"content_type\":\"product_group\",\"content_category\":\"randomCategory\",\"currency\":\"USD\",\"value\":400}}"
									]
								}
							},
							"files": {},
							"userId": ""
						},
						"statusCode": 200
					}
				]
			}
		},
		"mockFns": defaultMockFns
	},
	{
		"name": "facebook_conversions",
		"description": "Track event with standard event product added to wishlist",
		"feature": "processor",
		"module": "destination",
		"version": "v0",
		"input": {
			"request": {
				"body": [
					{
						"message": {
							"anonymousId": "c82cbdff-e5be-4009-ac78-cdeea09ab4b1",
							"channel": "web",
							"context": {
								"device": {
									"id": "df16bffa-5c3d-4fbb-9bce-3bab098129a7R",
									"manufacturer": "Xiaomi",
									"model": "Redmi 6",
									"name": "xiaomi"
								},
								"network": {
									"carrier": "Banglalink"
								},
								"os": {
									"name": "android",
									"version": "8.1.0"
								},
								"screen": {
									"height": "100",
									"density": 50
								},
								"traits": {
									"email": "    aBc@gmail.com   ",
									"address": {
										"zip": 1234
									},
									"anonymousId": "c82cbdff-e5be-4009-ac78-cdeea09ab4b1"
								}
							},
							"event": "product added to wishlist",
							"integrations": {
								"All": true
							},
							"message_id": "a80f82be-9bdc-4a9f-b2a5-15621ee41df8",
							"properties": {
								"revenue": 400,
								"additional_bet_index": 0
							},
							"timestamp": "2023-11-12T15:46:51.693229+05:30",
							"type": "track"
						},
						"destination": {
							"Config": {
								"limitedDataUsage": true,
								"blacklistPiiProperties": [
									{
										"blacklistPiiProperties": "",
										"blacklistPiiHash": false
									}
								],
								"accessToken": "09876",
								"datasetId": "dummyID",
								"eventsToEvents": [
									{
										"from": "",
										"to": ""
									}
								],
								"eventCustomProperties": [
									{
										"eventCustomProperties": ""
									}
								],
								"removeExternalId": true,
								"whitelistPiiProperties": [
									{
										"whitelistPiiProperties": ""
									}
								],
								"actionSource": "website"
							},
							"Enabled": true
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
							"endpoint": "https://graph.facebook.com/v18.0/dummyID/events?access_token=09876",
							"headers": {},
							"params": {},
							"body": {
								"JSON": {},
								"XML": {},
								"JSON_ARRAY": {},
								"FORM": {
									"data": [
										"{\"user_data\":{\"em\":\"48ddb93f0b30c475423fe177832912c5bcdce3cc72872f8051627967ef278e08\",\"zp\":\"03ac674216f3e15c761ee1a5e255f067953623c8b388b4459e13f978d7c846f4\"},\"event_name\":\"AddToWishlist\",\"event_time\":1699784211,\"action_source\":\"website\",\"custom_data\":{\"revenue\":400,\"additional_bet_index\":0,\"content_ids\":[],\"contents\":[],\"currency\":\"USD\",\"value\":400}}"
									]
								}
							},
							"files": {},
							"userId": ""
						},
						"statusCode": 200
					}
				]
			}
		},
		"mockFns": defaultMockFns
	},
	{
		"name": "facebook_conversions",
		"description": "Track event with standard event payment info entered",
		"feature": "processor",
		"module": "destination",
		"version": "v0",
		"input": {
			"request": {
				"body": [
					{
						"message": {
							"anonymousId": "c82cbdff-e5be-4009-ac78-cdeea09ab4b1",
							"channel": "web",
							"context": {
								"device": {
									"id": "df16bffa-5c3d-4fbb-9bce-3bab098129a7R",
									"manufacturer": "Xiaomi",
									"model": "Redmi 6",
									"name": "xiaomi"
								},
								"network": {
									"carrier": "Banglalink"
								},
								"os": {
									"name": "android",
									"version": "8.1.0"
								},
								"screen": {
									"height": "100",
									"density": 50
								},
								"traits": {
									"email": "    aBc@gmail.com   ",
									"address": {
										"zip": 1234
									},
									"anonymousId": "c82cbdff-e5be-4009-ac78-cdeea09ab4b1"
								}
							},
							"event": "payment info entered",
							"integrations": {
								"All": true
							},
							"message_id": "a80f82be-9bdc-4a9f-b2a5-15621ee41df8",
							"properties": {
								"revenue": 400,
								"additional_bet_index": 0
							},
							"timestamp": "2023-11-12T15:46:51.693229+05:30",
							"type": "track"
						},
						"destination": {
							"Config": {
								"limitedDataUsage": true,
								"blacklistPiiProperties": [
									{
										"blacklistPiiProperties": "",
										"blacklistPiiHash": false
									}
								],
								"accessToken": "09876",
								"datasetId": "dummyID",
								"eventsToEvents": [
									{
										"from": "",
										"to": ""
									}
								],
								"eventCustomProperties": [
									{
										"eventCustomProperties": ""
									}
								],
								"removeExternalId": true,
								"whitelistPiiProperties": [
									{
										"whitelistPiiProperties": ""
									}
								],
								"actionSource": "website"
							},
							"Enabled": true
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
							"endpoint": "https://graph.facebook.com/v18.0/dummyID/events?access_token=09876",
							"headers": {},
							"params": {},
							"body": {
								"JSON": {},
								"XML": {},
								"JSON_ARRAY": {},
								"FORM": {
									"data": [
										"{\"user_data\":{\"em\":\"48ddb93f0b30c475423fe177832912c5bcdce3cc72872f8051627967ef278e08\",\"zp\":\"03ac674216f3e15c761ee1a5e255f067953623c8b388b4459e13f978d7c846f4\"},\"event_name\":\"AddPaymentInfo\",\"event_time\":1699784211,\"action_source\":\"website\",\"custom_data\":{\"revenue\":400,\"additional_bet_index\":0,\"content_ids\":[],\"contents\":[],\"currency\":\"USD\",\"value\":400}}"
									]
								}
							},
							"files": {},
							"userId": ""
						},
						"statusCode": 200
					}
				]
			}
		},
		"mockFns": defaultMockFns
	},
	{
		"name": "facebook_conversions",
		"description": "Track event with standard event order completed with delivery_category in products array",
		"feature": "processor",
		"module": "destination",
		"version": "v0",
		"input": {
			"request": {
				"body": [
					{
						"message": {
							"anonymousId": "c82cbdff-e5be-4009-ac78-cdeea09ab4b1",
							"channel": "web",
							"context": {
								"device": {
									"id": "df16bffa-5c3d-4fbb-9bce-3bab098129a7R",
									"manufacturer": "Xiaomi",
									"model": "Redmi 6",
									"name": "xiaomi"
								},
								"network": {
									"carrier": "Banglalink"
								},
								"os": {
									"name": "android",
									"version": "8.1.0"
								},
								"screen": {
									"height": "100",
									"density": 50
								},
								"traits": {
									"email": "    aBc@gmail.com   ",
									"address": {
										"zip": 1234
									},
									"anonymousId": "c82cbdff-e5be-4009-ac78-cdeea09ab4b1"
								}
							},
							"event": "order completed",
							"integrations": {
								"All": true
							},
							"message_id": "a80f82be-9bdc-4a9f-b2a5-15621ee41df8",
							"properties": {
								"revenue": 400,
								"additional_bet_index": 0,
								"products": [
									{
										"product_id": 1234,
										"quantity": 5,
										"price": 55,
										"delivery_category": "home_delivery"
									}
								]
							},
							"timestamp": "2023-11-12T15:46:51.693229+05:30",
							"type": "track"
						},
						"destination": {
							"Config": {
								"limitedDataUsage": true,
								"blacklistPiiProperties": [
									{
										"blacklistPiiProperties": "",
										"blacklistPiiHash": false
									}
								],
								"accessToken": "09876",
								"datasetId": "dummyID",
								"eventsToEvents": [
									{
										"from": "",
										"to": ""
									}
								],
								"eventCustomProperties": [
									{
										"eventCustomProperties": ""
									}
								],
								"removeExternalId": true,
								"whitelistPiiProperties": [
									{
										"whitelistPiiProperties": ""
									}
								],
								"actionSource": "website"
							},
							"Enabled": true
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
							"endpoint": "https://graph.facebook.com/v18.0/dummyID/events?access_token=09876",
							"headers": {},
							"params": {},
							"body": {
								"JSON": {},
								"XML": {},
								"JSON_ARRAY": {},
								"FORM": {
									"data": [
										"{\"user_data\":{\"em\":\"48ddb93f0b30c475423fe177832912c5bcdce3cc72872f8051627967ef278e08\",\"zp\":\"03ac674216f3e15c761ee1a5e255f067953623c8b388b4459e13f978d7c846f4\"},\"event_name\":\"Purchase\",\"event_time\":1699784211,\"action_source\":\"website\",\"custom_data\":{\"revenue\":400,\"additional_bet_index\":0,\"products\":[{\"product_id\":1234,\"quantity\":5,\"price\":55,\"delivery_category\":\"home_delivery\"}],\"content_ids\":[1234],\"contents\":[{\"id\":1234,\"quantity\":5,\"item_price\":55,\"delivery_category\":\"home_delivery\"}],\"content_type\":\"product\",\"currency\":\"USD\",\"value\":400,\"num_items\":1}}"
									]
								}
							},
							"files": {},
							"userId": ""
						},
						"statusCode": 200
					}
				]
			}
		},
		"mockFns": defaultMockFns
	},
	{
		"name": "facebook_conversions",
		"description": "Track event with standard event order completed with delivery_category in properties",
		"feature": "processor",
		"module": "destination",
		"version": "v0",
		"input": {
			"request": {
				"body": [
					{
						"message": {
							"anonymousId": "c82cbdff-e5be-4009-ac78-cdeea09ab4b1",
							"channel": "web",
							"context": {
								"device": {
									"id": "df16bffa-5c3d-4fbb-9bce-3bab098129a7R",
									"manufacturer": "Xiaomi",
									"model": "Redmi 6",
									"name": "xiaomi"
								},
								"network": {
									"carrier": "Banglalink"
								},
								"os": {
									"name": "android",
									"version": "8.1.0"
								},
								"screen": {
									"height": "100",
									"density": 50
								},
								"traits": {
									"email": "    aBc@gmail.com   ",
									"address": {
										"zip": 1234
									},
									"anonymousId": "c82cbdff-e5be-4009-ac78-cdeea09ab4b1"
								}
							},
							"event": "order completed",
							"integrations": {
								"All": true
							},
							"message_id": "a80f82be-9bdc-4a9f-b2a5-15621ee41df8",
							"properties": {
								"revenue": 400,
								"additional_bet_index": 0,
								"delivery_category": "home_delivery",
								"products": [
									{
										"product_id": 1234,
										"quantity": 5,
										"price": 55
									}
								]
							},
							"timestamp": "2023-11-12T15:46:51.693229+05:30",
							"type": "track"
						},
						"destination": {
							"Config": {
								"limitedDataUsage": true,
								"blacklistPiiProperties": [
									{
										"blacklistPiiProperties": "",
										"blacklistPiiHash": false
									}
								],
								"accessToken": "09876",
								"datasetId": "dummyID",
								"eventsToEvents": [
									{
										"from": "",
										"to": ""
									}
								],
								"eventCustomProperties": [
									{
										"eventCustomProperties": ""
									}
								],
								"removeExternalId": true,
								"whitelistPiiProperties": [
									{
										"whitelistPiiProperties": ""
									}
								],
								"actionSource": "website"
							},
							"Enabled": true
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
							"endpoint": "https://graph.facebook.com/v18.0/dummyID/events?access_token=09876",
							"headers": {},
							"params": {},
							"body": {
								"JSON": {},
								"XML": {},
								"JSON_ARRAY": {},
								"FORM": {
									"data": [
										"{\"user_data\":{\"em\":\"48ddb93f0b30c475423fe177832912c5bcdce3cc72872f8051627967ef278e08\",\"zp\":\"03ac674216f3e15c761ee1a5e255f067953623c8b388b4459e13f978d7c846f4\"},\"event_name\":\"Purchase\",\"event_time\":1699784211,\"action_source\":\"website\",\"custom_data\":{\"revenue\":400,\"additional_bet_index\":0,\"delivery_category\":\"home_delivery\",\"products\":[{\"product_id\":1234,\"quantity\":5,\"price\":55}],\"content_ids\":[1234],\"contents\":[{\"id\":1234,\"quantity\":5,\"item_price\":55,\"delivery_category\":\"home_delivery\"}],\"content_type\":\"product\",\"currency\":\"USD\",\"value\":400,\"num_items\":1}}"
									]
								}
							},
							"files": {},
							"userId": ""
						},
						"statusCode": 200
					}
				]
			}
		},
		"mockFns": defaultMockFns
	}
]