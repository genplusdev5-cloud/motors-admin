// src/utils/tokenUtils.js

export const saveTokens = (access, refresh) => {
  if (typeof window === 'undefined') return
  if (access) localStorage.setItem('access_token', access)
  if (refresh) localStorage.setItem('refresh_token', refresh)
}

export const clearTokens = () => {
  if (typeof window === 'undefined') return
  localStorage.removeItem('access_token')
  localStorage.removeItem('refresh_token')
  sessionStorage.removeItem('active')
}

export const getAccessToken = () => {
  if (typeof window === 'undefined') return null
  return localStorage.getItem('access_token')
}

export const getRefreshToken = () => {
  if (typeof window === 'undefined') return null
  return localStorage.getItem('refresh_token')
}

export const isAuthenticated = () => {
  if (typeof window === 'undefined') return false
  return !!localStorage.getItem('access_token')
}
