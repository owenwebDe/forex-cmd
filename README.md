# MT5 CRM Platform

A comprehensive Customer Relationship Management system for MT5 trading accounts with real-time integration, user portal, and admin dashboard.

## 🚀 Overview

The MT5 CRM Platform is a full-stack web application designed to manage MT5 trading accounts, process payments, and provide comprehensive trading analytics. It consists of three main components:

- **Backend API**: Node.js/Express server with MongoDB
- **Frontend Portal**: Next.js user interface for traders
- **Admin Dashboard**: Next.js admin panel for account management

## 🛠 Technology Stack

### Backend
- **Framework**: Node.js with Express.js
- **Language**: TypeScript
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JWT tokens with bcryptjs
- **Security**: Helmet.js, CORS, rate limiting
- **Payment**: Stripe integration
- **MT5 Integration**: Direct REST API calls

### Frontend & Admin Panel
- **Framework**: Next.js 14 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: Radix UI primitives
- **State Management**: React hooks and context
- **HTTP Client**: Axios with interceptors
- **Forms**: React Hook Form with Zod validation
- **Charts**: Recharts for data visualization

## 📁 Project Structure

```
Real-CRM-MT5-website/
├── backend/                 # API server
│   ├── src/
│   │   ├── config/         # Database & MT5 configuration
│   │   ├── middleware/     # Authentication middleware
│   │   ├── models/         # MongoDB models
│   │   ├── routes/         # API endpoints
│   │   ├── services/       # Business logic
│   │   └── types/          # TypeScript definitions
│   └── package.json
├── frontend/               # User portal
│   ├── src/
│   │   ├── app/           # Next.js app router
│   │   ├── components/    # React components
│   │   ├── lib/           # Utilities
│   │   └── types/         # TypeScript definitions
│   └── package.json
├── admin-panel/           # Admin dashboard
│   ├── src/
│   │   ├── app/           # Next.js app router
│   │   ├── components/    # React components
│   │   └── lib/           # Utilities
│   └── package.json
└── components/            # Shared UI components
```

## 🔧 Installation & Setup

### Prerequisites
- Node.js 18+ 
- MongoDB 6.0+
- npm or yarn package manager

### 1. Clone the Repository
```bash
git clone <repository-url>
cd Real-CRM-MT5-website
```

### 2. Install Dependencies
```bash
# Install root dependencies
npm install

# Install backend dependencies
cd backend
npm install

# Install frontend dependencies
cd ../frontend
npm install

# Install admin panel dependencies
cd ../admin-panel
npm install
```

### 3. Environment Configuration

#### Backend Environment (`backend/.env`)
```env
PORT=3001
NODE_ENV=development

# Database
MONGODB_URI=mongodb://localhost:27017/mt5-crm

# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key-here

# MT5 Server Configuration
MT5_API_URL=http://173.208.156.141:6701
MT5_SERVER_IP=86.104.251.148
MT5_SERVER_PORT=443
MT5_MANAGER_ID=1146
MT5_MANAGER_PASSWORD=your-manager-password
MT5_SERVER_NAME=MT5-Live-Server

# Stripe Configuration
STRIPE_SECRET_KEY=sk_test_your_stripe_secret_key
STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret

# CORS Configuration
FRONTEND_URL=http://localhost:3000
ADMIN_URL=http://localhost:3002

# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
```

#### Frontend Environment (`frontend/.env.local`)
```env
NEXT_PUBLIC_API_URL=http://localhost:3001/api
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_your_stripe_publishable_key
NEXT_PUBLIC_APP_NAME=MT5 CRM Platform
```

#### Admin Panel Environment (`admin-panel/.env.local`)
```env
NEXT_PUBLIC_API_URL=http://localhost:3001/api
NEXT_PUBLIC_APP_NAME=MT5 CRM Admin
```

### 4. Database Setup

Start MongoDB service:
```bash
# macOS with Homebrew
brew services start mongodb-community

# Linux with systemd
sudo systemctl start mongod

# Windows
net start MongoDB
```

### 5. Start the Application

#### Option 1: Start All Services Individually
```bash
# Terminal 1: Backend
cd backend
npm run dev

# Terminal 2: Frontend
cd frontend
npm run dev

# Terminal 3: Admin Panel
cd admin-panel
npm run dev
```

#### Option 2: Using npm scripts (if available)
```bash
# Start all services concurrently
npm run dev
```

### 6. Access the Application

- **Frontend Portal**: http://localhost:3000
- **Admin Dashboard**: http://localhost:3002
- **Backend API**: http://localhost:3001
- **Health Check**: http://localhost:3001/health

## 🔑 Key Features

