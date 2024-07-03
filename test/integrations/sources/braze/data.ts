export const data = [
  {
    name: 'braze',
    description: 'event mapping done in UI',
    module: 'source',
    version: 'v1',
    input: {
      request: {
        body: [
          {
            event: {
              events: [
                {
                  event_type: 'users.messages.inappmessage.Click',
                  properties: {
                    device_model: 'samsung',
                  },
                  user: {
                    user_id: 'user_id',
                    external_user_id: 'externalUserId',
                  },
                },
              ],
            },
            source: {
              ID: '2hgvYyU5TYaFvVzBge6tF2UKoeG',
              OriginalID: '',
              Name: 'Braze source',
              SourceDefinition: {
                ID: '1lh9senY3vrBg4JQXswWzyYBTOO',
                Name: 'Braze',
                Category: 'webhook',
                Type: 'cloud',
              },
              Config: {
                customMapping: [
                  {
                    from: 'users.messages.inappmessage.Click',
                    to: 'In-App Message Clicked',
                  },
                ],
                eventUpload: true,
                eventUploadTS: 1719979696938,
              },
              Enabled: true,
              WorkspaceID: '2hSS1hZ8kuCpUZAAYsQucAFdob9',
              Destinations: null,
              WriteKey: '2hgvYykpvMaE5Eg47Au8RWC9Yza',
              DgSourceTrackingPlanConfig: {
                sourceId: '',
                version: 0,
                config: null,
                mergedConfig: null,
                deleted: false,
                trackingPlan: {
                  id: '',
                  version: 0,
                },
              },
              Transient: false,
              GeoEnrichment: {
                Enabled: false,
              },
            },
          },
        ],
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
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
                  anonymousId: 'user_id',
                  context: {
                    device: {
                      model: 'samsung',
                    },
                    integration: {
                      name: 'Braze',
                    },
                    library: {
                      name: 'unknown',
                      version: 'unknown',
                    },
                  },
                  event: 'In-App Message Clicked',
                  integrations: {
                    Braze: false,
                  },
                  type: 'track',
                  userId: 'externalUserId',
                },
              ],
            },
          },
        ],
      },
    },
  },
  {
    name: 'braze',
    description: 'The event is not mapped in the UI',
    module: 'source',
    version: 'v1',
    input: {
      request: {
        body: [
          {
            event: {
              events: [
                {
                  event_type: 'users.messages.inappmessage.Click',
                  properties: {
                    device_model: 'samsung',
                  },
                  user: {
                    user_id: 'user_id',
                    external_user_id: 'externalUserId',
                  },
                },
              ],
            },
            source: {
              ID: '2hgvYyU5TYaFvVzBge6tF2UKoeG',
              OriginalID: '',
              Name: 'Braze source',
              SourceDefinition: {
                ID: '1lh9senY3vrBg4JQXswWzyYBTOO',
                Name: 'Braze',
                Category: 'webhook',
                Type: 'cloud',
              },
              Config: {
                customMapping: [
                  {
                    from: 'randomEvent',
                    to: 'In-App Message Clicked',
                  },
                ],
                eventUpload: true,
                eventUploadTS: 1719979696938,
              },
              Enabled: true,
              WorkspaceID: '2hSS1hZ8kuCpUZAAYsQucAFdob9',
              Destinations: null,
              WriteKey: '2hgvYykpvMaE5Eg47Au8RWC9Yza',
              DgSourceTrackingPlanConfig: {
                sourceId: '',
                version: 0,
                config: null,
                mergedConfig: null,
                deleted: false,
                trackingPlan: {
                  id: '',
                  version: 0,
                },
              },
              Transient: false,
              GeoEnrichment: {
                Enabled: false,
              },
            },
          },
        ],
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
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
                  anonymousId: 'user_id',
                  context: {
                    device: {
                      model: 'samsung',
                    },
                    integration: {
                      name: 'Braze',
                    },
                    library: {
                      name: 'unknown',
                      version: 'unknown',
                    },
                  },
                  event: 'users.messages.inappmessage.Click',
                  integrations: {
                    Braze: false,
                  },
                  type: 'track',
                  userId: 'externalUserId',
                },
              ],
            },
          },
        ],
      },
    },
  },
];
