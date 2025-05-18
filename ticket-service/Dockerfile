FROM golang:1.23-alpine AS builder

WORKDIR /app

# Установка необходимых пакетов
RUN apk add --no-cache gcc musl-dev

# Копирование файлов зависимостей
COPY go.mod go.sum ./
RUN go mod download

# Копирование исходного кода
COPY . .

# Сборка приложения
RUN CGO_ENABLED=0 GOOS=linux go build -o ticket-service ./cmd

# Финальный образ
FROM alpine:latest

WORKDIR /app

# Копирование бинарного файла из builder
COPY --from=builder /app/ticket-service .

# Установка необходимых пакетов
RUN apk --no-cache add ca-certificates

# Запуск приложения
CMD ["./ticket-service"]
