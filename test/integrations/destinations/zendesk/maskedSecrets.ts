import path from 'path';
import { base64Convertor } from '@rudderstack/integrations-lib';

export const secret1 = path.basename(__dirname) + 1;
export const secret2 = path.basename(__dirname) + 2;
export const secret3 = path.basename(__dirname) + 3;
export const secret4 = path.basename(__dirname) + 4;
export const authHeader1 = `Basic ${base64Convertor('myDummyUserName1/token' + ':' + secret1)}`;
export const authHeader2 = `Basic ${base64Convertor('rudderlabtest2@email.com/token' + ':' + secret2)}`;
export const authHeader3 = `Basic ${base64Convertor('test@rudder.com/token' + ':' + secret1)}`;
export const authHeader4 = `Basic ${base64Convertor('test@rudder.com/token' + ':' + secret3)}`;
export const authHeader5 = `Basic ${base64Convertor('myDummyUserName2/token' + ':' + secret4)}`;
export const authHeader6 = `Basic ${base64Convertor('rudderlabtest1@email.com/token' + ':' + secret2)}`;
