package metrics

import (
	"log"
	"net/http"

	"github.com/prometheus/client_golang/prometheus/promhttp"
)

// StartMetricsServer starts a dedicated metrics server on the specified port
func StartMetricsServer(port string) {
	go func() {
		log.Printf("Starting metrics server on :%s", port)
		http.Handle("/metrics", promhttp.Handler())
		if err := http.ListenAndServe(":"+port, nil); err != nil {
			log.Fatalf("Failed to start metrics server: %v", err)
		}
	}()
}
