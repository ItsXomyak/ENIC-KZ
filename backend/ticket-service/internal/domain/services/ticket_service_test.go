package services

import (
	"bytes"
	"context"
	"errors"
	"io"
	"testing"
	"time"

	"github.com/stretchr/testify/assert"
	"github.com/stretchr/testify/mock"

	"ticket-service/internal/domain/models"
)

// Mock репозитории
type MockTicketRepository struct {
	mock.Mock
}

func (m *MockTicketRepository) Create(ctx context.Context, ticket *models.Ticket) (int64, error) {
	args := m.Called(ctx, ticket)
	return args.Get(0).(int64), args.Error(1)
}

func (m *MockTicketRepository) GetByID(ctx context.Context, id int64) (*models.Ticket, error) {
	args := m.Called(ctx, id)
	if args.Get(0) == nil {
		return nil, args.Error(1)
	}
	return args.Get(0).(*models.Ticket), args.Error(1)
}

func (m *MockTicketRepository) GetByUserID(ctx context.Context, userID int64, req models.GetTicketsRequest) ([]*models.Ticket, int64, error) {
	args := m.Called(ctx, userID, req)
	return args.Get(0).([]*models.Ticket), args.Get(1).(int64), args.Error(2)
}

func (m *MockTicketRepository) GetAll(ctx context.Context, req models.GetTicketsRequest) ([]*models.Ticket, int64, error) {
	args := m.Called(ctx, req)
	return args.Get(0).([]*models.Ticket), args.Get(1).(int64), args.Error(2)
}

func (m *MockTicketRepository) UpdateStatus(ctx context.Context, id int64, status models.TicketStatus, adminID int64, comment *string) error {
	args := m.Called(ctx, id, status, adminID, comment)
	return args.Error(0)
}

func (m *MockTicketRepository) UpdateFileURL(ctx context.Context, id int64, fileURL string) error {
	args := m.Called(ctx, id, fileURL)
	return args.Error(0)
}

func (m *MockTicketRepository) UpdateFileChecked(ctx context.Context, id int64, checked bool) error {
	args := m.Called(ctx, id, checked)
	return args.Error(0)
}

func (m *MockTicketRepository) Search(ctx context.Context, query string, req models.GetTicketsRequest) ([]*models.Ticket, int64, error) {
	args := m.Called(ctx, query, req)
	return args.Get(0).([]*models.Ticket), args.Get(1).(int64), args.Error(2)
}

type MockTicketHistoryRepository struct {
	mock.Mock
}

func (m *MockTicketHistoryRepository) Create(ctx context.Context, history *models.TicketHistory) (int64, error) {
	args := m.Called(ctx, history)
	return args.Get(0).(int64), args.Error(1)
}

func (m *MockTicketHistoryRepository) GetByTicketID(ctx context.Context, ticketID int64) ([]*models.TicketHistory, error) {
	args := m.Called(ctx, ticketID)
	return args.Get(0).([]*models.TicketHistory), args.Error(1)
}

func (m *MockTicketHistoryRepository) GetByTicketIDWithPagination(ctx context.Context, ticketID int64, page, pageSize int) ([]*models.TicketHistory, int, error) {
	args := m.Called(ctx, ticketID, page, pageSize)
	return args.Get(0).([]*models.TicketHistory), args.Get(1).(int), args.Error(2)
}

func (m *MockTicketHistoryRepository) GetLastByTicketID(ctx context.Context, ticketID int64) (*models.TicketHistory, error) {
	args := m.Called(ctx, ticketID)
	if args.Get(0) == nil {
		return nil, args.Error(1)
	}
	return args.Get(0).(*models.TicketHistory), args.Error(1)
}

type MockResponseRepository struct {
	mock.Mock
}

func (m *MockResponseRepository) Create(ctx context.Context, response *models.Response) (int64, error) {
	args := m.Called(ctx, response)
	return args.Get(0).(int64), args.Error(1)
}

func (m *MockResponseRepository) GetByTicketIDWithPagination(ctx context.Context, ticketID int64, page, pageSize int) ([]*models.Response, int, error) {
	args := m.Called(ctx, ticketID, page, pageSize)
	return args.Get(0).([]*models.Response), args.Get(1).(int), args.Error(2)
}

func (m *MockResponseRepository) Delete(ctx context.Context, id int64) error {
	args := m.Called(ctx, id)
	return args.Error(0)
}

func (m *MockResponseRepository) GetByTicketID(ctx context.Context, ticketID int64) ([]*models.Response, error) {
	args := m.Called(ctx, ticketID)
	return args.Get(0).([]*models.Response), args.Error(1)
}

func (m *MockResponseRepository) UpdateFileURL(ctx context.Context, id int64, fileURL string) error {
	args := m.Called(ctx, id, fileURL)
	return args.Error(0)
}

func (m *MockResponseRepository) UpdateMessage(ctx context.Context, id int64, message string) error {
	args := m.Called(ctx, id, message)
	return args.Error(0)
}

