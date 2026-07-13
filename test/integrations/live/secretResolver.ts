import { LiveSecret } from './types';

const AUTH_TYPES = new Set(['apiKey', 'oauth', 'basic', 'serviceAccount', 'custom']);

const jsonEnvKey = (destination: string): string => `LIVE_SECRET_${destination.toUpperCase()}`;

export class SecretResolver {
  private readonly env: NodeJS.ProcessEnv;

  constructor(env: NodeJS.ProcessEnv = process.env) {
    this.env = env;
  }

  // Resolves a LiveSecret per destination from the LIVE_SECRET_<DEST> env var (JSON).
  // Throws when the secret is missing or invalid; live tests require credentials.
  resolve(destination: string): LiveSecret {
    const key = jsonEnvKey(destination);
    const raw = this.env[key];
    if (!raw) {
      throw new Error(`${key} is not set — live tests require credentials for '${destination}'.`);
    }
    let parsed: unknown;
    try {
      parsed = JSON.parse(raw);
    } catch (e) {
      throw new Error(`${key} is set but is not valid JSON: ${(e as Error).message}`);
    }
    if (typeof parsed !== 'object' || parsed === null || Array.isArray(parsed)) {
      throw new Error(`${key} must be a JSON object`);
    }
    const body = parsed as Record<string, unknown>;
    if (typeof body.authType !== 'string' || !AUTH_TYPES.has(body.authType)) {
      throw new Error(
        `${key}.authType must be one of: ${[...AUTH_TYPES].join(', ')} (got ${JSON.stringify(body.authType)})`,
      );
    }
    if (typeof body.config !== 'object' || body.config === null || Array.isArray(body.config)) {
      throw new Error(`${key}.config must be a non-null object`);
    }
    return {
      authType: body.authType as LiveSecret['authType'],
      config: body.config as Record<string, unknown>,
      secret:
        typeof body.secret === 'object' && body.secret !== null && !Array.isArray(body.secret)
          ? (body.secret as Record<string, string>)
          : undefined,
      resourceIds:
        typeof body.resourceIds === 'object' &&
        body.resourceIds !== null &&
        !Array.isArray(body.resourceIds)
          ? (body.resourceIds as Record<string, string>)
          : undefined,
      oauthRefresh: body.oauthRefresh as LiveSecret['oauthRefresh'],
      readback:
        typeof body.readback === 'object' && body.readback !== null && !Array.isArray(body.readback)
          ? (body.readback as Record<string, unknown>)
          : undefined,
    };
  }
}
