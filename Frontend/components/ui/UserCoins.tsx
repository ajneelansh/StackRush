"use client"

import { Coins } from "lucide-react"
import { useUserStore } from "@/lib/stores/useUserStore"

export function UserCoins({ small = false }: { small?: boolean }) {
  const coins = useUserStore((state) => state.coins)

  return (
    <div
      className={`flex items-center gap-2 rounded-full border border-purple-900/40
        bg-gradient-to-r from-purple-800/50 to-purple-900/40 shadow-md shadow-purple-900/10
        text-purple-100 backdrop-blur-sm
        ${small ? "px-3 py-1 text-sm" : "px-4 py-2"}
      `}
    >
      <Coins className={`text-yellow-400 ${small ? "w-4 h-4" : "w-5 h-5"}`} />
      <span className="font-light">{coins.toLocaleString()}</span>
    </div>
  )
}
