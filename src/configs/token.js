



import axios from 'axios'

const BASE_URL = 'http://motor-match.genplusinnovations.com:7023/'

// ===============================
// 🔐 TOKEN HELPERS
// ===============================
export const getAccessToken = () => sessionStorage.getItem('apiToken')
export const getRefreshToken = () => sessionStorage.getItem('refreshToken')

export const setTokens = (accessToken, refreshToken) => {
  if (accessToken) sessionStorage.setItem('apiToken', accessToken)
  if (refreshToken) sessionStorage.setItem('refreshToken', refreshToken)

  // ✅ Automatically update axios header
  axiosInstance.defaults.headers.common['Authorization'] = `Bearer ${accessToken}`
}

export const clearTokens = () => {
  sessionStorage.removeItem('apiToken')
  sessionStorage.removeItem('refreshToken')
  delete axiosInstance.defaults.headers.common['Authorization']
}

// ===============================
// ⚙️ AXIOS INSTANCE
// ===============================
const axiosInstance = axios.create({
  baseURL: BASE_URL,
  headers: { 'Content-Type': 'application/json' }
})

// ✅ Add token automatically before each request
axiosInstance.interceptors.request.use(config => {
  const token = getAccessToken()

  if (token) config.headers.Authorization = `Bearer ${token}`

  return config
})

// ✅ Auto refresh token on 401
axiosInstance.interceptors.response.use(
  response => response,
  async error => {
    const originalRequest = error.config

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true
      const refreshToken = getRefreshToken()

      if (!refreshToken) {
        clearTokens()
        if (typeof window !== 'undefined') window.location.href = '/en/login'

        return Promise.reject(error)
      }

      try {
        const res = await axios.post(`${BASE_URL}token/refresh/`, { refresh: refreshToken })
        const newAccess = res.data?.access
        const newRefresh = res.data?.refresh || refreshToken

        setTokens(newAccess, newRefresh)

        originalRequest.headers.Authorization = `Bearer ${newAccess}`

        return axiosInstance(originalRequest)
      } catch (refreshError) {
        clearTokens()
        if (typeof window !== 'undefined') window.location.href = '/en/login'

        return Promise.reject(refreshError)
      }
    }

    return Promise.reject(error)
  }
)

export default axiosInstance
export { BASE_URL }
