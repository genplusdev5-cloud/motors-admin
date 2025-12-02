import api from '@/utils/axiosInstance'

export const addMileage = async data => {
  try {
    const response = await api.post('api/mileage-add/', data)
    return response.data
  } catch (error) {
    console.error('Error adding mileage:', error)
    throw error.response?.data || error
  }
}
