import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/auth'
import { prisma } from '@/lib/prisma'

export async function GET(request: NextRequest) {
  try {
    const session = await auth()

    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Get all social posts for this user
    const socialPosts = await prisma.socialPost.findMany({
      where: {
        content: {
          userId: session.user.id,
        },
      },
      include: {
        content: {
          select: {
            id: true,
            title: true,
          },
        },
      },
    })

    // Calculate statistics
    const totalPosts = socialPosts.length
    const publishedPosts = socialPosts.filter(p => p.status === 'PUBLISHED').length
    const scheduledPosts = socialPosts.filter(p => p.status === 'SCHEDULED').length
    const failedPosts = socialPosts.filter(p => p.status === 'FAILED').length

    // Platform breakdown
    const platformBreakdown: Record<string, number> = {}
    socialPosts.forEach(post => {
      platformBreakdown[post.platform] = (platformBreakdown[post.platform] || 0) + 1
    })

    // Top performing content (by number of posts)
    const contentPostCounts: Record<string, { id: string; title: string; count: number }> = {}
    socialPosts.forEach(post => {
      if (!contentPostCounts[post.contentId]) {
        contentPostCounts[post.contentId] = {
          id: post.content.id,
          title: post.content.title,
          count: 0,
        }
      }
      contentPostCounts[post.contentId].count++
    })

    const topContent = Object.values(contentPostCounts)
      .sort((a, b) => b.count - a.count)
      .slice(0, 5)
      .map(item => ({
        id: item.id,
        title: item.title,
        postCount: item.count,
      }))

    return NextResponse.json({
      totalPosts,
      publishedPosts,
      scheduledPosts,
      failedPosts,
      platformBreakdown,
      topContent,
    })
  } catch (error) {
    console.error('Error fetching analytics:', error)
    return NextResponse.json(
      { error: 'Failed to fetch analytics' },
      { status: 500 }
    )
  }
}
