export const data = [
	{
		"name": "firehose",
		"description": "Test 0",
		"feature": "processor",
		"module": "destination",
		"version": "v0",
		"input": {
			"request": {
				"body": [
					{
						"message": {
							"channel": "web",
							"context": {
								"app": {
									"build": "1.0.0",
									"name": "RudderLabs JavaScript SDK",
									"namespace": "com.rudderlabs.javascript",
									"version": "1.0.0"
								},
								"traits": {
									"email": "ruchira@rudderlabs.com"
								},
								"library": {
									"name": "RudderLabs JavaScript SDK",
									"version": "1.0.0"
								},
								"userAgent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/77.0.3865.90 Safari/537.36",
								"locale": "en-US",
								"ip": "0.0.0.0",
								"os": {
									"id": "72e528f869711c3d",
									"manufacturer": "Google",
									"model": "sdk_gphone_x86",
									"name": "generic_x86_arm",
									"token": "some_device_token",
									"type": "android"
								},
								"screen": {
									"density": 2
								}
							},
							"type": "track",
							"event": "product added",
							"messageId": "84e26acc-56a5-4835-8233-591137fca468",
							"originalTimestamp": "2019-10-14T09:03:17.562Z",
							"anonymousId": "00000000000000000000000000",
							"userId": "123456",
							"integrations": {
								"All": true
							},
							"sentAt": "2019-10-14T09:03:22.563Z"
						},
						"destination": {
							"Config": {
								"region": "us-east-1",
								"accessKeyID": "abc",
								"accessKey": "xyz",
								"mapEvents": [
									{
										"from": "track",
										"to": "ruchira-test-firehose"
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
							"message": {
								"channel": "web",
								"context": {
									"app": {
										"build": "1.0.0",
										"name": "RudderLabs JavaScript SDK",
										"namespace": "com.rudderlabs.javascript",
										"version": "1.0.0"
									},
									"traits": { "email": "ruchira@rudderlabs.com" },
									"library": {
										"name": "RudderLabs JavaScript SDK",
										"version": "1.0.0"
									},
									"userAgent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/77.0.3865.90 Safari/537.36",
									"locale": "en-US",
									"ip": "0.0.0.0",
									"os": {
										"id": "72e528f869711c3d",
										"manufacturer": "Google",
										"model": "sdk_gphone_x86",
										"name": "generic_x86_arm",
										"token": "some_device_token",
										"type": "android"
									},
									"screen": { "density": 2 }
								},
								"type": "track",
								"event": "product added",
								"messageId": "84e26acc-56a5-4835-8233-591137fca468",
								"originalTimestamp": "2019-10-14T09:03:17.562Z",
								"anonymousId": "00000000000000000000000000",
								"userId": "123456",
								"integrations": { "All": true },
								"sentAt": "2019-10-14T09:03:22.563Z"
							},
							"userId": "00000000000000000000000000",
							"deliveryStreamMapTo": "ruchira-test-firehose"
						},
						"statusCode": 200
					}
				]
			}
		}
	}, {
		"name": "firehose",
		"description": "Test 1",
		"feature": "processor",
		"module": "destination",
		"version": "v0",
		"input": {
			"request": {
				"body": [
					{
						"message": {
							"channel": "web",
							"context": {
								"app": {
									"build": "1.0.0",
									"name": "RudderLabs JavaScript SDK",
									"namespace": "com.rudderlabs.javascript",
									"version": "1.0.0"
								},
								"traits": {
									"email": "ruchira@rudderlabs.com"
								},
								"library": {
									"name": "RudderLabs JavaScript SDK",
									"version": "1.0.0"
								},
								"userAgent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/77.0.3865.90 Safari/537.36",
								"locale": "en-US",
								"ip": "0.0.0.0",
								"os": {
									"id": "72e528f869711c3d",
									"manufacturer": "Google",
									"model": "sdk_gphone_x86",
									"name": "generic_x86_arm",
									"token": "some_device_token",
									"type": "android"
								},
								"screen": {
									"density": 2
								}
							},
							"type": "track",
							"event": "product added",
							"messageId": "84e26acc-56a5-4835-8233-591137fca468",
							"originalTimestamp": "2019-10-14T09:03:17.562Z",
							"anonymousId": "00000000000000000000000000",
							"userId": "123456",
							"integrations": {
								"All": true
							},
							"sentAt": "2019-10-14T09:03:22.563Z"
						},
						"destination": {
							"Config": {
								"region": "us-east-1",
								"accessKeyID": "abc",
								"accessKey": "xyz",
								"mapEvents": [
									{
										"from": "product added",
										"to": "ruchira-test-firehose"
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
							"message": {
								"channel": "web",
								"context": {
									"app": {
										"build": "1.0.0",
										"name": "RudderLabs JavaScript SDK",
										"namespace": "com.rudderlabs.javascript",
										"version": "1.0.0"
									},
									"traits": { "email": "ruchira@rudderlabs.com" },
									"library": {
										"name": "RudderLabs JavaScript SDK",
										"version": "1.0.0"
									},
									"userAgent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/77.0.3865.90 Safari/537.36",
									"locale": "en-US",
									"ip": "0.0.0.0",
									"os": {
										"id": "72e528f869711c3d",
										"manufacturer": "Google",
										"model": "sdk_gphone_x86",
										"name": "generic_x86_arm",
										"token": "some_device_token",
										"type": "android"
									},
									"screen": { "density": 2 }
								},
								"type": "track",
								"event": "product added",
								"messageId": "84e26acc-56a5-4835-8233-591137fca468",
								"originalTimestamp": "2019-10-14T09:03:17.562Z",
								"anonymousId": "00000000000000000000000000",
								"userId": "123456",
								"integrations": { "All": true },
								"sentAt": "2019-10-14T09:03:22.563Z"
							},
							"userId": "00000000000000000000000000",
							"deliveryStreamMapTo": "ruchira-test-firehose"
						},
						"statusCode": 200
					}
				]
			}
		}
	}, {
		"name": "firehose",
		"description": "Test 1",
		"feature": "processor",
		"module": "destination",
		"version": "v0",
		"input": {
			"request": {
				"body": [
					{
						"message": {
							"channel": "web",
							"context": {
								"app": {
									"build": "1.0.0",
									"name": "RudderLabs JavaScript SDK",
									"namespace": "com.rudderlabs.javascript",
									"version": "1.0.0"
								},
								"traits": {
									"email": "ruchira@rudderlabs.com"
								},
								"library": {
									"name": "RudderLabs JavaScript SDK",
									"version": "1.0.0"
								},
								"userAgent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/77.0.3865.90 Safari/537.36",
								"locale": "en-US",
								"ip": "0.0.0.0",
								"os": {
									"id": "72e528f869711c3d",
									"manufacturer": "Google",
									"model": "sdk_gphone_x86",
									"name": "generic_x86_arm",
									"token": "some_device_token",
									"type": "android"
								},
								"screen": {
									"density": 2
								}
							},
							"type": "track",
							"event": "product added",
							"messageId": "84e26acc-56a5-4835-8233-591137fca468",
							"originalTimestamp": "2019-10-14T09:03:17.562Z",
							"anonymousId": "00000000000000000000000000",
							"userId": "123456",
							"integrations": {
								"All": true
							},
							"sentAt": "2019-10-14T09:03:22.563Z"
						},
						"destination": {
							"Config": {
								"region": "us-east-1",
								"accessKeyID": "abc",
								"accessKey": "xyz",
								"mapEvents": [
									{
										"from": "*",
										"to": "ruchira-test-firehose"
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
							"message": {
								"channel": "web",
								"context": {
									"app": {
										"build": "1.0.0",
										"name": "RudderLabs JavaScript SDK",
										"namespace": "com.rudderlabs.javascript",
										"version": "1.0.0"
									},
									"traits": { "email": "ruchira@rudderlabs.com" },
									"library": {
										"name": "RudderLabs JavaScript SDK",
										"version": "1.0.0"
									},
									"userAgent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/77.0.3865.90 Safari/537.36",
									"locale": "en-US",
									"ip": "0.0.0.0",
									"os": {
										"id": "72e528f869711c3d",
										"manufacturer": "Google",
										"model": "sdk_gphone_x86",
										"name": "generic_x86_arm",
										"token": "some_device_token",
										"type": "android"
									},
									"screen": { "density": 2 }
								},
								"type": "track",
								"event": "product added",
								"messageId": "84e26acc-56a5-4835-8233-591137fca468",
								"originalTimestamp": "2019-10-14T09:03:17.562Z",
								"anonymousId": "00000000000000000000000000",
								"userId": "123456",
								"integrations": { "All": true },
								"sentAt": "2019-10-14T09:03:22.563Z"
							},
							"userId": "00000000000000000000000000",
							"deliveryStreamMapTo": "ruchira-test-firehose"
						},
						"statusCode": 200
					}
				]
			}
		}
	}, {
		"name": "firehose",
		"description": "Test 1",
		"feature": "processor",
		"module": "destination",
		"version": "v0",
		"input": {
			"request": {
				"body": [
					{
						"message": {
							"channel": "web",
							"context": {
								"app": {
									"build": "1.0.0",
									"name": "RudderLabs JavaScript SDK",
									"namespace": "com.rudderlabs.javascript",
									"version": "1.0.0"
								},
								"traits": {
									"email": "ruchira@rudderlabs.com"
								},
								"library": {
									"name": "RudderLabs JavaScript SDK",
									"version": "1.0.0"
								},
								"userAgent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/77.0.3865.90 Safari/537.36",
								"locale": "en-US",
								"ip": "0.0.0.0",
								"os": {
									"id": "72e528f869711c3d",
									"manufacturer": "Google",
									"model": "sdk_gphone_x86",
									"name": "generic_x86_arm",
									"token": "some_device_token",
									"type": "android"
								},
								"screen": {
									"density": 2
								}
							},
							"type": "track",
							"event": "product added",
							"messageId": "84e26acc-56a5-4835-8233-591137fca468",
							"originalTimestamp": "2019-10-14T09:03:17.562Z",
							"anonymousId": "00000000000000000000000000",
							"userId": "123456",
							"integrations": {
								"All": true
							},
							"sentAt": "2019-10-14T09:03:22.563Z"
						},
						"destination": {
							"Config": {
								"region": "us-east-1",
								"accessKeyID": "abc",
								"accessKey": "xyz",
								"mapEvents": [
									{
										"from": "test event",
										"to": "ruchira-test-firehose"
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
						"error": "No delivery stream set for this event",
						"statTags": {
							"destType": "FIREHOSE",
							"errorCategory": "dataValidation",
							"errorType": "configuration",
							"feature": "processor",
							"implementation": "native",
							"module": "destination",
						},
						"statusCode": 400
					}
				]
			}
		}
	}, {
		"name": "firehose",
		"description": "Test 1",
		"feature": "processor",
		"module": "destination",
		"version": "v0",
		"input": {
			"request": {
				"body": [
					{
						"message": {
							"channel": "web",
							"context": {
								"app": {
									"build": "1.0.0",
									"name": "RudderLabs JavaScript SDK",
									"namespace": "com.rudderlabs.javascript",
									"version": "1.0.0"
								},
								"traits": {
									"email": "ruchira@rudderlabs.com"
								},
								"library": {
									"name": "RudderLabs JavaScript SDK",
									"version": "1.0.0"
								},
								"userAgent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/77.0.3865.90 Safari/537.36",
								"locale": "en-US",
								"ip": "0.0.0.0",
								"os": {
									"id": "72e528f869711c3d",
									"manufacturer": "Google",
									"model": "sdk_gphone_x86",
									"name": "generic_x86_arm",
									"token": "some_device_token",
									"type": "android"
								},
								"screen": {
									"density": 2
								}
							},
							"type": "track",
							"event": "product added",
							"messageId": "84e26acc-56a5-4835-8233-591137fca468",
							"originalTimestamp": "2019-10-14T09:03:17.562Z",
							"anonymousId": "00000000000000000000000000",
							"userId": "123456",
							"integrations": {
								"All": true
							},
							"sentAt": "2019-10-14T09:03:22.563Z"
						},
						"destination": {
							"Config": {
								"region": "us-east-1",
								"accessKeyID": "abc",
								"accessKey": "xyz",
								"mapEvents": [
									{
										"from": "*",
										"to": "ruchira-test-firehose"
									},
									{
										"from": "track",
										"to": "ruchira-test-firehose-1"
									},
									{
										"from": "product added",
										"to": "ruchira-test-firehose-2"
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
							"message": {
								"channel": "web",
								"context": {
									"app": {
										"build": "1.0.0",
										"name": "RudderLabs JavaScript SDK",
										"namespace": "com.rudderlabs.javascript",
										"version": "1.0.0"
									},
									"traits": {
										"email": "ruchira@rudderlabs.com"
									},
									"library": {
										"name": "RudderLabs JavaScript SDK",
										"version": "1.0.0"
									},
									"userAgent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/77.0.3865.90 Safari/537.36",
									"locale": "en-US",
									"ip": "0.0.0.0",
									"os": {
										"id": "72e528f869711c3d",
										"manufacturer": "Google",
										"model": "sdk_gphone_x86",
										"name": "generic_x86_arm",
										"token": "some_device_token",
										"type": "android"
									},
									"screen": {
										"density": 2
									}
								},
								"type": "track",
								"event": "product added",
								"messageId": "84e26acc-56a5-4835-8233-591137fca468",
								"originalTimestamp": "2019-10-14T09:03:17.562Z",
								"anonymousId": "00000000000000000000000000",
								"userId": "123456",
								"integrations": {
									"All": true
								},
								"sentAt": "2019-10-14T09:03:22.563Z"
							},
							"userId": "00000000000000000000000000",
							"deliveryStreamMapTo": "ruchira-test-firehose-2"
						},
						"statusCode": 200
					}
				]
			}
		}
	}, {
		"name": "firehose",
		"description": "Test 1",
		"feature": "processor",
		"module": "destination",
		"version": "v0",
		"input": {
			"request": {
				"body": [
					{
						"message": {
							"channel": "web",
							"context": {
								"app": {
									"build": "1.0.0",
									"name": "RudderLabs JavaScript SDK",
									"namespace": "com.rudderlabs.javascript",
									"version": "1.0.0"
								},
								"traits": {
									"email": "ruchira@rudderlabs.com"
								},
								"library": {
									"name": "RudderLabs JavaScript SDK",
									"version": "1.0.0"
								},
								"userAgent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/77.0.3865.90 Safari/537.36",
								"locale": "en-US",
								"ip": "0.0.0.0",
								"os": {
									"id": "72e528f869711c3d",
									"manufacturer": "Google",
									"model": "sdk_gphone_x86",
									"name": "generic_x86_arm",
									"token": "some_device_token",
									"type": "android"
								},
								"screen": {
									"density": 2
								}
							},
							"type": "track",
							"event": "product added",
							"messageId": "84e26acc-56a5-4835-8233-591137fca468",
							"originalTimestamp": "2019-10-14T09:03:17.562Z",
							"anonymousId": "00000000000000000000000000",
							"userId": "123456",
							"integrations": {
								"All": true
							},
							"sentAt": "2019-10-14T09:03:22.563Z"
						},
						"destination": {
							"Config": {
								"region": "us-east-1",
								"accessKeyID": "abc",
								"accessKey": "xyz",
								"mapEvents": [
									{
										"from": "*",
										"to": "ruchira-test-firehose"
									},
									{
										"from": "track",
										"to": "ruchira-test-firehose-1"
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
							"message": {
								"channel": "web",
								"context": {
									"app": {
										"build": "1.0.0",
										"name": "RudderLabs JavaScript SDK",
										"namespace": "com.rudderlabs.javascript",
										"version": "1.0.0"
									},
									"traits": {
										"email": "ruchira@rudderlabs.com"
									},
									"library": {
										"name": "RudderLabs JavaScript SDK",
										"version": "1.0.0"
									},
									"userAgent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/77.0.3865.90 Safari/537.36",
									"locale": "en-US",
									"ip": "0.0.0.0",
									"os": {
										"id": "72e528f869711c3d",
										"manufacturer": "Google",
										"model": "sdk_gphone_x86",
										"name": "generic_x86_arm",
										"token": "some_device_token",
										"type": "android"
									},
									"screen": {
										"density": 2
									}
								},
								"type": "track",
								"event": "product added",
								"messageId": "84e26acc-56a5-4835-8233-591137fca468",
								"originalTimestamp": "2019-10-14T09:03:17.562Z",
								"anonymousId": "00000000000000000000000000",
								"userId": "123456",
								"integrations": {
									"All": true
								},
								"sentAt": "2019-10-14T09:03:22.563Z"
							},
							"userId": "00000000000000000000000000",
							"deliveryStreamMapTo": "ruchira-test-firehose-1"
						},
						"statusCode": 200
					}
				]
			}
		}
	}, {
		"name": "firehose",
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
								"region": "us-east-1",
								"accessKeyID": "abc",
								"accessKey": "xyz",
								"mapEvents": [
									{
										"from": "*",
										"to": "ruchira-test-firehose"
									},
									{
										"from": "product added",
										"to": "ruchira-test-firehose-1"
									}
								]
							},
							"DestinationDefinition": {
								"DisplayName": "firehose",
								"ID": "1WhbSZ6uA3H5ChVifHpfL2H6sie",
								"Name": "FIREHOSE"
							},
							"Enabled": true,
							"ID": "1WhcOCGgj9asZu850HvugU2C3Aq",
							"Name": "Braze",
							"Transformations": []
						},
						"metadata": {
							"sourceType": "metadata.sourceType",
							"destinationType": "metadata.destinationType",
							"k8_namespace": "metadata.namespace"
						},
						"message": {
							"channel": "web",
							"context": {
								"app": {
									"build": "1.0.0",
									"name": "RudderLabs JavaScript SDK",
									"namespace": "com.rudderlabs.javascript",
									"version": "1.0.0"
								},
								"traits": {
									"email": "ruchira@rudderlabs.com"
								},
								"library": {
									"name": "RudderLabs JavaScript SDK",
									"version": "1.0.0"
								},
								"userAgent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/77.0.3865.90 Safari/537.36",
								"locale": "en-US",
								"ip": "0.0.0.0",
								"os": {
									"id": "72e528f869711c3d",
									"manufacturer": "Google",
									"model": "sdk_gphone_x86",
									"name": "generic_x86_arm",
									"token": "some_device_token",
									"type": "android"
								},
								"screen": {
									"density": 2
								}
							},
							"type": "track",
							"event": "",
							"messageId": "84e26acc-56a5-4835-8233-591137fca468",
							"originalTimestamp": "2019-10-14T09:03:17.562Z",
							"anonymousId": "00000000000000000000000000",
							"userId": "123456",
							"integrations": {
								"All": true
							},
							"sentAt": "2019-10-14T09:03:22.563Z"
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
							"destinationType": "metadata.destinationType",
							"k8_namespace": "metadata.namespace",
							"sourceType": "metadata.sourceType",
						},
						"output": {
							"message": {
								"channel": "web",
								"context": {
									"app": {
										"build": "1.0.0",
										"name": "RudderLabs JavaScript SDK",
										"namespace": "com.rudderlabs.javascript",
										"version": "1.0.0"
									},
									"traits": {
										"email": "ruchira@rudderlabs.com"
									},
									"library": {
										"name": "RudderLabs JavaScript SDK",
										"version": "1.0.0"
									},
									"userAgent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/77.0.3865.90 Safari/537.36",
									"locale": "en-US",
									"ip": "0.0.0.0",
									"os": {
										"id": "72e528f869711c3d",
										"manufacturer": "Google",
										"model": "sdk_gphone_x86",
										"name": "generic_x86_arm",
										"token": "some_device_token",
										"type": "android"
									},
									"screen": {
										"density": 2
									}
								},
								"type": "track",
								"event": "",
								"messageId": "84e26acc-56a5-4835-8233-591137fca468",
								"originalTimestamp": "2019-10-14T09:03:17.562Z",
								"anonymousId": "00000000000000000000000000",
								"userId": "123456",
								"integrations": {
									"All": true
								},
								"sentAt": "2019-10-14T09:03:22.563Z"
							},
							"userId": "00000000000000000000000000",
							"deliveryStreamMapTo": "ruchira-test-firehose"
						},
						"statusCode": 200
					}
				]
			}
		}
	}
]