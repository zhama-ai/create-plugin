import path from 'node:path';
import { fileURLToPath } from 'node:url';

import chalk from 'chalk';
import { Command } from 'commander';
import fs from 'fs-extra';
import ora from 'ora';
import prompts from 'prompts';
import validateNpmPackageName from 'validate-npm-package-name';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// 读取 package.json 获取版本号
const packageJsonPath = path.join(__dirname, '../package.json');
const packageJson = JSON.parse(await fs.readFile(packageJsonPath, 'utf-8'));
const VERSION = packageJson.version;

const program = new Command();

// Helper function to replace text in all files recursively
async function replaceInFiles(
  dir: string,
  pattern: RegExp,
  replacement: string
): Promise<void> {
  const entries = await fs.readdir(dir, { withFileTypes: true });

  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);

    // Skip node_modules and dist directories
    if (entry.name === 'node_modules' || entry.name === 'dist') {
      continue;
    }

    if (entry.isDirectory()) {
      await replaceInFiles(fullPath, pattern, replacement);
    } else if (entry.isFile()) {
      // Process text files (skip binary files)
      const ext = path.extname(entry.name).toLowerCase();
      const textExtensions = [
        '.ts',
        '.tsx',
        '.js',
        '.jsx',
        '.json',
        '.html',
        '.css',
        '.md',
        '.txt',
      ];

      if (textExtensions.includes(ext)) {
        const content = await fs.readFile(fullPath, 'utf-8');
        const newContent = content.replace(pattern, replacement);
        if (content !== newContent) {
          await fs.writeFile(fullPath, newContent, 'utf-8');
        }
      }
    }
  }
}

// 模板描述
const TEMPLATES = {
  react: {
    name: 'React + TypeScript',
    description: 'Modern React 19 with TypeScript, Vite, and Tailwind CSS',
    features: [
      '✓ React 19 with TypeScript',
      '✓ Vite for fast HMR',
      '✓ Tailwind CSS for styling',
      '✓ Plugin SDK integration',
      '✓ Backend runs in Node.js',
      '✓ Real-time WebSocket communication',
    ],
  },
  vue3: {
    name: 'Vue 3 + TypeScript',
    description:
      'Vue 3 with Composition API, TypeScript, Vite, and Tailwind CSS',
    features: [
      '✓ Vue 3 Composition API',
      '✓ TypeScript with strict mode',
      '✓ Vite for fast development',
      '✓ Tailwind CSS for styling',
      '✓ Plugin SDK integration',
      '✓ Backend runs in Node.js',
      '✓ Real-time WebSocket communication',
    ],
  },
};

