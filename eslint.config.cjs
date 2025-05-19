const js = require('@eslint/js');
const ts = require('@typescript-eslint/eslint-plugin');
const tsParser = require('@typescript-eslint/parser');
const prettier = require('eslint-config-prettier');
const simpleImportSort = require('eslint-plugin-simple-import-sort');
const vueParser = require('vue-eslint-parser');

/** @type {import("eslint").Linter.FlatConfig[]} */
module.exports = [
  js.configs.recommended,
  prettier,
  {
    files: ['packages/*/src/**/*.{ts,vue,tsx}', 'apps/*/**/*.{ts,vue,tsx}'],
    ignores: ['apps/front/@types/*'],
    languageOptions: {
      parser: vueParser,
      parserOptions: {
        parser: tsParser,
        ecmaVersion: 2022,
        sourceType: 'module',
      },
    },
    plugins: {
      '@typescript-eslint': ts,
      'simple-import-sort': simpleImportSort,
    },
    rules: {
      'simple-import-sort/imports': 'error',
      'simple-import-sort/exports': 'error',
      '@typescript-eslint/no-unused-vars': [
        'error',
        {
          argsIgnorePattern: '^_',
          varsIgnorePattern: '^_',
          caughtErrorsIgnorePattern: '^_',
        },
      ],
      'no-unused-vars': 'off',
      'vue/multi-word-component-names': 'off',
      'no-undef': 'off',
      'vue/one-component-per-file': 'off',
      '@typescript-eslint/no-explicit-any': 'off',
      'no-redeclare': ['error', { builtinGlobals: true }],
      'max-lines': ['error', 1000],
    },
  },
];
