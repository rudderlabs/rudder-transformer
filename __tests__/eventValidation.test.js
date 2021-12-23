jest.mock("node-fetch");
const fetch = require("node-fetch", () => jest.fn());

const {isEventTypeSupported, validate, handleValidation} = require("../util/eventValidation");

const trackingPlan = {
    rules: {
        events: [
            {
                id: "ev_22HzyIUtuhfoI80iDfAgf47GHpw",
                name: "Product clicked",
                description: "Fired when an product is clicked.",
                version: "1-0-0",
                rules: {
                    $schema: "http://json-schema.org/draft-07/schema#",
                    additionalProperties: false,
                    properties: {
                        email: {
                            type: [
                                "string"
                            ]
                        },
                        name: {
                            type: [
                                "string"
                            ]
                        },
                        prop_float: {
                            type: [
                                "string"
                            ]
                        },
                        prop_integer: {
                            type: [
                                "string"
                            ]
                        },
                        revenue: {
                            type: [
                                "number"
                            ]
                        }
                    },
                    type: "object"
                }
            }
        ]
    },
    name: "workspaces/dummy_workspace_id/tracking-plans/dummy_tracking_plan_id",
    display_name: "Demo Tracking Plan",
    version: 1,
    create_time: "2021-12-14T19:19:13.666Z",
    update_time: "2021-12-15T13:29:59.272Z"
}
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
}
const mergedTpConfig = {
    allowUnplannedEvents: "false",
    unplannedProperties: "drop",
    anyOtherViolation: "drop",
    sendViolatedEventsTo: "procErrors",
    ajvOptions: {}
}

