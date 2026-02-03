package routes

import (
	"github.com/gin-gonic/gin"
	controller "nexcare/backend/controllers"
)

func RegisterUserRoutes(router *gin.Engine){
	userGroup:=router.Group("/users")
	userGroup.POST("/",controller.PostUser);
}