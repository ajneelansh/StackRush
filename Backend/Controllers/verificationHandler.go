package Controllers

import (
	"bytes"
	"encoding/json"
	"fmt"
	"net/http"
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

func fetchRecentSubmissions(username string) []string {
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
			"limit": "5",
		},
	}
	
	bodyJSON,err := json.Marshal(body)
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

func VerifySubmission() gin.HandlerFunc {
	return func(c *gin.Context) {
		var req struct {
			Username string `json:"username"`
			Title    string `json:"title"`
		}


		if err := c.ShouldBindJSON(&req); err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid request format"})
			return
		}

		titles := fetchRecentSubmissions(req.Username)
		if titles == nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to fetch submissions"})
			return
		}
		input := strings.TrimSpace(strings.ToLower(req.Title))

		for _, t := range titles {
			if strings.ToLower(t) == input {
				if err := IncrementHeatmapData(); err != nil {
					c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to increment heatmap data"})
					return
				}
				c.JSON(http.StatusOK, gin.H{"matched": true})
				return
			}
		}
		c.JSON(http.StatusOK, gin.H{"matched": false})
	}
}


