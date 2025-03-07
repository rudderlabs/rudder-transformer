import path from 'path';
import { base64Convertor } from '@rudderstack/integrations-lib';

export const secret1 = path.basename(__dirname) + 1;
export const secret2 = path.basename(__dirname) + 2;
export const authHeader1 = `Basic ${secret1}`;
export const authHeader2 = `Basic ${secret2}`;
