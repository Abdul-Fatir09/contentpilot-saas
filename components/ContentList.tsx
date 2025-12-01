"use client"

import Link from "next/link"
import { FileText, Eye, Trash2 } from "lucide-react"
import { formatDate } from "@/lib/utils"
import type { Content, Folder } from "@prisma/client"
import { useToast } from "./ToastContainer"
import { useState } from "react"
import { useRouter } from "next/navigation"
import ConfirmModal from "./ConfirmModal"

type ContentWithRelations = Content & {
  folder: Folder | null
  _count: {
    socialPosts: number
  }
}

interface ContentListProps {
  contents: ContentWithRelations[]
}

export default function ContentList({ contents: initialContents }: ContentListProps) {
  const [contents, setContents] = useState(initialContents)
  const [deletingId, setDeletingId] = useState<string | null>(null)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [contentToDelete, setContentToDelete] = useState<string | null>(null)
  const toast = useToast()
  const router = useRouter()
  const contentTypeLabels: Record<string, string> = {
    BLOG_POST: "Blog Post",
    SOCIAL_MEDIA: "Social Media",
    AD_COPY: "Ad Copy",
    EMAIL: "Email",
    PRODUCT_DESCRIPTION: "Product",
  }

  const contentTypeColors: Record<string, string> = {
    BLOG_POST: "bg-blue-100 text-blue-800",
    SOCIAL_MEDIA: "bg-purple-100 text-purple-800",
    AD_COPY: "bg-green-100 text-green-800",
    EMAIL: "bg-orange-100 text-orange-800",
    PRODUCT_DESCRIPTION: "bg-pink-100 text-pink-800",
  }

  const handleDeleteClick = (contentId: string) => {
    setContentToDelete(contentId)
    setShowDeleteModal(true)
  }

  const handleConfirmDelete = async () => {
    if (!contentToDelete) return

    setDeletingId(contentToDelete)

    try {
      const response = await fetch(`/api/content/${contentToDelete}`, {
        method: 'DELETE',
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || 'Failed to delete content')
      }

      // Remove from local state
      setContents(contents.filter(c => c.id !== contentToDelete))
      toast.success('Content deleted successfully!')
      
      // Refresh the page data
      router.refresh()
    } catch (error: any) {
      console.error('Delete error:', error)
      toast.error(error.message || 'Failed to delete content')
    } finally {
      setDeletingId(null)
      setShowDeleteModal(false)
      setContentToDelete(null)
    }
  }

  if (contents.length === 0) {
    return (
      <div className="text-center py-16 bg-white rounded-lg border border-gray-200">
        <FileText className="mx-auto h-16 w-16 text-gray-400 mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">No content yet</h3>
        <p className="text-gray-500 mb-6">
          Get started by creating your first piece of content
        </p>
        <Link
          href="/dashboard/content/new"
          className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
        >
          Create Content
  return (
    <>
      <ConfirmModal
        isOpen={showDeleteModal}
        onClose={() => {
          setShowDeleteModal(false)
          setContentToDelete(null)
        }}
        onConfirm={handleConfirmDelete}
        title="Delete Content"
        message="Are you sure you want to delete this content? This action cannot be undone."
        confirmText="Delete"
        isLoading={deletingId !== null}
      />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {contents.map((content) => (
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {contents.map((content) => (
        <div
          key={content.id}
          className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-md transition-shadow"
        >
          <div className="flex items-start justify-between mb-4">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <span className={"px-3 py-1 rounded-full text-xs font-medium " + (contentTypeColors[content.type] || "bg-gray-100 text-gray-800")}>
                  {contentTypeLabels[content.type] || content.type}
                </span>
                {content.folder && (
                  <span className="px-2 py-1 bg-gray-100 text-gray-600 rounded text-xs">
                    {content.folder.name}
                  </span>
                )}
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2">
                {content.title}
              </h3>
            </div>
          </div>

          <p className="text-gray-600 text-sm mb-4 line-clamp-3">
            {content.content}
          </p>
              <button
                onClick={() => handleDeleteClick(content.id)}
                disabled={deletingId === content.id}
                className="rounded-lg border border-red-300 p-2 hover:bg-red-50 cursor-pointer transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                title="Delete"
              >
                <Trash2 className="h-5 w-5 text-red-600" />
              </button>
            </div>
          </div>
        </div>
      ))}
      </div>
    </>
  )
}             </Link>
              <button
                onClick={() => handleDelete(content.id)}
                disabled={deletingId === content.id}
                className="rounded-lg border border-red-300 p-2 hover:bg-red-50 cursor-pointer transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                title="Delete"
              >
                {deletingId === content.id ? (
                  <div className="h-5 w-5 animate-spin rounded-full border-2 border-red-600 border-t-transparent"></div>
                ) : (
                  <Trash2 className="h-5 w-5 text-red-600" />
                )}
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}