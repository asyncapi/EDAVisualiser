module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  transform: {
    '^.+\\.tsx?$': 'ts-jest',
  },

  roots: ['<rootDir>'],
  testMatch: ['**/__tests__/**/*.ts?(x)', '**/?(*.)+(spec|test).ts?(x)'],

  globals: {
    'ts-jest': {
      tsconfig: 'tsconfig.json',
    },
  },
  setupFiles: ['<rootDir>/test-shim.js', '<rootDir>/test-setup.js'],
  moduleFileExtensions: ['ts', 'tsx', 'js'],
};
