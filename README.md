# @zhama/create-plugin

Tego OS 插件脚手架工具，快速创建基于 React 或 Vue 3 的插件项目。

## 快速开始

```bash
# 使用 npx（推荐）
npx @zhama/create-plugin my-plugin

# 或使用 pnpm
pnpm create @zhama/plugin my-plugin

# 交互式创建（不指定名称）
npx @zhama/create-plugin
```

## 可用模板

| 模板 | 描述 |
|------|------|
| **React + TypeScript** | React 19、Vite、Tailwind CSS、Plugin SDK |
| **Vue 3 + TypeScript** | Vue 3 Composition API、Vite、Tailwind CSS、Plugin SDK |

## 创建流程

1. 输入插件名称（kebab-case 格式，如 `my-plugin`）
2. 选择模板（React 或 Vue 3）
3. 输入显示名称（中文/英文）
4. 输入描述和作者信息（可选）

```
🚀 Tego OS Plugin Generator

? Plugin name (kebab-case): my-awesome-plugin
? Select a template: React + TypeScript
? Display name (中文): 我的插件
? Display name (English): My Awesome Plugin
? Description: A powerful plugin for Tego OS
? Author: Your Name

Creating plugin with the following settings:
  Name: my-awesome-plugin
  Template: React + TypeScript
  Display Name: My Awesome Plugin

✔ Plugin created successfully!
```

## 项目结构

创建的项目结构如下：

```
my-plugin/
├── src/
│   ├── main.tsx/ts       # 应用入口，SDK 初始化
│   ├── app.tsx/App.vue   # 主应用组件
│   ├── components/       # 组件目录
│   └── index.css         # 全局样式
├── plugin.config.json    # 插件配置文件
├── index.html            # HTML 入口
├── vite.config.ts        # Vite 配置
├── tailwind.config.js    # Tailwind 配置
├── tsconfig.json         # TypeScript 配置
├── package.json
└── README.md             # 插件使用说明
```

## Plugin SDK 使用

创建的插件已集成 `@zhama/plugin-sdk`，提供以下能力：

### 初始化

SDK 在入口文件中自动初始化：

```typescript
import { PluginSDK } from '@zhama/plugin-sdk';

const sdk = PluginSDK.init({
  pluginId: 'my-plugin',
});
```

### HTTP 请求

```typescript
// 自动携带认证 Token
const data = await sdk.http.get('/api/items');
await sdk.http.post('/api/items', { name: 'New Item' });
await sdk.http.put('/api/items/1', { name: 'Updated' });
await sdk.http.delete('/api/items/1');

// 文件上传（支持进度回调）
await sdk.http.upload('/api/upload', file, {
  onProgress: (percent) => console.log(`${percent}%`),
});

// 文件下载
const blob = await sdk.http.download('/api/files/123');
```

### 智能体调用

```typescript
// 流式调用（推荐）
const stream = sdk.agent.callByWorkflowId({
  workflowId: 'your-workflow-id',
  params: { message: '你好' },
});

for await (const chunk of stream) {
  if (chunk.type === 'content') {
    console.log(chunk.content);
  }
}

// 完整响应
const result = await sdk.agent.collectByWorkflowId({
  workflowId: 'your-workflow-id',
  params: { message: '你好' },
});

if (result.success) {
  console.log(result.content);
}
```

### 本地存储

```typescript
// 带命名空间的存储，不会与其他插件冲突
sdk.storage.set('settings', { theme: 'dark' });
const settings = sdk.storage.get('settings');
sdk.storage.remove('settings');
sdk.storage.clear();
```

### 配置获取

```typescript
sdk.getPluginId();    // 插件 ID
sdk.getVersion();     // 插件版本
sdk.getTheme();       // 当前主题
sdk.getLocale();      // 当前语言
sdk.getUserId();      // 用户 ID
sdk.getTenantId();    // 租户 ID
```

## 开发命令

```bash
# 进入插件目录
cd my-plugin

# 安装依赖
pnpm install

# 启动开发服务器
pnpm dev

# 构建生产版本
pnpm build

# 类型检查
pnpm type-check

# 代码检查
pnpm lint
```

## 部署

1. 构建插件：`pnpm build`
2. 构建产物位于 `dist/` 目录
3. 将 `dist/` 目录复制到 Tego OS 的 `plugins/` 目录
4. 重启 Tego OS 服务

## 配置文件

`plugin.config.json` 定义插件元信息：

```json
{
  "id": "my-plugin",
  "name": "my-plugin",
  "version": "1.0.0",
  "displayName": {
    "zh": "我的插件",
    "en": "My Plugin"
  },
  "description": {
    "zh": "插件描述",
    "en": "Plugin description"
  },
  "author": "Your Name",
  "category": "tools",
  "icon": "puzzle",
  "permissions": []
}
```

## 注意事项

1. **插件名称**：必须使用 kebab-case 格式（小写字母、数字、连字符）
2. **认证 Token**：SDK 自动从 localStorage 读取，与 Dashboard 共用
3. **API 路由**：所有 HTTP 请求自动路由到 `/api/v1/plugins/{pluginId}/*`
4. **Workflow ID**：在 n8n 中打开工作流，从 URL 复制获取

## 相关链接

- [Plugin SDK 文档](../plugin-sdk/README.md)
- [Agent Client 文档](../agent-client/README.md)
- [Tego OS 文档](../../docs/README.md)

