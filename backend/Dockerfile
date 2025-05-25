# Базовый образ
FROM ubuntu:22.04

# Установка Node.js и ClamAV
RUN apt-get update && apt-get install -y \
    curl \
    clamav \
    clamav-daemon \
    && curl -fsSL https://deb.nodesource.com/setup_18.x | bash - \
    && apt-get install -y nodejs \
    && apt-get clean \
    && rm -rf /var/lib/apt/lists/*

# Обновление базы данных ClamAV
RUN freshclam

# Создание рабочей директории
WORKDIR /app

# Копирование файлов package.json и package-lock.json
COPY package*.json ./

# Установка зависимостей
RUN npm install

# Копирование исходного кода
COPY . .

# Генерация Prisma Client
RUN npx prisma generate

# Сборка TypeScript
RUN npm run build

# Запуск ClamAV и приложения
CMD service clamav-daemon start && npm start 