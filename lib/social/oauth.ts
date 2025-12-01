import crypto from 'crypto'

interface OAuthConfig {
  clientId: string
  clientSecret: string
  redirectUri: string
  scopes: string[]
}

interface OAuthTokenResponse {
  access_token: string
  refresh_token?: string
  expires_in?: number
  token_type?: string
}

// Twitter OAuth 2.0
export class TwitterOAuth {
  private config: OAuthConfig

  constructor(redirectUri: string) {
    this.config = {
      clientId: process.env.TWITTER_CLIENT_ID || '',
      clientSecret: process.env.TWITTER_CLIENT_SECRET || '',
      redirectUri,
      scopes: ['tweet.read', 'tweet.write', 'users.read', 'offline.access']
    }
  }

  getAuthorizationUrl(state: string): string {
    const codeVerifier = this.generateCodeVerifier()
    const codeChallenge = this.generateCodeChallenge(codeVerifier)
    
    // Store codeVerifier in session or database temporarily
    const params = new URLSearchParams({
      response_type: 'code',
      client_id: this.config.clientId,
      redirect_uri: this.config.redirectUri,
      scope: this.config.scopes.join(' '),
      state,
      code_challenge: codeChallenge,
      code_challenge_method: 'S256'
    })

    return `https://twitter.com/i/oauth2/authorize?${params.toString()}`
  }

  async exchangeCodeForToken(code: string, codeVerifier: string): Promise<OAuthTokenResponse> {
    const response = await fetch('https://api.twitter.com/2/oauth2/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        grant_type: 'authorization_code',
        code,
        redirect_uri: this.config.redirectUri,
        client_id: this.config.clientId,
        code_verifier: codeVerifier,
      }),
    })

    if (!response.ok) {
      throw new Error('Failed to exchange code for token')
    }

    return response.json()
  }

  private generateCodeVerifier(): string {
    return crypto.randomBytes(32).toString('base64url')
  }

  private generateCodeChallenge(verifier: string): string {
    return crypto.createHash('sha256').update(verifier).digest('base64url')
  }
}

// Facebook OAuth
export class FacebookOAuth {
  private config: OAuthConfig

  constructor(redirectUri: string) {
    this.config = {
      clientId: process.env.FACEBOOK_APP_ID || '',
      clientSecret: process.env.FACEBOOK_APP_SECRET || '',
      redirectUri,
      scopes: ['pages_manage_posts', 'pages_read_engagement', 'public_profile']
    }
  }

  getAuthorizationUrl(state: string): string {
    const params = new URLSearchParams({
      client_id: this.config.clientId,
      redirect_uri: this.config.redirectUri,
      state,
      scope: this.config.scopes.join(','),
      response_type: 'code'
    })

    return `https://www.facebook.com/v18.0/dialog/oauth?${params.toString()}`
  }

  async exchangeCodeForToken(code: string): Promise<OAuthTokenResponse> {
    const params = new URLSearchParams({
      client_id: this.config.clientId,
      client_secret: this.config.clientSecret,
      redirect_uri: this.config.redirectUri,
      code,
    })

    const response = await fetch(
      `https://graph.facebook.com/v18.0/oauth/access_token?${params.toString()}`
    )

    if (!response.ok) {
      throw new Error('Failed to exchange code for token')
    }

    return response.json()
  }

  async getUserInfo(accessToken: string) {
    const response = await fetch(
      `https://graph.facebook.com/me?fields=id,name,picture&access_token=${accessToken}`
    )
    return response.json()
  }
}

// LinkedIn OAuth
export class LinkedInOAuth {
  private config: OAuthConfig

  constructor(redirectUri: string) {
    this.config = {
      clientId: process.env.LINKEDIN_CLIENT_ID || '',
      clientSecret: process.env.LINKEDIN_CLIENT_SECRET || '',
      redirectUri,
      scopes: ['openid', 'profile', 'w_member_social']
    }
  }

