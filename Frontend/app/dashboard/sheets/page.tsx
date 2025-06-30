
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

export default function SheetsPage() {
  const [topicsData, setTopicsData] = useState<any[]>([])
  const [expandedTopic, setExpandedTopic] = useState<string | null>(null)
  const [expandedSubtopic, setExpandedSubtopic] = useState<string | null>(null)

  // useEffect(() => {
  //   const fetchTopics = async () => {
  //     try {
  //       const res = await axios.get("https://codehurdle.com/gettopics", { withCredentials: true });
  //       setTopicsData(res.data || []);
  //     } catch (err) {
  //       console.error("Failed to fetch topics:", err);
  //     }
  //   };
  //   fetchTopics();
  // }, []);

  useEffect(() => {
    const dummyTopics = [
      {
        title: "Binary Search",
        subtopics: [
          {
            title: "Introductory Problems",
            questions: [
              {
                question_id: 1,
                question_title: "Binary Search",
                status: "Unsolved",
                link: "https://leetcode.com/problems/binary-search/"
              },
              {
                question_id: 2,
                question_title: "Guess Number Higher or Lower",
                status: "Attempted",
                link: "https://leetcode.com/problems/guess-number-higher-or-lower/"
              },
              {
                question_id: 3,
                question_title: "Find Peak Element",
                status: "Solved",
                link: "https://leetcode.com/problems/find-peak-element/"
              }
            ]
          },
          {
            title: "Boundaries",
            questions: [
              {
                question_id: 4,
                question_title: "Find First and Last Position",
                status: "Solved",
                link: "https://leetcode.com/problems/find-first-and-last-position-of-element-in-sorted-array/"
              }
            ]
          }
        ]
      },
      {
        title: "Mathematics",
        subtopics: [
          {
            title: "Algebra Basics",
            questions: [
              {
                question_id: 5,
                question_title: "Solve Linear Equations",
                status: "Solved",
                link: "https://leetcode.com/problems/solve-the-equation/"
              },
              {
                question_id: 6,
                question_title: "Quadratic Formula",
                status: "Solved",
                link: "https://www.geeksforgeeks.org/quadratic-equation/"
              }
            ]
          }
        ]
      },
      {
        title: "Implementation",
        subtopics: [
          {
            title: "Pattern Problems",
            questions: [
              {
                question_id: 7,
                question_title: "Star Patterns",
                status: "Unsolved",
                link: "https://www.geeksforgeeks.org/programs-print-different-patterns/"
              }
            ]
          }
        ]
      }
    ]
  
    setTopicsData(dummyTopics)
  }, [])
  

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

      {/* TOPIC-WISE BAR*/}
      {topicsData.map((topic, idx) => (
        <div key={idx} className="mb-6 rounded-xl border border-purple-800/30 bg-gray-900/60">
          <button
            className="w-full flex justify-between items-center p-4 text-left"
            onClick={() => toggleTopic(topic.title)}
          >
            <span className="text-lg font-semibold text-white">{topic.title}</span>
            {expandedTopic === topic.title
              ? <ChevronUp className="h-5 w-5 text-purple-400" />
              : <ChevronDown className="h-5 w-5 text-purple-400" />}
          </button>

          {/* PER-TOPIC PROGRESS BAR */}
          {(() => {
            const topicQuestions = topic.subtopics.flatMap((sub: any) => sub.questions);
            const { total, solved, percent } = getProgress(topicQuestions);
            return (
              <div className="px-4 pb-3">
                <div className="flex justify-between items-center text-sm mb-1">
                  <span className="text-purple-300">{solved}/{total} Solved</span>
                  <span className="text-purple-400">{percent}%</span>
                </div>
                <div className="w-full h-2 bg-purple-900 rounded-full overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-cyan-400 to-blue-500 transition-all duration-500" style={{ width: `${percent}%` }} />
                </div>
              </div>
            );
          })()}

          {/*SUBTOPICS & QUESTIONS */}
          {expandedTopic === topic.title &&
            topic.subtopics.map((sub: any, subIdx: number) => (
              <div key={subIdx} className="border-t border-purple-800/20">
                <button
                  onClick={() => toggleSubtopic(sub.title)}
                  className="w-full px-6 py-3 text-left text-white hover:bg-purple-950/30 transition"
                >
                  {sub.title}
                </button>

                {expandedSubtopic === sub.title && (
                  <div className="px-6 py-2">
                    {sub.questions.length === 0 ? (
                      <p className="text-sm text-purple-300 py-2">Coming Soon</p>
                    ) : (
                      <div className="overflow-x-auto rounded-md border border-purple-800/20 bg-black/20">
                        <Table>
                          <TableHeader>
                            <TableRow className="bg-black/30 border-b border-purple-800/30">
                              <TableHead className="text-purple-300 px-4 py-2">Problem</TableHead>
                              <TableHead className="text-purple-300 px-4 py-2 text-center">Status</TableHead>
                              <TableHead className="text-purple-300 px-4 py-2 text-center">Link</TableHead>
                              <TableHead className="text-purple-300 px-4 py-2 text-center">Actions</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {sub.questions.map((q: any) => (
                              <TableRow key={q.question_id} className="hover:bg-purple-900/10 border-purple-800/10">
                                <TableCell className="px-4 py-2 text-white">{q.question_title}</TableCell>
                                <TableCell className="px-4 py-2 text-center">
                                  <Badge className={`w-24 text-xs font-bold text-white border rounded-xl px-3 py-1.5 ${
                                    q.status === "Solved"
                                      ? "bg-gradient-to-r from-cyan-400 to-blue-500 text-white border-blue-400"
                                      : q.status === "Attempted"
                                      ? "bg-gradient-to-r from-yellow-400 to-orange-500 text-white border-yellow-400"
                                      : "text-white border-rose-400"
                                  }`}>
                                    {q.status || "Unsolved"}
                                  </Badge>
                                </TableCell>
                                <TableCell className="px-4 py-2 text-center">
                                  <a href={q.link} target="_blank" className="text-purple-400 hover:text-purple-300 flex items-center justify-center gap-1">
                                    <ExternalLink className="h-3 w-3" />
                                    Solve
                                  </a>
                                </TableCell>
                                <TableCell className="px-4 py-2 text-center">
                                  <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                      <Button variant="ghost" size="sm" className="text-purple-300 hover:text-white p-0 h-8 w-8">
                                        <MoreHorizontal className="h-4 w-4" />
                                      </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent className="bg-gray-950 border-purple-800/30 w-48">
                                      <DropdownMenuItem onClick={() => handleStatusUpdate(q.question_id, "Solved")}>
                                        Mark as Solved
                                      </DropdownMenuItem>
                                      <DropdownMenuItem onClick={() => handleStatusUpdate(q.question_id, "Attempted")}>
                                        Mark as Attempted
                                      </DropdownMenuItem>
                                      <DropdownMenuItem onClick={() => handleStatusUpdate(q.question_id, "Unsolved")}>
                                        Mark as Unsolved
                                      </DropdownMenuItem>
                                    </DropdownMenuContent>
                                  </DropdownMenu>
                                </TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      </div>
                    )}
                  </div>
                )}
              </div>
            ))}
        </div>
      ))}
    </div>
  )
}
