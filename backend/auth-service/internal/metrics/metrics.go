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
)

func InitMetrics() {
	prometheus.MustRegister(RegistrationCounter)
	prometheus.MustRegister(LoginCounter)
	prometheus.MustRegister(PasswordResetRequestCounter)
	prometheus.MustRegister(PasswordResetCompletedCounter)
	prometheus.MustRegister(AccountConfirmationCounter)
	prometheus.MustRegister(TwoFactorVerificationCounter)
}
