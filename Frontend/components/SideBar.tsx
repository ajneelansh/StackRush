

"use client"
import { useState } from "react"
import {BookOpen, Activity } from "lucide-react"
import logoImage from "../assets/logo-nav.png"
import Image from "next/image"
import { useRouter } from "next/navigation"
import Link from "next/link";



interface SideBarProps {
  userId?: string;
  showProgress: boolean;
  setShowProgress: (show: boolean) => void;
}

export const SideBar = ({ userId, showProgress, setShowProgress }: SideBarProps) => {

  const router = useRouter()
  const [user, setUser] = useState<{ name: string; email: string; profilePicture: string } | null>(null);

  const handleLogout = async () => {
    try {
      await fetch("http://codehurdle.com/logout", {
        credentials: "include",
      });
    } catch (err) {
      console.error("Logout failed", err);
    } finally {
      router.push("/");
    }
  };

  return (
    <div className="min-h-screen w-64 flex flex-col bg-gradient-to-b from-black to-purple-950/90 border-r border-purple-800/30 overflow-y-auto">
      <div className="flex-1 flex flex-col justify-between">
        
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
            <button
              onClick={() => setShowProgress(false)}
              className={`flex items-center gap-3 px-4 py-3 text-left hover:text-white hover:bg-gradient-to-r from-purple-500/10 to-cyan-500/10 hover:rounded-lg transition-all ${
                !showProgress ? 'bg-gradient-to-r from-purple-500/10 to-cyan-500/10 rounded-lg' : 'text-gray-200'
              }`}
            >
              <BookOpen className="h-5 w-5" />
              <span className="bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent font-medium">
                Problems
              </span>
            </button>
            <button
              onClick={() => setShowProgress(true)}
              className={`flex items-center gap-3 px-4 py-3 text-left hover:text-white hover:bg-gradient-to-r from-purple-500/10 to-cyan-500/10 hover:rounded-lg transition-all ${
                showProgress ? 'bg-gradient-to-r from-purple-500/10 to-cyan-500/10 rounded-lg' : 'text-gray-200'
              }`}
            >
              <Activity className="h-5 w-5" />
              <span className="bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent font-medium">
                Progress
              </span>
            </button>
          </nav>
        </div>
      </div>
    </div>
  )
}