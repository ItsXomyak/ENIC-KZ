"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect } from "react"

type User = {
  id: string
  name: string
  email: string
  role: "user" | "moderator" | "admin"
} | null

type AuthContextType = {
  user: User
  login: (email: string, password: string) => Promise<boolean>
  logout: () => void
  register: (name: string, email: string, password: string) => Promise<boolean>
  isLoading: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User>(null)
  const [isLoading, setIsLoading] = useState(true)

  // Check if user is logged in on initial load
  useEffect(() => {
    const storedUser = localStorage.getItem("user")
    if (storedUser) {
      setUser(JSON.parse(storedUser))
    }
    setIsLoading(false)
  }, [])

  // Mock login function
  const login = async (email: string, password: string): Promise<boolean> => {
    setIsLoading(true)

    // Simulate API call
    return new Promise((resolve) => {
      setTimeout(() => {
        // Mock validation - in a real app, this would be a server call
        if (email === "admin@example.com" && password === "password") {
          const userData = {
            id: "1",
            name: "Admin User",
            email: "admin@example.com",
            role: "admin" as const,
          }
          setUser(userData)
          localStorage.setItem("user", JSON.stringify(userData))
          setIsLoading(false)
          resolve(true)
        } else if (email === "moderator@example.com" && password === "password") {
          const userData = {
            id: "2",
            name: "Moderator User",
            email: "moderator@example.com",
            role: "moderator" as const,
          }
          setUser(userData)
          localStorage.setItem("user", JSON.stringify(userData))
          setIsLoading(false)
          resolve(true)
        } else if (email && password) {
          // Any non-empty email/password combination works for regular users
          const userData = {
            id: "3",
            name: "Regular User",
            email,
            role: "user" as const,
          }
          setUser(userData)
          localStorage.setItem("user", JSON.stringify(userData))
          setIsLoading(false)
          resolve(true)
        } else {
          setIsLoading(false)
          resolve(false)
        }
      }, 1000) // Simulate network delay
    })
  }

  // Mock register function
  const register = async (name: string, email: string, password: string): Promise<boolean> => {
    setIsLoading(true)

    // Simulate API call
    return new Promise((resolve) => {
      setTimeout(() => {
        // In a real app, this would validate and create a user on the server
        if (name && email && password) {
          const userData = {
            id: Math.random().toString(36).substr(2, 9),
            name,
            email,
            role: "user" as const,
          }
          setUser(userData)
          localStorage.setItem("user", JSON.stringify(userData))
          setIsLoading(false)
          resolve(true)
        } else {
          setIsLoading(false)
          resolve(false)
        }
      }, 1000) // Simulate network delay
    })
  }

  // Logout function
  const logout = () => {
    setUser(null)
    localStorage.removeItem("user")
  }

  return <AuthContext.Provider value={{ user, login, logout, register, isLoading }}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
