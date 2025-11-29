import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/auth'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'

const socialAccountSchema = z.object({
  platform: z.enum(['TWITTER', 'FACEBOOK', 'LINKEDIN', 'INSTAGRAM']),
  accountName: z.string(),
  accessToken: z.string(),
  refreshToken: z.string().optional(),
  expiresAt: z.string().optional(),
})

export async function GET() {
  try {
    const session = await auth()

    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const accounts = await prisma.socialAccount.findMany({
      where: { userId: session.user.id },
      select: {
        id: true,
        platform: true,
        accountName: true,
        isActive: true,
        createdAt: true,
      },
    })

    return NextResponse.json({ accounts })
  } catch (error) {
    console.error('Error fetching social accounts:', error)
    return NextResponse.json(
      { error: 'Failed to fetch social accounts' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await auth()

    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const validatedData = socialAccountSchema.parse(body)

    // Check subscription tier for platform limits
    const subscription = await prisma.subscription.findUnique({
      where: { userId: session.user.id },
    })

    if (!subscription) {
      return NextResponse.json({ error: 'No subscription found' }, { status: 403 })
    }

    const platformCount = await prisma.socialAccount.count({
      where: { userId: session.user.id, isActive: true },
    })

    const platformLimits: Record<string, number> = {
      FREE: 1,
      STARTER: 3,
      PRO: 10,
      AGENCY: 999,
    }

    if (platformCount >= platformLimits[subscription.tier]) {
      return NextResponse.json(
        { error: 'Platform limit reached for your subscription tier' },
        { status: 403 }
      )
    }

    const account = await prisma.socialAccount.create({
      data: {
        userId: session.user.id,
        platform: validatedData.platform,
        accountName: validatedData.accountName,
        accessToken: validatedData.accessToken,
        refreshToken: validatedData.refreshToken,
        expiresAt: validatedData.expiresAt ? new Date(validatedData.expiresAt) : null,
      },
    })

    return NextResponse.json({ account })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validation error', details: error.issues },
        { status: 400 }
      )
    }

    console.error('Error creating social account:', error)
    return NextResponse.json(
      { error: 'Failed to create social account' },
      { status: 500 }
    )
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const session = await auth()

    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const accountId = searchParams.get('id')

    if (!accountId) {
      return NextResponse.json({ error: 'Account ID required' }, { status: 400 })
    }

    await prisma.socialAccount.delete({
      where: {
        id: accountId,
        userId: session.user.id,
      },
    })

    return NextResponse.json({ message: 'Account deleted successfully' })
  } catch (error) {
    console.error('Error deleting social account:', error)
    return NextResponse.json(
      { error: 'Failed to delete social account' },
      { status: 500 }
    )
  }
}
