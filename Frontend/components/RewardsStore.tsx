"use client"

import { useUserStore } from "@/lib/stores/useUserStore"
import { useState } from "react"
import { motion } from "framer-motion"
import { Gem, Zap, Star, Trophy, Coins} from "lucide-react"
import Image from "next/image"

const rewardItems = [
  {
    id: 1,
    name: "Power Boost",
    description: "Unlock exclusive problems for 24 hours",
    price: 500,
    icon: <Zap className="w-5 h-5 text-blue-400" />,
    gradient: "from-blue-900 to-blue-800",
    text: "text-blue-300"
  },
  {
    id: 2,
    name: "Gem Collector",
    description: "Special profile badge for 7 days streak",
    price: 1000,
    icon: <Gem className="w-5 h-5 text-pink-300" />,
    gradient: "from-purple-900 to-purple-800",
    text: "text-pink-300"
  },
  {
    id: 3,
    name: "Star Performer",
    description: "Featured on leaderboard for 3 days",
    price: 1500,
    icon: <Star className="w-5 h-5 text-cyan-300" />,
    gradient: "from-cyan-900 to-cyan-800",
    text: "text-cyan-300"
  },
  {
    id: 4,
    name: "Champion Bundle",
    description: "All perks + exclusive solutions are available",
    price: 3000,
    icon: <Trophy className="w-5 h-5 text-violet-300" />,
    gradient: "from-fuchsia-900 to-purple-800",
    text: "text-violet-300"
  }
]

export function RewardsStore() {
  const coins = useUserStore((state) => state.coins)
  const deductCoins = useUserStore((state) => state.deductCoins)
  const [selectedReward, setSelectedReward] = useState<number | null>(null)

  const purchaseReward = (rewardId: number, price: number) => {
    if (coins < price) return
    deductCoins(price)
    setSelectedReward(rewardId)
    setTimeout(() => setSelectedReward(null), 2000)
  }

  return (
    <div className="p-6 max-w-6xl mx-auto bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-cyan-900/20 via-gray-950 to-purple-900/30">
      <h2 className="text-3xl font-bold bg-gradient-to-r from-cyan-300 to-purple-400 bg-clip-text text-transparent mb-8">
        Rewards Store
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {rewardItems.map((reward) => {
          const canAfford = coins >= reward.price
          const isSelected = selectedReward === reward.id

          return (
            <motion.div
              key={reward.id}
              whileHover={{ scale: 1.02 }}
              className={`rounded-xl shadow-md p-5 bg-gradient-to-br ${reward.gradient} border border-white/10`}
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-black/20 rounded-full">{reward.icon}</div>
                <h3 className={`font-semibold text-lg ${reward.text}`}>
                  {reward.name}
                </h3>
              </div>
              <p className="text-sm text-white/70 mb-6">{reward.description}</p>
              <div className="flex justify-between items-center">
                <span className="text-sm text-white font-medium flex gap-1 items-center">
                <Coins className="w-4 h-4 text-yellow-300" />
                  {reward.price.toLocaleString()}
                </span>
                <button
                  onClick={() => purchaseReward(reward.id, reward.price)}
                  disabled={!canAfford || isSelected}
                  className={`text-xs px-4 py-1 rounded-full font-medium transition ${
                    isSelected
                      ? "bg-green-600 text-white"
                      : canAfford
                        ? "bg-white text-black hover:opacity-90"
                        : "bg-white/10 text-white/50 cursor-not-allowed"
                  }`}
                  
                >
                  {isSelected ? "Purchased!" : "Redeem"}
                </button>
              </div>
            </motion.div>
          )
        })}
      </div>
    </div>
  )
}
