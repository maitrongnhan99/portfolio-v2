"use client";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Conversation } from "@/hooks/use-conversation-history";
import {
  ConversationExporter,
  type ExportFormat,
  type ExportOptions,
} from "@/lib/export-utils";
import {
  DownloadIcon,
  DownloadSimpleIcon,
  FileCodeIcon,
  FileCsvIcon,
  FileTextIcon,
} from "@phosphor-icons/react";
import { motion } from "framer-motion";
import { useState } from "react";

interface ExportDialogProps {
  conversation?: Conversation;
  conversations?: Conversation[];
  currentConversation?: Conversation | null;
  onClose?: () => void;
  children?: React.ReactNode;
  disabled?: boolean;
}

const formatOptions = [
  {
    value: "json",
    label: "JSON",
    icon: FileCodeIcon,
    description: "Machine-readable format",
  },
  {
    value: "markdown",
    label: "Markdown",
    icon: FileTextIcon,
    description: "Formatted text with styling",
  },
  {
    value: "txt",
    label: "Plain Text",
    icon: FileTextIcon,
    description: "Simple text format",
  },
  {
    value: "csv",
    label: "CSV",
    icon: FileCsvIcon,
    description: "Spreadsheet format",
  },
] as const;

export function ExportDialog({
  conversation,
  conversations,
  currentConversation,
  onClose,
  children,
  disabled = false,
}: ExportDialogProps) {
  // Determine if dialog is controlled or uncontrolled
  const isControlled = onClose !== undefined;
  const [internalOpen, setInternalOpen] = useState(false);
  const isOpen = isControlled ? true : internalOpen;
  const setIsOpen = isControlled
    ? (open: boolean) => {
        if (!open) onClose();
      }
    : setInternalOpen;

  const [selectedFormat, setSelectedFormat] =
    useState<ExportFormat>("markdown");
  const [isExporting, setIsExporting] = useState(false);
  const [exportOptions, setExportOptions] = useState<ExportOptions>({
    includeMetadata: true,
    includeSources: true,
    includeTimestamps: true,
    compressOutput: false,
  });
  const [selectedConversations, setSelectedConversations] = useState<string[]>(
    []
  );

  const handleExport = async () => {
    try {
      setIsExporting(true);

      // Determine what to export
      let conversationsToExport: Conversation[] = [];

      if (conversation) {
        // Single conversation mode
        conversationsToExport = [conversation];
      } else if (conversations && conversations.length > 0) {
        // Multiple conversations mode
        if (selectedConversations.length > 0) {
          conversationsToExport = conversations.filter((c) =>
            selectedConversations.includes(c.id)
          );
        } else if (currentConversation) {
          conversationsToExport = [currentConversation];
        } else {
          conversationsToExport = conversations;
        }
      }

      if (conversationsToExport.length === 0) {
        alert("No conversations to export");
        return;
      }

      // Export single or multiple conversations
      if (conversationsToExport.length === 1) {
        const result = await ConversationExporter.exportConversation(
          conversationsToExport[0],
          selectedFormat,
          exportOptions
        );
        ConversationExporter.downloadFile(
          result.content,
          result.filename,
          result.mimeType
        );
      } else {
        // For multiple conversations, we'll need to implement batch export
        // For now, export them as a single JSON file
        const exportData = {
          conversations: conversationsToExport,
          exportDate: new Date().toISOString(),
          totalConversations: conversationsToExport.length,
          totalMessages: conversationsToExport.reduce(
            (sum, conv) => sum + (conv.messages?.length || 0),
            0
          ),
        };

        const content = JSON.stringify(exportData, null, 2);
        const filename = `conversations-export-${
          new Date().toISOString().split("T")[0]
        }.json`;
        ConversationExporter.downloadFile(
          content,
          filename,
          "application/json"
        );
      }

      setIsOpen(false);
    } catch (error) {
      console.error("Export failed:", error);
      alert("Export failed. Please try again.");
    } finally {
      setIsExporting(false);
    }
  };

  const updateExportOption = (option: keyof ExportOptions, value: boolean) => {
    setExportOptions((prev) => ({ ...prev, [option]: value }));
  };

  const selectedFormatInfo = formatOptions.find(
    (f) => f.value === selectedFormat
  );

  // For controlled mode, render dialog directly without trigger
  if (isControlled) {
    return (
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="sm:max-w-[500px] bg-navy-light border-navy-lighter">
          <DialogHeader>
            <DialogTitle className="text-slate-lighter flex items-center gap-2">
              <DownloadIcon className="w-5 h-5 text-primary" />
              Export Conversation
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-6">
            {/* Format Selection */}
            <div className="space-y-3">
              <Label className="text-slate-lighter font-medium">
                Export Format
              </Label>
              <Select
                value={selectedFormat}
                onValueChange={(value) =>
                  setSelectedFormat(value as ExportFormat)
                }
              >
                <SelectTrigger className="bg-navy border-navy-lighter text-slate-lighter">
                  <SelectValue placeholder="Select format" />
                </SelectTrigger>
                <SelectContent className="bg-navy-light border-navy-lighter">
                  {formatOptions.map((format) => (
                    <SelectItem
                      key={format.value}
                      value={format.value}
                      className="text-slate-lighter hover:bg-navy"
                    >
                      <div className="flex items-center gap-2">
                        <format.icon className="w-4 h-4" />
                        <div>
                          <div className="font-medium">{format.label}</div>
                          <div className="text-xs text-slate/60">
                            {format.description}
                          </div>
                        </div>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Export Options */}
            <div className="space-y-3">
              <Label className="text-slate-lighter font-medium">
                Export Options
              </Label>
              <div className="grid grid-cols-2 gap-3">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="metadata"
                    checked={exportOptions.includeMetadata}
                    onCheckedChange={(checked) =>
                      updateExportOption("includeMetadata", checked as boolean)
                    }
                    className="border-navy-lighter"
                  />
                  <Label
                    htmlFor="metadata"
                    className="text-sm text-slate-lighter"
                  >
                    Include metadata
                  </Label>
                </div>

                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="sources"
                    checked={exportOptions.includeSources}
                    onCheckedChange={(checked) =>
                      updateExportOption("includeSources", checked as boolean)
                    }
                    className="border-navy-lighter"
                  />
                  <Label
                    htmlFor="sources"
                    className="text-sm text-slate-lighter"
                  >
                    Include sources
                  </Label>
                </div>

                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="timestamps"
                    checked={exportOptions.includeTimestamps}
                    onCheckedChange={(checked) =>
                      updateExportOption(
                        "includeTimestamps",
                        checked as boolean
                      )
                    }
                    className="border-navy-lighter"
                  />
                  <Label
                    htmlFor="timestamps"
                    className="text-sm text-slate-lighter"
                  >
                    Include timestamps
                  </Label>
                </div>

                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="compress"
                    checked={exportOptions.compressOutput}
                    onCheckedChange={(checked) =>
                      updateExportOption("compressOutput", checked as boolean)
                    }
                    className="border-navy-lighter"
                  />
                  <Label
                    htmlFor="compress"
                    className="text-sm text-slate-lighter"
                  >
                    Compress output
                  </Label>
                </div>
              </div>
            </div>

            {/* Preview Info */}
            <div className="bg-navy/50 rounded-lg p-4 border border-navy-lighter">
              <div className="flex items-center gap-2 mb-2">
                {selectedFormatInfo && (
                  <selectedFormatInfo.icon className="w-4 h-4 text-primary" />
                )}
                <span className="text-sm font-medium text-slate-lighter">
                  Export Preview
                </span>
              </div>
              <div className="space-y-1 text-xs text-slate/70">
                {conversation ? (
                  <>
                    <div>Conversation: {conversation.title}</div>
                    <div>
                      Messages:{" "}
                      {conversation.messageCount ||
                        conversation.messages?.length ||
                        0}
                    </div>
                  </>
                ) : conversations ? (
                  <>
                    <div>Conversations: {conversations.length}</div>
                    <div>
                      Current:{" "}
                      {currentConversation?.title || "All conversations"}
                    </div>
                  </>
                ) : (
                  <div>No conversation data available</div>
                )}
                <div>Format: {selectedFormatInfo?.label}</div>
                <div>
                  Options:{" "}
                  {Object.entries(exportOptions)
                    .filter(([_, value]) => value)
                    .map(([key]) => key)
                    .join(", ")}
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-2 justify-end">
              <Button
                variant="outline"
                onClick={() => setIsOpen(false)}
                disabled={isExporting}
                className="border-navy-lighter text-slate-lighter hover:bg-navy-light"
              >
                Cancel
              </Button>
              <Button
                onClick={handleExport}
                disabled={isExporting}
                className="bg-primary text-white hover:bg-primary/90"
              >
                {isExporting ? (
                  <>
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{
                        duration: 1,
                        repeat: Infinity,
                        ease: "linear",
                      }}
                      className="w-4 h-4 border-2 border-white border-t-transparent rounded-full mr-2"
                    />
                    Exporting...
                  </>
                ) : (
                  <>
                    <DownloadIcon className="w-4 h-4 mr-2" />
                    Export
                  </>
                )}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  // For uncontrolled mode, render with trigger
  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild disabled={disabled}>
        {children}
      </DialogTrigger>

      <DialogContent className="sm:max-w-[500px] bg-navy-light border-navy-lighter">
        <DialogHeader>
          <DialogTitle className="text-slate-lighter flex items-center gap-2">
            <DownloadSimpleIcon className="w-5 h-5 text-primary" />
            Export Conversation
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Format Selection */}
          <div className="space-y-3">
            <Label className="text-slate-lighter font-medium">
              Export Format
            </Label>
            <Select
              value={selectedFormat}
              onValueChange={(value) =>
                setSelectedFormat(value as ExportFormat)
              }
            >
              <SelectTrigger className="bg-navy border-navy-lighter text-slate-lighter">
                <SelectValue placeholder="Select format" />
              </SelectTrigger>
              <SelectContent className="bg-navy-light border-navy-lighter">
                {formatOptions.map((format) => (
                  <SelectItem
                    key={format.value}
                    value={format.value}
                    className="text-slate-lighter hover:bg-navy"
                  >
                    <div className="flex items-center gap-2">
                      <format.icon className="w-4 h-4" />
                      <div>
                        <div className="font-medium">{format.label}</div>
                        <div className="text-xs text-slate/60">
                          {format.description}
                        </div>
                      </div>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Export Options */}
          <div className="space-y-3">
            <Label className="text-slate-lighter font-medium">
              Export Options
            </Label>
            <div className="grid grid-cols-2 gap-3">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="metadata"
                  checked={exportOptions.includeMetadata}
                  onCheckedChange={(checked) =>
                    updateExportOption("includeMetadata", checked as boolean)
                  }
                  className="border-navy-lighter"
                />
                <Label
                  htmlFor="metadata"
                  className="text-sm text-slate-lighter"
                >
                  Include metadata
                </Label>
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="sources"
                  checked={exportOptions.includeSources}
                  onCheckedChange={(checked) =>
                    updateExportOption("includeSources", checked as boolean)
                  }
                  className="border-navy-lighter"
                />
                <Label htmlFor="sources" className="text-sm text-slate-lighter">
                  Include sources
                </Label>
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="timestamps"
                  checked={exportOptions.includeTimestamps}
                  onCheckedChange={(checked) =>
                    updateExportOption("includeTimestamps", checked as boolean)
                  }
                  className="border-navy-lighter"
                />
                <Label
                  htmlFor="timestamps"
                  className="text-sm text-slate-lighter"
                >
                  Include timestamps
                </Label>
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="compress"
                  checked={exportOptions.compressOutput}
                  onCheckedChange={(checked) =>
                    updateExportOption("compressOutput", checked as boolean)
                  }
                  className="border-navy-lighter"
                />
                <Label
                  htmlFor="compress"
                  className="text-sm text-slate-lighter"
                >
                  Compress output
                </Label>
              </div>
            </div>
          </div>

          {/* Preview Info */}
          <div className="bg-navy/50 rounded-lg p-4 border border-navy-lighter">
            <div className="flex items-center gap-2 mb-2">
              {selectedFormatInfo && (
                <selectedFormatInfo.icon className="w-4 h-4 text-primary" />
              )}
              <span className="text-sm font-medium text-slate-lighter">
                Export Preview
              </span>
            </div>
            <div className="space-y-1 text-xs text-slate/70">
              {conversation ? (
                <>
                  <div>Conversation: {conversation.title}</div>
                  <div>
                    Messages:{" "}
                    {conversation.messageCount ||
                      conversation.messages?.length ||
                      0}
                  </div>
                </>
              ) : conversations ? (
                <>
                  <div>Conversations: {conversations.length}</div>
                  <div>
                    Current: {currentConversation?.title || "All conversations"}
                  </div>
                </>
              ) : (
                <div>No conversation data available</div>
              )}
              <div>Format: {selectedFormatInfo?.label}</div>
              <div>
                Options:{" "}
                {Object.entries(exportOptions)
                  .filter(([_, value]) => value)
                  .map(([key]) => key)
                  .join(", ")}
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-2 justify-end">
            <Button
              variant="outline"
              onClick={() => setIsOpen(false)}
              disabled={isExporting}
              className="border-navy-lighter text-slate-lighter hover:bg-navy-light"
            >
              Cancel
            </Button>
            <Button
              onClick={handleExport}
              disabled={isExporting}
              className="bg-primary text-white hover:bg-primary/90"
            >
              {isExporting ? (
                <>
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{
                      duration: 1,
                      repeat: Infinity,
                      ease: "linear",
                    }}
                    className="w-4 h-4 border-2 border-white border-t-transparent rounded-full mr-2"
                  />
                  Exporting...
                </>
              ) : (
                <>
                  <DownloadSimpleIcon className="w-4 h-4 mr-2" />
                  Export
                </>
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default ExportDialog;
