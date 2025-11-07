// // // src/config/token.js

// // // ✅ Option 1: Hardcode (for development)
// // const ACCESS_TOKEN = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoiYWNjZXNzIiwiZXhwIjoxNzYyNDk2NDk1LCJpYXQiOjE3NjE4OTE2OTUsImp0aSI6IjE5OTFmZDQzM2ExNDRkODFhMjY3NzViNTlmMWQ2YTFmIiwidXNlcl9pZCI6MX0.0DIgCY39dTnMjcnYa7u42QLkYtBI4c28tasI7no2q8M'

// // export default ACCESS_TOKEN

// // // ✅ Option 2 (Recommended): Read from .env file
// // // export const ACCESS_TOKEN = process.env.NEXT_PUBLIC_ACCESS_TOKEN

// // src/config/apiConfig.js

// import axios from 'axios'

// // 🌍 BASE URL
// const BASE_URL = 'http://motor-match.genplusinnovations.com:7023/api/'

// // ===============================
// // 🔐 TOKEN HANDLERS
// // ===============================
// export const getAccessToken = () => sessionStorage.getItem('apiToken')
// export const getRefreshToken = () => sessionStorage.getItem('refreshToken')

// export const setTokens = (accessToken, refreshToken) => {
//   if (accessToken) sessionStorage.setItem('apiToken', accessToken)
//   if (refreshToken) sessionStorage.setItem('refreshToken', refreshToken)
// }

// export const clearTokens = () => {
//   sessionStorage.removeItem('apiToken')
//   sessionStorage.removeItem('refreshToken')
// }

// // ===============================
// // ⚙️ AXIOS INSTANCE
// // ===============================
// const axiosInstance = axios.create({
//   baseURL: BASE_URL,
//   headers: { 'Content-Type': 'application/json' }
// })

// // Add Authorization header automatically
// axiosInstance.interceptors.request.use(config => {
//   const token = getAccessToken()

//   if (token) config.headers.Authorization = `Bearer ${token}`

//   return config
// })

// // Auto refresh token on 401
// axiosInstance.interceptors.response.use(
//   response => response,
//   async error => {
//     const originalRequest = error.config

//     if (error.response?.status === 401 && !originalRequest._retry) {
//       originalRequest._retry = true

//       const refreshToken = getRefreshToken()

//       if (!refreshToken) {
//         console.warn('⚠️ No refresh token found, redirecting to login...')
//         clearTokens()
//         if (typeof window !== 'undefined') window.location.href = '/en/login'

//         return Promise.reject(error)
//       }

//       try {
//         const res = await axios.post(`${BASE_URL}token/refresh/`, { refresh: refreshToken })

//         const newAccess = res.data?.access
//         const newRefresh = res.data?.refresh || refreshToken

//         // Save new tokens
//         setTokens(newAccess, newRefresh)

//         // Update header and retry original request
//         originalRequest.headers.Authorization = `Bearer ${newAccess}`

//         return axiosInstance(originalRequest)
//       } catch (refreshError) {
//         console.error('Token refresh failed:', refreshError)
//         clearTokens()
//         if (typeof window !== 'undefined') window.location.href = '/en/login'

//         return Promise.reject(refreshError)
//       }
//     }

//     return Promise.reject(error)
//   }
// )

// export default axiosInstance
// export { BASE_URL }\



import axios from 'axios'

const BASE_URL = 'http://motor-match.genplusinnovations.com:7023/api'

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
