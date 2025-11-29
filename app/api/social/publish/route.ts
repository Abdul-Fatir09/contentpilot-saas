import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/auth'
import { prisma } from '@/lib/prisma'
import { getPlatformService } from '@/lib/social/platforms'

export async function POST(request: NextRequest) {
  try {
    const session = await auth()

    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const postId = searchParams.get('id')

    if (!postId) {
      return NextResponse.json({ error: 'Post ID required' }, { status: 400 })
    }

    // Get scheduled post with account details
    const scheduledPost = await prisma.socialPost.findFirst({
      where: {
        id: postId,
        content: {
          userId: session.user.id,
        },
      },
      include: {
        socialAccount: true,
      },
    })

    if (!scheduledPost) {
      return NextResponse.json({ error: 'Post not found' }, { status: 404 })
    }

    if (scheduledPost.status === 'PUBLISHED') {
      return NextResponse.json({ error: 'Post already published' }, { status: 400 })
    }

    // Get platform service
    const platformService = getPlatformService(
      scheduledPost.platform,
      scheduledPost.socialAccount.accessToken,
      {
        refreshToken: scheduledPost.socialAccount.refreshToken ?? undefined,
      }
    )

    // Publish the post
    const result = await platformService.post({
      text: scheduledPost.postText,
      mediaUrls: scheduledPost.mediaUrls,
    })

    if (!result.success) {
      // Update post with error
      await prisma.socialPost.update({
        where: { id: postId },
        data: {
          status: 'FAILED',
          errorMessage: result.error,
        },
      })

      return NextResponse.json(
        { error: result.error },
        { status: 500 }
      )
    }

    // Update post as published
    const updatedPost = await prisma.socialPost.update({
      where: { id: postId },
      data: {
        status: 'PUBLISHED',
        publishedAt: new Date(),
        platformPostId: result.postId,
      },
    })

    return NextResponse.json({
      message: 'Post published successfully',
      post: updatedPost,
    })
  } catch (error) {
    console.error('Error publishing post:', error)
    return NextResponse.json(
      { error: 'Failed to publish post' },
      { status: 500 }
    )
  }
}
