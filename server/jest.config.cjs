module.exports = {
  testEnvironment: 'node',
  transform: {},                 // keep ESM imports; no Babel
  roots: ['<rootDir>/tests'],
  setupFilesAfterEnv: ['<rootDir>/tests/setup.js'],
  maxWorkers: 1,                 // keeps mongodb-memory-server stable
}
