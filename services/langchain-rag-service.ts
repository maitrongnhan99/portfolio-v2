import OpenAI from "openai";
import { getQdrantVectorStore } from "./qdrant-vector-store";

export interface ConversationMessage {
  role: "user" | "assistant";
  content: string;
}

export interface RAGSource {
  content: string;
  category: string;
  score: number;
}

export interface RAGResponse {
  response: string;
  sources: RAGSource[];
}

export interface StreamingChunk {
  type: "chunk" | "sources" | "done";
  content?: string;
  sources?: RAGSource[];
}

interface RetrievedDocument {
  content: string;
  metadata?: Record<string, unknown>;
  score: number;
}

const MODEL_NAME = "gpt-4o-mini";
const MAX_HISTORY_MESSAGES = 4;
const MAX_CONTEXT_DOCUMENTS = 3;
const MAX_SOURCE_LENGTH = 200;

export class OpenAIRAGService {
  private openai: OpenAI;
  private vectorStore: ReturnType<typeof getQdrantVectorStore>;

  constructor() {
    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
      throw new Error("OPENAI_API_KEY environment variable is required");
    }

    this.openai = new OpenAI({ apiKey });
    this.vectorStore = getQdrantVectorStore();
  }

  private async retrieveDocuments(question: string): Promise<RetrievedDocument[]> {
    return this.vectorStore.similaritySearch(question, MAX_CONTEXT_DOCUMENTS);
  }

  private formatContext(documents: RetrievedDocument[]): string {
    if (documents.length === 0) {
      return "No relevant knowledge was retrieved.";
    }

    return documents
      .map((document, index) => `[${index + 1}] ${document.content}`)
      .join("\n\n");
  }

  private formatHistory(conversationHistory: ConversationMessage[]): string {
    if (conversationHistory.length === 0) {
      return "No prior conversation.";
    }

    return conversationHistory
      .slice(-MAX_HISTORY_MESSAGES)
      .map((message) => `${message.role}: ${message.content}`)
      .join("\n");
  }

  private buildMessages(
    question: string,
    documents: RetrievedDocument[],
    conversationHistory: ConversationMessage[] = []
  ): OpenAI.Chat.Completions.ChatCompletionMessageParam[] {
    const context = this.formatContext(documents);
    const history = this.formatHistory(conversationHistory);

    return [
      {
        role: "system",
        content:
          "You are Mai Trọng Nhân's AI assistant. Answer using only the supplied knowledge base context and conversation history. Be conversational, friendly, and professional. Keep responses concise but informative. Use markdown when it improves readability. Always refer to Mai in third person. If the knowledge base does not support an answer, clearly say you do not have that information and suggest related topics you can help with.",
      },
      {
        role: "user",
        content: `KNOWLEDGE BASE:\n${context}\n\nCONVERSATION HISTORY:\n${history}\n\nUSER QUESTION: ${question}`,
      },
    ];
  }

  private formatSources(documents: RetrievedDocument[]): RAGSource[] {
    return documents.map((document) => ({
      content:
        document.content.substring(0, MAX_SOURCE_LENGTH) +
        (document.content.length > MAX_SOURCE_LENGTH ? "..." : ""),
      category:
        typeof document.metadata?.category === "string"
          ? document.metadata.category
          : "unknown",
      score: Math.max(0, Math.min(1, document.score ?? 0)),
    }));
  }

  async queryWithHistory(
    question: string,
    conversationHistory: ConversationMessage[] = []
  ): Promise<RAGResponse> {
    try {
      const documents = await this.retrieveDocuments(question);
      const response = await this.openai.chat.completions.create({
        model: MODEL_NAME,
        temperature: 0.7,
        max_tokens: 4096,
        messages: this.buildMessages(question, documents, conversationHistory),
      });

      const content = response.choices[0]?.message?.content?.trim();
      if (!content) {
        throw new Error("OpenAI did not return a response");
      }

      return {
        response: content,
        sources: this.formatSources(documents),
      };
    } catch (error) {
      console.error("Error in OpenAI RAG query:", error);
      throw error;
    }
  }

  async *queryStream(
    question: string,
    conversationHistory: ConversationMessage[] = []
  ): AsyncGenerator<StreamingChunk> {
    try {
      const documents = await this.retrieveDocuments(question);
      const stream = await this.openai.chat.completions.create({
        model: MODEL_NAME,
        temperature: 0.7,
        max_tokens: 4096,
        messages: this.buildMessages(question, documents, conversationHistory),
        stream: true,
      });

      for await (const chunk of stream) {
        const content = chunk.choices[0]?.delta?.content;
        if (content) {
          yield { type: "chunk", content };
        }
      }

      yield {
        type: "sources",
        sources: this.formatSources(documents),
      };
      yield { type: "done" };
    } catch (error) {
      console.error("Error in OpenAI streaming query:", error);
      throw error;
    }
  }
}

let ragServiceInstance: OpenAIRAGService | null = null;

export function getOpenAIRAGService(): OpenAIRAGService {
  if (!ragServiceInstance) {
    ragServiceInstance = new OpenAIRAGService();
  }

  return ragServiceInstance;
}
