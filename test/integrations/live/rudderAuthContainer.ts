import { GenericContainer, StartedTestContainer, Wait } from 'testcontainers';

const IMAGE = '422074288268.dkr.ecr.us-east-1.amazonaws.com/rudderstack/rudder-auth:develop';
const PORT = 3033;

// Manages the rudder-auth container the live suite starts for OAuth destinations.
export class RudderAuthContainer {
  private readonly env: NodeJS.ProcessEnv;

  private container?: StartedTestContainer;

  constructor(env: NodeJS.ProcessEnv = process.env) {
    this.env = env;
  }

  // OAuth app credentials forwarded into the container, filtered from the injected env by name.
  // These override the app creds baked into the image (needed when the refresh token was issued by
  // a different app than the image ships). Only the destinations whose CI matrix entry supplies
  // these vars have them in env, so the forwarding is scoped without any per-destination code.
  private credentialEnv(): Record<string, string> {
    const env: Record<string, string> = {};
    for (const [key, value] of Object.entries(this.env)) {
      if (
        value !== undefined &&
        /(CLIENT_ID|CLIENT_SECRET|CONSUMER_KEY|CONSUMER_SECRET)/.test(key)
      ) {
        env[key] = value;
      }
    }
    return env;
  }

  // Start the container and return its base URL.
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
        `[live] failed to start the rudder-auth container from ${IMAGE}: ${String(err)}.`,
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
      console.warn(`[live] rudder-auth container teardown failed (ignored): ${String(err)}`);
    } finally {
      this.container = undefined;
    }
  }
}
