'use client';

import { Twitter, Facebook, Linkedin, Instagram, Plus, Settings } from 'lucide-react';
import { useToast } from '@/components/ToastContainer';

export default function SocialAccountsPage() {
  const toast = useToast();
  const platforms = [
    {
      name: 'Twitter',
      icon: Twitter,
      bgColor: 'bg-blue-100',
      textColor: 'text-blue-600',
      connected: false,
      description: 'Connect your Twitter account to auto-publish tweets',
    },
    {
      name: 'Facebook',
      icon: Facebook,
      bgColor: 'bg-blue-100',
      textColor: 'text-blue-600',
      connected: false,
      description: 'Connect your Facebook page to share posts',
    },
    {
      name: 'LinkedIn',
      icon: Linkedin,
      bgColor: 'bg-blue-100',
      textColor: 'text-blue-700',
      connected: false,
      description: 'Connect your LinkedIn profile to share professional content',
    },
    {
      name: 'Instagram',
      icon: Instagram,
      bgColor: 'bg-pink-100',
      textColor: 'text-pink-600',
      connected: false,
      description: 'Connect your Instagram account to share photos and stories',
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold">Social Accounts</h1>
        <p className="text-gray-600 mt-1">
          Connect your social media accounts for seamless publishing
        </p>
      </div>

      {/* Connected Accounts */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {platforms.map((platform) => {
          const Icon = platform.icon;
          return (
            <div key={platform.name} className="bg-white rounded-lg border border-gray-200 p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className={`p-3 rounded-lg ${platform.bgColor}`}>
                    <Icon className={`w-6 h-6 ${platform.textColor}`} />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg">{platform.name}</h3>
                    <p className="text-sm text-gray-500">
                      {platform.connected ? 'Connected' : 'Not connected'}
                    </p>
                  </div>
                </div>
                {platform.connected && (
                  <Settings className="w-5 h-5 text-gray-400 cursor-pointer hover:text-gray-600" />
                )}
              </div>

              <p className="text-sm text-gray-600 mb-4">{platform.description}</p>

              <button
                onClick={() => {
                  if (platform.connected) {
                    toast.warning(`Disconnecting ${platform.name}...`);
                  } else {
                    toast.info(`To connect ${platform.name}, configure OAuth credentials first`);
                  }
                }}
                className={`w-full py-2 px-4 rounded-lg font-medium transition-colors cursor-pointer ${
                  platform.connected
                    ? 'bg-red-50 text-red-600 hover:bg-red-100'
                    : 'bg-blue-600 text-white hover:bg-blue-700'
                }`}
              >
                {platform.connected ? 'Disconnect' : 'Connect Account'}
              </button>

              {platform.connected && (
                <div className="mt-4 pt-4 border-t">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">Posts published</span>
                    <span className="font-semibold">0</span>
                  </div>
                  <div className="flex items-center justify-between text-sm mt-2">
                    <span className="text-gray-600">Scheduled posts</span>
                    <span className="font-semibold">0</span>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Info Box */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
        <h3 className="font-semibold text-blue-900 mb-2">Need Help Connecting?</h3>
        <p className="text-sm text-blue-800">
          To connect your social media accounts, you'll need to configure API credentials for each platform.
          Check the <span className="font-semibold">SETUP.md</span> file for detailed instructions on obtaining API keys.
        </p>
      </div>
    </div>
  );
}
