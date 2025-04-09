import { base64Sha } from '../../../../src/cdk/v2/destinations/emarsys/utils';

export const NONCE = '5398e214ae99c2e50afb709a3bc423f9';
export const TIMESTAMP = '2019-10-14T00:00:00.000Z';
export const USERNAME = 'dummy';
export const SECRET = 'dummy';

export const PASSWORD_DIGEST = base64Sha(NONCE + TIMESTAMP + SECRET);
export const HEADER_BLOCK = `UsernameToken Username="${USERNAME}", PasswordDigest="${PASSWORD_DIGEST}", Nonce="${NONCE}", Created="${TIMESTAMP}"`;

export const WRONG_USERNAME = 'dummy2';
export const WRONG_HEADER_BLOCK = `UsernameToken Username="${WRONG_USERNAME}", PasswordDigest="${PASSWORD_DIGEST}", Nonce="${NONCE}", Created="${TIMESTAMP}"`;

export const TIMESTAMP_2 = '2023-10-14T00:00:00.000Z';
export const PASSWORD_DIGEST_2 = base64Sha(NONCE + TIMESTAMP_2 + SECRET);
export const COMMON_HEADER_BLOCK = `UsernameToken Username="${USERNAME}", PasswordDigest="${PASSWORD_DIGEST_2}", Nonce="${NONCE}", Created="${TIMESTAMP_2}"`;
