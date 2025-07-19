"use client";

import { useState, useEffect, useCallback } from 'react';

export interface ConnectionStatus {
  isOnline: boolean;
  isConnected: boolean;
  lastConnectionTime: Date | null;
  connectionQuality: 'excellent' | 'good' | 'poor' | 'offline';
  retryCount: number;
  error: string | null;
}

export interface UseConnectionStatusReturn {
  status: ConnectionStatus;
  retry: () => Promise<void>;
  checkConnection: () => Promise<boolean>;
  isRetrying: boolean;
}

export const useConnectionStatus = (): UseConnectionStatusReturn => {
  const [status, setStatus] = useState<ConnectionStatus>({
    isOnline: typeof navigator !== 'undefined' ? navigator.onLine : true,
    isConnected: true,
    lastConnectionTime: new Date(),
    connectionQuality: 'excellent',
    retryCount: 0,
    error: null,
  });

  const [isRetrying, setIsRetrying] = useState(false);

  // Check connection quality by measuring response time
  const checkConnection = useCallback(async (): Promise<boolean> => {
    try {
      const start = performance.now();
      const response = await fetch('/api/ai-assistant/chat', {
        method: 'GET',
        cache: 'no-store',
      });
      const end = performance.now();
      const responseTime = end - start;

      const isConnected = response.ok;
      
      if (isConnected) {
        let quality: ConnectionStatus['connectionQuality'];
        if (responseTime < 200) quality = 'excellent';
        else if (responseTime < 500) quality = 'good';
        else if (responseTime < 1000) quality = 'poor';
        else quality = 'poor';

        setStatus(prev => ({
          ...prev,
          isConnected: true,
          lastConnectionTime: new Date(),
          connectionQuality: quality,
          error: null,
          retryCount: 0,
        }));
      } else {
        setStatus(prev => ({
          ...prev,
          isConnected: false,
          connectionQuality: 'offline',
          error: `Connection failed: ${response.status}`,
        }));
      }

      return isConnected;
    } catch (error) {
      setStatus(prev => ({
        ...prev,
        isConnected: false,
        connectionQuality: 'offline',
        error: error instanceof Error ? error.message : 'Unknown connection error',
      }));
      return false;
    }
  }, []);

  // Retry connection with exponential backoff
  const retry = useCallback(async (): Promise<void> => {
    if (isRetrying) return;

    setIsRetrying(true);
    
    try {
      const maxRetries = 3;
      let currentRetry = 0;

      while (currentRetry < maxRetries) {
        setStatus(prev => ({ ...prev, retryCount: currentRetry + 1 }));

        const isConnected = await checkConnection();
        
        if (isConnected) {
          setStatus(prev => ({ ...prev, retryCount: 0 }));
          break;
        }

        currentRetry++;
        
        if (currentRetry < maxRetries) {
          // Exponential backoff: 1s, 2s, 4s
          const delay = Math.pow(2, currentRetry) * 1000;
          await new Promise(resolve => setTimeout(resolve, delay));
        }
      }
    } finally {
      setIsRetrying(false);
    }
  }, [isRetrying, checkConnection]);

  // Handle online/offline events
  useEffect(() => {
    const handleOnline = () => {
      setStatus(prev => ({ ...prev, isOnline: true }));
      checkConnection();
    };

    const handleOffline = () => {
      setStatus(prev => ({
        ...prev,
        isOnline: false,
        isConnected: false,
        connectionQuality: 'offline',
        error: 'Device is offline',
      }));
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, [checkConnection]);

  // Periodic connection check
  useEffect(() => {
    const interval = setInterval(() => {
      if (status.isOnline && !isRetrying) {
        checkConnection();
      }
    }, 30000); // Check every 30 seconds

    return () => clearInterval(interval);
  }, [status.isOnline, isRetrying, checkConnection]);

  // Initial connection check
  useEffect(() => {
    checkConnection();
  }, [checkConnection]);

  return {
    status,
    retry,
    checkConnection,
    isRetrying,
  };
};