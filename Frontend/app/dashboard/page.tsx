"use client"

import { useEffect, useState, useCallback } from "react"
import axios from "axios"
import {
  ExternalLink,
  Filter,
  MoreHorizontal,
  Search,
  BookOpen,
  ChevronLeft,
  ChevronRight,
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
import { Heatmap } from "@/components/Heatmap"
import { Popup } from "@/components/Popup"
import { useProgress } from "./ProgressContext"

const RATINGS = [1200, 1350, 1500, 1650, 1800, 1950]
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

export default function DashboardPage() {
  const { showProgress } = useProgress();
  const [questions, setQuestions] = useState<Question[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [heatmapData, setHeatmapData] = useState<Record<string, number>>({});
  const [progressData, setProgressData] = useState<ProgressData>({ total_solved: 0, solved_by_rating: {} });
  const [selectedRating, setSelectedRating] = useState("all");
  const [user, setUser] = useState<{ name: string; email: string; profilePicture: string } | null>(null);
  const [showPopup, setShowPopup] = useState(false);

  const filteredQuestions = questions.filter((question) => {
    const matchesRating = selectedRating === "all" || question.rating === Number(selectedRating);
    const matchesSearch = question.question_title.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesRating && matchesSearch;
  });

  const fetchQuestions = useCallback(async (rating: string | number, pageNumber: number) => {
    if (loading) return;
    setLoading(true);
    try {
      const res = await axios.get("https://codehurdle.com/getquestions", {
        withCredentials: true,
        params: { minRating: rating, maxRating: rating, page: pageNumber, limit: 20 },
      });
      const data = res.data;
      setQuestions(data);
      setHasMore(data.length >= 18);
    } catch (error) {
      console.error("Error fetching questions:", error);
    } finally {
      setLoading(false);
    }
  }, [loading]);

  useEffect(() => {
    fetchQuestions(selectedRating, page);
  }, [selectedRating, page]);

  const fetchProgressData = async () => {
    try {
      const res1 = await axios.get("https://codehurdle.com/getprogress", { withCredentials: true });
      const res2 = await axios.get("https://codehurdle.com/getheatmap", { withCredentials: true });
      setHeatmapData(res2.data || {});
      setProgressData({
        total_solved: res1.data?.total_solved || 0,
        solved_by_rating: res1.data?.SolvedByRating || {},
      });
    } catch (error) {
      console.error("Failed to fetch progress data:", error);
    }
  };

  useEffect(() => {
    fetchProgressData();
  }, [selectedRating]);

  const handleRatingSelect = (rating: string) => {
    setSelectedRating(rating);
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

  const handleStatusUpdate = async (questionId: number, newStatus: "Solved" | "Attempted" | "Unsolved", rating: number) => {
    try {
      setQuestions(prev => prev.map(q => q.question_id === questionId ? { ...q, status: newStatus } : q));
      await axios.post("https://codehurdle.com/updatequestionstatus", { question_id: questionId, status: newStatus, rating }, { withCredentials: true });
      fetchProgressData();
    } catch (err) {
      console.error("Failed to update status", err);
    }
  };

  useEffect(() => {
    setShowPopup(true); // force show for demo
  }, []);

  const handleProfileSubmit = async (data: { name: string; college: string; batch: string }) => {
    try {
      await axios.post("https://codehurdle.com/updateprofile", data, { withCredentials: true });
      setUser(prev => prev ? { ...prev, ...data } : null);
      setShowPopup(false);
    } catch (error) {
      console.error("Error updating profile:", error);
    }
  };

  const incrementHeatmap = async () => {
    const today = new Date();
    const dateKey = today.toISOString().split('T')[0];
    setHeatmapData(prev => ({ ...prev, [dateKey]: (prev[dateKey] || 0) + 1 }));
    try {
      await axios.post("https://codehurdle.com/incrementheatmap", {}, { withCredentials: true });
    } catch (error) {
      console.error("Failed to update heatmap data:", error);
    }
  }

  const decrementHeatmap = async () => {
    const today = new Date();
    const dateKey = today.toISOString().split('T')[0];
    setHeatmapData(prev => ({ ...prev, [dateKey]: Math.max((prev[dateKey] || 1) - 1, 0) }));
    try {
      await axios.post("https://codehurdle.com/decrementheatmap", {}, { withCredentials: true });
    } catch (error) {
      console.error("Failed to update heatmap data:", error);
    }
  }

  return (
    <>
      {/* Rating Cards */}
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
          );
        })}
      </div>

      {/* Heatmap Progress Widget */}
      {showProgress && (
        <div className="mb-8">
          <h2 className="text-white font-semibold text-sm mb-2">
                {Object.values(heatmapData).reduce((sum, count) => sum + count, 0)} submissions in the past year
          </h2>
          <Heatmap data={heatmapData} />
        </div>
      )}

      {/* Problem Set Table */}
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

        {/* Table Content */}
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
                    <span className="text-white font-medium">{question.question_title}</span>
                  </TableCell>
                  <TableCell className="px-4 py-3 text-center">
                    <Badge className="font-mono text-xs px-2 py-1 bg-purple-900 text-purple-200 border-purple-500">
                      {question.rating}
                    </Badge>
                  </TableCell>
                  <TableCell className="px-4 py-3 text-center">
                    <Badge className={`w-24 text-xs font-bold text-white border rounded-xl px-3 py-1.5 ${question.status === "Solved" ? "bg-gradient-to-r from-cyan-400 to-blue-500 text-white border-blue-400" : question.status === "Attempted" ? "bg-gradient-to-r from-yellow-400 to-orange-500 text-white border-yellow-400" : " text-white border-rose-400"}`}>
                      {question.status || "Unsolved"}
                    </Badge>
                  </TableCell>
                  <TableCell className="px-4 py-3 text-center">
                    <a href={question.link} target="_blank" rel="noopener noreferrer" className="text-purple-400 hover:text-purple-300">
                      <ExternalLink className="inline h-3 w-3 mr-1" />
                      Solve
                    </a>
                  </TableCell>
                  <TableCell className="px-4 py-3 text-center">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm" className="text-purple-300 hover:text-white p-0 h-8 w-8">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent className="bg-gray-950 border-purple-800/30 w-48">
                        <DropdownMenuItem onClick={() => { handleStatusUpdate(question.question_id, "Solved", question.rating); incrementHeatmap(); }}>
                          Mark as Solved
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleStatusUpdate(question.question_id, "Attempted", question.rating)}>
                          Mark as Attempted
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => { handleStatusUpdate(question.question_id, "Unsolved", question.rating); decrementHeatmap(); }}>
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

        {/* Pagination */}
        <div className="flex flex-col sm:flex-row justify-between items-center p-4 border-t border-purple-800/30 bg-black/20 gap-3">
          <Button variant="outline" disabled={page === 1} onClick={handlePrevPage} className="gap-1 border-purple-700 text-purple-300 hover:bg-purple-900/30 w-full sm:w-auto">
            <ChevronLeft className="h-4 w-4" />
            Previous
          </Button>
          <div className="text-sm text-purple-300">
            Page <span className="font-medium text-white">{page}</span> of 3
          </div>
          <Button variant="outline" disabled={!hasMore || page === 3} onClick={handleNextPage} className="gap-1 border-purple-700 text-purple-300 hover:bg-purple-900/30 w-full sm:w-auto">
            Next
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
      <Popup open={showPopup} onClose={() => setShowPopup(false)} onSubmit={handleProfileSubmit} user={user} />
    </>
  );
}
