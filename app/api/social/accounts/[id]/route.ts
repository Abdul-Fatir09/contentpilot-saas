import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/auth'
import { prisma } from '@/lib/prisma'

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { id } = await params

    // Verify ownership
    const account = await prisma.socialAccount.findUnique({
      where: { id },
      select: { userId: true },
    })

    if (!account || account.userId !== session.user.id) {
      return NextResponse.json({ error: 'Account not found' }, { status: 404 })
    }

    // Soft delete (set isActive to false) or hard delete
    await prisma.socialAccount.update({
      where: { id },
      data: { isActive: false },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Disconnect account error:', error)
    return NextResponse.json(
      { error: 'Failed to disconnect account' },
      { status: 500 }
    )
  }
}
