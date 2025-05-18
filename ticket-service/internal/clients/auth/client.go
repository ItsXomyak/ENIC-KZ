package auth

import (
	"context"
	"encoding/json"
	"errors"
	"net/http"
)

type Client struct {
    baseURL string
    client  *http.Client
}

func NewClient(baseURL string) *Client {
    return &Client{baseURL, &http.Client{}}
}

func (c *Client) ValidateToken(ctx context.Context, token string) (string, string, error) {
    req, err := http.NewRequestWithContext(ctx, "GET", c.baseURL+"/auth/validate", nil)
    if err != nil {
        return "", "", err
    }
    req.Header.Set("Authorization", token)

    resp, err := c.client.Do(req)
    if err != nil {
        return "", "", err
    }
    defer resp.Body.Close()

    if resp.StatusCode != http.StatusOK {
        return "", "", errors.New("invalid token")
    }

    var result struct {
        UserID string `json:"user_id"`
        Role   string `json:"role"`
    }
    if err := json.NewDecoder(resp.Body).Decode(&result); err != nil {
        return "", "", err
    }

    return result.UserID, result.Role, nil
}