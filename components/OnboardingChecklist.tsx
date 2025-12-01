"use client"

import { useState, useEffect } from "react"
import { CheckCircle2, Circle, X, Sparkles } from "lucide-react"
import { useRouter } from "next/navigation"

interface ChecklistItem {
  id: string
  title: string
  description: string
  completed: boolean
  action: string
}

export default function OnboardingChecklist() {
  const router = useRouter()
  const [isVisible, setIsVisible] = useState(true)
  const [loading, setLoading] = useState(true)
  const [items, setItems] = useState<ChecklistItem[]>([
    {
      id: "profile",
      title: "Complete Your Profile",
      description: "Add your details and preferences",
      completed: false,
      action: "/dashboard/onboarding/complete-profile",
    },
    {
      id: "content",
      title: "Generate Your First Content",
      description: "Create a blog post or social media caption",
      completed: false,
      action: "/dashboard/content/new",
    },
    {
      id: "schedule",
      title: "Schedule Your First Post",
      description: "Plan your content calendar",
      completed: false,
      action: "/dashboard/calendar",
    },
    {
      id: "connect",
      title: "Connect Social Accounts",
      description: "Link your social media platforms",
      completed: false,
      action: "/dashboard/social",
    },
  ])

  useEffect(() => {
    fetchOnboardingStatus()
  }, [])

  const fetchOnboardingStatus = async () => {
    try {
      const res = await fetch("/api/onboarding")
      if (!res.ok) {
        setLoading(false)
        return
      }
      const data = await res.json()
      
      setItems((prevItems) =>
        prevItems.map((item) => ({
          ...item,
          completed: data.steps[item.id] || false,
        }))
      )
    } catch (error) {
      console.error("Failed to fetch onboarding status:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleItemClick = (item: ChecklistItem) => {
    if (!item.completed) {
      router.push(item.action)
    }
  }

  const completedCount = items.filter(item => item.completed).length
  const totalCount = items.length
  const progress = (completedCount / totalCount) * 100

  if (!isVisible || loading) return null

  return (
    <div className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-2xl p-6 border border-indigo-100 shadow-sm relative overflow-hidden">
      {/* Decorative circles */}
      <div className="absolute -top-8 -right-8 w-24 h-24 bg-purple-200/30 rounded-full blur-2xl"></div>
      <div className="absolute -bottom-6 -left-6 w-20 h-20 bg-indigo-200/30 rounded-full blur-2xl"></div>

      <div className="relative z-10">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-gray-900">Getting Started</h3>
              <p className="text-sm text-gray-600">
                {completedCount} of {totalCount} completed
              </p>
            </div>
          </div>
          <button
            onClick={() => setIsVisible(false)}
            className="p-1 hover:bg-gray-200 rounded-lg transition-colors"
            aria-label="Dismiss checklist"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* Progress bar */}
        <div className="mb-4">
          <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-indigo-600 to-purple-600 transition-all duration-500 ease-out"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
        </div>

        {/* Checklist items */}
        <div className="space-y-3">
          {items.map((item) => (
            <button
              key={item.id}
              onClick={() => handleItemClick(item)}
              disabled={item.completed}
              className="w-full flex items-start gap-3 p-3 rounded-xl hover:bg-white/60 transition-all text-left group disabled:cursor-default disabled:hover:bg-transparent"
            >
              {item.completed ? (
                <CheckCircle2 className="w-6 h-6 text-green-600 flex-shrink-0 mt-0.5" />
              ) : (
                <Circle className="w-6 h-6 text-gray-400 flex-shrink-0 mt-0.5 group-hover:text-indigo-500 transition-colors" />
              )}
              <div className="flex-1">
                <p className={`font-semibold ${item.completed ? "text-gray-500 line-through" : "text-gray-900"}`}>
                  {item.title}
                </p>
                <p className="text-sm text-gray-600">{item.description}</p>
              </div>
              {!item.completed && (
                <span className="text-xs text-indigo-600 font-medium opacity-0 group-hover:opacity-100 transition-opacity mt-1">
                  Start →
                </span>
              )}
            </button>
          ))}
        </div>

        {completedCount === totalCount && (
          <div className="mt-4 p-3 rounded-xl bg-green-50 border border-green-200 text-center">
            <p className="text-green-700 font-semibold">🎉 All done! You're ready to create amazing content!</p>
          </div>
        )}
      </div>
    </div>
  )
}
