#!/usr/bin/env node

const { execSync } = require('child_process')
const fs = require('fs')

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

    // 执行打包
    const zipCommand = `zip -r ${zipFileName} dist plugin.config.json package.json README.md`
    log(`执行: ${zipCommand}`)
    execSync(zipCommand, { stdio: 'inherit' })
    success(`已创建 ${zipFileName}`)

    success(`\n✨ 生产构建完成! 生成文件: ${zipFileName}`)
  } catch (err) {
    error(`构建失败: ${err.message}`)
    process.exit(1)
  }
}

main()

