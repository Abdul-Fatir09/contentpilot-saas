import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"
import Link from "next/link"
import { FileText, Calendar, Eye, Trash2, Plus } from "lucide-react"
import { formatDate } from "@/lib/utils"

export default async function ContentPage() {
  const session = await auth()
  
  const contents = await prisma.content.findMany({
    where: { userId: session!.user!.id },
    include: {
      folder: true,
      _count: {
        select: { socialPosts: true },
      },
    },
    orderBy: { createdAt: "desc" },
    take: 50,
  })

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
    AD_COPY: "bg-orange-100 text-orange-800",
    EMAIL: "bg-green-100 text-green-800",
    PRODUCT_DESCRIPTION: "bg-pink-100 text-pink-800",
  }

  return (
    <div className="p-8">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Content Library</h1>
          <p className="text-gray-600">Manage all your generated content</p>
        </div>
        <Link
          href="/dashboard/content/new"
          className="flex items-center gap-2 rounded-lg bg-blue-600 px-6 py-3 text-white hover:bg-blue-700"
        >
          <Plus className="h-5 w-5" />
          Generate New
        </Link>
      </div>

      {contents.length === 0 ? (
        <div className="rounded-lg bg-white p-12 text-center shadow">
          <FileText className="mx-auto mb-4 h-16 w-16 text-gray-400" />
          <h3 className="mb-2 text-xl font-semibold text-gray-900">No content yet</h3>
          <p className="mb-6 text-gray-600">
            Start by generating your first piece of content with AI
          </p>
          <Link
            href="/dashboard/content/new"
            className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-6 py-3 text-white hover:bg-blue-700"
          >
            <Plus className="h-5 w-5" />
            Generate Content
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {contents.map((content: any) => (
            <div
              key={content.id}
              className="rounded-lg bg-white p-6 shadow transition hover:shadow-md"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="mb-2 flex items-center gap-2">
                    <span
                      className={`rounded-full px-3 py-1 text-xs font-medium ${
                        contentTypeColors[content.type]
                      }`}
                    >
                      {contentTypeLabels[content.type]}
                    </span>
                    {content.folder && (
                      <span
                        className="rounded-full px-3 py-1 text-xs font-medium"
                        style={{
                          backgroundColor: content.folder.color + "20",
                          color: content.folder.color,
                        }}
                      >
                        {content.folder.name}
                      </span>
                    )}
                  </div>
                  
                  <h3 className="mb-2 text-xl font-semibold text-gray-900">
                    {content.title}
                  </h3>
                  
                  <p className="mb-4 line-clamp-2 text-gray-600">
                    {content.content.substring(0, 200)}...
                  </p>
                  
                  <div className="flex items-center gap-6 text-sm text-gray-500">
                    <div className="flex items-center gap-1">
                      <Calendar className="h-4 w-4" />
                      {formatDate(content.createdAt)}
                    </div>
                    {content._count.socialPosts > 0 && (
                      <div className="flex items-center gap-1">
                        <Calendar className="h-4 w-4" />
                        {content._count.socialPosts} scheduled posts
                      </div>
                    )}
                    {content.seoScore && (
                      <div>
                        SEO Score: <span className="font-semibold">{content.seoScore}/100</span>
                      </div>
                    )}
                  </div>
                  
                  {content.keywords.length > 0 && (
                    <div className="mt-3 flex flex-wrap gap-2">
                      {content.keywords.slice(0, 5).map((keyword: string) => (
                        <span
                          key={keyword}
                          className="rounded-full bg-gray-100 px-2 py-1 text-xs text-gray-600"
                        >
                          #{keyword}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
                
                <div className="flex gap-2">
                  <Link
                    href={`/dashboard/content/${content.id}`}
                    className="rounded-lg border border-gray-300 p-2 hover:bg-gray-50 cursor-pointer transition-colors"
                    title="View"
                  >
                    <Eye className="h-5 w-5 text-gray-600" />
                  </Link>
                  <button
                    onClick={() => {
                      if (confirm('Are you sure you want to delete this content?')) {
                        // Delete functionality will be implemented with API route
                        alert('Delete functionality coming soon!');
                      }
                    }}
                    className="rounded-lg border border-red-300 p-2 hover:bg-red-50 cursor-pointer transition-colors"
                    title="Delete"
                  >
                    <Trash2 className="h-5 w-5 text-red-600" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
