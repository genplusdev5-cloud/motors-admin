// // src/utils/axiosInstance.js
// import axios from 'axios'

// const axiosInstance = axios.create({
//   baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://motor-match.genplusinnovations.com:7023/',
//   headers: { 'Content-Type': 'application/json' },
//   timeout: 20000 // ⏱️ 20s max - professional standard
// })

// // ✅ Attach access token automatically
// axiosInstance.interceptors.request.use(
//   config => {
//     if (typeof window !== 'undefined') {
//       const token = localStorage.getItem('accessToken')

//       if (token) config.headers.Authorization = `Bearer ${token}`
//     }

//     return config
//   },
//   error => Promise.reject(error)
// )

// // ✅ Handle responses & refresh logic
// axiosInstance.interceptors.response.use(
//   response => response,
//   async error => {
//     const originalRequest = error.config

//     // 🧠 Handle Token Expiry (401)
//     if (error.response?.status === 401 && !originalRequest._retry) {
//       originalRequest._retry = true

//       try {
//         const refreshToken = localStorage.getItem('refreshToken')

//         if (!refreshToken) throw new Error('No refresh token')

//         const res = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/auth/refresh-token/`, {
//           refresh: refreshToken
//         })

//         const newAccess = res.data?.access

//         if (newAccess) {
//           localStorage.setItem('accessToken', newAccess)
//           axiosInstance.defaults.headers.common['Authorization'] = `Bearer ${newAccess}`
//           originalRequest.headers['Authorization'] = `Bearer ${newAccess}`

//           return axiosInstance(originalRequest) // retry original request
//         }
//       } catch (err) {
//         // Refresh failed → logout
//         localStorage.clear()
//         if (typeof window !== 'undefined') window.location.href = '/en/login'
//       }
//     }

//     // ⏱️ Handle Timeout & Network Errors gracefully
//     if (error.code === 'ECONNABORTED' && error.message.includes('timeout')) {
//       console.warn('⚠️ API Timeout — exceeded 20s limit:', originalRequest.url)

//       return Promise.reject({
//         ...error,
//         userFriendlyMessage: '⏱️ Request timed out (20s). Please try again.'
//       })
//     }

//     if (error.message === 'Network Error') {
//       console.warn('🌐 Network Error — check your connection.')

//       return Promise.reject({
//         ...error,
//         userFriendlyMessage: '🌐 Network Error — please check your internet connection.'
//       })
//     }

//     // 🚨 Server errors
//     if (error.response?.status >= 500) {
//       console.warn(`🚨 Server Error (${error.response.status}):`, originalRequest.url)

//       return Promise.reject({
//         ...error,
//         userFriendlyMessage: '🚨 Server error. Please try again later.'
//       })
//     }

//     // Default fallback
//     return Promise.reject({
//       ...error,
//       userFriendlyMessage: 'Something went wrong. Please try again.'
//     })
//   }
// )

// export default axiosInstance

// src/utils/axiosInstance.js
import axios from 'axios'

const axiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://motor-match.genplusinnovations.com:7023/',
  headers: { 'Content-Type': 'application/json' },
  timeout: 20000 // ⏱️ 20s max
})

// ✅ Attach access token automatically
axiosInstance.interceptors.request.use(
  config => {
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('accessToken')

      if (token) config.headers.Authorization = `Bearer ${token}`
    }

    return config
  },
  error => Promise.reject(error)
)

// ✅ Handle responses & refresh logic
axiosInstance.interceptors.response.use(
  response => response,
  async error => {
    const originalRequest = error.config

    // 🧠 Handle Token Expiry (401)
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true

      try {
        const refreshToken = localStorage.getItem('refreshToken')

        if (!refreshToken) throw new Error('No refresh token')

        const res = await axios.post(
          `${process.env.NEXT_PUBLIC_API_URL || 'http://motor-match.genplusinnovations.com:7023/'}/auth/refresh-token/`,
          { refresh: refreshToken }
        )

        const newAccess = res.data?.access

        if (newAccess) {
          localStorage.setItem('accessToken', newAccess)
          axiosInstance.defaults.headers.common['Authorization'] = `Bearer ${newAccess}`
          originalRequest.headers['Authorization'] = `Bearer ${newAccess}`

          return axiosInstance(originalRequest) // retry request
        }
      } catch (err) {
        console.warn('🔒 Token refresh failed:', err)
        localStorage.clear()
        if (typeof window !== 'undefined') window.location.href = '/en/login'
      }
    }

    // ⏱️ Timeout
    if (error.code === 'ECONNABORTED' && error.message.includes('timeout')) {
      console.warn('⚠️ API Timeout — exceeded 20s limit:', originalRequest.url)

      return Promise.reject({
        ...error,
        userFriendlyMessage: '⏱️ Request timed out. Please try again.'
      })
    }

    // 🌐 Network error
    if (error.message === 'Network Error') {
      console.warn('🌐 Network Error — check your connection.')

      return Promise.reject({
        ...error,
        userFriendlyMessage: '🌐 Please check your internet connection.'
      })
    }

    // 🚨 Server error
    if (error.response?.status >= 500) {
      console.warn(`🚨 Server Error (${error.response.status}):`, originalRequest.url)

      return Promise.reject({
        ...error,
        userFriendlyMessage: '🚨 Server error. Please try again later.'
      })
    }

    return Promise.reject(error)
  }
)

export default axiosInstance
