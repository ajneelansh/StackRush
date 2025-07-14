package Controllers

import (
	"bytes"
	"encoding/json"
	"fmt"
	"io"
	"net/http"
	
	"strconv"
	"strings"

	"github.com/gin-gonic/gin"
)

type submissionTitle struct {
	Title string `json:"title"`
}

type Response struct {
	Data struct {
		RecentSubmissionList []submissionTitle `json:"recentSubmissionList"`
	} `json:"data"`
}

func fetchRecentLeetCodeSubmissions(username string) []string {
	leetcodeURL := "https://leetcode.com/graphql/"

	query := `
		query recentSubmissions($username: String!) {
			recentSubmissionList(username: $username) {
				title
			}
		}`

	body := map[string]interface{}{
		"query": query,
		"variables": map[string]string{
			"username": username,
			"limit":    "5",
		},
	}

	bodyJSON, err := json.Marshal(body)
	if err != nil {
		fmt.Println("Error marshalling JSON:", err)
	}

	req, err := http.NewRequest("POST", leetcodeURL, bytes.NewBuffer(bodyJSON))
	if err != nil {
		fmt.Println("Error creating request:", err)
		return nil
	}
	req.Header.Set("Content-Type", "application/json")
	client := &http.Client{}
	resp, err := client.Do(req)
	if err != nil {
		fmt.Println("Error making request:", err)
		return nil
	}
	defer resp.Body.Close()

	var gqlRes Response
	if err := json.NewDecoder(resp.Body).Decode(&gqlRes); err != nil {
		fmt.Println("Error decoding response:", err)
		return nil
	}

	titles := make([]string, 0, len(gqlRes.Data.RecentSubmissionList))
	for i, sub := range gqlRes.Data.RecentSubmissionList {
		if i >= 5 {
			break
		}
		titles = append(titles, sub.Title)
	}
	return titles
}

type cfSubmission struct {
	Problem struct {
		ContestID int    `json:"contestId"`
		Index     string `json:"index"`
	} `json:"problem"`
	Verdict string `json:"verdict"`
}

type cfResponse struct {
	Result []cfSubmission `json:"result"`
}

func fetchRecentCodeforcesSubmissions(handle string, limit int) ([]string, error) {
	url := fmt.Sprintf("https://codeforces.com/api/user.status?handle=%s&count=2", handle)

	resp, err := http.Get(url)
	if err != nil {
		return nil, err
	}
	defer resp.Body.Close()

	body, _ := io.ReadAll(resp.Body)
	var cfRes cfResponse
	if err := json.Unmarshal(body, &cfRes); err != nil {
		return nil, err
	}

	seen := make(map[string]bool)
	keys := []string{}

	for _, sub := range cfRes.Result {
		if sub.Verdict == "OK" {
			key := fmt.Sprintf("%d-%s", sub.Problem.ContestID, strings.ToUpper(sub.Problem.Index))
			if !seen[key] {
				seen[key] = true
				keys = append(keys, key)
			}
		}
		if len(keys) == limit {
			break
		}
	}
	return keys, nil
}

func parseCodeforcesTitle(title string) (contestID int, index string, ok bool) {
	title = strings.TrimSpace(strings.ToLower(title))
	if !strings.HasPrefix(title, "codeforces problem ") {
		return 0, "", false
	}
	parts := strings.Fields(title)
	if len(parts) < 3 {
		return 0, "", false
	}

	problemCode := parts[2]
	n := len(problemCode)
	if n < 2 {
		return 0, "", false
	}

	numPart := problemCode[:n-1]
	letterPart := problemCode[n-1:]

	contestID, err := strconv.Atoi(numPart)
	if err != nil {
		return 0, "", false
	}
	return contestID, strings.ToUpper(letterPart), true
}

