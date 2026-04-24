"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { NoSSR } from "@/components/ui/no-ssr";
import { useConnectionStatus } from "@/hooks/use-connection-status";
import { cn } from "@/lib/utils";
import {
  ArrowClockwiseIcon,
  WarningIcon,
  WifiHighIcon,
  WifiLowIcon,
  WifiMediumIcon,
  WifiSlashIcon,
} from "@phosphor-icons/react";
import { AnimatePresence, motion } from "framer-motion";

interface ConnectionStatusProps {
  className?: string;
  showDetails?: boolean;
  defaultShowStatusBar?: boolean;
}

export const ConnectionStatus = ({
  className = "",
  showDetails = false,
  defaultShowStatusBar = true,
}: ConnectionStatusProps) => {
  const { status, retry, isRetrying } = useConnectionStatus();
  const showStatusBar =
    !status.isOnline ||
    !status.isConnected ||
    status.connectionQuality === "poor";

  const getStatusIcon = () => {
    if (!status.isOnline) return <WifiSlashIcon className="w-4 h-4" />;
    if (!status.isConnected) return <WifiSlashIcon className="w-4 h-4" />;

    switch (status.connectionQuality) {
      case "excellent":
        return <WifiHighIcon className="w-4 h-4" />;
      case "good":
        return <WifiMediumIcon className="w-4 h-4" />;
      case "poor":
        return <WifiLowIcon className="w-4 h-4" />;
      default:
        return <WifiSlashIcon className="w-4 h-4" />;
    }
  };

  const getStatusColor = () => {
    if (!status.isOnline || !status.isConnected) return "text-text-muted";

    switch (status.connectionQuality) {
      case "excellent":
        return "text-text-primary";
      case "good":
        return "text-text-secondary";
      case "poor":
        return "text-text-muted";
      default:
        return "text-text-muted";
    }
  };

  const getStatusText = () => {
    if (!status.isOnline) return "Offline";
    if (!status.isConnected) return "Disconnected";

    switch (status.connectionQuality) {
      case "excellent":
        return "Connected";
      case "good":
        return "Good Connection";
      case "poor":
        return "Poor Connection";
      default:
        return "Offline";
    }
  };

  const getStatusBadgeVariant = () => {
    if (!status.isOnline || !status.isConnected) return "destructive";
    if (status.connectionQuality === "poor") return "secondary";
    return "default";
  };

  return (
    <div className={cn("relative", className)}>
      {/* Status Bar - shown when there are connection issues */}
      <AnimatePresence>
        {showStatusBar && defaultShowStatusBar && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className={cn(
              "flex items-center justify-between border-b border-borderSubtle p-3",
              !status.isOnline || !status.isConnected
                ? "bg-canvas-warm text-text-secondary"
                : "bg-canvas-near text-text-primary"
            )}
          >
            <div className="flex items-center gap-2">
              {getStatusIcon()}
              <span className="text-sm font-medium">{getStatusText()}</span>
              {status.error && (
                <div className="flex items-center gap-1">
                  <WarningIcon className="w-3 h-3" />
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
                <ArrowClockwiseIcon
                  className={cn("w-4 h-4", isRetrying && "animate-spin")}
                />
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Compact Status Indicator */}
      {showDetails && (
        <div className="flex items-center gap-2 text-xs text-text-muted">
          <div className={cn("flex items-center gap-1", getStatusColor())}>
            {getStatusIcon()}
            <span>{getStatusText()}</span>
          </div>

          {status.lastConnectionTime && (
            <NoSSR>
              <span className="text-text-muted">
                • Last connected:{" "}
                {status.lastConnectionTime.toLocaleTimeString()}
              </span>
            </NoSSR>
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
