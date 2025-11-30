"use client"

import { signOut } from "next-auth/react"
import { LogOut } from "lucide-react"

export function SignOutButton() {
  const handleSignOut = async () => {
    await signOut({ callbackUrl: "/auth/signin" })
  }

  return (
    <button
      onClick={handleSignOut}
      className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-gray-400 hover:bg-slate-800 hover:text-white transition-colors w-full"
    >
      <LogOut className="h-4 w-4" />
      Sign Out
    </button>
  )
}
