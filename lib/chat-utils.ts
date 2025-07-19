import { Message } from "@/types/chat";
import { Conversation } from "@/hooks/use-conversation-history";

export function getConversationHistory(messages: Message[], limit: number = 6) {
  return messages
    .slice(-limit)
    .map((msg) => ({
      role: msg.isUser ? ("user" as const) : ("assistant" as const),
      content: msg.text,
    }));
}

export function createUpdatedConversation(
  currentConversation: Conversation,
  messages: Message[],
  topicsExplored: string[]
): Conversation {
  return {
    ...currentConversation,
    messages: messages.map((msg) => ({
      ...msg,
      timestamp: msg.timestamp,
    })),
    topicsExplored,
    messageCount: messages.length,
    updatedAt: new Date(),
  };
}

export function shouldAutoSave(
  autoSave: boolean,
  currentConversation: Conversation | null,
  messages: Message[]
): boolean {
  return Boolean(autoSave && currentConversation && messages.length > 0);
}

export function generateConversationTitle(messages: Message[]): string {
  if (messages.length === 0) return "New Conversation";
  
  // Get the first user message as the title
  const firstUserMessage = messages.find(msg => msg.isUser);
  if (!firstUserMessage) return "New Conversation";
  
  // Truncate the title if it's too long
  const maxLength = 50;
  const title = firstUserMessage.text;
  
  if (title.length <= maxLength) return title;
  return title.substring(0, maxLength) + "...";
}