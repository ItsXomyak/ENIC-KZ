package storage

import (
	"context"
	"time"

	"github.com/aws/aws-sdk-go-v2/aws"
	awsconfig "github.com/aws/aws-sdk-go-v2/config"
	"github.com/aws/aws-sdk-go-v2/service/s3"

	"github.com/your-org/ticket-service/internal/config"
)

type S3Storage struct {
    client *s3.Client
    bucket string
}

func NewS3Storage(cfg *config.Config) (*S3Storage, error) {
    awsCfg, err := awsconfig.LoadDefaultConfig(context.Background(),
        awsconfig.WithRegion(cfg.S3Region),
        awsconfig.WithCredentialsProvider(aws.NewCredentialsCache(
            aws.CredentialsProviderFunc(func(ctx context.Context) (aws.Credentials, error) {
                return aws.Credentials{
                    AccessKeyID:     cfg.S3AccessKey,
                    SecretAccessKey: cfg.S3SecretKey,
                }, nil
            }),
        )),
    )
    if err != nil {
        return nil, err
    }

    client := s3.NewFromConfig(awsCfg)
    return &S3Storage{client, cfg.S3Bucket}, nil
}

func (s *S3Storage) GeneratePresignedURL(filePath string) (string, error) {
    presignClient := s3.NewPresignClient(s.client)
    req, err := presignClient.PresignPutObject(context.Background(), &s3.PutObjectInput{
        Bucket: aws.String(s.bucket),
        Key:    aws.String(filePath),
    }, s3.WithPresignExpires(15*time.Minute))
    if err != nil {
        return "", err
    }
    return req.URL, nil
}