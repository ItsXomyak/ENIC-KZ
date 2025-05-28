# Этап сборки
FROM golang:1.23-alpine AS builder

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
RUN CGO_ENABLED=0 GOOS=linux go build -o main ./cmd/api

# Установка migrate
RUN go install -tags 'postgres' github.com/golang-migrate/migrate/v4/cmd/migrate@latest

# Финальный этап
FROM alpine:latest

# Установка необходимых пакетов
RUN apk add --no-cache ca-certificates tzdata

# Установка рабочей директории
WORKDIR /app

# Копирование бинарных файлов из builder
COPY --from=builder /app/main .
COPY --from=builder /go/bin/migrate /usr/local/bin/migrate
COPY --from=builder /app/migrations ./migrations

# Установка переменных окружения
ENV TZ=UTC

# Открытие порта
EXPOSE 8080

# Запуск приложения
CMD ["./main"] 