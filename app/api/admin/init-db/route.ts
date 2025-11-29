import { NextRequest, NextResponse } from 'next/server'
import { exec } from 'child_process'
import { promisify } from 'util'

const execAsync = promisify(exec)

// This endpoint should be protected in production!
// For now, we'll use a simple secret key check

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { secret } = body

    // Simple protection - use NEXTAUTH_SECRET as the key
    const expectedSecret = process.env.NEXTAUTH_SECRET || 'supersecretkey123456789'
    
    console.log('Received secret:', secret ? 'PROVIDED' : 'MISSING')
    console.log('Expected secret:', expectedSecret ? 'SET' : 'NOT SET')
    
    if (secret !== expectedSecret) {
      return NextResponse.json(
        { 
          error: 'Unauthorized',
          hint: 'Secret does not match NEXTAUTH_SECRET'
        },
        { status: 401 }
      )
    }

    console.log('🚀 Starting database schema push...')

    // Run prisma db push
    const { stdout, stderr } = await execAsync('npx prisma db push --accept-data-loss --skip-generate')

    console.log('stdout:', stdout)
    if (stderr) console.log('stderr:', stderr)

    return NextResponse.json({
      success: true,
      message: 'Database schema pushed successfully!',
      output: stdout,
    })
  } catch (error: any) {
    console.error('Database initialization error:', error)
    return NextResponse.json(
      {
        success: false,
        error: error.message,
        details: error.stderr || error.stdout,
      },
      { status: 500 }
    )
  }
}

export async function GET() {
  return NextResponse.json({
    message: 'Database initialization endpoint. Use POST with { "secret": "your-nextauth-secret" } to initialize.',
  })
}
