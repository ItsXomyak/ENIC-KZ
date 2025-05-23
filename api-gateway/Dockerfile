# First stage: Build the application
FROM golang:1.24-alpine AS builder

WORKDIR /app

# Copy go.mod and go.sum files
COPY go.mod go.sum ./

# Download dependencies
RUN go mod download

# Copy the source code
COPY . .

# Build the application
RUN CGO_ENABLED=0 GOOS=linux GOARCH=amd64 \
    go build -ldflags="-s -w" -o api-gateway .

# Second stage: Create the final image
FROM alpine:latest

# Add CA certificates for HTTPS
RUN apk --no-cache add ca-certificates

WORKDIR /root/

# Copy the binary from builder
COPY --from=builder /app/api-gateway .

# Copy .env file if it exists
COPY --from=builder /app/.env* ./

# Expose the port
EXPOSE 8000

# Run the application
ENTRYPOINT ["./api-gateway"] 