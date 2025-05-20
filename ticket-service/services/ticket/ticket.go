package ticket

import (
	"context"
	"encoding/json"
	"fmt"
	"regexp"
	"strings"
	"time"

	"github.com/aws/aws-sdk-go-v2/aws"
	awsconfig "github.com/aws/aws-sdk-go-v2/config"
	"github.com/aws/aws-sdk-go-v2/credentials"
	"github.com/aws/aws-sdk-go-v2/service/s3"
	"github.com/dutchcoders/go-clamd"
	"github.com/go-mail/mail/v2"
	"github.com/google/uuid"
	"github.com/jmoiron/sqlx"
	"github.com/redis/go-redis/v9"

	"ticket-service/config"
	"ticket-service/logger"
	"ticket-service/models"
	"ticket-service/repositories"
)

type Service struct {
	db         *sqlx.DB
	redis      *redis.Client
	cfg        *config.Config
	s3Client   *s3.Client
	clamAV     *clamd.Clamd
	mailer     *mail.Dialer
}

func NewService(db *sqlx.DB, redis *redis.Client, cfg *config.Config) (*Service, error) {
	// Инициализация S3 клиента (AWS SDK v2)
	awsCfg, err := awsconfig.LoadDefaultConfig(context.Background(),
		awsconfig.WithRegion(cfg.S3Region),
		awsconfig.WithCredentialsProvider(credentials.NewStaticCredentialsProvider(
			cfg.AWSAccessKeyID, cfg.AWSSecretAccessKey, "",
		)),
	)
	if err != nil {
		logger.Error("Failed to initialize AWS config:", err)
		return nil, err
	}
	s3Client := s3.NewFromConfig(awsCfg)

	// Инициализация ClamAV клиента
	clamAV := clamd.NewClamd(cfg.ClamAVAddr)

	// Инициализация SMTP клиента
	mailer := mail.NewDialer(cfg.SMTPHost, cfg.SMTPPort, cfg.SMTPUser, cfg.SMTPPass)
	mailer.Timeout = 10 * time.Second

	return &Service{
		db:       db,
		redis:    redis,
		cfg:      cfg,
		s3Client: s3Client,
		clamAV:   clamAV,
		mailer:   mailer,
	}, nil
}

// CreateTicket создает тикет и возвращает presigned URL
func (s *Service) CreateTicket(ctx context.Context, req models.CreateTicketRequest, userID string) (models.CreateTicketResponse, error) {
	// Валидация данных
	if !isValidCountry(req.Country) {
		return models.CreateTicketResponse{}, fmt.Errorf("invalid country code: %s", req.Country)
	}
	if !isValidDocumentType(req.DocumentType) {
		return models.CreateTicketResponse{}, fmt.Errorf("invalid document type: %s", req.DocumentType)
	}
	if !isValidEmail(req.Email) {
		return models.CreateTicketResponse{}, fmt.Errorf("invalid email: %s", req.Email)
	}

	// Генерация ID тикета
	ticketID := uuid.New().String()

	// Подготовка пути в S3
	s3Key := fmt.Sprintf("tickets/%s/%s", userID, ticketID)

	// Создание presigned URL для загрузки файла
	presignClient := s3.NewPresignClient(s.s3Client)
	presignedReq, err := presignClient.PresignPutObject(ctx, &s3.PutObjectInput{
		Bucket:      aws.String(s.cfg.S3Bucket),
		Key:         aws.String(s3Key),
		ContentType: aws.String("application/pdf,image/jpeg,image/png,image/tiff,application/docx"),
	}, s3.WithPresignExpires(15*time.Minute))
	if err != nil {
		logger.Error("Failed to generate presigned URL:", err)
		return models.CreateTicketResponse{}, err
	}

	// Создание объекта тикета
	ticket := models.Ticket{
		ID:           ticketID,
		UserID:       userID,
		FullName:     req.FullName,
		Email:        req.Email,
		PhoneNumber:  req.PhoneNumber,
		TelegramID:   req.TelegramID,
		Question:     req.Question,
		DocumentType: req.DocumentType,
		Country:      req.Country,
		FileURL:      aws.String(fmt.Sprintf("https://%s.s3.%s.amazonaws.com/%s", s.cfg.S3Bucket, s.cfg.S3Region, s3Key)),
		Status:       models.StatusNew,
		CreatedAt:    time.Now(),
		UpdatedAt:    time.Now(),
	}

	// Сохранение в БД
	repo := repositories.NewPostgresRepository(s.db)
	if err := repo.CreateTicket(&ticket); err != nil {
		logger.Error("Failed to create ticket:", err)
		return models.CreateTicketResponse{}, err
	}

	// Кэширование статуса тикета
	redisRepo := repositories.NewRedisRepository(s.redis)
	if err := redisRepo.CacheTicketStatus(ticketID, models.StatusNew, 10*time.Minute); err != nil {
		logger.Error("Failed to cache ticket status:", err)
	}

	// Отправка уведомления в Redis-очередь
	if err := s.queueNotification(ctx, ticket); err != nil {
		logger.Error("Failed to queue notification:", err)
	}

	return models.CreateTicketResponse{
		TicketID:     ticketID,
		PresignedURL: presignedReq.URL,
		Status:       string(ticket.Status),
	}, nil
}

