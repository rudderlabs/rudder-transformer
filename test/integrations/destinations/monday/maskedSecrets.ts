import path from 'path';

export const secretApiToken = path.basename(__dirname) + 1;
export const secretFailedApiToken = path.basename(__dirname) + 2;
export const secretNullColumnsApiToken = path.basename(__dirname) + 3;
export const secretNullGroupsApiToken = path.basename(__dirname) + 4;
