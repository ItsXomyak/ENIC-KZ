package metrics

import (
	"github.com/prometheus/client_golang/prometheus"
)

var (
	HttpRequestsTotal = prometheus.NewCounterVec(
		prometheus.CounterOpts{
			Name: "http_requests_total",
			Help: "Общее количество HTTP запросов",
		},
		[]string{"path", "method", "status"},
	)

	HttpRequestDuration = prometheus.NewHistogramVec(
		prometheus.HistogramOpts{
			Name:    "http_request_duration_seconds",
			Help:    "Длительность HTTP-запросов в секундах",
			Buckets: prometheus.DefBuckets,
		},
		[]string{"path"},
	)
)

func RegisterMetrics() {
	prometheus.MustRegister(HttpRequestsTotal)
	prometheus.MustRegister(HttpRequestDuration)
}
