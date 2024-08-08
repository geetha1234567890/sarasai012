module.exports = {
  transform: {
    '^.+\\.(js|jsx)$': 'babel-jest',  // Handle JS and JSX files
  },
  transformIgnorePatterns: [
    '/node_modules/(?!(axios|some-other-module)/)',  // Include modules that need transformation
  ],
  setupFilesAfterEnv: ['@testing-library/jest-dom/extend-expect'],
  testEnvironment: 'jsdom',
};
