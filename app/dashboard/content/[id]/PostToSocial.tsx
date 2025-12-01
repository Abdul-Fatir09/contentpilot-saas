"use client"

import { useState, useEffect } from "react"
import { Send, X, Calendar } from "lucide-react"
import { useToast } from "@/components/ToastContainer"

interface SocialAccount {
  id: string
  platform: string
  accountName: string
  profileImage: string | null
}

interface PostToSocialProps {
  contentId: string
  contentText: string
  buttonText?: string
  buttonClassName?: string
  icon?: React.ReactNode
  forceSchedule?: boolean
}

export default function PostToSocial({
  contentId,
  contentText,
  buttonText = "Post to Social Media",
  buttonClassName = "flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors",
  icon,
  forceSchedule = false,
}: PostToSocialProps) {
  const toast = useToast()
  const [isOpen, setIsOpen] = useState(false)
  const [accounts, setAccounts] = useState<SocialAccount[]>([])
  const [selectedAccounts, setSelectedAccounts] = useState<string[]>([])
  const [postText, setPostText] = useState(contentText)
  const [scheduledFor, setScheduledFor] = useState("")
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (isOpen) {
      fetchAccounts()
      if (forceSchedule && !scheduledFor) {
        const defaultTime = new Date()
        defaultTime.setHours(defaultTime.getHours() + 1)
        setScheduledFor(defaultTime.toISOString().slice(0, 16))
      }
    }
  }, [isOpen, forceSchedule])

  const fetchAccounts = async () => {
    try {
      const response = await fetch("/api/social/accounts")
      const data = await response.json()
      setAccounts(data.accounts || [])
    } catch (error) {
      console.error("Failed to fetch accounts:", error)
    }
  }

  const handleToggleAccount = (accountId: string) => {
    setSelectedAccounts((prev) =>
      prev.includes(accountId)
        ? prev.filter((id) => id !== accountId)
        : [...prev, accountId]
    )
  }

  const handlePostNow = async () => {
    if (selectedAccounts.length === 0) {
      toast.error("Please select at least one account")
      return
    }

    setLoading(true)
    try {
      const response = await fetch("/api/social/post-now", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contentId,
          socialAccountIds: selectedAccounts,
          postText,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Failed to post")
      }

      toast.success(`Posted to ${selectedAccounts.length} account(s)!`)
      setIsOpen(false)
      setSelectedAccounts([])
    } catch (error: any) {
      toast.error(error.message || "Failed to post")
    } finally {
      setLoading(false)
    }
  }

  const handleSchedule = async () => {
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
          contentId,
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
      setIsOpen(false)
      setSelectedAccounts([])
      setScheduledFor("")
    } catch (error: any) {
      toast.error(error.message || "Failed to schedule")
    } finally {
      setLoading(false)
    }
  }

  const getPlatformColor = (platform: string) => {
    const colors: Record<string, string> = {
      TWITTER: "bg-black text-white",
      FACEBOOK: "bg-blue-600 text-white",
      LINKEDIN: "bg-blue-700 text-white",
      INSTAGRAM:
        "bg-gradient-to-br from-purple-600 via-pink-600 to-orange-500 text-white",
      TIKTOK: "bg-black text-white",
    }
    return colors[platform] || "bg-gray-500 text-white"
  }

  return (
    <>
      <button onClick={() => setIsOpen(true)} className={buttonClassName}>
        {icon || <Send className="w-4 h-4" />}
        {buttonText}
      </button>

      {isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h2 className="text-xl font-bold text-gray-900">
                Post to Social Media
              </h2>
              <button
                onClick={() => setIsOpen(false)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-6">
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
                          {account.profileImage ? (
                            <img
                              src={account.profileImage}
                              alt={account.accountName}
                              className="w-8 h-8 rounded-full"
                            />
                          ) : (
                            <div
                              className={`w-8 h-8 rounded-full ${getPlatformColor(
                                account.platform
                              )}`}
                            />
                          )}
                          <div>
                            <p className="font-medium text-gray-900">
                              {account.accountName}
                            </p>
                            <p className="text-xs text-gray-500">
                              {account.platform}
                            </p>
                          </div>
                        </div>
                      </label>
                    ))}
                  </div>
                )}
              </div>

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

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Schedule (Optional)
                </label>
                <input
                  type="datetime-local"
                  value={scheduledFor}
                  onChange={(e) => setScheduledFor(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 p-6 border-t border-gray-200">
              <button
                onClick={() => setIsOpen(false)}
                className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                disabled={loading}
              >
                Cancel
              </button>
              {scheduledFor || forceSchedule ? (
                <button
                  onClick={handleSchedule}
                  disabled={loading || selectedAccounts.length === 0 || !scheduledFor}
                  className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
                >
                  <Calendar className="w-4 h-4" />
                  {loading ? "Scheduling..." : "Schedule Post"}
                </button>
              ) : (
                <button
                  onClick={handlePostNow}
                  disabled={loading || selectedAccounts.length === 0}
                  className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50"
                >
                  <Send className="w-4 h-4" />
                  {loading ? "Posting..." : "Post Now"}
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  )
}
