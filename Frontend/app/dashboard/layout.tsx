// app/dashboard/layout.tsx
"use client"

import { ReactNode, useState } from "react"
import { SideBar } from "@/components/SideBar"
import { Header } from "@/components/Header"
import { Menu, X } from "lucide-react"
import React from "react"
import { ProgressProvider } from "./ProgressContext"

export default function DashboardLayout({ children }: { children: ReactNode }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)

  return (
    <ProgressProvider>
      <div className="flex h-screen bg-black  text-white overflow-hidden">
        {/* Mobile toggle button */}
        <button
          className="md:hidden fixed top-6 left-4 z-[100] p-2 bg-purple-900/80 border border-purple-700 rounded-lg"
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
        >
          {isSidebarOpen ? <X className="h-5 w-5 text-white" /> : <Menu className="h-5 w-5 text-white" />}
        </button>

        {/* Sidebar */}
        <div className={`fixed md:static z-40 w-64 h-full bg-gradient-to-b from-black to-purple-950/90 border-r border-purple-800/30 transition-all duration-300 ${isSidebarOpen ? 'left-0' : '-left-64'} md:left-0`}>
          <SideBar />
        </div>

        {/* Main Content */}
        <div className="flex-1 flex flex-col overflow-auto max-w-[1600px] mx-auto w-full">
          <Header />
          <main className="p-4 md:p-6 overflow-y-auto">
            {children}
          </main>
        </div>
      </div>
    </ProgressProvider>
  )
}
