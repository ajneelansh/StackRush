"use client"

import { Coins } from "lucide-react"
import { useUserStore } from "@/lib/stores/useUserStore"

export function UserCoins({ small = false }: { small?: boolean }) {
  const coins = useUserStore((state) => state.coins)

  return (
    <div
      className={`flex items-center gap-2 bg-purple-900/30 border border-purple-700/50 rounded-full ${
        small ? "px-3 py-1 text-sm" : "px-4 py-2"
      }`}
    >
      <Coins className={`text-yellow-400 ${small ? "w-4 h-4" : "w-5 h-5"}`} />
      <span className="font-medium text-purple-100">
        {coins.toLocaleString()}
      </span>
    </div>
  )
}
