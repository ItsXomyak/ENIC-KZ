package monitoring

import (
	"github.com/prometheus/client_golang/prometheus"
)

var (
    HTTPRequests = prometheus.NewCounterVec(
        prometheus.CounterOpts{
            Name: "http_requests_total",
            Help: "Total number of HTTP requests",
        },
        []string{"method", "endpoint", "status"},
    )
    TicketStatusChanges = prometheus.NewCounterVec(
        prometheus.CounterOpts{
            Name: "ticket_status_changes_total",
            Help: "Total number of ticket status changes",
        },
        []string{"status"},
    )
)

func init() {
    prometheus.MustRegister(HTTPRequests, TicketStatusChanges)
}	