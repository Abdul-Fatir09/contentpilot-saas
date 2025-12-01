import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/auth'
import { getOAuthProvider } from '@/lib/social/oauth'
import crypto from 'crypto'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ platform: string }> }
) {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { platform } = await params
    const platformUpper = platform.toUpperCase()

    // Validate platform
    const validPlatforms = ['TWITTER', 'FACEBOOK', 'LINKEDIN', 'INSTAGRAM', 'TIKTOK']
    if (!validPlatforms.includes(platformUpper)) {
      return NextResponse.json({ error: 'Invalid platform' }, { status: 400 })
    }

    // Generate state for CSRF protection
    const state = crypto.randomBytes(32).toString('hex')
    
    // Get OAuth provider and authorization URL
    const baseUrl = process.env.NEXTAUTH_URL || 'http://localhost:3000'
    const redirectUri = `${baseUrl}/api/social/callback/${platform}`
    
    const oauthProvider = getOAuthProvider(platform, redirectUri)
    const authUrl = oauthProvider.getAuthorizationUrl(state)

    // Store state and user ID in cookies for callback verification
    const response = NextResponse.redirect(authUrl)
    
    response.cookies.set('oauth_state', state, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 600, // 10 minutes
      path: '/',
    })
    
    response.cookies.set('oauth_user_id', session.user.id, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 600,
      path: '/',
    })

    return response
  } catch (error) {
    console.error('OAuth connect error:', error)
    return NextResponse.redirect(
      `${process.env.NEXTAUTH_URL}/dashboard/social?error=connection_failed`
    )
  }
}
