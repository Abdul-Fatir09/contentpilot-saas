import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/auth'
import { prisma } from '@/lib/prisma'
import { generateContent, GenerateContentParams } from '@/lib/ai/content-generator'
import { checkLimit, getPlanDisplayName } from '@/lib/subscription-limits'
import { z } from 'zod'

const generateSchema = z.object({
  type: z.enum(['blog', 'social', 'ad', 'email', 'product']),
  topic: z.string().min(3, 'Topic must be at least 3 characters'),
  keywords: z.array(z.string()).optional(),
  tone: z.string().optional(),
  targetAudience: z.string().optional(),
  length: z.enum(['short', 'medium', 'long']).optional(),
  platform: z.enum(['twitter', 'facebook', 'linkedin', 'instagram']).optional(),
  additionalContext: z.string().optional(),
  folderId: z.string().optional(),
})

export async function POST(request: NextRequest) {
  try {
    const session = await auth()

    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const validatedData = generateSchema.parse(body)

    // Get user's subscription
    const subscription = await prisma.subscription.findUnique({
      where: { userId: session.user.id },
    })

    const tier = subscription?.tier || 'FREE'

    // Check daily generation limit
    const today = new Date()
    today.setHours(0, 0, 0, 0)

    const todayGenerations = await prisma.content.count({
      where: {
        userId: session.user.id,
        createdAt: {
          gte: today,
        },
      },
    })

    const limitCheck = checkLimit(tier, 'dailyGenerations', todayGenerations)

    if (!limitCheck.allowed) {
      return NextResponse.json(
        {
          error: `Daily generation limit reached. You've used ${limitCheck.current}/${limitCheck.limit} generations today.`,
          limit: limitCheck.limit,
          used: limitCheck.current,
          tier: tier,
          upgradeRequired: limitCheck.upgradeRequired,
          upgradeTo: limitCheck.upgradeRequired ? getPlanDisplayName(limitCheck.upgradeRequired) : undefined,
        },
        { status: 429 }
      )
    }

    // Get brand profile for tone/context
    const brandProfile = await prisma.brandProfile.findUnique({
      where: { userId: session.user.id },
    })

    // Generate content using AI
    const params: GenerateContentParams = {
      type: validatedData.type,
      topic: validatedData.topic,
      keywords: validatedData.keywords || brandProfile?.keywords || [],
      tone: validatedData.tone || brandProfile?.tone || 'professional',
      targetAudience: validatedData.targetAudience || brandProfile?.targetAudience || undefined,
      length: validatedData.length || 'medium',
      platform: validatedData.platform,
      additionalContext: validatedData.additionalContext,
    }

    const result = await generateContent(params)

    // Map content type to enum
    const contentTypeMap: Record<string, string> = {
      blog: 'BLOG_POST',
      social: 'SOCIAL_MEDIA',
      ad: 'AD_COPY',
      email: 'EMAIL',
      product: 'PRODUCT_DESCRIPTION',
    }

    // Save to database
    const savedContent = await prisma.content.create({
      data: {
        userId: session.user.id,
        folderId: validatedData.folderId || null,
        type: contentTypeMap[validatedData.type] as any,
        title: result.title || validatedData.topic,
        content: result.content,
        keywords: validatedData.keywords || [],
        seoScore: result.seoScore,
        metaTitle: result.metaTitle,
        metaDescription: result.metaDescription,
        tags: [],
      },
    })

    // Calculate remaining generations
    const remaining = limitCheck.limit === -1 
      ? 'Unlimited' 
      : limitCheck.limit - todayGenerations - 1

    return NextResponse.json({
      content: savedContent,
      generationsUsed: todayGenerations + 1,
      generationsLimit: limitCheck.limit,
      generationsLeft: remaining,
      tier: tier,
    })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validation error', details: error.issues },
        { status: 400 }
      )
    }

    console.error('Content generation error:', error)
    return NextResponse.json(
      { error: 'Failed to generate content' },
      { status: 500 }
    )
  }
}

export async function GET(request: NextRequest) {
  try {
    const session = await auth()

    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const type = searchParams.get('type')
    const folderId = searchParams.get('folderId')
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '10')

    const where: any = {
      userId: session.user.id,
    }

    if (type) {
      where.type = type
    }

    if (folderId) {
      where.folderId = folderId
    }

    const [contents, total] = await Promise.all([
      prisma.content.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        skip: (page - 1) * limit,
        take: limit,
        include: {
          folder: true,
        },
      }),
      prisma.content.count({ where }),
    ])

    return NextResponse.json({
      contents,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    })
  } catch (error) {
    console.error('Error fetching content:', error)
    return NextResponse.json(
      { error: 'Failed to fetch content' },
      { status: 500 }
    )
  }
}
