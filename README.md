# Sovereign Asset Inc - Full-Stack Crypto Investment Platform

A comprehensive cryptocurrency investment platform built with Next.js 14, TypeScript, and modern web technologies.

## 🚀 Features

- **TailwindCSS** for responsive, modern UI design
- **Recharts** for advanced cryptocurrency charts and analytics
- **React Hook Form** with Zod validation
- **Framer Motion** for smooth animations
- **End-to-End SSL/TLS Encryption** for all data transmission
- **Multi-Factor Authentication (MFA)** with QR code setup and backup codes
- **Certificate of Incorporation** verification with tamper-proof display
- **Real-time Security Monitoring** with suspicious activity detection
- **XSS/CSRF Protection** with input sanitization and CSRF tokens
- **Password Strength Validation** with comprehensive security requirements
- **Encrypted Data Storage** for sensitive user information
- **Security Event Logging** with admin dashboard monitoring
- **Real-time WebSocket** updates for market data

### Backend APIs

- **RESTful API** with TypeScript
- **JWT Authentication** with role-based access control
- **PostgreSQL** database with Prisma ORM
- **CoinGecko API** integration for live crypto data
- **Paystack & CoinPayments** integration for payments
- **Email/SMS notifications** for account activities

### Key Pages & Features

- **Homepage** with live crypto charts, investment plans, and testimonials
- **Authentication** system (register, login, forgot password)
- **User Dashboard** with portfolio analytics and investment tracking
- **Investment Plans** with detailed plan information and payment integration
- **Admin Dashboard** for platform management
- **KYC Verification** system
- **Withdrawal Management** with approval workflow

## 🛠 Tech Stack

- **Frontend**: Next.js 14, TypeScript, TailwindCSS, Recharts
- **State Management**: Zustand
- **Forms**: React Hook Form + Zod validation
- **Database**: PostgreSQL with Prisma ORM
- **Authentication**: JWT with secure token management
- **Payments**: Paystack (fiat), CoinPayments (crypto)
- **External APIs**: CoinGecko for market data
- **Deployment**: Vercel (frontend), AWS EC2 (backend), AWS RDS (database)

## 📦 Installation

1. **Clone the repository**

```bash
git clone <repository-url>
cd sovereign-asset-platform
```

2. **Install dependencies**

```bash
npm install
```

3. **Set up environment variables**

```bash
cp .env.example .env
```

Fill in your environment variables:

- Database connection string
- JWT secrets
- Payment gateway keys (Paystack, CoinPayments)
- External API keys

4. **Set up the database**

```bash
npm run db:generate
npm run db:push
```

5. **Run the development server**

```bash
npm run dev
```

## 🗄 Database Schema

- **Withdrawal**: Withdrawal requests and approvals
- **PaymentAccount**: User payment methods
- **FAQ**: Frequently asked questions
- Role-based access control (USER, ADMIN)
- Password hashing with bcrypt

- Bank transfer support
- Automatic payment verification
- Real-time cryptocurrency prices from CoinGecko API

## 🎨 Design Features

## 🚀 Deployment

### Frontend (Vercel)

```bash
npm run build
# Deploy to Vercel
```

### Backend (AWS EC2)

- Set up EC2 instance with Node.js
- Configure environment variables
- Set up PM2 for process management
- Configure nginx as reverse proxy

## 📝 API Endpoints

### Authentication

- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `POST /api/auth/logout` - User logout

### User Management

- `GET /api/users/me` - Get user profile
- `PUT /api/users/update` - Update user profile
- `GET /api/users/payment-accounts` - Get payment accounts

### Investments

- `GET /api/investment-plans` - Get all plans
- `POST /api/investments/create` - Create investment
- `GET /api/investments/user` - Get user investments

- `GET /api/market-data/charts` - Get chart data
- `GET /api/admin/stats` - Platform statistics
- `POST /api/admin/plans` - Create/update plans
- `GET /api/admin/withdrawals` - Manage withdrawals

## 🔧 Development

### Code Structure

```
├── app/                 # Next.js app directory
├── components/          # React components
├── lib/                # Utility functions
├── store/              # Zustand stores
├── types/              # TypeScript types
- **InvestmentPlans**: Investment plan cards
- **UserDashboard**: User portfolio management
- [ ] Multi-language support
- [ ] Advanced analytics dashboard
1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🆘 Support

For support and questions:

---

Built with ❤️ by the Sovereign Asset team
```
