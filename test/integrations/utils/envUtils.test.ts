import { EnvManager, EnvOverride } from './envUtils';

describe('EnvManager', () => {
  let envManager: EnvManager;
  let originalEnvVars: { [key: string]: string | undefined } = {};

  beforeEach(() => {
    envManager = new EnvManager();
    // Store original environment variables for cleanup
    originalEnvVars = {
      TEST_VAR_1: process.env.TEST_VAR_1,
      TEST_VAR_2: process.env.TEST_VAR_2,
      TEST_VAR_3: process.env.TEST_VAR_3,
    };
  });

  afterEach(() => {
    // Always restore original environment variables
    Object.entries(originalEnvVars).forEach(([key, value]) => {
      if (value === undefined) {
        delete process.env[key];
      } else {
        process.env[key] = value;
      }
    });
    envManager.cleanup();
  });

  describe('takeSnapshot and restoreSnapshot', () => {
    it('should take a snapshot of environment variables', () => {
      // Set some test environment variables
      process.env.TEST_VAR_1 = 'original_value_1';
      process.env.TEST_VAR_2 = 'original_value_2';

      // Take a snapshot
      envManager.takeSnapshot('test-snapshot', ['TEST_VAR_1', 'TEST_VAR_2', 'TEST_VAR_3']);

      // Modify environment variables
      process.env.TEST_VAR_1 = 'modified_value_1';
      process.env.TEST_VAR_2 = 'modified_value_2';
      process.env.TEST_VAR_3 = 'new_value_3';

      // Restore from snapshot
      envManager.restoreSnapshot('test-snapshot');

      // Verify restoration
      expect(process.env.TEST_VAR_1).toBe('original_value_1');
      expect(process.env.TEST_VAR_2).toBe('original_value_2');
      expect(process.env.TEST_VAR_3).toBeUndefined();
    });

    it('should handle undefined environment variables in snapshot', () => {
      // Ensure TEST_VAR_1 is undefined
      delete process.env.TEST_VAR_1;

      // Take a snapshot
      envManager.takeSnapshot('test-snapshot-undefined', ['TEST_VAR_1']);

      // Set the variable
      process.env.TEST_VAR_1 = 'new_value';

      // Restore from snapshot
      envManager.restoreSnapshot('test-snapshot-undefined');

      // Verify it's undefined again
      expect(process.env.TEST_VAR_1).toBeUndefined();
    });
  });

  describe('applyOverrides', () => {
    it('should apply environment variable overrides', () => {
      const overrides: EnvOverride = {
        TEST_VAR_1: 'override_value_1',
        TEST_VAR_2: 'override_value_2',
      };

      envManager.applyOverrides(overrides);

      expect(process.env.TEST_VAR_1).toBe('override_value_1');
      expect(process.env.TEST_VAR_2).toBe('override_value_2');
    });

    it('should delete environment variables when override value is undefined', () => {
      // Set some environment variables
      process.env.TEST_VAR_1 = 'existing_value';
      process.env.TEST_VAR_2 = 'another_value';

      const overrides: EnvOverride = {
        TEST_VAR_1: undefined, // Should delete this
        TEST_VAR_2: 'new_value', // Should set this
      };

      envManager.applyOverrides(overrides);

      expect(process.env.TEST_VAR_1).toBeUndefined();
      expect(process.env.TEST_VAR_2).toBe('new_value');
    });
  });

  describe('full workflow', () => {
    it('should support complete snapshot -> override -> restore workflow', () => {
      // Initial state
      process.env.TEST_VAR_1 = 'initial_value';
      delete process.env.TEST_VAR_2;

      // Take snapshot
      envManager.takeSnapshot('workflow-test', ['TEST_VAR_1', 'TEST_VAR_2']);

      // Apply overrides
      const overrides: EnvOverride = {
        TEST_VAR_1: 'overridden_value',
        TEST_VAR_2: 'new_value',
      };
      envManager.applyOverrides(overrides);

      // Verify overrides applied
      expect(process.env.TEST_VAR_1).toBe('overridden_value');
      expect(process.env.TEST_VAR_2).toBe('new_value');

      // Restore snapshot
      envManager.restoreSnapshot('workflow-test');

      // Verify restoration
      expect(process.env.TEST_VAR_1).toBe('initial_value');
      expect(process.env.TEST_VAR_2).toBeUndefined();
    });
  });

  describe('cleanup', () => {
    it('should clean up all snapshots', () => {
      envManager.takeSnapshot('snapshot-1', ['TEST_VAR_1']);
      envManager.takeSnapshot('snapshot-2', ['TEST_VAR_2']);

      expect(envManager.getSnapshotCount()).toBe(2);

      envManager.cleanup();

      expect(envManager.getSnapshotCount()).toBe(0);
    });
  });

  describe('getSnapshotCount', () => {
    it('should return correct snapshot count', () => {
      expect(envManager.getSnapshotCount()).toBe(0);

      envManager.takeSnapshot('snapshot-1', ['TEST_VAR_1']);
      expect(envManager.getSnapshotCount()).toBe(1);

      envManager.takeSnapshot('snapshot-2', ['TEST_VAR_2']);
      expect(envManager.getSnapshotCount()).toBe(2);

      envManager.restoreSnapshot('snapshot-1');
      expect(envManager.getSnapshotCount()).toBe(1);
    });
  });
});
