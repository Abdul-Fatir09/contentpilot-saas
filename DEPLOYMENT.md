# Deployment Guide

## Required Environment Variables

You must set these environment variables in your Vercel project settings:

### 1. Database (Required)

**Important:** You need TWO database URLs from Supabase:

```bash
DATABASE_URL="postgresql://postgres.xxx:[PASSWORD]@aws-0-us-east-1.pooler.supabase.com:6543/postgres?pgbouncer=true"
DIRECT_URL="postgresql://postgres.xxx:[PASSWORD]@aws-0-us-east-1.compute.amazonaws.com:5432/postgres"
```

**How to get these:**
1. Go to Supabase Project → Settings → Database
2. **Connection String** section:
   - **Transaction mode** → Copy as `DATABASE_URL`
   - **Session mode** → Copy as `DIRECT_URL`
3. Replace `[YOUR-PASSWORD]` with your actual database password

**Why both URLs?**
- `DATABASE_URL`: Used for queries (connection pooling via pgBouncer)
- `DIRECT_URL`: Used for migrations and schema operations

### 2. Authentication (Required)
```bash
NEXTAUTH_SECRET="generate-random-secret"
NEXTAUTH_URL="https://your-domain.vercel.app"
```
Generate `NEXTAUTH_SECRET` with:
```bash
openssl rand -base64 32
```

### 3. AI Content Generation (Required)
```bash
GEMINI_API_KEY="your-gemini-api-key"
```
Get this from: https://aistudio.google.com/apikey

### 4. Google OAuth (Optional)
```bash
GOOGLE_CLIENT_ID="your-client-id"
GOOGLE_CLIENT_SECRET="your-client-secret"
```
Get these from: https://console.cloud.google.com/apis/credentials

### 5. Paddle Billing (Optional)
```bash
PADDLE_VENDOR_ID="your-vendor-id"
PADDLE_API_KEY="your-api-key"
PADDLE_ENVIRONMENT="sandbox"
PADDLE_WEBHOOK_SECRET="your-webhook-secret"
```

## How to Set Environment Variables in Vercel

1. Go to your Vercel project dashboard
2. Click on **Settings**
3. Click on **Environment Variables**
4. Add each variable with its value
5. Select which environments (Production, Preview, Development)
6. Click **Save**
7. **Redeploy** your project for changes to take effect

## Troubleshooting

### Database Connection Errors
- Verify `DATABASE_URL` is correct and uses connection pooling
- Check Supabase database is running and accessible
- Ensure IP allowlist in Supabase allows Vercel's IPs (or set to allow all)

### Authentication Errors
- Verify `NEXTAUTH_SECRET` is set and matches format
- Ensure `NEXTAUTH_URL` matches your actual deployment URL
- For Google OAuth, verify redirect URIs in Google Console

### Build Errors
- Check Vercel build logs for specific error messages
- Ensure all required environment variables are set
- Verify Prisma schema can connect to database during build
