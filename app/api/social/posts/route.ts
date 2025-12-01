import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/auth'
import { prisma } from '@/lib/prisma'

export async function GET(request: NextRequest) {
  try {
    const session = await auth()

    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const status = searchParams.get('status')

    // Build where clause
    const whereClause: any = {
      content: {
        userId: session.user.id,
      },
    }

    if (status) {
      whereClause.status = status
    }

    const posts = await prisma.socialPost.findMany({
      where: whereClause,
      include: {
        socialAccount: {
          select: {
            accountName: true,
            profileImage: true,
            platform: true,
          },
        },
        content: {
          select: {
            title: true,
          },
        },
      },
      orderBy: {
        scheduledFor: 'asc',
      },
    })

    return NextResponse.json({ posts })
  } catch (error) {
    console.error('Error fetching posts:', error)
    return NextResponse.json(
      { error: 'Failed to fetch posts' },
      { status: 500 }
    )
  }
}
