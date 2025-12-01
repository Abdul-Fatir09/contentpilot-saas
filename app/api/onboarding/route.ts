import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"
import { NextResponse } from "next/server"

export async function GET() {
  try {
    const session = await auth()
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: {
        onboardingSteps: true,
        onboardingCompleted: true,
      },
    })

    const steps = user?.onboardingSteps as any || {
      profile: false,
      content: false,
      schedule: false,
      connect: false,
    }

    return NextResponse.json({
      steps,
      completed: user?.onboardingCompleted || false,
    })
  } catch (error) {
    console.error("Error fetching onboarding:", error)
    return NextResponse.json(
      { error: "Failed to fetch onboarding status" },
      { status: 500 }
    )
  }
}

export async function PATCH(req: Request) {
  try {
    const session = await auth()
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await req.json()
    const { step } = body

    if (!step) {
      return NextResponse.json({ error: "Step is required" }, { status: 400 })
    }

    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { onboardingSteps: true },
    })

    const currentSteps = user?.onboardingSteps as any || {
      profile: false,
      content: false,
      schedule: false,
      connect: false,
    }

    const updatedSteps = {
      ...currentSteps,
      [step]: true,
    }

    const allCompleted = Object.values(updatedSteps).every((v) => v === true)

    await prisma.user.update({
      where: { id: session.user.id },
      data: {
        onboardingSteps: updatedSteps,
        onboardingCompleted: allCompleted,
      },
    })

    return NextResponse.json({
      steps: updatedSteps,
      completed: allCompleted,
    })
  } catch (error) {
    console.error("Error updating onboarding:", error)
    return NextResponse.json(
      { error: "Failed to update onboarding" },
      { status: 500 }
    )
  }
}
