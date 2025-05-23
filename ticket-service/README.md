# Ticket Service

Сервис для управления тикетами поддержки.

## Запуск проекта

### Требования

- Docker
- Docker Compose
- curl
- jq (для тестирования)

### Шаги запуска

1. Запуск сервисов:

```bash
docker-compose up -d
```

2. Ожидание инициализации сервисов (около 30 секунд):

```bash
sleep 30
```

3. Проверка статуса сервисов:

```bash
docker-compose ps
```

## Тестирование сценария

1. Получение токенов:

   - Для пользователя: выполните вход через auth-service
   - Для администратора: используйте предустановленный токен

2. Запуск тестового сценария:

```bash
chmod +x scripts/test_scenario.sh
./scripts/test_scenario.sh
```

### Описание сценария

1. Создание тикета пользователем
2. Проверка статуса тикета
3. Ответ администратора
4. Изменение статуса тикета
5. Проверка финального статуса

## Мониторинг

- Prometheus метрики: http://localhost:8080/metrics
- MinIO консоль: http://localhost:9001
- PostgreSQL: localhost:5432
- Redis: localhost:6379
- ClamAV: localhost:3310

## Остановка проекта

```bash
docker-compose down
```

Для полной очистки данных:

```bash
docker-compose down -v
```
