"use client"

import { useEffect, useState } from "react"
import { FileText, Calendar, TrendingUp, Zap, Sparkles, Rocket, BarChart3, Clock, RefreshCw } from "lucide-react"
import Link from "next/link"
import OnboardingChecklist from "@/components/OnboardingChecklist"

function getGreeting() {
  const hour = new Date().getHours()
  if (hour < 12) return { text: "Good morning", emoji: "☀️" }
  if (hour < 18) return { text: "Good afternoon", emoji: "👋" }
  return { text: "Good evening", emoji: "🌙" }
}

const contentIdeas = [
  "10 Ways AI is Transforming Content Marketing",
  "How to Build a Content Calendar That Works",
  "The Ultimate Guide to Social Media Engagement",
  "5 Mistakes to Avoid When Writing Blog Posts",
  "Creating Viral Content: A Data-Driven Approach",
  "Mastering SEO: From Basics to Advanced",
  "Email Marketing Strategies That Convert",
  "The Psychology of Clickable Headlines",
  "Content Repurposing: Work Smarter, Not Harder",
  "Building Your Personal Brand on Social Media",
]

export default function DashboardPage() {
  const [randomIdea, setRandomIdea] = useState("")
  const [userName, setUserName] = useState("")
  const [stats, setStats] = useState({
    subscription: "FREE",
    contentCount: 0,
    scheduledCount: 0,
    todayContent: 0
  })

  const greeting = getGreeting()

  const getNewIdea = () => {
    const newIdea = contentIdeas[Math.floor(Math.random() * contentIdeas.length)]
    setRandomIdea(newIdea)
  }

  useEffect(() => {
    // Fetch user data and stats
    async function fetchData() {
      try {
        const response = await fetch('/api/dashboard/stats')
        if (!response.ok) {
          console.error('Failed to fetch stats:', response.status)
          return
        }
        const data = await response.json()
        if (data.userName) setUserName(data.userName)
        if (data.stats) setStats(data.stats)
      } catch (error) {
        console.error('Failed to fetch dashboard data:', error)
        // Set default values on error
        setStats({
          subscription: "FREE",
          contentCount: 0,
          scheduledCount: 0,
          todayContent: 0
        })
      }
    }
    fetchData()
    getNewIdea()
  }, [])
  
  const dashboardStats = [
    {
      name: "Total Content",
      value: stats.contentCount,
      icon: FileText,
      gradient: "from-blue-500 to-cyan-600",
      bg: "bg-blue-50",
      text: "text-blue-600",
      link: "/dashboard/content",
    },
    {
      name: "Scheduled Posts",
      value: stats.scheduledCount,
      icon: Calendar,
      gradient: "from-green-500 to-emerald-600",
      bg: "bg-green-50",
      text: "text-green-600",
      link: "/dashboard/calendar",
    },
    {
      name: "Today's Content",
      value: stats.todayContent,
      icon: Zap,
      gradient: "from-purple-500 to-pink-600",
      bg: "bg-purple-50",
      text: "text-purple-600",
      link: "/dashboard/content",
    },
    {
      name: "Remaining Today",
      value: stats.subscription === "PRO" || stats.subscription === "AGENCY" ? "Unlimited" : Math.max(0, 5 - stats.todayContent),
      icon: TrendingUp,
      gradient: "from-orange-500 to-red-600",
      bg: "bg-orange-50",
      text: "text-orange-600",
      link: "/dashboard/pricing",
    },
  ]

  return (
    <div className="space-y-8">
      {/* Greeting Banner */}
      <div className="rounded-2xl bg-gradient-to-br from-indigo-600 via-purple-600 to-indigo-700 p-8 text-white shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -mr-32 -mt-32"></div>
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/10 rounded-full -ml-24 -mb-24"></div>
        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-2">
            <span className="text-4xl">{greeting.emoji}</span>
            <h1 className="text-3xl md:text-4xl font-bold">
              {greeting.text}, {userName?.split(' ')[0] || 'there'}!
            </h1>
          </div>
          <p className="text-indigo-100 text-lg mb-4">Ready to create amazing content today?</p>
          
          {/* Content Idea of the Day - Clickable */}
          <button 
            onClick={() => {
              // Navigate to content generation page with pre-filled topic
              window.location.href = `/dashboard/content/new?topic=${encodeURIComponent(randomIdea)}`;
            }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/20 backdrop-blur-sm border border-white/30 hover:bg-white/30 transition-all cursor-pointer group"
          >
            <Sparkles className="w-4 h-4 group-hover:rotate-12 transition-transform" />
            <span className="text-sm font-medium">Idea: {randomIdea}</span>
            <RefreshCw 
              className="w-3 h-3 opacity-70 group-hover:rotate-180 transition-transform duration-500" 
              onClick={(e) => {
                e.stopPropagation();
                getNewIdea();
              }}
            />
          </button>
        </div>
      </div>

      {/* Stats Grid with Animation */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {dashboardStats.map((stat, index) => (
          <Link
            href={stat.link}
            key={stat.name} 
            className="group rounded-2xl bg-white p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300 card-hover cursor-pointer"
            style={{ animationDelay: `${index * 100}ms` }}
          >
            <div className="flex items-start justify-between mb-4">
              <div className={`p-3 rounded-xl ${stat.bg}`}>
                <div className={`p-2 rounded-lg bg-gradient-to-br ${stat.gradient}`}>
                  <stat.icon className="h-5 w-5 text-white" />
                </div>
              </div>
              <TrendingUp className="w-4 h-4 text-green-500" />
            </div>
            <p className="text-sm font-medium text-gray-600 mb-1">{stat.name}</p>
            <p className={`text-3xl font-bold ${stat.text}`}>{stat.value}</p>
          </Link>
        ))}
      </div>

      {/* Onboarding Checklist */}
      <OnboardingChecklist />

      {/* Quick Actions */}
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
          <Rocket className="w-6 h-6 text-indigo-600" />
          Quick Actions
        </h2>
        <div className="grid gap-6 md:grid-cols-3">
          <Link
            href="/dashboard/content/new"
            className="group rounded-2xl bg-gradient-to-br from-indigo-600 to-purple-600 p-8 text-white hover:shadow-2xl hover:shadow-indigo-500/50 transition-all duration-300 card-hover relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16"></div>
            <div className="relative z-10">
              <Zap className="w-10 h-10 mb-4 group-hover:scale-110 transition-transform" />
              <h3 className="text-xl font-bold mb-2">Generate Content</h3>
              <p className="text-indigo-100 text-sm">
                Create blog posts, social media content, and more with AI
              </p>
            </div>
          </Link>
          
          <Link
            href="/dashboard/calendar"
            className="group rounded-2xl bg-gradient-to-br from-green-500 to-emerald-600 p-8 text-white hover:shadow-2xl hover:shadow-green-500/50 transition-all duration-300 card-hover relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16"></div>
            <div className="relative z-10">
              <Clock className="w-10 h-10 mb-4 group-hover:scale-110 transition-transform" />
              <h3 className="text-xl font-bold mb-2">Schedule Posts</h3>
              <p className="text-green-100 text-sm">
                Plan and schedule your content across platforms
              </p>
            </div>
          </Link>
          
          <Link
            href="/dashboard/analytics"
            className="group rounded-2xl bg-gradient-to-br from-blue-500 to-cyan-600 p-8 text-white hover:shadow-2xl hover:shadow-blue-500/50 transition-all duration-300 card-hover relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16"></div>
            <div className="relative z-10">
              <BarChart3 className="w-10 h-10 mb-4 group-hover:scale-110 transition-transform" />
              <h3 className="text-xl font-bold mb-2">View Analytics</h3>
              <p className="text-blue-100 text-sm">
                Track performance and engagement metrics
              </p>
            </div>
          </Link>
        </div>
      </div>

      {/* Subscription Info */}
      <div className="rounded-2xl bg-white p-8 shadow-lg border border-gray-100">
        <div className="flex items-start justify-between">
          <div className="flex items-start gap-4">
            <div className="p-3 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600">
              <Sparkles className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900 mb-1">Your Plan</h2>
              <p className="text-3xl font-bold gradient-text mb-2">{stats.subscription}</p>
              <p className="text-gray-600">
                {stats.subscription === "FREE"
                  ? "Upgrade to unlock unlimited AI generations and advanced features"
                  : "Active subscription"}
              </p>
            </div>
          </div>
          {stats.subscription === "FREE" && (
            <Link
              href="/dashboard/pricing"
              className="rounded-full bg-gradient-to-r from-indigo-600 to-purple-600 px-6 py-3 text-white font-semibold hover:shadow-xl hover:shadow-indigo-500/50 transition-all duration-300 btn-glow"
            >
              Upgrade Now
            </Link>
          )}
        </div>
      </div>
    </div>
  )
}
