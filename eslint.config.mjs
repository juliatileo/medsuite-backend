/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { fixupPluginRules } from '@eslint/compat';
import { FlatCompat } from '@eslint/eslintrc';
import js from '@eslint/js';
import typescriptEslint from '@typescript-eslint/eslint-plugin';
import tsParser from '@typescript-eslint/parser';
import eslintConfigPrettier from 'eslint-config-prettier';
import _import from 'eslint-plugin-import';
import importHelpers from 'eslint-plugin-import-helpers';
import prettier from 'eslint-plugin-prettier';
import globals from 'globals';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const compat = new FlatCompat({
  baseDirectory: __dirname,
  recommendedConfig: js.configs.recommended,
  allConfig: js.configs.all,
});

export default [
  ...compat.extends('plugin:@typescript-eslint/recommended', 'plugin:prettier/recommended'),
  {
    plugins: {
      '@typescript-eslint': typescriptEslint,
      prettier,
      'import-helpers': importHelpers,
      import: fixupPluginRules(_import),
    },
    languageOptions: {
      globals: {
        ...globals.node,
      },
      parser: tsParser,
      ecmaVersion: 12,
      sourceType: 'module',

      parserOptions: {
        project: './tsconfig.json',
        tsconfigRootDir: './',
      },
    },
    settings: {
      'import/resolver': {
        typescript: {
          project: ['tsconfig.json'],
        },
      },
    },
    rules: {
      'no-shadow': 0,
      '@typescript-eslint/no-shadow': ['error'],
      'no-new': 0,
      'no-plusplus': 'off',
      'no-prototype-builtins': 0,
      'no-restricted-syntax': 0,
      'no-console': 2,
      'import/prefer-default-export': 0,
      'no-underscore-dangle': 0,
      'class-methods-use-this': 0,
      'no-return-await': 2,
      'import/extensions': [
        'error',
        'ignorePackages',
        {
          ts: 'never',
        },
      ],
      'prettier/prettier': [
        'error',
        {
          semi: true,
          trailingComma: 'all',
          singleQuote: true,
          printWidth: 120,
          tabWidth: 2,
          bracketSpacing: true,
          useTabs: false,
          parser: 'typescript',
          endOfLine: 'auto',
        },
      ],
      'import-helpers/order-imports': [
        'warn',
        {
          newlinesBetween: 'always',
          groups: [
            'module',
            '/^@src/',
            '/^@core/',
            '/^@controllers/',
            '/^@services/',
            '/^@entities/',
            '/^@repositories/',
            '/^@shared/',
            '/^@middlewares/',
            '/^@utils/',
          ],
          alphabetize: {
            order: 'asc',
            ignoreCase: true,
          },
        },
      ],
      'object-literal-sort-keys': 0,
      'sort-imports': [
        'error',
        {
          ignoreCase: true,
          ignoreDeclarationSort: true,
          ignoreMemberSort: false,
          memberSyntaxSortOrder: ['none', 'all', 'multiple', 'single'],
          allowSeparatedGroups: true,
        },
      ],
      'max-classes-per-file': [2, 1],
      'no-param-reassign': 0,
      'no-duplicate-imports': 2,
      'ordered-imports': 0,
      'variable-name': 0,
      'import-name': 0,
      'max-len': [
        2,
        120,
        2,
        {
          ignoreStrings: true,
          ignoreTemplateLiterals: true,
        },
      ],
      'lines-between-class-members': [0],
      'no-empty': [2],
      '@typescript-eslint/no-explicit-any': ['error'],
      '@typescript-eslint/explicit-function-return-type': ['off'],

      '@typescript-eslint/no-unused-vars': [
        'error',
        {
          argsIgnorePattern: '_',
        },
      ],
      '@typescript-eslint/naming-convention': [
        'error',
        {
          selector: 'interface',
          format: ['PascalCase'],
        },
      ],
      '@typescript-eslint/explicit-module-boundary-types': [
        'warn',
        {
          allowArgumentsExplicitlyTypedAsAny: true,
        },
      ],
      '@typescript-eslint/array-type': [2],
      '@typescript-eslint/no-unsafe-member-access': 0,
      '@typescript-eslint/no-empty-interface': 2,
      '@typescript-eslint/typedef': [2],
      '@typescript-eslint/no-useless-constructor': 'off',
      'no-useless-constructor': 'off',
      '@typescript-eslint/no-unsafe-assignment': 1,
      '@typescript-eslint/no-unsafe-call': 1,
      'prefer-const': [
        'error',
        {
          destructuring: 'all',
          ignoreReadBeforeAssign: false,
        },
      ],
      ...eslintConfigPrettier.rules,
    },
  },
];