// ScanFile проверяет файл на вирусы через ClamAV
func (s *Service) ScanFile(fileURL string) (bool, error) {
	// Извлечение ключа S3 из URL
	s3Key := strings.TrimPrefix(fileURL, fmt.Sprintf("https://%s.s3.%s.amazonaws.com/", s.cfg.S3Bucket, s.cfg.S3Region))

	// Загрузка файла из S3
	resp, err := s.s3Client.GetObject(context.Background(), &s3.GetObjectInput{
		Bucket: aws.String(s.cfg.S3Bucket),
		Key:    aws.String(s3Key),
	})
	if err != nil {
		logger.Error("Failed to get file from S3:", err)
		return false, err
	}
	defer resp.Body.Close()

	// Проверка размера файла (до 10 МБ)
	if resp.ContentLength != nil && *resp.ContentLength > 10*1024*1024 {
		return false, fmt.Errorf("file size exceeds 10 MB")
	}

	// Проверка типа файла
	contentType := aws.ToString(resp.ContentType)
	if !isValidFileType(contentType) {
		return false, fmt.Errorf("invalid file type: %s", contentType)
	}

	// Проверка через ClamAV
	result, err := s.clamAV.ScanStream(resp.Body, nil)
	if err != nil {
		logger.Error("ClamAV scan failed:", err)
		return false, err
	}

	for r := range result {
		if r.Status == clamd.RES_FOUND {
			logger.Warn("Virus detected in file:", r.Description)
			return false, nil
		}
	}

	logger.Info("File is clean:", fileURL)
	return true, nil
}

// queueNotification отправляет уведомление в Redis-очередь
func (s *Service) queueNotification(ctx context.Context, ticket models.Ticket) error {
	notification := map[string]interface{}{
		"ticket_id": ticket.ID,
		"email":     ticket.Email,
		"type":      "ticket_created",
		"message":   fmt.Sprintf("Your ticket %s has been created.", ticket.ID),
		"retries":   0,
	}
	data, err := json.Marshal(notification)
	if err != nil {
		return err
	}

	err = s.redis.LPush(ctx, "notifications:email", data).Err()
	if err != nil {
		return err
	}
	logger.Info("Notification queued for ticket:", ticket.ID)
	return nil
}

