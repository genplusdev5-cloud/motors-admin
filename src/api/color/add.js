import api from '@/utils/axiosInstance'

export const addColor = async (colorData) => {
  const response = await api.post('api/color-add/', colorData)
  if (response.data.status === 'success') {
    return response.data
  }
  throw new Error(response.data.message || 'Failed to add color')
}
