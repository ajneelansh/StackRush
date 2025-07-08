"use client"

import logoImage from "../assets/logo-nav.png"
import Image from "next/image"
import Link from "next/link"
import { useState, useEffect } from "react"
import { usePathname } from "next/navigation"
import { FiMenu, FiX } from "react-icons/fi"

export const NavBar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const pathname = usePathname()
  const [activeSection, setActiveSection] = useState<string | null>(null)

  useEffect(() => {
    const token = localStorage.getItem("authToken")
    setIsLoggedIn(!!token)
  }, [])

  useEffect(() => {
    const handleScroll = () => {
      const sections = ["home", "features", "faqs"]
      let found = false

      for (const id of sections) {
        const section = document.getElementById(id)
        if (section) {
          const rect = section.getBoundingClientRect()
          if (rect.top <= 100 && rect.bottom >= 100) {
            setActiveSection(`#${id}`)
            found = true
            break
          }
        }
      }

      if (!found) {
        setActiveSection(null)
      }
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const handleSignIn = () => {
    window.location.href = "http://localhost:8080/auth/google"
  }

  const handleSignOut = () => {
    localStorage.removeItem("authToken")
    setIsLoggedIn(false)
    window.location.href = "/"
  }

  const navItems = [
    { href: "#home", label: "Home" },
    { href: "#features", label: "Features" },
    { href: "#faqs", label: "FAQs" },
  ]

  return (
    <header className="sticky top-0 z-50 backdrop-blur-md bg-black shadow-[0_3px_10px_rgba(128,0,255,0.25)] border-b border-purple-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-10">
        <div className="flex items-center justify-between py-4">
 
          <Link href="/">
            <Image
              src={logoImage}
              alt="Logo"
              width={160}
              height={40}
              className="brightness-125 hover:scale-105 transition-transform"
            />
          </Link>

       
          <nav className="hidden md:flex items-center gap-8">
            {navItems.map((item) => (
              <Link
                key={item.label}
                href={item.href}
                className={`group relative font-medium transition ${
                  activeSection === item.href
                    ? "text-purple-400"
                    : "text-gray-300 hover:text-purple-400"
                }`}
              >
                {item.label}
                <span
                  className={`absolute left-0 -bottom-1 h-0.5 bg-purple-400 transition-all duration-300 ${
                    activeSection === item.href ? "w-full" : "w-0 group-hover:w-full"
                  }`}
                />
              </Link>
            ))}

            {isLoggedIn && (
              <>
                <Link
                  href="/problems"
                  className={`group relative font-medium transition ${
                    pathname === "/problems"
                      ? "text-purple-400"
                      : "text-gray-300 hover:text-purple-400"
                  }`}
                >
                  Problems
                  <span
                    className={`absolute left-0 -bottom-1 h-0.5 bg-purple-400 transition-all duration-300 ${
                      pathname === "/problems" ? "w-full" : "w-0 group-hover:w-full"
                    }`}
                  />
                </Link>
                <Link
                  href="/profile"
                  className={`group relative font-medium transition ${
                    pathname === "/profile"
                      ? "text-purple-400"
                      : "text-gray-300 hover:text-purple-400"
                  }`}
                >
                  Profile
                  <span
                    className={`absolute left-0 -bottom-1 h-0.5 bg-purple-400 transition-all duration-300 ${
                      pathname === "/profile" ? "w-full" : "w-0 group-hover:w-full"
                    }`}
                  />
                </Link>
              </>
            )}
          </nav>

          <div className="hidden md:block">
            {isLoggedIn ? (
              <button
                onClick={handleSignOut}
                className="bg-gradient-to-r from-purple-600 to-purple-400 text-white py-2 px-6 rounded-full font-semibold transition hover:shadow-purple-600/50 hover:scale-105"
              >
                Sign Out
              </button>
            ) : (
              <button
                onClick={handleSignIn}
                className="bg-gradient-to-r from-purple-600 to-purple-400 text-white py-2 px-6 rounded-full font-semibold transition hover:shadow-purple-600/50 hover:scale-105"
              >
                Sign In
              </button>
            )}
          </div>


          <div className="md:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-purple-400 focus:outline-none"
            >
              {isMenuOpen ? <FiX size={24} /> : <FiMenu size={24} />}
            </button>
          </div>
        </div>


        {isMenuOpen && (
          <div className="md:hidden bg-black/95 backdrop-blur-lg rounded-xl px-4 py-4 border border-purple-800 space-y-4 origin-top transform overflow-hidden">
            {navItems.map((item) => (
              <Link
                key={item.label}
                href={item.href}
                className={`block font-medium transition ${
                  activeSection === item.href
                    ? "text-purple-400"
                    : "text-gray-300 hover:text-purple-400"
                }`}
              >
                {item.label}
              </Link>
            ))}

            {isLoggedIn && (
              <>
                <Link
                  href="/problems"
                  className={`block font-medium ${
                    pathname === "/problems"
                      ? "text-purple-400"
                      : "text-gray-300 hover:text-purple-400"
                  }`}
                >
                  Problems
                </Link>
                <Link
                  href="/profile"
                  className={`block font-medium ${
                    pathname === "/profile"
                      ? "text-purple-400"
                      : "text-gray-300 hover:text-purple-400"
                  }`}
                >
                  Profile
                </Link>
                <button
                  onClick={handleSignOut}
                  className="w-full text-white bg-gradient-to-r from-purple-600 to-purple-400 py-2 rounded-full font-semibold mt-2 hover:shadow-purple-500/50 transition"
                >
                  Sign Out
                </button>
              </>
            )}

            {!isLoggedIn && (
              <button
                onClick={handleSignIn}
                className="w-full text-white bg-gradient-to-r from-purple-600 to-purple-400 py-2 rounded-full font-semibold transition hover:shadow-purple-500/50"
              >
                Sign In
              </button>
            )}
          </div>
        )}
      </div>
    </header>
  )
}

export default NavBar
