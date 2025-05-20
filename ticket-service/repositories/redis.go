package repositories

import (
	"context"
	"encoding/json"
	"fmt"
	"time"

	"github.com/redis/go-redis/v9"

	"ticket-service/config"
	"ticket-service/logger"
	"ticket-service/models"
)

type RedisRepository struct {
	client *redis.Client
}

func NewRedisRepository(client *redis.Client) *RedisRepository {
	return &RedisRepository{client: client}
}

func NewRedisClient(cfg *config.Config) (*redis.Client, error) {
	client := redis.NewClient(&redis.Options{
		Addr:     cfg.RedisAddr,
		Password: cfg.RedisPassword,
	})
	_, err := client.Ping(context.Background()).Result()
	if err != nil {
		return nil, err
	}
	logger.Info("Connected to Redis")
	return client, nil
}

// Client возвращает указатель на redis.Client
func (r *RedisRepository) Client() *redis.Client {
	return r.client
}

func (r *RedisRepository) CacheTickets(userID string, tickets []models.Ticket, page, limit int, ttl time.Duration) error {
	key := fmt.Sprintf("tickets:user:%s:page:%d:limit:%d", userID, page, limit)
	data, err := json.Marshal(tickets)
	if err != nil {
		return err
	}
	return r.client.Set(context.Background(), key, data, ttl).Err()
}

func (r *RedisRepository) GetCachedTickets(userID string, page, limit int) ([]models.Ticket, error) {
	key := fmt.Sprintf("tickets:user:%s:page:%d:limit:%d", userID, page, limit)
	data, err := r.client.Get(context.Background(), key).Bytes()
	if err != nil {
		return nil, err
	}
	var tickets []models.Ticket
	err = json.Unmarshal(data, &tickets)
	return tickets, err
}

func (r *RedisRepository) InvalidateTicketsCache(ctx context.Context, userID string) error {
	pattern := fmt.Sprintf("tickets:user:%s:page:*", userID)
	var cursor uint64
	for {
		keys, nextCursor, err := r.client.Scan(ctx, cursor, pattern, 100).Result()
		if err != nil {
			return err
		}
		if len(keys) > 0 {
			if err := r.client.Del(ctx, keys...).Err(); err != nil {
				return err
			}
		}
		cursor = nextCursor
		if cursor == 0 {
			break
		}
	}
	return nil
}

func (r *RedisRepository) CacheTicketStatus(ticketID string, status models.TicketStatus, ttl time.Duration) error {
	key := "ticket:status:" + ticketID
	return r.client.Set(context.Background(), key, status, ttl).Err()
}

func (r *RedisRepository) GetCachedTicketStatus(ticketID string) (models.TicketStatus, error) {
	key := "ticket:status:" + ticketID
	status, err := r.client.Get(context.Background(), key).Result()
	return models.TicketStatus(status), err
}