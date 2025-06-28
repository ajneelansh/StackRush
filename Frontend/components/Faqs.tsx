'use client'
import React from "react";
import PlusIcon from "../assets/plus-s.png";
import Image from "next/image";
import clsx from "clsx";

const items = [
    {
        question: "What is the purpose of this platform?",
        answer: "This platform is designed to help users improve their problem-solving skills in data structures and algorithms (DSA) and competitive programming (CP).",
    },
    {
        question: "How can I get started?",
        answer: "You can get started by signing up for a free account and exploring the available resources and practice problems.",
    },
    {
        question: "Is there a community for support?",
        answer: "Yes, we have a vibrant community where you can connect with other learners and experts to share knowledge and tips.",
    },
    {
        question: "Are there any personalized recommendations?",
        answer: "Yes, we provide tailored recommendations based on your skill level and interests to help you progress effectively.",
    },
    {
        question: "What are the benefits of using this platform?",
        answer: "The platform offers a comprehensive set of resources, personalized learning paths, and a supportive community to enhance your coding skills.",
    }
]

const AccordianItem = ({ question, answer }: { question: string, answer: string }) => {
    const [isOpen, setIsOpen] = React.useState(false);
    return (
        <div 
            className="py-5 border-b border-gray-800 cursor-pointer transition-all duration-300 hover:border-cyan-400/30"
            onClick={() => setIsOpen(!isOpen)}
        >
            <div className="flex items-center gap-4">
                <span className="flex-1 text-lg font-bold text-gray-100 group-hover:text-cyan-300 transition-colors">
                    {question}
                </span>
                <Image 
                    className={`w-5 h-5 transition-transform duration-300 ${isOpen ? 'rotate-45' : ''}`} 
                    src={PlusIcon} 
                    alt="Toggle answer" 
                />
            </div>
            <div className={clsx(
                "mt-3 text-gray-400 overflow-hidden transition-all duration-500",
                {
                    "max-h-0": !isOpen,
                    "max-h-96 pb-4": isOpen,
                }
            )}>
                {answer}
            </div>
        </div>
    )
};

export const FAQs = () => {
    return (
        <div className=" bg-gray-950 text-white py-20 relative overflow-hidden">
            
            <div className="container mx-auto relative z-10 px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-16">
                    <h2 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-blue-500">
                        Frequently Asked Questions
                    </h2>
                    <p className="mt-6 text-lg sm:text-xl max-w-3xl mx-auto text-gray-300">
                        Can't find what you're looking for? <span className="text-cyan-300">Contact our support team</span>.
                    </p>
                </div>

                <div className="max-w-4xl mx-auto bg-gray-900/50 border border-gray-800 rounded-2xl p-6 sm:p-8 backdrop-blur-sm">
                    {items.map(({ question, answer }) => (
                        <AccordianItem key={question} question={question} answer={answer} />
                    ))}
                </div>

                <div className="mt-16 text-center">
                    <button 
                        className="relative bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white py-3 px-8 rounded-full font-bold cursor-pointer transition-all duration-300 shadow-lg hover:shadow-cyan-500/30 group overflow-hidden"
                        onClick={() => window.location.href = 'http://codehurdle.com/auth/google'}
                    >
                        <span className="relative z-10">Get Started Now</span>
                        <span className="absolute inset-0 bg-[linear-gradient(90deg,#00DBDE,#FC00FF)] opacity-0 group-hover:opacity-100 transition-opacity duration-500 mix-blend-overlay"></span>
                    </button>
                </div>
            </div>
        </div>
    )
}

export default FAQs;