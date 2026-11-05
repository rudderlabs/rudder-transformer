import path from 'path';
import { base64Convertor } from '@rudderstack/integrations-lib';

export const secret1 = path.basename(__dirname) + 1;
export const secret2 = path.basename(__dirname) + 2;
export const authHeader1 = `Basic ${base64Convertor(secret1 + ':' + '')}`;
export const authHeader2 = `Bearer ${secret2}`;
export const v2BearerToken = 'http-v2-private-bearer-token';
export const v2BasicPassword = 'http-v2-private-basic-password';
export const v2ApiKeyValue = 'http-v2-private-api-key-value';
