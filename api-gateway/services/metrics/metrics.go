package metrics

import (
	"github.com/prometheus/client_golang/prometheus"
)

var (
	registry = prometheus.NewRegistry()

	// Gateway request metrics
	GatewayRequestsTotal = prometheus.NewCounterVec(
		prometheus.CounterOpts{
			Name: "gateway_requests_total",
			Help: "Total number of requests processed by the gateway",
		},
		[]string{"service", "method", "path", "status"},
	)

	GatewayRequestDuration = prometheus.NewHistogramVec(
		prometheus.HistogramOpts{
			Name:    "gateway_request_duration_seconds",
			Help:    "Duration of requests processed by the gateway",
			Buckets: prometheus.DefBuckets,
		},
		[]string{"service", "method", "path"},
	)

	// Service health metrics
	ServiceHealthStatus = prometheus.NewGaugeVec(
		prometheus.GaugeOpts{
			Name: "gateway_service_health_status",
			Help: "Current health status of backend services (1 = healthy, 0 = unhealthy)",
		},
		[]string{"service"},
	)

	// Circuit breaker metrics
	CircuitBreakerStatus = prometheus.NewGaugeVec(
		prometheus.GaugeOpts{
			Name: "gateway_circuit_breaker_status",
			Help: "Current status of circuit breakers (0 = closed, 1 = half-open, 2 = open)",
		},
		[]string{"service"},
	)

	CircuitBreakerTrips = prometheus.NewCounterVec(
		prometheus.CounterOpts{
			Name: "gateway_circuit_breaker_trips_total",
			Help: "Total number of times circuit breakers have been tripped",
		},
		[]string{"service"},
	)

	// Authentication metrics
	AuthenticationTotal = prometheus.NewCounterVec(
		prometheus.CounterOpts{
			Name: "gateway_authentication_total",
			Help: "Total number of authentication attempts",
		},
		[]string{"status"},
	)

	// Rate limiting metrics
	RateLimitExceeded = prometheus.NewCounterVec(
		prometheus.CounterOpts{
			Name: "gateway_rate_limit_exceeded_total",
			Help: "Total number of requests that exceeded rate limits",
		},
		[]string{"service"},
	)

	// Cache metrics
	CacheHits = prometheus.NewCounterVec(
		prometheus.CounterOpts{
			Name: "gateway_cache_hits_total",
			Help: "Total number of cache hits",
		},
		[]string{"cache_type"},
	)

	CacheMisses = prometheus.NewCounterVec(
		prometheus.CounterOpts{
			Name: "gateway_cache_misses_total",
			Help: "Total number of cache misses",
		},
		[]string{"cache_type"},
	)

	// Error metrics
	ErrorsTotal = prometheus.NewCounterVec(
		prometheus.CounterOpts{
			Name: "gateway_errors_total",
			Help: "Total number of errors by type",
		},
		[]string{"service", "error_type"},
	)
)

// InitMetrics initializes and registers all metrics
func InitMetrics() {
	// Register all metrics with our custom registry
	registry.MustRegister(
		GatewayRequestsTotal,
		GatewayRequestDuration,
		ServiceHealthStatus,
		CircuitBreakerStatus,
		CircuitBreakerTrips,
		AuthenticationTotal,
		RateLimitExceeded,
		CacheHits,
		CacheMisses,
		ErrorsTotal,
	)
}

// GetRegistry returns the metrics registry
func GetRegistry() *prometheus.Registry {
	return registry
}
