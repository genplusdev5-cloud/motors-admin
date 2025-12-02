import api from '@/utils/axiosInstance'

export const getYearList = async () => {
  try {
    const response = await api.get('api/year-list/')
    return response.data
  } catch (error) {
    console.error('Error fetching year list:', error.response?.data || error)
    throw error.response?.data || error
  }
}
