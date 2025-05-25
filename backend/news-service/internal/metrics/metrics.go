package metrics

import (
	"github.com/prometheus/client_golang/prometheus"
)

var (
	// News retrieval metrics
	NewsGetAllCounter = prometheus.NewCounter(
		prometheus.CounterOpts{
			Name: "news_service_get_all_total",
			Help: "Total number of get all news requests",
		},
	)

	NewsGetByIDCounter = prometheus.NewCounter(
		prometheus.CounterOpts{
			Name: "news_service_get_by_id_total",
			Help: "Total number of get news by ID requests",
		},
	)

	// News management metrics
	NewsCreateCounter = prometheus.NewCounter(
		prometheus.CounterOpts{
			Name: "news_service_create_total",
			Help: "Total number of news creation requests",
		},
	)

	NewsUpdateCounter = prometheus.NewCounter(
		prometheus.CounterOpts{
			Name: "news_service_update_total",
			Help: "Total number of news update requests",
		},
	)

	NewsDeleteCounter = prometheus.NewCounter(
		prometheus.CounterOpts{
			Name: "news_service_delete_total",
			Help: "Total number of news deletion requests",
		},
	)

	// Error metrics
	NewsErrorCounter = prometheus.NewCounterVec(
		prometheus.CounterOpts{
			Name: "news_service_errors_total",
			Help: "Total number of errors by operation type",
		},
		[]string{"operation"},
	)
)

func InitMetrics() {
	// Register retrieval metrics
	prometheus.MustRegister(NewsGetAllCounter)
	prometheus.MustRegister(NewsGetByIDCounter)

	// Register management metrics
	prometheus.MustRegister(NewsCreateCounter)
	prometheus.MustRegister(NewsUpdateCounter)
	prometheus.MustRegister(NewsDeleteCounter)

	// Register error metrics
	prometheus.MustRegister(NewsErrorCounter)
}
