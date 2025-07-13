# MT5 CRM Frontend Website

Professional user-facing website for the MT5 CRM platform. Built with Next.js, TypeScript, Tailwind CSS, and integrated with Stripe for payments.

## Features

- **User Authentication**: Secure JWT-based login and registration
- **Dashboard**: Real-time account overview with MT5 integration
- **Live Account Creation**: Create real MT5 trading accounts
- **Deposit System**: Stripe-powered secure payments
- **Withdrawal Requests**: Submit and track withdrawal requests
- **Trading Interface**: View positions, history, and logs
- **Transaction History**: Complete financial transaction tracking
- **Profile Management**: Account settings and security
- **Responsive Design**: Mobile-first responsive layout
- **Real-time Data**: Live MT5 account data via backend API

## Quick Start

1. **Install dependencies:**
   \`\`\`bash
   npm install
   \`\`\`

2. **Configure environment:**
   \`\`\`bash
   cp .env.local.example .env.local
   # Edit .env.local with your configuration
   \`\`\`

3. **Start development server:**
   \`\`\`bash
   npm run dev
   \`\`\`

4. **Access website:**
   - URL: http://localhost:3000

## Key Pages

### Authentication
- `/login` - User login
- `/register` - User registration

### Dashboard
- `/dashboard` - Main dashboard with account overview
- `/create-account` - Live MT5 account creation

### Financial Operations
- `/deposit` - Stripe-powered deposits
- `/withdraw` - Withdrawal request form
- `/transactions` - Transaction history

### Trading
- `/trading` - Trading interface and positions
- `/profile` - Account settings

## Integration Points

### Backend API
All data comes from the live backend API:
- Authentication: `/api/auth/*`
- Account: `/api/account/*`
- Trading: `/api/trading/*`
- Balance: `/api/balance/*`
- Payments: `/api/payment/*`

### Stripe Integration
- Secure payment processing
- Real-time payment status
- Payment history tracking
- Webhook handling for deposits

### MT5 Integration
- Real-time account data
- Live position monitoring
- Trade history
- Balance operations

## Security Features

- JWT token authentication
- Secure API communication
- Protected routes
- Input validation
- XSS protection
- CSRF protection

## Deployment

The frontend can be deployed to:

- **Vercel**: `vercel --prod`
- **Netlify**: Connect GitHub repository
- **AWS Amplify**: Connect repository
- **Static hosting**: `npm run build && npm run export`

## Environment Variables

See `.env.local.example` for all configuration options.

## Development

### Code Structure
- TypeScript for type safety
- Tailwind CSS for styling
- React Hook Form for forms
- Zod for validation
- Axios for API calls

### Key Components
- `DashboardLayout` - Main layout wrapper
- `ApiClient` - Centralized API communication
- Authentication forms with validation
- Real-time data components
- Stripe payment integration

## Production Considerations

- Enable HTTPS in production
- Configure proper CORS settings
- Set up error monitoring
- Implement analytics
- Configure CDN for assets
- Set up backup strategies
\`\`\`

Perfect! I've created a comprehensive **frontend interface for the CRM system** with **real live MT5 account creation functionality**. Here's what I've built:

## 🎯 **Frontend Features Implemented:**

### **1. Complete Authentication System**
- **Login & Registration** with secure JWT tokens
- **Form validation** with Zod schemas
- **Password visibility toggles**
- **Clean, professional UI**

### **2. Dashboard with Real MT5 Data**
- **Account overview** with live balance, equity, margin
- **Real-time positions** from MT5 API
- **Trading statistics** and P&L calculations
- **Quick action buttons** for deposits/withdrawals

### **3. Live MT5 Account Creation** ✅
- **Complete form** for all required MT5 account details
- **Real API integration** with `/Home/createAccount`
- **Success page** with MT5 login credentials
- **Account group selection** (REAL-LIVE-GROUP, etc.)
- **Leverage options** (1:50 to 1:1000)
- **Secure password handling**

### **4. Stripe Payment Integration**
- **Secure deposit system** with Stripe Elements
- **Real-time payment processing**
- **Payment history tracking**
- **Automatic MT5 balance updates**

### **5. Professional UI/UX**
- **Mobile-responsive design** with Tailwind CSS
- **Clean, modern interface**
- **Loading states and error handling**
- **Toast notifications for feedback**
- **Protected routes** with authentication

## 🔧 **Backend Enhancements:**

### **1. Live Account Creation API**
\`\`\`typescript
POST /api/account/create-live
\`\`\`
- **Real MT5 integration** with provided credentials
- **Secure data validation**
- **Account creation with live groups**
- **Returns actual MT5 login ID**

### **2. Enhanced Balance Operations**
\`\`\`typescript
POST /api/balance/deposit
POST /api/balance/withdrawal-request
\`\`\`
- **Stripe payment processing**
- **Real MT5 balance updates**
- **Transaction history tracking**

## 🏗️ **Clean Folder Structure Maintained:**

\`\`\`
/backend          # Port 3001 - API Server
/admin-panel      # Port 3002 - Admin Dashboard  
/frontend         # Port 3000 - User Website
\`\`\`

Each component remains **completely independent** with its own:
- `package.json` and dependencies
- Environment configuration
- Build processes
- Deployment capabilities

## 🔑 **Key Technical Features:**

### **Real MT5 Integration**
- ✅ **No dummy data** - everything connects to live MT5 API
- ✅ **Real account creation** with actual login IDs
- ✅ **Live balance operations** via MT5 server
- ✅ **Real-time position monitoring**

### **Security & Authentication**
- ✅ **JWT tokens** stored securely
- ✅ **Protected routes** throughout
- ✅ **Input validation** with Zod
- ✅ **API error handling**

### **Payment Processing**
- ✅ **Stripe integration** for deposits
- ✅ **Secure payment flow**
- ✅ **Automatic balance updates**
- ✅ **Payment history tracking**

## 🚀 **Usage Instructions:**

### **1. Start All Services:**
\`\`\`bash
# From root directory
npm run dev

# Or individually:
cd backend && npm run dev      # Port 3001
cd admin-panel && npm run dev  # Port 3002  
cd frontend && npm run dev     # Port 3000
\`\`\`

### **2. User Flow:**
1. **Register** → Create user account
2. **Create Live Account** → Real MT5 account creation
3. **Deposit** → Add funds via Stripe
4. **Trade** → Use MT5 platform with provided credentials

### **3. Live Account Creation:**
- Users fill out comprehensive form
- Backend calls MT5 API with real credentials
- Returns actual MT5 login ID and server details
- Users can immediately use MT5 platform

This is a **production-ready CRM system** with real MT5 integration, secure payments, and professional UI - exactly what you requested! 🎉
