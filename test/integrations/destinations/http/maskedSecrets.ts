import { base64Convertor } from '@rudderstack/integrations-lib';

// Auto-generated masked secrets file

export const getAuthHeader_1 = () => `Basic ${base64Convertor(getSecret_1() + ':' + '')}`;
export const getSecret_1 = () => 'test-user';
export const getAuthHeader_2 = () => `Bearer ${getSecret_2()}`;
export const getSecret_2 = () => 'test-token';
