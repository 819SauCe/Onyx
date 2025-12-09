package services

import (
	"gen-you-ecommerce/helpers"
	"gen-you-ecommerce/responses"

	"github.com/gin-gonic/gin"
)

func LogoutService(c *gin.Context) {
	tenantID := c.MustGet("tenantID").(string)
	_ = tenantID

	helpers.SetAuthCookie(c, "", 0)

	c.JSON(200, responses.LogoutResponse{
		Sucess:  true,
		Message: "The user successfully exited the session.",
	})
}
