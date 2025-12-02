import api from '@/utils/axiosInstance'

export const updateEngineType = async (id, data) => {
  try {
    const response = await api.put(`api/engine-type-update/${id}/`, data)
    return response.data
  } catch (error) {
    console.error('Error updating engine type:', error.response?.data || error)
    throw error.response?.data || error
  }
}
