// src/utils/axiosInstance.js
'use client'

import axios from 'axios'
import { clearTokens, getAccessToken } from './tokenUtils'

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  timeout: 30000
})

// Attach token before every request
api.interceptors.request.use(
  config => {
    if (typeof window !== 'undefined') {
      const token = getAccessToken()
      if (token) {
        config.headers.Authorization = `Bearer ${token}`
      }
    }
    return config
  },
  error => Promise.reject(error)
)

// Handle 401 globally
api.interceptors.response.use(
  response => response,
  error => {
    if (typeof window !== 'undefined') {
      const status = error?.response?.status

      if (status === 401) {
        // Token invalid / expired → clear & send to login
        clearTokens()
        if (!window.location.pathname.includes('/login')) {
          window.location.href = '/en/login'
        }
      }
    }

    return Promise.reject(error)
  }
)

export default api
