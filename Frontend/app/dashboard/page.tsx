
"use client"

import { useEffect, useState, useCallback } from "react"
import axios from "axios"
import {
  ExternalLink,
  Filter,
  MoreHorizontal,
  Search,
  Menu,
  X,
  BookOpen,
  ChevronLeft,
  ChevronRight,
  Gift
} from "lucide-react"
import Link from "next/link";
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { SideBar } from "@/components/SideBar"
import { Heatmap } from "@/components/Heatmap"
import { UserCoins } from "@/components/ui/UserCoins"

const RATINGS = [1200, 1350 , 1500, 1650 , 1800, 1950]
const ratingOptions = [{ value: "all", label: "All Ratings" }, ...RATINGS.map(r => ({ value: String(r), label: String(r) }))]

type Question = {
  question_id: number;
  question_title: string;
  rating: number;
  link: string;
  status: "Solved" | "Attempted" | "Unsolved";
};

type ProgressData = {
  total_solved: number;
  solved_by_rating: {
    [rating: string]: number;
  };
};

const TOTAL_PROBLEMS: { [rating: string]: number } = {
  "1350": 60,
  "1500": 60,
  "1650": 60,
  "1800": 60,
  "1950": 60,
};

export default function Dashboard() {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [heatmapData, setHeatmapData] = useState<Record<string, number>>({})
  const [progressData, setProgressData] = useState<ProgressData>({
    total_solved: 0,
    solved_by_rating: {}
  });
  const [selectedRating, setSelectedRating] = useState("all");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [showProgress, setShowProgress] = useState(false);
  const [user, setUser] = useState<{ name: string; email: string; profilePicture: string } | null>(null);
  const [showRewardsStore, setShowRewardsStore] = useState(false);



  const filteredQuestions = questions.filter((question) => {
    const matchesRating = selectedRating === "all" || question.rating === Number(selectedRating);
    const matchesSearch = question.question_title.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesRating && matchesSearch;
  });

  // const fetchQuestions = useCallback(async (rating: string | number, pageNumber: number) => {
  //   const dummyQuestions: Question[] = [
  //     { question_id: 1, question_title: "Two Sum", rating: 1350, link: "https://leetcode.com/problems/two-sum/", status: "Solved" },
  //     { question_id: 2, question_title: "Palindrome Number", rating: 1950, link: "https://leetcode.com/problems/palindrome-number/", status: "Unsolved" },
  //     { question_id: 3, question_title: "Valid Parentheses", rating: 1950, link: "https://leetcode.com/problems/valid-parentheses/", status: "Attempted" },
  //     { question_id: 4, question_title: "Remove Duplicates from Sorted Array", rating: 1500, link: "https://leetcode.com/problems/remove-duplicates-from-sorted-array/", status: "Solved" },
  //     { question_id: 5, question_title: "Majority Element", rating: 1500, link: "https://leetcode.com/problems/majority-element/", status: "Solved" },
  //     { question_id: 6, question_title: "Climbing Stairs", rating: 1500, link: "https://leetcode.com/problems/climbing-stairs/", status: "Attempted" },
  //     { question_id: 7, question_title: "Best Time to Buy and Sell Stock", rating: 1800, link: "https://leetcode.com/problems/best-time-to-buy-and-sell-stock/", status: "Solved" },
  //     { question_id: 8, question_title: "Valid Anagram", rating: 1650, link: "https://leetcode.com/problems/valid-anagram/", status: "Unsolved" },
  //     { question_id: 9, question_title: "Intersection of Two Arrays", rating: 1500, link: "https://leetcode.com/problems/intersection-of-two-arrays/", status: "Solved" },
  //     { question_id: 10, question_title: "Plus One", rating: 1500, link: "https://leetcode.com/problems/plus-one/", status: "Solved" },
  //   ];
  
  //   setQuestions(dummyQuestions.filter(q => selectedRating === "all" || q.rating === Number(selectedRating)));
  //   setHasMore(false);
  // }, [selectedRating]);

    const fetchQuestions = useCallback(async (rating: string | number, pageNumber: number) => {
    if (loading) return;
    setLoading(true);
    try {
      const res = await axios.get("http://codehurdle.com/getquestions", {
        withCredentials: true,
        params: { minRating: rating, maxRating: rating, page: pageNumber, limit: 20 },
      });
      const data = res.data;
      if (!data || data.length === 0) {
        setHasMore(false);
      } else {
        setQuestions(data);
        setHasMore(data.length >= 18);
      }
    } catch (error) {
      console.error("Error fetching questions:", error);
    } finally {
      setLoading(false);
    }
  }, [loading]);

  useEffect(() => { fetchQuestions(selectedRating, page); }, [selectedRating, page]);

  // const fetchProgressData = async () => {
  //   setHeatmapData({
  //     "2025-06-15": 1,
  //     "2025-06-16": 3,
  //     "2025-06-17": 10,
  //     "2025-06-18": 4,
  //     "2025-06-19": 3,
  //     "2025-06-20": 5,
  //   });
  
  //   setProgressData({
  //     total_solved: 11,
  //     solved_by_rating: {
  //       "1350": 60,
  //       "1500": 20,
  //       "1650": 12,
  //       "1800": 2,
  //       "1950": 40,
  //     },
  //   });
  // };

    const fetchProgressData = async () => {
    if (!selectedRating) return;
    try {
      const res = await axios.get("http://codehurdle.com/getprogress", { withCredentials: true });
      setHeatmapData(res.data?.datewise || {})

      setProgressData({
        total_solved: res.data?.total_solved || 0,
        solved_by_rating: res.data?.SolvedByRating || {},
      });
    } catch (error) {
      console.error("Failed to fetch progress data:", error);
    }
  };

  useEffect(() => { fetchProgressData(); }, [selectedRating]);

  const handleRatingSelect = (rating: string) => {
    setSelectedRating(prev => (prev === rating ? "all" : rating));
    setQuestions([]);
    setPage(1);
  };

  const handlePrevPage = () => {
    if (page > 1) {
      setPage(p => p - 1);
      fetchQuestions(selectedRating, page - 1);
    }
  };

  const handleNextPage = () => {
    if (page < 3) {
      setPage(p => p + 1);
      fetchQuestions(selectedRating, page + 1);
    }
  };

  const handleStatusUpdate = async (questionId: number, newStatus: "Solved" | "Attempted" | "Unsolved", rating: Question["rating"]) => {
    try {
      setQuestions(prev => prev.map(q => q.question_id === questionId ? { ...q, status: newStatus } : q));
      await axios.post("http://codehurdle.com/updatequestionstatus", { question_id: questionId, status: newStatus, rating }, { withCredentials: true });
    } catch (err) {
      console.error("Failed to update status", err);
    }
    fetchProgressData();
  };

  return (
    <div className="flex h-screen bg-black bg-gradient-to-b from-black to-purple-950 text-white overflow-hidden">
      <div className="md:hidden flex-shrink-0 mr-2"></div>
      <button 
        className="md:hidden fixed top-6 left-4 z-[100] p-2 bg-purple-900/80 border border-purple-700 rounded-lg"
        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
      >
        {isSidebarOpen ? <X className="h-5 w-5 text-white" /> : <Menu className="h-5 w-5 text-white" />}
      </button>

      <div className={`fixed md:static z-40 w-64 h-full bg-gradient-to-b from-black to-purple-950/90 border-r border-purple-800/30 transition-all duration-300 ${isSidebarOpen ? 'left-0' : '-left-64'} md:left-0`}>
        <SideBar 
          showProgress={showProgress}
          setShowProgress={setShowProgress}
        />
      </div>

      <div className="flex-1 flex flex-col overflow-auto max-w-[1600px] mx-auto w-full">
      <header className="sticky top-0 z-10 flex min-h-22 items-center gap-2 md:gap-4 border-b border-purple-900/50 backdrop-blur-sm px-4 md:px-6">

      <div className="w-full flex items-center gap-2 md:gap-4 justify-between">
      {/* Left: Search and filter */}
      <div className="flex flex-1 gap-2 pl-10">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-purple-400" />
          <Input 
            type="search" 
            placeholder="Search questions..." 
            className="w-full pl-10 bg-gray-900/50 border-purple-800/50 text-sm md:text-base" 
            value={searchQuery} 
            onChange={(e) => setSearchQuery(e.target.value)} 
          />
      </div>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="hidden md:flex gap-1 md:gap-2 bg-purple-900/50 border-purple-700 hover:bg-purple-800 text-xs md:text-sm">
              <Filter className="h-3.5 w-3.5 md:h-4 md:w-4" />
              <span>Rating: {selectedRating === "all" ? "All" : selectedRating}</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-[180px] bg-gray-950 border-purple-800/30">
            {ratingOptions.map((range) => (
              <DropdownMenuItem 
                key={range.value} 
                onClick={() => handleRatingSelect(range.value)} 
                className={`text-xs md:text-sm ${selectedRating === range.value ? "bg-purple-900/50" : ""}`}
              >
                {range.label}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Right: Profile Icon */}
      <div className="flex items-center gap-2 pr-2">
      <Link href="/rewardsstore" className="text-purple-400 hover:text-white transition-transform hover:scale-105">
        <Gift className="h-6 w-6" />
      </Link>

      <UserCoins/>
      {user?.profilePicture ? (
        <img 
          src={user.profilePicture} 
          alt="Profile"
          className="h-9 w-9 rounded-full border border-purple-500 hover:scale-105 transition-transform object-cover"
        />
      ) : (
        <div className="h-9 w-9 rounded-full bg-gradient-to-r from-purple-500 to-cyan-500 flex items-center justify-center border border-purple-500 hover:scale-105 transition-transform">
          <span className="text-white font-medium text-sm">
            {user?.name?.charAt(0).toUpperCase() || "U"}
          </span>
        </div>
      )}
      </div>
      </div>

      </header>

        <main className="p-4 md:p-6 overflow-y-auto">
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 xl:grid-cols-5 gap-3 md:gap-4 mb-6">
            {Object.entries(TOTAL_PROBLEMS).map(([rating, total]) => {
              const solved = progressData.solved_by_rating?.[Number(rating)] || 0;
              const percentage = Math.round((solved / total) * 100);
              return (
                <Card 
                  key={rating} 
                  className={`border-0 text-white bg-gradient-to-br from-gray-900/80 to-purple-950/60 cursor-pointer transition-all ${selectedRating === rating ? "ring-2 ring-purple-500" : ""}`} 
                  onClick={() => handleRatingSelect(rating)}
                >
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm md:text-base flex justify-between items-center">
                      {rating}
                      <Badge variant="outline" className="bg-purple-800/50 text-white text-xs">
                        {solved}/{total}
                      </Badge>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-col gap-1">
                      <Progress value={percentage} className="h-2" />
                      <p className="text-xs text-purple-300 text-right">{percentage}%</p>
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>

             {/* Heatmap - Conditionally rendered when showProgress is true */}
             {showProgress && (
            <div className="mb-6 rounded-lg border border-purple-800/30 bg-gradient-to-br from-gray-900/50 to-purple-950/30 p-4">
              <h2 className="text-white font-semibold text-sm mb-2">
                {Object.values(heatmapData).reduce((sum, count) => sum + count, 0)} submissions in the past year
              </h2>
              <Heatmap data={heatmapData} />
            </div>
          )}

          {/* Improved Table Component */}
          <div className="rounded-xl border border-purple-800/30 bg-gradient-to-br from-gray-900/50 to-purple-950/30 backdrop-blur-sm overflow-hidden">
            <div className="bg-black/50 p-4 border-b border-purple-800/30">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <h2 className="text-lg font-semibold text-white flex items-center gap-2">
                  <BookOpen className="h-5 w-5 text-purple-400" />
                  Problem Set
                </h2>
                <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
                  <div className="relative w-full sm:w-64">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-purple-400" />
                    <Input
                      type="search"
                      placeholder="Search problems..."
                      className="pl-10 bg-gray-900/50 border-purple-800/50 w-full"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                  </div>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="outline" className="bg-purple-900/50 border-purple-700 hover:bg-purple-800">
                        <Filter className="h-4 w-4 mr-2" />
                        <span className="truncate">Rating: {selectedRating === "all" ? "All" : selectedRating}</span>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="bg-gray-950 border-purple-800/30 w-[200px]">
                      {ratingOptions.map((range) => (
                        <DropdownMenuItem
                          key={range.value}
                          onClick={() => handleRatingSelect(range.value)}
                          className={`${selectedRating === range.value ? "bg-purple-900/50" : ""}`}
                        >
                          {range.label}
                        </DropdownMenuItem>
                      ))}
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
            </div>

            <div className="overflow-x-auto">
              <Table className="min-w-full">
                <TableHeader className="bg-black/30">
                  <TableRow className="border-purple-800/30 hover:bg-transparent">
                    <TableHead className="text-purple-300 px-4 py-3">Problem</TableHead>
                    <TableHead className="text-purple-300 px-4 py-3 text-center">Difficulty</TableHead>
                    <TableHead className="text-purple-300 px-4 py-3 text-center">Status</TableHead>
                    <TableHead className="text-purple-300 px-4 py-3 text-center">Link</TableHead>
                    <TableHead className="text-purple-300 px-4 py-3 text-center">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredQuestions.map((question) => (
                    <TableRow key={question.question_id} className="border-purple-800/20 hover:bg-purple-900/10">
                      <TableCell className="px-4 py-3">
                        <div className="flex flex-col">
                          <span className="text-white font-medium">{question.question_title}</span>
                        </div>
                      </TableCell>
                      <TableCell className="px-4 py-3 text-center">
                        <Badge 
                          variant="outline" 
                          className={`font-mono rounded-md border px-2 py-1 text-xs tracking-wide ${
                            question.rating >= 1800
                              ? "bg-purple-900/70 text-purple-200 border-purple-500"       // Hard
                              : question.rating >= 1500
                                ? "bg-purple-900/60 text-purple-300 border-purple-500"     // Medium
                                : "bg-purple-900/50 text-white border-purple-500"          // Easy
                          }`}
                          
                          
                          
                        >
                          {question.rating}
                        </Badge>
                      </TableCell>
                      <TableCell className="px-4 py-3 text-center">
                        <Badge 
                          className={`w-24 justify-center rounded-xl border px-3 py-1.5 text-xs font-bold text-center transition-all duration-300
                            ${
                              question.status === "Solved"
                                ? "bg-gradient-to-r from-cyan-400 to-blue-500 text-white border-blue-400"
                                : question.status === "Attempted"
                                  ? "bg-gradient-to-r from-yellow-400 to-orange-500 text-white border-yellow-400"
                                  : " text-white border-rose-400"
                            }`}
                          
                          
                          
                        >
                          {question.status || "Unsolved"}
                        </Badge>
                      </TableCell>
                      <TableCell className="px-4 py-3 text-center">
                        <div className="flex justify-center">
                          <a 
                            href={question.link} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="text-sm text-purple-400 hover:text-purple-300 flex items-center gap-1 mt-1"
                          >
                            <ExternalLink className="h-3 w-3" /> Solve
                          </a>
                        </div>
                      </TableCell>
                      <TableCell className="px-4 py-3 text-center">
                        <div className="flex justify-center">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button 
                                variant="ghost" 
                                size="sm" 
                                className="h-8 w-8 p-0 text-purple-300 hover:text-white"
                              >
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent className="bg-gray-950 border-purple-800/30 w-48">
                              <DropdownMenuItem 
                                className="hover:bg-purple-900/50"
                                onClick={() => handleStatusUpdate(question.question_id, "Solved", question.rating)}
                              >
                                Mark as Solved
                              </DropdownMenuItem>
                              <DropdownMenuItem 
                                className="hover:bg-purple-900/50"
                                onClick={() => handleStatusUpdate(question.question_id, "Attempted", question.rating)}
                              >
                                Mark as Attempted
                              </DropdownMenuItem>
                              <DropdownMenuItem 
                                className="hover:bg-purple-900/50"
                                onClick={() => handleStatusUpdate(question.question_id, "Unsolved", question.rating)}
                              >
                                Mark as Unsolved
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>

            {filteredQuestions.length === 0 && !loading && (
              <div className="flex flex-col items-center justify-center p-12 text-center">
                <div className="text-xl text-purple-300 mb-2">No problems found</div>
                <p className="text-sm text-purple-400 max-w-md">
                  {selectedRating === "all" 
                    ? "Try selecting a specific difficulty rating" 
                    : "No problems available for this rating level"}
                </p>
              </div>
            )}

            <div className="flex flex-col sm:flex-row justify-between items-center p-4 border-t border-purple-800/30 bg-black/20 gap-3">
              <Button 
                variant="outline" 
                disabled={page === 1}
                onClick={handlePrevPage}
                className="gap-1 border-purple-700 text-purple-300 hover:bg-purple-900/30 w-full sm:w-auto"
              >
                <ChevronLeft className="h-4 w-4" />
                Previous
              </Button>
              <div className="text-sm text-purple-300">
                Page <span className="font-medium text-white">{page}</span> of 3
              </div>
              <Button 
                variant="outline" 
                disabled={!hasMore || page === 3}
                onClick={handleNextPage}
                className="gap-1 border-purple-700 text-purple-300 hover:bg-purple-900/30 w-full sm:w-auto"
              >
                Next
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}