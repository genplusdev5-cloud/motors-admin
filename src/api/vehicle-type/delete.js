import api from '@/utils/axiosInstance'

export const deleteVehicleType = async id => {
  try {
    const response = await api.put(`api/vehicle-type-delete/`, { id })
    return response.data
  } catch (error) {
    console.error('Error deleting vehicle type:', error.response?.data || error.message)
    throw error.response?.data || error
  }
}
