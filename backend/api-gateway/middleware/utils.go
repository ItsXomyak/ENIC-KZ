package middleware

// GetServiceFromPath определяет сервис на основе пути запроса
func GetServiceFromPath(path string) string {
	switch {
	case pathStartsWith(path, "/api/v1/auth"):
		return "auth"
	case pathStartsWith(path, "/api/v1/news"):
		return "news"
	case pathStartsWith(path, "/api/v1/tickets"):
		return "tickets"
	case pathStartsWith(path, "/api/v1/admin"):
		return "admin"
	default:
		return "unknown"
	}
}

// pathStartsWith проверяет, начинается ли путь с указанного префикса
func pathStartsWith(path, prefix string) bool {
	return len(path) >= len(prefix) && path[:len(prefix)] == prefix
}
