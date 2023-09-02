jest.mock("node-fetch");

const fetch = require("node-fetch", () => jest.fn());
const {
  getEventSchema,
  getTrackingPlan
} = require("../../src/util/trackingPlan");
const { validate } = require("../../src/util/eventValidation");

const trackingPlan = {
  rules: {
    events: [
      {
        id: "ev_22HzyIUtuhfoI80iDfAgf47GHpw",
        name: "Product clicked",
        description: "Fired when an product is clicked.",
        version: "1-0-0",
        rules: {
          type: "object",
          $schema: "http://json-schema.org/draft-07/schema#",
          required: ["properties"],
          properties: {
            properties: {
              $schema: "http://json-schema.org/draft-07/schema#",
              additionalProperties: false,
              properties: {
                email: {
                  type: ["string"]
                },
                name: {
                  type: ["string"]
                },
                prop_float: {
                  type: ["number"]
                },
                prop_integer: {
                  type: ["number"]
                },
                revenue: {
                  type: ["number"]
                }
              },
              type: "object",
              required: [
                "email",
                "name",
                "prop_float",
                "prop_integer",
                "revenue"
              ],
              allOf: [
                {
                  properties: {
                    prop_integer: {
                      const: 2
                    },
                    prop_float: {
                      const: 2.3
                    }
                  }
                }
              ]
            }
          }
        }
      },
      {
        id: "ev_draft_4",
        name: "Product clicked draft 4",
        description: "Fired when an product is clicked.",
        version: "1-0-0",
        rules: {
          type: "object",
          $schema: "http://json-schema.org/draft-04/schema#",
          required: ["properties"],
          properties: {
            properties: {
              $schema: "http://json-schema.org/draft-04/schema#",
              additionalProperties: true,
              properties: {
                email: {
                  type: ["string"]
                },
                name: {
                  type: ["string"]
                },
                prop_float: {
                  type: ["number"]
                },
                prop_integer: {
                  type: ["number"]
                },
                revenue: {
                  type: ["number"]
                },
                dateString: {
                  type: ["string"],
                  format: "date-time"
                }
              },
              type: "object",
              required: [
                "email",
                "name",
                "prop_float",
                "prop_integer",
                "revenue"
              ]
            }
          }
        }
      },
      {
        id: "ev_draft_6",
        name: "Product clicked draft 6",
        description: "Fired when an product is clicked.",
        version: "1-0-0",
        rules: {
          type: "object",
          $schema: "http://json-schema.org/draft-06/schema#",
          required: ["properties"],
          properties: {
            properties: {
              $schema: "http://json-schema.org/draft-06/schema#",
              additionalProperties: true,
              properties: {
                email: {
                  type: ["string"]
                },
                name: {
                  type: ["string"]
                },
                prop_float: {
                  type: ["number"]
                },
                prop_integer: {
                  type: ["number"]
                },
                revenue: {
                  type: ["integer"]
                },
                dateString: {
                  type: ["string"],
                  format: "date-time"
                }
              },
              type: "object",
              required: [
                "email",
                "name",
                "prop_float",
                "prop_integer",
                "revenue"
              ]
            }
          }
        }
      },
      {
        id: "ev_draft_7",
        name: "Product clicked draft 7",
        description: "Fired when an product is clicked.",
        version: "1-0-0",
        rules: {
          type: "object",
          $schema: "http://json-schema.org/draft-07/schema#",
          required: ["properties"],
          properties: {
            properties: {
              $schema: "http://json-schema.org/draft-07/schema#",
              additionalProperties: true,
              properties: {
                email: {
                  type: ["string"]
                },
                name: {
                  type: ["string"]
                },
                prop_float: {
                  type: ["number"]
                },
                prop_integer: {
                  type: ["number"]
                },
                revenue: {
                  type: ["integer", "number"],
                  if: {
                    type: "number"
                  },
                  then: {
                    type: "number",
                    maximum: 4.0
                  }
                },
                dateString: {
                  type: ["string"],
                  format: "date-time"
                }
              },
              type: "object",
              required: ["email", "name", "prop_float", "prop_integer"]
            }
          }
        }
      },
      {
        id: "ev_draft_2019",
        name: "Product clicked draft 2019",
        description: "Fired when an product is clicked.",
        version: "1-0-0",
        rules: {
          type: "object",
          $schema: "https://json-schema.org/draft/2019-09/schema",
          required: ["properties"],
          properties: {
            properties: {
              $schema: "https://json-schema.org/2019-09/schema",
              additionalProperties: true,
              properties: {
                email: {
                  type: ["string"]
                },
                name: {
                  type: ["string"]
                },
                prop_float: {
                  type: ["number"]
                },
                prop_integer: {
                  type: ["number"]
                },
                props: {
                  type: "array",
                  contains: {
                    type: ["number"]
                  },
                  minContains: 1,
                  maxContains: 2
                },
                revenue: {
                  type: ["number"]
                },
                dateString: {
                  type: ["string"],
                  format: "date-time"
                }
              },
              type: "object",
              required: [
                "email",
                "name",
                "prop_float",
                "prop_integer",
                "revenue"
              ]
            }
          }
        }
      },    
    ]
  },
  name: "workspaces/dummy_workspace_id/tracking-plans/dummy_tracking_plan_id",
  display_name: "Demo Tracking Plan",
  version: 1,
  create_time: "2021-12-14T19:19:13.666Z",
  update_time: "2021-12-15T13:29:59.272Z"
};

