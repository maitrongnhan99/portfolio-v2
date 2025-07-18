import { Conversation, ConversationMessage } from '@/hooks/use-conversation-history';

export type ExportFormat = 'json' | 'markdown' | 'txt' | 'csv';

export interface ExportOptions {
  includeMetadata?: boolean;
  includeSources?: boolean;
  includeTimestamps?: boolean;
  compressOutput?: boolean;
}

export class ConversationExporter {
  /**
   * Export conversation to the specified format
   */
  static async exportConversation(
    conversation: Conversation,
    format: ExportFormat,
    options: ExportOptions = {}
  ): Promise<{ content: string; filename: string; mimeType: string }> {
    const {
      includeMetadata = true,
      includeSources = true,
      includeTimestamps = true,
      compressOutput = false
    } = options;

    const timestamp = new Date().toISOString().slice(0, 19).replace(/[:.]/g, '-');
    const baseFilename = `${conversation.title.replace(/[^a-zA-Z0-9]/g, '-')}-${timestamp}`;

    switch (format) {
      case 'json':
        return {
          content: this.exportToJSON(conversation, { includeMetadata, includeSources, includeTimestamps }),
          filename: `${baseFilename}.json`,
          mimeType: 'application/json'
        };
      
      case 'markdown':
        return {
          content: this.exportToMarkdown(conversation, { includeMetadata, includeSources, includeTimestamps }),
          filename: `${baseFilename}.md`,
          mimeType: 'text/markdown'
        };
      
      case 'txt':
        return {
          content: this.exportToText(conversation, { includeMetadata, includeSources, includeTimestamps }),
          filename: `${baseFilename}.txt`,
          mimeType: 'text/plain'
        };
      
      case 'csv':
        return {
          content: this.exportToCSV(conversation, { includeMetadata, includeSources, includeTimestamps }),
          filename: `${baseFilename}.csv`,
          mimeType: 'text/csv'
        };
      
      default:
        throw new Error(`Unsupported export format: ${format}`);
    }
  }

  /**
   * Export multiple conversations to a single file
   */
  static async exportMultipleConversations(
    conversations: Conversation[],
    format: ExportFormat,
    options: ExportOptions = {}
  ): Promise<{ content: string; filename: string; mimeType: string }> {
    const timestamp = new Date().toISOString().slice(0, 19).replace(/[:.]/g, '-');
    const baseFilename = `conversations-export-${timestamp}`;

    switch (format) {
      case 'json':
        return {
          content: JSON.stringify(conversations, null, 2),
          filename: `${baseFilename}.json`,
          mimeType: 'application/json'
        };
      
      case 'markdown':
        const markdownContent = conversations.map((conv, index) => {
          const content = this.exportToMarkdown(conv, options);
          return `# Conversation ${index + 1}\n\n${content}\n\n---\n\n`;
        }).join('');
        return {
          content: markdownContent,
          filename: `${baseFilename}.md`,
          mimeType: 'text/markdown'
        };
      
      case 'txt':
        const textContent = conversations.map((conv, index) => {
          const content = this.exportToText(conv, options);
          return `CONVERSATION ${index + 1}\n${'='.repeat(20)}\n\n${content}\n\n${'='.repeat(50)}\n\n`;
        }).join('');
        return {
          content: textContent,
          filename: `${baseFilename}.txt`,
          mimeType: 'text/plain'
        };
      
      case 'csv':
        const csvContent = this.exportMultipleToCSV(conversations, options);
        return {
          content: csvContent,
          filename: `${baseFilename}.csv`,
          mimeType: 'text/csv'
        };
      
      default:
        throw new Error(`Unsupported export format: ${format}`);
    }
  }

  /**
   * Download exported content as a file
   */
  static downloadFile(content: string, filename: string, mimeType: string): void {
    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    link.style.display = 'none';
    
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    URL.revokeObjectURL(url);
  }

  /**
   * Export conversation to JSON format
   */
  private static exportToJSON(conversation: Conversation, options: ExportOptions): string {
    const exportData = {
      ...(options.includeMetadata && {
        metadata: {
          title: conversation.title,
          id: conversation.id,
          createdAt: conversation.createdAt.toISOString(),
          updatedAt: conversation.updatedAt.toISOString(),
          messageCount: conversation.messageCount,
          topicsExplored: conversation.topicsExplored
        }
      }),
      messages: conversation.messages.map(msg => ({
        id: msg.id,
        text: msg.text,
        isUser: msg.isUser,
        type: msg.type,
        ...(options.includeTimestamps && { timestamp: msg.timestamp.toISOString() }),
        ...(options.includeSources && msg.sources && { sources: msg.sources }),
        ...(msg.isStreaming !== undefined && { isStreaming: msg.isStreaming }),
        ...(msg.streamingComplete !== undefined && { streamingComplete: msg.streamingComplete })
      }))
    };

    return JSON.stringify(exportData, null, 2);
  }

