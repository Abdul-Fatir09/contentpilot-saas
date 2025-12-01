import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"
import { redirect } from "next/navigation"
import PostsManager from "./PostsManager"

export default async function PostsPage() {
  const session = await auth()
  
  if (!session) {
    redirect("/auth/signin")
  }

  // Fetch all social posts for the user
  const socialPosts = await prisma.socialPost.findMany({
    where: {
      content: {
        userId: session.user.id,
      },
    },
    include: {
      content: {
        select: {
          id: true,
          title: true,
          type: true,
        },
      },
      socialAccount: {
        select: {
          id: true,
          platform: true,
          accountName: true,
          profileImage: true,
        },
      },
    },
    orderBy: {
      scheduledFor: 'desc',
    },
  })

  return <PostsManager initialPosts={socialPosts} />
}
