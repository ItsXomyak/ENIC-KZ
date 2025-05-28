package handlers

import (
	"encoding/json"
	"net/http"

	"private-service/internal/logger"
	"private-service/internal/metrics"
	"private-service/internal/services"
)

type ConfirmHandler struct {
	AuthService services.AuthService
}

func NewConfirmHandler(authService services.AuthService) *ConfirmHandler {
	return &ConfirmHandler{
		AuthService: authService,
	}
}

// ConfirmAccount godoc
// @Summary Confirm user account
// @Description Activates a user account using the confirmation token from email
// @Tags auth
// @Produce json
// @Param token query string true "Confirmation token from email"
// @Success 200 {object} ResponseMessage "Account activation success message"
// @Failure 400 {object} ResponseMessage "Invalid token, expired token, or already confirmed account"
// @Router /auth/confirm [get]
func (h *ConfirmHandler) ConfirmAccount(w http.ResponseWriter, r *http.Request) {
	logger.Info("Confirm account request received")
	token := r.URL.Query().Get("token")
	if token == "" {
		logger.Error("Token is missing in confirmation request")
		http.Error(w, "token is required", http.StatusBadRequest)
		return
	}

	err := h.AuthService.ConfirmAccount(token)
	if err != nil {
		logger.Error("Account confirmation failed: ", err)
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}

	metrics.AccountConfirmationCounter.Inc()
	logger.Info("Account confirmed successfully")
	response := map[string]string{"message": "Account activated successfully."}
	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(response)
}
