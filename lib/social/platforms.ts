// Social Media Platform Integrations

export interface SocialPostParams {
  text: string
  mediaUrls?: string[]
  scheduledFor?: Date
}

export interface PlatformResponse {
  success: boolean
  postId?: string
  error?: string
}

// Twitter/X Integration
export class TwitterService {
  private accessToken: string
  private refreshToken?: string

  constructor(accessToken: string, refreshToken?: string) {
    this.accessToken = accessToken
    this.refreshToken = refreshToken
  }

  async post(params: SocialPostParams): Promise<PlatformResponse> {
    try {
      const response = await fetch('https://api.twitter.com/2/tweets', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.accessToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          text: params.text,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        return { success: false, error: data.detail || 'Failed to post to Twitter' }
      }

      return { success: true, postId: data.data?.id }
    } catch (error) {
      console.error('Twitter post error:', error)
      return { success: false, error: 'Twitter API error' }
    }
  }

  async getMetrics(tweetId: string) {
    try {
      const response = await fetch(
        `https://api.twitter.com/2/tweets/${tweetId}?tweet.fields=public_metrics`,
        {
          headers: {
            'Authorization': `Bearer ${this.accessToken}`,
          },
        }
      )

      const data = await response.json()
      return data.data?.public_metrics || null
    } catch (error) {
      console.error('Twitter metrics error:', error)
      return null
    }
  }
}

// Facebook Integration
export class FacebookService {
  private accessToken: string
  private pageId: string

  constructor(accessToken: string, pageId: string) {
    this.accessToken = accessToken
    this.pageId = pageId
  }

  async post(params: SocialPostParams): Promise<PlatformResponse> {
    try {
      const response = await fetch(
        `https://graph.facebook.com/v18.0/${this.pageId}/feed`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            message: params.text,
            access_token: this.accessToken,
          }),
        }
      )

      const data = await response.json()

      if (data.error) {
        return { success: false, error: data.error.message }
      }

      return { success: true, postId: data.id }
    } catch (error) {
      console.error('Facebook post error:', error)
      return { success: false, error: 'Facebook API error' }
    }
  }

  async getMetrics(postId: string) {
    try {
      const response = await fetch(
        `https://graph.facebook.com/v18.0/${postId}?fields=shares,likes.summary(true),comments.summary(true)&access_token=${this.accessToken}`
      )

      const data = await response.json()
      return {
        likes: data.likes?.summary?.total_count || 0,
        comments: data.comments?.summary?.total_count || 0,
        shares: data.shares?.count || 0,
      }
    } catch (error) {
      console.error('Facebook metrics error:', error)
      return null
    }
  }
}

// LinkedIn Integration
export class LinkedInService {
  private accessToken: string
  private personUrn: string

  constructor(accessToken: string, personUrn: string) {
    this.accessToken = accessToken
    this.personUrn = personUrn
  }

  async post(params: SocialPostParams): Promise<PlatformResponse> {
    try {
      const response = await fetch(
        'https://api.linkedin.com/v2/ugcPosts',
        {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${this.accessToken}`,
            'Content-Type': 'application/json',
            'X-Restli-Protocol-Version': '2.0.0',
          },
          body: JSON.stringify({
            author: this.personUrn,
            lifecycleState: 'PUBLISHED',
            specificContent: {
              'com.linkedin.ugc.ShareContent': {
                shareCommentary: {
                  text: params.text,
                },
                shareMediaCategory: 'NONE',
              },
            },
            visibility: {
              'com.linkedin.ugc.MemberNetworkVisibility': 'PUBLIC',
            },
          }),
        }
      )

      const data = await response.json()

      if (!response.ok) {
        return { success: false, error: data.message || 'Failed to post to LinkedIn' }
      }

      return { success: true, postId: data.id }
    } catch (error) {
      console.error('LinkedIn post error:', error)
      return { success: false, error: 'LinkedIn API error' }
    }
  }

  async getMetrics(postId: string) {
    try {
      const response = await fetch(
        `https://api.linkedin.com/v2/socialActions/${postId}`,
        {
          headers: {
            'Authorization': `Bearer ${this.accessToken}`,
          },
        }
      )

      const data = await response.json()
      return {
        likes: data.likesSummary?.totalLikes || 0,
        comments: data.commentsSummary?.totalComments || 0,
        shares: data.sharesSummary?.totalShares || 0,
      }
    } catch (error) {
      console.error('LinkedIn metrics error:', error)
      return null
    }
  }
}

// Instagram Integration (via Facebook Graph API)
export class InstagramService {
  private accessToken: string
  private accountId: string

  constructor(accessToken: string, accountId: string) {
    this.accessToken = accessToken
    this.accountId = accountId
  }

  async post(params: SocialPostParams): Promise<PlatformResponse> {
    try {
      // Instagram requires a two-step process: create container, then publish
      
      // Step 1: Create media container
      const containerResponse = await fetch(
        `https://graph.facebook.com/v18.0/${this.accountId}/media`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            caption: params.text,
            image_url: params.mediaUrls?.[0], // Instagram requires media
            access_token: this.accessToken,
          }),
        }
      )

      const containerData = await containerResponse.json()

      if (containerData.error) {
        return { success: false, error: containerData.error.message }
      }

      // Step 2: Publish container
      const publishResponse = await fetch(
        `https://graph.facebook.com/v18.0/${this.accountId}/media_publish`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            creation_id: containerData.id,
            access_token: this.accessToken,
          }),
        }
      )

      const publishData = await publishResponse.json()

      if (publishData.error) {
        return { success: false, error: publishData.error.message }
      }

      return { success: true, postId: publishData.id }
    } catch (error) {
      console.error('Instagram post error:', error)
      return { success: false, error: 'Instagram API error' }
    }
  }

  async getMetrics(mediaId: string) {
    try {
      const response = await fetch(
        `https://graph.facebook.com/v18.0/${mediaId}?fields=like_count,comments_count&access_token=${this.accessToken}`
      )

      const data = await response.json()
      return {
        likes: data.like_count || 0,
        comments: data.comments_count || 0,
      }
    } catch (error) {
      console.error('Instagram metrics error:', error)
      return null
    }
  }
}

export function getPlatformService(
  platform: string,
  accessToken: string,
  additionalParams?: Record<string, string>
) {
  switch (platform.toLowerCase()) {
    case 'twitter':
      return new TwitterService(accessToken, additionalParams?.refreshToken)
    case 'facebook':
      return new FacebookService(accessToken, additionalParams?.pageId || '')
    case 'linkedin':
      return new LinkedInService(accessToken, additionalParams?.personUrn || '')
    case 'instagram':
      return new InstagramService(accessToken, additionalParams?.accountId || '')
    default:
      throw new Error(`Unsupported platform: ${platform}`)
  }
}
