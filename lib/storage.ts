import type { User } from '@/types'

function getCookie(name: string): string | null {
  if (typeof document === 'undefined') return null
  const match = document.cookie.match(new RegExp(`(?:^|;\\s*)${name}=([^;]*)`))
  return match ? decodeURIComponent(match[1]) : null
}

const USER_KEY = 'user'

export const storage = {
  getAccessToken(): string | null {
    return getCookie('access_token')
  },
  saveUser(user: User) {
    localStorage.setItem(USER_KEY, JSON.stringify(user))
  },
  getUser(): User | null {
    if (typeof localStorage === 'undefined') return null
    const raw = localStorage.getItem(USER_KEY)
    return raw ? (JSON.parse(raw) as User) : null
  },
  clear() {
    localStorage.removeItem(USER_KEY)
  },
}
