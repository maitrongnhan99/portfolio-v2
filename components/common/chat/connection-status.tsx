"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { WifiHigh, WifiMedium, WifiLow, WifiSlash, ArrowClockwise, Warning, CheckCircle } from "@phosphor-icons/react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useConnectionStatus } from "@/hooks/use-connection-status";
import { cn } from "@/lib/utils";

interface ConnectionStatusProps {
  className?: string;
  showDetails?: boolean;
}

export const ConnectionStatus = ({ className = "", showDetails = false }: ConnectionStatusProps) => {
  const { status, retry, isRetrying } = useConnectionStatus();
  const [showStatusBar, setShowStatusBar] = useState(false);

  // Show status bar when offline or having connection issues
  useEffect(() => {
    const shouldShow = !status.isOnline || !status.isConnected || status.connectionQuality === 'poor';
    setShowStatusBar(shouldShow);
  }, [status.isOnline, status.isConnected, status.connectionQuality]);

  const getStatusIcon = () => {
    if (!status.isOnline) return <WifiSlash className="w-4 h-4" />;
    if (!status.isConnected) return <WifiSlash className="w-4 h-4" />;
    
    switch (status.connectionQuality) {
      case 'excellent':
        return <WifiHigh className="w-4 h-4" />;
      case 'good':
        return <WifiMedium className="w-4 h-4" />;
      case 'poor':
        return <WifiLow className="w-4 h-4" />;
      default:
        return <WifiSlash className="w-4 h-4" />;
    }
  };

  const getStatusColor = () => {
    if (!status.isOnline || !status.isConnected) return 'text-red-400';
    
    switch (status.connectionQuality) {
      case 'excellent':
        return 'text-green-400';
      case 'good':
        return 'text-yellow-400';
      case 'poor':
        return 'text-orange-400';
      default:
        return 'text-red-400';
    }
  };

  const getStatusText = () => {
    if (!status.isOnline) return 'Offline';
    if (!status.isConnected) return 'Disconnected';
    
    switch (status.connectionQuality) {
      case 'excellent':
        return 'Connected';
      case 'good':
        return 'Good Connection';
      case 'poor':
        return 'Poor Connection';
      default:
        return 'Offline';
    }
  };

  const getStatusBadgeVariant = () => {
    if (!status.isOnline || !status.isConnected) return 'destructive';
    if (status.connectionQuality === 'poor') return 'secondary';
    return 'default';
  };

  return (
    <div className={cn("relative", className)}>
      {/* Status Bar - shown when there are connection issues */}
      <AnimatePresence>
        {showStatusBar && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className={cn(
              "flex items-center justify-between p-3 border-b border-navy-lighter",
              !status.isOnline || !status.isConnected 
                ? "bg-red-500/10 text-red-400 border-red-500/30"
                : "bg-yellow-500/10 text-yellow-400 border-yellow-500/30"
            )}
          >
            <div className="flex items-center gap-2">
              {getStatusIcon()}
              <span className="text-sm font-medium">{getStatusText()}</span>
              {status.error && (
                <div className="flex items-center gap-1">
                  <Warning className="w-3 h-3" />
                  <span className="text-xs opacity-80">{status.error}</span>
                </div>
              )}
            </div>
            
            <div className="flex items-center gap-2">
              {status.retryCount > 0 && (
                <Badge variant="secondary" className="text-xs">
                  Attempt {status.retryCount}/3
                </Badge>
              )}
              <Button
                variant="ghost"
                size="sm"
                onClick={retry}
                disabled={isRetrying}
                className="h-auto p-1 text-current hover:bg-current/10"
              >
                <ArrowClockwise 
                  className={cn("w-4 h-4", isRetrying && "animate-spin")} 
                />
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Compact Status Indicator */}
      {showDetails && (
        <div className="flex items-center gap-2 text-xs text-slate/70">
          <div className={cn("flex items-center gap-1", getStatusColor())}>
            {getStatusIcon()}
            <span>{getStatusText()}</span>
          </div>
          
          {status.lastConnectionTime && (
            <span className="text-slate/50">
              • Last connected: {status.lastConnectionTime.toLocaleTimeString()}
            </span>
          )}
          
          {status.retryCount > 0 && (
            <Badge variant="secondary" className="text-xs">
              Retry {status.retryCount}
            </Badge>
          )}
        </div>
      )}
    </div>
  );
};

export default ConnectionStatus;