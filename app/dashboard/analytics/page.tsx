'use client';

import { TrendingUp, Users, Eye, Heart, MessageCircle, Share2 } from 'lucide-react';

export default function AnalyticsPage() {
  const stats = [
    { label: 'Total Views', value: '0', icon: Eye, change: '+0%', bgColor: 'bg-blue-100', textColor: 'text-blue-600' },
    { label: 'Total Engagement', value: '0', icon: Heart, change: '+0%', bgColor: 'bg-red-100', textColor: 'text-red-600' },
    { label: 'Total Shares', value: '0', icon: Share2, change: '+0%', bgColor: 'bg-green-100', textColor: 'text-green-600' },
    { label: 'Total Comments', value: '0', icon: MessageCircle, change: '+0%', bgColor: 'bg-purple-100', textColor: 'text-purple-600' },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold">Analytics</h1>
        <p className="text-gray-600 mt-1">
          Track your content performance across all platforms
        </p>
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
                <span className="text-sm text-green-600 font-semibold">
                  {stat.change}
                </span>
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
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h3 className="text-lg font-semibold mb-4">Performance Overview</h3>
        <div className="text-center py-12 text-gray-500">
          <TrendingUp className="w-12 h-12 mx-auto mb-3 text-gray-300" />
          <p>No analytics data yet</p>
          <p className="text-sm mt-2">
            Start publishing content to see performance metrics
          </p>
        </div>
      </div>

      {/* Platform Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h3 className="text-lg font-semibold mb-4">Top Performing Content</h3>
          <div className="text-center py-8 text-gray-500">
            <p className="text-sm">No content published yet</p>
          </div>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h3 className="text-lg font-semibold mb-4">Platform Performance</h3>
          <div className="text-center py-8 text-gray-500">
            <p className="text-sm">No platform data available</p>
          </div>
        </div>
      </div>
    </div>
  );
}
