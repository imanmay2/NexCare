package config

import (
	"context"
	"log"
	"os"

	
	"github.com/redis/go-redis/v9"
)

var Ctx = context.Background()
var RedisClient *redis.Client

func ConnectRedis() {
	
	RedisClient = redis.NewClient(&redis.Options{
		Addr:     os.Getenv("REDIS_URL"),
		Username: "default",
		Password: os.Getenv("REDIS_PASS"),
		DB:       0,
	})

	// Test connection
	_, err := RedisClient.Ping(Ctx).Result()
	if err != nil {
		log.Fatal("❌ Redis Connection Failed: ", err)
	}

	log.Println("✅ Redis Connection Successful")
}