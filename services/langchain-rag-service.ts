import { Document } from "@langchain/core/documents";
import { StringOutputParser } from "@langchain/core/output_parsers";
import { ChatPromptTemplate } from "@langchain/core/prompts";
import {
  RunnablePassthrough,
  RunnableSequence,
} from "@langchain/core/runnables";
import { ChatOpenAI } from "@langchain/openai";
import { getQdrantVectorStore } from "./qdrant-vector-store";

export interface ConversationMessage {
  role: "user" | "assistant";
  content: string;
}

export interface RAGResponse {
  response: string;
  sources: Array<{
    content: string;
    category: string;
    score: number;
  }>;
}

/**
 * LangChain-based RAG Service for Portfolio Chatbot
 * Provides conversational AI with retrieval-augmented generation
 */
export class LangChainRAGService {
  private model: ChatOpenAI;
  private vectorStore: ReturnType<typeof getQdrantVectorStore>;

  constructor() {
    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
      throw new Error("OPENAI_API_KEY environment variable is required");
    }

    // Initialize OpenAI model
    this.model = new ChatOpenAI({
      openAIApiKey: apiKey,
      modelName: "gpt-4o-mini", // Cost-effective model for chat
      temperature: 0.7,
      maxTokens: 4096,
    });

    this.vectorStore = getQdrantVectorStore();
  }

  /**
   * Format documents for context
   */
  private formatDocuments(docs: Document[]): string {
    return docs
      .map((doc, index) => `[${index + 1}] ${doc.pageContent}`)
      .join("\n\n");
  }

  /**
   * Create a RAG chain for question answering
   */
  private async createRAGChain() {
    // Get the retriever from vector store
    const retriever = await this.vectorStore.asRetriever({
      k: 3,
      searchType: "similarity",
    });

    // Define the prompt template
    const promptTemplate = ChatPromptTemplate.fromTemplate(
      `You are Mai Trọng Nhân's AI assistant. Your role is to provide helpful and accurate information about Mai based on the knowledge provided below.

KNOWLEDGE BASE:
{context}

INSTRUCTIONS:
- Answer questions about Mai's background, skills, experience, projects, and contact information
- Use only the information provided in the knowledge base above
- Be conversational and friendly, but professional
- If you don't have specific information to answer a question, suggest asking about topics you do know about
- Keep responses concise but informative
- Use markdown formatting for better readability when appropriate
- Always refer to Mai in third person (e.g., "Mai has experience in..." not "I have experience in...")

USER QUESTION: {question}

RESPONSE:`
    );

    // Create the RAG chain
    const ragChain = RunnableSequence.from([
      {
        context: async (input: { question: string }) => {
          const docs = await retriever.invoke(input.question);
          return this.formatDocuments(docs);
        },
        question: new RunnablePassthrough(),
      },
      promptTemplate,
      this.model,
      new StringOutputParser(),
    ] as any);

    return { chain: ragChain, retriever };
  }

  /**
   * Create a conversational RAG chain with memory
   */
  private async createConversationalRAGChain(
    conversationHistory: ConversationMessage[] = []
  ) {
    const retriever = await this.vectorStore.asRetriever({
      k: 3,
      searchType: "similarity",
    });

    // Format conversation history
    const historyText = conversationHistory
      .slice(-4) // Keep last 4 messages for context
      .map((msg) => `${msg.role}: ${msg.content}`)
      .join("\n");

    const promptTemplate = ChatPromptTemplate.fromTemplate(
      `You are Mai Trọng Nhân's AI assistant. Your role is to provide helpful and accurate information about Mai based on the knowledge provided below.

KNOWLEDGE BASE:
{context}

CONVERSATION HISTORY:
{history}

INSTRUCTIONS:
- Answer questions about Mai's background, skills, experience, projects, and contact information
- Use only the information provided in the knowledge base above
- Be conversational and friendly, but professional
- Consider the conversation history to provide contextually relevant responses
- If you don't have specific information to answer a question, suggest asking about topics you do know about
- Keep responses concise but informative
- Use markdown formatting for better readability when appropriate
- Always refer to Mai in third person (e.g., "Mai has experience in..." not "I have experience in...")

USER QUESTION: {question}

RESPONSE:`
    );

    const ragChain = RunnableSequence.from([
      {
        context: async (input: { question: string; history: string }) => {
          const docs = await retriever.invoke(input.question);
          return this.formatDocuments(docs);
        },
        question: (input: { question: string; history: string }) =>
          input.question,
        history: () => historyText,
      },
      promptTemplate,
      this.model,
      new StringOutputParser(),
    ] as any);

    return { chain: ragChain, retriever };
  }

  /**
   * Query the RAG system without conversation history
   */
  async query(question: string): Promise<RAGResponse> {
    try {
      console.log(`🤖 Processing query: "${question}"`);

      // Create RAG chain
      const { chain, retriever } = await this.createRAGChain();

      // Get relevant documents for sources
      const relevantDocs = await retriever.invoke(question);

      // Generate response
      const response = await chain.invoke({ question });

      // Format sources
      const sources = relevantDocs.map((doc) => ({
        content:
          doc.pageContent.substring(0, 200) +
          (doc.pageContent.length > 200 ? "..." : ""),
        category: (doc.metadata.category as string) || "unknown",
        score: 0.9, // LangChain doesn't always return scores in the same format
      }));

      console.log(`✅ Generated response with ${sources.length} sources`);

      return {
        response: response.trim(),
        sources,
      };
    } catch (error) {
      console.error("❌ Error in RAG query:", error);
      throw error;
    }
  }

  /**
   * Query with conversation history for contextual responses
   */
  async queryWithHistory(
    question: string,
    conversationHistory: ConversationMessage[] = []
  ): Promise<RAGResponse> {
    try {
      console.log(`🤖 Processing conversational query: "${question}"`);
      console.log(`📚 History length: ${conversationHistory.length} messages`);

      // Create conversational RAG chain
      const { chain, retriever } = await this.createConversationalRAGChain(
        conversationHistory
      );

      // Get relevant documents for sources
      const relevantDocs = await retriever.invoke(question);

      // Format history for the chain
      const historyText = conversationHistory
        .slice(-4)
        .map((msg) => `${msg.role}: ${msg.content}`)
        .join("\n");

      // Generate response
      const response = await chain.invoke({
        question,
        history: historyText,
      });

      // Format sources
      const sources = relevantDocs.map((doc) => ({
        content:
          doc.pageContent.substring(0, 200) +
          (doc.pageContent.length > 200 ? "..." : ""),
        category: (doc.metadata.category as string) || "unknown",
        score: 0.9,
      }));

      console.log(
        `✅ Generated conversational response with ${sources.length} sources`
      );

      return {
        response: response.trim(),
        sources,
      };
    } catch (error) {
      console.error("❌ Error in conversational RAG query:", error);
      throw error;
    }
  }

  /**
   * Stream response for real-time updates
   */
  async *queryStream(
    question: string,
    conversationHistory: ConversationMessage[] = []
  ): AsyncGenerator<{
    type: "chunk" | "sources" | "done";
    content?: string;
    sources?: any[];
  }> {
    try {
      console.log(`🤖 Processing streaming query: "${question}"`);

      // Create conversational RAG chain
      const { chain, retriever } = await this.createConversationalRAGChain(
        conversationHistory
      );

      // Get relevant documents first
      const relevantDocs = await retriever.invoke(question);

      // Format history
      const historyText = conversationHistory
        .slice(-4)
        .map((msg) => `${msg.role}: ${msg.content}`)
        .join("\n");

      // Stream the response
      const stream = await chain.stream({
        question,
        history: historyText,
      });

      for await (const chunk of stream) {
        yield { type: "chunk", content: chunk };
      }

      // Send sources at the end
      const sources = relevantDocs.map((doc) => ({
        content:
          doc.pageContent.substring(0, 200) +
          (doc.pageContent.length > 200 ? "..." : ""),
        category: (doc.metadata.category as string) || "unknown",
        score: 0.9,
      }));

      yield { type: "sources", sources };
      yield { type: "done" };

      console.log(`✅ Streaming response completed`);
    } catch (error) {
      console.error("❌ Error in streaming query:", error);
      throw error;
    }
  }

  /**
   * Get the underlying model for advanced usage
   */
  getModel(): ChatOpenAI {
    return this.model;
  }

  /**
   * Get the vector store instance
   */
  getVectorStore() {
    return this.vectorStore;
  }
}

// Export singleton instance
let ragServiceInstance: LangChainRAGService | null = null;

export function getLangChainRAGService(): LangChainRAGService {
  if (!ragServiceInstance) {
    ragServiceInstance = new LangChainRAGService();
  }
  return ragServiceInstance;
}
