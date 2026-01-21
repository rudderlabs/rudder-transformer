import http from 'k6/http';
import { check } from 'k6';
import { Trend } from 'k6/metrics';

const legacyTrend = new Trend('legacy_duration');
const newImplTrend = new Trend('new_impl_duration');

const MODE = __ENV.MODE || 'simple';

const getEventsPayload = (count) => {
  return Array.from({ length: count }, () => ({
    message: {
      type: 'track',
      event: 'Content Playback Completed',
      sentAt: '2024-05-17T02:44:36.778Z',
      userId: 'user-id',
      channel: 'mobile',
      context: {
        os: { name: 'Android', version: '12' },
        app: { name: 'The Chosen', build: '50', version: '2.5.0', namespace: 'namespace' },
        device: {
          id: 'device-id',
          name: 'lisbon',
          type: 'Android',
          model: 'moto g(60)s',
          manufacturer: 'motorola',
        },
        locale: 'pt-BR',
        screen: { width: 1080, height: 2211, density: 446 },
        traits: {
          id: 'trait-id',
          email: '',
          phone: '',
          userId: 'user-id',
          language: 'pt',
          channel_id: 'channel-id',
          anonymousId: 'anonymous-id',
        },
        library: { name: 'com.rudderstack.android.sdk.core', version: '1.21.0' },
        network: { wifi: true, carrier: 'TIM', cellular: true },
        timezone: 'America/Sao_Paulo',
        sessionId: 1715913841,
        userAgent: 'Dalvik/2.1.0 (Linux; U; Android 12; moto g(60)s Build/S3RLS32.114-25-13)',
      },
      rudderId: 'rudder-id',
      messageId: 'message-id',
      properties: {
        bitrate: 3200000,
        is_live: false,
        language: 'PT_BR',
        content_id: '184683594335',
        full_screen: false,
        video_width: 854,
        content_type: 'VIDEO',
        video_height: 480,
        audio_language: '',
        content_duration: 2339804,
        accumulative_time: 0,
        playback_position: 2339,
        subtitle_language: '',
        new_property: 'true',
      },
      anonymousId: 'anonymous-id',
      integrations: { All: true },
      originalTimestamp: '2024-05-17T02:44:29.521Z',
    },
    metadata: {
      sourceId: '',
      workspaceId: '1lLaDQS1mdax6dbR08wOUgBJBk1',
      namespace: '',
      instanceId: '',
      sourceType: 'Android',
      sourceCategory: '',
      trackingPlanId: 'tp_27gIzarrRWhkxscAxskVPfY7m1l',
      trackingPlanVersion: 1,
      sourceTpConfig: {
        global: {
          allowUnplannedEvents: true,
          anyOtherViolation: 'forward',
          propagateValidationErrors: true,
          sendViolatedEventsTo: 'procErrors',
          unplannedProperties: 'forward',
        },
        group: {},
        identify: {
          allowUnplannedEvents: true,
          anyOtherViolation: 'forward',
          propagateValidationErrors: true,
          sendViolatedEventsTo: 'procErrors',
          unplannedProperties: 'forward',
        },
      },
      mergedTpConfig: {
        allowUnplannedEvents: true,
        anyOtherViolation: 'forward',
        propagateValidationErrors: true,
        sendViolatedEventsTo: 'procErrors',
        unplannedProperties: 'forward',
      },
      destinationId: '',
      jobId: 92,
      sourceJobId: '',
      sourceJobRunId: '',
      sourceTaskRunId: '',
      recordId: null,
      destinationType: '',
      messageId: '45a8d4be-ea87-4fc7-8b8b-e2604982da20',
      oauthAccessToken: '',
      messageIds: null,
      rudderId: '<<>>anon-id-new2<<>>identified user id2',
      receivedAt: '2023-04-18T15:54:51.711+05:30',
      eventName: 'Content Playback Completed',
      eventType: 'track',
      sourceDefinitionId: '1QGzOQGVLM35GgtteFH1vYCE0WT',
      destinationDefinitionId: '',
      transformationId: '',
      transformationVersionId: '',
    },
    destination: {},
    libraries: null,
  }));
};

const getRequestPayload = (count) => ({
  input: getEventsPayload(count),
  code: `
export function transformEvent(event, metadata) { return event; }
`,
  language: 'javascript',
  dependencies: {
    libraries: [],
    credentials: [],
  },
});

const getConfigByMode = () => {
  switch (MODE) {
    case 'exhaust':
      return {
        config: {
          executor: 'ramping-arrival-rate',
          startRate: 50,
          timeUnit: '1s',
          preAllocatedVUs: 100,
          maxVUs: 400,
          stages: [
            { target: 50, duration: '30s' },
            { target: 100, duration: '30s' },
            { target: 150, duration: '30s' },
            { target: 200, duration: '30s' },
            { target: 50, duration: '30s' },
            { target: 20, duration: '30s' },
          ],
        },
        payload: getRequestPayload(300),
      };
    case 'stress':
      return {
        config: {
          executor: 'ramping-arrival-rate',
          startRate: 20,
          timeUnit: '1s',
          preAllocatedVUs: 50,
          maxVUs: 300,
          stages: [
            { target: 50, duration: '30s' },
            { target: 100, duration: '30s' },
            { target: 150, duration: '30s' },
            { target: 50, duration: '30s' },
          ],
        },
        payload: getRequestPayload(200),
      };
    case 'simple':
    default:
      return {
        config: {
          executor: 'constant-arrival-rate',
          duration: '2m',
          rate: 50,
          timeUnit: '1s',
          preAllocatedVUs: 50,
          maxVUs: 50,
        },
        payload: getRequestPayload(100),
      };
  }
};

// -----------------------
// Configs
// -----------------------

const { config, payload } = getConfigByMode();
// -----------------------
// Scenario selection
// -----------------------

const scenario = __ENV.SCENARIO || 'legacy';

const scenarios = {
  legacy: {
    legacy: Object.assign({}, config, {
      exec: 'legacyTest',
      startTime: '0s',
    }),
  },
  new: {
    new_impl: Object.assign({}, config, {
      exec: 'newTest',
      startTime: '0s',
    }),
  },
};

// Optional: force per-stage series to appear in summary-export by referencing them in thresholds.
// Keep these loose, they are mostly for producing tagged sub-metrics.

export const options = {
  discardResponseBodies: true,
  scenarios: scenarios[scenario],
};

// -----------------------
// Tests
// -----------------------

export function newTest() {
  const res = http.post('http://localhost:9090/transformation/testRun', JSON.stringify(payload), {
    headers: { 'Content-Type': 'application/json' },
  });

  check(res, { 'status is 200': (r) => r.status === 200 });
  newImplTrend.add(res.timings.duration);
}

export function legacyTest() {
  const requestPayload = {
    events: payload.input,
    trRevCode: {
      codeVersion: '1',
      code: payload.code,
      language: payload.language,
    },
    libraryVersionIDs: payload.dependencies.libraries.map((lib) => lib.versionId),
    credentials: payload.dependencies.credentials,
  };

  const res = http.post(
    'http://localhost:9090/transformation/test',
    JSON.stringify(requestPayload),
    {
      headers: { 'Content-Type': 'application/json' },
    },
  );

  check(res, { 'status is 200': (r) => r.status === 200 });
  legacyTrend.add(res.timings.duration);
}