program
  .name('create-plugin')
  .description('Create a new Tego OS plugin')
  .version(VERSION)
  .argument('[plugin-name]', 'plugin name (kebab-case)')
  .action(async (pluginName: string | undefined) => {
    console.log(chalk.bold.cyan('\n🚀 Tego OS Plugin Generator\n'));

    let displayNameZh = '';
    let displayNameEn = '';
    let description = '';
    let author = '';
    let template: 'react' | 'vue3' = 'react';

    // 准备提示问题
    const questions: any[] = [];

    // 如果没有提供插件名称，询问名称
    if (!pluginName) {
      questions.push({
        type: 'text',
        name: 'projectName',
        message: 'Plugin name (kebab-case):',
        initial: 'my-plugin',
        validate: (value: string) => {
          const validation = validateNpmPackageName(value);
          if (!validation.validForNewPackages) {
            return validation.errors?.[0] || 'Invalid package name';
          }
          if (!/^[a-z0-9-]+$/.test(value)) {
            return 'Plugin name must be kebab-case (lowercase, numbers, hyphens only)';
          }
          return true;
        },
      });
    }

    // 始终询问模板选择
    questions.push({
      type: 'select',
      name: 'template',
      message: 'Select a template:',
      choices: [
        {
          title: TEMPLATES.react.name,
          description: TEMPLATES.react.description,
          value: 'react',
        },
        {
          title: TEMPLATES.vue3.name,
          description: TEMPLATES.vue3.description,
          value: 'vue3',
        },
      ],
      initial: 0,
    });

    // 询问其他信息
    questions.push(
      {
        type: 'text',
        name: 'displayNameZh',
        message: 'Display name (中文):',
        initial: '我的插件',
        validate: (value: string) =>
          value.trim() ? true : 'Display name is required',
      },
      {
        type: 'text',
        name: 'displayNameEn',
        message: 'Display name (English):',
        initial: 'My Plugin',
        validate: (value: string) =>
          value.trim() ? true : 'Display name is required',
      },
      {
        type: 'text',
        name: 'description',
        message: 'Description:',
        initial: 'A Tego OS plugin',
      },
      {
        type: 'text',
        name: 'author',
        message: 'Author:',
        initial: '',
      }
    );

    // 执行交互式提示
    const response = await prompts(questions);

    // 检查是否取消
    if (
      (!pluginName && !response.projectName) ||
      response.template === undefined
    ) {
      console.log(chalk.red('\n❌ Plugin creation cancelled'));
      process.exit(1);
    }

    // 设置值
    const projectName = pluginName ?? response.projectName;
    template = response.template ?? 'react';
    displayNameZh = response.displayNameZh ?? '';
    displayNameEn = response.displayNameEn ?? '';
    description = response.description ?? '';
    author = response.author ?? '';

    // 验证插件名称
    const validation = validateNpmPackageName(projectName);
    if (!validation.validForNewPackages) {
      console.error(
        chalk.red(`\n❌ Invalid plugin name: ${validation.errors?.[0]}`)
      );
      process.exit(1);
    }

    if (!/^[a-z0-9-]+$/.test(projectName)) {
      console.error(
        chalk.red(
          '\n❌ Plugin name must be kebab-case (lowercase, numbers, hyphens only)'
        )
      );
      process.exit(1);
    }

    const targetDir = path.join(process.cwd(), projectName);

    // 检查目录是否存在
    if (await fs.pathExists(targetDir)) {
      console.error(
        chalk.red(`\n❌ Directory "${projectName}" already exists`)
      );
      process.exit(1);
    }

    // 显示创建信息
    console.log();
    console.log(chalk.bold('Creating plugin with the following settings:'));
    console.log(chalk.gray('  Name:'), chalk.cyan(projectName));
    console.log(
      chalk.gray('  Template:'),
      chalk.cyan(TEMPLATES[template].name)
    );
    if (displayNameEn) {
      console.log(chalk.gray('  Display Name:'), chalk.cyan(displayNameEn));
    }
    console.log();

    const spinner = ora('Creating plugin...').start();

    try {
      await fs.ensureDir(targetDir);

      const templateDir = path.join(__dirname, '../templates', template);

      if (!(await fs.pathExists(templateDir))) {
        throw new Error(`Template "${template}" not found`);
      }

      // 复制模板文件
      spinner.text = 'Copying template files...';
      await fs.copy(templateDir, targetDir);

      // 更新 package.json
      spinner.text = 'Updating package.json...';

      // Update package.json
      const pkgPath = path.join(targetDir, 'package.json');
      const pkg = (await fs.readJSON(pkgPath)) as Record<string, any>;
      pkg.name = `@tego/${projectName}`;
      if (description) pkg.description = description;
      if (author) pkg.author = author;

      await fs.writeJSON(pkgPath, pkg, { spaces: 2 });

      // Replace template placeholders
      spinner.text = 'Replacing template placeholders...';
      await replaceInFiles(targetDir, /\{\{pluginId\}\}/g, projectName);

      // Replace displayName placeholders
      if (displayNameZh) {
        await replaceInFiles(targetDir, /\{\{displayName\}\}/g, displayNameZh);
      }

      // Replace description placeholders
      if (description) {
        await replaceInFiles(targetDir, /\{\{description\}\}/g, description);
      }

      // Replace author placeholders
      if (author) {
        await replaceInFiles(targetDir, /\{\{author\}\}/g, author);
      }

      // 更新 plugin.config.json
      spinner.text = 'Updating plugin.config.json...';
      const configPath = path.join(targetDir, 'plugin.config.json');
      const config = (await fs.readJSON(configPath)) as Record<string, any>;
      config.id = projectName;
      config.name = projectName;

      if (displayNameZh || displayNameEn) {
        config.displayName = {
          zh: displayNameZh || displayNameEn || projectName,
          en: displayNameEn || displayNameZh || projectName,
        };
      }

      if (description) {
        config.description = {
          zh: description,
          en: description,
        };
      }

      if (author) {
        config.author = author;
      }

      await fs.writeJSON(configPath, config, { spaces: 2 });

      spinner.succeed(chalk.green('Plugin created successfully!'));

      // 显示后续步骤
      console.log();
      console.log(chalk.bold.green('✨ Success!'), 'Your plugin is ready.');
      console.log();
      console.log(chalk.bold('📦 Next steps:\n'));
      console.log(chalk.cyan(`  cd ${projectName}`));
      console.log(chalk.cyan('  pnpm install'));
      console.log(chalk.cyan('  pnpm dev'));
      console.log();

      // 显示模板特性
      const selectedTemplate = TEMPLATES[template];
      console.log(chalk.bold('📋 Template features:\n'));
      selectedTemplate.features.forEach(feature => {
        console.log(chalk.gray(`  ${feature}`));
      });
      console.log();

      // 显示构建说明
      console.log(chalk.bold('🔨 Build for production:\n'));
      console.log(chalk.cyan('  pnpm build'));
      console.log();
      console.log(
        chalk.gray('  The built files will be in the dist/ directory')
      );
      console.log(chalk.gray(`  Copy the plugin to: plugins/${projectName}/`));
      console.log();
    } catch (error) {
      spinner.fail(chalk.red('Failed to create plugin'));
      console.error(error);

      // 清理失败的目录
      try {
        await fs.remove(targetDir);
      } catch {
        // 忽略清理错误
      }

      process.exit(1);
    }
  });

program.parse();
