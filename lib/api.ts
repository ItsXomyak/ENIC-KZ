const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'

export const api = {
  questions: {
    me: async () => {
      const response = await fetch(`${API_URL}/api/questions/me`, {
        credentials: 'include'
      })
      if (!response.ok) throw new Error('Failed to fetch user info')
      return response.json()
    },

    list: async () => {
      const response = await fetch(`${API_URL}/api/questions`, {
        credentials: 'include'
      })
      if (!response.ok) throw new Error('Failed to fetch questions')
      return response.json()
    },

    create: async (question: string) => {
      const response = await fetch(`${API_URL}/api/questions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        credentials: 'include',
        body: JSON.stringify({ question })
      })
      if (!response.ok) throw new Error('Failed to create question')
      return response.json()
    },

    answer: async (id: string, answer: string) => {
      const response = await fetch(`${API_URL}/api/questions/${id}/answer`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        credentials: 'include',
        body: JSON.stringify({ answer })
      })
      if (!response.ok) throw new Error('Failed to answer question')
      return response.json()
    }
  },

  upload: {
    files: async (files: File[], questionId: string, turnstileToken: string) => {
      const formData = new FormData()
      files.forEach(file => formData.append('files', file))
      formData.append('questionId', questionId)
      formData.append('cf-turnstile-response', turnstileToken)

      const response = await fetch(`${API_URL}/api/upload`, {
        method: 'POST',
        credentials: 'include',
        body: formData
      })
      
      if (!response.ok) {
        const error = await response.text()
        throw new Error(error)
      }
      
      return response.json()
    }
  }
} 