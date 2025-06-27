"use client";

import { useRouter, usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Gift } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { UserCoins } from "@/components/ui/UserCoins";
import logoImage from "../assets/logo-nav.png"; 

export const Header = () => {
  const router = useRouter();
  const pathname = usePathname(); 

  const [user, setUser] = useState<{
    name?: string;
    email?: string;
    profilePicture?: string;
  }>({
    name: "abc",
    email: "abc@example.com",
    profilePicture: "",
  });

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


  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const res = await fetch("http://localhost:8080/getuser", {
          credentials: "include",
        });

        if (res.ok) {
          const data = await res.json();
          setUser({
            name: data.name,
            email: data.email,
            profilePicture: data.profile_picture || "",
          });
        } else {
          console.warn("Failed to fetch user info");
        }
      } catch (err) {
        console.error("Error fetching user info", err);
      }
    };

    fetchUserData();
  }, []);


  return (
    <header className="sticky top-0 z-10 flex items-center justify-between min-h-20 border-b border-purple-900/50 backdrop-blur-sm px-4 md:px-6 bg-black/80">
      {pathname?.startsWith("/profile") ? (
        <Link href="/dashboard" className="flex items-center">
          <Image
            src={logoImage}
            alt="CodeHurdle Logo"
            width={160}
            height={50}
            className="h-auto w-40 hover:brightness-110 transition-all"
            priority
          />
        </Link>
      ) : (
        <div /> 
      )}

      {/* Right-side actions */}
      <div className="flex items-center gap-3">
        <Link
          href="/rewardsstore"
          className="text-purple-400 hover:text-white transition-transform hover:scale-105"
        >
          <Gift className="h-6 w-6" />
        </Link>

        <UserCoins />

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <div className="flex items-center gap-3 cursor-pointer">
              <p className="text-sm text-white font-medium max-w-[140px] truncate">
                {user?.name || "Username"}
              </p>

              {user?.profilePicture ? (
                <Image
                  src={user.profilePicture}
                  alt="Profile"
                  width={36}
                  height={36}
                  className="h-9 w-9 rounded-full border border-purple-500 hover:scale-105 transition-transform object-cover"
                />
              ) : (
                <div className="h-9 w-9 rounded-full bg-gradient-to-r from-purple-500 to-cyan-500 flex items-center justify-center border border-purple-500 hover:scale-105 transition-transform">
                  <span className="text-white font-medium text-sm">
                    {user?.name?.charAt(0).toUpperCase() || "U"}
                  </span>
                </div>
              )}
            </div>
          </DropdownMenuTrigger>

          <DropdownMenuContent
            align="end"
            className="min-w-[180px] mt-2 rounded-lg p-1 shadow-xl bg-gradient-to-b from-gray-900/90 to-purple-950/90 border border-purple-800/40 backdrop-blur-md"
          >
            <DropdownMenuItem
              onSelect={() => router.push("/profile")}
              className="text-sm text-purple-100 hover:bg-purple-800/30 cursor-pointer"
            >
              Profile
            </DropdownMenuItem>
            <DropdownMenuItem
              onSelect={handleLogout}
              className="text-sm text-red-400 hover:bg-red-800/30 cursor-pointer"
            >
              Logout
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
};
