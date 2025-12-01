"use client"

import { useState, useEffect } from "react"
import { X, Send, Calendar } from "lucide-react"
import { useToast } from "@/components/ToastContainer"
import { useRouter } from "next/navigation"

interface SchedulePostModalProps {
  isOpen: boolean
  onClose: () => void
}

interface SocialAccount {
  id: string
  platform: string
  accountName: string
  profileImage: string | null
}

interface Content {
  id: string
  title: string
  content: string
  type: string
}

export default function SchedulePostModal({ isOpen, onClose }: SchedulePostModalProps) {
  const toast = useToast()
  const router = useRouter()
  const [accounts, setAccounts] = useState<SocialAccount[]>([])
  const [contents, setContents] = useState<Content[]>([])
  const [selectedContent, setSelectedContent] = useState("")
  const [selectedAccounts, setSelectedAccounts] = useState<string[]>([])
  const [scheduledFor, setScheduledFor] = useState("")
  const [postText, setPostText] = useState("")
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (isOpen) {
      fetchAccounts()
      fetchContents()
      // Set default date to tomorrow at 9 AM
      const tomorrow = new Date()
      tomorrow.setDate(tomorrow.getDate() + 1)
      tomorrow.setHours(9, 0, 0, 0)
      setScheduledFor(tomorrow.toISOString().slice(0, 16))
    }
  }, [isOpen])

  const fetchAccounts = async () => {
    try {
      const response = await fetch("/api/social/accounts")
      const data = await response.json()
      setAccounts(data.accounts || [])
    } catch (error) {
      console.error("Failed to fetch accounts:", error)
    }
  }

  const fetchContents = async () => {
    try {
      const response = await fetch("/api/content/generate?limit=20")
      const data = await response.json()
      setContents(data.contents || [])
    } catch (error) {
      console.error("Failed to fetch contents:", error)
    }
  }

  const handleToggleAccount = (accountId: string) => {
    setSelectedAccounts((prev) =>
      prev.includes(accountId)
        ? prev.filter((id) => id !== accountId)
        : [...prev, accountId]
    )
  }

  const handleContentChange = (contentId: string) => {
    setSelectedContent(contentId)
    const content = contents.find((c) => c.id === contentId)
    if (content) {
      setPostText(content.content)
    }
  }

  const handleSchedule = async () => {
    if (!selectedContent) {
      toast.error("Please select content to schedule")
      return
    }

    if (selectedAccounts.length === 0) {
      toast.error("Please select at least one account")
      return
    }

    if (!scheduledFor) {
      toast.error("Please select a date and time")
      return
    }

    setLoading(true)
    try {
      const response = await fetch("/api/social/schedule", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contentId: selectedContent,
          socialAccountIds: selectedAccounts,
          customText: postText,
          scheduledFor,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Failed to schedule")
      }

      toast.success(`Scheduled ${selectedAccounts.length} post(s)!`)
      onClose()
      setSelectedContent("")
      setSelectedAccounts([])
      setPostText("")
      router.refresh()
    } catch (error: any) {
      toast.error(error.message || "Failed to schedule")
    } finally {
      setLoading(false)
    }
  }

  if (!isOpen) return null

  const getPlatformColor = (platform: string) => {
    const colors: Record<string, string> = {
      TWITTER: "bg-black text-white",
      FACEBOOK: "bg-blue-600 text-white",
      LINKEDIN: "bg-blue-700 text-white",
      INSTAGRAM: "bg-gradient-to-br from-purple-600 via-pink-600 to-orange-500 text-white",
      TIKTOK: "bg-black text-white",
    }
    return colors[platform] || "bg-gray-500 text-white"
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-bold text-gray-900">Schedule Post</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Select Content */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Select Content
            </label>
            <select
              value={selectedContent}
              onChange={(e) => handleContentChange(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">Choose content to schedule...</option>
              {contents.map((content) => (
                <option key={content.id} value={content.id}>
                  {content.title}
                </option>
              ))}
            </select>
          </div>

          {/* Select Accounts */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Select Accounts
            </label>
            {accounts.length === 0 ? (
              <div className="text-center py-8 bg-gray-50 rounded-lg">
                <p className="text-gray-600 mb-2">No connected accounts</p>
                <a
                  href="/dashboard/social"
                  className="text-blue-600 hover:underline text-sm"
                >
                  Connect an account →
                </a>
              </div>
            ) : (
              <div className="space-y-2">
                {accounts.map((account) => (
                  <label
                    key={account.id}
                    className="flex items-center gap-3 p-3 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors"
                  >
                    <input
                      type="checkbox"
                      checked={selectedAccounts.includes(account.id)}
                      onChange={() => handleToggleAccount(account.id)}
                      className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                    />
                    <div className="flex items-center gap-3 flex-1">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center ${getPlatformColor(account.platform)}`}>
                        {account.profileImage ? (
                          <img
                            src={account.profileImage}
                            alt={account.accountName}
                            className="w-8 h-8 rounded-full"
                          />
                        ) : (
                          <span className="text-xs font-bold">
                            {account.platform.charAt(0)}
                          </span>
                        )}
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">
                          {account.accountName}
                        </p>
                        <p className="text-xs text-gray-500">{account.platform}</p>
                      </div>
                    </div>
                  </label>
                ))}
              </div>
            )}
          </div>

          {/* Post Text */}
          {selectedContent && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Post Text
              </label>
              <textarea
                value={postText}
                onChange={(e) => setPostText(e.target.value)}
                rows={6}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter your post text..."
              />
              <p className="text-xs text-gray-500 mt-1">
                {postText.length} characters
              </p>
            </div>
          )}

          {/* Schedule Date/Time */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Schedule For
            </label>
            <input
              type="datetime-local"
              value={scheduledFor}
              onChange={(e) => setScheduledFor(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 p-6 border-t border-gray-200">
          <button
            onClick={onClose}
            className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            disabled={loading}
          >
            Cancel
          </button>
          <button
            onClick={handleSchedule}
            disabled={loading || !selectedContent || selectedAccounts.length === 0}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
          >
            <Calendar className="w-4 h-4" />
            {loading ? "Scheduling..." : "Schedule Post"}
          </button>
        </div>
      </div>
    </div>
  )
}
