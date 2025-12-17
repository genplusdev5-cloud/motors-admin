import api from '@/utils/axiosInstance'

export const steeringAdd = formData => {
  return api.post('/api/steering-add/', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  })
}
