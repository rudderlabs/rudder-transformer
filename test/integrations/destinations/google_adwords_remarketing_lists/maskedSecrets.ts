import path from 'path';

import { defaultAccessToken } from '../../common/secrets';

export const secret1 = path.basename(__dirname) + 1;
export const secret2 = path.basename(__dirname) + 2;
export const secret3 = defaultAccessToken;
export const secret4 = path.basename(__dirname) + 4;
export const authHeader1 = `Bearer ${secret1}`;
export const authHeader2 = `Bearer ${secret2}`;
export const authHeader3 = `Bearer ${secret3}`;
export const authHeader4 = `Bearer ${secret4}`;
