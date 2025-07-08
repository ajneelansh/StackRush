"use client"

import { FiArrowRight, FiBarChart2 } from "react-icons/fi"
import { motion } from "framer-motion"
import Image from "next/image"
import heroimage from "../assets/heroimage.png"

export const Hero = () => {
  const handleSignIn = () => {
    window.location.href = "http://codehurdle.com/auth/google"
  }

  return (
    <section className="bg-black text-white py-24 px-6 sm:px-12 lg:px-20 overflow-hidden">
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
        {/* Left Side */}
        <motion.div
          initial={{ opacity: 0, x: -40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
        >
          <h1 className="text-4xl sm:text-5xl font-extrabold leading-tight mb-6 tracking-tight">
            The First Open Source Platform Integrating{" "}
            <span className="bg-gradient-to-r from-purple-600 to-purple-400 text-transparent bg-clip-text">
              Competitive Programming
            </span>{" "}
            &{" "}
            <span className="bg-gradient-to-r from-pink-600 to-yellow-400 text-transparent bg-clip-text">
              DSA Ratings
            </span>
          </h1>

          <p className="text-lg text-gray-300 mb-8 max-w-xl leading-relaxed">
            Practice. Track. Compete. The open-source platform that combines
            coding challenges with real-time performance analytics.
          </p>

     
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="flex flex-wrap gap-4 mb-10"
          >
            <button
              onClick={handleSignIn}
              className="inline-flex items-center gap-2 bg-gradient-to-r from-purple-600 to-purple-400 text-white px-6 py-3 rounded-full font-semibold shadow-md hover:scale-105 transition-transform"
            >
              Start Coding Free
              <FiArrowRight />
            </button>
            
          </motion.div>

          
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="grid grid-cols-2 sm:grid-cols-3 gap-y-4 text-sm text-gray-400 font-medium"
          >
            <div className="flex items-center gap-2">✅ Live DSA Ratings</div>
            <div className="flex items-center gap-2">✅ Open Source</div>
            <div className="flex items-center gap-2">✅ Practice Tracker</div>
          </motion.div>
        </motion.div>

        {/* Right Side */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="relative w-full"
        >
          <div className="relative w-full h-72 sm:h-96 lg:h-[420px] rounded-2xl overflow-hidden shadow-xl border border-purple-900/20">
            <Image
              src={heroimage}
              alt="Coding laptop"
              fill
              className="object-cover"
              priority
            />
          </div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.9, duration: 0.6 }}
            className="absolute bottom-[-50px] left-4 sm:left-6 bg-white/95 backdrop-blur-md border border-purple-200 p-4 rounded-xl shadow-lg w-60 sm:w-64"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">DSA Rating</p>
                <p className="text-2xl font-bold text-purple-600">1850</p>
              </div>
              <FiBarChart2 className="text-purple-500 text-3xl" />
            </div>
            <p className="mt-2 text-xs text-gray-500">Consistent Growth 📈</p>
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}

export default Hero
