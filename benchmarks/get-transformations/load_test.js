import http from "k6/http";
import { check } from "k6";

export const options = {
  scenarios: {
    scenario: {
      executor: "constant-arrival-rate",

      // Our test should last X seconds in total
      duration: "5m",

      // It should start X iterations per `timeUnit`. Note that iterations starting points
      // will be evenly spread across the `timeUnit` period.
      rate: 25,

      // It should start `rate` iterations per second
      timeUnit: "1s",

      // It should preallocate X VUs before starting the test
      preAllocatedVUs: 100,

      // It is allowed to spin up to X maximum VUs to sustain the defined
      // constant arrival rate.
      maxVUs: 300
    }
  }
};

const baseUrl = "https://api.dev.rudderlabs.com/transformation/getByVersionId";
const versionIds = [
  "2Gf1RoOzkFIfhEogL276zcw5nEe",
  "2Gf1xsaLEXpD3l9ysELjJAnMWuP",
  "2Gf26VFX6nZGUmsqajEgLPpZl6r",
  "2Gf2D3BpP1RacXKNI7Cp6utDnU5",
  "2Gf2KIWPpmiLmeSimPiAgOUg54r",
  "2Gf2VukAaiFXzkbypwFYzvgxDXd",
  "2Gf2eQXfEKPDIwZFZZRyqnWkHv8"
];

export default function() {
  const requests = [];

  versionIds.forEach(versionId => {
    const req = {
      method: "GET",
      url: baseUrl + `?versionId=${versionId}`
    };

    requests.push(req);
  });

  const responses = http.batch(requests);

  responses.forEach(response => {
    check(response, {
      success: r => {
        return r.status === 200;
      }
    });
  });
}
