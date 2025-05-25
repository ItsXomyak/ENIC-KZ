package mailer

import (
	"fmt"

	"gopkg.in/mail.v2"

	"private-service/config"
	"private-service/internal/logger"
)

type Mailer interface {
	SendConfirmationEmail(to, token string) error
	SendPasswordResetEmail(to, token string) error
	Send2FACodeEmail(to, code string) error
}

type goMailer struct {
	cfg *config.Config
}

func NewSMTPMailer(cfg *config.Config) Mailer {
	return &goMailer{cfg: cfg}
}

func (m *goMailer) SendConfirmationEmail(to, token string) error {
	subject := "Account Confirmation"
	confirmationURL := fmt.Sprintf("http://localhost:8080/api/v1/auth/confirm?token=%s", token)
	body := fmt.Sprintf("Please confirm your account by clicking the link:\n%s", confirmationURL)
	logger.Info("Sending confirmation email to ", to)
	err := m.sendMail(to, subject, body)
	if err != nil {
		logger.Error("Error sending confirmation email to ", to, ": ", err)
	} else {
		logger.Info("Confirmation email sent to ", to)
	}
	return err
}

func (m *goMailer) SendPasswordResetEmail(to, token string) error {
	subject := "Password Reset"
	resetInstructions := fmt.Sprintf(
		"To reset your password, send a POST request to endpoint http://localhost:8080/api/v1/auth/password-reset-confirm with the following JSON body:\n{\n\t\"token\": \"%s\",\n\t\"newPassword\": \"<your new password>\"\n}",
		token,
	)
	logger.Info("Sending password reset email to ", to)
	err := m.sendMail(to, subject, resetInstructions)
	if err != nil {
		logger.Error("Error sending password reset email to ", to, ": ", err)
	} else {
		logger.Info("Password reset email sent to ", to)
	}
	return err
}

func (m *goMailer) Send2FACodeEmail(to, code string) error {
	subject := "Your 2FA Code"
	body := fmt.Sprintf("Your 2FA code is: %s\nThis code expires in 10 minutes.", code)
	logger.Info("Sending 2FA code email to ", to)
	err := m.sendMail(to, subject, body)
	if err != nil {
		logger.Error("Error sending 2FA code email to ", to, ": ", err)
	} else {
		logger.Info("2FA code email sent to ", to)
	}
	return err
}

func (m *goMailer) sendMail(to, subject, body string) error {
	msg := mail.NewMessage()
	msg.SetHeader("From", m.cfg.SMTPUsername)
	msg.SetHeader("To", to)
	msg.SetHeader("Subject", subject)
	msg.SetBody("text/plain", body)

	d := mail.NewDialer(m.cfg.SMTPHost, m.cfg.SMTPPort, m.cfg.SMTPUsername, m.cfg.SMTPPassword)
	d.SSL = false // Enable SSL/TLS
	d.StartTLSPolicy = mail.MandatoryStartTLS

	if err := d.DialAndSend(msg); err != nil {
		logger.Error("Failed to send email: ", err)
		return err
	}

	return nil
}
