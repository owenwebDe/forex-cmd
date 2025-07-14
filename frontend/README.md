# MT5 CRM Frontend

Frontend client portal for the MT5 CRM platform built with Next.js 14, React 18, and Tailwind CSS.

## Features

- **Account Creation**: Create live MT5 trading accounts
- **Dashboard**: Real-time account overview and position monitoring
- **Deposit System**: Secure payment processing with Stripe
- **Responsive Design**: Mobile-first responsive design
- **TypeScript**: Full TypeScript support for type safety
- **Modern UI**: Clean, professional interface with Tailwind CSS

## Quick Start

1. **Install Dependencies**:
   \`\`\`bash
   npm install
   \`\`\`

2. **Environment Setup**:
   \`\`\`bash
   cp .env.local.example .env.local
   # Edit .env.local with your configuration
   \`\`\`

3. **Development**:
   \`\`\`bash
   npm run dev
   \`\`\`

4. **Production Build**:
   \`\`\`bash
   npm run build
   npm start
   \`\`\`

## Pages

- `/` - Landing page with platform overview
- `/create-account` - MT5 account creation form
- `/dashboard` - User dashboard with account overview
- `/deposit` - Deposit funds page (Stripe integration)
- `/login` - User authentication (to be implemented)
- `/register` - User registration (to be implemented)

## Environment Variables

See `.env.local.example` for all required environment variables:

- `NEXT_PUBLIC_API_URL` - Backend API URL
- `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` - Stripe publishable key
- `NEXT_PUBLIC_APP_NAME` - Application name
- `NEXT_PUBLIC_APP_URL` - Frontend URL
- `NEXT_PUBLIC_MT5_SERVER_NAME` - MT5 server name (display)
- `NEXT_PUBLIC_MT5_SERVER_IP` - MT5 server IP (display)

## Technology Stack

- **Framework**: Next.js 14 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **HTTP Client**: Fetch API
- **Forms**: React Hook Form with Zod validation
- **Payments**: Stripe integration
- **Icons**: Lucide React
- **Notifications**: Sonner

## Development

- **Hot Reload**: Development server with hot reload
- **Type Checking**: TypeScript type checking
- **Linting**: ESLint configuration
- **Code Formatting**: Prettier (recommended)

## Deployment

The frontend can be deployed to Vercel, Netlify, or any platform supporting Next.js applications.

## API Integration

The frontend communicates with the backend API for:
- MT5 account creation
- Account information retrieval
- Position monitoring
- Balance operations
- Connection testing