func VerifySubmission() gin.HandlerFunc {
	return func(c *gin.Context) {
		var req struct {
			LcUsername string `json:"lcusername"`
			CfHandle   string `json:"cfhandle"`
			Title      string `json:"title"`
			QuestionId int    `json:"question_id"`
			Rating     int    `json:"rating"`
			Status     string `json:"status"`
			Date       string `json:"date"`
		}
		userID, exists := c.Get("user_id")
		uid := int(userID.(float64))
		if !exists {
			c.JSON(http.StatusUnauthorized, gin.H{"error": "User ID not found in context"})
			return
		}

		if err := c.ShouldBindJSON(&req); err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid request format"})
			return
		}
		title := strings.TrimSpace(req.Title)
		inputLower := strings.ToLower(title)

		if contestID, index, isCF := parseCodeforcesTitle(title); isCF {
			expected := fmt.Sprintf("%d-%s", contestID, index)
			keys, err := fetchRecentCodeforcesSubmissions(req.CfHandle, 2)
			if err != nil {
				c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to fetch Codeforces submissions"})
				return
			}
			for _, k := range keys {
				if k == expected {
					
					go IncrementHeatmapData(uid, req.Date)
					
					go UpdateQuestionStatus(uid, req.QuestionId, req.Status)
					go UpdateProgressData(uid, req.Rating)
					c.JSON(http.StatusOK, gin.H{"matched": true})
					return
				}
			}
			c.JSON(http.StatusOK, gin.H{"matched": false})
			return
		}

		submissions := fetchRecentLeetCodeSubmissions(req.LcUsername)

		for _, sub := range submissions {
			if strings.ToLower(sub) == inputLower {
				
				go IncrementHeatmapData(uid, req.Date)
				
				go UpdateQuestionStatus(uid, req.QuestionId, req.Status)
				go UpdateProgressData(uid, req.Rating)
				c.JSON(http.StatusOK, gin.H{"matched": true})
				return
			}
		}
		c.JSON(http.StatusOK, gin.H{"matched": false})
	}
}

func VerifySubmissionTopicwise() gin.HandlerFunc {
	return func(c *gin.Context) {
	var req struct {
			LcUsername string `json:"lcusername"`
			CfHandle   string `json:"cfhandle"`
			Title      string `json:"title"`
			QuestionId int    `json:"question_id"`
			TopicId    int    `json:"topic_id"`
			Status     string `json:"status"`
			Date       string `json:"date"`
		}
		userID, exists := c.Get("user_id")
		uid := int(userID.(float64))
		if !exists {
			c.JSON(http.StatusUnauthorized, gin.H{"error": "User ID not found in context"})
			return
		}

		if err := c.ShouldBindJSON(&req); err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid request format"})
			return
		}
		title := strings.TrimSpace(req.Title)
		inputLower := strings.ToLower(title)

		if contestID, index, isCF := parseCodeforcesTitle(title); isCF {
			expected := fmt.Sprintf("%d-%s", contestID, index)
			keys, err := fetchRecentCodeforcesSubmissions(req.CfHandle, 2)
			if err != nil {
				c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to fetch Codeforces submissions"})
				return
			}
			for _, k := range keys {
				if k == expected {
					
					go IncrementHeatmapData(uid, req.Date)
					
					go UpdateTopicWiseSheetStatus(req.QuestionId, uid, req.Status)
					go UpdateTopicWiseSheetProgress(uid, req.TopicId)
					c.JSON(http.StatusOK, gin.H{"matched": true})
					return
				}
			}
			c.JSON(http.StatusOK, gin.H{"matched": false})
			return
		}

		submissions := fetchRecentLeetCodeSubmissions(req.LcUsername)

		for _, sub := range submissions {
			if strings.ToLower(sub) == inputLower {
				
				go IncrementHeatmapData(uid, req.Date)
				
				go UpdateTopicWiseSheetStatus(req.QuestionId, uid, req.Status)
					go UpdateTopicWiseSheetProgress(uid, req.TopicId)
				c.JSON(http.StatusOK, gin.H{"matched": true})
				return
			}
		}
		c.JSON(http.StatusOK, gin.H{"matched": false})
	}
}