"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { ArrowLeft, Save, Sparkles } from "lucide-react"
import Link from "next/link"
import { useToast } from "@/components/ToastContainer"

export default function EditContentPage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const toast = useToast()
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [content, setContent] = useState<any>(null)
  
  const [formData, setFormData] = useState({
    title: "",
    content: "",
    keywords: [] as string[],
  })
  
  const [keywordInput, setKeywordInput] = useState("")

  useEffect(() => {
    fetchContent()
  }, [])

  const fetchContent = async () => {
    try {
      const response = await fetch(`/api/content/${params.id}`)
      if (!response.ok) {
        throw new Error('Content not found')
      }
      const data = await response.json()
      setContent(data)
      setFormData({
        title: data.title,
        content: data.content,
        keywords: data.keywords || [],
      })
    } catch (error) {
      toast.error('Failed to load content')
      router.push('/dashboard/content')
    } finally {
      setLoading(false)
    }
  }

  const handleAddKeyword = () => {
    if (keywordInput.trim() && !formData.keywords.includes(keywordInput.trim())) {
      setFormData({
        ...formData,
        keywords: [...formData.keywords, keywordInput.trim()],
      })
      setKeywordInput("")
    }
  }

  const handleRemoveKeyword = (keyword: string) => {
    setFormData({
      ...formData,
      keywords: formData.keywords.filter((k) => k !== keyword),
    })
  }

  const handleSave = async () => {
    if (!formData.title.trim()) {
      toast.warning('Please enter a title')
      return
    }

    if (!formData.content.trim()) {
      toast.warning('Please enter content')
      return
    }

    setSaving(true)

    try {
      const response = await fetch(`/api/content/${params.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })

      if (!response.ok) {
        throw new Error('Failed to update content')
      }

      toast.success('Content updated successfully!')
      router.push(`/dashboard/content/${params.id}`)
    } catch (error: any) {
      toast.error(error.message || 'Failed to update content')
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <div className="mx-auto mb-4 h-12 w-12 animate-spin rounded-full border-4 border-blue-600 border-t-transparent"></div>
          <p className="text-gray-600">Loading content...</p>
        </div>
      </div>
    )
  }

  const contentTypeLabels: Record<string, string> = {
    BLOG_POST: "Blog Post",
    SOCIAL_MEDIA: "Social Media",
    AD_COPY: "Ad Copy",
    EMAIL: "Email",
    PRODUCT_DESCRIPTION: "Product Description",
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link
            href={`/dashboard/content/${params.id}`}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Edit Content</h1>
            <p className="text-gray-600 mt-1">
              {content ? contentTypeLabels[content.type] : 'Content'}
            </p>
          </div>
        </div>

        <button
          onClick={handleSave}
          disabled={saving}
          className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium"
        >
          {saving ? (
            <>
              <div className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
              Saving...
            </>
          ) : (
            <>
              <Save className="w-5 h-5" />
              Save Changes
            </>
          )}
        </button>
      </div>

      {/* Edit Form */}
      <div className="bg-white rounded-lg border border-gray-200 p-8 space-y-6">
        {/* Title */}
        <div>
          <label htmlFor="title" className="block text-sm font-semibold text-gray-700 mb-2">
            Title
          </label>
          <input
            id="title"
            type="text"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-lg"
            placeholder="Enter content title..."
          />
        </div>

        {/* Keywords */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Keywords
          </label>
          <div className="flex gap-2 mb-3">
            <input
              type="text"
              value={keywordInput}
              onChange={(e) => setKeywordInput(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && (e.preventDefault(), handleAddKeyword())}
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Add keyword and press Enter"
            />
            <button
              type="button"
              onClick={handleAddKeyword}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Add
            </button>
          </div>
          <div className="flex flex-wrap gap-2">
            {formData.keywords.map((keyword) => (
              <span
                key={keyword}
                className="inline-flex items-center gap-1 rounded-full bg-blue-100 px-3 py-1 text-sm text-blue-700"
              >
                {keyword}
                <button
                  type="button"
                  onClick={() => handleRemoveKeyword(keyword)}
                  className="hover:text-blue-900 cursor-pointer"
                >
                  ×
                </button>
              </span>
            ))}
          </div>
        </div>

        {/* Content */}
        <div>
          <label htmlFor="content" className="block text-sm font-semibold text-gray-700 mb-2">
            Content
          </label>
          <textarea
            id="content"
            rows={20}
            value={formData.content}
            onChange={(e) => setFormData({ ...formData, content: e.target.value })}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent font-mono text-sm"
            placeholder="Enter your content here..."
          />
          <div className="flex items-center justify-between mt-2 text-sm text-gray-500">
            <span>{formData.content.split(/\s+/).filter(Boolean).length} words</span>
            <span>{formData.content.length} characters</span>
          </div>
        </div>
      </div>
    </div>
  )
}
