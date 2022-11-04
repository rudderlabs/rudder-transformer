import http from "k6/http";
import { check, sleep } from "k6";

import uuid from "./uuid.js";

export const options = {
  scenarios: {
    scenario: {
      executor: "constant-arrival-rate",

      // Our test should last X seconds in total
      duration: "60s",

      // It should start X iterations per `timeUnit`. Note that iterations starting points
      // will be evenly spread across the `timeUnit` period.
      rate: 2,

      // It should start `rate` iterations per second
      timeUnit: "1s",

      // It should preallocate X VUs before starting the test
      preAllocatedVUs: 20,

      // It is allowed to spin up to X maximum VUs to sustain the defined
      // constant arrival rate.
      maxVUs: 100
    }
  }
};

const hostUrl =
  __ENV.HOST_URL || "http://transformer.dparveez.svc.cluster.local:80";

const url = `${hostUrl}/transformation/test`;

export default function() {
  const payload = {
    trRevCode: {
      code:
        'def transformEvent(event, metadata):\n    event["header"] = {\n        "dynamic_header_1": "dynamic_header_1_value",\n        "dynamic_header_2": "dynamic_header_2_value"\n    }\n    return event',
      codeVersion: "1",
      versionId: uuid.v4(),
      language: "python",
      testName: "workspaceId_test",
      testWithPublish: true,
      workspaceId: "workspaceId"
    },
    events: [
      {
        message: {
          channel: "web",
          context: {
            app: {
              build: "1.0.0",
              name: "RudderLabs JavaScript SDK",
              namespace: "com.rudderlabs.javascript",
              version: "1.0.0"
            },
            traits: {
              anonymousId: "123456"
            },
            library: {
              name: "RudderLabs JavaScript SDK",
              version: "1.0.0"
            },
            userAgent:
              "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/77.0.3865.90 Safari/537.36",
            locale: "en-US",
            ip: "0.0.0.0",
            os: {
              name: "",
              version: ""
            },
            screen: {
              density: 2
            }
          },
          type: "identify",
          messageId: "84e26acc-56a5-4835-8233-591137fca468",
          originalTimestamp: "2019-10-14T09:03:17.562Z",
          anonymousId: "123456",
          userId: "123456",
          integrations: {
            All: true
          },
          sentAt: "2019-10-14T09:03:22.563Z"
        },
        destination: {
          ID: 2,
          Config: {
            trackingID: "abcd"
          },
          Enabled: true,
          Transformations: [
            {
              VersionID: "23"
            }
          ]
        }
      },
      {
        message: {
          channel: "web",
          context: {
            app: {
              build: "1.0.0",
              name: "RudderLabs JavaScript SDK",
              namespace: "com.rudderlabs.javascript",
              version: "1.0.0"
            },
            traits: {
              email: "sayan@gmail.com",
              anonymousId: "12345"
            },
            library: {
              name: "RudderLabs JavaScript SDK",
              version: "1.0.0"
            },
            userAgent:
              "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/77.0.3865.90 Safari/537.36",
            locale: "en-US",
            ip: "0.0.0.0",
            os: {
              name: "",
              version: ""
            },
            screen: {
              density: 2
            }
          },
          type: "page",
          messageId: "5e10d13a-bf9a-44bf-b884-43a9e591ea71",
          originalTimestamp: "2019-10-14T11:15:18.299Z",
          anonymousId: "00000000000000000000000000",
          userId: "12345",
          properties: {
            path: "/abc",
            referrer: "",
            search: "",
            title: "",
            url: "client=firefox-b-d&q=url+search+params+nodejs"
          },
          integrations: {
            All: true
          },
          name: "ApplicationLoaded",
          sentAt: "2019-10-14T11:15:53.296Z"
        },
        destination: {
          Config: {
            trackingID: "abcd"
          },
          Enabled: true
        }
      },
      {
        message: {
          channel: "web",
          context: {
            app: {
              build: "1.0.0",
              name: "RudderLabs JavaScript SDK",
              namespace: "com.rudderlabs.javascript",
              version: "1.0.0"
            },
            traits: {
              email: "sayan@gmail.com",
              anonymousId: "12345"
            },
            library: {
              name: "RudderLabs JavaScript SDK",
              version: "1.0.0"
            },
            userAgent:
              "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/77.0.3865.90 Safari/537.36",
            locale: "en-US",
            ip: "0.0.0.0",
            os: {
              name: "",
              version: ""
            },
            screen: {
              density: 2
            }
          },
          type: "track",
          messageId: "ec5481b6-a926-4d2e-b293-0b3a77c4d3be",
          originalTimestamp: "2019-10-14T11:15:18.300Z",
          anonymousId: "00000000000000000000000000",
          userId: "12345",
          event: "test track event GA3",
          properties: {
            user_actual_role: "system_admin, system_user",
            user_actual_id: 12345
          },
          integrations: {
            All: true
          },
          sentAt: "2019-10-14T11:15:53.296Z"
        },
        destination: {
          Config: {
            trackingID: "UA-149602794-1"
          },
          Enabled: true
        }
      }
    ]
  };

  const req = {
    method: "POST",
    url,
    body: JSON.stringify(payload),
    params: {
      headers: { "Content-Type": "application/json" }
    }
  };

  const responses = http.batch([req]);

  sleep(3);

  responses.forEach(response => {
    check(response, {
      success: r => {
        return r.status === 200;
      }
    });
  });
}
