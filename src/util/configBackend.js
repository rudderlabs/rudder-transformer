const CONFIG_BACKEND_URL = process.env.CONFIG_BACKEND_URL || 'https://api.rudderlabs.com';

// Basic-auth request options for the config backend, with the hosted secret as the username.
// The secret is read at call time (so rotation needs no restart) and trimmed, since a k8s secret
// file commonly appends a trailing newline that would otherwise 401 every fetch. Returns {} when the
// secret is unset or blank, so self-hosted config backends stay unauthenticated.
function configBackendRequestOptions() {
  const secret = process.env.CONFIG_BACKEND_HOSTED_SECRET?.trim();
  if (!secret) return {};
  const encoded = Buffer.from(`${secret}:`).toString('base64');
  return { headers: { Authorization: `Basic ${encoded}` } };
}

module.exports = { CONFIG_BACKEND_URL, configBackendRequestOptions };
