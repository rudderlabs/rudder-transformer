export interface EnvOverride {
  [key: string]: string | undefined;
}

export interface EnvSnapshot {
  [key: string]: string | undefined;
}

export class EnvManager {
  private snapshots: Map<string, EnvSnapshot> = new Map();

  /**
   * Take a snapshot of current environment variables
   * @param id Unique identifier for the snapshot
   * @param keys Array of environment variable keys to snapshot
   */
  takeSnapshot(id: string, keys: string[]): void {
    const snapshot: EnvSnapshot = {};
    keys.forEach((key) => {
      snapshot[key] = process.env[key];
    });
    this.snapshots.set(id, snapshot);
  }

  /**
   * Apply environment variable overrides
   * @param overrides Object with environment variable overrides
   */
  applyOverrides(overrides: EnvOverride): void {
    Object.entries(overrides).forEach(([key, value]) => {
      if (value === undefined) {
        delete process.env[key];
      } else {
        process.env[key] = value;
      }
    });
  }

  /**
   * Restore environment variables from snapshot
   * @param id Snapshot identifier to restore from
   */
  restoreSnapshot(id: string): void {
    const snapshot = this.snapshots.get(id);
    if (snapshot) {
      Object.entries(snapshot).forEach(([key, value]) => {
        if (value === undefined) {
          delete process.env[key];
        } else {
          process.env[key] = value;
        }
      });
      this.snapshots.delete(id);
    }
  }

  /**
   * Clean up all snapshots
   */
  cleanup(): void {
    this.snapshots.clear();
  }

  /**
   * Get the number of active snapshots (for debugging)
   */
  getSnapshotCount(): number {
    return this.snapshots.size;
  }
}
