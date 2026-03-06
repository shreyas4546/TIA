# Tia - AI Financial Assistant Dashboard

A modern AI-powered financial assistant dashboard UI.

## Tech Stack
- React + TypeScript
- Vite
- Tailwind CSS
- Framer Motion
- Recharts
- Lucide React

## Getting Started

Follow these instructions to run the project locally.

### Prerequisites
Make sure you have Node.js installed (v18+ recommended).

### Installation & Setup

1. Install dependencies:
\`\`\`bash
npm install
\`\`\`

2. Start the development server:
\`\`\`bash
npm run dev
\`\`\`

### Troubleshooting

If you encounter issues during installation or running the project:

- **Missing dependencies error:** Run `npm install --legacy-peer-deps` or `npm install --force` if there are peer dependency conflicts.
- **Vite not found:** Ensure you have run `npm install` successfully. If the issue persists, try `npm install -g vite` or delete `node_modules` and `package-lock.json` and reinstall.
- **TypeScript errors:** Run `npm run build` to see detailed type errors. Ensure you're using a recent version of TypeScript.
- **Port already in use:** Vite will automatically try the next available port, but you can force a specific port by running `npm run dev -- --port 3000`.

## Features
- **Hero Section:** Animated entrance with fintech theme.
- **AI Insights Panel:** Simulated AI-generated insights with hover animations.
- **Financial Dashboard:** Interactive charts built with Recharts (Line, Pie, Bar).
- **Smart Features:** Feature cards describing AI capabilities.
- **Interactive AI Chat:** Real AI financial assistant UI powered by Gemini.
