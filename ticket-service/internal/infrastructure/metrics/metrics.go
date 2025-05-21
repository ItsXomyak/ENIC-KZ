package metrics

import (
	"github.com/prometheus/client_golang/prometheus"
	"github.com/prometheus/client_golang/prometheus/promauto"
)

var (
	// Метрики для тикетов
	TicketsTotal = promauto.NewCounterVec(
		prometheus.CounterOpts{
			Name: "tickets_total",
			Help: "Общее количество созданных тикетов",
		},
		[]string{"status"},
	)

	TicketsInProgress = promauto.NewGauge(
		prometheus.GaugeOpts{
			Name: "tickets_in_progress",
			Help: "Количество тикетов в обработке",
		},
	)

	// Метрики для файлов
	FileUploadsTotal = promauto.NewCounterVec(
		prometheus.CounterOpts{
			Name: "file_uploads_total",
			Help: "Общее количество загруженных файлов",
		},
		[]string{"status"},
	)

	FileUploadSize = promauto.NewHistogramVec(
		prometheus.HistogramOpts{
			Name:    "file_upload_size_bytes",
			Help:    "Размер загруженных файлов в байтах",
			Buckets: prometheus.ExponentialBuckets(1024, 2, 10), // от 1KB до 1MB
		},
		[]string{"status"},
	)

	// Метрики для антивируса
	AntivirusScansTotal = promauto.NewCounterVec(
		prometheus.CounterOpts{
			Name: "antivirus_scans_total",
			Help: "Общее количество проверок файлов антивирусом",
		},
		[]string{"result"},
	)

	AntivirusScanDuration = promauto.NewHistogram(
		prometheus.HistogramOpts{
			Name:    "antivirus_scan_duration_seconds",
			Help:    "Время сканирования файла антивирусом в секундах",
			Buckets: prometheus.DefBuckets,
		},
	)

	// Метрики для S3
	S3OperationsTotal = promauto.NewCounterVec(
		prometheus.CounterOpts{
			Name: "s3_operations_total",
			Help: "Общее количество операций с S3",
		},
		[]string{"operation", "status"},
	)

	S3OperationDuration = promauto.NewHistogramVec(
		prometheus.HistogramOpts{
			Name:    "s3_operation_duration_seconds",
			Help:    "Время выполнения операций с S3 в секундах",
			Buckets: prometheus.DefBuckets,
		},
		[]string{"operation"},
	)

	// Метрики для HTTP
	HTTPRequestsTotal = promauto.NewCounterVec(
		prometheus.CounterOpts{
			Name: "http_requests_total",
			Help: "Общее количество HTTP запросов",
		},
		[]string{"method", "path", "status"},
	)

	HTTPRequestDuration = promauto.NewHistogramVec(
		prometheus.HistogramOpts{
			Name:    "http_request_duration_seconds",
			Help:    "Время выполнения HTTP запросов в секундах",
			Buckets: prometheus.DefBuckets,
		},
		[]string{"method", "path"},
	)
) 