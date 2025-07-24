# 🚀 FlashFundX - Professional Prop Trading Platform

[![Next.js](https://img.shields.io/badge/Next.js-15.2.4-black)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue)](https://www.typescriptlang.org/)
[![Supabase](https://img.shields.io/badge/Supabase-Database-green)](https://supabase.com/)
[![Vercel](https://img.shields.io/badge/Deployed%20on-Vercel-black)](https://vercel.com/)

A comprehensive, production-ready prop trading platform that enables traders to access funded accounts through evaluation challenges. Built with modern web technologies and featuring cryptocurrency payment integration.

## ✨ Key Features

### 🏦 **Account Types**
- **Instant Accounts**: Direct live trading access
- **HFT Accounts**: High-frequency trading with single challenge
- **One-Step Accounts**: Single evaluation phase
- **Two-Step Accounts**: Traditional two-phase evaluation

### 💰 **Payment Integration**
- **Cryptocurrency**: USDT (BSC/TRC20/Polygon), Bitcoin, Ethereum, BNB, Solana
- **Credit Cards**: Integrated with LemonSqueezy
- **Automatic Processing**: Real-time payment verification
- **NowPayments Integration**: Secure crypto payment gateway

### 👨‍💼 **Admin Portal**
- **User Management**: Complete user oversight and control
- **Order Tracking**: Real-time payment and order status
- **Account Delivery**: Automated MT4/MT5 account provisioning
- **Analytics Dashboard**: Comprehensive business insights
- **Trading Rules Management**: Configurable challenge parameters

### 🔐 **Authentication & Security**
- **Email Verification**: Secure account activation
- **Password Reset**: Email-based password recovery
- **Role-Based Access**: Admin and user permissions
- **Supabase Auth**: Enterprise-grade authentication

### 📱 **User Experience**
- **Responsive Design**: Mobile-first approach
- **Modern UI**: Clean, professional interface
- **Real-time Updates**: Live payment and account status
- **Dashboard**: Comprehensive user control panel

## 🛠️ Tech Stack

### **Frontend**
- **Framework**: Next.js 15.2.4 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS + shadcn/ui components
- **State Management**: React Context + Hooks
- **Forms**: React Hook Form with Zod validation

### **Backend**
- **Database**: Supabase (PostgreSQL)
- **Authentication**: Supabase Auth
- **Edge Functions**: Supabase Edge Functions
- **Real-time**: Supabase Realtime subscriptions
- **File Storage**: Supabase Storage

### **Payment Processing**
- **Crypto**: NowPayments API
- **Cards**: LemonSqueezy integration
- **Webhooks**: Automated payment verification
- **Security**: Encrypted payment data

### **Deployment**
- **Hosting**: Vercel (Frontend)
- **Database**: Supabase Cloud
- **CDN**: Vercel Edge Network
- **SSL**: Automatic HTTPS

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- npm or yarn
- Supabase account
- NowPayments account (for crypto)

### Installation

1. **Clone the repository**
```bash
git clone https://github.com/cobzeu/FlashFundX.git
cd FlashFundX
```

2. **Install dependencies**
```bash
cd Frontend
npm install
```

3. **Environment Setup**
Create `.env.local` in the Frontend directory:
```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key

# Payment Integration
NOWPAYMENTS_API_KEY=your_nowpayments_api_key
LEMONSQUEEZY_API_KEY=your_lemonsqueezy_api_key

# Admin Configuration
ADMIN_USERNAME=FlashFundX
ADMIN_PASSWORD=your_admin_password
```

4. **Database Setup**
```bash
# Run the database schema
psql -h your_supabase_host -U postgres -d postgres -f Frontend/flashfundx-database-schema.sql
```

5. **Deploy Edge Functions**
```bash
# Deploy Supabase Edge Functions
./deploy-edge-functions.sh
```

6. **Start Development Server**
```bash
npm run dev
```

Visit `http://localhost:3000` to see the application.

## 📁 Project Structure

```
FlashFundX/
├── Frontend/                 # Main application
│   ├── app/                 # Next.js App Router
│   │   ├── admin/          # Admin portal pages
│   │   ├── dashboard/      # User dashboard
│   │   └── (auth)/         # Authentication pages
│   ├── components/         # Reusable UI components
│   │   ├── admin/         # Admin-specific components
│   │   ├── dashboard/     # Dashboard components
│   │   ├── sections/      # Landing page sections
│   │   └── ui/           # Base UI components
│   ├── lib/              # Utilities and configurations
│   ├── supabase/         # Edge Functions
│   └── public/           # Static assets
├── Backend/              # Backend utilities (if needed)
└── supabase/            # Supabase configuration
```

## 🔧 Configuration

### **Trading Rules**
Configure challenge parameters in the admin portal:
- Profit targets
- Maximum drawdowns
- Minimum trading days
- Account sizes and pricing

### **Payment Settings**
Set up payment providers:
- NowPayments: Crypto payment processing
- LemonSqueezy: Credit card processing
- Webhook endpoints for real-time updates

### **Account Delivery**
Configure MT4/MT5 account provisioning:
- Account server details
- Login credentials generation
- Automated delivery system

## 🚀 Deployment

### **Vercel Deployment**
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy to production
cd Frontend
vercel --prod
```

### **Environment Variables**
Set up production environment variables in Vercel dashboard or use:
```bash
vercel env add NEXT_PUBLIC_SUPABASE_URL
vercel env add NEXT_PUBLIC_SUPABASE_ANON_KEY
# ... add all required variables
```

## 📊 Features Overview

### **User Journey**
1. **Registration**: Email verification required
2. **Account Selection**: Choose account type and size
3. **Payment**: Crypto or card payment processing
4. **Account Delivery**: Automatic MT4/MT5 provisioning
5. **Trading**: Access to funded trading account

### **Admin Features**
- Real-time order monitoring
- User management and verification
- Payment tracking and reconciliation
- Account delivery management
- Analytics and reporting

### **Payment Flow**
1. User selects account and payment method
2. Payment processor (NowPayments/LemonSqueezy) handles transaction
3. Webhook confirms payment
4. Account automatically delivered
5. User receives trading credentials

## 🔐 Security Features

- **Row Level Security (RLS)**: Database-level access control
- **API Key Management**: Secure key storage and rotation
- **Payment Encryption**: All payment data encrypted
- **Admin Authentication**: Separate admin login system
- **Input Validation**: Comprehensive form validation

## 📈 Monitoring & Analytics

- **Payment Tracking**: Real-time payment status
- **User Analytics**: Registration and conversion metrics
- **Error Monitoring**: Comprehensive error tracking
- **Performance Metrics**: Application performance monitoring

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

For support and questions:
- Create an issue in this repository
- Contact: [your-email@example.com]

## 🙏 Acknowledgments

- [Next.js](https://nextjs.org/) - React framework
- [Supabase](https://supabase.com/) - Backend as a Service
- [Tailwind CSS](https://tailwindcss.com/) - CSS framework
- [shadcn/ui](https://ui.shadcn.com/) - UI components
- [NowPayments](https://nowpayments.io/) - Crypto payment processing

---

**FlashFundX** - Empowering traders with professional prop trading solutions 🚀
