package Helpers

import (
	"crypto/rand"
	"encoding/base64"
	"fmt"
	
	"os"
	"time"


	"github.com/golang-jwt/jwt/v5"
)
 
var (
	jwtAccessSecret  = []byte(os.Getenv("JWT_ACCESS_SECRET"))
	jwtRefreshSecret = []byte(os.Getenv("JWT_REFRESH_SECRET"))
)

type Claims struct {
	UserID int `json:"user_id"`
	jwt.RegisteredClaims
}


func GenerateAccessAndRefreshTokens(userID int) (accessToken, refreshToken string, accessExp, refreshExp time.Time, err error) {
	
	accessExp = time.Now().Add(15 * time.Minute)
	accessTokenClaims := &Claims{
		UserID: userID,
		RegisteredClaims: jwt.RegisteredClaims{
			ExpiresAt: jwt.NewNumericDate(accessExp),
			IssuedAt:  jwt.NewNumericDate(time.Now()),
			NotBefore: jwt.NewNumericDate(time.Now()),
			Issuer:    "localhost", 
			Subject:   "access_token",
			ID:        fmt.Sprintf("%d-%d", userID, time.Now().UnixNano()), 
		},
	}
	accessTokenRaw := jwt.NewWithClaims(jwt.SigningMethodHS256, accessTokenClaims)
	accessToken, err = accessTokenRaw.SignedString(jwtAccessSecret)
	if err != nil {
		return "", "", time.Time{}, time.Time{}, fmt.Errorf("failed to sign access token: %w", err)
	}

	refreshExp = time.Now().Add(7 * 24 * time.Hour)
	refreshTokenClaims := &Claims{
		UserID: userID,
		RegisteredClaims: jwt.RegisteredClaims{
			ExpiresAt: jwt.NewNumericDate(refreshExp),
			IssuedAt:  jwt.NewNumericDate(time.Now()),
			NotBefore: jwt.NewNumericDate(time.Now()),
			Issuer:    "localhost", 
			Subject:   "refresh_token",
			ID:        fmt.Sprintf("%d-%d", userID, time.Now().UnixNano()), 
		},
	}
	refreshTokenRaw := jwt.NewWithClaims(jwt.SigningMethodHS256, refreshTokenClaims)
	refreshToken, err = refreshTokenRaw.SignedString(jwtRefreshSecret)
	if err != nil {
		return "", "", time.Time{}, time.Time{}, fmt.Errorf("failed to sign refresh token: %w", err)
	}

	return accessToken, refreshToken, accessExp, refreshExp, nil
}


func ValidateAccessToken(tokenString string) (*Claims, error) {
	claims := &Claims{}
	token, err := jwt.ParseWithClaims(tokenString, claims, func(token *jwt.Token) (interface{}, error) {
		if _, ok := token.Method.(*jwt.SigningMethodHMAC); !ok {
			return nil, fmt.Errorf("unexpected signing method: %v", token.Header["alg"])
		}
		return jwtAccessSecret, nil
	})

	if err != nil {
		return nil, fmt.Errorf("invalid access token: %w", err)
	}
	if !token.Valid {
		return nil, fmt.Errorf("access token is not valid")
	}
	return claims, nil
}

func ValidateRefreshToken(tokenString string) (*Claims, error) {
	claims := &Claims{}
	token, err := jwt.ParseWithClaims(tokenString, claims, func(token *jwt.Token) (interface{}, error) {
		if _, ok := token.Method.(*jwt.SigningMethodHMAC); !ok {
			return nil, fmt.Errorf("unexpected signing method: %v", token.Header["alg"])
		}
		return jwtRefreshSecret, nil
	})

	if err != nil {
		return nil, fmt.Errorf("invalid refresh token: %w", err)
	}
	if !token.Valid {
		return nil, fmt.Errorf("refresh token is not valid")
	}
	return claims, nil
}

func GetStringValue(data interface{}) string {
	if s, ok := data.(string); ok {
		return s
	}
	return ""
}

func GenerateRandomString(n int) string {
	b := make([]byte, n)
	if _, err := rand.Read(b); err != nil {
		panic(err) 
	}
	return base64.URLEncoding.EncodeToString(b)[:n]
}
