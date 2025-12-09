package middlewares

import (
	"database/sql"
	"gen-you-ecommerce/config"

	"github.com/gin-gonic/gin"
)

func TenantMiddleware() gin.HandlerFunc {
	return func(c *gin.Context) {
		tenantPageID := c.GetHeader("X-Tenant-Page-Id")
		if tenantPageID == "" {
			c.AbortWithStatusJSON(400, gin.H{
				"success": false,
				"error":   "Tenant not informed",
			})
			return
		}

		var tenantID string
		err := config.DB.QueryRow(`SELECT id FROM tenants WHERE page_id = $1`, tenantPageID).Scan(&tenantID)

		if err != nil {
			if err == sql.ErrNoRows {
				c.AbortWithStatusJSON(404, gin.H{"success": false, "error": "Tenant not found"})
				return
			}
			c.AbortWithStatusJSON(500, gin.H{"success": false, "error": "Database error"})
			return
		}

		c.Set("tenantID", tenantID)
		c.Next()
	}
}
