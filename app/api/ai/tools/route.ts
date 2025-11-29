import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/auth'
import { generateKeywordSuggestions, generateContentIdeas } from '@/lib/ai/content-generator'
import { z } from 'zod'

const keywordSchema = z.object({
  topic: z.string().min(2),
  count: z.number().min(1).max(20).optional(),
})

const ideasSchema = z.object({
  industry: z.string().min(2),
  targetAudience: z.string().min(2),
  count: z.number().min(1).max(10).optional(),
})

export async function POST(request: NextRequest) {
  try {
    const session = await auth()

    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const action = searchParams.get('action')

    if (action === 'keywords') {
      const body = await request.json()
      const validatedData = keywordSchema.parse(body)

      const keywords = await generateKeywordSuggestions(
        validatedData.topic,
        validatedData.count || 10
      )

      return NextResponse.json({ keywords })
    }

    if (action === 'ideas') {
      const body = await request.json()
      const validatedData = ideasSchema.parse(body)

      const ideas = await generateContentIdeas(
        validatedData.industry,
        validatedData.targetAudience,
        validatedData.count || 5
      )

      return NextResponse.json({ ideas })
    }

    return NextResponse.json({ error: 'Invalid action' }, { status: 400 })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validation error', details: error.issues },
        { status: 400 }
      )
    }

    console.error('AI tools error:', error)
    return NextResponse.json(
      { error: 'Failed to generate suggestions' },
      { status: 500 }
    )
  }
}
