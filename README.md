# Personal Portfolio

A modern, responsive portfolio website built with **Next.js 16** and **React 19**. Beyond showcasing work, skills, and experience, it bundles two non-trivial systems: a headless **Payload CMS** for managing project content, and **"Ask Me"** - an AI assistant that answers questions about me using retrieval-augmented generation (LangChain + Qdrant) over a curated knowledge base.

## ✨ What it does

- **Project showcase** - projects served either from Payload CMS or from static data, with a graceful fallback when the CMS is disabled.
- **Ask Me (AI assistant)** - a RAG chatbot grounded in a vector knowledge base, supporting both standard and streaming (SSE) responses.
- **Resume** - dedicated resume pages with PDF rendering.
- **Contact** - form submissions validated with Zod and delivered via Telegram and email (Resend).
- **Design system** - an ElevenLabs-inspired visual language (see `DESIGN.md`), with light/dark theming and motion.

## 🚀 Tech Stack

- **Framework:** [Next.js 16](https://nextjs.org/) (App Router), [React 19](https://react.dev/), TypeScript
- **CMS:** [Payload 3](https://payloadcms.com/) on Postgres, with Vercel Blob media storage
- **AI / RAG:** [LangChain](https://www.langchain.com/), OpenAI SDK, [Qdrant](https://qdrant.tech/) vector store
- **UI:** [Radix UI](https://www.radix-ui.com/) primitives (shadcn-style), [Tailwind CSS](https://tailwindcss.com/), [Framer Motion](https://www.framer.com/motion/)
- **Data/Forms:** [TanStack Query](https://tanstack.com/query), [React Hook Form](https://react-hook-form.com/) + [Zod](https://zod.dev/)
- **Tooling:** pnpm, Vitest, semantic-release

## 🛠️ Prerequisites

- [Node.js](https://nodejs.org/) v18 or higher
- [pnpm](https://pnpm.io/) (the project's package manager)

## 🚀 Getting Started

1. **Clone the repository**

   ```bash
   git clone https://github.com/maitrongnhan99/portfolio-v2.git
   cd portfolio-v2
   ```

2. **Install dependencies**

   ```bash
   pnpm install
   ```

3. **Set up environment variables**

   ```bash
   cp .env.example .env
   ```

   Edit `.env` with your configuration. Key variables: `PAYLOAD_ENABLED`, `POSTGRES_URL`, `PAYLOAD_SECRET`, `BLOB_READ_WRITE_TOKEN`, `OPENAI_API_KEY`, `TELEGRAM_BOT_TOKEN`. The site degrades gracefully when optional services are disabled.

4. **Run the development server**

   ```bash
   pnpm dev
   ```

   Open [http://localhost:3000](http://localhost:3000). The Payload admin is at `/admin`.

## 📦 Common Commands

```bash
pnpm build        # production build (next build --webpack)
pnpm start        # start production server
pnpm lint         # ESLint (flat config)
pnpm type-check   # tsc --noEmit
pnpm test         # run the Vitest suite
pnpm payload      # Payload CLI
pnpm seed-knowledge   # seed the Qdrant knowledge base for Ask Me
```

## 📝 Project Structure

```
portfolio-v2/
├── app/
│   ├── (app)/        # public site, resume, AI assistant UI, most API routes
│   ├── (payload)/    # Payload admin + Payload API/GraphQL
│   └── api/          # top-level AI chat + revalidation endpoints
├── components/       # common/ (features) and ui/ (primitives)
├── lib/              # data services, utilities, knowledge prep
├── services/         # LangChain RAG + Qdrant vector store
├── scripts/          # knowledge seeding & data migration
├── constants/        # static data and configs
└── styles/           # global styles
```

For deeper architecture notes, see `CLAUDE.md`. UI work must follow `DESIGN.md`.

## 🤝 Contributing

Contributions, issues, and feature requests are welcome! Commit messages follow [Conventional Commits](https://www.conventionalcommits.org/) (releases are automated via semantic-release).

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👤 Author

Mai Trọng Nhân

- Website: [maitrongnhan.dev](https://maitrongnhan.dev)
- GitHub: [@maitrongnhan99](https://github.com/maitrongnhan99)
- LinkedIn: [Mai Trọng Nhân](https://www.linkedin.com/in/maitrongnhan/)
