/**
 * FSD 아키텍처 구조를 준수하기 위해 상위 계층에서 하위 계층의 파일을 참조하지 못하도록 제한합니다.
 */

import typescriptEslintPlugin from '@typescript-eslint/eslint-plugin';
import parser from '@typescript-eslint/parser';

const languageOptions = {
  parser,
  parserOptions: {
    project: 'tsconfig.json',
    tsconfigRootDir: import.meta.dirname,
    sourceType: 'module',
  },
  globals: {
    node: true,
    jest: true,
  },
};

const plugins = {
  '@typescript-eslint/eslint-plugin': typescriptEslintPlugin,
};

export default [
  {
    files: ['src/pages/**/*.{ts,tsx,js,jsx}'],
    plugins: plugins,
    languageOptions,
    rules: {
      'no-restricted-imports': [
        'error',
        {
          patterns: ['**/app/**'],
        },
      ],
    },
  },
  {
    files: ['src/widgets/**/*.{ts,tsx,js,jsx}'],
    plugins: plugins,
    languageOptions,
    rules: {
      'no-restricted-imports': [
        'error',
        {
          patterns: ['**/pages/**', '**/app/**'],
        },
      ],
    },
  },
  {
    files: ['src/features/**/*.{ts,tsx,js,jsx}'],
    plugins: plugins,
    languageOptions,
    rules: {
      'no-restricted-imports': [
        'error',
        {
          patterns: ['**/widgets/**', '**/pages/**', '**/app/**'],
        },
      ],
    },
  },
  {
    files: ['src/entities/**/*.{ts,tsx,js,jsx}'],
    plugins: plugins,
    languageOptions,
    rules: {
      'no-restricted-imports': [
        'error',
        {
          patterns: ['**/features/**', '**/widgets/**', '**/pages/**', '**/app/**'],
        },
      ],
    },
  },
  {
    files: ['src/shared/**/*.{ts,tsx,js,jsx}'],
    plugins: plugins,
    languageOptions,
    rules: {
      'no-restricted-imports': [
        'error',
        {
          patterns: ['**/features/**', '**/widgets/**', '**/pages/**', '**/app/**', '**/entities/**'],
        },
      ],
    },
  },
];
