import api from '@/utils/axiosInstance'

export const steeringList = () => {
  return api.get('/api/steering-list/')
}
