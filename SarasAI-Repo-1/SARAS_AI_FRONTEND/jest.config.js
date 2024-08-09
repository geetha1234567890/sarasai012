// jest.config.js
module.exports = {
  transform: {
    '^.+\\.(js|jsx|ts|tsx)$': 'babel-jest',
  },
  transformIgnorePatterns: [
    "node_modules/(?!(axios)/)" // Add exceptions for modules like axios
  ],
};
