module.exports = {
  root: true,
  env: {
    browser: true,
    node: true,
    'jest/globals': true,
  },
  parserOptions: {
    parser: '@typescript-eslint/parser',
    requireConfigFile: false,
  },
  extends: [
    'airbnb-base',
    'plugin:@typescript-eslint/eslint-recommended',
    'plugin:@typescript-eslint/recommended',
  ],
  plugins: [
    '@typescript-eslint',
    'jest',
  ],
  rules: {
    'no-return-await': 'off',
    'import/extensions': 'off',
    'no-unused-vars': 'warn',
    'linebreak-style': 'off',
    'import/no-unresolved': 'off',
    'consistent-return': 'off',
  },
};
