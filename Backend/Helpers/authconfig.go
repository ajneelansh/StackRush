package Helpers

import(
	"os"
	"log"

	"github.com/joho/godotenv"
	"golang.org/x/oauth2"
	"golang.org/x/oauth2/google"
	"golang.org/x/oauth2/github"

)

var GoogleOAuthConfig *oauth2.Config
var GithubOAuthConfig *oauth2.Config

func Authconfig(){
	err := godotenv.Load()

	if err!= nil {
		log.Fatal("Error loading .env file")
	}

	GoogleOAuthConfig = &oauth2.Config{
		ClientID: os.Getenv("GOOGLE_CLIENT_ID"),
		ClientSecret: os.Getenv("GOOGLE_CLIENT_SECRET"),
		RedirectURL: "http://localhost:8080/auth/callback",
		Scopes:[]string{"https://www.googleapis.com/auth/userinfo.email","https://www.googleapis.com/auth/userinfo.profile"} ,
		Endpoint: google.Endpoint,
	}

	GithubOAuthConfig = &oauth2.Config{
		ClientID: os.Getenv("GITHUB_CLIENT_ID"),
		ClientSecret: os.Getenv("GITHUB_CLIENT_SECRET"),
		RedirectURL: "http://localhost:8080/auth/callback",
		Scopes:[]string{"user:email"} ,
		Endpoint: github.Endpoint,
	}

}