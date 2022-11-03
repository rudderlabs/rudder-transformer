import http from "k6/http";
import { check, sleep } from "k6";
import { randomIntBetween } from "https://jslib.k6.io/k6-utils/1.2.0/index.js";

import uuid from "./uuid.js";

export const options = {
  scenarios: {
    scenario: {
      executor: "constant-arrival-rate",

      // Our test should last X seconds in total
      duration: "1h",

      // It should start X iterations per `timeUnit`. Note that iterations starting points
      // will be evenly spread across the `timeUnit` period.
      rate: 50,

      // It should start `rate` iterations per second
      timeUnit: "1s",

      // It should preallocate X VUs before starting the test
      preAllocatedVUs: 50,

      // It is allowed to spin up to X maximum VUs to sustain the defined
      // constant arrival rate.
      maxVUs: 600
    }
  }
};

const workspaceId = __ENV.WORKSPACE_ID || "2At61jJxm49VSaIxI6KCECSZfCz";
const hostUrl =
  __ENV.HOST_URL || "http://transformer.dparveez.svc.cluster.local:80";
const url = hostUrl + "/customTransform";

const versionIds = [
  "2Gf1RoOzkFIfhEogL276zcw5nEe",
  "2Gf1xsaLEXpD3l9ysELjJAnMWuP",
  "2Gf26VFX6nZGUmsqajEgLPpZl6r",
  "2Gf2D3BpP1RacXKNI7Cp6utDnU5",
  "2Gf2KIWPpmiLmeSimPiAgOUg54r",
  "2Gf2VukAaiFXzkbypwFYzvgxDXd",
  "2Gf2eQXfEKPDIwZFZZRyqnWkHv8"
];

const maxBatchSize = parseInt(__ENV.MAX_BATCH_SIZE || 200);

const base_msg = JSON.parse(open("./base_msg.json"));
const base_meta = JSON.parse(open("./base_meta.json"));
const base_dst = JSON.parse(open("./base_dst.json"));

export function setup() {
  const msgs = [];
  const metas = [];
  const dests = [];

  for (let i = 0; i < maxBatchSize; i++) {
    const uuid4 = uuid.v4();

    let msg = JSON.parse(JSON.stringify(base_msg));
    msg.messageId = uuid4;
    msg.randomId = uuid4;
    msgs.push(msg);
  }

  versionIds.forEach((versionId, i) => {
    let meta = JSON.parse(JSON.stringify(base_meta));
    meta.workspaceId = workspaceId;
    meta.sourceId = "s" + i;
    meta.sourceDefinitionId = "sD" + i;
    meta.sourceType = "sT" + i;
    meta.destinationId = "d" + i;
    meta.destinationDefinitionId = "dD" + i;
    meta.destinationType = "dT" + i;

    metas.push(meta);

    let dest = JSON.parse(JSON.stringify(base_dst));
    dest.Transformations[0].VersionID = versionId;
    dests.push(dest);
  });

  const payloadsByVersionId = {};

  versionIds.forEach((versionId, i) => {
    payloadsByVersionId[versionId] = [];

    msgs.forEach(msg => {
      let payload = {};
      payload.message = msg;
      payload.metadata = metas[i];
      payload.destination = dests[i];

      payloadsByVersionId[versionId].push(payload);
    });
  });

  return { payloadsByVersionId };
}

export default function(data) {
  const requests = [];

  versionIds.forEach((versionId, i) => {
    const size = randomIntBetween(10, maxBatchSize);
    const req = {
      method: "POST",
      url: url,
      body: JSON.stringify(
        data.payloadsByVersionId[versionId].slice(10, maxBatchSize)
      ),
      params: {
        headers: { "Content-Type": "application/json" }
      }
    };

    requests.push(req);
  });

  const responses = http.batch(requests);

  responses.forEach(response => {
    check(response, {
      "transformation success": r => {
        let allSucess = true;

        try {
          JSON.parse(r.body).forEach(tR => {
            if (tR.statusCode != 200) {
              allSucess = false;
              throw Error();
            }
          });
        } catch (error) {
          allSucess = false;
        }

        return allSucess && r.status === 200;
      }
    });
  });
}
