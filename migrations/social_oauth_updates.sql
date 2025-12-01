-- Add TikTok to Platform enum and update SocialAccount table

-- Add TIKTOK to platform enum
ALTER TYPE "Platform" ADD VALUE IF NOT EXISTS 'TIKTOK';

-- Add new columns to social_accounts table
ALTER TABLE "social_accounts" 
  ADD COLUMN IF NOT EXISTS "accountId" TEXT,
  ADD COLUMN IF NOT EXISTS "profileImage" TEXT,
  ADD COLUMN IF NOT EXISTS "tokenSecret" TEXT,
  ADD COLUMN IF NOT EXISTS "metadata" JSONB;

-- Create index for faster lookups
CREATE INDEX IF NOT EXISTS "social_accounts_user_platform_idx" ON "social_accounts"("userId", "platform");
CREATE INDEX IF NOT EXISTS "social_accounts_is_active_idx" ON "social_accounts"("isActive");

-- Update any existing records to set isActive to true if NULL
UPDATE "social_accounts" SET "isActive" = true WHERE "isActive" IS NULL;
