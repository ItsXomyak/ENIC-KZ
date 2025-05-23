
# API Gateway

This API Gateway serves as a unified entry point for the ENIC-KZ microservices architecture, managing authentication and routing requests to the appropriate services.

## Services

The API Gateway integrates with the following microservices:

1. **Auth Service** (Port 8080)
   - User registration and authentication
   - Password reset functionality
   - Two-factor authentication for admins

2. **News Service** (Port 8081)
   - Public news access
   - News management (admin only)
   - Multi-language support

3. **Ticket Service** (Port 8082)
   - Support ticket creation and management
   - Ticket responses and file attachments
   - Admin-specific functionalities

## Features

- Centralized authentication and authorization
- Request routing and load balancing
- Response caching and rate limiting
- Request/response transformation
- Error handling and logging

## Configuration

Create a `.env` file based on `.env.example`:

```env
# API Gateway Configuration
PORT=8000

# Auth Service Configuration
AUTH_SERVICE_HOST=localhost
AUTH_SERVICE_PORT=8080

# News Service Configuration
NEWS_SERVICE_HOST=localhost
NEWS_SERVICE_PORT=8081

# Ticket Service Configuration
TICKET_SERVICE_HOST=localhost
TICKET_SERVICE_PORT=8082
```

## Running the Service

### Using Docker

1. Build the image:
   ```bash
   docker build -t api-gateway .
   ```

2. Run the container:
   ```bash
   docker run -p 8000:8000 --env-file .env api-gateway
   ```

### Local Development

1. Install dependencies:
   ```bash
   go mod download
   ```

2. Run the service:
   ```bash
   go run main.go
   ```

## API Documentation

The API Gateway exposes the following endpoints:

### Auth Service Endpoints

- `POST /api/v1/auth/register` - Register a new user
- `POST /api/v1/auth/login` - User login
- `GET /api/v1/auth/confirm` - Confirm user account
- `POST /api/v1/auth/password-reset-request` - Request password reset
- `POST /api/v1/auth/password-reset-confirm` - Confirm password reset
- `POST /api/v1/auth/verify-2fa` - Verify 2FA code
- `GET /api/v1/auth/validate` - Validate authentication token

### News Service Endpoints

Public endpoints:
- `GET /api/v1/news` - Get all news
- `GET /api/v1/news/:id` - Get news by ID

Admin endpoints:
- `POST /api/v1/news` - Create news
- `PUT /api/v1/news/:id` - Update news
- `DELETE /api/v1/news/:id` - Delete news

### Ticket Service Endpoints

Public endpoints:
- `POST /api/v1/tickets` - Create ticket
- `GET /api/v1/tickets/:id` - Get ticket by ID

Authenticated user endpoints:
- `GET /api/v1/tickets/user` - Get user's tickets
- `GET /api/v1/tickets/user/:id/history` - Get ticket history

Admin endpoints:
- `GET /api/v1/tickets` - Get all tickets
- `PUT /api/v1/tickets/:id/status` - Update ticket status
- `GET /api/v1/tickets/search` - Search tickets
- `POST /api/v1/responses/ticket/:id` - Add response to ticket
- `GET /api/v1/responses/ticket/:id` - Get ticket responses 