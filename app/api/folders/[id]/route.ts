import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"
import { NextResponse } from "next/server"

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth()
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { id } = await params
    const body = await req.json()
    const { name, description, color } = body

    if (!name || !name.trim()) {
      return NextResponse.json(
        { error: "Folder name is required" },
        { status: 400 }
      )
    }

    // Verify folder belongs to user
    const existingFolder = await prisma.folder.findUnique({
      where: { id },
    })

    if (!existingFolder) {
      return NextResponse.json({ error: "Folder not found" }, { status: 404 })
    }

    if (existingFolder.userId !== session.user.id) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 })
    }

    const folder = await prisma.folder.update({
      where: { id },
      data: {
        name: name.trim(),
        description: description?.trim() || null,
        color: color || existingFolder.color,
      },
      include: {
        _count: {
          select: { contents: true },
        },
      },
    })

    return NextResponse.json(folder)
  } catch (error) {
    console.error("Error updating folder:", error)
    return NextResponse.json(
      { error: "Failed to update folder" },
      { status: 500 }
    )
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth()
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { id } = await params

    // Verify folder belongs to user
    const folder = await prisma.folder.findUnique({
      where: { id },
      include: {
        _count: {
          select: { contents: true },
        },
      },
    })

    if (!folder) {
      return NextResponse.json({ error: "Folder not found" }, { status: 404 })
    }

    if (folder.userId !== session.user.id) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 })
    }

    // Optional: Prevent deletion if folder has content
    // if (folder._count.contents > 0) {
    //   return NextResponse.json(
    //     { error: "Cannot delete folder with content. Remove content first." },
    //     { status: 400 }
    //   )
    // }

    await prisma.folder.delete({
      where: { id },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error deleting folder:", error)
    return NextResponse.json(
      { error: "Failed to delete folder" },
      { status: 500 }
    )
  }
}
