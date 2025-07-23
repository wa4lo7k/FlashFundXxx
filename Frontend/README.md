# 🚀 Prop Firm Platform Frontend

A comprehensive, modern prop firm platform built with Next.js 14, TypeScript, and Tailwind CSS. Features a complete trading challenge system with multiple account types and a powerful admin portal.

🔗 **Auto-deployment test - Ready for Vercel integration!**

## ✨ Features

### 🏠 **Landing Page**
- Modern, responsive design with glass morphism effects
- Live trading ticker with real-time data
- Comprehensive pricing tables for all account types
- FAQ section and testimonials
- Professional hero section with call-to-action

### 👤 **User Authentication**
- Secure email/password authentication
- Email verification system
- Password reset functionality
- Protected routes and session management

### 📊 **User Dashboard**
- Account overview with real-time statistics
- Order placement for different challenge types
- KYC verification workflow
- Document upload and management
- Trading rules and guidelines
- Withdrawal management

### 🎯 **Challenge Types**
- **Instant Challenge**: Immediate funding with 10% profit target
- **OneStep Challenge**: Single-phase evaluation with 8% target
- **TwoStep Challenge**: Traditional two-phase evaluation (8% + 5%)
- **HFT Challenge**: High-frequency trading with 6% target

### 🛠️ **Admin Portal**
- **Comprehensive Dashboard** with live statistics and analytics
- **Order Management**: View, edit, and process all order types
- **User Management**: Complete user lifecycle with KYC workflows
- **Account Delivery**: Manual account credential delivery system
- **Bulk Operations**: Multi-select and batch processing
- **Real-time Notifications**: Live activity feed and alerts
- **Advanced Analytics**: Performance metrics and business intelligence
- **Reports & Analytics**: Automated report generation
- **Settings & Configuration**: Platform-wide configuration management

## 🛠️ Tech Stack

- **Framework**: Next.js 14 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS with custom design system
- **UI Components**: Radix UI primitives with custom styling
- **Icons**: Lucide React
- **State Management**: React hooks and context
- **Form Handling**: React Hook Form with validation
- **Animations**: CSS transitions and transforms

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ 
- npm, yarn, or pnpm

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd Frontend
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   yarn install
   # or
   pnpm install
   ```

3. **Run the development server**
   ```bash
   npm run dev
   # or
   yarn dev
   # or
   pnpm dev
   ```

4. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 📁 Project Structure

```
Frontend/
├── app/                    # Next.js App Router pages
│   ├── admin/             # Admin portal pages
│   ├── dashboard/         # User dashboard pages
│   ├── login/             # Authentication pages
│   └── ...
├── components/            # Reusable components
│   ├── admin/            # Admin-specific components
│   ├── dashboard/        # Dashboard components
│   ├── sections/         # Landing page sections
│   └── ui/               # Base UI components
├── hooks/                # Custom React hooks
├── lib/                  # Utility functions
├── public/               # Static assets
└── styles/               # Global styles
```

## 🎨 Design System

### Color Palette
- **Primary**: Emerald green (#10b981)
- **Secondary**: Slate gray (#64748b)
- **Accent**: Blue (#3b82f6)
- **Background**: Dark theme with glass morphism

### Typography
- **Headings**: Inter font family
- **Body**: System font stack
- **Code**: Monospace fonts

## 🔧 Key Components

### Admin Portal Features
- **Dashboard**: Live statistics, activity feed, system status
- **Order Management**: Complete order lifecycle management
- **User Management**: KYC workflows, account status control
- **Analytics**: Performance metrics, conversion tracking
- **Bulk Operations**: Multi-select actions, batch processing
- **Notifications**: Real-time alerts and activity tracking

### User Dashboard Features
- **Account Overview**: Balance, progress, statistics
- **Order Placement**: Challenge selection and payment
- **KYC Verification**: Document upload and verification
- **Account Management**: Trading credentials and rules

## 🚀 Deployment

### Build for Production
```bash
npm run build
npm start
```

### Environment Variables
Create a `.env.local` file with:
```env
NEXT_PUBLIC_API_URL=your_api_url
NEXT_PUBLIC_SITE_URL=your_site_url
```

## 📱 Responsive Design

The platform is fully responsive and optimized for:
- **Desktop**: Full-featured experience
- **Tablet**: Optimized layouts and navigation
- **Mobile**: Touch-friendly interface with collapsible menus

## 🔒 Security Features

- **Authentication**: Secure session management
- **Route Protection**: Protected admin and user routes
- **Input Validation**: Form validation and sanitization
- **CSRF Protection**: Built-in Next.js security features

## 🎯 Performance

- **Core Web Vitals**: Optimized for performance
- **Code Splitting**: Automatic route-based splitting
- **Image Optimization**: Next.js Image component
- **Caching**: Efficient caching strategies

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is proprietary software. All rights reserved.

## 🆘 Support

For support and questions, please contact the development team.

---

**Built with ❤️ for the trading community**
