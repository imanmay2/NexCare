package middleware

import (
	"net/http"
	"nexcare/backend/util"

	"github.com/gin-gonic/gin"
	"github.com/golang-jwt/jwt/v5"
)

// this jwt middleware will only verify the access token
func JWTAuthMiddleware() gin.HandlerFunc {
	return func(ctx *gin.Context) {
		tokenString, err := ctx.Cookie("token")
		if err != nil {
			//if the access token is missing then , it will fetch the refresh token and generate the access token
			refreshToken, err1 := ctx.Cookie("refresh_token")
			if err1 != nil {
				//refresh token is not found .. redirect it to login
				ctx.IndentedJSON(401, gin.H{"Message": "Refresh Token not found", "success": false})
				ctx.Abort()
				return
			}

			//generate the access token after verifying the signature of the refresh token.
			user_id, email, err3 := util.VerifySignature(ctx, refreshToken)
			if err3 != nil {
				ctx.IndentedJSON(401, gin.H{"Message": "Refresh_Token is incorrect", "success": false})
				ctx.Abort()
				return
			}

			//creating a new access token and proceeding the request
			access_token, err4 := util.GenerateJWT(user_id, email)
			if err4 != nil {
				ctx.IndentedJSON(500, gin.H{"Message": err4.Error(), "success": false})
				ctx.Abort()
				return
			}
			tokenString = access_token
			ctx.SetSameSite(http.SameSiteNoneMode)
			ctx.SetCookie("token", access_token, 60*15, "/", "", true, true)
		}

		// tokenString,_=ctx.Cookie("token")
		token, err := jwt.Parse(tokenString, func(token *jwt.Token) (interface{}, error) {
			return util.SecretKey, nil
		})
		if err != nil || !token.Valid {
			ctx.IndentedJSON(401, gin.H{"Message": "Unauthorized User", "success": false})
			ctx.Abort()
			return
		}
		claims := token.Claims.(jwt.MapClaims)
		userID := claims["user_id"].(string)
		email := claims["email"].(string)
		ctx.Set("userID", userID)
		ctx.Set("email", email)
		ctx.Next()
	}
}
