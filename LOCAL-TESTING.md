# 🔧 Local Testing Setup - ContentPilot

## Quick Start (After Supabase Connection)

### 1. Update Database Connection

Open `.env` file and update line 6 with your fresh Supabase connection string:

```env
# Get this from: Supabase Dashboard → Settings → Database → Connection String
# Use "Transaction" mode for better Prisma compatibility
DATABASE_URL="postgresql://postgres.xxxxx:[PASSWORD]@aws-0-us-east-1.pooler.supabase.com:6543/postgres?pgbouncer=true&connection_limit=1"
```

### 2. Initialize Database

Run these commands in PowerShell:

```powershell
# Generate Prisma Client
npx prisma generate

# Create all database tables
npx prisma db push

# (Optional) Open Prisma Studio to view database
npx prisma studio
```

### 3. Start Development Server

```powershell
npm run dev
```

Visit: http://localhost:3000

### 4. Test Authentication

1. Click "Get Started" or "Sign Up"
2. Create account with:
   - Name: Test User
   - Email: test@example.com
   - Password: password123
3. You should be redirected to dashboard

### 5. Test AI Content Generation

1. Go to Dashboard → "Create Content"
2. Fill in the form:
   - Content Type: Blog Post
   - Topic: "10 Benefits of AI in Marketing"
   - Tone: Professional
   - Length: Medium
3. Click "Generate with AI"

**Note:** You need OpenAI API key for this to work. Get one at https://platform.openai.com

---

## Common Issues & Solutions

### ❌ "Can't reach database server"

**Solution:** Your Supabase connection string is wrong or database is paused.

1. Go to Supabase Dashboard
2. Check if project is active (not paused)
3. Get fresh connection string from Settings → Database
4. Update `.env` file
5. Restart server: `Ctrl+C` then `npm run dev`

### ❌ "P3009: migrate encountered errors"

**Solution:** Use `prisma db push` instead of `prisma migrate`

```powershell
npx prisma db push --accept-data-loss
```

### ❌ "OpenAI API error"

**Solution:** Add your OpenAI API key to `.env`:

1. Get key from https://platform.openai.com/api-keys
2. Update line 18 in `.env`:
   ```env
   OPENAI_API_KEY="sk-proj-your-actual-key-here"
   ```
3. Restart server

### ❌ "Invalid session"

**Solution:** Clear browser cookies or use incognito mode

---

## Testing Checklist

- [ ] ✅ Server starts without errors
- [ ] ✅ Landing page loads
- [ ] ✅ Can create account
- [ ] ✅ Can login
- [ ] ✅ Dashboard shows
- [ ] ✅ Can generate content (with OpenAI key)
- [ ] ✅ Content saves to library
- [ ] ✅ Can view content library
- [ ] ✅ Can create folders
- [ ] ⏸️ Social media publish (needs social API keys)
- [ ] ⏸️ Payment flow (needs Paddle setup)

---

## Next Steps

Once everything works locally:

1. ✅ Push to GitHub
2. ✅ Deploy to Vercel
3. ✅ Update NEXTAUTH_URL to Vercel domain
4. ✅ Test production deployment

See `VERCEL-DEPLOYMENT.md` for deployment instructions.
