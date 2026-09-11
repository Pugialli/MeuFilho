'use client'

import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react'
import { useRouter } from 'next/navigation'
import { api, setAuthFailureHandler } from '@/lib/api'
import { storage } from '@/lib/storage'
import type { User, Role } from '@/types'

interface AuthContextValue {
  user: User | null
  loading: boolean
  login: (email: string, password: string) => Promise<void>
  signup: (payload: { name: string; email: string; password: string; role: Role }) => Promise<void>
  logout: () => void
}

const AuthContext = createContext<AuthContextValue | null>(null)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  const logout = useCallback(() => {
    storage.clear()
    setUser(null)
    router.replace('/login')
  }, [router])

  useEffect(() => {
    setAuthFailureHandler(logout)
  }, [logout])

  useEffect(() => {
    const u = storage.getUser()
    setUser(u)
    setLoading(false)
  }, [])

  const login = useCallback(async (email: string, password: string) => {
    const { data } = await api.post('/auth/login', { email, password })
    const result = data.data as { accessToken: string; refreshToken: string; user: User }
    storage.saveTokens(result.accessToken, result.refreshToken)
    storage.saveUser(result.user)
    setUser(result.user)
  }, [])

  const signup = useCallback(
    async (payload: { name: string; email: string; password: string; role: Role }) => {
      const { data } = await api.post('/auth/signup', payload)
      const result = data.data as { accessToken: string; refreshToken: string; user: User }
      storage.saveTokens(result.accessToken, result.refreshToken)
      storage.saveUser(result.user)
      setUser(result.user)
    },
    []
  )

  return (
    <AuthContext.Provider value={{ user, loading, login, signup, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
