import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"
import { notFound, redirect } from "next/navigation"
import { ArrowLeft, Calendar, Tag, Edit } from "lucide-react"
import Link from "next/link"
import { formatDate } from "@/lib/utils"
import ContentActions from "./ContentActions"
import PostToSocial from "./PostToSocial"

export default async function ContentDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const session = await auth()
  
  if (!session) {
    redirect("/auth/signin")
  }

  const { id } = await params

  const content = await prisma.content.findUnique({
    where: { id },
    include: {
      folder: true,
      _count: {
        select: { socialPosts: true },
      },
    },
  })

  if (!content) {
    notFound()
  }

  if (content.userId !== session.user.id) {
    notFound()
  }

  const contentTypeLabels: Record<string, string> = {
    BLOG_POST: "Blog Post",
    SOCIAL_MEDIA: "Social Media",
    AD_COPY: "Ad Copy",
    EMAIL: "Email",
    PRODUCT_DESCRIPTION: "Product Description",
  }

  const contentTypeColors: Record<string, string> = {
    BLOG_POST: "bg-blue-100 text-blue-800",
    SOCIAL_MEDIA: "bg-purple-100 text-purple-800",
    AD_COPY: "bg-green-100 text-green-800",
    EMAIL: "bg-orange-100 text-orange-800",
    PRODUCT_DESCRIPTION: "bg-pink-100 text-pink-800",
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link
            href="/dashboard/content"
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">{content.title}</h1>
            <div className="flex items-center gap-3 mt-2">
              <span className={`px-3 py-1 rounded-full text-xs font-medium ${contentTypeColors[content.type]}`}>
                {contentTypeLabels[content.type]}
              </span>
              {content.folder && (
                <span className="px-3 py-1 bg-gray-100 text-gray-600 rounded-full text-xs font-medium">
                  {content.folder.name}
                </span>
              )}
              <span className="text-sm text-gray-500 flex items-center gap-1">
                <Calendar className="w-4 h-4" />
                {formatDate(content.createdAt)}
              </span>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-3">
          <ContentActions title={content.title} content={content.content} />
          <PostToSocial 
            contentId={content.id} 
            contentText={content.content}
            buttonText="Post"
            buttonClassName="flex items-center gap-2 px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
          />
          <Link
            href={`/dashboard/content/${content.id}/edit`}
            className="flex items-center gap-2 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Edit className="w-4 h-4" />
            Edit
          </Link>
        </div>
      </div>

      {/* Content Card */}
      <div className="bg-white rounded-lg border border-gray-200 p-8">
        {/* Metadata */}
        {(content.keywords.length > 0 || content.seoScore) && (
          <div className="mb-6 pb-6 border-b border-gray-200">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Keywords */}
              {content.keywords.length > 0 && (
                <div>
                  <h3 className="text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                    <Tag className="w-4 h-4" />
                    Keywords
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {content.keywords.map((keyword) => (
                      <span
                        key={keyword}
                        className="px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-sm"
                      >
                        {keyword}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* SEO Score */}
              {content.seoScore && (
                <div>
                  <h3 className="text-sm font-semibold text-gray-700 mb-2">SEO Score</h3>
                  <div className="flex items-center gap-3">
                    <div className="flex-1 h-3 bg-gray-200 rounded-full overflow-hidden">
                      <div
                        className={`h-full ${
                          content.seoScore >= 70
                            ? "bg-green-500"
                            : content.seoScore >= 40
                            ? "bg-yellow-500"
                            : "bg-red-500"
                        }`}
                        style={{ width: `${content.seoScore}%` }}
                      />
                    </div>
                    <span className="text-lg font-bold text-gray-900">{content.seoScore}/100</span>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Meta Information */}
        {(content.metaTitle || content.metaDescription) && (
          <div className="mb-6 pb-6 border-b border-gray-200">
            <h3 className="text-sm font-semibold text-gray-700 mb-3">SEO Metadata</h3>
            <div className="space-y-3">
              {content.metaTitle && (
                <div>
                  <p className="text-xs text-gray-500 mb-1">Meta Title</p>
                  <p className="text-sm text-gray-900">{content.metaTitle}</p>
                </div>
              )}
              {content.metaDescription && (
                <div>
                  <p className="text-xs text-gray-500 mb-1">Meta Description</p>
                  <p className="text-sm text-gray-900">{content.metaDescription}</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Main Content */}
        <div>
          <h3 className="text-sm font-semibold text-gray-700 mb-4">Content</h3>
          <div className="prose max-w-none">
            <div className="whitespace-pre-wrap text-gray-800 leading-relaxed">
              {content.content}
            </div>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <p className="text-sm text-gray-600 mb-1">Word Count</p>
          <p className="text-2xl font-bold text-gray-900">
            {content.content.split(/\s+/).filter(Boolean).length}
          </p>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <p className="text-sm text-gray-600 mb-1">Character Count</p>
          <p className="text-2xl font-bold text-gray-900">{content.content.length}</p>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <p className="text-sm text-gray-600 mb-1">Scheduled Posts</p>
          <p className="text-2xl font-bold text-gray-900">{content._count.socialPosts}</p>
        </div>
      </div>
    </div>
  )
}
