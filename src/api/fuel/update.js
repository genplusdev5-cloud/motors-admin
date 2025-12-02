import api from '@/utils/axiosInstance'

export const updateFuel = async (id, payload) => {
  try {
    const response = await api.put(`api/fuel-update/${id}/`, payload)
    return response.data
  } catch (error) {
    console.error('Error updating fuel type:', error.response?.data || error)
    throw error.response?.data || error
  }
}
