package main

import "authforge/cmd"

// @title AuthForge API
// @version 1.0
// @description Authentication microservice with JWT and cookie-based login
// @host localhost:8080
// @BasePath /api/v1
func main() {
	cmd.Run()
}
