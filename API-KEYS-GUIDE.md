# 🔑 API Keys Priority Guide

## 🚨 MUST HAVE (Login & Core Features)

### 1. DATABASE_URL ⭐⭐⭐ CRITICAL
**What it does**: Stores all your data (users, content, posts)
**Without it**: Nothing works - no login, no signup, no data storage

**How to get it (2 minutes - FREE):**
1. Go to: **https://railway.app/**
2. Click "Login" → Sign up with GitHub
3. Click "New Project"
4. Select "Provision PostgreSQL"
5. Click on the PostgreSQL database
6. Go to "Variables" tab
7. Find **DATABASE_URL** and click copy icon

**Example looks like:**
```
postgresql://postgres:abc123xyz@monorail.proxy.rlwy.net:54321/railway
```

**Add to .env:**
```env
DATABASE_URL="postgresql://postgres:abc123xyz@monorail.proxy.rlwy.net:54321/railway"
```

**Cost**: FREE ($5/month credit included)

---

### 2. NEXTAUTH_SECRET ✅ ALREADY SET
**What it does**: Secures user sessions and JWT tokens
**Status**: ✅ Already configured in your .env!

You already have:
```env
NEXTAUTH_SECRET="supersecretkey123456789"
```

---

## 🎯 HIGHLY RECOMMENDED (AI Content Generation)

### 3. OPENAI_API_KEY ⭐⭐ IMPORTANT
**What it does**: Powers AI content generation (the main feature!)
**Without it**: Can't generate blog posts, social media content, ad copy, etc.

**How to get it (3 minutes):**
1. Go to: **https://platform.openai.com/**
2. Sign up or log in
3. Click your profile (top right) → "API keys"
4. Click "Create new secret key"
5. Name it "ContentPilot" 
6. Copy the key (starts with `sk-proj-...`)

**Add to .env:**
```env
OPENAI_API_KEY="sk-proj-your-key-here"
```

**Cost**: 
- First-time users get **$5 free credit**
- GPT-4 pricing: ~$0.03 per 1K tokens (very cheap for testing)
- Generating 100 blog posts ≈ $3-5

**⚠️ Important**: 
- Save the key immediately - OpenAI only shows it once!
- Keep it secret - never share or commit to GitHub

---

## 📊 Summary: What You Need Right Now

| API Key | Priority | Cost | Time to Setup | What Works Without It |
|---------|----------|------|---------------|----------------------|
| **DATABASE_URL** | 🚨 CRITICAL | FREE | 2 min | Nothing - app won't work |
| **NEXTAUTH_SECRET** | ✅ Done | FREE | - | Already set! |
| **OPENAI_API_KEY** | ⭐⭐ High | $5 free | 3 min | Login works, but no AI content |

---

## 🎯 Quick Start Path (5 Minutes Total)

### Step 1: Railway (2 min)
```
✅ Get DATABASE_URL from Railway
✅ Add to .env
✅ Run: npx prisma db push
```

### Step 2: OpenAI (3 min)
```
✅ Get API key from OpenAI
✅ Add to .env
✅ Test content generation
```

### Step 3: Test Everything
```bash
npm run dev
```

Then:
1. ✅ Create account
2. ✅ Log in
3. ✅ Generate AI content
4. ✅ Save to library

---

## 🔐 OPTIONAL (Add These Later)

### Google OAuth (For "Sign in with Google" button)
**Priority**: ⭐ Optional
**How to get**: 
1. Go to: https://console.cloud.google.com/
2. Create new project
3. Enable "Google+ API"
4. Create OAuth 2.0 credentials
5. Add authorized redirect: `http://localhost:3000/api/auth/callback/google`

**Add to .env:**
```env
GOOGLE_CLIENT_ID="your-client-id.apps.googleusercontent.com"
GOOGLE_CLIENT_SECRET="your-secret"
```

**Cost**: FREE
**Setup time**: 5-10 minutes

---

### Paddle (For Accepting Payments)
**Priority**: ⭐ Optional (only when you want to charge users)
**How to get**:
1. Go to: https://paddle.com/
2. Sign up for account
3. Use Sandbox mode for testing
4. Get Vendor ID and API Key from Settings

**Add to .env:**
```env
PADDLE_VENDOR_ID="12345"
PADDLE_API_KEY="your-api-key"
PADDLE_WEBHOOK_SECRET="your-webhook-secret"
PADDLE_ENVIRONMENT="sandbox"
```

**Cost**: FREE for testing, 5% + $0.50 per transaction in production
**Setup time**: 10-15 minutes

---

### Social Media APIs (For Auto-Posting)
**Priority**: ⭐ Optional (only when you want to publish to social media)

These are complex and time-consuming. Add them later when needed:

- **Twitter API**: https://developer.twitter.com/ (15-30 min setup)
- **Facebook API**: https://developers.facebook.com/ (20-40 min setup)
- **LinkedIn API**: https://www.linkedin.com/developers/ (15-30 min setup)
- **Instagram API**: Via Facebook Business (30-60 min setup)

**Note**: Social media APIs are NOT required for the core app to work!

---

## 🎯 Recommended Order

### Phase 1: Get App Working (Today - 5 minutes)
1. ✅ DATABASE_URL from Railway
2. ✅ OPENAI_API_KEY from OpenAI

**Result**: Full working app with AI content generation!

---

### Phase 2: Enhance Login (Later - 10 minutes)
3. Google OAuth credentials

**Result**: Users can sign in with Google!

---

### Phase 3: Monetization (When ready to launch - 15 minutes)
4. Paddle credentials

**Result**: Can accept payments!

---

### Phase 4: Social Features (Advanced - 1-2 hours)
5. Twitter, Facebook, LinkedIn, Instagram APIs

**Result**: Auto-posting to social media!

---

## 🔥 START HERE (Right Now):

### 1. Get Railway Database (2 min)
Go to: **https://railway.app/** → Get DATABASE_URL

### 2. Get OpenAI API Key (3 min)
Go to: **https://platform.openai.com/** → Get API key

### 3. Update .env File
```env
DATABASE_URL="your-railway-url"
OPENAI_API_KEY="sk-proj-your-key"
```

### 4. Initialize Database
```powershell
npx prisma db push
```

### 5. Start App
```powershell
npm run dev
```

---

## ✅ You're Done!

With just those 2 API keys (Railway + OpenAI), you have:
- ✅ Working login/signup
- ✅ AI content generation
- ✅ Content library
- ✅ Dashboard
- ✅ All core features

Everything else can be added later when you need it!

---

## 💰 Total Cost to Get Started

- Railway: **$0** (free tier)
- OpenAI: **$0-5** ($5 free credit)
- **Total: $0** to start testing!

---

## 📞 Quick Links

| Service | URL | What For |
|---------|-----|----------|
| Railway | https://railway.app/ | Database (REQUIRED) |
| OpenAI | https://platform.openai.com/ | AI Content (REQUIRED) |
| Google Cloud | https://console.cloud.google.com/ | OAuth (Optional) |
| Paddle | https://paddle.com/ | Payments (Optional) |

---

**Ready? Start with Railway and OpenAI - that's all you need right now!** 🚀
