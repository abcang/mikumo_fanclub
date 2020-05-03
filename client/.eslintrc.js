module.exports = {
  "root": true,
  "extends": [
    'eslint:recommended',
    'airbnb-base/legacy',
  ],
  "globals": {
    "io": false,
    "FastClick": false
  },
  "env": {
    "browser": true,
    "jquery": true,
    "es6": false,
  },
  "parserOptions": {},
  "rules": {
    "space-before-function-paren": ["error", "never"],
    "func-names": 0,
    "vars-on-top": 0,
  }
}
