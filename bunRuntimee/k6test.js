import { check } from "k6";
import http from "k6/http";

// check out how to get node libraries into k6
import { uuidv4 } from "https://jslib.k6.io/k6-utils/1.4.0/index.js";

// Prefer ramping arrival rate for proper/heavy load tests.
export const options = {
  scenarios: {
    scenario1: {
      executor: "constant-arrival-rate",
      duration: "30s",
      rate: 300,
      timeUnit: "1s",
      preAllocatedVUs: 100,
      maxVUs: 300,
      exec: "scenario1",
    },
  },
};

const hostUrl = "http://gateway.openfaas-anshul.svc.cluster.local:8080";
const url = `${hostUrl}/function`;

// See additional resources uploaded below.
const base_msgs = {
  message: {
    name: "search_list",
    type: "page",
    sentAt: "2023-05-18T10:16:31.668Z",
    userId: "",
    channel: "web",
    context: {
      os: {
        name: "",
        version: "",
      },
      app: {
        name: "RudderLabs JavaScript SDK",
        version: "2.33.1",
        namespace: "com.rudderlabs.javascript",
      },
      page: {
        url: "/au/hoka-one-one/shop/category/clothing-shoes-accessories-women-37964/?page=1&dsp=hidden",
        path: "/au/hoka-one-one/shop/category/clothing-shoes-accessories-women-37964/",
        title: "Buy Hoka One One Women's Shoes Online | Kogan",
        search: "?page=1&dsp=hidden",
        tab_url:
          "https://www.kogan.com/au/hoka-one-one/shop/category/clothing-shoes-accessories-women-37964/?page=1&dsp=hidden",
        referrer: "https://www.kogan.com/",
        initial_referrer: "https://www.google.com/",
        referring_domain: "www.kogan.com",
        initial_referring_domain: "www.google.com",
      },
      locale: "en-GB",
      screen: {
        width: 1440,
        height: 900,
        density: 2,
        innerWidth: 1440,
        innerHeight: 628,
      },
      traits: {},
      library: {
        name: "RudderLabs JavaScript SDK",
        version: "2.33.1",
      },
      campaign: {},
      sessionId: 1684404970769,
      userAgent:
        "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/112.0.0.0 Safari/537.36",
    },
    rudderId: "2d11e550-950c-4269-a2c4-1b7c9b9986f6",
    messageId: "18495590-48af-4361-8daf-7590254dc798",
    properties: {
      url: "/au/hoka-one-one/shop/category/clothing-shoes-accessories-women-37964/?page=1&dsp=hidden",
      name: "search_list",
      path: "/au/hoka-one-one/shop/category/clothing-shoes-accessories-women-37964/",
      title: "Buy Hoka One One Women's Shoes Online | Kogan",
      search: "?page=1&dsp=hidden",
      tab_url:
        "https://www.kogan.com/au/hoka-one-one/shop/category/clothing-shoes-accessories-women-37964/?page=1&dsp=hidden",
      referrer: "https://www.kogan.com/",
      initial_referrer: "https://www.google.com/",
      referring_domain: "www.kogan.com",
      initial_referring_domain: "www.google.com",
    },
    anonymousId: "b87bbb52-478b-4043-ad77-7f26a9a5d54f",
    integrations: {
      All: true,
      "Google Analytics 4": {
        clientId: "1987030102.1683088628",
        sessionId: "1684404975",
        sessionNumber: 1,
      },
    },
    originalTimestamp: "2023-05-18T10:16:31.654Z",
  },
  metadata: {
    sourceId: "abcdFB7XK",
    namespace: "abcd",
    instanceId: "abcd-v0-rs-0",
    sourceType: "PHP",
    sourceCategory: "",
    destinationId: "abcdT9Ri",
    jobRunId: "",
    jobId: 177608976,
    sourceBatchId: "",
    sourceJobId: "",
    sourceJobRunId: "",
    sourceTaskId: "",
    sourceTaskRunId: "",
    recordId: null,
    destinationType: "RS",
    messageId: "93f09dd2-2655-4064-8926-b2b13e40449f",
    messageIds: null,
    rudderId: "7b4b4c21-7a58-40d5-be6e-887b75d31544",
    receivedAt: "2021-12-20T10:19:19.387Z",
    eventName: "page-viewed",
    eventType: "page",
    sourceDefinitionId: "abcdIpansx2",
    destinationDefinitionId: "",
    trackingPlanId: "tp_2eavhhgNSrhVJoPuXdyqOht5Adt",
            trackingPlanVersion: "3",
            "workspaceId": "1z8QUcZx49fzs4V3wIqNJRH0emr",
            "mergedTpConfig": {
                "allowUnplannedEvents": "false",
                "unplannedProperties": "drop",
                "anyOtherViolation": "drop",
                "sendViolatedEventsTo": "procErrors",
                "ajvOptions": {}
            },
            "sourceTpConfig": {
                "track": {
                    "allowUnplannedEvents": "true",
                    "unplannedProperties": "forward",
                    "anyOtherViolation": "forward",
                    "propagateValidationErrors": "true",
                    "ajvOptions": {}
                },
                "global": {
                    "allowUnplannedEvents": "false",
                    "unplannedProperties": "drop",
                    "anyOtherViolation": "drop",
                    "sendViolatedEventsTo": "procErrors",
                    "ajvOptions": {}
                }
            }
  },
  destination: {
    ID: "abcdT9Ri",
    Name: "redshift",
    Enabled: true,
    Transformations: [
      {
        VersionID: "2bnkuhqMkU8BX0FTryBgBrHaFIB",
        ID: "abcdyhNM",
        Config: {},
      },
    ],
    IsProcessorEnabled: true,
  },
  libraries: [],
};

// Looks like some batching logic that I don't remember clearly myself.
// Not necessary for simple load tests.
export function setup() {
  const payloads = [];

  for (let j = 0; j < 30; j += 1) {
    let baseMsgs = base_msgs;
    baseMsgs.message.messageId = uuidv4();
    baseMsgs.metadata.messageId = uuidv4();
    payloads.push(baseMsgs);
  }

  return { payloads };
}

export function scenario1(data) {
  const { payloads } = data;
  const functionUrl = `${url}/${__ENV.FUNCTION}`.trim();

  const response = http.post(functionUrl, JSON.stringify(payloads), {
    headers: { "Content-Type": "application/json" },
  });

  check(response, {
    "transformation success": (r) => {
      r.status !== 200 && console.log(r.status);

      return r.status === 200;
    },
  });
}