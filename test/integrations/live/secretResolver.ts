import { LiveSecret } from './types';

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
    let parsed: LiveSecret;
    try {
      parsed = JSON.parse(raw);
    } catch (e) {
      throw new Error(`${key} is set but is not valid JSON: ${(e as Error).message}`);
    }
    return {
      authType: parsed.authType || 'apiKey',
      config: parsed.config,
      secret: parsed.secret,
      resourceIds: parsed.resourceIds,
      oauthRefresh: parsed.oauthRefresh,
      readback: parsed.readback,
    };
  }
}
