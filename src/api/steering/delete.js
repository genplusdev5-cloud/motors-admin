import api from '@/utils/axiosInstance'

export const steeringDelete = id => {
  const payload = { id: id }   // 🔥 sending ID in body
  return api.put('/api/steering-delete/', payload)
}
