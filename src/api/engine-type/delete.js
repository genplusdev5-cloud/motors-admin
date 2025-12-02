import api from '@/utils/axiosInstance'

export const deleteEngineType = async id => {
  try {
    const response = await api.put('api/engine-type-delete/', { id })
    return response.data
  } catch (error) {
    console.error('Error deleting engine type:', error.response?.data || error)
    throw error.response?.data || error
  }
}
