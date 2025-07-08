"use client"
import { useEffect, useState } from "react"
import {
  ExternalLink,
  ChevronDown,
  ChevronUp,
  MoreHorizontal,
} from "lucide-react"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu"
import { Badge } from "@/components/ui/badge"
import axios from "axios"
import Link from "next/link"

export default function SheetsPage() {
  const [topicsData, setTopicsData] = useState<any[]>([])
  const [expandedTopic, setExpandedTopic] = useState<string | null>(null)
  const [expandedSubtopic, setExpandedSubtopic] = useState<string | null>(null)

  useEffect(() => {
    const fetchTopics = async () => {
      try {
        const res = await axios.get("https://codehurdle.com/gettopics", { withCredentials: true });
        setTopicsData(res.data || []);
      } catch (err) {
        console.error("Failed to fetch topics:", err);
      }
    };
    fetchTopics();
  }, []);

  // useEffect(() => {
  //   const dummyTopics = [
  //     {
  //       title: "Binary Search",
  //       subtopics: [
  //         {
  //           title: "Introductory Problems",
  //           questions: [
  //             {
  //               question_id: 1,
  //               question_title: "Binary Search",
  //               status: "Unsolved",
  //               link: "https://leetcode.com/problems/binary-search/"
  //             },
  //             {
  //               question_id: 2,
  //               question_title: "Guess Number Higher or Lower",
  //               status: "Attempted",
  //               link: "https://leetcode.com/problems/guess-number-higher-or-lower/"
  //             },
  //             {
  //               question_id: 3,
  //               question_title: "Find Peak Element",
  //               status: "Solved",
  //               link: "https://leetcode.com/problems/find-peak-element/"
  //             }
  //           ]
  //         },
  //         {
  //           title: "Boundaries",
  //           questions: [
  //             {
  //               question_id: 4,
  //               question_title: "Find First and Last Position",
  //               status: "Solved",
  //               link: "https://leetcode.com/problems/find-first-and-last-position-of-element-in-sorted-array/"
  //             }
  //           ]
  //         }
  //       ]
  //     },
  //     {
  //       title: "Mathematics",
  //       subtopics: [
  //         {
  //           title: "Algebra Basics",
  //           questions: [
  //             {
  //               question_id: 5,
  //               question_title: "Solve Linear Equations",
  //               status: "Solved",
  //               link: "https://leetcode.com/problems/solve-the-equation/"
  //             },
  //             {
  //               question_id: 6,
  //               question_title: "Quadratic Formula",
  //               status: "Solved",
  //               link: "https://www.geeksforgeeks.org/quadratic-equation/"
  //             }
  //           ]
  //         }
  //       ]
  //     },
  //     {
  //       title: "Implementation",
  //       subtopics: [
  //         {
  //           title: "Pattern Problems",
  //           questions: [
  //             {
  //               question_id: 7,
  //               question_title: "Star Patterns",
  //               status: "Unsolved",
  //               link: "https://www.geeksforgeeks.org/programs-print-different-patterns/"
  //             }
  //           ]
  //         }
  //       ]
  //     }
  //   ]
  
  //   setTopicsData(dummyTopics)
  // }, [])
  

  const toggleTopic = (title: string) => {
    setExpandedTopic((prev) => (prev === title ? null : title))
    setExpandedSubtopic(null)
  }

  const toggleSubtopic = (title: string) => {
    setExpandedSubtopic((prev) => (prev === title ? null : title))
  }

  const handleStatusUpdate = (questionId: number, newStatus: string) => {
    setTopicsData(prevTopics =>
      prevTopics.map(topic => ({
        ...topic,
        subtopics: topic.subtopics.map(sub => ({
          ...sub,
          questions: sub.questions.map(q =>
            q.question_id === questionId ? { ...q, status: newStatus } : q
          )
        }))
      }))
    )
  }

  const getProgress = (questions: any[]) => {
    const total = questions.length;
    const solved = questions.filter(q => q.status === "Solved").length;
    const attempted = questions.filter(q => q.status === "Attempted").length;
    const unsolved = total - solved - attempted;
    const percent = total ? Math.round((solved / total) * 100) : 0;
    return { total, solved, attempted, unsolved, percent };
  };

  return (
    <div className="p-6 text-white min-h-screen bg-gradient-to-b from-black to-purple-950/90">
      <h1 className="text-2xl font-bold text-purple-300 mb-2">Topic Wise Sheet</h1>
      <p className="text-sm text-gray-400 mb-4">
        Solve problems topic-wise and track your progress
      </p>

      {/* ✅ OVERALL PROGRESS */}
      {(() => {
        const allQuestions = topicsData.flatMap(topic =>
          topic.subtopics.flatMap((sub: any) => sub.questions)
        );
        const { total, solved, percent } = getProgress(allQuestions);

        return (
          <div className="mb-6">
            <div className="mb-2 flex justify-between items-center">
              <h2 className="text-purple-300 text-base font-semibold">Overall Progress</h2>
              <span className="text-sm text-white">{solved}/{total} Solved</span>
            </div>
            <div className="w-full h-3 bg-purple-900 rounded-full overflow-hidden">
              <div className="h-full bg-gradient-to-r from-purple-400 to-pink-500 transition-all duration-500" style={{ width: `${percent}%` }} />
            </div>
            <p className="text-xs text-purple-400 mt-1">{percent}% completed</p>
          </div>
        );
      })()}

      {/* TOPIC CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {topicsData.map((topic, idx) => {
          const topicQuestions = topic.subtopics.flatMap((sub: any) => sub.questions);
          const { total, solved, percent } = getProgress(topicQuestions);
          return (
            <Link
              key={idx}
              href={`/dashboard/sheet/${encodeURIComponent(topic.title.toLowerCase().replace(/\s+/g, '-'))}`}
              className="block rounded-xl border border-purple-800/30 bg-gray-900/60 p-6 shadow-lg hover:scale-105 hover:border-purple-400 transition-transform cursor-pointer"
            >
              <div className="flex flex-col gap-2 h-full">
                <span className="text-lg font-semibold text-white">{topic.title}</span>
                <div className="flex justify-between items-center text-sm mb-1">
                  <span className="text-purple-300">{solved}/{total} Solved</span>
                  <span className="text-purple-400">{percent}%</span>
                </div>
                <div className="w-full h-2 bg-purple-900 rounded-full overflow-hidden mb-2">
                  <div className="h-full bg-gradient-to-r from-cyan-400 to-blue-500 transition-all duration-500" style={{ width: `${percent}%` }} />
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  )
}


