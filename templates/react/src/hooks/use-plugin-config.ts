/**
 * Plugin Config Hook
 * 使用 plugin-sdk 获取插件配置
 */

import { useState, useEffect, useCallback } from 'react';

import { pluginSDK } from '../main';

/**
 * 插件自定义配置接口
 */
export interface PluginCustomConfig {
  [key: string]: unknown;
}

export interface UsePluginConfigReturn {
  config: PluginCustomConfig | null;
  isLoading: boolean;
  error: Error | null;
  refetch: () => Promise<void>;
}

/**
 * 使用插件配置 Hook
 */
export function usePluginConfig(): UsePluginConfigReturn {
  const [config, setConfig] = useState<PluginCustomConfig | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchConfig = useCallback(async () => {
    console.log('[usePluginConfig] Starting fetchConfig...');
    setIsLoading(true);
    setError(null);

    try {
      if (!pluginSDK) {
        throw new Error('Plugin SDK not initialized');
      }

      // 从 SDK 获取自定义配置
      const customConfig = pluginSDK.getCustomConfig<PluginCustomConfig>();
      console.log('[usePluginConfig] Plugin custom config:', customConfig);
      setConfig(customConfig);
    } catch (err) {
      const errorObj =
        err instanceof Error ? err : new Error('Failed to fetch config');
      setError(errorObj);
      console.error(
        '[usePluginConfig] Failed to fetch plugin config:',
        errorObj
      );
    } finally {
      setIsLoading(false);
      console.log('[usePluginConfig] fetchConfig completed');
    }
  }, []);

  useEffect(() => {
    fetchConfig();
  }, [fetchConfig]);

  return {
    config,
    isLoading,
    error,
    refetch: fetchConfig,
  };
}
