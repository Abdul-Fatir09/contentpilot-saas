"use client"

import { useState, useEffect } from "react"
import { X, Save } from "lucide-react"
import { useToast } from "@/components/ToastContainer"

interface EditPostModalProps {
  isOpen: boolean
  onClose: () => void
  post: {
    id: string
    postText: string
    scheduledFor: string
  } | null
  onSuccess: () => void
}

export default function EditPostModal({ isOpen, onClose, post, onSuccess }: EditPostModalProps) {
  const toast = useToast()
  const [postText, setPostText] = useState("")
  const [scheduledFor, setScheduledFor] = useState("")
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (post) {
      setPostText(post.postText)
      const date = new Date(post.scheduledFor)
      setScheduledFor(date.toISOString().slice(0, 16))
    }
  }, [post])

  const handleSave = async () => {
    if (!post) return

    if (!postText.trim()) {
      toast.error("Post text cannot be empty")
      return
    }

    if (!scheduledFor) {
      toast.error("Please select a date and time")
      return
    }

    setLoading(true)
    try {
      const response = await fetch(`/api/social/posts/${post.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          postText,
          scheduledFor,
        }),
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || "Failed to update post")
      }

      toast.success("Post updated successfully!")
      onSuccess()
      onClose()
    } catch (error: any) {
      toast.error(error.message || "Failed to update post")
    } finally {
      setLoading(false)
    }
  }

  if (!isOpen || !post) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-20 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-bold text-gray-900">Edit Scheduled Post</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Post Text */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Post Text
            </label>
            <textarea
              value={postText}
              onChange={(e) => setPostText(e.target.value)}
              rows={8}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Enter your post text..."
            />
            <p className="text-xs text-gray-500 mt-1">
              {postText.length} characters
            </p>
          </div>

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
            onClick={handleSave}
            disabled={loading || !postText.trim()}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
          >
            <Save className="w-4 h-4" />
            {loading ? "Saving..." : "Save Changes"}
          </button>
        </div>
      </div>
    </div>
  )
}
