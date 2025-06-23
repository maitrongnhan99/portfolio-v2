# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a Next.js 15 portfolio website built with React 19, TypeScript, and Tailwind CSS. The project uses pnpm as the package manager and follows modern React patterns with the App Router.

## Development Commands

```bash
# Install dependencies (uses pnpm)
pnpm install

# Development server
pnpm dev

# Build for production
pnpm build

# Start production server
pnpm start

# Lint code
pnpm lint
```

## Architecture

### Framework & Stack
- **Next.js 15** with App Router (`app/` directory)
- **React 19** with TypeScript
- **Tailwind CSS** for styling with custom color palette
- **Framer Motion** for animations
- **Radix UI** components for accessible UI primitives

### Key Directories
- `app/` - Next.js App Router pages and API routes
- `components/` - Reusable components split into:
  - `common/` - Feature-specific components (navbar, hero, projects, etc.)
  - `ui/` - Generic UI primitives (buttons, cards, dialogs, etc.)
- `lib/` - Utility functions and data files
- `constants/` - Static configuration and profile data
- `hooks/` - Custom React hooks
- `public/` - Static assets including animations and images

### Component Structure
- Components are organized by feature in `components/common/`
- Navbar components are modularized in `components/common/navbar/`
- Project-related components are in `components/common/projects/`
- UI components follow Radix UI patterns with shadcn/ui styling

### Data Management
- Project data is centralized in `lib/projects-data.ts`
- Profile/social links are in `constants/profile.ts`
- Animation configs are in `constants/animation-configs.ts`

### Styling System
- Uses Tailwind CSS with custom color palette (navy, slate, aqua themes)
- CSS variables for consistent theming
- Dark/light mode support via `next-themes`
- Custom animations defined in `tailwind.config.ts`

### API Routes
- Contact form handler at `app/api/contact/route.ts`
- Telegram bot integration for contact notifications
- Environment variables handled via `next.config.mjs`

### Configuration Notes
- TypeScript paths configured with `@/*` alias
- ESLint and TypeScript errors are ignored during builds (configured in `next.config.mjs`)
- Images are unoptimized for static export compatibility
- Experimental webpack optimizations enabled

### Key Features
- Server-side rendering with Next.js App Router
- Responsive design with mobile-first approach
- Theme switching (dark/light mode)
- Contact form with Telegram notifications
- Project showcase with filtering and categories
- Animated UI elements with Framer Motion
- SEO optimization with comprehensive metadata

### Environment Variables
- `TELEGRAM_BOT_TOKEN` - Required for contact form notifications
- Environment variables are exposed via `next.config.mjs`