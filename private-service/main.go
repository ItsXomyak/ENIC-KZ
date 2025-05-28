package main

import "private-service/cmd"

// @title Private Service API
// @version 1.0
// @description Admin and user management microservice with role-based access control
// @host localhost:8080
// @BasePath /api/v1
func main() {
	cmd.Run()
}
