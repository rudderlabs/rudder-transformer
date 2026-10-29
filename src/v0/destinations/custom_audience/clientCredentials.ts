import { createHash } from 'node:crypto';
import axios, { type AxiosRequestConfig } from 'axios';
import { ConfigurationError, RetryableError } from '@rudderstack/integrations-lib';
import { guardedHttpsAgent } from '../../../util/guardedHttps';
import { CUSTOM_AUDIENCE_CLIENT_CREDENTIALS_USER_AGENT } from './constants';
import type { ParsedCustomAudienceDeliveryAccount } from './types';

type TokenResponse = { status: number; data: unknown };
type TokenPost = (url: string, body: string, config: AxiosRequestConfig) => Promise<TokenResponse>;
type CachedToken = { token: string; expiresAt: number };

const RESERVED_PARAMS = new Set([
  'client_id',
  'client_secret',
  'code',
  'code_challenge',
  'code_challenge_method',
  'code_verifier',
  'grant_type',
  'redirect_uri',
  'refresh_token',
  'response_type',
  'scope',
  'state',
]);
const DEFAULT_TTL_SECONDS = 3600;
const TOKEN_TIMEOUT_MS = 10000;
const TOKEN_MAX_BYTES = 65536;

const requiredString = (value: unknown, field: string): string => {
  if (typeof value !== 'string' || value.length === 0) {
    throw new ConfigurationError(`Client Credentials account is missing ${field}`);
  }
  return value;
};

const parseOptions = (account: ParsedCustomAudienceDeliveryAccount) => {
  const options = account.options ?? {};
  const tokenUrl = requiredString(options.tokenUrl, 'options.tokenUrl');
  const clientId = requiredString(options.clientId, 'options.clientId');
  const clientSecret = requiredString(account.secret?.clientSecret, 'secret.clientSecret');
  const method = options.tokenAuthMethod ?? 'client_secret_basic';
  if (method !== 'client_secret_basic' && method !== 'client_secret_post') {
    throw new ConfigurationError('Client Credentials tokenAuthMethod is invalid');
  }
  const separator = options.scopeSeparator ?? 'space';
  if (separator !== 'space' && separator !== 'comma') {
    throw new ConfigurationError('Client Credentials scopeSeparator is invalid');
  }
  const scopes = options.scopes ?? [];
  if (
    !Array.isArray(scopes) ||
    scopes.length > 50 ||
    scopes.some((scope) => typeof scope !== 'string' || !/^[^\s,]{1,200}$/.test(scope))
  ) {
    throw new ConfigurationError('Client Credentials scopes are invalid');
  }
  const extra = options.extraTokenParams ?? '';
  if (typeof extra !== 'string' || extra.length > 2000) {
    throw new ConfigurationError('Client Credentials extraTokenParams is invalid');
  }
  const extraParams = new URLSearchParams(extra);
  const seen = new Set<string>();
  for (const key of extraParams.keys()) {
    const normalized = key.toLowerCase();
    if (RESERVED_PARAMS.has(normalized) || seen.has(normalized)) {
      throw new ConfigurationError(
        'Client Credentials extraTokenParams contains a reserved or duplicate key',
      );
    }
    seen.add(normalized);
  }
  let url: URL;
  try {
    url = new URL(tokenUrl);
  } catch {
    throw new ConfigurationError('Client Credentials tokenUrl is invalid');
  }
  if (url.search || url.hash) {
    throw new ConfigurationError('Client Credentials tokenUrl cannot contain a query or fragment');
  }
  const agent = guardedHttpsAgent(tokenUrl);
  return {
    tokenUrl,
    clientId,
    clientSecret,
    method,
    separator,
    scopes: scopes as string[],
    extra,
    extraParams,
    agent,
  };
};

const REDACTED = '[redacted]';
const CREDENTIALS_REJECTED = 'credentials rejected';

