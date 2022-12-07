jest.mock("node-fetch");
const fetch = require("node-fetch", () => jest.fn());

const {
  isEventTypeSupported,
  handleValidation,
  violationTypes
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
    output: false
  },
  {
    eventType: "screen",
    output: false
  },
  {
    eventType: "alias",
    output: false
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
        mergedTpConfig: mergedTpConfig
      }
    },
    trackingPlan: trackingPlan,
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
        sourceTpConfig: sourceTpConfig
      }
    },
    trackingPlan: trackingPlan,
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
    trackingPlan: trackingPlan,
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
        mergedTpConfig: mergedTpConfig,
        sourceTpConfig: sourceTpConfig
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
    trackingPlan: trackingPlan,
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
        mergedTpConfig: mergedTpConfig,
        sourceTpConfig: sourceTpConfig
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
    trackingPlan: trackingPlan,
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
        mergedTpConfig: mergedTpConfig,
        sourceTpConfig: sourceTpConfig
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
    trackingPlan: trackingPlan,
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
        mergedTpConfig: mergedTpConfig,
        sourceTpConfig: sourceTpConfig
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
    trackingPlan: trackingPlan,
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
        mergedTpConfig: mergedTpConfig,
        sourceTpConfig: sourceTpConfig
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
    trackingPlan: trackingPlan,
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
    trackingPlan: trackingPlan,
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
    trackingPlan: trackingPlan,
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
        mergedTpConfig: mergedTpConfig,
        sourceTpConfig: sourceTpConfig
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
    trackingPlan: trackingPlan,
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
    trackingPlan: trackingPlan,
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
    trackingPlan: trackingPlan,
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
    trackingPlan: trackingPlan,
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
    trackingPlan: trackingPlan,
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
    trackingPlan: trackingPlan,
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
    trackingPlan: trackingPlan,
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
    trackingPlan: trackingPlan,
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
    trackingPlan: trackingPlan,
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
    trackingPlan: trackingPlan,
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
    trackingPlan: trackingPlan,
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
    trackingPlan: trackingPlan,
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
    trackingPlan: trackingPlan,
    output: {
      dropEvent: true,
      violationType: violationTypes.UnplannedEvent
    }
  }
];

describe("Supported Event types testing", () => {
  eventTypesTestCases.forEach(testCase => {
    it(`should return isSupportedOrNot ${testCase.output} for this input eventType ${testCase.eventType} everytime`, () => {
      var isSupportedOrNot = isEventTypeSupported(testCase.eventType);
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
