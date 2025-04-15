import js from '@eslint/js'
import globals from 'globals'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import tseslint from 'typescript-eslint'
import importPlugin from 'eslint-plugin-import'
import unusedImports from 'eslint-plugin-unused-imports'

export default tseslint.config(
  { ignores: ['dist'] },
  {
    extends: [js.configs.recommended, ...tseslint.configs.recommended],
    files: ['**/*.{ts,tsx}'],
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser,
    },
    plugins: {
      'react-hooks': reactHooks,
      'react-refresh': reactRefresh,
      import: importPlugin,
      'unused-imports': unusedImports,
    },
    rules: {
      ...reactHooks.configs.recommended.rules,
      'react-refresh/only-export-components': [
        'warn',
        { allowConstantExport: true },
      ],

      'no-unused-vars': 'off',
      'unused-imports/no-unused-imports': 'error',

      'import/extensions': [
        'error',
        {
          js: 'never',
          jsx: 'never',
          ts: 'never',
          tsx: 'never',
          json: 'ignorePackages',
        },
      ],
      'import/no-extraneous-dependencies': 'off',
      'import/no-named-as-default': 'off',
      'import/prefer-default-export': 'off',
      'import/no-cycle': 'off',

      'import/order': [
        'warn',
        {
          alphabetize: {
            order: 'asc',
            caseInsensitive: true,
          },
          groups: [
            'type',
            'builtin',
            'external',
            'internal',
            'parent',
            'sibling',
            'index',
            'unknown',
          ],
          'newlines-between': 'always',
          pathGroups: [
            {
              pattern: '{react*,react*/**}',
              group: 'external',
              position: 'before',
            },
            {
              pattern: 'src/context/*',
              group: 'internal',
              position: 'after',
            },
            {
              pattern: 'src/hooks/*',
              group: 'internal',
              position: 'after',
            },
            {
              pattern: 'src/pages/*',
              group: 'internal',
              position: 'after',
            },
            {
              pattern: 'src/components/*',
              group: 'internal',
              position: 'after',
            },
            {
              pattern: 'src/utils/*',
              group: 'internal',
              position: 'after',
            },
            {
              pattern: 'src/styles/*',
              group: 'internal',
              position: 'after',
            },
          ],
          pathGroupsExcludedImportTypes: ['react'],
        },
      ],
    },
  },
)
