import api from '@/utils/axiosInstance'

export const getColor = async () => {
  const response = await api.get('api/color-list/')
  if (response.data.status === 'success') {
    return response.data.data
  }
  throw new Error(response.data.message || 'Failed to fetch colors')
}
