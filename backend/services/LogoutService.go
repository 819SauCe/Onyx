package services

import (
	"database/sql"
	"gen-you-ecommerce/config"
	"gen-you-ecommerce/helpers"
	"gen-you-ecommerce/responses"

	"github.com/gin-gonic/gin"
)

func LogoutService(c *gin.Context) {
	tenantPageID := c.GetHeader("X-Tenant-Page-Id")
	if tenantPageID == "" {
		c.JSON(400, responses.LogoutResponse{
			Sucess:  true,
			Message: "Tenant not informed."})
		return
	}

	var tenantID string
	err := config.DB.QueryRow(`SELECT id FROM tenants WHERE page_id = $1`, tenantPageID).Scan(&tenantID)

	if err != nil {
		if err == sql.ErrNoRows {
			c.JSON(404, responses.LogoutResponse{
				Sucess:  true,
				Message: "Tenant not found"})
			return
		}
		c.JSON(500, responses.LogoutResponse{
			Sucess:  true,
			Message: "Database error"})
		return
	}

	helpers.SetAuthCookie(c, "", 0)
	c.JSON(200, responses.LogoutResponse{
		Sucess:  true,
		Message: "The user successfully exited the session.",
	})
}
