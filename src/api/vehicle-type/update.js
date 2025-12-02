import api from '@/utils/axiosInstance'

export const updateVehicleType = async (id, vehicleTypeData) => {
  try {
    // CORRECT URL: /api/vehicle-type-update/7/   (not ?id=7)
    const response = await api.put(`api/vehicle-type-update/${id}/`, vehicleTypeData)
    return response.data
  } catch (error) {
    console.error('Error updating vehicle type:', error.response?.data || error.message)
    throw error.response?.data || error
  }
}
