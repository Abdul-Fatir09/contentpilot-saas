import Link from "next/link"
import { FileQuestion } from "lucide-react"

export default function NotFound() {
  return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <div className="text-center">
        <FileQuestion className="w-16 h-16 text-gray-400 mx-auto mb-4" />
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Content Not Found</h2>
        <p className="text-gray-600 mb-6">
          The content you're looking for doesn't exist or has been deleted.
        </p>
        <Link
          href="/dashboard/content"
          className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
        >
          Back to Content Library
        </Link>
      </div>
    </div>
  )
}
