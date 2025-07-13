# MT5 CRM Backend API

This is the backend API server for the MT5 CRM platform. It handles all MT5 integration, user authentication, trading operations, and payment processing.

## Features

- **MT5 Integration**: Complete integration with MT5 trading server
- **Authentication**: JWT-based authentication system
- **Trading Operations**: Real-time trading operations and position management
- **Payment Processing**: Stripe integration for deposits and withdrawals
- **Admin API**: Comprehensive admin endpoints for platform management
- **Security**: Rate limiting, CORS, helmet security headers
- **Logging**: Structured logging with Winston

## Quick Start

1. **Install dependencies:**
   \`\`\`bash
   npm install
   \`\`\`

2. **Configure environment:**
   \`\`\`bash
   cp .env.example .env
   # Edit .env with your configuration
   \`\`\`

3. **Start development server:**
   \`\`\`bash
   npm run dev
   \`\`\`

4. **Build for production:**
   \`\`\`bash
   npm run build
   npm start
   \`\`\`

## API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `POST /api/auth/mt5-token` - MT5 authentication

### Trading
- `GET /api/trading/position/:loginId` - Get positions
- `POST /api/trading/history` - Get trade history
- `GET /api/trading/symbol/:symbol` - Get symbol info

### Admin
- `GET /api/admin/dashboard-stats` - Dashboard statistics
- `GET /api/admin/users` - User management
- `POST /api/admin/balance-operation` - Balance operations

### Payments
- `POST /api/payment/create-payment-intent` - Create Stripe payment
- `POST /api/payment/webhook` - Stripe webhook handler

## Deployment

The backend can be deployed to any Node.js hosting platform:

- **Vercel**: `vercel --prod`
- **Heroku**: `git push heroku main`
- **Docker**: Use the included Dockerfile
- **VPS**: PM2 or systemd service

## Environment Variables

See `.env.example` for all required environment variables.
