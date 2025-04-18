'use client'
import React from "react";
import PlusIcon from "../assets/plus-s.png";
import Image from "next/image";
import clsx from "clsx";

const items =[
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

const AccordianItem = ({ question, answer} :{ question:string, answer:string}) => {
    const [isOpen, setIsOpen] = React.useState(false);
    return (
        <div className="items-center py-7 border-b border-white/30 " onClick={setIsOpen.bind(null, !isOpen)}>
            <div className="flex items-center">
                <span className="flex-1 text-lg font-bold">{question}</span>
                <Image className="w-5 " src={PlusIcon} alt="Plus Icon" />
            </div>
            <div className={clsx({
                hidden: !isOpen,
                "": isOpen === true,
            })}>{answer}</div>
        </div>
    )
};
export const FAQs =() => {
    return (
        <div className="h-[768px] bg-black text-white py-[72px]">
            <div className="container mx-auto px-4">
                <h2 className="text-center text-5xl font-bold tracking-lighter">Frequently asked questions</h2>
                <div className="mt-12 max-w-[648px] mx-auto">
                   {items.map(({ question, answer }) => (
                    <AccordianItem key={question} question={question} answer={answer} />
                   ))}
                </div>
            </div>
        </div>
    )
}