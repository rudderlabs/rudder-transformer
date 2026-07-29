const CONFIG_BACKEND_URL = process.env.CONFIG_BACKEND_URL || 'https://api.rudderlabs.com';

// Sent to the config backend when it requires authentication (basic auth, secret as username).
// Unset for self-hosted config backends that serve these routes without auth, so no header is added.
const { CONFIG_BACKEND_HOSTED_SECRET } = process.env;

// Empty when unset, so fetchWithProxy keeps the call unauthenticated (self-hosted).
function configBackendRequestOptions() {
  if (!CONFIG_BACKEND_HOSTED_SECRET) return {};
  const encoded = Buffer.from(`${CONFIG_BACKEND_HOSTED_SECRET}:`).toString('base64');
  return { headers: { Authorization: `Basic ${encoded}` } };
}

module.exports = { CONFIG_BACKEND_URL, configBackendRequestOptions };
