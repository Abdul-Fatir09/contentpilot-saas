"use client"

import { useState } from "react"
import { Calendar, Edit, Trash2, ExternalLink, Clock, CheckCircle, XCircle, AlertCircle } from "lucide-react"
import { useToast } from "@/components/ToastContainer"
import { ConfirmModal } from "@/components/ConfirmModal"

interface SocialPost {
  id: string
  platform: string
  postText: string
  status: string
  scheduledFor: Date
  publishedAt: Date | null
  platformPostId: string | null
  errorMessage: string | null
  content: {
    id: string
    title: string
    type: string
  }
  socialAccount: {
    id: string
    platform: string
    accountName: string
    profileImage: string | null
  }
}

export default function PostsManager({ initialPosts }: { initialPosts: any[] }) {
  const toast = useToast()
  const [posts, setPosts] = useState<SocialPost[]>(initialPosts)
  const [filter, setFilter] = useState<string>("all")
  const [deleteModal, setDeleteModal] = useState(false)
  const [postToDelete, setPostToDelete] = useState<SocialPost | null>(null)
  const [deleting, setDeleting] = useState(false)
  const [editingPost, setEditingPost] = useState<SocialPost | null>(null)
  const [editText, setEditText] = useState("")

  const filteredPosts = posts.filter((post) => {
    if (filter === "all") return true
    return post.status === filter.toUpperCase()
  })

  const handleDeleteClick = (post: SocialPost) => {
    setPostToDelete(post)
    setDeleteModal(true)
  }

  const handleConfirmDelete = async () => {
    if (!postToDelete) return

    setDeleting(true)
    try {
      const response = await fetch(`/api/social/posts/${postToDelete.id}`, {
        method: "DELETE",
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || "Failed to delete post")
      }

      setPosts(posts.filter((p) => p.id !== postToDelete.id))
      toast.success("Post deleted successfully")
    } catch (error: any) {
      toast.error(error.message || "Failed to delete post")
    } finally {
      setDeleting(false)
      setDeleteModal(false)
      setPostToDelete(null)
    }
  }

  const handleEditClick = (post: SocialPost) => {
    setEditingPost(post)
    setEditText(post.postText)
  }

  const handleSaveEdit = async () => {
    if (!editingPost) return

    try {
      const response = await fetch(`/api/social/posts/${editingPost.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ postText: editText }),
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || "Failed to update post")
      }

      const updatedPost = await response.json()
      setPosts(posts.map((p) => (p.id === editingPost.id ? { ...p, postText: editText } : p)))
      toast.success("Post updated successfully")
      setEditingPost(null)
    } catch (error: any) {
      toast.error(error.message || "Failed to update post")
    }
  }

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

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "PUBLISHED":
        return <CheckCircle className="w-5 h-5 text-green-600" />
      case "SCHEDULED":
        return <Clock className="w-5 h-5 text-blue-600" />
      case "FAILED":
        return <XCircle className="w-5 h-5 text-red-600" />
      default:
        return <AlertCircle className="w-5 h-5 text-gray-600" />
    }
  }

  const getTwitterPostUrl = (post: SocialPost) => {
    if (post.platform === "TWITTER" && post.platformPostId) {
      return `https://twitter.com/${post.socialAccount.accountName}/status/${post.platformPostId}`
    }
    return null
  }

  return (
    <div className="space-y-6">
      <ConfirmModal
        isOpen={deleteModal}
        onClose={() => {
          setDeleteModal(false)
          setPostToDelete(null)
        }}
        onConfirm={handleConfirmDelete}
        title="Delete Post"
        message={`Are you sure you want to delete this ${
          postToDelete?.status === "PUBLISHED" ? "published" : "scheduled"
        } post? ${
          postToDelete?.status === "PUBLISHED"
            ? "Note: This will only delete from your dashboard, not from the social media platform."
            : ""
        }`}
        confirmText="Delete"
        confirmColor="red"
        isLoading={deleting}
      />

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Social Media Posts</h1>
          <p className="text-gray-600 mt-1">Manage your scheduled and published posts</p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex gap-2">
        {["all", "scheduled", "published", "failed"].map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              filter === f
                ? "bg-blue-600 text-white"
                : "bg-white border border-gray-300 text-gray-700 hover:bg-gray-50"
            }`}
          >
            {f.charAt(0).toUpperCase() + f.slice(1)}
          </button>
        ))}
      </div>

      {/* Posts List */}
      <div className="space-y-4">
        {filteredPosts.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-lg border border-gray-200">
            <Calendar className="w-12 h-12 text-gray-400 mx-auto mb-3" />
            <h3 className="text-lg font-semibold text-gray-900 mb-1">No posts found</h3>
            <p className="text-gray-600">
              {filter === "all" 
                ? "You haven't created any social media posts yet." 
                : `No ${filter} posts found.`}
            </p>
          </div>
        ) : (
          filteredPosts.map((post) => (
            <div key={post.id} className="bg-white rounded-lg border border-gray-200 p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  {post.socialAccount.profileImage ? (
                    <img
                      src={post.socialAccount.profileImage}
                      alt={post.socialAccount.accountName}
                      className="w-12 h-12 rounded-full"
                    />
                  ) : (
                    <div className={`w-12 h-12 rounded-full ${getPlatformColor(post.platform)} flex items-center justify-center font-bold`}>
                      {post.platform.charAt(0)}
                    </div>
                  )}
                  <div>
                    <div className="flex items-center gap-2">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${getPlatformColor(post.platform)}`}>
                        {post.platform}
                      </span>
                      <span className="text-sm text-gray-600">@{post.socialAccount.accountName}</span>
                    </div>
                    <div className="flex items-center gap-2 mt-1">
                      {getStatusIcon(post.status)}
                      <span className="text-sm font-medium text-gray-900">{post.status}</span>
                      <span className="text-sm text-gray-500">
                        {post.status === "PUBLISHED" && post.publishedAt
                          ? `Published ${new Date(post.publishedAt).toLocaleString()}`
                          : `Scheduled for ${new Date(post.scheduledFor).toLocaleString()}`}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  {post.status === "PUBLISHED" && getTwitterPostUrl(post) && (
                    <a
                      href={getTwitterPostUrl(post)!}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                      title="View on Twitter"
                    >
                      <ExternalLink className="w-5 h-5 text-gray-600" />
                    </a>
                  )}
                  {post.status === "SCHEDULED" && (
                    <button
                      onClick={() => handleEditClick(post)}
                      className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                      title="Edit post"
                    >
                      <Edit className="w-5 h-5 text-gray-600" />
                    </button>
                  )}
                  <button
                    onClick={() => handleDeleteClick(post)}
                    className="p-2 hover:bg-red-50 rounded-lg transition-colors"
                    title="Delete post"
                  >
                    <Trash2 className="w-5 h-5 text-red-600" />
                  </button>
                </div>
              </div>

              {editingPost?.id === post.id ? (
                <div className="space-y-3">
                  <textarea
                    value={editText}
                    onChange={(e) => setEditText(e.target.value)}
                    rows={4}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                  <div className="flex gap-2">
                    <button
                      onClick={handleSaveEdit}
                      className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                    >
                      Save Changes
                    </button>
                    <button
                      onClick={() => setEditingPost(null)}
                      className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <div className="bg-gray-50 rounded-lg p-4">
                  <p className="text-gray-800 whitespace-pre-wrap">{post.postText}</p>
                </div>
              )}

              {post.errorMessage && (
                <div className="mt-3 p-3 bg-red-50 border border-red-200 rounded-lg">
                  <p className="text-sm text-red-800">
                    <strong>Error:</strong> {post.errorMessage}
                  </p>
                </div>
              )}

              <div className="mt-3 text-xs text-gray-500">
                Content: {post.content.title}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}
