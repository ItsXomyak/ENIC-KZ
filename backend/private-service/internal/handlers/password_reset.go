package handlers

import (
	"encoding/json"
	"net/http"

	"private-service/internal/logger"
	"private-service/internal/metrics"
	"private-service/internal/services"
)

type PasswordResetHandler struct {
	AuthService services.AuthService
}

func NewPasswordResetHandler(authService services.AuthService) *PasswordResetHandler {
	return &PasswordResetHandler{
		AuthService: authService,
	}
}

type RequestResetRequest struct {
	Email string `json:"email"`
}

type RequestResetResponse struct {
	Message string `json:"message"`
}

// RequestPasswordReset godoc
// @Summary Request password reset
// @Description Sends password reset instructions to the provided email address
// @Tags auth
// @Accept json
// @Produce json
// @Param input body RequestResetRequest true "Email address"
// @Success 200 {object} RequestResetResponse "Success message (sent regardless of email existence for security)"
// @Failure 400 {object} ResponseMessage "Invalid request format"
// @Router /auth/password-reset-request [post]
func (h *PasswordResetHandler) RequestPasswordReset(w http.ResponseWriter, r *http.Request) {
	logger.Info("Password reset request received")
	var req RequestResetRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		logger.Error("Invalid request payload: ", err)
		http.Error(w, "Invalid request payload", http.StatusBadRequest)
		return
	}

	if req.Email == "" {
		logger.Error("Email is required for password reset")
		http.Error(w, "Email is required", http.StatusBadRequest)
		return
	}

	err := h.AuthService.RequestPasswordReset(req.Email)
	if err != nil {
		logger.Error("Request password reset failed: ", err)
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}

	metrics.PasswordResetRequestCounter.Inc()
	logger.Info("Password reset instructions sent for email: ", req.Email)
	response := RequestResetResponse{
		Message: "If this email is registered, password reset instructions have been sent.",
	}
	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(response)
}

type ResetPasswordRequest struct {
	Token       string `json:"token"`
	NewPassword string `json:"newPassword"`
}

type ResetPasswordResponse struct {
	Message string `json:"message"`
}

// ResetPassword godoc
// @Summary Reset password
// @Description Sets a new password using the provided reset token
// @Tags auth
// @Accept json
// @Produce json
// @Param input body ResetPasswordRequest true "Reset token and new password"
// @Success 200 {object} ResetPasswordResponse "Password reset success message"
// @Failure 400 {object} ResponseMessage "Invalid token, expired token, or invalid password format"
// @Router /auth/password-reset-confirm [post]
func (h *PasswordResetHandler) ResetPassword(w http.ResponseWriter, r *http.Request) {
	logger.Info("Reset password request received")
	var req ResetPasswordRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		logger.Error("Invalid request payload: ", err)
		http.Error(w, "Invalid request payload", http.StatusBadRequest)
		return
	}

	if req.Token == "" || req.NewPassword == "" {
		logger.Error("Token and new password are required")
		http.Error(w, "Token and new password are required", http.StatusBadRequest)
		return
	}

	err := h.AuthService.ResetPassword(req.Token, req.NewPassword)
	if err != nil {
		logger.Error("Reset password failed: ", err)
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}

	metrics.PasswordResetCompletedCounter.Inc()
	logger.Info("Password reset successfully")
	response := ResetPasswordResponse{
		Message: "Password has been reset successfully.",
	}
	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(response)
}
