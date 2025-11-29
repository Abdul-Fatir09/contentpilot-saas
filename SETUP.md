# ContentPilot - Complete Setup Guide

## 🎯 Overview

This guide will walk you through setting up ContentPilot from scratch, including all necessary API keys, database configuration, and deployment.

## 📋 Prerequisites Checklist

Before you begin, ensure you have:

- [ ] Node.js 18 or higher installed
- [ ] npm or yarn package manager
- [ ] Git installed
- [ ] PostgreSQL database (local or cloud)
- [ ] Text editor (VS Code recommended)
- [ ] OpenAI API account
- [ ] Paddle account (for billing)
- [ ] Google Cloud account (for OAuth - optional)

## 🚀 Step-by-Step Setup

### 1. Project Installation

```bash
# Clone the repository
git clone <your-repository-url>
cd content-pilot

# Install dependencies
npm install
```

### 2. Environment Configuration

Create a `.env` file in the root directory:

```bash
cp .env.example .env
```

### 3. Database Setup (PostgreSQL)

#### Option A: Local PostgreSQL

1. Install PostgreSQL on your machine
2. Create a new database:
```sql
CREATE DATABASE contentpilot;
```

3. Update your `.env`:
```env
DATABASE_URL="postgresql://username:password@localhost:5432/contentpilot"
```

#### Option B: Railway (Recommended for Production)

1. Go to [railway.app](https://railway.app)
2. Create a new project
3. Add PostgreSQL service
4. Copy the connection string to `.env`

```env
DATABASE_URL="postgresql://postgres:xxxx@monorail.proxy.rlwy.net:12345/railway"
```

### 4. OpenAI API Setup

1. Go to [platform.openai.com](https://platform.openai.com)
2. Create an account or sign in
3. Navigate to API Keys section
4. Create a new API key
5. Add to `.env`:

```env
OPENAI_API_KEY="sk-xxxxxxxxxxxxxxxxxxxx"
```

### 5. NextAuth Configuration

Generate a secure secret:

```bash
openssl rand -base64 32
```

Add to `.env`:

```env
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-generated-secret-here"
```

### 6. Google OAuth Setup (Optional)

1. Go to [Google Cloud Console](https://console.cloud.google.com)
2. Create a new project
3. Enable Google+ API
4. Create OAuth 2.0 credentials
5. Add authorized redirect URI: `http://localhost:3000/api/auth/callback/google`
6. Add to `.env`:

```env
GOOGLE_CLIENT_ID="your-client-id.apps.googleusercontent.com"
GOOGLE_CLIENT_SECRET="your-client-secret"
```

### 7. Paddle Billing Setup

1. Create account at [paddle.com](https://paddle.com)
2. Get Vendor ID and API key from Settings
3. Create webhook pointing to: `https://yourdomain.com/api/webhooks/paddle`
4. Add to `.env`:

```env
PADDLE_VENDOR_ID="12345"
PADDLE_API_KEY="your-api-key"
PADDLE_WEBHOOK_SECRET="your-webhook-secret"
PADDLE_ENVIRONMENT="sandbox"
```

### 8. Social Media API Setup (Optional)

#### Twitter/X API

1. Go to [developer.twitter.com](https://developer.twitter.com)
2. Create a new app
3. Get API Key and Secret
4. Add to `.env`:

```env
TWITTER_API_KEY="your-api-key"
TWITTER_API_SECRET="your-api-secret"
TWITTER_BEARER_TOKEN="your-bearer-token"
```

#### Facebook/Instagram API

1. Go to [developers.facebook.com](https://developers.facebook.com)
2. Create a new app
3. Add Facebook Login product
4. Get App ID and Secret
5. Add to `.env`:

```env
FACEBOOK_APP_ID="your-app-id"
FACEBOOK_APP_SECRET="your-app-secret"
```

#### LinkedIn API

1. Go to [linkedin.com/developers](https://linkedin.com/developers)
2. Create a new app
3. Add redirect URL
4. Get Client ID and Secret
5. Add to `.env`:

```env
LINKEDIN_CLIENT_ID="your-client-id"
LINKEDIN_CLIENT_SECRET="your-client-secret"
```

### 9. Initialize Database

```bash
# Generate Prisma Client
npx prisma generate

# Push schema to database
npx prisma db push

# (Optional) Seed database
npx prisma db seed
```

### 10. Run Development Server

```bash
npm run dev
```

Visit `http://localhost:3000` to see your application!

## 🚢 Deployment

### Deploy to Vercel (Frontend)

1. Push code to GitHub
2. Go to [vercel.com](https://vercel.com)
3. Import your repository
4. Add all environment variables
5. Deploy

### Deploy Database to Railway

1. Create Railway project
2. Add PostgreSQL
3. Connect to your app
4. Copy `DATABASE_URL`

## 🔐 Security Checklist

- [ ] Change `NEXTAUTH_SECRET` to a strong random value
- [ ] Use environment-specific URLs (production vs development)
- [ ] Enable HTTPS in production
- [ ] Restrict API keys to specific domains
- [ ] Set up rate limiting
- [ ] Enable Paddle webhook signature verification
- [ ] Use production mode for Paddle in live environment

## 🧪 Testing Your Setup

### Test Authentication
1. Go to `/auth/signup`
2. Create an account
3. Verify email login works
4. Test Google OAuth (if configured)

### Test Content Generation
1. Log in to dashboard
2. Click "Generate Content"
3. Fill in the form
4. Generate content
5. Verify it saves to database

### Test Subscription
1. Go to Settings → Billing
2. Click upgrade plan
3. Verify Paddle checkout opens
4. Test webhook by completing purchase (sandbox mode)

## 🐛 Troubleshooting

### Database Connection Failed
- Check `DATABASE_URL` format
- Verify PostgreSQL is running
- Check firewall rules

### OpenAI API Error
- Verify API key is correct
- Check you have credits/billing set up
- Monitor rate limits

### Authentication Not Working
- Check `NEXTAUTH_URL` matches your domain
- Verify `NEXTAUTH_SECRET` is set
- Clear browser cookies

### Paddle Webhooks Not Received
- Verify webhook URL is publicly accessible
- Use ngrok for local testing: `ngrok http 3000`
- Check webhook signature secret matches

## 📚 Next Steps

1. Customize branding and colors
2. Set up email service (for transactional emails)
3. Configure error monitoring (Sentry)
4. Set up analytics (Google Analytics, PostHog)
5. Add custom templates
6. Enable additional AI features
7. Set up automated backups

## 🆘 Getting Help

- Check the main README.md for API documentation
- Review Prisma schema for database structure
- Examine API routes in `app/api/` directory
- Check console logs for detailed error messages

## ✅ Production Checklist

Before going live:

- [ ] All environment variables set in production
- [ ] Database migrations applied
- [ ] SSL certificate configured
- [ ] Paddle in production mode
- [ ] Error monitoring set up
- [ ] Backup strategy in place
- [ ] Analytics configured
- [ ] Terms of Service and Privacy Policy pages added
- [ ] Email service configured
- [ ] Rate limiting enabled
- [ ] Security headers configured

---

For additional support, refer to the main README.md file.
