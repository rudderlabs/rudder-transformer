import { APIClient } from '../type';
import { APIClientV1 } from './version1';
import { APIClientV2 } from './version2';

const APIClientFactory = {
  createClient(version: string): APIClient {
    if (version === 'v1') {
      return new APIClientV1();
    }
    if (version === 'v2') {
      return new APIClientV2();
    }

    throw new Error('Unsupported API version');
  },
};

export { APIClientFactory };
