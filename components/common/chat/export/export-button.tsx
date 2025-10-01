"use client";

import { useState } from "react";
import { DownloadIcon, FileArrowDownIcon } from "@phosphor-icons/react";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSeparator } from "@/components/ui/dropdown-menu";
import { ConversationExporter, type ExportFormat } from "@/lib/export-utils";
import { Conversation } from "@/hooks/use-conversation-history";
import { ExportDialog } from "./export-dialog";

interface ExportButtonProps {
  conversation: Conversation;
  disabled?: boolean;
  variant?: 'default' | 'outline' | 'ghost';
  size?: 'default' | 'sm' | 'lg';
}

export function ExportButton({ 
  conversation, 
  disabled = false, 
  variant = 'outline',
  size = 'default'
}: ExportButtonProps) {
  const [isExporting, setIsExporting] = useState<ExportFormat | null>(null);

  const handleQuickExport = async (format: ExportFormat) => {
    try {
      setIsExporting(format);
      
      const result = await ConversationExporter.exportConversation(
        conversation,
        format,
        {
          includeMetadata: true,
          includeSources: true,
          includeTimestamps: true,
          compressOutput: false,
        }
      );
      
      ConversationExporter.downloadFile(result.content, result.filename, result.mimeType);
    } catch (error) {
      console.error('Export failed:', error);
      alert('Export failed. Please try again.');
    } finally {
      setIsExporting(null);
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant={variant}
          size={size}
          disabled={disabled || !conversation || conversation.messages.length === 0}
          className="flex items-center gap-2"
        >
          <FileArrowDownIcon className="w-4 h-4" />
          <span className="hidden sm:inline">Export</span>
        </Button>
      </DropdownMenuTrigger>
      
      <DropdownMenuContent align="end" className="w-48 bg-navy-light border-navy-lighter">
        <DropdownMenuItem
          onClick={() => handleQuickExport('markdown')}
          disabled={isExporting === 'markdown'}
          className="text-slate-lighter hover:bg-navy cursor-pointer"
        >
          <div className="flex items-center gap-2">
            <DownloadIcon className="w-4 h-4" />
            <span>Markdown (.md)</span>
          </div>
        </DropdownMenuItem>
        
        <DropdownMenuItem
          onClick={() => handleQuickExport('txt')}
          disabled={isExporting === 'txt'}
          className="text-slate-lighter hover:bg-navy cursor-pointer"
        >
          <div className="flex items-center gap-2">
            <DownloadIcon className="w-4 h-4" />
            <span>Plain Text (.txt)</span>
          </div>
        </DropdownMenuItem>
        
        <DropdownMenuItem
          onClick={() => handleQuickExport('json')}
          disabled={isExporting === 'json'}
          className="text-slate-lighter hover:bg-navy cursor-pointer"
        >
          <div className="flex items-center gap-2">
            <DownloadIcon className="w-4 h-4" />
            <span>JSON (.json)</span>
          </div>
        </DropdownMenuItem>
        
        <DropdownMenuItem
          onClick={() => handleQuickExport('csv')}
          disabled={isExporting === 'csv'}
          className="text-slate-lighter hover:bg-navy cursor-pointer"
        >
          <div className="flex items-center gap-2">
            <DownloadIcon className="w-4 h-4" />
            <span>CSV (.csv)</span>
          </div>
        </DropdownMenuItem>
        
        <DropdownMenuSeparator className="bg-navy-lighter" />
        
        <ExportDialog conversation={conversation} disabled={disabled}>
          <DropdownMenuItem
            onSelect={(e) => e.preventDefault()}
            className="text-slate-lighter hover:bg-navy cursor-pointer"
          >
            <div className="flex items-center gap-2">
              <DownloadIcon className="w-4 h-4" />
              <span>Advanced Export...</span>
            </div>
          </DropdownMenuItem>
        </ExportDialog>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

