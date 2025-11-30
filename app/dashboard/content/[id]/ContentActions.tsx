"use client"

import { Copy, Download } from "lucide-react"
import { useToast } from "@/components/ToastContainer"

interface ContentActionsProps {
  title: string
  content: string
}

export default function ContentActions({ title, content }: ContentActionsProps) {
  const toast = useToast()

  const handleCopy = () => {
    navigator.clipboard.writeText(content)
    toast.success('Content copied to clipboard!')
  }

  const handleDownload = () => {
    const blob = new Blob([content], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `${title}.txt`
    a.click()
    URL.revokeObjectURL(url)
    toast.success('Content downloaded!')
  }

  return (
    <>
      <button
        onClick={handleCopy}
        className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
      >
        <Copy className="w-4 h-4" />
        Copy
      </button>
      <button
        onClick={handleDownload}
        className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
      >
        <Download className="w-4 h-4" />
        Download
      </button>
    </>
  )
}
