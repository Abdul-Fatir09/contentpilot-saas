import { NextResponse } from "next/server"
import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"

export async function GET() {
  try {
    const session = await auth()

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      )
    }

    // Fetch user stats
    const [subscription, contentCount, scheduledCount] = await Promise.all([
      prisma.subscription.findUnique({
        where: { userId: session.user.id },
      }),
      prisma.content.count({
        where: { userId: session.user.id },
      }),
      prisma.socialPost.count({
        where: {
          content: { userId: session.user.id },
          status: "SCHEDULED",
        },
      }),
    ])

    const today = new Date()
    today.setHours(0, 0, 0, 0)

    const todayContent = await prisma.content.count({
      where: {
        userId: session.user.id,
        createdAt: { gte: today },
      },
    })

    return NextResponse.json({
      userName: session.user.name || "",
      stats: {
        subscription: subscription?.tier || "FREE",
        contentCount,
        scheduledCount,
        todayContent,
      },
    })
  } catch (error) {
    console.error("Dashboard stats error:", error)
    return NextResponse.json(
      { error: "Failed to fetch stats" },
      { status: 500 }
    )
  }
}
