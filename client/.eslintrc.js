module.exports = {
  root: true,
  extends: ['eslint:recommended', 'airbnb-base'],
  globals: {
    io: false,
  },
  plugins: ['import'],
  env: {
    browser: true,
    jquery: true,
    es6: true,
  },
  parserOptions: {
    sourceType: 'module',
    ecmaVersion: 2020,
  },
};