const trackingPlan2 = {
  rules: {
    identify: {
      type: "object",
      $schema: "http://json-schema.org/draft-07/schema#",
      required: ["traits"],
      properties: {
        traits: {
            properties: {
              id: {
                type: ['string']
              }
            },
            required: ['id'],
            type: "object",
            additionalProperties: false
        }
      },
    }
  },
  group: {
    type: "object",
    $schema: "http://json-schema.org/draft-07/schema#",
    required: ["traits"],
    properties: {
      traits: {
          properties: {
            id: {
              type: ['string']
            }
          },
          required: ['id'],
          type: "object",
          additionalProperties: false
      }
    },
  },
  page: {
    type: "object",
    $schema: "http://json-schema.org/draft-07/schema#",
    required: ["properties"],
    properties: {
      properties: {
          properties: {
            id: {
              type: ['string']
            }
          },
          required: ['id'],
          type: "object",
          additionalProperties: false
      }
    },
  },
  screen: {
    type: "object",
    $schema: "http://json-schema.org/draft-07/schema#",
    required: ["properties"],
    properties: {
      properties: {
          properties: {
            id: {
              type: ['string']
            }
          },
          required: ['id'],
          type: "object",
          additionalProperties: false
      }
    },
  },
}

const constructEventToValidate = (eventName, dateStr='2020-06-08T01:00:00') => {
  const ev = {
    metadata: {
      trackingPlanId: "dummy_tracking_plan_id",
      trackingPlanVersion: "dummy_version",
      workspaceId: "dummy_workspace_id",
      sourceTpConfig: {
        track: {}
      }
    },
    message: {
      type: "track",
      userId: "user-demo",
      event: eventName,
      properties: {
        name: "Rubik's Cube",
        revenue: 4.99,
        prop_integer: 2,
        prop_float: 2.3,
        email: "demo@rudderstack.com",
        props: ["string", 1, 2, 3],
        dateString: dateStr
      },
      context: {
        ip: "14.5.67.21"
      },
      timestamp: "2020-02-02T00:23:09.544Z"
    }
  };
  return ev;
};

const sampleForumTrackingPlan = {
  rules: {
    events: [
      {
        id: "ev_complex_draft_7",
        name: "Post Created - Draft 7",
        description: "Fired when a post is created.",
        version: "1-0-0",
        rules: {
          type: "object",
          $schema: "http://json-schema.org/draft-07/schema#",
          required: ["properties"],
          properties: {
            properties: {
              $schema: "http://json-schema.org/draft-07/schema#",
              additionalProperties: false,
              properties: {
                flairs: {
                  type: ["array", "object"],
                  items: {
                    type: ["string", "object"],
                    properties: {
                      name: {
                        type: "string"
                      }
                    },
                    required: ["name"]
                  },
                  properties: {
                    name: {
                      type: "array",
                      items: {
                        type: "string"
                      }
                    }
                  },
                  required: ["name"],
                  additionalProperties: false
                },
                title: {
                  type: ["string"]
                },
                body: {
                  type: ["string"]
                },
                post_comment: {
                  type: ["string", "null"]
                }
              },
              type: "object",
              required: ["flairs", "title", "body"]
            }
          }
        }
      },
    ]
  },
  name: "workspaces/dummy_workspace_id/tracking-plans/dummy_tracking_plan_id2",
  display_name: "Reddit Tracking Plan - Draft",
  version: 1,
  create_time: "2021-12-14T19:19:13.666Z",
  update_time: "2021-12-15T13:29:59.272Z"
}

