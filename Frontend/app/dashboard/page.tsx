"use client"

import { useEffect, useState, useCallback} from "react"
import axios from "axios"
import {
  ExternalLink,
  Filter,
  MoreHorizontal,
  Search,
  Menu,
  X
} from "lucide-react"
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
import { Heatmap } from "@/components/Heatmap";


const RATINGS = [1200, 1300, 1400, 1500, 1600, 1700, 1800, 1900]
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
  const [selectedRating, setSelectedRating] = useState("1350");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const filteredQuestions = questions.filter((question) => {
    const matchesRating = selectedRating === "all" || question.rating === Number(selectedRating);
    const matchesSearch = question.question_title.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesRating && matchesSearch;
  });

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
    <div className="flex min-h-screen bg-black bg-gradient-to-b from-black to-purple-950 text-white">
      <button className="md:hidden fixed top-4 left-4 z-[100] p-2 bg-purple-900/80 border border-purple-700 rounded-lg" onClick={() => setIsSidebarOpen(!isSidebarOpen)}>
        {isSidebarOpen ? <X className="h-5 w-5 text-white" /> : <Menu className="h-5 w-5 text-white" />}
      </button>

      <div className={`fixed md:static z-40 w-64 h-full bg-gradient-to-b from-black to-purple-950/90 border-r border-purple-800/30 transition-all duration-300 ${isSidebarOpen ? 'left-0' : '-left-64'} md:left-0`}>
      <SideBar/>
      </div>

      <div className="flex-1 flex flex-col overflow-auto max-w-[1600px] mx-auto w-full">
        <header className="sticky top-0 z-10 flex h-16 items-center gap-2 md:gap-4 border-b border-purple-900/50 backdrop-blur-sm px-18 md:px-6">
          <div className="w-full flex items-center gap-2 md:gap-4">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-purple-400" />
              <Input type="search" placeholder="Search questions..." className="w-full pl-10 bg-gray-900/50 border-purple-800/50 text-sm md:text-base" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="gap-1 md:gap-2 bg-purple-900/50 border-purple-700 hover:bg-purple-800 text-xs md:text-sm">
                  <Filter className="h-3.5 w-3.5 md:h-4 md:w-4" />
                  <span>Rating: {selectedRating === "all" ? "All" : selectedRating}</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-[180px] bg-gray-950 border-purple-800/30">
                {ratingOptions.map((range) => (
                  <DropdownMenuItem key={range.value} onClick={() => handleRatingSelect(range.value)} className={`text-xs md:text-sm ${selectedRating === range.value ? "bg-purple-900/50" : ""}`}>{range.label}</DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </header>

        <main className="p-4 md:p-6">
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 xl:grid-cols-6 gap-3 md:gap-4 mb-6">
            {Object.entries(TOTAL_PROBLEMS).map(([rating, total]) => {
              const solved = progressData.solved_by_rating?.[Number(rating)] || 0;
              const percentage = Math.round((solved / total) * 100);
              return (
                <Card key={rating} className={`border-0 text-white bg-gradient-to-br from-gray-900/80 to-purple-950/60 cursor-pointer transition-all ${selectedRating === rating ? "ring-2 ring-purple-500" : ""}`} onClick={() => handleRatingSelect(rating)}>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm md:text-base flex justify-between items-center">
                      {rating}
                      <Badge variant="outline" className="bg-purple-800/50 text-white text-xs">{solved}/{total}</Badge>
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

          <div className="mb-6">
          <Heatmap data={heatmapData} />
        </div>

          <div className="rounded-lg bg-gradient-to-br from-gray-900/50 to-purple-950/30 backdrop-blur-sm border border-purple-800/30 overflow-x-auto">
            <Table className="min-w-[700px]">
              <TableHeader className="bg-black/50">
                <TableRow className="hover:bg-purple-950/10 border-purple-800/30">
                  <TableHead className="px-4 md:px-8 text-white text-sm">Question</TableHead>
                  <TableHead className="text-white w-[100px] text-sm">Rating</TableHead>
                  <TableHead className="text-white w-[100px] text-sm">Status</TableHead>
                  <TableHead className="text-white w-[150px] text-sm">Links</TableHead>
                  <TableHead className="text-white w-[100px] text-sm">Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredQuestions.map((question) => (
                  <TableRow key={question.question_id} className="hover:bg-purple-950/10 border-purple-800/20">
                    <TableCell className="px-4 md:px-8 py-3">
                      <div className="text-sm font-medium line-clamp-1">{question.question_title}</div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className="text-white bg-purple-900/50 border-purple-700 text-xs">{question.rating}</Badge>
                    </TableCell>
                    <TableCell>
                      <Badge className={`text-white text-xs ${question.status === "Solved" ? "bg-green-700/50 border-green-600" : question.status === "Attempted" ? "bg-yellow-600/50 border-yellow-500" : "bg-gray-800/50 border-gray-700"}`}>{question.status || "Unsolved"}</Badge>
                    </TableCell>
                    <TableCell>
                      <a href={question.link} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-xs text-purple-400 hover:text-purple-300">
                        <ExternalLink className="h-3 w-3" /> Solve
                      </a>
                    </TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="outline" size="sm" className="text-white bg-purple-900/20 border-purple-700 h-8 w-8 p-0">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent className="bg-gray-950 border-purple-800/30 min-w-[150px]">
                          <DropdownMenuItem className="text-xs md:text-sm" onClick={() => handleStatusUpdate(question.question_id, "Solved", question.rating)}>Mark as Solved</DropdownMenuItem>
                          <DropdownMenuItem className="text-xs md:text-sm" onClick={() => handleStatusUpdate(question.question_id, "Attempted", question.rating)}>Mark as Attempted</DropdownMenuItem>
                          <DropdownMenuItem className="text-xs md:text-sm" onClick={() => handleStatusUpdate(question.question_id, "Unsolved", question.rating)}>Mark as Unsolved</DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          <div className="flex flex-col sm:flex-row justify-between items-center p-4 border-t border-purple-800/30 gap-3">
            <Button disabled={page === 1} onClick={handlePrevPage} className="bg-purple-800 hover:bg-purple-700 text-white w-full sm:w-auto">Previous</Button>
            <span className="text-purple-300 text-sm">Page {page} / 3</span>
            <Button disabled={!hasMore || page === 3} onClick={handleNextPage} className="bg-purple-800 hover:bg-purple-700 text-white w-full sm:w-auto">Next</Button>
          </div>

          {filteredQuestions.length === 0 && !loading && (
            <div className="flex justify-center p-8 text-purple-300 text-sm">
              {selectedRating === "all" ? "Select a rating to view questions" : "No questions found for this rating"}
            </div>
          )}
        </main>
      </div>
    </div>
  )
}
