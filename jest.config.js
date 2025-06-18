// filepath: jest.config.js
export default {
  testEnvironment: "jsdom",
  transform: {
    "^.+\\.[jt]sx?$": "babel-jest",
  },
  moduleFileExtensions: ["js", "jsx", "json", "node", "cjs"],
  setupFiles: ["./jest.setup.js"],
};