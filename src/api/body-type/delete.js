import api from '@/utils/axiosInstance'

export const deleteBodyType = async id => {
  try {
    const response = await api.put('api/body-type-delete/', { id })
    return response.data
  } catch (error) {
    console.error('Error deleting body type:', error.response?.data || error)
    throw error.response?.data || error
  }
}
