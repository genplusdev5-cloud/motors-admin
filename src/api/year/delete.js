import api from '@/utils/axiosInstance'

export const deleteYear = async id => {
  try {
    const response = await api.put('api/year-delete/', { id })
    return response.data
  } catch (error) {
    console.error('Error deleting year:', error.response?.data || error)
    throw error.response?.data || error
  }
}
