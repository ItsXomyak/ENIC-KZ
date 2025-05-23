#!/bin/bash

# Цвета для вывода
RED='\033[0;31m'
GREEN='\033[0;32m'
NC='\033[0m'

# Базовый URL API
API_URL="http://localhost:8080/api/v1"

# Получаем токен авторизации админа
echo "Получение токена авторизации админа..."
TOKEN=$(curl -s -X POST "${API_URL}/auth/login" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@example.com",
    "password": "admin123"
  }' | grep -o '"token":"[^"]*' | cut -d'"' -f4)

if [ -z "$TOKEN" ]; then
    echo -e "${RED}Ошибка получения токена${NC}"
    exit 1
fi

echo -e "${GREEN}Токен получен успешно${NC}"

# Тест 1: Получение списка всех тикетов
echo -e "\nТест 1: Получение списка всех тикетов"
response=$(curl -s -X GET "${API_URL}/tickets" \
  -H "Authorization: Bearer ${TOKEN}")
echo "Ответ сервера:"
echo $response

# Сохраняем ID первого тикета для дальнейших тестов
ticket_id=$(echo $response | grep -o '"id":[0-9]*' | head -n 1 | cut -d':' -f2)

if [ ! -z "$ticket_id" ]; then
    # Тест 2: Просмотр конкретного тикета
    echo -e "\nТест 2: Просмотр тикета #${ticket_id}"
    response=$(curl -s -X GET "${API_URL}/tickets/${ticket_id}" \
      -H "Authorization: Bearer ${TOKEN}")
    echo "Ответ сервера:"
    echo $response

    # Тест 3: Просмотр истории тикета
    echo -e "\nТест 3: Просмотр истории тикета #${ticket_id}"
    response=$(curl -s -X GET "${API_URL}/tickets/${ticket_id}/history" \
      -H "Authorization: Bearer ${TOKEN}")
    echo "Ответ сервера:"
    echo $response

    # Тест 4: Изменение статуса тикета
    echo -e "\nТест 4: Изменение статуса тикета #${ticket_id}"
    response=$(curl -s -X PUT "${API_URL}/tickets/${ticket_id}/status" \
      -H "Content-Type: application/json" \
      -H "Authorization: Bearer ${TOKEN}" \
      -d '{
        "status": "in_progress",
        "comment": "Тикет взят в работу"
      }')
    echo "Ответ сервера:"
    echo $response

    # Тест 5: Ответ на тикет
    echo -e "\nТест 5: Ответ на тикет #${ticket_id}"
    response=$(curl -s -X POST "${API_URL}/responses/ticket/${ticket_id}" \
      -H "Authorization: Bearer ${TOKEN}" \
      -F "message=Это тестовый ответ администратора")
    echo "Ответ сервера:"
    echo $response

    # Тест 6: Просмотр ответов на тикет
    echo -e "\nТест 6: Просмотр ответов на тикет #${ticket_id}"
    response=$(curl -s -X GET "${API_URL}/responses/ticket/${ticket_id}" \
      -H "Authorization: Bearer ${TOKEN}")
    echo "Ответ сервера:"
    echo $response
fi

# Тест 7: Поиск тикетов
echo -e "\nТест 7: Поиск тикетов"
response=$(curl -s -X GET "${API_URL}/tickets/search?query=тест" \
  -H "Authorization: Bearer ${TOKEN}")
echo "Ответ сервера:"
echo $response 