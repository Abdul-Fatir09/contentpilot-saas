"use client"

import { X, Crown, Zap, Sparkles } from "lucide-react"
import { useRouter } from "next/navigation"

interface UpgradeModalProps {
  isOpen: boolean
  onClose: () => void
  title?: string
  message: string
  currentTier?: string
  suggestedTier?: string
  feature?: string
}

export default function UpgradeModal({
  isOpen,
  onClose,
  title = "Upgrade Required",
  message,
  currentTier = "Free",
  suggestedTier = "Starter",
  feature,
}: UpgradeModalProps) {
  const router = useRouter()

  if (!isOpen) return null

  const getTierIcon = () => {
    switch (suggestedTier) {
      case "Professional":
        return <Crown className="w-12 h-12 text-purple-600" />
      case "Starter":
        return <Zap className="w-12 h-12 text-blue-600" />
      case "Enterprise":
        return <Sparkles className="w-12 h-12 text-indigo-600" />
      default:
        return <Crown className="w-12 h-12 text-purple-600" />
    }
  }

  const getTierColor = () => {
    switch (suggestedTier) {
      case "Professional":
        return "from-purple-600 to-pink-600"
      case "Starter":
        return "from-blue-600 to-cyan-600"
      case "Enterprise":
        return "from-indigo-600 to-purple-600"
      default:
        return "from-purple-600 to-pink-600"
    }
  }

  const handleUpgrade = () => {
    router.push("/dashboard/pricing")
    onClose()
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl max-w-md w-full shadow-2xl">
        {/* Header with gradient */}
        <div className={`bg-gradient-to-r ${getTierColor()} p-6 rounded-t-2xl text-white relative`}>
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-1 hover:bg-white hover:bg-opacity-20 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
          
          <div className="flex flex-col items-center text-center">
            <div className="bg-white bg-opacity-20 p-4 rounded-full mb-4">
              {getTierIcon()}
            </div>
            <h2 className="text-2xl font-bold mb-2">{title}</h2>
            <p className="text-white text-opacity-90">
              Unlock more with {suggestedTier}
            </p>
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          <div className="mb-6">
            <p className="text-gray-700 text-center mb-4">{message}</p>
            
            {feature && (
              <div className="bg-gray-50 rounded-lg p-4 mb-4">
                <p className="text-sm text-gray-600 text-center">
                  <span className="font-semibold">Feature:</span> {feature}
                </p>
              </div>
            )}

            <div className="flex items-center justify-center gap-4 text-sm">
              <div className="text-center">
                <p className="text-gray-500 mb-1">Current Plan</p>
                <p className="font-semibold text-gray-900">{currentTier}</p>
              </div>
              <div className="text-gray-400">→</div>
              <div className="text-center">
                <p className="text-gray-500 mb-1">Upgrade To</p>
                <p className={`font-bold bg-gradient-to-r ${getTierColor()} bg-clip-text text-transparent`}>
                  {suggestedTier}
                </p>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3">
            <button
              onClick={onClose}
              className="flex-1 px-4 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors font-medium"
            >
              Maybe Later
            </button>
            <button
              onClick={handleUpgrade}
              className={`flex-1 px-4 py-3 bg-gradient-to-r ${getTierColor()} text-white rounded-lg hover:opacity-90 transition-opacity font-semibold shadow-lg`}
            >
              View Plans
            </button>
          </div>

          <p className="text-xs text-gray-500 text-center mt-4">
            Upgrade anytime • Cancel anytime • No hidden fees
          </p>
        </div>
      </div>
    </div>
  )
}
