# MT5 CRM Backend

Backend API server for the MT5 CRM platform providing MT5 account management, trading operations, and user management.

## Features

- **MT5 Integration**: Direct integration with MT5 server API
- **Account Management**: Create, update, and manage MT5 accounts
- **Balance Operations**: Handle deposits and withdrawals
- **Position Tracking**: Real-time position monitoring
- **Trade History**: Complete trading history access
- **Security**: JWT authentication, rate limiting, CORS protection

## Quick Start

1. **Install Dependencies**:
   \`\`\`bash
   npm install
   \`\`\`

2. **Environment Setup**:
   \`\`\`bash
   cp .env.example .env
   # Edit .env with your actual configuration
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

## API Endpoints

### Account Management
- `GET /api/account/test-connection` - Test MT5 connection
- `POST /api/account/create-live-account` - Create new MT5 account
- `GET /api/account/info/:login` - Get account information
- `GET /api/account/positions/:login` - Get account positions
- `POST /api/account/balance-operation` - Perform balance operations

### Health Check
- `GET /health` - Server health status

## Environment Variables

See `.env.example` for all required environment variables.

## MT5 Configuration

The backend connects to your MT5 server using the provided credentials:
- **Server**: 173.208.156.141:6701
- **Manager ID**: 1146
- **Trading Server**: 86.104.251.148:443

## Development

- **TypeScript**: Full TypeScript support
- **Hot Reload**: Development server with hot reload
- **Linting**: ESLint configuration included
- **Testing**: Jest testing framework ready

## Security

- **Helmet**: Security headers
- **CORS**: Cross-origin resource sharing
- **Rate Limiting**: Request rate limiting
- **Input Validation**: Request validation middleware

## Logging

Comprehensive logging for debugging and monitoring MT5 API interactions.
