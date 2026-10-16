// Test-only values. None is a Marketo credential; each is distinct so the secret-path generator
// cannot mistake other fixture data for one.
export const clientId = 'marketo-audience-private-client-id-1';
export const clientSecret = 'marketo-audience-private-client-secret-1';
// Accepted by no mock: the identity endpoint answers 401 for it.
export const rejectedClientSecret = 'marketo-audience-private-client-secret-2';
// The access token the mocked identity endpoint returns for clientId/clientSecret.
export const accessToken = 'marketo-audience-private-access-token-1';
export const authHeader = `Bearer ${accessToken}`;
