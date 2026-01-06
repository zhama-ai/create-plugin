# {{displayName}}

基于 React + TypeScript 的 Tego OS 插件。

## 快速开始

```bash
# 安装依赖
pnpm install

# 启动开发服务器
pnpm dev

# 构建生产版本
pnpm build
```

## Plugin SDK 使用指南

### 初始化

SDK 在 `src/main.tsx` 中自动初始化，全局导出为 `pluginSDK`：

```typescript
import { pluginSDK } from './main';

// 使用 SDK
if (pluginSDK) {
  console.log('Plugin ID:', pluginSDK.getPluginId());
  console.log('User ID:', pluginSDK.getUserId());
}
```

### 配置信息获取

```typescript
// 基础配置
pluginSDK.getPluginId();    // 插件 ID
pluginSDK.getVersion();     // 插件版本
pluginSDK.getTheme();       // 当前主题: 'light' | 'dark' | 'system'
pluginSDK.getLocale();      // 当前语言

// 用户信息
pluginSDK.getUserId();      // 用户 ID
pluginSDK.getTenantId();    // 租户 ID
pluginSDK.getUser();        // 完整用户对象

// 自定义配置
pluginSDK.getCustomConfig<MyConfig>();  // 获取自定义配置
```

### HTTP 请求

SDK 自动处理认证和请求路由，所有请求会自动附带 Token：

```typescript
// GET 请求
const data = await pluginSDK.http.get('/api/items');

// POST 请求
const result = await pluginSDK.http.post('/api/items', {
  name: 'New Item',
  description: 'Description',
});

// PUT 请求
await pluginSDK.http.put('/api/items/1', { name: 'Updated' });

// DELETE 请求
await pluginSDK.http.delete('/api/items/1');

// 带查询参数
const filtered = await pluginSDK.http.get('/api/items', {
  params: { page: 1, limit: 10 },
});

// 自定义请求头
await pluginSDK.http.post('/api/data', payload, {
  headers: { 'X-Custom-Header': 'value' },
  timeout: 60000,
});
```

### 文件上传/下载

```typescript
// 文件上传
const file = inputElement.files[0];
const uploadResult = await pluginSDK.http.upload('/api/upload', file, {
  fieldName: 'file',              // 表单字段名（默认 'file'）
  data: { description: 'desc' },  // 附加数据
  onProgress: (percent) => {      // 上传进度
    console.log(`Upload: ${percent}%`);
  },
});

// 文件下载
const blob = await pluginSDK.http.download('/api/files/123', {
  onProgress: (percent) => {
    console.log(`Download: ${percent}%`);
  },
});

// 保存下载的文件
const url = URL.createObjectURL(blob);
const a = document.createElement('a');
a.href = url;
a.download = 'filename.pdf';
a.click();
```

### 智能体调用

#### 流式调用（推荐）

```typescript
// 通过 workflowId 调用（SDK 自动从 n8n 获取 workflow 配置）
const stream = pluginSDK.agent.callByWorkflowId({
  workflowId: 'your-workflow-id',  // 从 n8n 获取
  sessionId: 'session-123',        // 可选，会话 ID
  params: {                        // 传递给 Agent 的参数
    message: '你好',
    input: '用户输入',
  },
});

// 处理流式响应
let fullResponse = '';
for await (const chunk of stream) {
  switch (chunk.type) {
    case 'content':
      fullResponse += chunk.content;
      console.log('内容:', chunk.content);
      break;
    case 'error':
      console.error('错误:', chunk.content);
      break;
    case 'metadata':
      console.log('元数据:', chunk.metadata);
      break;
  }
}
```

#### 完整响应（等待全部完成）

```typescript
const result = await pluginSDK.agent.collectByWorkflowId({
  workflowId: 'your-workflow-id',
  params: { message: '分析这段文本' },
});

if (result.success) {
  console.log('成功:', result.content);
  console.log('元数据:', result.metadata);
} else {
  console.error('失败:', result.error);
}
```

### 本地存储

带命名空间的 localStorage 封装，数据隔离不会与其他插件冲突：

```typescript
// 存储数据
pluginSDK.storage.set('settings', { theme: 'dark', fontSize: 14 });
pluginSDK.storage.set('lastVisit', new Date().toISOString());

// 获取数据
const settings = pluginSDK.storage.get<{ theme: string }>('settings');
const lastVisit = pluginSDK.storage.get<string>('lastVisit');

// 带默认值获取
const count = pluginSDK.storage.getOrDefault('viewCount', 0);

// 检查是否存在
if (pluginSDK.storage.has('settings')) {
  // ...
}

// 删除数据
pluginSDK.storage.remove('settings');

// 清除当前插件的所有数据
pluginSDK.storage.clear();

// 获取所有键
const keys = pluginSDK.storage.keys();

// 获取存储大小（字节）
const size = pluginSDK.storage.size();
```

## 项目结构

```
├── src/
│   ├── main.tsx          # 应用入口，SDK 初始化
│   ├── app.tsx           # 主应用组件
│   ├── components/       # 组件目录
│   │   └── agent-demo.tsx  # Agent 调用示例
│   ├── hooks/            # 自定义 Hooks
│   │   └── use-plugin-config.ts
│   └── index.css         # 全局样式
├── plugin.config.json    # 插件配置文件
├── index.html            # HTML 入口
├── vite.config.ts        # Vite 配置
├── tailwind.config.js    # Tailwind 配置
└── package.json
```

## 构建部署

```bash
# 构建
pnpm build

# 构建产物在 dist/ 目录
# 将 dist/ 目录复制到 Tego OS 的 plugins/ 目录下即可
```

## 常见问题

### Token 从哪里来？

SDK 自动从 `localStorage` 读取与 Dashboard 共用的认证 Token，无需手动传递。

### 如何获取 Workflow ID？

在 n8n 中打开工作流，从浏览器地址栏复制 Workflow ID。

### 请求为什么返回 401？

确保：
1. 已登录 Tego OS Dashboard
2. Token 未过期
3. 用户有访问该资源的权限