const providerMessage = (data: unknown, clientId: string, clientSecret: string): string => {
  if (!data || typeof data !== 'object') return CREDENTIALS_REJECTED;
  const value = data as Record<string, unknown>;
  const raw = [value.error_description, value.message, value.error].find(
    (candidate) => typeof candidate === 'string' && candidate.length > 0,
  );
  if (typeof raw !== 'string') return CREDENTIALS_REJECTED;
  const formEncode = (credential: string) =>
    new URLSearchParams([['value', credential]]).toString().slice('value='.length);
  const basicValue = Buffer.from(
    `${encodeURIComponent(clientId)}:${encodeURIComponent(clientSecret)}`,
  ).toString('base64');
  return (
    raw
      .replaceAll(clientSecret, REDACTED)
      .replaceAll(clientId, REDACTED)
      .replaceAll(encodeURIComponent(clientSecret), REDACTED)
      .replaceAll(encodeURIComponent(clientId), REDACTED)
      .replaceAll(formEncode(clientSecret), REDACTED)
      .replaceAll(formEncode(clientId), REDACTED)
      .replaceAll(basicValue, REDACTED)
      .slice(0, 200)
      .replace(/https?:\/\/\S+/g, REDACTED)
      .replace(/[\w+/=-]{24,}/g, REDACTED)
      .replace(/[^\s\w!'(),.:;?[\]-]/g, ' ')
      .trim() || CREDENTIALS_REJECTED
  );
};

export class ClientCredentialsTokenProvider {
  private readonly cache = new Map<string, CachedToken>();

  private readonly inFlight = new Map<string, Promise<string>>();

  constructor(
    private readonly post: TokenPost = (url, body, config) => axios.post(url, body, config),
  ) {}

  async getToken(
    account: ParsedCustomAudienceDeliveryAccount,
    workspaceId: string,
  ): Promise<string> {
    const settings = parseOptions(account);
    const id = requiredString(account.id, 'id');
    requiredString(workspaceId, 'workspaceId');
    const fingerprint = createHash('sha256')
      .update(
        JSON.stringify([
          settings.tokenUrl,
          settings.clientId,
          settings.scopes,
          settings.separator,
          settings.extra,
          settings.method,
        ]),
      )
      .digest('hex');
    const key = JSON.stringify([workspaceId, id, account.secretVersion ?? null, fingerprint]);
    const cached = this.cache.get(key);
    const now = Date.now();
    if (cached && cached.expiresAt > now) return cached.token;
    for (const [entryKey, entry] of this.cache) {
      if (entry.expiresAt <= now) this.cache.delete(entryKey);
    }
    const pending = this.inFlight.get(key);
    if (pending) return pending;

    const grant = this.grant(settings)
      .then(({ token, ttlSeconds }) => {
        this.cache.set(key, { token, expiresAt: Date.now() + ttlSeconds * 1000 });
        return token;
      })
      .finally(() => this.inFlight.delete(key));
    this.inFlight.set(key, grant);
    return grant;
  }

  private async grant(
    settings: ReturnType<typeof parseOptions>,
  ): Promise<{ token: string; ttlSeconds: number }> {
    const body = new URLSearchParams(settings.extraParams);
    body.set('grant_type', 'client_credentials');
    if (settings.scopes.length > 0)
      body.set('scope', settings.scopes.join(settings.separator === 'comma' ? ',' : ' '));
    const headers: Record<string, string> = {
      'Content-Type': 'application/x-www-form-urlencoded',
      'User-Agent': CUSTOM_AUDIENCE_CLIENT_CREDENTIALS_USER_AGENT,
    };
    if (settings.method === 'client_secret_basic') {
      headers.Authorization = `Basic ${Buffer.from(
        `${encodeURIComponent(settings.clientId)}:${encodeURIComponent(settings.clientSecret)}`,
      ).toString('base64')}`;
    } else {
      body.set('client_id', settings.clientId);
      body.set('client_secret', settings.clientSecret);
    }

    let response: TokenResponse;
    try {
      response = await this.post(settings.tokenUrl, body.toString(), {
        headers,
        httpsAgent: settings.agent,
        proxy: false,
        maxRedirects: 0,
        timeout: TOKEN_TIMEOUT_MS,
        maxContentLength: TOKEN_MAX_BYTES,
        maxBodyLength: TOKEN_MAX_BYTES,
        validateStatus: () => true,
      });
    } catch {
      throw new RetryableError('Client Credentials token request failed');
    }
    if (response.status >= 300 && response.status < 400) {
      throw new ConfigurationError('Client Credentials token endpoint redirects are not allowed');
    }
    if (response.status >= 500 || response.status < 200) {
      throw new RetryableError('Client Credentials token endpoint failed');
    }
    const data = response.data as Record<string, unknown> | null;
    const errorCode = data && typeof data.error === 'string' ? data.error : '';
    if (
      response.status === 400 ||
      response.status === 401 ||
      errorCode === 'invalid_client' ||
      errorCode === 'unauthorized_client'
    ) {
      throw new ConfigurationError(
        `Client Credentials token endpoint rejected credentials: ${providerMessage(data, settings.clientId, settings.clientSecret)}`,
      );
    }
    if (response.status >= 400) {
      throw new ConfigurationError('Client Credentials token endpoint rejected the grant');
    }
    const token = data?.access_token;
    if (typeof token !== 'string' || !token) {
      throw new RetryableError('Client Credentials token endpoint returned no access token');
    }
    const rawExpiry = data?.expires_in;
    if (rawExpiry === undefined) {
      return { token, ttlSeconds: DEFAULT_TTL_SECONDS };
    }
    const expiry = Number(rawExpiry);
    if (!Number.isFinite(expiry) || expiry <= 0) {
      throw new RetryableError('Client Credentials token endpoint returned invalid expiry');
    }
    const ttlSeconds = Math.max(1, expiry - Math.min(60, Math.floor(expiry * 0.1)));
    return { token, ttlSeconds };
  }
}

export const clientCredentialsTokenProvider = new ClientCredentialsTokenProvider();
