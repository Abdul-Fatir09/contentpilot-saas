#!/bin/bash
# Script to push Prisma schema to database

echo "🚀 Pushing Prisma schema to database..."

npx prisma db push --accept-data-loss

if [ $? -eq 0 ]; then
  echo "✅ Schema pushed successfully!"
  echo "🔄 Running database connection test..."
  npx tsx scripts/init-db.ts
else
  echo "❌ Schema push failed!"
  exit 1
fi
