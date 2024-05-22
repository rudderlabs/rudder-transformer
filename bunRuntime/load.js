import { check } from 'k6';
import http from 'k6/http';
import { uuidv4 } from 'https://jslib.k6.io/k6-utils/1.4.0/index.js';

const batchSize = 1;

const event = {
  message: {
    type: 'track',
    event: 'Content Playback Completed',
    sentAt: '2024-05-17T02:44:36.778Z',
    userId: 'user-id',
    channel: 'mobile',
    context: {
      os: {
        name: 'Android',
        version: '12',
      },
      app: {
        name: 'The Chosen',
        build: '50',
        version: '2.5.0',
        namespace: 'namespace',
      },
      device: {
        id: 'device-id',
        name: 'lisbon',
        type: 'Android',
        model: 'moto g(60)s',
        manufacturer: 'motorola',
      },
      locale: 'pt-BR',
      screen: {
        width: 1080,
        height: 2211,
        density: 446,
      },
      traits: {
        id: 'trait-id',
        email: '',
        phone: '',
        userId: 'user-id',
        language: 'pt',
        channel_id: 'channel-id',
        anonymousId: 'anonymous-id',
      },
      library: {
        name: 'com.rudderstack.android.sdk.core',
        version: '1.21.0',
      },
      network: {
        wifi: true,
        carrier: 'TIM',
        cellular: true,
      },
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
    integrations: {
      All: true,
    },
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
  destination: {
    ID: '',
    Name: '',
    DestinationDefinition: {
      ID: '',
      Name: '',
      DisplayName: '',
      Config: null,
      ResponseRules: null,
    },
    Config: null,
    Enabled: false,
    WorkspaceID: '',
    Transformations: null,
    IsProcessorEnabled: false,
    RevisionID: '',
  },
  libraries: null,
};

export const options = {
  thresholds: {
    http_req_duration: ['p(99)<100'],
  },
  scenarios: {
    gatewayLoadTest: {
      executor: 'constant-arrival-rate',
      duration: '30s',
      rate: 1,
      timeUnit: '1s',
      preAllocatedVUs: 100,
      maxVUs: 1000,
      exec: 'validate',
    },
  },
};

export function setup() {
  const payload = [];

  for (let i = 0; i < batchSize; i += 1) {
    payload.push(event);
  }

  return payload;
}

export function validate(data) {
  const response = http.post('http://localhost:9091/v0/validate', JSON.stringify(data), {
    headers: { 'Content-Type': 'application/json' },
  });

  check(response, {
    '200OK output': (r) => r.status === 200,
  });
}