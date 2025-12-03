// src/utils/tokenUtils.js
const ACCESS_KEY = 'access_token'
const REFRESH_KEY = 'refresh_token'
const USER_KEY = 'user_data'

// Accept both call styles:
// saveTokens(access, refresh)
// saveTokens({ access, refresh, user })
export function saveTokens(arg1, arg2) {
  try {
    if (typeof window === 'undefined') return

    // support object-style call
    if (arg1 && typeof arg1 === 'object' && !arg2) {
      const { access, refresh, user } = arg1
      if (access) localStorage.setItem(ACCESS_KEY, access)
      if (refresh) localStorage.setItem(REFRESH_KEY, refresh)
      if (user) localStorage.setItem(USER_KEY, JSON.stringify(user))
      return
    }

    // support positional call (access, refresh)
    const access = arg1
    const refresh = arg2
    if (access) localStorage.setItem(ACCESS_KEY, access)
    if (refresh) localStorage.setItem(REFRESH_KEY, refresh)
  } catch (e) {
    // don't throw — just log
    // eslint-disable-next-line no-console
    console.error('saveTokens error', e)
  }
}

export function clearTokens() {
  try {
    if (typeof window === 'undefined') return
    localStorage.removeItem(ACCESS_KEY)
    localStorage.removeItem(REFRESH_KEY)
    localStorage.removeItem(USER_KEY)
    sessionStorage.removeItem('active')
  } catch (e) {
    // eslint-disable-next-line no-console
    console.error('clearTokens error', e)
  }
}

export function getAccessToken() {
  try {
    if (typeof window === 'undefined') return null
    return localStorage.getItem(ACCESS_KEY) || null
  } catch (e) {
    return null
  }
}

export function getRefreshToken() {
  try {
    if (typeof window === 'undefined') return null
    return localStorage.getItem(REFRESH_KEY) || null
  } catch (e) {
    return null
  }
}

export function getUser() {
  try {
    if (typeof window === 'undefined') return null
    const u = localStorage.getItem(USER_KEY)
    return u ? JSON.parse(u) : null
  } catch (e) {
    return null
  }
}

export function isAuthenticated() {
  try {
    if (typeof window === 'undefined') return false
    return !!localStorage.getItem(ACCESS_KEY)
  } catch (e) {
    return false
  }
}

const tokenUtils = {
  saveTokens,
  clearTokens,
  getAccessToken,
  getRefreshToken,
  getUser,
  isAuthenticated
}

export default tokenUtils

