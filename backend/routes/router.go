package routes

import (
	"github.com/gin-gonic/gin"
	// "nexcare/backend/middleware"
	controller "nexcare/backend/controllers"
)

func RegisterUserRoutes(router *gin.Engine){
	userGroup:=router.Group("/users")
	userGroup.GET("/refresh-token",controller.SetAccessToken)
	userGroup.POST("/",controller.PostUser)
	userGroup.POST("/otp",controller.Generate_StoreOTP)
	userGroup.POST("/logout",controller.LogoutUser)
}

func PatientRoutes(router *gin.Engine){
	patientGroup:=router.Group("/patient")
	// patientGroup.Use(middleware.JWTAuthMiddleware())
	patientGroup.GET("/",controller.GetPatientInfo)
}