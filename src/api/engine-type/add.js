import api from '@/utils/axiosInstance'

export const addEngineType = async (data) => {
  try {
    const response = await api.post('api/engine-type-add/', data)
    return response.data
  } catch (error) {
    console.error('Error adding engine type:', error.response?.data || error)
    throw error.response?.data || error
  }
}
