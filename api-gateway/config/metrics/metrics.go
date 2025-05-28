package metrics

import (
	"github.com/prometheus/client_golang/prometheus"
	"github.com/prometheus/client_golang/prometheus/promauto"
)

var (
	// Gateway request metrics
	GatewayRequestsTotal = promauto.NewCounterVec(
		prometheus.CounterOpts{
			Name: "gateway_requests_total",
			Help: "Total number of requests processed by the gateway",
		},
		[]string{"service", "method", "path", "status"},
	)

	GatewayRequestDuration = promauto.NewHistogramVec(
		prometheus.HistogramOpts{
			Name:    "gateway_request_duration_seconds",
			Help:    "Duration of requests processed by the gateway",
			Buckets: prometheus.DefBuckets,
		},
		[]string{"service", "method", "path"},
	)

	// Service health metrics
	ServiceHealthStatus = promauto.NewGaugeVec(
		prometheus.GaugeOpts{
			Name: "gateway_service_health_status",
			Help: "Health status of backend services (1 = healthy, 0 = unhealthy)",
		},
		[]string{"service"},
	)

	// Circuit breaker metrics
	CircuitBreakerStatus = promauto.NewGaugeVec(
		prometheus.GaugeOpts{
			Name: "gateway_circuit_breaker_status",
			Help: "Circuit breaker status (0 = closed, 1 = half-open, 2 = open)",
		},
		[]string{"service"},
	)

	CircuitBreakerFailures = promauto.NewCounterVec(
		prometheus.CounterOpts{
			Name: "gateway_circuit_breaker_failures_total",
			Help: "Total number of failures that triggered the circuit breaker",
		},
		[]string{"service", "error_type"},
	)

	// Authentication metrics
	AuthenticationTotal = promauto.NewCounterVec(
		prometheus.CounterOpts{
			Name: "gateway_authentication_total",
			Help: "Total number of authentication attempts",
		},
		[]string{"status"},
	)

	// Rate limiting metrics
	RateLimitExceeded = promauto.NewCounterVec(
		prometheus.CounterOpts{
			Name: "gateway_rate_limit_exceeded_total",
			Help: "Total number of requests that exceeded rate limits",
		},
		[]string{"service", "client_ip"},
	)

	// Cache metrics
	CacheHits = promauto.NewCounterVec(
		prometheus.CounterOpts{
			Name: "gateway_cache_hits_total",
			Help: "Total number of cache hits",
		},
		[]string{"cache_type"},
	)

	CacheMisses = promauto.NewCounterVec(
		prometheus.CounterOpts{
			Name: "gateway_cache_misses_total",
			Help: "Total number of cache misses",
		},
		[]string{"cache_type"},
	)

	// Proxy metrics
	ProxyErrors = promauto.NewCounterVec(
		prometheus.CounterOpts{
			Name: "gateway_proxy_errors_total",
			Help: "Total number of proxy errors",
		},
		[]string{"service", "error_type"},
	)
)

// InitMetrics инициализирует все метрики
func InitMetrics() {
	// Регистрируем все метрики
	prometheus.MustRegister(
		GatewayRequestsTotal,
		GatewayRequestDuration,
		ServiceHealthStatus,
		CircuitBreakerStatus,
		CircuitBreakerFailures,
		AuthenticationTotal,
		RateLimitExceeded,
		CacheHits,
		CacheMisses,
		ProxyErrors,
	)
}
