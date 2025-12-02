import api from '@/utils/axiosInstance'

export const addVehicleType = async vehicleTypeData => {
  try {
    const response = await api.post('api/vehicle-type-add/', vehicleTypeData)
    return response.data
  } catch (error) {
    console.error('Error adding vehicle type:', error.response?.data || error.message)
    throw error.response?.data || error
  }
}
