import api from '@/utils/axiosInstance'

export const deleteVehicleModel = async id => {
  try {
    const res = await api.put('api/vehicle-model-delete/', { id })
    return res.data
  } catch (error) {
    console.error('ERROR DELETE VEHICLE MODEL:', error.response?.data || error)
    throw error.response?.data || error
  }
}
