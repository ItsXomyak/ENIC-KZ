#!/bin/bash

# Цвета для вывода
RED='\033[0;31m'
GREEN='\033[0;32m'
NC='\033[0m'

# Базовый URL API
API_URL="http://localhost:8080/api/v1"

# Получаем токен авторизации
echo "Получение токена авторизации..."
TOKEN=$(curl -s -X POST "${API_URL}/auth/login" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123"
  }' | grep -o '"token":"[^"]*' | cut -d'"' -f4)

if [ -z "$TOKEN" ]; then
    echo -e "${RED}Ошибка получения токена${NC}"
    exit 1
fi

echo -e "${GREEN}Токен получен успешно${NC}"

# Тест 1: Создание тикета без full_name
echo -e "\nТест 1: Создание тикета без full_name"
response=$(curl -s -X POST "${API_URL}/tickets" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer ${TOKEN}" \
  -d '{
    "subject": "Тестовый тикет",
    "question": "Это тестовый тикет",
    "phone": "+77771234567"
  }')
echo "Ответ сервера:"
echo $response

# Тест 2: Создание тикета с корректными данными
echo -e "\nТест 2: Создание тикета с корректными данными"
response=$(curl -s -X POST "${API_URL}/tickets" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer ${TOKEN}" \
  -d '{
    "subject": "Тестовый тикет авторизованного пользователя",
    "question": "Это тестовый тикет от авторизованного пользователя",
    "full_name": "Иван Иванов",
    "phone": "+77771234567"
  }')
echo "Ответ сервера:"
echo $response

# Сохраняем ID созданного тикета
ticket_id=$(echo $response | grep -o '"id":[0-9]*' | cut -d':' -f2)

if [ ! -z "$ticket_id" ]; then
    echo -e "\nПроверяем статус созданного тикета"
    response=$(curl -s -X GET "${API_URL}/tickets/${ticket_id}" \
      -H "Authorization: Bearer ${TOKEN}")
    echo "Ответ сервера:"
    echo $response

    # Проверяем, что notify_email установлен в true
    notify_email=$(echo $response | grep -o '"notify_email":true')
    if [ ! -z "$notify_email" ]; then
        echo -e "${GREEN}Уведомления по email включены (как и требовалось)${NC}"
    else
        echo -e "${RED}Ошибка: уведомления по email не включены${NC}"
    fi
fi 