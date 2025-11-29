import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/auth'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'

const brandProfileSchema = z.object({
  brandName: z.string().optional(),
  tone: z.string().optional(),
  targetAudience: z.string().optional(),
  industry: z.string().optional(),
  keywords: z.array(z.string()).optional(),
})

export async function GET() {
  try {
    const session = await auth()

    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const brandProfile = await prisma.brandProfile.findUnique({
      where: { userId: session.user.id },
    })

    if (!brandProfile) {
      // Create default profile if doesn't exist
      const newProfile = await prisma.brandProfile.create({
        data: {
          userId: session.user.id,
          brandName: session.user.name || '',
        },
      })
      return NextResponse.json(newProfile)
    }

    return NextResponse.json(brandProfile)
  } catch (error) {
    console.error('Error fetching brand profile:', error)
    return NextResponse.json(
      { error: 'Failed to fetch brand profile' },
      { status: 500 }
    )
  }
}

export async function PUT(request: NextRequest) {
  try {
    const session = await auth()

    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const validatedData = brandProfileSchema.parse(body)

    const brandProfile = await prisma.brandProfile.upsert({
      where: { userId: session.user.id },
      update: validatedData,
      create: {
        userId: session.user.id,
        ...validatedData,
      },
    })

    return NextResponse.json(brandProfile)
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validation error', details: error.issues },
        { status: 400 }
      )
    }

    console.error('Error updating brand profile:', error)
    return NextResponse.json(
      { error: 'Failed to update brand profile' },
      { status: 500 }
    )
  }
}
