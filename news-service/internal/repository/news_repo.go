package repository

import (
	"context"
	"encoding/json"
	"fmt"
	"strings"
	"time"

	"github.com/go-redis/redis/v8"
	"github.com/google/uuid"
	"github.com/jackc/pgx/v5/pgxpool"
	"github.com/pkg/errors"

	"news-service/internal/logger"
	"news-service/internal/models"
)

type NewsRepository interface {
	GetAll(ctx context.Context, category string, dateFrom, dateTo time.Time, limit, offset int) ([]models.News, error)
	GetByID(ctx context.Context, id string) (*models.News, error)
	Create(ctx context.Context, news *models.News) error
	Update(ctx context.Context, news *models.News) error
	Delete(ctx context.Context, id string) error
}

type newsRepo struct {
	db    *pgxpool.Pool
	cache *redis.Client
}

func NewNewsRepo(db *pgxpool.Pool, redisClient *redis.Client) NewsRepository {
	return &newsRepo{
		db:    db,
		cache: redisClient,
	}
}

const (
	cacheListPrefix = "news:list"
	cacheItemPrefix = "news:item"
	cacheTTL        = 5 * time.Minute
)

func (r *newsRepo) GetAll(ctx context.Context, category string, dateFrom, dateTo time.Time, limit, offset int) ([]models.News, error) {
	keyParts := []string{cacheListPrefix}
	if category != "" {
		keyParts = append(keyParts, "cat="+category)
	}
	if !dateFrom.IsZero() {
		keyParts = append(keyParts, "from="+dateFrom.Format("2006-01-02"))
	}
	if !dateTo.IsZero() {
		keyParts = append(keyParts, "to="+dateTo.Format("2006-01-02"))
	}
	keyParts = append(keyParts, fmt.Sprintf("limit=%d_offset=%d", limit, offset))
	cacheKey := strings.Join(keyParts, ":")

	newsList := make([]models.News, 0)
	if data, err := r.cache.Get(ctx, cacheKey).Result(); err == nil {
		if err := json.Unmarshal([]byte(data), &newsList); err == nil {
			logger.Debug("Cache hit for GetAll, key=", cacheKey)
			return newsList, nil
		}
	}

	var df, dt interface{} = nil, nil
	if !dateFrom.IsZero() {
		df = dateFrom
	}
	if !dateTo.IsZero() {
		dt = dateTo
	}

	query := `
    SELECT id, category_id, publish_date, created_at
      FROM news
     WHERE ($1 = '' OR category_id = (
               SELECT id FROM news_categories WHERE code = $1))
       AND ($2::date IS NULL OR publish_date >= $2)
       AND ($3::date IS NULL OR publish_date <= $3)
     ORDER BY publish_date DESC
     LIMIT $4 OFFSET $5
    `

	rows, err := r.db.Query(ctx, query, category, df, dt, limit, offset)
	if err != nil {
		return nil, errors.Wrap(err, "query GetAll news failed")
	}
	defer rows.Close()

	for rows.Next() {
		var n models.News
		if err := rows.Scan(&n.ID, &n.CategoryID, &n.PublishDate, &n.CreatedAt); err != nil {
			return nil, errors.Wrap(err, "scan GetAll news failed")
		}
		n.Translations, _ = r.loadTranslations(ctx, n.ID)
		newsList = append(newsList, n)
	}

	b, _ := json.Marshal(newsList)
	r.cache.Set(ctx, cacheKey, b, cacheTTL)

	return newsList, nil
}

func (r *newsRepo) GetByID(ctx context.Context, id string) (*models.News, error) {
	cacheKey := fmt.Sprintf("%s:%s", cacheItemPrefix, id)

	if data, err := r.cache.Get(ctx, cacheKey).Result(); err == nil {
		var n models.News
		if err := json.Unmarshal([]byte(data), &n); err == nil {
			logger.Debug("Cache hit for GetByID, key=", cacheKey)
			return &n, nil
		}
	}

	query := `SELECT id, category_id, publish_date, created_at FROM news WHERE id = $1`
	row := r.db.QueryRow(ctx, query, id)
	var n models.News
	if err := row.Scan(&n.ID, &n.CategoryID, &n.PublishDate, &n.CreatedAt); err != nil {
		return nil, errors.Wrap(err, "query GetByID failed")
	}
	n.Translations, _ = r.loadTranslations(ctx, n.ID)

	b, _ := json.Marshal(n)
	r.cache.Set(ctx, cacheKey, b, cacheTTL)

	return &n, nil
}

