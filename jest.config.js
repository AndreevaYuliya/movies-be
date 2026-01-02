export default {
  preset: 'ts-jest/presets/default-esm',
  testEnvironment: 'node',
  extensionsToTreatAsEsm: ['.ts'],
  setupFilesAfterEnv: ['<rootDir>/src/tests/setup.ts'],
  testMatch: ['<rootDir>/src/tests/**/*.test.ts'],
};
