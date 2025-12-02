import api from '@/utils/axiosInstance'

export const getVehicleTypeList = async () => {
  try {
    const response = await api.get('api/vehicle-type-list/')
    return response.data
  } catch (error) {
    console.error('Error fetching vehicle type list:', error.response?.data || error.message)
    throw error.response?.data || error
  }
}
