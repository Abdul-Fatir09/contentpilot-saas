-- Run these SQL commands in Supabase SQL Editor

-- 1. Add description column to folders table
ALTER TABLE "folders" ADD COLUMN IF NOT EXISTS "description" TEXT;

-- 2. Add onboarding fields to users table
ALTER TABLE "users" ADD COLUMN IF NOT EXISTS "bio" TEXT;
ALTER TABLE "users" ADD COLUMN IF NOT EXISTS "company" TEXT;
ALTER TABLE "users" ADD COLUMN IF NOT EXISTS "website" TEXT;
ALTER TABLE "users" ADD COLUMN IF NOT EXISTS "onboardingCompleted" BOOLEAN DEFAULT false;
ALTER TABLE "users" ADD COLUMN IF NOT EXISTS "onboardingSteps" JSONB DEFAULT '{"profile": false, "content": false, "schedule": false, "connect": false}';