const sampleForumValidationEvents = {
  complexEvent1: { 
     metadata: {
      trackingPlanId: "dummy_tracking_plan_id2",
      trackingPlanVersion: "dummy_version",
      workspaceId: "dummy_workspace_id",
      sourceTpConfig: {
        track: {}
      }
    },
    message: {
      type: "track",
      userId: "user-demo",
      event: "Post Created - Draft 7",
      properties: {
        flairs: ["Current Events", "Geopolitics"],
        title: "Some Post",
        body: "Some Body..."
      },
      context: {
        ip: "14.5.67.21"
      },
      timestamp: "2020-02-02T00:23:09.544Z"
    }
  },
  complexEvent2: { 
    metadata: {
      trackingPlanId: "dummy_tracking_plan_id2",
      trackingPlanVersion: "dummy_version",
      workspaceId: "dummy_workspace_id",
      sourceTpConfig: {
        track: {}
      }
    },
    message: {
      type: "track",
      userId: "user-demo",
      event: "Post Created - Draft 7",
      properties: {
        flairs: { "name": ["Current Events", "Geopolitics"] },
        title: "Some Post",
        body: "Some Body...",
        post_comment: null
      },
      context: {
        ip: "14.5.67.21"
      },
      timestamp: "2020-02-02T00:23:09.544Z"
    }
  },
  complexEvent3: { 
    metadata: {
      trackingPlanId: "dummy_tracking_plan_id2",
      trackingPlanVersion: "dummy_version",
      workspaceId: "dummy_workspace_id",
      sourceTpConfig: {
        track: {}
      }
    },
    message: {
      type: "track",
      userId: "user-demo",
      event: "Post Created - Draft 7",
      properties: {
        flairs: [{ name: "Current Events" }, { name: "Geopolitics" }],
        title: "Some Post",
        body: "Some Body...",
        post_comment: "More info here..."
      },
      context: {
        ip: "14.5.67.21"
      },
      timestamp: "2020-02-02T00:23:09.544Z"
    }
  },
  complexEvent4: { 
    metadata: {
      trackingPlanId: "dummy_tracking_plan_id2",
      trackingPlanVersion: "dummy_version",
      workspaceId: "dummy_workspace_id",
      sourceTpConfig: {
        track: {}
      }
    },
    message: {
      type: "track",
      userId: "user-demo",
      event: "Post Created - Draft 7",
      properties: {
        title: "Some Post",
        body: "Some Body...",
        post_comment: "More info here..."
      },
      context: {
        ip: "14.5.67.21"
      },
      timestamp: "2020-02-02T00:23:09.544Z"
    }
  },
  complexEvent5: { 
    metadata: {
      trackingPlanId: "dummy_tracking_plan_id2",
      trackingPlanVersion: "dummy_version",
      workspaceId: "dummy_workspace_id",
      sourceTpConfig: {
        track: {}
      }
    },
    message: {
      type: "track",
      userId: "user-demo",
      event: "Post Created - Draft 7",
      properties: {
        flairs: [],
        title: "Some Post",
        body: "Some Body...",
        post_comment: 1
      },
      context: {
        ip: "14.5.67.21"
      },
      timestamp: "2020-02-02T00:23:09.544Z"
    }
  },
  complexEvent6: { 
    metadata: {
      trackingPlanId: "dummy_tracking_plan_id2",
      trackingPlanVersion: "dummy_version",
      workspaceId: "dummy_workspace_id",
      sourceTpConfig: {
        track: {}
      }
    },
    message: {
      type: "track",
      userId: "user-demo",
      event: "Post Created - Draft 7",
      properties: {
        flairs: [],
        title: "Some Post",
        body: "Some Body...",
        new_property: 1,
      },
      context: {
        ip: "14.5.67.21"
      },
      timestamp: "2020-02-02T00:23:09.544Z"
    }
  }
}

