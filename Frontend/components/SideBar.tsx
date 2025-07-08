"use client"

import { useState } from "react"
import { BookOpen, Activity, LayoutList } from "lucide-react"
import logoImage from "../assets/logo-nav.png"
import Image from "next/image"
import { useRouter, usePathname } from "next/navigation"
import Link from "next/link"
import { useProgress } from "@/app/dashboard/ProgressContext"

export const SideBar = () => {
  const router = useRouter()
  const pathname = usePathname()
  const [user, setUser] = useState<{ name: string; email: string; profilePicture: string } | null>(null)
  const { showProgress, setShowProgress } = useProgress()

  const isDashboard = pathname === "/dashboard"
  const isProgress = isDashboard && showProgress
  const isProblems = isDashboard && !showProgress
  const isSheets = pathname.startsWith("/dashboard/sheet")

  const activeClasses =
    "bg-gradient-to-r from-purple-600 to-purple-400 text-white shadow-md"

  const defaultClasses =
    "text-gray-300 hover:text-white hover:bg-gradient-to-r from-purple-700/20 to-cyan-600/10"

  return (
    <aside className="min-h-screen w-64 flex flex-col bg-black border-r border-purple-900 shadow-xl">
      <div className="flex-1 flex flex-col">
        {/* Logo */}
        <div className="px-6 pt-6 pb-3">
          <Image
            src={logoImage}
            alt="CodeHurdle Logo"
            className="w-40 hover:brightness-110 transition-all"
            priority
          />
        </div>

        {/* Navigation */}
        <nav className="flex flex-col gap-2 mt-6 px-4 text-sm font-medium">
          {/* Problems */}
          <button
            onClick={() => {
              setShowProgress(false)
              router.push("/dashboard")
            }}
            className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${
              isProblems ? activeClasses : defaultClasses
            }`}
          >
            <BookOpen className="h-5 w-5 text-purple-300" />
            <span>Problems</span>
          </button>

          {/* Progress */}
          <button
            onClick={() => {
              setShowProgress(true)
              router.push("/dashboard")
            }}
            className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${
              isProgress ? activeClasses : defaultClasses
            }`}
          >
            <Activity className="h-5 w-5 text-purple-300" />
            <span>Progress</span>
          </button>

          {/* Sheets */}
          <Link
            href="/dashboard/sheet"
            className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${
              isSheets ? activeClasses : defaultClasses
            }`}
          >
            <LayoutList className="h-5 w-5 text-purple-300" />
            <span>Topic Wise Sheets</span>
          </Link>
        </nav>
      </div>
    </aside>
  )
}
