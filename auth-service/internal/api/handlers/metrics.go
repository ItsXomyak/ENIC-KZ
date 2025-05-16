package handlers

import (
	"net/http"

	"github.com/prometheus/client_golang/prometheus/promhttp"
)

type MetricsHandler struct{}

func NewMetricsHandler() *MetricsHandler {
	return &MetricsHandler{}
}

func (h *MetricsHandler) HandleMetrics(w http.ResponseWriter, r *http.Request) {
	promhttp.Handler().ServeHTTP(w, r)
} 