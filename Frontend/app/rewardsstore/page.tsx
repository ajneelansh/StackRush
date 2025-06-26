// app/rewardsstore/page.tsx
"use client"

import { RewardsStore } from "@/components/RewardsStore"
import { UserCoins } from "@/components/ui/UserCoins"
import logoImage from "../../assets/logo-nav.png"
import Image from "next/image"

export default function RewardsStorePage() {
  return (
    <div className="min-h-screen  bg-gray-950 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-cyan-900/20 via-gray-950 to-purple-900/30 text-white">
      {/* Header */}
      <header className="flex justify-between items-center px-6 py-4 border-b border-white/10 bg-black/80 backdrop-blur-md">
        <div className="text-xl font-semibold flex items-center gap-2">
        <Image
          src={logoImage}
          alt="Logo"
          className="w-45 mt-2 hover:brightness-110 transition-all"
          width={180}
          height={40}
        />
        </div>

        <div className="flex items-center space-x-2 text-sm bg-zinc-800 px-4 py-2 rounded-md border border-zinc-700 shadow-sm">
          <span className="hidden md:flex">Your Coins:</span>
          <UserCoins small />
        </div>
      </header>

      {/* Hero Section */}
      <section className="text-center py-12 px-4 border-b border-white/10 ">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent">
          CodeHurdle Rewards Store
        </h1>
        <p className="text-gray-400 mt-3 max-w-2xl mx-auto">
          Shop exclusive rewards and perks with your earned CodeCoins.
        </p>

      </section>

      <main className=" bg-gray-950 text-white bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-cyan-900/20 via-gray-950 to-purple-900/30 rounded-t-3xl px-4 py-8">
        <RewardsStore />
      </main>
    </div>
  )
}
