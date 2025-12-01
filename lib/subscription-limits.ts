import { SubscriptionTier } from '@prisma/client'

// Plan limits configuration
export const PLAN_LIMITS = {
  FREE: {
    dailyGenerations: 5,
    socialAccounts: 1,
    teamMembers: 1,
    templates: 10,
    features: {
      abTesting: false,
      brandVoice: false,
      advancedAnalytics: false,
      apiAccess: false,
      whiteLabel: false,
      customIntegrations: false,
    },
  },
  STARTER: {
    dailyGenerations: 100,
    socialAccounts: 5,
    teamMembers: 1,
    templates: 50,
    features: {
      abTesting: false,
      brandVoice: false,
      advancedAnalytics: true,
      apiAccess: false,
      whiteLabel: false,
      customIntegrations: false,
    },
  },
  PRO: {
    dailyGenerations: -1, // -1 means unlimited
    socialAccounts: -1,
    teamMembers: 5,
    templates: -1,
    features: {
      abTesting: true,
      brandVoice: true,
      advancedAnalytics: true,
      apiAccess: true,
      whiteLabel: false,
      customIntegrations: false,
    },
  },
  AGENCY: {
    dailyGenerations: -1,
    socialAccounts: -1,
    teamMembers: -1,
    templates: -1,
    features: {
      abTesting: true,
      brandVoice: true,
      advancedAnalytics: true,
      apiAccess: true,
      whiteLabel: true,
      customIntegrations: true,
    },
  },
} as const

export interface UsageCheck {
  allowed: boolean
  limit: number
  current: number
  remaining: number
  tier: SubscriptionTier
  upgradeRequired?: SubscriptionTier
}

export interface FeatureCheck {
  allowed: boolean
  tier: SubscriptionTier
  upgradeRequired?: SubscriptionTier
}

/**
 * Check if user can perform an action based on their plan limits
 */
export function checkLimit(
  tier: SubscriptionTier,
  limitType: keyof Omit<typeof PLAN_LIMITS.FREE, 'features'>,
  currentUsage: number
): UsageCheck {
  const limits = PLAN_LIMITS[tier]
  const limit = limits[limitType] as number

  // -1 means unlimited
  if (limit === -1) {
    return {
      allowed: true,
      limit: -1,
      current: currentUsage,
      remaining: -1,
      tier,
    }
  }

  const allowed = currentUsage < limit
  const remaining = Math.max(0, limit - currentUsage)

  // Determine which tier they need to upgrade to
  let upgradeRequired: SubscriptionTier | undefined
  if (!allowed) {
    const tiers: SubscriptionTier[] = ['STARTER', 'PRO', 'AGENCY']
    const currentIndex = tiers.indexOf(tier)
    
    for (let i = currentIndex + 1; i < tiers.length; i++) {
      const nextTier = tiers[i]
      const nextLimit = PLAN_LIMITS[nextTier][limitType] as number
      if (nextLimit === -1 || nextLimit > limit) {
        upgradeRequired = nextTier
        break
      }
    }
  }

  return {
    allowed,
    limit,
    current: currentUsage,
    remaining,
    tier,
    upgradeRequired,
  }
}

/**
 * Check if user has access to a specific feature
 */
export function checkFeature(
  tier: SubscriptionTier,
  feature: keyof typeof PLAN_LIMITS.FREE.features
): FeatureCheck {
  const limits = PLAN_LIMITS[tier]
  const allowed = limits.features[feature]

  if (allowed) {
    return { allowed: true, tier }
  }

  // Find the minimum tier that has this feature
  const tiers: SubscriptionTier[] = ['STARTER', 'PRO', 'AGENCY']
  for (const checkTier of tiers) {
    if (PLAN_LIMITS[checkTier].features[feature]) {
      return {
        allowed: false,
        tier,
        upgradeRequired: checkTier,
      }
    }
  }

  return { allowed: false, tier }
}

/**
 * Get plan display name
 */
export function getPlanDisplayName(tier: SubscriptionTier): string {
  const names: Record<SubscriptionTier, string> = {
    FREE: 'Free',
    STARTER: 'Starter',
    PRO: 'Professional',
    AGENCY: 'Enterprise',
  }
  return names[tier]
}

/**
 * Get usage percentage for progress bars
 */
export function getUsagePercentage(current: number, limit: number): number {
  if (limit === -1) return 0 // Unlimited
  return Math.min(100, (current / limit) * 100)
}

/**
 * Format limit display (handles unlimited)
 */
export function formatLimit(limit: number): string {
  return limit === -1 ? 'Unlimited' : limit.toString()
}
