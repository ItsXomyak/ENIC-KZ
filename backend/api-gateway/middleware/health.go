package middleware

import (
	"net/http"
	"sync"
	"time"

	"api-gateway/services/metrics"
)

var (
	healthCheckInterval = 30 * time.Second
	serviceEndpoints    = map[string]string{
		"auth":    "http://localhost:8081/health", // auth-service
		"news":    "http://localhost:8082/health", // news-service
		"tickets": "http://localhost:8083/health", // ticket-service
		"admin":   "http://localhost:8084/health", // private-service
	}
)

// StartHealthCheck запускает периодическую проверку здоровья сервисов
func StartHealthCheck() {
	client := &http.Client{
		Timeout: 5 * time.Second,
	}

	go func() {
		for {
			checkServicesHealth(client)
			time.Sleep(healthCheckInterval)
		}
	}()
}

// checkServicesHealth проверяет здоровье всех сервисов
func checkServicesHealth(client *http.Client) {
	var wg sync.WaitGroup

	for service, endpoint := range serviceEndpoints {
		wg.Add(1)
		go func(service, endpoint string) {
			defer wg.Done()
			checkServiceHealth(client, service, endpoint)
		}(service, endpoint)
	}

	wg.Wait()
}

// checkServiceHealth проверяет здоровье одного сервиса
func checkServiceHealth(client *http.Client, service, endpoint string) {
	resp, err := client.Get(endpoint)
	if err != nil {
		metrics.ServiceHealthStatus.WithLabelValues(service).Set(0)
		metrics.ErrorsTotal.WithLabelValues(service, "health_check").Inc()
		return
	}
	defer resp.Body.Close()

	if resp.StatusCode == http.StatusOK {
		metrics.ServiceHealthStatus.WithLabelValues(service).Set(1)
	} else {
		metrics.ServiceHealthStatus.WithLabelValues(service).Set(0)
		metrics.ErrorsTotal.WithLabelValues(service, "health_check").Inc()
	}
}
