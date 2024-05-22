const NodeCache = require('node-cache');
const { fetchWithProxy } = require('./fetch');
const logger = require('../logger');
const { responseStatusHandler } = require('./utils');
const stats = require('./stats');

const tpCache = new NodeCache({ useClones: false });
const CONFIG_BACKEND_URL = process.env.CONFIG_BACKEND_URL || 'https://api.rudderlabs.com';
const TRACKING_PLAN_URL = `${CONFIG_BACKEND_URL}/workspaces`;

/**
 * @param {*} tpId
 * @param {*} version
 * @param {*} workspaceId
 * @returns {Object}
 *
 * Gets the tracking plan from config backend.
 * Stores the tracking plan object in memory with time to live after which it expires.
 * tpId is updated any time user changes the code in transformation, so there wont be any stale code issues.
 * TODO: if version is not given, latest TP may be fetched, extract version and populate node cache
 */
 function getTrackingPlan(tpId, version, workspaceId) {
  return {
    "name": "workspaces/1lLaDQS1mdax6dbR08wOUgBJBk1/tracking-plans/tp_27gIzarrRWhkxscAxskVPfY7m1l",
    "display_name": "Shippit Tracking Plan",
    "version": 42,
    "rules": {
        "events": [
            {
                "id": "ev_2BBoDiSakv3lr13YILhJ9pc9V02",
                "name": "Rules engine updated",
                "description": "Event fired when enabling / disabling Rules Engine. Event triggers: 1. . Trigger on all sources. View in Avo: https://www.avo.app/schemas/Tv1qPI4Ij3B6hkVof2lK/events/QBAehpxbR9/trigger/-x6iKTZ2S",
                "version": "1-0-0",
                "rules": {
                    "type": "object",
                    "$schema": "http://json-schema.org/draft-06/schema#",
                    "required": [
                        "properties"
                    ],
                    "properties": {
                        "properties": {
                            "type": "object",
                            "required": [
                                "attributes_type",
                                "attributes_updated_location",
                                "attributes_stored_location",
                                "method"
                            ],
                            "properties": {
                                "method": {
                                    "type": "string",
                                    "description": "Where the Rules Engine was enabled/disabled from eg \\\"ui\\\""
                                },
                                "attributes_type": {
                                    "type": "string",
                                    "description": "State of the Rules Engine for a Merchant or company - enabled / disabled"
                                },
                                "attributes_stored_location": {
                                    "type": "string",
                                    "description": "The type of Rules Engine enabled/disabled (\\\"store\\\" OR \\\"company\\\")"
                                },
                                "attributes_updated_location": {
                                    "type": "string",
                                    "description": "The context in which the Rules Engine was enabled/disabled"
                                }
                            },
                            "additionalProperties": false
                        }
                    }
                }
            },
            {
                "id": "ev_2BJvGtw5h31Z6LAlGuSmsYAU9NU",
                "name": "Connect integration setup step completed",
                "description": "Triggered after completion of each signup page",
                "version": "3-0-0",
                "rules": {
                    "type": "object",
                    "$schema": "http://json-schema.org/draft-06/schema#",
                    "required": [
                        "properties"
                    ],
                    "properties": {
                        "properties": {
                            "type": "object",
                            "required": [
                                "step_completed"
                            ],
                            "properties": {
                                "store_url": {
                                    "type": [
                                        "string",
                                        "null"
                                    ],
                                    "description": "chrisf-disconnected-store.myshopify.com"
                                },
                                "integration": {
                                    "type": [
                                        "string",
                                        "null"
                                    ],
                                    "description": "The integration that this event relates to, Shopify, Fluent, PeopleVox"
                                },
                                "orders_synced": {
                                    "type": [
                                        "boolean",
                                        "null"
                                    ],
                                    "description": "true, false"
                                },
                                "shippit_store": {
                                    "type": [
                                        "string",
                                        "null"
                                    ],
                                    "description": "ibis cycles"
                                },
                                "step_completed": {
                                    "type": "string",
                                    "description": "app installed, connection method,  store connected, shipping method mapping"
                                },
                                "fields_modified": {
                                    "type": "array",
                                    "items": {
                                        "type": [
                                            "string",
                                            "null"
                                        ]
                                    },
                                    "description": "standard|standard, priority|bonds"
                                },
                                "connection_method": {
                                    "type": [
                                        "string",
                                        "null"
                                    ],
                                    "description": "new, exisitng"
                                },
                                "integrated_store_location": {
                                    "type": [
                                        "string",
                                        "null"
                                    ],
                                    "description": "Level 2 4-6 Bligh Street"
                                },
                                "integration_initiated_source": {
                                    "type": [
                                        "string",
                                        "null"
                                    ],
                                    "description": "Where the user came from to begin the integration. Did they connect the integration through Shippit or the third party platform (e.g Shopify)?"
                                }
                            },
                            "additionalProperties": false
                        }
                    }
                }
            },
            {
                "id": "ev_2BJvGwPM3FkxsLmzq8aDsdHzUB8",
                "name": "Connect integration setup completed",
                "description": "Triggered when the onbaording process is complete",
                "version": "1-0-0",
                "rules": {
                    "type": "object",
                    "$schema": "http://json-schema.org/draft-06/schema#",
                    "required": [
                        "properties"
                    ],
                    "properties": {
                        "properties": {
                            "type": "object",
                            "required": [
                                "orders_synced"
                            ],
                            "properties": {
                                "store_url": {
                                    "type": [
                                        "string",
                                        "null"
                                    ],
                                    "description": "chrisf-disconnected-store.myshopify.com"
                                },
                                "integration": {
                                    "type": [
                                        "string",
                                        "null"
                                    ],
                                    "description": "The integration that this event relates to, Shopify, Fluent, PeopleVox"
                                },
                                "orders_synced": {
                                    "type": "boolean",
                                    "description": "true, false"
                                },
                                "shippit_store": {
                                    "type": [
                                        "string",
                                        "null"
                                    ],
                                    "description": "ibis cycles"
                                },
                                "fields_modified": {
                                    "type": "array",
                                    "items": {
                                        "type": [
                                            "string",
                                            "null"
                                        ]
                                    },
                                    "description": "standard|standard, priority|bonds"
                                },
                                "connection_method": {
                                    "type": [
                                        "string",
                                        "null"
                                    ],
                                    "description": "new, exisitng"
                                },
                                "integrated_store_location": {
                                    "type": [
                                        "string",
                                        "null"
                                    ],
                                    "description": "Level 2 4-6 Bligh Street"
                                },
                                "integration_initiated_source": {
                                    "type": [
                                        "string",
                                        "null"
                                    ],
                                    "description": "Where the user came from to begin the integration. Did they connect the integration through Shippit or the third party platform (e.g Shopify)?"
                                }
                            },
                            "additionalProperties": false
                        }
                    }
                }
            },
            {
                "id": "ev_2B0rv7OmbpjWTbIebn2Z5ZpLcnE",
                "name": "Order modified",
                "description": "Triggered when an orders property is modifed, such as changing the parcel details.",
                "version": "5-0-0",
                "rules": {
                    "type": "object",
                    "$schema": "http://json-schema.org/draft-06/schema#",
                    "required": [
                        "properties"
                    ],
                    "properties": {
                        "properties": {
                            "type": "object",
                            "required": [
                                "fulfilment_status"
                            ],
                            "properties": {
                                "error": {
                                    "description": ""
                                },
                                "is_bulk": {
                                    "type": [
                                        "boolean",
                                        "null"
                                    ],
                                    "description": "Was this event trigger by a bulk action. E.g. Selecting 20 orders at once and confirming them together."
                                },
                                "has_error": {
                                    "description": ""
                                },
                                "bulk_count": {
                                    "type": [
                                        "number",
                                        "null"
                                    ],
                                    "multipleOf": 1,
                                    "description": "Number of orders included in the bulk operation"
                                },
                                "description": {
                                    "description": ""
                                },
                                "pickup_city": {
                                    "description": ""
                                },
                                "pickup_state": {
                                    "description": ""
                                },
                                "delivery_city": {
                                    "description": ""
                                },
                                "modify_method": {
                                    "description": ""
                                },
                                "package_types": {
                                    "type": [
                                        "string",
                                        "null"
                                    ],
                                    "description": "E.g. Parcel, preset or custom parcel."
                                },
                                "delivery_state": {
                                    "description": ""
                                },
                                "pickup_country": {
                                    "description": ""
                                },
                                "recipient_name": {
                                    "description": ""
                                },
                                "fields_modified": {
                                    "description": ""
                                },
                                "pickup_postcode": {
                                    "description": ""
                                },
                                "recipient_phone": {
                                    "description": ""
                                },
                                "shippit_context": {
                                    "type": [
                                        "string",
                                        "null"
                                    ],
                                    "description": "Where did this event happen"
                                },
                                "tracking_number": {
                                    "description": ""
                                },
                                "delivery_country": {
                                    "description": ""
                                },
                                "retailer_invoice": {
                                    "description": "The unique ID from the integration"
                                },
                                "carrier_allocated": {
                                    "type": [
                                        "string",
                                        "null"
                                    ],
                                    "description": ""
                                },
                                "delivery_postcode": {
                                    "description": ""
                                },
                                "fulfilment_status": {
                                    "type": "string",
                                    "description": "Fulfilment status of the order after it was modified. For example, an order while being fulfilled may have a fulfilment status of 'New' or 'On hold'."
                                },
                                "authority_to_leave": {
                                    "type": [
                                        "boolean",
                                        "null"
                                    ],
                                    "description": ""
                                },
                                "pickup_country_code": {
                                    "description": ""
                                },
                                "package_total_weight": {
                                    "description": ""
                                },
                                "package_unique_count": {
                                    "description": ""
                                },
                                "product_count_unique": {
                                    "description": ""
                                },
                                "delivery_country_code": {
                                    "description": ""
                                },
                                "delivery_instructions": {
                                    "description": ""
                                },
                                "product_count_ordered": {
                                    "description": ""
                                },
                                "package_quantity_total": {
                                    "description": ""
                                },
                                "package_quantity_parcel": {
                                    "description": ""
                                },
                                "requested_service_level": {
                                    "description": ""
                                },
                                "package_quantity_satchel": {
                                    "description": ""
                                },
                                "package_quantity_merchant_preset": {
                                    "description": ""
                                }
                            },
                            "additionalProperties": false
                        }
                    }
                }
            },
            {
                "id": "ev_27gIzg9bzhYNUwEv8BusgTNw8vJ",
                "name": "Page viewed",
                "description": "A page is viewed within the application",
                "version": "5-0-0",
                "rules": {
                    "type": "object",
                    "$schema": "http://json-schema.org/draft-06/schema#",
                    "required": [
                        "properties"
                    ],
                    "properties": {
                        "properties": {
                            "type": "object",
                            "required": [
                                "page_source"
                            ],
                            "properties": {
                                "page_name": {
                                    "description": ""
                                },
                                "integration": {
                                    "type": [
                                        "string",
                                        "null"
                                    ],
                                    "description": "The integration that this event relates to, Shopify, Fluent, PeopleVox"
                                },
                                "page_source": {
                                    "type": "string",
                                    "description": "Refers to the previous page a merchant has navigated from"
                                },
                                "page_category": {
                                    "type": [
                                        "string",
                                        "null"
                                    ],
                                    "description": "The grouping that the defines the area of the product that this page view occured\n"
                                }
                            },
                            "additionalProperties": false
                        }
                    }
                }
            },
            {
                "id": "ev_27gIzbXusCkSpwND5xTIPr10MfT",
                "name": "Connect orders imported from integration",
                "description": "Event fired when orders are imported from an integration such as Shopify into Shippit",
                "version": "2-0-0",
                "rules": {
                    "type": "object",
                    "$schema": "http://json-schema.org/draft-06/schema#",
                    "required": [
                        "properties"
                    ],
                    "properties": {
                        "properties": {
                            "type": "object",
                            "required": [],
                            "properties": {
                                "import_type": {
                                    "type": [
                                        "string",
                                        "null"
                                    ],
                                    "description": ""
                                },
                                "integration": {
                                    "type": [
                                        "string",
                                        "null"
                                    ],
                                    "description": "The integration that this event relates to, Shopify, Fluent, PeopleVox"
                                }
                            },
                            "additionalProperties": false
                        }
                    }
                }
            },
            {
                "id": "ev_27gIzavouanHYDOYKHSvqWWbDDP",
                "name": "Connect order sync settings saved",
                "description": "Event fired when the sync settings are updated",
                "version": "4-0-0",
                "rules": {
                    "type": "object",
                    "$schema": "http://json-schema.org/draft-06/schema#",
                    "required": [
                        "properties"
                    ],
                    "properties": {
                        "properties": {
                            "type": "object",
                            "required": [
                                "sync_delivery_instructions",
                                "default_email",
                                "auto_sync_new_orders",
                                "allow_partial_syncing"
                            ],
                            "properties": {
                                "integration": {
                                    "type": [
                                        "string",
                                        "null"
                                    ],
                                    "description": "The integration that this event relates to, Shopify, Fluent, PeopleVox"
                                },
                                "default_email": {
                                    "type": "boolean",
                                    "description": "true, false"
                                },
                                "sync_orders_trigger": {
                                    "type": [
                                        "string",
                                        "null"
                                    ],
                                    "description": "paid, created"
                                },
                                "auto_sync_new_orders": {
                                    "type": "boolean",
                                    "description": "true, false"
                                },
                                "allow_partial_syncing": {
                                    "type": "boolean",
                                    "description": ""
                                },
                                "exclude_orders_auto_sync": {
                                    "type": "array",
                                    "items": {
                                        "type": [
                                            "string",
                                            "null"
                                        ]
                                    },
                                    "description": "This is a product tag that defines why the orders were skipped\n"
                                },
                                "sync_delivery_instructions": {
                                    "type": "boolean",
                                    "description": "true, false"
                                }
                            },
                            "additionalProperties": false
                        }
                    }
                }
            },
            {
                "id": "ev_27gIzg317fzjYnEyUOeOi4LWero",
                "name": "Connect fulfillment settings saved",
                "description": "Event fired when the fulfillment settings are updated",
                "version": "2-0-0",
                "rules": {
                    "type": "object",
                    "$schema": "http://json-schema.org/draft-06/schema#",
                    "required": [
                        "properties"
                    ],
                    "properties": {
                        "properties": {
                            "type": "object",
                            "required": [
                                "fulfill_orders"
                            ],
                            "properties": {
                                "integration": {
                                    "type": [
                                        "string",
                                        "null"
                                    ],
                                    "description": "The integration that this event relates to, Shopify, Fluent, PeopleVox"
                                },
                                "fulfill_orders": {
                                    "type": "boolean",
                                    "description": "true, false"
                                }
                            },
                            "additionalProperties": false
                        }
                    }
                }
            },
            {
                "id": "ev_27gIzZhtuN6Hcj7lDmDxKZrhtbh",
                "name": "Connect shipping methods mapped",
                "description": "Event fired when the shipping methods are updated from settings",
                "version": "3-0-0",
                "rules": {
                    "type": "object",
                    "$schema": "http://json-schema.org/draft-06/schema#",
                    "required": [
                        "properties"
                    ],
                    "properties": {
                        "properties": {
                            "type": "object",
                            "required": [
                                "fields_modified"
                            ],
                            "properties": {
                                "integration": {
                                    "type": [
                                        "string",
                                        "null"
                                    ],
                                    "description": "The integration that this event relates to, Shopify, Fluent, PeopleVox"
                                },
                                "fields_modified": {
                                    "type": "array",
                                    "items": {
                                        "type": "string"
                                    },
                                    "description": "standard|standard, priority|bonds"
                                }
                            },
                            "additionalProperties": false
                        }
                    }
                }
            },
            {
                "id": "ev_27gIzbZImLp78KStkin79RqL3Oc",
                "name": "Connect sync history filtered",
                "description": "Event fired when the the history tables are filtered",
                "version": "4-0-0",
                "rules": {
                    "type": "object",
                    "$schema": "http://json-schema.org/draft-06/schema#",
                    "required": [
                        "properties"
                    ],
                    "properties": {
                        "properties": {
                            "type": "object",
                            "required": [
                                "sync_history_type",
                                "search_value",
                                "date"
                            ],
                            "properties": {
                                "date": {
                                    "type": "boolean",
                                    "description": "true, false"
                                },
                                "status": {
                                    "type": "array",
                                    "items": {
                                        "type": [
                                            "string",
                                            "null"
                                        ]
                                    },
                                    "description": "Synced, Waiting, Failed"
                                },
                                "service": {
                                    "type": [
                                        "string",
                                        "null"
                                    ],
                                    "description": "Standard, Express, Prioirty"
                                },
                                "integration": {
                                    "type": [
                                        "string",
                                        "null"
                                    ],
                                    "description": "The integration that this event relates to, Shopify, Fluent, PeopleVox"
                                },
                                "search_value": {
                                    "type": "boolean",
                                    "description": "true, false"
                                },
                                "sync_history_type": {
                                    "type": "string",
                                    "description": "order history, fulfillment history"
                                }
                            },
                            "additionalProperties": false
                        }
                    }
                }
            },
            {
                "id": "ev_27gIzaF3cUWUKhzi3sZV5DRhjDY",
                "name": "Connect integration removed",
                "description": "Triggered when a Connect integration is removed from a Shippit account",
                "version": "2-0-0",
                "rules": {
                    "type": "object",
                    "$schema": "http://json-schema.org/draft-06/schema#",
                    "required": [
                        "properties"
                    ],
                    "properties": {
                        "properties": {
                            "type": "object",
                            "required": [
                                "store_url"
                            ],
                            "properties": {
                                "store_url": {
                                    "type": "string",
                                    "description": "chrisf-disconnected-store.myshopify.com"
                                },
                                "integration": {
                                    "type": [
                                        "string",
                                        "null"
                                    ],
                                    "description": "The integration that this event relates to, Shopify, Fluent, PeopleVox"
                                }
                            },
                            "additionalProperties": false
                        }
                    }
                }
            },
            {
                "id": "ev_27gIzcf88p9tQD8NCrxlyKY0keu",
                "name": "Connect integration step completed",
                "description": "Triggered after completion of each signup page",
                "version": "3-0-0",
                "rules": {
                    "type": "object",
                    "$schema": "http://json-schema.org/draft-06/schema#",
                    "required": [
                        "properties"
                    ],
                    "properties": {
                        "properties": {
                            "type": "object",
                            "required": [
                                "step_completed",
                                "store_url",
                                "connection_method",
                                "thirdparty_store_name",
                                "integrated_store_location",
                                "shippit_store",
                                "fields_modified"
                            ],
                            "properties": {
                                "store_url": {
                                    "type": "string",
                                    "description": "chrisf-disconnected-store.myshopify.com"
                                },
                                "integration": {
                                    "type": [
                                        "string",
                                        "null"
                                    ],
                                    "description": "The integration that this event relates to, Shopify, Fluent, PeopleVox"
                                },
                                "shippit_store": {
                                    "type": "string",
                                    "description": "ibis cycles"
                                },
                                "step_completed": {
                                    "type": "string",
                                    "description": "app installed, connection method,  store connected, shipping method mapping"
                                },
                                "fields_modified": {
                                    "type": "array",
                                    "items": {
                                        "type": "string"
                                    },
                                    "description": "standard|standard, priority|bonds"
                                },
                                "connection_method": {
                                    "type": "string",
                                    "description": "new, exisitng"
                                },
                                "thirdparty_store_name": {
                                    "type": "string",
                                    "description": "The name of the third party store that was disconnected from Shippit when the integration was removed. eg the name of the Shopify Store which could be different from the Shippit merchant name"
                                },
                                "integrated_store_location": {
                                    "type": "string",
                                    "description": "Level 2 4-6 Bligh Street"
                                }
                            },
                            "additionalProperties": false
                        }
                    }
                }
            },
            {
                "id": "ev_27gIzctvs5hQMBHlwOdIrTKrTyy",
                "name": "Connect integration completed",
                "description": "Triggered when the onbaording process is complete",
                "version": "3-0-0",
                "rules": {
                    "type": "object",
                    "$schema": "http://json-schema.org/draft-06/schema#",
                    "required": [
                        "properties"
                    ],
                    "properties": {
                        "properties": {
                            "type": "object",
                            "required": [
                                "step_completed",
                                "store_url",
                                "connection_method",
                                "thirdparty_store_name",
                                "integrated_store_location",
                                "shippit_store",
                                "fields_modified",
                                "orders_synced"
                            ],
                            "properties": {
                                "store_url": {
                                    "type": "string",
                                    "description": "chrisf-disconnected-store.myshopify.com"
                                },
                                "integration": {
                                    "type": [
                                        "string",
                                        "null"
                                    ],
                                    "description": "The integration that this event relates to, Shopify, Fluent, PeopleVox"
                                },
                                "orders_synced": {
                                    "type": "boolean",
                                    "description": "true, false"
                                },
                                "shippit_store": {
                                    "type": "string",
                                    "description": "ibis cycles"
                                },
                                "step_completed": {
                                    "type": "string",
                                    "description": "connection method selected"
                                },
                                "fields_modified": {
                                    "type": "array",
                                    "items": {
                                        "type": "string"
                                    },
                                    "description": "standard|standard, priority|bonds"
                                },
                                "connection_method": {
                                    "type": "string",
                                    "description": "new, exisitng"
                                },
                                "thirdparty_store_name": {
                                    "type": "string",
                                    "description": "The name of the third party store that was disconnected from Shippit when the integration was removed. eg the name of the Shopify Store which could be different from the Shippit merchant name"
                                },
                                "integrated_store_location": {
                                    "type": "string",
                                    "description": "Level 2 4-6 Bligh Street"
                                }
                            },
                            "additionalProperties": false
                        }
                    }
                }
            },
            {
                "id": "ev_2AXzypwSoLggbhHzSTn3hkuNrLX",
                "name": "Subscription activated",
                "description": "Triggered when a subscription is added by a user or by an admin",
                "version": "2-0-0",
                "rules": {
                    "type": "object",
                    "$schema": "http://json-schema.org/draft-06/schema#",
                    "required": [
                        "properties"
                    ],
                    "properties": {
                        "properties": {
                            "type": "object",
                            "required": [
                                "triggered_by_admin",
                                "subscription_plan_category"
                            ],
                            "properties": {
                                "shippit_context": {
                                    "type": [
                                        "string",
                                        "null"
                                    ],
                                    "description": "Where did this event happen"
                                },
                                "subscription_fee": {
                                    "type": [
                                        "number",
                                        "null"
                                    ],
                                    "multipleOf": 1,
                                    "description": "The flat monthly fee charged for the subscription "
                                },
                                "triggered_by_admin": {
                                    "type": "boolean",
                                    "description": "Whether or not the user that triggered this event was a Shippit admin. Is either true or false."
                                },
                                "subscription_currency": {
                                    "type": [
                                        "string",
                                        "null"
                                    ],
                                    "description": "The currency that the subscription will be charged in "
                                },
                                "subscription_plan_name": {
                                    "type": [
                                        "string",
                                        "null"
                                    ],
                                    "description": "The name of the plan attached to the subscription "
                                },
                                "subscription_fee_per_sms": {
                                    "type": [
                                        "number",
                                        "null"
                                    ],
                                    "description": "The amount charged for every sms notification sent "
                                },
                                "subscription_plan_campaign": {
                                    "type": [
                                        "string",
                                        "null"
                                    ],
                                    "description": "The relevant campaign a plan is connected to. E.g. A certain promotion or discount."
                                },
                                "subscription_plan_category": {
                                    "type": "string",
                                    "description": "The category of the plan that the subscription is associated to eg \\\"Grandfathered\\\", \\\"Pro\\\", \\\"Lite\\\""
                                },
                                "subscription_extra_booking_fee": {
                                    "type": [
                                        "number",
                                        "null"
                                    ],
                                    "description": "The amount a merchant is charged per booking when they exceed their included booking limit"
                                },
                                "subscription_included_bookings": {
                                    "type": [
                                        "number",
                                        "null"
                                    ],
                                    "multipleOf": 1,
                                    "description": "A amount of bookings per month this plan includes"
                                }
                            },
                            "additionalProperties": false
                        }
                    }
                }
            },
            {
                "id": "ev_2AXzyn3rfR2mvr0KyG6o4uVtQqS",
                "name": "Subscription deactivated",
                "description": "Triggered when a subscription is removed by a user or by an admin",
                "version": "2-0-0",
                "rules": {
                    "type": "object",
                    "$schema": "http://json-schema.org/draft-06/schema#",
                    "required": [
                        "properties"
                    ],
                    "properties": {
                        "properties": {
                            "type": "object",
                            "required": [
                                "subscription_fee_per_sms",
                                "subscription_plan_campaign",
                                "subscription_extra_booking_fee",
                                "triggered_by_admin",
                                "subscription_plan_category"
                            ],
                            "properties": {
                                "shippit_context": {
                                    "type": [
                                        "string",
                                        "null"
                                    ],
                                    "description": "Where did this event happen"
                                },
                                "subscription_fee": {
                                    "type": [
                                        "number",
                                        "null"
                                    ],
                                    "multipleOf": 1,
                                    "description": "The flat monthly fee charged for the subscription "
                                },
                                "deactivate_reason": {
                                    "description": "The cateogry for why this subscription was deactivated. "
                                },
                                "triggered_by_admin": {
                                    "type": "boolean",
                                    "description": "Whether or not the user that triggered this event was a Shippit admin. Is either true or false."
                                },
                                "deactivate_reason_one": {
                                    "description": ""
                                },
                                "deactivate_reason_two": {
                                    "description": ""
                                },
                                "subscription_currency": {
                                    "type": [
                                        "string",
                                        "null"
                                    ],
                                    "description": "The currency that the subscription will be charged in "
                                },
                                "subscription_plan_name": {
                                    "type": [
                                        "string",
                                        "null"
                                    ],
                                    "description": "The name of the plan attached to the subscription "
                                },
                                "subscription_fee_per_sms": {
                                    "type": "number",
                                    "description": "The amount charged for every sms notification sent "
                                },
                                "subscription_plan_campaign": {
                                    "type": "string",
                                    "description": "The relevant campaign a plan is connected to. E.g. A certain promotion or discount."
                                },
                                "subscription_plan_category": {
                                    "type": "string",
                                    "description": "The category of the plan that the subscription is associated to eg \\\"Grandfathered\\\", \\\"Pro\\\", \\\"Lite\\\""
                                },
                                "subscription_extra_booking_fee": {
                                    "type": "number",
                                    "description": "The amount a merchant is charged per booking when they exceed their included booking limit"
                                },
                                "subscription_included_bookings": {
                                    "type": [
                                        "number",
                                        "null"
                                    ],
                                    "multipleOf": 1,
                                    "description": "A amount of bookings per month this plan includes"
                                }
                            },
                            "additionalProperties": false
                        }
                    }
                }
            },
            {
                "id": "ev_2AXzyouZjNrZlGp8zvDTDTOA2GY",
                "name": "Subscription modified",
                "description": "Triggered when a modified by a user or admin",
                "version": "1-0-0",
                "rules": {
                    "type": "object",
                    "$schema": "http://json-schema.org/draft-06/schema#",
                    "required": [
                        "properties"
                    ],
                    "properties": {
                        "properties": {
                            "type": "object",
                            "required": [
                                "subscription_upgraded",
                                "subscription_downgraded",
                                "subscription_plan_name_from",
                                "subscription_plan_name_to",
                                "subscription_plan_category_from",
                                "subscription_plan_category_to",
                                "subscription_plan_monthly_fee_from",
                                "subscription_plan_monthly_fee_to",
                                "subscription_plan_included_bookings_from",
                                "subscription_plan_included_bookings_to",
                                "triggered_by_admin"
                            ],
                            "properties": {
                                "shippit_context": {
                                    "type": [
                                        "string",
                                        "null"
                                    ],
                                    "description": "Where did this event happen"
                                },
                                "triggered_by_admin": {
                                    "type": "boolean",
                                    "description": "Whether or not the user that triggered this event was a Shippit admin. Is either true or false."
                                },
                                "subscription_upgraded": {
                                    "type": "boolean",
                                    "description": "Whether or not the subscription was upgraded. Returns True or false. Based on the plans monthly fee."
                                },
                                "subscription_downgraded": {
                                    "type": "boolean",
                                    "description": "Whether or not the subscription was downgraded. Returns True or false. Based on the plans monthly fee."
                                },
                                "subscription_plan_name_to": {
                                    "type": "string",
                                    "description": "The name of the plan that the subscription was changed to"
                                },
                                "subscription_plan_name_from": {
                                    "type": "string",
                                    "description": "The name of the previous plan, before the subscription was modified"
                                },
                                "subscription_plan_category_to": {
                                    "type": "string",
                                    "description": "The category of the plan that the subscription was changed to"
                                },
                                "subscription_plan_category_from": {
                                    "type": "string",
                                    "description": "The category of the previous plan, before it was modified."
                                },
                                "subscription_plan_monthly_fee_to": {
                                    "type": "number",
                                    "multipleOf": 1,
                                    "description": "The monthly fee of the new plan that subscription was changed to"
                                },
                                "subscription_plan_monthly_fee_from": {
                                    "type": "number",
                                    "multipleOf": 1,
                                    "description": "The month"
                                },
                                "subscription_plan_included_bookings_to": {
                                    "type": "string",
                                    "description": "The number of included bookings of the new plan."
                                },
                                "subscription_plan_included_bookings_from": {
                                    "type": "string",
                                    "description": "The number of included bookings the previous plan had, before it was modified."
                                }
                            },
                            "additionalProperties": false
                        }
                    }
                }
            },
            {
                "id": "ev_2AXzypcAFUVnfgx9cCMktFdeLSW",
                "name": "Payment failed",
                "description": "Triggered anytime a payment fails for a subscription. This may be as part of the daily cron job or when an admin or merchant manually attempts a payment.",
                "version": "1-0-0",
                "rules": {
                    "type": "object",
                    "$schema": "http://json-schema.org/draft-06/schema#",
                    "required": [
                        "properties"
                    ],
                    "properties": {
                        "properties": {
                            "type": "object",
                            "required": [
                                "days_overdue",
                                "invoice_type",
                                "total_invoice_amount",
                                "invoice_id"
                            ],
                            "properties": {
                                "invoice_id": {
                                    "type": "string",
                                    "description": "What is the unique ID of the associated invoice"
                                },
                                "days_overdue": {
                                    "type": "number",
                                    "multipleOf": 1,
                                    "description": "How many days overdue is the subscription since the payment first failed"
                                },
                                "invoice_type": {
                                    "type": "string",
                                    "description": "Was this a shipping or subscription invoice?"
                                },
                                "subscription_fee": {
                                    "type": [
                                        "number",
                                        "null"
                                    ],
                                    "multipleOf": 1,
                                    "description": "The flat monthly fee charged for the subscription "
                                },
                                "total_invoice_amount": {
                                    "type": "string",
                                    "description": "Total amount charged from the invoice"
                                }
                            },
                            "additionalProperties": false
                        }
                    }
                }
            },
            {
                "id": "ev_2AXzynKVrLsZELrMFuP4W7lIXJ6",
                "name": "Payment successful",
                "description": "Trigger when either a shipping invoice or software invoice is successfully\n paid. Event triggers: 1. This event is triggered when the payment for either a shipping or software invoice successfully goes through. This is a backend only event. . Trigger on all sources. View in Avo: https://www.avo.app/schemas/Tv1qPI4Ij3B6hkVof2lK/events/YWJ6z8C4jA/trigger/oYjXwF8xF",
                "version": "1-0-0",
                "rules": {
                    "type": "object",
                    "$schema": "http://json-schema.org/draft-06/schema#",
                    "required": [
                        "properties"
                    ],
                    "properties": {
                        "properties": {
                            "type": "object",
                            "required": [
                                "invoice_type",
                                "total_invoice_amount",
                                "invoice_id"
                            ],
                            "properties": {
                                "invoice_id": {
                                    "type": "string",
                                    "description": "What is the unique ID of the associated invoice"
                                },
                                "invoice_type": {
                                    "type": "string",
                                    "description": "Was this a shipping or subscription invoice?"
                                },
                                "subscription_fee": {
                                    "type": [
                                        "number",
                                        "null"
                                    ],
                                    "multipleOf": 1,
                                    "description": "The flat monthly fee charged for the subscription "
                                },
                                "total_invoice_amount": {
                                    "type": "string",
                                    "description": "Total amount charged from the invoice"
                                }
                            },
                            "additionalProperties": false
                        }
                    }
                }
            },
            {
                "id": "ev_2AXzykKKn7R7iHNwqVk6ODLD8hH",
                "name": "Merchant state modified",
                "description": "Triggered when a merchant is disabled or undisabled",
                "version": "1-0-0",
                "rules": {
                    "type": "object",
                    "$schema": "http://json-schema.org/draft-06/schema#",
                    "required": [
                        "properties"
                    ],
                    "properties": {
                        "properties": {
                            "type": "object",
                            "required": [
                                "merchant_disabled",
                                "triggered_by_admin",
                                "triggered_automatically"
                            ],
                            "properties": {
                                "subscription_fee": {
                                    "type": [
                                        "number",
                                        "null"
                                    ],
                                    "multipleOf": 1,
                                    "description": "The flat monthly fee charged for the subscription "
                                },
                                "merchant_disabled": {
                                    "type": "string",
                                    "description": "Is the associated merchant disabled or not "
                                },
                                "triggered_by_admin": {
                                    "type": "boolean",
                                    "description": "Whether or not the user that triggered this event was a Shippit admin. Is either true or false."
                                },
                                "triggered_automatically": {
                                    "type": "boolean",
                                    "description": "Was this event triggered by automatically by our failed payments process\n"
                                }
                            },
                            "additionalProperties": false
                        }
                    }
                }
            },
            {
                "id": "ev_2AdOASAxuKshRVJiIyJheurZCaT",
                "name": "Customised orders table",
                "description": "Triggered when a user updates their settings for the new orders table, such as showing or hiding the products column.",
                "version": "2-0-0",
                "rules": {
                    "type": "object",
                    "$schema": "http://json-schema.org/draft-06/schema#",
                    "required": [],
                    "properties": {}
                }
            },
            {
                "id": "ev_2AdOAUVKXAoKQfDFCmu7eivSrWy",
                "name": "Document(s) downloaded",
                "description": "Triggered when any document is downloaded through the shippit UI.",
                "version": "2-0-0",
                "rules": {
                    "type": "object",
                    "$schema": "http://json-schema.org/draft-06/schema#",
                    "required": [
                        "properties"
                    ],
                    "properties": {
                        "properties": {
                            "type": "object",
                            "required": [
                                "download_method"
                            ],
                            "properties": {
                                "is_bulk": {
                                    "type": [
                                        "boolean",
                                        "null"
                                    ],
                                    "description": "Was this event trigger by a bulk action. E.g. Selecting 20 orders at once and confirming them together."
                                },
                                "order_count": {
                                    "description": "How many orders were included in the bulk action"
                                },
                                "document_type": {
                                    "description": "What document was dowloaded? E.g. Label, picklist, packlip"
                                },
                                "download_method": {
                                    "type": "string",
                                    "description": "What this order downloaded or printed?"
                                },
                                "shippit_context": {
                                    "type": [
                                        "string",
                                        "null"
                                    ],
                                    "description": "Where did this event happen"
                                },
                                "tracking_number": {
                                    "description": ""
                                }
                            },
                            "additionalProperties": false
                        }
                    }
                }
            },
            {
                "id": "ev_2AdOARwFbSmrm7DzMQx7kkOhHnQ",
                "name": "Order added",
                "description": "Triggered when an order is added, either directly via the API or through the add order modal.",
                "version": "3-0-0",
                "rules": {
                    "type": "object",
                    "$schema": "http://json-schema.org/draft-06/schema#",
                    "required": [
                        "properties"
                    ],
                    "properties": {
                        "properties": {
                            "type": "object",
                            "required": [],
                            "properties": {
                                "courier": {
                                    "type": [
                                        "string",
                                        "null"
                                    ],
                                    "description": ""
                                },
                                "pickup_city": {
                                    "description": ""
                                },
                                "pickup_state": {
                                    "description": ""
                                },
                                "delivery_city": {
                                    "description": ""
                                },
                                "package_types": {
                                    "type": [
                                        "string",
                                        "null"
                                    ],
                                    "description": "E.g. Parcel, preset or custom parcel."
                                },
                                "delivery_state": {
                                    "description": ""
                                },
                                "filter_applied": {
                                    "description": ""
                                },
                                "pickup_country": {
                                    "description": ""
                                },
                                "pickup_postcode": {
                                    "description": ""
                                },
                                "tracking_number": {
                                    "description": ""
                                },
                                "delivery_country": {
                                    "description": ""
                                },
                                "carrier_allocated": {
                                    "type": [
                                        "string",
                                        "null"
                                    ],
                                    "description": ""
                                },
                                "delivery_postcode": {
                                    "description": ""
                                },
                                "authority_to_leave": {
                                    "type": [
                                        "boolean",
                                        "null"
                                    ],
                                    "description": ""
                                },
                                "transit_protection": {
                                    "description": ""
                                },
                                "shipping_cart_method": {
                                    "description": ""
                                },
                                "order_creation_method": {
                                    "description": ""
                                },
                                "product_count_ordered": {
                                    "description": ""
                                },
                                "requested_service_level": {
                                    "description": ""
                                }
                            },
                            "additionalProperties": false
                        }
                    }
                }
            },
            {
                "id": "ev_2AdOAVTSrT19gg3jfcxcaV45lil",
                "name": "Order booked",
                "description": "The order booked event is triggered every time an order is booked regardless of whether its an API booking or UI booking\n\nThe order booked event is triggered when the orders are booked for pickup. This is the point that the merchant incurs a cost.  The order booked event only counts successfully booked orders",
                "version": "4-0-0",
                "rules": {
                    "type": "object",
                    "$schema": "http://json-schema.org/draft-06/schema#",
                    "required": [
                        "properties"
                    ],
                    "properties": {
                        "properties": {
                            "type": "object",
                            "required": [],
                            "properties": {
                                "carrier": {
                                    "type": [
                                        "string",
                                        "null"
                                    ],
                                    "description": "The name of the allocated to this order"
                                },
                                "courier": {
                                    "type": [
                                        "string",
                                        "null"
                                    ],
                                    "description": ""
                                },
                                "order_number": {
                                    "description": "the order number"
                                },
                                "qty_products": {
                                    "description": ""
                                },
                                "byo_or_resell": {
                                    "type": [
                                        "string",
                                        "null"
                                    ],
                                    "description": "Was carrier allocated to this order a BYO or resell one?"
                                },
                                "service_level": {
                                    "description": ""
                                },
                                "order_currency": {
                                    "description": ""
                                },
                                "dangerous_goods": {
                                    "type": [
                                        "boolean",
                                        "null"
                                    ],
                                    "description": ""
                                },
                                "parcel_quantity": {
                                    "description": ""
                                },
                                "pickup_postcode": {
                                    "description": ""
                                },
                                "tracking_number": {
                                    "description": "the tracking number associated with this order"
                                },
                                "cash_on_delivery": {
                                    "type": [
                                        "boolean",
                                        "null"
                                    ],
                                    "description": ""
                                },
                                "delivery_postcode": {
                                    "description": ""
                                },
                                "order_book_method": {
                                    "description": "the source of the booking - api,send_a_package, manual, csv, shopify, magento, woocommerce.."
                                },
                                "authority_to_leave": {
                                    "type": [
                                        "boolean",
                                        "null"
                                    ],
                                    "description": ""
                                },
                                "order_courier_cost": {
                                    "description": ""
                                },
                                "order_retail_price": {
                                    "description": ""
                                },
                                "parcel_weight_unit": {
                                    "description": ""
                                },
                                "transit_protection": {
                                    "description": ""
                                },
                                "pickup_country_code": {
                                    "description": ""
                                },
                                "shop_cart_connected": {
                                    "description": ""
                                },
                                "total_parcel_weight": {
                                    "description": ""
                                },
                                "parcel_charge_method": {
                                    "description": ""
                                },
                                "delivery_country_code": {
                                    "description": ""
                                },
                                "transit_protection_cost": {
                                    "description": ""
                                },
                                "delivery_local_international": {
                                    "description": ""
                                },
                                "rules_engine_changed_quote_recommendation": {
                                    "description": ""
                                }
                            },
                            "additionalProperties": false
                        }
                    }
                }
            },
            {
                "id": "ev_2AdOAPbLJjrLwa5dL3AEZr57OrW",
                "name": "Order(s) confirmed",
                "description": "Triggered when an order is confirmed through the app UI",
                "version": "3-0-0",
                "rules": {
                    "type": "object",
                    "$schema": "http://json-schema.org/draft-06/schema#",
                    "required": [
                        "properties"
                    ],
                    "properties": {
                        "properties": {
                            "type": "object",
                            "required": [],
                            "properties": {
                                "is_bulk": {
                                    "type": [
                                        "boolean",
                                        "null"
                                    ],
                                    "description": "Was this event trigger by a bulk action. E.g. Selecting 20 orders at once and confirming them together."
                                },
                                "bulk_count": {
                                    "type": [
                                        "number",
                                        "null"
                                    ],
                                    "multipleOf": 1,
                                    "description": "Number of orders included in the bulk operation"
                                },
                                "order_count": {
                                    "description": "How many orders were included in the bulk action"
                                },
                                "package_types": {
                                    "type": [
                                        "string",
                                        "null"
                                    ],
                                    "description": "E.g. Parcel, preset or custom parcel."
                                },
                                "tracking_number": {
                                    "description": ""
                                },
                                "label_downloaded": {
                                    "type": [
                                        "boolean",
                                        "null"
                                    ],
                                    "description": "When the order was confirmed, was the label retrieved at the same time."
                                },
                                "package_total_weight": {
                                    "description": ""
                                },
                                "label_download_method": {
                                    "description": "If the label was retreived, was it download or instant printed."
                                },
                                "package_quantity_total": {
                                    "description": ""
                                },
                                "package_quantity_parcel": {
                                    "description": ""
                                },
                                "package_quantity_satchel": {
                                    "description": ""
                                },
                                "package_quantity_merchant_preset": {
                                    "description": ""
                                }
                            },
                            "additionalProperties": false
                        }
                    }
                }
            },
            {
                "id": "ev_2AdOAO17h2zOHVxM1baVor02dtm",
                "name": "Order(s) deleted",
                "description": "Triggered when an order is deleted via the app UI",
                "version": "2-0-0",
                "rules": {
                    "type": "object",
                    "$schema": "http://json-schema.org/draft-06/schema#",
                    "required": [
                        "properties"
                    ],
                    "properties": {
                        "properties": {
                            "type": "object",
                            "required": [],
                            "properties": {
                                "is_bulk": {
                                    "type": [
                                        "boolean",
                                        "null"
                                    ],
                                    "description": "Was this event trigger by a bulk action. E.g. Selecting 20 orders at once and confirming them together."
                                },
                                "order_count": {
                                    "description": "How many orders were included in the bulk action"
                                },
                                "tracking_number": {
                                    "description": ""
                                }
                            },
                            "additionalProperties": false
                        }
                    }
                }
            },
            {
                "id": "ev_2AdOAOdUOis0iyeIBZkRTdNNbJi",
                "name": "Order(s) modified",
                "description": "Triggered when an orders property is modifed, such as changing the parcel details.",
                "version": "1-0-0",
                "rules": {
                    "type": "object",
                    "$schema": "http://json-schema.org/draft-06/schema#",
                    "required": [
                        "properties"
                    ],
                    "properties": {
                        "properties": {
                            "type": "object",
                            "required": [],
                            "properties": {
                                "error": {
                                    "description": ""
                                },
                                "has_error": {
                                    "description": ""
                                },
                                "description": {
                                    "description": ""
                                },
                                "pickup_city": {
                                    "description": ""
                                },
                                "pickup_state": {
                                    "description": ""
                                },
                                "delivery_city": {
                                    "description": ""
                                },
                                "modify_method": {
                                    "description": ""
                                },
                                "package_types": {
                                    "description": ""
                                },
                                "delivery_state": {
                                    "description": ""
                                },
                                "pickup_country": {
                                    "description": ""
                                },
                                "recipient_name": {
                                    "description": ""
                                },
                                "fields_modified": {
                                    "description": ""
                                },
                                "pickup_postcode": {
                                    "description": ""
                                },
                                "recipient_phone": {
                                    "description": ""
                                },
                                "tracking_number": {
                                    "description": ""
                                },
                                "delivery_country": {
                                    "description": ""
                                },
                                "retailer_invoice": {
                                    "description": ""
                                },
                                "carrier_allocated": {
                                    "type": [
                                        "string",
                                        "null"
                                    ],
                                    "description": ""
                                },
                                "delivery_postcode": {
                                    "description": ""
                                },
                                "authority_to_leave": {
                                    "type": [
                                        "boolean",
                                        "null"
                                    ],
                                    "description": ""
                                },
                                "package_total_weight": {
                                    "description": ""
                                },
                                "package_unique_count": {
                                    "description": ""
                                },
                                "product_count_unique": {
                                    "description": ""
                                },
                                "delivery_instructions": {
                                    "description": ""
                                },
                                "product_count_ordered": {
                                    "description": ""
                                },
                                "package_quantity_total": {
                                    "description": ""
                                },
                                "package_quantity_parcel": {
                                    "description": ""
                                },
                                "requested_service_level": {
                                    "description": ""
                                },
                                "package_quantity_satchel": {
                                    "description": ""
                                },
                                "package_quantity_merchant_preset": {
                                    "description": ""
                                }
                            },
                            "additionalProperties": false
                        }
                    }
                }
            },
            {
                "id": "ev_2AdOAPK3HMSLVPoy31ngZquDdfU",
                "name": "Credit card stored",
                "description": "Credit card details successfully stored against an account",
                "version": "1-0-0",
                "rules": {
                    "type": "object",
                    "$schema": "http://json-schema.org/draft-06/schema#",
                    "required": [
                        "properties"
                    ],
                    "properties": {
                        "properties": {
                            "type": "object",
                            "required": [],
                            "properties": {
                                "shippit_context": {
                                    "type": [
                                        "string",
                                        "null"
                                    ],
                                    "description": "Where did this event happen"
                                }
                            },
                            "additionalProperties": false
                        }
                    }
                }
            },
            {
                "id": "ev_2AdOARr3tMPR1cl0Tyz2TEXoKQa",
                "name": "Signup completed",
                "description": "Triggered when the signup process has been completed",
                "version": "5-0-0",
                "rules": {
                    "type": "object",
                    "$schema": "http://json-schema.org/draft-06/schema#",
                    "required": [
                        "properties"
                    ],
                    "properties": {
                        "properties": {
                            "type": "object",
                            "required": [],
                            "properties": {
                                "zip": {
                                    "description": ""
                                },
                                "city": {
                                    "type": [
                                        "string",
                                        "null"
                                    ],
                                    "description": ""
                                },
                                "goals": {
                                    "description": ""
                                },
                                "state": {
                                    "description": ""
                                },
                                "country": {
                                    "type": [
                                        "string",
                                        "null"
                                    ],
                                    "description": ""
                                },
                                "industry": {
                                    "description": "The industry of the associated merchant."
                                },
                                "store_name": {
                                    "description": ""
                                },
                                "location_type": {
                                    "description": ""
                                },
                                "monthly_volume": {
                                    "description": ""
                                },
                                "preferred_carriers": {
                                    "type": "array",
                                    "items": {
                                        "type": [
                                            "string",
                                            "null"
                                        ]
                                    },
                                    "description": "Selection of carriers the customer has preference to use"
                                },
                                "store_integrations": {
                                    "type": "array",
                                    "items": {
                                        "type": [
                                            "string",
                                            "null"
                                        ]
                                    },
                                    "description": "The user inputted ecommerce platforms as selected from the dropdown. "
                                },
                                "store_integration_freetext": {
                                    "type": "array",
                                    "items": {
                                        "type": [
                                            "string",
                                            "null"
                                        ]
                                    },
                                    "description": "Free text option for the user to input what ecommerce store they use if it's not listed"
                                }
                            },
                            "additionalProperties": false
                        }
                    }
                }
            },
            {
                "id": "ev_2AdOAUJlw7bKag6KSnuO3vUqyYH",
                "name": "Signup step completed",
                "description": "Triggered when a step in the signup process has been completed",
                "version": "8-0-0",
                "rules": {
                    "type": "object",
                    "$schema": "http://json-schema.org/draft-06/schema#",
                    "required": [
                        "properties"
                    ],
                    "properties": {
                        "properties": {
                            "type": "object",
                            "required": [],
                            "properties": {
                                "zip": {
                                    "description": ""
                                },
                                "city": {
                                    "type": [
                                        "string",
                                        "null"
                                    ],
                                    "description": ""
                                },
                                "goals": {
                                    "description": ""
                                },
                                "state": {
                                    "description": ""
                                },
                                "country": {
                                    "type": [
                                        "string",
                                        "null"
                                    ],
                                    "description": ""
                                },
                                "industry": {
                                    "description": "The industry of the associated merchant."
                                },
                                "store_name": {
                                    "description": ""
                                },
                                "email_address": {
                                    "type": [
                                        "string",
                                        "null"
                                    ],
                                    "description": "Email address of the first user for a customer"
                                },
                                "location_type": {
                                    "description": ""
                                },
                                "monthly_volume": {
                                    "description": ""
                                },
                                "step_completed": {
                                    "description": ""
                                },
                                "preferred_carriers": {
                                    "type": "array",
                                    "items": {
                                        "type": [
                                            "string",
                                            "null"
                                        ]
                                    },
                                    "description": "Selection of carriers the customer has preference to use"
                                },
                                "store_integrations": {
                                    "type": "array",
                                    "items": {
                                        "type": [
                                            "string",
                                            "null"
                                        ]
                                    },
                                    "description": "The user inputted ecommerce platforms as selected from the dropdown. "
                                },
                                "store_integration_freetext": {
                                    "type": "array",
                                    "items": {
                                        "type": [
                                            "string",
                                            "null"
                                        ]
                                    },
                                    "description": "Free text option for the user to input what ecommerce store they use if it's not listed"
                                }
                            },
                            "additionalProperties": false
                        }
                    }
                }
            },
            {
                "id": "ev_2AdOAOizjSaNAqwNiZWdiazwBFm",
                "name": "Integration added",
                "description": "Event is triggered when a new Connect integration is successful",
                "version": "2-0-0",
                "rules": {
                    "type": "object",
                    "$schema": "http://json-schema.org/draft-06/schema#",
                    "required": [
                        "properties"
                    ],
                    "properties": {
                        "properties": {
                            "type": "object",
                            "required": [
                                "store_url",
                                "connection_method",
                                "integrated_store_location",
                                "shippit_store",
                                "orders_synced",
                                "integration_initiated_source"
                            ],
                            "properties": {
                                "store_url": {
                                    "type": "string",
                                    "description": "chrisf-disconnected-store.myshopify.com"
                                },
                                "store_name": {
                                    "description": ""
                                },
                                "orders_synced": {
                                    "type": "boolean",
                                    "description": "true, false"
                                },
                                "shippit_store": {
                                    "type": "string",
                                    "description": "ibis cycles"
                                },
                                "fields_modified": {
                                    "description": ""
                                },
                                "integration_name": {
                                    "description": "The integration that this event relates to, Shopify, Fluent, PeopleVox"
                                },
                                "connection_method": {
                                    "type": "string",
                                    "description": "new, exisitng"
                                },
                                "integrated_store_location": {
                                    "type": "string",
                                    "description": "Level 2 4-6 Bligh Street"
                                },
                                "integration_initiated_source": {
                                    "type": "string",
                                    "description": "Where the user came from to begin the integration. Did they connect the integration through Shippit or the third party platform (e.g Shopify)?"
                                }
                            },
                            "additionalProperties": false
                        }
                    }
                }
            },
            {
                "id": "ev_2BmKoya4TpcgzyNLPGL3h2USQ8a",
                "name": "Shipping optimiser generated",
                "description": "Event fired when a Shipping Optimiser report is generated. Event triggers: 1. Shipping Optimiser - Default state. Trigger on all sources. View in Avo: https://www.avo.app/schemas/Tv1qPI4Ij3B6hkVof2lK/events/ALuV48ikttj/trigger/C-rG5NqZq. 2. Shipping Optimiser - Customised carrier mix screen. Trigger on all sources. View in Avo: https://www.avo.app/schemas/Tv1qPI4Ij3B6hkVof2lK/events/ALuV48ikttj/trigger/07g8tiB8M",
                "version": "9-0-0",
                "rules": {
                    "type": "object",
                    "$schema": "http://json-schema.org/draft-06/schema#",
                    "required": [
                        "properties"
                    ],
                    "properties": {
                        "properties": {
                            "type": "object",
                            "required": [
                                "preference_service",
                                "preference_allocation",
                                "recommended_carriers",
                                "current_carriers_enabled",
                                "difference_carriers_enabled",
                                "difference_carriers_disabled",
                                "current_carriers_full",
                                "difference_carriers_full",
                                "current_cost_price",
                                "current_speed_days",
                                "current_dot_pct",
                                "new_cost_price",
                                "new_speed_days",
                                "new_dot_pct",
                                "difference_cost",
                                "difference_speed",
                                "difference_dot_pct",
                                "optimiser_slug",
                                "custom_carriers_flag",
                                "merchant_id",
                                "company_id",
                                "user_id",
                                "preference_start_date",
                                "preference_end_date"
                            ],
                            "properties": {
                                "user_id": {
                                    "type": "string",
                                    "description": "The unique user identifier"
                                },
                                "company_id": {
                                    "type": "string",
                                    "description": "The ID associated with Shippit's company ID"
                                },
                                "merchant_id": {
                                    "type": "string",
                                    "description": "The ID associated with Shippit's merchant UUID"
                                },
                                "new_dot_pct": {
                                    "type": "number",
                                    "description": "Shippit Recommended carrier mix delivered on time percentage"
                                },
                                "new_cost_price": {
                                    "type": "number",
                                    "description": "Shippit Recommended carrier mix total cost "
                                },
                                "new_speed_days": {
                                    "type": "number",
                                    "description": "Shippit Recommended carrier mix total average speed in days"
                                },
                                "optimiser_slug": {
                                    "type": "string",
                                    "description": "Unique slug for the report generated. Generated every time user attempts to generate a report, even if the data hasn't changed."
                                },
                                "current_dot_pct": {
                                    "type": "number",
                                    "description": "Current carrier mix delivered on time percentage"
                                },
                                "custom_carriers": {
                                    "type": "array",
                                    "items": {
                                        "type": [
                                            "string",
                                            "null"
                                        ]
                                    },
                                    "description": "User's customised carrier mix"
                                },
                                "difference_cost": {
                                    "type": "number",
                                    "description": "Diff in total cost if Shippit recommendation is applied"
                                },
                                "difference_speed": {
                                    "type": "number",
                                    "description": "Diff in total speed if Shippit recommendation is applied"
                                },
                                "current_cost_price": {
                                    "type": "number",
                                    "description": "Current carrier mix total cost"
                                },
                                "current_speed_days": {
                                    "type": "number",
                                    "description": "Current carrier mix total average speed in days"
                                },
                                "custom_new_dot_pct": {
                                    "type": [
                                        "number",
                                        "null"
                                    ],
                                    "description": "User's custom carrier mix delivered on time percentage"
                                },
                                "difference_dot_pct": {
                                    "type": "number",
                                    "description": "Diff in total delivered percentage on time if Shippit recommendation custom carrier mix is applied"
                                },
                                "preference_service": {
                                    "type": "string",
                                    "description": "User preference on service levels"
                                },
                                "preference_end_date": {
                                    "type": "string",
                                    "description": "End of the time frame for which the SO data has been generated"
                                },
                                "custom_carriers_flag": {
                                    "type": "boolean",
                                    "description": "User has customised the carrier mix"
                                },
                                "recommended_carriers": {
                                    "type": "array",
                                    "items": {
                                        "type": "string"
                                    },
                                    "description": "Shippit recommended carrier mix"
                                },
                                "current_carriers_full": {
                                    "type": "string",
                                    "description": "Current current carrier mix in detail with metrics"
                                },
                                "custom_new_cost_price": {
                                    "type": [
                                        "number",
                                        "null"
                                    ],
                                    "description": "User's custom carrier mix total cost "
                                },
                                "custom_new_speed_days": {
                                    "type": [
                                        "number",
                                        "null"
                                    ],
                                    "description": "User's custom carrier mix total average speed in days"
                                },
                                "preference_allocation": {
                                    "type": "string",
                                    "description": "User preference on allocation"
                                },
                                "preference_start_date": {
                                    "type": "string",
                                    "description": "Start of the time frame for which the SO data has been generated"
                                },
                                "custom_difference_cost": {
                                    "type": [
                                        "number",
                                        "null"
                                    ],
                                    "description": "Diff in total cost if user's custom carrier mix is applied"
                                },
                                "custom_difference_speed": {
                                    "type": [
                                        "number",
                                        "null"
                                    ],
                                    "description": "Diff in total speed if user's custom carrier mix is applied"
                                },
                                "current_carriers_enabled": {
                                    "type": "array",
                                    "items": {
                                        "type": "string"
                                    },
                                    "description": "User's current carrier mix in settings"
                                },
                                "difference_carriers_full": {
                                    "type": "string",
                                    "description": "Diff in carriers & metrics if Shippit recommended carrier mix is applied"
                                },
                                "custom_difference_dot_pct": {
                                    "type": [
                                        "number",
                                        "null"
                                    ],
                                    "description": "Diff in total delivered on time percentage if user's custom carrier mix  is applied"
                                },
                                "difference_carriers_enabled": {
                                    "type": "array",
                                    "items": {
                                        "type": "string"
                                    },
                                    "description": "Carriers enabled in Shippit recommended carrier mix if applied"
                                },
                                "difference_carriers_disabled": {
                                    "type": "array",
                                    "items": {
                                        "type": "string"
                                    },
                                    "description": "Carriers disabled in Shippit recommended carrier mix if applied"
                                },
                                "custom_difference_carriers_full": {
                                    "type": [
                                        "string",
                                        "null"
                                    ],
                                    "description": "Diff in carriers & metrics if user's custom carrier mix is applied"
                                },
                                "custom_difference_carriers_enabled": {
                                    "type": "array",
                                    "items": {
                                        "type": [
                                            "string",
                                            "null"
                                        ]
                                    },
                                    "description": "Carriers enabled in user's custom carrier mix without all metrics"
                                },
                                "custom_difference_carriers_disabled": {
                                    "type": "array",
                                    "items": {
                                        "type": [
                                            "string",
                                            "null"
                                        ]
                                    },
                                    "description": "Carriers disabled in user's custom carrier mix if applied"
                                }
                            },
                            "additionalProperties": false
                        }
                    }
                }
            },
            {
                "id": "ev_2BmKowfIwvqeq0SbKa6clcbi8fW",
                "name": "Shipping optimiser applied",
                "description": "Event fired when a Shipping Optimiser report has been applied by the user, causing a change in carrier settings. Event triggers: 1. Shipping Optimiser - Default state - Carriers updated. Trigger on all sources. View in Avo: https://www.avo.app/schemas/Tv1qPI4Ij3B6hkVof2lK/events/LSFT6RvJ2/trigger/TIVDobxhT. 2. Shipping Optimiser - Customised carrier mix screen - Carriers updated. Trigger on all sources. View in Avo: https://www.avo.app/schemas/Tv1qPI4Ij3B6hkVof2lK/events/LSFT6RvJ2/trigger/Z3h3iTRV6",
                "version": "7-0-0",
                "rules": {
                    "type": "object",
                    "$schema": "http://json-schema.org/draft-06/schema#",
                    "required": [
                        "properties"
                    ],
                    "properties": {
                        "properties": {
                            "type": "object",
                            "required": [
                                "preference_service",
                                "preference_allocation",
                                "recommended_carriers",
                                "current_carriers_enabled",
                                "difference_carriers_enabled",
                                "difference_carriers_disabled",
                                "current_carriers_full",
                                "difference_carriers_full",
                                "current_cost_price",
                                "current_speed_days",
                                "current_dot_pct",
                                "new_cost_price",
                                "new_speed_days",
                                "new_dot_pct",
                                "difference_cost",
                                "difference_speed",
                                "difference_dot_pct",
                                "optimiser_slug",
                                "custom_carriers_flag",
                                "merchant_id",
                                "company_id",
                                "user_id",
                                "preference_start_date",
                                "preference_end_date"
                            ],
                            "properties": {
                                "user_id": {
                                    "type": "string",
                                    "description": "The unique user identifier"
                                },
                                "company_id": {
                                    "type": "string",
                                    "description": "The ID associated with Shippit's company ID"
                                },
                                "merchant_id": {
                                    "type": "string",
                                    "description": "The ID associated with Shippit's merchant UUID"
                                },
                                "new_dot_pct": {
                                    "type": "number",
                                    "description": "Shippit Recommended carrier mix delivered on time percentage"
                                },
                                "new_cost_price": {
                                    "type": "number",
                                    "description": "Shippit Recommended carrier mix total cost "
                                },
                                "new_speed_days": {
                                    "type": "number",
                                    "description": "Shippit Recommended carrier mix total average speed in days"
                                },
                                "optimiser_slug": {
                                    "type": "string",
                                    "description": "Unique slug for the report generated. Generated every time user attempts to generate a report, even if the data hasn't changed."
                                },
                                "current_dot_pct": {
                                    "type": "number",
                                    "description": "Current carrier mix delivered on time percentage"
                                },
                                "custom_carriers": {
                                    "type": "array",
                                    "items": {
                                        "type": [
                                            "string",
                                            "null"
                                        ]
                                    },
                                    "description": "User's customised carrier mix"
                                },
                                "difference_cost": {
                                    "type": "number",
                                    "description": "Diff in total cost if Shippit recommendation is applied"
                                },
                                "difference_speed": {
                                    "type": "number",
                                    "description": "Diff in total speed if Shippit recommendation is applied"
                                },
                                "current_cost_price": {
                                    "type": "number",
                                    "description": "Current carrier mix total cost"
                                },
                                "current_speed_days": {
                                    "type": "number",
                                    "description": "Current carrier mix total average speed in days"
                                },
                                "custom_new_dot_pct": {
                                    "type": [
                                        "number",
                                        "null"
                                    ],
                                    "description": "User's custom carrier mix delivered on time percentage"
                                },
                                "difference_dot_pct": {
                                    "type": "number",
                                    "description": "Diff in total delivered percentage on time if Shippit recommendation custom carrier mix is applied"
                                },
                                "preference_service": {
                                    "type": "string",
                                    "description": "User preference on service levels"
                                },
                                "preference_end_date": {
                                    "type": "string",
                                    "description": "End of the time frame for which the SO data has been generated"
                                },
                                "custom_carriers_flag": {
                                    "type": "boolean",
                                    "description": "User has customised the carrier mix"
                                },
                                "recommended_carriers": {
                                    "type": "array",
                                    "items": {
                                        "type": "string"
                                    },
                                    "description": "Shippit recommended carrier mix"
                                },
                                "current_carriers_full": {
                                    "type": "string",
                                    "description": "Current current carrier mix in detail with metrics"
                                },
                                "custom_new_cost_price": {
                                    "type": [
                                        "number",
                                        "null"
                                    ],
                                    "description": "User's custom carrier mix total cost "
                                },
                                "custom_new_speed_days": {
                                    "type": [
                                        "number",
                                        "null"
                                    ],
                                    "description": "User's custom carrier mix total average speed in days"
                                },
                                "preference_allocation": {
                                    "type": "string",
                                    "description": "User preference on allocation"
                                },
                                "preference_start_date": {
                                    "type": "string",
                                    "description": "Start of the time frame for which the SO data has been generated"
                                },
                                "custom_difference_cost": {
                                    "type": [
                                        "number",
                                        "null"
                                    ],
                                    "description": "Diff in total cost if user's custom carrier mix is applied"
                                },
                                "custom_difference_speed": {
                                    "type": [
                                        "number",
                                        "null"
                                    ],
                                    "description": "Diff in total speed if user's custom carrier mix is applied"
                                },
                                "current_carriers_enabled": {
                                    "type": "array",
                                    "items": {
                                        "type": "string"
                                    },
                                    "description": "User's current carrier mix in settings"
                                },
                                "difference_carriers_full": {
                                    "type": "string",
                                    "description": "Diff in carriers & metrics if Shippit recommended carrier mix is applied"
                                },
                                "custom_difference_dot_pct": {
                                    "type": [
                                        "number",
                                        "null"
                                    ],
                                    "description": "Diff in total delivered on time percentage if user's custom carrier mix  is applied"
                                },
                                "difference_carriers_enabled": {
                                    "type": "array",
                                    "items": {
                                        "type": "string"
                                    },
                                    "description": "Carriers enabled in Shippit recommended carrier mix if applied"
                                },
                                "difference_carriers_disabled": {
                                    "type": "array",
                                    "items": {
                                        "type": "string"
                                    },
                                    "description": "Carriers disabled in Shippit recommended carrier mix if applied"
                                },
                                "custom_difference_carriers_full": {
                                    "type": [
                                        "string",
                                        "null"
                                    ],
                                    "description": "Diff in carriers & metrics if user's custom carrier mix is applied"
                                },
                                "custom_difference_carriers_enabled": {
                                    "type": "array",
                                    "items": {
                                        "type": [
                                            "string",
                                            "null"
                                        ]
                                    },
                                    "description": "Carriers enabled in user's custom carrier mix without all metrics"
                                },
                                "custom_difference_carriers_disabled": {
                                    "type": "array",
                                    "items": {
                                        "type": [
                                            "string",
                                            "null"
                                        ]
                                    },
                                    "description": "Carriers disabled in user's custom carrier mix if applied"
                                }
                            },
                            "additionalProperties": false
                        }
                    }
                }
            },
            {
                "id": "ev_2BmKp0d6HXh8Do5EOJ9M3EpxbKs",
                "name": "rules engine updated",
                "description": "Event fired when enabling / disabling Rules Engine. Event triggers: 1. . Trigger on all sources. View in Avo: https://www.avo.app/schemas/Tv1qPI4Ij3B6hkVof2lK/events/QBAehpxbR9/trigger/-x6iKTZ2S",
                "version": "3-0-0",
                "rules": {
                    "type": "object",
                    "$schema": "http://json-schema.org/draft-06/schema#",
                    "required": [
                        "properties"
                    ],
                    "properties": {
                        "properties": {
                            "type": "object",
                            "required": [
                                "attributes_type",
                                "attributes_updated_location",
                                "attributes_stored_location",
                                "method",
                                "subject",
                                "timestamp",
                                "action",
                                "source"
                            ],
                            "properties": {
                                "action": {
                                    "type": "string",
                                    "description": "the action taken for the Rules Engine rule"
                                },
                                "method": {
                                    "type": "string",
                                    "description": "Where the event for Rules Engine was invoked from eg: \\\"ui\\\" / \\\"internal\\\""
                                },
                                "source": {
                                    "type": "string",
                                    "description": "source of the event"
                                },
                                "subject": {
                                    "type": "string",
                                    "description": "subject of the event eg: \\\"rule\\\""
                                },
                                "timestamp": {
                                    "type": "string",
                                    "description": "time at which the Rules Engine was updated"
                                },
                                "company_uuid": {
                                    "type": [
                                        "string",
                                        "null"
                                    ],
                                    "description": "uuid of the company associated with the order"
                                },
                                "merchant_uuid": {
                                    "type": [
                                        "string",
                                        "null"
                                    ],
                                    "description": "uuid of the merchant associated"
                                },
                                "attributes_type": {
                                    "type": "string",
                                    "description": "State of the Rules Engine for a Merchant or company - enabled / disabled"
                                },
                                "attributes_stored_location": {
                                    "type": "string",
                                    "description": "The type of Rules Engine enabled/disabled (\\\"store\\\" OR \\\"company\\\")"
                                },
                                "attributes_updated_location": {
                                    "type": "string",
                                    "description": "The context in which the Rules Engine was enabled/disabled"
                                }
                            },
                            "additionalProperties": false
                        }
                    }
                }
            },
            {
                "id": "ev_2DSlKLwzsoeqI16IWMWW9f7Taz8",
                "name": "Label(s) cancelled",
                "description": "Triggered the label for an order is cancelled through the 'Ready to ship' screen. Event triggers: 1. . Trigger on all sources. View in Avo: https://www.avo.app/schemas/Tv1qPI4Ij3B6hkVof2lK/events/j5yPd5s-ES/trigger/3vsl73LTD",
                "version": "1-0-0",
                "rules": {
                    "type": "object",
                    "$schema": "http://json-schema.org/draft-06/schema#",
                    "required": [
                        "properties"
                    ],
                    "properties": {
                        "properties": {
                            "type": "object",
                            "required": [
                                "order_deleted"
                            ],
                            "properties": {
                                "is_bulk": {
                                    "type": [
                                        "boolean",
                                        "null"
                                    ],
                                    "description": "Was this event trigger by a bulk action. E.g. Selecting 20 orders at once and confirming them together."
                                },
                                "bulk_count": {
                                    "type": [
                                        "number",
                                        "null"
                                    ],
                                    "multipleOf": 1,
                                    "description": "Number of orders included in the bulk operation"
                                },
                                "order_deleted": {
                                    "type": "boolean",
                                    "description": "Was the order also deleted as part of this action "
                                },
                                "tracking_number": {
                                    "description": ""
                                }
                            },
                            "additionalProperties": false
                        }
                    }
                }
            },
            {
                "id": "ev_2E9jXIbwKFcsn9yuxrFqthEOHcM",
                "name": "rule evaluated",
                "description": "Event fired when rules are being tested against an order",
                "version": "2-0-0",
                "rules": {
                    "type": "object",
                    "$schema": "http://json-schema.org/draft-06/schema#",
                    "required": [
                        "properties"
                    ],
                    "properties": {
                        "properties": {
                            "type": "object",
                            "required": [
                                "attributes_slug",
                                "attributes_name",
                                "attributes_order_tracking_number",
                                "attributes_stored_location",
                                "attributes_action",
                                "attributes_value",
                                "attributes_statements",
                                "attributes_evaluation",
                                "method",
                                "source",
                                "action",
                                "subject"
                            ],
                            "properties": {
                                "action": {
                                    "type": "string",
                                    "description": "the action taken for the Rules Engine rule"
                                },
                                "method": {
                                    "type": "string",
                                    "description": "Where the event for Rules Engine was invoked from eg: \\\"ui\\\" / \\\"internal\\\""
                                },
                                "source": {
                                    "type": "string",
                                    "description": "source of the event"
                                },
                                "subject": {
                                    "type": "string",
                                    "description": "subject of the event eg: \\\"rule\\\""
                                },
                                "company_uuid": {
                                    "type": [
                                        "string",
                                        "null"
                                    ],
                                    "description": "uuid of the company associated with the order"
                                },
                                "merchant_uuid": {
                                    "type": [
                                        "string",
                                        "null"
                                    ],
                                    "description": "uuid of the merchant associated"
                                },
                                "attributes_name": {
                                    "type": "string",
                                    "description": "name "
                                },
                                "attributes_slug": {
                                    "type": "string",
                                    "description": "Slug generated for the updated event"
                                },
                                "attributes_value": {
                                    "type": "array",
                                    "items": {
                                        "type": "number",
                                        "multipleOf": 1
                                    },
                                    "description": "ids of the carriers affected by the rule"
                                },
                                "attributes_action": {
                                    "type": "string",
                                    "description": "action of the  rule eg: \\\"do not allocate\\\""
                                },
                                "attributes_evaluation": {
                                    "type": "boolean",
                                    "description": "true if the rule has affected the order"
                                },
                                "attributes_statements": {
                                    "type": "array",
                                    "items": {
                                        "type": "string"
                                    },
                                    "description": "all statements/conditions within the rule"
                                },
                                "attributes_stored_location": {
                                    "type": "string",
                                    "description": "The type of Rules Engine enabled/disabled (\\\"store\\\" OR \\\"company\\\")"
                                },
                                "attributes_order_tracking_number": {
                                    "type": "string",
                                    "description": "tracking number of the order in which rules are being evaluated for"
                                }
                            },
                            "additionalProperties": false
                        }
                    }
                }
            },
            {
                "id": "ev_2E9jXDmRLjChTmsnviJUKPIHKcB",
                "name": "rule updated",
                "description": "Fired when a rule is added, modified or deleted",
                "version": "3-0-0",
                "rules": {
                    "type": "object",
                    "$schema": "http://json-schema.org/draft-06/schema#",
                    "required": [
                        "properties"
                    ],
                    "properties": {
                        "properties": {
                            "type": "object",
                            "required": [
                                "subject",
                                "action",
                                "source",
                                "method",
                                "attributes_stored_location",
                                "attributes_updated_location",
                                "attributes_type",
                                "attributes_slug",
                                "attributes_name",
                                "attributes_action",
                                "attributes_value",
                                "attributes_statements"
                            ],
                            "properties": {
                                "action": {
                                    "type": "string",
                                    "description": "the action taken for the Rules Engine rule"
                                },
                                "method": {
                                    "type": "string",
                                    "description": "Where the event for Rules Engine was invoked from eg: \\\"ui\\\" / \\\"internal\\\""
                                },
                                "source": {
                                    "type": "string",
                                    "description": "source of the event"
                                },
                                "subject": {
                                    "type": "string",
                                    "description": "subject of the event eg: \\\"rule\\\""
                                },
                                "company_uuid": {
                                    "type": [
                                        "string",
                                        "null"
                                    ],
                                    "description": "uuid of the company associated with the order"
                                },
                                "merchant_uuids": {
                                    "type": "array",
                                    "items": {
                                        "type": [
                                            "string",
                                            "null"
                                        ]
                                    },
                                    "description": "uuid of the merchant associated with the order"
                                },
                                "attributes_name": {
                                    "type": "string",
                                    "description": "name "
                                },
                                "attributes_slug": {
                                    "type": "string",
                                    "description": "Slug generated for the updated event"
                                },
                                "attributes_type": {
                                    "type": "string",
                                    "description": "State of the Rules Engine for a Merchant or company - enabled / disabled"
                                },
                                "attributes_value": {
                                    "type": "array",
                                    "items": {
                                        "type": "number",
                                        "multipleOf": 1
                                    },
                                    "description": "ids of the carriers affected by the rule"
                                },
                                "attributes_action": {
                                    "type": "string",
                                    "description": "action of the  rule eg: \\\"do not allocate\\\""
                                },
                                "attributes_statements": {
                                    "type": "array",
                                    "items": {
                                        "type": "string"
                                    },
                                    "description": "all statements/conditions within the rule"
                                },
                                "attributes_stored_location": {
                                    "type": "string",
                                    "description": "The type of Rules Engine enabled/disabled (\\\"store\\\" OR \\\"company\\\")"
                                },
                                "attributes_updated_location": {
                                    "type": "string",
                                    "description": "The context in which the Rules Engine was enabled/disabled"
                                }
                            },
                            "additionalProperties": false
                        }
                    }
                }
            },
            {
                "id": "ev_2HCkyla9Ma3qWrNRwGGW3wMEAIR",
                "name": "FE Order added",
                "description": "Tracking when an order has been successfully added. Event triggers: 1. When the 'Add order' button in the Add new order modal has been clicked and is successful. Trigger on all sources. View in Avo: https://www.avo.app/schemas/Tv1qPI4Ij3B6hkVof2lK/events/TuFG_xQH5/trigger/S1HwRF494",
                "version": "2-0-0",
                "rules": {
                    "type": "object",
                    "$schema": "http://json-schema.org/draft-06/schema#",
                    "required": [],
                    "properties": {}
                }
            },
            {
                "id": "ev_2HL1Pd3X1deIfesgdqwlfyspePw",
                "name": "FE Trial modal dismiss",
                "description": "To drive Appcues checklist; show checklist only after the modal has been dismissed. Event triggers: 1. Triggers when the 'Let's start' button is clicked. Trigger on all sources. View in Avo: https://www.avo.app/schemas/Tv1qPI4Ij3B6hkVof2lK/events/lodLIS4Rpm/trigger/rl-fVX3b_",
                "version": "2-0-0",
                "rules": {
                    "type": "object",
                    "$schema": "http://json-schema.org/draft-06/schema#",
                    "required": [],
                    "properties": {}
                }
            },
            {
                "id": "ev_2M2AkESBSSLQi81uF234yJ8iV8V",
                "name": "Tiered transit protection settings saved",
                "description": "Event triggered when customer selects the price range to be covered by transit protection. Event triggers: 1. When customer clicks save button under the ‘Select order value you want to cover’. Trigger on all sources. View in Avo: https://www.avo.app/schemas/Tv1qPI4Ij3B6hkVof2lK/events/K-RwwwxMMT/trigger/1ITgaIR36",
                "version": "1-0-0",
                "rules": {
                    "type": "object",
                    "$schema": "http://json-schema.org/draft-06/schema#",
                    "required": [
                        "properties"
                    ],
                    "properties": {
                        "properties": {
                            "type": "object",
                            "required": [
                                "tiered_price_range",
                                "merchant_id",
                                "user_id",
                                "tp_tiered_pricing_enabled",
                                "tp_carrier_preferences"
                            ],
                            "properties": {
                                "user_id": {
                                    "type": "string",
                                    "description": "The unique user identifier"
                                },
                                "store_name": {
                                    "description": ""
                                },
                                "merchant_id": {
                                    "type": "string",
                                    "description": "The ID associated with Shippit's merchant UUID"
                                },
                                "tiered_price_range": {
                                    "type": "array",
                                    "items": {
                                        "type": "string"
                                    },
                                    "description": "This is the declared order retail value for which a merchant wants to protect with our TP warranty product. There are 4 tiered pricing options to select from; 1. Up to $100AUD, 2. $101 to $1500AUD, 3. $1500 to $5000 4. $5000 to $10,000"
                                },
                                "tp_carrier_preferences": {
                                    "type": "array",
                                    "items": {
                                        "type": "string"
                                    },
                                    "description": "Merchant selects carrier/s that they want to opt out of Transit Protection"
                                },
                                "tp_tiered_pricing_enabled": {
                                    "type": "boolean",
                                    "description": "Triggered when merchant activates or deactivates transit protection via the tiered pricing landing page"
                                }
                            },
                            "additionalProperties": false
                        }
                    }
                }
            }
        ]
    },
    "create_time": "2022-04-12T03:52:45.673Z",
    "update_time": "2023-09-22T02:16:04.566Z"
} 
}

