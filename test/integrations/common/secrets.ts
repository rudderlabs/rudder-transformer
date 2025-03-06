import path from 'path';

export const defaultAccessToken = path.basename(__dirname) + 'AccessToken';
export const defaultApiKey = path.basename(__dirname) + 'ApiKey';
export const defaultAccessTokenAuthHeader = `Bearer ${defaultAccessToken}`;