// Mock сервисы
type MockAntivirusService struct {
	mock.Mock
}

func (m *MockAntivirusService) ScanFile(ctx context.Context, file io.Reader) (bool, error) {
	args := m.Called(ctx, file)
	return args.Bool(0), args.Error(1)
}

func (m *MockAntivirusService) IsAvailable(ctx context.Context) bool {
	args := m.Called(ctx)
	return args.Bool(0)
}

func (m *MockAntivirusService) ScanFileFromPath(ctx context.Context, filepath string) (bool, error) {
	args := m.Called(ctx, filepath)
	return args.Bool(0), args.Error(1)
}

type MockFileService struct {
	mock.Mock
}

func (m *MockFileService) UploadFile(ctx context.Context, file io.Reader, folder string, id string) (string, error) {
	args := m.Called(ctx, file, folder, id)
	return args.String(0), args.Error(1)
}

func (m *MockFileService) DownloadFile(ctx context.Context, filepath string) (io.ReadCloser, error) {
	args := m.Called(ctx, filepath)
	if args.Get(0) == nil {
		return nil, args.Error(1)
	}
	return args.Get(0).(io.ReadCloser), args.Error(1)
}

func (m *MockFileService) DeleteFile(ctx context.Context, fileURL string) error {
	args := m.Called(ctx, fileURL)
	return args.Error(0)
}

func (m *MockFileService) GetFileURL(ctx context.Context, filepath string) (string, error) {
	args := m.Called(ctx, filepath)
	return args.String(0), args.Error(1)
}

func (m *MockFileService) CheckFileExists(ctx context.Context, filepath string) (bool, error) {
	args := m.Called(ctx, filepath)
	return args.Bool(0), args.Error(1)
}

// Тесты
func TestCreateTicket(t *testing.T) {
	tests := []struct {
		name          string
		ticket        *models.Ticket
		fileReader    io.Reader
		mockSetup     func(*MockTicketRepository, *MockTicketHistoryRepository, *MockAntivirusService, *MockFileService)
		expectedError error
	}{
		{
			name: "Успешное создание тикета без файла",
			ticket: &models.Ticket{
				UserID:    1,
				Subject:   "Test Subject",
				Question:  "Test Question",
				FullName:  "Test User",
				Email:     "test@example.com",
				Status:    models.TicketStatusNew,
				CreatedAt: time.Now(),
				UpdatedAt: time.Now(),
			},
			fileReader: nil,
			mockSetup: func(tr *MockTicketRepository, hr *MockTicketHistoryRepository, av *MockAntivirusService, fs *MockFileService) {
				tr.On("Create", mock.Anything, mock.Anything).Return(int64(1), nil)
				hr.On("Create", mock.Anything, mock.Anything).Return(int64(1), nil)
			},
			expectedError: nil,
		},
		{
			name: "Успешное создание тикета с файлом",
			ticket: &models.Ticket{
				UserID:    1,
				Subject:   "Test Subject",
				Question:  "Test Question",
				FullName:  "Test User",
				Email:     "test@example.com",
				FileName:  stringPtr("test.txt"),
				FileType:  stringPtr("text/plain"),
				Status:    models.TicketStatusNew,
				CreatedAt: time.Now(),
				UpdatedAt: time.Now(),
			},
			fileReader: bytes.NewReader([]byte("test content")),
			mockSetup: func(tr *MockTicketRepository, hr *MockTicketHistoryRepository, av *MockAntivirusService, fs *MockFileService) {
				av.On("ScanFile", mock.Anything, mock.Anything).Return(true, nil)
				fs.On("UploadFile", mock.Anything, mock.Anything, "tickets", "1").Return("http://example.com/file.txt", nil)
				tr.On("Create", mock.Anything, mock.Anything).Return(int64(1), nil)
				hr.On("Create", mock.Anything, mock.Anything).Return(int64(1), nil)
			},
			expectedError: nil,
		},
		{
			name: "Ошибка при отсутствии имени файла",
			ticket: &models.Ticket{
				UserID:    1,
				Subject:   "Test Subject",
				Question:  "Test Question",
				FullName:  "Test User",
				Email:     "test@example.com",
				FileType:  stringPtr("text/plain"),
				Status:    models.TicketStatusNew,
				CreatedAt: time.Now(),
				UpdatedAt: time.Now(),
			},
			fileReader:    bytes.NewReader([]byte("test content")),
			mockSetup:     func(tr *MockTicketRepository, hr *MockTicketHistoryRepository, av *MockAntivirusService, fs *MockFileService) {},
			expectedError: ErrFileRequired,
		},
		{
			name: "Ошибка при обнаружении вредоносного файла",
			ticket: &models.Ticket{
				UserID:    1,
				Subject:   "Test Subject",
				Question:  "Test Question",
				FullName:  "Test User",
				Email:     "test@example.com",
				FileName:  stringPtr("test.txt"),
				FileType:  stringPtr("text/plain"),
				Status:    models.TicketStatusNew,
				CreatedAt: time.Now(),
				UpdatedAt: time.Now(),
			},
			fileReader: bytes.NewReader([]byte("test content")),
			mockSetup: func(tr *MockTicketRepository, hr *MockTicketHistoryRepository, av *MockAntivirusService, fs *MockFileService) {
				av.On("ScanFile", mock.Anything, mock.Anything).Return(false, nil)
			},
			expectedError: ErrFileContainsMalware,
		},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			// Создаем моки
			mockTicketRepo := new(MockTicketRepository)
			mockHistoryRepo := new(MockTicketHistoryRepository)
			mockResponseRepo := new(MockResponseRepository)
			mockAntivirusService := new(MockAntivirusService)
			mockFileService := new(MockFileService)

			// Настраиваем моки
			tt.mockSetup(mockTicketRepo, mockHistoryRepo, mockAntivirusService, mockFileService)

			// Создаем сервис
			service := NewTicketService(
				mockTicketRepo,
				mockHistoryRepo,
				mockResponseRepo,
				mockAntivirusService,
				mockFileService,
			)

			// Выполняем тест
			err := service.CreateTicket(context.Background(), tt.ticket, tt.fileReader)

			// Проверяем результат
			if tt.expectedError != nil {
				assert.ErrorIs(t, err, tt.expectedError)
			} else {
				assert.NoError(t, err)
			}

			// Проверяем, что все ожидаемые вызовы были сделаны
			mockTicketRepo.AssertExpectations(t)
			mockHistoryRepo.AssertExpectations(t)
			mockAntivirusService.AssertExpectations(t)
			mockFileService.AssertExpectations(t)
		})
	}
}

