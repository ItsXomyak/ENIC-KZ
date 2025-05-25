import { useState } from "react"
import { toast } from "sonner"

interface ApiOptions<T> {
  onSuccess?: (data: T) => void
  onError?: (error: Error) => void
}

export function useApi() {
  const [isLoading, setIsLoading] = useState(false)

  async function fetchApi<T>(
    url: string,
    options: RequestInit = {},
    apiOptions: ApiOptions<T> = {}
  ): Promise<T | null> {
    setIsLoading(true)
    try {
      const response = await fetch(url, {
        ...options,
        headers: {
          "Content-Type": "application/json",
          ...options.headers,
        },
      })

      if (!response.ok) {
        const error = await response.text()
        throw new Error(error)
      }

      const data = await response.json()
      apiOptions.onSuccess?.(data)
      return data
    } catch (error) {
      const message = error instanceof Error ? error.message : "Произошла ошибка"
      toast.error(message)
      apiOptions.onError?.(error as Error)
      return null
    } finally {
      setIsLoading(false)
    }
  }

  return {
    isLoading,
    get: <T>(url: string, options: ApiOptions<T> = {}) =>
      fetchApi<T>(url, { method: "GET" }, options),
    post: <T>(url: string, data: unknown, options: ApiOptions<T> = {}) =>
      fetchApi<T>(
        url,
        {
          method: "POST",
          body: JSON.stringify(data),
        },
        options
      ),
    put: <T>(url: string, data: unknown, options: ApiOptions<T> = {}) =>
      fetchApi<T>(
        url,
        {
          method: "PUT",
          body: JSON.stringify(data),
        },
        options
      ),
    delete: <T>(url: string, options: ApiOptions<T> = {}) =>
      fetchApi<T>(url, { method: "DELETE" }, options),
  }
} 