import { BookOpen, CheckCircle, ChevronDown, Clock, Code2, Github, LogOut, MoreVertical, User } from "lucide-react"
import { Sidebar, SidebarContent, SidebarFooter, SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem, SidebarProvider } from "./ui/sidebar"
import { Avatar, AvatarFallback, AvatarImage } from "@radix-ui/react-avatar"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@radix-ui/react-dropdown-menu"
import { Button } from "./ui/button"
import logoImage from "../assets/logo-nav.png"
import Image from "next/image"

export const SideBar = () => {
    return (
        <aside className="h-full w-64 bg-gradient-to-b from-black to-purple-950 border-r border-purple-800/30 backdrop-blur-md">
  <div className="p-4">
    <div className="flex items-center gap-2 mb-6">
      <Image src={logoImage} alt="Logo" className="w-40" />
      
    </div>
    <nav className="flex flex-col gap-2">
      <a href="#" className="flex items-center gap-3 px-4 py-2 text-white hover:bg-purple-800/20 hover:rounded-lg transition-colors">
       
        Problems
      </a>
      <a href="#" className="flex items-center gap-3 px-4 py-2 text-white hover:bg-purple-800/20 hover:rounded-lg transition-colors">
        
        Progress
      </a>
      {/* more links */}
    </nav>
  </div>
  <div className="p-4 border-t border-purple-800/20">
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-3">
        {/* Avatar */}
        
        {/* Username */}
        <div className="text-white">
          <p className="text-sm font-semibold"></p>
        </div>
      </div>

      {/* 3-dots menu */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon" className="text-white hover:bg-purple-800/20">
            <MoreVertical className="h-5 w-5" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="bg-black border border-purple-800/30">
          <DropdownMenuItem className="text-white hover:bg-purple-800/20">
            Logout
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  </div>
</aside>
    )
}
    