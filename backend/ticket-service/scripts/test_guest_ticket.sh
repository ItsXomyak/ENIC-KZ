#!/bin/bash

# Цвета для вывода
RED='\033[0;31m'
GREEN='\033[0;32m'
NC='\033[0m'

# Базовый URL API
API_URL="http://localhost:8080/api/v1"

echo "Тестирование создания тикета неавторизованным пользователем"

# Тест 1: Создание тикета без email
echo -e "\nТест 1: Создание тикета без email"
response=$(curl -s -X POST "${API_URL}/tickets" \
  -H "Content-Type: application/json" \
  -d '{
    "subject": "Тестовый тикет",
    "question": "Это тестовый тикет",
    "full_name": "Иван Иванов",
    "phone": "+77771234567"
  }')
echo "Ответ сервера:"
echo $response

# Тест 2: Создание тикета с некорректным email
echo -e "\nТест 2: Создание тикета с некорректным email"
response=$(curl -s -X POST "${API_URL}/tickets" \
  -H "Content-Type: application/json" \
  -d '{
    "subject": "Тестовый тикет",
    "question": "Это тестовый тикет",
    "full_name": "Иван Иванов",
    "email": "invalid-email",
    "phone": "+77771234567"
  }')
echo "Ответ сервера:"
echo $response

# Тест 3: Создание тикета без full_name
echo -e "\nТест 3: Создание тикета без full_name"
response=$(curl -s -X POST "${API_URL}/tickets" \
  -H "Content-Type: application/json" \
  -d '{
    "subject": "Тестовый тикет",
    "question": "Это тестовый тикет",
    "email": "guest@example.com",
    "phone": "+77771234567"
  }')
echo "Ответ сервера:"
echo $response

# Тест 4: Создание тикета с корректными данными
echo -e "\nТест 4: Создание тикета с корректными данными"
response=$(curl -s -X POST "${API_URL}/tickets" \
  -H "Content-Type: application/json" \
  -d '{
    "subject": "Тестовый тикет гостя",
    "question": "Это тестовый тикет от неавторизованного пользователя",
    "full_name": "Иван Иванов",
    "email": "guest@example.com",
    "phone": "+77771234567",
    "notify_email": true
  }')
echo "Ответ сервера:"
echo $response

# Сохраняем ID созданного тикета
ticket_id=$(echo $response | grep -o '"id":[0-9]*' | cut -d':' -f2)

if [ ! -z "$ticket_id" ]; then
    echo -e "\nПроверяем статус созданного тикета"
    response=$(curl -s -X GET "${API_URL}/tickets/${ticket_id}")
    echo "Ответ сервера:"
    echo $response
fi 