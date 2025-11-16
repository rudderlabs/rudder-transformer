import js from '@eslint/js';
import tseslint from 'typescript-eslint';
import importPlugin from 'eslint-plugin-import';
import unicornPlugin from 'eslint-plugin-unicorn';
import sonarjsPlugin from 'eslint-plugin-sonarjs';
import prettierConfig from 'eslint-config-prettier';
import globals from 'globals';

export default [
  // Ignore patterns (replacing .eslintignore)
  {
    ignores: [
      'node_modules/',
      '.husky/',
      'reports/',
      'test/',
      'benchmark/',
      'dist/',
      'dist-test/',
      '**/warehouse/',
      '**/lambda/',
      '**/openfaas/',
      '*.md',
      '*.test.js',
      '*.test.ts',
      'src/util/lodash-es-core.js',
      '**/ivm*.js',
      '**/custom*.js',
      'src/util/url-search-params.min.js',
      'src/logger.js',
      'src/util/eventValidations.js',
      '**/trackingPlan*',
      'src/v0/destinations/personalize/scripts/',
      'test/integrations/destinations/testTypes.d.ts',
      '*.config*.js',
      'scripts/skipPrepareScript.js',
      'scripts/create-github-release.js',
      '*.yaml',
      '*.yml',
      '.eslintignore',
      '.prettierignore',
      '*.json',
      'Dockerfile*',
      '*.properties',
      '*.go',
      'CODEOWNERS',
    ],
  },

  // Base recommended configs
  js.configs.recommended,

  // TypeScript recommended configs
  ...tseslint.configs.recommended,

  // JavaScript and TypeScript files (non-test)
  {
    files: ['**/*.js', '**/*.ts'],
    ignores: ['**/*.test.js', '**/*.test.ts'],
    languageOptions: {
      ecmaVersion: 12,
      sourceType: 'module',
      globals: {
        ...globals.node,
        ...globals.commonjs,
        ...globals.es2021,
        ...globals.jest,
      },
      parserOptions: {
        project: './tsconfig.json',
        extraFileExtensions: ['.yaml'],
      },
    },
    plugins: {
      import: importPlugin,
      unicorn: unicornPlugin,
      sonarjs: sonarjsPlugin,
    },
    rules: {
      // SonarJS recommended rules
      'sonarjs/cognitive-complexity': ['error', 60],
      'sonarjs/no-duplicate-string': 'error',
      'sonarjs/no-identical-functions': 'error',
      'sonarjs/prefer-immediate-return': 'off',
      'sonarjs/no-nested-template-literals': 'off',
      'sonarjs/max-switch-cases': 'error',
      'sonarjs/no-small-switch': 'error',
      'sonarjs/no-ignored-return': 'error',
      'sonarjs/no-same-line-conditional': 'error',

      // Unicorn rules
      'unicorn/filename-case': 'off',
      'unicorn/no-instanceof-array': 'error',
      'unicorn/no-static-only-class': 'error',
      'unicorn/consistent-destructuring': 'error',
      'unicorn/better-regex': 'error',
      'unicorn/no-for-loop': 'error',
      'unicorn/prefer-array-some': 'error',
      'unicorn/explicit-length-check': 'error',
      'unicorn/prefer-array-find': 'error',
      'unicorn/no-lonely-if': 'error',
      'unicorn/prefer-includes': 'error',
      'unicorn/prefer-array-flat-map': 'error',
      'unicorn/no-useless-spread': 'error',
      'unicorn/no-useless-length-check': 'error',
      'unicorn/prefer-export-from': 'error',

      // Import rules
      'import/no-import-module-exports': 'off',
      'import/no-dynamic-require': 'error',
      'import/prefer-default-export': 'off',
      'import/named': 'error',
      'import/no-unresolved': 'error',

      // General rules
      'no-param-reassign': 'error',
      'no-new': 'error',
      'no-restricted-syntax': ['error', 'ForInStatement'],
      'no-prototype-builtins': 'off',
      'class-methods-use-this': 'off',

      // TypeScript rules (some rules were renamed in v6+)
      '@typescript-eslint/no-require-imports': 'off', // replaces no-var-requires
      '@typescript-eslint/ban-ts-comment': 'off', // Allow @ts-ignore and @ts-expect-error
      '@typescript-eslint/naming-convention': [
        'error',
        {
          selector: 'variable',
          format: ['camelCase', 'PascalCase', 'UPPER_CASE'],
          leadingUnderscore: 'allow',
          trailingUnderscore: 'allow',
        },
        {
          selector: 'function',
          format: ['camelCase', 'PascalCase'],
        },
        {
          selector: 'typeLike',
          format: ['PascalCase'],
        },
        {
          selector: 'objectLiteralProperty',
          format: null, // Allow any format for object properties (common in configs)
        },
        {
          selector: 'objectLiteralMethod',
          format: ['camelCase', 'PascalCase', 'UPPER_CASE', 'snake_case'],
        },
        {
          selector: 'parameter',
          format: ['camelCase', 'PascalCase', 'snake_case', 'UPPER_CASE'], // Allow all common formats for parameters
          leadingUnderscore: 'allow',
        },
      ],
      '@typescript-eslint/no-explicit-any': 'off',
      '@typescript-eslint/return-await': 'error',
      '@typescript-eslint/no-shadow': 'error',
      '@typescript-eslint/no-loop-func': 'error',
      '@typescript-eslint/dot-notation': 'error',
      '@typescript-eslint/no-unused-vars': [
        'error',
        {
          argsIgnorePattern: '^_',
          varsIgnorePattern: '^_',
          caughtErrorsIgnorePattern: '^_|err|error|e',
        },
      ],

      // Rules that need to be disabled when TypeScript equivalents are enabled
      'no-shadow': 'off',
      'no-loop-func': 'off',
      'dot-notation': 'off',
      'no-unused-vars': 'off',
    },
    settings: {
      'import/resolver': {
        node: {
          extensions: ['.js', '.ts', '.json'],
        },
        typescript: {
          alwaysTryTypes: true,
          project: './tsconfig.json',
        },
      },
    },
  },

  // Test files - without project requirement
  {
    files: ['**/*.test.js', '**/*.test.ts'],
    languageOptions: {
      ecmaVersion: 12,
      sourceType: 'module',
      globals: {
        ...globals.node,
        ...globals.commonjs,
        ...globals.es2021,
        ...globals.jest,
      },
    },
    plugins: {
      import: importPlugin,
      unicorn: unicornPlugin,
      sonarjs: sonarjsPlugin,
    },
    rules: {
      // SonarJS rules
      'sonarjs/cognitive-complexity': 'off', // Turn off for tests
      'sonarjs/no-duplicate-string': 'off', // Often needed in tests
      'sonarjs/no-identical-functions': 'off', // Often needed in tests
      'sonarjs/prefer-immediate-return': 'off',
      'sonarjs/no-nested-template-literals': 'off',

      // Unicorn rules
      'unicorn/filename-case': 'off',
      'unicorn/no-instanceof-array': 'error',
      'unicorn/no-static-only-class': 'error',
      'unicorn/consistent-destructuring': 'off', // Turn off for tests
      'unicorn/better-regex': 'error',
      'unicorn/no-for-loop': 'error',
      'unicorn/prefer-array-some': 'error',
      'unicorn/explicit-length-check': 'error',
      'unicorn/prefer-array-find': 'error',
      'unicorn/no-lonely-if': 'error',
      'unicorn/prefer-includes': 'error',
      'unicorn/prefer-array-flat-map': 'error',
      'unicorn/no-useless-spread': 'error',
      'unicorn/no-useless-length-check': 'error',
      'unicorn/prefer-export-from': 'error',

      // Import rules
      'import/no-import-module-exports': 'off',
      'import/no-dynamic-require': 'off', // Often needed in tests
      'import/prefer-default-export': 'off',

      // General rules
      'no-param-reassign': 'off', // Often needed in tests
      'no-new': 'off',
      'no-restricted-syntax': 'off', // Turn off for tests
      'no-prototype-builtins': 'off',
      'class-methods-use-this': 'off',
      'no-undef': 'off', // Jest globals
      'no-useless-escape': 'off', // Often needed in test strings
      'no-dupe-keys': 'error',

      // TypeScript rules
      '@typescript-eslint/no-require-imports': 'off',
      '@typescript-eslint/no-explicit-any': 'off',
      '@typescript-eslint/ban-ts-comment': 'off',
      '@typescript-eslint/no-unused-expressions': 'off', // Often needed in tests (expect statements)
      '@typescript-eslint/no-unused-vars': [
        'warn', // Warning instead of error for tests
        {
          argsIgnorePattern:
            '^_|description|requestMetadata|version|dest|source|events|destinationType|processor|chunk|payload|config|request|status|result|order_id|query|total|handlerVersion|brazeProxy|responses|XMLBuilder|jsonpath|context|sha256|normalizeAndHash|OperatorType|InstrumentationError|SUBSCRIPTION_STATUS|VALID_STATUSES|toArray|batchResponseBuilder|PostscriptDestination|exp|Connection|tags|IDENTIFY_BRAZE_MAX_REQ_COUNT|output|v|d|e|m',
          varsIgnorePattern:
            '^_|description|requestMetadata|version|dest|source|events|destinationType|processor|chunk|payload|config|request|status|result|order_id|query|total|handlerVersion|brazeProxy|responses|XMLBuilder|jsonpath|context|sha256|normalizeAndHash|OperatorType|InstrumentationError|SUBSCRIPTION_STATUS|VALID_STATUSES|toArray|batchResponseBuilder|PostscriptDestination|exp|Connection|tags|IDENTIFY_BRAZE_MAX_REQ_COUNT|output|v|d|e|m',
          caughtErrorsIgnorePattern: '.*',
        },
      ],
    },
  },

  // Prettier config should be last to override other rules
  prettierConfig,
];
