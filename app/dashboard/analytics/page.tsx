'use client';

import { TrendingUp, Users, Eye, Heart, MessageCircle, Share2 } from 'lucide-react';
import { useEffect, useState } from 'react';

interface AnalyticsData {
  totalPosts: number
  publishedPosts: number
  scheduledPosts: number
  failedPosts: number
  platformBreakdown: Record<string, number>
  topContent: Array<{
    id: string
    title: string
    postCount: number
  }>
}

export default function AnalyticsPage() {
  const [data, setData] = useState<AnalyticsData | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchAnalytics()
  }, [])

  const fetchAnalytics = async () => {
    try {
      const response = await fetch('/api/analytics')
      if (response.ok) {
        const analyticsData = await response.json()
        setData(analyticsData)
      }
    } catch (error) {
      console.error('Failed to fetch analytics:', error)
    } finally {
      setLoading(false)
    }
  }

  const stats = [
    { 
      label: 'Total Posts', 
      value: data?.totalPosts || 0, 
      icon: Eye, 
      change: '+0%', 
      bgColor: 'bg-blue-100', 
      textColor: 'text-blue-600' 
    },
    { 
      label: 'Published', 
      value: data?.publishedPosts || 0, 
      icon: Heart, 
      change: '+0%', 
      bgColor: 'bg-green-100', 
      textColor: 'text-green-600' 
    },
    { 
      label: 'Scheduled', 
      value: data?.scheduledPosts || 0, 
      icon: Share2, 
      change: '+0%', 
      bgColor: 'bg-yellow-100', 
      textColor: 'text-yellow-600' 
    },
    { 
      label: 'Failed', 
      value: data?.failedPosts || 0, 
      icon: MessageCircle, 
      change: '+0%', 
      bgColor: 'bg-red-100', 
      textColor: 'text-red-600' 
    },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold">Analytics</h1>
        <p className="text-gray-600 mt-1">
          Track your content performance across all platforms
        </p>
      </div>

      {/* Important Note */}
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
        <div className="flex items-start gap-3">
          <div className="text-yellow-600">
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
          </div>
          <div>
            <h3 className="font-semibold text-yellow-900">Engagement Metrics Coming Soon</h3>
            <p className="text-sm text-yellow-800 mt-1">
              Twitter's Basic API tier doesn't provide engagement metrics (likes, retweets, comments). 
              To get detailed analytics, you'll need to upgrade to Twitter's Pro API tier ($100/month) 
              or use Twitter's built-in analytics dashboard at analytics.twitter.com.
            </p>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <div key={stat.label} className="bg-white rounded-lg border border-gray-200 p-6">
              <div className="flex items-center justify-between">
                <div className={`p-3 rounded-lg ${stat.bgColor}`}>
                  <Icon className={`w-6 h-6 ${stat.textColor}`} />
                </div>
              </div>
              <div className="mt-4">
                <p className="text-gray-600 text-sm">{stat.label}</p>
                <p className="text-3xl font-bold mt-1">{stat.value}</p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Performance Chart */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Content */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h3 className="text-lg font-semibold mb-4">Top Performing Content</h3>
          {data && data.topContent.length > 0 ? (
            <div className="space-y-3">
              {data.topContent.map((content) => (
                <div key={content.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex-1">
                    <p className="font-medium text-gray-900 truncate">{content.title}</p>
                    <p className="text-sm text-gray-500">{content.postCount} posts</p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              <p className="text-sm">No content published yet</p>
            </div>
          )}
        </div>

        {/* Platform Breakdown */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h3 className="text-lg font-semibold mb-4">Platform Distribution</h3>
          {data && Object.keys(data.platformBreakdown).length > 0 ? (
            <div className="space-y-3">
              {Object.entries(data.platformBreakdown).map(([platform, count]) => (
                <div key={platform} className="flex items-center justify-between">
                  <span className="text-gray-700 font-medium">{platform}</span>
                  <div className="flex items-center gap-3">
                    <div className="w-32 h-2 bg-gray-200 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-blue-600 rounded-full" 
                        style={{ width: `${(count / data.totalPosts) * 100}%` }}
                      />
                    </div>
                    <span className="text-gray-900 font-semibold w-8 text-right">{count}</span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              <p className="text-sm">No platform data available</p>
            </div>
          )}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h3 className="text-lg font-semibold mb-4">External Analytics</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <a
            href="https://analytics.twitter.com"
            target="_blank"
            rel="noopener noreferrer"
            className="flex flex-col items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <span className="text-2xl mb-2">𝕏</span>
            <span className="font-medium">Twitter Analytics</span>
          </a>
          <a
            href="https://business.facebook.com/insights"
            target="_blank"
            rel="noopener noreferrer"
            className="flex flex-col items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <span className="text-2xl mb-2">f</span>
            <span className="font-medium">Facebook Insights</span>
          </a>
          <a
            href="https://www.linkedin.com/analytics"
            target="_blank"
            rel="noopener noreferrer"
            className="flex flex-col items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <span className="text-2xl mb-2">in</span>
            <span className="font-medium">LinkedIn Analytics</span>
          </a>
          <a
            href="https://www.instagram.com/accounts/insights/"
            target="_blank"
            rel="noopener noreferrer"
            className="flex flex-col items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <span className="text-2xl mb-2">📷</span>
            <span className="font-medium">Instagram Insights</span>
          </a>
        </div>
      </div>
    </div>
  );
}