const eventValidationTestCases = [
  {
    testCase: "draft 4",
    event: constructEventToValidate("Product clicked draft 4"),
    trackingPlan,
    output: []
  },
  {
    testCase: "draft 6",
    event: constructEventToValidate("Product clicked draft 6"),
    trackingPlan,
    output: [
      {
        type: "Datatype-Mismatch",
        message: "must be integer",
        meta: {
          instancePath: "/properties/revenue",
          schemaPath: "#/properties/properties/properties/revenue/type"
        }
      }
    ]
  },
  {
    testCase: "draft 7",
    event: constructEventToValidate("Product clicked draft 7"),
    trackingPlan,
    output: [
      {
        type: "Unknown-Violation",
        message: "must be <= 4",
        meta: {
          instancePath: "/properties/revenue",
          schemaPath: "#/properties/properties/properties/revenue/then/maximum"
        }
      },
      {
        type: "Unknown-Violation",
        message: 'must match "then" schema',
        meta: {
          instancePath: "/properties/revenue",
          schemaPath: "#/properties/properties/properties/revenue/if"
        }
      }
    ]
  },
  {
    testCase: "draft 2019",
    event: constructEventToValidate("Product clicked draft 2019"),
    trackingPlan,
    output: [
      {
        type: "Datatype-Mismatch",
        message: "must be number",
        meta: {
          instancePath: "/properties/props/0",
          schemaPath: "#/properties/properties/properties/props/contains/type"
        }
      },
      {
        type: "Unknown-Violation",
        message: "must contain at least 1 and no more than 2 valid item(s)",
        meta: {
          instancePath: "/properties/props",
          schemaPath: "#/properties/properties/properties/props/contains"
        }
      }
    ]
  },
  {
    testCase: "draft 4 - wrong date-time",
    event: constructEventToValidate("Product clicked draft 4", "2022-06-08"),
    trackingPlan,
    output: [
      {
        message: "must match format \"date-time\"",
        meta: {
          instacePath: "/properties/dateString",
          schemaPath: "#/properties/properties/properties/dateString/format",
        },
        type: "Unknown-Violation",
      }
    ]
  },
  {
    testCase: "draft 7",
    event: sampleForumValidationEvents.complexEvent1,
    trackingPlan: sampleForumTrackingPlan,
    output: []
  },
  {
    testCase: "draft 7",
    event: sampleForumValidationEvents.complexEvent2,
    trackingPlan: sampleForumTrackingPlan,
    output: []
  },
  {
    testCase: "draft 7",
    event: sampleForumValidationEvents.complexEvent3,
    trackingPlan: sampleForumTrackingPlan,
    output: []
  },
  {
    testCase: "draft 7 - missing flair",
    event: sampleForumValidationEvents.complexEvent4,
    trackingPlan: sampleForumTrackingPlan,
    output: [
      {
        type: "Required-Missing",
        message: "must have required property 'flairs'",
        property: "flairs",
        meta: {
            instacePath: "/properties",
            schemaPath: "#/properties/properties/required",
        }
      }
    ]
  },
  {
    testCase: "draft 7 -  bad type for post_comment",
    event: sampleForumValidationEvents.complexEvent5,
    trackingPlan: sampleForumTrackingPlan,
    output: [
      {
        "type": "Datatype-Mismatch",
        "message": "must be string,null",
        "meta": {
            "instacePath": "/properties/post_comment",
            "schemaPath": "#/properties/properties/properties/post_comment/type"
        }
      }
    ]
  },
  {
    testCase: "draft 7 -  additional property",
    event: sampleForumValidationEvents.complexEvent6,
    trackingPlan: sampleForumTrackingPlan,
    output: [
      {
        "type": "Additional-Properties",
        "message": "must NOT have additional properties 'new_property'",
        "property": "new_property",
        "meta": {
          "instacePath": "/properties",
          "schemaPath": "#/properties/properties/additionalProperties",
        }
      }
    ]
  }
];

