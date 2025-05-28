package services

import (
	"crypto/rand"
	"encoding/base64"
	"math/big"
	"private-service/internal/logger"
)

func generateRandomToken(n int) (string, error) {
	b := make([]byte, n)
	if _, err := rand.Read(b); err != nil {
		logger.Error("Error generating random bytes: ", err)
		return "", err
	}
	return base64.URLEncoding.EncodeToString(b), nil
}

func generate2FACode() string {
	const length = 6
	const digits = "0123456789"

	code := make([]byte, length)
	for i := 0; i < length; i++ {
		n, err := rand.Int(rand.Reader, big.NewInt(int64(len(digits))))
		if err != nil {
			code[i] = digits[0]
			continue
		}
		code[i] = digits[n.Int64()]
	}
	return string(code)
}
