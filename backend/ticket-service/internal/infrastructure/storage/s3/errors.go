package s3

import "fmt"

const (
	MaxFileSize = 100 * 1024 * 1024 // 100 MB
)

var (
	ErrFileTooLarge = fmt.Errorf("file size exceeds maximum allowed size of %d MB", MaxFileSize/1024/1024)
	ErrFileNotFound = fmt.Errorf("file not found")
	ErrBucketNotFound = fmt.Errorf("bucket not found")
	ErrInvalidCredentials = fmt.Errorf("invalid credentials")
	ErrConnectionFailed = fmt.Errorf("failed to connect to S3")
	ErrUploadFailed = fmt.Errorf("failed to upload file")
	ErrDownloadFailed = fmt.Errorf("failed to download file")
	ErrDeleteFailed = fmt.Errorf("failed to delete file")
	ErrURLGenerationFailed = fmt.Errorf("failed to generate URL")
)

// содержит контекст ошибки для логирования
type ErrorContext struct {
	Operation string
	FilePath  string
	Bucket    string
	Err       error
}

func (e *ErrorContext) Error() string {
	return fmt.Sprintf("%s failed for file %s in bucket %s: %v", e.Operation, e.FilePath, e.Bucket, e.Err)
} 