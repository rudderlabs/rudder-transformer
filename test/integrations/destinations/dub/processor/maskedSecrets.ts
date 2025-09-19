import path from 'path';

// CRITICAL: Only derived placeholder values - NEVER real credentials
export const apiKey = path.basename(__dirname) + '_test_api_key_123';
export const authHeader = `Bearer ${apiKey}`;
export const workspaceId = 'test_workspace_' + path.basename(__dirname);
