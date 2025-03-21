import { Destination, Connection } from '../../../../src/types';

const destType = 'zoho';
const destTypeInUpperCase = 'ZOHO';
const advertiserId = 'test-advertiser-id';
const dataProviderId = 'rudderstack';
const segmentName = 'test-segment';
const leadUpsertEndpoint = 'https://www.zohoapis.in/crm/v6/Leads/upsert';

const deletionPayload1 = {
  action: 'delete',
  context: {
    sources: {
      job_run_id: 'cgiiurt8um7k7n5dq480',
      task_run_id: 'cgiiurt8um7k7n5dq48g',
      job_id: '2MUWghI7u85n91dd1qzGyswpZan',
      version: '895/merge',
    },
  },
  recordId: '2',
  rudderId: '2',
  fields: {
    First_Name: 'subcribed',
    Last_Name: ' User',
  },
  identifiers: {
    Email: 'tobedeleted@gmail.com',
  },
  type: 'record',
};

const commonDeletionDestConfig: Destination = {
  ID: '345',
  Name: 'Test',
  Enabled: true,
  WorkspaceID: '',
  Transformations: [],
  DestinationDefinition: {
    ID: '345',
    Name: 'Test',
    DisplayName: 'ZOHO',
    Config: {
      cdkV2Enabled: true,
      excludeKeys: [],
      includeKeys: [],
    },
  },
  Config: {
    region: 'IN',
    module: 'Leads',
    trigger: 'None',
    addDefaultDuplicateCheck: true,
    multiSelectFieldLevelDecision: [
      {
        from: 'multi-language',
        to: 'true',
      },
      {
        from: 'multi class',
        to: 'false',
      },
    ],
  },
};

const commonDeletionDestConfig2: Destination = {
  ID: '345',
  Name: 'Test',
  Enabled: true,
  WorkspaceID: '',
  Transformations: [],
  DestinationDefinition: {
    ID: '345',
    Name: 'Test',
    DisplayName: 'ZOHO',
    Config: {
      cdkV2Enabled: true,
      excludeKeys: [],
      includeKeys: [],
    },
  },
  Config: {
    region: 'IN',
    module: 'Contacts',
    trigger: 'None',
    addDefaultDuplicateCheck: true,
    multiSelectFieldLevelDecision: [
      {
        from: 'multi-language',
        to: 'true',
      },
      {
        from: 'multi class',
        to: 'false',
      },
    ],
  },
};

const commonDeletionConnectionConfig: Connection = {
  sourceId: '2t1wMHLftBHKN1XzcfU4v7JTQTg',
  destinationId: '2tCmPNvYHqCUgcRva2XN52ZaYHk',
  enabled: true,
  processorEnabled: true,
  config: {
    destination: {
      object: 'Leads',
      trigger: 'None',
      schemaVersion: '1.1',
      identifierMappings: [
        {
          from: 'email',
          to: 'Email',
        },
      ],
      addDefaultDuplicateCheck: true,
      multiSelectFieldLevelDecision: [
        { from: 'multi-language', to: 'true' },
        { from: 'multi class', to: 'false' },
      ],
    },
  },
};

const upsertPayload1 = {
  action: 'insert',
  context: {
    sources: {
      job_run_id: 'cgiiurt8um7k7n5dq480',
      task_run_id: 'cgiiurt8um7k7n5dq48g',
      job_id: '2MUWghI7u85n91dd1qzGyswpZan',
      version: '895/merge',
    },
  },
  recordId: '2',
  rudderId: '2',
  fields: {
    First_Name: 'subcribed',
    Last_Name: ' User',
  },
  identifiers: {
    Email: 'subscribed@eewrfrd.com',
  },
  type: 'record',
};

