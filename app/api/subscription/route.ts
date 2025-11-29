import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/auth'
import { PaddleService, SUBSCRIPTION_PLANS } from '@/lib/billing/paddle'
import { prisma } from '@/lib/prisma'

const paddleService = new PaddleService()

export async function GET(request: NextRequest) {
  try {
    const session = await auth()

    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const action = searchParams.get('action')

    if (action === 'plans') {
      return NextResponse.json({ plans: SUBSCRIPTION_PLANS })
    }

    if (action === 'current') {
      const subscription = await prisma.subscription.findUnique({
        where: { userId: session.user.id },
        include: {
          invoices: {
            orderBy: { createdAt: 'desc' },
            take: 5,
          },
        },
      })

      return NextResponse.json({ subscription })
    }

    return NextResponse.json({ error: 'Invalid action' }, { status: 400 })
  } catch (error) {
    console.error('Subscription GET error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch subscription' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await auth()

    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const action = searchParams.get('action')

    if (action === 'checkout') {
      const body = await request.json()
      const { planId } = body

      if (!SUBSCRIPTION_PLANS[planId.toUpperCase()]) {
        return NextResponse.json({ error: 'Invalid plan' }, { status: 400 })
      }

      const checkoutUrl = await paddleService.createCheckoutSession({
        email: session.user.email!,
        planId: SUBSCRIPTION_PLANS[planId.toUpperCase()].id,
        userId: session.user.id,
        successUrl: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard/settings?success=true`,
        cancelUrl: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard/settings?canceled=true`,
      })

      return NextResponse.json(checkoutUrl)
    }

    if (action === 'cancel') {
      const subscription = await prisma.subscription.findUnique({
        where: { userId: session.user.id },
      })

      if (!subscription?.paddleSubscriptionId) {
        return NextResponse.json(
          { error: 'No active subscription' },
          { status: 400 }
        )
      }

      await paddleService.cancelSubscription(subscription.paddleSubscriptionId)

      await prisma.subscription.update({
        where: { userId: session.user.id },
        data: {
          cancelAtPeriodEnd: true,
        },
      })

      return NextResponse.json({ message: 'Subscription will be canceled at period end' })
    }

    return NextResponse.json({ error: 'Invalid action' }, { status: 400 })
  } catch (error) {
    console.error('Subscription POST error:', error)
    return NextResponse.json(
      { error: 'Failed to process subscription' },
      { status: 500 }
    )
  }
}
