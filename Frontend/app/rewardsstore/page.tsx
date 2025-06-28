"use client"

import { useState, useRef } from "react"
import { RewardsStore } from "@/components/RewardsStore"
import { UserCoins } from "@/components/ui/UserCoins"
import logoImage from "../../assets/logo-nav.png"
import { Sparkles, Trophy, Clock, Star } from "lucide-react"
import {Header} from "@/components/Header"

export default function RewardsStorePage() {
  const [showEarnSection, setShowEarnSection] = useState(false)
  const earnRef = useRef<HTMLDivElement>(null)

  const handleToggleEarnSection = () => {
    setShowEarnSection(prev => {
      const next = !prev
      if (!prev) {
        setTimeout(() => {
          earnRef.current?.scrollIntoView({ behavior: "smooth" })
        }, 100)
      }
      return next
    })
  }

  return (
    <div className="min-h-screen bg-gray-950 text-white bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-cyan-900/20 via-gray-950 to-purple-900/30">
      <Header/>
      <section className="text-center py-12 px-4 border-b border-white/10">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent">
          CodeHurdle Rewards Store
        </h1>
        <p className="text-gray-400 mt-3 max-w-2xl mx-auto">
          Shop exclusive rewards and perks with your earned CodeCoins.
        </p>

        <button
          onClick={handleToggleEarnSection}
          className="mt-6 px-6 py-2 bg-gradient-to-r from-cyan-500 to-purple-600 hover:from-cyan-400 hover:to-purple-500 text-white rounded-full font-semibold transition"
        >
          {showEarnSection ? "Hide Earn Coins Guide" : "How to Earn Coins?"}
        </button>
      </section>

      {showEarnSection && (
        <section ref={earnRef} className="py-12 px-4 max-w-6xl mx-auto text-center">
          <h2 className="text-3xl font-semibold text-white mb-8">
            💰 How to Earn CodeCoins
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 text-left">
            <div className="bg-gray-900/70 p-6 rounded-xl border border-purple-800 hover:shadow-lg transition">
              <Trophy className="text-yellow-400 w-8 h-8 mb-3" />
              <h3 className="text-lg font-bold text-white mb-2">Solve Problems</h3>
              <p className="text-sm text-gray-400">Earn CodeCoins for solving DSA problems across difficulty levels.</p>
            </div>
            <div className="bg-gray-900/70 p-6 rounded-xl border border-purple-800 hover:shadow-lg transition">
              <Clock className="text-blue-400 w-8 h-8 mb-3" />
              <h3 className="text-lg font-bold text-white mb-2">Daily Streak</h3>
              <p className="text-sm text-gray-400">Maintain a daily streak to get bonus CodeCoins every 5 days!</p>
            </div>
            <div className="bg-gray-900/70 p-6 rounded-xl border border-purple-800 hover:shadow-lg transition">
              <Star className="text-pink-400 w-8 h-8 mb-3" />
              <h3 className="text-lg font-bold text-white mb-2">Earn Badges</h3>
              <p className="text-sm text-gray-400">Achieve milestones and receive badges that reward you with coins.</p>
            </div>
            <div className="bg-gray-900/70 p-6 rounded-xl border border-purple-800 hover:shadow-lg transition">
              <Sparkles className="text-cyan-400 w-8 h-8 mb-3" />
              <h3 className="text-lg font-bold text-white mb-2">Compete in Contests</h3>
              <p className="text-sm text-gray-400">Participate in weekly and monthly contests to win big CodeCoins!</p>
            </div>
          </div>
        </section>
      )}


      <main className="rounded-t-3xl px-4 py-8">
        <RewardsStore />
      </main>
    </div>
  )
}
