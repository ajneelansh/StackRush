const features = [
    {
        title: "Data Structures & Algorithms",
        description: "Master core DSA concepts with our comprehensive resources and AI-powered practice problems tailored to your level.",
        icon: "📊",
        color: "from-cyan-400 to-blue-500"
    },
    {
        title: "Personalized Learning",
        description: "Get tailored recommendations based on your skill level, weaknesses, and learning pace with our adaptive algorithms.",
        icon: "🎯",
        color: "from-purple-400 to-pink-500"
    },
    {
        title: "Community Support",
        description: "Join a vibrant community of coders, participate in discussions, and get help from experts when you're stuck.",
        icon: "👥",
        color: "from-amber-400 to-orange-500"
    },
    {
        title: "Real-time Feedback",
        description: "Get instant analysis on your solutions with detailed performance metrics and optimization suggestions.",
        icon: "⚡",
        color: "from-emerald-400 to-teal-500"
    }
];

export const Features = () => {
    return (
        <div className="min-h-screen bg-gray-950 text-white py-10 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
        
            <div className="absolute inset-0 z-0">
                <div className="absolute top-20 -left-20 w-80 h-80 bg-cyan-900/20 rounded-full filter blur-3xl opacity-20"></div>
                <div className="absolute bottom-20 -right-20 w-80 h-80 bg-purple-900/20 rounded-full filter blur-3xl opacity-20"></div>
            </div>
            
            <div className="container mx-auto relative z-10">
                <div className="text-center">
                    <h2 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-blue-500">
                        Everything You Need
                    </h2>
                    <p className="mt-6 text-lg sm:text-xl max-w-3xl mx-auto text-gray-300 leading-relaxed">
                        We're building the ultimate platform that blends DSA depth with competitive programming precision, 
                        guiding you to the right challenges at the right time.
                    </p>
                </div>

                <div className="mt-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {features.map(({ title, description, icon, color }) => (
                        <div 
                            key={title}
                            className="group relative bg-gray-900/50 border border-gray-800 rounded-2xl p-6 hover:border-cyan-400/30 transition-all duration-300 hover:shadow-lg hover:shadow-cyan-500/10 backdrop-blur-sm"
                        >
                            <div className={`absolute inset-0 rounded-2xl bg-gradient-to-br ${color} opacity-0 group-hover:opacity-10 transition-opacity duration-500`}></div>
                            <div className={`flex items-center justify-center w-14 h-14 mb-6 rounded-xl bg-gradient-to-br ${color} text-white text-2xl`}>
                                {icon}
                            </div>
                            <h3 className="text-xl font-bold mb-3 text-gray-100 group-hover:text-cyan-300 transition-colors">
                                {title}
                            </h3>
                            <p className="text-gray-400 group-hover:text-gray-300 transition-colors">
                                {description}
                            </p>
                            <div className="absolute bottom-6 left-6 h-0.5 w-10 bg-gradient-to-r from-cyan-400 to-blue-500 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                        </div>
                    ))}
                </div>

                <div className="mt-20 text-center">
                    <button className="relative bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white py-4 px-8 rounded-full font-bold cursor-pointer transition-all duration-300 shadow-lg hover:shadow-cyan-500/20 overflow-hidden group">
                        <span className="relative z-10">Start Learning Free</span>
                        <span className="absolute inset-0 bg-gradient-to-r from-cyan-400 to-purple-500 opacity-0 group-hover:opacity-100 transition-opacity duration-500 mix-blend-overlay"></span>
                    </button>
                    <p className="mt-4 text-gray-400 text-sm">
                        No credit card required • 7-day free trial
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Features;