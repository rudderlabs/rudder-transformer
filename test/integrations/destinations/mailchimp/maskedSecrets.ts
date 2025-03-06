import path from 'path';
import { base64Convertor } from '@rudderstack/integrations-lib';

export const secret1 = path.basename(__dirname) + 1;
export const secret2 = path.basename(__dirname) + 2;
export const secret3 = path.basename(__dirname) + 3;
export const authHeader1 = `Basic ${base64Convertor('apiKey' + ':' + secret1)}`;
export const authHeader2 = `Basic ${base64Convertor('apiKey' + ':' + secret2)}`;
export const authHeader3 = `Basic ${base64Convertor('apiKey' + ':' + secret3)}`;
