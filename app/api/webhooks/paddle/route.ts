import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { PaddleService } from '@/lib/billing/paddle'

const paddleService = new PaddleService()

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const signature = request.headers.get('paddle-signature') || ''

    // Verify webhook signature
    if (!paddleService.verifyWebhookSignature(body, signature)) {
      return NextResponse.json({ error: 'Invalid signature' }, { status: 401 })
    }

    const eventType = body.alert_name

    switch (eventType) {
      case 'subscription_created':
        await handleSubscriptionCreated(body)
        break

      case 'subscription_updated':
        await handleSubscriptionUpdated(body)
        break

      case 'subscription_cancelled':
        await handleSubscriptionCancelled(body)
        break

      case 'subscription_payment_succeeded':
        await handlePaymentSucceeded(body)
        break

      case 'subscription_payment_failed':
        await handlePaymentFailed(body)
        break

      default:
        console.log('Unhandled webhook event:', eventType)
    }

    return NextResponse.json({ received: true })
  } catch (error) {
    console.error('Webhook error:', error)
    return NextResponse.json(
      { error: 'Webhook processing failed' },
      { status: 500 }
    )
  }
}

async function handleSubscriptionCreated(data: any) {
  const passthrough = JSON.parse(data.passthrough)
  const userId = passthrough.userId

  const tierMap: Record<string, string> = {
    starter: 'STARTER',
    pro: 'PRO',
    agency: 'AGENCY',
  }

  const limitMap: Record<string, number> = {
    STARTER: 50,
    PRO: 999999,
    AGENCY: 999999,
  }

  const tier = tierMap[data.subscription_plan_id] || 'FREE'

  await prisma.subscription.update({
    where: { userId },
    data: {
      tier: tier as any,
      status: 'ACTIVE',
      paddleSubscriptionId: data.subscription_id,
      paddleCustomerId: data.user_id,
      currentPeriodStart: new Date(data.event_time),
      currentPeriodEnd: new Date(data.next_bill_date),
      dailyGenerationsLimit: limitMap[tier],
    },
  })
}

async function handleSubscriptionUpdated(data: any) {
  await prisma.subscription.update({
    where: { paddleSubscriptionId: data.subscription_id },
    data: {
      status: data.status === 'active' ? 'ACTIVE' : 'CANCELED',
      currentPeriodEnd: new Date(data.next_bill_date),
    },
  })
}

async function handleSubscriptionCancelled(data: any) {
  await prisma.subscription.update({
    where: { paddleSubscriptionId: data.subscription_id },
    data: {
      status: 'CANCELED',
      cancelAtPeriodEnd: true,
    },
  })
}

async function handlePaymentSucceeded(data: any) {
  const subscription = await prisma.subscription.findUnique({
    where: { paddleSubscriptionId: data.subscription_id },
  })

  if (!subscription) return

  await prisma.invoice.create({
    data: {
      subscriptionId: subscription.id,
      paddleInvoiceId: data.order_id,
      amount: parseFloat(data.sale_gross),
      currency: data.currency,
      status: 'paid',
      invoiceUrl: data.receipt_url,
      paidAt: new Date(data.event_time),
    },
  })

  await prisma.subscription.update({
    where: { id: subscription.id },
    data: {
      currentPeriodEnd: new Date(data.next_bill_date),
    },
  })
}

async function handlePaymentFailed(data: any) {
  await prisma.subscription.update({
    where: { paddleSubscriptionId: data.subscription_id },
    data: {
      status: 'PAST_DUE',
    },
  })
}
