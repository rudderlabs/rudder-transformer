jest.mock("node-fetch");
const fetch = require("node-fetch", () => jest.fn());

const {
  isEventTypeSupported,
  handleValidation,
  violationTypes,
  handleValidationErrors
} = require("../../src/util/eventValidation");

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
      }
    ]
  },
  name: "workspaces/dummy_workspace_id/tracking-plans/dummy_tracking_plan_id",
  display_name: "Demo Tracking Plan",
  version: 1,
  create_time: "2021-12-14T19:19:13.666Z",
  update_time: "2021-12-15T13:29:59.272Z"
};

const newTrackingPlan = {
  name: "Demo Tracking Plan",
  version: 1,
  events: [
    {
      id: "ev_22HzyIUtuhfoI80iDfAgf47GHpw",
      name: "Product clicked new",
      eventType: "track",
      description: "Fired when an product is clicked.",
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
      id: "ev_22HzyIUtuhfoI80iDfAgf47GHpx",
      name: "",
      eventType: "group",
      rules: {
        type: "object",
        $schema: "http://json-schema.org/draft-07/schema#",
        required: ["traits"],
        properties: {
          traits: {
            additionalProperties: false,
            properties: {
              company: {
                type: ["string"]
              },
              org: {
                type: ["string"]
              },
            },
            type: "object",
            required: [
              "company",
            ]
          }
        }
      }
    }
  ],
  workspaceId: "dummy_workspace_id",
  createdAt: "2021-12-14T19:19:13.666Z",
  updatedAt: "2021-12-15T13:29:59.272Z"
};
const sourceTpConfig = {
  track: {
    allowUnplannedEvents: "true",
    unplannedProperties: "forward",
    anyOtherViolation: "forward",
    propagateValidationErrors: "true",
    ajvOptions: {}
  },
  global: {
    allowUnplannedEvents: "false",
    unplannedProperties: "drop",
    anyOtherViolation: "drop",
    sendViolatedEventsTo: "procErrors",
    ajvOptions: {}
  }
};
const mergedTpConfig = {
  allowUnplannedEvents: "false",
  unplannedProperties: "drop",
  anyOtherViolation: "drop",
  sendViolatedEventsTo: "procErrors",
  ajvOptions: {}
};

const eventTypesTestCases = [
  {
    output: false
  },
  {
    eventType: undefined,
    output: false
  },
  {
    eventType: "unknown",
    output: false
  },
  {
    eventType: "identify",
    output: true
  },
  {
    eventType: "track",
    output: true
  },
  {
    eventType: "group",
    output: true
  },
  {
    eventType: "page",
    output: true
  },
  {
    eventType: "screen",
    output: true
  },
  {
    eventType: "alias",
    output: false
  }
];

const validationErrorsTestCases = [
  {
    test: "single violation with drop setting",
    metadata: {
      mergedTpConfig: {
        allowUnplannedEvents: "true",
        unplannedProperties: "forward",
        anyOtherViolation: "drop",
        sendViolatedEventsTo: "procErrors",
      },
    },
    validationErrors: [ { type: "Required-Missing" } ],
    output: true
  },
  {
    test: "single violation with drop setting",
    metadata: {
      mergedTpConfig: {
        allowUnplannedEvents: "true",
        unplannedProperties: "forward",
        anyOtherViolation: "forward",
        sendViolatedEventsTo: "procErrors",
      },
    },
    validationErrors: [ { type: "Datatype-Mismatch" } ],
    output: false
  },
  {
    test: "multiple violations with drop setting in one of them",
    metadata: {
      mergedTpConfig: {
        allowUnplannedEvents: "false",
        unplannedProperties: "forward",
        anyOtherViolation: "forward",
        sendViolatedEventsTo: "procErrors",
      },
    },
    validationErrors: [
      { type: "Datatype-Mismatch" },
      { type: "Unplanned-Event" },
      { type: "Additional-Properties" },
      { type: "Advance-Rules-Violation" }
    ],
    output: true
  },
  {
    test: "multiple violations with drop setting in one of them",
    metadata: {
      mergedTpConfig: {
        allowUnplannedEvents: "true",
        unplannedProperties: "drop",
        anyOtherViolation: "forward",
        sendViolatedEventsTo: "procErrors",
      },
    },
    validationErrors: [
      { type: "Datatype-Mismatch" },
      { type: "Unplanned-Event" },
      { type: "Additional-Properties" },
      { type: "Advance-Rules-Violation" }
    ],
    output: true
  },
  {
    test: "multiple violations with forward setting for all",
    metadata: {
      mergedTpConfig: {
        allowUnplannedEvents: "true",
        unplannedProperties: "forward",
        anyOtherViolation: "forward",
        sendViolatedEventsTo: "procErrors",
      },
    },
    validationErrors: [
      { type: "Datatype-Mismatch" },
      { type: "Unplanned-Event" },
      { type: "Additional-Properties" }
    ],
    output: false
  },
  {
    test: "multiple violations with drop setting in one of them and duplicate violation",
    metadata: {
      mergedTpConfig: {
        allowUnplannedEvents: "true",
        unplannedProperties: "drop",
        anyOtherViolation: "forward",
        sendViolatedEventsTo: "procErrors",
      },
    },
    validationErrors: [
      { type: "Datatype-Mismatch" },
      { type: "Additional-Properties" },
      { type: "Datatype-Mismatch" },
      { type: "Required-missing" },
    ],
    output: true
  }
];

