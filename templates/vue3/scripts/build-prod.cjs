#!/usr/bin/env node

const { execSync } = require('child_process')
const fs = require('fs')
const path = require('path')

function log(message) {
  console.log(`\x1b[36m[build:prod]\x1b[0m ${message}`)
}

function error(message) {
  console.error(`\x1b[31m[build:prod]\x1b[0m ${message}`)
}

function success(message) {
  console.log(`\x1b[32m[build:prod]\x1b[0m ${message}`)
}

async function main() {
  try {
    // 1. 执行构建
    log('步骤 1/2: 执行 pnpm build...')
    execSync('pnpm build', { stdio: 'inherit' })
    success('构建完成')

    // 2. 读取 package.json 获取包名和版本，打包文件
    log('步骤 2/2: 打包文件...')
    const pkg = JSON.parse(fs.readFileSync('package.json', 'utf-8'))
    const packageName = pkg.name
    const packageVersion = pkg.version
    const zipFileName = `${packageName}-${packageVersion}.zip`
    const zipFilePath = path.resolve(zipFileName)

    // 复制配置文件到 dist 目录
    log('复制配置文件到 dist 目录...')
    fs.copyFileSync('plugin.config.json', 'dist/plugin.config.json')
    if (fs.existsSync('package.json')) {
      fs.copyFileSync('package.json', 'dist/package.json')
    }
    if (fs.existsSync('README.md')) {
      fs.copyFileSync('README.md', 'dist/README.md')
    }

    // 进入 dist 目录打包，这样 zip 根目录就是构建产物
    // 不会包含 dist/ 前缀
    const zipCommand = `cd dist && zip -r "${zipFilePath}" .`
    log(`执行: ${zipCommand}`)
    execSync(zipCommand, { stdio: 'inherit' })

    // 清理复制的配置文件
    fs.unlinkSync('dist/plugin.config.json')
    if (fs.existsSync('dist/package.json')) {
      fs.unlinkSync('dist/package.json')
    }
    if (fs.existsSync('dist/README.md')) {
      fs.unlinkSync('dist/README.md')
    }

    success(`已创建 ${zipFileName}`)
    success(`\n✨ 生产构建完成! 生成文件: ${zipFileName}`)
  } catch (err) {
    error(`构建失败: ${err.message}`)
    process.exit(1)
  }
}

main()

