import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/auth'
import { prisma } from '@/lib/prisma'

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth()
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { id } = await params

    // Get the post to verify ownership and check if it's published
    const post = await prisma.socialPost.findFirst({
      where: {
        id,
        content: {
          userId: session.user.id,
        },
      },
      include: {
        socialAccount: true,
      },
    })

    if (!post) {
      return NextResponse.json({ error: 'Post not found' }, { status: 404 })
    }

    // Note: Deleting from social platforms requires different APIs
    // Twitter API v2 doesn't allow deleting tweets via Basic tier
    // This will only delete from our database
    
    if (post.status === 'PUBLISHED' && post.platformPostId) {
      // TODO: Implement platform-specific deletion
      // For now, just mark as deleted in our system
      console.log(`Published post ${post.platformPostId} on ${post.platform} cannot be deleted via API`)
    }

    // Delete the post from database
    await prisma.socialPost.delete({
      where: { id },
    })

    return NextResponse.json({ 
      message: 'Post deleted from dashboard',
      warning: post.status === 'PUBLISHED' 
        ? 'This post has been removed from your dashboard but still exists on ' + post.platform + '. To delete it from the platform, please do so manually from ' + post.platform + '.' 
        : undefined
    })
  } catch (error) {
    console.error('Error deleting post:', error)
    return NextResponse.json(
      { error: 'Failed to delete post' },
      { status: 500 }
    )
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth()
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { id } = await params
    const body = await request.json()
    const { postText, scheduledFor } = body

    // Get the post to verify ownership
    const post = await prisma.socialPost.findFirst({
      where: {
        id,
        content: {
          userId: session.user.id,
        },
      },
    })

    if (!post) {
      return NextResponse.json({ error: 'Post not found' }, { status: 404 })
    }

    if (post.status === 'PUBLISHED') {
      return NextResponse.json(
        { error: 'Cannot edit published posts. Published posts cannot be modified on most platforms.' },
        { status: 400 }
      )
    }

    // Update the post
    const updatedPost = await prisma.socialPost.update({
      where: { id },
      data: {
        ...(postText && { postText }),
        ...(scheduledFor && { scheduledFor: new Date(scheduledFor) }),
      },
    })

    return NextResponse.json(updatedPost)
  } catch (error) {
    console.error('Error updating post:', error)
    return NextResponse.json(
      { error: 'Failed to update post' },
      { status: 500 }
    )
  }
}
