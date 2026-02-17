package middleware

import (
	"nexcare/backend/util"

	"github.com/gin-gonic/gin"
	"github.com/golang-jwt/jwt/v5"
)

func JWTAuthMiddleware() gin.HandlerFunc{
	return func(ctx *gin.Context){
		tokenString,err:=ctx.Cookie("token")
		if err!=nil{
			ctx.IndentedJSON(401,gin.H{"Message":"Token is missing"})
			ctx.Abort()
			return
		}

		token,err:=jwt.Parse(tokenString,func(token *jwt.Token)(interface{},error){
			return util.SecretKey,nil
		})

		if err!=nil || !token.Valid{
			ctx.IndentedJSON(401,gin.H{"Message":"Unauthorized User","success":false})
			ctx.Abort()
			return
		}

		claims := token.Claims.(jwt.MapClaims)

		userID := int(claims["user_id"].(float64))
		email := claims["email"].(string)

		ctx.Set("userID", userID)
		ctx.Set("email", email)

		ctx.Next()
	}
}