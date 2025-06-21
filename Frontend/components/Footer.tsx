"use client"
import logoImage from "../assets/logo-nav.png";
import Image from "next/image";
import { Mail, Phone, Github, Linkedin, Twitter, BookOpen, Award } from "lucide-react"

export const Footer = () => {
  return (
    <footer className="bg-gray-950 text-white py-10 px-4 sm:px-6 relative overflow-hidden">
     
      <div className="absolute inset-0 z-0">
        <div className="absolute bottom-0 left-0 w-full h-1/2 bg-gradient-to-t from-gray-900 to-transparent"></div>
        <div className="absolute top-1/3 right-0 w-64 h-64 bg-cyan-600 rounded-full mix-blend-soft-light filter blur-3xl opacity-5"></div>
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Top Section */}
        <div className="flex flex-col md:flex-row justify-between items-center mb-12 gap-8">
          <div className="flex items-center space-x-3">
            <div className="relative group">
              <Image 
                src={logoImage} 
                alt="Logo" 
                className="w-40 hover:brightness-110 transition-all duration-300"
                width={160}
                height={40}
              />
            </div>
          </div>

          <div className="flex space-x-3 sm:space-x-4">
            {[
              { icon: <Github className="h-5 w-5" />, label: "GitHub" },
              { icon: <Linkedin className="h-5 w-5" />, label: "LinkedIn" },
              { icon: <Twitter className="h-5 w-5" />, label: "Twitter" }
            ].map((social) => (
              <a
                key={social.label}
                href="#"
                className="bg-gray-900/50 p-2.5 rounded-full hover:bg-gray-800 transition-all duration-300 hover:scale-110 border border-gray-800 hover:border-cyan-400/30"
              >
                <span className="text-cyan-300">{social.icon}</span>
                <span className="sr-only">{social.label}</span>
              </a>
            ))}
          </div>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* About Section */}
          <div className="space-y-6">
            <p className="text-gray-300 leading-relaxed text-sm sm:text-base">
              Elevate your coding skills with our comprehensive resources for data structures, algorithms, and
              competitive programming. Master the art of efficient problem-solving.
            </p>

            <div className="pt-2">
              <div className="inline-flex items-center px-3 py-1 rounded-full bg-gradient-to-r from-cyan-500/10 to-purple-500/10 border border-cyan-500/20">
                <span className="text-xs font-medium text-cyan-300">Join our community of 10,000+ developers</span>
              </div>
            </div>
          </div>

          {/* Learn Section */}
          <div>
            <h3 className="text-lg font-semibold mb-5 text-white relative inline-flex items-center group">
              <BookOpen className="h-4 w-4 mr-2 text-cyan-400 group-hover:text-cyan-300 transition-colors" />
              <span className="relative">
                LEARN
                <span className="absolute bottom-0 left-0 w-full h-0.5 bg-gradient-to-r from-cyan-400 to-blue-500 opacity-70 group-hover:opacity-100 transition-opacity"></span>
              </span>
            </h3>
            <ul className="space-y-3">
              {["Data Structures", "Algorithms", "Problem Solving", "Time Complexity"].map((item) => (
                <li
                  key={item}
                  className="group flex items-center text-gray-300 hover:text-white transition-colors duration-200"
                >
                  <div className="h-1.5 w-1.5 rounded-full bg-cyan-500 mr-2 opacity-0 group-hover:opacity-100 transition-all duration-300"></div>
                  <a href="#" className="text-sm hover:translate-x-1 transition-transform duration-200">
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Practice Section */}
          <div>
            <h3 className="text-lg font-semibold mb-5 text-white relative inline-flex items-center group">
              <Award className="h-4 w-4 mr-2 text-cyan-400 group-hover:text-cyan-300 transition-colors" />
              <span className="relative">
                PRACTICE
                <span className="absolute bottom-0 left-0 w-full h-0.5 bg-gradient-to-r from-cyan-400 to-blue-500 opacity-70 group-hover:opacity-100 transition-opacity"></span>
              </span>
            </h3>
            <ul className="space-y-3">
              {["Coding Challenges", "Contest Archive", "Interview Prep", "Problem Sets"].map((item) => (
                <li
                  key={item}
                  className="group flex items-center text-gray-300 hover:text-white transition-colors duration-200"
                >
                  <div className="h-1.5 w-1.5 rounded-full bg-cyan-500 mr-2 opacity-0 group-hover:opacity-100 transition-all duration-300"></div>
                  <a href="#" className="text-sm hover:translate-x-1 transition-transform duration-200">
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Connect Section */}
          <div>
            <h3 className="text-lg font-semibold mb-5 text-white relative inline-flex items-center group">
              <Mail className="h-4 w-4 mr-2 text-cyan-400 group-hover:text-cyan-300 transition-colors" />
              <span className="relative">
                CONNECT
                <span className="absolute bottom-0 left-0 w-full h-0.5 bg-gradient-to-r from-cyan-400 to-blue-500 opacity-70 group-hover:opacity-100 transition-opacity"></span>
              </span>
            </h3>
            <ul className="space-y-4">
              <li className="flex items-center text-gray-300 hover:text-white transition-colors duration-200 group">
                <div className="p-2 rounded-full bg-gray-900/50 mr-3 group-hover:bg-gray-800 transition-colors duration-300 border border-gray-800 group-hover:border-cyan-400/30">
                  <Phone className="h-4 w-4 text-cyan-400 group-hover:text-cyan-300" />
                </div>
                <span className="text-sm">+123 456 7890</span>
              </li>
              <li className="flex items-center text-gray-300 hover:text-white transition-colors duration-200 group">
                <div className="p-2 rounded-full bg-gray-900/50 mr-3 group-hover:bg-gray-800 transition-colors duration-300 border border-gray-800 group-hover:border-cyan-400/30">
                  <Mail className="h-4 w-4 text-cyan-400 group-hover:text-cyan-300" />
                </div>
                <span className="text-sm">contact@codehurdle.com</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Copyright */}
        <div className="mt-16 pt-8 border-t border-gray-800">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-sm text-gray-400">
              © {new Date().getFullYear()} CodeHurdle. All rights reserved.
            </p>
            <div className="flex flex-wrap justify-center gap-x-6 gap-y-2">
              {["Privacy Policy", "Terms of Service", "Cookies"].map((item) => (
                <a 
                  key={item} 
                  href="#" 
                  className="text-xs text-gray-400 hover:text-cyan-300 transition-colors duration-200"
                >
                  {item}
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}