import { defineConfig } from 'tsup';

export default defineConfig({
  // CLI 入口文件
  entry: ['src/index.ts'],

  // 输出格式：ESM
  format: ['esm'],

  // 输出目录
  outDir: 'dist',

  // 生成类型声明文件
  dts: true,

  // 生成 source map
  sourcemap: true,

  // 清理输出目录
  clean: true,

  // 分离代码块
  splitting: false,

  // 不打包依赖（CLI 工具需要 node_modules）
  external: [
    'chalk',
    'commander',
    'fs-extra',
    'ora',
    'prompts',
    'validate-npm-package-name',
  ],

  // 保留 shebang
  shims: true,

  // 添加 shebang 到输出文件
  esbuildOptions(options) {
    options.banner = {
      js: '#!/usr/bin/env node',
    };
  },

  // 平台
  platform: 'node',

  // 目标环境
  target: 'node18',

  // 构建成功提示
  onSuccess: 'echo "✅ @zhama/create-plugin build completed"',
});
