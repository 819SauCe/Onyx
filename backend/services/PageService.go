package services

import (
	"database/sql"
	"gen-you-ecommerce/config"
	"gen-you-ecommerce/helpers"
	"gen-you-ecommerce/responses"
	"net/http"

	"github.com/gin-gonic/gin"
)

func PageService(c *gin.Context) {
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
}
