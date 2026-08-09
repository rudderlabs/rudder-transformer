import { formatZodError } from '@rudderstack/integrations-lib';
import { LiveSecret, LiveSecretSchema } from './types';

const jsonEnvKey = (destination: string): string => `LIVE_SECRET_${destination.toUpperCase()}`;

export class SecretResolver {
  private readonly env: NodeJS.ProcessEnv;

  constructor(env: NodeJS.ProcessEnv = process.env) {
    this.env = env;
  }

  // Resolve + validate a LiveSecret from the LIVE_SECRET_<DEST> env var (JSON). Validating at this
  // boundary — never trusting JSON.parse — means a malformed secret fails here with a precise,
  // path-scoped message instead of surfacing as a confusing failure deep inside a scenario.
  resolve(destination: string): LiveSecret {
    const key = jsonEnvKey(destination);
    const raw = this.env[key];
    if (!raw) {
      throw new Error(`${key} is not set — live tests require credentials for '${destination}'.`);
    }
    let json: unknown;
    try {
      json = JSON.parse(raw);
    } catch {
      // Don't include the parser message — it can echo a fragment of the raw secret (incl. tokens).
      throw new Error(`${key} is set but is not valid JSON.`);
    }
    const result = LiveSecretSchema.safeParse(json);
    if (!result.success) {
      throw new Error(
        `${key} does not match the LiveSecret shape: ${formatZodError(result.error)}`,
      );
    }
    return result.data;
  }
}
