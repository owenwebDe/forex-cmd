# MT5 CRM Platform

A comprehensive CRM platform for managing real MT5 trading accounts with a React.js frontend, Node.js backend, and React admin panel.

## Project Structure

\`\`\`
mt5-crm-platform/
├── backend/          # Node.js API server
├── admin-panel/      # React admin dashboard
├── frontend/         # User-facing website
└── README.md
\`\`\`

## Features

### Frontend (User-Facing Website)
- **Authentication**: Secure login/registration with JWT
- **Dashboard**: Real-time account overview with balance, equity, positions
- **Live Account Creation**: Create real MT5 accounts via API
- **Deposit System**: Stripe integration for secure payments
- **Withdrawal Requests**: Submit and track withdrawal requests
- **Transaction History**: Complete financial transaction logs
- **Trading Interface**: View positions, history, and charts
- **Profile Management**: Update account settings and preferences

### Backend (API Server)
- **MT5 Integration**: Direct connection to live MT5 API
- **Account Management**: Create, update, and manage MT5 accounts
- **Balance Operations**: Handle deposits, withdrawals, and transfers
- **Trading Operations**: Execute trades and manage positions
- **Payment Processing**: Stripe integration for deposits
- **Security**: JWT authentication, rate limiting, input validation

### Admin Panel
- **User Management**: Full CRUD operations for users
- **Account Monitoring**: Real-time MT5 account oversight
- **Balance Operations**: Manual balance adjustments
- **Trade Management**: Close positions, view trade history
- **System Logs**: Monitor API calls and system events
- **Dashboard Analytics**: Platform statistics and metrics

## Quick Start

### Prerequisites
- Node.js 18+ and npm
- MT5 API server running
- Stripe account for payments
- PostgreSQL database (optional)

### Installation

1. **Clone and install dependencies:**
\`\`\`bash
git clone <repository-url>
cd mt5-crm-platform
npm run install:all
\`\`\`

2. **Configure environment variables:**
\`\`\`bash
# Backend
cp backend/.env.example backend/.env
# Edit backend/.env with your MT5 API and Stripe credentials

# Frontend
cp frontend/.env.local.example frontend/.env.local
# Edit frontend/.env.local with your API URL and Stripe publishable key

# Admin Panel
cp admin-panel/.env.local.example admin-panel/.env.local
# Edit admin-panel/.env.local with your API URL
\`\`\`

3. **Start all services:**
\`\`\`bash
npm run dev
\`\`\`

This will start:
- Backend API: http://localhost:3001
- Frontend: http://localhost:3000
- Admin Panel: http://localhost:3002

## Environment Variables

### Backend (.env)
\`\`\`env
PORT=3001
MT5_API_URL=http://your-mt5-server:8080
MT5_API_KEY=your_api_key
STRIPE_SECRET_KEY=sk_test_...
JWT_SECRET=your_jwt_secret
\`\`\`

### Frontend (.env.local)
\`\`\`env
NEXT_PUBLIC_API_URL=http://localhost:3001/api
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
\`\`\`

## API Endpoints

### Authentication
- `POST /api/auth/login` - User login
- `POST /api/auth/register` - User registration

### Account Management
- `POST /api/account/create-live-account` - Create MT5 account
- `GET /api/account/mt5-info` - Get account information
- `GET /api/account/balance` - Get account balance

### Trading
- `GET /api/trading/positions` - Get open positions
- `POST /api/trading/history` - Get trade history
- `GET /api/trading/journal` - Get trading logs

### Balance Operations
- `POST /api/balance/deposit` - Process deposit
- `POST /api/balance/withdraw` - Request withdrawal
- `GET /api/balance/history` - Transaction history

## MT5 Integration

The platform connects to your MT5 server via REST API calls:

### Account Creation
\`\`\`javascript
POST /Home/createAccount
{
  "type": 0,
  "groupName": "REAL-LIVE-GROUP",
  "name": "John Doe",
  "email": "john@example.com",
  "leverage": 100,
  "balance": 0
}
\`\`\`

### Balance Operations
\`\`\`javascript
POST /Home/balanceOperation
{
  "loginId": 12345,
  "type": "deposit",
  "amount": 1000,
  "comment": "Stripe deposit"
}
\`\`\`

## Security Features

- JWT-based authentication
- Rate limiting on API endpoints
- Input validation and sanitization
- CORS protection
- Helmet.js security headers
- Secure password hashing
- Environment variable protection

## Deployment

### Production Build
\`\`\`bash
npm run build
\`\`\`

### Individual Services
\`\`\`bash
# Backend only
npm run build:backend
npm run start:backend

# Frontend only
npm run build:frontend
npm run start:frontend

# Admin panel only
npm run build:admin
npm run start:admin
\`\`\`

### Docker Deployment
Each service includes a Dockerfile for containerized deployment.

## Development

### Project Structure
- **Modular Architecture**: Each service is independent
- **Shared Types**: Common TypeScript interfaces
- **API Client**: Centralized HTTP client with interceptors
- **Error Handling**: Comprehensive error management
- **Logging**: Winston-based logging system

### Adding New Features
1. Define API endpoints in backend routes
2. Update TypeScript types
3. Implement frontend components
4. Add admin panel management (if needed)
5. Update documentation

## Support

For technical support or questions:
- Check the API documentation
- Review error logs in the backend
- Ensure MT5 API server is accessible
- Verify environment variables are correct

## License

This project is proprietary software. All rights reserved.
