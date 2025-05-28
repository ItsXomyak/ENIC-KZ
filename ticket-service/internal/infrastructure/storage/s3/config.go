package s3

// Config содержит конфигурацию для S3 сервиса
type Config struct {
	Endpoint        string
	AccessKeyID     string
	SecretAccessKey string
	BucketName      string
	Region          string
	UseSSL          bool
}

// NewConfig создает новую конфигурацию S3
func NewConfig(endpoint, accessKeyID, secretAccessKey, bucketName, region string, useSSL bool) *Config {
	return &Config{
		Endpoint:        endpoint,
		AccessKeyID:     accessKeyID,
		SecretAccessKey: secretAccessKey,
		BucketName:      bucketName,
		Region:          region,
		UseSSL:          useSSL,
	}
} 