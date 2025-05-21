-- UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Категории новостей (например: general, accreditation)
CREATE TABLE IF NOT EXISTS news_categories (
    id SERIAL PRIMARY KEY,
    code VARCHAR(50) UNIQUE NOT NULL, -- e.g., 'general'
    name VARCHAR(100) NOT NULL        -- display name
);

-- Основная таблица новостей
CREATE TABLE IF NOT EXISTS news (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    category_id INTEGER NOT NULL REFERENCES news_categories(id) ON DELETE RESTRICT,
    publish_date DATE NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Переводы заголовков и контента на разные языки
CREATE TABLE IF NOT EXISTS news_translations (
    id SERIAL PRIMARY KEY,
    news_id UUID NOT NULL REFERENCES news(id) ON DELETE CASCADE,
    lang VARCHAR(2) NOT NULL CHECK (lang IN ('kz', 'ru', 'en')),
    title TEXT NOT NULL,
    content TEXT NOT NULL,
    UNIQUE (news_id, lang)
);

-- Индексы для ускорения поиска
CREATE INDEX IF NOT EXISTS idx_news_publish_date ON news(publish_date);
CREATE INDEX IF NOT EXISTS idx_news_category ON news(category_id);
CREATE INDEX IF NOT EXISTS idx_translations_lang ON news_translations(lang);
