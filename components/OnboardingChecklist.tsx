"use client"

import { useState, useEffect } from "react"
import { CheckCircle2, Circle, X, Sparkles } from "lucide-react"

interface ChecklistItem {
  id: string
  title: string
  description: string
  completed: boolean
}

export default function OnboardingChecklist() {
  const [isVisible, setIsVisible] = useState(true)
  const [items, setItems] = useState<ChecklistItem[]>([
    {
      id: "profile",
      title: "Complete Your Profile",
      description: "Add your details and preferences",
      completed: false,
    },
    {
      id: "content",
      title: "Generate Your First Content",
      description: "Create a blog post or social media caption",
      completed: false,
    },
    {
      id: "schedule",
      title: "Schedule Your First Post",
      description: "Plan your content calendar",
      completed: false,
    },
    {
      id: "connect",
      title: "Connect Social Accounts",
      description: "Link your social media platforms",
      completed: false,
    },
  ])

  // Load from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem("onboarding-checklist")
    if (saved) {
      const parsed = JSON.parse(saved)
      setItems(parsed.items)
      setIsVisible(parsed.visible)
    }
  }, [])

  // Save to localStorage whenever items change
  useEffect(() => {
    localStorage.setItem("onboarding-checklist", JSON.stringify({ items, visible: isVisible }))
  }, [items, isVisible])

  const toggleItem = (id: string) => {
    setItems(items.map(item => 
      item.id === id ? { ...item, completed: !item.completed } : item
    ))
  }

  const completedCount = items.filter(item => item.completed).length
  const totalCount = items.length
  const progress = (completedCount / totalCount) * 100

  if (!isVisible) return null

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
              onClick={() => toggleItem(item.id)}
              className="w-full flex items-start gap-3 p-3 rounded-xl hover:bg-white/60 transition-all text-left group"
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
