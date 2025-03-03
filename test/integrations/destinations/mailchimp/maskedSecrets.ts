import { base64Convertor } from '@rudderstack/integrations-lib';

// Auto-generated masked secrets file

export const getAuthHeader_1 = () => `Basic ${base64Convertor('apiKey' + ':' + getSecret_1())}`;
export const getSecret_1 = () => 'apiKey-dummyApiKey';
export const getAuthHeader_2 = () => `Basic ${base64Convertor('apiKey' + ':' + getSecret_2())}`;
export const getSecret_2 = () => 'dummyApiKey';
export const getAuthHeader_3 = () => `Basic ${base64Convertor('apiKey' + ':' + getSecret_3())}`;
export const getSecret_3 = () => 'apikey';
