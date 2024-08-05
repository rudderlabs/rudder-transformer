export const data = [
  {
    name: 'pagerduty',
    description: 'Incident Triggered',
    module: 'source',
    version: 'v0',
    input: {
      request: {
        body: [
          {
            event: {
              id: '01DEN0V2VIFEN5871PQGX72URP',
              event_type: 'incident.triggered',
              resource_type: 'incident',
              occurred_at: '2022-12-07T10:56:52.337Z',
              agent: {
                html_url: 'https://rudderlabs-com.pagerduty.com/users/PXZZD2E',
                id: 'PXZZD2E',
                self: 'https://api.pagerduty.com/users/user@1',
                summary: 'rudder test',
                type: 'user_reference',
              },
              client: { name: 'Monitoring Service', url: 'https://monitoring.service.com' },
              data: {
                id: 'Q3S7IX2U5KTCOY',
                type: 'incident',
                self: 'https://api.pagerduty.com/incidents/Q3S7IX2U5KTCOY',
                html_url: 'https://rudderlabs-com.pagerduty.com/incidents/Q3S7IX2U5KTCOY',
                number: 2,
                status: 'triggered',
                incident_key: 'faaecfc0aca04b6ea07154188b5d3c6c',
                created_at: '2022-12-07T10:56:52Z',
                title: 'Server Crashed',
                service: {
                  html_url: 'https://rudderlabs-com.pagerduty.com/services/PAJBUTT',
                  id: 'PAJBUTT',
                  self: 'https://api.pagerduty.com/services/PAJBUTT',
                  summary: 'Database',
                  type: 'service_reference',
                },
                assignees: [
                  {
                    html_url: 'https://rudderlabs-com.pagerduty.com/users/PXZZD2E',
                    id: 'PXZZD2E',
                    self: 'https://api.pagerduty.com/users/user@1',
                    summary: 'rudder test',
                    type: 'user_reference',
                  },
                ],
                escalation_policy: {
                  html_url: 'https://rudderlabs-com.pagerduty.com/escalation_policies/PB7HKU4',
                  id: 'PB7HKU4',
                  self: 'https://api.pagerduty.com/escalation_policies/PB7HKU4',
                  summary: 'Default',
                  type: 'escalation_policy_reference',
                },
                teams: [],
                priority: {
                  html_url: 'https://rudderlabs-com.pagerduty.com/account/incident_priorities',
                  id: 'PPMNDVQ',
                  self: 'https://api.pagerduty.com/priorities/PPMNDVQ',
                  summary: 'P1',
                  type: 'priority_reference',
                },
                urgency: 'high',
                conference_bridge: null,
                resolve_reason: null,
              },
            },
          },
        ],
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      },
      pathSuffix: '',
    },
    output: {
      response: {
        status: 200,
        body: [
          {
            output: {
              batch: [
                {
                  type: 'track',
                  event: 'Incident Triggered',
                  userId: 'PXZZD2E',
                  context: {
                    traits: {
                      id: 'PXZZD2E',
                      self: 'https://api.pagerduty.com/users/user@1',
                      type: 'user_reference',
                      summary: 'rudder test',
                      html_url: 'https://rudderlabs-com.pagerduty.com/users/PXZZD2E',
                    },
                    library: { name: 'unknown', version: 'unknown' },
                    integration: { name: 'PagerDuty' },
                  },
                  messageId: '01DEN0V2VIFEN5871PQGX72URP',
                  properties: {
                    data: {
                      id: 'Q3S7IX2U5KTCOY',
                      self: 'https://api.pagerduty.com/incidents/Q3S7IX2U5KTCOY',
                      type: 'incident',
                      teams: [],
                      title: 'Server Crashed',
                      number: 2,
                      status: 'triggered',
                      service: {
                        id: 'PAJBUTT',
                        self: 'https://api.pagerduty.com/services/PAJBUTT',
                        type: 'service_reference',
                        summary: 'Database',
                        html_url: 'https://rudderlabs-com.pagerduty.com/services/PAJBUTT',
                      },
                      urgency: 'high',
                      html_url: 'https://rudderlabs-com.pagerduty.com/incidents/Q3S7IX2U5KTCOY',
                      priority: {
                        id: 'PPMNDVQ',
                        self: 'https://api.pagerduty.com/priorities/PPMNDVQ',
                        type: 'priority_reference',
                        summary: 'P1',
                        html_url:
                          'https://rudderlabs-com.pagerduty.com/account/incident_priorities',
                      },
                      assignees: [
                        {
                          id: 'PXZZD2E',
                          self: 'https://api.pagerduty.com/users/user@1',
                          type: 'user_reference',
                          summary: 'rudder test',
                          html_url: 'https://rudderlabs-com.pagerduty.com/users/PXZZD2E',
                        },
                      ],
                      created_at: '2022-12-07T10:56:52Z',
                      incident_key: 'faaecfc0aca04b6ea07154188b5d3c6c',
                      resolve_reason: null,
                      conference_bridge: null,
                      escalation_policy: {
                        id: 'PB7HKU4',
                        self: 'https://api.pagerduty.com/escalation_policies/PB7HKU4',
                        type: 'escalation_policy_reference',
                        summary: 'Default',
                        html_url:
                          'https://rudderlabs-com.pagerduty.com/escalation_policies/PB7HKU4',
                      },
                    },
                    client: { url: 'https://monitoring.service.com', name: 'Monitoring Service' },
                    resourceType: 'incident',
                  },
                  integrations: { PagerDuty: false },
                  originalTimestamp: '2022-12-07T10:56:52.000Z',
                },
              ],
            },
          },
        ],
      },
    },
  },
  {
    name: 'pagerduty',
    description: 'Incident Priority Updated',
    module: 'source',
    version: 'v0',
    input: {
      request: {
        body: [
          {
            event: {
              id: '01DFU6P4VDDZCIHVQ5Q0ME99OE',
              event_type: 'incident.priority_updated',
              resource_type: 'incident',
              occurred_at: '2022-12-20T11:43:24.342Z',
              agent: {
                html_url: 'https://rudderlabs-com.pagerduty.com/users/PXZZD2E',
                id: 'PXZZD2E',
                self: 'https://api.pagerduty.com/users/user@1',
                summary: 'rudder test',
                type: 'user_reference',
              },
              client: null,
              data: {
                id: 'Q1KRTY75EUMGM0',
                type: 'incident',
                self: 'https://api.pagerduty.com/incidents/Q1KRTY75EUMGM0',
                html_url: 'https://rudderlabs-com.pagerduty.com/incidents/Q1KRTY75EUMGM0',
                number: 7,
                status: 'acknowledged',
                incident_key: 'a3e0e442f8b74a8c94298f19de0dcbed',
                created_at: '2022-12-20T11:37:19Z',
                title: 'Event Stream Failure',
                service: {
                  html_url: 'https://rudderlabs-com.pagerduty.com/services/PAJBUTT',
                  id: 'PAJBUTT',
                  self: 'https://api.pagerduty.com/services/PAJBUTT',
                  summary: 'Database',
                  type: 'service_reference',
                },
                assignees: [
                  {
                    html_url: 'https://rudderlabs-com.pagerduty.com/users/PXZZD2E',
                    id: 'PXZZD2E',
                    self: 'https://api.pagerduty.com/users/user@1',
                    summary: 'rudder test',
                    type: 'user_reference',
                  },
                ],
                escalation_policy: {
                  html_url: 'https://rudderlabs-com.pagerduty.com/escalation_policies/PB7HKU4',
                  id: 'PB7HKU4',
                  self: 'https://api.pagerduty.com/escalation_policies/PB7HKU4',
                  summary: 'Default',
                  type: 'escalation_policy_reference',
                },
                teams: [],
                priority: {
                  html_url: 'https://rudderlabs-com.pagerduty.com/account/incident_priorities',
                  id: 'PPMNDVQ',
                  self: 'https://api.pagerduty.com/priorities/PPMNDVQ',
                  summary: 'P1',
                  type: 'priority_reference',
                },
                urgency: 'high',
                conference_bridge: null,
                resolve_reason: null,
              },
            },
          },
        ],
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      },
      pathSuffix: '',
    },
    output: {
      response: {
        status: 200,
        body: [
          {
            output: {
              batch: [
                {
                  type: 'track',
                  event: 'Incident Priority Updated',
                  userId: 'PXZZD2E',
                  context: {
                    traits: {
                      id: 'PXZZD2E',
                      self: 'https://api.pagerduty.com/users/user@1',
                      type: 'user_reference',
                      summary: 'rudder test',
                      html_url: 'https://rudderlabs-com.pagerduty.com/users/PXZZD2E',
                    },
                    library: { name: 'unknown', version: 'unknown' },
                    integration: { name: 'PagerDuty' },
                  },
                  messageId: '01DFU6P4VDDZCIHVQ5Q0ME99OE',
                  properties: {
                    data: {
                      id: 'Q1KRTY75EUMGM0',
                      self: 'https://api.pagerduty.com/incidents/Q1KRTY75EUMGM0',
                      type: 'incident',
                      teams: [],
                      title: 'Event Stream Failure',
                      number: 7,
                      status: 'acknowledged',
                      service: {
                        id: 'PAJBUTT',
                        self: 'https://api.pagerduty.com/services/PAJBUTT',
                        type: 'service_reference',
                        summary: 'Database',
                        html_url: 'https://rudderlabs-com.pagerduty.com/services/PAJBUTT',
                      },
                      urgency: 'high',
                      html_url: 'https://rudderlabs-com.pagerduty.com/incidents/Q1KRTY75EUMGM0',
                      priority: {
                        id: 'PPMNDVQ',
                        self: 'https://api.pagerduty.com/priorities/PPMNDVQ',
                        type: 'priority_reference',
                        summary: 'P1',
                        html_url:
                          'https://rudderlabs-com.pagerduty.com/account/incident_priorities',
                      },
                      assignees: [
                        {
                          id: 'PXZZD2E',
                          self: 'https://api.pagerduty.com/users/user@1',
                          type: 'user_reference',
                          summary: 'rudder test',
                          html_url: 'https://rudderlabs-com.pagerduty.com/users/PXZZD2E',
                        },
                      ],
                      created_at: '2022-12-20T11:37:19Z',
                      incident_key: 'a3e0e442f8b74a8c94298f19de0dcbed',
                      resolve_reason: null,
                      conference_bridge: null,
                      escalation_policy: {
                        id: 'PB7HKU4',
                        self: 'https://api.pagerduty.com/escalation_policies/PB7HKU4',
                        type: 'escalation_policy_reference',
                        summary: 'Default',
                        html_url:
                          'https://rudderlabs-com.pagerduty.com/escalation_policies/PB7HKU4',
                      },
                    },
                    resourceType: 'incident',
                  },
                  integrations: { PagerDuty: false },
                  originalTimestamp: '2022-12-20T11:43:24.000Z',
                },
              ],
            },
          },
        ],
      },
    },
  },
  {
    name: 'pagerduty',
    description: 'Incident Responder Added',
    module: 'source',
    version: 'v0',
    input: {
      request: {
        body: [
          {
            event: {
              id: '01DFU6Z1ZCLMV9SEK3X5JZ5WLW',
              event_type: 'incident.responder.added',
              resource_type: 'incident',
              occurred_at: '2022-12-20T11:46:44.213Z',
              agent: {
                html_url: 'https://rudderlabs-com.pagerduty.com/users/PXZZD2E',
                id: 'PXZZD2E',
                self: 'https://api.pagerduty.com/users/user@1',
                summary: 'rudder test',
                type: 'user_reference',
              },
              client: null,
              data: {
                incident: {
                  html_url: 'https://rudderlabs-com.pagerduty.com/incidents/Q1KRTY75EUMGM0',
                  id: 'Q1KRTY75EUMGM0',
                  self: 'https://api.pagerduty.com/incidents/Q1KRTY75EUMGM0',
                  summary: 'Event Stream Failure',
                  type: 'incident_reference',
                },
                user: {
                  html_url: 'https://rudderlabs-com.pagerduty.com/users/PXZZD2E',
                  id: 'PXZZD2E',
                  self: 'https://api.pagerduty.com/users/user@1',
                  summary: 'rudder test',
                  type: 'user_reference',
                },
                escalation_policy: null,
                message: 'Please help with "Event Stream Failure"',
                state: 'pending',
                type: 'incident_responder',
              },
            },
          },
        ],
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      },
      pathSuffix: '',
    },
    output: {
      response: {
        status: 200,
        body: [
          {
            output: {
              batch: [
                {
                  type: 'track',
                  event: 'Incident Responder Added',
                  userId: 'PXZZD2E',
                  context: {
                    traits: {
                      id: 'PXZZD2E',
                      self: 'https://api.pagerduty.com/users/user@1',
                      type: 'user_reference',
                      summary: 'rudder test',
                      html_url: 'https://rudderlabs-com.pagerduty.com/users/PXZZD2E',
                    },
                    library: { name: 'unknown', version: 'unknown' },
                    integration: { name: 'PagerDuty' },
                  },
                  messageId: '01DFU6Z1ZCLMV9SEK3X5JZ5WLW',
                  properties: {
                    data: {
                      type: 'incident_responder',
                      user: {
                        id: 'PXZZD2E',
                        self: 'https://api.pagerduty.com/users/user@1',
                        type: 'user_reference',
                        summary: 'rudder test',
                        html_url: 'https://rudderlabs-com.pagerduty.com/users/PXZZD2E',
                      },
                      state: 'pending',
                      message: 'Please help with "Event Stream Failure"',
                      incident: {
                        id: 'Q1KRTY75EUMGM0',
                        self: 'https://api.pagerduty.com/incidents/Q1KRTY75EUMGM0',
                        type: 'incident_reference',
                        summary: 'Event Stream Failure',
                        html_url: 'https://rudderlabs-com.pagerduty.com/incidents/Q1KRTY75EUMGM0',
                      },
                      escalation_policy: null,
                    },
                    resourceType: 'incident',
                  },
                  integrations: { PagerDuty: false },
                  originalTimestamp: '2022-12-20T11:46:44.000Z',
                },
              ],
            },
          },
        ],
      },
    },
  },
  {
    name: 'pagerduty',
    description: 'Incident Escalated',
    module: 'source',
    version: 'v0',
    input: {
      request: {
        body: [
          {
            event: {
              id: '01DFU77KTKK9UUYX779UX0N1ZP',
              event_type: 'incident.escalated',
              resource_type: 'incident',
              occurred_at: '2022-12-20T11:49:35.385Z',
              agent: {
                html_url: 'https://rudderlabs-com.pagerduty.com/users/PXZZD2E',
                id: 'PXZZD2E',
                self: 'https://api.pagerduty.com/users/user@1',
                summary: 'rudder test',
                type: 'user_reference',
              },
              client: null,
              data: {
                id: 'Q1KRTY75EUMGM0',
                type: 'incident',
                self: 'https://api.pagerduty.com/incidents/Q1KRTY75EUMGM0',
                html_url: 'https://rudderlabs-com.pagerduty.com/incidents/Q1KRTY75EUMGM0',
                number: 7,
                status: 'triggered',
                incident_key: 'a3e0e442f8b74a8c94298f19de0dcbed',
                created_at: '2022-12-20T11:37:19Z',
                title: 'Event Stream Failure',
                service: {
                  html_url: 'https://rudderlabs-com.pagerduty.com/services/PAJBUTT',
                  id: 'PAJBUTT',
                  self: 'https://api.pagerduty.com/services/PAJBUTT',
                  summary: 'Database',
                  type: 'service_reference',
                },
                assignees: [
                  {
                    html_url: 'https://rudderlabs-com.pagerduty.com/users/PXZZD2E',
                    id: 'PXZZD2E',
                    self: 'https://api.pagerduty.com/users/user@1',
                    summary: 'rudder test',
                    type: 'user_reference',
                  },
                ],
                escalation_policy: {
                  html_url: 'https://rudderlabs-com.pagerduty.com/escalation_policies/PB7HKU4',
                  id: 'PB7HKU4',
                  self: 'https://api.pagerduty.com/escalation_policies/PB7HKU4',
                  summary: 'Default',
                  type: 'escalation_policy_reference',
                },
                teams: [],
                priority: {
                  html_url: 'https://rudderlabs-com.pagerduty.com/account/incident_priorities',
                  id: 'PPMNDVQ',
                  self: 'https://api.pagerduty.com/priorities/PPMNDVQ',
                  summary: 'P1',
                  type: 'priority_reference',
                },
                urgency: 'high',
                conference_bridge: null,
                resolve_reason: null,
              },
            },
          },
        ],
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      },
      pathSuffix: '',
    },
    output: {
      response: {
        status: 200,
        body: [
          {
            output: {
              batch: [
                {
                  type: 'track',
                  event: 'Incident Escalated',
                  userId: 'PXZZD2E',
                  context: {
                    traits: {
                      id: 'PXZZD2E',
                      self: 'https://api.pagerduty.com/users/user@1',
                      type: 'user_reference',
                      summary: 'rudder test',
                      html_url: 'https://rudderlabs-com.pagerduty.com/users/PXZZD2E',
                    },
                    library: { name: 'unknown', version: 'unknown' },
                    integration: { name: 'PagerDuty' },
                  },
                  messageId: '01DFU77KTKK9UUYX779UX0N1ZP',
                  properties: {
                    data: {
                      id: 'Q1KRTY75EUMGM0',
                      self: 'https://api.pagerduty.com/incidents/Q1KRTY75EUMGM0',
                      type: 'incident',
                      teams: [],
                      title: 'Event Stream Failure',
                      number: 7,
                      status: 'triggered',
                      service: {
                        id: 'PAJBUTT',
                        self: 'https://api.pagerduty.com/services/PAJBUTT',
                        type: 'service_reference',
                        summary: 'Database',
                        html_url: 'https://rudderlabs-com.pagerduty.com/services/PAJBUTT',
                      },
                      urgency: 'high',
                      html_url: 'https://rudderlabs-com.pagerduty.com/incidents/Q1KRTY75EUMGM0',
                      priority: {
                        id: 'PPMNDVQ',
                        self: 'https://api.pagerduty.com/priorities/PPMNDVQ',
                        type: 'priority_reference',
                        summary: 'P1',
                        html_url:
                          'https://rudderlabs-com.pagerduty.com/account/incident_priorities',
                      },
                      assignees: [
                        {
                          id: 'PXZZD2E',
                          self: 'https://api.pagerduty.com/users/user@1',
                          type: 'user_reference',
                          summary: 'rudder test',
                          html_url: 'https://rudderlabs-com.pagerduty.com/users/PXZZD2E',
                        },
                      ],
                      created_at: '2022-12-20T11:37:19Z',
                      incident_key: 'a3e0e442f8b74a8c94298f19de0dcbed',
                      resolve_reason: null,
                      conference_bridge: null,
                      escalation_policy: {
                        id: 'PB7HKU4',
                        self: 'https://api.pagerduty.com/escalation_policies/PB7HKU4',
                        type: 'escalation_policy_reference',
                        summary: 'Default',
                        html_url:
                          'https://rudderlabs-com.pagerduty.com/escalation_policies/PB7HKU4',
                      },
                    },
                    resourceType: 'incident',
                  },
                  integrations: { PagerDuty: false },
                  originalTimestamp: '2022-12-20T11:49:35.000Z',
                },
              ],
            },
          },
        ],
      },
    },
  },
  {
    name: 'pagerduty',
    description: 'Incident Resolved',
    module: 'source',
    version: 'v0',
    input: {
      request: {
        body: [
          {
            event: {
              id: '01DEN1HNLBC1VITK192ETJ1MPJ',
              event_type: 'incident.resolved',
              resource_type: 'incident',
              occurred_at: '2022-12-07T11:04:27.459Z',
              agent: {
                html_url: 'https://rudderlabs-com.pagerduty.com/users/PXZZD2E',
                id: 'PXZZD2E',
                self: 'https://api.pagerduty.com/users/user@1',
                summary: 'rudder test',
                type: 'user_reference',
              },
              client: null,
              data: {
                id: 'Q3S7IX2U5KTCOY',
                type: 'incident',
                self: 'https://api.pagerduty.com/incidents/Q3S7IX2U5KTCOY',
                html_url: 'https://rudderlabs-com.pagerduty.com/incidents/Q3S7IX2U5KTCOY',
                number: 2,
                status: 'resolved',
                incident_key: 'faaecfc0aca04b6ea07154188b5d3c6c',
                created_at: '2022-12-07T10:56:52Z',
                title: 'Server Crashed',
                service: {
                  html_url: 'https://rudderlabs-com.pagerduty.com/services/PAJBUTT',
                  id: 'PAJBUTT',
                  self: 'https://api.pagerduty.com/services/PAJBUTT',
                  summary: 'Database',
                  type: 'service_reference',
                },
                assignees: [],
                escalation_policy: {
                  html_url: 'https://rudderlabs-com.pagerduty.com/escalation_policies/PB7HKU4',
                  id: 'PB7HKU4',
                  self: 'https://api.pagerduty.com/escalation_policies/PB7HKU4',
                  summary: 'Default',
                  type: 'escalation_policy_reference',
                },
                teams: [],
                priority: {
                  html_url: 'https://rudderlabs-com.pagerduty.com/account/incident_priorities',
                  id: 'P5DBC3A',
                  self: 'https://api.pagerduty.com/priorities/P5DBC3A',
                  summary: 'P3',
                  type: 'priority_reference',
                },
                urgency: 'high',
                conference_bridge: { conference_number: '', conference_url: '' },
                resolve_reason: null,
              },
            },
          },
        ],
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      },
      pathSuffix: '',
    },
    output: {
      response: {
        status: 200,
        body: [
          {
            output: {
              batch: [
                {
                  type: 'track',
                  event: 'Incident Resolved',
                  userId: 'PXZZD2E',
                  context: {
                    traits: {
                      id: 'PXZZD2E',
                      self: 'https://api.pagerduty.com/users/user@1',
                      type: 'user_reference',
                      summary: 'rudder test',
                      html_url: 'https://rudderlabs-com.pagerduty.com/users/PXZZD2E',
                    },
                    library: { name: 'unknown', version: 'unknown' },
                    integration: { name: 'PagerDuty' },
                  },
                  messageId: '01DEN1HNLBC1VITK192ETJ1MPJ',
                  properties: {
                    data: {
                      id: 'Q3S7IX2U5KTCOY',
                      self: 'https://api.pagerduty.com/incidents/Q3S7IX2U5KTCOY',
                      type: 'incident',
                      teams: [],
                      title: 'Server Crashed',
                      number: 2,
                      status: 'resolved',
                      service: {
                        id: 'PAJBUTT',
                        self: 'https://api.pagerduty.com/services/PAJBUTT',
                        type: 'service_reference',
                        summary: 'Database',
                        html_url: 'https://rudderlabs-com.pagerduty.com/services/PAJBUTT',
                      },
                      urgency: 'high',
                      html_url: 'https://rudderlabs-com.pagerduty.com/incidents/Q3S7IX2U5KTCOY',
                      priority: {
                        id: 'P5DBC3A',
                        self: 'https://api.pagerduty.com/priorities/P5DBC3A',
                        type: 'priority_reference',
                        summary: 'P3',
                        html_url:
                          'https://rudderlabs-com.pagerduty.com/account/incident_priorities',
                      },
                      assignees: [],
                      created_at: '2022-12-07T10:56:52Z',
                      incident_key: 'faaecfc0aca04b6ea07154188b5d3c6c',
                      resolve_reason: null,
                      conference_bridge: { conference_url: '', conference_number: '' },
                      escalation_policy: {
                        id: 'PB7HKU4',
                        self: 'https://api.pagerduty.com/escalation_policies/PB7HKU4',
                        type: 'escalation_policy_reference',
                        summary: 'Default',
                        html_url:
                          'https://rudderlabs-com.pagerduty.com/escalation_policies/PB7HKU4',
                      },
                    },
                    resourceType: 'incident',
                  },
                  integrations: { PagerDuty: false },
                  originalTimestamp: '2022-12-07T11:04:27.000Z',
                },
              ],
            },
          },
        ],
      },
    },
  },
];
