import api from '@/utils/axiosInstance'

export const getMileageList = async () => {
  try {
    const response = await api.get('api/mileage-list/')
    return response.data
  } catch (error) {
    console.error('Error fetching mileage:', error)
    throw error.response?.data || error
  }
}
