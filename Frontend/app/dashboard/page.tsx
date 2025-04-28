"use client"

import { useState } from "react"
import { useInView } from "react-intersection-observer"
import {
  BookOpen,
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

const mockProgressData = {
  total: 500,
  solved: 215,
  ratings: {
    "1200": { total: 80, solved: 60 },
    "1300": { total: 70, solved: 50 },
    "1400": { total: 70, solved: 40 },
    "1500": { total: 70, solved: 30 },
    "1600": { total: 70, solved: 20 },
    "1700": { total: 50, solved: 10 },
    "1800": { total: 50, solved: 5 },
    "1900": { total: 40, solved: 0 },
  },
}

const ratingOptions = [
  { value: "all", label: "All Ratings" },
  { value: "1200", label: "1200" },
  { value: "1300", label: "1300" },
  { value: "1400", label: "1400" },
  { value: "1500", label: "1500" },
  { value: "1600", label: "1600" },
  { value: "1700", label: "1700" },
  { value: "1800", label: "1800" },
  { value: "1900", label: "1900" },
]

const statusOptions = [
  { value: "all", label: "All Status" },
  { value: "solved", label: "Solved" },
  { value: "attempted", label: "Attempted" },
  { value: "todo", label: "To Do" },
]

const generateMockQuestions = (count: number) => {
  const statuses = ["solved", "attempted", "todo"]
  const ratings = [1200, 1300, 1400, 1500, 1600, 1700, 1800, 1900]

  return Array.from({ length: count }, (_, i) => ({
    id: i + 1,
    title: `Data Structure Question ${i + 1}`,
    rating: ratings[Math.floor(Math.random() * ratings.length)],
    status: statuses[Math.floor(Math.random() * statuses.length)],
    articleLink: "#",
    websiteLink: "#",
    notes: Math.random() > 0.5 ? `Notes for question ${i + 1}` : null,
    date: new Date(Date.now() - Math.floor(Math.random() * 30) * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
  }))
}

export default function Dashboard() {
  const [selectedRating, setSelectedRating] = useState("all")
  const [selectedStatus, setSelectedStatus] = useState("all")
  const [searchQuery, setSearchQuery] = useState("")
  const [questions, setQuestions] = useState(generateMockQuestions(20))
  const [loading, setLoading] = useState(false)
  const { toast } = useToast()

  const { ref, inView } = useInView({
    threshold: 0,
  })

  // Load more questions when scrolling to the bottom
  const loadMoreQuestions = () => {
    if (loading) return

    setLoading(true)
    setTimeout(() => {
      const newQuestions = generateMockQuestions(10)
      setQuestions((prev) => [...prev, ...newQuestions])
      setLoading(false)
    }, 1000)
  }

  // Filter questions based on selected rating, status, and search query
  const filteredQuestions = questions.filter((question) => {
    const matchesRating = selectedRating === "all" || question.rating === Number.parseInt(selectedRating)
    const matchesStatus = selectedStatus === "all" || question.status === selectedStatus
    const matchesSearch = searchQuery === "" || question.title.toLowerCase().includes(searchQuery.toLowerCase())

    return matchesRating && matchesStatus && matchesSearch
  })

  // Check if we need to load more questions
  if (inView && !loading) {
    loadMoreQuestions()
  }

  const handleStatusChange = (questionId: number, newStatus: string) => {
    setQuestions((prev) => prev.map((q) => (q.id === questionId ? { ...q, status: newStatus } : q)))

    toast({
      title: "Status updated",
      description: `Question ${questionId} marked as ${newStatus}`,
    })
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "solved":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
      case "attempted":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300"
      case "todo":
        return "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300"
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300"
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
  {Object.entries(mockProgressData.ratings).map(([rating, data]) => (
    <Card
      key={rating}
      className={`border-0 text-white bg-purple-950 transition-colors cursor-pointer ${
        selectedRating === rating ? "ring-2 ring-purple-500" : ""
      }`}
      onClick={() => setSelectedRating(rating)}
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
                            href={question.articleLink}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 text-xs text-purple-400 hover:text-purple-300"
                          >
                            <BookOpen className="h-3 w-3" />
                            Article
                          </a>
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
