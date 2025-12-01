"use client"

import { useState } from "react"
import { FileText, Sparkles, Copy } from "lucide-react"
import { useToast } from "@/components/ToastContainer"
import { useRouter } from "next/navigation"

const templates = [
  {
    id: "product-launch",
    name: "Product Launch",
    category: "Social Media",
    platform: "twitter",
    description: "Announce a new product or feature",
    template: "🚀 Excited to announce [Product Name]!\n\n✨ [Key Feature 1]\n💡 [Key Feature 2]\n🎯 [Key Feature 3]\n\nLearn more: [URL]\n\n#ProductLaunch #Innovation",
  },
  {
    id: "customer-testimonial",
    name: "Customer Testimonial",
    category: "Social Media",
    platform: "linkedin",
    description: "Share customer success stories",
    template: "💬 What our customers are saying:\n\n\"[Customer Quote]\"\n\n- [Customer Name], [Company]\n\nWant similar results? Let's talk: [CTA Link]\n\n#CustomerSuccess #Testimonial",
  },
  {
    id: "blog-promotion",
    name: "Blog Post Promotion",
    category: "Social Media",
    platform: "twitter",
    description: "Promote your latest blog post",
    template: "📝 New blog post alert!\n\n[Blog Title]\n\n[One-sentence summary]\n\nRead more: [URL]\n\n#Blog #ContentMarketing",
  },
  {
    id: "tips-thread",
    name: "Tips Thread",
    category: "Social Media",
    platform: "twitter",
    description: "Share valuable tips in a thread",
    template: "🧵 [X] tips for [Topic]:\n\n1/ [Tip 1]\n\n2/ [Tip 2]\n\n3/ [Tip 3]\n\n[Continue...]\n\n#Tips #HowTo",
  },
  {
    id: "event-announcement",
    name: "Event Announcement",
    category: "Social Media",
    platform: "linkedin",
    description: "Promote an upcoming event",
    template: "📅 Save the date!\n\nJoin us for [Event Name]\n\n📍 [Location/Virtual]\n🗓️ [Date & Time]\n\n[Brief description]\n\nRegister now: [URL]\n\n#Event #Webinar",
  },
  {
    id: "motivational-quote",
    name: "Motivational Quote",
    category: "Social Media",
    platform: "instagram",
    description: "Share inspiring content",
    template: "💫 Monday Motivation\n\n\"[Quote]\"\n\n[Brief reflection or call-to-action]\n\n#Motivation #MondayVibes",
  },
  {
    id: "email-newsletter",
    name: "Weekly Newsletter",
    category: "Email",
    platform: "email",
    description: "Weekly email template",
    template: "Subject: [Your Weekly Update from [Company Name]]\n\nHi [First Name],\n\nHere's what's new this week:\n\n🎯 [Main Topic 1]\n[Brief description]\n[Read more link]\n\n📚 [Main Topic 2]\n[Brief description]\n[Read more link]\n\n💡 Quick Tip: [Actionable tip]\n\nThat's all for this week!\n\nBest regards,\n[Your Name]",
  },
  {
    id: "ad-copy-service",
    name: "Service Ad Copy",
    category: "Ad Copy",
    platform: "facebook",
    description: "Promote a service",
    template: "[Headline: Solve [Problem] in [Timeframe]]\n\n[Body: Brief description of the service and benefits]\n\n✅ [Benefit 1]\n✅ [Benefit 2]\n✅ [Benefit 3]\n\n[CTA: Get Started Today]\n\n[Learn more at: URL]",
  },
]

export default function Templates() {
  const toast = useToast()
  const router = useRouter()
  const [selectedCategory, setSelectedCategory] = useState("all")

  const categories = ["all", ...Array.from(new Set(templates.map((t) => t.category)))]

  const filteredTemplates = templates.filter(
    (t) => selectedCategory === "all" || t.category === selectedCategory
  )

  const handleUseTemplate = (template: typeof templates[0]) => {
    // Store template in localStorage and redirect to new content page
    if (typeof window !== 'undefined') {
      localStorage.setItem('contentTemplate', template.template)
      router.push(`/dashboard/content/new?topic=${encodeURIComponent(template.name)}&type=${template.category === 'Social Media' ? 'social' : template.category === 'Email' ? 'email' : 'ad'}`)
    }
  }

  const handleCopyTemplate = (template: string) => {
    navigator.clipboard.writeText(template)
    toast.success("Template copied to clipboard!")
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold">Content Templates</h1>
        <p className="text-gray-600 mt-1">Start with proven templates to create content faster</p>
      </div>

      {/* Category Filter */}
      <div className="flex gap-2 flex-wrap">
        {categories.map((category) => (
          <button
            key={category}
            onClick={() => setSelectedCategory(category)}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              selectedCategory === category
                ? "bg-blue-600 text-white"
                : "bg-white border border-gray-300 text-gray-700 hover:bg-gray-50"
            }`}
          >
            {category === "all" ? "All Templates" : category}
          </button>
        ))}
      </div>

      {/* Templates Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {filteredTemplates.map((template) => (
          <div key={template.id} className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-lg transition-shadow">
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-2">
                <FileText className="w-5 h-5 text-blue-600" />
                <h3 className="font-semibold text-lg">{template.name}</h3>
              </div>
              <span className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded-full">
                {template.platform}
              </span>
            </div>

            <p className="text-sm text-gray-600 mb-4">{template.description}</p>

            <div className="bg-gray-50 rounded-lg p-3 mb-4 max-h-40 overflow-y-auto">
              <pre className="text-xs text-gray-700 whitespace-pre-wrap font-mono">
                {template.template}
              </pre>
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => handleUseTemplate(template)}
                className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <Sparkles className="w-4 h-4" />
                Use Template
              </button>
              <button
                onClick={() => handleCopyTemplate(template.template)}
                className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                title="Copy to clipboard"
              >
                <Copy className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