/**
 * @param {*} tpId
 * @param {*} tpVersion
 * @param {*} eventType
 * @param {*} eventName
 * @param {*} workspaceId
 * @returns {Object}
 *
 * Gets the event schema.
 */
async function getEventSchema(tpId, tpVersion, eventType, eventName, workspaceId) {
  try {
    let eventSchema;
    console.log("TP")
    const tp =  getTrackingPlan(tpId, tpVersion, workspaceId);

    if (Object.hasOwn(tp, 'events')) {
      const ev = tp.events.find((e) => e.name === eventName && e.eventType === eventType);
      return ev?.rules;
    }

    if (eventType !== 'track') {
      if (Object.prototype.hasOwnProperty.call(tp.rules, eventType)) {
        eventSchema = tp.rules[eventType];
      }
    } else if (Object.prototype.hasOwnProperty.call(tp.rules, 'events')) {
      const { events } = tp.rules;
      for (const event of events) {
        // eventName will be unique
        if (event.name === eventName) {
          eventSchema = event.rules;
          break;
        }
      }
    }
    return eventSchema;
  } catch (error) {
    logger.info(`Failed during eventSchema fetch : ${JSON.stringify(error)}`);
    stats.increment('get_eventSchema_error');
    throw error;
  }
}

module.exports = {
  getEventSchema,
  getTrackingPlan,
};
