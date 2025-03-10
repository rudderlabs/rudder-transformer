import path from 'path';
import { base64Convertor } from '@rudderstack/integrations-lib';

export const secret1 = path.basename(__dirname) + 1;
export const secret2 = path.basename(__dirname) + 2;
export const secret3 = path.basename(__dirname) + 3;
export const secret4 = path.basename(__dirname) + 4;
export const authHeader1 = `Basic ${secret1}`;
export const authHeader2 = `Basic ${secret2}`;
export const authHeader3 = `Basic ${secret3}`;
export const authHeader4 = `Basic ${secret4}`;
