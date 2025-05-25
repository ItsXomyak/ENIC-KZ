import { useState } from 'react'
import { toast } from 'sonner'
import { Turnstile } from '@marsidev/react-turnstile'
import { api } from '@/lib/api'

type AskQuestionProps = {
  onQuestionAdded: () => void
}

export default function AskQuestion({ onQuestionAdded }: AskQuestionProps) {
  const [question, setQuestion] = useState('')
  const [files, setFiles] = useState<File[]>([])
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [turnstileToken, setTurnstileToken] = useState<string | null>(null)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = Array.from(e.target.files || [])
    setFiles(prevFiles => [...prevFiles, ...selectedFiles])
  }

  const removeFile = (index: number) => {
    setFiles(prevFiles => prevFiles.filter((_, i) => i !== index))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!question.trim()) {
      toast.error('Пожалуйста, введите ваш вопрос')
      return
    }

    if (!turnstileToken) {
      toast.error('Пожалуйста, подтвердите, что вы не робот')
      return
    }

    setIsSubmitting(true)
    try {
      // Создаем вопрос
      const questionData = await api.questions.create(question.trim())

      // Если есть файлы, загружаем их
      if (files.length > 0) {
        await api.upload.files(files, questionData.id, turnstileToken)
      }

      setQuestion('')
      setFiles([])
      setTurnstileToken(null)
      toast.success('Вопрос успешно отправлен')
      onQuestionAdded()
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Не удалось отправить вопрос')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 p-4 bg-white rounded-lg shadow">
      <div>
        <label htmlFor="question" className="block text-sm font-medium text-gray-700 mb-2">
          Задайте ваш вопрос
        </label>
        <textarea
          id="question"
          rows={4}
          className="w-full p-2 border rounded-md"
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          placeholder="Введите ваш вопрос здесь..."
          disabled={isSubmitting}
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Прикрепить файлы
        </label>
        <input
          type="file"
          onChange={handleFileChange}
          multiple
          className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
          accept=".jpg,.jpeg,.png,.gif,.pdf,.doc,.docx"
          disabled={isSubmitting}
        />
        <p className="mt-1 text-sm text-gray-500">
          Максимальный размер файла: 10MB. Разрешенные форматы: JPG, PNG, GIF, PDF, DOC, DOCX
        </p>
      </div>

      {files.length > 0 && (
        <div className="space-y-2">
          <p className="text-sm font-medium text-gray-700">Прикрепленные файлы:</p>
          {files.map((file, index) => (
            <div key={index} className="flex items-center justify-between bg-gray-50 p-2 rounded-md">
              <span className="text-sm text-gray-600">{file.name}</span>
              <button
                type="button"
                onClick={() => removeFile(index)}
                className="text-red-500 hover:text-red-700"
                disabled={isSubmitting}
              >
                Удалить
              </button>
            </div>
          ))}
        </div>
      )}

      <div className="flex justify-center">
        <Turnstile
          siteKey={process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY || ''}
          onSuccess={setTurnstileToken}
        />
      </div>

      <button
        type="submit"
        disabled={isSubmitting || !turnstileToken}
        className={`w-full px-4 py-2 text-white rounded-md ${
          isSubmitting || !turnstileToken
            ? 'bg-blue-400 cursor-not-allowed'
            : 'bg-blue-500 hover:bg-blue-600'
        }`}
      >
        {isSubmitting ? 'Отправка...' : 'Отправить вопрос'}
      </button>
    </form>
  )
} 