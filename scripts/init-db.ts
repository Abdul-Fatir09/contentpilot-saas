import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('🔍 Testing database connection...')
  
  try {
    await prisma.$connect()
    console.log('✅ Database connected successfully!')
    
    // Test query
    const userCount = await prisma.user.count()
    console.log(`📊 Current user count: ${userCount}`)
    
    console.log('🎉 Database is ready!')
  } catch (error) {
    console.error('❌ Database connection failed:', error)
    process.exit(1)
  } finally {
    await prisma.$disconnect()
  }
}

main()
