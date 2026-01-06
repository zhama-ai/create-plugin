<script setup lang="ts">
/**
 * {{displayName}} Plugin Main App
 */
import { ref, onMounted } from 'vue';
import { pluginSDK } from './main';

// 插件显示名称（由 create-plugin 脚本替换）
const displayName = 'demo plugin';

// 状态
const workflowId = ref('');
const agentInput = ref('');
const agentOutput = ref('');
const isLoading = ref(false);
const error = ref<string | null>(null);

// 加载配置
onMounted(() => {
  if (pluginSDK) {
    console.log('[App] Plugin initialized:', {
      pluginId: pluginSDK.getPluginId(),
      userId: pluginSDK.getUserId(),
      theme: pluginSDK.getTheme(),
      locale: pluginSDK.getLocale(),
    });
  }
});

// 调用 Agent
async function handleCallAgent() {
  if (!agentInput.value.trim() || !workflowId.value.trim()) {
    return;
  }

  isLoading.value = true;
  error.value = null;
  agentOutput.value = '';

  try {
    if (!pluginSDK) {
      throw new Error('Plugin SDK not initialized');
    }

    console.log('[App] Calling agent with workflow:', workflowId.value);

    // 生成会话 ID
    const sessionId = `demo-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;

    // 调用智能体（通过 workflowId）
    const stream = pluginSDK.agent.callByWorkflowId({
      workflowId: workflowId.value,
      sessionId,
      params: {
        message: agentInput.value,
        input: agentInput.value,
      },
    });

    // 处理流式响应
    let fullResponse = '';
    for await (const chunk of stream) {
      console.log('[App] Received chunk:', chunk);

      if (chunk.type === 'content' && chunk.content) {
        fullResponse += chunk.content;
        agentOutput.value = fullResponse;
      } else if (chunk.type === 'error') {
        throw new Error(chunk.content || 'Agent 返回错误');
      }
    }

    console.log('[App] Agent call completed');
  } catch (err) {
    const errorMessage = err instanceof Error ? err.message : '未知错误';
    error.value = errorMessage;
    console.error('[App] Agent call failed:', err);
  } finally {
    isLoading.value = false;
  }
}
</script>

<template>
  <div class="flex min-h-screen flex-col bg-gray-50">
    <!-- Header -->
    <div class="border-b border-gray-200 bg-white px-6 py-4">
      <div class="flex items-center justify-between">
        <div class="flex items-center gap-3">
          <h1 class="text-2xl font-bold text-gray-900">{{displayName}}</h1>
          <span class="rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-gray-600">
            {{ pluginSDK?.getTheme() }}
          </span>
        </div>
      </div>
    </div>

    <!-- Main Content -->
    <div class="flex-1 p-6">
      <div class="mx-auto max-w-4xl space-y-6">
        <!-- 欢迎卡片 -->
        <div class="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
          <h2 class="mb-2 text-xl font-semibold text-gray-900">
            欢迎使用 {{displayName}}
          </h2>
          <p class="text-gray-600">
            这是一个基于 Tego OS 的插件模板。您可以在此基础上开发自己的插件功能。
          </p>
        </div>

        <!-- 配置信息 -->
        <div class="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
          <h2 class="mb-4 text-xl font-semibold text-gray-900">插件配置</h2>
          <div class="space-y-3">
            <div class="flex items-center justify-between border-b pb-2">
              <span class="text-sm font-medium text-gray-700">插件 ID:</span>
              <span class="text-sm text-gray-600">{{ pluginSDK?.getPluginId() }}</span>
            </div>
            <div class="flex items-center justify-between border-b pb-2">
              <span class="text-sm font-medium text-gray-700">版本:</span>
              <span class="text-sm text-gray-600">{{ pluginSDK?.getVersion() }}</span>
            </div>
            <div class="flex items-center justify-between border-b pb-2">
              <span class="text-sm font-medium text-gray-700">主题:</span>
              <span class="text-sm text-gray-600">{{ pluginSDK?.getTheme() }}</span>
            </div>
            <div class="flex items-center justify-between border-b pb-2">
              <span class="text-sm font-medium text-gray-700">语言:</span>
              <span class="text-sm text-gray-600">{{ pluginSDK?.getLocale() }}</span>
            </div>
            <div class="flex items-center justify-between border-b pb-2">
              <span class="text-sm font-medium text-gray-700">用户 ID:</span>
              <span class="text-sm text-gray-600">{{ pluginSDK?.getUserId() ?? '未登录' }}</span>
            </div>
          </div>
        </div>

        <!-- 智能体调用示例 -->
        <div class="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
          <h2 class="mb-4 flex items-center gap-2 text-xl font-semibold text-gray-900">
            <span>🤖</span>
            智能体调用示例
          </h2>

          <!-- Workflow ID 输入 -->
          <div class="mb-4">
            <label class="mb-2 block text-sm font-medium text-gray-700">
              Workflow ID
            </label>
            <input
              v-model="workflowId"
              type="text"
              placeholder="输入 n8n Workflow ID..."
              class="w-full rounded-lg border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              :disabled="isLoading"
            />
            <p class="mt-1 text-xs text-gray-500">
              可以在 n8n 中打开工作流，从 URL 复制 Workflow ID
            </p>
          </div>

          <!-- 输入区域 -->
          <div class="mb-4">
            <label class="mb-2 block text-sm font-medium text-gray-700">
              输入消息
            </label>
            <textarea
              v-model="agentInput"
              placeholder="输入您的问题或指令..."
              class="min-h-[100px] w-full rounded-lg border border-gray-300 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
              :disabled="isLoading"
            />
          </div>

          <!-- 调用按钮 -->
          <button
            @click="handleCallAgent"
            :disabled="isLoading || !agentInput.trim() || !workflowId.trim()"
            class="w-full rounded-lg bg-blue-600 px-6 py-3 font-medium text-white transition-colors hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <span v-if="isLoading" class="flex items-center justify-center gap-2">
              <svg class="h-5 w-5 animate-spin" viewBox="0 0 24 24">
                <circle
                  class="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  stroke-width="4"
                  fill="none"
                />
                <path
                  class="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                />
              </svg>
              调用中...
            </span>
            <span v-else>调用智能体</span>
          </button>

          <!-- 错误信息 -->
          <div
            v-if="error"
            class="mt-4 rounded-lg border border-red-200 bg-red-50 p-3"
          >
            <p class="text-sm font-medium text-red-900">调用失败</p>
            <p class="mt-1 text-xs text-red-700">{{ error }}</p>
          </div>

          <!-- 输出区域 -->
          <div v-if="agentOutput" class="mt-4">
            <label class="mb-2 block text-sm font-medium text-gray-700">
              智能体响应
            </label>
            <div class="rounded-lg border border-gray-200 bg-gray-50 p-4">
              <pre class="whitespace-pre-wrap text-sm text-gray-800">{{ agentOutput }}</pre>
            </div>
          </div>

          <!-- 使用提示 -->
          <div class="mt-4 rounded-lg border border-gray-200 bg-gray-50 p-3">
            <p class="text-xs font-medium text-gray-900">💡 使用提示：</p>
            <ul class="mt-2 space-y-1 text-xs text-gray-600">
              <li>• 在 n8n 中创建工作流，获取 Workflow ID</li>
              <li>• 使用 sdk.agent.callByWorkflowId({ workflowId, params }) 调用</li>
              <li>• SDK 会自动从 n8n 获取工作流配置，无需手动导出 JSON</li>
              <li>• 支持流式响应，通过 for await...of 处理返回的数据流</li>
              <li>• Token 自动从 localStorage 读取（与 dashboard 共用）</li>
            </ul>
          </div>
        </div>

        <!-- 开发提示 -->
        <div class="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
          <h2 class="mb-4 text-xl font-semibold text-gray-900">开发指南</h2>
          <div class="space-y-3 text-sm text-gray-600">
            <p>
              <strong class="text-gray-900">1. 插件开发:</strong>
              在 <code class="rounded bg-gray-100 px-1 py-0.5">src/</code>
              目录下开发您的插件功能
            </p>
            <p>
              <strong class="text-gray-900">2. Agent 调用:</strong>
              使用 <code class="rounded bg-gray-100 px-1 py-0.5">sdk.agent.callByWorkflowId()</code>
              调用智能体
            </p>
            <p>
              <strong class="text-gray-900">3. HTTP 请求:</strong>
              使用 <code class="rounded bg-gray-100 px-1 py-0.5">sdk.http.get/post()</code>
              发起请求，Token 自动携带
            </p>
            <p>
              <strong class="text-gray-900">4. 本地存储:</strong>
              使用 <code class="rounded bg-gray-100 px-1 py-0.5">sdk.storage.get/set()</code>
              存储数据
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* 组件级别样式 */
</style>
