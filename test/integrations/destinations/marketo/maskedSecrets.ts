import path from 'path';

export const secret1 = path.basename(__dirname) + 1;
export const secretAccessToken = path.basename(__dirname) + 2;
export const expiredAccessToken = path.basename(__dirname) + 3;

export const authHeader1 = `Bearer ${secret1}`;
