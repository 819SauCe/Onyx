package services

import (
	"database/sql"
	"gen-you-ecommerce/config"
	"gen-you-ecommerce/helpers"
	"gen-you-ecommerce/responses"
	"net/http"

	"github.com/gin-gonic/gin"
)

func MeService(c *gin.Context) {
	tenantPageID := c.GetHeader("X-Tenant-Page-Id")
	if tenantPageID == "" {
		c.JSON(400, responses.MeResponse{
			Sucess:  true,
			Message: "Tenant not informed."})
		return
	}

	var tenantID string
	err := config.DB.QueryRow(`SELECT id FROM tenants WHERE page_id = $1`, tenantPageID).Scan(&tenantID)

	if err != nil {
		if err == sql.ErrNoRows {
			c.JSON(404, responses.MeResponse{
				Sucess:  true,
				Message: "Tenant not found"})
			return
		}
		c.JSON(500, responses.MeResponse{
			Sucess:  true,
			Message: "Database error"})
		return
	}

	tokenStr, err := c.Cookie("auth_token")
	if err != nil {
		c.JSON(http.StatusUnauthorized, gin.H{
			"success": false,
			"error":   "missing auth token",
		})
		return
	}

	claims, err := helpers.ValidateToken(tokenStr)
	if err != nil {
		c.JSON(http.StatusUnauthorized, gin.H{
			"success": false,
			"error":   "invalid or expired auth token",
		})
		return
	}

	user := helpers.UserData{
		Id:          claims["sub"].(string),
		Profile_img: claims["profile_img"].(string),
		First_name:  claims["first_name"].(string),
		Last_name:   claims["last_name"].(string),
		Email:       claims["email"].(string),
		Role:        claims["role"].(string),
		Plan:        claims["plan"].(string),
	}

	c.JSON(200, responses.MeResponse{
		Sucess:  true,
		Message: "Login successful.",
		Data: responses.UserDataMe{
			Id:         user.Id,
			ProfileImg: user.Profile_img,
			FirstName:  user.First_name,
			LastName:   user.Last_name,
			Email:      user.Email,
			Role:       user.Role,
			Plan:       user.Plan,
		},
	})
}
