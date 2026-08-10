// Jest config for the live (real-destination) integration suite; runs ONLY component.live.test.ts.

module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  // Run serially: live runs hit shared real accounts and must not race.
  maxWorkers: 1,
  bail: 0,
  collectCoverage: false,
  coverageDirectory: 'reports/live-coverage',
  coverageReporters: ['text', 'text-summary', 'lcov', 'html'],
  collectCoverageFrom: ['src/**/*.{ts,js}', '!src/**/*.d.ts'],
  moduleDirectories: ['node_modules'],
  moduleFileExtensions: ['js', 'json', 'ts', 'node'],
  modulePathIgnorePatterns: ['<rootDir>/dist/', '<rootDir>/dist-test/', '<rootDir>/.worktrees/'],
  setupFiles: ['<rootDir>/test/setup.ts'],
  testMatch: ['<rootDir>/test/integrations/component.live.test.ts'],
  testPathIgnorePatterns: ['/node_modules/'],
  transform: {
    '^.+\\.tsx?$': ['ts-jest', { tsconfig: 'tsconfig.json', diagnostics: true }],
  },
};
