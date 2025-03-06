import path from 'path';
import { base64Convertor } from '@rudderstack/integrations-lib';

export const secretPassword = path.basename(__dirname) + 1;
export const secretAccountToken = path.basename(__dirname) + 2;
export const secretInvalidToken = path.basename(__dirname) + 3;
export const secretAccessToken = path.basename(__dirname) + 4;
export const secretRefreshToken = path.basename(__dirname) + 5;

export const authHeaderAccessToken = `Bearer ${secretAccessToken}`;
