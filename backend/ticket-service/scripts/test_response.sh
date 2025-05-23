#!/bin/bash

# Цвета для вывода
GREEN='\033[0;32m'
RED='\033[0;31m'
NC='\033[0m'

# Проверяем, передан ли ID тикета
if [ -z "$1" ]; then
    echo -e "${RED}Ошибка: Не указан ID тикета${NC}"
    echo "Использование: $0 <ticket_id>"
    exit 1
fi

TICKET_ID=$1

echo -e "${GREEN}Тестирование ответа администратора${NC}"

# Отправляем ответ администратора
echo "Отправляем ответ администратора..."
RESPONSE=$(curl -s -X POST http://localhost:8080/api/v1/responses/ticket/$TICKET_ID \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_ADMIN_TOKEN" \
  -d '{
    "message": "Это тестовый ответ администратора",
    "isInternal": false
  }')

# Проверяем ответ
if [ $? -eq 0 ]; then
    echo -e "${GREEN}Ответ успешно отправлен${NC}"
    echo "Ответ сервера:"
    echo $RESPONSE | jq '.'
    
    # Проверяем все ответы на тикет
    echo -e "\n${GREEN}Проверяем все ответы на тикет${NC}"
    curl -s -X GET http://localhost:8080/api/v1/responses/ticket/$TICKET_ID \
      -H "Authorization: Bearer YOUR_ADMIN_TOKEN" | jq '.'
else
    echo -e "${RED}Ошибка при отправке ответа${NC}"
    echo $RESPONSE
fi 