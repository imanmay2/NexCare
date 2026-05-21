package routes

import (
    controller "nexcare/backend/controllers"
    "nexcare/backend/middleware"
    "github.com/gin-gonic/gin"
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
    // patientGroup.Use(middleware.JWTAuthMiddleware())
    patientGroup.GET("/", controller.GetPatientInfo)
    patientGroup.GET("/availableDoctor", controller.GetDoctorInfo)
    patientGroup.GET("/getAppointment", controller.GetAppointment) 
    // patientGroup.GET("/getPastAppointment",controller.GetPastAppointment)
    patientGroup.POST("/bookAppointment", controller.PostAppointment)
    patientGroup.GET("/healthmetrics",controller.GetHealthMetrics)
    patientGroup.GET("/healthsummary",controller.GetHealthSummary) 
    patientGroup.GET("/consultationdata",controller.GetConsultationData) 
    patientGroup.GET("/labResults",controller.GetLabResults) 
    patientGroup.POST("/symptomChecker",controller.SymptomChecker)
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