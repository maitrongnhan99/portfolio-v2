# GEMINI.md

This file provides guidance when working with code in this repository.

## Project Overview

This is a Next.js 15 portfolio website built with React 19, TypeScript, and Tailwind CSS. The project uses pnpm as the package manager and follows modern React patterns with the App Router.

## Development Commands

```bash
# Install dependencies
pnpm install

# Run the development server
pnpm dev

# Build for production
pnpm build

# Start the production server
pnpm start

# Lint the code
pnpm lint
```

## Architecture

### Tech Stack
- **Framework**: Next.js 15 with App Router
- **UI**: React 19, TypeScript, Tailwind CSS
- **Components**: Radix UI, shadcn/ui
- **Animations**: Framer Motion
- **Styling**: Tailwind CSS with a custom theme

### Key Directories
- `app/`: Next.js App Router pages and API routes
- `components/`: Reusable components (`common/` for features, `ui/` for primitives)
- `lib/`: Utility functions and data
- `constants/`: Static data and configurations
- `hooks/`: Custom React hooks
- `public/`: Static assets

### Data Management
- Project data: `lib/projects-data.ts`
- Profile data: `constants/profile.ts`
- Animation configurations: `constants/animation-configs.ts`

### Styling
- **Tailwind CSS**: Used for all styling.
- **Theming**: Dark/light mode is supported via `next-themes`.
- **Custom Theme**: A custom color palette is defined in `tailwind.config.ts`.

### API Routes
- **Contact Form**: `app/api/contact/route.ts` handles form submissions.
- **Telegram Integration**: The contact form sends notifications via a Telegram bot.

### Key Features
- **Responsive Design**: Mobile-first approach.
- **Theme Switching**: Light and dark modes.
- **Contact Form**: Integrated with Telegram for notifications.
- **Project Showcase**: Displays projects with filtering capabilities.
- **Animated UI**: Uses Framer Motion for animations.
- **SEO**: Optimized for search engines.

### Environment Variables
- `TELEGRAM_BOT_TOKEN`: Required for the contact form to send Telegram notifications.
