'use client';

import { useToast } from '@/components/ToastContainer';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { ConfirmModal } from '@/components/ConfirmModal';

// Real brand logo components
const TwitterIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
  </svg>
);

const FacebookIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
  </svg>
);

const LinkedInIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M20.5 2h-17A1.5 1.5 0 002 3.5v17A1.5 1.5 0 003.5 22h17a1.5 1.5 0 001.5-1.5v-17A1.5 1.5 0 0020.5 2zM8 19H5v-9h3zM6.5 8.25A1.75 1.75 0 118.3 6.5a1.78 1.78 0 01-1.8 1.75zM19 19h-3v-4.74c0-1.42-.6-1.93-1.38-1.93A1.74 1.74 0 0013 14.19a.66.66 0 000 .14V19h-3v-9h2.9v1.3a3.11 3.11 0 012.7-1.4c1.55 0 3.36.86 3.36 3.66z"/>
  </svg>
);

const InstagramIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
  </svg>
);

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
      icon: TwitterIcon,
      bgColor: 'bg-black',
      textColor: 'text-white',
      description: 'Connect your Twitter account to auto-publish tweets',
    },
    {
      name: 'Facebook',
      key: 'facebook',
      icon: FacebookIcon,
      bgColor: 'bg-blue-600',
      textColor: 'text-white',
      description: 'Connect your Facebook page to share posts',
    },
    {
      name: 'LinkedIn',
      key: 'linkedin',
      icon: LinkedInIcon,
      bgColor: 'bg-blue-700',
      textColor: 'text-white',
      description: 'Connect your LinkedIn profile to share professional content',
    },
    {
      name: 'Instagram',
      key: 'instagram',
      icon: InstagramIcon,
      bgColor: 'bg-gradient-to-br from-purple-600 via-pink-600 to-orange-500',
      textColor: 'text-white',
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
              <div className="flex items-center gap-3 mb-4">
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

    </div>
  );
}
