# MT5 CRM Platform

A comprehensive, professional-grade CRM platform for MT5 trading with real-time integration, user management, and advanced admin controls.

## 🏗️ Architecture

This project is organized into three independent, modular components:

\`\`\`
mt5-crm-platform/
├── backend/           # API Server & MT5 Integration
├── admin-panel/       # Admin Dashboard
├── frontend/          # User-Facing Website
└── README.md         # This file
\`\`\`

### 🔧 Backend (`/backend`)
- **Port**: 3001
- **Tech Stack**: Node.js, Express, TypeScript
- **Features**: MT5 API integration, authentication, trading operations, payments
- **Database**: Configurable (PostgreSQL recommended)

### 👨‍💼 Admin Panel (`/admin-panel`)
- **Port**: 3002  
- **Tech Stack**: Next.js, React, TypeScript, Tailwind CSS
- **Features**: User management, trading oversight, balance operations, system monitoring

### 🌐 Frontend (`/frontend`)
- **Port**: 3000
- **Tech Stack**: Next.js, React, TypeScript, Tailwind CSS, Framer Motion
- **Features**: User registration, trading dashboard, payments, account management

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- npm or yarn
- MT5 server access (credentials provided)

### 1. Clone and Setup
\`\`\`bash
git clone <repository-url>
cd mt5-crm-platform
\`\`\`

### 2. Backend Setup
\`\`\`bash
cd backend
npm install
cp .env.example .env
# Edit .env with your configuration
npm run dev
\`\`\`

### 3. Admin Panel Setup
\`\`\`bash
cd admin-panel
npm install  
cp .env.local.example .env.local
# Edit .env.local with backend API URL
npm run dev
\`\`\`

### 4. Frontend Setup
\`\`\`bash
cd frontend
npm install
cp .env.local.example .env.local  
# Edit .env.local with backend API URL
npm run dev
\`\`\`

### 5. Access Applications
- **Frontend**: http://localhost:3000
- **Admin Panel**: http://localhost:3002  
- **Backend API**: http://localhost:3001

## 🔑 Key Features

### Backend API
- ✅ Complete MT5 server integration
- ✅ JWT authentication system
- ✅ Real-time trading operations
- ✅ Stripe payment processing
- ✅ Comprehensive admin endpoints
- ✅ Security middleware & rate limiting
- ✅ Structured logging with Winston

### Admin Panel  
- ✅ Real-time dashboard with live statistics
- ✅ Complete user management (CRUD operations)
- ✅ MT5 account creation and management
- ✅ Live position monitoring and trade execution
- ✅ Balance operations (deposits, withdrawals, credits)
- ✅ System logs and activity monitoring
- ✅ Professional, responsive UI

### Frontend Website
- ✅ Modern landing page with animations
- ✅ User registration and authentication  
- ✅ Trading dashboard with real-time data
- ✅ Stripe-powered payment processing
- ✅ Account management and settings
- ✅ Mobile-responsive design
- ✅ SEO optimized

## 🔐 Security Features

- JWT-based authentication
- Rate limiting and DDoS protection
- CORS configuration
- Input validation and sanitization
- Secure password hashing
- Environment variable protection
- HTTPS enforcement (production)

## 📊 MT5 Integration

Direct integration with your MT5 server:
- **Server**: 86.104.251.148:443
- **Manager ID**: 1146
- **API Endpoint**: http://173.208.156.141:6701

### Supported Operations
- Account creation and management
- Real-time position monitoring
- Trade execution (open/close)
- Balance operations
- Historical data retrieval
- Symbol information
- Server logs and journal

## 🚀 Deployment

Each component can be deployed independently:

### Backend
- **Recommended**: Vercel, Railway, or VPS
- **Environment**: Node.js runtime
- **Database**: PostgreSQL (recommended)

### Admin Panel & Frontend  
- **Recommended**: Vercel, Netlify, or AWS Amplify
- **Build**: Static export or SSR
- **CDN**: Automatic with most platforms

## 📝 Environment Configuration

Each component has its own environment configuration:

- `backend/.env` - API keys, database, MT5 credentials
- `admin-panel/.env.local` - Backend API URL, app settings  
- `frontend/.env.local` - Backend API URL, Stripe keys, app settings

## 🔧 Development

### Code Structure
- **TypeScript** throughout for type safety
- **ESLint** for code quality
- **Modular architecture** for maintainability
- **Comprehensive error handling**
- **Structured logging**

### API Documentation
- RESTful API design
- Comprehensive endpoint documentation
- Request/response examples
- Authentication requirements

## 📞 Support

For technical support or questions:
- Check component-specific README files
- Review API documentation
- Contact development team

## 📄 License

This project is proprietary software. All rights reserved.
