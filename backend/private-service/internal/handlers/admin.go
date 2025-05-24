package handlers

import (
	"context"
	"encoding/json"
	"errors"
	"net/http"

	"private-service/internal/logger"
	"private-service/internal/models"
	"private-service/internal/services"

	"github.com/google/uuid"
)

type AdminHandler struct {
	adminService *services.AdminService
}

// Request structs for Swagger documentation
type PromoteToAdminRequest struct {
	UserID string `json:"userId"`
}

type DemoteToUserRequest struct {
	AdminID string `json:"adminId"`
}

type DeleteUserRequest struct {
	UserID string `json:"userId"`
}

func NewAdminHandler(adminService *services.AdminService) *AdminHandler {
	return &AdminHandler{
		adminService: adminService,
	}
}

// PromoteToAdmin godoc
// @Summary Promote user to admin role
// @Description Promotes a regular user to admin role (requires admin or root_admin privileges)
// @Tags admin
// @Accept json
// @Produce json
// @Param Authorization header string true "Bearer token"
// @Param input body PromoteToAdminRequest true "User ID to promote"
// @Success 200 {object} ResponseMessage "User promoted to admin successfully"
// @Failure 400 {object} ResponseMessage "Invalid user ID format"
// @Failure 401 {object} ResponseMessage "Unauthorized - requires admin privileges"
// @Failure 403 {object} ResponseMessage "Forbidden - insufficient permissions"
// @Failure 500 {object} ResponseMessage "Internal server error"
// @Router /admin/promote [post]
func (h *AdminHandler) PromoteToAdmin(w http.ResponseWriter, r *http.Request) {
	adminID, err := getAdminIDFromContext(r.Context())
	if err != nil {
		http.Error(w, "Unauthorized", http.StatusUnauthorized)
		return
	}

	var req PromoteToAdminRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		http.Error(w, "Invalid request body", http.StatusBadRequest)
		return
	}

	userID, err := uuid.Parse(req.UserID)
	if err != nil {
		http.Error(w, "Invalid user ID", http.StatusBadRequest)
		return
	}

	if err := h.adminService.PromoteToAdmin(r.Context(), adminID, userID); err != nil {
		logger.Error("Error promoting user to admin: ", err)
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusOK)
	json.NewEncoder(w).Encode(ResponseMessage{
		Message: "User promoted to admin successfully",
	})
}

// DemoteToUser godoc
// @Summary Demote admin to user role
// @Description Demotes an admin to regular user role (requires root_admin privileges)
// @Tags admin
// @Accept json
// @Produce json
// @Param Authorization header string true "Bearer token"
// @Param input body DemoteToUserRequest true "Admin ID to demote"
// @Success 200 {object} ResponseMessage "Admin demoted to user successfully"
// @Failure 400 {object} ResponseMessage "Invalid admin ID format"
// @Failure 401 {object} ResponseMessage "Unauthorized - requires root_admin privileges"
// @Failure 403 {object} ResponseMessage "Forbidden - cannot demote root_admin"
// @Failure 500 {object} ResponseMessage "Internal server error"
// @Router /admin/demote [post]
func (h *AdminHandler) DemoteToUser(w http.ResponseWriter, r *http.Request) {
	rootAdminID, err := getAdminIDFromContext(r.Context())
	if err != nil {
		http.Error(w, "Unauthorized", http.StatusUnauthorized)
		return
	}

	var req DemoteToUserRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		http.Error(w, "Invalid request body", http.StatusBadRequest)
		return
	}

	adminID, err := uuid.Parse(req.AdminID)
	if err != nil {
		http.Error(w, "Invalid admin ID", http.StatusBadRequest)
		return
	}

	if err := h.adminService.DemoteToUser(r.Context(), rootAdminID, adminID); err != nil {
		logger.Error("Error demoting admin to user: ", err)
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusOK)
	json.NewEncoder(w).Encode(ResponseMessage{
		Message: "Admin demoted to user successfully",
	})
}

