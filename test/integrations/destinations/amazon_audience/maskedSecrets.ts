import path from 'path';

export const secret1 = path.basename(__dirname) + 1;
export const secret2 = path.basename(__dirname) + 1;
export const authHeader1 = `Bearer ${secret1}`;
export const authHeader2 = `Bearer ${secret2}`;
