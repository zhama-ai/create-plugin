import tegoEslintConfig from '@tego/eslint-config';

export default [
  ...tegoEslintConfig,

  {
    rules: {
      // CLI 工具允许使用 console
      'no-console': 'off',

      // CLI 工具可能需要 process.exit
      'no-process-exit': 'off',
    },
  },
];
