module.exports = {
  transform: {
    "^.+\\.(js|jsx)$": "babel-jest"
  },
  transformIgnorePatterns: [
    "node_modules/(?!(axios)/)"  // Include specific node_modules that need transformation
  ]
};

