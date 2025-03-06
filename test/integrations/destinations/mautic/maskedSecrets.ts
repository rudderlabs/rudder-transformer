import path from 'path';
import { base64Convertor } from '@rudderstack/integrations-lib';

export const secret1 = path.basename(__dirname) + 1;
export const secret2 = path.basename(__dirname) + 2;
export const secret3 = path.basename(__dirname) + 3;
export const secret4 = path.basename(__dirname) + 4;
export const authHeader1 = `Basic ${base64Convertor(secret1 + ':' + secret2)}`;
export const authHeader2 = `Basic ${base64Convertor(secret3 + ':' + secret2)}`;
export const authHeader3 = `Basic ${base64Convertor(secret4 + ':' + secret2)}`;
