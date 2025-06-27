"use client"

import { useUserStore } from "@/lib/stores/useUserStore"
import { useState } from "react"
import { motion } from "framer-motion"
import RedeemModal from "@/components/RedeemModal"
import Image from "next/image"
import { Coins } from "lucide-react"
import tshirt from "@/assets/tshirt.jpg" // Adjust path accordingly


const rewardItems = [
  {
    id: 1,
    name: "Prize1",
    description: "Unlock exclusive problems for 24 hours",
    price: 500,
    image: tshirt,
    gradient: "from-blue-900 to-blue-800",
    text: "text-blue-300"
  },
  {
    id: 2,
    name: "Prize2",
    description: "Special profile badge for 7 days streak",
    price: 1000,
    image: "",
    gradient: "from-purple-900 to-purple-800",
    text: "text-pink-300"
  },
  {
    id: 3,
    name: "Prize3",
    description: "Featured on leaderboard for 3 days",
    price: 1500,
    image: "",
    gradient: "from-cyan-900 to-cyan-800",
    text: "text-cyan-300"
  },
  {
    id: 4,
    name:"Prize4",
    description: "All perks + exclusive solutions are available",
    price: 3000,
    image: "",
    gradient: "from-fuchsia-900 to-purple-800",
    text: "text-violet-300"
  },
  {
    id: 5,
    name:"Prize5",
    description: "All perks + exclusive solutions are available",
    price: 3000,
    image: "",
    gradient: "from-fuchsia-900 to-purple-800",
    text: "text-violet-300"
  },
  {
    id: 6,
    name:"Prize6",
    description: "All perks + exclusive solutions are available",
    price: 3000,
    image: "",
    gradient: "from-fuchsia-900 to-purple-800",
    text: "text-violet-300"
  },
  {
    id: 7,
    name:"Prize7",
    description: "All perks + exclusive solutions are available",
    price: 3000,
    image: "",
    gradient: "from-fuchsia-900 to-purple-800",
    text: "text-violet-300"
  },
  {
    id: 8,
    name:"Prize8",
    description: "All perks + exclusive solutions are available",
    price: 3000,
    image: "",
    gradient: "from-fuchsia-900 to-purple-800",
    text: "text-violet-300"
  }
]

export function RewardsStore() {
  const coins = useUserStore((state) => state.coins)
  const deductCoins = useUserStore((state) => state.deductCoins)

  const [selectedReward, setSelectedReward] = useState<number | null>(null)
  const [showModal, setShowModal] = useState(false)

  const purchaseReward = (rewardId: number, price: number) => {
    if (coins < price) return
    deductCoins(price)
    setSelectedReward(rewardId)
    setShowModal(true)
  }

  const handleFormSubmit = (data: {
    fullName: string
    email: string
    contact: string
  }) => {
    console.log("✅ Order Placed:", {
      rewardId: selectedReward,
      ...data
    })
    setShowModal(false)
  }

  return (
    <div className="p-2 max-w-7xl mx-auto bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-cyan-900/20 via-gray-950 to-purple-900/30">
      <h2 className="text-3xl font-bold bg-gradient-to-r from-cyan-300 to-purple-400 bg-clip-text text-transparent mb-8">
        Rewards Store
      </h2>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {rewardItems.map((reward) => {
          const canAfford = coins >= reward.price

          return (
            <motion.div
              key={reward.id}
              whileHover={{ scale: 1.03 }}
              className={`rounded-xl overflow-hidden bg-white shadow-lg border border-gray-200 transition transform hover:shadow-xl`}
            >
              <div className="bg-gradient-to-br from-purple-900 to-purple-950 p-4 h-60 relative">
                <Image
                  src={reward.image}
                  alt={reward.name}
                  fill
                  className="object-cover rounded-md"
                />
              </div>


              <div className="p-4 flex flex-col justify-between h-[120px]">
                <div className="mb-2">
                  <h3 className="text-base font-semibold text-gray-800">{reward.name}</h3>
                  <p className="text-xs text-gray-500">{reward.description}</p>
                </div>

                <div className="flex justify-between items-center mt-auto">
                  <span className="text-sm font-medium text-yellow-600 flex items-center gap-1">
                    <Coins className="w-4 h-4" />
                    {reward.price}
                  </span>

                  <button
                    onClick={() => purchaseReward(reward.id, reward.price)}
                    disabled={!canAfford}
                    className={`text-xs px-4 py-1 rounded-full font-medium transition ${
                      canAfford
                        ? "bg-green-600 text-white hover:bg-green-500"
                        : "bg-gray-300 text-gray-500 cursor-not-allowed"
                    }`}
                  >
                    Redeem
                  </button>
                </div>
              </div>
            </motion.div>

          )
        })}
      </div>

      {/* Modal */}
      <RedeemModal
        open={showModal}
        onClose={() => setShowModal(false)}
        onSubmit={handleFormSubmit}
        rewardName={
          rewardItems.find((r) => r.id === selectedReward)?.name || ""
        }
      />
    </div>
  )
}
