import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/auth'
import { prisma } from '@/lib/prisma'
import { getPlatformService } from '@/lib/social/platforms'
import { z } from 'zod'

const scheduleSchema = z.object({
  contentId: z.string(),
  socialAccountIds: z.array(z.string()),
  scheduledFor: z.string(),
  customText: z.string().optional(),
})

export async function POST(request: NextRequest) {
  try {
    const session = await auth()

    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const validatedData = scheduleSchema.parse(body)

    // Get content
    const content = await prisma.content.findUnique({
      where: {
        id: validatedData.contentId,
        userId: session.user.id,
      },
    })

    if (!content) {
      return NextResponse.json({ error: 'Content not found' }, { status: 404 })
    }

    // Get social accounts
    const socialAccounts = await prisma.socialAccount.findMany({
      where: {
        id: { in: validatedData.socialAccountIds },
        userId: session.user.id,
        isActive: true,
      },
    })

    if (socialAccounts.length === 0) {
      return NextResponse.json(
        { error: 'No valid social accounts found' },
        { status: 400 }
      )
    }

    // Create scheduled posts
    const scheduledPosts = await Promise.all(
      socialAccounts.map((account: any) =>
        prisma.socialPost.create({
          data: {
            contentId: content.id,
            socialAccountId: account.id,
            platform: account.platform,
            postText: validatedData.customText || content.content,
            mediaUrls: [],
            status: 'SCHEDULED',
            scheduledFor: new Date(validatedData.scheduledFor),
          },
        })
      )
    )

    return NextResponse.json({
      message: 'Posts scheduled successfully',
      posts: scheduledPosts,
    })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validation error', details: error.issues },
        { status: 400 }
      )
    }

    console.error('Error scheduling posts:', error)
    return NextResponse.json(
      { error: 'Failed to schedule posts' },
      { status: 500 }
    )
  }
}

export async function GET(request: NextRequest) {
  try {
    const session = await auth()

    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const status = searchParams.get('status')
    const fromDate = searchParams.get('from')
    const toDate = searchParams.get('to')

    const where: any = {
      content: {
        userId: session.user.id,
      },
    }

    if (status) {
      where.status = status
    }

    if (fromDate && toDate) {
      where.scheduledFor = {
        gte: new Date(fromDate),
        lte: new Date(toDate),
      }
    }

    const posts = await prisma.socialPost.findMany({
      where,
      include: {
        content: {
          select: {
            id: true,
            title: true,
            type: true,
          },
        },
        socialAccount: {
          select: {
            id: true,
            platform: true,
            accountName: true,
          },
        },
      },
      orderBy: { scheduledFor: 'asc' },
    })

    return NextResponse.json({ posts })
  } catch (error) {
    console.error('Error fetching scheduled posts:', error)
    return NextResponse.json(
      { error: 'Failed to fetch scheduled posts' },
      { status: 500 }
    )
  }
}
