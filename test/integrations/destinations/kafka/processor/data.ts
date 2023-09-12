export const data = [
	{
		"name": "kafka",
		"description": "Test case with null destination config",
		"feature": "processor",
		"module": "destination",
		"version": "v0",
		"input": {
			"request": {
				"body": [
					{
						"destination": {
							"ID": "kafkadestinationid",
							"Name": "Kafka",
							"Config": null,
							"Enabled": true,
							"IsProcessorEnabled": true
						},
						"message": {
							"anonymousId": "anonymousId",
							"context": {
								"library": {
									"name": "analytics-go",
									"version": "3.0.0"
								}
							},
							"event": "event",
							"integrations": {
								"Kafka": true
							},
							"messageId": "messageId",
							"originalTimestamp": "2019-07-18T15:00:00Z",
							"properties": {
								"key": "value"
							},
							"receivedAt": "2019-07-18T15:00:00Z",
							"sentAt": "2019-07-18T15:00:00Z",
							"timestamp": "2019-07-18T15:00:00Z",
							"type": "track",
							"userId": "userId"
						},
						"metadata": {
							"jobId": "jobId 0",
							"rudderId": "randomRudderId"
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
							"jobId": "jobId 0",
							"rudderId": "randomRudderId"
						},
						"output": {
							"message": {
								"anonymousId": "anonymousId",
								"context": {
									"library": {
										"name": "analytics-go",
										"version": "3.0.0"
									}
								},
								"event": "event",
								"integrations": {
									"Kafka": true
								},
								"messageId": "messageId",
								"originalTimestamp": "2019-07-18T15:00:00Z",
								"properties": {
									"key": "value"
								},
								"receivedAt": "2019-07-18T15:00:00Z",
								"sentAt": "2019-07-18T15:00:00Z",
								"timestamp": "2019-07-18T15:00:00Z",
								"type": "track",
								"userId": "userId"
							},
							"userId": "userId"
						},
						"statusCode": 200
					}
				]
			}
		}
	},
	{
		"name": "kafka",
		"description": "Test case without userId",
		"feature": "processor",
		"module": "destination",
		"version": "v0",
		"input": {
			"request": {
				"body": [
					{
						"destination": {
							"ID": "kafkadestinationid",
							"Name": "Kafka",
							"Config": null,
							"Enabled": true,
							"IsProcessorEnabled": true
						},
						"message": {
							"anonymousId": "anonymousId",
							"context": {
								"library": {
									"name": "analytics-go",
									"version": "3.0.0"
								}
							},
							"event": "event",
							"integrations": {
								"Kafka": true
							},
							"messageId": "messageId",
							"originalTimestamp": "2019-07-18T15:00:00Z",
							"properties": {
								"key": "value"
							},
							"receivedAt": "2019-07-18T15:00:00Z",
							"sentAt": "2019-07-18T15:00:00Z",
							"timestamp": "2019-07-18T15:00:00Z",
							"type": "track"
						},
						"metadata": {
							"jobId": "jobId 1",
							"rudderId": "randomRudderId"
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
							"jobId": "jobId 1",
							"rudderId": "randomRudderId"
						},
						"output": {
							"message": {
								"anonymousId": "anonymousId",
								"context": {
									"library": {
										"name": "analytics-go",
										"version": "3.0.0"
									}
								},
								"event": "event",
								"integrations": {
									"Kafka": true
								},
								"messageId": "messageId",
								"originalTimestamp": "2019-07-18T15:00:00Z",
								"properties": {
									"key": "value"
								},
								"receivedAt": "2019-07-18T15:00:00Z",
								"sentAt": "2019-07-18T15:00:00Z",
								"timestamp": "2019-07-18T15:00:00Z",
								"type": "track"
							},
							"userId": "anonymousId"
						},
						"statusCode": 200
					}
				]
			}
		}
	},
	{
		"name": "kafka",
		"description": "Test case with null dest config and avro schema",
		"feature": "processor",
		"module": "destination",
		"version": "v0",
		"input": {
			"request": {
				"body": [
					{
						"destination": {
							"ID": "kafkadestinationid",
							"Name": "Kafka",
							"Config": null,
							"Enabled": true,
							"IsProcessorEnabled": true
						},
						"message": {
							"anonymousId": "anonymousId",
							"context": {
								"library": {
									"name": "analytics-go",
									"version": "3.0.0"
								}
							},
							"event": "event",
							"integrations": {
								"Kafka": {
									"schemaId": "schema001"
								}
							},
							"messageId": "messageId",
							"originalTimestamp": "2019-07-18T15:00:00Z",
							"properties": {
								"key": "value"
							},
							"receivedAt": "2019-07-18T15:00:00Z",
							"sentAt": "2019-07-18T15:00:00Z",
							"timestamp": "2019-07-18T15:00:00Z",
							"type": "track",
							"userId": "userId"
						},
						"metadata": {
							"jobId": "jobId 2",
							"rudderId": "randomRudderId"
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
							"jobId": "jobId 2",
							"rudderId": "randomRudderId"
						},
						"output": {
							"message": {
								"anonymousId": "anonymousId",
								"context": {
									"library": {
										"name": "analytics-go",
										"version": "3.0.0"
									}
								},
								"event": "event",
								"integrations": {
									"Kafka": {
										"schemaId": "schema001"
									}
								},
								"messageId": "messageId",
								"originalTimestamp": "2019-07-18T15:00:00Z",
								"properties": {
									"key": "value"
								},
								"receivedAt": "2019-07-18T15:00:00Z",
								"sentAt": "2019-07-18T15:00:00Z",
								"timestamp": "2019-07-18T15:00:00Z",
								"type": "track",
								"userId": "userId"
							},
							"userId": "userId",
							"schemaId": "schema001"
						},
						"statusCode": 200
					}
				]
			}
		}
	},
	{
		"name": "kafka",
		"description": "Test case with null dest config and integrations topic",
		"feature": "processor",
		"module": "destination",
		"version": "v0",
		"input": {
			"request": {
				"body": [
					{
						"destination": {
							"ID": "kafkadestinationid",
							"Name": "Kafka",
							"Config": null,
							"Enabled": true,
							"IsProcessorEnabled": true
						},
						"message": {
							"anonymousId": "anonymousId",
							"context": {
								"library": {
									"name": "analytics-go",
									"version": "3.0.0"
								}
							},
							"event": "event",
							"integrations": {
								"Kafka": {
									"topic": "specific-topic"
								}
							},
							"messageId": "messageId",
							"originalTimestamp": "2019-07-18T15:00:00Z",
							"properties": {
								"key": "value"
							},
							"receivedAt": "2019-07-18T15:00:00Z",
							"sentAt": "2019-07-18T15:00:00Z",
							"timestamp": "2019-07-18T15:00:00Z",
							"type": "track",
							"userId": "userId"
						},
						"metadata": {
							"jobId": "jobId 3",
							"rudderId": "randomRudderId"
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
							"jobId": "jobId 3",
							"rudderId": "randomRudderId<<>>specific-topic"
						},
						"output": {
							"message": {
								"anonymousId": "anonymousId",
								"context": {
									"library": {
										"name": "analytics-go",
										"version": "3.0.0"
									}
								},
								"event": "event",
								"integrations": {
									"Kafka": {
										"topic": "specific-topic"
									}
								},
								"messageId": "messageId",
								"originalTimestamp": "2019-07-18T15:00:00Z",
								"properties": {
									"key": "value"
								},
								"receivedAt": "2019-07-18T15:00:00Z",
								"sentAt": "2019-07-18T15:00:00Z",
								"timestamp": "2019-07-18T15:00:00Z",
								"type": "track",
								"userId": "userId"
							},
							"userId": "userId",
							"topic": "specific-topic"
						},
						"statusCode": 200
					}
				]
			}
		}
	},
	{
		"name": "kafka",
		"description": "Test case with dest config with default topic",
		"feature": "processor",
		"module": "destination",
		"version": "v0",
		"input": {
			"request": {
				"body": [
					{
						"destination": {
							"ID": "kafkadestinationid",
							"Name": "Kafka",
							"Config": {
								"topic": "default-topic"
							},
							"Enabled": true,
							"IsProcessorEnabled": true
						},
						"message": {
							"anonymousId": "anonymousId",
							"context": {
								"library": {
									"name": "analytics-go",
									"version": "3.0.0"
								}
							},
							"event": "event",
							"messageId": "messageId",
							"originalTimestamp": "2019-07-18T15:00:00Z",
							"properties": {
								"key": "value"
							},
							"receivedAt": "2019-07-18T15:00:00Z",
							"sentAt": "2019-07-18T15:00:00Z",
							"timestamp": "2019-07-18T15:00:00Z",
							"type": "track",
							"userId": "userId"
						},
						"metadata": {
							"jobId": "jobId 4",
							"rudderId": "randomRudderId"
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
							"jobId": "jobId 4",
							"rudderId": "randomRudderId<<>>default-topic"
						},
						"output": {
							"message": {
								"anonymousId": "anonymousId",
								"context": {
									"library": {
										"name": "analytics-go",
										"version": "3.0.0"
									}
								},
								"event": "event",
								"messageId": "messageId",
								"originalTimestamp": "2019-07-18T15:00:00Z",
								"properties": {
									"key": "value"
								},
								"receivedAt": "2019-07-18T15:00:00Z",
								"sentAt": "2019-07-18T15:00:00Z",
								"timestamp": "2019-07-18T15:00:00Z",
								"type": "track",
								"userId": "userId"
							},
							"userId": "userId",
							"topic": "default-topic"
						},
						"statusCode": 200
					}
				]
			}
		}
	},
	{
		"name": "kafka",
		"description": "Test case with dest config with event type topic",
		"feature": "processor",
		"module": "destination",
		"version": "v0",
		"input": {
			"request": {
				"body": [
					{
						"destination": {
							"ID": "kafkadestinationid",
							"Name": "Kafka",
							"Config": {
								"topic": "default-topic",
								"enableMultiTopic": true,
								"eventTypeToTopicMap": [
									{
										"from": "identify",
										"to": "identify-topic"
									},
									{
										"from": "page",
										"to": "page-topic"
									},
									{
										"from": "screen",
										"to": "screen-topic"
									},
									{
										"from": "group",
										"to": "group-topic"
									},
									{
										"from": "alias",
										"to": "alias-topic"
									}
								],
								"eventToTopicMap": [
									{
										"from": "Product Added",
										"to": "product-added"
									}
								]
							},
							"Enabled": true,
							"IsProcessorEnabled": true
						},
						"message": {
							"anonymousId": "anonymousId",
							"context": {
								"library": {
									"name": "analytics-go",
									"version": "3.0.0"
								}
							},
							"messageId": "messageId",
							"originalTimestamp": "2019-07-18T15:00:00Z",
							"properties": {
								"key": "value"
							},
							"receivedAt": "2019-07-18T15:00:00Z",
							"sentAt": "2019-07-18T15:00:00Z",
							"timestamp": "2019-07-18T15:00:00Z",
							"type": "identify",
							"userId": "userId"
						},
						"metadata": {
							"jobId": "jobId 5",
							"rudderId": "randomRudderId"
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
							"jobId": "jobId 5",
							"rudderId": "randomRudderId<<>>identify-topic"
						},
						"output": {
							"message": {
								"anonymousId": "anonymousId",
								"context": {
									"library": {
										"name": "analytics-go",
										"version": "3.0.0"
									}
								},
								"messageId": "messageId",
								"originalTimestamp": "2019-07-18T15:00:00Z",
								"properties": {
									"key": "value"
								},
								"receivedAt": "2019-07-18T15:00:00Z",
								"sentAt": "2019-07-18T15:00:00Z",
								"timestamp": "2019-07-18T15:00:00Z",
								"type": "identify",
								"userId": "userId"
							},
							"userId": "userId",
							"topic": "identify-topic"
						},
						"statusCode": 200
					}
				]
			}
		}
	},
	{
		"name": "kafka",
		"description": "Test case with dest config with event name topic",
		"feature": "processor",
		"module": "destination",
		"version": "v0",
		"input": {
			"request": {
				"body": [
					{
						"destination": {
							"ID": "kafkadestinationid",
							"Name": "Kafka",
							"Config": {
								"topic": "default-topic",
								"enableMultiTopic": true,
								"eventTypeToTopicMap": [
									{
										"from": "identify",
										"to": "identify-topic"
									},
									{
										"from": "page",
										"to": "page-topic"
									},
									{
										"from": "screen",
										"to": "screen-topic"
									},
									{
										"from": "group",
										"to": "group-topic"
									},
									{
										"from": "alias",
										"to": "alias-topic"
									}
								],
								"eventToTopicMap": [
									{
										"from": "Product Added",
										"to": "product-added"
									}
								]
							},
							"Enabled": true,
							"IsProcessorEnabled": true
						},
						"message": {
							"anonymousId": "anonymousId",
							"context": {
								"library": {
									"name": "analytics-go",
									"version": "3.0.0"
								}
							},
							"event": "Product Added",
							"messageId": "messageId",
							"originalTimestamp": "2019-07-18T15:00:00Z",
							"properties": {
								"key": "value"
							},
							"receivedAt": "2019-07-18T15:00:00Z",
							"sentAt": "2019-07-18T15:00:00Z",
							"timestamp": "2019-07-18T15:00:00Z",
							"type": "track",
							"userId": "userId"
						},
						"metadata": {
							"jobId": "jobId 6",
							"rudderId": "randomRudderId"
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
							"jobId": "jobId 6",
							"rudderId": "randomRudderId<<>>product-added"
						},
						"output": {
							"message": {
								"anonymousId": "anonymousId",
								"context": {
									"library": {
										"name": "analytics-go",
										"version": "3.0.0"
									}
								},
								"event": "Product Added",
								"messageId": "messageId",
								"originalTimestamp": "2019-07-18T15:00:00Z",
								"properties": {
									"key": "value"
								},
								"receivedAt": "2019-07-18T15:00:00Z",
								"sentAt": "2019-07-18T15:00:00Z",
								"timestamp": "2019-07-18T15:00:00Z",
								"type": "track",
								"userId": "userId"
							},
							"userId": "userId",
							"topic": "product-added"
						},
						"statusCode": 200
					}
				]
			}
		}
	},
	{
		"name": "kafka",
		"description": "Test case with dest config with event name topic no match",
		"feature": "processor",
		"module": "destination",
		"version": "v0",
		"input": {
			"request": {
				"body": [
					{
						"destination": {
							"ID": "kafkadestinationid",
							"Name": "Kafka",
							"Config": {
								"topic": "default-topic",
								"enableMultiTopic": true,
								"eventTypeToTopicMap": [
									{
										"from": "identify",
										"to": "identify-topic"
									},
									{
										"from": "page",
										"to": "page-topic"
									},
									{
										"from": "screen",
										"to": "screen-topic"
									},
									{
										"from": "group",
										"to": "group-topic"
									},
									{
										"from": "alias",
										"to": "alias-topic"
									}
								],
								"eventToTopicMap": [
									{
										"from": "Product Added",
										"to": "product-added"
									}
								]
							},
							"Enabled": true,
							"IsProcessorEnabled": true
						},
						"message": {
							"anonymousId": "anonymousId",
							"context": {
								"library": {
									"name": "analytics-go",
									"version": "3.0.0"
								}
							},
							"event": "Product Added No match",
							"messageId": "messageId",
							"originalTimestamp": "2019-07-18T15:00:00Z",
							"properties": {
								"key": "value"
							},
							"receivedAt": "2019-07-18T15:00:00Z",
							"sentAt": "2019-07-18T15:00:00Z",
							"timestamp": "2019-07-18T15:00:00Z",
							"type": "track",
							"userId": "userId"
						},
						"metadata": {
							"jobId": "jobId 7",
							"rudderId": "randomRudderId"
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
							"jobId": "jobId 7",
							"rudderId": "randomRudderId<<>>default-topic"
						},
						"output": {
							"message": {
								"anonymousId": "anonymousId",
								"context": {
									"library": {
										"name": "analytics-go",
										"version": "3.0.0"
									}
								},
								"event": "Product Added No match",
								"messageId": "messageId",
								"originalTimestamp": "2019-07-18T15:00:00Z",
								"properties": {
									"key": "value"
								},
								"receivedAt": "2019-07-18T15:00:00Z",
								"sentAt": "2019-07-18T15:00:00Z",
								"timestamp": "2019-07-18T15:00:00Z",
								"type": "track",
								"userId": "userId"
							},
							"userId": "userId",
							"topic": "default-topic"
						},
						"statusCode": 200
					}
				]
			}
		}
	}
]