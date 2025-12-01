'use client';

import { Twitter, Facebook, Linkedin, Instagram, Settings } from 'lucide-react';
import { useToast } from '@/components/ToastContainer';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { ConfirmModal } from '@/components/ConfirmModal';

// TikTok icon component
const TikTokIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-5.2 1.74 2.89 2.89 0 012.31-4.64 2.93 2.93 0 01.88.13V9.4a6.84 6.84 0 00-1-.05A6.33 6.33 0 005 20.1a6.34 6.34 0 0010.86-4.43v-7a8.16 8.16 0 004.77 1.52v-3.4a4.85 4.85 0 01-1-.10z"/>
  </svg>
);

interface ConnectedAccount {
  id: string;
  platform: string;
  accountName: string;
  accountId?: string;
  profileImage?: string;
  createdAt: string;
  _count: {
    socialPosts: number;
  };
}

export default function SocialAccountsPage() {
  const toast = useToast();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [connectedAccounts, setConnectedAccounts] = useState<ConnectedAccount[]>([]);
  const [loading, setLoading] = useState(true);
  const [connecting, setConnecting] = useState<string | null>(null);
  const [showDisconnectModal, setShowDisconnectModal] = useState(false);
  const [accountToDisconnect, setAccountToDisconnect] = useState<ConnectedAccount | null>(null);
  const [disconnecting, setDisconnecting] = useState(false);

  const platforms = [
    {
      name: 'Twitter',
      key: 'twitter',
      icon: Twitter,
      bgColor: 'bg-blue-100',
      textColor: 'text-blue-600',
      description: 'Connect your Twitter account to auto-publish tweets',
    },
    {
      name: 'Facebook',
      key: 'facebook',
      icon: Facebook,
      bgColor: 'bg-blue-100',
      textColor: 'text-blue-600',
      description: 'Connect your Facebook page to share posts',
    },
    {
      name: 'LinkedIn',
      key: 'linkedin',
      icon: Linkedin,
      bgColor: 'bg-blue-100',
      textColor: 'text-blue-700',
      description: 'Connect your LinkedIn profile to share professional content',
    },
    {
      name: 'Instagram',
      key: 'instagram',
      icon: Instagram,
      bgColor: 'bg-pink-100',
      textColor: 'text-pink-600',
      description: 'Connect your Instagram account to share photos and stories',
    },
    {
      name: 'TikTok',
      key: 'tiktok',
      icon: TikTokIcon,
      bgColor: 'bg-black',
      textColor: 'text-white',
      description: 'Connect your TikTok account to share short-form videos',
    },
  ];

  useEffect(() => {
    fetchConnectedAccounts();
    
    // Check for OAuth callback messages
    const success = searchParams.get('success');
    const error = searchParams.get('error');
    
    if (success) {
      toast.success(`${success.charAt(0).toUpperCase() + success.slice(1)} connected successfully!`);
      router.replace('/dashboard/social');
    }
    
    if (error) {
      toast.error(`Connection failed: ${error.replace(/_/g, ' ')}`);
      router.replace('/dashboard/social');
    }
  }, [searchParams]);

  const fetchConnectedAccounts = async () => {
    try {
      const response = await fetch('/api/social/accounts');
      if (response.ok) {
        const data = await response.json();
        setConnectedAccounts(data.accounts || []);
      }
    } catch (error) {
      console.error('Failed to fetch accounts:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleConnect = async (platformKey: string) => {
    setConnecting(platformKey);
    try {
      // Redirect to OAuth connect route
      window.location.href = `/api/social/connect/${platformKey}`;
    } catch (error) {
      toast.error('Failed to initiate connection');
      setConnecting(null);
    }
  };

  const handleDisconnectClick = (account: ConnectedAccount) => {
    setAccountToDisconnect(account);
    setShowDisconnectModal(true);
  };

  const handleConfirmDisconnect = async () => {
    if (!accountToDisconnect) return;

    setDisconnecting(true);
    try {
      const response = await fetch(`/api/social/accounts/${accountToDisconnect.id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        toast.success('Account disconnected successfully');
        setConnectedAccounts(prev => prev.filter(a => a.id !== accountToDisconnect.id));
      } else {
        toast.error('Failed to disconnect account');
      }
    } catch (error) {
      toast.error('Failed to disconnect account');
    } finally {
      setDisconnecting(false);
      setShowDisconnectModal(false);
      setAccountToDisconnect(null);
    }
  };

  const isConnected = (platformKey: string) => {
    return connectedAccounts.some(
      acc => acc.platform.toLowerCase() === platformKey.toLowerCase()
    );
  };

  const getConnectedAccount = (platformKey: string) => {
    return connectedAccounts.find(
      acc => acc.platform.toLowerCase() === platformKey.toLowerCase()
    );
  };

  return (
    <div className="space-y-6">
      <ConfirmModal
        isOpen={showDisconnectModal}
        onClose={() => {
          setShowDisconnectModal(false);
          setAccountToDisconnect(null);
        }}
        onConfirm={handleConfirmDisconnect}
        title="Disconnect Account"
        message={`Are you sure you want to disconnect ${accountToDisconnect?.accountName}? This will remove all scheduled posts for this account.`}
        confirmText="Disconnect"
        confirmColor="red"
        isLoading={disconnecting}
      />

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
          const connected = isConnected(platform.key);
          const account = getConnectedAccount(platform.key);

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
                      {connected ? `@${account?.accountName}` : 'Not connected'}
                    </p>
                  </div>
                </div>
                {connected && (
                  <Settings className="w-5 h-5 text-gray-400 cursor-pointer hover:text-gray-600" />
                )}
              </div>

              <p className="text-sm text-gray-600 mb-4">{platform.description}</p>

              <button
                onClick={() => {
                  if (connected && account) {
                    handleDisconnectClick(account);
                  } else {
                    handleConnect(platform.key);
                  }
                }}
                disabled={connecting === platform.key || loading}
                className={`w-full py-2 px-4 rounded-lg font-medium transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 ${
                  connected
                    ? 'bg-red-50 text-red-600 hover:bg-red-100'
                    : 'bg-blue-600 text-white hover:bg-blue-700'
                }`}
              >
                {connecting === platform.key && (
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current"></div>
                )}
                {connected ? 'Disconnect' : 'Connect Account'}
              </button>

              {connected && account && (
                <div className="mt-4 pt-4 border-t">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">Posts published</span>
                    <span className="font-semibold">{account._count.socialPosts}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm mt-2">
                    <span className="text-gray-600">Connected since</span>
                    <span className="font-semibold">
                      {new Date(account.createdAt).toLocaleDateString()}
                    </span>
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
          See the{' '}
          <Link href="/dashboard/social/setup-guide" className="font-semibold underline hover:text-blue-900">
            Setup Guide
          </Link>{' '}
          page to get a detailed step-by-step guide for connecting your social media accounts.
        </p>
      </div>
    </div>
  );
}