  /**
   * Export conversation to Markdown format
   */
  private static exportToMarkdown(conversation: Conversation, options: ExportOptions): string {
    const lines: string[] = [];

    // Title and metadata
    lines.push(`# ${conversation.title}`);
    lines.push('');

    if (options.includeMetadata) {
      lines.push('## Metadata');
      lines.push('');
      lines.push(`- **Created:** ${conversation.createdAt.toLocaleString()}`);
      lines.push(`- **Updated:** ${conversation.updatedAt.toLocaleString()}`);
      lines.push(`- **Messages:** ${conversation.messageCount}`);
      if (conversation.topicsExplored.length > 0) {
        lines.push(`- **Topics:** ${conversation.topicsExplored.join(', ')}`);
      }
      lines.push('');
    }

    // Messages
    lines.push('## Conversation');
    lines.push('');

    conversation.messages.forEach((message, index) => {
      const sender = message.isUser ? '👤 **You**' : '🤖 **AI Assistant**';
      const timestamp = options.includeTimestamps ? 
        ` *(${message.timestamp.toLocaleString()})*` : '';
      
      lines.push(`### ${sender}${timestamp}`);
      lines.push('');
      
      // Format message content
      const formattedText = message.text
        .replace(/\*\*(.*?)\*\*/g, '**$1**') // Keep bold formatting
        .replace(/^• /gm, '- '); // Convert bullet points to markdown
      
      lines.push(formattedText);
      lines.push('');
      
      // Add sources if available
      if (options.includeSources && message.sources && message.sources.length > 0) {
        lines.push('**Sources:**');
        message.sources.forEach(source => {
          lines.push(`- ${source.category}: ${source.content.substring(0, 100)}... *(Score: ${(source.score * 100).toFixed(0)}%)*`);
        });
        lines.push('');
      }
    });

    return lines.join('\n');
  }

  /**
   * Export conversation to plain text format
   */
  private static exportToText(conversation: Conversation, options: ExportOptions): string {
    const lines: string[] = [];

    // Title and metadata
    lines.push(conversation.title.toUpperCase());
    lines.push('='.repeat(conversation.title.length));
    lines.push('');

    if (options.includeMetadata) {
      lines.push('METADATA');
      lines.push('-'.repeat(8));
      lines.push(`Created: ${conversation.createdAt.toLocaleString()}`);
      lines.push(`Updated: ${conversation.updatedAt.toLocaleString()}`);
      lines.push(`Messages: ${conversation.messageCount}`);
      if (conversation.topicsExplored.length > 0) {
        lines.push(`Topics: ${conversation.topicsExplored.join(', ')}`);
      }
      lines.push('');
    }

    // Messages
    lines.push('CONVERSATION');
    lines.push('-'.repeat(12));
    lines.push('');

    conversation.messages.forEach((message, index) => {
      const sender = message.isUser ? 'YOU' : 'AI ASSISTANT';
      const timestamp = options.includeTimestamps ? 
        ` (${message.timestamp.toLocaleString()})` : '';
      
      lines.push(`${sender}${timestamp}`);
      lines.push('-'.repeat(sender.length + timestamp.length));
      lines.push(message.text);
      lines.push('');
      
      // Add sources if available
      if (options.includeSources && message.sources && message.sources.length > 0) {
        lines.push('Sources:');
        message.sources.forEach(source => {
          lines.push(`  - ${source.category}: ${source.content.substring(0, 100)}... (Score: ${(source.score * 100).toFixed(0)}%)`);
        });
        lines.push('');
      }
    });

    return lines.join('\n');
  }

  /**
   * Export conversation to CSV format
   */
  private static exportToCSV(conversation: Conversation, options: ExportOptions): string {
    const headers = ['Message ID', 'Sender', 'Message', 'Type'];
    
    if (options.includeTimestamps) {
      headers.push('Timestamp');
    }
    
    if (options.includeSources) {
      headers.push('Sources');
    }

    const rows = [headers.join(',')];

    conversation.messages.forEach(message => {
      const row = [
        message.id,
        message.isUser ? 'User' : 'AI',
        `"${message.text.replace(/"/g, '""')}"`, // Escape quotes
        message.type || 'message'
      ];

      if (options.includeTimestamps) {
        row.push(message.timestamp.toISOString());
      }

      if (options.includeSources) {
        const sources = message.sources?.map(s => `${s.category}:${s.score}`).join(';') || '';
        row.push(`"${sources}"`);
      }

      rows.push(row.join(','));
    });

    return rows.join('\n');
  }

  /**
   * Export multiple conversations to CSV format
   */
  private static exportMultipleToCSV(conversations: Conversation[], options: ExportOptions): string {
    const headers = ['Conversation ID', 'Conversation Title', 'Message ID', 'Sender', 'Message', 'Type'];
    
    if (options.includeTimestamps) {
      headers.push('Timestamp');
    }
    
    if (options.includeSources) {
      headers.push('Sources');
    }

    const rows = [headers.join(',')];

    conversations.forEach(conversation => {
      conversation.messages.forEach(message => {
        const row = [
          conversation.id,
          `"${conversation.title.replace(/"/g, '""')}"`,
          message.id,
          message.isUser ? 'User' : 'AI',
          `"${message.text.replace(/"/g, '""')}"`,
          message.type || 'message'
        ];

        if (options.includeTimestamps) {
          row.push(message.timestamp.toISOString());
        }

        if (options.includeSources) {
          const sources = message.sources?.map(s => `${s.category}:${s.score}`).join(';') || '';
          row.push(`"${sources}"`);
        }

        rows.push(row.join(','));
      });
    });

    return rows.join('\n');
  }
}

export default ConversationExporter;