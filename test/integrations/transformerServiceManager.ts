import { spawn, ChildProcess } from 'child_process';
import { createHttpTerminator, HttpTerminator } from 'http-terminator';
import axios from 'axios';
import * as net from 'net';
import * as path from 'path';

// ============================================================================
// TRANSFORMER SERVICE MANAGER
// ============================================================================

export interface ServiceConfig {
  port: number;
  metricsPort: number;
  timeout: number;
  healthCheckInterval: number;
  maxHealthCheckRetries: number;
}

/**
 * Generic service manager for integration tests
 * Manages transformer service lifecycle with health checks and port management
 */
export class TransformerServiceManager {
  private process: ChildProcess | null = null;
  private httpTerminator: HttpTerminator | null = null;
  private config: ServiceConfig;
  private currentEnv: Record<string, string> = {};

  constructor(config: Partial<ServiceConfig> = {}) {
    this.config = {
      port: config.port || 9090,
      metricsPort: config.metricsPort || 9091,
      timeout: config.timeout || 30000,
      healthCheckInterval: config.healthCheckInterval || 1000,
      maxHealthCheckRetries: config.maxHealthCheckRetries || 30,
      ...config,
    };
  }

  async start(env: Record<string, string> = {}): Promise<void> {
    if (this.process) {
      throw new Error('Service is already running');
    }

    // Find an available port
    const availablePort = await this.findAvailablePort(this.config.port);
    if (availablePort !== this.config.port) {
      console.log(`Port ${this.config.port} is in use, using port ${availablePort} instead`);
      this.config.port = availablePort;
    }

    console.log(`Starting transformer service on port ${this.config.port}...`);

    // Set environment variables for the service
    const serviceEnv = {
      ...process.env,
      PORT: this.config.port.toString(),
      METRICS_PORT: this.config.metricsPort.toString(),
      CLUSTER_ENABLED: 'false', // Disable clustering for integration tests
      LOG_LEVEL: 'warn', // Reduce log noise
      STATS_CLIENT: 'none', // Disable stats for tests
      ...env,
    };

    // Start the service as a child process
    this.process = spawn('npm', ['run', 'build:start'], {
      cwd: path.join(__dirname, '../../'),
      env: serviceEnv,
      stdio: ['ignore', 'pipe', 'pipe'],
    });

    this.process.stdout?.on('data', (data) => {
      console.log(`Service stdout: ${data}`);
    });

    this.process.stderr?.on('data', (data) => {
      console.error(`Service stderr: ${data}`);
    });

    this.process.on('error', (error) => {
      console.error('Failed to start service:', error);
      throw error;
    });

    this.process.on('exit', (code, signal) => {
      console.log(`Service exited with code ${code} and signal ${signal}`);
      this.process = null;
    });

    // Wait for service to be healthy
    await this.waitForHealth();
    console.log('Service is ready!');
  }

  async stop(): Promise<void> {
    if (!this.process) {
      return;
    }

    console.log('Stopping transformer service...');

    if (this.httpTerminator) {
      await this.httpTerminator.terminate();
      this.httpTerminator = null;
    }

    // Send SIGTERM to gracefully shutdown
    this.process.kill('SIGTERM');

    // Wait for process to exit
    await new Promise<void>((resolve) => {
      if (!this.process) {
        resolve();
        return;
      }

      const timeout = setTimeout(() => {
        console.log('Force killing service...');
        this.process?.kill('SIGKILL');
        resolve();
      }, this.config.timeout);

      this.process.on('exit', () => {
        clearTimeout(timeout);
        resolve();
      });
    });

    this.process = null;
    console.log('Service stopped.');
  }

  private async waitForHealth(): Promise<void> {
    const healthUrl = `http://localhost:${this.config.port}/health`;
    let retries = 0;

    while (retries < this.config.maxHealthCheckRetries) {
      try {
        const response = await axios.get(healthUrl, { timeout: 5000 });
        if (response.status === 200) {
          return;
        }
      } catch (error) {
        // Service not ready yet
      }

      retries++;
      console.log(`Health check ${retries}/${this.config.maxHealthCheckRetries}...`);
      await new Promise((resolve) => setTimeout(resolve, this.config.healthCheckInterval));
    }

    throw new Error(
      `Service failed to become healthy after ${this.config.maxHealthCheckRetries} retries`,
    );
  }

  /**
   * Find an available port starting from the preferred port
   */
  private async findAvailablePort(preferredPort: number): Promise<number> {
    const isPortAvailable = (port: number): Promise<boolean> => {
      return new Promise((resolve) => {
        const server = net.createServer();

        server.listen(port, () => {
          server.close(() => resolve(true));
        });

        server.on('error', () => resolve(false));
      });
    };

    // Try the preferred port first
    if (await isPortAvailable(preferredPort)) {
      return preferredPort;
    }

    // Try ports in a reasonable range around the preferred port
    for (let port = preferredPort + 1; port <= preferredPort + 100; port++) {
      if (await isPortAvailable(port)) {
        return port;
      }
    }

    throw new Error(`No available ports found in range ${preferredPort}-${preferredPort + 100}`);
  }

  async restart(newEnv: Record<string, string> = {}): Promise<void> {
    console.log('Restarting service with new environment...');
    await this.stop();
    await new Promise((resolve) => setTimeout(resolve, 2000)); // Brief pause
    await this.start({ ...this.currentEnv, ...newEnv });
  }

  async updateEnvironment(newEnv: Record<string, string>): Promise<void> {
    this.currentEnv = { ...this.currentEnv, ...newEnv };
    await this.restart(this.currentEnv);
  }

  getCurrentEnvironment(): Record<string, string> {
    return { ...this.currentEnv };
  }

  async resetEnvironment(): Promise<void> {
    this.currentEnv = {};
    await this.restart();
  }

  getBaseUrl(): string {
    return `http://localhost:${this.config.port}`;
  }

  isRunning(): boolean {
    return this.process !== null;
  }
}