// DeleteUser godoc
// @Summary Delete user or admin
// @Description Deletes a user or admin account (admin can delete users, root_admin can delete both users and admins)
// @Tags admin
// @Accept json
// @Produce json
// @Param Authorization header string true "Bearer token"
// @Param input body DeleteUserRequest true "User ID to delete"
// @Success 200 {object} ResponseMessage "User deleted successfully"
// @Failure 400 {object} ResponseMessage "Invalid user ID format"
// @Failure 401 {object} ResponseMessage "Unauthorized - requires admin privileges"
// @Failure 403 {object} ResponseMessage "Forbidden - insufficient permissions or cannot delete root_admin"
// @Failure 500 {object} ResponseMessage "Internal server error"
// @Router /admin/users/delete [post]
func (h *AdminHandler) DeleteUser(w http.ResponseWriter, r *http.Request) {
	adminID, err := getAdminIDFromContext(r.Context())
	if err != nil {
		http.Error(w, "Unauthorized", http.StatusUnauthorized)
		return
	}

	var req DeleteUserRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		http.Error(w, "Invalid request body", http.StatusBadRequest)
		return
	}

	userID, err := uuid.Parse(req.UserID)
	if err != nil {
		http.Error(w, "Invalid user ID", http.StatusBadRequest)
		return
	}

	if err := h.adminService.DeleteUser(r.Context(), adminID, userID); err != nil {
		logger.Error("Error deleting user: ", err)
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusOK)
	json.NewEncoder(w).Encode(ResponseMessage{
		Message: "User deleted successfully",
	})
}

// ListUsers godoc
// @Summary List all users
// @Description Returns a list of all users in the system (requires admin or root_admin privileges)
// @Tags admin
// @Produce json
// @Param Authorization header string true "Bearer token"
// @Success 200 {array} models.User "List of users"
// @Failure 401 {object} ResponseMessage "Unauthorized - requires admin privileges"
// @Failure 403 {object} ResponseMessage "Forbidden - insufficient permissions"
// @Failure 500 {object} ResponseMessage "Internal server error"
// @Router /admin/users [get]
func (h *AdminHandler) ListUsers(w http.ResponseWriter, r *http.Request) {
	adminID, err := getAdminIDFromContext(r.Context())
	if err != nil {
		http.Error(w, "Unauthorized", http.StatusUnauthorized)
		return
	}

	users, err := h.adminService.ListUsers(r.Context(), adminID)
	if err != nil {
		logger.Error("Error listing users: ", err)
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(users)
}

// GetMetrics godoc
// @Summary Get system metrics
// @Description Returns system metrics and statistics (requires admin or root_admin privileges)
// @Tags admin
// @Produce json
// @Param Authorization header string true "Bearer token"
// @Success 200 {object} interface{} "System metrics"
// @Failure 401 {object} ResponseMessage "Unauthorized - requires admin privileges"
// @Failure 403 {object} ResponseMessage "Forbidden - insufficient permissions"
// @Failure 500 {object} ResponseMessage "Internal server error"
// @Router /admin/metrics [get]
func (h *AdminHandler) GetMetrics(w http.ResponseWriter, r *http.Request) {
	adminID, err := getAdminIDFromContext(r.Context())
	if err != nil {
		http.Error(w, "Unauthorized", http.StatusUnauthorized)
		return
	}

	metrics, err := h.adminService.GetMetrics(r.Context(), adminID)
	if err != nil {
		logger.Error("Error getting metrics: ", err)
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(metrics)
}

func getAdminIDFromContext(ctx context.Context) (uuid.UUID, error) {
	claims, ok := ctx.Value(ContextKeyClaims).(*models.CustomClaims)
	if !ok {
		return uuid.Nil, errors.New("unauthorized")
	}

	adminID, err := uuid.Parse(claims.UserID)
	if err != nil {
		return uuid.Nil, err
	}

	return adminID, nil
}
