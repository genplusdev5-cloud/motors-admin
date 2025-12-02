// src/api/admin/login.js
import api from '@/utils/axiosInstance'

// Backend: POST https://motor-match.genplusinnovations.com/api/admin/login/
export const adminLoginApi = async payload => {
  const res = await api.post('api/admin/login/', payload, {
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    }
  })

  return res.data // { status, message, data: { ...user, access, refresh } }
}
