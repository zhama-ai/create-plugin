#!/usr/bin/env node

const { execSync } = require('child_process')
const fs = require('fs')
const path = require('path')

const CONFIG_FILE = 'plugin.config.json'
const BACKUP_FILE = 'plugin.config.json.backup'
const PRODUCTION_URL = 'http://tego-plugins:3000'

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
    log('步骤 1/4: 执行 pnpm build...')
    execSync('pnpm build', { stdio: 'inherit' })
    success('构建完成')

    // 2. 备份并修改 plugin.config.json
    log('步骤 2/4: 备份并修改 plugin.config.json...')
    const configPath = path.resolve(CONFIG_FILE)
    const backupPath = path.resolve(BACKUP_FILE)

    // 读取原始配置
    const originalConfig = fs.readFileSync(configPath, 'utf-8')
    const config = JSON.parse(originalConfig)

    // 备份原始文件
    fs.writeFileSync(backupPath, originalConfig)
    log(`已备份到 ${BACKUP_FILE}`)

    // 修改 backend.url
    if (config.backend && config.backend.url) {
      const oldUrl = config.backend.url
      config.backend.url = PRODUCTION_URL
      fs.writeFileSync(configPath, JSON.stringify(config, null, 2) + '\n')
      success(`已将 backend.url 从 "${oldUrl}" 修改为 "${PRODUCTION_URL}"`)
    } else {
      error('警告: plugin.config.json 中未找到 backend.url')
    }

    // 3. 读取 package.json 获取包名和版本
    log('步骤 3/4: 打包文件...')
    const pkg = JSON.parse(fs.readFileSync('package.json', 'utf-8'))
    const packageName = pkg.name
    const packageVersion = pkg.version
    const zipFileName = `${packageName}-${packageVersion}.zip`

    // 执行打包
    const zipCommand = `zip -r ${zipFileName} dist plugin.config.json package.json README.md`
    log(`执行: ${zipCommand}`)
    execSync(zipCommand, { stdio: 'inherit' })
    success(`已创建 ${zipFileName}`)

    // 4. 还原 plugin.config.json
    log('步骤 4/4: 还原 plugin.config.json...')
    fs.copyFileSync(backupPath, configPath)
    fs.unlinkSync(backupPath)
    success('已还原 plugin.config.json')

    success(`\n✨ 生产构建完成! 生成文件: ${zipFileName}`)
  } catch (err) {
    error(`构建失败: ${err.message}`)

    // 尝试还原配置文件
    const backupPath = path.resolve(BACKUP_FILE)
    if (fs.existsSync(backupPath)) {
      log('正在还原配置文件...')
      fs.copyFileSync(backupPath, path.resolve(CONFIG_FILE))
      fs.unlinkSync(backupPath)
      success('已还原 plugin.config.json')
    }

    process.exit(1)
  }
}

main()

