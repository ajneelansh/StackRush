"use client"

import { useEffect, useState, useCallback} from "react"
import axios from "axios"
import {
  ExternalLink,
  Filter,
  MoreHorizontal,
  Search,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
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
  const [progressData, setProgressData] = useState<ProgressData>({
    total_solved: 0,
    solved_by_rating: {}
  });
  const [selectedRating, setSelectedRating] = useState("1350");

  const filteredQuestions = questions.filter((question) => {
    const matchesRating =
      selectedRating === "all" || question.rating === Number(selectedRating);
    const matchesSearch = question.question_title
      .toLowerCase()
      .includes(searchQuery.toLowerCase());

    return matchesRating && matchesSearch;
  });

  const fetchQuestions = useCallback(
    async (rating: string | number, pageNumber: number) => {
      if (loading) return;
      setLoading(true);

      try {
        const res = await axios.get("http://codehurdle.com/getquestions", {
          withCredentials: true,
          params: {
            minRating: rating,
            maxRating: rating,
            page: pageNumber,
            limit: 20,
          },
        });

        console.warn("Unexpected API response", res.data);

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
    },
    [loading]
  );

  
    
    
  useEffect(() => {
    fetchQuestions(selectedRating, page);
  }, [selectedRating, page]);

 
 
    const fetchProgressData = async () => {
      if (!selectedRating) return;
      try {
        const res = await axios.get("http://codehurdle.com/getprogress", {
          withCredentials: true, 
        });
        setProgressData({
          total_solved: res.data?.total_solved || 0,
          solved_by_rating: res.data?.SolvedByRating || {},
        });
      } catch (error) {
        console.error("Failed to fetch progress data:", error);
      }
    };

    useEffect(() => {
      fetchProgressData();
    }, [selectedRating]);

    const handleRatingSelect = (rating: string) => {
      if (selectedRating === rating) {
        setSelectedRating("all");
      } else {
        setSelectedRating(rating);
      }
      setQuestions([]);
      setPage(1);
    };
    

  const handlePrevPage = () => {
    if (page > 1) {
      setPage(page - 1);
      fetchQuestions(selectedRating, page - 1);
    }
  };

  const handleNextPage = () => {
    if (page < 3 ) { 
      setPage(page+1);
      fetchQuestions(selectedRating, page + 1);
    }
  };

  const handleStatusUpdate = async (questionId: number, newStatus: "Solved" | "Attempted" | "Unsolved", rating :Question["rating"]) => {
      try {
       
        setQuestions((prev) =>
          prev.map((q) =>
            q.question_id === questionId ? { ...q, status: newStatus } : q
          )
        );

        await axios.post(
          "http://codehurdle.com/updatequestionstatus",
          {
            question_id: questionId,
            status: newStatus,
            rating: rating,
          },
          { withCredentials: true }
        );
      } catch (err) {
        console.error("Failed to update status", err);
        setQuestions(prevQuestions =>
        prevQuestions.map(q =>
          q.question_id === questionId ? { ...q, status: q.status } : q
        )
      );
     
      }
     fetchProgressData();
    };

  return (
    <div className="bg-black bg-gradient-to-b from-black to-purple-950 flex h-screen text-white">
      <div className="w-64 min-h-screen border-r bg-purple-900">
        <SideBar />
      </div>

      <div className="flex-1 overflow-auto">
        <header className="sticky top-0 z-10 flex h-16 items-center gap-4 border-b border-purple-900/50 backdrop-blur-sm px-6">
          <div className="w-full flex items-center gap-4">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search questions..."
                className="w-full pl-8"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="outline"
                  className="gap-2 bg-purple-900/50 border-white hover:bg-purple-800"
                >
                  <Filter className="h-4 w-4" />
                  <span>Rating: {selectedRating === "all" ? "All" : selectedRating}</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                {ratingOptions.map((range) => (
                  <DropdownMenuItem
                    key={range.value}
                    onClick={() => handleRatingSelect(range.value)}
                    className={selectedRating === range.value ? "bg-purple-900" : ""}
                  >
                    {range.label}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </header>

        <main className="grid gap-6 p-6">
          <div className="grid gap-4 md:grid-cols-6 md:grid-rows-2">
          {Object.entries(TOTAL_PROBLEMS).map(([rating, total]) => {
    const solved = progressData.solved_by_rating?.[Number(rating)];
    const percentage = Math.round((solved / total) * 100);

    return (
      <Card
        key={rating}
        className={`border-0 text-white bg-purple-950 transition-colors cursor-pointer ${
          selectedRating === rating ? "ring-2 ring-purple-500" : ""
        }`}
        onClick={() => handleRatingSelect(rating)}
      >
        <CardHeader className="pb-2">
          <CardTitle className="text-xl flex justify-between items-center">
            Rating: {rating}
            <Badge variant="outline" className="bg-purple-800/50 text-white">
              {solved}/{total}
            </Badge>
          </CardTitle>
          <CardDescription className="text-gray-300">
            {solved} / {total} problems solved
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-2">
            <Progress value={percentage} className="h-2" />
            <p className="text-xs text-white text-right">{percentage}%</p>
          </div>
        </CardContent>
      </Card>
      );
      })}

            
          </div>

          <div className="rounded-lg bg-purple-950 backdrop-blur-sm">
            <Table>
              <TableHeader className="bg-black">
                <TableRow className="hover:bg-purple-950/30 border-white">
                  <TableHead className="px-[80px] text-white">Question</TableHead>
                  <TableHead className="text-white w-[100px]">Rating</TableHead>
                  <TableHead className="text-white w-[100px]">Status</TableHead>
                  <TableHead className="text-white w-[150px]">Links</TableHead>
                  <TableHead className="text-white w-[100px]">Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredQuestions.map((question) => (
                  <TableRow
                    key={question.question_id}
                    className="hover:bg-purple-950/10 border-white/20"
                  >
                    <TableCell>
                      <div>
                        <div className="px-[40px] text-gray font-medium">{question.question_title}</div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className="text-white bg-purple-900/50 border-purple-700">
                        {question.rating}
                      </Badge>
                    </TableCell>
                    <TableCell>
                     <Badge
                        className={`text-white ${
                        question.status === "Solved"
                        ? "bg-green-700/50 border-green-600"
                        : "bg-yellow-600/50 border-yellow-500"
                        }`}
                        >
                        {question.status || "Unsolved"}
                    </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex space-x-2">
                        <a
                          href={question.link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 text-xs text-purple-400 hover:text-purple-300"
                        >
                          <ExternalLink className="h-3 w-3" />
                          Solve
                        </a>
                      </div>
                    </TableCell>
                    <TableCell>
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" className="text-white bg-purple-900/20 border-purple-700">
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="bg-purple-950 border-purple-700 text-white">
        <DropdownMenuItem
          onClick={() => handleStatusUpdate(question.question_id, "Solved",question.rating)}
        >
          Mark as Solved
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => handleStatusUpdate(question.question_id, "Attempted",question.rating)}
        >
          Mark as Attempted
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => handleStatusUpdate(question.question_id, "Unsolved", question.rating)}
        >
          Mark as Unsolved
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>

         
            <div className="flex justify-between items-center p-4 border-t border-purple-800/50">
              <Button
                disabled={page === 1}
                onClick={handlePrevPage}
                className="bg-purple-800 hover:bg-purple-700 text-white"
              >
                Previous
              </Button>
              <span className="text-white">Page {page} / 3</span>
              <Button
                disabled={!hasMore || page === 3}
                onClick={handleNextPage}
                className="bg-purple-800 hover:bg-purple-700 text-white"
              >
                Next
              </Button>
            </div>
            {filteredQuestions.length === 0 && !loading && (
              <div className="flex justify-center p-8 text-gray-300">Please select rating of your choice</div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}