const eventValidationTestCases = [
  {
    testCase: "Empty Source TP Config",
    event: {
      metadata: {
        trackingPlanId: "dummy_tracking_plan_id",
        trackingPlanVersion: "dummy_version",
        workspaceId: "dummy_workspace_id",
        mergedTpConfig
      }
    },
    trackingPlan,
    output: {
      dropEvent: false,
      violationType: "None"
    }
  },
  {
    testCase: "Empty Merged TP Config",
    event: {
      metadata: {
        trackingPlanId: "dummy_tracking_plan_id",
        trackingPlanVersion: "dummy_version",
        workspaceId: "dummy_workspace_id",
        sourceTpConfig
      }
    },
    trackingPlan,
    output: {
      dropEvent: false,
      violationType: "None"
    }
  },
  {
    testCase: "Empty Source and Merged TP Config",
    event: {
      metadata: {
        trackingPlanId: "dummy_tracking_plan_id",
        trackingPlanVersion: "dummy_version",
        workspaceId: "dummy_workspace_id"
      }
    },
    trackingPlan,
    output: {
      dropEvent: false,
      violationType: "None"
    }
  },
  {
    testCase: "Page Event is not Supported",
    event: {
      metadata: {
        trackingPlanId: "dummy_tracking_plan_id",
        trackingPlanVersion: "dummy_version",
        workspaceId: "dummy_workspace_id",
        mergedTpConfig,
        sourceTpConfig
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
      dropEvent: false,
      violationType: "None"
    }
  },
  {
    testCase: "Screen Event is not Supported",
    event: {
      metadata: {
        trackingPlanId: "dummy_tracking_plan_id",
        trackingPlanVersion: "dummy_version",
        workspaceId: "dummy_workspace_id",
        mergedTpConfig,
        sourceTpConfig
      },
      message: {
        type: "screen",
        userId: "user12345",
        anonymousId: "anon-id-new",
        name: "Screen View",
        properties: {
          prop1: "5"
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
      dropEvent: false,
      violationType: "None"
    }
  },
  {
    testCase: "Alias Event is not Supported",
    event: {
      metadata: {
        trackingPlanId: "dummy_tracking_plan_id",
        trackingPlanVersion: "dummy_version",
        workspaceId: "dummy_workspace_id",
        mergedTpConfig,
        sourceTpConfig
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
      dropEvent: false,
      violationType: "None"
    }
  },
  {
    testCase: "Group is not part of Tracking Plan",
    event: {
      metadata: {
        trackingPlanId: "dummy_tracking_plan_id",
        trackingPlanVersion: "dummy_version",
        workspaceId: "dummy_workspace_id",
        mergedTpConfig,
        sourceTpConfig
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
      dropEvent: false,
      violationType: "None"
    }
  },
  {
    testCase: "Identify is not part of Tracking Plan",
    event: {
      metadata: {
        trackingPlanId: "dummy_tracking_plan_id",
        trackingPlanVersion: "dummy_version",
        workspaceId: "dummy_workspace_id",
        mergedTpConfig,
        sourceTpConfig
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
      dropEvent: false,
      violationType: "None"
    }
  },
  {
    testCase:
      "Track is not part of Tracking Plan and allowUnplannedEvents is set to true",
    event: {
      metadata: {
        trackingPlanId: "dummy_tracking_plan_id",
        trackingPlanVersion: "dummy_version",
        workspaceId: "dummy_workspace_id",
        mergedTpConfig: {
          allowUnplannedEvents: "true",
          ajvOptions: {}
        },
        sourceTpConfig: {
          track: {
            allowUnplannedEvents: "true",
            ajvOptions: {}
          },
          global: {
            allowUnplannedEvents: "false",
            ajvOptions: {}
          }
        }
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
      dropEvent: false,
      violationType: "None"
    }
  },
  {
    testCase:
      "Track is not part of Tracking Plan and allowUnplannedEvents is set to false",
    event: {
      metadata: {
        trackingPlanId: "dummy_tracking_plan_id",
        trackingPlanVersion: "dummy_version",
        workspaceId: "dummy_workspace_id",
        mergedTpConfig: {
          allowUnplannedEvents: "false",
          ajvOptions: {}
        },
        sourceTpConfig: {
          track: {
            allowUnplannedEvents: "false",
            ajvOptions: {}
          },
          global: {
            allowUnplannedEvents: "true",
            ajvOptions: {}
          }
        }
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
      dropEvent: true,
      violationType: violationTypes.UnplannedEvent
    }
  },
  {
    testCase: "Track is part of Tracking Plan",
    event: {
      metadata: {
        trackingPlanId: "dummy_tracking_plan_id",
        trackingPlanVersion: "dummy_version",
        workspaceId: "dummy_workspace_id",
        mergedTpConfig,
        sourceTpConfig
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
      dropEvent: false,
      violationType: "None"
    }
  },
  {
    testCase:
      "Track is part of Tracking Plan and unplannedProperties is set to drop",
    event: {
      metadata: {
        trackingPlanId: "dummy_tracking_plan_id",
        trackingPlanVersion: "dummy_version",
        workspaceId: "dummy_workspace_id",
        mergedTpConfig: {
          unplannedProperties: "drop",
          ajvOptions: {}
        },
        sourceTpConfig: {
          track: {
            unplannedProperties: "drop",
            ajvOptions: {}
          },
          global: {
            unplannedProperties: "forward",
            ajvOptions: {}
          }
        }
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
          email: "demo@rudderstack.com",
          mobile: "999888777666"
        },
        context: {
          ip: "14.5.67.21"
        },
        timestamp: "2020-02-02T00:23:09.544Z"
      }
    },
    trackingPlan,
    output: {
      dropEvent: true,
      violationType: violationTypes.AdditionalProperties
    }
  },
  {
    testCase:
      "Track is part of Tracking Plan and unplannedProperties is set to forward",
    event: {
      metadata: {
        trackingPlanId: "dummy_tracking_plan_id",
        trackingPlanVersion: "dummy_version",
        workspaceId: "dummy_workspace_id",
        mergedTpConfig: {
          unplannedProperties: "forward",
          ajvOptions: {}
        },
        sourceTpConfig: {
          track: {
            unplannedProperties: "forward",
            ajvOptions: {}
          },
          global: {
            unplannedProperties: "forward",
            ajvOptions: {}
          }
        }
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
          email: "demo@rudderstack.com",
          mobile: "999888777666"
        },
        context: {
          ip: "14.5.67.21"
        },
        timestamp: "2020-02-02T00:23:09.544Z"
      }
    },
    trackingPlan,
    output: {
      dropEvent: false,
      violationType: "None"
    }
  },
  {
    testCase:
      "Track is part of Tracking Plan and anyOtherViolation[Required] is set to drop",
    event: {
      metadata: {
        trackingPlanId: "dummy_tracking_plan_id",
        trackingPlanVersion: "dummy_version",
        workspaceId: "dummy_workspace_id",
        mergedTpConfig: {
          anyOtherViolation: "drop",
          ajvOptions: {}
        },
        sourceTpConfig: {
          track: {
            anyOtherViolation: "drop",
            ajvOptions: {}
          },
          global: {
            anyOtherViolation: "forward",
            ajvOptions: {}
          }
        }
      },
      message: {
        type: "track",
        userId: "user-demo",
        event: "Product clicked",
        properties: {
          name: "Rubik's Cube",
          revenue: 4.99,
          prop_integer: 2,
          prop_float: 2.3
        },
        context: {
          ip: "14.5.67.21"
        },
        timestamp: "2020-02-02T00:23:09.544Z"
      }
    },
    trackingPlan,
    output: {
      dropEvent: true,
      violationType: violationTypes.RequiredMissing
    }
  },
  {
    testCase:
      "Track is part of Tracking Plan and anyOtherViolation[Required] is set to forward",
    event: {
      metadata: {
        trackingPlanId: "dummy_tracking_plan_id",
        trackingPlanVersion: "dummy_version",
        workspaceId: "dummy_workspace_id",
        mergedTpConfig: {
          anyOtherViolation: "forward",
          ajvOptions: {}
        },
        sourceTpConfig: {
          track: {
            anyOtherViolation: "forward",
            ajvOptions: {}
          },
          global: {
            anyOtherViolation: "forward",
            ajvOptions: {}
          }
        }
      },
      message: {
        type: "track",
        userId: "user-demo",
        event: "Product clicked",
        properties: {
          name: "Rubik's Cube",
          revenue: 4.99,
          prop_integer: 2,
          prop_float: 2.3
        },
        context: {
          ip: "14.5.67.21"
        },
        timestamp: "2020-02-02T00:23:09.544Z"
      }
    },
    trackingPlan,
    output: {
      dropEvent: false,
      violationType: "None"
    }
  },
  {
    testCase:
      "Track is part of Tracking Plan and anyOtherViolation[DateType] is set to drop",
    event: {
      metadata: {
        trackingPlanId: "dummy_tracking_plan_id",
        trackingPlanVersion: "dummy_version",
        workspaceId: "dummy_workspace_id",
        mergedTpConfig: {
          anyOtherViolation: "drop",
          ajvOptions: {}
        },
        sourceTpConfig: {
          track: {
            anyOtherViolation: "drop",
            ajvOptions: {}
          },
          global: {
            anyOtherViolation: "forward",
            ajvOptions: {}
          }
        }
      },
      message: {
        type: "track",
        userId: "user-demo",
        event: "Product clicked",
        properties: {
          name: "Rubik's Cube",
          revenue: "4.99",
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
      dropEvent: true,
      violationType: violationTypes.DatatypeMismatch
    }
  },
  {
    testCase:
      "Track is part of Tracking Plan and anyOtherViolation[DateType] is set to forward",
    event: {
      metadata: {
        trackingPlanId: "dummy_tracking_plan_id",
        trackingPlanVersion: "dummy_version",
        workspaceId: "dummy_workspace_id",
        mergedTpConfig: {
          anyOtherViolation: "forward",
          ajvOptions: {}
        },
        sourceTpConfig: {
          track: {
            anyOtherViolation: "forward",
            ajvOptions: {}
          },
          global: {
            anyOtherViolation: "forward",
            ajvOptions: {}
          }
        }
      },
      message: {
        type: "track",
        userId: "user-demo",
        event: "Product clicked",
        properties: {
          name: "Rubik's Cube",
          revenue: "4.99",
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
      dropEvent: false,
      violationType: "None"
    }
  },
  {
    testCase:
      "Track is part of Tracking Plan and anyOtherViolation[Unknown] is set to drop",
    event: {
      metadata: {
        trackingPlanId: "dummy_tracking_plan_id",
        trackingPlanVersion: "dummy_version",
        workspaceId: "dummy_workspace_id",
        mergedTpConfig: {
          anyOtherViolation: "drop",
          ajvOptions: {}
        },
        sourceTpConfig: {
          track: {
            anyOtherViolation: "drop",
            ajvOptions: {}
          },
          global: {
            anyOtherViolation: "forward",
            ajvOptions: {}
          }
        }
      },
      message: {
        type: "track",
        userId: "user-demo",
        event: "Product clicked",
        properties: {
          name: "Rubik's Cube",
          revenue: 4.99,
          prop_integer: 3,
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
      dropEvent: true,
      violationType: violationTypes.UnknownViolation
    }
  },
  {
    testCase:
      "Track is part of Tracking Plan and anyOtherViolation[Unknown] is set to forward",
    event: {
      metadata: {
        trackingPlanId: "dummy_tracking_plan_id",
        trackingPlanVersion: "dummy_version",
        workspaceId: "dummy_workspace_id",
        mergedTpConfig: {
          anyOtherViolation: "forward",
          ajvOptions: {}
        },
        sourceTpConfig: {
          track: {
            anyOtherViolation: "forward",
            ajvOptions: {}
          },
          global: {
            anyOtherViolation: "forward",
            ajvOptions: {}
          }
        }
      },
      message: {
        type: "track",
        userId: "user-demo",
        event: "Product clicked",
        properties: {
          name: "Rubik's Cube",
          revenue: 4.99,
          prop_integer: 3,
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
      dropEvent: false,
      violationType: "None"
    }
  },
  {
    testCase:
      "Compatibility for Spread sheet plugin + Track is not part of Tracking Plan and allowUnplannedEvents is set to boolean true",
    event: {
      metadata: {
        trackingPlanId: "dummy_tracking_plan_id",
        trackingPlanVersion: "dummy_version",
        workspaceId: "dummy_workspace_id",
        mergedTpConfig: {
          allowUnplannedEvents: true,
          ajvOptions: {}
        },
        sourceTpConfig: {
          track: {
            allowUnplannedEvents: true,
            ajvOptions: {}
          },
          global: {
            allowUnplannedEvents: false,
            ajvOptions: {}
          }
        }
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
      dropEvent: false,
      violationType: "None"
    }
  },
  {
    testCase:
      "Compatibility for Spread sheet plugin + Track is not part of Tracking Plan and allowUnplannedEvents is set to boolean false",
    event: {
      metadata: {
        trackingPlanId: "dummy_tracking_plan_id",
        trackingPlanVersion: "dummy_version",
        workspaceId: "dummy_workspace_id",
        mergedTpConfig: {
          allowUnplannedEvents: false,
          ajvOptions: {}
        },
        sourceTpConfig: {
          track: {
            allowUnplannedEvents: false,
            ajvOptions: {}
          },
          global: {
            allowUnplannedEvents: true,
            ajvOptions: {}
          }
        }
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
      dropEvent: true,
      violationType: violationTypes.UnplannedEvent
    }
  },
  {
    testCase:
      "Compatibility for Spread sheet plugin + Track is not part of Tracking Plan and allowUnplannedEvents is set to text TRUE",
    event: {
      metadata: {
        trackingPlanId: "dummy_tracking_plan_id",
        trackingPlanVersion: "dummy_version",
        workspaceId: "dummy_workspace_id",
        mergedTpConfig: {
          allowUnplannedEvents: "TRUE",
          ajvOptions: {}
        },
        sourceTpConfig: {
          track: {
            allowUnplannedEvents: "TRUE",
            ajvOptions: {}
          },
          global: {
            allowUnplannedEvents: "FALSE",
            ajvOptions: {}
          }
        }
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
      dropEvent: false,
      violationType: "None"
    }
  },
  {
    testCase:
      "Compatibility for Spread sheet plugin + Track is not part of Tracking Plan and allowUnplannedEvents is set to text FALSE",
    event: {
      metadata: {
        trackingPlanId: "dummy_tracking_plan_id",
        trackingPlanVersion: "dummy_version",
        workspaceId: "dummy_workspace_id",
        mergedTpConfig: {
          allowUnplannedEvents: "FALSE",
          ajvOptions: {}
        },
        sourceTpConfig: {
          track: {
            allowUnplannedEvents: "FALSE",
            ajvOptions: {}
          },
          global: {
            allowUnplannedEvents: "TRUE",
            ajvOptions: {}
          }
        }
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
      dropEvent: true,
      violationType: violationTypes.UnplannedEvent
    }
  },
  {
    testCase:
      "Track is part of Tracking Plan + no track config and unplannedProperties is set to drop",
    event: {
      metadata: {
        trackingPlanId: "dummy_tracking_plan_id",
        trackingPlanVersion: "dummy_version",
        workspaceId: "dummy_workspace_id",
        mergedTpConfig: {
          unplannedProperties: "drop",
          ajvOptions: {}
        },
        sourceTpConfig: {
          global: {
            unplannedProperties: "drop",
            ajvOptions: {}
          }
        }
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
          email: "demo@rudderstack.com",
          mobile: "999888777666"
        },
        context: {
          ip: "14.5.67.21"
        },
        timestamp: "2020-02-02T00:23:09.544Z"
      }
    },
    trackingPlan,
    output: {
      dropEvent: true,
      violationType: violationTypes.AdditionalProperties
    }
  },
  {
    testCase:
      "Track is part of Tracking Plan + no global config and unplannedProperties is set to forward",
    event: {
      metadata: {
        trackingPlanId: "dummy_tracking_plan_id",
        trackingPlanVersion: "dummy_version",
        workspaceId: "dummy_workspace_id",
        mergedTpConfig: {
          unplannedProperties: "forward",
          ajvOptions: {}
        },
        sourceTpConfig: {
          track: {
            unplannedProperties: "forward",
            ajvOptions: {}
          }
        }
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
          email: "demo@rudderstack.com",
          mobile: "999888777666"
        },
        context: {
          ip: "14.5.67.21"
        },
        timestamp: "2020-02-02T00:23:09.544Z"
      }
    },
    trackingPlan,
    output: {
      dropEvent: false,
      violationType: "None"
    }
  },
  {
    testCase: "allowUnplannedEvents set to value other than true/false",
    event: {
      metadata: {
        trackingPlanId: "dummy_tracking_plan_id",
        trackingPlanVersion: "dummy_version",
        workspaceId: "dummy_workspace_id",
        mergedTpConfig: {
          allowUnplannedEvents: "unknown",
          ajvOptions: {}
        },
        sourceTpConfig
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
          email: "demo@rudderstack.com",
          mobile: "999888777666"
        },
        context: {
          ip: "14.5.67.21"
        },
        timestamp: "2020-02-02T00:23:09.544Z"
      }
    },
    trackingPlan,
    output: {
      dropEvent: false,
      violationType: "None"
    }
  },
  {
    testCase: "unplannedProperties set to value other than forward/drop",
    event: {
      metadata: {
        trackingPlanId: "dummy_tracking_plan_id",
        trackingPlanVersion: "dummy_version",
        workspaceId: "dummy_workspace_id",
        mergedTpConfig: {
          unplannedProperties: "unknown",
          ajvOptions: {}
        },
        sourceTpConfig
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
          email: "demo@rudderstack.com",
          mobile: "999888777666"
        },
        context: {
          ip: "14.5.67.21"
        },
        timestamp: "2020-02-02T00:23:09.544Z"
      }
    },
    trackingPlan,
    output: {
      dropEvent: false,
      violationType: "None"
    }
  },
  {
    testCase: "anyOtherViolation set to value other than forward/drop",
    event: {
      metadata: {
        trackingPlanId: "dummy_tracking_plan_id",
        trackingPlanVersion: "dummy_version",
        workspaceId: "dummy_workspace_id",
        mergedTpConfig: {
          anyOtherViolation: "unknown",
          ajvOptions: {}
        },
        sourceTpConfig
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
          email: "demo@rudderstack.com",
          mobile: "999888777666"
        },
        context: {
          ip: "14.5.67.21"
        },
        timestamp: "2020-02-02T00:23:09.544Z"
      }
    },
    trackingPlan,
    output: {
      dropEvent: false,
      violationType: "None"
    }
  },
  {
    testCase: "sendViolatedEventsTo set to value other than procerrors",
    event: {
      metadata: {
        trackingPlanId: "dummy_tracking_plan_id",
        trackingPlanVersion: "dummy_version",
        workspaceId: "dummy_workspace_id",
        destinationId: "dummy_destination_id",
        destinationType: "dummy_destination_type",
        mergedTpConfig: {
          sendViolatedEventsTo: "unknown",
          ajvOptions: {}
        },
        sourceTpConfig
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
          email: "demo@rudderstack.com",
          mobile: "999888777666"
        },
        context: {
          ip: "14.5.67.21"
        },
        timestamp: "2020-02-02T00:23:09.544Z"
      }
    },
    trackingPlan,
    output: {
      dropEvent: false,
      violationType: "None"
    }
  }
];

const eventValidationWithNewPlanTestCases = [
  {
    testCase: "Group is part of new Tracking Plan + additional property violation",
    event: {
      metadata: {
        trackingPlanId: "dummy_tracking_plan_id_new",
        trackingPlanVersion: "dummy_version_new",
        workspaceId: "dummy_workspace_id",
        mergedTpConfig,
        sourceTpConfig
      },
      message: {
        type: "group",
        userId: "user12345",
        groupId: "group1",
        traits: {
          company: "Company",
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
    trackingPlan: newTrackingPlan,
    output: {
      dropEvent: true,
      violationType: violationTypes.AdditionalProperties
    }
  },
  {
    testCase:
      "Compatibility for Spread sheet plugin + Track is not part of new Tracking Plan and allowUnplannedEvents is set to text TRUE",
    event: {
      metadata: {
        trackingPlanId: "dummy_tracking_plan_id_new",
        trackingPlanVersion: "dummy_version_new",
        workspaceId: "dummy_workspace_id",
        mergedTpConfig: {
          allowUnplannedEvents: "TRUE",
          ajvOptions: {}
        },
        sourceTpConfig: {
          track: {
            allowUnplannedEvents: "TRUE",
            ajvOptions: {}
          },
          global: {
            allowUnplannedEvents: "FALSE",
            ajvOptions: {}
          }
        }
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
    trackingPlan: newTrackingPlan,
    output: {
      dropEvent: false,
      violationType: "None"
    }
  },
  {
    testCase:
      "Track is part of new Tracking Plan + no track config and unplannedProperties is set to drop",
    event: {
      metadata: {
        trackingPlanId: "dummy_tracking_plan_id_new",
        trackingPlanVersion: "dummy_version_new",
        workspaceId: "dummy_workspace_id",
        mergedTpConfig: {
          unplannedProperties: "drop",
          ajvOptions: {}
        },
        sourceTpConfig: {
          global: {
            unplannedProperties: "drop",
            ajvOptions: {}
          }
        }
      },
      message: {
        type: "track",
        userId: "user-demo",
        event: "Product clicked new",
        properties: {
          name: "Rubik's Cube",
          revenue: 4.99,
          prop_integer: 2,
          prop_float: 2.3,
          email: "demo@rudderstack.com",
          mobile: "999888777666"
        },
        context: {
          ip: "14.5.67.21"
        },
        timestamp: "2020-02-02T00:23:09.544Z"
      }
    },
    trackingPlan: newTrackingPlan,
    output: {
      dropEvent: true,
      violationType: violationTypes.AdditionalProperties
    }
  },
];

describe("Supported Event types testing", () => {
  eventTypesTestCases.forEach(testCase => {
    it(`should return isSupportedOrNot ${testCase.output} for this input eventType ${testCase.eventType} everytime`, () => {
      const isSupportedOrNot = isEventTypeSupported(testCase.eventType);
      expect(isSupportedOrNot).toEqual(testCase.output);
    });
  });
});

describe("Handle validation", () => {
  eventValidationTestCases.forEach(testCase => {
    it(`should return dropEvent: ${testCase.output.dropEvent}, violationType: ${testCase.output.violationType}`, async () => {
      fetch.mockResolvedValue({
        json: jest.fn().mockResolvedValue(testCase.trackingPlan),
        status: 200
      });
      const { dropEvent, violationType } = await handleValidation(
        testCase.event
      );
      expect(dropEvent).toEqual(testCase.output.dropEvent);
      expect(violationType).toEqual(testCase.output.violationType);
    });
  });
});

describe("Handle validation with new tracking plan payload", () => {
  eventValidationWithNewPlanTestCases.forEach(testCase => {
    it(`should return dropEvent: ${testCase.output.dropEvent}, violationType: ${testCase.output.violationType}`, async () => {
      fetch.mockResolvedValue({
        json: jest.fn().mockResolvedValue(testCase.trackingPlan),
        status: 200
      });
      const { dropEvent, violationType } = await handleValidation(
        testCase.event
      );
      expect(dropEvent).toEqual(testCase.output.dropEvent);
      expect(violationType).toEqual(testCase.output.violationType);
    });
  });
});

describe("HandleValidationErrors", () => {
  validationErrorsTestCases.forEach(testCase => {
    it(`should return dropEvent ${testCase.output} for ${testCase.test}`, () => {
      const { dropEvent } = handleValidationErrors(testCase.validationErrors, testCase.metadata, false, 'None');
      expect(dropEvent).toEqual(testCase.output);
    });
  });
});
