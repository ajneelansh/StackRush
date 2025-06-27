"use client"
const features = [
    {
        title: "Live Coding Contests and Hackathons",
        description: "Join Regular live Contests and Hackathons with global participants, complete with live ranking and instant feedback",
        color: "from-cyan-400 to-blue-500"
    },
    {
        title: "Interview Readliness & Weakness Tracker",
        description: "Monitor your preparation progress across key topics, with targeted suggestions to improve weak areas before interviews",
        color: "from-cyan-400 to-blue-500"
    },
    {
        title: "Dynamic Leaderboards and Gamification",
        description: "Earn badges, unlock achievements, and compete on weekly and monthly leaderboards to stay motivated",
        color: "from-cyan-400 to-blue-500"
    },
];

export const ProductShowcase = () => {
    const handleSignIn = () => {
        window.location.href = 'http://codehurdle.com/auth/google';
    }
    return (
        <div className="min-h-screen bg-gray-950 text-white py-20 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
        
            <div className="absolute inset-0 z-0">
                <div className="absolute top-20 -left-20 w-80 h-80 bg-cyan-900/20 rounded-full filter blur-3xl opacity-20"></div>
                <div className="absolute bottom-20 -right-20 w-80 h-80 bg-purple-900/20 rounded-full filter blur-3xl opacity-20"></div>
            </div>
            
            <div className="container mx-auto relative z-10">
                <div className="text-center">
                    <h2 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-blue-500">
                        Features We are Working on...
                    </h2>
                    <p className="mt-8 text-lg sm:text-xl max-w-3xl mx-auto text-gray-300 leading-relaxed">
                        Heres a sneak peek at upcoming features that will supercharge your competetive programming journey.
                    </p>
                </div>

                <div className="mt-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
                    {features.map(({ title, description, color }) => (
                        <div 
                            key={title}
                            className="group relative bg-gray-900/50 border border-gray-800 rounded-2xl p-10 hover:border-cyan-400/30 transition-all duration-300 hover:shadow-lg hover:shadow-cyan-500/10 backdrop-blur-sm"
                        >
                            <div className={`absolute inset-0 rounded-2xl bg-gradient-to-br ${color} opacity-0 group-hover:opacity-10 transition-opacity duration-500`}></div>
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
                    <button className="relative bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white py-4 px-8 rounded-full font-bold cursor-pointer transition-all duration-300 shadow-lg hover:shadow-cyan-500/20 overflow-hidden group"
                    onClick={handleSignIn}>
                        <span className="relative z-10" >Start Learning Free</span>
                        <span className="absolute inset-0 bg-gradient-to-r from-cyan-400 to-purple-500 opacity-0 group-hover:opacity-100 transition-opacity duration-500 mix-blend-overlay"></span>
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ProductShowcase;