// ProcessNotifications обрабатывает уведомления из Redis-очереди
func (s *Service) ProcessNotifications(ctx context.Context) {
	ticker := time.NewTicker(time.Second)
	defer ticker.Stop()

	for {
		select {
		case <-ctx.Done():
			logger.Info("Stopping notification processor")
			return
		case <-ticker.C:
			result, err := s.redis.BRPop(ctx, 5*time.Second, "notifications:email").Result()
			if err == redis.Nil {
				continue
			}
			if err != nil {
				logger.Error("Failed to pop notification from Redis:", err)
				time.Sleep(time.Second)
				continue
			}
			if len(result) < 2 {
				logger.Error("Invalid result format from Redis")
				continue
			}

			var notification map[string]interface{}
			if err := json.Unmarshal([]byte(result[1]), &notification); err != nil {
				logger.Error("Failed to unmarshal notification:", err)
				continue
			}

			retries, _ := notification["retries"].(float64)
			if retries >= 3 {
				logger.Warn("Max retries reached for notification:", notification["ticket_id"])
				continue
			}
			notification["retries"] = retries + 1

			email, ok := notification["email"].(string)
			if !ok || email == "" {
				logger.Error("Invalid email in notification")
				continue
			}
			message, ok := notification["message"].(string)
			if !ok || message == "" {
				logger.Error("Invalid message in notification")
				continue
			}

			m := mail.NewMessage()
			m.SetHeader("From", s.cfg.SMTPUser)
			m.SetHeader("To", email)
			m.SetHeader("Subject", "Ticket Status Update")
			m.SetBody("text/plain", message)

			if err := s.mailer.DialAndSend(m); err != nil {
				logger.Error("Failed to send email:", err)
				data, _ := json.Marshal(notification)
				s.redis.LPush(ctx, "notifications:email", data)
				continue
			}

			ticketID, _ := notification["ticket_id"].(string)
			logger.Info("Email sent for ticket:", ticketID)
		}
	}
}

// GetTicket получает тикет по ID
func (s *Service) GetTicket(ctx context.Context, id string, userID string) (*models.Ticket, error) {
	redisRepo := repositories.NewRedisRepository(s.redis)
	cachedStatus, err := redisRepo.GetCachedTicketStatus(id)
	if err == nil {
		logger.Info("Cache hit for ticket status:", id, "Status:", cachedStatus)
	}

	repo := repositories.NewPostgresRepository(s.db)
	ticket, err := repo.GetTicket(id)
	if err != nil {
		logger.Error("Failed to get ticket:", err)
		return nil, err
	}

	if ticket.UserID != userID {
		return nil, fmt.Errorf("unauthorized access to ticket")
	}

	if cachedStatus != "" && cachedStatus != ticket.Status {
		if err := redisRepo.CacheTicketStatus(id, ticket.Status, 10*time.Minute); err != nil {
			logger.Error("Failed to update cached ticket status:", err)
		}
	}

	return ticket, nil
}

// ListTickets возвращает список тикетов пользователя
func (s *Service) ListTickets(ctx context.Context, userID string, params models.ListTicketsRequest) (models.ListTicketsResponse, error) {
	if params.Page < 1 {
		params.Page = 1
	}
	if params.Limit < 1 || params.Limit > 100 {
		params.Limit = 10
	}
	if params.CreatedAfter != nil {
		if _, err := time.Parse("2006-01-02", *params.CreatedAfter); err != nil {
			return models.ListTicketsResponse{}, fmt.Errorf("invalid created_after format")
		}
	}

	redisRepo := repositories.NewRedisRepository(s.redis)
	cachedTickets, err := redisRepo.GetCachedTickets(userID, params.Page, params.Limit)
	if err == nil && len(cachedTickets) > 0 {
		logger.Info("Cache hit for tickets list:", userID)
		repo := repositories.NewPostgresRepository(s.db)
		total, err := repo.CountTickets(userID)
		if err != nil {
			logger.Error("Failed to count tickets:", err)
			total = len(cachedTickets)
		}
		return models.ListTicketsResponse{
			Tickets: cachedTickets,
			Pagination: models.Pagination{
				Page:  params.Page,
				Limit: params.Limit,
				Total: total,
			},
		}, nil
	}

	repo := repositories.NewPostgresRepository(s.db)
	tickets, total, err := repo.ListTickets(userID, params)
	if err != nil {
		logger.Error("Failed to list tickets:", err)
		return models.ListTicketsResponse{}, err
	}

	if err := redisRepo.CacheTickets(userID, tickets, params.Page, params.Limit, 10*time.Minute); err != nil {
		logger.Error("Failed to cache tickets:", err)
	}

	return models.ListTicketsResponse{
		Tickets: tickets,
		Pagination: models.Pagination{
			Page:  params.Page,
			Limit: params.Limit,
			Total: total,
		},
	}, nil
}

