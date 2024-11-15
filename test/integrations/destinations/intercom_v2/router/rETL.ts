import { RouterTransformationRequest } from '../../../../../src/types';
import { destination } from '../common';
import { generateMetadata } from '../../../testUtils';

export const rETLRecordV2RouterRequest: RouterTransformationRequest = {
  input: [
    {
      destination,
      message: {
        type: 'record',
        action: 'insert',
        fields: {
          external_id: 'rEtl_external_id',
        },
        channel: 'sources',
        context: {
          sources: {
            job_id: 'job-id',
            version: 'local',
            job_run_id: 'job_run_id',
            task_run_id: 'job_run_id',
          },
        },
        recordId: '1',
        rudderId: '1',
        identifiers: {
          email: 'test-rETL-unavailable@gmail.com',
        },
      },
      metadata: generateMetadata(1),
    },
    {
      destination,
      message: {
        type: 'record',
        action: 'update',
        fields: {
          external_id: 'rEtl_external_id',
        },
        channel: 'sources',
        context: {
          sources: {
            job_id: 'job-id',
            version: 'local',
            job_run_id: 'job_run_id',
            task_run_id: 'job_run_id',
          },
        },
        recordId: '2',
        rudderId: '2',
        identifiers: {
          email: 'test-rETL-available@gmail.com',
        },
      },
      metadata: generateMetadata(2),
    },
    {
      destination,
      message: {
        type: 'record',
        action: 'delete',
        fields: {
          external_id: 'rEtl_external_id',
        },
        channel: 'sources',
        context: {
          sources: {
            job_id: 'job-id',
            version: 'local',
            job_run_id: 'job_run_id',
            task_run_id: 'job_run_id',
          },
        },
        recordId: '3',
        rudderId: '3',
        identifiers: {
          email: 'test-rETL-available@gmail.com',
        },
      },
      metadata: generateMetadata(3),
    },
    {
      destination,
      message: {
        type: 'record',
        action: 'update',
        fields: {
          external_id: 'rEtl_external_id',
        },
        channel: 'sources',
        context: {
          sources: {
            job_id: 'job-id',
            version: 'local',
            job_run_id: 'job_run_id',
            task_run_id: 'job_run_id',
          },
        },
        recordId: '1',
        rudderId: '1',
        identifiers: {
          email: 'test-rETL-unavailable@gmail.com',
        },
      },
      metadata: generateMetadata(4),
    },
    {
      destination,
      message: {
        type: 'record',
        action: 'insert',
        fields: {
          external_id: 'rEtl_external_id',
        },
        channel: 'sources',
        context: {
          sources: {
            job_id: 'job-id',
            version: 'local',
            job_run_id: 'job_run_id',
            task_run_id: 'job_run_id',
          },
        },
        recordId: '1',
        rudderId: '1',
        identifiers: {
          email: 'test-rETL-available@gmail.com',
        },
      },
      metadata: generateMetadata(5),
    },
    {
      destination,
      message: {
        type: 'record',
        action: 'dummyAction',
        fields: {
          external_id: 'rEtl_external_id',
        },
        channel: 'sources',
        context: {
          sources: {
            job_id: 'job-id',
            version: 'local',
            job_run_id: 'job_run_id',
            task_run_id: 'job_run_id',
          },
        },
        recordId: '1',
        rudderId: '1',
        identifiers: {
          email: 'test-rETL-available@gmail.com',
        },
      },
      metadata: generateMetadata(6),
    },
    {
      destination,
      message: {
        type: 'record',
        action: 'insert',
        fields: {
          external_id: 'rEtl_external_id',
        },
        channel: 'sources',
        context: {
          sources: {
            job_id: 'job-id',
            version: 'local',
            job_run_id: 'job_run_id',
            task_run_id: 'job_run_id',
          },
        },
        recordId: '1',
        rudderId: '1',
        identifiers: {},
      },
      metadata: generateMetadata(7),
    },
  ],
  destType: 'intercom_v2',
};
