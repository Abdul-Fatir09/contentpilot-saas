# Database Migration Required

## Run this SQL in Supabase SQL Editor:

```sql
ALTER TABLE "folders" ADD COLUMN IF NOT EXISTS "description" TEXT;
```

## Steps:
1. Go to Supabase Dashboard → SQL Editor
2. Paste the SQL above
3. Click "Run"
4. Redeploy on Vercel

This adds the `description` column to the folders table.