// UpdateTicketStatus обновляет статус тикета (для админов)
func (s *Service) UpdateTicketStatus(ctx context.Context, ticketID string, req models.UpdateTicketStatusRequest, adminID string) error {
	repo := repositories.NewPostgresRepository(s.db)
	existingTicket, err := repo.GetTicket(ticketID)
	if err != nil {
		logger.Error("Failed to find ticket:", err)
		return fmt.Errorf("ticket not found: %w", err)
	}

	if !isValidStatus(req.Status) {
		return fmt.Errorf("invalid status: %s", req.Status)
	}

	if req.FileURL != nil && *req.FileURL != "" {
		isClean, err := s.ScanFile(*req.FileURL)
		if err != nil {
			logger.Error("File scan failed:", err)
			return repo.UpdateTicketStatus(ticketID, models.StatusRejected, aws.String("File scan failed: "+err.Error()), &adminID, nil)
		}
		if !isClean {
			logger.Warn("Virus detected in file:", *req.FileURL)
			return repo.UpdateTicketStatus(ticketID, models.StatusRejected, aws.String("File contains potential threat"), &adminID, nil)
		}
	}

	err = repo.UpdateTicketStatus(ticketID, req.Status, req.Comment, &adminID, req.FileURL)
	if err != nil {
		logger.Error("Failed to update ticket status:", err)
		return err
	}

	redisRepo := repositories.NewRedisRepository(s.redis)
	if err := redisRepo.CacheTicketStatus(ticketID, req.Status, 10*time.Minute); err != nil {
		logger.Error("Failed to cache ticket status:", err)
	}

	if err := redisRepo.InvalidateTicketsCache(ctx, existingTicket.UserID); err != nil {
		logger.Error("Failed to invalidate tickets cache:", err)
	}

	ticket, err := repo.GetTicket(ticketID)
	if err != nil {
		logger.Error("Failed to get ticket for notification:", err)
		return nil
	}

	statusNotification := map[string]interface{}{
		"ticket_id": ticket.ID,
		"email":     ticket.Email,
		"type":      "ticket_status_updated",
		"message":   fmt.Sprintf("Your ticket %s status has been updated to %s.", ticket.ID, ticket.Status),
		"retries":   0,
	}
	if req.Comment != nil && *req.Comment != "" {
		statusNotification["message"] = fmt.Sprintf("%s Comment: %s", statusNotification["message"], *req.Comment)
	}

	data, err := json.Marshal(statusNotification)
	if err != nil {
		logger.Error("Failed to marshal notification:", err)
		return nil
	}

	err = s.redis.LPush(ctx, "notifications:email", data).Err()
	if err != nil {
		logger.Error("Failed to queue status notification:", err)
	}

	return nil
}

// isValidCountry проверяет код страны
func isValidCountry(code string) bool {
	validCountries := map[string]bool{
		"RU": true,
		"US": true,
		"CN": true,
		"DE": true,
		"FR": true,
		"GB": true,
		"JP": true,
		"CA": true,
		"AU": true,
		"IT": true,
	}
	return validCountries[code]
}

// isValidDocumentType проверяет тип документа
func isValidDocumentType(docType string) bool {
	validTypes := map[string]bool{
		"diploma":     true,
		"certificate": true,
		"passport":    true,
		"license":     true,
		"transcript":  true,
	}
	return validTypes[docType]
}

// isValidFileType проверяет тип файла
func isValidFileType(contentType string) bool {
	validTypes := map[string]bool{
		"application/pdf":  true,
		"image/jpeg":       true,
		"image/png":        true,
		"image/tiff":       true,
		"application/docx": true,
	}
	return validTypes[contentType]
}

// isValidStatus проверяет статус тикета
func isValidStatus(status models.TicketStatus) bool {
	validStatuses := map[models.TicketStatus]bool{
		models.StatusNew:       true,
		models.StatusPending:   true,
		models.StatusApproved:  true,
		models.StatusRejected:  true,
		models.StatusCancelled: true,
	}
	return validStatuses[status]
}

// isValidEmail проверяет корректность email
func isValidEmail(email string) bool {
	re := regexp.MustCompile(`^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$`)
	return re.MatchString(email)
}