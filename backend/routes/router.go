package routes

import (
	"github.com/gin-gonic/gin"
	controller "nexcare/backend/controllers"
	"nexcare/backend/middleware"
)

func RegisterUserRoutes(router *gin.Engine) {
	userGroup := router.Group("/users")
	userGroup.POST("/", controller.PostUser)
	userGroup.GET("/me", controller.Me)
	userGroup.POST("/otp", controller.Generate_StoreOTP)
	userGroup.POST("/logout", controller.LogoutUser)
}

func PatientRoutes(router *gin.Engine) {
	patientGroup := router.Group("/patient")
	patientGroup.Use(middleware.JWTAuthMiddleware())
	patientGroup.GET("/", controller.GetPatientInfo)
	patientGroup.GET("/availableDoctor", controller.GetDoctorInfo)
	patientGroup.GET("/getAppointment", controller.GetAppointment)
	// patientGroup.GET("/getPastAppointment",controller.GetPastAppointment)
	patientGroup.GET("/getAllAppointmentDetails", controller.GetAllAppointmentDetails)
	patientGroup.POST("/bookAppointment", controller.PostAppointment)
	patientGroup.GET("/getlatesthealthmetrics", controller.GetLatestHealthMetrics)
	patientGroup.GET("/healthmetrics", controller.GetHealthMetrics)
	patientGroup.GET("/healthsummary", controller.GetHealthSummary)
	patientGroup.GET("/consultationdata", controller.GetConsultationData) //precription  +  consultation.
	patientGroup.GET("/labResults", controller.GetLabResults)             //Lab results.
	patientGroup.POST("/symptomChecker", controller.SymptomChecker)
	patientGroup.PATCH("/updatePatientProfile", controller.UpdatePatientData)
}

func DoctorRoutes(router *gin.Engine) {
	doctorGroup := router.Group("/doctor")
	doctorGroup.Use(middleware.JWTAuthMiddleware())
	doctorGroup.POST("/addProfileData", controller.AddProfileData)
	doctorGroup.PUT("/updateProfileData", controller.UpdateProfileData)
	doctorGroup.GET("/getSchedule", controller.GetSchedule)
	doctorGroup.PUT("/setSchedule", controller.SetSchedule)
	doctorGroup.GET("/getInfo", controller.GetInfo)
	doctorGroup.POST("/uploadProfilePic", controller.UploadProfilePic)
	doctorGroup.DELETE("/deleteProfilePic", controller.DeleteProfilePic)
	// doctorGroup.GET("/getAppointments",controller.GetAppointments)
	// doctorGroup.GET("/getPatientRecords",controller.GetPatientRecords)
}


func PaymentRoutes(router *gin.Engine) {
	paymentGroup := router.Group("/payment")
	paymentGroup.Use(middleware.JWTAuthMiddleware())
	paymentGroup.POST("/createOrder", controller.CreateOrder)
	paymentGroup.POST("/verifyPayment", controller.VerifyPayment)
}

func WebSocketsRoutes(router *gin.Engine){
	socketGroup:=router.Group("/ws")
	socketGroup.GET("/connect",controller.WebSocketHandler)
}