const eventTypesTestCases = [
    {
        "output": false
    },
    {
        "eventType": undefined,
        "output": false
    },
    {
        "eventType": "unknown",
        "output": false
    },
    {
        "eventType": "identify",
        "output": true
    },
    {
        "eventType": "track",
        "output": true
    },
    {
        "eventType": "group",
        "output": true
    },
    {
        "eventType": "page",
        "output": false
    },
    {
        "eventType": "screen",
        "output": false
    },
    {
        "eventType": "alias",
        "output": false
    }
];
const eventValidationTestCases = [
    // {
    //     "testCase": "Empty Source TP Config",
    //     "event": {
    //         metadata: {
    //             trackingPlanId: "dummy_tracking_plan_id",
    //             trackingPlanVersion: "dummy_version",
    //             workspaceId: "dummy_workspace_id",
    //             mergedTpConfig: mergedTpConfig,
    //         }
    //     },
    //     "trackingPlan": trackingPlan,
    //     "output": {
    //         dropEvent: false,
    //         violationType: "None"
    //     }
    // },
    // {
    //     "testCase": "Empty Merged TP Config",
    //     "event": {
    //         metadata: {
    //             trackingPlanId: "dummy_tracking_plan_id",
    //             trackingPlanVersion: "dummy_version",
    //             workspaceId: "dummy_workspace_id",
    //             sourceTpConfig: sourceTpConfig,
    //         }
    //     },
    //     "trackingPlan": trackingPlan,
    //     "output": {
    //         dropEvent: false,
    //         violationType: "None"
    //     }
    // },
    // {
    //     "testCase": "Empty Source and Merged TP Config",
    //     "event": {
    //         metadata: {
    //             trackingPlanId: "dummy_tracking_plan_id",
    //             trackingPlanVersion: "dummy_version",
    //             workspaceId: "dummy_workspace_id",
    //         }
    //     },
    //     "trackingPlan": trackingPlan,
    //     "output": {
    //         dropEvent: false,
    //         violationType: "None"
    //     }
    // },
    // {
    //     "testCase": "Page Event is not Supported",
    //     "event": {
    //         metadata: {
    //             trackingPlanId: "dummy_tracking_plan_id",
    //             trackingPlanVersion: "dummy_version",
    //             workspaceId: "dummy_workspace_id",
    //             mergedTpConfig: mergedTpConfig,
    //             sourceTpConfig: sourceTpConfig,
    //         },
    //         message: {
    //             type: "page",
    //             userId: "user12345",
    //             anonymousId: "anon-id-new",
    //             name: "Page View",
    //             properties: {
    //                 title: "Home",
    //                 path: "/"
    //             },
    //             context: {
    //                 ip: "14.5.67.21",
    //                 library: {
    //                     name: "http"
    //                 }
    //             },
    //             timestamp: "2020-02-02T00:23:09.544Z"
    //         }
    //     },
    //     "trackingPlan": trackingPlan,
    //     "output": {
    //         dropEvent: false,
    //         violationType: "None"
    //     }
    // },
    // {
    //     "testCase": "Screen Event is not Supported",
    //     "event": {
    //         metadata: {
    //             trackingPlanId: "dummy_tracking_plan_id",
    //             trackingPlanVersion: "dummy_version",
    //             workspaceId: "dummy_workspace_id",
    //             mergedTpConfig: mergedTpConfig,
    //             sourceTpConfig: sourceTpConfig,
    //         },
    //         message: {
    //             type: "screen",
    //             userId: "user12345",
    //             anonymousId: "anon-id-new",
    //             name: "Screen View",
    //             properties: {
    //                 prop1: "5"
    //             },
    //             context: {
    //                 ip: "14.5.67.21",
    //                 library: {
    //                     name: "http"
    //                 }
    //             },
    //             timestamp: "2020-02-02T00:23:09.544Z"
    //         }
    //     },
    //     "trackingPlan": trackingPlan,
    //     "output": {
    //         dropEvent: false,
    //         violationType: "None"
    //     }
    // },
    // {
    //     "testCase": "Alias Event is not Supported",
    //     "event": {
    //         metadata: {
    //             trackingPlanId: "dummy_tracking_plan_id",
    //             trackingPlanVersion: "dummy_version",
    //             workspaceId: "dummy_workspace_id",
    //             mergedTpConfig: mergedTpConfig,
    //             sourceTpConfig: sourceTpConfig,
    //         },
    //         message: {
    //             type: "alias",
    //             userId: "user123",
    //             previousId: "user12345",
    //             context: {
    //                 traits: {
    //                     trait1: "new-val"
    //                 },
    //                 ip: "14.5.67.21",
    //                 library: {
    //                     name: "http"
    //                 }
    //             },
    //             timestamp: "2020-01-21T00:21:34.208Z"
    //         }
    //     },
    //     "trackingPlan": trackingPlan,
    //     "output": {
    //         dropEvent: false,
    //         violationType: "None"
    //     }
    // },
    // {
    //     "testCase": "Group is not present in Tracking Plan ",
    //     "event": {
    //         metadata: {
    //             trackingPlanId: "dummy_tracking_plan_id",
    //             trackingPlanVersion: "dummy_version",
    //             workspaceId: "dummy_workspace_id",
    //             mergedTpConfig: mergedTpConfig,
    //             sourceTpConfig: sourceTpConfig,
    //         },
    //         message: {
    //             type: "group",
    //             userId: "user12345",
    //             groupId: "group1",
    //             traits: {
    //                 name: "Company",
    //                 industry: "Industry",
    //                 employees: 123
    //             },
    //             context: {
    //                 traits: {
    //                     trait1: "new-val"
    //                 },
    //                 ip: "14.5.67.21",
    //                 library: {
    //                     name: "http"
    //                 }
    //             },
    //             timestamp: "2020-01-21T00:21:34.208Z"
    //         }
    //     },
    //     "trackingPlan": trackingPlan,
    //     "output": {
    //         dropEvent: false,
    //         violationType: "None"
    //     }
    // },
    // {
    //     "testCase": "Identify is not present in Tracking Plan ",
    //     "event": {
    //         metadata: {
    //             trackingPlanId: "dummy_tracking_plan_id",
    //             trackingPlanVersion: "dummy_version",
    //             workspaceId: "dummy_workspace_id",
    //             mergedTpConfig: mergedTpConfig,
    //             sourceTpConfig: sourceTpConfig,
    //         },
    //         message: {
    //             type: "identify",
    //             userId: "user12345",
    //             anonymousId: "anon-id-new",
    //             context: {
    //                 traits: {
    //                     trait1: "new-val"
    //                 },
    //                 ip: "14.5.67.21",
    //                 library: {
    //                     name: "http"
    //                 }
    //             },
    //             timestamp: "2020-02-02T00:23:09.544Z"
    //         }
    //     },
    //     "trackingPlan": trackingPlan,
    //     "output": {
    //         dropEvent: false,
    //         violationType: "None"
    //     }
    // },
    {
        "testCase": "Track event is present in Tracking Plan ",
        "event": {
            metadata: {
                trackingPlanId: "dummy_tracking_plan_id",
                trackingPlanVersion: "dummy_version",
                workspaceId: "dummy_workspace_id",
                mergedTpConfig: mergedTpConfig,
                sourceTpConfig: sourceTpConfig,
            },
            message: {
                type: "track",
                userId: "user-charitha",
                event: "Product clicked",
                properties: {
                    name: "Rubik's Cube",
                    revenue: 4.99,
                    prop_integer: "2",
                    prop_float: "2.3",
                    email: "sandhya12345@rudderstack.com"
                },
                context: {
                    ip: "14.5.67.21"
                },
                timestamp: "2020-02-02T00:23:09.544Z"
            }
        },
        "trackingPlan": trackingPlan,
        "output": {
            dropEvent: false,
            violationType: "None"
        }
    }
];


describe("Supported Event types testing", () => {
    eventTypesTestCases.forEach((testCase) => {
        it(`should return isSupportedOrNot ${testCase.output} for this input eventType ${testCase.eventType} everytime`, () => {
            var isSupportedOrNot = isEventTypeSupported(testCase.eventType)
            expect(isSupportedOrNot).toEqual(testCase.output)
        })
    })
})

describe("Handle validation", () => {
    eventValidationTestCases.forEach((testCase) => {
        it(`should return dropEvent: ${testCase.output.dropEvent}, violationType: ${testCase.output.violationType}`, async () => {
            fetch.mockResolvedValue({
                json: jest.fn().mockResolvedValue(testCase.trackingPlan),
                status: 200
            });
            const {dropEvent, violationType} = await handleValidation(testCase.event);
            expect(dropEvent).toEqual(testCase.output.dropEvent)
            expect(violationType).toEqual(testCase.output.violationType)
        })
    })
})
