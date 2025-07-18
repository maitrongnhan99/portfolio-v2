# Chat-with-Me Feature Setup Guide

This guide will help you set up and use the enhanced Chat-with-Me feature in the portfolio website.

## 🚀 Features

The Chat-with-Me feature includes:

- **Real-time Streaming Responses** - Get responses as they're generated
- **Conversation History** - Persistent storage of all conversations
- **Export Functionality** - Export conversations in multiple formats (JSON, Markdown, CSV, TXT)
- **Advanced Search** - Search through conversation history with filters
- **Lazy Loading** - Optimized performance with code splitting
- **Error Recovery** - Automatic retry mechanisms and offline support
- **Connection Status** - Real-time connection monitoring

## 📋 Prerequisites

- Node.js 18+ and pnpm
- Google Gemini API access (for AI responses)
- MongoDB instance (for vector storage)
- Telegram Bot (optional, for contact form notifications)

## 🔧 Environment Variables Setup

### Required Variables

Create a `.env.local` file in your project root with the following variables:

```bash
# Google Gemini AI API Key (Required)
GEMINI_API_KEY=your_gemini_api_key_here

# MongoDB Connection String (Required for vector storage)
MONGODB_CONNECTION_STRING=mongodb://localhost:27017/portfolio

# Telegram Bot Token (Optional, for contact form notifications)
TELEGRAM_BOT_TOKEN=your_telegram_bot_token_here
```

### How to Obtain API Keys

#### 1. Google Gemini API Key

