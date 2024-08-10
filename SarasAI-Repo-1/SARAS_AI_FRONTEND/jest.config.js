const nextJest = require('next/jest');
const tsconfig = require('./tsconfig.json');
const moduleNameMapper = require('tsconfig-paths-jest')(tsconfig);

const createJestConfig = nextJest({
  // Provide the path to your Next.js app to load next.config.js and .env files in your test environment
  dir: './',
});

// Add any custom config to be passed to Jest
const customJestConfig = {
  

  setupFilesAfterEnv: ['<rootDir>/setupTests.ts'],

  moduleDirectories: ['node_modules', '<rootDir>/'],
  testEnvironment: 'jest-environment-jsdom',
  bail: true,
  logHeapUsage: true,
  testTimeout: 120000,
  forceExit: true,
  collectCoverage: true,


  coverageProvider: 'v8',
  collectCoverageFrom: ['src/**/*.{js,jsx,ts,tsx}'],
  moduleNameMapper,
  
};


module.exports = createJestConfig(customJestConfig);
