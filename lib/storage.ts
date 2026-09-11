import type { User } from '@/types'

const KEYS = {
  ACCESS_TOKEN: 'accessToken',
  REFRESH_TOKEN: 'refreshToken',
  USER: 'user',
} as const

export const storage = {
  saveTokens(accessToken: string, refreshToken: string) {
    localStorage.setItem(KEYS.ACCESS_TOKEN, accessToken)
    localStorage.setItem(KEYS.REFRESH_TOKEN, refreshToken)
  },
  getAccessToken(): string | null {
    return localStorage.getItem(KEYS.ACCESS_TOKEN)
  },
  getRefreshToken(): string | null {
    return localStorage.getItem(KEYS.REFRESH_TOKEN)
  },
  saveUser(user: User) {
    localStorage.setItem(KEYS.USER, JSON.stringify(user))
  },
  getUser(): User | null {
    const raw = localStorage.getItem(KEYS.USER)
    return raw ? (JSON.parse(raw) as User) : null
  },
  clear() {
    localStorage.removeItem(KEYS.ACCESS_TOKEN)
    localStorage.removeItem(KEYS.REFRESH_TOKEN)
    localStorage.removeItem(KEYS.USER)
  },
}
