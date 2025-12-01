"use client"

import { useState, useEffect, Suspense } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Sparkles, FileText, Twitter, Mail, ShoppingBag, Megaphone, Calendar, Send } from "lucide-react"
import { useToast } from "@/components/ToastContainer"
import PostToSocial from "../[id]/PostToSocial"

function NewContentForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const toast = useToast()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [showScheduleModal, setShowScheduleModal] = useState(false)
  
  const [formData, setFormData] = useState({
    type: "blog" as "blog" | "social" | "ad" | "email" | "product",
    topic: "",
    keywords: [] as string[],
    tone: "professional",
    targetAudience: "",
    length: "medium" as "short" | "medium" | "long",
    platform: "twitter" as "twitter" | "facebook" | "linkedin" | "instagram",
    additionalContext: "",
  })

  const [keywordInput, setKeywordInput] = useState("")
  const [generatedContent, setGeneratedContent] = useState<any>(null)

  // Pre-fill topic from URL parameter
  useEffect(() => {
    const topicParam = searchParams.get('topic')
    const typeParam = searchParams.get('type')
    if (topicParam) {
      setFormData(prev => ({ 
        ...prev, 
        topic: topicParam,
        ...(typeParam && { type: typeParam as any })
      }))
    }
    
    // Check for template in localStorage
    if (typeof window !== 'undefined') {
      const template = localStorage.getItem('contentTemplate')
      if (template) {
        setFormData(prev => ({ ...prev, additionalContext: template }))
        localStorage.removeItem('contentTemplate')
      }
    }
  }, [searchParams])

  const contentTypes = [
    { value: "blog", label: "Blog Post", icon: FileText },
    { value: "social", label: "Social Media", icon: Twitter },
    { value: "ad", label: "Ad Copy", icon: Megaphone },
    { value: "email", label: "Email Campaign", icon: Mail },
    { value: "product", label: "Product Description", icon: ShoppingBag },
  ]

  const tones = [
    "professional",
    "casual",
    "friendly",
    "persuasive",
    "informative",
    "humorous",
  ]

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

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setLoading(true)
    setGeneratedContent(null)

    try {
      const response = await fetch("/api/content/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Failed to generate content")
      }

      setGeneratedContent(data.content)
      toast.success("Content generated and saved to library!")
      
      // Mark onboarding step as complete
      fetch("/api/onboarding", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ step: "content" }),
      }).catch((err) => console.error("Failed to update onboarding:", err))
    } catch (err: any) {
      setError(err.message)
      toast.error(err.message || "Failed to generate content")
    } finally {
      setLoading(false)
    }
  }

  const getPlatformName = () => {
    return formData.platform.charAt(0).toUpperCase() + formData.platform.slice(1)
  }

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Generate Content</h1>
        <p className="text-gray-600">Create AI-powered content in seconds</p>
      </div>

      <div className="grid gap-8 lg:grid-cols-2">
        {/* Form */}
        <div className="rounded-lg bg-white p-6 shadow">
          <form onSubmit={handleGenerate} className="space-y-6">
            {/* Content Type */}
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">
                Content Type
              </label>
              <div className="grid grid-cols-2 gap-3">
                {contentTypes.map((type) => (
                  <button
                    key={type.value}
                    type="button"
                    onClick={() => setFormData({ ...formData, type: type.value as any })}
                    className={`flex items-center gap-2 rounded-lg border-2 p-3 transition cursor-pointer ${
                      formData.type === type.value
                        ? "border-blue-600 bg-blue-50 text-blue-600"
                        : "border-gray-200 hover:border-gray-300"
                    }`}
                  >
                    <type.icon className="h-5 w-5" />
                    <span className="text-sm font-medium">{type.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Topic */}
            <div>
              <label htmlFor="topic" className="block text-sm font-medium text-gray-700">
                Topic / Subject
              </label>
              <input
                id="topic"
                type="text"
                required
                value={formData.topic}
                onChange={(e) => setFormData({ ...formData, topic: e.target.value })}
                className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                placeholder="e.g., 'Benefits of AI in Marketing'"
              />
            </div>

            {/* Keywords */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Keywords (Optional)
              </label>
              <div className="flex gap-2 mb-2">
                <input
                  type="text"
                  value={keywordInput}
                  onChange={(e) => setKeywordInput(e.target.value)}
                  onKeyPress={(e) => e.key === "Enter" && (e.preventDefault(), handleAddKeyword())}
                  className="flex-1 rounded-lg border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  placeholder="Add keyword and press Enter"
                />
                <button
                  type="button"
                  onClick={handleAddKeyword}
                  className="rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 cursor-pointer transition-colors"
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

            {/* Tone */}
            <div>
              <label htmlFor="tone" className="block text-sm font-medium text-gray-700">
                Tone
              </label>
              <select
                id="tone"
                value={formData.tone}
                onChange={(e) => setFormData({ ...formData, tone: e.target.value })}
                className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              >
                {tones.map((tone) => (
                  <option key={tone} value={tone}>
                    {tone.charAt(0).toUpperCase() + tone.slice(1)}
                  </option>
                ))}
              </select>
            </div>

            {/* Target Audience */}
            <div>
              <label htmlFor="audience" className="block text-sm font-medium text-gray-700">
                Target Audience (Optional)
              </label>
              <input
                id="audience"
                type="text"
                value={formData.targetAudience}
                onChange={(e) => setFormData({ ...formData, targetAudience: e.target.value })}
                className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                placeholder="e.g., 'Small business owners'"
              />
            </div>

            {/* Length (for blog/email) */}
            {(formData.type === "blog" || formData.type === "email") && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Content Length
                </label>
                <div className="grid grid-cols-3 gap-3">
                  {(["short", "medium", "long"] as const).map((len) => (
                    <button
                      key={len}
                      type="button"
                      onClick={() => setFormData({ ...formData, length: len })}
                      className={`rounded-lg border-2 py-2 text-sm font-medium transition cursor-pointer ${
                        formData.length === len
                          ? "border-blue-600 bg-blue-50 text-blue-600"
                          : "border-gray-200 hover:border-gray-300"
                      }`}
                    >
                      {len.charAt(0).toUpperCase() + len.slice(1)}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Platform (for social) */}
            {formData.type === "social" && (
              <div>
                <label htmlFor="platform" className="block text-sm font-medium text-gray-700">
                  Platform
                </label>
                <select
                  id="platform"
                  value={formData.platform}
                  onChange={(e) => setFormData({ ...formData, platform: e.target.value as any })}
                  className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                >
                  <option value="twitter">Twitter</option>
                  <option value="facebook">Facebook</option>
                  <option value="linkedin">LinkedIn</option>
                  <option value="instagram">Instagram</option>
                </select>
              </div>
            )}

            {/* Additional Context */}
            <div>
              <label htmlFor="context" className="block text-sm font-medium text-gray-700">
                Additional Context (Optional)
              </label>
              <textarea
                id="context"
                rows={3}
                value={formData.additionalContext}
                onChange={(e) => setFormData({ ...formData, additionalContext: e.target.value })}
                className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                placeholder="Any specific requirements or details..."
              />
            </div>

            {error && (
              <div className="rounded-lg bg-red-50 p-3 text-sm text-red-600">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="flex w-full items-center justify-center gap-2 rounded-lg bg-blue-600 px-6 py-3 text-white hover:bg-blue-700 disabled:opacity-50"
            >
              <Sparkles className="h-5 w-5" />
              {loading ? "Generating..." : "Generate Content"}
            </button>
          </form>
        </div>

        {/* Preview */}
        <div className="rounded-lg bg-white p-6 shadow">
          <h2 className="mb-4 text-xl font-bold text-gray-900">Preview</h2>
          
          {!generatedContent && !loading && (
            <div className="flex h-64 items-center justify-center text-gray-400">
              <div className="text-center">
                <Sparkles className="mx-auto mb-2 h-12 w-12" />
                <p>Your generated content will appear here</p>
              </div>
            </div>
          )}

          {loading && (
            <div className="flex h-64 items-center justify-center">
              <div className="text-center">
                <div className="mx-auto mb-4 h-12 w-12 animate-spin rounded-full border-4 border-blue-600 border-t-transparent"></div>
                <p className="text-gray-600">Generating your content...</p>
              </div>
            </div>
          )}

          {generatedContent && (
            <div className="space-y-4">
              {generatedContent.title && (
                <div>
                  <h3 className="text-sm font-medium text-gray-700 mb-1">Title</h3>
                  <p className="text-lg font-semibold text-gray-900">{generatedContent.title}</p>
                </div>
              )}
              
              <div>
                <h3 className="text-sm font-medium text-gray-700 mb-1">Content</h3>
                <div className="prose max-w-none whitespace-pre-wrap rounded-lg bg-gray-50 p-4">
                  {generatedContent.content}
                </div>
              </div>

              {generatedContent.seoScore && (
                <div>
                  <h3 className="text-sm font-medium text-gray-700 mb-1">SEO Score</h3>
                  <div className="flex items-center gap-2">
                    <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                      <div
                        className={`h-full ${
                          generatedContent.seoScore >= 70 ? "bg-green-500" :
                          generatedContent.seoScore >= 40 ? "bg-yellow-500" : "bg-red-500"
                        }`}
                        style={{ width: `${generatedContent.seoScore}%` }}
                      />
                    </div>
                    <span className="text-sm font-semibold">{generatedContent.seoScore}/100</span>
                  </div>
                </div>
              )}

              <div className="flex gap-3">
                {formData.type === "social" && generatedContent && (
                  <>
                    <PostToSocial 
                      contentId={generatedContent.id} 
                      contentText={generatedContent.content}
                      buttonText={`Post to ${getPlatformName()}`}
                      buttonClassName="flex-1 flex items-center justify-center gap-2 rounded-lg bg-blue-600 px-6 py-3 text-white hover:bg-blue-700"
                      icon={<Send className="w-4 h-4" />}
                    />
                    <PostToSocial 
                      contentId={generatedContent.id} 
                      contentText={generatedContent.content}
                      buttonText="Schedule Post"
                      buttonClassName="flex-1 flex items-center justify-center gap-2 rounded-lg bg-purple-600 px-6 py-3 text-white hover:bg-purple-700"
                      icon={<Calendar className="w-4 h-4" />}
                      forceSchedule={true}
                    />
                  </>
                )}
                
                {formData.type !== "social" && (
                  <PostToSocial 
                    contentId={generatedContent.id} 
                    contentText={generatedContent.content}
                    buttonText="Post"
                    buttonClassName="flex-1 flex items-center justify-center gap-2 rounded-lg bg-blue-600 px-6 py-3 text-white hover:bg-blue-700"
                    icon={<Send className="w-4 h-4" />}
                  />
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default function NewContentPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <NewContentForm />
    </Suspense>
  )
}
