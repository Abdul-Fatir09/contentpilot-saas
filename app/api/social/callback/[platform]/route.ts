import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getOAuthProvider } from '@/lib/social/oauth'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ platform: string }> }
) {
  try {
    const { searchParams } = new URL(request.url)
    const code = searchParams.get('code')
    const state = searchParams.get('state')
    const error = searchParams.get('error')

    // Check for OAuth errors
    if (error) {
      return NextResponse.redirect(
        `${process.env.NEXTAUTH_URL}/dashboard/social?error=${encodeURIComponent(error)}`
      )
    }

    if (!code || !state) {
      return NextResponse.redirect(
        `${process.env.NEXTAUTH_URL}/dashboard/social?error=missing_parameters`
      )
    }

    // Verify state (CSRF protection)
    const storedState = request.cookies.get('oauth_state')?.value
    const userId = request.cookies.get('oauth_user_id')?.value

    if (!storedState || storedState !== state || !userId) {
      return NextResponse.redirect(
        `${process.env.NEXTAUTH_URL}/dashboard/social?error=invalid_state`
      )
    }

    const { platform } = await params
    const platformUpper = platform.toUpperCase() as 'TWITTER' | 'FACEBOOK' | 'LINKEDIN' | 'INSTAGRAM' | 'TIKTOK'

    // Exchange code for token
    const baseUrl = process.env.NEXTAUTH_URL || 'http://localhost:3000'
    const redirectUri = `${baseUrl}/api/social/callback/${platform}`
    
    const oauthProvider = getOAuthProvider(platform, redirectUri)
    
    // For Twitter, we need the code verifier (simplified - in production, store this securely)
    const codeVerifier = request.cookies.get('oauth_code_verifier')?.value || ''
    
    let tokenData
    if (platform === 'twitter') {
      tokenData = await (oauthProvider as any).exchangeCodeForToken(code, codeVerifier)
    } else {
      tokenData = await (oauthProvider as any).exchangeCodeForToken(code)
    }

    // Get user info from the platform
    let userInfo: any = {}
    let accountName = 'Unknown'
    let accountId = ''
    let profileImage = ''

    if (platform === 'facebook' || platform === 'instagram') {
      userInfo = await (oauthProvider as any).getUserInfo(tokenData.access_token)
      accountName = userInfo.name || userInfo.username || 'Facebook User'
      accountId = userInfo.id
      profileImage = userInfo.picture?.data?.url || ''
    } else if (platform === 'linkedin') {
      userInfo = await (oauthProvider as any).getUserInfo(tokenData.access_token)
      accountName = userInfo.name || 'LinkedIn User'
      accountId = userInfo.sub
      profileImage = userInfo.picture || ''
    } else if (platform === 'tiktok') {
      userInfo = await (oauthProvider as any).getUserInfo(tokenData.access_token)
      accountName = userInfo.display_name || 'TikTok User'
      accountId = userInfo.open_id
      profileImage = userInfo.avatar_url || ''
    } else if (platform === 'twitter') {
      // Twitter v2 API
      const response = await fetch('https://api.twitter.com/2/users/me', {
        headers: {
          Authorization: `Bearer ${tokenData.access_token}`,
        },
      })
      const data = await response.json()
      accountName = data.data?.username || 'Twitter User'
      accountId = data.data?.id || ''
      profileImage = data.data?.profile_image_url || ''
    }

    // Calculate expiration time
    const expiresAt = tokenData.expires_in
      ? new Date(Date.now() + tokenData.expires_in * 1000)
      : null

    // Save or update social account in database
    await prisma.socialAccount.upsert({
      where: {
        userId_platform_accountName: {
          userId,
          platform: platformUpper,
          accountName,
        },
      },
      update: {
        accessToken: tokenData.access_token,
        refreshToken: tokenData.refresh_token,
        expiresAt,
        accountId,
        profileImage,
        isActive: true,
        metadata: userInfo,
      },
      create: {
        userId,
        platform: platformUpper,
        accountName,
        accountId,
        profileImage,
        accessToken: tokenData.access_token,
        refreshToken: tokenData.refresh_token,
        expiresAt,
        isActive: true,
        metadata: userInfo,
      },
    })

    // Clear OAuth cookies
    const response = NextResponse.redirect(
      `${process.env.NEXTAUTH_URL}/dashboard/social?success=${platform}`
    )
    response.cookies.delete('oauth_state')
    response.cookies.delete('oauth_user_id')
    response.cookies.delete('oauth_code_verifier')

    return response
  } catch (error) {
    console.error('OAuth callback error:', error)
    return NextResponse.redirect(
      `${process.env.NEXTAUTH_URL}/dashboard/social?error=connection_failed`
    )
  }
}
