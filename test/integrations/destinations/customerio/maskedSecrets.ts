import path from 'path';
import { base64Convertor } from '@rudderstack/integrations-lib';

export const secret1 = path.basename(__dirname) + 1;
export const secret2 = path.basename(__dirname) + 2;
export const secret3 = path.basename(__dirname) + 3;
export const secret4 = path.basename(__dirname) + 4;
export const secret5 = path.basename(__dirname) + 5;
export const secret6 = path.basename(__dirname) + 6;
export const secret7 = path.basename(__dirname) + 7;
export const secret8 = path.basename(__dirname) + 8;
export const authHeader1 = `Basic ${base64Convertor(secret1 + ':' + secret2)}`;
export const authHeader2 = `Basic ${base64Convertor(secret3 + ':' + secret4)}`;
export const authHeader3 = `Basic ${base64Convertor(secret5 + ':' + secret6)}`;
export const authHeader4 = `Basic ${base64Convertor(secret7 + ':' + secret8)}`;