func TestGetTicket(t *testing.T) {
	tests := []struct {
		name          string
		ticketID      int64
		mockSetup     func(*MockTicketRepository)
		expectedTicket *models.Ticket
		expectedError error
	}{
		{
			name:     "Успешное получение тикета",
			ticketID: 1,
			mockSetup: func(tr *MockTicketRepository) {
				tr.On("GetByID", mock.Anything, int64(1)).Return(&models.Ticket{
					ID:        1,
					UserID:    1,
					Subject:   "Test Subject",
					Question:  "Test Question",
					FullName:  "Test User",
					Email:     "test@example.com",
					Status:    models.TicketStatusNew,
					CreatedAt: time.Now(),
					UpdatedAt: time.Now(),
				}, nil)
			},
			expectedTicket: &models.Ticket{
				ID:        1,
				UserID:    1,
				Subject:   "Test Subject",
				Question:  "Test Question",
				FullName:  "Test User",
				Email:     "test@example.com",
				Status:    models.TicketStatusNew,
				CreatedAt: time.Now(),
				UpdatedAt: time.Now(),
			},
			expectedError: nil,
		},
		{
			name:     "Тикет не найден",
			ticketID: 999,
			mockSetup: func(tr *MockTicketRepository) {
				tr.On("GetByID", mock.Anything, int64(999)).Return(nil, errors.New("ticket not found"))
			},
			expectedTicket: nil,
			expectedError:  errors.New("failed to get ticket: ticket not found"),
		},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			// Создаем моки
			mockTicketRepo := new(MockTicketRepository)
			mockHistoryRepo := new(MockTicketHistoryRepository)
			mockResponseRepo := new(MockResponseRepository)
			mockAntivirusService := new(MockAntivirusService)
			mockFileService := new(MockFileService)

			// Настраиваем моки
			tt.mockSetup(mockTicketRepo)

			// Создаем сервис
			service := NewTicketService(
				mockTicketRepo,
				mockHistoryRepo,
				mockResponseRepo,
				mockAntivirusService,
				mockFileService, 
			)

			// Выполняем тест
			ticket, err := service.GetTicket(context.Background(), tt.ticketID)

			// Проверяем результат
			if tt.expectedError != nil {
				assert.Error(t, err)
				assert.EqualError(t, err, tt.expectedError.Error())
			} else {
				assert.NoError(t, err)
				assert.Equal(t, tt.expectedTicket.ID, ticket.ID)
				assert.Equal(t, tt.expectedTicket.UserID, ticket.UserID)
				assert.Equal(t, tt.expectedTicket.Subject, ticket.Subject)
				assert.Equal(t, tt.expectedTicket.Question, ticket.Question)
				assert.Equal(t, tt.expectedTicket.FullName, ticket.FullName)
				assert.Equal(t, tt.expectedTicket.Email, ticket.Email)
				assert.Equal(t, tt.expectedTicket.Status, ticket.Status)
			}

			// Проверяем, что все ожидаемые вызовы были сделаны
			mockTicketRepo.AssertExpectations(t)
		})
	}
}

// Вспомогательная функция для создания указателя на строку
func stringPtr(s string) *string {
	return &s
} 