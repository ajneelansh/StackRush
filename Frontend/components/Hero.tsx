"use client"
export const Hero = () => {
    const handleSignIn = () => {
        window.location.href = 'http://codehurdle.com/auth/google';
    }
    
    return ( 
        <div className=" bg-gray-950 text-white bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-cyan-900/20 via-gray-950 to-purple-900/30 py-20 relative overflow-hidden"> 
    
            <div className="container relative z-10 mx-auto px-4">
                <div className="flex items-center justify-center">
                    <p className="inline-flex gap-3 border border-cyan-400/30 py-1 px-3 rounded-full bg-cyan-900/10 backdrop-blur-sm animate-bounce">
                        <span className="bg-[linear-gradient(90deg,#00DBDE,#FC00FF)] text-transparent bg-clip-text font-medium">
                            ✨ New Platform Alert! Try Beta Now
                        </span>
                    </p>
                </div>
                
                <div className="flex justify-center mt-12">
                    <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-extrabold text-center leading-tight bg-clip-text text-transparent bg-[linear-gradient(90deg,#FFF,#B5FFFD)] [-webkit-background-clip:text]">
                        The First Open Source Platform Integrating <br/><span className="bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-blue-500"> Competetive Programming</span><br/>
                        & <span className="bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-500">DSA Ratings</span>
                    </h1>
                </div>
                
                
                <div className="flex justify-center gap-4 mt-12">
                    <button 
                        className="relative bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white py-3 px-8 rounded-full font-bold cursor-pointer transition-all duration-300 shadow-lg hover:shadow-cyan-500/30 group overflow-hidden"
                        onClick={handleSignIn}
                    >
                        <span className="relative z-10">Start Coding Free</span>
                        <span className="absolute inset-0 bg-[linear-gradient(90deg,#00DBDE,#FC00FF)] opacity-0 group-hover:opacity-100 transition-opacity duration-500 mix-blend-overlay"></span>
                    </button>
                
                </div>
                
                <div className="mt-20 mx-auto max-w-4xl bg-gray-900/50 border border-gray-800 rounded-xl p-4 backdrop-blur-sm">
                    <div className="flex gap-2 mb-4">
                        <div className="w-3 h-3 rounded-full bg-red-500"></div>
                        <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                        <div className="w-3 h-3 rounded-full bg-green-500"></div>
                    </div>
                    <div className="font-mono text-sm sm:text-base text-cyan-100 animate-pulse">
                        <span className="text-purple-400">const</span> <span className="text-cyan-300">success</span> = <span className="text-yellow-200">await</span> <span className="text-green-400">solveProblem</span>(<span className="text-pink-300">yourSkillLevel</span>);
                    </div>
                </div>
            </div>
        </div>
    )
}