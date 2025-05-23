package email

import (
	"fmt"
	"os"

	"gopkg.in/gomail.v2"

	"ticket-service/internal/logger"
)

type EmailService struct {
	from     string
	password string
	smtpHost string
	smtpPort string
}

func NewEmailService() *EmailService {
	return &EmailService{
		from:     os.Getenv("SMTP_FROM"),
		password: os.Getenv("SMTP_PASSWORD"),
		smtpHost: os.Getenv("SMTP_HOST"),
		smtpPort: os.Getenv("SMTP_PORT"),
	}
}

func (s *EmailService) SendTicketResponseNotification(to, ticketSubject, responseMessage string) error {
	m := gomail.NewMessage()
	m.SetHeader("From", s.from)
	m.SetHeader("To", to)
	m.SetHeader("Subject", fmt.Sprintf("Новый ответ на тикет: %s", ticketSubject))
	
	// HTML версия письма
	htmlBody := fmt.Sprintf(`
		<html>
		<body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
			<div style="max-width: 600px; margin: 0 auto; padding: 20px;">
				<h2 style="color: #2c3e50;">Новый ответ на ваш тикет</h2>
				<p>Здравствуйте!</p>
				<p>Вы получили новый ответ на ваш тикет <strong>"%s"</strong>:</p>
				<div style="background: #f8f9fa; padding: 15px; border-left: 4px solid #2c3e50; margin: 20px 0;">
					%s
				</div>
				<p>С уважением,<br>Служба поддержки</p>
			</div>
		</body>
		</html>
	`, ticketSubject, responseMessage)
	
	// Текстовая версия письма
	textBody := fmt.Sprintf(`
		Здравствуйте!
		
		Вы получили новый ответ на ваш тикет "%s":
		
		%s
		
		С уважением,
		Служба поддержки
	`, ticketSubject, responseMessage)
	
	m.SetBody("text/plain", textBody)
	m.AddAlternative("text/html", htmlBody)

	d := gomail.NewDialer(s.smtpHost, 587, s.from, s.password)
	
	if err := d.DialAndSend(m); err != nil {
		logger.Error("Failed to send email", "error", err, "to", to)
		return fmt.Errorf("failed to send email: %w", err)
	}

	logger.Info("Email notification sent", "to", to, "subject", m.GetHeader("Subject")[0])
	return nil
} 