export const data = [
	{
		"name": "vero",
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
								"authToken": "testAuthToken"
							}
						},
						"message": {
							"context": {
								"traits": {
									"homwTown": "kanpur",
									"age": "24"
								}
							},
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
						"output": {
							"version": "1",
							"type": "REST",
							"method": "POST",
							"endpoint": "https://api.getvero.com/api/v2/users/track",
							"headers": {},
							"params": {},
							"body": {
								"JSON": {
									"id": "yash001",
									"data": {
										"homwTown": "kanpur",
										"age": "24"
									},
									"auth_token": "testAuthToken"
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
		"name": "vero",
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
								"authToken": "testAuthToken"
							}
						},
						"message": {
							"context": {
								"traits": {
									"email": "user1001@tech.com"
								}
							},
							"type": "Identify",
							"userId": "user1001"
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
							"endpoint": "https://api.getvero.com/api/v2/users/track",
							"headers": {},
							"params": {},
							"body": {
								"JSON": {
									"id": "user1001",
									"email": "user1001@tech.com",
									"data": {},
									"auth_token": "testAuthToken"
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
		"name": "vero",
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
								"authToken": "testAuthToken"
							}
						},
						"message": {
							"context": {
								"traits": {
									"email": "user1002@tech.com"
								}
							},
							"type": "Identify",
							"anonymousId": "b4ffheww8eisndbdjgdewifewfgerwibderv"
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
							"endpoint": "https://api.getvero.com/api/v2/users/track",
							"headers": {},
							"params": {},
							"body": {
								"JSON": {
									"id": "b4ffheww8eisndbdjgdewifewfgerwibderv",
									"email": "user1002@tech.com",
									"data": {},
									"auth_token": "testAuthToken"
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
		"name": "vero",
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
								"authToken": "testAuthToken"
							}
						},
						"message": {
							"context": {
								"traits": {
									"address": "Caravela Beach Goa",
									"homwTown": "Mawsynram",
									"email": "user1005@tech.com"
								}
							},
							"integrations": {
								"vero": {
									"tags": {
										"add": [
											"a",
											"b"
										]
									}
								}
							},
							"type": "Identify",
							"userId": "fprediruser001"
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
							"endpoint": "https://api.getvero.com/api/v2/users/track",
							"headers": {},
							"params": {},
							"body": {
								"JSON": {
									"id": "fprediruser001",
									"email": "user1005@tech.com",
									"data": {
										"address": "Caravela Beach Goa",
										"homwTown": "Mawsynram"
									},
									"auth_token": "testAuthToken"
								},
								"JSON_ARRAY": {},
								"XML": {},
								"FORM": {}
							},
							"files": {},
							"userId": ""
						},
						"statusCode": 200
					},
					{
						"output": {
							"version": "1",
							"type": "REST",
							"method": "PUT",
							"endpoint": "https://api.getvero.com/api/v2/users/tags/edit",
							"headers": {},
							"params": {},
							"body": {
								"JSON": {
									"id": "fprediruser001",
									"auth_token": "testAuthToken",
									"add": [
										"a",
										"b"
									]
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
		"name": "vero",
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
								"authToken": "testAuthToken"
							}
						},
						"message": {
							"event": "Random event with nonexisting userId and email",
							"properties": {
								"movieWatched": 3,
								"gamesPlayed": 4,
								"email": "eventIdn01@sample.com"
							},
							"type": "track",
							"userId": "eventIdn01"
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
							"endpoint": "https://api.getvero.com/api/v2/events/track",
							"headers": {},
							"params": {},
							"body": {
								"JSON": {
									"identity": {
										"id": "eventIdn01",
										"email": "eventIdn01@sample.com"
									},
									"event_name": "Random event with nonexisting userId and email",
									"data": {
										"movieWatched": 3,
										"gamesPlayed": 4,
										"email": "eventIdn01@sample.com"
									},
									"auth_token": "testAuthToken"
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
		"name": "vero",
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
								"authToken": "testAuthToken"
							}
						},
						"message": {
							"event": "Random event with existing userId and some tags removed",
							"properties": {
								"movieWatched": 3,
								"gamesPlayed": 4,
								"email": "eventIdn01@sample.com"
							},
							"integrations": {
								"Vero": {
									"tags": {
										"remove": [
											"a"
										]
									}
								}
							},
							"type": "track",
							"userId": "fprediruser001"
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
							"endpoint": "https://api.getvero.com/api/v2/events/track",
							"headers": {},
							"params": {},
							"body": {
								"JSON": {
									"identity": {
										"id": "fprediruser001",
										"email": "eventIdn01@sample.com"
									},
									"event_name": "Random event with existing userId and some tags removed",
									"data": {
										"movieWatched": 3,
										"gamesPlayed": 4,
										"email": "eventIdn01@sample.com"
									},
									"auth_token": "testAuthToken"
								},
								"JSON_ARRAY": {},
								"XML": {},
								"FORM": {}
							},
							"files": {},
							"userId": ""
						},
						"statusCode": 200
					},
					{
						"output": {
							"version": "1",
							"type": "REST",
							"method": "PUT",
							"endpoint": "https://api.getvero.com/api/v2/users/tags/edit",
							"headers": {},
							"params": {},
							"body": {
								"JSON": {
									"id": "fprediruser001",
									"auth_token": "testAuthToken",
									"remove": [
										"a"
									]
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
		"name": "vero",
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
								"authToken": "testAuthToken"
							}
						},
						"message": {
							"type": "alias",
							"userId": "sample101",
							"previousId": "newsamplel01"
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
							"method": "PUT",
							"endpoint": "https://api.getvero.com/api/v2/users/reidentify",
							"headers": {},
							"params": {},
							"body": {
								"JSON": {
									"new_id": "sample101",
									"id": "newsamplel01",
									"auth_token": "testAuthToken"
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
		"name": "vero",
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
								"authToken": "testAuthToken"
							}
						},
						"message": {
							"context": {
								"traits": {
									"email": "user1001@tech.com"
								},
								"os": {
									"name": "android"
								},
								"device": {
									"token": "qwertyuioiuytrewwertyu",
									"name": "Mi"
								}
							},
							"type": "Identify",
							"userId": "user1001"
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
							"endpoint": "https://api.getvero.com/api/v2/users/track",
							"headers": {},
							"params": {},
							"body": {
								"JSON": {
									"id": "user1001",
									"email": "user1001@tech.com",
									"data": {},
									"channels": {
										"platform": "android",
										"address": "qwertyuioiuytrewwertyu",
										"device": "Mi",
										"type": "push"
									},
									"auth_token": "testAuthToken"
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
		"name": "vero",
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
								"authToken": "testAuthToken"
							}
						},
						"message": {
							"context": {
								"traits": {
									"email": "user1001@tech.com"
								},
								"device": {
									"token": "qwertyuioiuytrewwertyu",
									"name": "Mi"
								}
							},
							"type": "Identify",
							"userId": "user1001"
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
							"endpoint": "https://api.getvero.com/api/v2/users/track",
							"headers": {},
							"params": {},
							"body": {
								"JSON": {
									"id": "user1001",
									"email": "user1001@tech.com",
									"data": {},
									"auth_token": "testAuthToken"
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
		"name": "vero",
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
								"authToken": "testAuthToken"
							}
						},
						"message": {
							"event": "unsubscribe",
							"type": "track",
							"userId": "eventIdn01"
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
							"endpoint": "https://api.getvero.com/api/v2/users/unsubscribe",
							"headers": {},
							"params": {},
							"body": {
								"JSON": {
									"id": "eventIdn01",
									"auth_token": "testAuthToken"
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
		"name": "vero",
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
								"authToken": "testAuthToken"
							}
						},
						"message": {
							"name": "Rudderstack",
							"properties": {
								"title": "rudderstack",
								"path": "/"
							},
							"type": "page",
							"userId": "eventIdn01"
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
							"endpoint": "https://api.getvero.com/api/v2/events/track",
							"headers": {},
							"params": {},
							"body": {
								"JSON": {
									"identity": {
										"id": "eventIdn01"
									},
									"event_name": "Viewed Rudderstack Page",
									"data": {
										"title": "rudderstack",
										"path": "/"
									},
									"auth_token": "testAuthToken"
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
		"name": "vero",
		"description": "Test 11",
		"feature": "processor",
		"module": "destination",
		"version": "v0",
		"input": {
			"request": {
				"body": [
					{
						"destination": {
							"Config": {
								"authToken": "testAuthToken"
							}
						},
						"message": {
							"groupId": "1234",
							"traits": {
								"name": "MyGroup",
								"industry": "IT",
								"employees": 450,
								"plan": "basic"
							},
							"type": "group",
							"userId": "eventIdn01"
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
						"error": "Event type group is not supported",
						"statTags": {
							"errorCategory": "dataValidation",
							"errorType": "instrumentation",
							"destType": "VERO",
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