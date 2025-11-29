# ContentPilot - AI-Powered Content Marketing SaaS Platform

ContentPilot is a comprehensive AI-driven SaaS platform that automates content creation, scheduling, and performance tracking for small businesses, agencies, and freelancers.

## ✨ Features

- **AI Content Generation**: Create blog posts, social media content, ad copy, emails, and product descriptions with GPT-4
- **Multi-Platform Publishing**: Schedule and publish to Twitter, Facebook, LinkedIn, and Instagram
- **Performance Analytics**: Track engagement and ROI across all platforms
- **Subscription Management**: Paddle-integrated billing with multiple tiers
- **Team Collaboration**: Invite teammates with role-based permissions
- **SEO Optimization**: Automatic keyword integration and scoring
- **Content Library**: Organize with folders, tags, and export to PDF/DOCX

## 🚀 Quick Start

### Prerequisites

- Node.js 18+
- PostgreSQL database
- OpenAI API key
- Paddle account (for billing)

### Installation

1. **Clone and install dependencies**
```bash
npm install
```

2. **Set up environment variables**
```bash
cp .env.example .env
```

Edit `.env` with your credentials:
```env
DATABASE_URL="postgresql://user:password@localhost:5432/contentpilot"
NEXTAUTH_SECRET="generate-with-openssl-rand-base64-32"
OPENAI_API_KEY="your-openai-key"
PADDLE_VENDOR_ID="your-paddle-vendor-id"
PADDLE_API_KEY="your-paddle-api-key"
GOOGLE_CLIENT_ID="your-google-client-id"
GOOGLE_CLIENT_SECRET="your-google-client-secret"
```

3. **Initialize database**
```bash
npx prisma generate
npx prisma db push
```

4. **Run development server**
```bash
npm run dev
```

Visit `http://localhost:3000` 🎉

## 💳 Subscription Tiers

- **Free**: 5 AI generations/day, 1 platform
- **Starter ($15/mo)**: 50 generations/day, 3 platforms
- **Pro ($39/mo)**: Unlimited generations, all platforms, analytics
- **Agency ($79/mo)**: Everything + team collaboration, multiple brands

## 📁 Project Structure

```
├── app/
│   ├── api/              # API routes
│   ├── auth/             # Authentication pages
│   ├── dashboard/        # Dashboard pages
│   └── page.tsx          # Landing page
├── lib/
│   ├── ai/               # OpenAI integration
│   ├── billing/          # Paddle integration
│   ├── social/           # Social media APIs
│   └── prisma.ts         # Database client
├── prisma/
│   └── schema.prisma     # Database schema
└── auth.ts               # NextAuth config
```

## 🔑 Key API Routes

- `POST /api/auth/signup` - Create account
- `POST /api/content/generate` - Generate AI content
- `POST /api/social/schedule` - Schedule posts
- `GET /api/subscription` - Manage subscriptions
- `POST /api/webhooks/paddle` - Billing webhooks

## 🚢 Deployment

### Railway (Database + Backend)
1. Create Railway project
2. Add PostgreSQL service
3. Connect GitHub repo
4. Set environment variables
5. Deploy

### Vercel (Frontend)
1. Import GitHub repo to Vercel
2. Add environment variables
3. Deploy automatically

## 🛠️ Development

```bash
npm run dev        # Start dev server
npm run build      # Build for production
npx prisma studio  # Database GUI
```

## 📊 Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Database**: PostgreSQL + Prisma
- **Auth**: NextAuth.js
- **AI**: OpenAI GPT-4
- **Billing**: Paddle
- **Styling**: TailwindCSS
- **Language**: TypeScript

## 🔐 Security Features

- Bcrypt password hashing
- HTTP-only session cookies
- Protected API routes
- Webhook signature verification
- SQL injection protection via Prisma

## 📄 License

Proprietary - ContentPilot SaaS

## 🆘 Support

For issues or questions, create an issue in this repository.

---

Built with Next.js + Prisma + OpenAI