### User Portal Features
- **Account Management**: Create live MT5 accounts with different groups
- **Dashboard**: Real-time account overview and analytics
- **Deposit System**: Secure Stripe payment integration
- **Withdrawal System**: Request and track withdrawals
- **Transaction History**: Complete financial transaction logs
- **Trading Interface**: View positions and trading history
- **Profile Management**: Update account settings and preferences

### Admin Dashboard Features
- **User Management**: Complete CRUD operations for users
- **Account Monitoring**: Real-time MT5 account oversight
- **Balance Operations**: Manual balance adjustments and corrections
- **Trade Management**: Close positions and view trade history
- **System Monitoring**: MT5 server connection status
- **Analytics Dashboard**: Platform statistics and performance metrics

## 📊 MT5 Integration

### Server Configuration
- **API URL**: `http://173.208.156.141:6701`
- **Trading Server**: `86.104.251.148:443`
- **Manager ID**: 1146
- **Server Name**: MT5-Live-Server

### Available Account Groups
- **Demo**: `demo\demoforex`
- **Live Groups**: ENC, Silver, Prime, Standard, Gold, Cent
- **Leverage Options**: 10, 50, 100, 200, 300, 400, 500

### Supported Operations
- Account creation with personal information
- Real-time balance operations (deposits/withdrawals)
- Position monitoring and management
- Trade history retrieval
- Account information updates

## 🔐 Security Features

- **JWT Authentication**: 24-hour token expiration
- **Role-Based Access Control**: User, admin, manager roles
- **Password Security**: bcryptjs hashing with salt rounds
- **API Rate Limiting**: 100 requests per 15-minute window
- **CORS Protection**: Configured for specific origins
- **Input Validation**: Comprehensive request validation
- **Secure Headers**: Helmet.js security middleware

## 🛡️ API Documentation

### Authentication Endpoints
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User authentication
- `GET /api/auth/profile` - Get user profile
- `POST /api/auth/change-password` - Change password

### Account Management
- `GET /api/account/test-connection` - Test MT5 connection
- `POST /api/account/create-live-account` - Create new MT5 account
- `GET /api/account/user-accounts` - Get user's MT5 accounts
- `GET /api/account/info/:login` - Get account information
- `GET /api/account/positions/:login` - Get account positions
- `POST /api/account/balance-operation` - Deposit/withdrawal operations

### Payment Processing
- `POST /api/payment/create-intent` - Create Stripe payment intent
- `POST /api/payment/confirm` - Confirm payment

### Wallet Operations
- `GET /api/wallet/balance` - Get wallet balance
- `POST /api/wallet/deposit` - Deposit to wallet
- `POST /api/wallet/withdraw` - Withdraw from wallet
- `POST /api/wallet/transfer-to-mt5` - Transfer to MT5 account
- `POST /api/wallet/transfer-from-mt5` - Transfer from MT5 account
- `GET /api/wallet/transactions` - Get transaction history

## 🧪 Testing

### Backend Testing
```bash
cd backend
npm test
```

### Frontend Testing
```bash
cd frontend
npm test
```

### Admin Panel Testing
```bash
cd admin-panel
npm test
```

## 📦 Production Deployment

### Backend Production
```bash
cd backend
npm run build
npm start
```

### Frontend Production
```bash
cd frontend
npm run build
npm start
```

### Admin Panel Production
```bash
cd admin-panel
npm run build
npm start
```

## 🔧 Configuration

### MongoDB Configuration
Ensure MongoDB is running and accessible. Update the `MONGODB_URI` in your environment file.

### MT5 Server Configuration
Update the MT5 server credentials and endpoints in the backend environment file.

### Stripe Configuration
Add your Stripe keys for payment processing functionality.

## 🐛 Troubleshooting

### Common Issues

1. **MongoDB Connection Error**
   - Ensure MongoDB service is running
   - Check connection string in environment file
   - Verify database permissions

2. **MT5 API Connection Failed**
   - Check MT5 server availability
   - Verify API credentials
   - Ensure network connectivity

3. **Authentication Issues**
   - Check JWT secret configuration
   - Verify token expiration settings
   - Ensure consistent secret across services

4. **Payment Processing Errors**
   - Verify Stripe keys are correct
   - Check webhook configuration
   - Ensure HTTPS for production

### Debug Mode
Set `NODE_ENV=development` for detailed error messages and stack traces.

## 📈 Performance Optimization

- **Database Indexing**: User email, MT5 login fields
- **API Caching**: Implement Redis for frequent queries
- **Image Optimization**: Next.js automatic image optimization
- **Bundle Splitting**: Automatic code splitting with Next.js

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## 📄 License

This project is licensed under the MIT License.

## 📞 Support

For technical support or questions, please contact the development team.

---

**Note**: This is a comprehensive trading platform. Ensure all security measures are properly implemented before deploying to production.