const upsertPayload2 = {
  action: 'insert',
  context: {
    sources: {
      job_run_id: 'cgiiurt8um7k7n5dq480',
      task_run_id: 'cgiiurt8um7k7n5dq48g',
      job_id: '2MUWghI7u85n91dd1qzGyswpZan',
      version: '895/merge',
    },
  },
  recordId: '2',
  rudderId: '2',
  fields: {
    First_Name: 'subcribed',
    Last_Name: ' User',
    'multi-language': 'Bengali',
  },
  identifiers: {
    Email: 'subscribed@eewrfrd.com',
  },
  type: 'record',
};

const upsertPayload3 = {
  action: 'insert',
  context: {
    sources: {
      job_run_id: 'cgiiurt8um7k7n5dq480',
      task_run_id: 'cgiiurt8um7k7n5dq48g',
      job_id: '2MUWghI7u85n91dd1qzGyswpZan',
      version: '895/merge',
    },
  },
  recordId: '2',
  rudderId: '2',
  fields: {
    First_Name: 'subcribed',
    Last_Name: ' User',
  },
  identifiers: {
    Email: 'subscribed@eewrfrd.com',
  },
  type: 'record',
};

const commonUpsertDestConfig: Destination = {
  ID: '345',
  Name: 'Test',
  Enabled: true,
  WorkspaceID: '',
  Transformations: [],
  DestinationDefinition: {
    ID: '345',
    Name: 'Test',
    DisplayName: 'ZOHO',
    Config: {
      cdkV2Enabled: true,
      excludeKeys: [],
      includeKeys: [],
    },
  },
  Config: {
    region: 'US',
    module: 'Leads',
    trigger: 'workflow',
    addDefaultDuplicateCheck: true,
    multiSelectFieldLevelDecision: [
      {
        from: 'multi-language',
        to: 'true',
      },
      {
        from: 'multi class',
        to: 'false',
      },
    ],
  },
};

const commonUpsertDestConfig2: Destination = {
  ID: '345',
  Name: 'Test',
  Enabled: true,
  WorkspaceID: '',
  Transformations: [],
  DestinationDefinition: {
    ID: '345',
    Name: 'Test',
    DisplayName: 'ZOHO',
    Config: {
      cdkV2Enabled: true,
      excludeKeys: [],
      includeKeys: [],
    },
  },
  Config: {
    region: 'US',
    module: 'Leads',
    trigger: 'None',
    addDefaultDuplicateCheck: true,
    multiSelectFieldLevelDecision: [
      {
        from: 'multi-language',
        to: 'true',
      },
      {
        from: 'multi class',
        to: 'false',
      },
    ],
  },
};

const commonUpsertDestConfig2CustomModule: Destination = {
  ID: '345',
  Name: 'Test',
  Enabled: true,
  WorkspaceID: '',
  Transformations: [],
  DestinationDefinition: {
    ID: '345',
    Name: 'Test',
    DisplayName: 'ZOHO',
    Config: {
      cdkV2Enabled: true,
      excludeKeys: [],
      includeKeys: [],
    },
  },
  Config: {
    region: 'US',
    module: 'CUSTOM',
    trigger: 'None',
    addDefaultDuplicateCheck: true,
    multiSelectFieldLevelDecision: [
      {
        from: 'multi-language',
        to: 'true',
      },
      {
        from: 'multi class',
        to: 'false',
      },
    ],
  },
};

const commonUpsertDestConfig3: Destination = {
  ID: '345',
  Name: 'Test',
  Enabled: true,
  WorkspaceID: '',
  Transformations: [],
  DestinationDefinition: {
    ID: '345',
    Name: 'Test',
    DisplayName: 'ZOHO',
    Config: {
      cdkV2Enabled: true,
      excludeKeys: [],
      includeKeys: [],
    },
  },
  Config: {
    region: 'US',
    module: 'Leads',
    trigger: 'workflow',
    addDefaultDuplicateCheck: true,
  },
};

const commonOutput1 = {
  duplicate_check_fields: ['Email'],
  data: [
    {
      Email: 'subscribed@eewrfrd.com',
      First_Name: 'subcribed',
      Last_Name: ' User',
    },
  ],
  $append_values: {},
  trigger: ['workflow'],
};

