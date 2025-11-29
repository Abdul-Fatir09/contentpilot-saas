# 🚂 Railway Database Setup Guide

## Step 1: Create Railway Account & Database (2 minutes)

### 1. Go to Railway
Visit: **https://railway.app/**

### 2. Sign Up/Login
- Click "Login" or "Start a New Project"
- Sign in with GitHub (recommended) or email

### 3. Create New Project
- Click "New Project"
- Select "Provision PostgreSQL"
- Wait 30 seconds for database to provision

### 4. Get Your Database URL
1. Click on your PostgreSQL database
2. Go to the "Variables" tab
3. Find **DATABASE_URL**
4. Click the copy icon to copy the full URL

Your DATABASE_URL will look like this:
```
postgresql://postgres:XXXXXXXXXXXXX@monorail.proxy.rlwy.net:12345/railway
```

---

## Step 2: Update Your .env File

1. Open `.env` file in your project
2. Replace the DATABASE_URL line with your Railway URL:

```env
DATABASE_URL="postgresql://postgres:XXXXXXXXXXXXX@monorail.proxy.rlwy.net:12345/railway"
```

**IMPORTANT**: Keep the quotes and paste your actual Railway URL!

---

## Step 3: Push Database Schema

Open your terminal and run:

```powershell
npx prisma db push
```

This will:
- ✅ Connect to Railway database
- ✅ Create all tables (User, Content, SocialPost, etc.)
- ✅ Set up all relationships

You should see:
```
✔ Database synced successfully
```

---

## Step 4: Restart Development Server

```powershell
npm run dev
```

---

## ✅ Test Login

1. Go to: http://localhost:3000
2. Click "Sign In" or "Get Started"
3. Click "Create an account"
4. Fill in:
   - Name: Your Name
   - Email: test@example.com
   - Password: password123
5. Click "Sign Up"

**You should be redirected to the dashboard!** 🎉

---

## 🎯 What You Get with Railway Free Tier

- ✅ 512 MB RAM
- ✅ 1 GB Storage
- ✅ Good for development and testing
- ✅ Good for ~100-500 users
- ✅ **$5/month credit included FREE**
- ✅ Easy to upgrade later

---

## 🔧 Troubleshooting

### If you get "P1001: Can't reach database"
- Check your DATABASE_URL is copied correctly
- Make sure Railway database is running (green status)
- Check your internet connection

### If you get "Invalid credentials"
- Make sure you copied the FULL DATABASE_URL
- Don't modify the URL, use it exactly as Railway provides

### Need help?
The DATABASE_URL Railway gives you is ready to use - just copy and paste it!

---

## 📝 Next Steps After Login Works

1. ✅ Test user registration
2. ✅ Test login/logout
3. Add OpenAI API key to test content generation
4. Add Google OAuth credentials (optional)
5. Start using the platform!

---

**Once you've added your Railway DATABASE_URL to .env, come back and I'll help you with the next steps!**
