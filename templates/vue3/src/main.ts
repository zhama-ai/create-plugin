/**
 * {{displayName}} Plugin Main Entry
 */

import { PluginSDK } from '@zhama/plugin-sdk';
import { createApp } from 'vue';

import App from './App.vue';
import './style.css';

/**
 * 插件 SDK 实例（全局）
 */
export let pluginSDK: PluginSDK | null = null;

/**
 * 初始化并挂载应用
 */
function initAndMount() {
  try {
    // 初始化插件 SDK
    // - pluginId: 手动指定
    // - token/user: 自动从 localStorage 读取（与 dashboard 共用）
    // - 其他配置: 从服务端注入的 window.__TEGO_PLUGIN__ 读取
    pluginSDK = PluginSDK.init({
      pluginId: '{{pluginId}}',
    });

    console.log('[{{displayName}} Plugin] SDK initialized:', {
      pluginId: pluginSDK.getPluginId(),
      userId: pluginSDK.getUserId(),
      theme: pluginSDK.getTheme(),
      locale: pluginSDK.getLocale(),
    });

    // 挂载应用
    const appElement = document.getElementById('app');
    if (!appElement) {
      throw new Error('App element not found');
    }

    const app = createApp(App);
    app.mount(appElement);

    console.log('[{{displayName}} Plugin] App mounted successfully');
  } catch (error) {
    console.error('[{{displayName}} Plugin] Failed to initialize:', error);

    // 显示错误信息
    const appElement = document.getElementById('app');
    if (appElement) {
      appElement.innerHTML = `
        <div style="display: flex; align-items: center; justify-content: center; height: 100vh; font-family: system-ui;">
          <div style="text-align: center; max-width: 500px; padding: 40px;">
            <h2 style="color: #ef4444; margin-bottom: 16px;">插件启动失败</h2>
            <p style="color: #6b7280; margin-bottom: 24px;">${error instanceof Error ? error.message : '未知错误'}</p>
            <button
              onclick="window.location.reload()"
              style="background: #3b82f6; color: white; border: none; padding: 10px 20px; border-radius: 6px; cursor: pointer; font-size: 14px;"
            >
              重新加载
            </button>
          </div>
        </div>
      `;
    }
  }
}

// 启动应用
initAndMount();
