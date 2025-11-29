# 🚀 Vercel Deployment Guide for ContentPilot

## Prerequisites
- ✅ GitHub account
- ✅ Vercel account (free - sign up at https://vercel.com)
- ✅ Supabase database with fresh connection string

---

## 📋 Step-by-Step Deployment

### STEP 1: Push Code to GitHub

1. **Initialize Git (if not already done):**
```powershell
git init
git add .
git commit -m "Initial commit - ContentPilot SaaS"
```

2. **Create GitHub Repository:**
   - Go to https://github.com/new
   - Name: `contentpilot-saas` (or your preferred name)
   - Make it **Private** (recommended)
   - Don't initialize with README
   - Click "Create repository"

3. **Push to GitHub:**
```powershell
git remote add origin https://github.com/YOUR_USERNAME/contentpilot-saas.git
git branch -M main
git push -u origin main
```

---

### STEP 2: Deploy to Vercel

1. **Go to Vercel:**
   - Visit https://vercel.com/new
   - Click "Add New..." → "Project"
   - Sign in with GitHub if needed

2. **Import Repository:**
   - Select your `contentpilot-saas` repository
   - Click "Import"

3. **Configure Project:**
   - Framework Preset: **Next.js** (auto-detected)
   - Root Directory: `./`
   - Build Command: Leave default or use: `prisma generate && next build`
   - Output Directory: `.next`
   - Install Command: `npm install`

4. **Add Environment Variables:**

Click "Environment Variables" and add these one by one:

**Required:**
```env
DATABASE_URL=your-supabase-connection-string-here
NEXTAUTH_SECRET=supersecretkey123456789changethisinproduction
NEXTAUTH_URL=https://your-project-name.vercel.app
```

**Optional (for Google OAuth):**
```env
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
```

**Optional (for AI features):**
```env
OPENAI_API_KEY=your-openai-api-key
```

**Optional (for Paddle payments):**
```env
PADDLE_VENDOR_ID=your-paddle-vendor-id
PADDLE_API_KEY=your-paddle-api-key
PADDLE_WEBHOOK_SECRET=your-paddle-webhook-secret
PADDLE_ENVIRONMENT=sandbox
```

5. **Deploy:**
   - Click "Deploy"
   - Wait 2-3 minutes for build to complete
   - You'll get a URL like: `https://contentpilot-saas.vercel.app`

---

### STEP 3: Update NEXTAUTH_URL

After first deployment:

1. Copy your Vercel URL (e.g., `https://contentpilot-saas.vercel.app`)
2. In Vercel dashboard → Settings → Environment Variables
3. Update `NEXTAUTH_URL` to your actual Vercel URL
4. Redeploy: Go to Deployments → Click "..." → "Redeploy"

---

### STEP 4: Update Google OAuth (if using)

1. Go to Google Cloud Console: https://console.cloud.google.com
2. Select your project → APIs & Services → Credentials
3. Click on your OAuth 2.0 Client ID
4. Add authorized redirect URI:
   ```
   https://your-project-name.vercel.app/api/auth/callback/google
   ```
5. Save

---

### STEP 5: Update Paddle Webhook (if using payments)

1. Go to Paddle Dashboard: https://vendors.paddle.com/webhooks
2. Add webhook endpoint:
   ```
   https://your-project-name.vercel.app/api/webhooks/paddle
   ```

---

## 🔧 Troubleshooting

### Build Fails with Prisma Error
- Make sure `DATABASE_URL` is set in Vercel environment variables
- Build command should include: `prisma generate`

### Database Connection Issues
- Use Supabase **Transaction pooling** connection string
- Format: `postgresql://postgres:password@host:6543/postgres?pgbouncer=true&connection_limit=1`

### NextAuth Errors
- Verify `NEXTAUTH_URL` matches your Vercel domain
- Ensure `NEXTAUTH_SECRET` is set (generate with `openssl rand -base64 32`)

---

## ✅ Post-Deployment Checklist

- [ ] Visit your Vercel URL and verify landing page loads
- [ ] Test user signup/login
- [ ] Test content generation (if OpenAI key is set)
- [ ] Configure custom domain (optional)
- [ ] Set up automatic deployments on push

---

## 🔄 Auto-Deployments

Every time you push to GitHub `main` branch, Vercel will automatically:
1. Pull latest code
2. Install dependencies
3. Run build
4. Deploy to production

To deploy manually:
```powershell
git add .
git commit -m "Update feature"
git push
```

---

## 🌐 Custom Domain (Optional)

1. Go to Vercel project → Settings → Domains
2. Add your domain (e.g., `contentpilot.com`)
3. Follow DNS configuration instructions
4. Update `NEXTAUTH_URL` to your custom domain

---

## 📊 Monitoring

- **Analytics**: Vercel dashboard shows visitor stats
- **Logs**: Vercel → Project → Runtime Logs
- **Database**: Supabase dashboard for DB queries

---

## 🔐 Security Notes

- Never commit `.env` file to GitHub (already in .gitignore)
- Use strong `NEXTAUTH_SECRET` in production
- Enable Supabase Row Level Security (RLS) for extra protection
- Use environment-specific API keys (dev vs production)

---

Good luck with your deployment! 🚀