const eventSchemaTestCases = [
  {
    testCase: "Page is not part of Tracking Plan",
    event: {
      metadata: {
        trackingPlanId: "dummy_tracking_plan_id",
        trackingPlanVersion: "dummy_version",
        workspaceId: "dummy_workspace_id"
      },
      message: {
        type: "page",
        userId: "user12345",
        anonymousId: "anon-id-new",
        name: "Page View",
        properties: {
          title: "Home",
          path: "/"
        },
        context: {
          ip: "14.5.67.21",
          library: {
            name: "http"
          }
        },
        timestamp: "2020-02-02T00:23:09.544Z"
      }
    },
    trackingPlan,
    output: {
      eventSchema: undefined
    }
  },
  {
    testCase: "Page is a part of Tracking Plan",
    event: {
      metadata: {
        trackingPlanId: "dummy_tracking_plan_id",
        trackingPlanVersion: "dummy_version",
        workspaceId: "dummy_workspace_id"
      },
      message: {
        properties: {
          id: 'xyz'
        },
        timestamp: "2020-02-02T00:23:09.544Z"
      }
    },
    trackingPlan2,
    output: {
      eventSchema: undefined
    }
  },
  {
    testCase: "Screen is not part of Tracking Plan",
    event: {
      metadata: {
        trackingPlanId: "dummy_tracking_plan_id",
        trackingPlanVersion: "dummy_version",
        workspaceId: "dummy_workspace_id"
      },
      message: {
        type: "screen",
        userId: "user12345",
        anonymousId: "anon-id-new",
        name: "Screen View",
        properties: {
          id: "5"
        },
        context: {
          ip: "14.5.67.21",
          library: {
            name: "http"
          }
        },
        timestamp: "2020-02-02T00:23:09.544Z"
      }
    },
    trackingPlan,
    output: {
      eventSchema: undefined
    }
  },
  {
    testCase: "Screen is a part of Tracking Plan",
    event: {
      metadata: {
        trackingPlanId: "dummy_tracking_plan_id",
        trackingPlanVersion: "dummy_version",
        workspaceId: "dummy_workspace_id"
      },
      message: {
        type: "screen",
        userId: "user12345",
        anonymousId: "anon-id-new",
        name: "Screen View",
        properties: {
          id: "5"
        },
        context: {
          ip: "14.5.67.21",
          library: {
            name: "http"
          }
        },
        timestamp: "2020-02-02T00:23:09.544Z"
      }
    },
    trackingPlan2,
    output: {
      eventSchema: undefined
    }
  },
  {
    testCase: "Alias Event is not Supported",
    event: {
      metadata: {
        trackingPlanId: "dummy_tracking_plan_id",
        trackingPlanVersion: "dummy_version",
        workspaceId: "dummy_workspace_id"
      },
      message: {
        type: "alias",
        userId: "user123",
        previousId: "user12345",
        context: {
          traits: {
            trait1: "new-val"
          },
          ip: "14.5.67.21",
          library: {
            name: "http"
          }
        },
        timestamp: "2020-01-21T00:21:34.208Z"
      }
    },
    trackingPlan,
    output: {
      eventSchema: undefined
    }
  },
  {
    testCase: "Group is not part of Tracking Plan",
    event: {
      metadata: {
        trackingPlanId: "dummy_tracking_plan_id",
        trackingPlanVersion: "dummy_version",
        workspaceId: "dummy_workspace_id"
      },
      message: {
        type: "group",
        userId: "user12345",
        groupId: "group1",
        traits: {
          name: "Company",
          industry: "Industry",
          employees: 123
        },
        context: {
          traits: {
            trait1: "new-val"
          },
          ip: "14.5.67.21",
          library: {
            name: "http"
          }
        },
        timestamp: "2020-01-21T00:21:34.208Z"
      }
    },
    trackingPlan,
    output: {
      eventSchema: undefined
    }
  },
  {
    testCase: "Identify is not part of Tracking Plan",
    event: {
      metadata: {
        trackingPlanId: "dummy_tracking_plan_id",
        trackingPlanVersion: "dummy_version",
        workspaceId: "dummy_workspace_id"
      },
      message: {
        type: "identify",
        userId: "user12345",
        anonymousId: "anon-id-new",
        context: {
          traits: {
            trait1: "new-val"
          },
          ip: "14.5.67.21",
          library: {
            name: "http"
          }
        },
        timestamp: "2020-02-02T00:23:09.544Z"
      }
    },
    trackingPlan,
    output: {
      eventSchema: undefined
    }
  },
  {
    testCase: "Track is not part of Tracking Plan",
    event: {
      metadata: {
        trackingPlanId: "dummy_tracking_plan_id",
        trackingPlanVersion: "dummy_version",
        workspaceId: "dummy_workspace_id"
      },
      message: {
        type: "track",
        userId: "user-demo",
        event: "New Product clicked",
        properties: {
          name: "Rubik's Cube",
          revenue: 4.99,
          prop_integer: 2,
          prop_float: 2.3,
          email: "demo@rudderstack.com"
        },
        context: {
          ip: "14.5.67.21"
        },
        timestamp: "2020-02-02T00:23:09.544Z"
      }
    },
    trackingPlan,
    output: {
      eventSchema: undefined
    }
  },
  {
    testCase: "Track is part of Tracking Plan",
    event: {
      metadata: {
        trackingPlanId: "dummy_tracking_plan_id",
        trackingPlanVersion: "dummy_version",
        workspaceId: "dummy_workspace_id"
      },
      message: {
        type: "track",
        userId: "user-demo",
        event: "Product clicked",
        properties: {
          name: "Rubik's Cube",
          revenue: 4.99,
          prop_integer: 2,
          prop_float: 2.3,
          email: "demo@rudderstack.com"
        },
        context: {
          ip: "14.5.67.21"
        },
        timestamp: "2020-02-02T00:23:09.544Z"
      }
    },
    trackingPlan,
    output: {
      eventSchema: trackingPlan.rules.events[0].rules
    }
  }
];
const trackingPlanTestCases = [
  {
    testCase: "Should not use cache",
    event: {
      metadata: {
        trackingPlanId: "dummy_tracking_plan_id",
        trackingPlanVersion: "dummy_version",
        workspaceId: "dummy_workspace_id"
      }
    },
    trackingPlan,
    output: {
      trackingPlan
    }
  },
  {
    testCase: "Should use cache",
    event: {
      metadata: {
        trackingPlanId: "dummy_tracking_plan_id",
        trackingPlanVersion: "dummy_version",
        workspaceId: "dummy_workspace_id"
      }
    },
    trackingPlan: {},
    output: {
      trackingPlan
    }
  }
];

