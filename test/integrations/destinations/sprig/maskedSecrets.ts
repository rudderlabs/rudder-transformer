import path from 'path';

export const secret1 = path.basename(__dirname) + 1;
export const secretInvalid = path.basename(__dirname) + 2;
export const authHeader1 = `API-Key ${secret1}`;
export const authHeaderInvalid = `API-Key ${secretInvalid}`;
