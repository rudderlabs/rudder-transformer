import path from 'path';
import { base64Convertor } from '@rudderstack/integrations-lib';

export const secret1 = path.basename(__dirname) + 1;
export const defaultSenderId = path.basename(__dirname) + 2;
export const defaultSenderPhoneNumber = '+15550000001';
export const authHeader1 = `Basic ${base64Convertor(secret1 + ':' + secret1)}`;