describe("Get Event Schema", () => {
  eventSchemaTestCases.forEach(testCase => {
    it(`should return correct schema`, async () => {
      fetch.mockResolvedValue({
        json: jest.fn().mockResolvedValue(testCase.trackingPlan),
        status: 200
      });
      const eventSchema = await getEventSchema(
        testCase.event.metadata.trackingPlanId,
        testCase.event.metadata.trackingPlanVersion,
        testCase.event.message.type,
        testCase.event.message.event,
        testCase.event.metadata.workspaceId
      );
      expect(eventSchema).toEqual(testCase.output.eventSchema);
    });
  });
});

describe("Validate Event against schema", () => {
  eventValidationTestCases.forEach(testCase => {
    it(`should return correct event validation`, async () => {
      fetch.mockResolvedValue({
        json: jest.fn().mockResolvedValue(testCase.trackingPlan),
        status: 200
      });
      const eventSchema = await validate(testCase.event);
      expect(eventSchema).toEqual(testCase.output);
    });
  });
});

describe("Get Tracking Plan", () => {
  trackingPlanTestCases.forEach(testCase => {
    it(`should return correct schema`, async () => {
      fetch.mockResolvedValue({
        json: jest.fn().mockResolvedValue(testCase.trackingPlan),
        status: 200
      });
      const trackingPlan = await getTrackingPlan(
        testCase.event.metadata.trackingPlanId,
        testCase.event.metadata.trackingPlanVersion,
        testCase.event.metadata.workspaceId
      );
      expect(trackingPlan).toEqual(testCase.output.trackingPlan);
    });
  });
});
