import { GenericContainer, StartedTestContainer, Wait } from 'testcontainers';

const IMAGE = '422074288268.dkr.ecr.us-east-1.amazonaws.com/rudderstack/rudder-auth:develop';
const PORT = 3033;

// The OAuth app-credential shapes rudder-auth reads for a token refresh (see rudder-auth
// config/custom-environment-variables.yml). A strict allowlist, not a broad /TOKEN|SECRET|KEY/,
// because credentialEnv() runs over the whole job env.
const CREDENTIAL_TYPES = 'CLIENT_ID|CLIENT_SECRET|CONSUMER_KEY|CONSUMER_SECRET|DEVELOPER_TOKEN';

// Manages the rudder-auth container the live suite starts for OAuth destinations.
export class RudderAuthContainer {
  private readonly destinations: string[];

  private readonly env: NodeJS.ProcessEnv;

  private container?: StartedTestContainer;

  constructor(destinations: string[], env: NodeJS.ProcessEnv = process.env) {
    this.destinations = destinations;
    this.env = env;
  }

  // Forward only the enrolled OAuth destinations' app credentials into the container, scoped by
  // destination (destType) and to the destination flow — base or *_DESTINATION names, never
  // *_SOURCE. This overrides the image's default app creds; everything else in the job env (the
  // wildcard-imported cred set, plus GITHUB_TOKEN, AWS_*, LIVE_SECRET_*, ...) stays out.
  private credentialEnv(): Record<string, string> {
    const env: Record<string, string> = {};
    if (this.destinations.length === 0) {
      return env;
    }
    const dests = this.destinations.map((d) => d.toUpperCase()).join('|');
    const pattern = new RegExp(`^(${dests})_(${CREDENTIAL_TYPES})(_DESTINATION)?$`);
    for (const [key, value] of Object.entries(this.env)) {
      if (value !== undefined && pattern.test(key)) {
        env[key] = value;
      }
    }
    return env;
  }

  async start(): Promise<string> {
    try {
      // eslint-disable-next-line no-console
      console.log(`[live] starting rudder-auth container from ${IMAGE}…`);
      this.container = await new GenericContainer(IMAGE)
        .withExposedPorts(PORT)
        .withEnvironment(this.credentialEnv())
        .withWaitStrategy(
          Wait.forHttp('/health', PORT).forStatusCodeMatching((code) => code >= 200 && code < 400),
        )
        .withStartupTimeout(120000)
        .start();
      const url = `http://127.0.0.1:${this.container.getMappedPort(PORT)}`;
      // eslint-disable-next-line no-console
      console.log(`[live] rudder-auth is healthy at ${url}`);
      return url;
    } catch (err) {
      throw new Error(
        `[live] failed to start the rudder-auth container from ${IMAGE}: ${
          err instanceof Error ? err.message : 'unknown error'
        }.`,
      );
    }
  }

  async stop(): Promise<void> {
    if (!this.container) {
      return;
    }
    try {
      await this.container.stop();
    } catch (err) {
      // eslint-disable-next-line no-console
      console.warn(
        `[live] rudder-auth container teardown failed (ignored): ${
          err instanceof Error ? err.message : 'unknown error'
        }`,
      );
    } finally {
      this.container = undefined;
    }
  }
}
