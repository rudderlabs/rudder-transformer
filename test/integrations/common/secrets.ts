import path from 'path';

export const defaultAccessToken = path.basename(__dirname) + 'AccessToken';
export const defaultAccessTokenAuthHeader = `Bearer ${defaultAccessToken}`;
