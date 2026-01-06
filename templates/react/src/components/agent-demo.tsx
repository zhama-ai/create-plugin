/**
 * 智能体调用示例组件
 * 演示如何使用 Plugin SDK 调用智能体
 */

import { useState } from 'react';

import { pluginSDK } from '../main';

export function AgentDemo() {
  const [workflowId, setWorkflowId] = useState('');
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleCallAgent = async () => {
    if (!input.trim() || !workflowId.trim()) return;

    setIsLoading(true);
    setError(null);
    setOutput('');

    try {
      if (!pluginSDK) {
        throw new Error('Plugin SDK not initialized');
      }

      console.log('[AgentDemo] Calling agent with workflow:', workflowId);

      // 生成会话 ID
      const sessionId = `demo-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;

      // 调用智能体（通过 workflowId）
      const stream = pluginSDK.agent.callByWorkflowId({
        workflowId,
        sessionId,
        params: {
          message: input,
          input: input,
        },
      });

      // 处理流式响应
      let fullResponse = '';
      for await (const chunk of stream) {
        console.log('[AgentDemo] Received chunk:', chunk);

        if (chunk.type === 'content' && chunk.content) {
          fullResponse += chunk.content;
          setOutput(fullResponse);
        } else if (chunk.type === 'error') {
          throw new Error(chunk.content || 'Agent 返回错误');
        }
      }

      console.log('[AgentDemo] Agent call completed');
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : '未知错误';
      setError(errorMessage);
      console.error('[AgentDemo] Agent call failed:', err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="rounded-lg border border-gray-200 bg-white shadow-sm">
      <div className="flex items-center gap-2 border-b border-gray-200 px-6 py-4">
        <svg
          className="h-5 w-5 text-gray-600"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
          />
        </svg>
        <h2 className="text-lg font-semibold text-gray-900">智能体调用示例</h2>
      </div>

      <div className="space-y-4 px-6 py-4">
        {/* Workflow ID 输入 */}
        <div>
          <label className="mb-2 block text-sm font-medium text-gray-700">
            Workflow ID
          </label>
          <input
            type="text"
            value={workflowId}
            onChange={e => setWorkflowId(e.target.value)}
            placeholder="输入 n8n Workflow ID..."
            disabled={isLoading}
            className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 disabled:bg-gray-100"
          />
          <p className="mt-1 text-xs text-gray-500">
            可以在 n8n 中打开工作流，从 URL 复制 Workflow ID
          </p>
        </div>

        {/* 输入区域 */}
        <div>
          <label className="mb-2 block text-sm font-medium text-gray-700">
            输入消息
          </label>
          <textarea
            value={input}
            onChange={e => setInput(e.target.value)}
            placeholder="输入您的问题或指令..."
            disabled={isLoading}
            rows={4}
            className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 disabled:bg-gray-100"
          />
        </div>

        {/* 调用按钮 */}
        <button
          onClick={handleCallAgent}
          disabled={isLoading || !input.trim() || !workflowId.trim()}
          className="flex w-full items-center justify-center gap-2 rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-gray-400"
        >
          {isLoading ? (
            <>
              <svg
                className="h-4 w-4 animate-spin"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                />
              </svg>
              调用中...
            </>
          ) : (
            <>
              <svg
                className="h-4 w-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
                />
              </svg>
              调用智能体
            </>
          )}
        </button>

        {/* 错误信息 */}
        {error && (
          <div className="rounded-lg border border-red-200 bg-red-50 p-3">
            <p className="text-sm font-medium text-red-900">调用失败</p>
            <p className="mt-1 text-xs text-red-700">{error}</p>
          </div>
        )}

        {/* 输出区域 */}
        {output && (
          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700">
              智能体响应
            </label>
            <div className="rounded-lg border border-gray-200 bg-gray-50 p-4">
              <pre className="whitespace-pre-wrap text-sm text-gray-800">
                {output}
              </pre>
            </div>
          </div>
        )}

        {/* 使用提示 */}
        <div className="rounded-lg border border-gray-200 bg-gray-50 p-3">
          <p className="text-xs font-medium text-gray-900">💡 使用提示：</p>
          <ul className="mt-2 space-y-1 text-xs text-gray-600">
            <li>• 在 n8n 中创建工作流，获取 Workflow ID</li>
            <li>
              • 使用 sdk.agent.callByWorkflowId({`{ workflowId, params }`}) 调用
            </li>
            <li>• SDK 会自动从 n8n 获取工作流配置，无需手动导出 JSON</li>
            <li>• 支持流式响应，通过 for await...of 处理返回的数据流</li>
            <li>• Token 自动从 localStorage 读取（与 dashboard 共用）</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
