import baseConfig from '@notion-search-agent/eslint';
import typescriptEslintPlugin from '@typescript-eslint/eslint-plugin';
import parser from '@typescript-eslint/parser';
import importPlugin from 'eslint-plugin-import';

export default [
  importPlugin.flatConfigs.recommended,
  {
    files: ['**/*.ts'],
    languageOptions: {
      parser,
      parserOptions: {
        project: 'tsconfig.json',
        tsconfigRootDir: '.',
        sourceType: 'module',
      },
      globals: {
        node: true,
        jest: true,
      },
    },
    plugins: {
      '@typescript-eslint/eslint-plugin': typescriptEslintPlugin,
    },
    languageOptions: {
      parser,
    },
    rules: {
      '@typescript-eslint/interface-name-prefix': 'off',
      '@typescript-eslint/explicit-function-return-type': 'off',
      '@typescript-eslint/explicit-module-boundary-types': 'off',
      '@typescript-eslint/no-explicit-any': 'off',
    },
  },
  {
    rules: {
      'import/named': 'off',
      'import/no-unresolved': 'off',
    },
  },
  ...baseConfig,
];
