/**
 * __DISPLAY_NAME__ Plugin Main App
 */

import { AgentDemo } from './components/agent-demo';
import { usePluginConfig } from './hooks/use-plugin-config';
import { pluginSDK } from './main';

export function App() {
  console.log('[App] Rendering __DISPLAY_NAME__ plugin app...');

  // 获取插件配置
  const { config, isLoading, error } = usePluginConfig();

  return (
    <div className="flex min-h-screen flex-col bg-gray-50">
      {/* Header */}
      <div className="border-b border-gray-200 bg-white px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold text-gray-900">
              Demo Plugin
            </h1>
            <span className="rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-gray-600">
              {pluginSDK?.getTheme()}
            </span>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-6">
        <div className="mx-auto max-w-4xl space-y-6">
          {/* 欢迎卡片 */}
          <div className="rounded-lg border border-gray-200 bg-white shadow-sm">
            <div className="border-b border-gray-200 px-6 py-4">
              <h2 className="text-lg font-semibold text-gray-900">
                欢迎使用 Demo Plugin
              </h2>
            </div>
            <div className="px-6 py-4">
              <p className="text-gray-600">
                这是一个基于 Tego OS
                的插件模板。您可以在此基础上开发自己的插件功能。
              </p>
            </div>
          </div>

          {/* 配置信息 */}
          {isLoading && (
            <div className="rounded-lg border border-gray-200 bg-white px-6 py-8 text-center shadow-sm">
              <p className="text-gray-500">加载配置中...</p>
            </div>
          )}

          {error && (
            <div className="rounded-lg border border-red-200 bg-red-50 px-6 py-8 text-center">
              <p className="text-red-600">加载配置失败: {error.message}</p>
            </div>
          )}

          {config && !isLoading && !error && (
            <div className="rounded-lg border border-gray-200 bg-white shadow-sm">
              <div className="border-b border-gray-200 px-6 py-4">
                <h2 className="text-lg font-semibold text-gray-900">插件配置</h2>
              </div>
              <div className="px-6 py-4">
                <div className="space-y-3">
                  <div className="flex items-center justify-between border-b pb-2">
                    <span className="text-sm font-medium text-gray-700">
                      插件 ID:
                    </span>
                    <span className="text-sm text-gray-600">
                      {pluginSDK?.getPluginId()}
                    </span>
                  </div>
                  <div className="flex items-center justify-between border-b pb-2">
                    <span className="text-sm font-medium text-gray-700">
                      版本:
                    </span>
                    <span className="text-sm text-gray-600">
                      {pluginSDK?.getVersion()}
                    </span>
                  </div>
                  <div className="flex items-center justify-between border-b pb-2">
                    <span className="text-sm font-medium text-gray-700">
                      主题:
                    </span>
                    <span className="text-sm text-gray-600">
                      {pluginSDK?.getTheme()}
                    </span>
                  </div>
                  <div className="flex items-center justify-between border-b pb-2">
                    <span className="text-sm font-medium text-gray-700">
                      语言:
                    </span>
                    <span className="text-sm text-gray-600">
                      {pluginSDK?.getLocale()}
                    </span>
                  </div>
                  <div className="flex items-center justify-between border-b pb-2">
                    <span className="text-sm font-medium text-gray-700">
                      用户 ID:
                    </span>
                    <span className="text-sm text-gray-600">
                      {pluginSDK?.getUserId() ?? '未登录'}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* 智能体调用示例 */}
          <AgentDemo />

          {/* 开发提示 */}
          <div className="rounded-lg border border-gray-200 bg-white shadow-sm">
            <div className="border-b border-gray-200 px-6 py-4">
              <h2 className="text-lg font-semibold text-gray-900">开发指南</h2>
            </div>
            <div className="px-6 py-4">
              <div className="space-y-3 text-sm text-gray-600">
                <p>
                  <strong className="text-gray-900">1. 插件开发:</strong> 在{' '}
                  <code className="rounded bg-gray-100 px-1 py-0.5">src/</code>{' '}
                  目录下开发您的插件功能
                </p>
                <p>
                  <strong className="text-gray-900">2. Agent 调用:</strong> 使用{' '}
                  <code className="rounded bg-gray-100 px-1 py-0.5">
                    sdk.agent.callById()
                  </code>{' '}
                  调用智能体
                </p>
                <p>
                  <strong className="text-gray-900">3. HTTP 请求:</strong> 使用{' '}
                  <code className="rounded bg-gray-100 px-1 py-0.5">
                    sdk.http.get/post()
                  </code>{' '}
                  发起请求，Token 自动携带
                </p>
                <p>
                  <strong className="text-gray-900">4. 本地存储:</strong> 使用{' '}
                  <code className="rounded bg-gray-100 px-1 py-0.5">
                    sdk.storage.get/set()
                  </code>{' '}
                  存储数据
                </p>
              </div>
              <div className="mt-4">
                <button
                  onClick={() => console.log('插件配置:', config)}
                  className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
                >
                  查看完整配置（控制台）
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
