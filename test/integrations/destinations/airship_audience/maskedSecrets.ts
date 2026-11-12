// Test-only value, not an Airship token. Distinct from every other fixture value so the
// secret-path generator cannot mistake other fixture data for it.
export const apiKey = 'airship-audience-private-api-key-1';
export const authHeader = `Bearer ${apiKey}`;
