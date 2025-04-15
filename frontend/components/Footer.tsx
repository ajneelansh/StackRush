"use client"
import logoImage from "../assets/logo-nav.png";
import Image from "next/image";
import { Mail, Phone, Github, Linkedin, Twitter, BookOpen, Award,} from "lucide-react"

export const Footer = () => {
  return (
    <footer className="bg-black text-white py-16 px-5">
      <div className="max-w-6xl mx-auto">
        {/* Top Section with Logo and Social Icons */}
        <div className="flex flex-col md:flex-row justify-between items-center mb-12">
          <div className="flex items-center space-x-3 mb-6 md:mb-0">
            <div className="relative group">
                
                 <Image src={logoImage} alt="Logo" className="w-30"/>
              
            </div>
          </div>

          <div className="flex space-x-4">
            <a
              href="#"
              className="bg-slate-800/50 p-2 rounded-full hover:bg-slate-700 transition-all duration-300 hover:scale-110"
            >
              <Github className="h-5 w-5 text-cyan-300" />
              <span className="sr-only">GitHub</span>
            </a>
            <a
              href="#"
              className="bg-slate-800/50 p-2 rounded-full hover:bg-slate-700 transition-all duration-300 hover:scale-110"
            >
              <Linkedin className="h-5 w-5 text-cyan-300" />
              <span className="sr-only">LinkedIn</span>
            </a>
            <a
              href="#"
              className="bg-slate-800/50 p-2 rounded-full hover:bg-slate-700 transition-all duration-300 hover:scale-110"
            >
              <Twitter className="h-5 w-5 text-cyan-300" />
              <span className="sr-only">Twitter</span>
            </a>
          </div>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
          {/* Left Section - Logo & Paragraph */}
          <div className="space-y-6">
            <p className="text-slate-300 leading-relaxed">
              Elevate your coding skills with our comprehensive resources for data structures, algorithms, and
              competitive programming. Master the art of efficient problem-solving.
            </p>

            <div className="pt-4">
              <div className="inline-flex items-center px-3 py-1 rounded-full bg-gradient-to-r from-cyan-500/10 to-purple-500/10 border border-cyan-500/20">
                <span className="text-xs font-medium text-cyan-300">Join our community of 10,000+ developers</span>
              </div>
            </div>
          </div>

          {/* Middle Sections */}
          <div>
            <h3 className="text-lg font-semibold mb-5 text-white relative inline-flex items-center">
              <BookOpen className="h-4 w-4 mr-2 text-cyan-400" />
              <span className="relative">LEARN</span>
              <span className="absolute bottom-0 left-0 w-full h-0.5 bg-gradient-to-r from-cyan-400 to-cyan-400 opacity-70"></span>
            </h3>
            <ul className="space-y-3">
              {["Data Structures", "Algorithms", "Problem Solving", "Time Complexity"].map((item) => (
                <li
                  key={item}
                  className="group flex items-center text-slate-300 hover:text-white transition-colors duration-200"
                >
                  <div className="h-1.5 w-1.5 rounded-full bg-cyan-500 mr-2 opacity-0 group-hover:opacity-100 transition-all duration-300"></div>
                  <a href="#" className="text-sm hover:translate-x-1 transition-transform duration-200">
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-5 text-white relative inline-flex items-center">
              <Award className="h-4 w-4 mr-2 text-cyan-400" />
              <span className="relative">PRACTICE</span>
              <span className="absolute bottom-0 left-0 w-full h-0.5 bg-gradient-to-r from-cyan-400 to-cyan-400 opacity-70"></span>
            </h3>
            <ul className="space-y-3">
              {["Coding Challenges", "Contest Archive", "Interview Prep", "Problem Sets"].map((item) => (
                <li
                  key={item}
                  className="group flex items-center text-slate-300 hover:text-white transition-colors duration-200"
                >
                  <div className="h-1.5 w-1.5 rounded-full bg-cyan-500 mr-2 opacity-0 group-hover:opacity-100 transition-all duration-300"></div>
                  <a href="#" className="text-sm hover:translate-x-1 transition-transform duration-200">
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-5 text-white relative inline-flex items-center">
              <Mail className="h-4 w-4 mr-2 text-cyan-400" />
              <span className="relative">CONNECT</span>
              <span className="absolute bottom-0 left-0 w-full h-0.5 bg-gradient-to-r from-cyan-400 to-cyan-400 opacity-70"></span>
            </h3>
            <ul className="space-y-4">
              <li className="flex items-center text-slate-300 hover:text-white transition-colors duration-200 group">
                <div className="p-2 rounded-full bg-slate-800/50 mr-3 group-hover:bg-slate-700 transition-colors duration-300">
                  <Phone className="h-4 w-4 text-cyan-400" />
                </div>
                <span className="text-sm">+123 456 7890</span>
              </li>
              <li className="flex items-center text-slate-300 hover:text-white transition-colors duration-200 group">
                <div className="p-2 rounded-full bg-slate-800/50 mr-3 group-hover:bg-slate-700 transition-colors duration-300">
                  <Mail className="h-4 w-4 text-cyan-400" />
                </div>
                <span className="text-sm">contact@algohub.com</span>
              </li>
            </ul>

          </div>
        </div>

      </div>

      {/* Bottom Copyright */}
      <div className="max-w-6xl mx-auto mt-16 pt-6 border-t border-slate-800">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <p className="text-sm text-slate-400">© {new Date().getFullYear()} codehurdle. All rights reserved.</p>
          <div className="flex space-x-6 mt-4 md:mt-0">
            <a href="#" className="text-xs text-slate-400 hover:text-white transition-colors duration-200">
              Privacy Policy
            </a>
            <a href="#" className="text-xs text-slate-400 hover:text-white transition-colors duration-200">
              Terms of Service
            </a>
            <a href="#" className="text-xs text-slate-400 hover:text-white transition-colors duration-200">
              Cookies
            </a>
          </div>
        </div>
      </div>
    </footer>
  )
}

