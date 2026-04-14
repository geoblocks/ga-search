import js from '@eslint/js';
import globals from 'globals';

export default [
  js.configs.recommended,
  {
    languageOptions: {
      globals: globals.browser,
    },
    rules: {
      'array-bracket-spacing': 'error',
      'comma-spacing': 'error',
      'eqeqeq': 'error',
      'key-spacing': 'error',
      'keyword-spacing': 'error',
      'no-duplicate-imports': 'error',
      'no-multi-spaces': 'error',
      'no-multiple-empty-lines': 'error',
      'no-unused-vars': ['error', {vars: 'all', args: 'none'}],
      'no-trailing-spaces': 'error',
      'no-var': 'error',
      'object-curly-spacing': 'error',
      'object-shorthand': ['error', 'consistent'],
      'prefer-arrow-callback': 'error',
      'prefer-const': 'error',
      'quotes': ['error', 'single', {avoidEscape: true}],
      'semi': 'error',
      'space-before-blocks': 'error',
      'space-in-parens': 'error',
      'space-infix-ops': 'error',
    },
  },
];