func (r *newsRepo) Create(ctx context.Context, news *models.News) error {
	logger.Debug("Creating news item, id=", news.ID)
	tx, err := r.db.Begin(ctx)
	if err != nil {
		return errors.Wrap(err, "begin txn Create news failed")
	}
	defer tx.Rollback(ctx)

	insert := `INSERT INTO news (id, category_id, publish_date, created_at) VALUES ($1, $2, $3, $4)`
	if _, err := tx.Exec(ctx, insert, news.ID, news.CategoryID, news.PublishDate, news.CreatedAt); err != nil {
		return errors.Wrap(err, "insert news failed")
	}
	for _, t := range news.Translations {
		insTr := `INSERT INTO news_translations (news_id, lang, title, content) VALUES ($1, $2, $3, $4)`
		if _, err := tx.Exec(ctx, insTr, news.ID, t.Lang, t.Title, t.Content); err != nil {
			return errors.Wrap(err, "insert translation failed")
		}
	}

	if err := tx.Commit(ctx); err != nil {
		return errors.Wrap(err, "commit Create news failed")
	}

	r.invalidateCache(ctx, news.ID.String())

	return nil
}

func (r *newsRepo) Update(ctx context.Context, news *models.News) error {
	logger.Debug("Updating news item, id=", news.ID)
	tx, err := r.db.Begin(ctx)
	if err != nil {
		return errors.Wrap(err, "begin txn Update news failed")
	}
	defer tx.Rollback(ctx)

	upd := `UPDATE news SET category_id = $1, publish_date = $2 WHERE id = $3`
	if _, err := tx.Exec(ctx, upd, news.CategoryID, news.PublishDate, news.ID); err != nil {
		return errors.Wrap(err, "update news failed")
	}
	for _, t := range news.Translations {
		upTr := `INSERT INTO news_translations (news_id, lang, title, content)
			VALUES ($1, $2, $3, $4)
			ON CONFLICT (news_id, lang) DO UPDATE SET title = EXCLUDED.title, content = EXCLUDED.content`
		if _, err := tx.Exec(ctx, upTr, news.ID, t.Lang, t.Title, t.Content); err != nil {
			return errors.Wrap(err, "upsert translation failed")
		}
	}

	if err := tx.Commit(ctx); err != nil {
		return errors.Wrap(err, "commit Update news failed")
	}

	r.invalidateCache(ctx, news.ID.String())

	return nil
}

func (r *newsRepo) Delete(ctx context.Context, id string) error {
	logger.Debug("Deleting news item, id=", id)

	if _, err := r.db.Exec(ctx, `DELETE FROM news WHERE id = $1`, id); err != nil {
		return errors.Wrap(err, "delete news failed")
	}

	r.invalidateCache(ctx, id)

	return nil
}

func (r *newsRepo) loadTranslations(ctx context.Context, id uuid.UUID) ([]models.NewsTranslation, error) {
	query := `SELECT id, news_id, lang, title, content FROM news_translations WHERE news_id = $1`
	rows, err := r.db.Query(ctx, query, id)
	if err != nil {
		return nil, errors.Wrap(err, "query translations failed")
	}
	defer rows.Close()

	var list []models.NewsTranslation
	for rows.Next() {
		var t models.NewsTranslation
		if err := rows.Scan(&t.ID, &t.NewsID, &t.Lang, &t.Title, &t.Content); err != nil {
			return nil, errors.Wrap(err, "scan translation failed")
		}
		list = append(list, t)
	}
	return list, nil
}

func (r *newsRepo) invalidateCache(ctx context.Context, id string) {
	itemKey := fmt.Sprintf("%s:%s", cacheItemPrefix, id)
	r.cache.Del(ctx, itemKey)

	pattern := cacheListPrefix + "*"
	keys, err := r.cache.Keys(ctx, pattern).Result()
	if err != nil {
		logger.Error("Failed to fetch cache keys for invalidation: ", err)
		return
	}
	if len(keys) > 0 {
		r.cache.Del(ctx, keys...)
	}
}
