import path from 'path';

export const secret1 = `${path.basename(__dirname)}-private-api-key-1`;
export const secretBadApiKey = `${path.basename(__dirname)}-bad-private-api-key-2`;

export const authHeader1 = `Klaviyo-API-Key ${secret1}`;
export const authHeaderBadApiKey = `Klaviyo-API-Key ${secretBadApiKey}`;
