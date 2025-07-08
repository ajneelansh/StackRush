"use client"

import { motion } from "framer-motion"

const features = [
  {
    title: "Live Coding Contests and Hackathons",
    description: "Join regular live contests and hackathons with global participants, complete with live rankings and instant feedback.",
    tag: "Contests",
    color: "from-cyan-500 to-blue-500",
  },
  {
    title: "Interview Readiness & Weakness Tracker",
    description: "Monitor your preparation progress across key topics, with targeted suggestions to improve weak areas before interviews.",
    tag: "Preparation",
    color: "from-purple-600 to-pink-500",
  },
  {
    title: "Dynamic Leaderboards and Gamification",
    description: "Earn badges, unlock achievements, and compete on weekly and monthly leaderboards to stay motivated.",
    tag: "Gamification",
    color: "from-yellow-500 to-orange-500",
  },
  
]

export const ProductShowcase = () => {
  return (
    <section className="bg-black text-white py-24 px-4 sm:px-8">
     
      <div className="max-w-3xl mx-auto text-center mb-16">
        <h2 className="text-4xl sm:text-5xl font-extrabold bg-gradient-to-r from-purple-600 to-purple-400 text-transparent bg-clip-text">
          Features We Are Working On...
        </h2>
        <p className="mt-4 text-gray-400 text-lg">
          Here's a sneak peek at upcoming features designed to level up your competitive programming prep.
        </p>
      </div>

     
      <div className="grid gap-8 grid-cols-1 md:grid-cols-3 max-w-6xl mx-auto">
        {features.map((feature, index) => (
          <div
            key={feature.title}
            className="relative p-6 rounded-2xl border border-white/10 backdrop-blur-lg bg-white/5 overflow-hidden transition-transform duration-300 hover:scale-[1.03] hover:shadow-lg hover:shadow-purple-950 cursor-pointer"
          >
           
            <div className={`inline-block px-3 py-1 text-xs font-medium rounded-full bg-gradient-to-r ${feature.color} text-white mb-4`}>
              {feature.tag}
            </div>

            <h3 className="text-xl font-bold mb-2 text-white">
              {feature.title}
            </h3>
            <p className="text-gray-300 text-sm leading-relaxed">
              {feature.description}
            </p>

          
            <div className={`absolute bottom-0 right-0 w-24 h-24 bg-gradient-to-br ${feature.color} opacity-10 rounded-tl-3xl`} />
          </div>
        ))}
      </div>
    </section>
  )
}

export default ProductShowcase
