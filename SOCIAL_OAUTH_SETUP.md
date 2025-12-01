# Social Media OAuth Setup Guide

## Overview
This guide will help you set up OAuth credentials for all supported social media platforms in ContentPilot.

## Required Environment Variables

Add these to your `.env` file and Vercel environment variables:

```env
# Twitter OAuth 2.0
TWITTER_CLIENT_ID=your_twitter_client_id
TWITTER_CLIENT_SECRET=your_twitter_client_secret

# Facebook/Instagram
FACEBOOK_APP_ID=your_facebook_app_id
FACEBOOK_APP_SECRET=your_facebook_app_secret

# LinkedIn
LINKEDIN_CLIENT_ID=your_linkedin_client_id
LINKEDIN_CLIENT_SECRET=your_linkedin_client_secret

# TikTok
TIKTOK_CLIENT_KEY=your_tiktok_client_key
TIKTOK_CLIENT_SECRET=your_tiktok_client_secret

# Your app URL (required for OAuth callbacks)
NEXTAUTH_URL=https://your-domain.vercel.app
```

## Database Migration

Run the SQL migration in Supabase SQL Editor:

```sql
-- Add TikTok to Platform enum and update SocialAccount table
ALTER TYPE "Platform" ADD VALUE IF NOT EXISTS 'TIKTOK';

-- Add new columns to social_accounts table
ALTER TABLE "social_accounts" 
  ADD COLUMN IF NOT EXISTS "accountId" TEXT,
  ADD COLUMN IF NOT EXISTS "profileImage" TEXT,
  ADD COLUMN IF NOT EXISTS "tokenSecret" TEXT,
  ADD COLUMN IF NOT EXISTS "metadata" JSONB;

-- Create index for faster lookups
CREATE INDEX IF NOT EXISTS "social_accounts_user_platform_idx" ON "social_accounts"("userId", "platform");
CREATE INDEX IF NOT EXISTS "social_accounts_is_active_idx" ON "social_accounts"("isActive");

-- Update any existing records to set isActive to true if NULL
UPDATE "social_accounts" SET "isActive" = true WHERE "isActive" IS NULL;
```

## Platform-Specific Setup

### 1. Twitter/X Setup

1. Go to [Twitter Developer Portal](https://developer.twitter.com/en/portal/dashboard)
2. Create a new project and app
3. Navigate to app settings → OAuth 2.0 settings
4. Add these redirect URIs:
   - `https://your-domain.vercel.app/api/social/callback/twitter`
   - `http://localhost:3000/api/social/callback/twitter` (for testing)
5. Copy Client ID and Client Secret
6. Enable OAuth 2.0 and set permissions to "Read and write"

### 2. Facebook Setup

1. Visit [Facebook Developers](https://developers.facebook.com/)
2. Create a new app (Business type)
3. Add "Facebook Login" product
4. Configure OAuth redirect URIs:
   - `https://your-domain.vercel.app/api/social/callback/facebook`
5. Go to Settings → Basic → Copy App ID and App Secret
6. Request permissions: `pages_manage_posts`, `pages_read_engagement`

### 3. Instagram Setup

Instagram uses Facebook OAuth:
1. Connect your Instagram Business account to your Facebook Page
2. Use the same Facebook App from above
3. Add Instagram Graph API product
4. Request permissions: `instagram_basic`, `instagram_content_publish`
5. Complete App Review for production use

### 4. LinkedIn Setup

1. Go to [LinkedIn Developers](https://www.linkedin.com/developers/apps)
2. Create a new app
3. Under "Auth" tab, add authorized redirect URLs:
   - `https://your-domain.vercel.app/api/social/callback/linkedin`
4. Copy Client ID and Client Secret
5. Request products: "Share on LinkedIn" and "Sign In with LinkedIn"
6. Add OAuth 2.0 scopes: `openid`, `profile`, `w_member_social`

### 5. TikTok Setup

1. Apply for [TikTok for Developers](https://developers.tiktok.com/)
2. Create a new app
3. Request access to "Content Posting API"
4. Configure redirect URI:
   - `https://your-domain.vercel.app/api/social/callback/tiktok`
5. Copy Client Key and Client Secret
6. Request scopes: `user.info.basic`, `video.upload`, `video.publish`

**Note:** TikTok API requires business verification and can take several weeks for approval.

## Testing OAuth Flow

### Local Development

1. Add to your `.env.local`:
```env
NEXTAUTH_URL=http://localhost:3000
```

2. Update callback URLs in each platform's developer console to include localhost

3. Run the development server:
```bash
npm run dev
```

4. Navigate to `/dashboard/social`
5. Click "Connect Account" for any platform
6. Complete the OAuth flow

### Production Deployment

1. Add all environment variables to Vercel:
   - Go to Project Settings → Environment Variables
   - Add each variable for Production, Preview, and Development environments

2. Update callback URLs in each platform to use your production domain

3. Redeploy your application

## How It Works

### Connection Flow

1. User clicks "Connect Account" button
2. App redirects to `/api/social/connect/[platform]`
3. OAuth provider generates authorization URL
4. User is redirected to the platform's OAuth consent page
5. User authorizes the app
6. Platform redirects back to `/api/social/callback/[platform]` with auth code
7. App exchanges code for access token
8. Access token and user info are stored in database
9. User is redirected back to `/dashboard/social` with success message

### Token Management

- Access tokens are encrypted and stored in the database
- Refresh tokens are used to renew expired access tokens
- Token expiration is tracked and handled automatically
- Disconnecting an account soft-deletes it (sets `isActive` to false)

## Security Considerations

1. **Never commit credentials** to version control
2. **Use environment variables** for all sensitive data
3. **Enable HTTPS** in production (automatic with Vercel)
4. **Validate OAuth state** parameter to prevent CSRF attacks
5. **Store tokens securely** in the database with encryption
6. **Implement rate limiting** to prevent abuse

## Troubleshooting

### Common Issues

**OAuth callback fails with "invalid_state"**
- Make sure cookies are enabled
- Check that your domain matches NEXTAUTH_URL

**"Redirect URI mismatch" error**
- Verify callback URL in platform settings matches exactly
- Include http:// or https:// protocol
- Check for trailing slashes

**Token expired errors**
- Implement refresh token logic
- Check token expiration dates
- Re-authenticate if refresh fails

**Platform-specific errors**
- Check app is in production mode (not development)
- Verify all required permissions are granted
- Complete app review process if required

## Additional Resources

- [NextAuth.js Documentation](https://next-auth.js.org/)
- [Twitter API Documentation](https://developer.twitter.com/en/docs)
- [Facebook Graph API](https://developers.facebook.com/docs/graph-api)
- [LinkedIn API](https://learn.microsoft.com/en-us/linkedin/)
- [Instagram Graph API](https://developers.facebook.com/docs/instagram-api)
- [TikTok API](https://developers.tiktok.com/doc)

## Support

For issues or questions:
1. Check the setup guide in the app: `/dashboard/social/setup-guide`
2. Review error messages in browser console
3. Check Vercel deployment logs
4. Verify all environment variables are set correctly
