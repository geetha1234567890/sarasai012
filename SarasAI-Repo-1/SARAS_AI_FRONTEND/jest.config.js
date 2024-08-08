module.exports = {
  transform: {
    '^.+\\.(js|jsx|ts|tsx)$': 'babel-jest', // Transform JS, JSX, TS, and TSX files
  },
  transformIgnorePatterns: [
    '/node_modules/(?!(axios|redux-toolkit|react-toastify)/)' // Transform specific node_modules
  ],
  setupFilesAfterEnv: ['@testing-library/jest-dom/extend-expect'],
  testEnvironment: 'jsdom',
};
