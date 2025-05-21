package service

import (
	"context"
	"fmt"
	"time"

	"news-service/internal/logger"
	"news-service/internal/models"
	"news-service/internal/repository"

	"github.com/google/uuid"
)

type NewsService interface {
	GetAll(ctx context.Context, category string, dateFrom, dateTo time.Time, limit, offset int) ([]models.News, error)
	GetByID(ctx context.Context, id string) (*models.News, error)
	Create(ctx context.Context, input *models.News) (*models.News, error)
	Update(ctx context.Context, input *models.News) (*models.News, error)
	Delete(ctx context.Context, id string) error
}

type newsService struct {
	repo repository.NewsRepository
}

func NewNewsService(repo repository.NewsRepository) NewsService {
	return &newsService{repo: repo}
}

func (s *newsService) GetAll(ctx context.Context, category string, dateFrom, dateTo time.Time, limit, offset int) ([]models.News, error) {
	// TODO: validate pagination parameters
	return s.repo.GetAll(ctx, category, dateFrom, dateTo, limit, offset)
}

func (s *newsService) GetByID(ctx context.Context, id string) (*models.News, error) {
	if _, err := uuid.Parse(id); err != nil {
		logger.Error("Invalid news ID format: ", err)
		return nil, err
	}
	return s.repo.GetByID(ctx, id)
}

func (s *newsService) Create(ctx context.Context, input *models.News) (*models.News, error) {
	if input.ID == uuid.Nil {
		input.ID = uuid.New()
	}
	input.CreatedAt = time.Now().UTC()

	for _, t := range input.Translations {
		if t.Lang != "kz" && t.Lang != "ru" && t.Lang != "en" {
			logger.Error("Unsupported language code: ", t.Lang)
			return nil, fmt.Errorf("unsupported language: %s", t.Lang)
		}
		if t.Title == "" || t.Content == "" {
			logger.Error("Translation title or content cannot be empty for lang: ", t.Lang)
			return nil, fmt.Errorf("translation for %s incomplete", t.Lang)
		}
	}

	if err := s.repo.Create(ctx, input); err != nil {
		logger.Error("Failed to create news: ", err)
		return nil, err
	}
	return input, nil
}

func (s *newsService) Update(ctx context.Context, input *models.News) (*models.News, error) {
	if _, err := uuid.Parse(input.ID.String()); err != nil {
		logger.Error("Invalid news ID: ", err)
		return nil, err
	}

	// set updated timestamp? (keeping created_at unchanged)

	for _, t := range input.Translations {
		if t.Lang != "kz" && t.Lang != "ru" && t.Lang != "en" {
			logger.Error("Unsupported language code: ", t.Lang)
			return nil, fmt.Errorf("unsupported language: %s", t.Lang)
		}
	}

	for i := range input.Translations {
		input.Translations[i].NewsID = input.ID
	}
	if err := s.repo.Update(ctx, input); err != nil {
		logger.Error("Failed to update news: ", err)
		return nil, err
	}
	return input, nil
}

func (s *newsService) Delete(ctx context.Context, id string) error {
	if _, err := uuid.Parse(id); err != nil {
		logger.Error("Invalid news ID format: ", err)
		return err
	}
	return s.repo.Delete(ctx, id)
}
