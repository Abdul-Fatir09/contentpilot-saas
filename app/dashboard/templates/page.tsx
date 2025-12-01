import { auth } from "@/auth"
import { redirect } from "next/navigation"
import Templates from "./Templates"

export default async function TemplatesPage() {
  const session = await auth()
  
  if (!session) {
    redirect("/auth/signin")
  }

  return <Templates />
}
