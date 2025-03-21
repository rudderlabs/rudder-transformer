import path from 'path';

export const secret1 = path.basename(__dirname) + 1;
export const authHeader1 = `Token token=${secret1}`;
