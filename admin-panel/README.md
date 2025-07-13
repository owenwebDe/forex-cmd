# MT5 CRM Admin Panel

Professional admin dashboard for managing the MT5 CRM platform. Built with Next.js, TypeScript, and Tailwind CSS.

## Features

- **Dashboard Overview**: Real-time statistics and system monitoring
- **User Management**: Complete CRUD operations for users and MT5 accounts
- **Trading Management**: Live position monitoring and trade execution
- **Balance Operations**: Deposits, withdrawals, credits, and bonuses
- **System Logs**: Activity monitoring and error tracking
- **Responsive Design**: Works on desktop, tablet, and mobile devices

## Quick Start

1. **Install dependencies:**
   \`\`\`bash
   npm install
   \`\`\`

2. **Configure environment:**
   \`\`\`bash
   cp .env.local.example .env.local
   # Edit .env.local with your backend API URL
   \`\`\`

3. **Start development server:**
   \`\`\`bash
   npm run dev
   \`\`\`

4. **Access admin panel:**
   - URL: http://localhost:3002
   - Login with admin credentials

## Project Structure

\`\`\`
src/
├── app/                 # Next.js app router pages
├── components/          # React components
│   ├── Layout/         # Layout components
│   ├── Dashboard/      # Dashboard components
│   ├── Users/          # User management
│   ├── Trading/        # Trading components
│   └── UI/             # Reusable UI components
├── lib/                # Utilities and API client
├── types/              # TypeScript type definitions
└── styles/             # Global styles
\`\`\`

## Key Components

- **AdminLayout**: Main layout with navigation and authentication
- **DashboardStats**: Real-time statistics cards
- **UserManagement**: User CRUD operations with MT5 integration
- **PositionsTable**: Live trading positions monitoring
- **BalanceOperations**: Financial operations management

## Deployment

The admin panel can be deployed to:

- **Vercel**: `vercel --prod`
- **Netlify**: Connect GitHub repository
- **Docker**: Use included Dockerfile
- **Static hosting**: `npm run build && npm run export`

## Environment Variables

See `.env.local.example` for all configuration options.
