"use client"

import { useEffect, useState, useCallback, SetStateAction } from "react"
import { useInView } from "react-intersection-observer"
import axios from "axios"
import {
  ChevronDown,
  ExternalLink,
  Filter,
  Search,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { SideBar } from "@/components/SideBar"

const useToast = () => ({
  toast: ({ title, description }: { title: string; description: string }) =>
    console.log(`Toast: ${title} - ${description}`),
})

const RATINGS = [1200, 1300, 1400, 1500, 1600, 1700, 1800, 1900]


const ratingOptions = [{ value: "all", label: "All Ratings" }, ...RATINGS.map(r => ({ value: String(r), label: String(r) }))]


const statusOptions = [
  { value: "all", label: "All Status" },
  { value: "solved", label: "Solved" },
  { value: "attempted", label: "Attempted" },
  { value: "unattempted", label: "unattempted" },
  { value: "todo", label: "ToDo" },
]



export default function Dashboard() {
  const [questions, setQuestions] = useState([])
  const [loading, setLoading] = useState(false)
  const [selectedStatus, setSelectedStatus] = useState("all")
  const [searchQuery, setSearchQuery] = useState("")
  const [page, setPage] = useState(1)
  const [hasMore, setHasMore] = useState(true)
  const { toast } = useToast()
  const [progressData, setProgressData] = useState<{ [key: string]: { total: number; solved: number } }>({})
  const [selectedRating, setSelectedRating] = useState("1200")
  const { ref, inView } = useInView({
    threshold: 0,
  })

  const filteredQuestions = questions.filter((question) => {
    const matchesStatus = selectedStatus === "all" || question.status === selectedStatus
    const matchesSearch = question.title.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesStatus && matchesSearch
  })


  const fetchQuestions = useCallback(
    async (rating: string | number, pageNumber: number) => {
      if (loading || !hasMore) return;
      setLoading(true);
  
      try {
        const res = await axios.get("/api/questions", {
          params: {
            minRating: rating,
            maxRating: rating,
            page: pageNumber,
            limit: 10,
          },
        });
  
        const data = res.data;
  
        if (!data || data.length === 0) {
          setHasMore(false);
        } else {
          setQuestions((prev) => (pageNumber === 1 ? data : [...prev, ...data]));
          setHasMore(data.length >= 10); 
          setPage(pageNumber);
        }
      } catch (error) {
        console.error("Error fetching questions:", error);
      } finally {
        setLoading(false);
      }
    },
    [loading, hasMore]
  );

  useEffect(() => {
    fetchQuestions(selectedRating, 1)
  }, [selectedRating, fetchQuestions])

  useEffect(() => {
    if (inView && hasMore && !loading) {
      fetchQuestions(selectedRating, page + 1)
    }
  }, [inView])

  const handleStatusChange = async (questionId: unknown, newStatus:unknown) => {
    try {
      await axios.post("/api/update-status", {
        questionId,
        rating: selectedRating,
        status: newStatus,
      })
    } catch (error) {
      console.error("Failed to update question status", error)
      
    }
  }


  useEffect(() => {
   const fetchProgressData = async () => {
    try {
      const res = await axios.get("/api/progress") 
      setProgressData(res.data || {})
    } catch (error) {
      console.error("Failed to fetch progress data:", error)
    }
  }
    fetchProgressData()
  }, [])

  const handleRatingSelect = (rating: string) => {
    setSelectedRating(rating)
    setQuestions([])
    setPage(1)
    fetchQuestions(rating, 1)
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "solved":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
      case "attempted":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300"
      case "todo":
        return "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300"
       case "unattempted":
        return "bg-red-100 text-red-800 dark:bg-red-800 dark:text-red-300"
      default:
        return "bg-red-100 text-red-800 dark:bg-red-800 dark:text-red-300"
    }
  }

  return (
    <div className="bg-black bg-gradient-to-b from-black to-purple-950 flex h-screen text-white">
     <div className="w-64 min-h-screen border-r bg-purple-900">
      <SideBar/>
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
                  <Button variant="outline" className="gap-2 bg-purple-900/50 border-white hover:bg-purple-800">
                    <Filter className="h-4 w-4" />
                    <span>Rating: {selectedRating === "all" ? "All" : selectedRating}</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  {ratingOptions.map((range) => (
                    <DropdownMenuItem
                      key={range.value}
                      onClick={() => setSelectedRating(range.value)}
                      className={selectedRating === range.value ? "bg-purple-900" : ""}
                    >
                      {range.label}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="gap-2 bg-purple-900/50 border-white hover:bg-purple-800">
                    <Filter className="h-4 w-4" />
                    <span>Status: {selectedStatus === "all" ? "All" : selectedStatus}</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  {statusOptions.map((option) => (
                    <DropdownMenuItem
                      key={option.value}
                      onClick={() => setSelectedStatus(option.value)}
                      className={selectedStatus === option.value ? "bg-purple-900" : ""}
                    >
                      {option.label}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </header>
          <main className="grid gap-6 p-6">
          <div className="grid gap-4 md:grid-cols-6 md:grid-rows-2">
  {Object.entries(progressData).map(([rating, data]) => (
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
            {data.solved}/{data.total}
          </Badge>
        </CardTitle>
        <CardDescription className="text-gray-300">
          {data.solved} / {data.total} problems solved
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col gap-2">
          <Progress value={(data.solved / data.total) * 100} className="h-2" />
          <p className="text-xs text-white text-right">
            {Math.round((data.solved / data.total) * 100)}%
          </p>
        </div>
      </CardContent>
    </Card>
  ))}

  <Card className="text-white bg-purple-950 border-0 transition-colors col-span-4 justify-between">
    <CardHeader className="pb-2">
      <CardTitle className="text-center text-xl">Overall Rating</CardTitle>
      <CardDescription className="text-center text-gray-300">
        Overall performance summary here.
      </CardDescription>
    </CardHeader>
    <CardContent>
      <div className="flex flex-col gap-2">
        <Progress  className="h-2" />
        
      </div>
    </CardContent>
  </Card>
</div>

            <div className="rounded-lg bg-purple-950 backdrop-blur-sm">
              <Table>
                <TableHeader className="bg-black">
                  <TableRow className="hover:bg-purple-950/30 border-white">
                    <TableHead className="px-[80px] text-white">Question</TableHead>
                    <TableHead className="text-white w-[100px]">Rating</TableHead>
                    <TableHead className="text-white w-[100px]">Status</TableHead>
                    <TableHead className="text-white w-[150px]">Links</TableHead>
                    <TableHead className="text-white w-[100px]">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredQuestions.map((question, index) => (
                    <TableRow
                      key={question.id}
                      className="hover:bg-purple-950/10 border-white/20"
                      ref={index === filteredQuestions.length - 1 ? ref : null}
                    >
                      <TableCell>
                        <div>
                          <div className="px-[40px] text-gray font-medium">{question.title}</div>
                          {question.notes && <div className="px-[40px] text-xs text-gray-400 mt-1">Note: {question.notes}</div>}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className="text-white bg-purple-900/50 border-purple-700">
                          {question.rating}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge className={`${getStatusColor(question.status)}`}>
                          {question.status.charAt(0).toUpperCase() + question.status.slice(1)}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex space-x-2">
                          <a
                            href={question.websiteLink}
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
                            <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                              <span className="sr-only">Open menu</span>
                              <ChevronDown className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuLabel>Actions</DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem onClick={() => handleStatusChange(question.id, "solved")}>
                              Mark as Solved
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleStatusChange(question.id, "attempted")}>
                              Mark as Attempted
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleStatusChange(question.id, "todo")}>
                              Mark as To Do
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleStatusChange(question.id, "unattempted")}>
                              Mark as Unattempted
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              {loading && (
                <div className="flex justify-center p-4 border-t border-purple-800/50">
                  <div className="h-6 w-6 animate-spin rounded-full border-b-2 border-purple-600"></div>
                </div>
              )}
              {filteredQuestions.length === 0 && !loading && (
                <div className="flex justify-center p-8 text-gray-300">No questions found matching your filters.</div>
              )}
            </div>
          </main>
        </div>
      </div>
  )
}
