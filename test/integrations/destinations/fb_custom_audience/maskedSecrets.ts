import crypto from 'crypto';
import path from 'path';

export const secret1 = path.basename(__dirname) + 1;
export const secret2 = path.basename(__dirname) + 2;
export const appSecretProof = crypto
  .createHmac('sha256', secret2)
  .update(`${secret1}|1697328000`)
  .digest('hex');
