"use client";

import Image from "next/image";
import Code from "../assets/code.png";
import PersonLearn from "../assets/personalized-learning.png";
import Community from "../assets/support.png";
import RealTime from "../assets/data-insights.png";
import Cp from "../assets/captivate.png";
import Placement from "../assets/work.png";

const features = [
  {
    title: "Data Structures & Algorithms",
    description:
      "Master DSA fundamentals with structured lessons, curated problems, and detailed explainations to build a strong base.",
    tag: "DSA",
    image: Code,
    color: "from-pink-600 to-yellow-400",
  },
  {
    title: "Personalized Learning",
    description:
      "Get smart recommendations tailored to your strengths, weaknesses, and learning pace for maximum efficiency.",
    tag: "Smart Learning",
    image: PersonLearn,
    color: "from-purple-600 to-purple-400",
  },
  {
    title: "Community Support",
    description:
      "Connect with peers and mentors. Share your journey, ask questions, and grow in a supportive coding community.",
    tag: "Support",
    image: Community,
    color: "from-cyan-500 to-blue-500",
  },
  {
    title: "Real-Time Progress Tracking",
    description:
      "Visualize your growth with dynamic charts and analytics. Stay motivated and on top of your goals.",
    tag: "Insights",
    image: RealTime,
    color: "from-green-400 to-emerald-500",
  },
  {
    title: "Competitive Programming Practice",
    description:
      "Practice with real contest problems, analyze your performance, and improve your CP ratings with guided sets of rated problems.",
    tag: "CP Practice",
    image: Cp,
    color: "from-indigo-500 to-violet-500",
  },
  {
    title: "College Placement Preparation",
    description:
      "Ace your college placements with targeted practice, mock interviews, and expert tips to stand out in coding rounds.",
    tag: "Placements",
    image: Placement,
    color: "from-orange-500 to-amber-400",
  },
];

export const Features = () => {
  return (
    <section
      id="features"
      className="bg-black text-white py-24 px-4 sm:px-8 relative overflow-hidden"
    >
      <div className="max-w-3xl mx-auto text-center mb-16 relative z-10">
        <h2 className="text-4xl sm:text-5xl font-extrabold bg-gradient-to-r from-purple-600 to-purple-400 text-transparent bg-clip-text">
          Empower Your Coding Journey
        </h2>
        <p className="mt-4 text-gray-400 text-lg">
          A Platform that blends the depth of DSA with the precision of CP insights, guiding you to the right questions at the right time.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto relative z-10">
        {features.map((feature) => (
          <div
            key={feature.title}
            className="relative p-5 rounded-xl border border-white/10 backdrop-blur-md bg-white/5 overflow-hidden transition-transform duration-300 hover:scale-[1.03] hover:shadow-lg hover:shadow-purple-950 cursor-pointer"
          >
            <div
              className={`inline-block px-3 py-1 text-xs font-medium rounded-full bg-gradient-to-r ${feature.color} text-white mb-4`}
            >
              {feature.tag}
            </div>

            <div className="w-full h-36 relative mb-4 flex items-center justify-center bg-black/90 rounded-lg">
              <Image
                src={feature.image}
                alt={feature.title}
                width={100}
                height={100}
                loading="lazy"
                placeholder="blur"
                className="object-contain"
              />
            </div>

            <h3 className="text-lg font-semibold mb-1 text-white">{feature.title}</h3>
            <p className="text-gray-400 text-sm leading-relaxed">{feature.description}</p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Features;
