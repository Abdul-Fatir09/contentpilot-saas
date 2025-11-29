// Paddle Billing Service

export interface SubscriptionPlan {
  id: string
  name: string
  price: number
  interval: 'month' | 'year'
  features: string[]
}

export const SUBSCRIPTION_PLANS: Record<string, SubscriptionPlan> = {
  STARTER: {
    id: 'starter',
    name: 'Starter',
    price: 15,
    interval: 'month',
    features: [
      '50 AI generations per day',
      '3 social media platforms',
      'Basic analytics',
      'Email support',
    ],
  },
  PRO: {
    id: 'pro',
    name: 'Pro',
    price: 39,
    interval: 'month',
    features: [
      'Unlimited AI generations',
      'All social platforms',
      'Advanced analytics',
      'A/B testing',
      'Priority support',
      'Custom templates',
    ],
  },
  AGENCY: {
    id: 'agency',
    name: 'Agency',
    price: 79,
    interval: 'month',
    features: [
      'Everything in Pro',
      'Multiple brands',
      'Team collaboration',
      'White-label reports',
      'API access',
      'Dedicated support',
    ],
  },
}

export class PaddleService {
  private vendorId: string
  private apiKey: string
  private environment: 'sandbox' | 'production'

  constructor() {
    this.vendorId = process.env.PADDLE_VENDOR_ID!
    this.apiKey = process.env.PADDLE_API_KEY!
    this.environment = (process.env.PADDLE_ENVIRONMENT as any) || 'sandbox'
  }

  private getBaseUrl(): string {
    return this.environment === 'production'
      ? 'https://vendors.paddle.com/api/2.0'
      : 'https://sandbox-vendors.paddle.com/api/2.0'
  }

  async createCheckoutSession(params: {
    email: string
    planId: string
    userId: string
    successUrl: string
    cancelUrl: string
  }) {
    try {
      const response = await fetch(`${this.getBaseUrl()}/product/generate_pay_link`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
          vendor_id: this.vendorId,
          vendor_auth_code: this.apiKey,
          product_id: params.planId,
          customer_email: params.email,
          passthrough: JSON.stringify({ userId: params.userId }),
          return_url: params.successUrl,
        }),
      })

      const data = await response.json()

      if (!data.success) {
        throw new Error(data.error?.message || 'Failed to create checkout session')
      }

      return {
        url: data.response.url,
      }
    } catch (error) {
      console.error('Paddle checkout error:', error)
      throw error
    }
  }

  async cancelSubscription(subscriptionId: string) {
    try {
      const response = await fetch(`${this.getBaseUrl()}/subscription/users_cancel`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
          vendor_id: this.vendorId,
          vendor_auth_code: this.apiKey,
          subscription_id: subscriptionId,
        }),
      })

      const data = await response.json()

      if (!data.success) {
        throw new Error(data.error?.message || 'Failed to cancel subscription')
      }

      return data
    } catch (error) {
      console.error('Paddle cancel error:', error)
      throw error
    }
  }

  async getSubscriptionDetails(subscriptionId: string) {
    try {
      const response = await fetch(
        `${this.getBaseUrl()}/subscription/users?subscription_id=${subscriptionId}`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
          },
          body: new URLSearchParams({
            vendor_id: this.vendorId,
            vendor_auth_code: this.apiKey,
          }),
        }
      )

      const data = await response.json()

      if (!data.success) {
        throw new Error(data.error?.message || 'Failed to get subscription details')
      }

      return data.response[0]
    } catch (error) {
      console.error('Paddle subscription details error:', error)
      throw error
    }
  }

  verifyWebhookSignature(webhookData: any, signature: string): boolean {
    const crypto = require('crypto')
    const phpSerialize = (data: any) => {
      // Simple PHP serialize implementation for webhook verification
      return JSON.stringify(data)
    }

    const serialized = phpSerialize(webhookData)
    const hash = crypto
      .createHmac('sha1', process.env.PADDLE_WEBHOOK_SECRET!)
      .update(serialized)
      .digest('hex')

    return hash === signature
  }
}