  getAuthorizationUrl(state: string): string {
    const params = new URLSearchParams({
      response_type: 'code',
      client_id: this.config.clientId,
      redirect_uri: this.config.redirectUri,
      state,
      scope: this.config.scopes.join(' ')
    })

    return `https://www.linkedin.com/oauth/v2/authorization?${params.toString()}`
  }

  async exchangeCodeForToken(code: string): Promise<OAuthTokenResponse> {
    const response = await fetch('https://www.linkedin.com/oauth/v2/accessToken', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        grant_type: 'authorization_code',
        code,
        redirect_uri: this.config.redirectUri,
        client_id: this.config.clientId,
        client_secret: this.config.clientSecret,
      }),
    })

    if (!response.ok) {
      throw new Error('Failed to exchange code for token')
    }

    return response.json()
  }

  async getUserInfo(accessToken: string) {
    const response = await fetch('https://api.linkedin.com/v2/userinfo', {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    })
    return response.json()
  }
}

// Instagram OAuth (via Facebook)
export class InstagramOAuth extends FacebookOAuth {
  constructor(redirectUri: string) {
    super(redirectUri)
    this.config.scopes = [
      'instagram_basic',
      'instagram_content_publish',
      'pages_read_engagement',
      'pages_show_list'
    ]
  }

  async getInstagramAccount(accessToken: string, facebookUserId: string) {
    const response = await fetch(
      `https://graph.facebook.com/v18.0/${facebookUserId}/accounts?access_token=${accessToken}`
    )
    const data = await response.json()
    
    // Get Instagram business account connected to the page
    if (data.data && data.data[0]) {
      const pageId = data.data[0].id
      const igResponse = await fetch(
        `https://graph.facebook.com/v18.0/${pageId}?fields=instagram_business_account&access_token=${accessToken}`
      )
      return igResponse.json()
    }
    
    return null
  }
}

// TikTok OAuth
export class TikTokOAuth {
  private config: OAuthConfig

  constructor(redirectUri: string) {
    this.config = {
      clientId: process.env.TIKTOK_CLIENT_KEY || '',
      clientSecret: process.env.TIKTOK_CLIENT_SECRET || '',
      redirectUri,
      scopes: ['user.info.basic', 'video.upload', 'video.publish']
    }
  }

  getAuthorizationUrl(state: string): string {
    const params = new URLSearchParams({
      client_key: this.config.clientId,
      redirect_uri: this.config.redirectUri,
      state,
      scope: this.config.scopes.join(','),
      response_type: 'code'
    })

    return `https://www.tiktok.com/v2/auth/authorize?${params.toString()}`
  }

  async exchangeCodeForToken(code: string): Promise<OAuthTokenResponse> {
    const response = await fetch('https://open.tiktokapis.com/v2/oauth/token/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        client_key: this.config.clientId,
        client_secret: this.config.clientSecret,
        code,
        grant_type: 'authorization_code',
        redirect_uri: this.config.redirectUri,
      }),
    })

    if (!response.ok) {
      throw new Error('Failed to exchange code for token')
    }

    const data = await response.json()
    return {
      access_token: data.data.access_token,
      refresh_token: data.data.refresh_token,
      expires_in: data.data.expires_in,
    }
  }

  async getUserInfo(accessToken: string) {
    const response = await fetch('https://open.tiktokapis.com/v2/user/info/', {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    })
    const data = await response.json()
    return data.data.user
  }
}

// Factory function to get OAuth provider
export function getOAuthProvider(platform: string, redirectUri: string) {
  switch (platform.toLowerCase()) {
    case 'twitter':
      return new TwitterOAuth(redirectUri)
    case 'facebook':
      return new FacebookOAuth(redirectUri)
    case 'linkedin':
      return new LinkedInOAuth(redirectUri)
    case 'instagram':
      return new InstagramOAuth(redirectUri)
    case 'tiktok':
      return new TikTokOAuth(redirectUri)
    default:
      throw new Error(`Unsupported platform: ${platform}`)
  }
}
