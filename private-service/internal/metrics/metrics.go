package metrics

import (
	"github.com/prometheus/client_golang/prometheus"
)

var (
	RegistrationCounter = prometheus.NewCounter(
		prometheus.CounterOpts{
			Name: "auth_service_registrations_total",
			Help: "Total number of user registrations",
		},
	)

	LoginCounter = prometheus.NewCounter(
		prometheus.CounterOpts{
			Name: "auth_service_logins_total",
			Help: "Total number of successful user logins",
		},
	)

	PasswordResetRequestCounter = prometheus.NewCounter(
		prometheus.CounterOpts{
			Name: "auth_service_password_reset_requests_total",
			Help: "Total number of password reset requests",
		},
	)

	PasswordResetCompletedCounter = prometheus.NewCounter(
		prometheus.CounterOpts{
			Name: "auth_service_password_resets_completed_total",
			Help: "Total number of completed password resets",
		},
	)

	AccountConfirmationCounter = prometheus.NewCounter(
		prometheus.CounterOpts{
			Name: "auth_service_account_confirmations_total",
			Help: "Total number of successful account confirmations",
		},
	)

	TwoFactorVerificationCounter = prometheus.NewCounter(
		prometheus.CounterOpts{
			Name: "auth_service_2fa_verifications_total",
			Help: "Total number of successful 2FA verifications",
		},
	)

	AdminPromotionsCounter = prometheus.NewCounter(
		prometheus.CounterOpts{
			Name: "admin_service_promotions_total",
			Help: "Total number of users promoted to admin role",
		},
	)

	AdminDemotionsCounter = prometheus.NewCounter(
		prometheus.CounterOpts{
			Name: "admin_service_demotions_total",
			Help: "Total number of admins demoted to user role",
		},
	)

	UserDeletionsCounter = prometheus.NewCounter(
		prometheus.CounterOpts{
			Name: "admin_service_user_deletions_total",
			Help: "Total number of users deleted by admins",
		},
	)

	AdminListUsersCounter = prometheus.NewCounter(
		prometheus.CounterOpts{
			Name: "admin_service_list_users_total",
			Help: "Total number of list users requests",
		},
	)

	AdminMetricsRequestsCounter = prometheus.NewCounter(
		prometheus.CounterOpts{
			Name: "admin_service_metrics_requests_total",
			Help: "Total number of metrics requests by admins",
		},
	)
)

func InitMetrics() {
	prometheus.MustRegister(RegistrationCounter)
	prometheus.MustRegister(LoginCounter)
	prometheus.MustRegister(PasswordResetRequestCounter)
	prometheus.MustRegister(PasswordResetCompletedCounter)
	prometheus.MustRegister(AccountConfirmationCounter)
	prometheus.MustRegister(TwoFactorVerificationCounter)
	prometheus.MustRegister(AdminPromotionsCounter)
	prometheus.MustRegister(AdminDemotionsCounter)
	prometheus.MustRegister(UserDeletionsCounter)
	prometheus.MustRegister(AdminListUsersCounter)
	prometheus.MustRegister(AdminMetricsRequestsCounter)
}
