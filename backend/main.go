package main

import (
	"gen-you-ecommerce/config"
	"gen-you-ecommerce/middlewares"
	"gen-you-ecommerce/services"
	"net/http"

	"github.com/gin-gonic/gin"
	_ "github.com/lib/pq"
)

func main() {
	config.Load()
	if config.Gin_mode == "release" || config.Gin_mode == "prod" {
		gin.SetMode(gin.ReleaseMode)
	}

	config.ConnectPostgres()
	router := gin.Default()

	router.POST("/v1/auth/login", middlewares.TenantMiddleware(), services.LoginService)
	router.POST("/v1/auth/register", middlewares.TenantMiddleware(), services.RegisterService)
	router.GET("v1/auth/me", middlewares.TenantMiddleware(), middlewares.AuthMiddleware(), services.MeService)

	http.ListenAndServe(":8080", router)
}