1. Go to [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Sign in with your Google account
3. Click "Create API Key"
4. Copy the generated API key
5. Add it to your `.env.local` file

#### 2. MongoDB Connection String

**Option A: Local MongoDB**
```bash
# Install MongoDB locally
brew install mongodb/brew/mongodb-community  # macOS
# Or download from https://www.mongodb.com/try/download/community

# Start MongoDB
brew services start mongodb/brew/mongodb-community

# Use local connection string
MONGODB_CONNECTION_STRING=mongodb://localhost:27017/portfolio
```

**Option B: MongoDB Atlas (Cloud)**
1. Go to [MongoDB Atlas](https://cloud.mongodb.com/)
2. Create a free account and cluster
3. Get your connection string from the "Connect" button
4. Replace `<password>` with your actual password
5. Add it to your `.env.local` file

#### 3. Telegram Bot Token (Optional)

1. Message [@BotFather](https://t.me/BotFather) on Telegram
2. Send `/newbot` command
3. Follow the instructions to create a bot
4. Copy the bot token
5. Add it to your `.env.local` file

## 📦 Installation & Setup

1. **Install Dependencies**
   ```bash
   pnpm install
   ```

2. **Set Up Environment Variables**
   ```bash
   cp .env.example .env.local
   # Edit .env.local with your actual values
   ```

3. **Seed Knowledge Base** (Optional)
   ```bash
   pnpm seed-knowledge
   ```

4. **Start Development Server**
   ```bash
   pnpm dev
   ```

5. **Access the Chat Feature**
   - Open your browser to `http://localhost:3000`
   - Navigate to the "Ask Me" section
   - Start chatting!

## 🎯 Usage Guide

### Basic Chat Operations

1. **Start a Conversation**
   - Type your question in the input field
   - Press Enter or click the send button
   - Watch as the AI responds in real-time (streaming mode)

2. **Toggle Streaming Mode**
   - Use the "Streaming ON/OFF" button to switch between real-time and complete responses
   - Streaming provides immediate feedback
   - Non-streaming waits for complete response

3. **Manage Conversations**
   - **Save**: Manually save current conversation
   - **Export**: Download conversation in various formats
   - **Clear**: Delete current conversation
   - **New**: Start a fresh conversation
   - **Search**: Find and load previous conversations

### Advanced Features

#### Conversation Export
- **Formats Available**: JSON, Markdown, CSV, Plain Text
- **Export Options**:
  - Include metadata (creation date, topics, etc.)
  - Include sources (RAG retrieval sources)
  - Include timestamps
  - Compress output

#### Search & Filtering
- **Text Search**: Search through conversation titles and content
- **Topic Filtering**: Filter by explored topics
- **Date Range**: Filter by creation/update date
- **Type Filtering**: Recent, Long, Short conversations
- **Sorting**: By date, title, or message count

#### Error Recovery
- **Automatic Retry**: Failed requests are automatically retried
- **Connection Monitoring**: Real-time connection status
- **Offline Support**: Graceful handling of network issues
- **Circuit Breaker**: Prevents overwhelming failed services

### Keyboard Shortcuts

- **Enter**: Send message
- **Shift + Enter**: New line in message
- **Ctrl/Cmd + K**: Open search dialog (when implemented)

## 🛠️ Troubleshooting

### Common Issues

#### 1. API Key Not Working
```bash
# Check if API key is correctly set
echo $GEMINI_API_KEY

# Verify API key validity
curl -H "x-goog-api-key: YOUR_API_KEY" \
  https://generativelanguage.googleapis.com/v1/models
```

#### 2. MongoDB Connection Issues
```bash
# Check MongoDB is running
brew services list | grep mongodb

# Test connection
mongosh "mongodb://localhost:27017/portfolio"
```

#### 3. Streaming Not Working
- Check browser console for errors
- Verify API key is valid
- Check network connectivity
- Try non-streaming mode

#### 4. Conversation History Not Saving
- Check localStorage permissions
- Verify browser storage isn't full
- Check for JavaScript errors

### Performance Optimization

1. **Memory Management**
   - Conversations auto-cleanup after 100 items
   - Storage size limited to 50MB
   - Automatic compression for large conversations

2. **Network Optimization**
   - Lazy loading for heavy components
   - Connection pooling for API requests
   - Efficient retry mechanisms

3. **Storage Management**
   - Automatic cleanup of old conversations
   - Compressed storage format
   - Efficient indexing for search

## 🔒 Security Considerations

1. **API Key Security**
   - Never commit API keys to version control
   - Use environment variables only
   - Rotate keys regularly

2. **Data Privacy**
   - Conversations stored locally in browser
   - No sensitive data sent to external services
   - User has full control over data

3. **Rate Limiting**
   - Built-in request throttling
   - Automatic backoff on failures
   - Circuit breaker pattern

## 📈 Performance Metrics

Expected performance benchmarks:

- **Response Time**: < 2 seconds for complex queries, < 1 second for simple queries
- **Initial Load**: < 3 seconds with lazy loading
- **Streaming Latency**: < 200ms for first chunk
- **Search Performance**: < 100ms for local search
- **Export Speed**: < 5 seconds for large conversations

## 🧪 Testing

Run the test suite to verify everything is working:

```bash
# Run all tests
pnpm test

# Run specific test types
pnpm test:unit        # Unit tests
pnpm test:integration # API integration tests
pnpm test:performance # Performance tests
pnpm test:e2e         # End-to-end tests

# Coverage report
pnpm test:coverage
```

## 📚 Additional Resources

- [Google Gemini API Documentation](https://ai.google.dev/docs)
- [MongoDB Documentation](https://docs.mongodb.com/)
- [Next.js Documentation](https://nextjs.org/docs)
- [React Documentation](https://react.dev/)

## 🆘 Support

If you encounter issues:

1. Check the browser console for errors
2. Verify all environment variables are set correctly
3. Test with a simple query first
4. Check network connectivity
5. Review the troubleshooting section above

For additional help, you can:
- Check the project's GitHub issues
- Review the code documentation
- Contact the development team

## 🎉 Congratulations!

You now have a fully functional, advanced AI chat system with streaming responses, conversation history, search capabilities, and robust error handling. Enjoy chatting with your AI assistant!