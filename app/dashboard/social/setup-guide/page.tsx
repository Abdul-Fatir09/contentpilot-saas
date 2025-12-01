import Link from "next/link"
import { ArrowLeft } from "lucide-react"

export default function SocialSetupGuidePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <div className="max-w-4xl mx-auto px-4 py-16">
        <div className="mb-8">
          <Link
            href="/dashboard/social"
            className="inline-flex items-center text-indigo-600 hover:text-indigo-700 font-semibold mb-4"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Social Accounts
          </Link>
        </div>

        <div className="bg-white rounded-2xl shadow-xl p-8 md:p-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Social Media Connection Guide</h1>
          <p className="text-gray-600 mb-8">
            Follow these step-by-step instructions to connect your social media accounts to ContentPilot.
          </p>

          <div className="space-y-8">
            {/* Twitter Section */}
            <section className="border-b border-gray-200 pb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                <span className="text-blue-500">🐦</span> Twitter/X
              </h2>
              <div className="space-y-3 text-gray-700">
                <h3 className="font-semibold text-lg">Steps to Connect:</h3>
                <ol className="list-decimal list-inside space-y-2 ml-4">
                  <li>Go to <a href="https://developer.twitter.com/en/portal/dashboard" target="_blank" rel="noopener noreferrer" className="text-indigo-600 hover:underline">Twitter Developer Portal</a></li>
                  <li>Create a new project and app (if you haven't already)</li>
                  <li>Navigate to your app's "Keys and tokens" section</li>
                  <li>Generate or copy your:
                    <ul className="list-disc list-inside ml-6 mt-2 space-y-1">
                      <li>API Key (Consumer Key)</li>
                      <li>API Secret Key (Consumer Secret)</li>
                      <li>Access Token</li>
                      <li>Access Token Secret</li>
                    </ul>
                  </li>
                  <li>Add these credentials to your environment variables in Vercel/deployment platform</li>
                  <li>Enable OAuth 2.0 in your Twitter app settings</li>
                  <li>Set the callback URL to: <code className="bg-gray-100 px-2 py-1 rounded">https://yourdomain.com/api/auth/callback/twitter</code></li>
                </ol>
              </div>
            </section>

            {/* Facebook Section */}
            <section className="border-b border-gray-200 pb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                <span className="text-blue-600">📘</span> Facebook
              </h2>
              <div className="space-y-3 text-gray-700">
                <h3 className="font-semibold text-lg">Steps to Connect:</h3>
                <ol className="list-decimal list-inside space-y-2 ml-4">
                  <li>Visit <a href="https://developers.facebook.com/" target="_blank" rel="noopener noreferrer" className="text-indigo-600 hover:underline">Facebook Developers</a></li>
                  <li>Create a new app or select an existing one</li>
                  <li>Add "Facebook Login" product to your app</li>
                  <li>Configure OAuth redirect URIs</li>
                  <li>Get your App ID and App Secret from Settings → Basic</li>
                  <li>Request permissions for <code className="bg-gray-100 px-2 py-1 rounded">pages_manage_posts</code> and <code className="bg-gray-100 px-2 py-1 rounded">publish_to_groups</code></li>
                  <li>Submit your app for review to access publishing features</li>
                </ol>
              </div>
            </section>

            {/* LinkedIn Section */}
            <section className="border-b border-gray-200 pb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                <span className="text-blue-700">💼</span> LinkedIn
              </h2>
              <div className="space-y-3 text-gray-700">
                <h3 className="font-semibold text-lg">Steps to Connect:</h3>
                <ol className="list-decimal list-inside space-y-2 ml-4">
                  <li>Go to <a href="https://www.linkedin.com/developers/apps" target="_blank" rel="noopener noreferrer" className="text-indigo-600 hover:underline">LinkedIn Developers</a></li>
                  <li>Create a new app</li>
                  <li>Fill in the required app information</li>
                  <li>Under "Auth" tab, add authorized redirect URLs</li>
                  <li>Copy your Client ID and Client Secret</li>
                  <li>Request access to LinkedIn Share API</li>
                  <li>Add scopes: <code className="bg-gray-100 px-2 py-1 rounded">w_member_social</code></li>
                </ol>
              </div>
            </section>

            {/* Instagram Section */}
            <section className="border-b border-gray-200 pb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                <span className="text-pink-600">📷</span> Instagram
              </h2>
              <div className="space-y-3 text-gray-700">
                <h3 className="font-semibold text-lg">Steps to Connect:</h3>
                <ol className="list-decimal list-inside space-y-2 ml-4">
                  <li>Instagram API access requires a Facebook Business account</li>
                  <li>Convert your Instagram account to a Business or Creator account</li>
                  <li>Connect it to your Facebook Page</li>
                  <li>Use the same Facebook App from above</li>
                  <li>Add Instagram Graph API product</li>
                  <li>Request permissions: <code className="bg-gray-100 px-2 py-1 rounded">instagram_basic</code>, <code className="bg-gray-100 px-2 py-1 rounded">instagram_content_publish</code></li>
                  <li>Complete the App Review process</li>
                </ol>
              </div>
            </section>

            {/* TikTok Section */}
            <section className="pb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                <span>🎵</span> TikTok
              </h2>
              <div className="space-y-3 text-gray-700">
                <h3 className="font-semibold text-lg">Steps to Connect:</h3>
                <ol className="list-decimal list-inside space-y-2 ml-4">
                  <li>Apply for <a href="https://developers.tiktok.com/" target="_blank" rel="noopener noreferrer" className="text-indigo-600 hover:underline">TikTok for Developers</a> access</li>
                  <li>Create a new app in the Developer Portal</li>
                  <li>Request access to Content Posting API</li>
                  <li>Get your Client Key and Client Secret</li>
                  <li>Configure redirect URI: <code className="bg-gray-100 px-2 py-1 rounded">https://yourdomain.com/api/auth/callback/tiktok</code></li>
                  <li>Request scopes: <code className="bg-gray-100 px-2 py-1 rounded">video.upload</code>, <code className="bg-gray-100 px-2 py-1 rounded">user.info.basic</code></li>
                  <li>Note: TikTok API access requires business verification</li>
                </ol>
              </div>
            </section>

            {/* Environment Variables */}
            <section className="bg-slate-50 rounded-lg p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Environment Variables Setup</h2>
              <p className="text-gray-700 mb-4">
                Once you have your API credentials, add them to your Vercel environment variables:
              </p>
              <div className="bg-gray-900 text-green-400 p-4 rounded-lg font-mono text-sm overflow-x-auto">
                <div>TWITTER_API_KEY=your_twitter_api_key</div>
                <div>TWITTER_API_SECRET=your_twitter_api_secret</div>
                <div>FACEBOOK_APP_ID=your_facebook_app_id</div>
                <div>FACEBOOK_APP_SECRET=your_facebook_app_secret</div>
                <div>LINKEDIN_CLIENT_ID=your_linkedin_client_id</div>
                <div>LINKEDIN_CLIENT_SECRET=your_linkedin_client_secret</div>
                <div>INSTAGRAM_APP_ID=your_instagram_app_id</div>
                <div>INSTAGRAM_APP_SECRET=your_instagram_app_secret</div>
                <div>TIKTOK_CLIENT_KEY=your_tiktok_client_key</div>
                <div>TIKTOK_CLIENT_SECRET=your_tiktok_client_secret</div>
              </div>
            </section>

            {/* Important Notes */}
            <section className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
              <h2 className="text-xl font-bold text-yellow-900 mb-3">⚠️ Important Notes</h2>
              <ul className="list-disc list-inside space-y-2 text-yellow-800">
                <li>Most social platforms require app review before publishing capabilities are enabled</li>
                <li>Review processes can take several days to weeks</li>
                <li>Some platforms have rate limits on API calls</li>
                <li>Business accounts may be required for certain features</li>
                <li>Keep your API credentials secure and never commit them to version control</li>
              </ul>
            </section>
          </div>

          <div className="mt-12 text-center">
            <Link
              href="/dashboard/social"
              className="inline-flex items-center gap-2 px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors font-semibold"
            >
              Back to Social Accounts
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
