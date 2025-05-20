CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Перечисление для статуса тикета
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'ticket_status') THEN
        CREATE TYPE ticket_status AS ENUM ('new', 'in_progress', 'closed');
    END IF;
END$$;

-- Таблица tickets
CREATE TABLE IF NOT EXISTS tickets (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL,
    full_name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    phone_number VARCHAR(20), -- Опционально, формат телефона
    telegram_id VARCHAR(50), -- Опционально, Telegram ID
    question TEXT NOT NULL, -- Вопрос или описание заявки
 
    document_type VARCHAR(50) NOT NULL, -- Например, 'diploma', 'certificate'
    country VARCHAR(2) NOT NULL, -- ISO 3166-1 alpha-2 код страны, например 'RU'
    file_url VARCHAR(512), -- URL файла в S3, опционально
    status ticket_status NOT NULL DEFAULT 'new',
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_user FOREIGN KEY(user_id) REFERENCES users(id) ON DELETE RESTRICT
);

CREATE INDEX IF NOT EXISTS idx_tickets_user_id ON tickets(user_id);
CREATE INDEX IF NOT EXISTS idx_tickets_status ON tickets(status);
CREATE INDEX IF NOT EXISTS idx_tickets_created_at ON tickets(created_at);

-- Таблица ticket_responses
CREATE TABLE IF NOT EXISTS ticket_responses (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    ticket_id UUID NOT NULL,
    admin_id UUID, -- NULL для системных ответов (например, уведомление о вирусе)
    status ticket_status NOT NULL,
    comment TEXT, -- Комментарий админа, опционально
    file_url VARCHAR(512), -- URL файла админа в S3, опционально
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_ticket FOREIGN KEY(ticket_id) REFERENCES tickets(id) ON DELETE CASCADE,
    CONSTRAINT fk_admin FOREIGN KEY(admin_id) REFERENCES users(id) ON DELETE SET NULL
);

CREATE INDEX IF NOT EXISTS idx_ticket_responses_ticket_id ON ticket_responses(ticket_id);

-- Триггер для обновления updated_at
CREATE OR REPLACE FUNCTION update_tickets_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
   NEW.updated_at = NOW();
   RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_tickets_updated_at ON tickets;

CREATE TRIGGER trg_tickets_updated_at
BEFORE UPDATE ON tickets
FOR EACH ROW
EXECUTE FUNCTION update_tickets_updated_at_column();