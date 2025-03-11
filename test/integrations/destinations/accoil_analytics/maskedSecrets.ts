import path from 'path';
import { base64Convertor } from '@rudderstack/integrations-lib';

export const secret1 = path.basename(__dirname) + 1;
export const secret2 = `stg_` + path.basename(__dirname) + 1;

export const authHeader1 = `Basic ${base64Convertor(secret1 + ':')}`;
export const authHeader2 = `Basic ${base64Convertor(secret2 + ':')}`;
