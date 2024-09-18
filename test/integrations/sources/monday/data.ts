export const data = [
  {
    name: 'monday',
    description: 'test-0',
    module: 'source',
    version: 'v0',
    input: {
      request: {
        body: [
          {
            event: {
              userId: 33556506,
              originalTriggerUuid: null,
              boardId: 3139815405,
              pulseId: 3160188786,
              pulseName: 'New Sprint Item',
              groupId: 'topics',
              groupName: 'Group Title',
              groupColor: '#579bfc',
              isTopGroup: true,
              columnValues: {},
              app: 'monday',
              type: 'create_pulse',
              triggerTime: '2022-08-30T09:02:39.191Z',
              subscriptionId: 150881106,
              triggerUuid: '049869226bf6711705c62e301a2c3eee',
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
                  event: 'Create Pulse',
                  context: {
                    library: { name: 'unknown', version: 'unknown' },
                    externalId: [{ id: 33556506, type: 'mondayUserId' }],
                    integration: { name: 'MONDAY' },
                  },
                  timestamp: '2022-08-30T09:02:39.191Z',
                  properties: {
                    app: 'monday',
                    type: 'create_pulse',
                    boardId: 3139815405,
                    groupId: 'topics',
                    pulseId: 3160188786,
                    groupName: 'Group Title',
                    pulseName: 'New Sprint Item',
                    groupColor: '#579bfc',
                    isTopGroup: true,
                    triggerUuid: '049869226bf6711705c62e301a2c3eee',
                    columnValues: {},
                    subscriptionId: 150881106,
                    originalTriggerUuid: null,
                  },
                  anonymousId: '6f0a3dc76a335860e17fa1d8ab779742e2ca',
                  integrations: { MONDAY: false },
                  originalTimestamp: '2022-08-30T09:02:39.191Z',
                },
              ],
            },
          },
        ],
      },
    },
  },
  {
    name: 'monday',
    description: 'test-1',
    module: 'source',
    version: 'v0',
    input: {
      request: {
        body: [
          {
            event: {
              userId: 33556506,
              originalTriggerUuid: null,
              boardId: 3139815405,
              itemId: 3160188786,
              itemName: 'New Sprint Item',
              app: 'monday',
              type: 'delete_pulse',
              triggerTime: '2022-08-30T09:06:09.176Z',
              subscriptionId: 150882006,
              triggerUuid: '4e4f87c8255c4ba4ba2f5e9934cb6d40',
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
                  event: 'Delete Pulse',
                  context: {
                    library: { name: 'unknown', version: 'unknown' },
                    externalId: [{ id: 33556506, type: 'mondayUserId' }],
                    integration: { name: 'MONDAY' },
                  },
                  timestamp: '2022-08-30T09:06:09.176Z',
                  properties: {
                    app: 'monday',
                    type: 'delete_pulse',
                    itemId: 3160188786,
                    boardId: 3139815405,
                    itemName: 'New Sprint Item',
                    triggerUuid: '4e4f87c8255c4ba4ba2f5e9934cb6d40',
                    subscriptionId: 150882006,
                    originalTriggerUuid: null,
                  },
                  anonymousId: '6f0a3dc76a335860e17fa1d8ab779742e2ca',
                  integrations: { MONDAY: false },
                  originalTimestamp: '2022-08-30T09:06:09.176Z',
                },
              ],
            },
          },
        ],
      },
    },
  },
  {
    name: 'monday',
    description: 'test-2',
    module: 'source',
    version: 'v0',
    input: {
      request: {
        body: [
          {
            event: {
              userId: 33556506,
              originalTriggerUuid: null,
              boardId: 3139815405,
              groupId: 'topics',
              pulseId: 3160181387,
              pulseName: 'New Sprint Item',
              columnId: 'status',
              columnType: 'color',
              columnTitle: 'Status',
              value: {
                label: {
                  index: 1,
                  text: 'Done',
                  style: { color: '#00c875', border: '#00B461', var_name: 'green-shadow' },
                  is_done: true,
                },
                post_id: null,
              },
              previousValue: null,
              changedAt: 1661859406.8970098,
              isTopGroup: true,
              app: 'monday',
              type: 'update_column_value',
              triggerTime: '2022-08-30T11:36:47.406Z',
              subscriptionId: 150894742,
              triggerUuid: '51730730740a9d00ec45203bd392a9bd',
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
                  event: 'Update Column Value',
                  context: {
                    library: { name: 'unknown', version: 'unknown' },
                    externalId: [{ id: 33556506, type: 'mondayUserId' }],
                    integration: { name: 'MONDAY' },
                  },
                  timestamp: '2022-08-30T11:36:47.406Z',
                  properties: {
                    app: 'monday',
                    type: 'update_column_value',
                    value: {
                      label: {
                        text: 'Done',
                        index: 1,
                        style: { color: '#00c875', border: '#00B461', var_name: 'green-shadow' },
                        is_done: true,
                      },
                      post_id: null,
                    },
                    boardId: 3139815405,
                    groupId: 'topics',
                    pulseId: 3160181387,
                    columnId: 'status',
                    changedAt: 1661859406.8970098,
                    pulseName: 'New Sprint Item',
                    columnType: 'color',
                    isTopGroup: true,
                    columnTitle: 'Status',
                    triggerUuid: '51730730740a9d00ec45203bd392a9bd',
                    previousValue: null,
                    subscriptionId: 150894742,
                    originalTriggerUuid: null,
                  },
                  anonymousId: '6f0a3dc76a335860e17fa1d8ab779742e2ca',
                  integrations: { MONDAY: false },
                  originalTimestamp: '2022-08-30T11:36:47.406Z',
                },
              ],
            },
          },
        ],
      },
    },
  },
  {
    name: 'monday',
    description: 'test-3',
    module: 'source',
    version: 'v0',
    input: {
      request: {
        body: [
          {
            event: {
              userId: 33556506,
              originalTriggerUuid: null,
              boardId: 3139815405,
              groupId: 'topics',
              pulseId: 3160181387,
              value: { name: 'New Sprint Item renamed' },
              previousValue: { name: 'New Sprint Item' },
              app: 'monday',
              type: 'update_name',
              triggerTime: '2022-08-30T11:40:17.351Z',
              subscriptionId: 150910867,
              triggerUuid: '05ce13d32d0256c4fb7dd5de25b1a1ba',
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
                  event: 'Update Name',
                  context: {
                    library: { name: 'unknown', version: 'unknown' },
                    externalId: [{ id: 33556506, type: 'mondayUserId' }],
                    integration: { name: 'MONDAY' },
                  },
                  timestamp: '2022-08-30T11:40:17.351Z',
                  properties: {
                    app: 'monday',
                    type: 'update_name',
                    value: { name: 'New Sprint Item renamed' },
                    boardId: 3139815405,
                    groupId: 'topics',
                    pulseId: 3160181387,
                    triggerUuid: '05ce13d32d0256c4fb7dd5de25b1a1ba',
                    previousValue: { name: 'New Sprint Item' },
                    subscriptionId: 150910867,
                    originalTriggerUuid: null,
                  },
                  anonymousId: '6f0a3dc76a335860e17fa1d8ab779742e2ca',
                  integrations: { MONDAY: false },
                  originalTimestamp: '2022-08-30T11:40:17.351Z',
                },
              ],
            },
          },
        ],
      },
    },
  },
  {
    name: 'monday',
    description: 'test-4',
    module: 'source',
    version: 'v0',
    input: {
      request: {
        body: [
          {
            event: {
              userId: 33556506,
              originalTriggerUuid: null,
              boardId: 3160805239,
              pulseId: 3161163765,
              pulseName: 'new subitem',
              groupId: 'topics',
              groupName: 'Subitems',
              groupColor: '#579bfc',
              isTopGroup: true,
              columnValues: {},
              app: 'monday',
              type: 'create_pulse',
              triggerTime: '2022-08-30T12:56:27.281Z',
              subscriptionId: 150911592,
              triggerUuid: '70a2219427804e47a508a91b5c244543',
              parentItemId: '3160181387',
              parentItemBoardId: '3139815405',
              itemId: 3161163765,
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
                  event: 'Create Pulse',
                  context: {
                    library: { name: 'unknown', version: 'unknown' },
                    externalId: [{ id: 33556506, type: 'mondayUserId' }],
                    integration: { name: 'MONDAY' },
                  },
                  timestamp: '2022-08-30T12:56:27.281Z',
                  properties: {
                    app: 'monday',
                    type: 'create_pulse',
                    itemId: 3161163765,
                    boardId: 3160805239,
                    groupId: 'topics',
                    pulseId: 3161163765,
                    groupName: 'Subitems',
                    pulseName: 'new subitem',
                    groupColor: '#579bfc',
                    isTopGroup: true,
                    triggerUuid: '70a2219427804e47a508a91b5c244543',
                    columnValues: {},
                    parentItemId: '3160181387',
                    subscriptionId: 150911592,
                    parentItemBoardId: '3139815405',
                    originalTriggerUuid: null,
                  },
                  anonymousId: '6f0a3dc76a335860e17fa1d8ab779742e2ca',
                  integrations: { MONDAY: false },
                  originalTimestamp: '2022-08-30T12:56:27.281Z',
                },
              ],
            },
          },
        ],
      },
    },
  },
  {
    name: 'monday',
    description: 'test-5',
    module: 'source',
    version: 'v0',
    input: {
      request: {
        body: [
          {
            event: {
              userId: 33556506,
              originalTriggerUuid: null,
              boardId: 3139815405,
              itemId: 3160181387,
              itemName: 'New Sprint Item renamed',
              app: 'monday',
              type: 'archive_pulse',
              triggerTime: '2022-08-30T12:58:15.844Z',
              subscriptionId: 150925947,
              triggerUuid: 'aa8bd5dbb6fd592aedd57322dd776379',
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
                  event: 'Archive Pulse',
                  context: {
                    library: { name: 'unknown', version: 'unknown' },
                    externalId: [{ id: 33556506, type: 'mondayUserId' }],
                    integration: { name: 'MONDAY' },
                  },
                  timestamp: '2022-08-30T12:58:15.844Z',
                  properties: {
                    app: 'monday',
                    type: 'archive_pulse',
                    itemId: 3160181387,
                    boardId: 3139815405,
                    itemName: 'New Sprint Item renamed',
                    triggerUuid: 'aa8bd5dbb6fd592aedd57322dd776379',
                    subscriptionId: 150925947,
                    originalTriggerUuid: null,
                  },
                  anonymousId: '6f0a3dc76a335860e17fa1d8ab779742e2ca',
                  integrations: { MONDAY: false },
                  originalTimestamp: '2022-08-30T12:58:15.844Z',
                },
              ],
            },
          },
        ],
      },
    },
  },
];
