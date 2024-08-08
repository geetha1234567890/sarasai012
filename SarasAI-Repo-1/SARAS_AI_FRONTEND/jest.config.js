module.exports = {
  transform: {
    "^.+\\.(js|jsx|ts|tsx)$": "babel-jest",
  },
  transformIgnorePatterns: [
    "/node_modules/(?!axios|bootstrap-icons)"
  ],
  moduleFileExtensions: ["js", "jsx", "json", "node"],
  testPathIgnorePatterns: ["/node_modules/"],
};
