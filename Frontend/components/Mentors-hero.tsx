"use client"
import { AnimatedTestimonials } from "./Mentors";

export const MentorsHero = () => {
    return (
        <div className="min-h-screen bg-gray-950 text-white bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-cyan-900/20 via-gray-950 to-purple-900/30 py-20 relative overflow-hidden">
 
            <div className="absolute inset-0 z-0 overflow-hidden">
                <div className="absolute top-1/4 -left-20 w-96 h-96 bg-purple-600 rounded-full mix-blend-soft-light filter blur-3xl opacity-20 animate-pulse"></div>
                <div className="absolute bottom-1/3 -right-20 w-96 h-96 bg-cyan-600 rounded-full mix-blend-soft-light filter blur-3xl opacity-20 animate-pulse delay-300"></div>
                <div className="absolute top-1/2 left-1/2 w-64 h-64 bg-indigo-600 rounded-full mix-blend-soft-light filter blur-3xl opacity-20 animate-pulse delay-700"></div>
            </div>
            
            <div className="container relative z-10 mx-auto px-4">
                <div className="text-center mb-16">
                    <div className="flex justify-center">
                        <p className="inline-flex gap-3 border border-cyan-400/30 py-1 px-3 rounded-full bg-cyan-900/10 backdrop-blur-sm animate-bounce">
                            <span className="bg-[linear-gradient(90deg,#00DBDE,#FC00FF)] text-transparent bg-clip-text font-medium">
                                ✨ Expert Guidance
                            </span>
                        </p>
                    </div>
                    
                    <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold text-center mt-8 leading-tight bg-clip-text text-transparent bg-[linear-gradient(90deg,#FFF,#B5FFFD)] [-webkit-background-clip:text]">
                        Learn From <span className="text-cyan-300">Top 1%</span><br/>
                        <span className="text-pink-300">Coders</span> Worldwide
                    </h1>
                    
                    <p className="text-center text-lg sm:text-xl mt-8 max-w-3xl mx-auto text-gray-300 font-medium">
                        Our mentors have <span className="text-cyan-300">aced</span> coding interviews at FAANG and won <span className="text-pink-300">international</span> competitions - now they're here to guide you.
                    </p>
                </div>

                {/* Testimonials*/}
                <div className="mt-16 max-w-7xl mx-auto">
                    <AnimatedTestimonials testimonials={[
                        {
                            quote: "I've trained 100+ engineers who now work at top tech companies. This platform makes mentorship scalable.",
                            name: "Alex Chen",
                            title: "Ex-Google | 3x ICPC World Finalist",
                            src: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde",
                            accent: "from-cyan-500 to-blue-600"
                        },
                        {
                            quote: "The problem recommendation system is uncanny - it identifies weaknesses better than human mentors.",
                            name: "Priya K.",
                            title: "Meta SWE | Codeforces Legend",
                            src: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80",
                            accent: "from-purple-500 to-pink-600"
                        },
                        {
                            quote: "My students improve 3x faster using this platform's adaptive learning system.",
                            name: "Mark R.",
                            title: "Stanford TA | IOI Gold Medalist",
                            src: "https://images.unsplash.com/photo-1623582854588-d60de57fa33f",
                            accent: "from-amber-500 to-orange-600"
                        }
                    ]}/>
                </div>

            
                <div className="flex justify-center gap-4">
                    <button 
                        className="relative bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white py-3 px-8 rounded-full font-bold cursor-pointer transition-all duration-300 shadow-lg hover:shadow-cyan-500/30 group overflow-hidden"
                        onClick={() => window.location.href = 'http://codehurdle.com/auth/google'}
                    >
                        <span className="relative z-10">Get Mentored</span>
                        <span className="absolute inset-0 bg-[linear-gradient(90deg,#00DBDE,#FC00FF)] opacity-0 group-hover:opacity-100 transition-opacity duration-500 mix-blend-overlay"></span>
                    </button>
                    
                    <button className="border-2 border-cyan-400/30 hover:border-cyan-400/60 text-cyan-100 hover:text-white py-3 px-6 rounded-full font-medium cursor-pointer transition-all duration-300 backdrop-blur-sm">
                        Meet All Mentors →
                    </button>
                </div>
            </div>
        </div>
    )
}

export default MentorsHero;