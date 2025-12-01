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

    const body = await request.json()
    const { contentId, socialAccountIds, postText } = body

    if (!contentId || !socialAccountIds || !Array.isArray(socialAccountIds)) {
      return NextResponse.json(
        { error: 'Invalid request data' },
        { status: 400 }
      )
    }

    // Get content
    const content = await prisma.content.findUnique({
      where: {
        id: contentId,
        userId: session.user.id,
      },
    })

    if (!content) {
      return NextResponse.json({ error: 'Content not found' }, { status: 404 })
    }

    // Get social accounts
    const socialAccounts = await prisma.socialAccount.findMany({
      where: {
        id: { in: socialAccountIds },
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

    // Post to each platform immediately
    const results = await Promise.allSettled(
      socialAccounts.map(async (account: any) => {
        // Create social post record
        const socialPost = await prisma.socialPost.create({
          data: {
            contentId: content.id,
            socialAccountId: account.id,
            platform: account.platform,
            postText: postText || content.content,
            mediaUrls: [],
            status: 'PUBLISHING',
            scheduledFor: new Date(),
          },
        })

        // Get platform service
        const platformService = getPlatformService(
          account.platform,
          account.accessToken,
          {
            refreshToken: account.refreshToken ?? undefined,
          }
        )

        // Publish immediately
        const result = await platformService.post({
          text: postText || content.content,
        })

        if (!result.success) {
          // Update status to failed
          await prisma.socialPost.update({
            where: { id: socialPost.id },
            data: {
              status: 'FAILED',
              error: result.error,
            },
          })
          throw new Error(result.error || 'Failed to post')
        }

        // Update status to published
        await prisma.socialPost.update({
          where: { id: socialPost.id },
          data: {
            status: 'PUBLISHED',
            publishedAt: new Date(),
            externalId: result.postId,
          },
        })

        return {
          platform: account.platform,
          accountName: account.accountName,
          postId: result.postId,
        }
      })
    )

    // Check results
    const successful = results.filter((r) => r.status === 'fulfilled')
    const failed = results.filter((r) => r.status === 'rejected')

    if (failed.length > 0 && successful.length === 0) {
      return NextResponse.json(
        {
          error: 'All posts failed',
          details: failed.map((r: any) => r.reason?.message),
        },
        { status: 500 }
      )
    }

    return NextResponse.json({
      message: `Posted to ${successful.length} account(s)`,
      successful: successful.length,
      failed: failed.length,
      results: successful.map((r: any) => r.value),
    })
  } catch (error) {
    console.error('Error posting now:', error)
    return NextResponse.json(
      { error: 'Failed to post content' },
      { status: 500 }
    )
  }
}
