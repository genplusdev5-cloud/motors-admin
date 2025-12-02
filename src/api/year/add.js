import api from '@/utils/axiosInstance'

export const addYear = async payload => {
  try {
    const response = await api.post('api/year-add/', payload)
    return response.data
  } catch (error) {
    console.error('Error adding year:', error.response?.data || error)
    throw error.response?.data || error
  }
}
