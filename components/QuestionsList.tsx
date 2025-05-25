import { useState, useEffect } from 'react'
import { useUser } from '@clerk/nextjs'
import { toast } from 'sonner'
import Image from 'next/image'
import { api } from '@/lib/api'

type File = {
  id: string
  filename: string
  url: string
  mimetype: string
  size: number
  scanStatus: 'PENDING' | 'CLEAN' | 'INFECTED' | 'ERROR'
  scanResult: string | null
}

type Question = {
  id: string
  question: string
  answer: string | null
  status: 'PENDING' | 'ANSWERED'
  user: {
    email: string
  }
  files: File[]
}

export default function QuestionsList() {
  const { user } = useUser()
  const [questions, setQuestions] = useState<Question[]>([])
  const [loading, setLoading] = useState(true)
  const [answerText, setAnswerText] = useState<string>('')
  const [selectedQuestion, setSelectedQuestion] = useState<string | null>(null)

  useEffect(() => {
    fetchQuestions()
  }, [])

  const fetchQuestions = async () => {
    try {
      const data = await api.questions.list()
      setQuestions(data)
    } catch (error) {
      toast.error('Не удалось загрузить вопросы')
    } finally {
      setLoading(false)
    }
  }

  const handleAnswer = async (questionId: string) => {
    try {
      const updatedQuestion = await api.questions.answer(questionId, answerText)
      setQuestions(questions.map(q => 
        q.id === questionId ? updatedQuestion : q
      ))
      setAnswerText('')
      setSelectedQuestion(null)
      toast.success('Ответ успешно отправлен')
    } catch (error) {
      toast.error('Не удалось отправить ответ')
    }
  }

  const renderFilePreview = (file: File) => {
    const isImage = file.mimetype.startsWith('image/')
    const isPdf = file.mimetype === 'application/pdf'
    const isDoc = file.mimetype.includes('word')

    return (
      <div key={file.id} className="flex items-center space-x-2 bg-gray-50 p-2 rounded-md">
        {isImage && (
          <div className="relative w-10 h-10">
            <Image
              src={file.url}
              alt={file.filename}
              fill
              className="object-cover rounded"
            />
          </div>
        )}
        {isPdf && (
          <svg className="w-6 h-6 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
          </svg>
        )}
        {isDoc && (
          <svg className="w-6 h-6 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
          </svg>
        )}
        <div className="flex-1">
          <p className="text-sm font-medium text-gray-700">{file.filename}</p>
          <p className="text-xs text-gray-500">
            {(file.size / 1024).toFixed(1)} KB
          </p>
        </div>
        <a
          href={file.url}
          download={file.filename}
          className="text-blue-500 hover:text-blue-700 text-sm"
          target="_blank"
          rel="noopener noreferrer"
        >
          Скачать
        </a>
      </div>
    )
  }

  if (loading) {
    return <div className="flex justify-center p-8">Загрузка...</div>
  }

  return (
    <div className="space-y-6 p-4">
      {questions.length === 0 ? (
        <div className="text-center text-gray-500">Вопросов пока нет</div>
      ) : (
        questions.map((question) => (
          <div key={question.id} className="bg-white rounded-lg shadow p-6 space-y-4">
            <div className="flex justify-between items-start">
              <div>
                <p className="font-medium">Вопрос:</p>
                <p className="text-gray-700">{question.question}</p>
                <p className="text-sm text-gray-500 mt-1">От: {question.user.email}</p>
              </div>
              <span className={`px-3 py-1 rounded-full text-sm ${
                question.status === 'ANSWERED' 
                  ? 'bg-green-100 text-green-800' 
                  : 'bg-yellow-100 text-yellow-800'
              }`}>
                {question.status === 'ANSWERED' ? 'Отвечен' : 'Ожидает ответа'}
              </span>
            </div>

            {question.files.length > 0 && (
              <div className="mt-4 space-y-2">
                <p className="font-medium">Прикрепленные файлы:</p>
                <div className="space-y-2">
                  {question.files.map(file => renderFilePreview(file))}
                </div>
              </div>
            )}

            {question.answer && (
              <div className="mt-4">
                <p className="font-medium">Ответ:</p>
                <p className="text-gray-700">{question.answer}</p>
              </div>
            )}

            {user?.publicMetadata?.role !== 'USER' && 
             question.status === 'PENDING' && (
              <div className="mt-4">
                {selectedQuestion === question.id ? (
                  <div className="space-y-3">
                    <textarea
                      className="w-full p-2 border rounded-md"
                      rows={3}
                      value={answerText}
                      onChange={(e) => setAnswerText(e.target.value)}
                      placeholder="Введите ваш ответ..."
                    />
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleAnswer(question.id)}
                        className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
                      >
                        Отправить ответ
                      </button>
                      <button
                        onClick={() => {
                          setSelectedQuestion(null)
                          setAnswerText('')
                        }}
                        className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300"
                      >
                        Отмена
                      </button>
                    </div>
                  </div>
                ) : (
                  <button
                    onClick={() => setSelectedQuestion(question.id)}
                    className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
                  >
                    Ответить
                  </button>
                )}
              </div>
            )}
          </div>
        ))
      )}
    </div>
  )
} 