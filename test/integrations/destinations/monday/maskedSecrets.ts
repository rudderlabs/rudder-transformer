import path from 'path';

export const secretApiToken = path.basename(__dirname) + 1;
export const secretFailedApiToken = path.basename(__dirname) + 2;
