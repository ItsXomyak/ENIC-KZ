package models

import (
	"time"

	"github.com/google/uuid"
)

type NewsCategory struct {
	ID   int    `json:"id" db:"id"`
	Code string `json:"code" db:"code"`
	Name string `json:"name" db:"name"`
}

type NewsTranslation struct {
	ID      int       `json:"id" db:"id"`
	NewsID  uuid.UUID `json:"news_id" db:"news_id"`
	Lang    string    `json:"lang" db:"lang"` // "kz", "ru", "en"
	Title   string    `json:"title" db:"title"`
	Content string    `json:"content" db:"content"`
}

type News struct {
	ID           uuid.UUID         `json:"id" db:"id"`
	CategoryID   int               `json:"category_id" db:"category_id"`
	PublishDate  time.Time         `json:"publish_date" db:"publish_date"`
	CreatedAt    time.Time         `json:"created_at" db:"created_at"`
	Translations []NewsTranslation `json:"translations" db:"-"`
}
