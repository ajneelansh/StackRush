"use client"

import { MoreVertical } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import logoImage from "../assets/logo-nav.png"
import Image from "next/image"

export const SideBar = ({ userId }: { userId?: string }) => {
  return (
    <div className="min-h-screen w-64 flex flex-col bg-gradient-to-b from-black to-purple-950/90 border-r border-purple-800/30 overflow-y-auto">
      <div className="flex-1 flex flex-col justify-between">
        {/* Top logo + nav */}
        <div className="p-4">
          <div className="flex items-center justify-between mb-6">
            <Image 
              src={logoImage} 
              alt="Logo" 
              className="w-40 hover:brightness-110 transition-all"
              priority
            />
          </div>

          <nav className="flex flex-col gap-1">
            <a 
              href="#" 
              className="flex items-center gap-3 px-4 py-3 text-gray-200 hover:text-white hover:bg-gradient-to-r from-purple-500/10 to-cyan-500/10 hover:rounded-lg transition-all"
            >
              <span className="bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent font-medium">
                Problems
              </span>
            </a>
            <a 
              href="#" 
              className="flex items-center gap-3 px-4 py-3 text-gray-200 hover:text-white hover:bg-gradient-to-r from-purple-500/10 to-cyan-500/10 hover:rounded-lg transition-all"
            >
              <span className="bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent font-medium">
                Progress
              </span>
            </a>
          </nav>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-purple-800/20">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="h-9 w-9 rounded-full bg-gradient-to-r from-purple-500 to-cyan-500 flex items-center justify-center">
                <span className="text-white font-medium text-sm">
                  {userId?.charAt(0).toUpperCase() || "U"}
                </span>
              </div>
              <div className="text-white max-w-[120px] truncate">
                <p className="text-sm font-medium truncate">
                  {userId || "Username"}
                </p>
              </div>
            </div>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="text-purple-300 hover:bg-purple-800/30 hover:text-white">
                  <MoreVertical className="h-5 w-5" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                align="end"
                className="min-w-[180px] mt-2 rounded-lg p-1 shadow-xl bg-gradient-to-b from-gray-900/90 to-purple-950/90 border border-purple-800/40 backdrop-blur-md"
              >
                <DropdownMenuItem className="text-sm text-purple-100 hover:bg-purple-800/30 cursor-pointer">
                  Profile
                </DropdownMenuItem>
                <DropdownMenuItem className="text-sm text-purple-100 hover:bg-purple-800/30 cursor-pointer">
                  Settings
                </DropdownMenuItem>
                <DropdownMenuItem className="text-sm text-red-400 hover:bg-red-800/30 cursor-pointer">
                  Logout
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>
    </div>
  )
}
