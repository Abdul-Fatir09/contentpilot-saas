import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"
import Link from "next/link"
import { Plus } from "lucide-react"
import ContentList from "@/components/ContentList"

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

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Content Library</h1>
          <p className="text-gray-600 mt-1">Manage all your generated content</p>
        </div>
        <Link
          href="/dashboard/content/new"
          className="flex items-center gap-2 rounded-lg bg-blue-600 px-6 py-3 text-white hover:bg-blue-700 transition-colors"
        >
          <Plus className="h-5 w-5" />
          Generate New
        </Link>
      </div>

      <ContentList contents={contents} />
    </div>
  )
}
