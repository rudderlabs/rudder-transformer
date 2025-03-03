import { base64Convertor } from '@rudderstack/integrations-lib';

// Auto-generated masked secrets file

export const getAuthHeader_1 = () =>
  `Basic ${base64Convertor(getSecret_1() + ':' + getSecret_2())}`;
export const getSecret_1 = () => 'TestRudderlabs45823@gmail.com';
export const getSecret_2 = () => 'dummyPassword';
export const getAuthHeader_2 = () =>
  `Basic ${base64Convertor(getSecret_3() + ':' + getSecret_2())}`;
export const getSecret_3 = () => 'Test45823Rudderlabs@gmail.com';
export const getAuthHeader_3 = () =>
  `Basic ${base64Convertor(getSecret_4() + ':' + getSecret_2())}`;
export const getSecret_4 = () => 'abcdef@gmail.com';
