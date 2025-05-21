# Этап сборки
FROM golang:1.21-alpine AS builder

# Установка необходимых зависимостей
RUN apk add --no-cache git

# Установка рабочей директории
WORKDIR /app

# Копирование файлов зависимостей
COPY go.mod go.sum ./
RUN go mod download

# Копирование исходного кода
COPY . .

# Сборка приложения
RUN CGO_ENABLED=0 GOOS=linux go build -o /app/ticket-service ./cmd/api

# Финальный этап
FROM alpine:3.18

# Установка необходимых пакетов
RUN apk add --no-cache ca-certificates tzdata

# Установка рабочей директории
WORKDIR /app

# Копирование бинарного файла из этапа сборки
COPY --from=builder /app/ticket-service .

# Копирование конфигурационных файлов
COPY config/config.yaml ./config/

# Установка переменных окружения
ENV TZ=UTC

# Открытие порта
EXPOSE 8080

# Запуск приложения
CMD ["./ticket-service"] 