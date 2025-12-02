import api from '@/utils/axiosInstance'

export const updateYear = async (id, payload) => {
  try {
    const response = await api.put(`api/year-update/${id}/`, payload)
    return response.data
  } catch (error) {
    console.error('Error updating year:', error.response?.data || error)
    throw error.response?.data || error
  }
}
