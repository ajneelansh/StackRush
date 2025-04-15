const features = [
    {
        title: "Data Structures and Algorithms",
        description: "Master the core concepts of DSA with our comprehensive resources and practice problems.Master the core concepts of DSA with our comprehensive resources and practice problems.Master the core concepts of DSA with our comprehensive resources and practice problems.",
    },
    {
        title: "Personalized Learning",
        description: "Get tailored recommendations based on your skill level and interests.",
    },
    {
        title: "Community Support",
        description: "Join a vibrant community of learners and experts to share knowledge and tips.",
    },
]
export const Features = () => {
    
    return (
        <div className="h-[900px] bg-black text-white py-[72px] flex items-center justify-center sm:py-24">
            <div className="container">
                <h2 className="text-center font-bold text-5xl sm:text-6xl tracking-tighter">Everything you need</h2>
                <div className="w-[800px] mx-auto">
                <p className="text-center mt-5 text-xl text-white/70">
                    We’re building the ultimate platform that blends the depth of DSA with the precision of CP ratings, guiding you to the right questions at the right time.
                    Get started with our free plan and unlock the full potential of your coding journey.
                </p>
                </div>
                <div className="h-[350px] mt-16 flex flex-col sm:flex-row gap-4">
                      {features.map(({ title, description }) => (
                        <div key={title} className="border border-white/30 px-5 py-10 text-center rounded-xl sm:flex-1">
                            <div className="inline-flex h-14 w-14 bg-white text-black justify-center items-center rounded-lg"></div>
                            <h3 className="mt-6 font-bold">{title}</h3>
                            <p className="mt-2 text-white/70">{description}</p>
                        </div>
                        ))}
                </div>

            </div>
        </div>
    )
}

export default Features;