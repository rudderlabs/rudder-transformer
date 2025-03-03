import { base64Convertor } from '@rudderstack/integrations-lib';

// Auto-generated masked secrets file

export const getAuthHeader_1 = () =>
  `Basic ${base64Convertor('myDummyUserName1/token' + ':' + getSecret_1())}`;
export const getSecret_1 = () => 'myDummyApiToken4';
export const getAuthHeader_2 = () =>
  `Basic ${base64Convertor('rudderlabtest2@email.com/token' + ':' + getSecret_2())}`;
export const getSecret_2 = () => 'dummyApiToken';
export const getAuthHeader_3 = () =>
  `Basic ${base64Convertor('test@rudder.com/token' + ':' + getSecret_1())}`;
export const getAuthHeader_4 = () =>
  `Basic ${base64Convertor('test@rudder.com/token' + ':' + getSecret_3())}`;
export const getSecret_3 = () => 'myDummyApiToken3';
export const getAuthHeader_5 = () =>
  `Basic ${base64Convertor('myDummyUserName2/token' + ':' + getSecret_4())}`;
export const getSecret_4 = () => 'myDummyApiToken2';
export const getAuthHeader_6 = () =>
  `Basic ${base64Convertor('rudderlabtest1@email.com/token' + ':' + getSecret_2())}`;
