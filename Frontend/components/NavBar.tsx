"use client"
import logoImage from "../assets/logo-nav.png";
import Image from "next/image";
import { useState, useEffect } from "react";
import { FiMenu, FiX } from "react-icons/fi";

export const NavBar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  
  useEffect(() => {
    const checkAuth = () => {
      const token = localStorage.getItem('authToken');
      setIsLoggedIn(!!token);
    };
    checkAuth();
  }, []);

  const handleSignIn = () => {
    window.location.href = 'http://codehurdle.com/auth/google';
  }

  const handleSignOut = () => {
    localStorage.removeItem('authToken');
    setIsLoggedIn(false);
    window.location.href = '/';
  }

  return (
    <div className="bg-gray-950 border-b border-gray-800 backdrop-blur-sm bg-opacity-80">
      <div className="max-w-screen-xl mx-auto w-full px-4">
        <div className="py-4 flex items-center justify-between">
          <div className="flex items-center">
            <div className="relative">
              <Image
                src={logoImage}
                alt="Logo"
                className="w-45 mt-2 hover:brightness-110 transition-all"
                width={180}
                height={40}
              />
            </div>
            
            {/* Desktop Navigation */}
            <nav className="hidden md:flex gap-8 items-center ml-12">
              <a href="#" className="text-gray-300 hover:text-cyan-300 transition-all font-medium group">
                About
                <span className="block h-0.5 bg-cyan-400 scale-x-0 group-hover:scale-x-100 transition-transform origin-left"></span>
              </a>
              <a href="#" className="text-gray-300 hover:text-purple-300 transition-all font-medium group">
                Features
                <span className="block h-0.5 bg-purple-400 scale-x-0 group-hover:scale-x-100 transition-transform origin-left"></span>
              </a>
              <a href="#" className="text-gray-300 hover:text-pink-300 transition-all font-medium group">
                Updates
                <span className="block h-0.5 bg-pink-400 scale-x-0 group-hover:scale-x-100 transition-transform origin-left"></span>
              </a>
              <a href="#" className="text-gray-300 hover:text-emerald-300 transition-all font-medium group">
                Sheets
                <span className="block h-0.5 bg-emerald-400 scale-x-0 group-hover:scale-x-100 transition-transform origin-left"></span>
              </a>
              {isLoggedIn && (
                <>
                  <a href="/problems" className="text-gray-300 hover:text-blue-300 transition-all font-medium group">
                    Problems
                    <span className="block h-0.5 bg-blue-400 scale-x-0 group-hover:scale-x-100 transition-transform origin-left"></span>
                  </a>
                  <a href="/profile" className="text-gray-300 hover:text-violet-300 transition-all font-medium group">
                    Profile
                    <span className="block h-0.5 bg-violet-400 scale-x-0 group-hover:scale-x-100 transition-transform origin-left"></span>
                  </a>
                </>
              )}
            </nav>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button 
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-gray-300 hover:text-cyan-300 focus:outline-none transition-all"
            >
              {isMenuOpen ? <FiX size={24} className="text-cyan-300" /> : <FiMenu size={24} />}
            </button>
          </div>

          {/* Desktop Auth Button */}
          <div className="hidden md:block">
            {isLoggedIn ? (
              <button 
                onClick={handleSignOut}
                className="relative bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white py-2 px-6 rounded-full font-bold cursor-pointer transition-all duration-300 shadow-lg hover:shadow-cyan-500/30 group overflow-hidden"
              >
                <span className="relative z-10">Sign Out</span>
                <span className="absolute inset-0 bg-[linear-gradient(90deg,#00DBDE,#FC00FF)] opacity-0 group-hover:opacity-100 transition-opacity duration-500 mix-blend-overlay"></span>
              </button>
            ) : (
              <button 
                onClick={handleSignIn}
                className="relative bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white py-2 px-6 rounded-full font-bold cursor-pointer transition-all duration-300 shadow-lg hover:shadow-cyan-500/30 group overflow-hidden"
              >
                <span className="relative z-10">Sign In</span>
                <span className="absolute inset-0 bg-[linear-gradient(90deg,#00DBDE,#FC00FF)] opacity-0 group-hover:opacity-100 transition-opacity duration-500 mix-blend-overlay"></span>
              </button>
            )}
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden pb-6 pt-2 bg-gray-900/90 backdrop-blur-lg rounded-lg mt-2 border border-gray-800">
            <nav className="flex flex-col gap-3 px-4">
              <a href="#" className="text-gray-300 hover:text-cyan-300 transition-all font-medium py-2 border-b border-gray-800">
                About
              </a>
              <a href="#" className="text-gray-300 hover:text-purple-300 transition-all font-medium py-2 border-b border-gray-800">
                Features
              </a>
              <a href="#" className="text-gray-300 hover:text-pink-300 transition-all font-medium py-2 border-b border-gray-800">
                Updates
              </a>
              <a href="#" className="text-gray-300 hover:text-emerald-300 transition-all font-medium py-2 border-b border-gray-800">
                Sheets
              </a>
              {isLoggedIn && (
                <>
                  <a href="/problems" className="text-gray-300 hover:text-blue-300 transition-all font-medium py-2 border-b border-gray-800">
                    Problems
                  </a>
                  <a href="/profile" className="text-gray-300 hover:text-violet-300 transition-all font-medium py-2 border-b border-gray-800">
                    Profile
                  </a>
                  <button 
                    onClick={handleSignOut}
                    className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white py-3 px-4 rounded-full font-bold cursor-pointer transition-all duration-300 mt-3 w-full text-center"
                  >
                    Sign Out
                  </button>
                </>
              )}
              {!isLoggedIn && (
                <button 
                  onClick={handleSignIn}
                  className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white py-3 px-4 rounded-full font-bold cursor-pointer transition-all duration-300 mt-3 w-full text-center"
                >
                  Sign In
                </button>
              )}
            </nav>
          </div>
        )}
      </div>
    </div>
  )
}

export default NavBar;