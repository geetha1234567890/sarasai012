module.exports = {
  transform: {
    '^.+\\.(js|jsx|ts|tsx)$': 'babel-jest', // Handle JS, JSX, TS, and TSX files
  },
  transformIgnorePatterns: [
    '/node_modules/(?!(axios|redux-toolkit|react-toastify)/)' // Include specific modules for transformation
  ],
  setupFilesAfterEnv: ['@testing-library/jest-dom/extend-expect'],
  testEnvironment: 'jsdom',
};
