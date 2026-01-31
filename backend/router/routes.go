package router


import (
	gin "github.com/gin-gonic/gin"
	controllers "nexcare/backend/controllers"
)

func RegisterUserRoute(router *gin.Engine){
	userGroup:=router.Group("/user")
	// userGroup.POST("/signUp",)
	userGroup.GET("/",controllers.GetUser)
}