const commonConnectionConfig: Connection = {
  sourceId: '2t1wMHLftBHKN1XzcfU4v7JTQTg',
  destinationId: '2tCmPNvYHqCUgcRva2XN52ZaYHk',
  enabled: true,
  processorEnabled: true,
  config: {
    destination: {
      object: 'Leads',
      trigger: 'workflow',
      schemaVersion: '1.1',
      addDefaultDuplicateCheck: true,
      identifierMappings: [
        {
          from: 'email',
          to: 'email',
        },
      ],
      multiSelectFieldLevelDecision: [
        { from: 'multi-language', to: 'true' },
        { from: 'multi class', to: 'false' },
      ],
    },
  },
};

const commonConnectionConfig2: Connection = {
  sourceId: '2t1wMHLftBHKN1XzcfU4v7JTQTg',
  destinationId: '2tCmPNvYHqCUgcRva2XN52ZaYHk',
  enabled: true,
  processorEnabled: true,
  config: {
    destination: {
      object: 'Leads',
      trigger: 'None',
      schemaVersion: '1.1',
      addDefaultDuplicateCheck: true,
      identifierMappings: [
        {
          from: 'email',
          to: 'email',
        },
      ],
      multiSelectFieldLevelDecision: [
        { from: 'multi-language', to: 'true' },
        { from: 'multi class', to: 'false' },
      ],
    },
  },
};

const commonConnectionConfigCustomModule: Connection = {
  sourceId: '2t1wMHLftBHKN1XzcfU4v7JTQTg',
  destinationId: '2tCmPNvYHqCUgcRva2XN52ZaYHk',
  enabled: true,
  processorEnabled: true,
  config: {
    destination: {
      object: 'CUSTOM',
      trigger: 'None',
      schemaVersion: '1.1',
      addDefaultDuplicateCheck: true,
      identifierMappings: [
        {
          from: 'email',
          to: 'Email',
        },
      ],
      multiSelectFieldLevelDecision: [
        { from: 'multi-language', to: 'true' },
        { from: 'multi class', to: 'false' },
      ],
    },
  },
};

const commonConnectionConfig3: Connection = {
  sourceId: '2t1wMHLftBHKN1XzcfU4v7JTQTg',
  destinationId: '2tCmPNvYHqCUgcRva2XN52ZaYHk',
  enabled: true,
  processorEnabled: true,
  config: {
    destination: {
      object: 'Leads',
      trigger: 'workflow',
      schemaVersion: '1.1',
      addDefaultDuplicateCheck: true,
      identifierMappings: [
        {
          from: 'email',
          to: 'Email',
        },
      ],
    },
  },
};

const commonConnectionConfig4: Connection = {
  sourceId: '2t1wMHLftBHKN1XzcfU4v7JTQTg',
  destinationId: '2tCmPNvYHqCUgcRva2XN52ZaYHk',
  enabled: true,
  processorEnabled: true,
  config: {
    destination: {
      object: 'Contacts',
      trigger: 'None',
      schemaVersion: '1.1',
      addDefaultDuplicateCheck: true,
      identifierMappings: [
        {
          from: 'email',
          to: 'email',
        },
      ],
      multiSelectFieldLevelDecision: [
        { from: 'multi-language', to: 'true' },
        { from: 'multi class', to: 'false' },
      ],
    },
  },
};

export {
  destType,
  destTypeInUpperCase,
  advertiserId,
  dataProviderId,
  segmentName,
  leadUpsertEndpoint,
  deletionPayload1,
  commonDeletionDestConfig,
  commonDeletionDestConfig2,
  upsertPayload1,
  upsertPayload2,
  upsertPayload3,
  commonUpsertDestConfig,
  commonUpsertDestConfig2,
  commonOutput1,
  commonUpsertDestConfig3,
  commonUpsertDestConfig2CustomModule,
  commonConnectionConfig,
  commonConnectionConfig2,
  commonConnectionConfig3,
  commonConnectionConfig4,
  commonConnectionConfigCustomModule,
  commonDeletionConnectionConfig,
};
